# Sistema de Biblioteca Acadêmica - MedFocus

## 📚 Visão Geral

O Sistema de Biblioteca Acadêmica é um módulo completo de agregação e organização de materiais acadêmicos de todas as universidades brasileiras de medicina. O sistema permite que estudantes encontrem, filtrem e acessem materiais de estudo organizados por universidade, ano, semestre, disciplina e tipo de material.

## 🎯 Objetivos

- **Centralização**: Reunir materiais de todas as universidades em um único lugar
- **Organização**: Categorizar materiais com metadados ricos (universidade, ano, semestre, disciplina)
- **Descoberta**: Facilitar a busca e descoberta de materiais relevantes
- **Qualidade**: Sistema de verificação e avaliação de materiais
- **Colaboração**: Permitir que estudantes compartilhem e contribuam com materiais

## 🏗️ Arquitetura

### Tipos de Materiais Suportados

O sistema suporta 9 tipos diferentes de materiais acadêmicos:

1. **📖 Apostila** (`apostila`) - Apostilas e guias de estudo
2. **📄 Artigo** (`artigo`) - Artigos científicos e acadêmicos
3. **📚 Livro** (`livro`) - Livros e capítulos de livros
4. **🎥 Vídeo** (`video`) - Videoaulas e palestras gravadas
5. **📊 Slides** (`slides`) - Apresentações em PowerPoint/PDF
6. **✍️ Exercício** (`exercicio`) - Listas de exercícios e problemas
7. **📝 Prova** (`prova`) - Provas anteriores e simulados
8. **📋 Resumo** (`resumo`) - Resumos e mapas mentais
9. **🔬 Pesquisa** (`pesquisa`) - Trabalhos de pesquisa e TCC

### Estrutura de Dados

#### AcademicMaterial

Cada material é representado por uma interface completa com metadados:

```typescript
interface AcademicMaterial {
  // Identificação
  id: string;
  title: string;
  description: string;
  type: MaterialType;
  
  // Contexto Universitário
  universityId: string;
  universityName: string;
  department?: string;
  course: string;
  
  // Período Acadêmico
  year: number;                // 1-6 para Medicina
  semester: Semester;          // 1 ou 2
  academicYear?: string;       // e.g., "2024"
  
  // Disciplina
  subjectId: string;
  subjectName: string;
  module?: string;
  
  // Detalhes do Conteúdo
  authors?: string[];
  professor?: string;
  fileUrl?: string;
  externalUrl?: string;
  thumbnailUrl?: string;
  pageCount?: number;
  duration?: number;           // Para vídeos (em minutos)
  
  // Metadados
  tags: string[];
  language: string;
  createdAt: string;
  updatedAt: string;
  uploadedBy?: string;
  
  // Engajamento
  downloads: number;
  views: number;
  rating?: number;             // 0-5 estrelas
  verified: boolean;           // Verificado pela instituição/admin
}
```

#### MaterialFilter

Sistema de filtros avançados:

```typescript
interface MaterialFilter {
  universityId?: string;       // Filtrar por universidade
  year?: number;              // Filtrar por ano (1-6)
  semester?: Semester;        // Filtrar por semestre (1 ou 2)
  subjectId?: string;         // Filtrar por disciplina
  type?: MaterialType;        // Filtrar por tipo de material
  searchTerm?: string;        // Busca textual
  tags?: string[];            // Filtrar por tags
  verified?: boolean;         // Apenas materiais verificados
}
```

## 🔍 Funcionalidades

### 1. Sistema de Busca

- **Busca Textual**: Pesquisa em títulos, descrições, disciplinas e tags
- **Busca em Tempo Real**: Atualização instantânea dos resultados
- **Destaque de Termos**: Visualização clara dos termos pesquisados

### 2. Filtros Avançados

#### Filtro por Universidade
- Lista completa de universidades brasileiras
- Filtro dropdown com nome e estado
- Visualização de quantidade de materiais por universidade

#### Filtro por Ano Acadêmico
- Seleção de 1º ao 6º ano
- Organização por currículo progressivo
- Estatísticas por ano

#### Filtro por Semestre
- 1º ou 2º semestre
- Ambos os semestres (padrão)
- Sincronização com calendário acadêmico

#### Filtro por Tipo de Material
- Filtros visuais com ícones
- Códigos de cor por tipo
- Contador de materiais por tipo

#### Filtro por Disciplina
- Lista de disciplinas do curso de medicina
- Organização por especialidade
- Filtro hierárquico por módulo

### 3. Ordenação

Três modos de ordenação:

1. **Mais Recentes**: Baseado na data de atualização
2. **Mais Populares**: Baseado no número de downloads
3. **Melhor Avaliados**: Baseado na média de avaliações

### 4. Modos de Visualização

#### Grid View (Grade)
- Cards visuais com thumbnails
- Informações resumidas
- Ideal para navegação exploratória
- Layout responsivo (1-3 colunas)

#### List View (Lista)
- Formato compacto e denso
- Mais informações visíveis
- Ideal para comparação rápida
- Melhor para grandes volumes

### 5. Sistema de Avaliação

- **Ratings**: Avaliação de 0 a 5 estrelas
- **Verificação**: Badge de verificação oficial
- **Downloads**: Contador de downloads
- **Visualizações**: Contador de views

### 6. Estatísticas

Dashboard com métricas globais:
- Total de materiais na biblioteca
- Número de universidades contribuindo
- Número de disciplinas cobertas
- Materiais verificados

## 🎨 Design System

### Código de Cores por Tipo

Cada tipo de material possui uma cor específica para fácil identificação:

```typescript
const typeColors = {
  apostila: 'blue',     // Azul
  video: 'purple',      // Roxo
  resumo: 'emerald',    // Verde esmeralda
  prova: 'orange',      // Laranja
  pesquisa: 'rose',     // Rosa
  slides: 'cyan',       // Ciano
  artigo: 'amber',      // Âmbar
  livro: 'indigo',      // Índigo
  exercicio: 'teal'     // Teal
};
```

### Componentes UI

- **Cards**: Design clean com hover effects
- **Badges**: Identificação visual de tipos e verificação
- **Filters**: Dropdowns e pills interativos
- **Search Bar**: Input com ícone e feedback visual
- **Stats Cards**: Cards de estatísticas no hero section

## 🚀 Como Usar

### Para Estudantes

1. **Acessar a Biblioteca**
   - Clique em "Biblioteca" no menu lateral
   - Visualize o dashboard com estatísticas

2. **Buscar Materiais**
   - Use a barra de busca para pesquisa textual
   - Ou navegue pelos filtros

3. **Filtrar Resultados**
   - Selecione sua universidade
   - Escolha o ano e semestre
   - Filtre por tipo de material
   - Refine por disciplina

4. **Visualizar Materiais**
   - Alterne entre grade e lista
   - Ordene por relevância, popularidade ou avaliação
   - Clique nos cards para mais detalhes

5. **Download/Acesso**
   - Clique no material desejado
   - Faça download ou acesse o link externo
   - Avalie o material após usar

### Para Administradores

1. **Adicionar Materiais** (futuro)
   - Upload de arquivos
   - Preenchimento de metadados
   - Sistema de tags

2. **Verificar Materiais**
   - Revisão de conteúdo
   - Aprovação oficial
   - Badge de verificação

3. **Moderar**
   - Remover materiais inadequados
   - Editar metadados
   - Gerenciar denúncias

## 📊 Casos de Uso

### Caso 1: Estudante procurando provas antigas

```
1. Acessa a Biblioteca
2. Seleciona sua universidade (ex: USP)
3. Filtra por tipo "Prova"
4. Seleciona o ano (ex: 2º ano)
5. Escolhe a disciplina (ex: Anatomia)
6. Encontra provas dos últimos 3 anos
7. Faz download e estuda
```

### Caso 2: Estudante buscando videoaulas

```
1. Acessa a Biblioteca
2. Clica no filtro "Vídeos"
3. Busca por "fisiologia renal"
4. Ordena por "Melhor Avaliados"
5. Encontra série completa de videoaulas
6. Assiste e avalia o conteúdo
```

### Caso 3: Estudante comparando materiais de diferentes universidades

```
1. Acessa a Biblioteca
2. Busca "farmacologia cardiovascular"
3. Não filtra por universidade (vê todas)
4. Compara apostilas de USP, UNICAMP, UFRJ
5. Identifica abordagens diferentes
6. Baixa os melhores de cada universidade
```

## 🔮 Roadmap Futuro

### Fase 2: Upload de Materiais
- [ ] Sistema de upload de arquivos
- [ ] Validação de formato e tamanho
- [ ] Preview de documentos
- [ ] Armazenamento em cloud

### Fase 3: Sistema de Contribuição
- [ ] Usuários podem adicionar materiais
- [ ] Sistema de revisão por pares
- [ ] Gamificação (pontos, badges)
- [ ] Ranking de contribuidores

### Fase 4: Recursos Sociais
- [ ] Comentários em materiais
- [ ] Avaliações detalhadas
- [ ] Compartilhamento social
- [ ] Coleções personalizadas

### Fase 5: IA e Recomendações
- [ ] Recomendações personalizadas
- [ ] Materiais similares
- [ ] Sugestões baseadas em perfil
- [ ] Análise de qualidade por IA

### Fase 6: Integrações
- [ ] Integração com Google Drive
- [ ] Integração com Dropbox
- [ ] OCR para documentos escaneados
- [ ] Conversão de formatos

## 🛠️ Tecnologias Utilizadas

- **React 19**: Framework UI
- **TypeScript**: Type safety
- **TailwindCSS**: Styling
- **Lucide React**: Ícones
- **Framer Motion**: Animações (futuro)

## 📝 Convenções de Código

### Nomenclatura
- Componentes: PascalCase (ex: `AcademicLibrary`)
- Funções: camelCase (ex: `getTypeColor`)
- Tipos: PascalCase (ex: `MaterialType`)
- Constantes: UPPER_CASE (ex: `MATERIAL_TYPES`)

### Estrutura de Arquivos
```
client/src/
├── components/
│   └── medfocus/
│       ├── AcademicLibrary.tsx    # Componente principal
│       └── MaterialCard.tsx        # Card de material (futuro)
├── types.ts                        # Tipos globais
└── services/
    └── materialsApi.ts            # API de materiais (futuro)
```

## 🤝 Contribuindo

Para contribuir com o sistema de biblioteca:

1. Entenda a estrutura de dados
2. Siga as convenções de código
3. Adicione testes para novas features
4. Documente as alterações
5. Faça PR com descrição detalhada

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no repositório
- Entre em contato com a equipe de desenvolvimento
- Consulte a documentação técnica

---

**Versão**: 1.0.0  
**Última Atualização**: 15 de Fevereiro de 2026  
**Desenvolvido por**: Equipe MedFocus
