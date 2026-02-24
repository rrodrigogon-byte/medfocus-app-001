/**
 * MedFocus Pricing Plans v4 — Premium Design with 3 Plans
 * Free, Pro, Premium with detailed feature comparison and payment integration
 */
import React, { useState } from 'react';

const plans = [
  {
    id: 'free' as const,
    name: 'Estudante',
    price: 'R$ 0',
    period: '/mês',
    description: 'Comece sua jornada médica gratuitamente',
    color: 'from-slate-500 to-slate-600',
    borderColor: 'border-slate-500/20',
    features: [
      { text: 'Dashboard e Cronograma', included: true },
      { text: 'Pomodoro Timer', included: true },
      { text: 'Checklist Semanal', included: true },
      { text: 'Conteúdo básico (1° e 2° ano)', included: true },
      { text: '3 consultas MedGenie AI/dia', included: true },
      { text: 'Calculadoras médicas básicas', included: true },
      { text: 'CID-10 e ANVISA (consulta)', included: true },
      { text: 'Transcrição de aulas (1/dia)', included: true },
      { text: 'Meu Conteúdo (até 50 itens)', included: true },
      { text: 'MedGenie AI ilimitado', included: false },
      { text: 'Simulados de Residência', included: false },
      { text: 'Apoio Diagnóstico IA', included: false },
      { text: 'Atlas Anatômico 3D', included: false },
      { text: 'Relatórios PDF', included: false },
      { text: 'Portal do Professor', included: false },
    ],
    cta: 'Plano Atual',
    popular: false,
  },
  {
    id: 'pro' as const,
    name: 'Profissional',
    price: 'R$ 39',
    priceCents: ',90',
    period: '/mês',
    yearlyPrice: 'R$ 29,90/mês no plano anual',
    description: 'Para estudantes dedicados que querem se destacar',
    color: 'from-primary to-teal-500',
    borderColor: 'border-primary/30',
    features: [
      { text: 'Tudo do plano Estudante', included: true, highlight: true },
      { text: 'MedGenie AI ilimitado', included: true },
      { text: 'Conteúdo completo (1° ao 6° ano)', included: true },
      { text: 'Flashcards e Quizzes ilimitados', included: true },
      { text: 'Gerador de materiais com IA', included: true },
      { text: 'Transcrição de aulas ilimitada', included: true },
      { text: 'Meu Conteúdo ilimitado', included: true },
      { text: 'Pesquisa Global + PubMed', included: true },
      { text: 'Interações Medicamentosas IA', included: true },
      { text: 'FDA Drugs + ANVISA avançado', included: true },
      { text: 'Protocolos Clínicos IA', included: true },
      { text: 'Modo Batalha multiplayer', included: true },
      { text: 'Relatórios PDF exportáveis', included: true },
      { text: 'Simulados de Residência', included: false },
      { text: 'Apoio Diagnóstico IA avançado', included: false },
    ],
    cta: 'Assinar Pro',
    popular: true,
  },
  {
    id: 'premium' as const,
    name: 'Residência',
    price: 'R$ 69',
    priceCents: ',90',
    period: '/mês',
    yearlyPrice: 'R$ 49,90/mês no plano anual',
    description: 'Preparação completa para residência médica',
    color: 'from-amber-500 to-orange-500',
    borderColor: 'border-amber-500/30',
    features: [
      { text: 'Tudo do plano Profissional', included: true, highlight: true },
      { text: 'Simulados ENARE, USP, AMP, UNICAMP', included: true },
      { text: 'Apoio Diagnóstico IA avançado', included: true },
      { text: 'Atlas Anatômico 3D interativo', included: true },
      { text: 'Casos Clínicos com IA', included: true },
      { text: 'Mentoria IA personalizada', included: true },
      { text: 'Portal do Professor completo', included: true },
      { text: 'Analytics avançado de turma', included: true },
      { text: 'Correção automática de trabalhos', included: true },
      { text: 'Integração farmacêutica completa', included: true },
      { text: 'Suporte prioritário 24/7', included: true },
      { text: 'Acesso antecipado a novos recursos', included: true },
      { text: 'Certificados de conclusão', included: true },
      { text: 'API para integração hospitalar', included: true },
      { text: 'Backup em nuvem ilimitado', included: true },
    ],
    cta: 'Assinar Premium',
    popular: false,
  },
];

const PricingPlans: React.FC = () => {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [currentPlan] = useState<string>('free');
  const [showPaymentModal, setShowPaymentModal] = useState<string | null>(null);
  const [paymentForm, setPaymentForm] = useState({ name: '', email: '', card: '', expiry: '', cvv: '' });

  const handleSubscribe = async (planId: string) => {
    if (planId === 'free') return;
    setShowPaymentModal(planId);
  };

  const processPayment = async () => {
    setLoadingPlan(showPaymentModal);
    // Simulate payment processing
    await new Promise(r => setTimeout(r, 2000));
    setLoadingPlan(null);
    setShowPaymentModal(null);
    import('sonner').then(m => m.toast.success('Assinatura realizada com sucesso! Bem-vindo ao MedFocus ' + (showPaymentModal === 'pro' ? 'Pro' : 'Premium') + '!'));
  };

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
          Escolha o plano ideal para seus estudos. Cancele quando quiser, sem compromisso.
        </p>
      </div>

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
          <span className="ml-1 text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full">-25%</span>
        </span>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-card rounded-2xl border ${
              plan.popular ? `${plan.borderColor} shadow-xl shadow-primary/10 md:scale-105` : 'border-border'
            } p-6 flex flex-col transition-all hover:shadow-lg`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-full">
                Mais Popular
              </div>
            )}

            {/* Plan Header */}
            <div className="space-y-3 mb-6">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {plan.id === 'free' && <path d="M12 2L2 7l10 5 10-5-10-5z"/>}
                  {plan.id === 'pro' && <><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></>}
                  {plan.id === 'premium' && <><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></>}
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-foreground">{plan.name}</h3>
                <p className="text-xs text-muted-foreground">{plan.description}</p>
              </div>
              <div>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-3xl font-display font-black text-foreground">
                    {billing === 'yearly' && plan.id !== 'free'
                      ? plan.id === 'pro' ? 'R$ 29' : 'R$ 49'
                      : plan.price}
                  </span>
                  {plan.priceCents && (
                    <span className="text-lg font-bold text-foreground">
                      {billing === 'yearly' ? ',90' : plan.priceCents}
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground ml-1">{plan.period}</span>
                </div>
                {billing === 'yearly' && plan.yearlyPrice && (
                  <p className="text-[10px] text-green-400 mt-1">Economia de 25% no plano anual</p>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2 flex-1 mb-6">
              {plan.features.map((feature, i) => (
                <div key={i} className={`flex items-start gap-2 ${!feature.included ? 'opacity-40' : ''}`}>
                  {feature.included ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 shrink-0 mt-0.5 ${feature.highlight ? 'text-amber-400' : 'text-primary'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-muted-foreground/30 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  )}
                  <span className={`text-xs ${feature.highlight ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => handleSubscribe(plan.id)}
              disabled={currentPlan === plan.id}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                currentPlan === plan.id
                  ? 'bg-muted text-muted-foreground cursor-default'
                  : plan.popular
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] shadow-lg shadow-primary/20'
                  : plan.id === 'premium'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 active:scale-[0.98]'
                  : 'bg-muted text-foreground hover:bg-accent active:scale-[0.98]'
              }`}
            >
              {currentPlan === plan.id ? '✓ Plano Atual' : plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Feature Comparison Table */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-lg font-display font-bold text-foreground text-center mb-4">Comparação Detalhada</h2>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-muted-foreground font-medium">Recurso</th>
                <th className="text-center p-3 text-muted-foreground font-medium">Estudante</th>
                <th className="text-center p-3 text-primary font-bold bg-primary/5">Profissional</th>
                <th className="text-center p-3 text-amber-400 font-medium">Residência</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['MedGenie AI', '3/dia', 'Ilimitado', 'Ilimitado + Mentoria'],
                ['Transcrição de Aulas', '1/dia', 'Ilimitado', 'Ilimitado + Resumo IA'],
                ['Meu Conteúdo', '50 itens', 'Ilimitado', 'Ilimitado + Cloud'],
                ['Flashcards', 'Básico', 'Ilimitado', 'Ilimitado + SM-2'],
                ['Simulados', '—', 'Básico', 'ENARE, USP, AMP'],
                ['Apoio Diagnóstico', '—', 'Básico', 'Avançado + Evidências'],
                ['Interações Med.', '—', '✓', '✓ + Alertas'],
                ['Portal Professor', '—', '—', '✓ Completo'],
                ['Relatórios PDF', '—', '✓', '✓ + Analytics'],
                ['Suporte', 'Comunidade', 'Email', 'Prioritário 24/7'],
                ['Armazenamento', '100 MB', '5 GB', 'Ilimitado'],
              ].map(([feature, free, pro, premium], i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="p-3 font-medium text-foreground">{feature}</td>
                  <td className="p-3 text-center text-muted-foreground">{free}</td>
                  <td className="p-3 text-center text-primary bg-primary/5 font-medium">{pro}</td>
                  <td className="p-3 text-center text-amber-400">{premium}</td>
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
            Pagamento seguro SSL
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Cancele quando quiser
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Suporte brasileiro
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            7 dias grátis
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground">
          Aceita PIX, cartão de crédito, débito e boleto. Processado com segurança via Stripe.
        </p>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto space-y-3">
        <h2 className="text-lg font-display font-bold text-foreground text-center mb-4">Perguntas Frequentes</h2>
        {[
          { q: 'Posso cancelar a qualquer momento?', a: 'Sim! Você pode cancelar sua assinatura a qualquer momento sem multa. O acesso continua até o fim do período pago.' },
          { q: 'Os planos incluem período de teste?', a: 'Sim! Os planos Pro e Premium incluem 7 dias grátis. Você não será cobrado durante o período de teste.' },
          { q: 'Posso mudar de plano depois?', a: 'Sim! Você pode fazer upgrade ou downgrade a qualquer momento. O valor será ajustado proporcionalmente.' },
          { q: 'O conteúdo é atualizado?', a: 'Sim! Todo o conteúdo é atualizado regularmente com base nas últimas diretrizes médicas e provas de residência.' },
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

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowPaymentModal(null)}>
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-foreground mb-1">
              Assinar MedFocus {showPaymentModal === 'pro' ? 'Profissional' : 'Residência'}
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              {billing === 'yearly'
                ? `${showPaymentModal === 'pro' ? 'R$ 358,80' : 'R$ 598,80'}/ano (${showPaymentModal === 'pro' ? 'R$ 29,90' : 'R$ 49,90'}/mês)`
                : `${showPaymentModal === 'pro' ? 'R$ 39,90' : 'R$ 69,90'}/mês`
              }
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Nome completo</label>
                <input type="text" value={paymentForm.name} onChange={e => setPaymentForm(p => ({ ...p, name: e.target.value }))} placeholder="Dr. João Silva" className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Email</label>
                <input type="email" value={paymentForm.email} onChange={e => setPaymentForm(p => ({ ...p, email: e.target.value }))} placeholder="joao@email.com" className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Número do cartão</label>
                <input type="text" value={paymentForm.card} onChange={e => setPaymentForm(p => ({ ...p, card: e.target.value }))} placeholder="4242 4242 4242 4242" maxLength={19} className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-muted-foreground block mb-1">Validade</label>
                  <input type="text" value={paymentForm.expiry} onChange={e => setPaymentForm(p => ({ ...p, expiry: e.target.value }))} placeholder="MM/AA" maxLength={5} className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground block mb-1">CVV</label>
                  <input type="text" value={paymentForm.cvv} onChange={e => setPaymentForm(p => ({ ...p, cvv: e.target.value }))} placeholder="123" maxLength={4} className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40" />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-green-500/5 border border-green-500/10 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                <span className="text-[10px] text-green-400">Pagamento seguro com criptografia SSL 256-bit</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowPaymentModal(null)} className="flex-1 py-2.5 border border-border rounded-xl text-sm text-muted-foreground hover:bg-muted/50">Cancelar</button>
                <button
                  onClick={processPayment}
                  disabled={!!loadingPlan}
                  className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 disabled:opacity-50"
                >
                  {loadingPlan ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                      Processando...
                    </span>
                  ) : 'Confirmar Pagamento'}
                </button>
              </div>

              <p className="text-[10px] text-center text-muted-foreground">
                Ao assinar, você concorda com os Termos de Uso e Política de Privacidade.
                {billing === 'monthly' ? ' Cobrança mensal.' : ' Cobrança anual.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingPlans;
