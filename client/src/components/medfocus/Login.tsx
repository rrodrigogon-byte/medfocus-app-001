/**
 * MedFocus Login — Premium Split-Screen Design
 * Font: Outfit (display), Plus Jakarta Sans (body)
 * Palette: Deep navy sidebar + clean white form
 */
import React, { useState } from 'react';

interface AuthProps {
  onLogin: (name: string, email: string) => void;
}

type AuthMode = 'login' | 'signup';

const HERO_BG = "https://private-us-east-1.manuscdn.com/sessionFile/IjuoZIpKtB1FShC9GQ88GW/sandbox/gZMRigkW6C4ldwaPiTYiad-img-1_1771179152000_na1fn_bWVkZm9jdXMtaGVyby1sb2dpbg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSWp1b1pJcEt0QjFGU2hDOUdRODhHVy9zYW5kYm94L2daTVJpZ2tXNkM0bGR3YVBpVFlpYWQtaW1nLTFfMTc3MTE3OTE1MjAwMF9uYTFmbl9iV1ZrWm05amRYTXRhR1Z5Ynkxc2IyZHBiZy5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=Ags3byoAxIQ2E463devHo~vCnO5tykvWiylatdoD24E~HLwpHIUtbXQDGSfVb2QqGPe8iVKBr93lwbRr6M5W1dobSftSfGSyhQw5mFqsFbyOh5sq4iBa6X43haFsIxp~AMN-AXKmR3kHdVkmM0NYuEb6aD5NJvMn1Sdln88BJfl5f~1skPP0D~iDbEpMYZSgT-RaU-fheGPaEqU~ZIp7R9uq939LQ~iSi2UlAy954Ohhr4tdTLtwayXtZJRpFN9SoQIUBn9ZVFDXJJc3bDo5j0jxIx1KfJSPKW1GV4vBdFAx3AoNu0OHxZMHwu7jlF-H23W~b-oUH8qzogUlpCkJPA__";

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getUsers = () => JSON.parse(localStorage.getItem('medfocus_db_users') || '{}');
  const saveUsers = (users: any) => localStorage.setItem('medfocus_db_users', JSON.stringify(users));

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('As senhas não coincidem.'); return; }
    const users = getUsers();
    const normalizedEmail = email.toLowerCase().trim();
    if (users[normalizedEmail]) { setError('Este e-mail já está cadastrado.'); return; }
    setIsLoading(true);
    const userData = { name: name.trim() || 'Doutor(a)', password };
    users[normalizedEmail] = userData;
    saveUsers(users);
    onLogin(userData.name, normalizedEmail);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const users = getUsers();
    const normalizedEmail = email.toLowerCase().trim();
    const user = users[normalizedEmail];
    if (!user) { setError('E-mail não cadastrado.'); return; }
    if (user.password !== password) { setError('Senha incorreta.'); return; }
    setIsLoading(true);
    onLogin(user.name, normalizedEmail);
  };

  const handleGuestAccess = () => {
    setIsLoading(true);
    onLogin('Convidado', 'convidado@medfocus.demo');
  };

  const inputClass = "w-full px-4 py-3.5 bg-muted/50 border border-border rounded-xl outline-none transition-all text-foreground font-medium placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm";
  const labelClass = "block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2";

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel — Hero Visual */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        <img src={HERO_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c1829]/90 via-[#0f2035]/80 to-[#0d3b4a]/70" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-teal-300"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </div>
            <span className="text-white/90 font-display font-bold text-lg tracking-tight">MedFocus</span>
          </div>

          <div className="max-w-lg">
            <h1 className="text-5xl font-display font-extrabold text-white leading-[1.1] tracking-tight mb-6">
              Domine a Medicina<br/>
              <span className="text-teal-300">com Clareza.</span>
            </h1>
            <p className="text-white/60 text-base leading-relaxed font-medium max-w-md">
              Organize seu curso, estude com métodos científicos comprovados e acompanhe seu progresso em tempo real. Tudo em uma plataforma feita por e para estudantes de medicina.
            </p>

            <div className="mt-10 flex items-center gap-8">
              <div className="text-center">
                <p className="text-3xl font-display font-extrabold text-teal-300">6+</p>
                <p className="text-white/40 text-xs font-semibold mt-1">Universidades</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <p className="text-3xl font-display font-extrabold text-teal-300">12</p>
                <p className="text-white/40 text-xs font-semibold mt-1">Semestres</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <p className="text-3xl font-display font-extrabold text-teal-300">IA</p>
                <p className="text-white/40 text-xs font-semibold mt-1">MedGenie</p>
              </div>
            </div>
          </div>

          <p className="text-white/20 text-xs font-medium">
            MedFocus v3.0 — Plataforma Acadêmica Inteligente
          </p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[420px] animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </div>
            <span className="font-display font-bold text-xl text-foreground tracking-tight">MedFocus</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-display font-extrabold text-foreground tracking-tight">
              {mode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
            </h2>
            <p className="text-muted-foreground text-sm mt-2 font-medium">
              {mode === 'login' ? 'Acesse sua plataforma de estudos.' : 'Comece sua jornada acadêmica agora.'}
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold rounded-xl flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className={labelClass}>Nome Completo</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Dr. Roberto Silva" />
              </div>
            )}
            <div>
              <label className={labelClass}>E-mail</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="seu@email.com" />
            </div>
            <div>
              <label className={labelClass}>Senha</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="Mínimo 6 caracteres" />
            </div>
            {mode === 'signup' && (
              <div>
                <label className={labelClass}>Confirmar Senha</label>
                <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} placeholder="Repita a senha" />
              </div>
            )}

            <button type="submit" disabled={isLoading}
              className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 text-sm mt-2 glow-teal">
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Acessando...
                </span>
              ) : (mode === 'login' ? 'Entrar na Plataforma' : 'Criar Minha Conta')}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-background px-3 text-muted-foreground font-medium">ou</span></div>
          </div>

          <button onClick={handleGuestAccess}
            className="w-full bg-secondary text-secondary-foreground font-semibold py-3.5 rounded-xl hover:bg-accent transition-all text-sm border border-border">
            Explorar como Convidado
          </button>

          <p className="text-center text-xs text-muted-foreground mt-8 font-medium">
            {mode === 'login' ? 'Novo na plataforma?' : 'Já possui conta?'}
            <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
              className="ml-1.5 text-primary font-bold hover:underline">
              {mode === 'login' ? 'Criar conta gratuita' : 'Fazer login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
