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
  ArrowUpRight,
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
  Sun,
  Moon,
  MousePointerClick,
  Bell,
  Mail
} from 'lucide-react';

import { Product, Review, User, Purchase, PurchaseItem, StockAlert, InAppNotification, SimulatedEmail } from './types';
import { DEFAULT_PRODUCTS, DEFAULT_REVIEWS } from './data/products';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import AuthModal from './components/AuthModal';
import CartDrawer from './components/CartDrawer';
import CheckoutView from './components/CheckoutView';
import ProfileDrawer from './components/ProfileDrawer';

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
  // --- Theme State & Persistence ---
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // --- Persistent States ---
  const [products, setProducts] = useState<Product[]>(() => {
    const storedProducts = localStorage.getItem('tech_products');
    if (storedProducts) {
      try {
        const parsed = JSON.parse(storedProducts);
        if (parsed.length > 0 && parsed[0].stock !== undefined) {
          return parsed;
        }
      } catch (e) {}
    }
    return DEFAULT_PRODUCTS;
  });
  const [reviews, setReviews] = useState<Review[]>(() => {
    const storedReviews = localStorage.getItem('tech_reviews');
    if (storedReviews) {
      try {
        return JSON.parse(storedReviews);
      } catch(e) {}
    }
    return DEFAULT_REVIEWS;
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // --- Cart and Checkout States ---
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [purchases, setPurchases] = useState<Purchase[]>(() => {
    const saved = localStorage.getItem('tech_purchases');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [currentView, setCurrentView] = useState<'home' | 'checkout'>('home');
  const [salesCount, setSalesCount] = useState<number>(24);

  useEffect(() => {
    localStorage.setItem('tech_purchases', JSON.stringify(purchases));
  }, [purchases]);

  // --- Filtering / Sorting States ---
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Todas']);
  const [sortBy, setSortBy] = useState<string>('default');

  const handleToggleCategory = (categoryId: string) => {
    setShowFavoritesOnly(false);
    if (categoryId === 'Todas') {
      setSelectedCategories(['Todas']);
    } else {
      setSelectedCategories((prev) => {
        const clean = prev.filter((id) => id !== 'Todas');
        if (clean.includes(categoryId)) {
          const filtered = clean.filter((id) => id !== categoryId);
          return filtered.length === 0 ? ['Todas'] : filtered;
        }
        return [...clean, categoryId];
      });
    }
  };
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(6000);

  // --- UI Interactivity States ---
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [globalNotification, setGlobalNotification] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Recently Added products (Desktop Only) - We'll take a diverse set of 4 products to look amazing.
  // E.g., the items with IDs: keychron-k2, sony-a6400, apple-watch-s9, shure-mv7
  // If they don't exist, we fallback to slicing the first 4 products of the catalog.
  const recentlyAddedProducts = useMemo(() => {
    const targetIds = ['keychron-k2', 'sony-a6400', 'apple-watch-s9', 'shure-mv7'];
    const selected = products.filter(p => targetIds.includes(p.id));
    if (selected.length === 4) return selected;
    return products.slice(0, 4);
  }, [products]);

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

  // --- Deep Link Product Loading ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prodId = params.get('product');
    if (prodId) {
      const found = products.find((p) => p.id === prodId);
      if (found) {
        setSelectedProduct(found);
      }
    }
  }, [products]);

  // --- Sync Selected Product with URL ---
  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedProduct) {
      url.searchParams.set('product', selectedProduct.id);
    } else {
      url.searchParams.delete('product');
    }
    window.history.replaceState({}, '', url.pathname + url.search + url.hash);
  }, [selectedProduct]);

  // --- Show Global Notification ---
  const triggerNotification = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setGlobalNotification({ text, type });
    setTimeout(() => {
      setGlobalNotification(null);
    }, 4000);
  };

  // --- Stock Alert & Notification States ---
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>(() => {
    try {
      const stored = localStorage.getItem('tech_stock_alerts');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [inAppNotifications, setInAppNotifications] = useState<InAppNotification[]>(() => {
    try {
      const stored = localStorage.getItem('tech_in_app_notifications');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [simulatedEmail, setSimulatedEmail] = useState<SimulatedEmail | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('tech_stock_alerts', JSON.stringify(stockAlerts));
  }, [stockAlerts]);

  useEffect(() => {
    localStorage.setItem('tech_in_app_notifications', JSON.stringify(inAppNotifications));
  }, [inAppNotifications]);

  useEffect(() => {
    // One-time update of all products to have stock
    const initialized = localStorage.getItem('tech_stock_init_v2');
    if (!initialized) {
      const updated = products.map(p => ({ ...p, stock: Math.max(p.stock, 5) }));
      setProducts(updated);
      localStorage.setItem('tech_products', JSON.stringify(updated));
      localStorage.setItem('tech_stock_init_v2', 'true');
    }
  }, []);

  const handleDeleteNotification = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setInAppNotifications(prev => prev.filter(n => n.id !== id));
    triggerNotification('Notificação apagada.', 'info');
  };

  const handleClearAllNotifications = () => {
    setInAppNotifications([]);
    triggerNotification('Todas as notificações foram apagadas.', 'info');
  };

  const handleRestockAll = () => {
    const updated = products.map((prod) => {
      const oldStock = prod.stock;
      const newStock = 10;

      if (oldStock === 0) {
        // Trigger Email Alerts
        const activeAlerts = stockAlerts.filter(a => a.productId === prod.id);
        if (activeAlerts.length > 0) {
          const alertToSend = activeAlerts[0];
          setSimulatedEmail({
            to: alertToSend.email,
            subject: `⚡ O SEU FAVORITO "${prod.name.toUpperCase()}" VOLTOU AO ESTOQUE!`,
            body: `Olá! Temos ótimas notícias para você.\n\nO equipamento "${prod.name}" que você tanto queria e cadastrou alerta está de volta ao nosso acervo!\n\nEle foi adicionado recentemente e conta com o nosso desconto padrão de 45% FLAT já aplicado sobre o valor original.\n\nAproveite e finalize sua compra simulada antes que acabe novamente!`,
            date: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            productName: prod.name,
            productImage: prod.image
          });
          setStockAlerts(prev => prev.filter(a => a.productId !== prod.id));
        }

        // Trigger In-App Notification if favorited
        const isFav = favorites.includes(prod.id);
        if (isFav) {
          const newNotif: InAppNotification = {
            id: `notif-${Date.now()}-${prod.id}`,
            productId: prod.id,
            productName: prod.name,
            productImage: prod.image,
            message: `O item "${prod.name}" que você favoritou quando estava esgotado acaba de receber reabastecimento recente no catálogo! Aproveite!`,
            date: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            read: false
          };
          setInAppNotifications(prev => [newNotif, ...prev]);
          triggerNotification(`Alerta: "${prod.name}" está disponível novamente!`, 'success');
        }
      }

      return { ...prod, stock: newStock };
    });

    setProducts(updated);
    localStorage.setItem('tech_products', JSON.stringify(updated));

    if (selectedProduct) {
      setSelectedProduct({ ...selectedProduct, stock: 10 });
    }

    triggerNotification('Todos os produtos reabastecidos com estoque!', 'success');
  };

  const handleZeroAllStock = () => {
    const updated = products.map(prod => ({ ...prod, stock: 0 }));
    setProducts(updated);
    localStorage.setItem('tech_products', JSON.stringify(updated));

    if (selectedProduct) {
      setSelectedProduct({ ...selectedProduct, stock: 0 });
    }

    triggerNotification('Todos os estoques foram zerados para testes!', 'info');
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    const productToUpdate = products.find(p => p.id === productId);
    if (!productToUpdate) return;

    const oldStock = productToUpdate.stock;

    const updatedProducts = products.map((prod) => {
      if (prod.id === productId) {
        return { ...prod, stock: newStock };
      }
      return prod;
    });
    setProducts(updatedProducts);
    localStorage.setItem('tech_products', JSON.stringify(updatedProducts));

    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct({ ...selectedProduct, stock: newStock });
    }

    if (oldStock === 0 && newStock > 0) {
      // Trigger Email Alerts
      const activeAlerts = stockAlerts.filter(a => a.productId === productId);
      if (activeAlerts.length > 0) {
        const alertToSend = activeAlerts[0];
        setSimulatedEmail({
          to: alertToSend.email,
          subject: `⚡ O SEU FAVORITO "${productToUpdate.name.toUpperCase()}" VOLTOU AO ESTOQUE!`,
          body: `Olá! Temos ótimas notícias para você.\n\nO equipamento "${productToUpdate.name}" que você tanto queria e cadastrou alerta está de volta ao nosso acervo!\n\nEle foi adicionado recentemente e conta com o nosso desconto padrão de 45% FLAT já aplicado sobre o valor original.\n\nAproveite e finalize sua compra simulada antes que acabe novamente!`,
          date: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          productName: productToUpdate.name,
          productImage: productToUpdate.image
        });

        setStockAlerts(prev => prev.filter(a => a.productId !== productId));
      }

      // Trigger In-App Notification if favorited
      const isFav = favorites.includes(productId);
      if (isFav) {
        const newNotif: InAppNotification = {
          id: `notif-${Date.now()}`,
          productId: productId,
          productName: productToUpdate.name,
          productImage: productToUpdate.image,
          message: `O item "${productToUpdate.name}" que você favoritou quando estava esgotado acaba de receber reabastecimento recente no catálogo! Aproveite!`,
          date: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          read: false
        };
        setInAppNotifications(prev => [newNotif, ...prev]);
        triggerNotification(`Alerta: "${productToUpdate.name}" está disponível novamente!`, 'success');
      }
    }
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
  const handleAddReview = (rating: number, comment: string, productId?: string) => {
    const targetProductId = productId || selectedProduct?.id;
    if (!targetProductId || !currentUser) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId: targetProductId,
      username: currentUser.name,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem('tech_reviews', JSON.stringify(updatedReviews));

    // Re-calculate the product rating dynamically
    const productReviews = updatedReviews.filter(r => r.productId === targetProductId);
    const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;

    const updatedProducts = products.map((prod) => {
      if (prod.id === targetProductId) {
        return { ...prod, rating: avgRating };
      }
      return prod;
    });
    setProducts(updatedProducts);
    localStorage.setItem('tech_products', JSON.stringify(updatedProducts));

    // Update selected product state
    if (selectedProduct && selectedProduct.id === targetProductId) {
      setSelectedProduct({ ...selectedProduct, rating: avgRating });
    }
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

    // Record purchase inside the purchase history list
    const orderId = `TC-${Math.floor(100000 + Math.random() * 900000)}`;
    const newPurchase: Purchase = {
      id: orderId,
      date: new Date().toISOString(),
      userId: currentUser.id,
      total: discountedPrice,
      deliveryDetails: 'RETIRADA EM: ESTAÇÃO TIRADENTES (METRÔ LINHA 1-AZUL) (A COMBINAR)',
      items: [
        {
          productId: productToBuy.id,
          name: productToBuy.name,
          image: productToBuy.image,
          pricePaid: discountedPrice,
          quantity: 1,
        }
      ]
    };
    setPurchases(prev => [newPurchase, ...prev]);

    triggerNotification(`Compra de "${productToBuy.name}" simulada com sucesso!`, 'success');
    return true;
  };

  // --- Filter and Sort Logic ---
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Category Filter
    if (!selectedCategories.includes('Todas') && selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    // Favorites Only Filter
    if (showFavoritesOnly) {
      result = result.filter((p) => favorites.includes(p.id));
    }

    // Advanced Search system - limited to product title (name) and category (badge) for better results (accent-insensitive)
    if (searchQuery.trim()) {
      const removeAccents = (str: string) =>
        str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      const query = removeAccents(searchQuery.toLowerCase().trim());
      result = result.filter((p) => {
        const matchesName = removeAccents(p.name.toLowerCase()).includes(query);
        const matchesCat = removeAccents(p.category.toLowerCase()).includes(query);
        return matchesName || matchesCat;
      });
    }

    // Price Filter
    if (maxPriceFilter < 6000) {
      result = result.filter((p) => (p.price * 0.55) <= maxPriceFilter);
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
  }, [products, selectedCategories, showFavoritesOnly, searchQuery, favorites, sortBy, maxPriceFilter]);

  return (
    <div className="min-h-screen bg-bg-main text-text-main font-sans antialiased selection:bg-[#FF3E00] selection:text-white pb-16">
      {/* Dynamic Header Banner Notification */}
      <AnimatePresence>
        {globalNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-6 py-4 rounded-none shadow-2xl border-2 border-border-main bg-bg-card max-w-md text-text-main font-mono"
          >
            <CheckCircle className="w-5 h-5 text-[#FF3E00] shrink-0" />
            <span className="text-xs font-black tracking-widest uppercase">{globalNotification.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Navigation Header in Bold Typography Style */}
      <nav className="sticky top-0 bg-bg-card/95 backdrop-blur-md border-b border-border-subtle z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 py-3.5 md:py-0 md:h-24 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6">
          
          {/* Row 1: Logo & Controls (Controls on mobile, logo always) */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            {/* Logo & Vibe */}
            <div className="flex items-center gap-2 sm:gap-4 cursor-pointer shrink-0" onClick={() => { setCurrentView('home'); setSelectedCategories(['Todas']); setShowFavoritesOnly(false); }}>
              <div className="text-xl sm:text-2xl md:text-4xl font-black tracking-tighter leading-none select-none">
                TECH<span className="text-[#FF3E00]">_</span>CORE
              </div>
            </div>

            {/* Mobile Controls: Theme, Profile, Logout (stay on the same line as the logo) */}
            <div className="flex md:hidden items-center gap-1.5 sm:gap-2">
              {/* Theme Switcher */}
              <button
                onClick={() => {
                  setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
                  triggerNotification(`Modo ${theme === 'light' ? 'Escuro' : 'Claro'} ativado!`, 'info');
                }}
                className="p-2 bg-bg-input border border-border-subtle text-text-muted hover:text-[#FF3E00] hover:border-[#FF3E00] transition-all duration-150"
                title={theme === 'light' ? 'Ativar Modo Escuro' : 'Ativar Modo Claro'}
              >
                {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              </button>

              {/* Profile / Login */}
              {currentUser ? (
                <div className="flex items-center gap-1.5">
                  <div
                    onClick={() => setIsProfileOpen(true)}
                    className="w-8 h-8 bg-text-main hover:bg-[#FF3E00] flex items-center justify-center text-bg-main hover:text-white font-black text-xs select-none border-2 border-text-main hover:border-[#FF3E00] cursor-pointer transition-all duration-150 shrink-0"
                    title="Ver meu perfil e histórico de compras"
                  >
                    {currentUser.name.slice(0, 2).toUpperCase()}
                  </div>

                  <button
                    onClick={handleLogout}
                    className="p-2 bg-bg-input border border-border-subtle text-text-muted hover:text-[#FF3E00] hover:border-[#FF3E00] transition-all duration-150"
                    title="Fazer Logout"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-2.5 py-2 bg-text-main text-bg-main hover:bg-[#FF3E00] hover:text-white text-[10px] font-black tracking-wider uppercase rounded-none transition-all duration-150"
                >
                  LOGIN
                </button>
              )}
            </div>
          </div>

          {/* Search bar inside header in technical style */}
          <div className="hidden lg:flex items-center flex-1 max-w-2xl relative">
            <input
              id="header-search-input"
              type="text"
              placeholder="PESQUISAR GADGET..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-input border-2 border-border-very-subtle px-6 py-3.5 pl-12 text-xs font-black tracking-widest text-text-main focus:outline-none focus:border-[#FF3E00] focus:ring-0 placeholder-text-dim rounded-none transition-all duration-150 uppercase"
            />
            <Search className="w-4 h-4 text-[#FF3E00] absolute left-4.5" />
            <div className="absolute right-4 text-[9px] font-mono text-text-dim">[ SEARCH_ON ]</div>
          </div>

          {/* Row 2 on mobile: Favorites, Cart and Notification options (Full width grids) / Flex layout on desktop */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6 shrink-0 w-full md:w-auto">
            <div className={`w-full md:w-auto grid ${currentUser ? 'grid-cols-3' : 'grid-cols-2'} md:flex md:items-center gap-1.5 sm:gap-2.5 md:gap-6 border-t md:border-t-0 border-border-very-subtle/40 pt-2.5 md:pt-0`}>
              
              {/* Saved Count */}
              {currentUser && (
                <button
                  id="header-saved-btn"
                  onClick={() => {
                    setCurrentView('home');
                    setShowFavoritesOnly(!showFavoritesOnly);
                    if (!showFavoritesOnly) setSelectedCategories(['Todas']);
                  }}
                  className={`flex flex-col md:items-end items-center justify-center py-2 px-1 bg-bg-input md:bg-transparent border md:border-0 border-border-subtle/30 cursor-pointer ${showFavoritesOnly ? 'text-[#FF3E00] border-[#FF3E00]/30 bg-[#FF3E00]/5' : 'text-text-muted hover:text-text-main'}`}
                >
                  <span className="text-[8px] md:text-[9px] font-black tracking-widest uppercase">FAVORITOS</span>
                  <span className="text-xs sm:text-sm md:text-lg font-black tracking-tighter flex items-center gap-1">
                    {favorites.length}
                    <Heart className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-[#FF3E00]' : ''}`} />
                  </span>
                </button>
              )}

              {/* Cart Count */}
              <button
                id="header-cart-btn"
                onClick={() => setIsCartOpen(true)}
                className="flex flex-col md:items-end items-center justify-center py-2 px-1 bg-bg-input md:bg-transparent border md:border-0 border-border-subtle/30 cursor-pointer text-text-muted hover:text-text-main"
              >
                <span className="text-[8px] md:text-[9px] font-black tracking-widest uppercase">CARRINHO</span>
                <span className="text-xs sm:text-sm md:text-lg font-black tracking-tighter flex items-center gap-1">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  <ShoppingCart className="w-3.5 h-3.5 text-[#FF3E00]" />
                </span>
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  id="header-notif-btn"
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="w-full flex flex-col md:items-end items-center justify-center py-2 px-1 bg-bg-input md:bg-transparent border md:border-0 border-border-subtle/30 cursor-pointer text-text-muted hover:text-text-main"
                  title="Notificações Internas"
                >
                  <span className="text-[8px] md:text-[9px] font-black tracking-widest uppercase">AVISOS</span>
                  <span className="text-xs sm:text-sm md:text-lg font-black tracking-tighter flex items-center gap-1">
                    {inAppNotifications.filter(n => !n.read).length}
                    <Bell className={`w-3.5 h-3.5 ${inAppNotifications.some(n => !n.read) ? 'text-[#FF3E00] animate-bounce' : 'text-text-dim'}`} />
                  </span>
                </button>
                
                {/* Notification Popover Dropdown */}
                <AnimatePresence>
                  {isNotificationOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="absolute -right-3 sm:right-0 mt-3 w-[290px] sm:w-80 bg-bg-card border-2 border-border-main shadow-2xl p-4 z-50 font-mono text-xs text-text-main"
                    >
                      <div className="flex items-center justify-between border-b border-border-very-subtle pb-2 mb-3 gap-2">
                        <span className="font-black text-[10px] tracking-widest uppercase text-[#FF3E00] whitespace-nowrap">
                          CENTRAL DE AVISOS
                        </span>
                        {inAppNotifications.length > 0 && (
                          <div className="flex items-center gap-2 shrink-0 select-none">
                            <button
                              onClick={() => {
                                setInAppNotifications(prev => prev.map(n => ({ ...n, read: true })));
                                triggerNotification('Todas as notificações marcadas como lidas', 'info');
                              }}
                              className="text-[8px] font-black tracking-wider text-text-dim hover:text-[#FF3E00] uppercase cursor-pointer whitespace-nowrap"
                              title="Marcar todas as notificações como lidas"
                            >
                              [ MARCAR LIDOS ]
                            </button>
                            <span className="text-text-dim/50 text-[8px]">|</span>
                            <button
                              onClick={handleClearAllNotifications}
                              className="p-1 text-text-dim hover:text-[#FF3E00] transition-colors cursor-pointer flex items-center justify-center rounded hover:bg-bg-nested"
                              title="Apagar permanentemente todas as notificações"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                        {inAppNotifications.length === 0 ? (
                          <div className="text-center py-6 text-text-dim text-[10px] uppercase font-bold">
                            Nenhuma notificação por enquanto.
                          </div>
                        ) : (
                          inAppNotifications.map((notif, index) => (
                            <div
                              key={`${notif.id}-${index}`}
                              onClick={() => {
                                const foundProd = products.find(p => p.id === notif.productId);
                                if (foundProd) {
                                  setSelectedProduct(foundProd);
                                }
                                setInAppNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
                                setIsNotificationOpen(false);
                              }}
                              className={`p-2.5 border transition-all duration-150 cursor-pointer flex gap-3 items-center relative group ${
                                notif.read ? 'bg-bg-nested border-border-very-subtle/50 text-text-muted' : 'bg-bg-nested border-[#FF3E00]/30 text-text-main hover:border-[#FF3E00]'
                              }`}
                            >
                              <img
                                src={notif.productImage}
                                alt={notif.productName}
                                className="w-8 h-8 object-cover border border-border-subtle bg-bg-card shrink-0"
                              />
                              <div className="min-w-0 flex-grow pr-5">
                                <p className="text-[9px] leading-tight font-black uppercase text-text-main truncate">
                                  {notif.productName}
                                </p>
                                <p className="text-[8px] leading-relaxed text-text-dim uppercase mt-0.5 font-sans">
                                  {notif.message}
                                </p>
                                <span className="text-[7px] text-[#FF3E00] font-bold block mt-1">
                                  RECEBIDO ÀS {notif.date}
                                </span>
                              </div>

                              {/* Individual Delete/Dismiss Button */}
                              <button
                                onClick={(e) => handleDeleteNotification(notif.id, e)}
                                className="absolute right-2 top-2.5 p-1 text-text-dim hover:text-[#FF3E00] transition-colors rounded cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                                title="Apagar esta notificação"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* Desktop-only Controls (Theme, Profile, Logout) */}
            <div className="hidden md:flex items-center gap-3">
              {/* Theme Switcher Button */}
              <button
                id="header-theme-toggle-btn"
                onClick={() => {
                  setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
                  triggerNotification(`Modo ${theme === 'light' ? 'Escuro' : 'Claro'} ativado!`, 'info');
                }}
                className="p-2 md:p-3 bg-bg-input border border-border-subtle text-text-muted hover:text-[#FF3E00] hover:border-[#FF3E00] transition-all duration-200"
                title={theme === 'light' ? 'Ativar Modo Escuro' : 'Ativar Modo Claro'}
              >
                {theme === 'light' ? <Moon className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <Sun className="w-3.5 h-3.5 md:w-4 md:h-4" />}
              </button>

              {/* Profile / Login */}
              {currentUser ? (
                <div className="flex items-center gap-1.5 sm:gap-3">
                  <div className="flex flex-col items-end hidden sm:flex text-right">
                    <span className="text-[10px] font-black tracking-widest text-text-dim uppercase">SALDO SIMULADO</span>
                    <button
                      id="header-btn-add-funds"
                      onClick={handleAddFunds}
                      className="text-xs font-black text-[#FF3E00] hover:text-text-main font-mono transition-colors duration-150"
                      title="Adicionar +R$ 5.000 fictícios"
                    >
                      R$ {currentUser.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </button>
                  </div>

                  <div
                    onClick={() => setIsProfileOpen(true)}
                    className="w-8 h-8 sm:w-12 sm:h-12 bg-text-main hover:bg-[#FF3E00] flex items-center justify-center text-bg-main hover:text-white font-black text-xs sm:text-sm select-none border-2 border-text-main hover:border-[#FF3E00] cursor-pointer transition-all duration-150 shrink-0"
                    title="Ver meu perfil e histórico de compras"
                  >
                    {currentUser.name.slice(0, 2).toUpperCase()}
                  </div>

                  <button
                    id="header-btn-logout"
                    onClick={handleLogout}
                    className="p-2 sm:p-3 bg-bg-input border border-border-subtle text-text-muted hover:text-[#FF3E00] hover:border-[#FF3E00] transition-all duration-200"
                    title="Fazer Logout"
                  >
                    <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                </div>
              ) : (
                <button
                  id="header-btn-login"
                  onClick={() => setShowAuthModal(true)}
                  className="px-3 py-2 sm:px-5 sm:py-3.5 bg-text-main text-bg-main hover:bg-[#FF3E00] hover:text-white text-[10px] sm:text-xs font-black tracking-wider sm:tracking-widest uppercase rounded-none transition-all duration-200"
                >
                  LOGIN
                </button>
              )}
            </div>

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
            onCompletePurchase={(totalWithDiscount, deliveryDetails) => {
              if (currentUser && currentUser.balance < totalWithDiscount) {
                triggerNotification('Saldo fictício insuficiente! Adicione fundos para simular a aquisição.', 'error');
                return null;
              }

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

              // Record the purchase in history
              const orderId = `TC-${Math.floor(100000 + Math.random() * 900000)}`;
              if (currentUser) {
                const newPurchase: Purchase = {
                  id: orderId,
                  date: new Date().toISOString(),
                  userId: currentUser.id,
                  total: totalWithDiscount,
                  deliveryDetails,
                  items: cart.map((item) => ({
                    productId: item.product.id,
                    name: item.product.name,
                    image: item.product.image,
                    pricePaid: item.product.price * 0.55,
                    quantity: item.quantity,
                  })),
                };
                setPurchases((prev) => [newPurchase, ...prev]);
              }

              triggerNotification(`Aquisição simulada de ${totalItemsBought} item(ns) concluída com sucesso!`, 'success');
              return orderId;
            }}
            onOpenAuth={() => setShowAuthModal(true)}
            onAddFunds={handleAddFunds}
          />
        ) : (
          <>
            {/* Dynamic Highlight Banner with Brutalist Slogan layout */}
            <div className="border-2 border-border-main bg-bg-card p-8 md:p-12 mb-10 flex flex-col md:flex-row items-stretch justify-between gap-8 relative overflow-hidden text-text-main">
          <div className="space-y-4 max-w-2xl relative z-10 flex flex-col justify-center">
            <div>
              <span className="bg-[#FF3E00] text-white px-3 py-1 text-[10px] font-black tracking-widest uppercase">
                OUTLET EXCLUSIVO // PRODUTOS NOVOS E TESTADOS
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] uppercase text-text-main">
              REVENDAS PREMIUM <br />
              <span className="text-[#FF3E00]">COM DESCONTO_</span>
            </h2>
            <p className="text-text-muted text-xs md:text-sm leading-relaxed max-w-xl font-mono">
              Catálogo pessoal com curadoria refinada de itens tech novos e de outlet selecionados a dedo. Todas as unidades são devidamente inspecionadas e testadas para garantir o perfeito estado físico e de funcionamento. Um desconto especial de 45% já está aplicado diretamente sobre o valor final de cada produto anunciado nesta vitrine virtual.
            </p>
          </div>

          <div className="w-full md:w-64 border-t-2 md:border-t-0 md:border-l-2 border-border-subtle pt-6 md:pt-0 md:pl-8 flex flex-col justify-between shrink-0 font-mono">
            <div>
              <h4 className="text-[10px] font-black tracking-widest uppercase text-[#FF3E00] mb-3">DADOS DO ACERVO</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-border-very-subtle pb-1">
                  <span className="text-text-dim uppercase">MEUS ITENS</span>
                  <span className="font-black">{products.length} PRODUTOS</span>
                </div>
                <div className="flex justify-between border-b border-border-very-subtle pb-1">
                  <span className="text-text-dim uppercase">VENDAS</span>
                  <span className="font-black text-[#FF3E00]">{salesCount} CONCLUÍDAS</span>
                </div>
                <div className="flex justify-between border-b border-border-very-subtle pb-1">
                  <span className="text-text-dim uppercase">DESCONTO PADRÃO</span>
                  <span className="font-black text-[#FF3E00]">45% FLAT</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-bg-nested border border-border-subtle text-[9px] text-text-muted space-y-1.5 font-bold uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <span className="text-[#FF3E00]">✓</span> ENVIO IMEDIATO E SEGURO
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#FF3E00]">✓</span> PRODUTOS NOVOS E TESTADOS
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#FF3E00]">✓</span> CURADORIA INDEPENDENTE
              </div>
            </div>
          </div>
        </div>

        {/* Recently Added Section - Exclusive to Desktop (hidden lg:block) - Compact Edition */}
        <div className="hidden lg:block border-2 border-border-main bg-bg-card p-4 mb-6 text-text-main relative font-mono">
          <div className="flex justify-between items-center mb-4 border-b border-border-very-subtle pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF3E00]" />
              <h3 className="text-xs font-black tracking-widest uppercase">
                RECÉM-LISTADOS NO ACERVO
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-[8px] text-text-dim uppercase tracking-wider font-bold">
              <span className="inline-block w-1.5 h-1.5 bg-[#FF3E00] rounded-full animate-ping"></span>
              [ LIVE ]
            </div>
          </div>

          {/* Compact Row grid of recently added products */}
          <div className="grid grid-cols-4 gap-4">
            {recentlyAddedProducts.map((product, index) => {
              const discountedPrice = product.price * 0.55;
              return (
                <div
                  key={`recent-${product.id}-${index}`}
                  onClick={() => setSelectedProduct(product)}
                  className="bg-bg-nested border border-border-subtle hover:border-[#FF3E00] p-2 flex gap-3 h-20 items-center group cursor-pointer transition-all duration-300 relative overflow-hidden text-text-main"
                >
                  {/* Technical visual decoration line */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-border-subtle group-hover:bg-[#FF3E00] transition-colors" />

                  {/* Compact Thumbnail */}
                  <div className="w-14 h-14 shrink-0 overflow-hidden border border-border-subtle bg-bg-card">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Info Container */}
                  <div className="flex-grow min-w-0 flex flex-col justify-between h-full py-0.5">
                    <div>
                      <span className="text-[7px] font-mono text-text-dim uppercase tracking-wider font-bold truncate block mb-0.5">
                        {product.category}
                      </span>
                      <h4 className="font-sans font-black text-xs text-text-main group-hover:text-[#FF3E00] uppercase tracking-tight truncate transition-colors duration-200">
                        {product.name}
                      </h4>
                    </div>

                    <div className="flex items-baseline justify-between gap-1 border-t border-border-very-subtle/40 pt-1">
                      <span className="text-xs font-black italic tracking-tighter text-[#FF3E00] font-sans">
                        R$ {discountedPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="bg-[#FF3E00]/10 text-[#FF3E00] font-black text-[7px] tracking-wider px-1 py-0.5">
                        -45%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile & Tablet Search and Filters Section (Visible only on < lg) */}
        <div className="lg:hidden w-full flex flex-col gap-4 mb-8 bg-bg-card border-2 border-border-main p-4 sm:p-6 text-text-main">
          
          {/* Search Bar */}
          <div className="relative w-full">
            <input
              id="mobile-tablet-search-input"
              type="text"
              placeholder="PESQUISAR PRODUTOS OU GADGETS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-input border-2 border-border-very-subtle px-4 py-3 pl-11 text-xs font-black tracking-widest text-text-main focus:outline-none focus:border-[#FF3E00] focus:ring-0 placeholder-text-dim rounded-none transition-all duration-150 uppercase"
            />
            <Search className="w-4 h-4 text-[#FF3E00] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono font-black text-text-muted hover:text-[#FF3E00]"
              >
                [LIMPAR]
              </button>
            )}
          </div>

          {/* Horizontal Scrollable Categories with Smooth Snapping and Custom Styling */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-black tracking-widest text-[#FF3E00] uppercase">
                CATEGORIAS // ARRASTE PARA VER MAIS
              </span>
              <span className="text-[9px] font-mono text-text-dim">
                {selectedCategories.includes('Todas') ? 'TODOS' : selectedCategories.map(c => c.toUpperCase()).join(' + ')}
              </span>
            </div>
            
            <div className="relative">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x -mx-4 px-4 sm:-mx-6 sm:px-6">
                {CATEGORIES.map((cat, index) => {
                  const isActive = selectedCategories.includes(cat.id) && !showFavoritesOnly;
                  const IconComponent = cat.icon;
                  return (
                    <button
                      key={`mobile-cat-${cat.id}-${index}`}
                      onClick={() => handleToggleCategory(cat.id)}
                      className={`snap-start shrink-0 px-4 py-2.5 text-xs font-black tracking-wider uppercase border-2 transition-all flex items-center gap-2 rounded-none ${
                        isActive
                          ? 'bg-[#FF3E00] border-[#FF3E00] text-white'
                          : 'bg-bg-input border-border-very-subtle text-text-muted hover:text-text-main hover:border-border-subtle'
                      }`}
                    >
                      <IconComponent className="w-3.5 h-3.5 shrink-0" />
                      <span>{cat.id === 'Todas' ? 'TODOS OS ITENS' : cat.id.toUpperCase()}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Filters and Sorter on Mobile/Tablet */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            
            {/* Favorites button if user is logged in */}
            {currentUser && (
              <button
                id="mobile-btn-favorites"
                onClick={() => {
                  setShowFavoritesOnly(!showFavoritesOnly);
                  if (!showFavoritesOnly) setSelectedCategories(['Todas']);
                }}
                className={`flex-1 sm:flex-initial py-2.5 px-4 border-2 font-black tracking-widest text-[10px] uppercase transition-all flex items-center justify-between sm:justify-center gap-2 rounded-none ${
                  showFavoritesOnly 
                    ? 'bg-[#FF3E00] border-[#FF3E00] text-white' 
                    : 'bg-bg-input border-border-very-subtle text-text-muted hover:text-text-main hover:border-border-subtle'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Heart className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-white' : ''}`} />
                  APENAS FAVORITADOS
                </span>
                <span className="font-mono text-xs opacity-70">({favorites.length})</span>
              </button>
            )}

            
            {/* Mobile Price Slider */}
            <div className="w-full flex-1 flex flex-col justify-center border-t border-border-very-subtle sm:border-none sm:border-l sm:pl-3 pt-3 sm:pt-0">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[9px] font-black tracking-widest text-text-dim uppercase">PREÇO MÁX</label>
                <span className="text-[10px] font-black text-[#FF3E00]">
                  {maxPriceFilter >= 6000 ? 'QUALQUER' : `R$ ${maxPriceFilter.toLocaleString('pt-BR')}`}
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="6000" 
                step="100"
                value={maxPriceFilter}
                onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                className="w-full accent-[#FF3E00] cursor-pointer"
              />
            </div>

            {/* Exhibition Order Selection */}
            <div className="relative flex-1">
              <select
                id="mobile-select-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-bg-input border-2 border-border-very-subtle text-text-main font-black tracking-widest text-[10px] px-3.5 py-2.5 outline-none rounded-none cursor-pointer appearance-none uppercase pr-8"
              >
                <option value="default">DESTAQUE / PADRÃO</option>
                <option value="price-asc">PREÇO: MENOR PARA MAIOR</option>
                <option value="price-desc">PREÇO: MAIOR PARA MENOR</option>
                <option value="rating-desc">MELHORES CRÍTICAS</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#FF3E00] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Clear filters trigger */}
            {(searchQuery || !selectedCategories.includes('Todas') || showFavoritesOnly || sortBy !== 'default' || maxPriceFilter < 6000) && (
              <button
                id="mobile-btn-reset-filters"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategories(['Todas']);
                  setShowFavoritesOnly(false);
                  setSortBy('default');
                  setMaxPriceFilter(6000);
                  triggerNotification('Todos os filtros e buscas limpos', 'info');
                }}
                className="py-2.5 px-4 bg-[#FF3E00]/10 hover:bg-[#FF3E00] text-[#FF3E00] hover:text-white text-[10px] font-black tracking-widest uppercase border-2 border-[#FF3E00]/20 hover:border-[#FF3E00] transition-all rounded-none"
              >
                LIMPAR FILTROS
              </button>
            )}
          </div>
        </div>

        {/* Mobile Simulation Control Panel */}
        <div className="lg:hidden w-full mb-8 bg-bg-card border-2 border-border-main p-4 text-text-main font-mono text-xs">
          <details className="group">
            <summary className="list-none flex items-center justify-between font-black text-[10px] tracking-[0.25em] text-[#FF3E00] uppercase cursor-pointer select-none">
              <span className="flex items-center gap-1.5">
                ⚡ SIMULADOR DE ESTOQUE [ ADMIN ]
              </span>
              <span className="text-text-muted group-open:rotate-180 transition-transform duration-150">
                [ VER CONTROLES ]
              </span>
            </summary>
            
            <div className="mt-4 space-y-3 pt-3 border-t border-border-subtle">
              <p className="text-[9px] text-text-dim uppercase leading-relaxed mb-3 font-bold">
                Gerencie o acervo para disparar alertas e simular reabastecimento de produtos favoritados!
              </p>
              
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {products.map((prod) => {
                  const isOutOfStock = prod.stock === 0;
                  const activeAlertsCount = stockAlerts.filter(a => a.productId === prod.id).length;
                  const isFav = favorites.includes(prod.id);
                  return (
                    <div key={`sim-mobile-${prod.id}`} className="flex items-center justify-between gap-2 border-b border-border-very-subtle pb-2 last:border-b-0 last:pb-0">
                      <div className="min-w-0 flex-1">
                        <div className="font-bold uppercase truncate text-[9px] text-text-main flex items-center gap-1">
                          {isFav && <Heart className="w-2.5 h-2.5 text-[#FF3E00] fill-[#FF3E00] shrink-0" />}
                          <span className="truncate">{prod.name}</span>
                        </div>
                        <div className="flex gap-2 text-[8px] text-text-muted mt-0.5 font-bold">
                          <span className={isOutOfStock ? "text-[#FF3E00] font-black" : "text-green-500"}>
                            {isOutOfStock ? "ESGOTADO" : `QTD: ${prod.stock}`}
                          </span>
                          {activeAlertsCount > 0 && (
                            <span className="text-[#FF3E00] animate-pulse flex items-center gap-0.5">
                              <Mail className="w-2 h-2" /> {activeAlertsCount} ALERTA(S)
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => handleUpdateStock(prod.id, Math.max(0, prod.stock - 1))}
                          className="w-6 h-6 border border-border-subtle hover:border-[#FF3E00] flex items-center justify-center font-black bg-bg-nested text-text-muted hover:text-[#FF3E00] text-[10px] cursor-pointer"
                        >
                          -
                        </button>
                        <button
                          onClick={() => handleUpdateStock(prod.id, prod.stock + 1)}
                          className="w-6 h-6 border border-border-subtle hover:border-[#FF3E00] flex items-center justify-center font-black bg-bg-nested text-text-muted hover:text-[#FF3E00] text-[10px] cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bulk Actions for testing */}
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border-subtle">
                <button
                  onClick={handleZeroAllStock}
                  className="py-2 px-3 bg-bg-nested border border-border-subtle hover:bg-[#FF3E00]/10 hover:border-[#FF3E00]/30 text-[10px] text-text-muted hover:text-[#FF3E00] font-black uppercase tracking-wider transition-all cursor-pointer"
                  title="Zerar todos os estoques para cadastrar alertas"
                >
                  ZERAR ESTOQUES
                </button>
                <button
                  onClick={handleRestockAll}
                  className="py-2 px-3 bg-text-main border border-transparent hover:bg-[#FF3E00] hover:text-white text-[10px] text-bg-main font-black uppercase tracking-wider transition-all cursor-pointer"
                  title="Reabastecer todos para simular recebimento"
                >
                  REABASTECER
                </button>
              </div>
            </div>
          </details>
        </div>

        {/* Categories, Search and Filter Section in Sidebar layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Aside Sidebar */}
          <aside className="hidden lg:flex lg:flex-col lg:w-72 border-r border-border-subtle pr-8 gap-8 lg:sticky lg:top-28 shrink-0">
            
            {/* Technical Categories selector */}
            <div className="w-full">
              <h3 className="text-[10px] font-black tracking-[0.25em] mb-4 text-[#FF3E00] uppercase">LISTA DE CATEGORIAS</h3>
              <ul className="space-y-2 max-h-[520px] overflow-y-auto pr-2 custom-scrollbar scrollbar-thin scrollbar-thumb-border-subtle scrollbar-track-transparent">
                {CATEGORIES.map((cat, index) => {
                  const isActive = selectedCategories.includes(cat.id) && !showFavoritesOnly;
                  return (
                    <li
                      id={`cat-item-${cat.id}`}
                      key={`desktop-cat-${cat.id}-${index}`}
                      onClick={() => handleToggleCategory(cat.id)}
                      className={`text-sm font-black tracking-tight cursor-pointer uppercase py-1 border-b transition-all duration-150 flex items-center justify-between ${
                        isActive
                          ? 'text-[#FF3E00] border-[#FF3E00] pl-2'
                          : 'text-text-muted hover:text-text-main border-border-very-subtle hover:border-border-subtle'
                      }`}
                    >
                      <span>{cat.id === 'Todas' ? 'TODOS OS PRODUTOS' : cat.id.toUpperCase()}</span>
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
              {currentUser && (
                <div>
                  <h3 className="text-[10px] font-black tracking-[0.25em] mb-3 text-text-dim uppercase">FILTRAR / ORDENAR</h3>
                  
                  {/* Favorites Trigger button styled */}
                  <button
                    id="btn-filter-favorites"
                    onClick={() => {
                      setShowFavoritesOnly(!showFavoritesOnly);
                      if (!showFavoritesOnly) setSelectedCategories(['Todas']);
                    }}
                    className={`w-full text-left py-2 px-3 border-2 font-black tracking-widest text-[9px] uppercase transition-all flex items-center justify-between ${
                      showFavoritesOnly 
                        ? 'bg-[#FF3E00] border-[#FF3E00] text-white' 
                        : 'bg-bg-main border-border-subtle text-text-muted hover:text-text-main hover:border-border-main'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5" />
                      APENAS FAVORITADOS
                    </span>
                    <span>({favorites.length})</span>
                  </button>
                </div>
              )}

              
              {/* Desktop Price Slider */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[9px] font-black tracking-widest text-text-dim uppercase block">PREÇO MÁX</label>
                  <span className="text-[10px] font-black text-[#FF3E00]">
                    {maxPriceFilter >= 6000 ? 'QUALQUER' : `R$ ${maxPriceFilter.toLocaleString('pt-BR')}`}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="6000" 
                  step="100"
                  value={maxPriceFilter}
                  onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                  className="w-full accent-[#FF3E00] cursor-pointer"
                />
              </div>

              {/* Sort selector stylized */}
              <div>
                <label className="text-[9px] font-black tracking-widest text-text-dim uppercase block mb-2">ORDEM DE EXIBIÇÃO</label>
                <div className="relative">
                  <select
                    id="select-sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-bg-input border-2 border-border-subtle text-text-main font-black tracking-widest text-[10px] px-3.5 py-2.5 outline-none rounded-none cursor-pointer appearance-none uppercase"
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
              {(searchQuery || !selectedCategories.includes('Todas') || showFavoritesOnly || sortBy !== 'default' || maxPriceFilter < 6000) && (
                <button
                  id="btn-reset-filters"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategories(['Todas']);
                    setShowFavoritesOnly(false);
                    setSortBy('default');
                    setMaxPriceFilter(6000);
                    triggerNotification('Todos os filtros e buscas limpos', 'info');
                  }}
                  className="w-full py-2 bg-bg-nested hover:bg-bg-card text-text-main text-[10px] font-black tracking-widest uppercase border border-border-subtle"
                >
                  LIMPAR FILTROS ATIVOS
                </button>
              )}

              {/* Simulation Control Panel */}
              <div className="border-2 border-border-main bg-bg-card p-4 font-mono text-xs mt-4">
                <h3 className="text-[10px] font-black tracking-[0.25em] mb-2 text-[#FF3E00] uppercase flex items-center justify-between">
                  <span>ESTOQUE SIMULADOR</span>
                  <span className="bg-[#FF3E00]/10 text-[#FF3E00] px-1.5 py-0.5 text-[8px] tracking-normal font-sans font-black">[ ADMIN ]</span>
                </h3>
                <p className="text-[9px] text-text-dim uppercase leading-relaxed mb-3 font-bold">
                  Gerencie o acervo para disparar alertas e simular reabastecimento de produtos favoritados!
                </p>
                
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                  {products.map((prod) => {
                    const isOutOfStock = prod.stock === 0;
                    const activeAlertsCount = stockAlerts.filter(a => a.productId === prod.id).length;
                    const isFav = favorites.includes(prod.id);
                    return (
                      <div key={`sim-${prod.id}`} className="flex items-center justify-between gap-2 border-b border-border-very-subtle pb-2 last:border-b-0 last:pb-0">
                        <div className="min-w-0 flex-1">
                          <div className="font-bold uppercase truncate text-[9px] text-text-main flex items-center gap-1">
                            {isFav && <Heart className="w-2.5 h-2.5 text-[#FF3E00] fill-[#FF3E00] shrink-0" />}
                            <span className="truncate">{prod.name}</span>
                          </div>
                          <div className="flex gap-2 text-[8px] text-text-muted mt-0.5 font-bold">
                            <span className={isOutOfStock ? "text-[#FF3E00] font-black" : "text-green-500"}>
                              {isOutOfStock ? "ESGOTADO" : `QTD: ${prod.stock}`}
                            </span>
                            {activeAlertsCount > 0 && (
                              <span className="text-[#FF3E00] animate-pulse flex items-center gap-0.5">
                                <Mail className="w-2 h-2" /> {activeAlertsCount} ALERTA(S)
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => handleUpdateStock(prod.id, Math.max(0, prod.stock - 1))}
                            className="w-5 h-5 border border-border-subtle hover:border-[#FF3E00] flex items-center justify-center font-black bg-bg-nested text-text-muted hover:text-[#FF3E00] text-[9px] cursor-pointer"
                            title="Remover 1 do Estoque"
                          >
                            -
                          </button>
                          <button
                            onClick={() => handleUpdateStock(prod.id, prod.stock + 1)}
                            className="w-5 h-5 border border-border-subtle hover:border-[#FF3E00] flex items-center justify-center font-black bg-bg-nested text-text-muted hover:text-[#FF3E00] text-[9px] cursor-pointer"
                            title="Adicionar 1 ao Estoque"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bulk Actions for testing */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border-very-subtle">
                  <button
                    onClick={handleZeroAllStock}
                    className="py-1.5 px-2 bg-bg-nested border border-border-subtle hover:bg-[#FF3E00]/10 hover:border-[#FF3E00]/30 text-[8px] text-text-muted hover:text-[#FF3E00] font-black uppercase tracking-wider transition-all cursor-pointer"
                    title="Zerar todos os estoques para cadastrar alertas"
                  >
                    ZERAR ESTOQUES
                  </button>
                  <button
                    onClick={handleRestockAll}
                    className="py-1.5 px-2 bg-text-main border border-transparent hover:bg-[#FF3E00] hover:text-white text-[8px] text-bg-main font-black uppercase tracking-wider transition-all cursor-pointer"
                    title="Reabastecer todos para simular recebimento"
                  >
                    REABASTECER
                  </button>
                </div>
              </div>
            </div>
          </aside>
            
          {/* Main Grid feed for products */}
          <div className="flex-1 w-full">
            
            {/* Active search tag and counts */}
            {(searchQuery || !selectedCategories.includes('Todas' ) || showFavoritesOnly || sortBy !== 'default' || maxPriceFilter < 6000) && (
              <div className="bg-bg-card border border-border-subtle p-4 mb-6 text-xs font-mono flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-text-muted">
                  <Info className="w-4 h-4 text-[#FF3E00]" />
                  <span>
                    Exibindo <strong className="text-text-main">{filteredAndSortedProducts.length}</strong> produtos correspondentes
                  </span>
                </div>
                {searchQuery && (
                  <span className="text-text-dim">Busca: "{searchQuery}"</span>
                )}
              </div>
            )}

            {/* Products listings render area */}
            {filteredAndSortedProducts.length === 0 ? (
              <AnimatePresence mode="popLayout">
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20 bg-bg-card border-2 border-dashed border-border-subtle p-8"
                >
                  <ShoppingBag className="w-12 h-12 text-text-dim mx-auto mb-4" />
                  <h4 className="font-sans font-black text-text-main text-lg uppercase tracking-widest mb-2">NENHUM PRODUTO ENCONTRADO</h4>
                  <p className="text-text-muted text-xs font-mono leading-relaxed max-w-sm mx-auto mb-6">
                    A pesquisa atual não retornou resultados no banco de dados. Modifique as palavras-chave ou limpe as categorias selecionadas.
                  </p>
                  <button
                    id="btn-empty-reset"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategories(['Todas']);
                      setShowFavoritesOnly(false);
                      setSortBy('default');
                      setMaxPriceFilter(6000);
                    }}
                    className="px-5 py-3 bg-[#FF3E00] hover:bg-[#ff551f] text-white text-[10px] font-black tracking-widest uppercase"
                  >
                    EXIBIR TODOS OS PRODUTOS
                  </button>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div
                id="products-grid-container"
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8"
              >
                <AnimatePresence>
                  {filteredAndSortedProducts.map((product, index) => (
                    <ProductCard
                      key={`${product.id}-${index}`}
                      product={product}
                      isFavorite={favorites.includes(product.id)}
                      onToggleFavorite={(e) => handleToggleFavorite(product.id, e)}
                      onClickDetails={() => setSelectedProduct(product)}
                      onAddToCart={() => handleAddToCart(product)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}

          </div>
        </div>
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-24 border-t border-border-subtle bg-bg-card py-10 text-xs text-text-dim font-mono">
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
          onRegisterStockAlert={(productId, email) => {
            if (!stockAlerts.some(a => a.productId === productId && a.email.toLowerCase() === email.toLowerCase())) {
              const prodToAlert = products.find(p => p.id === productId);
              setStockAlerts(prev => [
                ...prev,
                {
                  id: `alert-${Date.now()}`,
                  productId,
                  email,
                  productName: prodToAlert ? prodToAlert.name : 'Produto'
                }
              ]);
            }
            triggerNotification('Alerta de e-mail ativado!', 'success');
          }}
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

      {/* Profile & Purchase History Drawer */}
      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        purchases={purchases}
        onAddFunds={handleAddFunds}
        onLogout={handleLogout}
      />

      {/* Simulated Email Popover Notification Overlay */}
      <AnimatePresence>
        {simulatedEmail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono text-xs animate-none"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-bg-card border-4 border-border-main w-full max-w-lg shadow-2xl overflow-hidden text-text-main"
            >
              {/* Header bar */}
              <div className="bg-[#FF3E00] text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 animate-bounce" />
                  <span className="font-black tracking-widest text-[10px] uppercase">
                    [ NOTIFICAÇÃO DE E-MAIL SIMULADO ENVIADO ]
                  </span>
                </div>
                <button
                  onClick={() => setSimulatedEmail(null)}
                  className="p-1 hover:bg-black/15 text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Email Content Box */}
              <div className="p-6 space-y-4">
                {/* Meta details */}
                <div className="space-y-1.5 border-b border-border-subtle pb-3 text-[10px] font-bold">
                  <div className="flex justify-between">
                    <span className="text-text-dim uppercase">DE:</span>
                    <span className="text-text-main font-black">ALERTAS@TECHCORE.COM.BR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-dim uppercase">PARA:</span>
                    <span className="text-text-main font-black truncate max-w-xs">{simulatedEmail.to}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-dim uppercase">ASSUNTO:</span>
                    <span className="text-[#FF3E00] font-black truncate">{simulatedEmail.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-dim uppercase">DATA:</span>
                    <span className="text-text-dim font-black">{simulatedEmail.date} (SIMULAÇÃO LOCAL)</span>
                  </div>
                </div>

                {/* Email Body */}
                <div className="p-4 bg-bg-nested border border-border-very-subtle leading-relaxed whitespace-pre-wrap text-[10px] text-text-muted font-bold">
                  {simulatedEmail.body}
                </div>

                {/* Simulated product link row */}
                <div className="flex items-center gap-3 p-3 bg-bg-input border border-border-subtle">
                  <img
                    src={simulatedEmail.productImage}
                    alt={simulatedEmail.productName}
                    className="w-10 h-10 object-cover border border-border-subtle bg-bg-card shrink-0"
                  />
                  <div className="min-w-0 flex-grow">
                    <h5 className="font-black text-[10px] uppercase text-text-main truncate">
                      {simulatedEmail.productName}
                    </h5>
                    <p className="text-[8px] font-bold text-[#FF3E00] uppercase tracking-wide">
                      ⚡ ESTOQUE ATUALIZADO — PRONTO PARA COMPRA!
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const found = products.find(p => p.name === simulatedEmail.productName);
                      if (found) {
                        setSelectedProduct(found);
                      }
                      setSimulatedEmail(null);
                    }}
                    className="px-3 py-2 bg-text-main hover:bg-[#FF3E00] text-bg-main hover:text-white font-black text-[9px] tracking-widest uppercase transition-colors shrink-0 cursor-pointer"
                  >
                    COMPRAR AGORA
                  </button>
                </div>
              </div>

              {/* Footer action bar */}
              <div className="bg-bg-nested border-t border-border-subtle p-4 flex justify-between items-center text-[10px]">
                <span className="text-text-dim font-bold uppercase">
                  ✓ FLUXO DE SIMULAÇÃO CONCLUÍDO
                </span>
                <button
                  onClick={() => setSimulatedEmail(null)}
                  className="px-4 py-2 bg-text-main hover:bg-[#FF3E00] hover:text-white text-bg-main text-[9px] font-black tracking-widest uppercase transition-all rounded-none cursor-pointer"
                >
                  FECHAR PREVIEW DO E-MAIL
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
