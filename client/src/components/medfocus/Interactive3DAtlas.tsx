/**
 * MedFocus Atlas 3D Interativo Nativo v1.0
 * 
 * Sistema 3D interativo completo usando Three.js puro — sem dependência de sites externos.
 * O aluno clica nas estruturas anatômicas e visualiza legendas, detalhes, funções,
 * patologias, irrigação, inervação e notas clínicas.
 * 
 * REFERÊNCIAS:
 * [1] Netter, F.H. Atlas de Anatomia Humana, 7ª ed. Elsevier, 2019.
 * [2] Gray, H. Gray's Anatomy, 42nd ed. Elsevier, 2020.
 * [3] Sobotta, J. Atlas de Anatomia Humana, 24ª ed. Elsevier, 2018.
 * [4] Moore, K.L. Anatomia Orientada para a Clínica, 8ª ed. Guanabara Koogan, 2019.
 * [5] Guyton, A.C. Tratado de Fisiologia Médica, 14ª ed. Elsevier, 2021.
 */

import React, { useState, useRef, useCallback, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Html, Text, Environment, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';

// ============================================================
// TYPES
// ============================================================
interface AnatomyStructure {
  id: string;
  name: string;
  latinName: string;
  system: string;
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  highlightColor: string;
  shape: 'sphere' | 'ellipsoid' | 'cylinder' | 'torus' | 'box' | 'cone' | 'capsule' | 'custom';
  rotation?: [number, number, number];
  description: string;
  functions: string[];
  bloodSupply: string;
  innervation: string;
  pathologies: string[];
  clinicalNotes: string[];
  histology: string;
  examTips: string[];
  references: string[];
  children?: AnatomyStructure[];
}

interface BodySystem {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  structures: AnatomyStructure[];
}

// ============================================================
// COMPREHENSIVE ANATOMY DATABASE
// ============================================================
const ANATOMY_SYSTEMS: BodySystem[] = [
  {
    id: 'cardiovascular',
    name: 'Sistema Cardiovascular',
    icon: '❤️',
    color: '#EF4444',
    description: 'Coração, artérias, veias e capilares. Responsável pelo transporte de sangue, nutrientes e oxigênio.',
    structures: [
      {
        id: 'heart', name: 'Coração', latinName: 'Cor', system: 'cardiovascular',
        position: [0.1, 1.2, 0.3], scale: [0.35, 0.38, 0.3], color: '#CC2222', highlightColor: '#FF4444',
        shape: 'custom', rotation: [0, 0, -0.2],
        description: 'Órgão muscular oco com 4 câmaras (2 átrios, 2 ventrículos). Peso médio: 250-350g. Localizado no mediastino médio.',
        functions: ['Bombeamento de sangue para circulação sistêmica e pulmonar', 'Débito cardíaco: ~5L/min em repouso', 'Automatismo: nó sinoatrial (marcapasso natural)', 'Ciclo cardíaco: sístole atrial → sístole ventricular → diástole'],
        bloodSupply: 'Artérias coronárias direita e esquerda (ramos da aorta ascendente). A. coronária esquerda → A. descendente anterior + A. circunflexa.',
        innervation: 'Simpático (T1-T5): aumenta FC e contratilidade. Parassimpático (nervo vago): diminui FC. Plexo cardíaco.',
        pathologies: ['Infarto agudo do miocárdio (IAM)', 'Insuficiência cardíaca congestiva (ICC)', 'Arritmias (FA, FV, BAV)', 'Valvopatias (estenose/insuficiência mitral, aórtica)', 'Endocardite infecciosa', 'Pericardite'],
        clinicalNotes: ['Dor precordial típica: opressiva, retroesternal, irradia para MSE e mandíbula', 'Troponina I/T: marcador de necrose miocárdica', 'ECG: supradesnivelamento de ST = IAM com supra', 'Ausculta: B1 (fechamento mitral/tricúspide), B2 (fechamento aórtica/pulmonar)'],
        histology: 'Miocárdio: músculo estriado cardíaco com discos intercalares (gap junctions). Endocárdio: endotélio + tecido conjuntivo. Epicárdio: mesotélio.',
        examTips: ['Focos de ausculta: aórtico (2ºEID), pulmonar (2ºEIE), tricúspide (4ºEIE), mitral (5ºEIE LHC)', 'Sopro sistólico: estenose aórtica, insuficiência mitral', 'Sopro diastólico: estenose mitral, insuficiência aórtica'],
        references: ['Netter [1] Prancha 216-230', 'Gray [2] Cap.56', 'Guyton [5] Cap.9-13']
      },
      {
        id: 'aorta', name: 'Aorta', latinName: 'Aorta', system: 'cardiovascular',
        position: [0.05, 1.6, 0.15], scale: [0.06, 0.5, 0.06], color: '#DD3333', highlightColor: '#FF5555',
        shape: 'cylinder', rotation: [0, 0, 0.05],
        description: 'Maior artéria do corpo. Origina-se do ventrículo esquerdo. Diâmetro: ~2.5cm. Partes: ascendente, arco, descendente (torácica + abdominal).',
        functions: ['Distribuição de sangue oxigenado para todo o corpo', 'Função de reservatório elástico (Windkessel)', 'Manutenção da pressão arterial durante a diástole'],
        bloodSupply: 'Vasa vasorum (pequenos vasos na adventícia e média)',
        innervation: 'Barorreceptores no arco aórtico (nervo vago) — regulação reflexa da PA',
        pathologies: ['Aneurisma de aorta (torácico/abdominal)', 'Dissecção aórtica (emergência!)', 'Coarctação da aorta (congênita)', 'Aterosclerose aórtica'],
        clinicalNotes: ['Dissecção: dor torácica "rasgando", irradiação dorsal, PA diferente nos MMSS', 'Aneurisma abdominal: massa pulsátil periumbilical', 'Coarctação: hipertensão em MMSS, hipotensão em MMII'],
        histology: 'Artéria elástica: túnica média com múltiplas lâminas elásticas. Túnica íntima com endotélio. Adventícia com vasa vasorum.',
        examTips: ['Aneurisma >5.5cm: indicação cirúrgica', 'Classificação de Stanford: Tipo A (aorta ascendente) = cirurgia; Tipo B = clínico'],
        references: ['Netter [1] Prancha 231-235', 'Gray [2] Cap.57']
      },
      {
        id: 'vena_cava_sup', name: 'Veia Cava Superior', latinName: 'Vena cava superior', system: 'cardiovascular',
        position: [0.15, 1.65, 0.2], scale: [0.05, 0.3, 0.05], color: '#3344AA', highlightColor: '#5566DD',
        shape: 'cylinder',
        description: 'Drena sangue venoso da cabeça, pescoço, MMSS e tórax superior para o átrio direito. Formada pela junção das veias braquiocefálicas D e E.',
        functions: ['Retorno venoso da metade superior do corpo', 'Drena para o átrio direito'],
        bloodSupply: 'Vasa vasorum',
        innervation: 'Fibras simpáticas e parassimpáticas',
        pathologies: ['Síndrome da veia cava superior (compressão tumoral)', 'Trombose de VCS'],
        clinicalNotes: ['Síndrome da VCS: edema facial, pletora, circulação colateral torácica, dispneia', 'Causa mais comum: câncer de pulmão (carcinoma broncogênico)'],
        histology: 'Veia de grande calibre: túnica média fina, adventícia espessa com vasa vasorum.',
        examTips: ['Sinal de Pemberton: elevação dos MMSS → congestão facial'],
        references: ['Netter [1] Prancha 236', 'Gray [2] Cap.57']
      }
    ]
  },
  {
    id: 'respiratory',
    name: 'Sistema Respiratório',
    icon: '🫁',
    color: '#EC4899',
    description: 'Pulmões, vias aéreas e estruturas de troca gasosa. Responsável pela hematose (troca O₂/CO₂).',
    structures: [
      {
        id: 'lung_right', name: 'Pulmão Direito', latinName: 'Pulmo dexter', system: 'respiratory',
        position: [0.35, 1.15, 0.15], scale: [0.28, 0.4, 0.22], color: '#F472B6', highlightColor: '#F9A8D4',
        shape: 'ellipsoid',
        description: '3 lobos (superior, médio, inferior), separados por fissuras oblíqua e horizontal. Mais curto e largo que o esquerdo (cúpula diafragmática direita mais alta pelo fígado).',
        functions: ['Hematose: troca de O₂ e CO₂ nos alvéolos', 'Área de troca gasosa: ~70m²', 'Produção de surfactante (pneumócitos tipo II)', 'Defesa imunológica (macrófagos alveolares)'],
        bloodSupply: 'Artérias pulmonares (sangue venoso para hematose). Artérias brônquicas (nutrição do parênquima). Veias pulmonares → átrio esquerdo.',
        innervation: 'Plexo pulmonar: simpático (broncodilatação) e parassimpático/vago (broncoconstrição). Receptores de estiramento (reflexo de Hering-Breuer).',
        pathologies: ['Pneumonia', 'DPOC (enfisema/bronquite crônica)', 'Asma', 'Câncer de pulmão', 'Embolia pulmonar (TEP)', 'Pneumotórax', 'Derrame pleural', 'Fibrose pulmonar'],
        clinicalNotes: ['Pneumonia: febre, tosse produtiva, crepitações, consolidação no RX', 'TEP: dispneia súbita, dor pleurítica, taquicardia. D-dímero + angioTC', 'Pneumotórax hipertensivo: desvio de traqueia, MV abolido, hipotensão'],
        histology: 'Alvéolos: pneumócitos tipo I (troca gasosa, 95% da superfície) e tipo II (surfactante). Membrana alvéolo-capilar: 0.2-0.5μm.',
        examTips: ['Pulmão D: 3 lobos, 10 segmentos', 'Corpo estranho: mais comum no brônquio principal direito (mais vertical e calibroso)', 'Ápice pulmonar: tumor de Pancoast → síndrome de Horner'],
        references: ['Netter [1] Prancha 196-210', 'Gray [2] Cap.54', 'Guyton [5] Cap.38-42']
      },
      {
        id: 'lung_left', name: 'Pulmão Esquerdo', latinName: 'Pulmo sinister', system: 'respiratory',
        position: [-0.35, 1.15, 0.15], scale: [0.25, 0.4, 0.22], color: '#F472B6', highlightColor: '#F9A8D4',
        shape: 'ellipsoid',
        description: '2 lobos (superior e inferior), separados pela fissura oblíqua. Possui a incisura cardíaca e a língula. Menor que o direito pela presença do coração.',
        functions: ['Hematose: troca de O₂ e CO₂ nos alvéolos', 'Área de troca gasosa: ~70m²', 'Produção de surfactante', 'Defesa imunológica pulmonar'],
        bloodSupply: 'Artérias pulmonares esquerdas. Artérias brônquicas. Veias pulmonares → átrio esquerdo.',
        innervation: 'Plexo pulmonar esquerdo. Nervo frênico esquerdo (C3-C5): diafragma. Nervo laríngeo recorrente esquerdo: contorna o arco aórtico.',
        pathologies: ['Mesmas do pulmão direito', 'Lesão do nervo laríngeo recorrente E em cirurgias torácicas → rouquidão'],
        clinicalNotes: ['Pulmão E: 2 lobos, 8-10 segmentos', 'Língula: equivalente ao lobo médio direito', 'Incisura cardíaca: impressão do coração na face medial'],
        histology: 'Idêntica ao pulmão direito. Epitélio respiratório (pseudoestratificado ciliado) nas vias aéreas.',
        examTips: ['Nervo laríngeo recorrente E: risco em cirurgias de tireoide e tórax'],
        references: ['Netter [1] Prancha 196-210', 'Gray [2] Cap.54']
      },
      {
        id: 'trachea', name: 'Traqueia', latinName: 'Trachea', system: 'respiratory',
        position: [0, 1.65, 0.12], scale: [0.06, 0.25, 0.06], color: '#FCA5A5', highlightColor: '#FCD5D5',
        shape: 'cylinder',
        description: 'Tubo cartilaginoso de ~11cm, com 16-20 anéis em forma de C. Vai da laringe (C6) até a carina (T4-T5), onde se bifurca nos brônquios principais.',
        functions: ['Condução de ar entre laringe e brônquios', 'Aquecimento e umidificação do ar', 'Defesa mucociliar (escalador mucociliar)'],
        bloodSupply: 'Artérias tireóideas inferiores e artérias brônquicas',
        innervation: 'Nervo vago e nervo laríngeo recorrente',
        pathologies: ['Traqueíte', 'Estenose traqueal (pós-intubação)', 'Traqueomalácia', 'Corpo estranho'],
        clinicalNotes: ['Traqueostomia: entre 2º e 3º anéis traqueais', 'Intubação orotraqueal: tubo posicionado 2-4cm acima da carina', 'Carina: nível de T4-T5 (ângulo de Louis)'],
        histology: 'Epitélio respiratório pseudoestratificado ciliado com células caliciformes. Cartilagem hialina (anéis em C). Músculo traqueal (posterior).',
        examTips: ['Ângulo de Louis (T4-T5): referência para carina, arco aórtico, bifurcação traqueal'],
        references: ['Netter [1] Prancha 194-195', 'Gray [2] Cap.53']
      }
    ]
  },
  {
    id: 'digestive',
    name: 'Sistema Digestório',
    icon: '🫘',
    color: '#F59E0B',
    description: 'Trato gastrointestinal e glândulas anexas. Digestão, absorção de nutrientes e eliminação de resíduos.',
    structures: [
      {
        id: 'liver', name: 'Fígado', latinName: 'Hepar', system: 'digestive',
        position: [0.3, 0.75, 0.2], scale: [0.35, 0.2, 0.25], color: '#92400E', highlightColor: '#B45309',
        shape: 'ellipsoid', rotation: [0, 0, -0.15],
        description: 'Maior glândula do corpo (~1.5kg). Localizado no hipocôndrio direito. 4 lobos anatômicos (D, E, caudado, quadrado). 8 segmentos de Couinaud.',
        functions: ['Metabolismo de carboidratos, lipídios e proteínas', 'Detoxificação (citocromo P450)', 'Produção de bile (600-1000mL/dia)', 'Síntese de albumina, fatores de coagulação, complemento', 'Armazenamento de glicogênio, ferro, vitaminas A, D, B12', 'Metabolismo de bilirrubina'],
        bloodSupply: 'Dupla irrigação: artéria hepática própria (25% do fluxo, sangue oxigenado) + veia porta (75% do fluxo, sangue rico em nutrientes do TGI). Drenagem: veias hepáticas → VCI.',
        innervation: 'Plexo hepático (simpático + parassimpático/vago). Cápsula de Glisson: inervação somática (dor referida no ombro D — nervo frênico).',
        pathologies: ['Hepatite (viral A/B/C, alcoólica, medicamentosa)', 'Cirrose hepática', 'Esteatose hepática (DHGNA)', 'Carcinoma hepatocelular (CHC)', 'Abscesso hepático', 'Hipertensão portal'],
        clinicalNotes: ['Sinal de Murphy: dor à palpação do hipocôndrio D durante inspiração (colecistite)', 'Ascite: hipertensão portal → transudação peritoneal', 'Encefalopatia hepática: amônia elevada → flapping/asterixis', 'Child-Pugh: classificação de gravidade da cirrose'],
        histology: 'Lóbulos hepáticos hexagonais com hepatócitos radiados. Tríade portal: ramo da veia porta + ramo da artéria hepática + ducto biliar. Sinusoides hepáticos com células de Kupffer.',
        examTips: ['Segmentos de Couinaud: I-VIII (importante para cirurgia)', 'Ligamento falciforme: divide lobos D e E anatomicamente', 'Espaço de Disse: entre hepatócitos e sinusoides'],
        references: ['Netter [1] Prancha 281-290', 'Gray [2] Cap.63', 'Moore [4] Cap.5']
      },
      {
        id: 'stomach', name: 'Estômago', latinName: 'Gaster/Ventriculus', system: 'digestive',
        position: [-0.1, 0.75, 0.25], scale: [0.22, 0.25, 0.18], color: '#D97706', highlightColor: '#F59E0B',
        shape: 'ellipsoid', rotation: [0, 0, 0.3],
        description: 'Órgão muscular em forma de J. Partes: cárdia, fundo, corpo, antro, piloro. Capacidade: ~1.5L. pH gástrico: 1.5-3.5.',
        functions: ['Digestão mecânica (contrações peristálticas)', 'Digestão química (HCl + pepsina)', 'Secreção de fator intrínseco (absorção de B12)', 'Barreira antimicrobiana (pH ácido)', 'Secreção de grelina (hormônio da fome)'],
        bloodSupply: 'Tronco celíaco → A. gástrica E, A. esplênica, A. hepática comum. Artérias gástricas D e E (curvatura menor), gastroomentais D e E (curvatura maior), gástricas curtas.',
        innervation: 'Parassimpático (nervo vago): estimula secreção e motilidade. Simpático (T6-T9): inibe. Plexos de Auerbach (mioentérico) e Meissner (submucoso).',
        pathologies: ['Gastrite (H. pylori, AINE, autoimune)', 'Úlcera péptica', 'Adenocarcinoma gástrico', 'GIST (tumor estromal gastrointestinal)', 'Estenose pilórica hipertrófica (neonatal)'],
        clinicalNotes: ['Úlcera duodenal: dor epigástrica que melhora com alimentação', 'Úlcera gástrica: dor que piora com alimentação', 'H. pylori: teste da urease, erradicação com IBP + claritromicina + amoxicilina'],
        histology: 'Mucosa gástrica com fossetas e glândulas. Células parietais (HCl + fator intrínseco), células principais (pepsinogênio), células mucosas, células G (gastrina), células D (somatostatina).',
        examTips: ['Vagotomia: reduz secreção ácida (tratamento histórico de úlcera)', 'Linfonodo de Virchow (supraclavicular E): metástase gástrica'],
        references: ['Netter [1] Prancha 267-275', 'Gray [2] Cap.62', 'Guyton [5] Cap.64-66']
      },
      {
        id: 'intestine_small', name: 'Intestino Delgado', latinName: 'Intestinum tenue', system: 'digestive',
        position: [0, 0.35, 0.2], scale: [0.35, 0.25, 0.2], color: '#FBBF24', highlightColor: '#FDE68A',
        shape: 'ellipsoid',
        description: 'Tubo de ~6m. Partes: duodeno (25cm, retroperitoneal), jejuno (~2.5m) e íleo (~3.5m). Principal local de absorção de nutrientes.',
        functions: ['Digestão final (enzimas pancreáticas + bile)', 'Absorção de nutrientes (vilosidades e microvilosidades)', 'Absorção de água e eletrólitos', 'Secreção de hormônios (CCK, secretina, GIP)', 'Defesa imunológica (placas de Peyer no íleo)'],
        bloodSupply: 'Duodeno: artérias pancreaticoduodenais (tronco celíaco + AMS). Jejuno e íleo: artérias jejunais e ileais (ramos da AMS). Arcadas arteriais e vasos retos.',
        innervation: 'Parassimpático (vago): estimula motilidade e secreção. Simpático (T9-T12): inibe. Sistema nervoso entérico (plexos mioentérico e submucoso).',
        pathologies: ['Doença celíaca', 'Doença de Crohn (íleo terminal)', 'Obstrução intestinal', 'Divertículo de Meckel', 'Síndrome do intestino curto', 'Tumores carcinoides'],
        clinicalNotes: ['Doença celíaca: anti-transglutaminase IgA, biópsia duodenal (atrofia vilositária)', 'Crohn: dor em FID, diarreia, fístulas, "pedras de calçamento" na endoscopia', 'Divertículo de Meckel: regra dos 2 (2% da população, 2 pés do íleo, 2 polegadas)'],
        histology: 'Vilosidades intestinais (aumentam área absortiva 600x). Criptas de Lieberkühn. Células de Paneth (defensinas). Células caliciformes (muco). Células enteroendócrinas.',
        examTips: ['Jejuno: pregas circulares proeminentes, arcadas simples, vasos retos longos', 'Íleo: placas de Peyer, arcadas múltiplas, vasos retos curtos', 'Ligamento de Treitz: transição duodeno-jejunal'],
        references: ['Netter [1] Prancha 276-280', 'Gray [2] Cap.64-65']
      },
      {
        id: 'kidneys', name: 'Rins', latinName: 'Renes', system: 'digestive',
        position: [0.25, 0.55, -0.15], scale: [0.12, 0.18, 0.1], color: '#7C3AED', highlightColor: '#A78BFA',
        shape: 'ellipsoid',
        description: 'Órgãos retroperitoneais em forma de feijão (~12x6x3cm, ~150g cada). Rim D mais baixo que o E (fígado). ~1 milhão de néfrons cada.',
        functions: ['Filtração glomerular (~180L/dia, TFG ~125mL/min)', 'Regulação do equilíbrio hidroeletrolítico', 'Regulação ácido-base', 'Produção de eritropoietina (EPO)', 'Ativação da vitamina D (1,25-dihidroxivitamina D)', 'Regulação da pressão arterial (sistema renina-angiotensina-aldosterona)'],
        bloodSupply: 'Artérias renais (ramos diretos da aorta abdominal, nível L1-L2). A. renal → segmentares → interlobares → arqueadas → interlobulares → arteríolas aferentes → glomérulos.',
        innervation: 'Plexo renal (simpático T10-L1): vasoconstrição, liberação de renina. Aferentes viscerais: dor referida no flanco e região lombar.',
        pathologies: ['Insuficiência renal aguda (IRA) e crônica (IRC)', 'Glomerulonefrites', 'Nefrolitíase (cálculos renais)', 'Pielonefrite', 'Carcinoma de células renais', 'Doença policística renal', 'Síndrome nefrótica e nefrítica'],
        clinicalNotes: ['Sinal de Giordano: punho-percussão lombar positiva (pielonefrite, litíase)', 'Creatinina e TFG: marcadores de função renal', 'Cólica renal: dor lombar intensa irradiando para virilha', 'Hematúria + massa palpável + dor lombar: tríade do carcinoma renal'],
        histology: 'Néfron: glomérulo (cápsula de Bowman) + túbulo contorcido proximal + alça de Henle + túbulo contorcido distal + ducto coletor. Aparelho justaglomerular (renina).',
        examTips: ['Rim D mais baixo que E', 'Artéria renal E mais longa que D', 'Veia renal E recebe a veia gonadal E e a veia suprarrenal E'],
        references: ['Netter [1] Prancha 321-335', 'Gray [2] Cap.67', 'Guyton [5] Cap.26-31']
      }
    ]
  },
  {
    id: 'nervous',
    name: 'Sistema Nervoso',
    icon: '🧠',
    color: '#EAB308',
    description: 'Encéfalo, medula espinhal, nervos cranianos e periféricos. Controle e integração de todas as funções corporais.',
    structures: [
      {
        id: 'brain', name: 'Cérebro', latinName: 'Cerebrum', system: 'nervous',
        position: [0, 2.1, 0.05], scale: [0.3, 0.22, 0.25], color: '#FBBF24', highlightColor: '#FDE68A',
        shape: 'ellipsoid',
        description: 'Maior parte do encéfalo (~1.4kg). 2 hemisférios com 4 lobos cada (frontal, parietal, temporal, occipital). Córtex cerebral com ~86 bilhões de neurônios.',
        functions: ['Funções cognitivas superiores (pensamento, linguagem, memória)', 'Controle motor voluntário (córtex motor primário)', 'Processamento sensorial (córtex somatossensorial)', 'Lobo frontal: planejamento, personalidade, área de Broca (fala)', 'Lobo temporal: audição, memória, área de Wernicke (compreensão)', 'Lobo occipital: visão', 'Lobo parietal: sensibilidade, propriocepção'],
        bloodSupply: 'Polígono de Willis: artérias cerebrais anterior, média e posterior. Carótidas internas + artérias vertebrais/basilar. Barreira hematoencefálica.',
        innervation: 'Auto-inervação: circuitos corticais e subcorticais. 12 pares de nervos cranianos originam-se do tronco encefálico.',
        pathologies: ['AVC isquêmico e hemorrágico', 'Epilepsia', 'Doença de Alzheimer', 'Doença de Parkinson', 'Tumores cerebrais (glioblastoma, meningioma)', 'Meningite', 'Encefalite', 'Hidrocefalia'],
        clinicalNotes: ['AVC: tempo é cérebro! Janela trombolítica: 4.5h', 'NIHSS: escala de gravidade do AVC', 'Afasia de Broca: entende mas não fala (lobo frontal E)', 'Afasia de Wernicke: fala mas não entende (lobo temporal E)', 'Pupilas: III par (oculomotor) — midríase = herniação uncal'],
        histology: 'Córtex cerebral: 6 camadas de neurônios (neocórtex). Substância cinzenta (corpos celulares) e branca (axônios mielinizados). Células gliais: astrócitos, oligodendrócitos, micróglia.',
        examTips: ['Artéria cerebral média: AVC mais comum, hemiplegia contralateral + afasia (se hemisfério dominante)', 'Herniação uncal: midríase ipsilateral + hemiplegia contralateral', 'Glasgow: abertura ocular + resposta verbal + resposta motora (3-15)'],
        references: ['Netter [1] Prancha 100-120', 'Gray [2] Cap.25-30', 'Guyton [5] Cap.46-60']
      },
      {
        id: 'spinal_cord', name: 'Medula Espinhal', latinName: 'Medulla spinalis', system: 'nervous',
        position: [0, 1.2, -0.2], scale: [0.04, 0.8, 0.04], color: '#FDE047', highlightColor: '#FEF08A',
        shape: 'cylinder',
        description: 'Estrutura cilíndrica de ~45cm (forame magno até L1-L2). 31 pares de nervos espinhais. Intumescências cervical (C4-T1) e lombar (L1-S3).',
        functions: ['Condução de impulsos aferentes (sensitivos) e eferentes (motores)', 'Arcos reflexos (reflexo patelar, reflexo de retirada)', 'Centro de integração de reflexos autônomos'],
        bloodSupply: 'Artéria espinhal anterior (2/3 anteriores) e artérias espinhais posteriores (1/3 posterior). Artéria de Adamkiewicz (T9-T12): principal artéria radicular.',
        innervation: 'Raízes dorsais (sensitivas) e ventrais (motoras). Gânglios das raízes dorsais.',
        pathologies: ['Lesão medular traumática', 'Mielite transversa', 'Esclerose múltipla', 'Siringomielia', 'Síndrome da cauda equina', 'Hérnia de disco'],
        clinicalNotes: ['Síndrome de Brown-Séquard: hemisecção medular', 'Síndrome da cauda equina: emergência! Anestesia em sela, retenção urinária', 'Punção lombar: L3-L4 ou L4-L5 (abaixo do cone medular)'],
        histology: 'Substância cinzenta central (H): cornos anterior (motor), posterior (sensitivo), lateral (autônomo). Substância branca periférica: fascículos e tratos.',
        examTips: ['Cone medular: L1-L2', 'Filum terminale: até o cóccix', 'Dermátomos: C5=deltóide, T4=mamilo, T10=umbigo, L4=joelho, S1=planta do pé'],
        references: ['Netter [1] Prancha 160-170', 'Gray [2] Cap.43-44']
      }
    ]
  },
  {
    id: 'skeletal',
    name: 'Sistema Esquelético',
    icon: '🦴',
    color: '#F5F0E0',
    description: '206 ossos no adulto. Sustentação, proteção, movimento, hematopoiese e reserva mineral.',
    structures: [
      {
        id: 'skull', name: 'Crânio', latinName: 'Cranium', system: 'skeletal',
        position: [0, 2.15, 0.05], scale: [0.22, 0.24, 0.22], color: '#FEF3C7', highlightColor: '#FFFBEB',
        shape: 'sphere',
        description: '22 ossos (8 do neurocrânio + 14 do viscerocrânio). Protege o encéfalo. Suturas: sagital, coronal, lambdóidea, escamosa. Fontanelas no RN.',
        functions: ['Proteção do encéfalo e órgãos dos sentidos', 'Inserção de músculos da mastigação e expressão facial', 'Formação das cavidades nasal e orbital'],
        bloodSupply: 'Artérias meníngeas (média: ramo da maxilar). Díploe: veias diploicas.',
        innervation: 'Nervos cranianos V (trigêmeo: sensibilidade facial), VII (facial: expressão)',
        pathologies: ['Fraturas de base de crânio', 'Hematoma epidural (artéria meníngea média)', 'Hematoma subdural (veias ponte)', 'Craniossinostose'],
        clinicalNotes: ['Hematoma epidural: intervalo lúcido, pupila fixa ipsilateral, imagem em lente biconvexa na TC', 'Hematoma subdural: imagem em crescente na TC, mais comum em idosos/etilistas', 'Sinal de Battle (equimose mastóidea): fratura de base de crânio'],
        histology: 'Osso plano: tábua externa + díploe (osso esponjoso) + tábua interna. Ossificação intramembranosa.',
        examTips: ['Fontanela anterior (bregmática): fecha aos 18 meses', 'Pterion: ponto mais frágil do crânio (artéria meníngea média)'],
        references: ['Netter [1] Prancha 1-15', 'Gray [2] Cap.26-28']
      },
      {
        id: 'spine', name: 'Coluna Vertebral', latinName: 'Columna vertebralis', system: 'skeletal',
        position: [0, 1.0, -0.2], scale: [0.08, 0.9, 0.08], color: '#FEF3C7', highlightColor: '#FFFBEB',
        shape: 'cylinder',
        description: '33 vértebras: 7 cervicais, 12 torácicas, 5 lombares, 5 sacrais (fundidas), 4 coccígeas (fundidas). Curvaturas: lordose cervical e lombar, cifose torácica e sacral.',
        functions: ['Sustentação do corpo e cabeça', 'Proteção da medula espinhal', 'Absorção de impactos (discos intervertebrais)', 'Movimento do tronco (flexão, extensão, rotação)'],
        bloodSupply: 'Artérias segmentares (intercostais, lombares). Plexo venoso vertebral de Batson (sem válvulas — via de metástases).',
        innervation: 'Nervos espinhais emergem pelos forames intervertebrais',
        pathologies: ['Hérnia de disco (L4-L5 e L5-S1 mais comuns)', 'Espondilolistese', 'Estenose do canal vertebral', 'Escoliose', 'Fratura vertebral (osteoporose)', 'Espondilite anquilosante'],
        clinicalNotes: ['Hérnia L4-L5: comprime raiz L5 (dorsiflexão do pé)', 'Hérnia L5-S1: comprime raiz S1 (reflexo aquileu)', 'Lasègue positivo: dor ciática ao elevar MMII estendido'],
        histology: 'Corpo vertebral: osso esponjoso com medula óssea. Disco intervertebral: anel fibroso (fibrocartilagem) + núcleo pulposo (gelatinoso).',
        examTips: ['C1 (atlas): sem corpo vertebral', 'C2 (áxis): processo odontoide', 'C7: vértebra proeminente (processo espinhoso longo e palpável)'],
        references: ['Netter [1] Prancha 153-159', 'Gray [2] Cap.42', 'Moore [4] Cap.4']
      }
    ]
  },
  {
    id: 'muscular',
    name: 'Sistema Muscular',
    icon: '💪',
    color: '#DC2626',
    description: '~600 músculos esqueléticos. Movimento, postura, produção de calor e proteção.',
    structures: [
      {
        id: 'diaphragm', name: 'Diafragma', latinName: 'Diaphragma', system: 'muscular',
        position: [0, 0.9, 0.1], scale: [0.5, 0.06, 0.35], color: '#DC2626', highlightColor: '#EF4444',
        shape: 'ellipsoid',
        description: 'Principal músculo da respiração. Separa cavidade torácica da abdominal. Forma de cúpula. Hiatos: aórtico (T12), esofágico (T10), da VCI (T8).',
        functions: ['Inspiração: contração → abaixamento → aumento do volume torácico → pressão negativa', 'Responsável por ~75% da ventilação em repouso', 'Auxílio na tosse, espirro, vômito, defecação (aumento da pressão abdominal)'],
        bloodSupply: 'Artérias frênicas superiores (aorta torácica) e inferiores (aorta abdominal). Artérias musculofrênicas e pericardiofrênicas.',
        innervation: 'Nervo frênico (C3, C4, C5 — "C3, 4, 5 keeps the diaphragm alive"). Motor e sensitivo (porção central).',
        pathologies: ['Hérnia diafragmática (congênita de Bochdalek — posterolateral E)', 'Hérnia hiatal (deslizamento ou paraesofágica)', 'Paralisia diafragmática (lesão do nervo frênico)', 'Eventração diafragmática'],
        clinicalNotes: ['Soluço: contração espasmódica involuntária do diafragma', 'Paralisia frênica: elevação da hemicúpula no RX, movimento paradoxal (fluoroscopia)', 'Hérnia de Bochdalek: mais comum à E (80%), emergência neonatal'],
        histology: 'Músculo estriado esquelético com tendão central (centro frênico). Fibras musculares tipo I (resistência) predominantes.',
        examTips: ['T8: VCI, T10: esôfago + vagos, T12: aorta + ducto torácico + veia ázigos', 'Mnemônico: "I 8 10 EGGs AT 12" (IVC=8, Esophagus=10, Aorta=12)'],
        references: ['Netter [1] Prancha 191-193', 'Gray [2] Cap.52', 'Moore [4] Cap.4']
      }
    ]
  },
  {
    id: 'endocrine',
    name: 'Sistema Endócrino',
    icon: '🦋',
    color: '#8B5CF6',
    description: 'Glândulas endócrinas e hormônios. Regulação do metabolismo, crescimento, reprodução e homeostase.',
    structures: [
      {
        id: 'thyroid', name: 'Tireoide', latinName: 'Glandula thyroidea', system: 'endocrine',
        position: [0, 1.75, 0.2], scale: [0.12, 0.06, 0.06], color: '#8B5CF6', highlightColor: '#A78BFA',
        shape: 'ellipsoid',
        description: 'Glândula em forma de borboleta na região cervical anterior (C5-T1). 2 lobos + istmo. Peso: 15-25g. Maior glândula endócrina.',
        functions: ['Produção de T3 (triiodotironina) e T4 (tiroxina): metabolismo basal', 'Produção de calcitonina (células C/parafoliculares): reduz cálcio sérico', 'Regulação da termogênese', 'Essencial para desenvolvimento neurológico fetal/neonatal'],
        bloodSupply: 'Artérias tireóideas superiores (carótida externa) e inferiores (tronco tireocervical). Artéria tireóidea ima (variante, 10%).',
        innervation: 'Simpático (gânglios cervicais). Nervo laríngeo recorrente (posterior à tireoide — risco cirúrgico!). Nervo laríngeo superior (ramo externo: músculo cricotireóideo).',
        pathologies: ['Hipotireoidismo (Hashimoto — mais comum)', 'Hipertireoidismo (Graves — mais comum)', 'Bócio', 'Nódulos tireoidianos', 'Carcinoma de tireoide (papilar mais comum)', 'Tireoidite'],
        clinicalNotes: ['TSH: melhor exame de triagem tireoidiana', 'Hashimoto: anti-TPO positivo, TSH alto, T4L baixo', 'Graves: TRAb positivo, TSH suprimido, T4L alto, exoftalmia, bócio difuso', 'Nódulo: PAAF se >1cm ou características suspeitas na US (Bethesda)'],
        histology: 'Folículos tireoidianos: epitélio cúbico simples + coloide (tireoglobulina). Células C (parafoliculares): calcitonina.',
        examTips: ['Nervo laríngeo recorrente: risco em tireoidectomia → rouquidão', 'Paratireoides: 4 glândulas posteriores à tireoide (risco de hipoparatireoidismo pós-cirúrgico)'],
        references: ['Netter [1] Prancha 76-80', 'Gray [2] Cap.34', 'Guyton [5] Cap.77']
      }
    ]
  },
  {
    id: 'urinary',
    name: 'Sistema Urinário',
    icon: '💧',
    color: '#06B6D4',
    description: 'Rins, ureteres, bexiga e uretra. Filtração do sangue, formação da urina e excreção de resíduos.',
    structures: [
      {
        id: 'bladder', name: 'Bexiga', latinName: 'Vesica urinaria', system: 'urinary',
        position: [0, -0.05, 0.25], scale: [0.12, 0.1, 0.1], color: '#06B6D4', highlightColor: '#22D3EE',
        shape: 'sphere',
        description: 'Órgão muscular oco na pelve. Capacidade: 300-500mL. Trígono vesical: 2 óstios ureterais + 1 óstio uretral interno.',
        functions: ['Armazenamento de urina', 'Micção (contração do músculo detrusor)', 'Capacidade de distensão (acomodação)'],
        bloodSupply: 'Artérias vesicais superiores e inferiores (ramos da ilíaca interna)',
        innervation: 'Parassimpático (S2-S4): contração do detrusor (micção). Simpático (T11-L2): relaxamento do detrusor, contração do esfíncter interno. Somático (nervo pudendo S2-S4): esfíncter externo (voluntário).',
        pathologies: ['Infecção urinária (cistite)', 'Câncer de bexiga (carcinoma urotelial)', 'Bexiga neurogênica', 'Incontinência urinária', 'Retenção urinária aguda'],
        clinicalNotes: ['Cistite: disúria, polaciúria, urgência. EAS + urocultura', 'Ca bexiga: hematúria indolor. FR: tabagismo (#1), exposição a aminas aromáticas', 'Bexiga neurogênica: lesão medular acima de S2 → bexiga espástica'],
        histology: 'Epitélio de transição (urotélio): 3-7 camadas, células em guarda-chuva. Músculo detrusor: 3 camadas de músculo liso.',
        examTips: ['Trígono vesical: 2 óstios ureterais + 1 uretral', 'Ca bexiga: tabagismo é FR principal', 'Cistoscopia: diagnóstico de tumores vesicais'],
        references: ['Netter [1] Prancha 336-340', 'Gray [2] Cap.68']
      }
    ]
  },
  {
    id: 'reproductive',
    name: 'Sistema Reprodutor',
    icon: '🧬',
    color: '#EC4899',
    description: 'Órgãos reprodutores masculinos e femininos. Gametogênese, fecundação e desenvolvimento embrionário.',
    structures: [
      {
        id: 'uterus', name: 'Útero', latinName: 'Uterus', system: 'reproductive',
        position: [0, -0.1, 0.2], scale: [0.1, 0.12, 0.08], color: '#EC4899', highlightColor: '#F472B6',
        shape: 'ellipsoid',
        description: 'Órgão muscular piriforme na pelve feminina. Partes: fundo, corpo, istmo, colo (cérvix). Tamanho: ~7.5x5x2.5cm. Posição: anteversoflexão.',
        functions: ['Implantação e desenvolvimento do embrião/feto', 'Menstruação (descamação do endométrio)', 'Trabalho de parto (contrações miometriais)', 'Produção de prostaglandinas'],
        bloodSupply: 'Artérias uterinas (ramos da ilíaca interna). Anastomose com artérias ovarianas. "A água passa por baixo da ponte" (ureter cruza sob a artéria uterina).',
        innervation: 'Simpático (T10-L1): contrações. Parassimpático (S2-S4). Plexo hipogástrico inferior. Dor referida: dermátomos T10-L1.',
        pathologies: ['Mioma uterino (leiomioma — tumor benigno mais comum)', 'Endometriose', 'Adenomiose', 'Câncer de endométrio', 'Câncer de colo uterino (HPV)', 'Prolapso uterino'],
        clinicalNotes: ['Papanicolau: rastreamento de câncer de colo (HPV 16, 18)', 'Mioma: sangramento uterino anormal, dor pélvica, infertilidade', 'Endometriose: dismenorreia, dispareunia, infertilidade. Diagnóstico: laparoscopia'],
        histology: 'Endométrio: epitélio colunar simples + estroma + glândulas (camada funcional descama na menstruação). Miométrio: 3 camadas de músculo liso. Perimétrio: serosa.',
        examTips: ['Ureter cruza sob a artéria uterina (risco em histerectomia)', 'Ligamento cardinal (Mackenrodt): principal sustentação do útero', 'Fundo de saco de Douglas: ponto mais baixo da cavidade peritoneal feminina'],
        references: ['Netter [1] Prancha 356-365', 'Gray [2] Cap.77']
      }
    ]
  }
];

// ============================================================
// 3D ORGAN MESH COMPONENT
// ============================================================
function OrganMesh({ 
  structure, 
  isSelected, 
  isHighlighted, 
  onClick, 
  onHover, 
  opacity = 1,
  systemVisible = true 
}: { 
  structure: AnatomyStructure; 
  isSelected: boolean; 
  isHighlighted: boolean;
  onClick: () => void; 
  onHover: (hovering: boolean) => void;
  opacity?: number;
  systemVisible?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (!meshRef.current || !systemVisible) return;
    if (isSelected) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.05);
    } else if (hovered) {
      meshRef.current.scale.setScalar(1.08);
    } else {
      meshRef.current.scale.setScalar(1);
    }
  });

  const geometry = useMemo(() => {
    switch (structure.shape) {
      case 'sphere': return new THREE.SphereGeometry(1, 32, 32);
      case 'ellipsoid': return new THREE.SphereGeometry(1, 32, 32);
      case 'cylinder': return new THREE.CylinderGeometry(1, 1, 2, 32);
      case 'torus': return new THREE.TorusGeometry(1, 0.3, 16, 32);
      case 'box': return new THREE.BoxGeometry(2, 2, 2);
      case 'cone': return new THREE.ConeGeometry(1, 2, 32);
      case 'capsule': return new THREE.CapsuleGeometry(1, 1, 16, 32);
      case 'custom': {
        // Heart-like shape using a modified sphere
        const geo = new THREE.SphereGeometry(1, 32, 32);
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i);
          const y = pos.getY(i);
          const z = pos.getZ(i);
          // Create a slight indentation at the top for the heart shape
          if (y > 0.3) {
            const indent = Math.max(0, (y - 0.3) * 0.3 * Math.cos(Math.atan2(z, x) * 2));
            pos.setY(i, y - indent);
          }
          // Taper the bottom
          if (y < -0.3) {
            const taper = 1 - Math.abs(y + 0.3) * 0.4;
            pos.setX(i, x * Math.max(0.3, taper));
            pos.setZ(i, z * Math.max(0.3, taper));
          }
        }
        geo.computeVertexNormals();
        return geo;
      }
      default: return new THREE.SphereGeometry(1, 32, 32);
    }
  }, [structure.shape]);

  const color = isSelected ? structure.highlightColor : (hovered ? structure.highlightColor : structure.color);

  if (!systemVisible) return null;

  return (
    <group position={structure.position} rotation={structure.rotation || [0, 0, 0]}>
      <mesh
        ref={meshRef}
        geometry={geometry}
        scale={structure.scale}
        onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHovered(true); onHover(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); onHover(false); document.body.style.cursor = 'default'; }}
      >
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={opacity * (isSelected ? 0.95 : hovered ? 0.85 : 0.75)}
          roughness={0.4}
          metalness={0.1}
          emissive={isSelected ? structure.highlightColor : hovered ? structure.color : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : hovered ? 0.15 : 0}
        />
      </mesh>
      
      {/* Label */}
      {(hovered || isSelected) && (
        <Html position={[0, structure.scale[1] + 0.15, 0]} center distanceFactor={5}>
          <div className="bg-black/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap border border-white/20 shadow-xl pointer-events-none">
            <div className="font-bold">{structure.name}</div>
            <div className="text-xs text-gray-300 italic">{structure.latinName}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

// ============================================================
// BODY OUTLINE (TORSO SILHOUETTE)
// ============================================================
function BodyOutline() {
  const bodyRef = useRef<THREE.Group>(null);
  
  return (
    <group ref={bodyRef}>
      {/* Head */}
      <mesh position={[0, 2.1, 0]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.15} roughness={0.8} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.85, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.15, 16]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.12} roughness={0.8} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 1.1, 0]}>
        <capsuleGeometry args={[0.35, 0.8, 16, 32]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.1} roughness={0.8} />
      </mesh>
      {/* Pelvis */}
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.3, 32, 16]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.08} roughness={0.8} />
      </mesh>
      {/* Arms */}
      {[-1, 1].map(side => (
        <mesh key={`arm-${side}`} position={[side * 0.55, 1.2, 0]} rotation={[0, 0, side * 0.15]}>
          <capsuleGeometry args={[0.06, 0.7, 8, 16]} />
          <meshStandardMaterial color="#1a1a2e" transparent opacity={0.08} roughness={0.8} />
        </mesh>
      ))}
      {/* Legs */}
      {[-1, 1].map(side => (
        <mesh key={`leg-${side}`} position={[side * 0.18, -0.6, 0]}>
          <capsuleGeometry args={[0.09, 0.8, 8, 16]} />
          <meshStandardMaterial color="#1a1a2e" transparent opacity={0.08} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// ============================================================
// CONNECTOR LINES
// ============================================================
function ConnectorLine({ from, to, color }: { from: [number, number, number]; to: [number, number, number]; color: string }) {
  const points = useMemo(() => [
    new THREE.Vector3(...from),
    new THREE.Vector3(...to)
  ], [from, to]);
  
  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2}
          array={new Float32Array([...from, ...to])}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={0.3} />
    </line>
  );
}

// ============================================================
// SCENE COMPONENT
// ============================================================
function AnatomyScene({ 
  systems, 
  visibleSystems, 
  selectedStructure, 
  onSelectStructure, 
  onHoverStructure 
}: {
  systems: BodySystem[];
  visibleSystems: Set<string>;
  selectedStructure: string | null;
  onSelectStructure: (id: string | null) => void;
  onHoverStructure: (id: string | null) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-3, 5, -3]} intensity={0.3} />
      <pointLight position={[0, 3, 3]} intensity={0.4} color="#ffffff" />
      
      <BodyOutline />
      
      {systems.map(system => 
        system.structures.map(structure => (
          <OrganMesh
            key={structure.id}
            structure={structure}
            isSelected={selectedStructure === structure.id}
            isHighlighted={false}
            onClick={() => onSelectStructure(selectedStructure === structure.id ? null : structure.id)}
            onHover={(hovering) => onHoverStructure(hovering ? structure.id : null)}
            systemVisible={visibleSystems.has(system.id)}
          />
        ))
      )}
      
      <ContactShadows position={[0, -1.2, 0]} opacity={0.3} scale={5} blur={2} />
      <OrbitControls 
        makeDefault 
        enablePan={true} 
        enableZoom={true} 
        enableRotate={true}
        minDistance={1.5}
        maxDistance={8}
        target={[0, 1.0, 0]}
      />
      <Environment preset="studio" />
    </>
  );
}

// ============================================================
// DETAIL PANEL
// ============================================================
function DetailPanel({ structure, onClose }: { structure: AnatomyStructure; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'clinical' | 'histology' | 'exam'>('overview');
  
  return (
    <div className="bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">{structure.name}</h3>
            <p className="text-sm text-muted-foreground italic">{structure.latinName}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">{structure.description}</p>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-border">
        {[
          { id: 'overview' as const, label: 'Visão Geral', icon: '📋' },
          { id: 'clinical' as const, label: 'Clínica', icon: '🏥' },
          { id: 'histology' as const, label: 'Histologia', icon: '🔬' },
          { id: 'exam' as const, label: 'Provas', icon: '📝' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-3 py-2.5 text-xs font-medium transition ${
              activeTab === tab.id 
                ? 'text-primary border-b-2 border-primary bg-primary/5' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
      
      {/* Content */}
      <div className="overflow-y-auto p-4 flex-1 space-y-4">
        {activeTab === 'overview' && (
          <>
            <Section title="⚙️ Funções" items={structure.functions} />
            <Section title="🩸 Irrigação" text={structure.bloodSupply} />
            <Section title="⚡ Inervação" text={structure.innervation} />
            <Section title="🦠 Patologias" items={structure.pathologies} />
          </>
        )}
        
        {activeTab === 'clinical' && (
          <>
            <Section title="🏥 Notas Clínicas" items={structure.clinicalNotes} />
            <Section title="🦠 Patologias Associadas" items={structure.pathologies} />
          </>
        )}
        
        {activeTab === 'histology' && (
          <>
            <Section title="🔬 Histologia" text={structure.histology} />
            <Section title="🩸 Vascularização" text={structure.bloodSupply} />
            <Section title="⚡ Inervação" text={structure.innervation} />
          </>
        )}
        
        {activeTab === 'exam' && (
          <>
            <Section title="📝 Dicas para Provas" items={structure.examTips} />
            <Section title="📚 Referências" items={structure.references} />
          </>
        )}
      </div>
    </div>
  );
}

function Section({ title, items, text }: { title: string; items?: string[]; text?: string }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-foreground mb-2">{title}</h4>
      {text && <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>}
      {items && (
        <ul className="space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="text-primary mt-0.5 text-xs">●</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ============================================================
// MAIN INTERACTIVE 3D ATLAS COMPONENT
// ============================================================
export default function Interactive3DAtlas() {
  const [selectedStructure, setSelectedStructure] = useState<string | null>(null);
  const [hoveredStructure, setHoveredStructure] = useState<string | null>(null);
  const [visibleSystems, setVisibleSystems] = useState<Set<string>>(new Set(ANATOMY_SYSTEMS.map(s => s.id)));
  const [searchTerm, setSearchTerm] = useState('');
  const [showSystemPanel, setShowSystemPanel] = useState(true);

  const toggleSystem = (systemId: string) => {
    setVisibleSystems(prev => {
      const next = new Set(prev);
      if (next.has(systemId)) {
        next.delete(systemId);
      } else {
        next.add(systemId);
      }
      return next;
    });
  };

  const toggleAllSystems = () => {
    if (visibleSystems.size === ANATOMY_SYSTEMS.length) {
      setVisibleSystems(new Set());
    } else {
      setVisibleSystems(new Set(ANATOMY_SYSTEMS.map(s => s.id)));
    }
  };

  const selectedStructureData = useMemo(() => {
    if (!selectedStructure) return null;
    for (const system of ANATOMY_SYSTEMS) {
      const found = system.structures.find(s => s.id === selectedStructure);
      if (found) return found;
    }
    return null;
  }, [selectedStructure]);

  const filteredSystems = useMemo(() => {
    if (!searchTerm) return ANATOMY_SYSTEMS;
    const term = searchTerm.toLowerCase();
    return ANATOMY_SYSTEMS.filter(system =>
      system.name.toLowerCase().includes(term) ||
      system.structures.some(s => 
        s.name.toLowerCase().includes(term) || 
        s.latinName.toLowerCase().includes(term) ||
        s.pathologies.some(p => p.toLowerCase().includes(term))
      )
    );
  }, [searchTerm]);

  const totalStructures = ANATOMY_SYSTEMS.reduce((acc, s) => acc + s.structures.length, 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/50
">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-2xl">🫀</span> Atlas 3D Interativo
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              {ANATOMY_SYSTEMS.length} sistemas, {totalStructures} estruturas clicáveis — 100% nativo, funciona offline
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSystemPanel(!showSystemPanel)}
              className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-xs hover:bg-primary/30 transition"
            >
              {showSystemPanel ? 'Ocultar Painel' : 'Mostrar Painel'}
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="mt-3">
          <input
            type="text"
            placeholder="Buscar estrutura, patologia ou sistema..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96 px-4 py-2 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)]">
        {/* Left Panel - System Toggles */}
        {showSystemPanel && (
          <div className="w-full lg:w-72 border-r border-border bg-card/30 overflow-y-auto p-3 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-foreground">Sistemas Corporais</h3>
              <button
                onClick={toggleAllSystems}
                className="text-xs text-primary hover:underline"
              >
                {visibleSystems.size === ANATOMY_SYSTEMS.length ? 'Ocultar Todos' : 'Mostrar Todos'}
              </button>
            </div>
            
            {filteredSystems.map(system => (
              <div key={system.id} className="space-y-1">
                <button
                  onClick={() => toggleSystem(system.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                    visibleSystems.has(system.id) 
                      ? 'bg-primary/10 text-foreground border border-primary/30' 
                      : 'bg-muted/30 text-muted-foreground border border-transparent hover:bg-muted/50'
                  }`}
                >
                  <span className="text-lg">{system.icon}</span>
                  <div className="text-left flex-1">
                    <div className="font-medium text-xs">{system.name}</div>
                    <div className="text-[10px] text-muted-foreground">{system.structures.length} estruturas</div>
                  </div>
                  <div 
                    className="w-3 h-3 rounded-full border-2" 
                    style={{ 
                      backgroundColor: visibleSystems.has(system.id) ? system.color : 'transparent',
                      borderColor: system.color 
                    }} 
                  />
                </button>
                
                {/* Structure list under each system */}
                {visibleSystems.has(system.id) && (
                  <div className="ml-6 space-y-0.5">
                    {system.structures.map(structure => (
                      <button
                        key={structure.id}
                        onClick={() => setSelectedStructure(selectedStructure === structure.id ? null : structure.id)}
                        className={`w-full text-left px-2 py-1 rounded text-xs transition ${
                          selectedStructure === structure.id
                            ? 'bg-primary/20 text-primary font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                        }`}
                      >
                        {structure.name}
                        <span className="text-[10px] ml-1 opacity-60">({structure.latinName})</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Legend */}
            <div className="mt-4 p-3 bg-muted/20 rounded-lg border border-border">
              <h4 className="text-xs font-semibold text-foreground mb-2">Como usar</h4>
              <ul className="space-y-1 text-[10px] text-muted-foreground">
                <li>🖱️ <strong>Clique</strong> em uma estrutura para ver detalhes</li>
                <li>🔄 <strong>Arraste</strong> para rotacionar o modelo</li>
                <li>🔍 <strong>Scroll</strong> para zoom in/out</li>
                <li>👆 <strong>Passe o mouse</strong> para ver legendas</li>
                <li>🎯 <strong>Toggle</strong> sistemas para isolar camadas</li>
              </ul>
            </div>
          </div>
        )}

        {/* Center - 3D Canvas */}
        <div className="flex-1 relative bg-gradient-to-b from-slate-900 to-slate-950">
          <Canvas
            camera={{ position: [0, 1.2, 4], fov: 50 }}
            style={{ width: '100%', height: '100%' }}
            gl={{ antialias: true, alpha: true }}
          >
            <Suspense fallback={null}>
              <AnatomyScene
                systems={ANATOMY_SYSTEMS}
                visibleSystems={visibleSystems}
                selectedStructure={selectedStructure}
                onSelectStructure={setSelectedStructure}
                onHoverStructure={setHoveredStructure}
              />
            </Suspense>
          </Canvas>
          
          {/* Floating info */}
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs">
            <div className="flex items-center gap-4">
              <span>🔄 Arraste para rotacionar</span>
              <span>🔍 Scroll para zoom</span>
              <span>👆 Clique para detalhes</span>
            </div>
          </div>
          
          {/* Visible systems indicator */}
          <div className="absolute top-4 right-4 flex flex-wrap gap-1 max-w-xs">
            {ANATOMY_SYSTEMS.filter(s => visibleSystems.has(s.id)).map(system => (
              <span 
                key={system.id} 
                className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                style={{ backgroundColor: system.color + '30', color: system.color, border: `1px solid ${system.color}50` }}
              >
                {system.icon} {system.name.replace('Sistema ', '')}
              </span>
            ))}
          </div>
        </div>

        {/* Right Panel - Detail */}
        {selectedStructureData && (
          <div className="w-full lg:w-96 overflow-y-auto">
            <DetailPanel 
              structure={selectedStructureData} 
              onClose={() => setSelectedStructure(null)} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
