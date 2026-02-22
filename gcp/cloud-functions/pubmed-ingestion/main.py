"""
MedFocus PhD - PubMed Data Ingestion Cloud Function
Execução: Semanal via Cloud Scheduler
Objetivo: Buscar trials clínicos relevantes das 500 drogas mais prescritas no Brasil
"""

import os
import json
import requests
from datetime import datetime, timedelta
from google.cloud import bigquery
from google.cloud import storage
from typing import List, Dict, Any

# Configurações
PUBMED_BASE_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"
PUBMED_API_KEY = os.environ.get('PUBMED_API_KEY', '')
PUBMED_EMAIL = os.environ.get('PUBMED_EMAIL', 'dev@medfocus.com')
BQ_PROJECT_ID = os.environ.get('GCP_PROJECT_ID')
BQ_DATASET = "medfocus_raw_data"
BQ_TABLE = "pubmed_articles"

# Top 500 drogas mais prescritas no Brasil (exemplo - expandir)
TOP_DRUGS = [
    "Dipirona", "Paracetamol", "Ibuprofeno", "Amoxicilina", "Losartana",
    "Atenolol", "Metformina", "Sinvastatina", "Omeprazol", "Captopril",
    "Enalapril", "Propranolol", "Hidroclorotiazida", "Dapagliflozina",
    # ... continuar até 500
]

# Tipos de estudos relevantes
STUDY_TYPES = [
    "Randomized Controlled Trial",
    "Meta-Analysis",
    "Systematic Review",
    "Clinical Trial, Phase IV",
    "Multicenter Study"
]

class PubMedIngestion:
    def __init__(self):
        self.bq_client = bigquery.Client(project=BQ_PROJECT_ID)
        self.storage_client = storage.Client(project=BQ_PROJECT_ID)
        self.session = requests.Session()
        
    def search_pubmed(self, drug: str, days_back: int = 7) -> List[str]:
        """
        Busca PMIDs de artigos recentes para uma droga específica
        """
        # Calcular data de início
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days_back)
        
        # Construir query
        query_parts = [
            f'("{drug}"[Title/Abstract])',
            'AND',
            f'({" OR ".join([f\'"{st}"[Publication Type]\' for st in STUDY_TYPES])})',
            'AND',
            f'("{start_date.strftime("%Y/%m/%d")}"[Date - Publication] : "{end_date.strftime("%Y/%m/%d")}"[Date - Publication])'
        ]
        query = ' '.join(query_parts)
        
        # Parâmetros da busca
        params = {
            'db': 'pubmed',
            'term': query,
            'retmax': 100,
            'retmode': 'json',
            'api_key': PUBMED_API_KEY,
            'email': PUBMED_EMAIL
        }
        
        try:
            response = self.session.get(f"{PUBMED_BASE_URL}/esearch.fcgi", params=params)
            response.raise_for_status()
            data = response.json()
            
            pmids = data.get('esearchresult', {}).get('idlist', [])
            print(f"Found {len(pmids)} articles for {drug}")
            return pmids
            
        except Exception as e:
            print(f"Error searching PubMed for {drug}: {e}")
            return []
    
    def fetch_article_details(self, pmids: List[str]) -> List[Dict[str, Any]]:
        """
        Busca detalhes completos dos artigos por PMID
        """
        if not pmids:
            return []
        
        params = {
            'db': 'pubmed',
            'id': ','.join(pmids),
            'retmode': 'xml',
            'api_key': PUBMED_API_KEY,
            'email': PUBMED_EMAIL
        }
        
        try:
            response = self.session.get(f"{PUBMED_BASE_URL}/efetch.fcgi", params=params)
            response.raise_for_status()
            
            # Parse XML response (simplified - use xml.etree.ElementTree in production)
            articles = self._parse_pubmed_xml(response.text)
            return articles
            
        except Exception as e:
            print(f"Error fetching article details: {e}")
            return []
    
    def _parse_pubmed_xml(self, xml_text: str) -> List[Dict[str, Any]]:
        """
        Parse XML do PubMed e extrai informações relevantes
        """
        import xml.etree.ElementTree as ET
        
        articles = []
        root = ET.fromstring(xml_text)
        
        for article in root.findall('.//PubmedArticle'):
            try:
                pmid = article.find('.//PMID').text
                
                title_elem = article.find('.//ArticleTitle')
                title = title_elem.text if title_elem is not None else ''
                
                abstract_elem = article.find('.//AbstractText')
                abstract = abstract_elem.text if abstract_elem is not None else ''
                
                # Data de publicação
                pub_date = article.find('.//PubDate')
                year = pub_date.find('Year').text if pub_date.find('Year') is not None else ''
                month = pub_date.find('Month').text if pub_date.find('Month') is not None else ''
                
                # Autores
                authors = []
                for author in article.findall('.//Author'):
                    last_name = author.find('LastName')
                    fore_name = author.find('ForeName')
                    if last_name is not None and fore_name is not None:
                        authors.append(f"{fore_name.text} {last_name.text}")
                
                # Journal
                journal_elem = article.find('.//Journal/Title')
                journal = journal_elem.text if journal_elem is not None else ''
                
                # Publication Types
                pub_types = [pt.text for pt in article.findall('.//PublicationType')]
                
                articles.append({
                    'pmid': pmid,
                    'title': title,
                    'abstract': abstract,
                    'authors': authors,
                    'journal': journal,
                    'publication_year': year,
                    'publication_month': month,
                    'publication_types': pub_types,
                    'fetched_at': datetime.now().isoformat(),
                    'source': 'pubmed'
                })
                
            except Exception as e:
                print(f"Error parsing article: {e}")
                continue
        
        return articles
    
    def save_to_bigquery(self, articles: List[Dict[str, Any]], drug: str):
        """
        Salva artigos no BigQuery
        """
        if not articles:
            return
        
        table_id = f"{BQ_PROJECT_ID}.{BQ_DATASET}.{BQ_TABLE}"
        
        # Adicionar metadados
        for article in articles:
            article['drug_keyword'] = drug
            article['ingestion_timestamp'] = datetime.now().isoformat()
        
        try:
            errors = self.bq_client.insert_rows_json(table_id, articles)
            if errors:
                print(f"Errors inserting rows: {errors}")
            else:
                print(f"Successfully inserted {len(articles)} articles for {drug}")
                
        except Exception as e:
            print(f"Error saving to BigQuery: {e}")
    
    def generate_embeddings(self, articles: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Gera embeddings usando Vertex AI para busca semântica
        """
        from vertexai.language_models import TextEmbeddingModel
        
        model = TextEmbeddingModel.from_pretrained("textembedding-gecko@003")
        
        for article in articles:
            # Combinar título e abstract para embedding
            text = f"{article['title']} {article['abstract']}"
            
            try:
                embeddings = model.get_embeddings([text])
                article['embedding'] = embeddings[0].values
            except Exception as e:
                print(f"Error generating embedding for PMID {article['pmid']}: {e}")
                article['embedding'] = None
        
        return articles
    
    def process_all_drugs(self):
        """
        Processa todas as drogas da lista
        """
        total_articles = 0
        
        for drug in TOP_DRUGS:
            print(f"\n{'='*60}")
            print(f"Processing: {drug}")
            print(f"{'='*60}")
            
            # Buscar PMIDs
            pmids = self.search_pubmed(drug, days_back=7)
            
            if pmids:
                # Buscar detalhes
                articles = self.fetch_article_details(pmids)
                
                if articles:
                    # Gerar embeddings
                    articles_with_embeddings = self.generate_embeddings(articles)
                    
                    # Salvar no BigQuery
                    self.save_to_bigquery(articles_with_embeddings, drug)
                    
                    total_articles += len(articles)
        
        print(f"\n{'='*60}")
        print(f"SUMMARY: Processed {total_articles} articles total")
        print(f"{'='*60}")
        
        return {
            'status': 'success',
            'total_articles': total_articles,
            'drugs_processed': len(TOP_DRUGS)
        }


def pubmed_ingestion_handler(request):
    """
    Cloud Function entry point
    Triggered by Cloud Scheduler (weekly)
    """
    print("Starting PubMed ingestion...")
    
    try:
        ingestion = PubMedIngestion()
        result = ingestion.process_all_drugs()
        
        return json.dumps(result), 200, {'Content-Type': 'application/json'}
        
    except Exception as e:
        error_msg = f"Error in PubMed ingestion: {str(e)}"
        print(error_msg)
        return json.dumps({'status': 'error', 'message': error_msg}), 500


# Para execução local/teste
if __name__ == "__main__":
    ingestion = PubMedIngestion()
    result = ingestion.process_all_drugs()
    print(json.dumps(result, indent=2))
