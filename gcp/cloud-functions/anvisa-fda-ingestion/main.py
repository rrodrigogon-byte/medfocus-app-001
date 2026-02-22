"""
MedFocus PhD - ANVISA/FDA Data Ingestion Cloud Function
Execução: Diária via Cloud Scheduler
Objetivo: Monitorar alterações em bulas e alertas de segurança
"""

import os
import json
import requests
import hashlib
from datetime import datetime
from google.cloud import bigquery
from google.cloud import pubsub_v1
from typing import List, Dict, Any, Optional

# Configurações
ANVISA_BASE_URL = "https://dados.anvisa.gov.br/dados"
OPENFDA_BASE_URL = "https://api.fda.gov"
OPENFDA_API_KEY = os.environ.get('OPENFDA_API_KEY', '')
BQ_PROJECT_ID = os.environ.get('GCP_PROJECT_ID')
BQ_DATASET = "medfocus_raw_data"
PUBSUB_TOPIC = "medfocus-drug-alerts"

class AnvisaFDAIngestion:
    def __init__(self):
        self.bq_client = bigquery.Client(project=BQ_PROJECT_ID)
        self.pubsub_publisher = pubsub_v1.PublisherClient()
        self.topic_path = self.pubsub_publisher.topic_path(BQ_PROJECT_ID, PUBSUB_TOPIC)
        self.session = requests.Session()
    
    def fetch_anvisa_drugs(self) -> List[Dict[str, Any]]:
        """
        Busca lista de medicamentos registrados na ANVISA
        Endpoint: CMED (Câmara de Regulação do Mercado de Medicamentos)
        """
        # ANVISA disponibiliza CSVs atualizados
        cmed_url = f"{ANVISA_BASE_URL}/CMED/cmed_medicamentos.csv"
        
        try:
            print("Fetching ANVISA CMED data...")
            response = self.session.get(cmed_url, timeout=30)
            response.raise_for_status()
            
            # Parse CSV
            import csv
            from io import StringIO
            
            csv_data = StringIO(response.text)
            reader = csv.DictReader(csv_data, delimiter=';')
            
            drugs = []
            for row in reader:
                drug = {
                    'anvisa_registry': row.get('REGISTRO', ''),
                    'ean': row.get('EAN', ''),
                    'product_name': row.get('PRODUTO', ''),
                    'presentation': row.get('APRESENTAÇÃO', ''),
                    'company': row.get('LABORATÓRIO', ''),
                    'active_ingredient': row.get('PRINCÍPIO ATIVO', ''),
                    'therapeutic_class': row.get('CLASSE TERAPÊUTICA', ''),
                    'pmc': row.get('PMC', ''),  # Preço Máximo ao Consumidor
                    'pf': row.get('PF', ''),    # Preço de Fábrica
                    'type': row.get('TIPO', ''),
                    'restriction': row.get('RESTRIÇÃO HOSPITALAR', ''),
                    'cap': row.get('CAP', ''),  # Coeficiente de Adequação de Preços
                    'fetched_at': datetime.now().isoformat(),
                    'source': 'anvisa_cmed'
                }
                drugs.append(drug)
            
            print(f"Fetched {len(drugs)} drugs from ANVISA CMED")
            return drugs
            
        except Exception as e:
            print(f"Error fetching ANVISA data: {e}")
            return []
    
    def fetch_anvisa_alerts(self) -> List[Dict[str, Any]]:
        """
        Busca alertas sanitários da ANVISA
        """
        alerts_url = f"{ANVISA_BASE_URL}/ALERT/alertas_sanitarios.json"
        
        try:
            print("Fetching ANVISA safety alerts...")
            response = self.session.get(alerts_url, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            
            alerts = []
            for item in data.get('results', []):
                alert = {
                    'alert_id': item.get('id', ''),
                    'title': item.get('titulo', ''),
                    'category': item.get('categoria', ''),
                    'publication_date': item.get('data_publicacao', ''),
                    'summary': item.get('resumo', ''),
                    'details_url': item.get('url', ''),
                    'severity': self._classify_alert_severity(item),
                    'fetched_at': datetime.now().isoformat(),
                    'source': 'anvisa_alerts'
                }
                alerts.append(alert)
            
            print(f"Fetched {len(alerts)} alerts from ANVISA")
            return alerts
            
        except Exception as e:
            print(f"Error fetching ANVISA alerts: {e}")
            return []
    
    def fetch_fda_labels(self, limit: int = 100) -> List[Dict[str, Any]]:
        """
        Busca bulas (labels) da FDA
        """
        params = {
            'limit': limit
        }
        
        if OPENFDA_API_KEY:
            params['api_key'] = OPENFDA_API_KEY
        
        try:
            print("Fetching FDA drug labels...")
            response = self.session.get(
                f"{OPENFDA_BASE_URL}/drug/label.json",
                params=params,
                timeout=30
            )
            response.raise_for_status()
            
            data = response.json()
            
            labels = []
            for result in data.get('results', []):
                label = {
                    'set_id': result.get('set_id', ''),
                    'product_name': self._extract_first(result.get('openfda', {}).get('brand_name', [])),
                    'generic_name': self._extract_first(result.get('openfda', {}).get('generic_name', [])),
                    'manufacturer': self._extract_first(result.get('openfda', {}).get('manufacturer_name', [])),
                    'product_type': self._extract_first(result.get('openfda', {}).get('product_type', [])),
                    'route': result.get('openfda', {}).get('route', []),
                    'indications_and_usage': self._extract_first(result.get('indications_and_usage', [])),
                    'dosage_and_administration': self._extract_first(result.get('dosage_and_administration', [])),
                    'warnings': self._extract_first(result.get('warnings', [])),
                    'adverse_reactions': self._extract_first(result.get('adverse_reactions', [])),
                    'contraindications': self._extract_first(result.get('contraindications', [])),
                    'drug_interactions': self._extract_first(result.get('drug_interactions', [])),
                    'pharmacology': self._extract_first(result.get('clinical_pharmacology', [])),
                    'fetched_at': datetime.now().isoformat(),
                    'source': 'fda_labels'
                }
                labels.append(label)
            
            print(f"Fetched {len(labels)} labels from FDA")
            return labels
            
        except Exception as e:
            print(f"Error fetching FDA labels: {e}")
            return []
    
    def fetch_fda_enforcement(self) -> List[Dict[str, Any]]:
        """
        Busca ações de fiscalização da FDA (recalls, etc.)
        """
        params = {
            'limit': 100,
            'search': 'report_date:[NOW-7DAYS TO NOW]'  # Últimos 7 dias
        }
        
        if OPENFDA_API_KEY:
            params['api_key'] = OPENFDA_API_KEY
        
        try:
            print("Fetching FDA enforcement reports...")
            response = self.session.get(
                f"{OPENFDA_BASE_URL}/drug/enforcement.json",
                params=params,
                timeout=30
            )
            response.raise_for_status()
            
            data = response.json()
            
            enforcements = []
            for result in data.get('results', []):
                enforcement = {
                    'recall_number': result.get('recall_number', ''),
                    'classification': result.get('classification', ''),
                    'status': result.get('status', ''),
                    'distribution_pattern': result.get('distribution_pattern', ''),
                    'product_description': result.get('product_description', ''),
                    'reason_for_recall': result.get('reason_for_recall', ''),
                    'recall_initiation_date': result.get('recall_initiation_date', ''),
                    'report_date': result.get('report_date', ''),
                    'voluntary_mandated': result.get('voluntary_mandated', ''),
                    'city': result.get('city', ''),
                    'state': result.get('state', ''),
                    'country': result.get('country', ''),
                    'recalling_firm': result.get('recalling_firm', ''),
                    'fetched_at': datetime.now().isoformat(),
                    'source': 'fda_enforcement'
                }
                enforcements.append(enforcement)
            
            print(f"Fetched {len(enforcements)} enforcement reports from FDA")
            return enforcements
            
        except Exception as e:
            print(f"Error fetching FDA enforcement: {e}")
            return []
    
    def detect_changes(self, new_data: List[Dict], table_name: str) -> List[Dict]:
        """
        Detecta mudanças comparando hash dos dados
        """
        # Query para buscar dados anteriores
        query = f"""
        SELECT * FROM `{BQ_PROJECT_ID}.{BQ_DATASET}.{table_name}`
        WHERE DATE(fetched_at) = CURRENT_DATE() - 1
        """
        
        try:
            previous_data = list(self.bq_client.query(query).result())
            previous_hashes = {self._compute_hash(row): row for row in previous_data}
            
            changes = []
            for item in new_data:
                item_hash = self._compute_hash(item)
                if item_hash not in previous_hashes:
                    changes.append({
                        'type': 'new_or_modified',
                        'data': item,
                        'detected_at': datetime.now().isoformat()
                    })
            
            return changes
            
        except Exception as e:
            print(f"Error detecting changes: {e}")
            return []
    
    def publish_alert(self, alert_data: Dict[str, Any]):
        """
        Publica alerta no Pub/Sub para notificações em tempo real
        """
        try:
            message_data = json.dumps(alert_data).encode('utf-8')
            future = self.pubsub_publisher.publish(self.topic_path, message_data)
            message_id = future.result()
            print(f"Published alert with message ID: {message_id}")
            
        except Exception as e:
            print(f"Error publishing alert: {e}")
    
    def save_to_bigquery(self, data: List[Dict[str, Any]], table_name: str):
        """
        Salva dados no BigQuery
        """
        if not data:
            return
        
        table_id = f"{BQ_PROJECT_ID}.{BQ_DATASET}.{table_name}"
        
        try:
            errors = self.bq_client.insert_rows_json(table_id, data)
            if errors:
                print(f"Errors inserting rows into {table_name}: {errors}")
            else:
                print(f"Successfully inserted {len(data)} rows into {table_name}")
                
        except Exception as e:
            print(f"Error saving to BigQuery table {table_name}: {e}")
    
    def _classify_alert_severity(self, alert: Dict) -> str:
        """
        Classifica severidade do alerta baseado em palavras-chave
        """
        text = f"{alert.get('titulo', '')} {alert.get('resumo', '')}".lower()
        
        critical_keywords = ['morte', 'óbito', 'grave', 'urgente', 'imediato', 'recall']
        high_keywords = ['hospitalizaç', 'efeito adverso grave', 'contraindicaç']
        
        if any(kw in text for kw in critical_keywords):
            return 'CRITICAL'
        elif any(kw in text for kw in high_keywords):
            return 'HIGH'
        else:
            return 'MEDIUM'
    
    def _extract_first(self, lst: List) -> str:
        """
        Extrai primeiro elemento de lista ou retorna string vazia
        """
        return lst[0] if lst and len(lst) > 0 else ''
    
    def _compute_hash(self, data: Dict) -> str:
        """
        Calcula hash MD5 dos dados para detecção de mudanças
        """
        # Remove campos de timestamp
        data_copy = {k: v for k, v in data.items() if 'fetched_at' not in k}
        data_str = json.dumps(data_copy, sort_keys=True)
        return hashlib.md5(data_str.encode()).hexdigest()
    
    def process_all_sources(self):
        """
        Processa todas as fontes de dados
        """
        results = {}
        
        # 1. ANVISA Medicamentos (CMED)
        print("\n" + "="*60)
        print("PROCESSING ANVISA CMED")
        print("="*60)
        anvisa_drugs = self.fetch_anvisa_drugs()
        if anvisa_drugs:
            self.save_to_bigquery(anvisa_drugs, 'anvisa_drugs')
            results['anvisa_drugs'] = len(anvisa_drugs)
        
        # 2. ANVISA Alertas
        print("\n" + "="*60)
        print("PROCESSING ANVISA ALERTS")
        print("="*60)
        anvisa_alerts = self.fetch_anvisa_alerts()
        if anvisa_alerts:
            # Detectar novos alertas
            changes = self.detect_changes(anvisa_alerts, 'anvisa_alerts')
            
            # Publicar alertas críticos
            for change in changes:
                if change['data'].get('severity') in ['CRITICAL', 'HIGH']:
                    self.publish_alert(change['data'])
            
            self.save_to_bigquery(anvisa_alerts, 'anvisa_alerts')
            results['anvisa_alerts'] = len(anvisa_alerts)
            results['new_alerts'] = len(changes)
        
        # 3. FDA Labels
        print("\n" + "="*60)
        print("PROCESSING FDA LABELS")
        print("="*60)
        fda_labels = self.fetch_fda_labels(limit=100)
        if fda_labels:
            self.save_to_bigquery(fda_labels, 'fda_labels')
            results['fda_labels'] = len(fda_labels)
        
        # 4. FDA Enforcement
        print("\n" + "="*60)
        print("PROCESSING FDA ENFORCEMENT")
        print("="*60)
        fda_enforcement = self.fetch_fda_enforcement()
        if fda_enforcement:
            # Publicar recalls para notificação
            for enforcement in fda_enforcement:
                if enforcement.get('classification') in ['Class I', 'Class II']:
                    self.publish_alert({
                        'type': 'fda_recall',
                        'severity': 'HIGH' if enforcement.get('classification') == 'Class I' else 'MEDIUM',
                        'data': enforcement
                    })
            
            self.save_to_bigquery(fda_enforcement, 'fda_enforcement')
            results['fda_enforcement'] = len(fda_enforcement)
        
        print("\n" + "="*60)
        print("INGESTION SUMMARY")
        print("="*60)
        print(json.dumps(results, indent=2))
        
        return {
            'status': 'success',
            'timestamp': datetime.now().isoformat(),
            'results': results
        }


def anvisa_fda_ingestion_handler(request):
    """
    Cloud Function entry point
    Triggered by Cloud Scheduler (daily)
    """
    print("Starting ANVISA/FDA ingestion...")
    
    try:
        ingestion = AnvisaFDAIngestion()
        result = ingestion.process_all_sources()
        
        return json.dumps(result), 200, {'Content-Type': 'application/json'}
        
    except Exception as e:
        error_msg = f"Error in ANVISA/FDA ingestion: {str(e)}"
        print(error_msg)
        return json.dumps({'status': 'error', 'message': error_msg}), 500


# Para execução local/teste
if __name__ == "__main__":
    ingestion = AnvisaFDAIngestion()
    result = ingestion.process_all_sources()
    print(json.dumps(result, indent=2))
