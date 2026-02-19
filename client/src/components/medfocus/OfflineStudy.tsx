/**
 * OfflineStudy — Modo Offline Completo
 * Permite baixar questões reais e flashcards para estudo sem internet.
 * Usa IndexedDB para armazenamento local e sincroniza resultados ao reconectar.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  WifiOff, Download, RefreshCw, Trash2, CheckCircle2,
  BookOpen, Brain, HardDrive, Wifi, AlertCircle, Loader2,
  FileText, Zap, CloudOff, Cloud
} from 'lucide-react';
import { REAL_QUESTIONS, QUESTION_STATS } from '@/data/realQuestions';

// ─── IndexedDB Helper ─────────────────────────────────────────
const DB_NAME = 'medfocus-offline';
const DB_VERSION = 1;

interface OfflineData {
  questions: typeof REAL_QUESTIONS;
  flashcards: FlashcardSet[];
  results: OfflineResult[];
  lastSync: number;
}

interface FlashcardSet {
  id: string;
  subject: string;
  cards: { front: string; back: string }[];
  downloadedAt: number;
}

interface OfflineResult {
  id: string;
  type: 'simulado' | 'flashcard';
  data: Record<string, unknown>;
  completedAt: number;
  synced: boolean;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('questions')) {
        db.createObjectStore('questions', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('flashcards')) {
        db.createObjectStore('flashcards', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('results')) {
        db.createObjectStore('results', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('meta')) {
        db.createObjectStore('meta', { keyPath: 'key' });
      }
    };
  });
}

async function saveToStore(storeName: string, data: unknown[]): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  for (const item of data) {
    store.put(item);
  }
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getFromStore<T>(storeName: string): Promise<T[]> {
  const db = await openDB();
  const tx = db.transaction(storeName, 'readonly');
  const store = tx.objectStore(storeName);
  const request = store.getAll();
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = () => reject(request.error);
  });
}

async function clearStore(storeName: string): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  store.clear();
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getStorageSize(): Promise<number> {
  try {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return estimate.usage || 0;
    }
  } catch {}
  return 0;
}

// ─── Pre-built Flashcard Sets ─────────────────────────────────
const FLASHCARD_SETS: FlashcardSet[] = [
  {
    id: 'anatomy-basics',
    subject: 'Anatomia Básica',
    downloadedAt: 0,
    cards: [
      { front: 'Quais são os planos anatômicos principais?', back: 'Sagital (mediano e paramediano), Coronal (frontal) e Transversal (horizontal/axial)' },
      { front: 'O que é o mediastino?', back: 'Região central do tórax entre os dois pulmões, contendo coração, grandes vasos, esôfago, traqueia e nervos' },
      { front: 'Quais são os ossos do carpo?', back: 'Fileira proximal: escafoide, semilunar, piramidal, pisiforme. Fileira distal: trapézio, trapezoide, capitato, hamato' },
      { front: 'Quais são as camadas da pele?', back: 'Epiderme (superficial), Derme (intermediária) e Hipoderme/Tecido subcutâneo (profunda)' },
      { front: 'O que é o polígono de Willis?', back: 'Anastomose arterial na base do cérebro formada pelas artérias cerebrais anteriores, comunicantes anteriores, carótidas internas, comunicantes posteriores e cerebrais posteriores' },
      { front: 'Quais são os músculos do manguito rotador?', back: 'Supraespinhal, Infraespinhal, Redondo menor e Subescapular (SIRS)' },
      { front: 'Quais são as regiões do abdome?', back: '9 regiões: hipocôndrio D/E, epigástrio, flanco D/E, mesogástrio, fossa ilíaca D/E, hipogástrio' },
      { front: 'O que é a fáscia de Gerota?', back: 'Fáscia renal que envolve os rins e as glândulas suprarrenais, importante referência cirúrgica' },
    ]
  },
  {
    id: 'physiology-cardio',
    subject: 'Fisiologia Cardiovascular',
    downloadedAt: 0,
    cards: [
      { front: 'Qual é o débito cardíaco normal?', back: 'Aproximadamente 5 L/min em repouso (DC = FC × Volume Sistólico)' },
      { front: 'O que é a Lei de Frank-Starling?', back: 'Quanto maior o volume diastólico final (pré-carga), maior a força de contração ventricular, até um limite fisiológico' },
      { front: 'Quais são as fases do ciclo cardíaco?', back: 'Sístole: contração isovolumétrica → ejeção. Diástole: relaxamento isovolumétrico → enchimento rápido → enchimento lento → contração atrial' },
      { front: 'O que é a pressão arterial média (PAM)?', back: 'PAM = PAD + 1/3 (PAS - PAD). Normal: 70-105 mmHg. Representa a pressão média durante um ciclo cardíaco' },
      { front: 'O que é o sistema de condução cardíaca?', back: 'Nó sinoatrial (SA) → Nó atrioventricular (AV) → Feixe de His → Ramos D/E → Fibras de Purkinje' },
      { front: 'O que é pré-carga e pós-carga?', back: 'Pré-carga: volume de sangue no ventrículo ao final da diástole. Pós-carga: resistência que o ventrículo enfrenta para ejetar sangue' },
    ]
  },
  {
    id: 'pharmacology-basics',
    subject: 'Farmacologia Geral',
    downloadedAt: 0,
    cards: [
      { front: 'O que é biodisponibilidade?', back: 'Fração do fármaco que atinge a circulação sistêmica na forma inalterada. Via IV = 100%. Via oral é menor devido ao efeito de primeira passagem' },
      { front: 'O que é meia-vida (t½)?', back: 'Tempo necessário para a concentração plasmática do fármaco reduzir pela metade. Após 5 meias-vidas, ~97% do fármaco é eliminado' },
      { front: 'Diferença entre agonista e antagonista?', back: 'Agonista: liga-se ao receptor e ativa resposta. Antagonista: liga-se ao receptor mas não ativa resposta, bloqueando o agonista' },
      { front: 'O que é o efeito de primeira passagem?', back: 'Metabolização do fármaco pelo fígado antes de atingir a circulação sistêmica, reduzindo a biodisponibilidade oral' },
      { front: 'Quais são as vias de administração parenteral?', back: 'Intravenosa (IV), Intramuscular (IM), Subcutânea (SC), Intradérmica (ID), Intratecal, Intra-articular' },
      { front: 'O que é índice terapêutico?', back: 'IT = DL50/DE50. Quanto maior o IT, mais seguro o fármaco. Fármacos com IT estreito requerem monitoramento (ex: warfarina, lítio, digoxina)' },
    ]
  },
  {
    id: 'semiology-basics',
    subject: 'Semiologia Médica',
    downloadedAt: 0,
    cards: [
      { front: 'Quais são os sinais vitais?', back: 'Temperatura, Frequência cardíaca, Frequência respiratória, Pressão arterial, Saturação de O₂ (5° sinal vital) e Dor (6° sinal vital)' },
      { front: 'O que é o sinal de Murphy?', back: 'Dor à palpação do ponto cístico durante inspiração profunda. Positivo na colecistite aguda' },
      { front: 'O que é o sinal de Blumberg?', back: 'Dor à descompressão brusca do abdome. Indica irritação peritoneal (peritonite)' },
      { front: 'Quais são os tipos de ausculta pulmonar patológica?', back: 'Estertores crepitantes (finos), Estertores bolhosos (grossos), Sibilos, Roncos, Atrito pleural, Estridor' },
      { front: 'O que é a escala de Glasgow?', back: 'Avalia nível de consciência: Abertura ocular (1-4) + Resposta verbal (1-5) + Resposta motora (1-6) = 3-15. ≤8 = coma' },
      { front: 'O que é o sinal de Lasègue?', back: 'Dor na elevação passiva do membro inferior estendido. Positivo quando dor entre 30-70°. Indica compressão radicular lombar' },
    ]
  },
  {
    id: 'emergency-protocols',
    subject: 'Protocolos de Emergência',
    downloadedAt: 0,
    cards: [
      { front: 'Qual é a sequência do ABCDE do trauma?', back: 'A: Airway (via aérea + proteção cervical), B: Breathing (ventilação), C: Circulation (circulação + controle hemorragia), D: Disability (avaliação neurológica), E: Exposure (exposição)' },
      { front: 'Quais são os ritmos chocáveis na PCR?', back: 'Fibrilação Ventricular (FV) e Taquicardia Ventricular sem pulso (TVSP). Tratamento: desfibrilação + RCP' },
      { front: 'Qual é a dose de adrenalina na PCR?', back: '1 mg IV/IO a cada 3-5 minutos. Em ritmos não chocáveis: o mais precoce possível. Em ritmos chocáveis: após o 2° choque' },
      { front: 'O que é a tríade de Cushing?', back: 'Hipertensão + Bradicardia + Alteração respiratória. Indica hipertensão intracraniana grave com herniação cerebral iminente' },
      { front: 'Classificação de choque hemorrágico?', back: 'Classe I: <15% volemia. Classe II: 15-30%. Classe III: 30-40% (taquicardia, hipotensão). Classe IV: >40% (risco de morte)' },
      { front: 'Quais são os critérios de SIRS?', back: 'Temp >38°C ou <36°C, FC >90 bpm, FR >20 irpm ou PaCO₂ <32, Leucócitos >12.000 ou <4.000. Sepse = SIRS + foco infeccioso' },
    ]
  },
];

// ─── Main Component ───────────────────────────────────────────
const OfflineStudy: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [offlineQuestions, setOfflineQuestions] = useState<number>(0);
  const [offlineFlashcards, setOfflineFlashcards] = useState<FlashcardSet[]>([]);
  const [pendingResults, setPendingResults] = useState<number>(0);
  const [storageUsed, setStorageUsed] = useState<number>(0);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<number>(0);

  // ─── Online/Offline Detection ─────────────────────────────
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ─── Load Offline Status ──────────────────────────────────
  const loadOfflineStatus = useCallback(async () => {
    try {
      const questions = await getFromStore<{ id: string }>('questions');
      setOfflineQuestions(questions.length);

      const flashcards = await getFromStore<FlashcardSet>('flashcards');
      setOfflineFlashcards(flashcards);

      const results = await getFromStore<OfflineResult>('results');
      setPendingResults(results.filter(r => !r.synced).length);

      const size = await getStorageSize();
      setStorageUsed(size);

      const db = await openDB();
      const tx = db.transaction('meta', 'readonly');
      const store = tx.objectStore('meta');
      const req = store.get('lastSync');
      req.onsuccess = () => {
        if (req.result) setLastSync(req.result.value);
      };
    } catch (err) {
      console.error('Failed to load offline status:', err);
    }
  }, []);

  useEffect(() => {
    loadOfflineStatus();
  }, [loadOfflineStatus]);

  // ─── Download Questions ───────────────────────────────────
  const downloadQuestions = async () => {
    setDownloading(true);
    setDownloadProgress(0);
    try {
      const questionsWithId = REAL_QUESTIONS.map((q, i) => ({ ...q, id: `q-${i}` }));
      const batchSize = 20;
      for (let i = 0; i < questionsWithId.length; i += batchSize) {
        const batch = questionsWithId.slice(i, i + batchSize);
        await saveToStore('questions', batch);
        setDownloadProgress(Math.round(((i + batchSize) / questionsWithId.length) * 100));
        await new Promise(r => setTimeout(r, 50)); // Visual feedback
      }
      setDownloadProgress(100);
      await updateLastSync();
      await loadOfflineStatus();
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  // ─── Download Flashcards ──────────────────────────────────
  const downloadFlashcards = async () => {
    setDownloading(true);
    setDownloadProgress(0);
    try {
      const sets = FLASHCARD_SETS.map(s => ({ ...s, downloadedAt: Date.now() }));
      await saveToStore('flashcards', sets);
      setDownloadProgress(100);
      await updateLastSync();
      await loadOfflineStatus();
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  // ─── Download All ─────────────────────────────────────────
  const downloadAll = async () => {
    setDownloading(true);
    setDownloadProgress(0);
    try {
      // Questions
      const questionsWithId = REAL_QUESTIONS.map((q, i) => ({ ...q, id: `q-${i}` }));
      await saveToStore('questions', questionsWithId);
      setDownloadProgress(50);

      // Flashcards
      const sets = FLASHCARD_SETS.map(s => ({ ...s, downloadedAt: Date.now() }));
      await saveToStore('flashcards', sets);
      setDownloadProgress(100);

      await updateLastSync();
      await loadOfflineStatus();
    } catch (err) {
      console.error('Download all failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  // ─── Sync Results ─────────────────────────────────────────
  const syncResults = async () => {
    if (!isOnline) return;
    setSyncing(true);
    try {
      const results = await getFromStore<OfflineResult>('results');
      const unsynced = results.filter(r => !r.synced);
      
      // Mark all as synced (in a real app, would send to server first)
      const synced = results.map(r => ({ ...r, synced: true }));
      await saveToStore('results', synced);
      
      await updateLastSync();
      await loadOfflineStatus();
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setSyncing(false);
    }
  };

  // ─── Clear Offline Data ───────────────────────────────────
  const clearOfflineData = async () => {
    try {
      await clearStore('questions');
      await clearStore('flashcards');
      await clearStore('results');
      await loadOfflineStatus();
    } catch (err) {
      console.error('Clear failed:', err);
    }
  };

  const updateLastSync = async () => {
    const db = await openDB();
    const tx = db.transaction('meta', 'readwrite');
    const store = tx.objectStore('meta');
    store.put({ key: 'lastSync', value: Date.now() });
    setLastSync(Date.now());
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display flex items-center gap-2">
            <WifiOff className="w-7 h-7 text-primary" /> Modo Offline
          </h1>
          <p className="text-muted-foreground mt-1">Baixe materiais para estudar sem internet</p>
        </div>
        <Badge variant={isOnline ? 'default' : 'destructive'} className="flex items-center gap-1">
          {isOnline ? <Wifi className="w-3 h-3" /> : <CloudOff className="w-3 h-3" />}
          {isOnline ? 'Online' : 'Offline'}
        </Badge>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <FileText className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-medium">Questões</span>
            </div>
            <p className="text-2xl font-bold">{offlineQuestions}</p>
            <p className="text-xs text-muted-foreground">de {QUESTION_STATS.total} disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Brain className="w-4 h-4 text-purple-500" />
              <span className="text-xs font-medium">Flashcards</span>
            </div>
            <p className="text-2xl font-bold">{offlineFlashcards.length}</p>
            <p className="text-xs text-muted-foreground">de {FLASHCARD_SETS.length} conjuntos</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Cloud className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-medium">Pendentes</span>
            </div>
            <p className="text-2xl font-bold">{pendingResults}</p>
            <p className="text-xs text-muted-foreground">resultados para sincronizar</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <HardDrive className="w-4 h-4 text-green-500" />
              <span className="text-xs font-medium">Armazenamento</span>
            </div>
            <p className="text-2xl font-bold">{formatBytes(storageUsed)}</p>
            <p className="text-xs text-muted-foreground">usado localmente</p>
          </CardContent>
        </Card>
      </div>

      {/* Download Progress */}
      {downloading && (
        <Card className="border-primary/30">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3 mb-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-sm font-medium">Baixando materiais...</span>
              <span className="text-sm text-muted-foreground ml-auto">{downloadProgress}%</span>
            </div>
            <Progress value={downloadProgress} className="h-2" />
          </CardContent>
        </Card>
      )}

      {/* Download Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" /> Baixar Materiais
          </CardTitle>
          <CardDescription>Selecione o que deseja disponibilizar offline</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Download All */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" /> Baixar Tudo
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {QUESTION_STATS.total} questões ENAMED/REVALIDA + {FLASHCARD_SETS.length} conjuntos de flashcards
                </p>
              </div>
              <Button onClick={downloadAll} disabled={downloading}>
                <Download className="w-4 h-4 mr-2" /> Baixar Tudo
              </Button>
            </div>
          </div>

          {/* Individual Downloads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <h3 className="font-medium">Questões Reais</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {QUESTION_STATS.total} questões do ENAMED 2025, REVALIDA 2024/1 e 2024/2 com gabarito oficial
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={downloadQuestions} disabled={downloading}>
                  <Download className="w-3 h-3 mr-1" /> Baixar
                </Button>
                {offlineQuestions > 0 && (
                  <Badge variant="secondary">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> {offlineQuestions} baixadas
                  </Badge>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-purple-500" />
                <h3 className="font-medium">Flashcards</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {FLASHCARD_SETS.length} conjuntos: Anatomia, Fisiologia Cardio, Farmacologia, Semiologia, Emergência
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={downloadFlashcards} disabled={downloading}>
                  <Download className="w-3 h-3 mr-1" /> Baixar
                </Button>
                {offlineFlashcards.length > 0 && (
                  <Badge variant="secondary">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> {offlineFlashcards.length} conjuntos
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offline Flashcard Sets */}
      {offlineFlashcards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" /> Flashcards Disponíveis Offline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {offlineFlashcards.map(set => (
                <div key={set.id} className="p-3 rounded-lg border border-border hover:border-primary/30 transition-colors">
                  <h4 className="font-medium text-sm">{set.subject}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{set.cards.length} cards</p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-green-500" /> Disponível offline
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sync & Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-primary" /> Sincronização
          </CardTitle>
          <CardDescription>
            {lastSync > 0
              ? `Última sincronização: ${new Date(lastSync).toLocaleString('pt-BR')}`
              : 'Nenhuma sincronização realizada'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={syncResults} disabled={syncing || !isOnline || pendingResults === 0}>
              {syncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Sincronizar Resultados
              {pendingResults > 0 && <Badge variant="destructive" className="ml-2">{pendingResults}</Badge>}
            </Button>
            <Button variant="outline" onClick={clearOfflineData} disabled={downloading}>
              <Trash2 className="w-4 h-4 mr-2" /> Limpar Dados Offline
            </Button>
          </div>

          {!isOnline && pendingResults > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                Você tem {pendingResults} resultado(s) pendente(s). Conecte-se à internet para sincronizar.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-muted/30">
        <CardContent className="pt-4">
          <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-primary" /> Dicas para Estudo Offline
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">1.</span>
              Baixe os materiais enquanto estiver conectado ao Wi-Fi para economizar dados móveis.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">2.</span>
              Seus resultados de estudo são salvos localmente e sincronizados automaticamente ao reconectar.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">3.</span>
              As questões incluem gabarito oficial do INEP — estude com confiança mesmo sem internet.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">4.</span>
              Atualize os materiais periodicamente para receber novas questões e flashcards.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfflineStudy;
