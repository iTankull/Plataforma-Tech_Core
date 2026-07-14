import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Mail, ShieldCheck, AlertCircle, Sparkles, Chrome, Github, Apple, Lock } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: UserType) => void;
}

const AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
];

export default function AuthModal({ onClose, onLogin }: AuthModalProps): React.JSX.Element {
  // Defaulting isRegister to false so that the default view is "Login"
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(AVATARS[0]);
  const [balance, setBalance] = useState<number>(10000); // Default R$ 10.000,00 fictional money
  const [error, setError] = useState<string>('');

  const handleQuickLogin = (demoType: 'dev' | 'photographer' | 'gamer') => {
    let demoUser: UserType;
    if (demoType === 'dev') {
      demoUser = {
        id: 'u-dev',
        name: 'Guilherme Dev',
        email: 'guilherme.dev@techmarket.com',
        avatar: AVATARS[2],
        balance: 15000.00,
      };
    } else if (demoType === 'photographer') {
      demoUser = {
        id: 'u-photo',
        name: 'Beatriz Fotos',
        email: 'beatriz.foto@techmarket.com',
        avatar: AVATARS[0],
        balance: 25000.00,
      };
    } else {
      demoUser = {
        id: 'u-gamer',
        name: 'Alex Pro Gamer',
        email: 'alex.gamer@techmarket.com',
        avatar: AVATARS[1],
        balance: 8000.00,
      };
    }
    onLogin(demoUser);
    onClose();
  };

  const handleSocialLogin = (platform: string) => {
    // Generate an instant simulated user representing social login
    const socialUser: UserType = {
      id: `u-${platform.toLowerCase()}-${Date.now()}`,
      name: `Usuário ${platform}`,
      email: `${platform.toLowerCase()}_user@example.com`,
      avatar: platform === 'Google' ? AVATARS[3] : platform === 'GitHub' ? AVATARS[2] : AVATARS[1],
      balance: 10000.00, // Simulated initial balance
    };
    onLogin(socialUser);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Por favor, digite um e-mail válido.');
      return;
    }

    if (!password.trim() || password.length < 6) {
      setError('Por favor, insira uma senha com pelo menos 6 caracteres.');
      return;
    }

    if (isRegister && !name.trim()) {
      setError('Por favor, insira o seu nome.');
      return;
    }

    const newUser: UserType = {
      id: `u-${Date.now()}`,
      name: isRegister ? name : email.split('@')[0],
      email: email,
      avatar: selectedAvatar,
      balance: balance > 0 ? balance : 5000,
    };

    onLogin(newUser);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="auth-setup-modal">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-xs"
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative bg-bg-main w-full max-w-md rounded-none border-2 border-border-main p-6 md:p-8 z-50 text-text-main"
        >
          {/* Close button */}
          <button
            id="btn-close-auth-modal"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-none bg-text-main text-bg-main hover:bg-[#FF3E00] hover:text-white transition-all duration-200 border-2 border-border-main"
          >
            <X className="w-4 h-4 font-bold" />
          </button>

          {/* Icon Header */}
          <div className="flex justify-center mb-5">
            <div className="p-3 bg-text-main text-bg-main rounded-none border-2 border-border-main">
              <ShieldCheck className="w-8 h-8 text-[#FF3E00]" />
            </div>
          </div>

          <h3 className="text-2xl font-black font-sans text-center text-text-main tracking-tighter uppercase mb-2">
            {isRegister ? 'Criar Conta de Teste' : 'Acessar Conta'}
          </h3>
          <p className="text-text-muted text-xs text-center mb-6">
            {isRegister 
              ? 'Crie um perfil fictício para favoritar itens, simular compras e registrar avaliações.'
              : 'Acesse sua conta ou utilize nossa conexão rápida de teste para começar.'}
          </p>

          {/* Quick Demo Account Selector */}
          <div className="bg-bg-nested rounded-none p-4 border border-border-subtle mb-5">
            <span className="text-[10px] font-black text-[#FF3E00] uppercase tracking-widest block mb-3 text-center flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              CONEXÃO INSTANTÂNEA DE TESTE
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                id="quick-demo-dev"
                type="button"
                onClick={() => handleQuickLogin('dev')}
                className="p-2 bg-bg-card hover:bg-[#FF3E00] hover:text-white border border-border-subtle rounded-none text-center transition-all duration-200 active:scale-95 flex flex-col items-center gap-1.5 cursor-pointer"
              >
                <img src={AVATARS[2]} alt="Dev" className="w-8 h-8 rounded-none object-cover border border-border-very-subtle" />
                <span className="text-[9px] font-black tracking-tight uppercase truncate w-full">Dev</span>
              </button>
              <button
                id="quick-demo-photographer"
                type="button"
                onClick={() => handleQuickLogin('photographer')}
                className="p-2 bg-bg-card hover:bg-[#FF3E00] hover:text-white border border-border-subtle rounded-none text-center transition-all duration-200 active:scale-95 flex flex-col items-center gap-1.5 cursor-pointer"
              >
                <img src={AVATARS[0]} alt="Photographer" className="w-8 h-8 rounded-none object-cover border border-border-very-subtle" />
                <span className="text-[9px] font-black tracking-tight uppercase truncate w-full">Fotos</span>
              </button>
              <button
                id="quick-demo-gamer"
                type="button"
                onClick={() => handleQuickLogin('gamer')}
                className="p-2 bg-bg-card hover:bg-[#FF3E00] hover:text-white border border-border-subtle rounded-none text-center transition-all duration-200 active:scale-95 flex flex-col items-center gap-1.5 cursor-pointer"
              >
                <img src={AVATARS[1]} alt="Gamer" className="w-8 h-8 rounded-none object-cover border border-border-very-subtle" />
                <span className="text-[9px] font-black tracking-tight uppercase truncate w-full">Gamer</span>
              </button>
            </div>
          </div>

          {/* Social Logins */}
          <div className="space-y-2 mb-5">
            <span className="text-[10px] font-black text-text-dim uppercase tracking-widest block mb-2 text-center">
              ENTRAR COM REDE SOCIAL
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                id="social-login-google"
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="py-2 px-1 bg-bg-card hover:bg-[#FF3E00] hover:text-white border border-border-subtle text-text-main hover:border-[#FF3E00] rounded-none flex items-center justify-center gap-1.5 font-black transition-all duration-150 active:scale-95 text-[9px] uppercase tracking-wider cursor-pointer"
              >
                <Chrome className="w-3.5 h-3.5" />
                <span>Google</span>
              </button>
              <button
                id="social-login-github"
                type="button"
                onClick={() => handleSocialLogin('GitHub')}
                className="py-2 px-1 bg-bg-card hover:bg-[#FF3E00] hover:text-white border border-border-subtle text-text-main hover:border-[#FF3E00] rounded-none flex items-center justify-center gap-1.5 font-black transition-all duration-150 active:scale-95 text-[9px] uppercase tracking-wider cursor-pointer"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </button>
              <button
                id="social-login-apple"
                type="button"
                onClick={() => handleSocialLogin('Apple')}
                className="py-2 px-1 bg-bg-card hover:bg-[#FF3E00] hover:text-white border border-border-subtle text-text-main hover:border-[#FF3E00] rounded-none flex items-center justify-center gap-1.5 font-black transition-all duration-150 active:scale-95 text-[9px] uppercase tracking-wider cursor-pointer"
              >
                <Apple className="w-3.5 h-3.5" />
                <span>Apple</span>
              </button>
            </div>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-border-subtle"></div>
            <span className="flex-shrink mx-3 text-text-dim text-[9px] font-black uppercase tracking-widest">OU USE DADOS INDIVIDUAIS</span>
            <div className="flex-grow border-t border-border-subtle"></div>
          </div>

          {/* Manual Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mt-3">
            {isRegister && (
              <div>
                <label className="text-[10px] font-black tracking-widest text-text-dim uppercase block mb-1">Nome Completo</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#FF3E00]">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    id="auth-name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Carlos Augusto"
                    className="w-full text-xs pl-10 pr-4 py-2.5 bg-bg-input border border-border-subtle focus:border-[#FF3E00] outline-none rounded-none text-text-main placeholder-text-dim"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] font-black tracking-widest text-text-dim uppercase block mb-1">E-mail</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#FF3E00]">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="auth-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: carlos@provedor.com"
                  className="w-full text-xs pl-10 pr-4 py-2.5 bg-bg-input border border-border-subtle focus:border-[#FF3E00] outline-none rounded-none text-text-main placeholder-text-dim"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black tracking-widest text-text-dim uppercase block mb-1">Senha</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#FF3E00]">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="auth-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ex: 123456"
                  className="w-full text-xs pl-10 pr-4 py-2.5 bg-bg-input border border-border-subtle focus:border-[#FF3E00] outline-none rounded-none text-text-main placeholder-text-dim"
                />
              </div>
            </div>

            {isRegister && (
              <>
                {/* Avatar Selection */}
                <div>
                  <label className="text-[10px] font-black tracking-widest text-text-dim uppercase block mb-1.5">Escolha seu Avatar</label>
                  <div className="flex gap-3">
                    {AVATARS.map((avatar) => (
                      <button
                        id={`avatar-btn-${avatar.slice(-6, -2)}`}
                        key={avatar}
                        type="button"
                        onClick={() => setSelectedAvatar(avatar)}
                        className={`relative rounded-none overflow-hidden w-11 h-11 border-2 transition-transform duration-150 active:scale-95 cursor-pointer ${
                          selectedAvatar === avatar ? 'border-[#FF3E00] scale-105 shadow-md' : 'border-border-subtle opacity-60'
                        }`}
                      >
                        <img src={avatar} alt="Avatar option" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Initial Fictional Balance */}
                <div>
                  <label className="text-[10px] font-black tracking-widest text-text-dim uppercase block mb-1 flex justify-between">
                    <span>Saldo Inicial Simulador</span>
                    <span className="text-[9px] text-text-dim">(Dinheiro Fictício)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#FF3E00] font-black text-xs">
                      R$
                    </span>
                    <input
                      id="auth-balance-input"
                      type="number"
                      value={balance}
                      onChange={(e) => setBalance(Number(e.target.value))}
                      placeholder="Ex: 10000"
                      min={100}
                      max={100000}
                      className="w-full text-xs pl-10 pr-4 py-2.5 bg-bg-input border border-border-subtle focus:border-[#FF3E00] outline-none rounded-none text-text-main placeholder-text-dim"
                    />
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="flex items-center gap-1.5 text-[#FF3E00] text-xs bg-[#FF3E00]/10 p-2.5 rounded-none border border-[#FF3E00]/20">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              id="btn-auth-submit"
              type="submit"
              className="w-full py-3 bg-text-main text-bg-main hover:bg-[#FF3E00] hover:text-white font-black tracking-widest text-xs rounded-none transition-all duration-200 cursor-pointer"
            >
              {isRegister ? 'CRIAR PERFIL DE TESTE' : 'ENTRAR COM E-MAIL'}
            </button>
          </form>

          {/* Toggle Register/Login Button / Options Container */}
          <div className="mt-6 pt-5 border-t border-border-subtle flex flex-col items-center gap-2">
            <span className="text-[10px] font-mono text-text-dim uppercase">
              {isRegister ? 'Já possui um perfil de teste?' : 'Não possui uma conta de teste?'}
            </span>
            <button
              id="btn-toggle-auth-mode"
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="px-4 py-2 bg-bg-nested border border-border-subtle hover:border-[#FF3E00] hover:text-[#FF3E00] text-[10px] font-black tracking-widest uppercase rounded-none transition-all duration-150 cursor-pointer"
            >
              {isRegister ? 'Acessar Conta (Fazer Login)' : 'Criar Nova Conta (Registrar)'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
