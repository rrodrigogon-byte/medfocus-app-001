/**
 * MedFocus — Central de Emergência
 * Sprint 46: Protocolos ACLS, ATLS, PALS com fluxogramas interativos e doses de emergência
 */
import React, { useState } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

interface Protocolo {
  id: string;
  nome: string;
  sigla: string;
  categoria: 'ACLS' | 'ATLS' | 'PALS' | 'Emergência Clínica';
  descricao: string;
  referencia: string;
  etapas: { titulo: string; descricao: string; alerta?: string }[];
  drogas: { nome: string; dose: string; via: string; obs: string }[];
}

const protocolos: Protocolo[] = [
  {
    id: 'pcr-adulto', nome: 'PCR Adulto (ACLS)', sigla: 'ACLS', categoria: 'ACLS',
    descricao: 'Protocolo de Parada Cardiorrespiratória em adultos conforme AHA 2020',
    referencia: 'AHA Guidelines for CPR and ECC 2020 + Update 2023',
    etapas: [
      { titulo: '1. Reconhecimento', descricao: 'Verificar responsividade + Checar pulso carotídeo (máx. 10s). Se ausente → Iniciar RCP.' },
      { titulo: '2. RCP de Alta Qualidade', descricao: 'Compressões: 100-120/min, profundidade 5-6cm, retorno completo do tórax. Relação 30:2 (sem via aérea avançada) ou compressões contínuas com ventilação a cada 6s (com VA avançada).', alerta: 'Minimizar interrupções! Trocar compressor a cada 2 min.' },
      { titulo: '3. Desfibrilação', descricao: 'Monitorizar ritmo: FV/TV sem pulso → Choque (bifásico 120-200J, monofásico 360J). AESP/Assistolia → NÃO chocar, continuar RCP.' },
      { titulo: '4. Acesso Vascular', descricao: 'IV ou IO. Adrenalina 1mg IV/IO a cada 3-5 min. Em FV/TV refratária: Amiodarona 300mg (1ª dose), 150mg (2ª dose).' },
      { titulo: '5. Causas Reversíveis (5H e 5T)', descricao: 'Hipovolemia, Hipóxia, H+ (acidose), Hipo/Hipercalemia, Hipotermia | Tensão (pneumotórax), Tamponamento, Toxinas, TEP, Trombose coronariana.' },
      { titulo: '6. Cuidados Pós-PCR', descricao: 'Controle direcionado de temperatura (32-36°C por 24h), Cateterismo se suspeita de IAM, Evitar hiperoxia (SpO2 92-98%), Controle glicêmico.' },
    ],
    drogas: [
      { nome: 'Adrenalina', dose: '1mg (1:10.000)', via: 'IV/IO', obs: 'A cada 3-5 min. Primeira dose: imediatamente em AESP/Assistolia; após 2º choque em FV/TV' },
      { nome: 'Amiodarona', dose: '300mg (1ª) / 150mg (2ª)', via: 'IV/IO', obs: 'Apenas em FV/TV refratária. Alternativa: Lidocaína 1-1,5mg/kg' },
      { nome: 'Lidocaína', dose: '1-1,5mg/kg (1ª) / 0,5-0,75mg/kg', via: 'IV/IO', obs: 'Alternativa à amiodarona se indisponível' },
      { nome: 'Sulfato de Magnésio', dose: '1-2g diluído em 10mL', via: 'IV/IO', obs: 'Torsades de Pointes (TV polimórfica com QT longo)' },
      { nome: 'Bicarbonato de Sódio', dose: '1mEq/kg', via: 'IV', obs: 'Apenas se hipercalemia ou intoxicação por tricíclicos conhecida' },
    ]
  },
  {
    id: 'atls-trauma', nome: 'Avaliação Primária (ATLS)', sigla: 'ATLS', categoria: 'ATLS',
    descricao: 'Avaliação primária do politraumatizado conforme ATLS 10ª edição',
    referencia: 'ATLS — Advanced Trauma Life Support, 10th Edition (ACS 2018)',
    etapas: [
      { titulo: 'A — Airway (Via Aérea)', descricao: 'Proteção da coluna cervical + Avaliação da via aérea. Jaw thrust se suspeita de lesão cervical. IOT se GCS ≤ 8 ou incapacidade de proteger VA.', alerta: 'SEMPRE com estabilização cervical inline!' },
      { titulo: 'B — Breathing (Ventilação)', descricao: 'Inspeção, palpação, percussão e ausculta. Tratar imediatamente: Pneumotórax hipertensivo (punção no 2º EIC), Pneumotórax aberto (curativo de 3 pontas), Hemotórax maciço (drenagem torácica).' },
      { titulo: 'C — Circulation (Circulação)', descricao: 'Controle de hemorragia externa (compressão direta, torniquete). 2 acessos calibrosos (14-16G). Cristaloide aquecido 1L. Se choque classe III/IV: hemoderivados (protocolo de transfusão maciça 1:1:1).' },
      { titulo: 'D — Disability (Neurológico)', descricao: 'Glasgow Coma Scale (GCS). Pupilas (tamanho, simetria, reatividade). Lateralização motora. GCS ≤ 8 = TCE grave → IOT + TC de crânio urgente.' },
      { titulo: 'E — Exposure (Exposição)', descricao: 'Despir completamente o paciente. Prevenção de hipotermia (cobertores aquecidos, fluidos aquecidos). Log roll para avaliar dorso.' },
    ],
    drogas: [
      { nome: 'Ácido Tranexâmico', dose: '1g em 10 min + 1g em 8h', via: 'IV', obs: 'Nas primeiras 3h do trauma. CRASH-2 Trial.' },
      { nome: 'Cristaloide (Ringer Lactato)', dose: '1-2L aquecido (39°C)', via: 'IV', obs: 'Reposição inicial. Evitar excesso (hipotensão permissiva em trauma penetrante)' },
      { nome: 'Concentrado de Hemácias', dose: 'Protocolo 1:1:1 (CH:PFC:Plaq)', via: 'IV', obs: 'Transfusão maciça se >10 unidades em 24h ou >4 em 1h' },
      { nome: 'Noradrenalina', dose: '0,1-2 mcg/kg/min', via: 'IV (BIC)', obs: 'Choque neurogênico (bradicardia + hipotensão + pele quente)' },
    ]
  },
  {
    id: 'pals-pcr', nome: 'PCR Pediátrica (PALS)', sigla: 'PALS', categoria: 'PALS',
    descricao: 'Protocolo de Parada Cardiorrespiratória pediátrica conforme AHA 2020',
    referencia: 'AHA Pediatric Advanced Life Support (PALS) Guidelines 2020',
    etapas: [
      { titulo: '1. Reconhecimento', descricao: 'Sem resposta + Sem respiração (ou gasping) + Sem pulso (braquial <1 ano, carotídeo/femoral >1 ano) em até 10s.' },
      { titulo: '2. RCP Pediátrica', descricao: 'Compressões: 100-120/min. Profundidade: 4cm (lactente) ou 5cm (criança). Relação 15:2 (2 socorristas) ou 30:2 (1 socorrista). Lactente: 2 polegares com mãos envolvendo o tórax.', alerta: 'Em crianças, a PCR é mais frequentemente por hipóxia! Priorizar ventilação.' },
      { titulo: '3. Desfibrilação', descricao: 'FV/TV sem pulso: 2J/kg (1º choque), 4J/kg (2º choque), máx. 10J/kg ou dose adulta.' },
      { titulo: '4. Medicações', descricao: 'Adrenalina: 0,01mg/kg (0,1mL/kg da solução 1:10.000) IV/IO a cada 3-5 min. Amiodarona: 5mg/kg IV/IO (FV/TV refratária).' },
      { titulo: '5. Causas Reversíveis', descricao: 'Mesmos 5H e 5T do adulto + Considerar: cardiopatia congênita, miocardite, intoxicação acidental, afogamento, SMSL.' },
    ],
    drogas: [
      { nome: 'Adrenalina', dose: '0,01mg/kg (0,1mL/kg 1:10.000)', via: 'IV/IO', obs: 'Máx. 1mg/dose. A cada 3-5 min.' },
      { nome: 'Amiodarona', dose: '5mg/kg', via: 'IV/IO bolus', obs: 'FV/TV refratária. Pode repetir até 2x. Máx. 300mg.' },
      { nome: 'Atropina', dose: '0,02mg/kg', via: 'IV/IO', obs: 'Bradicardia vagal. Dose mín. 0,1mg, máx. 0,5mg.' },
      { nome: 'Adenosina', dose: '0,1mg/kg (1ª) / 0,2mg/kg (2ª)', via: 'IV rápido + flush', obs: 'TSV. Máx. 6mg (1ª) e 12mg (2ª).' },
    ]
  },
  {
    id: 'iam-supra', nome: 'IAM com Supra de ST', sigla: 'IAMCSST', categoria: 'Emergência Clínica',
    descricao: 'Protocolo de Infarto Agudo do Miocárdio com supradesnivelamento de ST',
    referencia: 'ESC Guidelines for STEMI 2023 + SBC Diretriz de IAM 2024',
    etapas: [
      { titulo: '1. Diagnóstico', descricao: 'ECG 12 derivações em até 10 min da chegada. Supra de ST ≥1mm em 2 derivações contíguas (≥2mm em V1-V3 em homens). Troponina seriada (não atrasar reperfusão).' },
      { titulo: '2. Terapia Antitrombótica Imediata', descricao: 'AAS 200-300mg mastigado + Clopidogrel 600mg (se ICP) ou 300mg (se fibrinólise) + Heparina não fracionada 60UI/kg (máx. 4.000UI) IV.' },
      { titulo: '3. Reperfusão', descricao: 'ICP primária: porta-balão <90 min (ideal <60 min). Se ICP não disponível em <120 min: Fibrinólise (Tenecteplase peso-ajustada) em até 30 min da chegada (porta-agulha).', alerta: 'Tempo é miocárdio! Cada minuto de atraso = mais necrose.' },
      { titulo: '4. Terapia Adjuvante', descricao: 'Nitroglicerina SL (se PA >90mmHg). Morfina 2-4mg IV (se dor refratária). Betabloqueador VO (se sem contraindicação). Estatina de alta potência.' },
      { titulo: '5. Monitorização', descricao: 'UTI coronariana. Monitorização contínua. Ecocardiograma em 24-48h. Controle de FC, PA, glicemia.' },
    ],
    drogas: [
      { nome: 'AAS', dose: '200-300mg mastigado', via: 'VO', obs: 'Imediato. Manutenção: 100mg/dia indefinidamente.' },
      { nome: 'Clopidogrel', dose: '600mg (ICP) ou 300mg (fibrinólise)', via: 'VO', obs: 'Manutenção: 75mg/dia por 12 meses. >75 anos: 75mg sem dose de ataque na fibrinólise.' },
      { nome: 'Tenecteplase', dose: 'Peso-ajustada (30-50mg)', via: 'IV bolus único', obs: '<60kg: 30mg | 60-69kg: 35mg | 70-79kg: 40mg | 80-89kg: 45mg | ≥90kg: 50mg' },
      { nome: 'Heparina NF', dose: '60UI/kg (máx. 4.000UI) bolus', via: 'IV', obs: 'Seguido de 12UI/kg/h (máx. 1.000UI/h). TTPa alvo: 50-70s.' },
      { nome: 'Enoxaparina', dose: '1mg/kg SC 12/12h', via: 'SC', obs: 'Alternativa à HNF. >75 anos: 0,75mg/kg. ClCr <30: 1mg/kg 1x/dia.' },
      { nome: 'Morfina', dose: '2-4mg IV a cada 5-15 min', via: 'IV', obs: 'Apenas se dor refratária a nitrato. Cuidado com hipotensão.' },
    ]
  },
  {
    id: 'sepse', nome: 'Sepse e Choque Séptico', sigla: 'SSC', categoria: 'Emergência Clínica',
    descricao: 'Protocolo de Sepse conforme Surviving Sepsis Campaign 2021',
    referencia: 'Surviving Sepsis Campaign Guidelines 2021 (SCCM/ESICM) + ILAS Bundle Brasileiro',
    etapas: [
      { titulo: '1. Triagem (qSOFA/SOFA)', descricao: 'qSOFA ≥2: PAS ≤100mmHg, FR ≥22, GCS <15. SOFA ≥2 pontos acima do basal = Sepse. Lactato >2 mmol/L = suspeita de hipoperfusão.' },
      { titulo: '2. Bundle da 1ª Hora', descricao: 'Lactato sérico. Hemoculturas (2 pares) ANTES do ATB. Antibiótico de amplo espectro em até 1h. Cristaloide 30mL/kg se hipotensão ou lactato ≥4.', alerta: 'ATB na 1ª hora reduz mortalidade em 7,6% por hora de atraso!' },
      { titulo: '3. Ressuscitação Volêmica', descricao: 'Cristaloide 30mL/kg nas primeiras 3h. Reavaliar com: tempo de enchimento capilar, lactato seriado, ultrassom point-of-care (VCI, função cardíaca).' },
      { titulo: '4. Vasopressores', descricao: 'Se PAM <65mmHg após volume: Noradrenalina (1ª escolha). Alvo: PAM ≥65mmHg. Se refratário: Vasopressina 0,03UI/min. Se disfunção miocárdica: Dobutamina.' },
      { titulo: '5. Reavaliação em 6h', descricao: 'Lactato seriado (queda ≥20% em 2h). Diurese ≥0,5mL/kg/h. Reavaliar necessidade de volume. Escalonar/desescalonar ATB conforme culturas.' },
    ],
    drogas: [
      { nome: 'Noradrenalina', dose: '0,1-2 mcg/kg/min', via: 'IV (BIC)', obs: '1ª escolha. Acesso central preferencial. Pode iniciar em periférico.' },
      { nome: 'Vasopressina', dose: '0,03 UI/min (fixa)', via: 'IV (BIC)', obs: 'Adjuvante à noradrenalina. Não titular.' },
      { nome: 'Hidrocortisona', dose: '200mg/dia (50mg 6/6h)', via: 'IV', obs: 'Choque refratário a vasopressores (>0,25mcg/kg/min de nora por >4h).' },
      { nome: 'Meropenem', dose: '1-2g IV 8/8h', via: 'IV', obs: 'Sepse nosocomial/MDR. Comunitária: Ceftriaxona 2g + Azitromicina.' },
    ]
  },
  {
    id: 'anafilaxia', nome: 'Anafilaxia', sigla: 'ANAF', categoria: 'Emergência Clínica',
    descricao: 'Protocolo de Anafilaxia conforme WAO/EAACI 2021',
    referencia: 'World Allergy Organization (WAO) Anaphylaxis Guidelines 2021 + EAACI 2021',
    etapas: [
      { titulo: '1. Reconhecimento', descricao: 'Início agudo (minutos a horas) com envolvimento de pele/mucosas + pelo menos 1: comprometimento respiratório (dispneia, sibilos, estridor) OU cardiovascular (hipotensão, síncope).' },
      { titulo: '2. Adrenalina IM', descricao: 'IMEDIATAMENTE: Adrenalina 0,3-0,5mg IM no vasto lateral da coxa. Pode repetir a cada 5-15 min se necessário.', alerta: 'Adrenalina IM é a ÚNICA droga que salva vida na anafilaxia. NÃO atrasar!' },
      { titulo: '3. Posicionamento', descricao: 'Decúbito dorsal com MMII elevados (se hipotensão). Sentado se dispneia predominante. NUNCA colocar em pé subitamente (risco de PCR por empty ventricle).' },
      { titulo: '4. Medidas Adjuvantes', descricao: 'O2 alto fluxo. Acesso venoso calibroso. SF 0,9% 1-2L rápido (adulto) ou 20mL/kg (criança). Salbutamol inalatório se broncoespasmo.' },
      { titulo: '5. Observação', descricao: 'Mínimo 6-8h (risco de reação bifásica em 5-20%). Prescrever auto-injetor de adrenalina. Encaminhar ao alergista.' },
    ],
    drogas: [
      { nome: 'Adrenalina', dose: '0,3-0,5mg (adulto) / 0,01mg/kg (criança)', via: 'IM (vasto lateral)', obs: 'Solução 1:1.000 (1mg/mL). Repetir a cada 5-15 min. Máx. pediátrico: 0,3mg.' },
      { nome: 'Salbutamol', dose: '5mg (20 gotas) nebulização', via: 'Inalatória', obs: 'Se broncoespasmo refratário à adrenalina.' },
      { nome: 'Difenidramina', dose: '25-50mg', via: 'IV/IM', obs: 'Anti-H1. Adjuvante, NÃO substitui adrenalina.' },
      { nome: 'Ranitidina', dose: '50mg', via: 'IV', obs: 'Anti-H2. Adjuvante. Alternativa: Famotidina 20mg IV.' },
      { nome: 'Metilprednisolona', dose: '1-2mg/kg', via: 'IV', obs: 'Prevenção de reação bifásica. Efeito em 4-6h.' },
    ]
  },
];

const CentralEmergencia: React.FC = () => {
  const [selectedProtocolo, setSelectedProtocolo] = useState<Protocolo | null>(null);
  const [tabProtocolo, setTabProtocolo] = useState<'etapas' | 'drogas'>('etapas');
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  const [busca, setBusca] = useState('');
  const [pesoKg, setPesoKg] = useState('');

  const categorias = ['Todos', 'ACLS', 'ATLS', 'PALS', 'Emergência Clínica'];
  const filtrados = protocolos.filter(p => {
    if (filtroCategoria !== 'Todos' && p.categoria !== filtroCategoria) return false;
    if (busca && !p.nome.toLowerCase().includes(busca.toLowerCase()) && !p.descricao.toLowerCase().includes(busca.toLowerCase())) return false;
    return true;
  });

  if (selectedProtocolo) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <EducationalDisclaimer moduleName="Central de Emergência" />
        <button onClick={() => setSelectedProtocolo(null)} className="text-emerald-400 hover:text-emerald-300">← Voltar aos Protocolos</button>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm font-bold">{selectedProtocolo.sigla}</span>
            <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-xs">{selectedProtocolo.categoria}</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">{selectedProtocolo.nome}</h2>
          <p className="text-gray-400 text-sm">{selectedProtocolo.descricao}</p>
          <p className="text-gray-600 text-xs mt-1">Ref: {selectedProtocolo.referencia}</p>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setTabProtocolo('etapas')} className={`px-4 py-2 rounded-lg text-sm font-medium ${tabProtocolo === 'etapas' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400 hover:text-white'}`}>📋 Etapas do Protocolo</button>
          <button onClick={() => setTabProtocolo('drogas')} className={`px-4 py-2 rounded-lg text-sm font-medium ${tabProtocolo === 'drogas' ? 'bg-red-500/20 text-red-400' : 'text-gray-400 hover:text-white'}`}>💊 Drogas e Doses</button>
        </div>

        {tabProtocolo === 'etapas' && (
          <div className="space-y-4">
            {selectedProtocolo.etapas.map((etapa, i) => (
              <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                <h3 className="text-emerald-400 font-bold text-lg mb-2">{etapa.titulo}</h3>
                <p className="text-gray-300 leading-relaxed">{etapa.descricao}</p>
                {etapa.alerta && (
                  <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm font-semibold">⚠️ {etapa.alerta}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tabProtocolo === 'drogas' && (
          <div className="space-y-4">
            {pesoKg === '' && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <label className="text-blue-300 text-sm block mb-2">Peso do paciente (para cálculo pediátrico):</label>
                <div className="flex gap-2">
                  <input type="number" placeholder="Peso em kg" onChange={e => setPesoKg(e.target.value)} className="bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2 w-32" />
                  <span className="text-gray-500 self-center text-sm">kg (opcional)</span>
                </div>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-gray-400 py-3 px-4">Droga</th>
                    <th className="text-left text-gray-400 py-3 px-4">Dose</th>
                    <th className="text-left text-gray-400 py-3 px-4">Via</th>
                    <th className="text-left text-gray-400 py-3 px-4">Observações</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProtocolo.drogas.map((droga, i) => (
                    <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="py-3 px-4 text-white font-medium">{droga.nome}</td>
                      <td className="py-3 px-4 text-emerald-400 font-mono">{droga.dose}</td>
                      <td className="py-3 px-4 text-yellow-400">{droga.via}</td>
                      <td className="py-3 px-4 text-gray-400">{droga.obs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-600 text-center p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
          ⚠️ Este conteúdo é exclusivamente para fins educacionais e de estudo. Em situações reais de emergência, siga os protocolos institucionais e a orientação do médico responsável.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <EducationalDisclaimer moduleName="Central de Emergência" />

      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">🚨 Central de Emergência</h1>
        <p className="text-gray-400">Protocolos ACLS, ATLS, PALS e Emergências Clínicas com doses e fluxogramas</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { cat: 'ACLS', icon: '❤️', desc: 'Suporte Avançado Cardíaco', cor: 'red' },
          { cat: 'ATLS', icon: '🩹', desc: 'Suporte Avançado ao Trauma', cor: 'orange' },
          { cat: 'PALS', icon: '👶', desc: 'Suporte Avançado Pediátrico', cor: 'blue' },
          { cat: 'Emergência Clínica', icon: '🏥', desc: 'Emergências Clínicas', cor: 'emerald' },
        ].map(c => (
          <button key={c.cat} onClick={() => setFiltroCategoria(filtroCategoria === c.cat ? 'Todos' : c.cat)} className={`p-4 rounded-xl border text-center transition-all ${filtroCategoria === c.cat ? `border-${c.cor}-500 bg-${c.cor}-500/10` : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'}`}>
            <div className="text-2xl mb-1">{c.icon}</div>
            <div className="text-white text-sm font-bold">{c.cat}</div>
            <div className="text-gray-500 text-xs">{c.desc}</div>
          </button>
        ))}
      </div>

      <input type="text" value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar protocolo..." className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-3" />

      <div className="space-y-3">
        {filtrados.map(p => (
          <button key={p.id} onClick={() => { setSelectedProtocolo(p); setTabProtocolo('etapas'); }} className="w-full text-left bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-emerald-500/50 transition-all">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs font-bold">{p.sigla}</span>
              <span className="px-2 py-0.5 bg-gray-700 text-gray-400 rounded text-xs">{p.categoria}</span>
              <span className="text-gray-600 text-xs">{p.etapas.length} etapas | {p.drogas.length} drogas</span>
            </div>
            <h3 className="text-white font-semibold">{p.nome}</h3>
            <p className="text-gray-500 text-sm mt-1">{p.descricao}</p>
            <p className="text-gray-600 text-xs mt-1">{p.referencia}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CentralEmergencia;
