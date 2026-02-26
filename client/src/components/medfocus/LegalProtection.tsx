/**
 * MedFocus — Proteção Legal e Termos de Uso
 * 
 * Código de Ética Médica (CFM), Termos de Uso, Política de Privacidade (LGPD),
 * e Disclaimer educacional/consultivo.
 */

import React, { useState } from 'react';

type LegalTab = 'disclaimer' | 'ethics' | 'lgpd' | 'terms';

export default function LegalProtection() {
  const [activeTab, setActiveTab] = useState<LegalTab>('disclaimer');

  const tabs: { id: LegalTab; label: string; icon: string }[] = [
    { id: 'disclaimer', label: 'Disclaimer', icon: '⚠️' },
    { id: 'ethics', label: 'Código de Ética', icon: '⚕️' },
    { id: 'lgpd', label: 'LGPD / Privacidade', icon: '🔒' },
    { id: 'terms', label: 'Termos de Uso', icon: '📋' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <span className="text-3xl">🛡️</span> Proteção Legal & Termos
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Código de Ética Médica, LGPD, Termos de Uso e Disclaimer Educacional
        </p>
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
        {activeTab === 'ethics' && <EthicsCodeContent />}
        {activeTab === 'lgpd' && <LGPDContent />}
        {activeTab === 'terms' && <TermsContent />}
      </div>
    </div>
  );
}

// ============================================================
// DISCLAIMER EDUCACIONAL
// ============================================================
function DisclaimerContent() {
  return (
    <div className="space-y-6">
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2 mb-4">
          ⚠️ AVISO IMPORTANTE — DISCLAIMER EDUCACIONAL
        </h2>
        <div className="space-y-4 text-sm text-foreground/90 leading-relaxed">
          <p className="font-semibold text-base">
            A plataforma MedFocus é um sistema <strong>exclusivamente consultivo, educacional e colaborativo</strong>.
          </p>
          
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <h3 className="font-bold text-red-400 mb-2">🚫 NÃO DEVE SER UTILIZADO PARA:</h3>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Tomada de decisão clínica</strong> — Nenhuma informação desta plataforma substitui o julgamento clínico de um profissional de saúde habilitado.</li>
              <li><strong>Diagnósticos médicos</strong> — O sistema não realiza, sugere ou confirma diagnósticos. Qualquer funcionalidade de apoio diagnóstico é meramente educacional.</li>
              <li><strong>Prescrição de medicamentos</strong> — Informações sobre medicamentos são de caráter informativo e educacional. A prescrição é ato exclusivo do médico.</li>
              <li><strong>Consultas médicas</strong> — A plataforma não substitui consultas presenciais ou por telemedicina com profissionais habilitados.</li>
              <li><strong>Tratamentos ou condutas terapêuticas</strong> — Protocolos e condutas apresentados são para fins de estudo e não devem ser aplicados diretamente sem supervisão profissional.</li>
              <li><strong>Emergências médicas</strong> — Em caso de emergência, ligue para o SAMU (192) ou dirija-se ao pronto-socorro mais próximo.</li>
            </ul>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <h3 className="font-bold text-green-400 mb-2">✅ FINALIDADES DA PLATAFORMA:</h3>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Estudo e aprendizado</strong> — Ferramenta de apoio ao estudo de medicina e ciências da saúde.</li>
              <li><strong>Consulta bibliográfica</strong> — Acesso a referências e conteúdos acadêmicos organizados.</li>
              <li><strong>Colaboração acadêmica</strong> — Interação entre estudantes e professores em ambiente educacional.</li>
              <li><strong>Revisão de conteúdos</strong> — Quizzes, flashcards e ferramentas de memorização para concursos e provas.</li>
              <li><strong>Atlas anatômico educacional</strong> — Modelos 3D para estudo da anatomia humana.</li>
              <li><strong>Informação sobre medicamentos</strong> — Dados da ANVISA/CMED para consulta e comparação educacional.</li>
            </ul>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h3 className="font-bold text-blue-400 mb-2">📋 RESPONSABILIDADE:</h3>
            <p>
              O MedFocus e seus desenvolvedores <strong>não se responsabilizam</strong> por qualquer dano, prejuízo ou consequência 
              decorrente do uso indevido das informações contidas nesta plataforma para fins que não sejam estritamente 
              educacionais e consultivos. O usuário assume total responsabilidade pelo uso que faz das informações disponibilizadas.
            </p>
            <p className="mt-2">
              As funcionalidades de Inteligência Artificial (Dr. Focus IA) são ferramentas de apoio ao estudo e 
              <strong> não constituem opinião médica, diagnóstico ou recomendação de tratamento</strong>. 
              Respostas geradas por IA podem conter imprecisões e devem sempre ser verificadas com fontes primárias.
            </p>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <h3 className="font-bold text-purple-400 mb-2">📚 FONTES E REFERÊNCIAS:</h3>
            <p>
              Todo o conteúdo da plataforma é baseado em referências bibliográficas reconhecidas pela comunidade médica e científica, 
              incluindo mas não limitado a: Netter (Atlas de Anatomia), Gray's Anatomy, Guyton (Fisiologia), Harrison (Medicina Interna), 
              Goodman & Gilman (Farmacologia), dados oficiais da ANVISA/CMED e publicações indexadas no PubMed/MEDLINE.
            </p>
          </div>

          <p className="text-xs text-muted-foreground italic mt-4">
            Última atualização: Fevereiro de 2026. Este disclaimer está em conformidade com as diretrizes do 
            Conselho Federal de Medicina (CFM) e a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
          </p>
        </div>
      </div>
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

      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-bold text-primary mb-3">PREÂMBULO</h3>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>I — O presente Código de Ética Médica contém as normas que devem ser seguidas pelos médicos no exercício de sua profissão, inclusive nas atividades relativas ao ensino, à pesquisa e à administração de serviços de saúde, bem como em quaisquer outras atividades em que seja utilizado o conhecimento advindo do estudo da Medicina.</p>
            <p>II — As organizações de prestação de serviços médicos estão sujeitas às normas deste Código.</p>
            <p>III — Para o exercício da Medicina, impõe-se a inscrição no Conselho Regional do respectivo estado, território ou Distrito Federal.</p>
            <p>IV — A fim de garantir o acatamento e a cabal execução deste Código, o médico comunicará ao Conselho Regional de Medicina, com discrição e fundamento, fatos de que tenha conhecimento e que caracterizem possível infração do presente Código e das demais normas que regulam o exercício da Medicina.</p>
            <p>V — A fiscalização do cumprimento das normas estabelecidas neste Código é atribuição dos Conselhos de Medicina, das comissões de ética, das autoridades de saúde e dos médicos em geral.</p>
            <p>VI — Este Código de Ética Médica é composto de 26 princípios fundamentais do exercício da Medicina, 10 normas diceológicas, 118 normas deontológicas e 4 disposições gerais.</p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">CAPÍTULO I — PRINCÍPIOS FUNDAMENTAIS</h3>
          <div className="space-y-3 text-sm leading-relaxed">
            <p><strong>I</strong> — A Medicina é uma profissão a serviço da saúde do ser humano e da coletividade e será exercida sem discriminação de nenhuma natureza.</p>
            <p><strong>II</strong> — O alvo de toda a atenção do médico é a saúde do ser humano, em benefício da qual deverá agir com o máximo de zelo e o melhor de sua capacidade profissional.</p>
            <p><strong>III</strong> — Para exercer a Medicina com honra e dignidade, o médico necessita ter boas condições de trabalho e ser remunerado de forma justa.</p>
            <p><strong>IV</strong> — Ao médico cabe zelar e trabalhar pelo perfeito desempenho ético da Medicina, bem como pelo prestígio e bom conceito da profissão.</p>
            <p><strong>V</strong> — Compete ao médico aprimorar continuamente seus conhecimentos e usar o melhor do progresso científico em benefício do paciente e da sociedade.</p>
            <p><strong>VI</strong> — O médico guardará absoluto respeito pelo ser humano e atuará sempre em seu benefício, mesmo depois da morte. Jamais utilizará seus conhecimentos para causar sofrimento físico ou moral, para o extermínio do ser humano ou para permitir e acobertar tentativas contra sua dignidade e integridade.</p>
            <p><strong>VII</strong> — O médico exercerá sua profissão com autonomia, não sendo obrigado a prestar serviços que contrariem os ditames de sua consciência ou a quem não deseje, excetuadas as situações de ausência de outro médico, em caso de urgência ou emergência, ou quando sua recusa possa trazer danos à saúde do paciente.</p>
            <p><strong>VIII</strong> — O médico não pode, em nenhuma circunstância ou sob nenhum pretexto, renunciar à sua liberdade profissional, nem permitir quaisquer restrições ou imposições que possam prejudicar a eficiência e a correção de seu trabalho.</p>
            <p><strong>IX</strong> — A Medicina não pode, em nenhuma circunstância ou forma, ser exercida como comércio.</p>
            <p><strong>X</strong> — O trabalho do médico não pode ser explorado por terceiros com objetivos de lucro, finalidade política ou religiosa.</p>
            <p><strong>XI</strong> — O médico guardará sigilo a respeito das informações de que detenha conhecimento no desempenho de suas funções, com exceção dos casos previstos em lei.</p>
            <p><strong>XII</strong> — O médico empenhar-se-á pela melhor adequação do trabalho ao ser humano, pela eliminação e pelo controle dos riscos à saúde inerentes às atividades laborais e pela efetiva prevenção de doenças e acidentes de trabalho.</p>
            <p><strong>XIII</strong> — O médico comunicará às autoridades competentes quaisquer formas de deterioração do ecossistema, prejudiciais à saúde e à vida.</p>
            <p><strong>XIV</strong> — O médico empenhar-se-á em melhorar os padrões dos serviços médicos e em assumir sua responsabilidade em relação à saúde pública, à educação sanitária e à legislação referente à saúde.</p>
            <p><strong>XV</strong> — O médico será solidário com os movimentos de defesa da dignidade profissional, seja por remuneração digna e justa, seja por condições de trabalho compatíveis com o exercício ético-profissional da Medicina e seu aprimoramento técnico-científico.</p>
            <p><strong>XVI</strong> — Nenhuma disposição estatutária ou regimental de hospital ou de instituição, pública ou privada, limitará a escolha, pelo médico, dos meios cientificamente reconhecidos a serem praticados para o estabelecimento do diagnóstico e da execução do tratamento, salvo quando em benefício do paciente.</p>
            <p><strong>XVII</strong> — As relações do médico com os demais profissionais devem basear-se no respeito mútuo, na liberdade e na independência de cada um, buscando sempre o interesse e o bem-estar do paciente.</p>
            <p><strong>XVIII</strong> — O médico terá, para com os colegas, respeito, consideração e solidariedade, sem se eximir de denunciar atos que contrariem os postulados éticos.</p>
            <p><strong>XIX</strong> — O médico se responsabilizará, em caráter pessoal e nunca presumido, pelos seus atos profissionais, resultantes de relação particular de confiança e executados com diligência, competência e prudência.</p>
            <p><strong>XX</strong> — A natureza personalíssima da atuação profissional do médico não caracteriza relação de consumo.</p>
            <p><strong>XXI</strong> — No processo de tomada de decisões profissionais, de acordo com seus ditames de consciência e as previsões legais, o médico aceitará as escolhas de seus pacientes relativas aos procedimentos diagnósticos e terapêuticos por eles expressos, desde que adequadas ao caso e cientificamente reconhecidas.</p>
            <p><strong>XXII</strong> — Nas situações clínicas irreversíveis e terminais, o médico evitará a realização de procedimentos diagnósticos e terapêuticos desnecessários e propiciará aos pacientes sob sua atenção todos os cuidados paliativos apropriados.</p>
            <p><strong>XXIII</strong> — Quando envolvido na produção de conhecimento científico, o médico agirá com isenção e independência, visando ao maior benefício para os pacientes e a sociedade.</p>
            <p><strong>XXIV</strong> — Sempre que participar de pesquisas envolvendo seres humanos ou qualquer animal, o médico respeitará as normas éticas nacionais, bem como protegerá a vulnerabilidade dos sujeitos da pesquisa.</p>
            <p><strong>XXV</strong> — Na aplicação dos conhecimentos criados pelas novas tecnologias, considerando-se suas limitações e a prevalência dos direitos do paciente, o médico zelará para que as pessoas não sejam discriminadas por nenhuma razão vinculada a herança genética, protegendo-as em sua dignidade, identidade e integridade.</p>
            <p><strong>XXVI</strong> — A Medicina será exercida com a utilização dos meios técnicos e científicos disponíveis que visem aos melhores resultados.</p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">CAPÍTULO III — RESPONSABILIDADE PROFISSIONAL (Artigos selecionados)</h3>
          <div className="space-y-3 text-sm leading-relaxed">
            <p><strong>Art. 1º</strong> — É vedado ao médico causar dano ao paciente, por ação ou omissão, caracterizável como imperícia, imprudência ou negligência.</p>
            <p><strong>Art. 2º</strong> — É vedado ao médico delegar a outros profissionais atos ou atribuições exclusivos da profissão médica.</p>
            <p><strong>Art. 3º</strong> — É vedado ao médico deixar de assumir responsabilidade sobre procedimento médico que indicou ou do qual participou, mesmo quando vários médicos tenham assistido o paciente.</p>
            <p><strong>Art. 4º</strong> — É vedado ao médico deixar de assumir a responsabilidade de qualquer ato profissional que tenha praticado ou indicado, ainda que solicitado ou consentido pelo paciente ou por seu representante legal.</p>
            <p><strong>Art. 5º</strong> — É vedado ao médico assumir responsabilidade por ato médico que não praticou ou do qual não participou.</p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">CAPÍTULO V — RELAÇÃO COM PACIENTES E FAMILIARES (Artigos selecionados)</h3>
          <div className="space-y-3 text-sm leading-relaxed">
            <p><strong>Art. 22</strong> — É vedado ao médico deixar de obter consentimento do paciente ou de seu representante legal após esclarecê-lo sobre o procedimento a ser realizado, salvo em caso de risco iminente de morte.</p>
            <p><strong>Art. 23</strong> — É vedado ao médico tratar o ser humano sem civilidade ou consideração, desrespeitar sua dignidade ou discriminá-lo de qualquer forma ou sob qualquer pretexto.</p>
            <p><strong>Art. 24</strong> — É vedado ao médico deixar de garantir ao paciente o exercício do direito de decidir livremente sobre sua pessoa ou seu bem-estar, bem como exercer sua autoridade para limitá-lo.</p>
            <p><strong>Art. 31</strong> — É vedado ao médico desrespeitar o direito do paciente ou de seu representante legal de decidir livremente sobre a execução de práticas diagnósticas ou terapêuticas, salvo em caso de iminente risco de morte.</p>
            <p><strong>Art. 34</strong> — É vedado ao médico deixar de informar ao paciente o diagnóstico, o prognóstico, os riscos e os objetivos do tratamento, salvo quando a comunicação direta possa lhe provocar dano, devendo, nesse caso, fazer a comunicação a seu representante legal.</p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">CAPÍTULO IX — SIGILO PROFISSIONAL (Artigos selecionados)</h3>
          <div className="space-y-3 text-sm leading-relaxed">
            <p><strong>Art. 73</strong> — É vedado ao médico revelar fato de que tenha conhecimento em virtude do exercício de sua profissão, salvo por motivo justo, dever legal ou consentimento, por escrito, do paciente.</p>
            <p><strong>Art. 74</strong> — É vedado ao médico revelar sigilo profissional relacionado a paciente menor de idade, inclusive a seus pais ou representantes legais, desde que o menor tenha capacidade de discernimento, salvo quando a não revelação possa acarretar dano ao paciente.</p>
            <p><strong>Art. 75</strong> — É vedado ao médico fazer referência a casos clínicos identificáveis, exibir pacientes ou seus retratos em anúncios profissionais ou na divulgação de assuntos médicos, em meios de comunicação em geral, mesmo com autorização do paciente.</p>
            <p><strong>Art. 78</strong> — É vedado ao médico deixar de orientar seus auxiliares e alunos a respeitar o sigilo profissional e zelar para que seja por eles mantido.</p>
          </div>
        </section>
      </div>

      <p className="text-xs text-muted-foreground italic">
        Texto completo disponível em: <a href="https://portal.cfm.org.br/etica-medica/codigo-2019/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">portal.cfm.org.br/etica-medica/codigo-2019</a>. 
        Resolução CFM nº 2.217/2018, publicada no D.O.U. de 01/11/2018.
      </p>
    </div>
  );
}

// ============================================================
// LGPD — POLÍTICA DE PRIVACIDADE
// ============================================================
function LGPDContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        🔒 Política de Privacidade e Proteção de Dados — LGPD
      </h2>
      <p className="text-sm text-muted-foreground">
        Em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD).
      </p>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h3 className="text-lg font-bold text-primary mb-3">1. CONTROLADOR DE DADOS</h3>
          <p>O MedFocus, plataforma educacional de medicina e ciências da saúde, é o controlador dos dados pessoais coletados através desta plataforma, nos termos do art. 5º, VI da LGPD.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">2. DADOS COLETADOS</h3>
          <p>Coletamos os seguintes dados pessoais, estritamente necessários para a prestação do serviço educacional:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Dados de identificação:</strong> Nome completo, e-mail, instituição de ensino.</li>
            <li><strong>Dados de acesso:</strong> Credenciais de login (autenticação via OpenID/OAuth).</li>
            <li><strong>Dados de uso:</strong> Progresso nos estudos, respostas em quizzes, tempo de uso, módulos acessados.</li>
            <li><strong>Dados técnicos:</strong> Endereço IP, tipo de navegador, sistema operacional (para fins de segurança e performance).</li>
          </ul>
          <p className="mt-2 font-semibold text-yellow-400">⚠️ NÃO coletamos dados de saúde, prontuários médicos, dados biométricos ou informações sensíveis de pacientes.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">3. FINALIDADE DO TRATAMENTO</h3>
          <p>Os dados são tratados exclusivamente para as seguintes finalidades (art. 7º, LGPD):</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Prestação do serviço educacional contratado (art. 7º, V — execução de contrato).</li>
            <li>Personalização da experiência de aprendizado.</li>
            <li>Geração de relatórios de desempenho acadêmico para o próprio usuário e, quando aplicável, para a instituição de ensino.</li>
            <li>Comunicações sobre atualizações da plataforma e novos conteúdos.</li>
            <li>Cumprimento de obrigações legais e regulatórias (art. 7º, II).</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">4. BASE LEGAL</h3>
          <p>O tratamento de dados pessoais é realizado com base nas seguintes hipóteses legais previstas no art. 7º da LGPD:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Consentimento</strong> (art. 7º, I): Para dados opcionais e comunicações de marketing.</li>
            <li><strong>Execução de contrato</strong> (art. 7º, V): Para prestação do serviço educacional.</li>
            <li><strong>Legítimo interesse</strong> (art. 7º, IX): Para melhoria da plataforma e segurança.</li>
            <li><strong>Cumprimento de obrigação legal</strong> (art. 7º, II): Para obrigações fiscais e regulatórias.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">5. COMPARTILHAMENTO DE DADOS</h3>
          <p>Os dados pessoais <strong>NÃO são vendidos, alugados ou compartilhados</strong> com terceiros para fins comerciais. O compartilhamento ocorre apenas:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Com provedores de infraestrutura (Google Cloud Platform) para hospedagem segura.</li>
            <li>Com a instituição de ensino do usuário, quando aplicável e autorizado.</li>
            <li>Por determinação legal ou judicial.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">6. DIREITOS DO TITULAR (Art. 18, LGPD)</h3>
          <p>O titular dos dados tem direito a:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Confirmação</strong> da existência de tratamento de dados.</li>
            <li><strong>Acesso</strong> aos dados pessoais tratados.</li>
            <li><strong>Correção</strong> de dados incompletos, inexatos ou desatualizados.</li>
            <li><strong>Anonimização, bloqueio ou eliminação</strong> de dados desnecessários ou excessivos.</li>
            <li><strong>Portabilidade</strong> dos dados a outro fornecedor de serviço.</li>
            <li><strong>Eliminação</strong> dos dados tratados com consentimento.</li>
            <li><strong>Informação</strong> sobre compartilhamento de dados.</li>
            <li><strong>Revogação</strong> do consentimento a qualquer momento.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">7. SEGURANÇA DOS DADOS</h3>
          <p>Adotamos medidas técnicas e administrativas para proteger os dados pessoais:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Criptografia em trânsito (TLS/HTTPS) e em repouso.</li>
            <li>Autenticação segura via OAuth 2.0 / OpenID Connect.</li>
            <li>Hospedagem em infraestrutura Google Cloud Platform com certificações ISO 27001, SOC 2.</li>
            <li>Controle de acesso baseado em funções (RBAC).</li>
            <li>Logs de auditoria e monitoramento contínuo.</li>
            <li>Backups regulares com criptografia.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">8. RETENÇÃO DE DADOS</h3>
          <p>Os dados pessoais são mantidos pelo período necessário para a prestação do serviço educacional e cumprimento de obrigações legais. Após o encerramento da conta, os dados são eliminados em até 90 dias, exceto quando houver obrigação legal de retenção.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">9. ENCARREGADO DE DADOS (DPO)</h3>
          <p>Para exercer seus direitos ou esclarecer dúvidas sobre o tratamento de dados pessoais, entre em contato com nosso Encarregado de Proteção de Dados através do e-mail disponível na seção de contato da plataforma.</p>
        </section>
      </div>

      <p className="text-xs text-muted-foreground italic">
        Esta política está em conformidade com a Lei nº 13.709/2018 (LGPD) e o Marco Civil da Internet (Lei nº 12.965/2014). 
        Última atualização: Fevereiro de 2026.
      </p>
    </div>
  );
}

// ============================================================
// TERMOS DE USO
// ============================================================
function TermsContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        📋 Termos de Uso da Plataforma MedFocus
      </h2>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h3 className="text-lg font-bold text-primary mb-3">1. ACEITAÇÃO DOS TERMOS</h3>
          <p>Ao acessar e utilizar a plataforma MedFocus, o usuário declara ter lido, compreendido e concordado integralmente com estes Termos de Uso, com a Política de Privacidade (LGPD) e com o Disclaimer Educacional. Caso não concorde com qualquer disposição, o acesso à plataforma deve ser interrompido imediatamente.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">2. NATUREZA DO SERVIÇO</h3>
          <p>O MedFocus é uma <strong>plataforma educacional e consultiva</strong> destinada a estudantes de medicina, profissionais de saúde e acadêmicos. A plataforma oferece:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Conteúdos educacionais de medicina e ciências da saúde.</li>
            <li>Atlas anatômico 3D interativo para estudo.</li>
            <li>Ferramentas de estudo (quizzes, flashcards, resumos).</li>
            <li>Consulta de informações sobre medicamentos (base ANVISA/CMED).</li>
            <li>Ferramentas de IA para apoio ao estudo (Dr. Focus IA).</li>
            <li>Ambiente colaborativo entre alunos e professores.</li>
          </ul>
          <p className="mt-2 font-semibold">A plataforma NÃO é um serviço de saúde, consultório virtual, sistema de prontuário eletrônico ou ferramenta de diagnóstico.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">3. CADASTRO E CONTA</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>O usuário deve fornecer informações verdadeiras e atualizadas no cadastro.</li>
            <li>Cada conta é pessoal e intransferível.</li>
            <li>O usuário é responsável pela segurança de suas credenciais de acesso.</li>
            <li>O uso indevido da conta é de responsabilidade exclusiva do titular.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">4. USO ADEQUADO</h3>
          <p>O usuário compromete-se a:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Utilizar a plataforma exclusivamente para fins educacionais e consultivos.</li>
            <li>Não utilizar informações da plataforma para diagnósticos, prescrições ou condutas clínicas sem supervisão profissional adequada.</li>
            <li>Não reproduzir, distribuir ou comercializar conteúdos da plataforma sem autorização.</li>
            <li>Não tentar acessar áreas restritas ou comprometer a segurança do sistema.</li>
            <li>Respeitar os direitos de propriedade intelectual.</li>
            <li>Não utilizar a plataforma para fins ilegais ou antiéticos.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">5. PROPRIEDADE INTELECTUAL</h3>
          <p>Todo o conteúdo da plataforma (textos, imagens, modelos 3D, código-fonte, design, marcas) é protegido por direitos autorais e propriedade intelectual. O uso é licenciado ao usuário de forma não exclusiva, intransferível e revogável, exclusivamente para fins educacionais pessoais.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">6. LIMITAÇÃO DE RESPONSABILIDADE</h3>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p>O MedFocus e seus desenvolvedores:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li><strong>NÃO garantem</strong> a ausência de erros ou imprecisões no conteúdo educacional.</li>
              <li><strong>NÃO se responsabilizam</strong> por decisões clínicas baseadas em informações da plataforma.</li>
              <li><strong>NÃO se responsabilizam</strong> por danos diretos, indiretos ou consequenciais decorrentes do uso da plataforma.</li>
              <li><strong>NÃO substituem</strong> a formação médica formal, residência médica ou educação continuada.</li>
              <li><strong>NÃO garantem</strong> disponibilidade ininterrupta do serviço.</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">7. INTELIGÊNCIA ARTIFICIAL (Dr. Focus IA)</h3>
          <p>As funcionalidades de IA da plataforma:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>São ferramentas de <strong>apoio ao estudo</strong>, não constituindo opinião médica.</li>
            <li>Podem gerar respostas imprecisas ou incompletas.</li>
            <li>Devem ser sempre verificadas com fontes primárias e literatura médica reconhecida.</li>
            <li>Não substituem o raciocínio clínico ou o julgamento profissional.</li>
            <li>São processadas em servidores seguros com criptografia.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">8. PLANOS E PAGAMENTOS</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Os planos e preços são informados na plataforma e podem ser alterados com aviso prévio de 30 dias.</li>
            <li>O cancelamento pode ser solicitado a qualquer momento, com efeito ao final do período vigente.</li>
            <li>Reembolsos seguem a política do Código de Defesa do Consumidor (Lei nº 8.078/1990).</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">9. SUSPENSÃO E ENCERRAMENTO</h3>
          <p>O MedFocus reserva-se o direito de suspender ou encerrar contas que violem estes Termos de Uso, sem aviso prévio, especialmente em casos de uso para fins não educacionais, compartilhamento de credenciais ou atividades que comprometam a segurança da plataforma.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">10. LEGISLAÇÃO APLICÁVEL</h3>
          <p>Estes Termos de Uso são regidos pela legislação brasileira. Fica eleito o foro da comarca do domicílio do usuário para dirimir quaisquer controvérsias, conforme o art. 101, I do Código de Defesa do Consumidor.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-primary mb-3">11. DISPOSIÇÕES FINAIS</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>O MedFocus pode alterar estes Termos a qualquer momento, notificando os usuários.</li>
            <li>A tolerância quanto ao descumprimento de qualquer disposição não implica renúncia.</li>
            <li>Se qualquer cláusula for considerada inválida, as demais permanecem em vigor.</li>
          </ul>
        </section>
      </div>

      <p className="text-xs text-muted-foreground italic">
        Última atualização: Fevereiro de 2026. Em conformidade com o Código de Defesa do Consumidor (Lei nº 8.078/1990), 
        Marco Civil da Internet (Lei nº 12.965/2014) e LGPD (Lei nº 13.709/2018).
      </p>
    </div>
  );
}

// ============================================================
// ACCEPTANCE MODAL (for first-time users)
// ============================================================
export function LegalAcceptanceModal({ onAccept }: { onAccept: () => void }) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
          <h2 className="text-xl font-bold flex items-center gap-2">
            🛡️ Termos de Uso e Disclaimer
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Por favor, leia e aceite os termos antes de continuar.
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <h3 className="font-bold text-yellow-400 text-sm mb-2">⚠️ AVISO IMPORTANTE</h3>
            <p className="text-sm text-foreground/90 leading-relaxed">
              O MedFocus é uma plataforma <strong>exclusivamente educacional e consultiva</strong>. 
              As informações disponibilizadas <strong>não devem ser utilizadas</strong> para tomada de decisão clínica, 
              diagnósticos médicos, prescrição de medicamentos ou qualquer finalidade que não seja estritamente educacional.
            </p>
            <p className="text-sm text-foreground/90 leading-relaxed mt-2">
              As funcionalidades de Inteligência Artificial (Dr. Focus IA) são ferramentas de apoio ao estudo e 
              <strong> não constituem opinião médica</strong>. Respostas geradas por IA podem conter imprecisões.
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <h3 className="font-bold text-blue-400 text-sm mb-2">🔒 PROTEÇÃO DE DADOS (LGPD)</h3>
            <p className="text-sm text-foreground/90 leading-relaxed">
              Seus dados pessoais são tratados em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). 
              Não coletamos dados de saúde ou prontuários. Seus dados são armazenados com criptografia em servidores seguros 
              no Google Cloud Platform e não são compartilhados com terceiros para fins comerciais.
            </p>
          </div>

          <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 cursor-pointer transition">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-border accent-primary"
            />
            <span className="text-sm text-foreground/90">
              Declaro que li e compreendi os <strong>Termos de Uso</strong>, a <strong>Política de Privacidade (LGPD)</strong> e o 
              <strong> Disclaimer Educacional</strong> da plataforma MedFocus. Concordo que esta plataforma é exclusivamente 
              educacional e consultiva, e que não utilizarei as informações para diagnósticos, prescrições ou tomada de decisão clínica.
            </span>
          </label>
        </div>

        <div className="p-6 border-t border-border flex justify-end gap-3">
          <button
            onClick={onAccept}
            disabled={!accepted}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
              accepted
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            Aceitar e Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
