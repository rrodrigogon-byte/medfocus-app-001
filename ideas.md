# MedFocus - Brainstorm de Design

## Contexto
Plataforma acadêmica para estudantes de medicina com Hub de Universidades, Materiais de Estudo com IA, Gestão Acadêmica, Pesquisa Global e Checklist Semanal.

---

<response>
<text>

## Idea 1: "Clinical Precision" — Swiss Medical Design

**Design Movement:** Swiss/International Typographic Style aplicado ao contexto médico-acadêmico

**Core Principles:**
- Clareza absoluta na hierarquia de informação
- Grid rígido com proporções matemáticas
- Tipografia como elemento estrutural dominante
- Monocromia com acentos cirúrgicos

**Color Philosophy:** Base em slate/zinc escuro (#0f172a) com branco puro para contraste máximo. Acento em teal (#14b8a6) representando precisão clínica e confiança. Vermelho (#ef4444) apenas para alertas críticos.

**Layout Paradigm:** Grid assimétrico com sidebar fixa à esquerda (240px), conteúdo principal em coluna larga com cards em layout masonry. Seções divididas por linhas finas horizontais.

**Signature Elements:**
- Números grandes em destaque (métricas acadêmicas)
- Ícones line-art médicos minimalistas
- Barras de progresso lineares ultra-finas

**Interaction Philosophy:** Transições instantâneas (150ms), sem bounce. Hover revela informação adicional via tooltip. Feedback tátil com micro-animações de escala.

**Animation:** Fade-in sequencial de cards (stagger 50ms). Sidebar items com slide-in sutil. Números contam de 0 ao valor real.

**Typography System:** Space Grotesk (headings, bold 700) + IBM Plex Sans (body, regular 400). Tamanhos: 48px/36px/24px/16px/14px.

</text>
<probability>0.07</probability>
</response>

<response>
<text>

## Idea 2: "Neon Anatomy" — Dark Futuristic Medical UI

**Design Movement:** Cyberpunk/Sci-fi Medical Interface — inspirado em interfaces de diagnóstico futuristas

**Core Principles:**
- Dark-first com luminescência controlada
- Dados como arte visual (gráficos são decoração)
- Camadas de profundidade com glassmorphism
- Sensação de "centro de comando" médico

**Color Philosophy:** Background em deep navy (#0a0e1a) com camadas em slate transparente. Acento principal em electric cyan (#06b6d4) evocando telas de diagnóstico. Verde neon (#22c55e) para sucesso/aprovação. Magenta (#ec4899) para urgência.

**Layout Paradigm:** Dashboard estilo cockpit com sidebar colapsável, header com breadcrumb e stats rápidos. Cards flutuantes com backdrop-blur sobre fundo escuro. Seções em grid 12 colunas com gaps generosos.

**Signature Elements:**
- Cards com borda gradiente sutil (cyan → transparent)
- Glow effects em elementos interativos
- Gráficos com linhas neon sobre fundo escuro

**Interaction Philosophy:** Hover com glow expansion. Click com pulse luminoso. Transições com ease-out suave (300ms). Elementos parecem "acender" ao interagir.

**Animation:** Cards entram com scale(0.95) → scale(1) + opacity. Sidebar icons pulsam sutilmente. Gráficos desenham-se progressivamente.

**Typography System:** Outfit (headings, semibold 600) + Inter (body, regular 400). Tracking largo em labels uppercase. Tamanhos: 40px/28px/20px/15px/12px.

</text>
<probability>0.05</probability>
</response>

<response>
<text>

## Idea 3: "Academic Warmth" — Organic Study Companion

**Design Movement:** Scandinavian Warm Minimalism — acolhedor, orgânico, focado no bem-estar do estudante

**Core Principles:**
- Tons quentes que reduzem ansiedade de estudo
- Espaçamento generoso para respiração visual
- Cantos arredondados e formas suaves
- Ilustrações hand-drawn como personalidade

**Color Philosophy:** Background em warm cream (#faf7f2) com cards em branco puro. Acento em warm indigo (#6366f1) para ações e destaques. Âmbar (#f59e0b) para conquistas e progresso. Verde sage (#84cc16) para saúde/frequência.

**Layout Paradigm:** Layout com sidebar arredondada à esquerda, conteúdo em single-column scrollável com seções bem espaçadas. Cards com padding generoso (32px) e sombras suaves difusas.

**Signature Elements:**
- Emojis médicos como ícones de seção
- Progress rings circulares (não barras)
- Badges de conquista com gradientes suaves

**Interaction Philosophy:** Transições spring (bounce sutil). Hover com elevação de sombra. Feedback positivo com confetti micro em conquistas. Tudo parece "amigável".

**Animation:** Spring animations (framer-motion) em cards. Entrada com slide-up + fade. Progress rings animam em arco. Números incrementam suavemente.

**Typography System:** Plus Jakarta Sans (headings, bold 700) + DM Sans (body, regular 400). Tamanhos: 36px/28px/20px/16px/13px. Line-height generoso (1.6 body).

</text>
<probability>0.08</probability>
</response>

---

## Decisão: Idea 1 — "Clinical Precision" (Swiss Medical Design)

Escolho a abordagem **Clinical Precision** por ser a mais adequada ao público-alvo (estudantes de medicina), transmitindo seriedade, organização e profissionalismo. A tipografia forte e o grid rígido facilitam a navegação em grandes volumes de informação acadêmica, enquanto o acento em teal traz modernidade sem infantilizar a interface.
