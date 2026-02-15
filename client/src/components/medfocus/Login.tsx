
import React, { useState } from 'react';

interface AuthProps {
  onLogin: (name: string, email: string) => void;
}

type AuthMode = 'login' | 'signup';

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Simulação de Banco de Dados Local
  const getUsers = () => JSON.parse(localStorage.getItem('medfocus_db_users') || '{}');
  const saveUsers = (users: any) => localStorage.setItem('medfocus_db_users', JSON.stringify(users));

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    const users = getUsers();
    const normalizedEmail = email.toLowerCase().trim();
    
    if (users[normalizedEmail]) {
      setError('Este e-mail já está cadastrado.');
      return;
    }

    setIsLoading(true);
    // Processamento imediato para melhor UX
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

    if (!user) {
      setError('E-mail não cadastrado. Crie uma conta ao lado.');
      return;
    }

    if (user.password !== password) {
      setError('Senha incorreta.');
      return;
    }

    setIsLoading(true);
    onLogin(user.name, normalizedEmail);
  };

  const handleGuestAccess = () => {
    setIsLoading(true);
    onLogin('Convidado', 'convidado@medfocus.demo');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="mb-10 text-center">
          <div className="w-20 h-20 bg-indigo-600 text-white rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200 dark:shadow-none rotate-3 hover:rotate-0 transition-transform duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </div>
          <h1 className="text-3xl font-black text-black dark:text-white tracking-tighter">
            MedFocus
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold text-sm">
            {mode === 'login' ? 'Bem-vindo de volta, Doutor.' : 'Inicie sua jornada acadêmica.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-black rounded-2xl animate-bounce">
            {error}
          </div>
        )}

        <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-5">
          {mode === 'signup' && (
            <div className="group">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">Nome Completo</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 dark:focus:border-indigo-600 rounded-2xl outline-none transition-all text-black dark:text-white font-bold"
                placeholder="Ex: Dr. Roberto Silva"
              />
            </div>
          )}
          
          <div className="group">
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">E-mail</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 dark:focus:border-indigo-600 rounded-2xl outline-none transition-all text-black dark:text-white font-bold"
              placeholder="seu@email.com"
            />
          </div>

          <div className="group">
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">Senha</label>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 dark:focus:border-indigo-600 rounded-2xl outline-none transition-all text-black dark:text-white font-bold"
              placeholder="••••••••"
            />
          </div>

          {mode === 'signup' && (
            <div className="group">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">Confirmar Senha</label>
              <input 
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 dark:focus:border-indigo-600 rounded-2xl outline-none transition-all text-black dark:text-white font-bold"
                placeholder="••••••••"
              />
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none active:scale-[0.98] disabled:opacity-50 text-sm uppercase tracking-widest"
          >
            {isLoading ? 'Acessando...' : (mode === 'login' ? 'Entrar Agora' : 'Criar Minha Agenda')}
          </button>
        </form>

        <div className="mt-6">
          <button 
            onClick={handleGuestAccess}
            className="w-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black py-4 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-xs uppercase tracking-widest"
          >
            Acesso Rápido (Convidado)
          </button>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
            {mode === 'login' ? 'Novo na plataforma?' : 'Já possui cadastro?'}
            <button 
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError('');
              }}
              className="ml-2 text-indigo-600 dark:text-indigo-400 font-black hover:underline uppercase tracking-tighter"
            >
              {mode === 'login' ? 'Criar conta gratuita' : 'Ir para o login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
