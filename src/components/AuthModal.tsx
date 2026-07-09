import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Mail, DollarSign, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
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
  const [isRegister, setIsRegister] = useState<boolean>(true);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Por favor, digite um e-mail válido.');
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
          className="relative bg-[#0A0A0A] w-full max-w-md rounded-none border-2 border-white p-6 md:p-8 z-50 text-white"
        >
          {/* Close button */}
          <button
            id="btn-close-auth-modal"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-none bg-white text-black hover:bg-[#FF3E00] hover:text-white transition-all duration-200 border-2 border-white"
          >
            <X className="w-4 h-4 font-bold" />
          </button>

          {/* Icon Header */}
          <div className="flex justify-center mb-5">
            <div className="p-3 bg-white text-black rounded-none border-2 border-white">
              <ShieldCheck className="w-8 h-8 text-[#FF3E00]" />
            </div>
          </div>

          <h3 className="text-2xl font-black font-sans text-center text-white tracking-tighter uppercase mb-2">
            {isRegister ? 'Criar Conta de Teste' : 'Acessar Conta'}
          </h3>
          <p className="text-white/60 text-xs text-center mb-6">
            Crie um perfil fictício para favoritar teclados, câmeras e registrar avaliações detalhadas.
          </p>

          {/* Quick Demo Account Selector */}
          <div className="bg-white/5 rounded-none p-4 border border-white/10 mb-6">
            <span className="text-[10px] font-black text-[#FF3E00] uppercase tracking-widest block mb-3 text-center flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              CONEXÃO INSTANTÂNEA DE TESTE
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                id="quick-demo-dev"
                type="button"
                onClick={() => handleQuickLogin('dev')}
                className="p-2 bg-black hover:bg-[#FF3E00] hover:text-white border border-white/10 rounded-none text-center transition-all duration-200 active:scale-95 flex flex-col items-center gap-1.5"
              >
                <img src={AVATARS[2]} alt="Dev" className="w-8 h-8 rounded-none object-cover border border-white/10" />
                <span className="text-[9px] font-black tracking-tight uppercase truncate w-full">Dev</span>
              </button>
              <button
                id="quick-demo-photographer"
                type="button"
                onClick={() => handleQuickLogin('photographer')}
                className="p-2 bg-black hover:bg-[#FF3E00] hover:text-white border border-white/10 rounded-none text-center transition-all duration-200 active:scale-95 flex flex-col items-center gap-1.5"
              >
                <img src={AVATARS[0]} alt="Photographer" className="w-8 h-8 rounded-none object-cover border border-white/10" />
                <span className="text-[9px] font-black tracking-tight uppercase truncate w-full">Fotos</span>
              </button>
              <button
                id="quick-demo-gamer"
                type="button"
                onClick={() => handleQuickLogin('gamer')}
                className="p-2 bg-black hover:bg-[#FF3E00] hover:text-white border border-white/10 rounded-none text-center transition-all duration-200 active:scale-95 flex flex-col items-center gap-1.5"
              >
                <img src={AVATARS[1]} alt="Gamer" className="w-8 h-8 rounded-none object-cover border border-white/10" />
                <span className="text-[9px] font-black tracking-tight uppercase truncate w-full">Gamer</span>
              </button>
            </div>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-3 text-white/30 text-[9px] font-black uppercase tracking-widest">OU USE DADOS PERSONALIZADOS</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          {/* Manual Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mt-3">
            {isRegister && (
              <div>
                <label className="text-[10px] font-black tracking-widest text-white/50 uppercase block mb-1">Nome Completo</label>
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
                    className="w-full text-xs pl-10 pr-4 py-2.5 bg-[#111] border border-white/10 focus:border-[#FF3E00] outline-none rounded-none text-white placeholder-white/20"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] font-black tracking-widest text-white/50 uppercase block mb-1">E-mail</label>
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
                  className="w-full text-xs pl-10 pr-4 py-2.5 bg-[#111] border border-white/10 focus:border-[#FF3E00] outline-none rounded-none text-white placeholder-white/20"
                />
              </div>
            </div>

            {isRegister && (
              <>
                {/* Avatar Selection */}
                <div>
                  <label className="text-[10px] font-black tracking-widest text-white/50 uppercase block mb-1.5">Escolha seu Avatar</label>
                  <div className="flex gap-3">
                    {AVATARS.map((avatar) => (
                      <button
                        id={`avatar-btn-${avatar.slice(-6, -2)}`}
                        key={avatar}
                        type="button"
                        onClick={() => setSelectedAvatar(avatar)}
                        className={`relative rounded-none overflow-hidden w-11 h-11 border-2 transition-transform duration-150 active:scale-95 ${
                          selectedAvatar === avatar ? 'border-[#FF3E00] scale-105 shadow-md' : 'border-white/10 opacity-60'
                        }`}
                      >
                        <img src={avatar} alt="Avatar option" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Initial Fictional Balance */}
                <div>
                  <label className="text-[10px] font-black tracking-widest text-white/50 uppercase block mb-1 flex justify-between">
                    <span>Saldo Inicial Simulador</span>
                    <span className="text-[9px] text-white/30">(Dinheiro Fictício)</span>
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
                      className="w-full text-xs pl-10 pr-4 py-2.5 bg-[#111] border border-white/10 focus:border-[#FF3E00] outline-none rounded-none text-white placeholder-white/20"
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
              className="w-full py-3 bg-white text-black hover:bg-[#FF3E00] hover:text-white font-black tracking-widest text-xs rounded-none transition-all duration-200"
            >
              {isRegister ? 'CRIAR PERFIL DE TESTE' : 'ENTRAR COM E-MAIL'}
            </button>
          </form>

          {/* Toggle Register/Login */}
          <div className="mt-5 text-center">
            <button
              id="btn-toggle-auth-mode"
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-xs font-black tracking-widest uppercase text-[#FF3E00] hover:text-[#ff551f] transition-colors duration-200"
            >
              {isRegister ? 'JÁ POSSUI UM PERFIL? ENTRAR' : 'CADASTRAR NOVO PERFIL DE TESTE'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
