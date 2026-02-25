/**
 * MedFocus Pricing Plans v6.0 — Multi-Tier Pricing
 * Estudante: R$ 49,99/mês | Anual: R$ 479,90 (20% desc)
 * Médico: R$ 45,99/mês | Anual: R$ 441,50 (20% desc)
 * Professor: R$ 9,99/mês | Anual: R$ 95,90 (20% desc) | Grátis na Parceria
 * Parceria Universitária: 40% desc anual (min 30 alunos)
 * Trial de 7 dias gratuito
 */
import React, { useState } from 'react';
import { trpc } from '../../lib/trpc';

type PlanType = 'estudante' | 'medico' | 'professor';

const PricingPlans: React.FC = () => {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [showPartnership, setShowPartnership] = useState(false);
  const [partnershipForm, setPartnershipForm] = useState({
    universityName: '', professorName: '', professorEmail: '', department: '',
    estimatedStudents: '', message: '',
  });
  const [partnershipSent, setPartnershipSent] = useState(false);

  const subscriptionQuery = trpc.stripe.getSubscription.useQuery(undefined, { retry: false });
  const createCheckout = trpc.stripe.createCheckout.useMutation();

  const sub = subscriptionQuery.data;
  const currentPlan = sub?.plan || 'free';
  const hasFullAccess = sub?.hasFullAccess || false;
  const trialActive = sub?.trialActive || false;
  const trialDaysLeft = sub?.trialDaysLeft || 0;

  const handleSubscribe = async (planId: PlanType) => {
    try {
      setLoadingPlan(planId);
      const result = await createCheckout.mutateAsync({ planId, interval: billing });
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      import('sonner').then(m => m.toast.error(err.message || 'Erro ao criar checkout. Faça login primeiro.'));
    } finally {
      setLoadingPlan(null);
    }
  };

  const handlePartnershipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to backend
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
      id: 'estudante' as const,
      name: 'Estudante',
      description: 'Para estudantes de medicina',
      monthlyPrice: 49.99,
      yearlyPrice: 479.90,
      yearlyMonthly: 39.99,
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
      id: 'medico' as const,
      name: 'Médico',
      description: 'Para médicos em exercício',
      monthlyPrice: 45.99,
      yearlyPrice: 441.50,
      yearlyMonthly: 36.79,
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
    {
      id: 'professor' as const,
      name: 'Professor',
      description: 'Para docentes universitários',
      monthlyPrice: 9.99,
      yearlyPrice: 95.90,
      yearlyMonthly: 7.99,
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
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Planos MedFocus</h1>
        <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
          Escolha o plano ideal para sua jornada médica. Todos incluem 7 dias de trial gratuito.
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
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
              🏛️ Parceria Universitária
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
                  <td className="text-right text-muted-foreground">R$ 49,99</td>
                  <td className="text-right text-muted-foreground">R$ 479,90</td>
                  <td className="text-right text-purple-300 font-bold">R$ 287,94 <span className="text-emerald-400 text-[10px]">(-40%)</span></td>
                </tr>
                <tr>
                  <td className="py-1.5 text-foreground font-medium">Professor</td>
                  <td className="text-right text-muted-foreground">R$ 9,99</td>
                  <td className="text-right text-muted-foreground">R$ 95,90</td>
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
            { step: '1', title: 'Escolha seu Plano', desc: 'Selecione o plano ideal para seu perfil: Estudante, Médico ou Professor', icon: '🎯' },
            { step: '2', title: 'Trial de 7 Dias', desc: 'Teste todas as funcionalidades gratuitamente por 7 dias', icon: '🆓' },
            { step: '3', title: 'Cadastre o Cartão', desc: 'Pagamento seguro via Stripe. Cancele a qualquer momento', icon: '💳' },
            { step: '4', title: 'Acesso Completo', desc: 'Desbloqueie todos os recursos e comece a evoluir', icon: '🚀' },
          ].map(item => (
            <div key={item.step} className="text-center p-4">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-cyan-500/10 flex items-center justify-center text-2xl">{item.icon}</div>
              <div className="text-xs font-bold text-cyan-400 mb-1">Passo {item.step}</div>
              <h4 className="text-sm font-bold text-foreground mb-1">{item.title}</h4>
              <p className="text-[10px] text-muted-foreground">{item.desc}</p>
            </div>
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
          Pagamento seguro processado via Stripe. Todos os preços em Reais (BRL). Cancele a qualquer momento.
        </p>
      </div>
    </div>
  );
};

export default PricingPlans;
