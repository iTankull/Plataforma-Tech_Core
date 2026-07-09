import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, ExternalLink, MessageSquare, Plus, AlertCircle, ShoppingBag, Check } from 'lucide-react';
import { Product, Review, User } from '../types';

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
}: ProductModalProps): React.JSX.Element {
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');

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
    if (!newComment.trim()) {
      setFormError('Escreva um comentário sobre sua experiência.');
      return;
    }
    if (newComment.length < 5) {
      setFormError('A sua avaliação deve ter pelo menos 5 caracteres.');
      return;
    }

    onAddReview(newRating, newComment);
    setNewComment('');
    setNewRating(5);
    setFormError('');
  };

  const handleCheckoutSimulator = () => {
    const success = onSimulatePurchase(product.id);
    if (success) {
      setIsCheckoutSuccess(true);
      setTimeout(() => {
        setIsCheckoutSuccess(false);
      }, 4000);
    }
  };

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
            className="relative w-full max-w-5xl bg-[#0A0A0A] border-2 border-white rounded-none shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] z-50 text-white"
          >
            {/* Close Button */}
            <button
              id="btn-close-modal"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-none bg-white text-black hover:bg-[#FF3E00] hover:text-white transition-all duration-200 border-2 border-white"
            >
              <X className="w-5 h-5 font-bold" />
            </button>

            {/* Left Column: Media & Specs */}
            <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto border-r border-white/10 flex flex-col">
              <div className="relative rounded-none overflow-hidden bg-[#151515] h-64 md:h-80 mb-6 border-2 border-white/10">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover grayscale opacity-80"
                  referrerPolicy="no-referrer"
                />
                <button
                  id="btn-fav-modal"
                  onClick={onToggleFavorite}
                  className={`absolute top-4 left-4 p-3 rounded-none transition-all duration-200 border-2 ${
                    isFavorite 
                      ? 'bg-[#FF3E00] border-[#FF3E00] text-white' 
                      : 'bg-black border-white/20 text-white hover:border-[#FF3E00] hover:text-[#FF3E00]'
                  }`}
                >
                  <Star
                    className={`w-5 h-5 ${isFavorite ? 'fill-white text-white' : ''}`}
                  />
                </button>
              </div>

              <div>
                <span className="text-[10px] font-black text-[#FF3E00] tracking-[0.2em] uppercase mb-1.5 block">
                  {product.category}
                </span>
                <h2 className="font-sans font-black text-white text-3xl md:text-4xl tracking-tighter uppercase mb-4">
                  {product.name}
                </h2>
                <p className="text-white/70 leading-relaxed mb-5 text-xs">
                  {product.description}
                </p>

                {/* Observations & Stock Section */}
                <div className="mb-6 space-y-3 border-l-2 border-[#FF3E00] pl-4 py-2 bg-white/5 p-4 rounded-none">
                  <div className="text-xs text-white/90 uppercase font-mono leading-relaxed">
                    <strong className="text-[#FF3E00] font-black tracking-widest uppercase block text-[9px] mb-1">[CONDIÇÕES & OBSERVAÇÕES]:</strong>
                    {product.observations}
                  </div>
                  <div className="text-xs text-white/60 uppercase font-mono flex items-center gap-2">
                    <span className="font-black tracking-widest text-[9px] text-white/40 uppercase">ESTOQUE DO ACERVO:</span>
                    <strong className="text-white bg-[#FF3E00] text-[10px] px-2 py-0.5 font-black">{product.stock} UNIDADE(S) DISPONÍVEL(IS)</strong>
                  </div>
                </div>

                {/* Specs Grid */}
                <h4 className="font-sans font-black text-[#FF3E00] text-[10px] tracking-widest mb-3 uppercase">
                  Especificações Técnicas
                </h4>
                <div className="grid grid-cols-1 gap-2.5 bg-white/5 p-4 rounded-none border border-white/10 mb-6 text-xs">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
                      <span className="text-white/40 font-black tracking-widest uppercase text-[10px]">{key}</span>
                      <span className="text-white font-bold text-right max-w-[200px] truncate">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="space-y-3 mt-auto pt-4">
                  {/* Pricing comparison box */}
                  <div className="bg-white/5 border border-white/10 p-4 mb-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40 font-black tracking-widest uppercase text-[9px]">PREÇO RECOMENDADO</span>
                      <span className="text-white/40 line-through font-mono">
                        R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40 font-black tracking-widest uppercase text-[9px]">DESCONTO ESPECIAL</span>
                      <span className="bg-[#FF3E00] text-white font-black text-[8px] tracking-widest px-1.5 py-0.5 uppercase">
                        45% OFF
                      </span>
                    </div>
                    <div className="border-t border-white/5 pt-2 flex items-center justify-between">
                      <span className="text-[#FF3E00] font-black tracking-widest uppercase text-[9px]">VALOR COM DESCONTO</span>
                      <span className="text-2xl font-black italic tracking-tighter text-white font-sans">
                        R$ {(product.price * 0.55).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {isCheckoutSuccess ? (
                    <motion.div
                      initial={{ scale: 0.98, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-4 bg-[#FF3E00] text-white rounded-none border-2 border-[#FF3E00] flex items-center justify-center gap-2.5"
                    >
                      <Check className="w-5 h-5 text-white animate-bounce" />
                      <div>
                        <p className="font-black tracking-widest text-xs uppercase">COMPRA SIMULADA COM SUCESSO!</p>
                        <p className="text-[10px] text-white/80">Seu saldo fictício foi atualizado se você estiver conectado.</p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        id="btn-add-to-cart-modal"
                        onClick={() => onAddToCart(product)}
                        className="flex-1 py-4 bg-white hover:bg-white/90 text-black font-black tracking-widest text-xs rounded-none transition-all duration-200 flex items-center justify-center gap-2 border-2 border-white active:translate-y-0.5"
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
                    </div>
                  )}

                  <a
                    id="btn-original-link"
                    href={product.originalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 bg-[#1A1A1A] hover:bg-[#252525] text-white font-black tracking-widest text-xs rounded-none transition-all duration-200 flex items-center justify-center gap-2 border border-white/10 hover:border-white/30"
                  >
                    <ExternalLink className="w-4 h-4 text-[#FF3E00]" />
                    PÁGINA ORIGINAL DO FABRICANTE
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Reviews & Adding Review */}
            <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col bg-[#0F0F0F]">
              <h3 className="font-sans font-black text-white text-lg uppercase tracking-tighter mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#FF3E00]" />
                Comentários & Críticas ({productReviews.length})
              </h3>

              {/* Dynamic Average Card */}
              <div className="bg-black rounded-none p-4 border border-white/10 mb-6 flex items-center justify-between">
                <div>
                  <span className="text-white/30 text-[10px] font-black tracking-widest uppercase block">AVALIAÇÃO GERAL</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-black text-white tracking-tighter">{averageRating.toFixed(1)}</span>
                    <span className="text-white/40 text-xs">/ 5.0</span>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(averageRating)
                          ? 'fill-[#FF3E00] text-[#FF3E00]'
                          : 'text-white/10'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 mb-6 flex-grow">
                {productReviews.length === 0 ? (
                  <div className="text-center py-8 text-white/30 text-xs bg-black/40 rounded-none border border-dashed border-white/10 p-4">
                    Nenhuma crítica registrada para este item de tecnologia.
                  </div>
                ) : (
                  productReviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-[#151515] rounded-none p-4 border border-white/5 flex flex-col"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-white text-xs uppercase tracking-tight">{review.username}</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= review.rating
                                  ? 'fill-[#FF3E00] text-[#FF3E00]'
                                  : 'text-white/10'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-white/70 text-xs leading-relaxed">{review.comment}</p>
                      <span className="text-[9px] font-mono text-white/40 mt-2 text-right">
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

              {/* Add Review Section */}
              <div className="bg-black border border-white/10 rounded-none p-5 mt-auto">
                <h4 className="font-sans font-black text-white text-[10px] tracking-widest uppercase mb-3">
                  REGISTRAR CRÍTICA TÉCNICA
                </h4>

                {currentUser ? (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    {/* Interactive Star Selection */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-white/50 font-black tracking-widest uppercase mr-1">SUA NOTA:</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            id={`star-btn-${star}`}
                            key={star}
                            type="button"
                            onClick={() => setNewRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(null)}
                            className="p-0.5 transition-transform duration-100 active:scale-110"
                          >
                            <Star
                              className={`w-5 h-5 transition-colors duration-150 ${
                                star <= (hoveredRating ?? newRating)
                                  ? 'fill-[#FF3E00] text-[#FF3E00]'
                                  : 'text-white/20'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Review Input */}
                    <div>
                      <textarea
                        id="review-comment-textarea"
                        value={newComment}
                        onChange={(e) => {
                          setNewComment(e.target.value);
                          if (formError) setFormError('');
                        }}
                        placeholder="O QUE VOCÊ ACHOU DO EQUIPAMENTO? FALE SOBRE DESEMPENHO, ERGONOMIA, MATERIAL..."
                        className="w-full text-xs p-3 bg-[#111] border border-white/10 focus:border-[#FF3E00] outline-none resize-none h-20 text-white rounded-none placeholder-white/20"
                        maxLength={300}
                      />
                      <div className="flex justify-between mt-0.5 text-[9px] font-mono text-white/30">
                        <span>Min. 5 caracteres</span>
                        <span>{newComment.length}/300</span>
                      </div>
                    </div>

                    {formError && (
                      <div className="flex items-center gap-1.5 text-[#FF3E00] text-xs bg-[#FF3E00]/10 p-2 rounded-none border border-[#FF3E00]/20">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}

                    <button
                      id="btn-submit-review"
                      type="submit"
                      className="w-full py-2.5 bg-white text-black hover:bg-[#FF3E00] hover:text-white font-black tracking-widest text-[10px] rounded-none transition-all duration-200"
                    >
                      ENVIAR CRÍTICA
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-4 space-y-3">
                    <p className="text-xs text-white/50 leading-relaxed">
                      Conecte-se à sua conta de usuário para salvar produtos como favoritos e enviar avaliações detalhadas.
                    </p>
                    <button
                      id="btn-login-to-review"
                      type="button"
                      onClick={onOpenAuth}
                      className="px-4 py-2 bg-white text-black hover:bg-[#FF3E00] hover:text-white text-xs font-black tracking-widest rounded-none transition-all duration-200 flex items-center justify-center gap-1.5 mx-auto"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      CONECTAR AGORA
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
