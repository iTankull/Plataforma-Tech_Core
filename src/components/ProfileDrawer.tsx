import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Mail, DollarSign, Plus, Calendar, ShoppingBag, Package, MapPin, CheckCircle } from 'lucide-react';
import { User as UserType, Purchase } from '../types';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserType | null;
  purchases: Purchase[];
  onAddFunds: () => void;
  onLogout: () => void;
}

export default function ProfileDrawer({
  isOpen,
  onClose,
  currentUser,
  purchases,
  onAddFunds,
  onLogout,
}: ProfileDrawerProps): React.JSX.Element {
  // Filter purchases for the logged-in user
  const userPurchases = purchases.filter((p) => p.userId === currentUser?.id);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[500px] bg-bg-card border-l-2 border-border-main z-50 flex flex-col h-full text-text-main"
          >
            {/* Header */}
            <div className="p-6 border-b border-border-subtle flex items-center justify-between bg-bg-card">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#FF3E00]" />
                <h3 className="font-sans font-black text-lg tracking-tight uppercase">MEU PERFIL</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-text-muted hover:text-[#FF3E00] transition-colors"
                title="Fechar Painel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {currentUser ? (
                <>
                  {/* User Card */}
                  <div className="bg-bg-nested border border-border-subtle p-5 space-y-4">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        {currentUser.avatar ? (
                          <img
                            src={currentUser.avatar}
                            alt={currentUser.name}
                            className="w-16 h-16 object-cover border-2 border-[#FF3E00]"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-[#FF3E00] text-white flex items-center justify-center text-xl font-black">
                            {currentUser.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 bg-text-main text-bg-main p-1 rounded-none border border-border-main">
                          <User className="w-3 h-3" />
                        </div>
                      </div>

                      {/* Name and Email */}
                      <div className="min-w-0">
                        <h4 className="text-sm font-black text-text-main uppercase tracking-tight truncate">
                          {currentUser.name}
                        </h4>
                        <p className="text-[10px] font-mono text-text-muted truncate mt-0.5 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-[#FF3E00]" />
                          {currentUser.email}
                        </p>
                        <span className="inline-block mt-2 text-[8px] font-black bg-[#FF3E00] text-white px-1.5 py-0.5 uppercase tracking-wider">
                          CLIENTE VIP // SIMULADO
                        </span>
                      </div>
                    </div>

                    {/* Balance Info */}
                    <div className="border-t border-border-very-subtle pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[9px] font-black tracking-widest text-text-dim uppercase block">
                          SALDO FICTÍCIO DISPONÍVEL
                        </span>
                        <span className="text-lg font-mono font-black text-text-main block mt-0.5">
                          R$ {currentUser.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      
                      <button
                        onClick={onAddFunds}
                        className="py-2 px-3 bg-text-main text-bg-main hover:bg-[#FF3E00] hover:text-white text-[9px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        ADICIONAR R$ 5K
                      </button>
                    </div>
                  </div>

                  {/* Purchase History Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                      <h4 className="text-[11px] font-black tracking-widest text-text-main uppercase flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-[#FF3E00]" />
                        HISTÓRICO DE COMPRAS ({userPurchases.length})
                      </h4>
                    </div>

                    {userPurchases.length === 0 ? (
                      <div className="text-center py-10 bg-bg-nested border border-dashed border-border-subtle p-6 flex flex-col items-center justify-center">
                        <ShoppingBag className="w-10 h-10 text-text-dim/20 mb-3" />
                        <h5 className="font-sans font-black tracking-widest text-[10px] uppercase text-text-muted mb-1">
                          NENHUMA AQUISIÇÃO
                        </h5>
                        <p className="text-text-dim font-mono text-[9px] leading-relaxed max-w-[280px]">
                          Faça simulações de compra clicando em "Comprar Agora" nos detalhes de um produto ou finalize seu carrinho de compras.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userPurchases.map((purchase) => (
                          <div
                            key={purchase.id}
                            className="border border-border-subtle bg-bg-nested p-4 space-y-3 font-mono text-xs"
                          >
                            {/* Order Header */}
                            <div className="flex justify-between items-start gap-2 flex-wrap border-b border-border-very-subtle pb-2">
                              <div>
                                <span className="text-[10px] font-black text-[#FF3E00] block">
                                  PEDIDO {purchase.id}
                                </span>
                                <span className="text-[8px] text-text-dim flex items-center gap-1 mt-0.5">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(purchase.date).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              <span className="text-[8px] font-black bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-none uppercase flex items-center gap-1 border border-emerald-500/20">
                                <CheckCircle className="w-3 h-3" />
                                COMPRA SIMULADA
                              </span>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-2">
                              {purchase.items.map((item, idx) => (
                                <div key={idx} className="flex gap-3 items-center justify-between text-[11px] py-1 border-b border-border-very-subtle/40 last:border-0">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-8 h-8 object-cover border border-border-subtle shrink-0"
                                    />
                                    <span className="font-bold text-text-main uppercase truncate max-w-[180px]">
                                      {item.name}
                                    </span>
                                  </div>
                                  <span className="text-text-muted text-[10px] shrink-0 font-bold">
                                    {item.quantity}x • R$ {item.pricePaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Order Shipping/Pickup details */}
                            <div className="text-[9px] text-text-muted bg-bg-card p-2 border border-border-very-subtle space-y-1">
                              <span className="font-black text-text-main flex items-center gap-1 uppercase">
                                <MapPin className="w-3 h-3 text-[#FF3E00]" />
                                DETALHES DE ENTREGA
                              </span>
                              <p className="uppercase leading-tight text-text-muted">{purchase.deliveryDetails}</p>
                            </div>

                            {/* Order Total */}
                            <div className="flex justify-between items-center pt-1.5 text-xs">
                              <span className="text-text-dim font-bold">TOTAL SIMULADO:</span>
                              <span className="font-black text-[#FF3E00] text-sm">
                                R$ {purchase.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Logout Button */}
                  <div className="pt-4 border-t border-border-subtle">
                    <button
                      onClick={() => {
                        onLogout();
                        onClose();
                      }}
                      className="w-full py-3 bg-bg-nested hover:bg-red-500/10 hover:text-red-500 text-text-muted font-black tracking-widest text-[10px] uppercase border border-border-subtle hover:border-red-500/20 transition-all"
                    >
                      LOGOUT / SAIR DA CONTA
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-20 flex flex-col items-center justify-center h-full">
                  <User className="w-12 h-12 text-text-dim/20 mb-4" />
                  <h4 className="font-sans font-black tracking-widest text-xs uppercase mb-2">ACESSO RESTRITO</h4>
                  <p className="text-text-muted font-mono text-[10px] leading-relaxed max-w-[240px] mb-6">
                    Você precisa criar um perfil ou conectar-se para acessar o painel de compras e saldo simulado.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
