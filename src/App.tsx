import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Keyboard,
  Camera,
  Watch,
  Mic,
  Headphones,
  Monitor,
  Heart,
  Search,
  SlidersHorizontal,
  PlusCircle,
  DollarSign,
  LogOut,
  Star,
  Trash2,
  CheckCircle,
  TrendingUp,
  Info,
  ChevronDown,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  X,
  ShoppingCart,
  ArrowLeft,
  CreditCard,
  Send,
  Check,
  Tablet,
  Gamepad2,
  Volume2,
  Tv,
  Music,
  Coffee,
  Dices,
  BatteryCharging,
  Cpu,
  MousePointerClick
} from 'lucide-react';

import { Product, Review, User } from './types';
import { DEFAULT_PRODUCTS, DEFAULT_REVIEWS } from './data/products';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import AuthModal from './components/AuthModal';
import CartDrawer from './components/CartDrawer';
import CheckoutView from './components/CheckoutView';

const CATEGORIES = [
  { id: 'Todas', name: 'TODOS OS ITENS', icon: Compass },
  { id: 'Smartwatches', name: 'SMARTWATCHES', icon: Watch },
  { id: 'Earbuds', name: 'EARBUDS', icon: Headphones },
  { id: 'Headset & Headphones', name: 'HEADSET & HEADPHONES', icon: Headphones },
  { id: 'Keyboard', name: 'KEYBOARD', icon: Keyboard },
  { id: 'Mouse', name: 'MOUSE', icon: MousePointerClick },
  { id: 'Microfones', name: 'MICROFONES', icon: Mic },
  { id: 'Monitores Portáteis', name: 'MONITORES PORTÁTEIS', icon: Monitor },
  { id: 'eReaders', name: 'EREADERS', icon: Tablet },
  { id: 'Art Tablets', name: 'ART TABLETS', icon: Tablet },
  { id: 'Controles', name: 'CONTROLES', icon: Gamepad2 },
  { id: 'Caixas de Som', name: 'CAIXAS DE SOM', icon: Volume2 },
  { id: 'Projetores', name: 'PROJETORES', icon: Tv },
  { id: 'Drones', name: 'DRONES', icon: Compass },
  { id: 'Instrumentos Musicais', name: 'INSTRUMENTOS MUSICAIS', icon: Music },
  { id: 'Câmeras', name: 'CÂMERAS', icon: Camera },
  { id: 'Gimbals', name: 'GIMBALS', icon: Camera },
  { id: 'Utilitários para Café', name: 'UTILITÁRIOS PARA CAFÉ', icon: Coffee },
  { id: 'Board Games', name: 'BOARD GAMES', icon: Dices },
  { id: 'Consoles Portáteis', name: 'CONSOLES PORTÁTEIS', icon: Gamepad2 },
  { id: 'Foto/Filmagem', name: 'FOTO/FILMAGEM', icon: Camera },
  { id: 'Cosméticos & Perfumes', name: 'COSMÉTICOS & PERFUMES', icon: Sparkles },
  { id: 'Outdoor', name: 'OUTDOOR', icon: Compass },
  { id: 'Produtos para Casa', name: 'PRODUTOS PARA CASA', icon: Info },
  { id: 'Docks & PowerBanks', name: 'DOCKS & POWERBANKS', icon: BatteryCharging },
  { id: 'Hardware para PC', name: 'HARDWARE PARA PC', icon: Cpu },
  { id: 'Relógios Analógicos', name: 'RELÓGIOS ANALÓGICOS', icon: Watch },
];

const PRESET_PRODUCT_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=600', name: 'Teclado Gamer' },
  { url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&q=80&w=600', name: 'Câmera Vintage' },
  { url: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=600', name: 'Smartwatch Minimalista' },
  { url: 'https://images.unsplash.com/photo-1484755560695-a4c7402a50e9?auto=format&fit=crop&q=80&w=600', name: 'Microfone Condensador' },
  { url: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?auto=format&fit=crop&q=80&w=600', name: 'Monitor Gamer' }
];

export default function App(): React.JSX.Element {
  // --- Persistent States ---
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // --- Cart and Checkout States ---
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<'home' | 'checkout'>('home');
  const [salesCount, setSalesCount] = useState<number>(24);

  // --- Filtering / Sorting States ---
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [sortBy, setSortBy] = useState<string>('default');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);

  // --- UI Interactivity States ---
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [globalNotification, setGlobalNotification] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // --- Load Initial Data ---
  useEffect(() => {
    // Products
    const storedProducts = localStorage.getItem('tech_products');
    let loadedProducts = null;
    try {
      if (storedProducts) {
        const parsed = JSON.parse(storedProducts);
        if (parsed.length > 0 && parsed[0].stock !== undefined) {
          loadedProducts = parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }

    if (loadedProducts) {
      setProducts(loadedProducts);
    } else {
      setProducts(DEFAULT_PRODUCTS);
      localStorage.setItem('tech_products', JSON.stringify(DEFAULT_PRODUCTS));
    }

    // Reviews
    const storedReviews = localStorage.getItem('tech_reviews');
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    } else {
      setReviews(DEFAULT_REVIEWS);
      localStorage.setItem('tech_reviews', JSON.stringify(DEFAULT_REVIEWS));
    }

    // Current User
    const storedUser = localStorage.getItem('tech_current_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    // Cart Load
    const storedCart = localStorage.getItem('tech_cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }

    // Sales Count Load
    const storedSalesCount = localStorage.getItem('tech_sales_count');
    if (storedSalesCount) {
      setSalesCount(parseInt(storedSalesCount, 10));
    } else {
      setSalesCount(24);
      localStorage.setItem('tech_sales_count', '24');
    }
  }, []);

  // --- Save Cart to LocalStorage ---
  useEffect(() => {
    localStorage.setItem('tech_cart', JSON.stringify(cart));
  }, [cart]);

  // --- Load Favorites per User ---
  useEffect(() => {
    const userKey = currentUser ? `tech_favorites_${currentUser.id}` : 'tech_favorites_guest';
    const storedFavorites = localStorage.getItem(userKey);
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    } else {
      setFavorites([]);
    }
  }, [currentUser]);

  // --- Show Global Notification ---
  const triggerNotification = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setGlobalNotification({ text, type });
    setTimeout(() => {
      setGlobalNotification(null);
    }, 4000);
  };

  // --- Auth Handlers ---
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('tech_current_user', JSON.stringify(user));
    triggerNotification(`Conectado com sucesso como ${user.name}!`, 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('tech_current_user');
    triggerNotification('Você desconectou da sua conta.', 'info');
  };

  const handleAddFunds = () => {
    if (!currentUser) return;
    const updatedUser = {
      ...currentUser,
      balance: currentUser.balance + 5000,
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('tech_current_user', JSON.stringify(updatedUser));
    triggerNotification('Fundo fictício de R$ 5.000,00 adicionado!', 'success');
  };

  // --- Favorite Handlers ---
  const handleToggleFavorite = (productId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const userKey = currentUser ? `tech_favorites_${currentUser.id}` : 'tech_favorites_guest';
    
    let updatedFavorites: string[];
    if (favorites.includes(productId)) {
      updatedFavorites = favorites.filter((id) => id !== productId);
      triggerNotification('Item removido dos favoritos', 'info');
    } else {
      updatedFavorites = [...favorites, productId];
      triggerNotification('Item adicionado aos favoritos!', 'success');
    }
    setFavorites(updatedFavorites);
    localStorage.setItem(userKey, JSON.stringify(updatedFavorites));
  };

  // --- Reviews Handlers ---
  const handleAddReview = (rating: number, comment: string) => {
    if (!selectedProduct || !currentUser) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId: selectedProduct.id,
      username: currentUser.name,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem('tech_reviews', JSON.stringify(updatedReviews));

    // Re-calculate the product rating dynamically
    const productReviews = updatedReviews.filter(r => r.productId === selectedProduct.id);
    const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;

    const updatedProducts = products.map((prod) => {
      if (prod.id === selectedProduct.id) {
        return { ...prod, rating: avgRating };
      }
      return prod;
    });
    setProducts(updatedProducts);
    localStorage.setItem('tech_products', JSON.stringify(updatedProducts));

    // Update selected product state
    setSelectedProduct({ ...selectedProduct, rating: avgRating });
    triggerNotification('Sua crítica foi publicada com sucesso!', 'success');
  };

  // --- Cart Handlers ---
  const handleAddToCart = (product: Product) => {
    const dbProduct = products.find((p) => p.id === product.id) || product;
    const currentCartItem = cart.find((item) => item.product.id === product.id);
    const currentQtyInCart = currentCartItem ? currentCartItem.quantity : 0;

    if (currentQtyInCart >= dbProduct.stock) {
      triggerNotification(`Sem estoque disponível! Apenas ${dbProduct.stock} unidade(s) no acervo.`, 'error');
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    triggerNotification(`"${product.name}" adicionado ao carrinho!`, 'success');
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    triggerNotification('Item removido do carrinho.', 'info');
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    const dbProduct = products.find((p) => p.id === productId);
    const maxStock = dbProduct ? dbProduct.stock : 1;

    if (quantity > maxStock) {
      triggerNotification(`Estoque esgotado! Apenas ${maxStock} unidade(s) disponível(is) no acervo.`, 'error');
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // --- Buy Item Simulator Handler ---
  const handleSimulatePurchase = (productId: string): boolean => {
    const productToBuy = products.find((p) => p.id === productId);
    if (!productToBuy) return false;

    if (!currentUser) {
      setShowAuthModal(true);
      triggerNotification('Por favor, conecte-se à sua conta para simular a compra.', 'error');
      return false;
    }

    if (productToBuy.stock <= 0) {
      triggerNotification('Desculpe, este item já está esgotado!', 'error');
      return false;
    }

    const discountedPrice = productToBuy.price * 0.55;

    if (currentUser.balance < discountedPrice) {
      triggerNotification('Saldo fictício insuficiente! Adicione fundos clicando no seu saldo.', 'error');
      return false;
    }

    // Deduct money
    const updatedUser = {
      ...currentUser,
      balance: currentUser.balance - discountedPrice,
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('tech_current_user', JSON.stringify(updatedUser));

    // Decrement stock in database of items
    const updatedProducts = products.map((prod) => {
      if (prod.id === productId) {
        return { ...prod, stock: prod.stock - 1 };
      }
      return prod;
    });
    setProducts(updatedProducts);
    localStorage.setItem('tech_products', JSON.stringify(updatedProducts));

    // Update selected product state
    setSelectedProduct({ ...productToBuy, stock: productToBuy.stock - 1 });

    // Increment Sales Count
    const newSalesCount = salesCount + 1;
    setSalesCount(newSalesCount);
    localStorage.setItem('tech_sales_count', String(newSalesCount));

    triggerNotification(`Compra de "${productToBuy.name}" simulada com sucesso!`, 'success');
    return true;
  };

  // --- Filter and Sort Logic ---
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Category Filter
    if (selectedCategory !== 'Todas') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Favorites Only Filter
    if (showFavoritesOnly) {
      result = result.filter((p) => favorites.includes(p.id));
    }

    // Advanced Search system
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesCat = p.category.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesSpecs = Object.entries(p.specs).some(([k, v]) =>
          k.toLowerCase().includes(query) || String(v).toLowerCase().includes(query)
        );
        return matchesName || matchesCat || matchesDesc || matchesSpecs;
      });
    }

    // Sort Logic
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating-desc') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, selectedCategory, showFavoritesOnly, searchQuery, favorites, sortBy]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans antialiased selection:bg-[#FF3E00] selection:text-white pb-16">
      {/* Dynamic Header Banner Notification */}
      <AnimatePresence>
        {globalNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-6 py-4 rounded-none shadow-2xl border-2 border-white bg-black max-w-md text-white font-mono"
          >
            <CheckCircle className="w-5 h-5 text-[#FF3E00] shrink-0" />
            <span className="text-xs font-black tracking-widest uppercase">{globalNotification.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Navigation Header in Bold Typography Style */}
      <nav className="sticky top-0 bg-black/95 backdrop-blur-md border-b border-white/10 z-40">
        <div className="max-w-7xl mx-auto px-6 md:px-8 h-24 flex items-center justify-between gap-6">
          
          {/* Logo & Vibe */}
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => { setCurrentView('home'); setSelectedCategory('Todas'); setShowFavoritesOnly(false); }}>
            <div className="text-3xl md:text-4xl font-black tracking-tighter leading-none select-none">
              TECH<span className="text-[#FF3E00]">_</span>CORE
            </div>
          </div>

          {/* Search bar inside header in technical style */}
          <div className="hidden md:flex items-center flex-1 max-w-2xl relative">
            <input
              id="header-search-input"
              type="text"
              placeholder="PESQUISAR GADGET..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A1A1A] border-2 border-white/5 px-6 py-3.5 pl-12 text-xs font-black tracking-widest text-white focus:outline-none focus:border-[#FF3E00] focus:ring-0 placeholder-white/20 rounded-none transition-all duration-150 uppercase"
            />
            <Search className="w-4 h-4 text-[#FF3E00] absolute left-4.5" />
            <div className="absolute right-4 text-[9px] font-mono opacity-40">[ SEARCH_ON ]</div>
          </div>

          {/* Favorites counter, Cart and Account options */}
          <div className="flex items-center gap-6">
            
            {/* Saved Count */}
            <button
              id="header-saved-btn"
              onClick={() => {
                setCurrentView('home');
                setShowFavoritesOnly(!showFavoritesOnly);
                if (!showFavoritesOnly) setSelectedCategory('Todas');
              }}
              className={`hidden sm:flex flex-col items-end cursor-pointer ${showFavoritesOnly ? 'text-[#FF3E00]' : 'text-white/60 hover:text-white'}`}
            >
              <span className="text-[9px] font-black tracking-widest uppercase">FAVORITOS</span>
              <span className="text-lg font-black tracking-tighter flex items-center gap-1">
                {favorites.length}
                <Heart className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-[#FF3E00]' : ''}`} />
              </span>
            </button>

            {/* Cart Count */}
            <button
              id="header-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="flex flex-col items-end cursor-pointer text-white/60 hover:text-white relative"
            >
              <span className="text-[9px] font-black tracking-widest uppercase">CARRINHO</span>
              <span className="text-lg font-black tracking-tighter flex items-center gap-1">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
                <ShoppingCart className="w-3.5 h-3.5 text-[#FF3E00]" />
              </span>
            </button>

            {/* Profile / Login */}
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end hidden sm:flex text-right">
                  <span className="text-[10px] font-black tracking-widest text-white/50 uppercase">SALDO SIMULADO</span>
                  <button
                    id="header-btn-add-funds"
                    onClick={handleAddFunds}
                    className="text-xs font-black text-[#FF3E00] hover:text-white font-mono transition-colors duration-150"
                    title="Adicionar +R$ 5.000 fictícios"
                  >
                    R$ {currentUser.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </button>
                </div>

                <div className="w-12 h-12 bg-white flex items-center justify-center text-black font-black text-sm select-none border-2 border-white">
                  {currentUser.name.slice(0, 2).toUpperCase()}
                </div>

                <button
                  id="header-btn-logout"
                  onClick={handleLogout}
                  className="p-3 bg-[#1A1A1A] border border-white/15 text-white/60 hover:text-[#FF3E00] hover:border-[#FF3E00] transition-all duration-200"
                  title="Fazer Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="header-btn-login"
                onClick={() => setShowAuthModal(true)}
                className="px-5 py-3.5 bg-white text-black hover:bg-[#FF3E00] hover:text-white text-xs font-black tracking-widest uppercase rounded-none transition-all duration-200"
              >
                CRIAR PERFIL
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Container Grid with Sidebar and Main Feed */}
      <main className="max-w-7xl mx-auto px-6 md:px-8 pt-8">
        {currentView === 'checkout' ? (
          <CheckoutView
            cart={cart}
            currentUser={currentUser}
            onBackToCatalog={() => setCurrentView('home')}
            onClearCart={handleClearCart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
            onCompletePurchase={(totalWithDiscount) => {
              // Decrement stock in database of items
              const updatedProducts = products.map((prod) => {
                const cartItem = cart.find((item) => item.product.id === prod.id);
                if (cartItem) {
                  return { ...prod, stock: Math.max(0, prod.stock - cartItem.quantity) };
                }
                return prod;
              });
              setProducts(updatedProducts);
              localStorage.setItem('tech_products', JSON.stringify(updatedProducts));

              // If a product is currently viewed in details, update it
              if (selectedProduct) {
                const updatedSelected = updatedProducts.find((p) => p.id === selectedProduct.id);
                if (updatedSelected) {
                  setSelectedProduct(updatedSelected);
                }
              }

              // Deduct money from balance if logged in (optional simulation feature)
              if (currentUser) {
                const updatedUser = {
                  ...currentUser,
                  balance: Math.max(0, currentUser.balance - totalWithDiscount),
                };
                setCurrentUser(updatedUser);
                localStorage.setItem('tech_current_user', JSON.stringify(updatedUser));
              }
              
              // Increment Sales Count
              const totalItemsBought = cart.reduce((s, item) => s + item.quantity, 0);
              const newSalesCount = salesCount + totalItemsBought;
              setSalesCount(newSalesCount);
              localStorage.setItem('tech_sales_count', String(newSalesCount));

              triggerNotification(`Aquisição simulada de ${totalItemsBought} item(ns) concluída com sucesso!`, 'success');
              return true;
            }}
            onOpenAuth={() => setShowAuthModal(true)}
            onAddFunds={handleAddFunds}
          />
        ) : (
          <>
            {/* Dynamic Highlight Banner with Brutalist Slogan layout */}
            <div className="border-2 border-white bg-black p-8 md:p-12 mb-10 flex flex-col md:flex-row items-stretch justify-between gap-8 relative overflow-hidden">
          <div className="space-y-4 max-w-2xl relative z-10 flex flex-col justify-center">
            <div>
              <span className="bg-[#FF3E00] text-white px-3 py-1 text-[10px] font-black tracking-widest uppercase">
                OUTLET EXCLUSIVO // PRODUTOS NOVOS E LACRADOS
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] uppercase">
              REVENDAS PREMIUM <br />
              <span className="text-[#FF3E00]">COM DESCONTO_</span>
            </h2>
            <p className="text-white/60 text-xs md:text-sm leading-relaxed max-w-lg font-mono">
              Seja bem-vindo ao meu catálogo pessoal de revendas de tecnologia! São itens novos, lacrados na caixa ou nunca utilizados, que adquiri e agora estou revendendo bem abaixo do valor original de mercado. Todos contam com o desconto padrão incrível de 45% já aplicado sobre o valor de referência original. Aproveite para analisar os detalhes, ler as avaliações ou simular sua compra.
            </p>
          </div>

          <div className="w-full md:w-64 border-t-2 md:border-t-0 md:border-l-2 border-white/10 pt-6 md:pt-0 md:pl-8 flex flex-col justify-between shrink-0 font-mono">
            <div>
              <h4 className="text-[10px] font-black tracking-widest uppercase text-[#FF3E00] mb-3">DADOS DO ACERVO</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-white/40 uppercase">MEUS ITENS</span>
                  <span className="font-black">{products.length} GADGETS</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-white/40 uppercase">VENDAS</span>
                  <span className="font-black text-[#FF3E00]">{salesCount} CONCLUÍDAS</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-white/40 uppercase">DESCONTO PADRÃO</span>
                  <span className="font-black text-[#FF3E00]">45% FLAT</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white/5 border border-white/10 text-[9px] text-white/50 space-y-1.5 font-bold uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <span className="text-[#FF3E00]">✓</span> ENVIO IMEDIATO E SEGURO
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#FF3E00]">✓</span> PRODUTOS 100% NOVOS
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#FF3E00]">✓</span> CURADORIA INDEPENDENTE
              </div>
            </div>
          </div>
        </div>

        {/* Categories, Search and Filter Section in Sidebar layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Aside Sidebar */}
          <aside className="w-full lg:w-72 border-r border-white/10 pr-0 lg:pr-8 flex flex-col gap-8 lg:sticky lg:top-28 shrink-0">
            
            {/* Search Box on smaller screen, or filter display */}
            <div className="w-full md:hidden">
              <div className="relative">
                <input
                  id="mobile-search-input"
                  type="text"
                  placeholder="PESQUISAR GADGET..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1A1A1A] border-2 border-white/5 px-4 py-3 pl-10 text-xs font-black tracking-widest text-white focus:outline-none focus:border-[#FF3E00] placeholder-white/20 uppercase"
                />
                <Search className="w-4 h-4 text-[#FF3E00] absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Technical Categories selector */}
            <div className="w-full">
              <h3 className="text-[10px] font-black tracking-[0.25em] mb-4 text-[#FF3E00] uppercase">LISTA DE CATEGORIAS</h3>
              <ul className="space-y-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.id && !showFavoritesOnly;
                  return (
                    <li
                      id={`cat-item-${cat.id}`}
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setShowFavoritesOnly(false);
                      }}
                      className={`text-sm font-black tracking-tight cursor-pointer uppercase py-1 border-b transition-all duration-150 flex items-center justify-between ${
                        isActive
                          ? 'text-[#FF3E00] border-[#FF3E00] pl-2'
                          : 'text-white/60 hover:text-white border-white/5 hover:border-white/20'
                      }`}
                    >
                      <span>{cat.id === 'Todas' ? 'TODOS OS GADGETS' : cat.id.toUpperCase()}</span>
                      <span className="text-[10px] font-mono opacity-30">
                        {isActive ? '[x]' : '[-]'}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Dynamic Filter options */}
            <div className="w-full space-y-6">
              <div>
                <h3 className="text-[10px] font-black tracking-[0.25em] mb-3 text-white/40 uppercase">FILTRAR / ORDENAR</h3>
                
                {/* Favorites Trigger button styled */}
                <button
                  id="btn-filter-favorites"
                  onClick={() => {
                    setShowFavoritesOnly(!showFavoritesOnly);
                    if (!showFavoritesOnly) setSelectedCategory('Todas');
                  }}
                  className={`w-full text-left py-2 px-3 border-2 font-black tracking-widest text-[9px] uppercase transition-all flex items-center justify-between ${
                    showFavoritesOnly 
                      ? 'bg-[#FF3E00] border-[#FF3E00] text-white' 
                      : 'bg-black border-white/10 text-white/50 hover:text-white hover:border-white/30'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5" />
                    APENAS FAVORITADOS
                  </span>
                  <span>({favorites.length})</span>
                </button>
              </div>

              {/* Sort selector stylized */}
              <div>
                <label className="text-[9px] font-black tracking-widest text-white/40 uppercase block mb-2">ORDEM DE EXIBIÇÃO</label>
                <div className="relative">
                  <select
                    id="select-sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-[#111] border-2 border-white/10 text-white font-black tracking-widest text-[10px] px-3.5 py-2.5 outline-none rounded-none cursor-pointer appearance-none uppercase"
                  >
                    <option value="default">DESTAQUE / PADRÃO</option>
                    <option value="price-asc">PREÇO: MENOR PARA MAIOR</option>
                    <option value="price-desc">PREÇO: MAIOR PARA MENOR</option>
                    <option value="rating-desc">MELHORES CRÍTICAS</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#FF3E00] absolute right-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              {/* Clear filters trigger */}
              {(searchQuery || selectedCategory !== 'Todas' || showFavoritesOnly || sortBy !== 'default') && (
                <button
                  id="btn-reset-filters"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Todas');
                    setShowFavoritesOnly(false);
                    setSortBy('default');
                    triggerNotification('Todos os filtros e buscas limpos', 'info');
                  }}
                  className="w-full py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black tracking-widest uppercase border border-white/20"
                >
                  LIMPAR FILTROS ATIVOS
                </button>
              )}
            </div>
          </aside>
            
          {/* Main Grid feed for products */}
          <div className="flex-1 w-full">
            
            {/* Active search tag and counts */}
            {(searchQuery || selectedCategory !== 'Todas' || showFavoritesOnly || sortBy !== 'default') && (
              <div className="bg-[#111] border border-white/10 p-4 mb-6 text-xs font-mono flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-white/60">
                  <Info className="w-4 h-4 text-[#FF3E00]" />
                  <span>
                    Exibindo <strong className="text-white">{filteredAndSortedProducts.length}</strong> gadgets correspondentes
                  </span>
                </div>
                {searchQuery && (
                  <span className="text-white/40">Busca: "{searchQuery}"</span>
                )}
              </div>
            )}

            {/* Products listings render area */}
            <AnimatePresence mode="popLayout">
              {filteredAndSortedProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20 bg-[#111] border-2 border-dashed border-white/10 p-8"
                >
                  <ShoppingBag className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <h4 className="font-sans font-black text-white text-lg uppercase tracking-widest mb-2">NENHUM GADGET ENCONTRADO</h4>
                  <p className="text-white/60 text-xs font-mono leading-relaxed max-w-sm mx-auto mb-6">
                    A pesquisa atual não retornou resultados no banco de dados. Modifique as palavras-chave ou limpe as categorias selecionadas.
                  </p>
                  <button
                    id="btn-empty-reset"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('Todas');
                      setShowFavoritesOnly(false);
                      setSortBy('default');
                    }}
                    className="px-5 py-3 bg-[#FF3E00] hover:bg-[#ff551f] text-white text-[10px] font-black tracking-widest uppercase"
                  >
                    EXIBIR TODOS OS PRODUTOS
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  id="products-grid-container"
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8"
                >
                  {filteredAndSortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isFavorite={favorites.includes(product.id)}
                      onToggleFavorite={(e) => handleToggleFavorite(product.id, e)}
                      onClickDetails={() => setSelectedProduct(product)}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-24 border-t border-white/10 bg-black py-10 text-xs text-white/40 font-mono">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-center sm:text-left tracking-wide">
            TECH_CORE GLOBAL MARKETPLACE // ALL RIGHTS RESERVED 2026
          </p>
          <div className="flex gap-6 tracking-widest uppercase text-[10px] font-black">
            <a href="https://google.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF3E00] transition-colors">Termos</a>
            <a href="https://google.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF3E00] transition-colors">Privacidade</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF3E00] transition-colors flex items-center gap-1">
              Github <ExternalLink className="w-3.5 h-3.5 text-[#FF3E00]" />
            </a>
          </div>
        </div>
      </footer>

      {/* MODALS CONTAINER */}
      
      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          reviews={reviews}
          currentUser={currentUser}
          onClose={() => setSelectedProduct(null)}
          onAddReview={handleAddReview}
          isFavorite={favorites.includes(selectedProduct.id)}
          onToggleFavorite={() => handleToggleFavorite(selectedProduct.id)}
          onOpenAuth={() => {
            setSelectedProduct(null);
            setShowAuthModal(true);
          }}
          onSimulatePurchase={handleSimulatePurchase}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* User Login/Register Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
        />
      )}

      {/* Cart Slider Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onGoToCheckout={() => setCurrentView('checkout')}
      />
    </div>
  );
}
