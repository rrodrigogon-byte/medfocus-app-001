# Sistema de Validação de Conteúdo Acadêmico - MedFocus

## 📋 Visão Geral

O MedFocus implementa um sistema robusto de validação de conteúdo em três níveis (tiers), garantindo que as maiores mentes da medicina brasileira possam confiar na qualidade dos materiais disponibilizados.

## 🥇 Hierarquia de Conteúdo

### Tier 1: Conteúdo Consagrado (VALIDATED)
- ✅ **Validado por professores e instituições**
- 📚 **Referências de qualidade OURO (Gold)**
- 🏆 **Consenso entre múltiplos revisores**
- 📊 **Quality Score: 90-100%**

**Critérios de Validação:**
- Aprovado por pelo menos 3 professores verificados
- Referências de fontes reconhecidas (PubMed, Elsevier, etc.)
- Alinhado com diretrizes nacionais e internacionais
- Citações de trabalhos com alto impacto (citation count > 1000)

**Exemplos:**
- Gray's Anatomy (42ª edição)
- Guyton & Hall - Fisiologia Médica
- Harrison's Principles of Internal Medicine
- Goldman-Cecil Medicine

### Tier 2: Contribuições da Comunidade (COMMUNITY)
- 🥈 **Conteúdo de qualidade aguardando validação**
- 📝 **Referências de qualidade PRATA (Silver)**
- 👥 **Criado por estudantes e profissionais**
- 📊 **Quality Score: 70-89%**

**Critérios:**
- Material bem estruturado e completo
- Referências citadas corretamente
- Feedback positivo da comunidade (rating > 4.0)
- Downloads significativos (> 100)

### Tier 3: Conteúdo Experimental (EXPERIMENTAL)
- 🥉 **Material novo em fase de avaliação**
- 🔬 **Inovações e abordagens não tradicionais**
- 🧪 **Referências de qualidade BRONZE**
- 📊 **Quality Score: 50-69%**

**Critérios:**
- Material recente (< 30 dias)
- Abordagens inovadoras (IA, visualizações 3D, etc.)
- Aguardando feedback da comunidade
- Pode conter métodos experimentais

## 👨‍🏫 Sistema de Professores

### Acesso FREE para Professores Verificados

Professores de universidades brasileiras têm **acesso gratuito completo** à plataforma, incluindo:

#### Funcionalidades Exclusivas:
1. **Validação de Conteúdo**
   - Aprovar materiais da comunidade
   - Solicitar revisões
   - Rejeitar conteúdo inadequado
   - Sistema de comentários e feedback

2. **Salas de Estudo**
   - Criar salas públicas ou privadas
   - Adicionar materiais curados
   - Postar anúncios e avisos
   - Criar atividades e assignments
   - Monitorar progresso dos estudantes

3. **Contribuição de Material**
   - Upload ilimitado de artigos e materiais
   - Prioridade na revisão de conteúdo
   - Badge de "Professor Verificado"
   - Estatísticas de impacto (estudantes alcançados)

### Processo de Verificação de Professores

1. **Cadastro com Credenciais Acadêmicas**
   - Email institucional (@usp.br, @unicamp.br, etc.)
   - Lattes CV (opcional, mas recomendado)
   - ORCID (opcional)
   - Google Scholar (opcional)

2. **Verificação Automática**
   - Validação de email institucional
   - Cross-reference com base de dados de universidades

3. **Aprovação Manual** (se necessário)
   - Revisão pela equipe MedFocus
   - Confirmação de vínculo institucional

### Permissões por Papel

| Papel | Validar Conteúdo | Criar Salas | Moderar | Upload Ilimitado |
|-------|------------------|-------------|---------|------------------|
| **Estudante** | ❌ | ❌ | ❌ | ❌ |
| **Professor** | ✅ | ✅ | ❌ | ✅ |
| **Coordenador** | ✅ | ✅ | ✅ | ✅ |
| **Admin** | ✅ | ✅ | ✅ | ✅ |

## 📊 Métricas de Qualidade

### Quality Score (0-100)

Calculado com base em:

```typescript
qualityScore = (
  referenceQuality * 0.40 +      // 40% - Qualidade das referências
  professorValidation * 0.30 +   // 30% - Validação por professores
  communityFeedback * 0.20 +     // 20% - Feedback da comunidade
  contentCompleteness * 0.10     // 10% - Completude do conteúdo
)
```

#### Componentes:

1. **Reference Quality (0-100)**
   - Gold references (PubMed, high-impact journals): 100
   - Silver references (textbooks, recognized sources): 70
   - Bronze references (other academic sources): 50
   - No references: 0

2. **Professor Validation (0-100)**
   - 3+ professores validaram: 100
   - 2 professores validaram: 80
   - 1 professor validou: 60
   - Nenhum professor validou: 0

3. **Community Feedback (0-100)**
   - Rating 4.5-5.0: 100
   - Rating 4.0-4.4: 80
   - Rating 3.5-3.9: 60
   - Rating 3.0-3.4: 40
   - Rating < 3.0: 0

4. **Content Completeness (0-100)**
   - Descrição completa, tags, módulo, professor: 100
   - Descrição e tags: 70
   - Apenas descrição: 40

### Consenso de Validação

Um material tem **consenso** quando:
- Validado por pelo menos 3 professores diferentes
- Professores de pelo menos 2 universidades diferentes
- Quality Score ≥ 90
- Sem objeções ou solicitações de revisão pendentes

## 🎯 Quizzes Progressivos (1º ao 6º Ano)

### Sistema de Adaptação por Ano

O MedFocus implementa quizzes que se adaptam ao ano do estudante, preparando progressivamente para a prática médica.

#### 1º Ano - Básico (Bloom: Conhecimento/Compreensão)
- **Foco:** Anatomia, Histologia, Bioquímica
- **Tipo:** Memorização e compreensão de conceitos
- **Tempo médio:** 30-45 segundos por questão
- **Exemplo:** "Qual é a camada mais externa do coração?"

#### 2º Ano - Intermediário (Bloom: Compreensão/Aplicação)
- **Foco:** Fisiologia, Imunologia, Microbiologia
- **Tipo:** Aplicação de conhecimentos em cenários simples
- **Tempo médio:** 45-60 segundos
- **Exemplo:** "Paciente com hiponatremia. Qual hormônio regula o sódio?"

#### 3º Ano - Intermediário/Avançado (Bloom: Aplicação/Análise)
- **Foco:** Farmacologia, Patologia, Propedêutica
- **Tipo:** Análise de mecanismos e interações
- **Tempo médio:** 60-90 segundos
- **Exemplo:** "Paciente com tosse seca após enalapril. Mecanismo?"

#### 4º Ano - Avançado (Bloom: Análise/Síntese)
- **Foco:** Clínica Médica, Cirurgia, Pediatria
- **Tipo:** Síntese de informações e tomada de decisão
- **Tempo médio:** 90-120 segundos
- **Exemplo:** "ICC NYHA II. Qual intervenção tem MAIOR impacto na mortalidade?"

#### 5º Ano - Avançado (Bloom: Síntese/Avaliação)
- **Foco:** Medicina Interna, Urgências, Casos Complexos
- **Tipo:** Integração de múltiplos sistemas e raciocínio clínico
- **Tempo médio:** 120-150 segundos
- **Exemplo:** "IAM inferior com bradicardia e hipotensão. Conduta?"

#### 6º Ano - Nível Residência (Bloom: Avaliação)
- **Foco:** Casos complexos, Procedimentos, Emergências
- **Tipo:** Avaliação crítica e decisões sob pressão
- **Tempo médio:** 150-180 segundos
- **Exemplo:** "Gestante 32 sem com hipertireoidismo. Melhor conduta?"

### Taxonomia de Bloom Aplicada

```
6. AVALIAÇÃO   → 6º Ano (Residência)
   └─ Julgamento clínico, decisões críticas
   
5. SÍNTESE     → 5º Ano
   └─ Integração de sistemas, raciocínio clínico
   
4. ANÁLISE     → 4º Ano
   └─ Decomposição de problemas, diagnóstico diferencial
   
3. APLICAÇÃO   → 3º Ano
   └─ Uso de conhecimento em situações práticas
   
2. COMPREENSÃO → 2º Ano
   └─ Interpretação e explicação de conceitos
   
1. CONHECIMENTO → 1º Ano
   └─ Memorização e reconhecimento
```

## 🔄 Fluxo de Validação

### 1. Submissão de Material (Estudante ou Professor)
```
Estudante/Professor → Upload Material
                    ↓
              Tier: EXPERIMENTAL
              Quality Score: 50-60
```

### 2. Revisão pela Comunidade (7-14 dias)
```
Comunidade → Feedback + Ratings
           ↓
     Tier: COMMUNITY
     Quality Score: 70-80
```

### 3. Validação por Professor (opcional)
```
Professor → Revisão Técnica
          ↓
    Solicitar Correções OU Aprovar
          ↓
    Tier: VALIDATED
    Quality Score: 90-100
```

### 4. Consenso (3+ Professores)
```
3+ Professores → Validação Independente
               ↓
         Tier: VALIDATED + CONSENSO
         Quality Score: 95-100
         Badge: 🥇 VALIDADO - CONSENSO
```

## 🚀 Roadmap de Implementação

### Fase 1: ✅ Concluída
- [x] Sistema de tiers (Validated, Community, Experimental)
- [x] Tipos TypeScript para validação
- [x] Interface de biblioteca validada
- [x] Sistema de roles (Student, Professor, Coordinator, Admin)
- [x] Painel do professor
- [x] Quizzes progressivos (1º-6º ano)

### Fase 2: 🚧 Em Desenvolvimento
- [ ] Backend API para validação
- [ ] Integração com Gemini AI para geração de quizzes
- [ ] Sistema de notificações para professores
- [ ] Dashboard de métricas de impacto

### Fase 3: 📅 Planejada
- [ ] Integração com APIs de universidades
- [ ] Scraping automático de materiais oficiais
- [ ] Sistema de badges e reputação
- [ ] Marketplace de conteúdo premium

### Fase 4: 🔮 Futuro
- [ ] Análise preditiva de desempenho
- [ ] Recomendações personalizadas por IA
- [ ] Integração com sistemas de gestão acadêmica (SIGAA, etc.)
- [ ] API pública para desenvolvedores

## 📚 Referências e Padrões

### Fontes Reconhecidas (GOLD)
- **PubMed/MEDLINE** - Base de dados primária
- **New England Journal of Medicine (NEJM)**
- **The Lancet**
- **JAMA (Journal of the American Medical Association)**
- **Nature Medicine**
- **Circulation (American Heart Association)**
- **European Heart Journal**

### Livros-Texto Padrão (GOLD)
- Gray's Anatomy (Elsevier)
- Guyton & Hall - Fisiologia Médica
- Harrison's Principles of Internal Medicine
- Goldman-Cecil Medicine
- Robbins & Cotran Pathologic Basis of Disease
- Katzung's Basic & Clinical Pharmacology

### Diretrizes Nacionais/Internacionais (GOLD)
- Sociedade Brasileira de Cardiologia (SBC)
- American College of Cardiology (ACC)
- American Heart Association (AHA)
- European Society of Cardiology (ESC)
- Ministério da Saúde - Protocolos Clínicos

## 💡 Diferenciais Competitivos

### vs. Notion/Evernote
- ✅ Validação por professores especialistas
- ✅ Quizzes adaptativos por ano médico
- ✅ Foco exclusivo em medicina
- ✅ Referências acadêmicas integradas

### vs. Anki
- ✅ IA integrada para geração de conteúdo
- ✅ Biblioteca compartilhada e validada
- ✅ Quizzes baseados em taxonomia de Bloom
- ✅ Integração com currículo médico brasileiro

### vs. Google Drive/Dropbox
- ✅ Curadoria especializada
- ✅ Sistema de busca semântica
- ✅ Organização por ano/semestre/disciplina
- ✅ Ferramentas de estudo integradas

## 🎓 Meta: 100% Teórico na Universidade = Foco em Prática

**Objetivo Final:** Estudantes dominam 100% da teoria através do MedFocus, permitindo que o tempo na universidade seja dedicado a:
- Discussão de casos clínicos
- Prática de procedimentos
- Interação com pacientes (com supervisão)
- Resolução de dúvidas específicas
- Desenvolvimento de habilidades interpessoais

---

**Versão:** 1.0  
**Última atualização:** 2024-02-15  
**Autores:** Equipe MedFocus  
**Licença:** Uso interno - Confidencial
