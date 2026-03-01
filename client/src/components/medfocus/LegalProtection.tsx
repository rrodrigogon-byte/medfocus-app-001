/**
 * MedFocus — Proteção Legal Completa
 * 
 * Termos de Uso, Política de Privacidade (LGPD), Código de Ética Médica (CFM),
 * Disclaimer Educacional e Modal de Aceite Obrigatório.
 * 
 * BLINDAGEM LEGAL: A plataforma MedFocus é exclusivamente um guia estudantil,
 * biblioteca acadêmica e ferramenta de apoio ao estudo. Não somos médicos e
 * não praticamos medicina.
 * 
 * Última atualização: Março de 2026
 */

import React, { useState } from 'react';

type LegalTab = 'disclaimer' | 'terms' | 'lgpd' | 'ethics' | 'ai-policy';

export default function LegalProtection() {
  const [activeTab, setActiveTab] = useState<LegalTab>('disclaimer');

  const tabs: { id: LegalTab; label: string; icon: string }[] = [
    { id: 'disclaimer', label: 'Disclaimer Educacional', icon: '⚠️' },
    { id: 'terms', label: 'Termos de Uso', icon: '📋' },
    { id: 'lgpd', label: 'LGPD / Privacidade', icon: '🔒' },
    { id: 'ethics', label: 'Código de Ética', icon: '⚕️' },
    { id: 'ai-policy', label: 'Política de IA', icon: '🤖' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <span className="text-3xl">🛡️</span> Proteção Legal & Termos
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Documentação legal completa da plataforma MedFocus — Guia Estudantil e Biblioteca Acadêmica
        </p>
        <div className="mt-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-2.5 text-sm text-yellow-300 flex items-center gap-2">
          <span>⚠️</span>
          <strong>O MedFocus NÃO é um serviço médico. Somos uma plataforma educacional e biblioteca acadêmica.</strong>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                : 'bg-card border border-border hover:bg-accent'
            }`}
          >
            <span className="mr-1">{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-card border border-border rounded-xl p-6 md:p-8 prose prose-invert max-w-none">
        {activeTab === 'disclaimer' && <DisclaimerContent />}
        {activeTab === 'terms' && <TermsContent />}
        {activeTab === 'lgpd' && <LGPDContent />}
        {activeTab === 'ethics' && <EthicsCodeContent />}
        {activeTab === 'ai-policy' && <AIPolicyContent />}
      </div>

      {/* Version footer */}
      <div className="mt-4 text-center text-xs text-muted-foreground">
        <p>Documentação Legal v3.0 — Última atualização: Março de 2026</p>
        <p>Em conformidade com: LGPD (Lei nº 13.709/2018), Marco Civil da Internet (Lei nº 12.965/2014), CDC (Lei nº 8.078/1990), Código de Ética Médica (Resolução CFM nº 2.217/2018)</p>
      </div>
    </div>
  );
}

// ============================================================
// DISCLAIMER EDUCACIONAL (REFORÇADO)
// ============================================================
function DisclaimerContent() {
  return (
    <div className="space-y-6">
      {/* AVISO PRINCIPAL */}
      <div className="bg-red-500/15 border-2 border-red-500/40 rounded-xl p-6">
        <h2 className="text-xl font-bold text-red-400 flex items-center gap-2 mb-4">
          🚨 AVISO LEGAL FUNDAMENTAL
        </h2>
        <div className="text-base font-semibold text-foreground leading-relaxed space-y-3">
          <p>
            O <strong>MedFocus</strong> é uma <strong>plataforma educacional, guia estudantil e biblioteca acadêmica</strong> 
            destinada exclusivamente ao apoio ao estudo de medicina e ciências da saúde.
          </p>
          <p className="text-red-300 text-lg">
            NÓS NÃO SOMOS MÉDICOS. NÃO PRATICAMOS MEDICINA. NÃO REALIZAMOS NENHUM ATO MÉDICO.
          </p>
        </div>
      </div>

      {/* O QUE NÃO SOMOS */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
        <h3 className="font-bold text-red-400 mb-4 text-lg">🚫 O QUE O MEDFOCUS NÃO É E NÃO FAZ:</h3>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          {[
            { title: 'Não somos médicos', desc: 'A plataforma e seus desenvolvedores não são profissionais de saúde e não exercem a medicina.' },
            { title: 'Não realizamos consultas', desc: 'Nenhuma funcionalidade da plataforma constitui ou substitui uma consulta médica presencial ou por telemedicina.' },
            { title: 'Não fazemos diagnósticos', desc: 'Nenhuma ferramenta, incluindo IA, realiza, sugere ou confirma diagnósticos médicos. Funcionalidades de apoio são exclusivamente educacionais.' },
            { title: 'Não prescrevemos', desc: 'Informações sobre medicamentos são de caráter informativo e educacional. A prescrição é ato exclusivo do médico habilitado (Lei nº 5.991/1973).' },
            { title: 'Não tratamos pacientes', desc: 'Protocolos e condutas apresentados são para fins de estudo acadêmico e não devem ser aplicados sem supervisão profissional.' },
            { title: 'Não substituímos formação', desc: 'A plataforma não substitui a formação médica formal, residência médica, educação continuada ou qualquer programa de ensino oficial.' },
            { title: 'Não somos prontuário oficial', desc: 'Módulos de simulação (PEP) são ferramentas de treinamento. Não armazenamos dados reais de pacientes.' },
            { title: 'Não atendemos emergências', desc: 'Em caso de emergência médica, ligue SAMU (192), Bombeiros (193) ou dirija-se ao pronto-socorro mais próximo.' },
          ].map((item, i) => (
            <div key={i} className="bg-background/50 rounded-lg p-3 border border-border/50">
              <p className="font-bold text-red-300 text-sm mb-1">✗ {item.title}</p>
              <p className="text-foreground/75 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* O QUE SOMOS */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
        <h3 className="font-bold text-green-400 mb-4 text-lg">✅ O QUE O MEDFOCUS É:</h3>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          {[
            { title: 'Guia Estudantil', desc: 'Ferramenta de apoio ao estudo de medicina, organização acadêmica e preparação para provas e residência.' },
            { title: 'Biblioteca Acadêmica', desc: 'Acesso organizado a referências bibliográficas, artigos científicos e conteúdos acadêmicos validados.' },
            { title: 'Atlas Anatômico Educacional', desc: 'Modelos 3D interativos para estudo da anatomia humana, baseados em referências como Netter e Gray\'s.' },
            { title: 'Ferramenta de Revisão', desc: 'Quizzes, flashcards, simulados e ferramentas de memorização (SM-2) para concursos e provas.' },
            { title: 'Ambiente Colaborativo', desc: 'Espaço para interação entre estudantes e professores em contexto estritamente acadêmico.' },
            { title: 'Consulta Informativa', desc: 'Dados da ANVISA/CMED, CID-10 e tabelas de referência para consulta e comparação educacional.' },
          ].map((item, i) => (
            <div key={i} className="bg-background/50 rounded-lg p-3 border border-border/50">
              <p className="font-bold text-green-300 text-sm mb-1">✓ {item.title}</p>
              <p className="text-foreground/75 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RESPONSABILIDADE */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
        <h3 className="font-bold text-blue-400 mb-3">📋 ISENÇÃO DE RESPONSABILIDADE</h3>
        <div className="space-y-3 text-sm text-foreground/85 leading-relaxed">
          <p>
            O MedFocus, seus desenvolvedores, colaboradores e afiliados <strong>não se responsabilizam</strong> por qualquer 
            dano, prejuízo, lesão ou consequência de qualquer natureza decorrente do uso das informações contidas nesta 
            plataforma para fins que não sejam estritamente educacionais e de referência acadêmica.
          </p>
          <p>
            O usuário reconhece e aceita que é o <strong>único responsável</strong> pelo uso que faz das informações 
            disponibilizadas, e que qualquer aplicação prática de conhecimentos adquiridos deve ser feita sob a 
            supervisão direta de profissionais de saúde habilitados e em conformidade com a legislação vigente.
          </p>
          <p>
            A responsabilidade pela prática médica é <strong>exclusiva do profissional de saúde</strong> que a exerce, 
            conforme o Código de Ética Médica (Resolução CFM nº 2.217/2018) e a legislação brasileira aplicável.
          </p>
        </div>
      </div>

      {/* EMERGÊNCIA */}
      <div className="bg-red-500/15 border-2 border-red-500/40 rounded-xl p-6 text-center">
        <h3 className="font-bold text-red-400 mb-2 text-lg">🚨 EMERGÊNCIA MÉDICA?</h3>
        <p className="text-foreground/90 text-sm mb-3">
          Esta plataforma NÃO atende emergências. Se você ou alguém precisa de atendimento médico urgente:
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm font-bold">
          <span className="bg-red-500/20 px-4 py-2 rounded-lg">📞 SAMU: 192</span>
          <span className="bg-red-500/20 px-4 py-2 rounded-lg">🚒 Bombeiros: 193</span>
          <span className="bg-red-500/20 px-4 py-2 rounded-lg">🏥 CVV: 188</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground italic">
        Última atualização: Março de 2026. Em conformidade com as diretrizes do CFM, LGPD (Lei nº 13.709/2018), 
        Marco Civil da Internet (Lei nº 12.965/2014) e Código de Defesa do Consumidor (Lei nº 8.078/1990).
      </p>
    </div>
  );
}

// ============================================================
// TERMOS DE USO (COMPLETOS E REFORÇADOS)
// ============================================================
function TermsContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        📋 Termos de Uso e Serviço — Plataforma MedFocus
      </h2>
      <p className="text-xs text-muted-foreground">Versão 3.0 — Última atualização: Março de 2026</p>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h3 className="text-lg font-bold text-primary mb-3">1. ACEITAÇÃO DOS TERMOS</h3>
          <p>
            Ao acessar, cadastrar-se ou utilizar a plataforma MedFocus, incluindo o site, aplicativos e quaisquer 
            serviços associados ("Plataforma"), você ("Usuário") declara ter lido, compreendido e concordado 
            integralmente com os presentes Termos de Uso e Serviço ("Termos"), a Política de Privacidade, 
            o Disclaimer Educacional e a Política de Uso de IA. A utilização da Plataforma está condicionada 
            à aceitação expressa de todos estes documentos. Se você não concorda com qualquer disposição, 
            deve cessar imediatamente o uso da Plataforma.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">2. NATUREZA DA PLATAFORMA</h3>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-3">
            <p className="font-bold text-yellow-400 mb-2">DEFINIÇÃO FUNDAMENTAL:</p>
            <p>
              O MedFocus é, e sempre será, uma <strong>plataforma de natureza exclusivamente educacional, 
              consultiva e de apoio acadêmico</strong>, destinada a estudantes de medicina, médicos em formação 
              e profissionais de saúde que buscam aprimoramento contínuo. A Plataforma funciona como um 
              <strong> guia estudantil, biblioteca acadêmica e ferramenta de revisão</strong>.
            </p>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="font-bold text-red-400 mb-2">A PLATAFORMA NÃO É:</p>
            <ul className="space-y-1.5 list-disc list-inside text-foreground/80">
              <li>Um serviço de saúde, consultório virtual ou clínica</li>
              <li>Um sistema de prontuário eletrônico oficial para uso clínico real</li>
              <li>Uma ferramenta de diagnóstico médico</li>
              <li>Um serviço de prescrição de medicamentos</li>
              <li>Um substituto para consultas médicas presenciais ou por telemedicina</li>
              <li>Um serviço de atendimento de emergência</li>
              <li>Um substituto para a formação médica formal ou residência médica</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">3. SERVIÇOS OFERECIDOS</h3>
          <p>A Plataforma oferece os seguintes serviços de natureza educacional:</p>
          <ul className="list-disc list-inside space-y-1 mt-2 text-foreground/80">
            <li>Conteúdos educacionais de medicina e ciências da saúde</li>
            <li>Atlas anatômico 3D interativo para estudo</li>
            <li>Ferramentas de estudo (quizzes, flashcards, resumos, simulados)</li>
            <li>Consulta de informações sobre medicamentos (base ANVISA/CMED) para fins educacionais</li>
            <li>Ferramentas de IA para apoio ao estudo (Dr. Focus IA)</li>
            <li>Ambiente colaborativo entre alunos e professores</li>
            <li>Módulos de simulação para treinamento acadêmico (PEP, Financeiro, TISS)</li>
            <li>Pesquisa bibliográfica e acesso a referências científicas</li>
          </ul>
          <p className="mt-2 font-semibold text-yellow-300">
            Todos os serviços acima são fornecidos exclusivamente para fins educacionais e de referência acadêmica.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">4. CADASTRO E CONTA</h3>
          <ul className="list-disc list-inside space-y-1.5 text-foreground/80">
            <li>O Usuário deve fornecer informações verdadeiras e atualizadas no cadastro.</li>
            <li>Cada conta é pessoal e intransferível.</li>
            <li>O Usuário é responsável pela segurança de suas credenciais de acesso.</li>
            <li>O uso indevido da conta é de responsabilidade exclusiva do titular.</li>
            <li>O Usuário deve ter no mínimo 16 anos de idade ou contar com autorização de responsável legal.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">5. USO ADEQUADO E OBRIGAÇÕES DO USUÁRIO</h3>
          <p>O Usuário compromete-se a:</p>
          <ul className="list-disc list-inside space-y-1.5 mt-2 text-foreground/80">
            <li>Utilizar a Plataforma <strong>exclusivamente para fins educacionais</strong> e consultivos.</li>
            <li><strong>NÃO utilizar</strong> informações da Plataforma para diagnósticos, prescrições ou condutas clínicas sem supervisão profissional adequada.</li>
            <li><strong>NÃO inserir</strong> dados reais de pacientes em nenhum módulo da Plataforma, incluindo módulos de simulação.</li>
            <li><strong>NÃO reproduzir</strong>, distribuir ou comercializar conteúdos da Plataforma sem autorização expressa.</li>
            <li><strong>NÃO tentar</strong> acessar áreas restritas ou comprometer a segurança do sistema.</li>
            <li>Respeitar os direitos de propriedade intelectual.</li>
            <li><strong>NÃO utilizar</strong> a Plataforma para fins ilegais, antiéticos ou contrários ao Código de Ética Médica.</li>
            <li><strong>Verificar sempre</strong> a precisão das informações com fontes primárias e literatura científica reconhecida.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">6. PROPRIEDADE INTELECTUAL</h3>
          <p>
            Todo o conteúdo da Plataforma (textos, imagens, modelos 3D, código-fonte, design, marcas e logotipos) 
            é protegido por direitos autorais e propriedade intelectual (Lei nº 9.610/1998). O uso é licenciado 
            ao Usuário de forma não exclusiva, intransferível e revogável, exclusivamente para fins educacionais pessoais.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">7. LIMITAÇÃO DE RESPONSABILIDADE</h3>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="font-bold text-red-400 mb-2">CLÁUSULA DE LIMITAÇÃO:</p>
            <p className="mb-3">O MedFocus, seus desenvolvedores, colaboradores e afiliados:</p>
            <ul className="list-disc list-inside space-y-1.5 text-foreground/80">
              <li><strong>NÃO garantem</strong> a ausência de erros ou imprecisões no conteúdo educacional.</li>
              <li><strong>NÃO se responsabilizam</strong> por decisões clínicas baseadas em informações da Plataforma.</li>
              <li><strong>NÃO se responsabilizam</strong> por danos diretos, indiretos, incidentais, especiais ou consequenciais decorrentes do uso da Plataforma.</li>
              <li><strong>NÃO substituem</strong> a formação médica formal, residência médica ou educação continuada.</li>
              <li><strong>NÃO garantem</strong> disponibilidade ininterrupta do serviço.</li>
              <li><strong>NÃO se responsabilizam</strong> por quaisquer atos médicos praticados com base em informações da Plataforma.</li>
              <li><strong>NÃO se responsabilizam</strong> por danos a pacientes decorrentes do uso indevido das informações educacionais.</li>
            </ul>
            <p className="mt-3 font-semibold text-yellow-300">
              A responsabilidade pela prática médica é exclusiva do profissional de saúde que a exerce, 
              conforme o Código de Ética Médica e a legislação brasileira.
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">8. INTELIGÊNCIA ARTIFICIAL (Dr. Focus IA)</h3>
          <p>As funcionalidades de IA da Plataforma:</p>
          <ul className="list-disc list-inside space-y-1.5 mt-2 text-foreground/80">
            <li>São ferramentas de <strong>apoio ao estudo</strong>, não constituindo opinião médica.</li>
            <li>Podem gerar respostas imprecisas, incompletas ou desatualizadas.</li>
            <li>Devem ser <strong>sempre verificadas</strong> com fontes primárias e literatura médica reconhecida.</li>
            <li>Não substituem o raciocínio clínico, o julgamento profissional ou a relação médico-paciente.</li>
            <li>São processadas em servidores seguros com criptografia no Google Cloud Platform.</li>
            <li>Não armazenam conversas para fins de treinamento de modelos de IA.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">9. MÓDULOS DE SIMULAÇÃO (PEP, FINANCEIRO, TISS)</h3>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="mb-2">
              Os módulos de simulação (Prontuário Eletrônico, Financeiro, TISS) são <strong>ferramentas de 
              treinamento acadêmico</strong> e NÃO devem ser utilizados como sistemas reais de gestão clínica:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-foreground/80">
              <li>Dados inseridos são <strong>fictícios e para fins de treinamento</strong>.</li>
              <li>O módulo PEP NÃO é um prontuário eletrônico oficial conforme Resolução CFM nº 1.821/2007.</li>
              <li>O módulo Financeiro NÃO substitui software de gestão financeira certificado.</li>
              <li>O módulo TISS NÃO gera guias válidas para envio a operadoras de saúde.</li>
              <li>É <strong>expressamente proibido</strong> inserir dados reais de pacientes nestes módulos.</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">10. PLANOS E PAGAMENTOS</h3>
          <ul className="list-disc list-inside space-y-1.5 text-foreground/80">
            <li>Os planos e preços são informados na Plataforma e podem ser alterados com aviso prévio de 30 dias.</li>
            <li>O cancelamento pode ser solicitado a qualquer momento, com efeito ao final do período vigente.</li>
            <li>Reembolsos seguem a política do Código de Defesa do Consumidor (Lei nº 8.078/1990).</li>
            <li>O direito de arrependimento de 7 dias é garantido conforme o art. 49 do CDC.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">11. SUSPENSÃO E ENCERRAMENTO</h3>
          <p>
            O MedFocus reserva-se o direito de suspender ou encerrar contas que violem estes Termos, 
            sem aviso prévio, especialmente em casos de: uso para fins não educacionais, inserção de dados 
            reais de pacientes, compartilhamento de credenciais, tentativa de uso clínico dos módulos de 
            simulação, ou atividades que comprometam a segurança da Plataforma.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">12. LEGISLAÇÃO APLICÁVEL E FORO</h3>
          <p>
            Estes Termos são regidos pela legislação da República Federativa do Brasil. Fica eleito o foro 
            da comarca do domicílio do Usuário para dirimir quaisquer controvérsias, conforme o art. 101, I 
            do Código de Defesa do Consumidor (Lei nº 8.078/1990).
          </p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">13. DISPOSIÇÕES FINAIS</h3>
          <ul className="list-disc list-inside space-y-1.5 text-foreground/80">
            <li>O MedFocus pode alterar estes Termos a qualquer momento, notificando os Usuários com antecedência mínima de 15 dias.</li>
            <li>A tolerância quanto ao descumprimento de qualquer disposição não implica renúncia.</li>
            <li>Se qualquer cláusula for considerada inválida, as demais permanecem em pleno vigor.</li>
            <li>Estes Termos constituem o acordo integral entre o Usuário e o MedFocus.</li>
          </ul>
        </section>
      </div>

      <p className="text-xs text-muted-foreground italic mt-4">
        Versão 3.0 — Março de 2026. Em conformidade com: Código de Defesa do Consumidor (Lei nº 8.078/1990), 
        Marco Civil da Internet (Lei nº 12.965/2014), LGPD (Lei nº 13.709/2018), Lei de Direitos Autorais 
        (Lei nº 9.610/1998) e Código de Ética Médica (Resolução CFM nº 2.217/2018).
      </p>
    </div>
  );
}

// ============================================================
// LGPD / POLÍTICA DE PRIVACIDADE (COMPLETA)
// ============================================================
function LGPDContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        🔒 Política de Privacidade e Proteção de Dados
      </h2>
      <p className="text-xs text-muted-foreground">
        Em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018)
      </p>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h3 className="text-lg font-bold text-primary mb-3">1. COMPROMISSO COM A PRIVACIDADE</h3>
          <p>
            O MedFocus tem um compromisso inabalável com a privacidade e a proteção dos dados de seus Usuários, 
            em total conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018), 
            o Marco Civil da Internet (Lei nº 12.965/2014) e demais legislações aplicáveis.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">2. CONTROLADOR DOS DADOS</h3>
          <p>
            O controlador dos dados pessoais é o MedFocus, plataforma educacional de apoio ao estudo de medicina. 
            Para questões relacionadas à proteção de dados, entre em contato com nosso Encarregado de Dados (DPO) 
            através do e-mail: <strong>privacidade@medfocus.com.br</strong>.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">3. DADOS QUE COLETAMOS</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
              <thead className="bg-primary/10">
                <tr>
                  <th className="text-left p-3 border-b border-border">Tipo de Dado</th>
                  <th className="text-left p-3 border-b border-border">Exemplos</th>
                  <th className="text-left p-3 border-b border-border">Finalidade</th>
                  <th className="text-left p-3 border-b border-border">Base Legal (LGPD)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="p-3 font-medium">Cadastro</td>
                  <td className="p-3 text-foreground/70">Nome, e-mail, instituição, ano</td>
                  <td className="p-3 text-foreground/70">Personalização educacional</td>
                  <td className="p-3 text-foreground/70">Execução de contrato (Art. 7º, V)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="p-3 font-medium">Uso da Plataforma</td>
                  <td className="p-3 text-foreground/70">Módulos acessados, progresso, quizzes</td>
                  <td className="p-3 text-foreground/70">Gamificação e melhoria</td>
                  <td className="p-3 text-foreground/70">Legítimo interesse (Art. 7º, IX)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="p-3 font-medium">Pagamento</td>
                  <td className="p-3 text-foreground/70">Processado por Stripe/Mercado Pago</td>
                  <td className="p-3 text-foreground/70">Cobrança de assinaturas</td>
                  <td className="p-3 text-foreground/70">Execução de contrato (Art. 7º, V)</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Técnicos</td>
                  <td className="p-3 text-foreground/70">IP, navegador, cookies essenciais</td>
                  <td className="p-3 text-foreground/70">Segurança e funcionamento</td>
                  <td className="p-3 text-foreground/70">Legítimo interesse (Art. 7º, IX)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mt-3">
            <p className="font-bold text-green-400 mb-1">✅ DADOS QUE NÃO COLETAMOS:</p>
            <p className="text-foreground/80">
              Nós <strong>NÃO</strong> coletamos, processamos ou armazenamos dados sensíveis de saúde, 
              prontuários médicos, dados de pacientes, informações genéticas, dados biométricos ou 
              qualquer dado de saúde de terceiros. Dados inseridos em módulos de simulação são tratados 
              como fictícios e podem ser excluídos a qualquer momento.
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">4. COMPARTILHAMENTO DE DADOS</h3>
          <p>
            Nós <strong>NÃO vendemos, alugamos ou compartilhamos</strong> seus dados pessoais com terceiros 
            para fins de marketing ou publicidade. O compartilhamento ocorre apenas:
          </p>
          <ul className="list-disc list-inside space-y-1.5 mt-2 text-foreground/80">
            <li>Com provedores de infraestrutura essenciais (Google Cloud Platform), contratualmente obrigados a proteger seus dados.</li>
            <li>Com processadores de pagamento (Stripe, Mercado Pago), certificados PCI-DSS.</li>
            <li>Por obrigação legal ou ordem judicial.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">5. SEUS DIREITOS (Art. 18 da LGPD)</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { right: 'Confirmação', desc: 'Confirmar a existência de tratamento de seus dados.' },
              { right: 'Acesso', desc: 'Acessar seus dados pessoais armazenados.' },
              { right: 'Correção', desc: 'Corrigir dados incompletos, inexatos ou desatualizados.' },
              { right: 'Anonimização', desc: 'Solicitar anonimização, bloqueio ou eliminação de dados desnecessários.' },
              { right: 'Portabilidade', desc: 'Solicitar a portabilidade dos dados a outro fornecedor.' },
              { right: 'Eliminação', desc: 'Solicitar a eliminação dos dados tratados com consentimento.' },
              { right: 'Informação', desc: 'Ser informado sobre compartilhamento de dados.' },
              { right: 'Revogação', desc: 'Revogar o consentimento a qualquer momento.' },
            ].map((item, i) => (
              <div key={i} className="bg-background/50 rounded-lg p-3 border border-border/50">
                <p className="font-bold text-primary text-sm">{item.right}</p>
                <p className="text-foreground/70 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-foreground/80">
            Para exercer seus direitos, entre em contato: <strong>privacidade@medfocus.com.br</strong>. 
            Responderemos em até 15 dias úteis, conforme a LGPD.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">6. SEGURANÇA DOS DADOS</h3>
          <ul className="list-disc list-inside space-y-1.5 text-foreground/80">
            <li>Dados armazenados com criptografia AES-256 em servidores do Google Cloud Platform (região Brasil).</li>
            <li>Comunicações protegidas por TLS 1.3.</li>
            <li>Acesso restrito por autenticação multifator.</li>
            <li>Backups regulares com retenção de 30 dias.</li>
            <li>Monitoramento contínuo de segurança.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">7. RETENÇÃO DE DADOS</h3>
          <p className="text-foreground/80">
            Seus dados são retidos enquanto sua conta estiver ativa. Após a exclusão da conta, os dados 
            pessoais são eliminados em até 30 dias, exceto quando a retenção for necessária para cumprimento 
            de obrigação legal ou regulatória.
          </p>
        </section>
      </div>

      <p className="text-xs text-muted-foreground italic mt-4">
        Versão 3.0 — Março de 2026. Em conformidade com a LGPD (Lei nº 13.709/2018) e o Marco Civil da Internet (Lei nº 12.965/2014).
      </p>
    </div>
  );
}

// ============================================================
// CÓDIGO DE ÉTICA MÉDICA (CFM)
// ============================================================
function EthicsCodeContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        ⚕️ Código de Ética Médica — Resolução CFM nº 2.217/2018
      </h2>
      <p className="text-sm text-muted-foreground">
        Publicado no D.O.U. de 01 de novembro de 2018, Seção I, p. 179. 
        Modificado pelas Resoluções CFM nº 2.222/2018 e 2.226/2019.
      </p>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
        <p className="text-sm text-foreground/85">
          <strong>Nota do MedFocus:</strong> O conteúdo abaixo é apresentado para <strong>fins educacionais 
          e de referência acadêmica</strong>. O MedFocus não é uma entidade médica e não está sujeito ao 
          Código de Ética Médica como prestador de serviços de saúde. Disponibilizamos este conteúdo como 
          parte de nossa missão educacional de apoio ao estudo de medicina.
        </p>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-bold text-primary mb-3">PREÂMBULO</h3>
          <div className="space-y-3 text-sm leading-relaxed text-foreground/80">
            <p>I — O presente Código de Ética Médica contém as normas que devem ser seguidas pelos médicos no exercício de sua profissão, inclusive nas atividades relativas ao ensino, à pesquisa e à administração de serviços de saúde, bem como em quaisquer outras atividades em que seja utilizado o conhecimento advindo do estudo da Medicina.</p>
            <p>II — As organizações de prestação de serviços médicos estão sujeitas às normas deste Código.</p>
            <p>III — Para o exercício da Medicina, impõe-se a inscrição no Conselho Regional do respectivo estado, território ou Distrito Federal.</p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">CAPÍTULO I — PRINCÍPIOS FUNDAMENTAIS (Seleção)</h3>
          <div className="space-y-3 text-sm leading-relaxed text-foreground/80">
            <p><strong>I</strong> — A Medicina é uma profissão a serviço da saúde do ser humano e da coletividade e será exercida sem discriminação de nenhuma natureza.</p>
            <p><strong>II</strong> — O alvo de toda a atenção do médico é a saúde do ser humano, em benefício da qual deverá agir com o máximo de zelo e o melhor de sua capacidade profissional.</p>
            <p><strong>V</strong> — Compete ao médico aprimorar continuamente seus conhecimentos e usar o melhor do progresso científico em benefício do paciente e da sociedade.</p>
            <p><strong>VI</strong> — O médico guardará absoluto respeito pelo ser humano e atuará sempre em seu benefício.</p>
            <p><strong>XI</strong> — O médico guardará sigilo a respeito das informações de que detenha conhecimento no desempenho de suas funções, com exceção dos casos previstos em lei.</p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">RELEVÂNCIA PARA O ESTUDO</h3>
          <p className="text-sm text-foreground/80">
            O conhecimento do Código de Ética Médica é fundamental para a formação de todo estudante de medicina. 
            Ele estabelece os princípios que norteiam a prática médica ética e responsável. O MedFocus disponibiliza 
            este conteúdo como material de estudo e referência, incentivando os estudantes a consultarem o texto 
            completo no site oficial do CFM.
          </p>
          <a href="https://portal.cfm.org.br/etica-medica/codigo-2019/" target="_blank" rel="noopener noreferrer"
            className="inline-block mt-2 text-primary hover:underline text-sm">
            Consultar texto completo no portal do CFM →
          </a>
        </section>
      </div>
    </div>
  );
}

// ============================================================
// POLÍTICA DE USO DE IA
// ============================================================
function AIPolicyContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        🤖 Política de Uso de Inteligência Artificial
      </h2>
      <p className="text-xs text-muted-foreground">
        Diretrizes para o uso responsável das funcionalidades de IA do MedFocus
      </p>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h3 className="text-lg font-bold text-primary mb-3">1. NATUREZA DA IA NO MEDFOCUS</h3>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <p className="text-foreground/85">
              As funcionalidades de Inteligência Artificial do MedFocus, incluindo o <strong>Dr. Focus IA</strong>, 
              são <strong>ferramentas de apoio ao estudo e processamento de linguagem natural</strong>. Elas utilizam 
              modelos de linguagem para auxiliar na compreensão de conceitos médicos, organização de estudos e 
              geração de resumos educacionais.
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">2. LIMITAÇÕES DA IA</h3>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 space-y-3">
            <p className="font-bold text-red-400">A IA do MedFocus:</p>
            <ul className="list-disc list-inside space-y-1.5 text-foreground/80">
              <li><strong>NÃO é um médico virtual</strong> — Não possui licença médica, CRM ou qualquer habilitação para exercer a medicina.</li>
              <li><strong>NÃO fornece diagnósticos</strong> — Qualquer informação gerada é para fins de estudo, não de diagnóstico.</li>
              <li><strong>NÃO prescreve tratamentos</strong> — Informações sobre medicamentos e condutas são educacionais.</li>
              <li><strong>NÃO substitui o médico</strong> — A relação médico-paciente, a anamnese e o exame físico são insubstituíveis.</li>
              <li><strong>PODE conter erros</strong> — Modelos de IA podem gerar informações imprecisas, desatualizadas ou incorretas (alucinações).</li>
              <li><strong>PODE ter vieses</strong> — Os modelos podem refletir vieses presentes nos dados de treinamento.</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">3. USO RESPONSÁVEL</h3>
          <p>Ao utilizar as funcionalidades de IA, o Usuário deve:</p>
          <ul className="list-disc list-inside space-y-1.5 mt-2 text-foreground/80">
            <li><strong>Sempre verificar</strong> as informações geradas com fontes primárias (livros-texto, artigos científicos, guidelines oficiais).</li>
            <li><strong>Nunca aplicar</strong> diretamente informações da IA em contextos clínicos reais.</li>
            <li><strong>Não inserir</strong> dados reais de pacientes nas interações com a IA.</li>
            <li><strong>Manter o senso crítico</strong> e tratar as respostas da IA como ponto de partida para o estudo, não como verdade absoluta.</li>
            <li><strong>Reportar erros</strong> encontrados para contribuir com a melhoria contínua da plataforma.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">4. PRIVACIDADE NAS INTERAÇÕES COM IA</h3>
          <ul className="list-disc list-inside space-y-1.5 text-foreground/80">
            <li>As conversas com a IA são processadas em servidores seguros do Google Cloud Platform.</li>
            <li>As interações NÃO são utilizadas para treinamento de modelos de IA de terceiros.</li>
            <li>O histórico de conversas pode ser excluído pelo Usuário a qualquer momento.</li>
            <li>Dados sensíveis de saúde NÃO devem ser inseridos nas interações com a IA.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">5. TRANSPARÊNCIA</h3>
          <p className="text-foreground/80">
            O MedFocus se compromete com a transparência no uso de IA. Todas as funcionalidades que utilizam 
            Inteligência Artificial são claramente identificadas na interface com o ícone 🤖 ou a badge "IA". 
            O Usuário sempre saberá quando está interagindo com uma ferramenta de IA.
          </p>
        </section>
      </div>

      <p className="text-xs text-muted-foreground italic mt-4">
        Versão 1.0 — Março de 2026. Esta política segue as recomendações da UNESCO sobre Ética da IA 
        e as diretrizes do Ministério da Ciência, Tecnologia e Inovação do Brasil.
      </p>
    </div>
  );
}

// ============================================================
// MODAL DE ACEITE OBRIGATÓRIO (REFORÇADO)
// ============================================================
export function LegalAcceptanceModal({ onAccept }: { onAccept: () => void }) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);
  const [acceptedLGPD, setAcceptedLGPD] = useState(false);

  const allAccepted = acceptedTerms && acceptedDisclaimer && acceptedLGPD;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-border bg-gradient-to-r from-primary/10 to-transparent sticky top-0 bg-card z-10">
          <h2 className="text-xl font-bold flex items-center gap-2">
            🛡️ Termos de Uso, Disclaimer e Privacidade
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Por favor, leia e aceite todos os termos antes de continuar.
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* AVISO PRINCIPAL */}
          <div className="bg-red-500/15 border-2 border-red-500/40 rounded-xl p-5">
            <h3 className="font-bold text-red-400 text-base mb-3 flex items-center gap-2">
              🚨 AVISO FUNDAMENTAL
            </h3>
            <p className="text-sm text-foreground/90 leading-relaxed font-semibold">
              O MedFocus é uma <strong>plataforma educacional, guia estudantil e biblioteca acadêmica</strong>.
            </p>
            <p className="text-sm text-red-300 leading-relaxed mt-2 font-bold">
              NÓS NÃO SOMOS MÉDICOS. NÃO PRATICAMOS MEDICINA. NÃO REALIZAMOS NENHUM ATO MÉDICO.
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed mt-2">
              Nenhuma informação, ferramenta ou funcionalidade desta plataforma deve ser utilizada para 
              diagnósticos, prescrições, tratamentos ou qualquer finalidade que não seja estritamente 
              educacional e de referência acadêmica.
            </p>
          </div>

          {/* DISCLAIMER IA */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <h3 className="font-bold text-purple-400 text-sm mb-2 flex items-center gap-2">
              🤖 Sobre a Inteligência Artificial (Dr. Focus IA)
            </h3>
            <p className="text-sm text-foreground/80 leading-relaxed">
              As funcionalidades de IA são ferramentas de apoio ao estudo e <strong>não constituem opinião médica</strong>. 
              Respostas geradas por IA podem conter imprecisões e devem <strong>sempre</strong> ser verificadas com 
              fontes primárias e literatura científica reconhecida. A IA não substitui o raciocínio clínico 
              ou a relação médico-paciente.
            </p>
          </div>

          {/* LGPD */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <h3 className="font-bold text-blue-400 text-sm mb-2 flex items-center gap-2">
              🔒 Proteção de Dados (LGPD)
            </h3>
            <p className="text-sm text-foreground/80 leading-relaxed">
              Seus dados pessoais são tratados em conformidade com a Lei Geral de Proteção de Dados 
              (Lei nº 13.709/2018). Não coletamos dados de saúde ou prontuários. Seus dados são armazenados 
              com criptografia em servidores seguros no Google Cloud Platform (região Brasil) e não são 
              compartilhados com terceiros para fins comerciais.
            </p>
          </div>

          {/* EMERGÊNCIA */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-center">
            <p className="text-xs text-foreground/70">
              🚨 <strong>Emergência médica?</strong> Ligue <strong>SAMU 192</strong> | Bombeiros <strong>193</strong> | CVV <strong>188</strong>
            </p>
          </div>

          {/* CHECKBOXES DE ACEITE */}
          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 cursor-pointer transition border border-border/50">
              <input
                type="checkbox"
                checked={acceptedDisclaimer}
                onChange={(e) => setAcceptedDisclaimer(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-border accent-primary flex-shrink-0"
              />
              <span className="text-sm text-foreground/90">
                Declaro que compreendo que o MedFocus é uma <strong>plataforma exclusivamente educacional, 
                guia estudantil e biblioteca acadêmica</strong>. Reconheço que a plataforma <strong>não é um 
                serviço médico</strong>, não realiza diagnósticos, prescrições ou consultas, e que não utilizarei 
                as informações para fins clínicos sem supervisão profissional adequada.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 cursor-pointer transition border border-border/50">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-border accent-primary flex-shrink-0"
              />
              <span className="text-sm text-foreground/90">
                Li e concordo com os <strong>Termos de Uso e Serviço</strong>, incluindo a cláusula de 
                limitação de responsabilidade e as regras de uso adequado da plataforma.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 cursor-pointer transition border border-border/50">
              <input
                type="checkbox"
                checked={acceptedLGPD}
                onChange={(e) => setAcceptedLGPD(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-border accent-primary flex-shrink-0"
              />
              <span className="text-sm text-foreground/90">
                Li e concordo com a <strong>Política de Privacidade (LGPD)</strong> e autorizo o tratamento 
                dos meus dados pessoais conforme descrito, ciente dos meus direitos como titular dos dados.
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3 sticky bottom-0 bg-card">
          <p className="text-xs text-muted-foreground">
            Ao continuar, você concorda com todos os documentos legais acima.
          </p>
          <button
            onClick={onAccept}
            disabled={!allAccepted}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${
              allAccepted
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg'
                : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
            }`}
          >
            {allAccepted ? '✓ Aceitar e Continuar' : 'Aceite todos os termos acima'}
          </button>
        </div>
      </div>
    </div>
  );
}
