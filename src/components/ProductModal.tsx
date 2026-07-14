import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, ExternalLink, MessageSquare, Plus, AlertCircle, ShoppingBag, Check, Share2, Camera, Package, Mail } from 'lucide-react';
import { Product, Review, User } from '../types';
import { Tooltip } from './Tooltip';
import { findGlossaryTerm } from '../data/glossary';

// Helper function to dynamically map high-quality tech inspection images
const getAdditionalImages = (productId: string, primaryImage: string): { url: string; label: string; description: string }[] => {
  const images = [
    { url: primaryImage, label: "EQUIPAMENTO", description: "Foto geral do equipamento disponível no estoque." }
  ];

  const lowerId = productId.toLowerCase();

  if (lowerId.includes('keychron') || lowerId.includes('gmmk') || lowerId.includes('keyboard')) {
    images.push(
      {
        url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=600',
        label: "EMBALAGEM",
        description: "Caixa original preservada com todos os divisórios internos de proteção."
      },
      {
        url: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=600',
        label: "ESTADO FÍSICO",
        description: "Estrutura externa e switches em estado impecável sem marcas de fricção."
      }
    );
  } else if (lowerId.includes('sony') || lowerId.includes('canon') || lowerId.includes('camera') || lowerId.includes('r50')) {
    images.push(
      {
        url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=600',
        label: "EMBALAGEM",
        description: "Caixa do fabricante com manuais, tampas originais e alça de transporte selada."
      },
      {
        url: 'https://images.unsplash.com/photo-1502920917128-1aa2c1a4d459?auto=format&fit=crop&q=80&w=600',
        label: "DETALHES",
        description: "Sensor CMOS 100% limpo e contatos da baioneta sem oxidação ou marcas."
      }
    );
  } else if (lowerId.includes('watch') || lowerId.includes('apple') || lowerId.includes('galaxy') || lowerId.includes('amazfit')) {
    images.push(
      {
        url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=600',
        label: "EMBALAGEM",
        description: "Embalagem original em estado novo de conservação."
      },
      {
        url: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&q=80&w=600',
        label: "DETALHES",
        description: "Vidro frontal sem micro-riscos e carregador por indução intacto."
      }
    );
  } else if (lowerId.includes('xm5') || lowerId.includes('airpods') || lowerId.includes('sennheiser') || lowerId.includes('audio')) {
    images.push(
      {
        url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=600',
        label: "EMBALAGEM",
        description: "Estojo oficial de transporte com plásticos originais e cabo de áudio."
      },
      {
        url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=600',
        label: "DETALHES",
        description: "Almofadas higienizadas sem rachaduras e arco com pressão perfeita."
      }
    );
  } else {
    images.push(
      {
        url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=600',
        label: "EMBALAGEM",
        description: "Caixa original do fabricante com proteção em plástico bolha adicional."
      },
      {
        url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600',
        label: "DETALHES",
        description: "Conectores e componentes internos revisados pelo laboratório técnico."
      }
    );
  }

  return images;
};

interface ProductModalProps {
  product: Product;
  reviews: Review[];
  currentUser: User | null;
  onClose: () => void;
  onAddReview: (rating: number, comment: string) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenAuth: () => void;
  onSimulatePurchase: (productId: string) => boolean;
  onAddToCart: (product: Product) => void;
  onRegisterStockAlert?: (productId: string, email: string) => void;
}

export default function ProductModal({
  product,
  reviews,
  currentUser,
  onClose,
  onAddReview,
  isFavorite,
  onToggleFavorite,
  onOpenAuth,
  onSimulatePurchase,
  onAddToCart,
  onRegisterStockAlert,
}: ProductModalProps): React.JSX.Element {
  const [newRating, setNewRating] = useState<number>(0);
  const [newComment, setNewComment] = useState<string>('');
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState<boolean>(false);
  const [isZoomOpen, setIsZoomOpen] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [showMobileReviews, setShowMobileReviews] = useState<boolean>(false);

  const [stockEmail, setStockEmail] = useState<string>(currentUser?.email || '');
  const [isAlertRegistered, setIsAlertRegistered] = useState<boolean>(false);

  React.useEffect(() => {
    if (currentUser) {
      setStockEmail(currentUser.email);
    }
  }, [currentUser]);

  React.useEffect(() => {
    try {
      const alerts = JSON.parse(localStorage.getItem('tech_stock_alerts') || '[]');
      const registered = alerts.some((a: any) => a.productId === product.id && a.email.toLowerCase() === stockEmail.toLowerCase());
      setIsAlertRegistered(registered);
    } catch {
      setIsAlertRegistered(false);
    }
  }, [product, stockEmail]);

  const handleRegisterStockAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockEmail.trim()) return;
    try {
      const alerts = JSON.parse(localStorage.getItem('tech_stock_alerts') || '[]');
      if (!alerts.some((a: any) => a.productId === product.id && a.email.toLowerCase() === stockEmail.toLowerCase())) {
        alerts.push({
          id: `alert-${Date.now()}`,
          productId: product.id,
          email: stockEmail.trim(),
          productName: product.name,
        });
        localStorage.setItem('tech_stock_alerts', JSON.stringify(alerts));
      }
      setIsAlertRegistered(true);
      if (onRegisterStockAlert) {
        onRegisterStockAlert(product.id, stockEmail.trim());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const additionalPhotos = getAdditionalImages(product.id, product.image);

  // Filter reviews for this specific product
  const productReviews = reviews.filter((r) => r.productId === product.id);

  // Calculate average rating dynamically
  const averageRating = productReviews.length > 0
    ? productReviews.reduce((acc, curr) => acc + curr.rating, 0) / productReviews.length
    : product.rating;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setFormError('Você precisa estar conectado à sua conta para avaliar.');
      return;
    }
    if (newRating === 0) {
      setFormError('Por favor, selecione a quantidade de estrelas (de 1 a 5).');
      return;
    }

    onAddReview(newRating, newComment.trim());
    setNewComment('');
    setNewRating(0);
    setFormError('');
    setIsCheckoutSuccess(false);
  };

  const handleCheckoutSimulator = () => {
    const success = onSimulatePurchase(product.id);
    if (success) {
      setIsCheckoutSuccess(true);
    }
  };


  const PhotosSection = (
    <div className="border-b-2 md:border-b-0 md:border-dashed border-border-subtle pb-6 md:pb-8 mb-6 md:mb-0">
      <h3 className="font-sans font-black text-text-main text-sm md:text-sm uppercase tracking-tighter mb-3 flex items-center gap-2">
        <Camera className="w-4 h-4 text-[#FF3E00]" />
        Fotos & Inspeção
      </h3>
      <p className="text-text-muted text-[10px] uppercase font-mono tracking-wider mb-4 leading-relaxed hidden md:block">
        Clique na imagem principal ou utilize as setas e miniaturas abaixo para inspecionar os detalhes reais do lote técnico:
      </p>

      {/* Main Large Interactive Photo Display - highly visual, focuses the user */}
      <div className="relative w-full aspect-[16/10] bg-bg-card border-2 border-border-subtle hover:border-[#FF3E00] transition-all duration-300 group overflow-hidden mb-4">
        {/* Main Photo Image */}
        <img
          src={additionalPhotos[activeImageIndex].url}
          alt={additionalPhotos[activeImageIndex].label}
          onClick={() => setIsZoomOpen(true)}
          className="w-full h-full object-cover cursor-zoom-in group-hover:scale-[1.02] transition-all duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Hover / Click to Zoom Overlay Badge */}
        <div 
          onClick={() => setIsZoomOpen(true)}
          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center gap-2 cursor-zoom-in"
        >
          <div className="p-3 bg-black/85 border border-white/20 text-white flex items-center gap-2 font-mono text-[9px] font-black uppercase tracking-widest scale-95 group-hover:scale-100 transition-all duration-300">
            <Camera className="w-3.5 h-3.5 text-[#FF3E00] animate-pulse" />
            Clique para Ampliar
          </div>
        </div>

        {/* Navigation Arrows inside the main image for extremely fast, intuitive swapping on mobile */}
        <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveImageIndex((prev) => (prev - 1 + additionalPhotos.length) % additionalPhotos.length);
            }}
            className="pointer-events-auto p-2.5 bg-black/85 hover:bg-[#FF3E00] border border-white/10 hover:border-white text-white text-xs font-black transition-all rounded-none cursor-pointer"
            title="Anterior"
          >
            &lt;
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveImageIndex((prev) => (prev + 1) % additionalPhotos.length);
            }}
            className="pointer-events-auto p-2.5 bg-black/85 hover:bg-[#FF3E00] border border-white/10 hover:border-white text-white text-xs font-black transition-all rounded-none cursor-pointer"
            title="Próxima"
          >
            &gt;
          </button>
        </div>

        {/* Active image label badge */}
        <div className="absolute top-3 left-3 bg-[#FF3E00] px-2 py-0.5 text-white text-[8px] font-black tracking-widest uppercase font-mono shadow-md">
          {additionalPhotos[activeImageIndex].label}
        </div>

        {/* Pagination Counter Badge */}
        <div className="absolute bottom-3 right-3 bg-black/85 border border-white/10 px-2 py-0.5 text-white/90 text-[8px] font-mono font-bold uppercase tracking-widest">
          {activeImageIndex + 1} / {additionalPhotos.length}
        </div>
      </div>

      {/* Thumbnails grid - positioned cleanly and looking premium */}
      <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4">
        {additionalPhotos.map((photo, index) => {
          const isActive = index === activeImageIndex;
          return (
            <button
              key={`thumb-rt-${index}`}
              onClick={() => {
                setActiveImageIndex(index);
              }}
              className={`group relative aspect-video border-2 overflow-hidden bg-bg-card transition-all duration-200 rounded-none cursor-pointer ${
                isActive 
                  ? 'border-[#FF3E00]' 
                  : 'border-border-subtle hover:border-text-dim'
              }`}
              title={photo.label}
            >
              <img
                src={photo.url}
                alt={photo.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                referrerPolicy="no-referrer"
              />
              <div className={`absolute inset-x-0 bottom-0 py-1 text-center transition-all duration-200 ${
                isActive ? 'bg-[#FF3E00]' : 'bg-black/85'
              }`}>
                <span className="text-[7.5px] font-black tracking-widest text-white uppercase block">
                  {photo.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Photo Rich assessment with click-to-zoom indication and inspection description */}
      <div 
        onClick={() => setIsZoomOpen(true)}
        className="bg-bg-nested border border-border-subtle hover:border-[#FF3E00] p-3.5 flex flex-col gap-2 rounded-none font-mono cursor-pointer transition-all duration-150 text-left"
        title="Clique para ver em tela cheia"
      >
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-[#FF3E00] shrink-0" />
          <div className="flex-1">
            <span className="text-[10px] font-black text-[#FF3E00] tracking-widest block uppercase">
              {additionalPhotos[activeImageIndex].label} // DETALHES DE INSPEÇÃO
            </span>
          </div>
          <span className="text-[8px] text-text-dim font-black border border-border-subtle px-1.5 py-0.5 tracking-wider uppercase">
            AMPLIAR FOTO
          </span>
        </div>
        <p className="text-[10px] text-text-muted uppercase leading-relaxed font-semibold">
          {additionalPhotos[activeImageIndex].description}
        </p>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto" id="product-detail-modal">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <div className="flex min-h-screen items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-5xl bg-bg-main border-2 border-border-subtle rounded-none shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] z-50 text-text-main"
          >
            {/* Close Button */}
            <button
              id="btn-close-modal"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-none bg-text-main text-bg-main hover:bg-[#FF3E00] hover:text-white transition-all duration-200 border-2 border-text-main"
            >
              <X className="w-5 h-5 font-bold" />
            </button>

            {/* Left Column: Media & Specs */}
            <div className="w-full md:w-1/2 p-5 md:p-8 overflow-y-auto md:border-r border-border-subtle flex flex-col">
              <div className="block md:hidden">
                {PhotosSection}
              </div>
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-black text-[#FF3E00] tracking-[0.2em] uppercase mb-1.5 block">
                      {product.category}
                    </span>
                    <h2 className="font-sans font-black text-text-main text-3xl md:text-4xl tracking-tighter uppercase">
                      {product.name}
                    </h2>
                  </div>
                  <div className="flex gap-2 shrink-0 ml-4">
                    <button
                      id="btn-fav-modal"
                      onClick={onToggleFavorite}
                      className={`p-3 rounded-none transition-all duration-200 border-2 ${
                        isFavorite 
                          ? 'bg-[#FF3E00] border-[#FF3E00] text-white' 
                          : 'bg-bg-card border-border-subtle text-text-main hover:border-[#FF3E00] hover:text-[#FF3E00]'
                      }`}
                      title={isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
                    >
                      <Star
                        className={`w-5 h-5 ${isFavorite ? 'fill-white text-white' : ''}`}
                      />
                    </button>

                    <button
                      id="btn-share-modal"
                      onClick={() => {
                        const shareText = `Confira este produto incrível no Tech_Core: ${product.name} com 45% de desconto! ${window.location.origin}/?product=${product.id}`;
                        navigator.clipboard.writeText(shareText).then(() => {
                          setCopiedShare(true);
                          setTimeout(() => setCopiedShare(false), 2000);
                        }).catch(() => {
                          setCopiedShare(true);
                          setTimeout(() => setCopiedShare(false), 2000);
                        });
                      }}
                      className="p-3 rounded-none transition-all duration-200 border-2 bg-bg-card border-border-subtle text-text-main hover:border-[#FF3E00] hover:text-[#FF3E00] relative flex items-center justify-center"
                      title="Compartilhar produto"
                    >
                      <Share2 className="w-5 h-5" />
                      <AnimatePresence>
                        {copiedShare && (
                          <motion.span
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.9 }}
                            className="absolute right-full mr-2 px-2 py-1 bg-text-main text-bg-main text-[9px] font-black uppercase whitespace-nowrap border border-border-subtle z-20"
                          >
                            COPIADO!
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  </div>
                </div>
                <p className="text-text-muted leading-relaxed mb-5 text-xs">
                  {product.description}
                </p>

                {/* Observations & Stock Section */}
                <div className="mb-6 space-y-3 border-l-2 border-[#FF3E00] pl-4 py-2 bg-bg-nested p-4 rounded-none">
                  <div className="text-xs text-text-main uppercase font-mono leading-relaxed">
                    <strong className="text-[#FF3E00] font-black tracking-widest uppercase block text-[9px] mb-1">[CONDIÇÕES & OBSERVAÇÕES]:</strong>
                    {product.observations}
                  </div>
                  <div className="text-xs text-text-muted uppercase font-mono flex items-center gap-2">
                    <span className="font-black tracking-widest text-[9px] text-text-dim uppercase">ESTOQUE DO ACERVO:</span>
                    <strong className="text-white bg-[#FF3E00] text-[10px] px-2 py-0.5 font-black">{product.stock} UNIDADE(S) DISPONÍVEL(IS)</strong>
                  </div>
                </div>

                {/* Specs Grid */}
                <h4 className="font-sans font-black text-[#FF3E00] text-[10px] tracking-widest mb-3 uppercase">
                  Especificações Técnicas
                </h4>
                <div className="grid grid-cols-1 gap-2.5 bg-bg-nested p-4 rounded-none border border-border-subtle mb-6 text-xs">
                  {Object.entries(product.specs).map(([key, value]) => {
                    const keyMatch = findGlossaryTerm(key);
                    const valMatch = findGlossaryTerm(value);

                    return (
                      <div key={`spec-${key}`} className="flex justify-between items-center py-1.5 border-b border-border-very-subtle last:border-0">
                        {keyMatch ? (
                          <Tooltip content={keyMatch.explanation} term={keyMatch.term}>
                            <span className="text-text-dim font-black tracking-widest uppercase text-[10px]">{key}</span>
                          </Tooltip>
                        ) : (
                          <span className="text-text-dim font-black tracking-widest uppercase text-[10px]">{key}</span>
                        )}

                        {valMatch ? (
                          <Tooltip content={valMatch.explanation} term={valMatch.term}>
                            <span className="text-text-main font-bold text-right max-w-[200px] truncate">{value}</span>
                          </Tooltip>
                        ) : (
                          <span className="text-text-main font-bold text-right max-w-[200px] truncate">{value}</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="space-y-3 mt-auto pt-4">
                  {/* Pricing comparison box */}
                  <div className="bg-bg-nested border border-border-subtle p-4 mb-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-dim font-black tracking-widest uppercase text-[9px]">PREÇO ORIGINAL</span>
                      <span className="text-text-dim line-through font-mono">
                        R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-dim font-black tracking-widest uppercase text-[9px]">DESCONTO ESPECIAL</span>
                      <span className="bg-[#FF3E00] text-white font-black text-[8px] tracking-widest px-1.5 py-0.5 uppercase">
                        45% OFF
                      </span>
                    </div>
                    <div className="border-t border-border-very-subtle pt-2 flex items-center justify-between">
                      <span className="text-[#FF3E00] font-black tracking-widest uppercase text-[9px]">VALOR COM DESCONTO</span>
                      <span className="text-2xl font-black italic tracking-tighter text-text-main font-sans">
                        R$ {(product.price * 0.55).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {isCheckoutSuccess ? (
                    <motion.div
                      initial={{ scale: 0.98, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="space-y-4 border-2 border-[#FF3E00] p-4 bg-bg-nested"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-[#FF3E00] text-white shrink-0">
                          <Check className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-sans font-black tracking-widest text-xs uppercase text-text-main">COMPRA SIMULADA COM SUCESSO!</p>
                          <p className="text-[10px] text-text-muted mt-0.5">Seu saldo fictício foi atualizado. Que tal deixar uma avaliação sobre o equipamento?</p>
                        </div>
                      </div>

                      {/* Integrated, clean Review Form */}
                      <form onSubmit={handleSubmitReview} className="space-y-3 pt-2 border-t border-border-very-subtle">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-[#FF3E00] font-black tracking-widest uppercase">AVALIAÇÃO DE AQUISIÇÃO</span>
                          
                          {/* Star Rating Selection */}
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                id={`star-btn-checkout-success-${star}`}
                                key={`star-btn-success-${star}`}
                                type="button"
                                onClick={() => setNewRating(star)}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(null)}
                                className="p-0.5 transition-transform duration-100 active:scale-110"
                              >
                                <Star
                                  className={`w-4 h-4 transition-colors duration-150 ${
                                    star <= (hoveredRating ?? newRating)
                                      ? 'fill-[#FF3E00] text-[#FF3E00]'
                                      : 'text-text-dim/40'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Comment text field */}
                        <div className="space-y-1">
                          <textarea
                            id="success-review-comment-textarea"
                            value={newComment}
                            onChange={(e) => {
                              setNewComment(e.target.value);
                              if (formError) setFormError('');
                            }}
                            placeholder="O QUE VOCÊ ACHOU DO EQUIPAMENTO? FALE SOBRE A SUA EXPERIÊNCIA DE COMPRA E QUALIDADE..."
                            className="w-full text-xs p-2.5 bg-bg-input border border-border-subtle focus:border-[#FF3E00] outline-none resize-none h-16 text-text-main rounded-none placeholder-text-dim"
                            maxLength={300}
                          />
                          <div className="flex justify-between text-[8px] font-mono text-text-dim">
                            <span>Comentário Opcional</span>
                            <span>{newComment.length}/300</span>
                          </div>
                        </div>

                        {formError && (
                          <div className="flex items-center gap-1.5 text-[#FF3E00] text-[10px] bg-[#FF3E00]/5 p-2 rounded-none border border-[#FF3E00]/15 font-mono">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{formError}</span>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button
                            id="btn-submit-review-success"
                            type="submit"
                            className="flex-1 py-2 bg-[#FF3E00] text-white font-black tracking-widest text-[10px] rounded-none hover:bg-[#ff551f] transition-all"
                          >
                            ENVIAR CRÍTICA
                          </button>
                          <button
                            id="btn-skip-review-success"
                            type="button"
                            onClick={() => {
                              setIsCheckoutSuccess(false);
                              setNewComment('');
                              setNewRating(0);
                              setFormError('');
                            }}
                            className="px-3 py-2 border border-border-subtle hover:border-text-main text-text-muted hover:text-text-main font-black tracking-widest text-[10px] rounded-none font-mono"
                          >
                            FECHAR
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-3">
                      {product.stock === 0 ? (
                        <div className="w-full space-y-4">
                          <div className="w-full py-4 bg-black border-2 border-border-subtle text-white font-black tracking-widest text-xs text-center uppercase select-none">
                            PRODUTO ESGOTADO / INDISPONÍVEL
                          </div>
                          
                          {/* Stock alert e-mail option */}
                          <div className="p-4 bg-bg-nested border border-border-subtle space-y-3">
                            <div className="flex items-center gap-2 text-text-main font-sans font-black text-[10px] tracking-widest uppercase">
                              <Mail className="w-4 h-4 text-[#FF3E00]" />
                              AVISE-ME POR E-MAIL QUANDO DISPONÍVEL
                            </div>
                            <p className="text-[10px] font-mono text-text-muted leading-relaxed uppercase">
                              Cadastre o seu e-mail para receber um alerta de envio simulado instantâneo assim que reabastecermos este lote!
                            </p>
                            
                            {isAlertRegistered ? (
                              <div className="p-3 bg-[#FF3E00]/10 border border-[#FF3E00]/20 text-center space-y-1">
                                <span className="text-[10px] font-black tracking-widest text-[#FF3E00] uppercase block">
                                  ✓ ALERTA DE REABASTECIMENTO ATIVO
                                </span>
                                <span className="text-[9px] font-mono text-text-muted block truncate">
                                  Destinatário: {stockEmail}
                                </span>
                              </div>
                            ) : (
                              <form onSubmit={handleRegisterStockAlert} className="space-y-2">
                                <div className="space-y-1">
                                  <label className="text-[8px] font-mono font-bold text-text-dim uppercase block">
                                    E-MAIL DO DESTINATÁRIO *
                                  </label>
                                  <input
                                    type="email"
                                    required
                                    value={stockEmail}
                                    onChange={(e) => setStockEmail(e.target.value)}
                                    placeholder="EX: SEU-EMAIL@DOMINIO.COM"
                                    className="w-full bg-bg-input border border-border-subtle p-2.5 text-xs text-text-main focus:outline-none focus:border-[#FF3E00] font-mono rounded-none"
                                  />
                                </div>
                                <button
                                  type="submit"
                                  id="btn-register-stock-alert"
                                  className="w-full py-2 bg-text-main hover:bg-[#FF3E00] hover:text-white text-bg-main text-[9px] font-black tracking-widest uppercase transition-colors rounded-none cursor-pointer"
                                >
                                  ATIVAR ALERTA DE E-MAIL
                                </button>
                              </form>
                            )}
                          </div>
                        </div>
                      ) : (
                        <>
                          <button
                            id="btn-add-to-cart-modal"
                            onClick={() => onAddToCart(product)}
                            className="flex-1 py-4 bg-text-main hover:opacity-90 text-bg-main font-black tracking-widest text-xs rounded-none transition-all duration-200 flex items-center justify-center gap-2 border-2 border-text-main active:translate-y-0.5"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            ADD CARRINHO
                          </button>
                          <button
                            id="btn-buy-simulator"
                            onClick={handleCheckoutSimulator}
                            className="flex-1 py-4 bg-[#FF3E00] hover:bg-[#ff551f] text-white font-black tracking-widest text-xs rounded-none transition-all duration-200 flex items-center justify-center gap-2 border-2 border-transparent active:translate-y-0.5"
                          >
                            SIMULAR COMPRA
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  <a
                    id="btn-original-link"
                    href={product.originalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 bg-bg-input hover:bg-bg-card text-text-main font-black tracking-widest text-xs rounded-none transition-all duration-200 flex items-center justify-center gap-2 border border-border-subtle hover:border-border-subtle"
                  >
                    <ExternalLink className="w-4 h-4 text-[#FF3E00]" />
                    PÁGINA ORIGINAL DO FABRICANTE
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Photos and Reviews */}
            <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col bg-bg-nested space-y-8">
              
              <div className="hidden md:block">
                {PhotosSection}
              </div>

              {/* Part 2: Comentários & Críticas */}
              <div>
                <h3 className="font-sans font-black text-text-main text-base md:text-lg uppercase tracking-tighter mb-4 hidden md:flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#FF3E00]" />
                  Comentários & Críticas ({productReviews.length})
                </h3>

                <div className="block md:hidden mb-4">
                  <button
                    onClick={() => setShowMobileReviews(!showMobileReviews)}
                    className="w-full py-3 bg-bg-input border border-border-subtle text-text-main font-black tracking-widest text-[10px] uppercase flex items-center justify-center gap-2 rounded-none"
                  >
                    {showMobileReviews ? 'OCULTAR AVALIAÇÕES' : 'VER AVALIAÇÕES DO PRODUTO'}
                  </button>
                </div>

                <div className={`${showMobileReviews ? 'block' : 'hidden'} md:block`}>

                {/* Dynamic Average Card */}
                <div className="bg-bg-card rounded-none p-4 border border-border-subtle mb-6 flex items-center justify-between">
                  <div>
                    <span className="text-text-dim text-[10px] font-black tracking-widest uppercase block">AVALIAÇÃO GERAL</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-4xl font-black text-text-main tracking-tighter">{averageRating.toFixed(1)}</span>
                      <span className="text-text-dim text-xs">/ 5.0</span>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={`star-avg-${star}`}
                        className={`w-4 h-4 ${
                          star <= Math.round(averageRating)
                            ? 'fill-[#FF3E00] text-[#FF3E00]'
                            : 'text-text-dim/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1 mb-6">
                  {productReviews.length === 0 ? (
                    <div className="text-center py-8 text-text-dim text-xs bg-bg-card/40 rounded-none border border-dashed border-border-subtle p-4">
                      Nenhuma crítica registrada para este item de tecnologia.
                    </div>
                  ) : (
                    productReviews.map((review, index) => (
                      <div
                        key={`${review.id}-${index}`}
                        className="bg-bg-card rounded-none p-4 border border-border-very-subtle flex flex-col"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-text-main text-xs uppercase tracking-tight">{review.username}</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={`star-rev-${review.id}-${star}`}
                                className={`w-3 h-3 ${
                                  star <= review.rating
                                    ? 'fill-[#FF3E00] text-[#FF3E00]'
                                    : 'text-text-dim/30'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-text-muted text-xs leading-relaxed">{review.comment}</p>
                        <span className="text-[9px] font-mono text-text-dim mt-2 text-right">
                          {new Date(review.createdAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Note about reviews being post-purchase only */}
                <div className="bg-bg-card border-2 border-dashed border-border-subtle rounded-none p-5 text-center space-y-3">
                  <span className="text-[10px] font-mono text-[#FF3E00] tracking-widest block uppercase font-bold">
                    SISTEMA DE AVALIAÇÃO RESTRITO
                  </span>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Para garantir que as avaliações sejam autênticas e provenientes de compradores reais, críticas técnicas só podem ser registradas logo após a simulação de compra deste equipamento.
                  </p>
                  <p className="text-[10px] text-[#FF3E00] font-mono uppercase">
                    Use o botão "Simular Compra" ao lado para testar!
                  </p>
                </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Photo Zoom Modal */}
      <AnimatePresence>
        {isZoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-black/95 backdrop-blur-md"
            id="photo-zoom-overlay"
          >
            {/* Top Bar inside Zoom */}
            <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
              <span className="text-[11px] font-mono font-black text-white/50 tracking-widest uppercase hidden sm:inline">
                FOTO {activeImageIndex + 1} DE {additionalPhotos.length}
              </span>
              <button
                id="btn-close-zoom"
                onClick={() => setIsZoomOpen(false)}
                className="p-2.5 rounded-none bg-text-main text-bg-main hover:bg-[#FF3E00] hover:text-white transition-all border-2 border-text-main"
                title="Fechar zoom"
              >
                <X className="w-5 h-5 font-bold" />
              </button>
            </div>

            {/* Central Area: Photo Viewer with Navigation Arrows */}
            <div className="relative w-full max-w-4xl flex-1 flex items-center justify-center max-h-[70vh] my-4">
              {/* Previous Button */}
              <button
                id="btn-prev-zoom-photo"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex((prev) => (prev - 1 + additionalPhotos.length) % additionalPhotos.length);
                }}
                className="absolute left-2 md:-left-16 z-10 p-3 bg-black/60 hover:bg-[#FF3E00] text-white border-2 border-white/20 hover:border-white transition-all rounded-none"
                title="Anterior"
              >
                <span className="text-sm font-black">&lt;</span>
              </button>

              {/* Main zoomed photo (guaranteed to see whole image) */}
              <img
                src={additionalPhotos[activeImageIndex].url}
                alt={additionalPhotos[activeImageIndex].label}
                className="max-h-[65vh] max-w-full object-contain border border-white/10 shadow-2xl"
                referrerPolicy="no-referrer"
              />

              {/* Next Button */}
              <button
                id="btn-next-zoom-photo"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex((prev) => (prev + 1) % additionalPhotos.length);
                }}
                className="absolute right-2 md:-right-16 z-10 p-3 bg-black/60 hover:bg-[#FF3E00] text-white border-2 border-white/20 hover:border-white transition-all rounded-none"
                title="Próxima"
              >
                <span className="text-sm font-black">&gt;</span>
              </button>
            </div>

            {/* Bottom section matching the "Fotos Adicionais & Inspeção" design */}
            <div className="w-full max-w-3xl space-y-4">
              {/* Thumbnails to switch inside zoom */}
              <div className="flex justify-center gap-2">
                {additionalPhotos.map((photo, index) => {
                  const isActive = index === activeImageIndex;
                  return (
                    <button
                      key={`zoom-thumb-${index}`}
                      onClick={() => setActiveImageIndex(index)}
                      className={`w-16 md:w-20 aspect-video border-2 overflow-hidden bg-[#1a1c1e] transition-all duration-200 rounded-none ${
                        isActive 
                          ? 'border-[#FF3E00] scale-105 shadow-[0_0_10px_rgba(255,62,0,0.4)]' 
                          : 'border-white/25 hover:border-white'
                      }`}
                      title={photo.label}
                    >
                      <img
                        src={photo.url}
                        alt={photo.label}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  );
                })}
              </div>

              {/* Bottom Status Bar in the exact style of the "Fotos Adicionais & Inspeção" area */}
              <div className="bg-[#101112] border-2 border-white/10 p-4 flex items-start gap-3 rounded-none font-mono text-white">
                <Package className="w-5 h-5 text-[#FF3E00] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="text-[10px] font-black text-[#FF3E00] tracking-widest block uppercase mb-1">
                    {additionalPhotos[activeImageIndex].label} // INSPECIONADO EM ALTA RESOLUÇÃO
                  </span>
                  <p className="text-[10.5px] text-white/75 uppercase leading-relaxed font-mono">
                    {additionalPhotos[activeImageIndex].description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
