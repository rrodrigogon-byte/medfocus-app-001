/**
 * Dicas de Saúde — Conteúdo educativo para a população
 * Informações baseadas em evidências sobre prevenção e bem-estar
 */
import { useState } from 'react';

interface HealthTip {
  id: number;
  titulo: string;
  resumo: string;
  conteudo: string[];
  categoria: string;
  icone: string;
  fonte: string;
  fonteUrl: string;
}

const CATEGORIAS = ['Todas', 'Prevenção', 'Nutrição', 'Exercício', 'Saúde Mental', 'Vacinação', 'Primeiros Socorros', 'Saúde da Mulher', 'Saúde do Homem', 'Idosos', 'Crianças'];

const DICAS: HealthTip[] = [
  {
    id: 1, titulo: 'Hipertensão: O Assassino Silencioso', resumo: 'Entenda os riscos e como prevenir a pressão alta',
    conteudo: [
      'A hipertensão arterial afeta cerca de 38% dos adultos brasileiros e é o principal fator de risco para doenças cardiovasculares.',
      'Mantenha a pressão abaixo de 140/90 mmHg (ou 130/80 para diabéticos e cardiopatas).',
      'Reduza o consumo de sal para no máximo 5g/dia (1 colher de chá).',
      'Pratique atividade física regular: pelo menos 150 minutos por semana de exercício moderado.',
      'Evite o tabagismo e limite o consumo de álcool.',
      'Meça sua pressão regularmente, mesmo sem sintomas. A hipertensão geralmente não causa dor.'
    ],
    categoria: 'Prevenção', icone: '❤️', fonte: 'Sociedade Brasileira de Cardiologia', fonteUrl: 'https://www.cardiol.br/'
  },
  {
    id: 2, titulo: 'Diabetes: Prevenção e Controle', resumo: 'Como prevenir e conviver com o diabetes',
    conteudo: [
      'O diabetes tipo 2 pode ser prevenido com mudanças no estilo de vida em até 58% dos casos.',
      'Mantenha o peso adequado: o excesso de peso é o principal fator de risco modificável.',
      'Prefira alimentos integrais, frutas, verduras e legumes. Evite açúcar refinado e ultraprocessados.',
      'A glicemia de jejum normal é abaixo de 100 mg/dL. Entre 100-125 é pré-diabetes.',
      'Se você tem mais de 45 anos, histórico familiar ou sobrepeso, faça exames regularmente.',
      'O exercício físico ajuda a controlar a glicemia mesmo sem perda de peso.'
    ],
    categoria: 'Prevenção', icone: '🩸', fonte: 'Sociedade Brasileira de Diabetes', fonteUrl: 'https://www.diabetes.org.br/'
  },
  {
    id: 3, titulo: 'Alimentação Saudável no Dia a Dia', resumo: 'Guia prático de nutrição baseado no Guia Alimentar Brasileiro',
    conteudo: [
      'Faça dos alimentos in natura ou minimamente processados a base da alimentação.',
      'Use óleos, gorduras, sal e açúcar em pequenas quantidades ao temperar e cozinhar.',
      'Limite o consumo de alimentos processados (queijos, pães, conservas).',
      'Evite alimentos ultraprocessados (refrigerantes, biscoitos recheados, salgadinhos, macarrão instantâneo).',
      'Coma com regularidade e atenção, em ambientes apropriados e em companhia.',
      'Beba pelo menos 2 litros de água por dia. Evite bebidas açucaradas.'
    ],
    categoria: 'Nutrição', icone: '🥗', fonte: 'Guia Alimentar para a População Brasileira — MS', fonteUrl: 'https://www.gov.br/saude/pt-br'
  },
  {
    id: 4, titulo: 'Exercício Físico: Quanto e Como', resumo: 'Recomendações da OMS para atividade física',
    conteudo: [
      'Adultos: pelo menos 150 minutos de atividade moderada ou 75 minutos de atividade vigorosa por semana.',
      'Crianças e adolescentes: pelo menos 60 minutos por dia de atividade moderada a vigorosa.',
      'Inclua exercícios de fortalecimento muscular pelo menos 2 vezes por semana.',
      'Qualquer atividade é melhor que nenhuma. Comece devagar e aumente gradualmente.',
      'Caminhar, subir escadas, dançar e pedalar são ótimas opções acessíveis.',
      'O sedentarismo é responsável por 3,2 milhões de mortes por ano no mundo.'
    ],
    categoria: 'Exercício', icone: '🏃', fonte: 'Organização Mundial da Saúde', fonteUrl: 'https://www.who.int/'
  },
  {
    id: 5, titulo: 'Saúde Mental: Sinais de Alerta', resumo: 'Quando procurar ajuda profissional',
    conteudo: [
      'Tristeza persistente por mais de 2 semanas pode ser sinal de depressão.',
      'Ansiedade excessiva que interfere no dia a dia merece atenção profissional.',
      'Insônia crônica, irritabilidade extrema e isolamento social são sinais de alerta.',
      'O CVV (Centro de Valorização da Vida) atende 24h pelo telefone 188 ou chat online.',
      'Exercício físico, meditação e sono adequado são aliados da saúde mental.',
      'Não tenha vergonha de pedir ajuda. Saúde mental é tão importante quanto saúde física.'
    ],
    categoria: 'Saúde Mental', icone: '🧠', fonte: 'CVV — Centro de Valorização da Vida', fonteUrl: 'https://www.cvv.org.br/'
  },
  {
    id: 6, titulo: 'Calendário de Vacinação Adulto', resumo: 'Vacinas essenciais para adultos',
    conteudo: [
      'Hepatite B: 3 doses se não vacinado na infância.',
      'Tríplice viral (sarampo, caxumba, rubéola): 2 doses até 29 anos, 1 dose de 30-59 anos.',
      'Febre amarela: 1 dose para toda a vida em áreas endêmicas.',
      'Influenza (gripe): anualmente, especialmente para grupos de risco.',
      'COVID-19: esquema completo + reforços conforme orientação do MS.',
      'dT (difteria e tétano): reforço a cada 10 anos.',
      'Todas as vacinas do calendário nacional são gratuitas no SUS.'
    ],
    categoria: 'Vacinação', icone: '💉', fonte: 'PNI — Programa Nacional de Imunizações', fonteUrl: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/c/calendario-nacional-de-vacinacao'
  },
  {
    id: 7, titulo: 'Primeiros Socorros: O Que Fazer', resumo: 'Ações imediatas em emergências comuns',
    conteudo: [
      'ENGASGO: Aplique a manobra de Heimlich — pressão abdominal com punho fechado acima do umbigo.',
      'QUEIMADURA: Coloque a área em água corrente fria por 15-20 minutos. NÃO use pasta de dente ou manteiga.',
      'DESMAIO: Deite a pessoa, eleve as pernas e afrouxe roupas apertadas.',
      'CONVULSÃO: Proteja a cabeça, vire de lado, NÃO coloque nada na boca.',
      'PARADA CARDÍACA: Ligue 192 (SAMU) e inicie compressões torácicas: 100-120 por minuto, 5cm de profundidade.',
      'SANGRAMENTO: Pressione o local com pano limpo. Se não parar em 10 minutos, procure emergência.'
    ],
    categoria: 'Primeiros Socorros', icone: '🆘', fonte: 'SAMU 192', fonteUrl: 'https://www.gov.br/saude/pt-br'
  },
  {
    id: 8, titulo: 'Saúde da Mulher: Exames Essenciais', resumo: 'Check-up preventivo feminino',
    conteudo: [
      'Papanicolau: a partir dos 25 anos, anualmente (após 2 normais, a cada 3 anos).',
      'Mamografia: a partir dos 40 anos, anualmente (SBM) ou 50 anos (MS).',
      'Ultrassom transvaginal: conforme orientação médica.',
      'Densitometria óssea: a partir da menopausa ou 65 anos.',
      'Autoexame das mamas: mensalmente, 7 dias após a menstruação.',
      'Consulte seu ginecologista regularmente, mesmo sem sintomas.'
    ],
    categoria: 'Saúde da Mulher', icone: '👩', fonte: 'FEBRASGO', fonteUrl: 'https://www.febrasgo.org.br/'
  },
  {
    id: 9, titulo: 'Saúde do Homem: Prevenção', resumo: 'Exames e cuidados preventivos masculinos',
    conteudo: [
      'PSA e toque retal: a partir dos 50 anos (ou 45 para negros e com histórico familiar).',
      'Colesterol e glicemia: a partir dos 20 anos, a cada 5 anos (ou anualmente se alterado).',
      'Pressão arterial: verificar pelo menos 1 vez ao ano.',
      'Colonoscopia: a partir dos 45 anos para rastreamento de câncer colorretal.',
      'Homens morrem em média 7 anos antes das mulheres, principalmente por causas evitáveis.',
      'Procure o médico regularmente. Prevenção salva vidas.'
    ],
    categoria: 'Saúde do Homem', icone: '👨', fonte: 'Sociedade Brasileira de Urologia', fonteUrl: 'https://portaldaurologia.org.br/'
  },
  {
    id: 10, titulo: 'Saúde do Idoso: Envelhecimento Ativo', resumo: 'Dicas para qualidade de vida na terceira idade',
    conteudo: [
      'Mantenha atividade física regular: caminhada, hidroginástica, tai chi são excelentes opções.',
      'Prevenção de quedas: use calçados adequados, instale barras de apoio, mantenha ambientes iluminados.',
      'Tome as vacinas recomendadas: gripe (anual), pneumocócica, herpes-zóster.',
      'Mantenha a socialização: isolamento aumenta risco de depressão e declínio cognitivo.',
      'Faça exercícios mentais: leitura, jogos, palavras cruzadas, aprender coisas novas.',
      'Revise medicamentos regularmente com seu médico para evitar interações e efeitos adversos.'
    ],
    categoria: 'Idosos', icone: '👴', fonte: 'Sociedade Brasileira de Geriatria', fonteUrl: 'https://sbgg.org.br/'
  },
  {
    id: 11, titulo: 'Saúde Infantil: Marcos do Desenvolvimento', resumo: 'O que observar no crescimento do seu filho',
    conteudo: [
      'Aleitamento materno exclusivo até 6 meses é o ideal. Após, introduza alimentos gradualmente.',
      'Mantenha o calendário vacinal em dia: as vacinas protegem contra doenças graves.',
      'Consultas de puericultura: mensais no 1º ano, trimestrais no 2º, semestrais até 5 anos.',
      'Limite o tempo de tela: zero até 2 anos, máximo 1h/dia de 2-5 anos.',
      'Sinais de alerta: não falar palavras até 18 meses, não andar até 18 meses, regressão de habilidades.',
      'Febre acima de 38°C em bebês menores de 3 meses: procure emergência imediatamente.'
    ],
    categoria: 'Crianças', icone: '👶', fonte: 'Sociedade Brasileira de Pediatria', fonteUrl: 'https://www.sbp.com.br/'
  },
  {
    id: 12, titulo: 'Sono: A Base da Saúde', resumo: 'Como melhorar a qualidade do sono',
    conteudo: [
      'Adultos precisam de 7-9 horas de sono por noite. Adolescentes: 8-10h. Crianças: 9-12h.',
      'Mantenha horários regulares: durma e acorde no mesmo horário, inclusive nos fins de semana.',
      'Evite telas (celular, TV, computador) pelo menos 1 hora antes de dormir.',
      'O quarto deve ser escuro, silencioso e com temperatura agradável (18-22°C).',
      'Evite cafeína após as 14h e álcool antes de dormir.',
      'Insônia crônica (mais de 3 meses) merece avaliação médica. Pode indicar apneia do sono.'
    ],
    categoria: 'Prevenção', icone: '😴', fonte: 'Associação Brasileira do Sono', fonteUrl: 'https://www.absono.com.br/'
  },
];

const EMERGENCIAS = [
  { nome: 'SAMU', numero: '192', desc: 'Serviço de Atendimento Móvel de Urgência' },
  { nome: 'Bombeiros', numero: '193', desc: 'Corpo de Bombeiros Militar' },
  { nome: 'CVV', numero: '188', desc: 'Centro de Valorização da Vida (24h)' },
  { nome: 'Disque Saúde', numero: '136', desc: 'Informações sobre o SUS' },
  { nome: 'Disque Denúncia', numero: '100', desc: 'Violência contra crianças e idosos' },
  { nome: 'Ligue Mulher', numero: '180', desc: 'Central de Atendimento à Mulher' },
];

export default function HealthTips() {
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todas');
  const [dicaAberta, setDicaAberta] = useState<number | null>(null);

  const dicasFiltradas = categoriaAtiva === 'Todas'
    ? DICAS
    : DICAS.filter(d => d.categoria === categoriaAtiva);

  const dicaSelecionada = dicaAberta !== null ? DICAS.find(d => d.id === dicaAberta) : null;

  if (dicaSelecionada) {
    return (
      <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
        <button onClick={() => setDicaAberta(null)} style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 8, padding: '8px 16px', color: 'inherit', cursor: 'pointer', marginBottom: 24, fontSize: 14
        }}>← Voltar</button>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>{dicaSelecionada.icone}</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>{dicaSelecionada.titulo}</h2>
          <p style={{ opacity: 0.6, fontSize: 14, marginTop: 4 }}>{dicaSelecionada.resumo}</p>
          <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>
            {dicaSelecionada.categoria}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {dicaSelecionada.conteudo.map((item, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10, padding: 16, display: 'flex', gap: 12, alignItems: 'start'
            }}>
              <span style={{
                width: 28, height: 28, borderRadius: '50%', background: 'rgba(16,185,129,0.15)',
                color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, flexShrink: 0
              }}>{i + 1}</span>
              <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0, opacity: 0.85 }}>{item}</p>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 20, padding: 14, background: 'rgba(59,130,246,0.08)',
          borderRadius: 12, border: '1px solid rgba(59,130,246,0.15)'
        }}>
          <span style={{ fontSize: 12, opacity: 0.6 }}>Fonte: </span>
          <a href={dicaSelecionada.fonteUrl} target="_blank" rel="noopener noreferrer"
            style={{ color: '#3b82f6', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            {dicaSelecionada.fonte} →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, margin: 0, fontWeight: 800 }}>💡 Dicas de Saúde</h1>
        <p style={{ opacity: 0.7, fontSize: 14, marginTop: 6 }}>
          Informações baseadas em evidências para cuidar da sua saúde
        </p>
      </div>

      {/* Emergency numbers */}
      <div style={{
        background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)',
        borderRadius: 14, padding: 16, marginBottom: 20
      }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: '#ef4444' }}>🆘 Telefones de Emergência</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {EMERGENCIAS.map((e, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '8px 14px',
              display: 'flex', alignItems: 'center', gap: 8
            }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#ef4444' }}>{e.numero}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{e.nome}</div>
                <div style={{ fontSize: 10, opacity: 0.5 }}>{e.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category filters */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {CATEGORIAS.map(cat => (
          <button key={cat} onClick={() => setCategoriaAtiva(cat)} style={{
            padding: '6px 14px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
            border: categoriaAtiva === cat ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.12)',
            background: categoriaAtiva === cat ? 'rgba(16,185,129,0.15)' : 'transparent',
            color: categoriaAtiva === cat ? '#10b981' : 'inherit'
          }}>{cat}</button>
        ))}
      </div>

      {/* Tips grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
        {dicasFiltradas.map(dica => (
          <div key={dica.id} onClick={() => setDicaAberta(dica.id)} style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14, padding: 20, cursor: 'pointer', transition: 'all 0.15s'
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(16,185,129,0.3)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <span style={{ fontSize: 32 }}>{dica.icone}</span>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
                {dica.categoria}
              </span>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 10, marginBottom: 4 }}>{dica.titulo}</h3>
            <p style={{ fontSize: 13, opacity: 0.6, lineHeight: 1.5 }}>{dica.resumo}</p>
            <div style={{ fontSize: 11, opacity: 0.4, marginTop: 8 }}>Fonte: {dica.fonte}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
