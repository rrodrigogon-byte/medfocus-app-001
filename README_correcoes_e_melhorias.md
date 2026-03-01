# MedFocus — Correções Críticas e Melhorias

## Data: 01/03/2026

---

## 1. Sidebar — Menu Fechado por Padrão

**Problema:** Todos os grupos do menu lateral abriam automaticamente ao carregar a página, criando uma experiência visual confusa com dezenas de itens visíveis.

**Correção:** Todos os grupos agora iniciam **fechados** por padrão. O usuário expande apenas o grupo que deseja navegar, melhorando significativamente a usabilidade.

---

## 2. Casos Clínicos — Mais Opções e Fix do Bug

**Problemas identificados:**
- Apenas 8 especialidades disponíveis
- Bug: ao clicar em "Iniciar Caso" de uma especialidade, o estado `isLoading` era global, desabilitando TODOS os botões simultaneamente
- Import quebrado do `EducationalDisclaimer` no meio do import de lucide-react

**Correções:**
- Expandido para **24 especialidades** (Cardiologia, Neurologia, Pneumologia, Gastroenterologia, Endocrinologia, Nefrologia, Infectologia, Hematologia, Reumatologia, Dermatologia, Psiquiatria, Ginecologia/Obstetrícia, Pediatria, Ortopedia, Urologia, Oftalmologia, Otorrinolaringologia, Cirurgia Geral, Emergência, Geriatria, Oncologia, Medicina Intensiva, Medicina de Família, Anestesiologia)
- **Loading individual por especialidade** — agora apenas o botão clicado mostra "Gerando..."
- Campo de busca para filtrar especialidades
- Import corrigido

---

## 3. Comparador de Medicamentos — Dados Validados

**Problemas identificados:**
- "Maior preço R$ 6.784,77" para Tadalafila — era real (caixa com 500 comprimidos) mas distorcia a comparação
- "Economia 100%" — cálculo incorreto
- Comparação entre apresentações de tamanhos diferentes (1 comprimido vs 500 comprimidos)

**Correções:**
- Adicionado **preço por unidade** (comprimido/ampola/mL) para comparação justa
- Cálculo de economia corrigido: compara o genérico mais barato com o referência mais barato **por unidade**
- Economia nunca mostra 100% (impossível)
- Disclaimer claro: "Preços PMC (Preço Máximo ao Consumidor) — ANVISA/CMED. Valores de referência, consulte a farmácia para preço final."
- Agrupamento por apresentação para facilitar comparação

---

## 4. Protocolos Clínicos — 30 Protocolos com Guidelines Oficiais

**Problema:** Apenas 12 protocolos, faltavam especialidades importantes. Header dizia "10 protocolos".

**Correção:** Expandido para **30 protocolos completos**, todos com:
- Referências de **guidelines oficiais** (ESC, AHA, IDSA, OMS, Ministério da Saúde, SBC, SBPT, etc.)
- Critérios diagnósticos validados
- Fluxogramas de manejo com código de cores (urgente/atenção/seguro/avaliação)
- Tratamento com doses e esquemas
- Critérios de encaminhamento
- Referências bibliográficas com DOI

### Novos Protocolos Adicionados (18):

| # | Protocolo | Categoria | Guidelines |
|---|-----------|-----------|------------|
| 13 | Fibrilação Atrial | Cardiologia | ESC 2024, SBC 2022, AHA/ACC 2023 |
| 14 | Anafilaxia | Emergência | WAO 2020, ASBAI 2022, EAACI 2021 |
| 15 | Meningite Bacteriana | Infectologia | IDSA 2017, SBI 2020, NICE 2024 |
| 16 | Hemorragia Digestiva Alta | Gastroenterologia | ESGE 2021, ACG 2021, SBAD 2020 |
| 17 | Pancreatite Aguda | Gastroenterologia | ACG 2024, IAP/APA 2024, SBAD 2021 |
| 18 | Estado de Mal Epiléptico | Neurologia | AES 2016, ILAE 2015, ABN 2021 |
| 19 | Pré-eclâmpsia e Eclâmpsia | Ginecologia/Obstetrícia | ACOG 2020, FEBRASGO 2022, ISSHP 2021 |
| 20 | Dengue | Infectologia | MS Brasil 2024, OMS 2023, OPAS 2024 |
| 21 | Cirrose Hepática Descompensada | Gastroenterologia | EASL 2023, AASLD 2023, SBH 2021 |
| 22 | Infecção do Trato Urinário | Infectologia | IDSA 2022, EAU 2024, SBI 2021 |
| 23 | Dor Torácica na Emergência | Emergência | ESC 2024, AHA 2021, SBC 2021 |
| 24 | Anemia Falciforme — Crise Vaso-oclusiva | Hematologia | ASH 2020, SBHH 2022, NICE 2023 |
| 25 | Intoxicação Exógena | Emergência | AACT 2023, ABRACIT 2022, Goldfrank 2023 |
| 26 | Hipotireoidismo | Endocrinologia | ATA 2014, SBEM 2023, ETA 2023 |
| 27 | Depressão Maior | Psiquiatria | APA 2023, ABP 2022, NICE 2022 |
| 28 | Doença Renal Crônica | Nefrologia | KDIGO 2024, SBN 2023, NICE 2021 |
| 29 | COVID-19 Grave | Pneumologia | NIH 2024, MS Brasil 2024, WHO 2024 |
| 30 | Queimaduras | Cirurgia/Emergência | ABA 2023, SBCP 2022, ISBI 2023 |

### Cobertura por Especialidade:

| Especialidade | Protocolos |
|---------------|-----------|
| Cardiologia | 4 (HAS, IAM, IC, FA) |
| Emergência | 3 (Anafilaxia, Dor Torácica, Intoxicação) |
| Pneumologia | 4 (PAC, DPOC, Asma, COVID-19) |
| Infectologia | 3 (Meningite, ITU, Dengue) |
| Gastroenterologia | 3 (HDA, Pancreatite, Cirrose) |
| Neurologia | 2 (AVC, Estado de Mal Epiléptico) |
| Endocrinologia | 3 (CAD, DM2, Hipotireoidismo) |
| Nefrologia | 3 (IRA, DRC, DRC Avançada) |
| Ginecologia/Obstetrícia | 1 (Pré-eclâmpsia) |
| Hematologia | 1 (Anemia Falciforme) |
| Psiquiatria | 1 (Depressão Maior) |
| Cirurgia/Emergência | 1 (Queimaduras) |
| Pediatria | 1 (Choque Anafilático Pediátrico) |

---

## Status do Deploy

- **Código enviado ao GitHub:** ✅
- **Cloud Build trigger:** Configurado para deploy automático
- **Link de produção:** [https://medfocus-app-969630653332.southamerica-east1.run.app/](https://medfocus-app-969630653332.southamerica-east1.run.app/)
