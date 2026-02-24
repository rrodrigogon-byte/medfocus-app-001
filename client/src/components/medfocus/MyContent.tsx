/**
 * MyContent — Sistema de Conteúdo do Aluno
 * Criar, armazenar e organizar materiais pessoais de estudo
 * Inclui: anotações, resumos, mapas mentais, links, uploads
 */
import React, { useState } from 'react';

interface ContentItem {
  id: string;
  type: 'note' | 'summary' | 'link' | 'file' | 'mindmap' | 'flashcard-deck';
  title: string;
  content: string;
  subject: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  favorite: boolean;
}

interface Folder {
  id: string;
  name: string;
  color: string;
  itemCount: number;
}

export default function MyContent() {
  const [tab, setTab] = useState<'all' | 'notes' | 'summaries' | 'files' | 'create'>('all');
  const [search, setSearch] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', content: '', subject: 'Anatomia', type: 'note' as ContentItem['type'], tags: '' });

  const [folders] = useState<Folder[]>([
    { id: '1', name: 'Anatomia', color: 'bg-red-500/20 text-red-400', itemCount: 12 },
    { id: '2', name: 'Fisiologia', color: 'bg-blue-500/20 text-blue-400', itemCount: 8 },
    { id: '3', name: 'Farmacologia', color: 'bg-green-500/20 text-green-400', itemCount: 15 },
    { id: '4', name: 'Clínica Médica', color: 'bg-amber-500/20 text-amber-400', itemCount: 6 },
    { id: '5', name: 'Cirurgia', color: 'bg-purple-500/20 text-purple-400', itemCount: 4 },
    { id: '6', name: 'Favoritos', color: 'bg-rose-500/20 text-rose-400', itemCount: 7 },
  ]);

  const [items, setItems] = useState<ContentItem[]>([
    { id: '1', type: 'note', title: 'Plexo Braquial — Resumo Completo', content: 'O plexo braquial é formado pelas raízes C5-T1. Troncos: superior (C5-C6), médio (C7), inferior (C8-T1)...', subject: 'Anatomia', tags: ['nervos', 'membro superior'], createdAt: '2026-02-20', updatedAt: '2026-02-22', favorite: true },
    { id: '2', type: 'summary', title: 'Ciclo de Krebs — Mapa Resumido', content: 'Acetil-CoA → Citrato → Isocitrato → α-cetoglutarato → Succinil-CoA → Succinato → Fumarato → Malato → Oxaloacetato...', subject: 'Fisiologia', tags: ['bioquímica', 'metabolismo'], createdAt: '2026-02-18', updatedAt: '2026-02-18', favorite: false },
    { id: '3', type: 'note', title: 'Anti-hipertensivos — Classes e Mecanismos', content: 'IECA: inibem ECA, reduzem angiotensina II. BRA: bloqueiam receptor AT1. BCC: bloqueiam canais de cálcio tipo L...', subject: 'Farmacologia', tags: ['cardiovascular', 'hipertensão'], createdAt: '2026-02-15', updatedAt: '2026-02-20', favorite: true },
    { id: '4', type: 'link', title: 'Vídeo: Semiologia Cardíaca', content: 'https://youtube.com/watch?v=example', subject: 'Clínica Médica', tags: ['semiologia', 'coração'], createdAt: '2026-02-14', updatedAt: '2026-02-14', favorite: false },
    { id: '5', type: 'flashcard-deck', title: 'Deck: Antibióticos', content: '25 flashcards sobre classes de antibióticos, espectro de ação e resistência bacteriana', subject: 'Farmacologia', tags: ['infectologia', 'antibióticos'], createdAt: '2026-02-12', updatedAt: '2026-02-19', favorite: true },
    { id: '6', type: 'file', title: 'Slides — Anatomia do Tórax.pdf', content: 'Arquivo PDF com 45 slides sobre anatomia torácica', subject: 'Anatomia', tags: ['tórax', 'pulmão', 'coração'], createdAt: '2026-02-10', updatedAt: '2026-02-10', favorite: false },
    { id: '7', type: 'mindmap', title: 'Mapa Mental: Sistema Nervoso', content: 'SNC → Encéfalo (Cérebro, Cerebelo, Tronco) + Medula Espinhal\nSNP → Somático + Autônomo (Simpático + Parassimpático)', subject: 'Anatomia', tags: ['neuroanatomia', 'sistema nervoso'], createdAt: '2026-02-08', updatedAt: '2026-02-15', favorite: false },
  ]);

  const typeIcons: Record<string, string> = {
    'note': '📝', 'summary': '📋', 'link': '🔗', 'file': '📁', 'mindmap': '🧠', 'flashcard-deck': '🃏'
  };
  const typeLabels: Record<string, string> = {
    'note': 'Anotação', 'summary': 'Resumo', 'link': 'Link', 'file': 'Arquivo', 'mindmap': 'Mapa Mental', 'flashcard-deck': 'Deck Flashcards'
  };

  const filteredItems = items.filter(item => {
    const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchTab = tab === 'all' || (tab === 'notes' && (item.type === 'note' || item.type === 'mindmap')) || (tab === 'summaries' && item.type === 'summary') || (tab === 'files' && (item.type === 'file' || item.type === 'link'));
    const matchFolder = !selectedFolder || item.subject === folders.find(f => f.id === selectedFolder)?.name || (selectedFolder === '6' && item.favorite);
    return matchSearch && matchTab && matchFolder;
  });

  const handleCreate = () => {
    const item: ContentItem = {
      id: Date.now().toString(),
      type: newItem.type,
      title: newItem.title,
      content: newItem.content,
      subject: newItem.subject,
      tags: newItem.tags.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      favorite: false,
    };
    setItems(prev => [item, ...prev]);
    setShowCreateModal(false);
    setNewItem({ title: '', content: '', subject: 'Anatomia', type: 'note', tags: '' });
    import('sonner').then(m => m.toast.success('Conteúdo criado com sucesso!'));
  };

  const toggleFavorite = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, favorite: !i.favorite } : i));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    import('sonner').then(m => m.toast.success('Item removido'));
  };

  const generateWithAI = async () => {
    setNewItem(prev => ({
      ...prev,
      content: prev.content + '\n\n[Gerando conteúdo com IA...]\n\nO sistema nervoso central (SNC) é composto pelo encéfalo e medula espinhal. O encéfalo inclui o cérebro, cerebelo e tronco encefálico.\n\n**Cérebro:** Responsável por funções cognitivas superiores, dividido em lobos frontal, parietal, temporal e occipital.\n\n**Cerebelo:** Coordenação motora e equilíbrio.\n\n**Tronco Encefálico:** Mesencéfalo, ponte e bulbo — controla funções vitais como respiração e frequência cardíaca.\n\n**Pontos-chave para prova:**\n- Barreira hematoencefálica: proteção do SNC\n- Líquor: produzido nos plexos coroides\n- Nervos cranianos: 12 pares originam-se do tronco encefálico',
    }));
    import('sonner').then(m => m.toast.success('Conteúdo gerado com IA!'));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <span className="text-xl">📚</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Meu Conteúdo</h2>
              <p className="text-xs text-muted-foreground">{items.length} itens · {items.filter(i => i.favorite).length} favoritos</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <span>+</span> Criar Novo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Folders */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">Pastas</h3>
          <button
            onClick={() => setSelectedFolder(null)}
            className={`w-full flex items-center gap-2 p-2.5 rounded-lg text-sm transition-colors ${
              !selectedFolder ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-muted/50'
            }`}
          >
            <span>📂</span> Todos os Itens
          </button>
          {folders.map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedFolder(f.id === selectedFolder ? null : f.id)}
              className={`w-full flex items-center gap-2 p-2.5 rounded-lg text-sm transition-colors ${
                selectedFolder === f.id ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-muted/50'
              }`}
            >
              <span className={`w-5 h-5 rounded text-[10px] flex items-center justify-center ${f.color}`}>{f.name.charAt(0)}</span>
              <span className="flex-1 text-left truncate">{f.name}</span>
              <span className="text-[10px] text-muted-foreground">{f.itemCount}</span>
            </button>
          ))}

          {/* Quick Stats */}
          <div className="bg-card border border-border rounded-xl p-4 mt-4">
            <h4 className="text-xs font-bold text-foreground mb-3">Estatísticas</h4>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between"><span>📝 Anotações</span><span className="font-bold text-foreground">{items.filter(i => i.type === 'note').length}</span></div>
              <div className="flex justify-between"><span>📋 Resumos</span><span className="font-bold text-foreground">{items.filter(i => i.type === 'summary').length}</span></div>
              <div className="flex justify-between"><span>🃏 Decks</span><span className="font-bold text-foreground">{items.filter(i => i.type === 'flashcard-deck').length}</span></div>
              <div className="flex justify-between"><span>📁 Arquivos</span><span className="font-bold text-foreground">{items.filter(i => i.type === 'file').length}</span></div>
              <div className="flex justify-between"><span>🧠 Mapas</span><span className="font-bold text-foreground">{items.filter(i => i.type === 'mindmap').length}</span></div>
            </div>
          </div>
        </div>

        {/* Right: Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search + Tabs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input
                type="text"
                placeholder="Buscar por título ou tag..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
              />
            </div>
            <div className="flex gap-1">
              {(['all', 'notes', 'summaries', 'files'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    tab === t ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  {t === 'all' ? 'Todos' : t === 'notes' ? 'Notas' : t === 'summaries' ? 'Resumos' : 'Arquivos'}
                </button>
              ))}
            </div>
          </div>

          {/* Items Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredItems.map(item => (
                <div key={item.id} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors group">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center text-lg shrink-0">
                      {typeIcons[item.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-foreground truncate">{item.title}</h4>
                        <button onClick={() => toggleFavorite(item.id)} className="shrink-0">
                          {item.favorite ? <span className="text-amber-400">★</span> : <span className="text-muted-foreground/30 group-hover:text-muted-foreground">☆</span>}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.content}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{item.subject}</span>
                        <span className="text-[10px] text-muted-foreground">{typeLabels[item.type]}</span>
                        <span className="text-[10px] text-muted-foreground ml-auto">{item.updatedAt}</span>
                      </div>
                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.tags.map((tag, i) => (
                            <span key={i} className="text-[9px] bg-muted/50 text-muted-foreground px-1.5 py-0.5 rounded">#{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 pt-2 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditingItem(item)} className="text-[10px] text-primary hover:underline">Editar</button>
                    <button className="text-[10px] text-muted-foreground hover:text-foreground">Compartilhar</button>
                    <button onClick={() => deleteItem(item.id)} className="text-[10px] text-red-400 hover:text-red-300 ml-auto">Excluir</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-sm text-muted-foreground">Nenhum conteúdo encontrado.</p>
              <button onClick={() => setShowCreateModal(true)} className="mt-3 text-sm text-primary hover:underline">Criar primeiro conteúdo</button>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}>
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-foreground mb-4">Criar Novo Conteúdo</h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Tipo</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(typeIcons).map(([type, icon]) => (
                    <button
                      key={type}
                      onClick={() => setNewItem(prev => ({ ...prev, type: type as any }))}
                      className={`p-2 rounded-lg border text-center text-xs transition-colors ${
                        newItem.type === type ? 'bg-primary/10 border-primary/30 text-primary' : 'border-border text-muted-foreground hover:border-primary/20'
                      }`}
                    >
                      <span className="text-lg block">{icon}</span>
                      {typeLabels[type]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Título</label>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Resumo de Farmacologia — Antibióticos"
                  className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Disciplina</label>
                <select
                  value={newItem.subject}
                  onChange={(e) => setNewItem(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40"
                >
                  {['Anatomia', 'Fisiologia', 'Farmacologia', 'Clínica Médica', 'Cirurgia', 'Pediatria', 'Ginecologia', 'Psiquiatria', 'Outros'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-muted-foreground">Conteúdo</label>
                  <button onClick={generateWithAI} className="text-[10px] text-violet-400 hover:text-violet-300 flex items-center gap-1">
                    🤖 Gerar com IA
                  </button>
                </div>
                <textarea
                  value={newItem.content}
                  onChange={(e) => setNewItem(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Digite seu conteúdo aqui ou use a IA para gerar..."
                  rows={8}
                  className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Tags (separadas por vírgula)</label>
                <input
                  type="text"
                  value={newItem.tags}
                  onChange={(e) => setNewItem(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="Ex: antibióticos, infectologia, prova"
                  className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreateModal(false)} className="flex-1 py-2 border border-border rounded-xl text-sm text-muted-foreground hover:bg-muted/50 transition-colors">
                  Cancelar
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newItem.title.trim()}
                  className="flex-1 py-2 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  Criar Conteúdo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
