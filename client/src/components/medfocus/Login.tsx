/**
 * MedFocus Login — Premium Split-Screen Design
 * Real backend authentication via /api/auth/register and /api/auth/login
 */
import React, { useState } from 'react';

interface AuthProps {
  onLogin: (name: string, email: string, role?: string) => void;
  onOAuthLogin?: () => void;
}

type AuthMode = 'login' | 'signup';

const HERO_BG = "https://private-us-east-1.manuscdn.com/sessionFile/IjuoZIpKtB1FShC9GQ88GW/sandbox/gZMRigkW6C4ldwaPiTYiad-img-1_1771179152000_na1fn_bWVkZm9jdXMtaGVyby1sb2dpbg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSWp1b1pJcEt0QjFGU2hDOUdRODhHVy9zYW5kYm94L2daTVJpZ2tXNkM0bGR3YVBpVFlpYWQtaW1nLTFfMTc3MTE3OTE1MjAwMF9uYTFmbl9iV1ZrWm05amRYTXRhR1Z5Ynkxc2IyZHBiZy5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=Ags3byoAxIQ2E463devHo~vCnO5tykvWiylatdoD24E~HLwpHIUtbXQDGSfVb2QqGPe8iVKBr93lwbRr6M5W1dobSftSfGSyhQw5mFqsFbyOh5sq4iBa6X43haFsIxp~AMN-AXKmR3kHdVkmM0NYuEb6aD5NJvMn1Sdln88BJfl5f~1skPP0D~iDbEpMYZSgT-RaU-fheGPaEqU~ZIp7R9uq939LQ~iSi2UlAy954Ohhr4tdTLtwayXtZJRpFN9SoQIUBn9ZVFDXJJc3bDo5j0jxIx1KfJSPKW1GV4vBdFAx3AoNu0OHxZMHwu7jlF-H23W~b-oUH8qzogUlpCkJPA__";

const Auth: React.FC<AuthProps> = ({ onLogin, onOAuthLogin }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('A senha deve ter no mínimo 6 caracteres.'); return; }
    if (password !== confirmPassword) { setError('As senhas não coincidem.'); return; }
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.toLowerCase().trim(), password, name: name.trim() || 'Estudante' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Erro ao criar conta.');
        setIsLoading(false);
        return;
      }
      // Backend set the session cookie, now call onLogin
      onLogin(data.user.name, data.user.email || data.user.openId, data.user.role);
    } catch (err) {
      setError('Erro de conexão. Tente novamente.');
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.toLowerCase().trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Erro ao fazer login.');
        setIsLoading(false);
        return;
      }
      onLogin(data.user.name, data.user.email || data.user.openId, data.user.role);
    } catch (err) {
      setError('Erro de conexão. Tente novamente.');
      setIsLoading(false);
    }
  };

  const handleGuestAccess = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ guestName: 'Convidado' }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Fallback to local guest if backend fails
        onLogin('Convidado', 'convidado@medfocus.demo');
        return;
      }
      onLogin(data.user.name, data.user.openId, data.user.role);
    } catch {
      // Fallback to local guest
      onLogin('Convidado', 'convidado@medfocus.demo');
    }
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
            <div className="relative flex justify-center text-xs"><span className="bg-background px-3 text-muted-foreground font-medium">ou continue com</span></div>
          </div>

          {onOAuthLogin && (
            <button onClick={onOAuthLogin}
              className="w-full bg-white text-gray-700 font-semibold py-3.5 rounded-xl hover:bg-gray-50 transition-all text-sm border border-gray-200 flex items-center justify-center gap-3 mb-3 shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Entrar com Google
            </button>
          )}

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
