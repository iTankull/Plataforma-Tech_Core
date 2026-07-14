import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CreditCard, Send, Check, Trash2, Heart, ShieldAlert, Sparkles, MapPin } from 'lucide-react';
import { CartItem, User } from '../types';

interface CheckoutViewProps {
  cart: CartItem[];
  currentUser: User | null;
  onBackToCatalog: () => void;
  onClearCart: () => void;
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onCompletePurchase: (totalWithDiscount: number, deliveryDetails: string) => string | null;
  onOpenAuth: () => void;
  onAddFunds: () => void;
}

export default function CheckoutView({
  cart,
  currentUser,
  onBackToCatalog,
  onClearCart,
  onUpdateQuantity,
  onRemoveItem,
  onCompletePurchase,
  onOpenAuth,
  onAddFunds,
}: CheckoutViewProps): React.JSX.Element {
  // Shipping Form States
  const [shippingName, setShippingName] = useState(currentUser?.name || '');
  const [shippingEmail, setShippingEmail] = useState(currentUser?.email || '');
  const [shippingZip, setShippingZip] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingState, setShippingState] = useState('');

  // Delivery Option: 'ship' (Envio por transportadora) or 'pickup' (Retirada em ponto público em SP)
  const [deliveryOption, setDeliveryOption] = useState<'ship' | 'pickup'>('ship');
  const [pickupLocation, setPickupLocation] = useState('Estação Tiradentes (Metrô Linha 1-Azul)');

  // Form errors
  const [formError, setFormError] = useState('');
  const [pickupPhone, setPickupPhone] = useState('');
  const [itemToRemove, setItemToRemove] = useState<{ id: string; action: 'update' | 'remove'; qty: number } | null>(null);

  const handleUpdateQtyLocal = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      setItemToRemove({ id: productId, action: 'update', qty: 0 });
    } else {
      onUpdateQuantity(productId, newQty);
    }
  };

  const handleRemoveLocal = (productId: string) => {
    setItemToRemove({ id: productId, action: 'remove', qty: 0 });
  };

  const confirmRemoval = () => {
    if (!itemToRemove) return;
    if (itemToRemove.action === 'update') {
      onUpdateQuantity(itemToRemove.id, itemToRemove.qty);
    } else {
      onRemoveItem(itemToRemove.id);
    }
    setItemToRemove(null);
  };

  const cancelRemoval = () => {
    setItemToRemove(null);
  };

  // Successful checkout screen state
  const [checkoutSuccessData, setCheckoutSuccessData] = useState<{
    orderId: string;
    total: number;
    paymentMethodName: string;
    itemsCount: number;
    deliveryDetails: string;
  } | null>(null);

  // Math totals
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  // 45% OFF applied flat
  const totalWithDiscount = subtotal * 0.55;
  const discountAmount = subtotal * 0.45;

  const pickupPoints = [
    { name: 'Estação Tiradentes (Metrô Linha 1-Azul)', details: 'Acesso principal das catracas (200m do Bom Retiro)' },
    { name: 'Estação da Luz (Metrô/CPTM)', details: 'Saguão principal histórico (600m do Bom Retiro)' },
    { name: 'Pinacoteca de São Paulo', details: 'Frente à bilheteria principal - Praça da Luz (500m do Bom Retiro)' },
    { name: 'Estação Júlio Prestes (CPTM Linha 8)', details: 'Saguão de embarque (1.1km do Bom Retiro)' },
    { name: 'Shopping D', details: 'Entrada principal de pedestres - Av. Cruzeiro do Sul (1.5km do Bom Retiro)' },
    { name: 'SESC Bom Retiro', details: 'Entrada principal - Al. Nothmann, 185 (900m do Bom Retiro)' },
    { name: 'Parque da Luz', details: 'Portão principal em frente à Estação da Luz (400m do Bom Retiro)' },
  ];

  const handleFinishTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validations
    if (!shippingName.trim() || !shippingEmail.trim()) {
      setFormError('POR FAVOR, PREENCHA SEU NOME E ENDEREÇO DE E-MAIL.');
      return;
    }

    let finalZip = shippingZip;
    let finalAddress = shippingAddress;
    let finalCity = shippingCity;
    let finalState = shippingState;

    if (deliveryOption === 'ship') {
      if (!shippingZip.trim() || !shippingAddress.trim() || !shippingCity.trim() || !shippingState.trim()) {
        setFormError('POR FAVOR, PREENCHA TODOS OS CAMPOS OBRIGATÓRIOS DO ENDEREÇO DE ENTREGA.');
        return;
      }
    } else {
      if (!pickupPhone.trim()) {
        setFormError('POR FAVOR, INCLUA SEU TELEFONE DE CONTATO VIA WHATSAPP PARA AGENDAR A RETIRADA.');
        return;
      }
      // Pick-up Option: prefill address info
      finalZip = '01102-000';
      finalCity = 'SÃO PAULO';
      finalState = 'SP';
      const locDetails = pickupPoints.find(l => l.name === pickupLocation);
      finalAddress = `RETIRADA NO LOCAL: ${pickupLocation} (${locDetails?.details || ''}) - CONTATO WHATSAPP: ${pickupPhone}`;
    }

    const deliveryDetails = deliveryOption === 'pickup'
      ? `RETIRADA PÚBLICA AGENDADA EM: ${pickupLocation} (${pickupPoints.find(l => l.name === pickupLocation)?.details || ''}) - CONTATO WHATSAPP: ${pickupPhone}`
      : `ENVIO POSTAL/MOTOBOY PARA: ${finalAddress}, CEP ${finalZip} - ${finalCity}/${finalState}`;

    const orderId = onCompletePurchase(totalWithDiscount, deliveryDetails);

    if (orderId) {
      setCheckoutSuccessData({
        orderId,
        total: totalWithDiscount,
        paymentMethodName: 'PAGAMENTO VIA PIX (CONCLUÍDO)',
        itemsCount: cart.reduce((acc, item) => acc + item.quantity, 0),
        deliveryDetails,
      });
      onClearCart();
    }
  };

  if (checkoutSuccessData) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto border-4 border-border-main bg-bg-card p-8 md:p-12 text-center my-12 relative text-text-main"
      >
        <div className="absolute top-4 right-4 text-xs font-mono text-text-dim">[ STATUS: CONFIRMADO ]</div>
        <div className="w-20 h-20 bg-[#FF3E00] flex items-center justify-center mx-auto mb-6 border-2 border-border-main animate-pulse">
          <Check className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-4 text-text-main">
          TRANSAÇÃO CONCLUÍDA!
        </h2>
        
        <p className="font-mono text-xs text-text-muted max-w-lg mx-auto mb-8 leading-relaxed">
          Sua transação simulada de aquisição foi registrada com sucesso sob os moldes de revenda com 45% OFF da plataforma. Nenhum valor real foi cobrado.
        </p>

        <div className="bg-bg-nested border border-border-subtle p-6 text-left max-w-md mx-auto space-y-3 font-mono text-xs mb-10">
          <div className="flex justify-between border-b border-border-very-subtle pb-1.5">
            <span className="text-text-muted">ID DO PEDIDO:</span>
            <span className="font-black text-text-main">{checkoutSuccessData.orderId}</span>
          </div>
          <div className="flex justify-between border-b border-border-very-subtle pb-1.5">
            <span className="text-text-muted">ITENS ADQUIRIDOS:</span>
            <span className="font-black text-text-main">{checkoutSuccessData.itemsCount} GADGETS</span>
          </div>
          <div className="flex justify-between border-b border-border-very-subtle pb-1.5">
            <span className="text-text-muted">MÉTODO DE PAGAMENTO:</span>
            <span className="font-black text-text-main">{checkoutSuccessData.paymentMethodName}</span>
          </div>
          <div className="border-b border-border-very-subtle pb-1.5">
            <span className="text-text-muted block mb-1">DETALHES DA ENTREGA:</span>
            <span className="font-black text-text-main text-[10px] uppercase leading-tight block">{checkoutSuccessData.deliveryDetails}</span>
          </div>
          <div className="flex justify-between pt-1.5 text-sm">
            <span className="text-[#FF3E00] font-black">TOTAL COMPENSADO:</span>
            <span className="font-black text-[#FF3E00]">
              R$ {checkoutSuccessData.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <button
          onClick={onBackToCatalog}
          className="px-8 py-4 bg-text-main text-bg-main hover:bg-[#FF3E00] hover:text-white font-black tracking-widest text-xs uppercase rounded-none transition-all duration-150"
        >
          VOLTAR AO CATÁLOGO
        </button>
      </motion.div>
    );
  }

  return (
    <div className="my-6">
      {/* Back link */}
      <button
        onClick={onBackToCatalog}
        className="flex items-center gap-2 text-white/60 hover:text-white font-black tracking-widest text-xs uppercase mb-8 cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-4 h-4 text-[#FF3E00]" />
        VOLTAR AO ACERVO
      </button>

      <div className="text-center md:text-left mb-10">
        <span className="bg-[#FF3E00] text-white px-3 py-1 text-[10px] font-black tracking-widest uppercase">
          SECURE SIMULATED CHECKOUT
        </span>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mt-2">
          FINALIZAR COMPRA_
        </h1>
        <p className="text-white/50 font-mono text-xs mt-1">
          Confira seus itens com desconto padrão aplicado de 45% flat.
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-white/10 p-8 max-w-xl mx-auto">
          <h3 className="font-sans font-black text-white text-lg uppercase tracking-widest mb-2">CARRINHO VAZIO</h3>
          <p className="text-white/60 text-xs font-mono mb-6">
            Não há produtos em seu carrinho. Adicione alguns itens do catálogo para prosseguir ao checkout.
          </p>
          <button
            onClick={onBackToCatalog}
            className="px-6 py-3 bg-[#FF3E00] text-white text-xs font-black tracking-widest uppercase"
          >
            VER PRODUTOS DO OUTLET
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Shipping Form and simulated payment (7 Cols) */}
          <form onSubmit={handleFinishTransaction} className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Delivery Address */}
            <div className="border-2 border-white bg-black p-6 md:p-8 space-y-5">
              <div className="flex items-center gap-2 border-b border-white/15 pb-3">
                <span className="bg-white text-black font-mono font-black text-[10px] px-2 py-0.5">01</span>
                <h3 className="text-xs font-black tracking-widest uppercase text-white">DADOS DO DESTINATÁRIO & ENTREGA</h3>
              </div>

              {formError && (
                <div className="bg-[#FF3E00]/10 border border-[#FF3E00] p-4 text-[#FF3E00] font-mono text-[11px] leading-relaxed flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-1 sm:col-span-2">
                  <label className="text-[9px] font-black tracking-widest text-white/40 uppercase block">NOME DESTINATÁRIO *</label>
                  <input
                    type="text"
                    required
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                    placeholder="DIGITE SEU NOME COMPLETO"
                    className="w-full bg-[#111] border-2 border-white/10 p-3 text-xs text-white focus:outline-none focus:border-[#FF3E00] uppercase font-mono"
                  />
                </div>

                <div className="space-y-1.5 col-span-1 sm:col-span-2">
                  <label className="text-[9px] font-black tracking-widest text-white/40 uppercase block">E-MAIL *</label>
                  <input
                    type="email"
                    required
                    value={shippingEmail}
                    onChange={(e) => setShippingEmail(e.target.value)}
                    placeholder="DIGITE SEU ENDEREÇO DE E-MAIL"
                    className="w-full bg-[#111] border-2 border-white/10 p-3 text-xs text-white focus:outline-none focus:border-[#FF3E00] uppercase font-mono"
                  />
                </div>
              </div>

              {/* Delivery Option Toggle */}
              <div className="space-y-2 pt-2">
                <label className="text-[9px] font-black tracking-widest text-white/40 uppercase block">MODALIDADE DE ENTREGA *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setDeliveryOption('ship');
                      setFormError('');
                    }}
                    className={`p-4 text-xs font-mono font-black border-2 transition-all duration-150 uppercase text-left flex flex-col justify-between h-20 ${
                      deliveryOption === 'ship'
                        ? 'bg-white text-black border-white'
                        : 'bg-black text-white/50 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span className="text-[9px] font-black tracking-widest uppercase">ENVIO TRADICIONAL</span>
                    <span className="text-[10px] font-mono opacity-80 mt-1 uppercase">TRANSPORTADORA / CORREIOS</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeliveryOption('pickup');
                      setFormError('');
                    }}
                    className={`p-4 text-xs font-mono font-black border-2 transition-all duration-150 uppercase text-left flex flex-col justify-between h-20 ${
                      deliveryOption === 'pickup'
                        ? 'bg-white text-black border-white'
                        : 'bg-black text-white/50 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span className="text-[9px] font-black tracking-widest uppercase text-[#FF3E00]">RETIRADA EM LOCAL</span>
                    <span className="text-[10px] font-mono opacity-80 mt-1 uppercase">PONTOS PÚBLICOS (RAIO 2KM BOM RETIRO)</span>
                  </button>
                </div>
              </div>

              {/* Address Fields for Traditional Shipping */}
              {deliveryOption === 'ship' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black tracking-widest text-white/40 uppercase block">CEP *</label>
                    <input
                      type="text"
                      required={deliveryOption === 'ship'}
                      maxLength={9}
                      value={shippingZip}
                      onChange={(e) => setShippingZip(e.target.value)}
                      placeholder="00000-000"
                      className="w-full bg-[#111] border-2 border-white/10 p-3 text-xs text-white focus:outline-none focus:border-[#FF3E00] font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black tracking-widest text-white/40 uppercase block">ENDEREÇO COMPLETO *</label>
                    <input
                      type="text"
                      required={deliveryOption === 'ship'}
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="RUA, NÚMERO, APARTAMENTO"
                      className="w-full bg-[#111] border-2 border-white/10 p-3 text-xs text-white focus:outline-none focus:border-[#FF3E00] uppercase font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black tracking-widest text-white/40 uppercase block">CIDADE *</label>
                    <input
                      type="text"
                      required={deliveryOption === 'ship'}
                      value={shippingCity}
                      onChange={(e) => setShippingCity(e.target.value)}
                      placeholder="EX: SÃO PAULO"
                      className="w-full bg-[#111] border-2 border-white/10 p-3 text-xs text-white focus:outline-none focus:border-[#FF3E00] uppercase font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black tracking-widest text-white/40 uppercase block">ESTADO (UF) *</label>
                    <input
                      type="text"
                      required={deliveryOption === 'ship'}
                      maxLength={2}
                      value={shippingState}
                      onChange={(e) => setShippingState(e.target.value.toUpperCase())}
                      placeholder="EX: SP"
                      className="w-full bg-[#111] border-2 border-white/10 p-3 text-xs text-white focus:outline-none focus:border-[#FF3E00] uppercase font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Pickup Point Selectors for Retirada */}
              {deliveryOption === 'pickup' && (
                <div className="space-y-4 pt-2 bg-white/5 p-4 border border-white/10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black tracking-widest text-[#FF3E00] uppercase block">
                      SELECIONE O PONTO PÚBLICO PARA RETIRADA:
                    </span>
                    <p className="text-[10px] text-white/50 font-mono">
                      Pontos estratégicos em raio de até 2km do bairro do Bom Retiro, São Paulo - SP:
                    </p>
                  </div>

                  {/* WhatsApp contact input */}
                  <div className="space-y-1.5 p-3 bg-black border border-white/10">
                    <label className="text-[9px] font-black tracking-widest text-[#FF3E00] uppercase block">
                      NÚMERO DE TELEFONE (WHATSAPP) PARA CONTATO *
                    </label>
                    <input
                      type="tel"
                      required={deliveryOption === 'pickup'}
                      value={pickupPhone}
                      onChange={(e) => setPickupPhone(e.target.value)}
                      placeholder="EX: (11) 99999-9999"
                      className="w-full bg-[#111] border-2 border-white/10 p-3 text-xs text-white focus:outline-none focus:border-[#FF3E00] font-mono"
                    />
                    <p className="text-[8px] font-mono text-white/40 uppercase">
                      Necessário para agendar o dia e horário da sua retirada via whatsapp.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {pickupPoints.map((loc) => (
                      <button
                        type="button"
                        key={loc.name}
                        onClick={() => setPickupLocation(loc.name)}
                        className={`p-3 border flex flex-col cursor-pointer text-left transition-all ${
                          pickupLocation === loc.name
                            ? 'bg-white text-black border-[#FF3E00]'
                            : 'bg-black text-white/75 border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${pickupLocation === loc.name ? 'border-[#FF3E00] bg-[#FF3E00]' : 'border-white/30'}`}>
                            {pickupLocation === loc.name && <div className="w-1 h-1 bg-white rounded-full" />}
                          </div>
                          <span className="text-xs font-black uppercase tracking-tight flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#FF3E00]" />
                            {loc.name}
                          </span>
                        </div>
                        <span className={`text-[10px] font-mono ml-5 mt-1 block ${pickupLocation === loc.name ? 'text-black/60 font-medium' : 'text-white/40'}`}>
                          {loc.details}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Payment Method (Strictly PIX) */}
            <div className="border-2 border-white bg-black p-6 md:p-8 space-y-5">
              <div className="flex items-center gap-2 border-b border-white/15 pb-3">
                <span className="bg-white text-black font-mono font-black text-[10px] px-2 py-0.5">02</span>
                <h3 className="text-xs font-black tracking-widest uppercase text-white">PAGAMENTO EXCLUSIVO VIA PIX</h3>
              </div>

              <div className="p-5 bg-white/5 border border-white/10 text-center space-y-5">
                <div className="text-[10px] font-black tracking-widest uppercase text-[#FF3E00] flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  MÉTODO DE SIMULAÇÃO DE PAGAMENTO ATIVO
                </div>

                <div className="w-32 h-32 bg-white p-2 mx-auto border-2 border-[#FF3E00] flex items-center justify-center">
                  {/* Fake QR code visualization */}
                  <div className="grid grid-cols-4 grid-rows-4 gap-1 w-full h-full bg-black">
                    {[...Array(16)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-full h-full ${
                          (i * 3 + 7) % 5 === 0 || i % 4 === 0 ? 'bg-white' : 'bg-black'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 max-w-sm mx-auto">
                  <div className="text-[10px] font-black tracking-widest uppercase text-white/40">PIX COPIE E COLE FICTÍCIO:</div>
                  <div 
                    onClick={() => {
                      navigator.clipboard.writeText(`techcore_pix_simulate_outlet_discount_flat_45_percent_${totalWithDiscount.toFixed(2)}`);
                    }}
                    title="Clique para Copiar"
                    className="bg-[#111] p-2 border border-white/10 text-[9px] font-mono truncate text-white/50 select-all cursor-pointer hover:border-[#FF3E00] hover:text-white transition-all text-center"
                  >
                    techcore_pix_simulate_outlet_discount_flat_45_percent_{totalWithDiscount.toFixed(2)}
                  </div>
                  <p className="text-[8px] font-mono text-white/30 uppercase">[ CLIQUE NO CODIGO ACIMA PARA COPIAR ]</p>
                </div>

                <p className="text-[10px] text-white/50 font-mono leading-relaxed max-w-md mx-auto">
                  Leia o QR-code simulado acima ou use a chave Copie e Cole. Após simular a transferência em seu app de testes, clique no botão de finalização abaixo para concluir a compra fictícia!
                </p>
              </div>
            </div>

            {/* Actions: Checkout Submit */}
            <div className="pt-4">
              <button
                type="submit"
                id="btn-checkout-finish"
                className="w-full py-4 sm:py-5 px-4 bg-[#FF3E00] hover:bg-[#ff551f] text-white font-black tracking-wider sm:tracking-widest text-[11px] sm:text-xs md:text-sm rounded-none transition-all duration-150 uppercase flex items-center justify-center gap-2 sm:gap-3 border-2 border-transparent hover:border-white"
              >
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span className="text-center leading-normal">
                  CONCLUIR COMPRA SIMULADA (R$ {totalWithDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                </span>
              </button>
              <p className="text-center text-[9px] font-mono text-white/30 mt-3 uppercase">
                ESTA TRANSAÇÃO É FICTÍCIA E NENHUM VALOR FINANCEIRO REAL SERÁ TRANSACIONADO.
              </p>
            </div>
          </form>

          {/* RIGHT: Cart summary column (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border-2 border-white bg-black p-6 md:p-8 space-y-6">
              <h3 className="text-xs font-black tracking-widest uppercase text-white border-b border-white/15 pb-3 flex items-center justify-between">
                <span>CARRINHO DE COMPRAS</span>
                <span className="font-mono text-[10px] text-white/40">{cart.reduce((s, i) => s + i.quantity, 0)} ITENS</span>
              </h3>

              {/* Items List inside Checkout wrapper */}
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item, index) => (
                  <div key={`${item.product.id}-${index}`} className="flex gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover border border-white/10 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[8px] font-black bg-white/10 text-white/50 px-1.5 py-0.5 rounded-none uppercase">
                        {item.product.category}
                      </span>
                      <h4 className="text-xs font-black text-white truncate uppercase mt-1">{item.product.name}</h4>
                      
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] text-white/40 line-through font-mono">
                          R$ {item.product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-xs font-bold text-white font-mono">
                          R$ {(item.product.price * 0.55).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      {/* Controls with stock limits */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-white/15 bg-[#111]">
                          <button
                            type="button"
                            onClick={() => handleUpdateQtyLocal(item.product.id, item.quantity - 1)}
                            className="px-2 py-0.5 hover:bg-white/5 text-xs text-white"
                          >
                            -
                          </button>
                          <span className="px-2 font-mono text-xs text-white font-bold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQtyLocal(item.product.id, item.quantity + 1)}
                            className="px-2 py-0.5 hover:bg-white/5 text-xs text-white"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveLocal(item.product.id)}
                          className="text-white/40 hover:text-[#FF3E00] transition-colors p-1"
                          title="Remover Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Calculated Totals details */}
              <div className="bg-white/5 border border-white/10 p-4 space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center border-b border-white/5 pb-1.5 gap-2">
                  <span className="text-white/40 whitespace-nowrap">VALOR ORIGINAL:</span>
                  <span className="text-white whitespace-nowrap text-right">
                    R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-1.5 gap-2">
                  <span className="text-white/40 whitespace-nowrap">DESCONTO PADRÃO (45%):</span>
                  <span className="text-[#FF3E00] font-black whitespace-nowrap text-right">
                    - R$ {discountAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1.5 text-sm gap-2">
                  <span className="text-[#FF3E00] font-black uppercase whitespace-nowrap">VALOR TOTAL FINAL:</span>
                  <span className="font-black text-white whitespace-nowrap text-right">
                    R$ {totalWithDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Confirmation Modal overlay */}
      <AnimatePresence>
        {itemToRemove && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              onClick={cancelRemoval}
              className="fixed inset-0 bg-black/95 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-black w-full max-w-sm rounded-none border-4 border-white p-6 md:p-8 z-50 text-white text-center"
            >
              <div className="w-16 h-16 bg-[#FF3E00] flex items-center justify-center mx-auto mb-4 border-2 border-white">
                <Trash2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-2">
                REMOVER ITEM
              </h3>
              <p className="text-xs text-white/70 font-mono mb-6 leading-relaxed uppercase">
                {cart.length === 1 && cart.some(item => item.product.id === itemToRemove.id)
                  ? 'Você deseja esvaziar seu carrinho?'
                  : 'Você deseja remover este item do seu carrinho?'}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={cancelRemoval}
                  className="py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-black tracking-wider text-[10px] uppercase border border-white/20 transition-all duration-150"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmRemoval}
                  className="py-2.5 bg-[#FF3E00] hover:bg-[#ff551f] text-white font-black tracking-wider text-[10px] uppercase border border-transparent hover:border-white transition-all duration-150"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
