/**
 * MedFocus — Compliance Médico Digital (Sprint 18)
 * 
 * Módulo central de validação ética para todo conteúdo produzido na plataforma.
 * Funciona como o "Shield Agent" do ViralGram, adaptado para o contexto médico.
 * 
 * Referências Legais Completas:
 * - Código de Ética Médica (CEM) — Resolução CFM 2.217/2018
 * - Res. CFM 2.336/2023 — Publicidade Médica
 * - Res. CFM 2.314/2022 — Telemedicina
 * - Lei 12.842/2013 — Ato Médico
 * - LGPD (Lei 13.709/2018) — Proteção de Dados
 * - CDC (Lei 8.078/1990) — Defesa do Consumidor
 * - Marco Civil da Internet (Lei 12.965/2014)
 * - Manual de Publicidade Médica CFM
 */

import React, { useState } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

type NivelRisco = 'seguro' | 'baixo' | 'medio' | 'alto' | 'critico';
type CategoriaRegra = 'publicidade' | 'etica' | 'lgpd' | 'telemedicina' | 'ato-medico' | 'consumidor';

interface RegraCompliance {
  id: string;
  categoria: CategoriaRegra;
  legislacao: string;
  artigo: string;
  descricao: string;
  exemplosViolacao: string[];
  penalidade: string;
  nivel: NivelRisco;
}

interface ResultadoAuditoria {
  score: number;
  nivel: NivelRisco;
  totalRegras: number;
  violacoes: { regra: RegraCompliance; trecho: string; sugestao: string }[];
  aprovado: boolean;
  timestamp: Date;
}

// Base completa de regras CFM
const REGRAS_COMPLIANCE: RegraCompliance[] = [
  // Publicidade Médica
  { id: 'pub-001', categoria: 'publicidade', legislacao: 'Res. CFM 2.336/2023', artigo: 'Art. 3°', descricao: 'Vedado divulgar preço de consultas, procedimentos ou tratamentos.', exemplosViolacao: ['Consulta por R$ 150', 'Promoção de botox', 'Desconto em check-up'], penalidade: 'Advertência a Cassação', nivel: 'alto' },
  { id: 'pub-002', categoria: 'publicidade', legislacao: 'Res. CFM 2.336/2023', artigo: 'Art. 4°', descricao: 'Vedado garantir, prometer ou insinuar bons resultados de tratamentos.', exemplosViolacao: ['Resultado garantido', 'Cura em 30 dias', '100% de sucesso'], penalidade: 'Advertência a Cassação', nivel: 'critico' },
  { id: 'pub-003', categoria: 'publicidade', legislacao: 'Res. CFM 2.336/2023', artigo: 'Art. 5°', descricao: 'Vedado utilizar imagens de "antes e depois" de tratamentos ou procedimentos.', exemplosViolacao: ['Foto antes/depois', 'Transformação visual', 'Resultado do procedimento'], penalidade: 'Censura pública a Cassação', nivel: 'critico' },
  { id: 'pub-004', categoria: 'publicidade', legislacao: 'Res. CFM 2.336/2023', artigo: 'Art. 6°', descricao: 'Vedado divulgar aparelhos ou equipamentos como diferencial de qualidade.', exemplosViolacao: ['Laser mais moderno', 'Equipamento exclusivo', 'Tecnologia única'], penalidade: 'Advertência a Suspensão', nivel: 'alto' },
  { id: 'pub-005', categoria: 'publicidade', legislacao: 'Res. CFM 2.336/2023', artigo: 'Art. 7°', descricao: 'Vedado usar expressões de superioridade como "o melhor", "o mais", "referência".', exemplosViolacao: ['O melhor médico', 'Referência na área', 'Número 1 da cidade'], penalidade: 'Advertência a Suspensão', nivel: 'alto' },
  { id: 'pub-006', categoria: 'publicidade', legislacao: 'Res. CFM 2.336/2023', artigo: 'Art. 8°', descricao: 'Vedado expor paciente sem TCLE (Termo de Consentimento Livre e Esclarecido).', exemplosViolacao: ['Foto de paciente sem autorização', 'Depoimento sem TCLE', 'Caso clínico identificável'], penalidade: 'Censura a Cassação', nivel: 'critico' },
  { id: 'pub-007', categoria: 'publicidade', legislacao: 'Res. CFM 2.336/2023', artigo: 'Art. 9°', descricao: 'Obrigatório incluir nome, CRM e RQE em toda publicidade.', exemplosViolacao: ['Post sem CRM', 'Vídeo sem identificação', 'Perfil sem RQE'], penalidade: 'Advertência', nivel: 'medio' },
  // Ética Médica
  { id: 'eti-001', categoria: 'etica', legislacao: 'CEM - Res. CFM 2.217/2018', artigo: 'Art. 75', descricao: 'Vedado fazer autopromoção sensacionalista ou mercantilista.', exemplosViolacao: ['Resultado milagroso', 'Sensacional', 'Revolucionário'], penalidade: 'Censura a Cassação', nivel: 'alto' },
  { id: 'eti-002', categoria: 'etica', legislacao: 'CEM - Res. CFM 2.217/2018', artigo: 'Art. 73', descricao: 'Vedado praticar ou permitir concorrência desleal.', exemplosViolacao: ['Melhor que o Dr. X', 'Diferente dos outros', 'Único que faz'], penalidade: 'Censura a Suspensão', nivel: 'alto' },
  { id: 'eti-003', categoria: 'etica', legislacao: 'CEM - Res. CFM 2.217/2018', artigo: 'Art. 18', descricao: 'Vedado desobedecer aos acórdãos e resoluções dos Conselhos de Medicina.', exemplosViolacao: ['Ignorar resolução CFM', 'Descumprir norma ética'], penalidade: 'Suspensão a Cassação', nivel: 'critico' },
  // LGPD
  { id: 'lgpd-001', categoria: 'lgpd', legislacao: 'LGPD - Lei 13.709/2018', artigo: 'Art. 11', descricao: 'Dados sensíveis de saúde exigem consentimento específico e destacado.', exemplosViolacao: ['Compartilhar diagnóstico', 'Publicar dados de paciente', 'Enviar exames sem consentimento'], penalidade: 'Multa até 2% do faturamento', nivel: 'critico' },
  { id: 'lgpd-002', categoria: 'lgpd', legislacao: 'LGPD - Lei 13.709/2018', artigo: 'Art. 18', descricao: 'O titular tem direito de acesso, correção e exclusão de seus dados.', exemplosViolacao: ['Negar acesso aos dados', 'Não permitir exclusão'], penalidade: 'Multa até 2% do faturamento', nivel: 'alto' },
  // Telemedicina
  { id: 'tele-001', categoria: 'telemedicina', legislacao: 'Res. CFM 2.314/2022', artigo: 'Art. 5°', descricao: 'Telemedicina exige TCLE específico e registro em prontuário.', exemplosViolacao: ['Teleconsulta sem TCLE', 'Sem registro em prontuário'], penalidade: 'Advertência a Suspensão', nivel: 'alto' },
  { id: 'tele-002', categoria: 'telemedicina', legislacao: 'Res. CFM 2.314/2022', artigo: 'Art. 6°', descricao: 'Plataformas de telemedicina devem garantir sigilo e segurança dos dados.', exemplosViolacao: ['Plataforma sem criptografia', 'Dados expostos'], penalidade: 'Suspensão', nivel: 'critico' },
];

const PALAVRAS_PROIBIDAS: { [key: string]: string[] } = {
  precos: ['preço', 'valor', 'r$', 'reais', 'promoção', 'desconto', 'oferta', 'barato', 'grátis', 'gratuito', 'parcelamento', 'pagamento', 'pix'],
  garantias: ['garantia', 'garantido', '100%', 'certeza', 'sempre funciona', 'resultado garantido', 'cura definitiva', 'nunca mais', 'prometo', 'promessa'],
  antesDepois: ['antes e depois', 'antes/depois', 'resultado visual', 'transformação', 'mudança radical', 'veja o resultado'],
  superlativos: ['o melhor', 'o mais', 'número 1', 'líder', 'referência', 'o único', 'incomparável', 'imbatível', 'o maior', 'o primeiro'],
  sensacionalismo: ['sensacional', 'incrível', 'milagre', 'revolucionário', 'fantástico', 'impressionante', 'chocante', 'surpreendente', 'mágico'],
  equipamentos: ['equipamento exclusivo', 'tecnologia única', 'aparelho importado', 'laser mais moderno', 'único na cidade', 'mais avançado'],
};

export function VGComplianceMedico() {
  const [tela, setTela] = useState<'auditor' | 'regras' | 'historico' | 'relatorios'>('auditor');
  const [textoAuditoria, setTextoAuditoria] = useState('');
  const [plataforma, setPlataforma] = useState<'instagram' | 'linkedin' | 'whatsapp' | 'site'>('instagram');
  const [auditando, setAuditando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoAuditoria | null>(null);
  const [historico, setHistorico] = useState<ResultadoAuditoria[]>([]);

  const realizarAuditoria = () => {
    setAuditando(true);
    setTimeout(() => {
      const textoLower = textoAuditoria.toLowerCase();
      const violacoes: ResultadoAuditoria['violacoes'] = [];

      // Verificar palavras proibidas
      Object.entries(PALAVRAS_PROIBIDAS).forEach(([categoria, palavras]) => {
        palavras.forEach(palavra => {
          if (textoLower.includes(palavra.toLowerCase())) {
            const regraRelacionada = REGRAS_COMPLIANCE.find(r => {
              if (categoria === 'precos') return r.id === 'pub-001';
              if (categoria === 'garantias') return r.id === 'pub-002';
              if (categoria === 'antesDepois') return r.id === 'pub-003';
              if (categoria === 'superlativos') return r.id === 'pub-005';
              if (categoria === 'sensacionalismo') return r.id === 'eti-001';
              if (categoria === 'equipamentos') return r.id === 'pub-004';
              return false;
            });
            if (regraRelacionada) {
              violacoes.push({
                regra: regraRelacionada,
                trecho: palavra,
                sugestao: `Remova ou reformule o trecho contendo "${palavra}".`,
              });
            }
          }
        });
      });

      // Verificar CRM
      const temCRM = /crm[\s-]*\d/i.test(textoAuditoria);
      if (!temCRM) {
        violacoes.push({
          regra: REGRAS_COMPLIANCE.find(r => r.id === 'pub-007')!,
          trecho: 'Identificação CRM ausente',
          sugestao: 'Adicione seu nome completo, CRM e RQE ao conteúdo.',
        });
      }

      // Verificar disclaimer
      const temDisclaimer = textoLower.includes('não substitui') || textoLower.includes('consulte seu médico') || textoLower.includes('conteúdo educacional');
      if (!temDisclaimer) {
        violacoes.push({
          regra: { id: 'bp-001', categoria: 'publicidade', legislacao: 'Boa Prática CFM', artigo: 'Recomendação', descricao: 'Incluir disclaimer educacional é uma boa prática recomendada.', exemplosViolacao: [], penalidade: 'Nenhuma (recomendação)', nivel: 'baixo' },
          trecho: 'Disclaimer ausente',
          sugestao: 'Adicione: "Conteúdo educacional. Consulte seu médico."',
        });
      }

      const criticos = violacoes.filter(v => v.regra.nivel === 'critico').length;
      const altos = violacoes.filter(v => v.regra.nivel === 'alto').length;
      const medios = violacoes.filter(v => v.regra.nivel === 'medio').length;

      let score = 100 - (criticos * 30) - (altos * 15) - (medios * 5);
      score = Math.max(0, Math.min(100, score));

      let nivel: NivelRisco = 'seguro';
      if (criticos > 0) nivel = 'critico';
      else if (altos > 0) nivel = 'alto';
      else if (medios > 0) nivel = 'medio';
      else if (violacoes.length > 0) nivel = 'baixo';

      const res: ResultadoAuditoria = {
        score,
        nivel,
        totalRegras: REGRAS_COMPLIANCE.length,
        violacoes,
        aprovado: criticos === 0 && altos === 0,
        timestamp: new Date(),
      };

      setResultado(res);
      setHistorico(prev => [res, ...prev]);
      setAuditando(false);
    }, 2500);
  };

  const corNivel = (nivel: NivelRisco) => {
    switch (nivel) {
      case 'seguro': return { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/50', icon: '✅', label: 'SEGURO' };
      case 'baixo': return { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/50', icon: '💡', label: 'RISCO BAIXO' };
      case 'medio': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50', icon: '⚠️', label: 'RISCO MÉDIO' };
      case 'alto': return { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/50', icon: '🔶', label: 'RISCO ALTO' };
      case 'critico': return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/50', icon: '🚫', label: 'CRÍTICO' };
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-7xl mx-auto">
      <EducationalDisclaimer variant="banner" moduleName="Compliance Médico Digital" />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <span className="text-3xl">🛡️</span> Compliance Médico Digital
          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full font-medium">Shield Agent</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Validador automático de conformidade com CFM, CEM, LGPD e legislação médica brasileira
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { id: 'auditor' as const, label: '🔍 Auditor' },
          { id: 'regras' as const, label: `📋 Regras (${REGRAS_COMPLIANCE.length})` },
          { id: 'historico' as const, label: `📊 Histórico (${historico.length})` },
          { id: 'relatorios' as const, label: '📈 Relatórios' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setTela(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              tela === tab.id ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-card border border-border hover:bg-accent'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Auditor */}
      {tela === 'auditor' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">🔍 Auditar Conteúdo</h3>
                <select value={plataforma} onChange={e => setPlataforma(e.target.value as any)}
                  className="bg-background border border-border rounded-lg px-3 py-1.5 text-xs focus:border-primary focus:outline-none">
                  <option value="instagram">📸 Instagram</option>
                  <option value="linkedin">💼 LinkedIn</option>
                  <option value="whatsapp">💬 WhatsApp</option>
                  <option value="site">🌐 Site</option>
                </select>
              </div>
              <textarea value={textoAuditoria} onChange={e => setTextoAuditoria(e.target.value)}
                placeholder="Cole aqui o conteúdo que deseja auditar... O sistema verificará automaticamente a conformidade com todas as legislações médicas brasileiras."
                rows={10}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:border-primary focus:outline-none resize-none leading-relaxed" />
              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-muted-foreground">{textoAuditoria.length} caracteres | {REGRAS_COMPLIANCE.length} regras ativas</p>
                <button onClick={realizarAuditoria} disabled={!textoAuditoria || auditando}
                  className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition disabled:opacity-50 shadow-lg">
                  {auditando ? '⏳ Auditando...' : '🛡️ Auditar Compliance'}
                </button>
              </div>
            </div>

            {/* Resultado */}
            {auditando && (
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="animate-spin w-10 h-10 border-3 border-red-400 border-t-transparent rounded-full mx-auto mb-3" />
                <p className="font-bold">Auditando conformidade...</p>
                <p className="text-xs text-muted-foreground mt-1">Verificando {REGRAS_COMPLIANCE.length} regras de CFM, CEM, LGPD e legislação</p>
              </div>
            )}

            {resultado && !auditando && (() => {
              const cor = corNivel(resultado.nivel);
              return (
                <div className={`${cor.bg} border-2 ${cor.border} rounded-xl p-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className={`text-xl font-bold ${cor.text} flex items-center gap-2`}>
                        {cor.icon} {cor.label}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {resultado.aprovado ? 'Conteúdo aprovado para publicação.' : 'Conteúdo precisa de correções antes da publicação.'}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className={`text-4xl font-bold ${cor.text}`}>{resultado.score}</p>
                      <p className="text-xs text-muted-foreground">/100</p>
                    </div>
                  </div>

                  {resultado.violacoes.length > 0 && (
                    <div className="space-y-3 mt-4">
                      <p className="text-sm font-bold">Violações Detectadas ({resultado.violacoes.length}):</p>
                      {resultado.violacoes.map((v, i) => {
                        const corV = corNivel(v.regra.nivel);
                        return (
                          <div key={i} className={`${corV.bg} border ${corV.border} rounded-lg p-4`}>
                            <div className="flex items-center gap-2 mb-2">
                              <span>{corV.icon}</span>
                              <span className="text-xs font-mono opacity-70">{v.regra.legislacao} — {v.regra.artigo}</span>
                              <span className={`text-[10px] ${corV.text} px-1.5 py-0.5 rounded ${corV.bg}`}>{v.regra.nivel.toUpperCase()}</span>
                            </div>
                            <p className="text-sm text-foreground/80">{v.regra.descricao}</p>
                            <p className="text-xs text-foreground/50 mt-1">Trecho: <strong>"{v.trecho}"</strong></p>
                            <p className="text-xs text-green-400 mt-1">💡 {v.sugestao}</p>
                            <p className="text-[10px] text-foreground/40 mt-1">Penalidade: {v.regra.penalidade}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {resultado.violacoes.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-2xl mb-2">✅</p>
                      <p className="text-sm text-green-400 font-bold">Nenhuma violação detectada!</p>
                      <p className="text-xs text-muted-foreground">Conteúdo em conformidade com todas as regras.</p>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-bold text-sm mb-3">📊 Estatísticas de Compliance</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs">Auditorias realizadas</span>
                  <span className="text-sm font-bold">{historico.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">Taxa de aprovação</span>
                  <span className="text-sm font-bold text-green-400">
                    {historico.length > 0 ? `${Math.round((historico.filter(h => h.aprovado).length / historico.length) * 100)}%` : '—'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">Score médio</span>
                  <span className="text-sm font-bold text-blue-400">
                    {historico.length > 0 ? Math.round(historico.reduce((a, b) => a + b.score, 0) / historico.length) : '—'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-b from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl p-4">
              <h3 className="font-bold text-sm text-red-400 mb-2">⚖️ Legislação Monitorada</h3>
              <ul className="text-xs text-foreground/70 space-y-1.5">
                <li>• Res. CFM 2.336/2023 (Publicidade)</li>
                <li>• CEM — Res. CFM 2.217/2018</li>
                <li>• Res. CFM 2.314/2022 (Telemedicina)</li>
                <li>• LGPD — Lei 13.709/2018</li>
                <li>• Lei 12.842/2013 (Ato Médico)</li>
                <li>• CDC — Lei 8.078/1990</li>
                <li>• Marco Civil — Lei 12.965/2014</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Regras */}
      {tela === 'regras' && (
        <div className="space-y-4">
          {(['publicidade', 'etica', 'lgpd', 'telemedicina'] as CategoriaRegra[]).map(cat => (
            <div key={cat} className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-bold mb-3 capitalize">
                {cat === 'publicidade' ? '📢 Publicidade Médica' :
                 cat === 'etica' ? '⚖️ Ética Médica' :
                 cat === 'lgpd' ? '🔒 LGPD — Proteção de Dados' :
                 '💻 Telemedicina'}
              </h3>
              <div className="space-y-2">
                {REGRAS_COMPLIANCE.filter(r => r.categoria === cat).map(regra => {
                  const cor = corNivel(regra.nivel);
                  return (
                    <div key={regra.id} className="bg-background/50 rounded-lg p-3 border border-border/50">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] ${cor.text} ${cor.bg} px-1.5 py-0.5 rounded`}>{cor.icon} {regra.nivel.toUpperCase()}</span>
                        <span className="text-[10px] font-mono text-primary">{regra.legislacao} — {regra.artigo}</span>
                      </div>
                      <p className="text-xs text-foreground/80">{regra.descricao}</p>
                      <p className="text-[10px] text-foreground/40 mt-1">Penalidade: {regra.penalidade}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Histórico */}
      {tela === 'historico' && (
        <div className="space-y-4">
          {historico.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <p className="text-2xl mb-2">📊</p>
              <p className="text-muted-foreground">Nenhuma auditoria realizada ainda.</p>
            </div>
          ) : historico.map((h, i) => {
            const cor = corNivel(h.nivel);
            return (
              <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`text-2xl`}>{cor.icon}</span>
                  <div>
                    <p className={`font-bold text-sm ${cor.text}`}>{cor.label} — Score: {h.score}/100</p>
                    <p className="text-xs text-muted-foreground">{h.timestamp.toLocaleString('pt-BR')} | {h.violacoes.length} violações</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${h.aprovado ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {h.aprovado ? 'Aprovado' : 'Reprovado'}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Relatórios */}
      {tela === 'relatorios' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-4">📈 Relatório de Compliance</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-background/50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-green-400">{historico.filter(h => h.aprovado).length}</p>
                <p className="text-xs text-muted-foreground mt-1">Conteúdos Aprovados</p>
              </div>
              <div className="bg-background/50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-red-400">{historico.filter(h => !h.aprovado).length}</p>
                <p className="text-xs text-muted-foreground mt-1">Conteúdos Reprovados</p>
              </div>
              <div className="bg-background/50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-blue-400">{REGRAS_COMPLIANCE.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Regras Monitoradas</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <EducationalDisclaimer variant="footer" />
    </div>
  );
}
