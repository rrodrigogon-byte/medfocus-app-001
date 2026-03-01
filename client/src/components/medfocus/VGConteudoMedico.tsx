/**
 * MedFocus — ViralGram Conteúdo Médico (Sprint 14)
 * 
 * Módulo nativo de criação de conteúdo para profissionais de saúde,
 * com validação automática do Código de Ética Médica (CFM) e legislação.
 * 
 * Referências Legais:
 * - Resolução CFM 2.336/2023 (Publicidade Médica)
 * - Resolução CFM 2.227/2018 (Telemedicina)
 * - Lei 12.842/2013 (Ato Médico)
 * - LGPD (Lei 13.709/2018)
 * - Manual de Publicidade Médica CFM
 */

import React, { useState, useCallback } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

type StatusCompliance = 'aprovado' | 'alerta' | 'bloqueado' | 'pendente';
type TipoConteudo = 'educacional' | 'institucional' | 'cientifico' | 'depoimento' | 'dica-saude';
type PlataformaAlvo = 'linkedin' | 'instagram' | 'whatsapp' | 'todas';

interface PostMedico {
  id: string;
  titulo: string;
  conteudo: string;
  tipo: TipoConteudo;
  plataforma: PlataformaAlvo;
  hashtags: string[];
  compliance: ComplianceResult;
  status: 'rascunho' | 'revisao' | 'aprovado' | 'agendado' | 'publicado';
  criadoEm: Date;
  agendadoPara?: Date;
}

interface ComplianceResult {
  status: StatusCompliance;
  score: number;
  violacoes: ViolacaoCFM[];
  sugestoes: string[];
  artigos: string[];
}

interface ViolacaoCFM {
  tipo: 'proibido' | 'alerta' | 'recomendacao';
  regra: string;
  descricao: string;
  resolucao: string;
  trecho: string;
}

// ============================================================
// REGRAS DO CFM PARA PUBLICIDADE MÉDICA
// ============================================================
const REGRAS_CFM = [
  { id: 'cfm-001', regra: 'Art. 3° Res. 2.336/2023', descricao: 'É vedado ao médico divulgar preço de procedimentos ou consultas.', palavrasChave: ['preço', 'valor', 'r$', 'reais', 'promoção', 'desconto', 'oferta', 'barato', 'grátis', 'gratuito', 'parcelamento'] },
  { id: 'cfm-002', regra: 'Art. 4° Res. 2.336/2023', descricao: 'É vedado garantir resultados de tratamentos ou procedimentos.', palavrasChave: ['garantia', 'garantido', '100%', 'certeza', 'sempre funciona', 'resultado garantido', 'cura definitiva', 'nunca mais'] },
  { id: 'cfm-003', regra: 'Art. 5° Res. 2.336/2023', descricao: 'É vedado usar imagens de antes e depois de procedimentos.', palavrasChave: ['antes e depois', 'antes/depois', 'resultado visual', 'transformação', 'mudança radical'] },
  { id: 'cfm-004', regra: 'Art. 6° Res. 2.336/2023', descricao: 'É vedado divulgar aparelhos ou equipamentos como diferencial.', palavrasChave: ['equipamento exclusivo', 'tecnologia única', 'aparelho importado', 'laser mais moderno', 'único na cidade'] },
  { id: 'cfm-005', regra: 'Art. 7° Res. 2.336/2023', descricao: 'É vedado usar expressões de superioridade como "o melhor", "o mais".', palavrasChave: ['o melhor', 'o mais', 'número 1', 'líder', 'referência', 'o único', 'incomparável', 'imbatível'] },
  { id: 'cfm-006', regra: 'Art. 8° Res. 2.336/2023', descricao: 'É vedado expor pacientes sem consentimento por escrito (TCLE).', palavrasChave: ['paciente', 'caso clínico', 'testemunho', 'depoimento de paciente'] },
  { id: 'cfm-007', regra: 'Art. 9° Res. 2.336/2023', descricao: 'É obrigatório incluir nome, CRM e especialidade registrada no RQE.', palavrasChave: [] },
  { id: 'cfm-008', regra: 'Art. 75 CEM', descricao: 'É vedado ao médico fazer autopromoção sensacionalista.', palavrasChave: ['sensacional', 'incrível', 'milagre', 'revolucionário', 'fantástico', 'impressionante', 'chocante'] },
  { id: 'cfm-009', regra: 'LGPD Art. 11', descricao: 'Dados sensíveis de saúde exigem consentimento específico.', palavrasChave: ['diagnóstico de', 'paciente com', 'caso de', 'tratamento de paciente'] },
];

const TEMPLATES_CONTEUDO: { tipo: TipoConteudo; titulo: string; modelo: string; dicas: string[] }[] = [
  {
    tipo: 'educacional',
    titulo: 'Post Educacional',
    modelo: '🩺 [TÍTULO DO TEMA]\n\n[Explicação clara e acessível sobre o tema médico]\n\n📌 Pontos importantes:\n• [Ponto 1]\n• [Ponto 2]\n• [Ponto 3]\n\n⚠️ Lembre-se: Este conteúdo é informativo e não substitui a consulta médica.\n\n#SaúdeÉInformação #MedicinaEducativa\n\nDr(a). [Nome] | CRM [Número] | RQE [Número]',
    dicas: ['Foque em informação de utilidade pública', 'Use linguagem acessível', 'Sempre inclua o disclaimer', 'Cite fontes científicas quando possível']
  },
  {
    tipo: 'cientifico',
    titulo: 'Artigo Científico Simplificado',
    modelo: '📚 NOVO ESTUDO: [Título do Estudo]\n\n🔬 O que descobriram:\n[Resumo do estudo em linguagem acessível]\n\n📊 Dados relevantes:\n• [Dado 1]\n• [Dado 2]\n\n💡 O que isso significa para você:\n[Implicação prática]\n\n📖 Fonte: [Referência completa]\n\n#CiênciaMédica #EvidênciaCientífica\n\nDr(a). [Nome] | CRM [Número] | RQE [Número]',
    dicas: ['Sempre cite a fonte original', 'Simplifique sem distorcer', 'Não faça promessas baseadas em um único estudo']
  },
  {
    tipo: 'institucional',
    titulo: 'Post Institucional',
    modelo: '🏥 [Nome da Clínica/Consultório]\n\n[Informação sobre serviços, horários ou equipe]\n\n📍 Localização: [Endereço]\n📞 Agendamento: [Telefone]\n⏰ Horários: [Horários]\n\nDr(a). [Nome] | CRM [Número] | RQE [Número]',
    dicas: ['Não divulgue preços', 'Não prometa resultados', 'Inclua CRM e RQE obrigatoriamente']
  },
  {
    tipo: 'dica-saude',
    titulo: 'Dica de Saúde',
    modelo: '💡 DICA DE SAÚDE: [Título]\n\n[Dica prática e baseada em evidências]\n\n✅ Como aplicar no dia a dia:\n1. [Passo 1]\n2. [Passo 2]\n3. [Passo 3]\n\n⚠️ Consulte sempre seu médico antes de fazer mudanças na sua rotina de saúde.\n\n#DicaDeSaúde #Prevenção\n\nDr(a). [Nome] | CRM [Número] | RQE [Número]',
    dicas: ['Baseie-se em diretrizes oficiais', 'Evite modismos sem evidência', 'Sempre oriente a consulta médica']
  },
];

export function VGConteudoMedico() {
  const [tela, setTela] = useState<'criar' | 'meus-posts' | 'templates' | 'calendario'>('criar');
  const [conteudo, setConteudo] = useState('');
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState<TipoConteudo>('educacional');
  const [plataforma, setPlataforma] = useState<PlataformaAlvo>('todas');
  const [compliance, setCompliance] = useState<ComplianceResult | null>(null);
  const [verificando, setVerificando] = useState(false);
  const [posts, setPosts] = useState<PostMedico[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);

  // Verificar compliance CFM
  const verificarCompliance = useCallback((texto: string): ComplianceResult => {
    const violacoes: ViolacaoCFM[] = [];
    const textoLower = texto.toLowerCase();

    REGRAS_CFM.forEach(regra => {
      regra.palavrasChave.forEach(palavra => {
        if (textoLower.includes(palavra.toLowerCase())) {
          violacoes.push({
            tipo: regra.id === 'cfm-009' ? 'alerta' : 'proibido',
            regra: regra.regra,
            descricao: regra.descricao,
            resolucao: regra.regra,
            trecho: palavra,
          });
        }
      });
    });

    // Verificar se tem CRM
    const temCRM = /crm[\s-]*\d/i.test(texto);
    if (!temCRM) {
      violacoes.push({
        tipo: 'alerta',
        regra: 'Art. 9° Res. 2.336/2023',
        descricao: 'O conteúdo deve incluir nome completo, CRM e RQE do médico.',
        resolucao: 'Art. 9° Res. 2.336/2023',
        trecho: 'Identificação ausente',
      });
    }

    // Verificar disclaimer
    const temDisclaimer = textoLower.includes('não substitui') || textoLower.includes('consulte') || textoLower.includes('informativo');
    if (!temDisclaimer && tipo === 'educacional') {
      violacoes.push({
        tipo: 'recomendacao',
        regra: 'Boa Prática CFM',
        descricao: 'Recomenda-se incluir disclaimer de que o conteúdo não substitui consulta médica.',
        resolucao: 'Boa Prática',
        trecho: 'Disclaimer ausente',
      });
    }

    const proibidos = violacoes.filter(v => v.tipo === 'proibido').length;
    const alertas = violacoes.filter(v => v.tipo === 'alerta').length;
    
    let score = 100 - (proibidos * 25) - (alertas * 10);
    score = Math.max(0, Math.min(100, score));

    let status: StatusCompliance = 'aprovado';
    if (proibidos > 0) status = 'bloqueado';
    else if (alertas > 0) status = 'alerta';

    const sugestoes: string[] = [];
    if (!temCRM) sugestoes.push('Adicione seu CRM e RQE ao final do post.');
    if (!temDisclaimer) sugestoes.push('Inclua um disclaimer: "Este conteúdo é informativo e não substitui a consulta médica."');
    if (proibidos > 0) sugestoes.push('Remova ou reformule os trechos que violam as regras do CFM.');

    return {
      status,
      score,
      violacoes,
      sugestoes,
      artigos: violacoes.map(v => v.resolucao).filter((v, i, a) => a.indexOf(v) === i),
    };
  }, [tipo]);

  const handleVerificar = () => {
    setVerificando(true);
    setTimeout(() => {
      const resultado = verificarCompliance(conteudo);
      setCompliance(resultado);
      setVerificando(false);
    }, 1500);
  };

  const handleSalvarPost = () => {
    if (!conteudo || !compliance) return;
    const novoPost: PostMedico = {
      id: `post-${Date.now()}`,
      titulo: titulo || 'Post sem título',
      conteudo,
      tipo,
      plataforma,
      hashtags,
      compliance,
      status: compliance.status === 'aprovado' ? 'aprovado' : 'revisao',
      criadoEm: new Date(),
    };
    setPosts(prev => [novoPost, ...prev]);
    setConteudo('');
    setTitulo('');
    setCompliance(null);
  };

  const aplicarTemplate = (template: typeof TEMPLATES_CONTEUDO[0]) => {
    setConteudo(template.modelo);
    setTipo(template.tipo);
    setTela('criar');
  };

  const statusCor = (s: StatusCompliance) => {
    switch(s) {
      case 'aprovado': return { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/50', icon: '✅', label: 'APROVADO CFM' };
      case 'alerta': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50', icon: '⚠️', label: 'ALERTA' };
      case 'bloqueado': return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/50', icon: '🚫', label: 'BLOQUEADO' };
      default: return { bg: 'bg-muted/20', text: 'text-muted-foreground', border: 'border-border', icon: '⏳', label: 'PENDENTE' };
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-7xl mx-auto">
      <EducationalDisclaimer variant="banner" moduleName="ViralGram - Conteúdo Médico" />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <span className="text-3xl">✍️</span> Conteúdo Médico
          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full font-medium">ViralGram</span>
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-medium">CFM Compliance</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Crie conteúdo profissional com verificação automática do Código de Ética Médica (Res. CFM 2.336/2023)
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { id: 'criar' as const, label: '✍️ Criar Post' },
          { id: 'templates' as const, label: '📋 Templates' },
          { id: 'meus-posts' as const, label: `📄 Meus Posts (${posts.length})` },
          { id: 'calendario' as const, label: '📅 Calendário' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setTela(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              tela === tab.id ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-card border border-border hover:bg-accent'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Criar Post */}
      {tela === 'criar' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Editor */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Título</label>
                  <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)}
                    placeholder="Título do post..."
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Tipo</label>
                  <select value={tipo} onChange={e => setTipo(e.target.value as TipoConteudo)}
                    className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none">
                    <option value="educacional">📚 Educacional</option>
                    <option value="cientifico">🔬 Científico</option>
                    <option value="institucional">🏥 Institucional</option>
                    <option value="dica-saude">💡 Dica de Saúde</option>
                    <option value="depoimento">💬 Depoimento</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Plataforma</label>
                  <select value={plataforma} onChange={e => setPlataforma(e.target.value as PlataformaAlvo)}
                    className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none">
                    <option value="todas">📦 Todas</option>
                    <option value="linkedin">💼 LinkedIn</option>
                    <option value="instagram">📸 Instagram</option>
                    <option value="whatsapp">💬 WhatsApp</option>
                  </select>
                </div>
              </div>

              <textarea value={conteudo} onChange={e => setConteudo(e.target.value)}
                placeholder="Escreva seu conteúdo aqui... O sistema verificará automaticamente a conformidade com o CFM."
                rows={12}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:border-primary focus:outline-none resize-none leading-relaxed" />

              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-muted-foreground">{conteudo.length} caracteres</p>
                <div className="flex gap-2">
                  <button onClick={handleVerificar} disabled={!conteudo || verificando}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition disabled:opacity-50">
                    {verificando ? '⏳ Verificando...' : '🛡️ Verificar CFM'}
                  </button>
                  <button onClick={handleSalvarPost} disabled={!conteudo || !compliance || compliance.status === 'bloqueado'}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50">
                    💾 Salvar Post
                  </button>
                </div>
              </div>
            </div>

            {/* Resultado Compliance */}
            {verificando && (
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full mx-auto mb-3" />
                <p className="text-sm">Verificando conformidade com Res. CFM 2.336/2023...</p>
                <p className="text-xs text-muted-foreground mt-1">Analisando 9 regras do Código de Ética Médica</p>
              </div>
            )}

            {compliance && !verificando && (
              <div className="space-y-4">
                {(() => {
                  const cor = statusCor(compliance.status);
                  return (
                    <div className={`${cor.bg} border-2 ${cor.border} rounded-xl p-5`}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className={`font-bold ${cor.text} flex items-center gap-2`}>
                          {cor.icon} Compliance: {cor.label}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={`text-2xl font-bold ${cor.text}`}>{compliance.score}</span>
                          <span className="text-xs text-muted-foreground">/100</span>
                        </div>
                      </div>

                      {compliance.violacoes.length > 0 && (
                        <div className="space-y-2 mt-4">
                          <p className="text-xs font-bold text-foreground/80">Violações Detectadas:</p>
                          {compliance.violacoes.map((v, i) => (
                            <div key={i} className={`rounded-lg p-3 text-xs ${
                              v.tipo === 'proibido' ? 'bg-red-500/10 border border-red-500/30' :
                              v.tipo === 'alerta' ? 'bg-yellow-500/10 border border-yellow-500/30' :
                              'bg-blue-500/10 border border-blue-500/30'
                            }`}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold">{v.tipo === 'proibido' ? '🚫' : v.tipo === 'alerta' ? '⚠️' : '💡'}</span>
                                <span className="font-mono text-[10px] opacity-70">{v.regra}</span>
                              </div>
                              <p className="text-foreground/70">{v.descricao}</p>
                              <p className="text-foreground/50 mt-1">Trecho detectado: <strong>"{v.trecho}"</strong></p>
                            </div>
                          ))}
                        </div>
                      )}

                      {compliance.sugestoes.length > 0 && (
                        <div className="mt-4 bg-background/30 rounded-lg p-3">
                          <p className="text-xs font-bold mb-2">💡 Sugestões de Melhoria:</p>
                          {compliance.sugestoes.map((s, i) => (
                            <p key={i} className="text-xs text-foreground/70">• {s}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Sidebar - Regras CFM */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2">🛡️ Regras CFM Ativas</h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {REGRAS_CFM.map(regra => (
                  <div key={regra.id} className="bg-background/50 rounded-lg p-2.5 border border-border/50">
                    <p className="text-[10px] font-mono text-primary">{regra.regra}</p>
                    <p className="text-xs text-foreground/70 mt-1">{regra.descricao}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-b from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4">
              <h3 className="font-bold text-sm mb-2 text-yellow-400">⚖️ Lembre-se</h3>
              <ul className="text-xs text-foreground/70 space-y-1.5">
                <li>• Sempre inclua CRM e RQE</li>
                <li>• Nunca divulgue preços</li>
                <li>• Nunca garanta resultados</li>
                <li>• Não use antes/depois</li>
                <li>• Não use superlativos</li>
                <li>• Inclua disclaimer educacional</li>
                <li>• TCLE para qualquer imagem de paciente</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Templates */}
      {tela === 'templates' && (
        <div className="grid md:grid-cols-2 gap-4">
          {TEMPLATES_CONTEUDO.map((t, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition">
              <h3 className="font-bold mb-2">{t.titulo}</h3>
              <pre className="text-xs text-foreground/60 bg-background/50 rounded-lg p-3 whitespace-pre-wrap mb-3 max-h-48 overflow-y-auto">{t.modelo}</pre>
              <div className="mb-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">Dicas:</p>
                {t.dicas.map((d, j) => <p key={j} className="text-xs text-foreground/50">• {d}</p>)}
              </div>
              <button onClick={() => aplicarTemplate(t)}
                className="w-full px-3 py-2 bg-primary/20 text-primary rounded-lg text-xs font-medium hover:bg-primary/30 transition">
                📋 Usar Template
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Meus Posts */}
      {tela === 'meus-posts' && (
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <p className="text-2xl mb-2">📄</p>
              <p className="text-muted-foreground">Nenhum post criado ainda.</p>
            </div>
          ) : posts.map(post => {
            const cor = statusCor(post.compliance.status);
            return (
              <div key={post.id} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-bold">{post.titulo}</h4>
                    <p className="text-xs text-muted-foreground">{post.criadoEm.toLocaleString('pt-BR')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${cor.bg} ${cor.text}`}>{cor.label}</span>
                    <span className="text-xs bg-muted/50 px-2 py-0.5 rounded-full">{post.plataforma}</span>
                  </div>
                </div>
                <p className="text-sm text-foreground/70 whitespace-pre-wrap">{post.conteudo.substring(0, 200)}...</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Calendário */}
      {tela === 'calendario' && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-bold mb-4">📅 Calendário Editorial Médico</h3>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
            ))}
            {Array.from({ length: 35 }, (_, i) => {
              const dia = i - 5;
              const temPost = posts.some(p => p.agendadoPara && p.agendadoPara.getDate() === dia);
              return (
                <div key={i} className={`text-center py-3 rounded-lg text-sm ${
                  dia > 0 && dia <= 31 ? 'bg-background/50 hover:bg-accent cursor-pointer' : ''
                } ${temPost ? 'border-2 border-primary' : ''}`}>
                  {dia > 0 && dia <= 31 ? dia : ''}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground text-center">Agende posts diretamente no calendário. Todos passam por verificação CFM antes da publicação.</p>
        </div>
      )}

      <EducationalDisclaimer variant="footer" />
    </div>
  );
}
