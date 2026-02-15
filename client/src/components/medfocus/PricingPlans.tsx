/**
 * MedFocus Pricing Plans — Premium Design
 * Subscription management with Stripe integration
 */
import React, { useState } from 'react';
import { trpc } from '../../lib/trpc';
import { useAuth } from '../../_core/hooks/useAuth';

const plans = [
  {
    id: 'free' as const,
    name: 'Free',
    price: 'R$ 0',
    period: '/mês',
    description: 'Comece sua jornada médica',
    features: [
      'Acesso ao Dashboard',
      'Cronograma básico',
      'Pomodoro Timer',
      'Checklist semanal',
      '3 consultas ao MedGenie AI por dia',
      'Conteúdo pré-carregado (1° e 2° ano)',
    ],
    cta: 'Plano Atual',
    popular: false,
    gradient: 'from-slate-500 to-slate-600',
  },
  {
    id: 'pro' as const,
    name: 'Pro',
    price: 'R$ 29',
    priceCents: ',90',
    period: '/mês',
    description: 'Para estudantes dedicados',
    features: [
      'Tudo do plano Free',
      'MedGenie AI ilimitado',
      'Conteúdo completo (1° ao 6° ano)',
      'Flashcards e Quizzes ilimitados',
      'Gerador de materiais de estudo',
      'Pesquisa Global com IA',
      'Gamificação completa',
      'Notificações push de estudo',
    ],
    cta: 'Assinar Pro',
    popular: true,
    gradient: 'from-primary to-primary/80',
  },
  {
    id: 'premium' as const,
    name: 'Premium',
    price: 'R$ 49',
    priceCents: ',90',
    period: '/mês',
    description: 'Preparação para residência',
    features: [
      'Tudo do plano Pro',
      'Simulados de residência (ENARE, USP, AMP)',
      'Mentoria IA personalizada',
      'Relatórios avançados',
      'Acesso prioritário a novos recursos',
      'Suporte dedicado',
    ],
    cta: 'Assinar Premium',
    popular: false,
    gradient: 'from-amber-500 to-orange-500',
  },
];

const PricingPlans: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const checkoutMutation = trpc.stripe.createCheckout.useMutation();

  const currentPlan = (user as any)?.plan || 'free';

  const handleSubscribe = async (planId: 'pro' | 'premium') => {
    if (!isAuthenticated) {
      alert('Faça login para assinar um plano.');
      return;
    }
    setLoadingPlan(planId);
    try {
      const result = await checkoutMutation.mutateAsync({ planId });
      if (result.url) {
        window.open(result.url, '_blank');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Erro ao iniciar checkout. Tente novamente.');
    } finally {
      setLoadingPlan(null);
    }
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
          Escolha o plano ideal para seus estudos
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Invista no seu futuro médico. Cancele quando quiser, sem compromisso.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-card rounded-2xl border ${
              plan.popular ? 'border-primary shadow-xl shadow-primary/10 scale-105' : 'border-border'
            } p-6 flex flex-col transition-all hover:shadow-lg`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-full">
                Mais Popular
              </div>
            )}

            {/* Plan Header */}
            <div className="space-y-3 mb-6">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}>
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
              <div className="flex items-baseline gap-0.5">
                <span className="text-3xl font-display font-black text-foreground">{plan.price}</span>
                {plan.priceCents && <span className="text-lg font-bold text-foreground">{plan.priceCents}</span>}
                <span className="text-sm text-muted-foreground ml-1">{plan.period}</span>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2.5 flex-1 mb-6">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span className="text-xs text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => plan.id !== 'free' && handleSubscribe(plan.id)}
              disabled={currentPlan === plan.id || loadingPlan === plan.id}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                currentPlan === plan.id
                  ? 'bg-muted text-muted-foreground cursor-default'
                  : plan.popular
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]'
                  : 'bg-muted text-foreground hover:bg-accent active:scale-[0.98]'
              } ${loadingPlan === plan.id ? 'opacity-50' : ''}`}
            >
              {loadingPlan === plan.id ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Processando...
                </span>
              ) : currentPlan === plan.id ? (
                'Plano Atual'
              ) : (
                plan.cta
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Trust Section */}
      <div className="text-center space-y-2 pt-4">
        <div className="flex items-center justify-center gap-6 text-muted-foreground">
          <div className="flex items-center gap-1.5 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            Pagamento seguro
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Cancele quando quiser
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Suporte brasileiro
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground">
          Cartão de teste: 4242 4242 4242 4242 | Qualquer data futura | Qualquer CVC
        </p>
      </div>
    </div>
  );
};

export default PricingPlans;
