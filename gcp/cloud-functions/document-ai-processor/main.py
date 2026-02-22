"""
MedFocus PhD - Document AI Pipeline for Medical Guidelines
Execução: On-demand (triggered por upload de PDF)
Objetivo: Extrair estrutura e conteúdo de diretrizes médicas em PDF
"""

import os
import json
import re
from datetime import datetime
from typing import Dict, Any, List, Optional
from google.cloud import documentai_v1 as documentai
from google.cloud import storage
from google.cloud import bigquery
from google.cloud import firestore

# Configurações
GCP_PROJECT_ID = os.environ.get('GCP_PROJECT_ID')
GCP_LOCATION = os.environ.get('DOCUMENT_AI_LOCATION', 'us')
PROCESSOR_ID = os.environ.get('DOCUMENT_AI_PROCESSOR_ID')
BUCKET_NAME = os.environ.get('GCS_BUCKET_NAME')
BQ_DATASET = "medfocus_raw_data"
BQ_TABLE = "parsed_guidelines"

class DocumentAIProcessor:
    def __init__(self):
        self.docai_client = documentai.DocumentProcessorServiceClient()
        self.storage_client = storage.Client()
        self.bq_client = bigquery.Client()
        self.firestore_client = firestore.Client()
        
        self.processor_name = self.docai_client.processor_path(
            GCP_PROJECT_ID, GCP_LOCATION, PROCESSOR_ID
        )
    
    def process_pdf(self, gcs_uri: str, guideline_metadata: Dict[str, Any]) -> Dict[str, Any]:
        """
        Processa PDF de diretriz usando Document AI
        """
        print(f"Processing PDF: {gcs_uri}")
        
        # Extrair conteúdo do GCS
        bucket_name, blob_name = self._parse_gcs_uri(gcs_uri)
        bucket = self.storage_client.bucket(bucket_name)
        blob = bucket.blob(blob_name)
        pdf_content = blob.download_as_bytes()
        
        # Configurar requisição para Document AI
        raw_document = documentai.RawDocument(
            content=pdf_content,
            mime_type='application/pdf'
        )
        
        request = documentai.ProcessRequest(
            name=self.processor_name,
            raw_document=raw_document
        )
        
        try:
            # Processar documento
            result = self.docai_client.process_document(request=request)
            document = result.document
            
            print(f"Document processed. Pages: {len(document.pages)}")
            
            # Extrair informações estruturadas
            parsed_data = {
                'guideline_id': guideline_metadata.get('id'),
                'title': guideline_metadata.get('title'),
                'society': guideline_metadata.get('society'),
                'year': guideline_metadata.get('year'),
                'gcs_uri': gcs_uri,
                'text_content': document.text,
                'pages': len(document.pages),
                'sections': self._extract_sections(document),
                'tables': self._extract_tables(document),
                'recommendations': self._extract_recommendations(document),
                'drug_mentions': self._extract_drug_mentions(document),
                'references': self._extract_references(document),
                'processed_at': datetime.now().isoformat(),
                'status': 'pending_validation'
            }
            
            return parsed_data
            
        except Exception as e:
            print(f"Error processing document: {e}")
            return {
                'status': 'error',
                'error_message': str(e),
                'gcs_uri': gcs_uri
            }
    
    def _extract_sections(self, document: documentai.Document) -> List[Dict[str, Any]]:
        """
        Extrai seções da diretriz (Introdução, Metodologia, Recomendações, etc.)
        """
        sections = []
        
        # Padrões comuns de títulos de seções
        section_patterns = [
            r'^(\d+\.?\s*)?introdu[çc][aã]o',
            r'^(\d+\.?\s*)?metodologia',
            r'^(\d+\.?\s*)?recomenda[çc][õo]es',
            r'^(\d+\.?\s*)?tratamento',
            r'^(\d+\.?\s*)?diagn[óo]stico',
            r'^(\d+\.?\s*)?conclus[aã]o',
            r'^(\d+\.?\s*)?refer[êe]ncias',
        ]
        
        text = document.text
        lines = text.split('\n')
        
        current_section = None
        current_content = []
        
        for line in lines:
            line_lower = line.lower().strip()
            
            # Verificar se é um título de seção
            is_section_title = any(re.match(pattern, line_lower) for pattern in section_patterns)
            
            if is_section_title:
                # Salvar seção anterior
                if current_section:
                    sections.append({
                        'title': current_section,
                        'content': '\n'.join(current_content),
                        'length': len(current_content)
                    })
                
                # Iniciar nova seção
                current_section = line.strip()
                current_content = []
            else:
                if current_section:
                    current_content.append(line)
        
        # Adicionar última seção
        if current_section:
            sections.append({
                'title': current_section,
                'content': '\n'.join(current_content),
                'length': len(current_content)
            })
        
        return sections
    
    def _extract_tables(self, document: documentai.Document) -> List[Dict[str, Any]]:
        """
        Extrai tabelas do documento (doses, protocolos, etc.)
        """
        tables = []
        
        for page in document.pages:
            for table in page.tables:
                table_data = {
                    'page': page.page_number,
                    'rows': len(table.body_rows),
                    'columns': len(table.header_rows[0].cells) if table.header_rows else 0,
                    'headers': [],
                    'data': []
                }
                
                # Extrair cabeçalhos
                if table.header_rows:
                    for cell in table.header_rows[0].cells:
                        header_text = self._get_text_from_layout(cell.layout, document.text)
                        table_data['headers'].append(header_text)
                
                # Extrair linhas
                for row in table.body_rows:
                    row_data = []
                    for cell in row.cells:
                        cell_text = self._get_text_from_layout(cell.layout, document.text)
                        row_data.append(cell_text)
                    table_data['data'].append(row_data)
                
                tables.append(table_data)
        
        return tables
    
    def _extract_recommendations(self, document: documentai.Document) -> List[Dict[str, Any]]:
        """
        Extrai recomendações classificadas (Classe I, IIa, IIb, III)
        """
        recommendations = []
        
        text = document.text
        lines = text.split('\n')
        
        # Padrões de classificação
        class_pattern = r'classe?\s*([I]{1,3}[ab]?)'
        evidence_pattern = r'n[íi]vel\s*(de\s*)?evid[êe]ncia\s*([ABC])'
        
        for i, line in enumerate(lines):
            line_lower = line.lower()
            
            # Buscar classificação de recomendação
            class_match = re.search(class_pattern, line_lower)
            evidence_match = re.search(evidence_pattern, line_lower)
            
            if class_match or evidence_match:
                recommendation = {
                    'text': line.strip(),
                    'class': class_match.group(1).upper() if class_match else None,
                    'evidence_level': evidence_match.group(2).upper() if evidence_match else None,
                    'context': '\n'.join(lines[max(0, i-2):min(len(lines), i+3)])
                }
                recommendations.append(recommendation)
        
        return recommendations
    
    def _extract_drug_mentions(self, document: documentai.Document) -> List[Dict[str, str]]:
        """
        Extrai menções a medicamentos no texto
        """
        # Lista expandida de medicamentos comuns
        drug_patterns = [
            r'\b(dipirona|paracetamol|ibuprofeno|aspirina|ácido acetilsalicílico)\b',
            r'\b(amoxicilina|azitromicina|cefalexina|levofloxacino)\b',
            r'\b(losartana|atenolol|captopril|enalapril|propranolol)\b',
            r'\b(metformina|insulina|glibenclamida|dapagliflozina)\b',
            r'\b(omeprazol|pantoprazol|ranitidina)\b',
            # Adicionar mais conforme necessário
        ]
        
        text = document.text.lower()
        drug_mentions = []
        
        for pattern in drug_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                drug_mentions.append({
                    'drug': match.group(0),
                    'position': match.start()
                })
        
        # Remover duplicatas
        unique_drugs = {}
        for mention in drug_mentions:
            drug = mention['drug'].lower()
            if drug not in unique_drugs:
                unique_drugs[drug] = mention
        
        return list(unique_drugs.values())
    
    def _extract_references(self, document: documentai.Document) -> List[str]:
        """
        Extrai referências bibliográficas
        """
        text = document.text
        
        # Encontrar seção de referências
        ref_section_match = re.search(
            r'refer[êe]ncias\s*bibliogr[áa]ficas?',
            text,
            re.IGNORECASE
        )
        
        if not ref_section_match:
            return []
        
        # Extrair texto após "Referências"
        ref_text = text[ref_section_match.end():]
        
        # Split por número de referência (1., 2., etc.)
        references = re.split(r'\n\s*\d+\.\s+', ref_text)
        
        # Limpar e filtrar
        cleaned_refs = [ref.strip() for ref in references if ref.strip()]
        
        return cleaned_refs[:100]  # Limitar a 100 refs
    
    def _get_text_from_layout(self, layout: documentai.Document.Page.Layout, text: str) -> str:
        """
        Extrai texto de um layout específico
        """
        if not layout or not layout.text_anchor:
            return ""
        
        response = ""
        for segment in layout.text_anchor.text_segments:
            start_index = int(segment.start_index) if segment.start_index else 0
            end_index = int(segment.end_index) if segment.end_index else 0
            response += text[start_index:end_index]
        
        return response.strip()
    
    def _parse_gcs_uri(self, gcs_uri: str) -> tuple:
        """
        Parse GCS URI (gs://bucket/path) para bucket e blob name
        """
        parts = gcs_uri.replace('gs://', '').split('/', 1)
        return parts[0], parts[1] if len(parts) > 1 else ''
    
    def save_to_bigquery(self, parsed_data: Dict[str, Any]):
        """
        Salva dados parseados no BigQuery
        """
        table_id = f"{GCP_PROJECT_ID}.{BQ_DATASET}.{BQ_TABLE}"
        
        try:
            errors = self.bq_client.insert_rows_json(table_id, [parsed_data])
            if errors:
                print(f"Errors inserting rows: {errors}")
            else:
                print(f"Successfully saved parsed guideline to BigQuery")
                
        except Exception as e:
            print(f"Error saving to BigQuery: {e}")
    
    def create_validation_task(self, parsed_data: Dict[str, Any]):
        """
        Cria tarefa de validação para PhD reviewer
        """
        doc_ref = self.firestore_client.collection('validation_queue').document()
        
        validation_task = {
            'guideline_id': parsed_data.get('guideline_id'),
            'title': parsed_data.get('title'),
            'society': parsed_data.get('society'),
            'year': parsed_data.get('year'),
            'status': 'pending',
            'priority': self._calculate_priority(parsed_data),
            'created_at': firestore.SERVER_TIMESTAMP,
            'assigned_to': None,
            'data': parsed_data
        }
        
        doc_ref.set(validation_task)
        print(f"Created validation task: {doc_ref.id}")
        
        return doc_ref.id
    
    def _calculate_priority(self, parsed_data: Dict[str, Any]) -> str:
        """
        Calcula prioridade da validação baseado em metadados
        """
        year = parsed_data.get('year', 0)
        society = parsed_data.get('society', '').upper()
        
        # Diretrizes recentes de sociedades importantes = alta prioridade
        important_societies = ['SBC', 'SBPT', 'SBD', 'SBN', 'SBEM']
        
        if year >= datetime.now().year and society in important_societies:
            return 'HIGH'
        elif year >= datetime.now().year - 2:
            return 'MEDIUM'
        else:
            return 'LOW'


def document_ai_handler(event, context):
    """
    Cloud Function entry point
    Triggered by GCS file upload (PDF)
    """
    file_data = event
    gcs_uri = f"gs://{file_data['bucket']}/{file_data['name']}"
    
    print(f"Processing new guideline PDF: {gcs_uri}")
    
    # Extrair metadados do nome do arquivo
    # Formato esperado: SOCIEDADE_TITULO_ANO.pdf
    filename = file_data['name'].split('/')[-1].replace('.pdf', '')
    parts = filename.split('_')
    
    guideline_metadata = {
        'id': filename,
        'society': parts[0] if len(parts) > 0 else 'UNKNOWN',
        'title': ' '.join(parts[1:-1]) if len(parts) > 2 else filename,
        'year': int(parts[-1]) if len(parts) > 0 and parts[-1].isdigit() else datetime.now().year
    }
    
    try:
        processor = DocumentAIProcessor()
        
        # Processar PDF
        parsed_data = processor.process_pdf(gcs_uri, guideline_metadata)
        
        if parsed_data.get('status') != 'error':
            # Salvar no BigQuery
            processor.save_to_bigquery(parsed_data)
            
            # Criar tarefa de validação
            task_id = processor.create_validation_task(parsed_data)
            
            return {
                'status': 'success',
                'guideline_id': parsed_data.get('guideline_id'),
                'validation_task_id': task_id
            }
        else:
            return {'status': 'error', 'message': parsed_data.get('error_message')}
            
    except Exception as e:
        error_msg = f"Error processing guideline: {str(e)}"
        print(error_msg)
        return {'status': 'error', 'message': error_msg}


# Para execução local/teste
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python main.py <gcs_uri>")
        sys.exit(1)
    
    gcs_uri = sys.argv[1]
    
    guideline_metadata = {
        'id': 'test_guideline',
        'society': 'SBC',
        'title': 'Diretriz Teste',
        'year': 2024
    }
    
    processor = DocumentAIProcessor()
    result = processor.process_pdf(gcs_uri, guideline_metadata)
    
    print(json.dumps(result, indent=2, ensure_ascii=False))
