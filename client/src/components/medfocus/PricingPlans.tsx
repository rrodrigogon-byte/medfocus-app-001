/**
 * MedFocus Pricing Plans v5 — Trial 7 dias + Stripe Checkout
 * Plano Pro: R$ 29,90/mês ou R$ 250,00/ano
 * Trial de 7 dias gratuito com cartão de crédito obrigatório
 */
import React, { useState } from 'react';
import { trpc } from '../../lib/trpc';

const PricingPlans: React.FC = () => {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState(false);
  
  const subscriptionQuery = trpc.stripe.getSubscription.useQuery(undefined, { retry: false });
  const createCheckout = trpc.stripe.createCheckout.useMutation();
  const startTrial = trpc.stripe.startTrial.useMutation();

  const sub = subscriptionQuery.data;
  const currentPlan = sub?.plan || 'free';
  const hasFullAccess = sub?.hasFullAccess || false;
  const trialActive = sub?.trialActive || false;
  const trialDaysLeft = sub?.trialDaysLeft || 0;

  const handleSubscribe = async () => {
    try {
      setLoadingPlan(true);
      const result = await createCheckout.mutateAsync({ planId: 'pro', interval: billing });
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      import('sonner').then(m => m.toast.error(err.message || 'Erro ao criar checkout. Faça login primeiro.'));
    } finally {
      setLoadingPlan(false);
    }
  };

  const freeFeatures = [
    { text: 'Dashboard e Cronograma', included: true },
    { text: 'Pomodoro Timer', included: true },
    { text: 'Checklist Semanal', included: true },
    { text: 'Conteúdo básico (1° e 2° ano)', included: true },
    { text: '3 consultas MedGenie AI/dia', included: true },
    { text: 'Calculadoras médicas', included: true },
    { text: 'CID-10 e ANVISA (consulta)', included: true },
    { text: 'Gamificação básica', included: true },
    { text: 'MedGenie AI ilimitado', included: false },
    { text: 'Simulados de Residência', included: false },
    { text: 'Casos Clínicos com IA', included: false },
    { text: 'Modo Batalha', included: false },
    { text: 'Portal do Professor', included: false },
  ];

  const proFeatures = [
    { text: 'Tudo do plano Estudante', included: true, highlight: true },
    { text: 'MedGenie AI ilimitado', included: true },
    { text: 'Conteúdo completo (1° ao 6° ano)', included: true },
    { text: 'Flashcards e Quizzes ilimitados', included: true },
    { text: 'Gerador de materiais com IA', included: true },
    { text: 'Transcrição de aulas ilimitada', included: true },
    { text: 'Pesquisa Global + PubMed', included: true },
    { text: 'Interações Medicamentosas IA', included: true },
    { text: 'FDA Drugs + ANVISA avançado', included: true },
    { text: 'Protocolos Clínicos IA', included: true },
    { text: 'Modo Batalha multiplayer', included: true },
    { text: 'Casos Clínicos com IA', included: true },
    { text: 'Resumos inteligentes', included: true },
    { text: 'Quiz Avançado', included: true },
    { text: 'Simulados de Residência', included: true },
    { text: 'Atlas Anatômico interativo', included: true },
    { text: 'Apoio Diagnóstico IA', included: true },
    { text: 'Relatórios PDF exportáveis', included: true },
    { text: 'Portal do Professor completo', included: true },
    { text: 'Sala de Aula virtual', included: true },
    { text: 'Analytics de Turma', included: true },
    { text: 'Suporte prioritário', included: true },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          Planos MedFocus
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground">
          Invista no seu futuro médico
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto text-sm">
          Comece com 7 dias grátis. Cancele quando quiser, sem compromisso.
        </p>
      </div>

      {/* Trial Banner */}
      {trialActive && (
        <div className="max-w-2xl mx-auto bg-gradient-to-r from-primary/20 to-teal-500/20 border border-primary/30 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span className="text-sm font-bold text-foreground">Período de Teste Ativo</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Você tem <span className="font-bold text-primary">{trialDaysLeft} dias</span> restantes no seu período de teste gratuito.
            Após o término, a cobrança será feita automaticamente no cartão cadastrado.
          </p>
        </div>
      )}

      {/* Subscription Active Banner */}
      {currentPlan === 'pro' && !trialActive && (
        <div className="max-w-2xl mx-auto bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            <span className="text-sm font-bold text-foreground">Assinatura Pro Ativa</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Você tem acesso completo a todos os recursos do MedFocus Pro.
          </p>
        </div>
      )}

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-3">
        <span className={`text-sm font-medium ${billing === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>Mensal</span>
        <button
          onClick={() => setBilling(b => b === 'monthly' ? 'yearly' : 'monthly')}
          className={`relative w-12 h-6 rounded-full transition-colors ${billing === 'yearly' ? 'bg-primary' : 'bg-muted'}`}
        >
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${billing === 'yearly' ? 'translate-x-7' : 'translate-x-1'}`} />
        </button>
        <span className={`text-sm font-medium ${billing === 'yearly' ? 'text-foreground' : 'text-muted-foreground'}`}>
          Anual
          <span className="ml-1 text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full">Economize R$ 108,80</span>
        </span>
      </div>

      {/* Plans Grid - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="relative bg-card rounded-2xl border border-border p-6 flex flex-col transition-all hover:shadow-lg">
          <div className="space-y-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-foreground">Estudante</h3>
              <p className="text-xs text-muted-foreground">Comece sua jornada médica gratuitamente</p>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-3xl font-display font-black text-foreground">R$ 0</span>
              <span className="text-sm text-muted-foreground ml-1">/mês</span>
            </div>
          </div>

          <div className="space-y-2 flex-1 mb-6">
            {freeFeatures.map((f, i) => (
              <div key={i} className={`flex items-start gap-2 ${!f.included ? 'opacity-40' : ''}`}>
                {f.included ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0 mt-0.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-muted-foreground/30 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                )}
                <span className="text-xs text-muted-foreground">{f.text}</span>
              </div>
            ))}
          </div>

          <button disabled className="w-full py-3 rounded-xl font-bold text-sm bg-muted text-muted-foreground cursor-default">
            {currentPlan === 'free' && !hasFullAccess ? 'Plano Atual' : 'Plano Gratuito'}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="relative bg-card rounded-2xl border border-primary/30 shadow-xl shadow-primary/10 p-6 flex flex-col transition-all hover:shadow-lg md:scale-105">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-full">
            7 Dias Grátis
          </div>

          <div className="space-y-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-teal-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-foreground">Profissional</h3>
              <p className="text-xs text-muted-foreground">Acesso completo a todos os recursos</p>
            </div>
            <div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-3xl font-display font-black text-foreground">
                  {billing === 'yearly' ? 'R$ 250' : 'R$ 29'}
                </span>
                {billing === 'monthly' && <span className="text-lg font-bold text-foreground">,90</span>}
                <span className="text-sm text-muted-foreground ml-1">
                  {billing === 'yearly' ? '/ano' : '/mês'}
                </span>
              </div>
              {billing === 'yearly' && (
                <p className="text-[10px] text-green-400 mt-1">Equivale a R$ 20,83/mês — Economia de R$ 108,80</p>
              )}
              {billing === 'monthly' && (
                <p className="text-[10px] text-muted-foreground mt-1">ou R$ 250,00/ano (economize R$ 108,80)</p>
              )}
            </div>
          </div>

          <div className="space-y-2 flex-1 mb-6">
            {proFeatures.map((f, i) => (
              <div key={i} className={`flex items-start gap-2`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 shrink-0 mt-0.5 ${f.highlight ? 'text-amber-400' : 'text-primary'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span className={`text-xs ${f.highlight ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>{f.text}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubscribe}
            disabled={loadingPlan || hasFullAccess}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
              hasFullAccess
                ? 'bg-green-500/20 text-green-400 cursor-default'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] shadow-lg shadow-primary/20'
            }`}
          >
            {loadingPlan ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Redirecionando...
              </span>
            ) : hasFullAccess ? (
              'Assinatura Ativa'
            ) : (
              `Começar 7 Dias Grátis — ${billing === 'yearly' ? 'R$ 250/ano' : 'R$ 29,90/mês'}`
            )}
          </button>
          <p className="text-[10px] text-center text-muted-foreground mt-2">
            Cartão de crédito obrigatório. Cancele a qualquer momento durante o trial.
          </p>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-lg font-display font-bold text-foreground text-center mb-4">Comparação Detalhada</h2>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-muted-foreground font-medium">Recurso</th>
                <th className="text-center p-3 text-muted-foreground font-medium">Estudante</th>
                <th className="text-center p-3 text-primary font-bold bg-primary/5">Profissional</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['MedGenie AI', '3/dia', 'Ilimitado'],
                ['Conteúdo Acadêmico', '1° e 2° ano', '1° ao 6° ano'],
                ['Flashcards', '10/dia', 'Ilimitado'],
                ['Quizzes', '3/dia', 'Ilimitado'],
                ['Transcrição de Aulas', '1/dia', 'Ilimitado'],
                ['Simulados de Residência', '—', 'ENARE, USP, AMP, UNICAMP'],
                ['Casos Clínicos IA', '—', 'Ilimitado'],
                ['Resumos Inteligentes', '—', 'Ilimitado'],
                ['Modo Batalha', '—', 'Multiplayer'],
                ['Apoio Diagnóstico', '—', 'IA Avançado'],
                ['Interações Medicamentosas', '—', 'IA Completo'],
                ['Protocolos Clínicos', '—', 'IA + Evidências'],
                ['Portal Professor', '—', 'Completo'],
                ['Relatórios PDF', '—', 'Exportáveis'],
                ['Suporte', 'Comunidade', 'Prioritário'],
              ].map(([feature, free, pro], i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="p-3 font-medium text-foreground">{feature}</td>
                  <td className="p-3 text-center text-muted-foreground">{free}</td>
                  <td className="p-3 text-center text-primary bg-primary/5 font-medium">{pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trust Section */}
      <div className="text-center space-y-3 pt-4">
        <div className="flex items-center justify-center gap-6 text-muted-foreground flex-wrap">
          <div className="flex items-center gap-1.5 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            Pagamento seguro via Stripe
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Cancele quando quiser
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            7 dias grátis
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            Cartão de crédito
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground">
          Aceita Visa, Mastercard, Elo e American Express. Processado com segurança via Stripe.
        </p>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto space-y-3">
        <h2 className="text-lg font-display font-bold text-foreground text-center mb-4">Perguntas Frequentes</h2>
        {[
          { q: 'Como funciona o período de teste?', a: 'Ao se cadastrar no plano Pro, você recebe 7 dias grátis com acesso completo a todos os recursos. É necessário cadastrar um cartão de crédito válido, mas você só será cobrado após o término do período de teste.' },
          { q: 'Posso cancelar durante o período de teste?', a: 'Sim! Se cancelar antes dos 7 dias, não será cobrado nenhum valor. O acesso continua até o fim do período de teste.' },
          { q: 'Qual a diferença entre mensal e anual?', a: 'O plano mensal custa R$ 29,90/mês. O plano anual custa R$ 250,00/ano (equivalente a R$ 20,83/mês), uma economia de R$ 108,80 por ano.' },
          { q: 'Posso mudar de plano depois?', a: 'Sim! Você pode fazer upgrade do mensal para anual ou cancelar a qualquer momento. O valor será ajustado proporcionalmente.' },
          { q: 'O conteúdo é atualizado?', a: 'Sim! Todo o conteúdo é atualizado regularmente com base nas últimas diretrizes médicas brasileiras e provas de residência.' },
          { q: 'Funciona em celular?', a: 'Sim! O MedFocus é totalmente responsivo e funciona em qualquer dispositivo com navegador.' },
        ].map((faq, i) => (
          <details key={i} className="bg-card border border-border rounded-xl group">
            <summary className="p-4 text-sm font-bold text-foreground cursor-pointer flex items-center justify-between">
              {faq.q}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-muted-foreground group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 9l-7 7-7-7"/></svg>
            </summary>
            <div className="px-4 pb-4 text-xs text-muted-foreground">{faq.a}</div>
          </details>
        ))}
      </div>
    </div>
  );
};

export default PricingPlans;
