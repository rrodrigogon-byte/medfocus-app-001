/**
 * MedFocus Pricing Plans v8.0 — Dual Payment Gateway + Público Geral
 * Primary: Mercado Pago (Pix, Cartão, Boleto)
 * Fallback: Stripe (Cartão)
 * 
 * Público Geral: R$ 6,99/mês | Anual: R$ 67,10 (20% desc) — Saúde Pública
 * Estudante: R$ 49,90/mês | Anual: R$ 479,04 (20% desc)
 * Professor: R$ 49,90/mês | Anual: R$ 479,04 (20% desc) | Grátis na Parceria
 * Médico: R$ 59,90/mês | Anual: R$ 575,04 (20% desc)
 * Trial de 7 dias gratuito
 */
import React, { useState, useEffect } from 'react';
import { trpc } from '../../lib/trpc';

type PlanType = 'publico' | 'estudante' | 'medico' | 'professor';
type PaymentGateway = 'mercadopago' | 'stripe';

interface GatewayStatus {
  mercadopago: { available: boolean; primary: boolean; methods: string[] };
  stripe: { available: boolean; primary: boolean; methods: string[] };
  recommended: string;
}

const PricingPlans: React.FC = () => {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>('mercadopago');
  const [gateways, setGateways] = useState<GatewayStatus | null>(null);
  const [showPartnership, setShowPartnership] = useState(false);
  const [partnershipForm, setPartnershipForm] = useState({
    universityName: '', professorName: '', professorEmail: '', department: '',
    estimatedStudents: '', message: '',
  });
  const [partnershipSent, setPartnershipSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscriptionQuery = trpc.stripe.getSubscription.useQuery(undefined, { retry: false });
  const createStripeCheckout = trpc.stripe.createCheckout.useMutation();

  const sub = subscriptionQuery.data;
  const currentPlan = sub?.plan || 'free';
  const hasFullAccess = sub?.hasFullAccess || false;
  const trialActive = sub?.trialActive || false;
  const trialDaysLeft = sub?.trialDaysLeft || 0;

  // Fetch available payment gateways
  useEffect(() => {
    fetch('/api/payment/gateways')
      .then(r => r.json())
      .then((data: GatewayStatus) => {
        setGateways(data);
        if (data.recommended === 'mercadopago') setSelectedGateway('mercadopago');
        else if (data.recommended === 'stripe') setSelectedGateway('stripe');
      })
      .catch(() => {
        setSelectedGateway('mercadopago');
      });
  }, []);

  const handleSubscribe = async (planId: PlanType) => {
    try {
      setLoadingPlan(planId);
      setError(null);

      if (selectedGateway === 'mercadopago') {
        const response = await fetch('/api/mercadopago/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: sub?.userId || 0,
            userEmail: sub?.email || '',
            userName: sub?.name || '',
            planId,
            interval: billing,
          }),
        });
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        } else if (data.error) {
          throw new Error(data.error);
        }
      } else {
        const result = await createStripeCheckout.mutateAsync({ planId, interval: billing });
        if (result.url) {
          window.location.href = result.url;
        }
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      const errorMsg = err.message || 'Erro ao criar checkout. Faça login primeiro.';
      setError(errorMsg);
      import('sonner').then(m => m.toast.error(errorMsg));
    } finally {
      setLoadingPlan(null);
    }
  };

  const handlePartnershipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Partnership request:', partnershipForm);
    setPartnershipSent(true);
  };

  const plans = [
    {
      id: 'free' as const,
      name: 'Free',
      description: 'Para começar a explorar',
      monthlyPrice: 0,
      yearlyPrice: 0,
      yearlyMonthly: 0,
      color: 'from-gray-500 to-gray-600',
      borderColor: 'border-gray-300 dark:border-gray-600',
      badge: null,
      features: [
        { text: 'Dashboard e Cronograma', included: true },
        { text: 'Pomodoro Timer', included: true },
        { text: 'Checklist Semanal', included: true },
        { text: 'Conteúdo básico (1° e 2° ano)', included: true },
        { text: '3 consultas MedGenie AI/dia', included: true },
        { text: 'Calculadoras médicas básicas', included: true },
        { text: 'CID-10 e ANVISA (consulta)', included: true },
        { text: 'Gamificação básica', included: true },
      ],
    },
    {
      id: 'publico' as const,
      name: 'Público Geral',
      description: 'Saúde Pública para todos',
      monthlyPrice: 6.99,
      yearlyPrice: 67.10,
      yearlyMonthly: 5.59,
      color: 'from-orange-500 to-amber-600',
      borderColor: 'border-orange-400 dark:border-orange-500',
      badge: 'ACESSÍVEL',
      features: [
        { text: 'Tudo do plano Free', included: true, highlight: true },
        { text: 'Busca de Hospitais e UBS (CNES)', included: true },
        { text: 'Busca de Médicos por especialidade', included: true },
        { text: 'Busca de Farmácias e preços', included: true },
        { text: 'Consulta de Medicamentos (ANVISA)', included: true },
        { text: 'Bulário Eletrônico ANVISA', included: true },
        { text: 'CID-10 completo', included: true },
        { text: 'Guia de Doenças básico', included: true },
        { text: 'Calculadoras de saúde', included: true },
        { text: 'Localizador de UPA/SAMU', included: true },
        { text: 'Calendário de Vacinação', included: true },
        { text: 'Conteúdo acadêmico avançado', included: false },
        { text: 'IA e ferramentas profissionais', included: false },
      ],
    },
    {
      id: 'estudante' as const,
      name: 'Estudante',
      description: 'Para estudantes de medicina',
      monthlyPrice: 49.90,
      yearlyPrice: 479.04,
      yearlyMonthly: 39.92,
      color: 'from-cyan-500 to-blue-600',
      borderColor: 'border-cyan-400 dark:border-cyan-500',
      badge: 'MAIS POPULAR',
      features: [
        { text: 'Tudo do plano Free', included: true, highlight: true },
        { text: 'MedGenie AI ilimitado', included: true },
        { text: 'Conteúdo completo (1° ao 6° ano)', included: true },
        { text: 'Flashcards e Quizzes ilimitados', included: true },
        { text: 'Transcrição de aulas com IA', included: true },
        { text: 'Pesquisa Global + PubMed', included: true },
        { text: 'Interações Medicamentosas IA', included: true },
        { text: 'Protocolos Clínicos IA', included: true },
        { text: 'Modo Batalha multiplayer', included: true },
        { text: 'Casos Clínicos com IA', included: true },
        { text: 'Simulados de Residência', included: true },
        { text: 'Atlas Anatômico 3D', included: true },
        { text: 'Correções por IA supervisionada', included: true },
        { text: 'Área do Aluno completa', included: true },
      ],
    },
    {
      id: 'professor' as const,
      name: 'Professor',
      description: 'Para docentes universitários',
      monthlyPrice: 49.90,
      yearlyPrice: 479.04,
      yearlyMonthly: 39.92,
      color: 'from-purple-500 to-indigo-600',
      borderColor: 'border-purple-400 dark:border-purple-500',
      badge: 'DOCENTE',
      requiresVerification: true,
      features: [
        { text: 'Tudo do plano Estudante', included: true, highlight: true },
        { text: 'Portal do Professor completo', included: true },
        { text: 'Upload de conteúdo e materiais', included: true },
        { text: 'Correções assistidas por IA', included: true },
        { text: 'Confirmar/rejeitar correções IA', included: true },
        { text: 'Tirar dúvidas dos alunos', included: true },
        { text: 'Sala de Aula virtual', included: true },
        { text: 'Analytics de Turma avançado', included: true },
        { text: 'Gestão de turmas e notas', included: true },
        { text: 'Gerador de provas com IA', included: true },
        { text: 'Relatórios de desempenho', included: true },
        { text: 'Suporte VIP', included: true },
      ],
    },
    {
      id: 'medico' as const,
      name: 'Médico',
      description: 'Para médicos em exercício',
      monthlyPrice: 59.90,
      yearlyPrice: 575.04,
      yearlyMonthly: 47.92,
      color: 'from-emerald-500 to-teal-600',
      borderColor: 'border-emerald-400 dark:border-emerald-500',
      badge: 'PROFISSIONAL',
      features: [
        { text: 'Tudo do plano Estudante', included: true, highlight: true },
        { text: '15+ Calculadoras médicas avançadas', included: true },
        { text: 'Protocolos Clínicos completos', included: true },
        { text: 'Apoio Diagnóstico IA avançado', included: true },
        { text: 'Interações Medicamentosas completas', included: true },
        { text: 'Atlas Anatômico 3D profissional', included: true },
        { text: 'Pesquisa PubMed ilimitada', included: true },
        { text: 'Bulário completo ANVISA + FDA', included: true },
        { text: 'Guia de Doenças expandido', included: true },
        { text: 'Condutas baseadas em evidência', included: true },
        { text: 'Atualizações de guidelines', included: true },
        { text: 'Suporte prioritário', included: true },
      ],
    },
  ];

  const gatewayLabel = selectedGateway === 'mercadopago' ? 'Mercado Pago' : 'Stripe';
  const gatewayMethods = selectedGateway === 'mercadopago' 
    ? 'Pix, Cartão, Boleto' 
    : 'Cartão de Crédito';

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Planos MedFocus</h1>
        <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
          Escolha o plano ideal para sua jornada. Todos os planos pagos incluem 7 dias de trial gratuito.
        </p>
      </div>

      {/* Trial Banner */}
      {trialActive && (
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-4 text-center">
          <p className="text-cyan-400 font-bold text-sm">
            Trial ativo — {trialDaysLeft} {trialDaysLeft === 1 ? 'dia restante' : 'dias restantes'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Aproveite o acesso completo durante o período de teste</p>
        </div>
      )}

      {/* Active Plan Banner */}
      {hasFullAccess && !trialActive && (
        <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
          <p className="text-emerald-400 font-bold text-sm">Plano {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} ativo</p>
          <p className="text-xs text-muted-foreground mt-1">Você tem acesso completo a todos os recursos</p>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <p className="text-red-400 font-bold text-sm">Erro no pagamento</p>
          <p className="text-xs text-red-300 mt-1">{error}</p>
          <button onClick={() => setError(null)} className="text-xs text-red-400 underline mt-2">Fechar</button>
        </div>
      )}

      {/* Payment Gateway Selector */}
      <div className="bg-card rounded-2xl border border-border p-4">
        <h3 className="text-sm font-bold text-foreground mb-3 text-center">Forma de Pagamento</h3>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setSelectedGateway('mercadopago')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              selectedGateway === 'mercadopago'
                ? 'bg-gradient-to-r from-[#009ee3] to-[#00b1ea] text-white shadow-lg shadow-blue-500/20'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>Mercado Pago</span>
            {selectedGateway === 'mercadopago' && (
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">Recomendado</span>
            )}
          </button>
          <button
            onClick={() => setSelectedGateway('stripe')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              selectedGateway === 'stripe'
                ? 'bg-gradient-to-r from-[#635bff] to-[#7a73ff] text-white shadow-lg shadow-purple-500/20'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
            </svg>
            <span>Stripe</span>
          </button>
        </div>
        <div className="text-center mt-2">
          <p className="text-[10px] text-muted-foreground">
            {selectedGateway === 'mercadopago' 
              ? 'Aceita Pix, Cartão de Crédito/Débito e Boleto Bancário'
              : 'Aceita Cartão de Crédito Internacional'}
          </p>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-3">
        <span className={`text-sm font-medium ${billing === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>Mensal</span>
        <button
          onClick={() => setBilling(b => b === 'monthly' ? 'yearly' : 'monthly')}
          className={`relative w-14 h-7 rounded-full transition-colors ${billing === 'yearly' ? 'bg-cyan-500' : 'bg-gray-600'}`}
        >
          <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${billing === 'yearly' ? 'translate-x-7' : 'translate-x-0.5'}`} />
        </button>
        <span className={`text-sm font-medium ${billing === 'yearly' ? 'text-foreground' : 'text-muted-foreground'}`}>
          Anual <span className="text-emerald-400 text-xs font-bold">-20%</span>
        </span>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {plans.map(plan => {
          const isCurrentPlan = currentPlan === plan.id;
          const isPaid = plan.id !== 'free';
          const price = billing === 'monthly' ? plan.monthlyPrice : plan.yearlyMonthly;
          const totalYearly = plan.yearlyPrice;

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 ${isCurrentPlan ? 'border-cyan-500 shadow-lg shadow-cyan-500/10' : plan.borderColor} bg-card overflow-hidden transition-all hover:shadow-lg`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className={`absolute top-0 right-0 bg-gradient-to-r ${plan.color} text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl`}>
                  {plan.badge}
                </div>
              )}

              <div className="p-5">
                {/* Plan Name */}
                <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">{plan.description}</p>

                {/* Price */}
                <div className="mb-4">
                  {isPaid ? (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs text-muted-foreground">R$</span>
                        <span className="text-3xl font-bold text-foreground">{price.toFixed(2).replace('.', ',')}</span>
                        <span className="text-xs text-muted-foreground">/mês</span>
                      </div>
                      {billing === 'yearly' && (
                        <div className="mt-1">
                          <span className="text-[10px] text-muted-foreground line-through">R$ {(plan.monthlyPrice * 12).toFixed(2).replace('.', ',')}/ano</span>
                          <span className="text-[10px] text-emerald-400 font-bold ml-1">R$ {totalYearly.toFixed(2).replace('.', ',')}/ano</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-foreground">Grátis</span>
                    </div>
                  )}
                </div>

                {/* Public Plan Note */}
                {plan.id === 'publico' && (
                  <div className="mb-3 bg-orange-500/10 border border-orange-500/20 rounded-lg p-2">
                    <p className="text-[10px] text-orange-300 font-medium text-center">
                      Acesso exclusivo a módulos de Saúde Pública — ideal para o público geral
                    </p>
                  </div>
                )}

                {/* CTA Button */}
                {isPaid ? (
                  <button
                    onClick={() => handleSubscribe(plan.id as PlanType)}
                    disabled={isCurrentPlan || loadingPlan === plan.id}
                    className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${
                      isCurrentPlan
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : `bg-gradient-to-r ${plan.color} text-white hover:opacity-90 hover:shadow-lg`
                    }`}
                  >
                    {loadingPlan === plan.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        Processando...
                      </span>
                    ) : isCurrentPlan ? 'Plano Atual' : 'Começar Trial de 7 dias'}
                  </button>
                ) : (
                  <div className="w-full py-2.5 rounded-xl bg-gray-800 text-gray-400 text-center font-bold text-sm">
                    {isCurrentPlan ? 'Plano Atual' : 'Plano Gratuito'}
                  </div>
                )}

                {/* Payment Method Info */}
                {isPaid && !isCurrentPlan && (
                  <p className="text-[10px] text-muted-foreground mt-2 text-center">
                    via {gatewayLabel} ({gatewayMethods})
                  </p>
                )}

                {/* Verification Note for Professor */}
                {'requiresVerification' in plan && (plan as any).requiresVerification && (
                  <p className="text-[10px] text-amber-400 mt-2 text-center">
                    * Requer comprovação de vínculo universitário
                  </p>
                )}

                {/* Features */}
                <div className="mt-4 space-y-1.5">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <svg className={`w-4 h-4 mt-0.5 flex-shrink-0 ${f.included ? 'text-emerald-400' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {f.included ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        )}
                      </svg>
                      <span className={`text-xs ${f.included ? ('highlight' in f && f.highlight ? 'text-cyan-400 font-semibold' : 'text-foreground') : 'text-muted-foreground line-through'}`}>
                        {f.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Partnership Section */}
      <div className="bg-gradient-to-r from-purple-500/5 to-indigo-500/5 border border-purple-500/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              Parceria Universitária
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              40% de desconto no plano anual para turmas com mínimo de 30 alunos. Professor mentor é <span className="text-emerald-400 font-bold">gratuito</span>.
            </p>
          </div>
          <button
            onClick={() => setShowPartnership(!showPartnership)}
            className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-xl font-bold text-sm hover:bg-purple-500/30 transition-colors"
          >
            {showPartnership ? 'Fechar' : 'Solicitar Parceria'}
          </button>
        </div>

        {/* Partnership Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="bg-card/50 rounded-xl p-3 border border-purple-500/10">
            <p className="text-2xl font-bold text-purple-400">40%</p>
            <p className="text-xs text-muted-foreground">Desconto no plano anual para estudantes</p>
          </div>
          <div className="bg-card/50 rounded-xl p-3 border border-purple-500/10">
            <p className="text-2xl font-bold text-emerald-400">R$ 0</p>
            <p className="text-xs text-muted-foreground">Professor mentor é gratuito na parceria</p>
          </div>
          <div className="bg-card/50 rounded-xl p-3 border border-purple-500/10">
            <p className="text-2xl font-bold text-cyan-400">30+</p>
            <p className="text-xs text-muted-foreground">Mínimo de assinaturas por turma</p>
          </div>
        </div>

        {/* Partnership Pricing Table */}
        <div className="bg-card/30 rounded-xl p-3 mb-4 border border-purple-500/10">
          <h4 className="text-xs font-bold text-purple-300 mb-2">Comparativo de Preços — Parceria vs. Individual</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-1.5 text-muted-foreground font-medium">Plano</th>
                  <th className="text-right py-1.5 text-muted-foreground font-medium">Mensal</th>
                  <th className="text-right py-1.5 text-muted-foreground font-medium">Anual</th>
                  <th className="text-right py-1.5 text-purple-300 font-bold">Parceria (Anual)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="py-1.5 text-foreground font-medium">Estudante</td>
                  <td className="text-right text-muted-foreground">R$ 49,90</td>
                  <td className="text-right text-muted-foreground">R$ 479,04</td>
                  <td className="text-right text-purple-300 font-bold">R$ 287,42 <span className="text-emerald-400 text-[10px]">(-40%)</span></td>
                </tr>
                <tr>
                  <td className="py-1.5 text-foreground font-medium">Professor</td>
                  <td className="text-right text-muted-foreground">R$ 49,90</td>
                  <td className="text-right text-muted-foreground">R$ 479,04</td>
                  <td className="text-right text-emerald-400 font-bold">GRÁTIS</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Partnership Form */}
        {showPartnership && (
          <div className="bg-card rounded-xl p-5 border border-purple-500/20 mt-4">
            {partnershipSent ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">Solicitação Enviada!</h3>
                <p className="text-sm text-muted-foreground">Nossa equipe entrará em contato em até 48 horas para formalizar a parceria.</p>
              </div>
            ) : (
              <form onSubmit={handlePartnershipSubmit} className="space-y-3">
                <h3 className="text-base font-bold text-foreground mb-2">Formulário de Parceria Universitária</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  O professor mentor cadastra a turma e envia convites para os 30+ alunos. O professor é gratuito na parceria.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1">Nome da Universidade *</label>
                    <input type="text" required value={partnershipForm.universityName} onChange={e => setPartnershipForm(f => ({ ...f, universityName: e.target.value }))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" placeholder="Ex: Universidade de São Paulo" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1">Departamento *</label>
                    <input type="text" required value={partnershipForm.department} onChange={e => setPartnershipForm(f => ({ ...f, department: e.target.value }))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" placeholder="Ex: Faculdade de Medicina" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1">Nome do Professor Mentor *</label>
                    <input type="text" required value={partnershipForm.professorName} onChange={e => setPartnershipForm(f => ({ ...f, professorName: e.target.value }))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" placeholder="Nome completo" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1">E-mail Institucional *</label>
                    <input type="email" required value={partnershipForm.professorEmail} onChange={e => setPartnershipForm(f => ({ ...f, professorEmail: e.target.value }))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" placeholder="professor@universidade.edu.br" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1">Estimativa de Alunos *</label>
                    <input type="number" required min={30} value={partnershipForm.estimatedStudents} onChange={e => setPartnershipForm(f => ({ ...f, estimatedStudents: e.target.value }))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" placeholder="Mínimo 30" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1">Mensagem (opcional)</label>
                    <input type="text" value={partnershipForm.message} onChange={e => setPartnershipForm(f => ({ ...f, message: e.target.value }))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" placeholder="Informações adicionais" />
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all">
                    Enviar Solicitação de Parceria
                  </button>
                  <button type="button" onClick={() => setShowPartnership(false)} className="px-4 py-2.5 text-muted-foreground text-sm hover:text-foreground transition-colors">
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {/* How it Works */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-4 text-center">Como Funciona</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: '1', title: 'Escolha seu Plano', desc: 'Selecione o plano ideal: Público Geral, Estudante, Professor ou Médico', icon: '1' },
            { step: '2', title: 'Trial de 7 Dias', desc: 'Teste todas as funcionalidades gratuitamente por 7 dias', icon: '2' },
            { step: '3', title: 'Pague como Preferir', desc: `Pagamento seguro via ${selectedGateway === 'mercadopago' ? 'Pix, Cartão ou Boleto' : 'Cartão de Crédito'}. Cancele a qualquer momento`, icon: '3' },
            { step: '4', title: 'Acesso Liberado', desc: 'Desbloqueie os recursos do seu plano e comece a evoluir', icon: '4' },
          ].map(item => (
            <div key={item.step} className="text-center p-4">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-cyan-500/10 flex items-center justify-center text-xl font-bold text-cyan-400">{item.icon}</div>
              <div className="text-xs font-bold text-cyan-400 mb-1">Passo {item.step}</div>
              <h4 className="text-sm font-bold text-foreground mb-1">{item.title}</h4>
              <p className="text-[10px] text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Social Proof Numbers */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-4 text-center">MedFocus em Números</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '50+', label: 'Módulos Médicos', sublabel: 'Anatomia, Farmacologia, Clínica...', color: 'text-cyan-400' },
            { value: '15+', label: 'Calculadoras Clínicas', sublabel: 'CHA₂DS₂-VASc, MELD, Glasgow...', color: 'text-emerald-400' },
            { value: '12+', label: 'APIs Médicas Integradas', sublabel: 'PubMed, ANVISA, OpenFDA, CNES...', color: 'text-purple-400' },
            { value: '154+', label: 'Telas Navegáveis', sublabel: 'Interface completa e intuitiva', color: 'text-amber-400' },
          ].map((stat, i) => (
            <div key={i} className="text-center p-4 bg-muted/20 rounded-xl">
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm font-medium text-foreground mt-1">{stat.label}</div>
              <div className="text-[10px] text-muted-foreground">{stat.sublabel}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Competitive Comparison */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-4 text-center">Por que escolher o MedFocus?</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-muted-foreground font-medium">Recurso</th>
                <th className="text-center py-2 text-cyan-400 font-bold">MedFocus</th>
                <th className="text-center py-2 text-muted-foreground font-medium">Concorrente A</th>
                <th className="text-center py-2 text-muted-foreground font-medium">Concorrente B</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: 'IA Assistente Médico', us: true, a: false, b: true },
                { feature: 'Atlas Anatômico 3D', us: true, a: true, b: false },
                { feature: 'Integração PubMed + ANVISA + FDA', us: true, a: false, b: false },
                { feature: 'Calculadoras Clínicas (15+)', us: true, a: true, b: true },
                { feature: 'Gamificação e XP', us: true, a: false, b: false },
                { feature: 'Portal do Professor', us: true, a: false, b: false },
                { feature: 'Modo Offline', us: true, a: true, b: false },
                { feature: 'Simulados de Residência', us: true, a: true, b: true },
                { feature: 'Preço Estudante', us: 'R$ 49,90', a: 'R$ 89,90', b: 'R$ 79,90' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-2 text-foreground font-medium">{row.feature}</td>
                  <td className="text-center py-2">{typeof row.us === 'boolean' ? (row.us ? <span className="text-emerald-400">✓</span> : <span className="text-red-400">✗</span>) : <span className="text-emerald-400 font-bold">{row.us}</span>}</td>
                  <td className="text-center py-2">{typeof row.a === 'boolean' ? (row.a ? <span className="text-emerald-400">✓</span> : <span className="text-red-400">✗</span>) : <span className="text-muted-foreground">{row.a}</span>}</td>
                  <td className="text-center py-2">{typeof row.b === 'boolean' ? (row.b ? <span className="text-emerald-400">✓</span> : <span className="text-red-400">✗</span>) : <span className="text-muted-foreground">{row.b}</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Satisfaction Guarantee */}
      <div className="bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border border-emerald-500/20 rounded-2xl p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Garantia de Satisfação de 7 Dias</h3>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Experimente o MedFocus por 7 dias gratuitamente. Se não ficar satisfeito, cancele a qualquer momento sem nenhum custo.
          Sem compromisso, sem burocracia.
        </p>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Cancele quando quiser
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Sem multa de cancelamento
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Pagamento 100% seguro
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-4 text-center">O que dizem nossos usuários</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              name: 'Dra. Ana Silva',
              role: 'Residente em Cardiologia — USP',
              text: 'O MedFocus revolucionou minha forma de estudar. Os flashcards com repetição espaçada e os casos clínicos com IA são incríveis. Passei na prova de residência com nota máxima!',
              rating: 5,
            },
            {
              name: 'Prof. Dr. Carlos Mendes',
              role: 'Professor de Anatomia — UNICAMP',
              text: 'Uso o MedFocus nas minhas aulas há 6 meses. O Atlas 3D e o portal do professor facilitaram muito a gestão das turmas. Meus alunos adoram a gamificação.',
              rating: 5,
            },
            {
              name: 'Lucas Ferreira',
              role: 'Estudante 4° ano — UFMG',
              text: 'Antes eu gastava horas organizando material. Agora o Dr. Focus gera resumos perfeitos e os simulados me preparam de verdade para as provas. Vale cada centavo.',
              rating: 5,
            },
            {
              name: 'Dra. Mariana Costa',
              role: 'Clínica Geral — Hospital Albert Einstein',
              text: 'As calculadoras clínicas e o verificador de interações medicamentosas são ferramentas que uso diariamente. Economizo tempo e ganho segurança nas prescrições.',
              rating: 5,
            },
            {
              name: 'Pedro Almeida',
              role: 'Estudante 2° ano — UNIFESP',
              text: 'A gamificação me motiva a estudar todos os dias. Já acumulei mais de 5.000 XP e o ranking me incentiva a competir com meus colegas de turma.',
              rating: 5,
            },
            {
              name: 'Profa. Dra. Juliana Santos',
              role: 'Professora de Farmacologia — UFRJ',
              text: 'A parceria universitária foi excelente. Meus 45 alunos usam o MedFocus e o portal do professor me permite acompanhar o progresso de cada um em tempo real.',
              rating: 5,
            },
          ].map((t, i) => (
            <div key={i} className="bg-muted/30 rounded-xl p-4 border border-border">
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <svg key={j} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3 italic">"{t.text}"</p>
              <div>
                <p className="text-xs font-bold text-foreground">{t.name}</p>
                <p className="text-[10px] text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-4 text-center">Perguntas Frequentes</h3>
        <div className="space-y-3 max-w-2xl mx-auto">
          {[
            { q: 'Posso cancelar a qualquer momento?', a: 'Sim! Você pode cancelar sua assinatura a qualquer momento, sem multas ou burocracia. O acesso continua até o final do período pago.' },
            { q: 'O trial de 7 dias é realmente gratuito?', a: 'Sim, 100% gratuito. Você tem acesso completo por 7 dias. Se não cancelar, a cobrança inicia automaticamente após o período de teste.' },
            { q: 'Quais formas de pagamento são aceitas?', a: 'Aceitamos Pix, Cartão de Crédito, Cartão de Débito e Boleto Bancário via Mercado Pago, além de Cartão de Crédito Internacional via Stripe.' },
            { q: 'O MedFocus substitui um médico?', a: 'Não. O MedFocus é uma ferramenta educacional de apoio ao estudo médico. Não realizamos diagnósticos, prescrições ou qualquer ato médico. Sempre consulte um profissional de saúde.' },
            { q: 'Como funciona a parceria universitária?', a: 'Turmas com 30+ alunos recebem 40% de desconto no plano anual, e o professor mentor é gratuito. Entre em contato pelo formulário acima.' },
            { q: 'Meus dados estão seguros?', a: 'Sim. Seguimos a LGPD (Lei Geral de Proteção de Dados) e utilizamos criptografia de ponta a ponta. Seus dados nunca são compartilhados com terceiros.' },
          ].map((faq, i) => (
            <details key={i} className="group bg-muted/20 rounded-xl border border-border">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-medium text-foreground hover:text-primary transition-colors">
                {faq.q}
                <svg className="w-4 h-4 text-muted-foreground group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </summary>
              <div className="px-4 pb-3">
                <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Admin Note */}
      <div className="bg-card/50 rounded-xl border border-border p-4 text-center">
        <p className="text-xs text-muted-foreground">
          <strong>Administradores</strong> podem adicionar novos integrantes de forma gratuita.
          Professores devem enviar comprovação de vínculo universitário para ativar o plano.
        </p>
        <p className="text-[10px] text-muted-foreground mt-1">
          Pagamento seguro processado via {gatewayLabel}. Todos os preços em Reais (BRL). Cancele a qualquer momento.
        </p>
      </div>
    </div>
  );
};

export default PricingPlans;
