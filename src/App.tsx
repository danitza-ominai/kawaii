import React, { useState, useEffect } from 'react';
import {
  Home as HomeIcon,
  Sparkles,
  ShoppingBag,
  ShoppingCart,
  User,
  ArrowLeft,
  Star,
  Trash2,
  Heart,
  Share2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Search,
  Check,
  Copy,
  AlertCircle,
  Eye,
  CreditCard,
  MapPin,
  Mail,
  Smartphone,
  CheckCircle,
  Info
} from 'lucide-react';
import { Product, CartItem, AvatarConfig, OrderInfo, ActiveScreen } from './types';
import { PRODUCTS, SKIN_TONES, HAIRSTYLES, HAIR_COLORS, ACCESSORIES, ECUADOR_PROVINCES, SHIPPING_COST } from './data';
import ChibiAvatar from './components/ChibiAvatar';
import { calculateRecommendedSize, formatUSD, getEstimatedDeliveryDate } from './utils';

export default function App() {
  // Navigation
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Search and Catalog Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStyle, setFilterStyle] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all'); // 'all', 'adult', 'niñas'
  const [filterSize, setFilterSize] = useState<string>('all');
  const [filterPriceRange, setFilterPriceRange] = useState<number>(35); // Max price slider

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Avatar Configuration
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig | null>(null);
  
  // Registration / Avatar wizard flow steps
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [wizardAgeType, setWizardAgeType] = useState<'myself' | 'daughter'>('myself');
  const [wizardHeight, setWizardHeight] = useState<number>(160);
  const [wizardBust, setWizardBust] = useState<number>(88);
  const [wizardWaist, setWizardWaist] = useState<number>(70);
  const [wizardHips, setWizardHips] = useState<number>(92);
  const [wizardSkin, setWizardSkin] = useState<string>('#FFE2D1');
  const [wizardStyle, setWizardStyle] = useState<string>('twin-tails');
  const [wizardColor, setWizardColor] = useState<string>('#FFAEC9');
  const [wizardAccessory, setWizardAccessory] = useState<string>('ribbon');

  // Checkout Form State
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);
  const [contactInfo, setContactInfo] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Quito');
  const [province, setProvince] = useState('Pichincha');
  const [paymentMethod, setPaymentMethod] = useState<'tarjeta' | 'payphone' | 'deuna' | 'transferencia'>('tarjeta');
  
  // Checkout card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  
  // Last Submitted Order
  const [placedOrder, setPlacedOrder] = useState<OrderInfo | null>(null);

  // Success Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Active Size Recommendation computed helper
  const activeRecommendedSize = avatarConfig ? calculateRecommendedSize(avatarConfig) : null;

  // Show a visual notification
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Preset quick-tester personas from the UX Document
  const applyPersonaPreset = (preset: 'valentina' | 'daniela' | 'rocio') => {
    if (preset === 'valentina') {
      // Valentina: 22, Fan (Adult, Petite/Slim, Pastel Style)
      const config: AvatarConfig = {
        ageType: 'myself',
        height: 158,
        bust: 82,
        waist: 62,
        hips: 88,
        skinColor: '#FFE2D1',
        hairStyle: 'twin-tails',
        hairColor: '#FFAEC9',
        accessory: 'ribbon',
        activeClothingId: 'prod-1'
      };
      setAvatarConfig(config);
      // Sync wizard state
      setWizardAgeType('myself');
      setWizardHeight(158);
      setWizardBust(82);
      setWizardWaist(62);
      setWizardHips(88);
      setWizardSkin('#FFE2D1');
      setWizardStyle('twin-tails');
      setWizardColor('#FFAEC9');
      setWizardAccessory('ribbon');
      
      setFilterCategory('adult');
      setFilterStyle('pastel');
      setCurrentScreen('virtual-try-on');
      triggerToast('¡Perfil de Valentina aplicado! Probador listo 🌸');
    } else if (preset === 'daniela') {
      // Daniela: 33, Cute-Casual (Adult, M measurements, clean bob)
      const config: AvatarConfig = {
        ageType: 'myself',
        height: 165,
        bust: 91,
        waist: 72,
        hips: 98,
        skinColor: '#FFCCAB',
        hairStyle: 'bob',
        hairColor: '#704E35',
        accessory: 'glasses',
        activeClothingId: 'prod-2'
      };
      setAvatarConfig(config);
      // Sync wizard state
      setWizardAgeType('myself');
      setWizardHeight(165);
      setWizardBust(91);
      setWizardWaist(72);
      setWizardHips(98);
      setWizardSkin('#FFCCAB');
      setWizardStyle('bob');
      setWizardColor('#704E35');
      setWizardAccessory('glasses');

      setFilterCategory('adult');
      setFilterStyle('street');
      setCurrentScreen('catalog');
      triggerToast('¡Perfil de Daniela aplicado! Catálogo con talle M 👗');
    } else if (preset === 'rocio') {
      // Rocío: 38, Mamá compradora (Daughter Emma: 10, kids measurements)
      const config: AvatarConfig = {
        ageType: 'daughter',
        height: 138,
        bust: 74,
        waist: 62,
        hips: 79,
        skinColor: '#E29E75',
        hairStyle: 'wavy',
        hairColor: '#FFE494',
        accessory: 'cat-ears',
        activeClothingId: 'prod-7'
      };
      setAvatarConfig(config);
      // Sync wizard state
      setWizardAgeType('daughter');
      setWizardHeight(138);
      setWizardBust(74);
      setWizardWaist(62);
      setWizardHips(79);
      setWizardSkin('#E29E75');
      setWizardStyle('wavy');
      setWizardColor('#FFE494');
      setWizardAccessory('cat-ears');

      setFilterCategory('niñas');
      setFilterStyle('all');
      setCurrentScreen('product-detail');
      setSelectedProduct(PRODUCTS.find(p => p.id === 'prod-7') || PRODUCTS[6]);
      triggerToast('¡Perfil de Rocío (Hija Emma) aplicado! Ficha infantil cargada 💖');
    }
  };

  // Reset demo states
  const handleResetDemo = () => {
    setCart([]);
    setAvatarConfig(null);
    setPlacedOrder(null);
    setCouponApplied(false);
    setCouponDiscount(0);
    setSearchQuery('');
    setFilterStyle('all');
    setFilterCategory('all');
    setFilterSize('all');
    setFilterPriceRange(35);
    setCheckoutStep(1);
    setWizardStep(1);
    setCurrentScreen('home');
    triggerToast('¡Demo restablecida al estado inicial! 🎀');
  };

  // Cart operations
  const handleAddToCart = (product: Product, size: string, color: string) => {
    const existingIndex = cart.findIndex(
      item => item.product.id === product.id && item.selectedSize === size && item.selectedColor === color
    );

    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += 1;
      setCart(newCart);
    } else {
      setCart([...cart, { product, selectedSize: size, selectedColor: color, quantity: 1 }]);
    }
    triggerToast(`¡${product.name} (${size}) agregada al carrito! 🛒`);
  };

  const handleUpdateQuantity = (index: number, delta: number) => {
    const newCart = [...cart];
    newCart[index].quantity += delta;
    if (newCart[index].quantity <= 0) {
      newCart.splice(index, 1);
      triggerToast('Prenda eliminada del carrito');
    }
    setCart(newCart);
  };

  const handleRemoveFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    triggerToast('Prenda eliminada del carrito');
  };

  // Apply simulated coupon
  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'KAWAII10') {
      setCouponApplied(true);
      setCouponDiscount(0.10); // 10% off
      triggerToast('🎟 ¡Cupón KAWAII10 aplicado! 10% de descuento.');
    } else {
      triggerToast('❌ Cupón inválido. Intenta con "KAWAII10"');
    }
  };

  // Calculate cart prices
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = cartSubtotal * couponDiscount;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + SHIPPING_COST);

  // Handle avatar wizard submission
  const handleCompleteAvatarWizard = () => {
    const config: AvatarConfig = {
      ageType: wizardAgeType,
      height: wizardHeight,
      bust: wizardBust,
      waist: wizardWaist,
      hips: wizardHips,
      skinColor: wizardSkin,
      hairStyle: wizardStyle,
      hairColor: wizardColor,
      accessory: wizardAccessory,
      activeClothingId: selectedProduct ? selectedProduct.id : 'prod-1'
    };
    setAvatarConfig(config);
    setWizardStep(3);
    triggerToast('✨ ¡Avatar y recomendador de talle creados!');
  };

  // Complete Simulated Order
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInfo || !fullName || !address) {
      triggerToast('❌ Por favor, llena los campos requeridos');
      return;
    }

    const orderId = `#YKC-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: OrderInfo = {
      id: orderId,
      emailOrWhatsapp: contactInfo,
      fullname: fullName,
      address,
      city,
      province,
      paymentMethod,
      subtotal: cartSubtotal,
      shippingCost: SHIPPING_COST,
      total: cartTotal,
      deliveryDate: getEstimatedDeliveryDate()
    };

    setPlacedOrder(newOrder);
    // Clear product stock simulation
    cart.forEach(item => {
      item.product.stock = Math.max(0, item.product.stock - item.quantity);
    });

    setCart([]); // Clear cart
    setCouponApplied(false);
    setCouponDiscount(0);
    setCurrentScreen('confirmation');
    triggerToast('🎉 ¡Tu pedido ha sido procesado con éxito!');
  };

  // Sync wizard measurements when ageType changes
  useEffect(() => {
    if (wizardAgeType === 'daughter') {
      setWizardHeight(135);
      setWizardBust(71);
      setWizardWaist(62);
      setWizardHips(76);
    } else {
      setWizardHeight(162);
      setWizardBust(88);
      setWizardWaist(70);
      setWizardHips(92);
    }
  }, [wizardAgeType]);

  // Filter products based on search and selected catalog filters
  const filteredProducts = PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStyle = filterStyle === 'all' || product.style === filterStyle;
    
    // Category mapping: 'all', 'adult' or 'niñas'
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    
    // Size filter check
    const matchesSize = filterSize === 'all' || product.sizes.includes(filterSize);
    
    // Price range slider
    const matchesPrice = product.price <= filterPriceRange;

    return matchesSearch && matchesStyle && matchesCategory && matchesSize && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row antialiased">
      {/* 1. LEFT PANEL: DESKTOP PRESENTATION CORE (UX CONTROLLER & METRICS) */}
      <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between max-w-full lg:max-w-[48%] xl:max-w-[44%] border-r border-slate-200 bg-white">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-3xl">🎀</span>
            <div>
              <h1 className="font-rounded text-2xl font-bold text-kawaii-dark tracking-tight">Your Kawaii Closet</h1>
              <p className="text-xs text-gray-500 font-mono">Quito · Guayaquil · Todo Ecuador 🇪🇨</p>
            </div>
          </div>

          <div className="bg-kawaii-pink/10 border border-kawaii-pink/30 rounded-2xl p-4 mb-6">
            <h2 className="text-sm font-semibold font-rounded text-kawaii-dark mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-pink-500" /> Suite del Diseñador UX/UI Senior
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed mb-3">
              Este prototipo interactivo Hi-Fi traduce fielmente la investigación y los 8 wireframes aprobados del documento de diseño. Úsalo para probar la experiencia móvil con los perfiles reales de nuestras usuarias:
            </p>
            
            {/* Persona Quick Presets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => applyPersonaPreset('valentina')}
                className="flex flex-col items-start p-2.5 bg-white hover:bg-kawaii-pink/20 active:scale-95 border border-kawaii-pink/20 hover:border-kawaii-pink rounded-xl text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                  <span className="text-xs font-bold text-kawaii-dark font-rounded">Valentina, 22</span>
                </div>
                <p className="text-[10px] text-gray-500 font-mono">"La Fan" · S</p>
                <p className="text-[9px] text-gray-400 mt-0.5 italic">Busca rapidez y talla justa.</p>
              </button>

              <button
                onClick={() => applyPersonaPreset('daniela')}
                className="flex flex-col items-start p-2.5 bg-white hover:bg-kawaii-lila/30 active:scale-95 border border-kawaii-lila/30 hover:border-kawaii-lila rounded-xl text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                  <span className="text-xs font-bold text-kawaii-dark font-rounded">Daniela, 33</span>
                </div>
                <p className="text-[10px] text-gray-500 font-mono">"Cute-Casual" · M</p>
                <p className="text-[9px] text-gray-400 mt-0.5 italic">Exige reseñas reales y fotos.</p>
              </button>

              <button
                onClick={() => applyPersonaPreset('rocio')}
                className="flex flex-col items-start p-2.5 bg-white hover:bg-kawaii-mint/30 active:scale-95 border border-kawaii-mint/30 hover:border-kawaii-mint rounded-xl text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-xs font-bold text-kawaii-dark font-rounded">Rocío, 38</span>
                </div>
                <p className="text-[10px] text-gray-500 font-mono">"Mamá Emma" · Niña</p>
                <p className="text-[9px] text-gray-400 mt-0.5 italic">"Modo Mamá", seguridad y cambios.</p>
              </button>
            </div>
          </div>

          {/* Active Testing Stats */}
          <div className="border border-slate-100 rounded-2xl p-4 mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono mb-2.5">Métricas de Flujo en Tiempo Real</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="block text-[10px] text-gray-500 uppercase font-mono">Talla Recom.</span>
                <span className="text-sm font-semibold text-kawaii-dark">
                  {activeRecommendedSize ? `Talla ${activeRecommendedSize} ✨` : 'Sin avatar'}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="block text-[10px] text-gray-500 uppercase font-mono">Prendas Carrito</span>
                <span className="text-sm font-semibold text-kawaii-dark">{cart.length} item(s)</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                <span className="block text-[10px] text-gray-500 uppercase font-mono">Total Estimado</span>
                <span className="text-sm font-semibold text-kawaii-dark">{formatUSD(cartTotal)}</span>
              </div>
            </div>
          </div>

          {/* Core UX Decisions Checklist */}
          <div className="space-y-2 mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono">Decisiones de Diseño de Alto Contraste</h3>
            <ul className="text-xs space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span><strong>Contraste WCAG AA:</strong> Fondos pastel para el ambiente tierno, pero todos los botones interactivos principales y textos usan <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-mono font-bold">#2B2325</code> para un contraste óptimo.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span><strong>Privacidad de Menores:</strong> Si se elige "Comprar para mi hija", no se solicitan fotos ni datos personales sensibles de la menor. La madre ingresa las medidas con sliders interactivos.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span><strong>Botones Táctiles ≥48px:</strong> Las llamadas a la acción importantes tienen un área de toque aumentada y textos amigables.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span><strong>Sellos de Confianza Locales:</strong> Métodos de pago reconocidos (Deuna, Payphone), envío fijo de $3.50 visible antes del checkout y política clara de cambios.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Reset / Setup actions */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleResetDemo}
            className="flex-1 h-12 bg-kawaii-dark text-white font-rounded font-semibold text-sm rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-black"
          >
            <RotateCcw className="w-4 h-4" /> Restablecer Prototipo
          </button>
          
          <a
            href="#kawaii-chibi-avatar-svg"
            className="px-4 h-12 bg-white text-kawaii-dark border border-slate-200 hover:bg-slate-50 font-rounded font-semibold text-sm rounded-xl active:scale-95 transition-all flex items-center justify-center gap-1"
            onClick={() => {
              setCurrentScreen('avatar-builder');
              setWizardStep(1);
            }}
          >
            <Sparkles className="w-4 h-4 text-pink-400" /> Crear Avatar
          </a>
        </div>
      </div>

      {/* 2. RIGHT/CENTER PANEL: IMMERSIVE DEVICE MOCKUP */}
      <div className="flex-1 bg-slate-100 flex items-center justify-center py-6 px-2 lg:py-12">
        {/* Device Container Frame (exactly scaled and looking premium) */}
        <div className="relative w-full max-w-[395px] h-[780px] bg-kawaii-dark rounded-[48px] p-3.5 shadow-2xl border-4 border-slate-800 flex flex-col">
          {/* Top Speaker Notch and Camera Bubble */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-kawaii-dark rounded-b-2xl z-50 flex items-center justify-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-800"></span>
            <span className="w-14 h-1.5 bg-slate-900 rounded-full"></span>
          </div>

          {/* Status Bar */}
          <div className="w-full h-8 px-5 flex justify-between items-center text-white text-[11px] font-medium z-40 select-none bg-kawaii-dark">
            <span className="font-sans">12:42</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] uppercase font-mono tracking-wider">Ecuador (USD)</span>
              <div className="w-5 h-2.5 border border-white/80 rounded-sm p-0.5 flex items-center">
                <span className="h-full w-4 bg-white rounded-2xs"></span>
              </div>
            </div>
          </div>

          {/* Main App Canvas Screen View */}
          <div className="flex-1 bg-white rounded-[32px] overflow-hidden flex flex-col relative" id="mobile-app-screen">
            {/* IN-APP TOP BAR */}
            <header className="bg-white border-b border-gray-100 px-4 h-12 flex items-center justify-between flex-shrink-0 z-30">
              <div className="flex items-center gap-2">
                {currentScreen !== 'home' ? (
                  <button
                    onClick={() => {
                      if (currentScreen === 'product-detail') setCurrentScreen('catalog');
                      else if (currentScreen === 'virtual-try-on') setCurrentScreen('catalog');
                      else setCurrentScreen('home');
                    }}
                    className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-kawaii-dark" />
                  </button>
                ) : (
                  <span className="text-lg">🌸</span>
                )}
                <span className="font-rounded font-bold text-sm tracking-tight text-kawaii-dark uppercase">
                  {currentScreen === 'home' && 'Your Kawaii Closet'}
                  {currentScreen === 'catalog' && 'Catálogo'}
                  {currentScreen === 'product-detail' && 'Ficha de Prenda'}
                  {currentScreen === 'avatar-builder' && 'Crea tu Avatar'}
                  {currentScreen === 'virtual-try-on' && 'Probador Virtual 🎀'}
                  {currentScreen === 'cart' && 'Mi Carrito'}
                  {currentScreen === 'checkout' && 'Pago Seguro 🔒'}
                  {currentScreen === 'confirmation' && '¡Pedido Recibido! 🎉'}
                </span>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentScreen('cart')}
                  className="p-1.5 hover:bg-slate-100 rounded-full transition-colors relative"
                  id="header-cart-btn"
                >
                  <ShoppingCart className="w-5 h-5 text-kawaii-dark" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center animate-bounce">
                      {cart.reduce((sum, i) => sum + i.quantity, 0)}
                    </span>
                  )}
                </button>
              </div>
            </header>

            {/* SCREEN SCROLL BODY */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden bg-[#faf8f9] pb-16">
              
              {/* SCREEN 1: HOME */}
              {currentScreen === 'home' && (
                <div className="animate-fade-in">
                  {/* Hero banner section */}
                  <div className="bg-gradient-to-b from-kawaii-pink/40 to-kawaii-lila/30 p-5 text-center relative overflow-hidden">
                    <div className="absolute top-2 right-2 text-2xl animate-pulse">✨</div>
                    <div className="absolute bottom-3 left-4 text-xl">🍡</div>
                    <span className="inline-block bg-kawaii-pink-dark text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">
                      Hecho en Ecuador 🇪🇨
                    </span>
                    <h2 className="font-rounded text-xl font-bold text-kawaii-dark leading-snug mb-1">
                      Moda Kawaii en tu talle, sin esperar meses 🌸
                    </h2>
                    <p className="text-xs text-gray-600 mb-4 max-w-xs mx-auto">
                      Diseños exclusivos confeccionados localmente con envíos rápidos en 3-4 días.
                    </p>
                    <button
                      onClick={() => {
                        setFilterCategory('all');
                        setFilterStyle('all');
                        setCurrentScreen('catalog');
                      }}
                      className="h-11 px-6 bg-kawaii-dark hover:bg-black active:scale-95 text-white font-rounded font-semibold text-xs rounded-full shadow-lg transition-all flex items-center justify-center gap-2 mx-auto"
                      id="home-cta-catalog"
                    >
                      <ShoppingBag className="w-4 h-4" /> Ver Catálogo Completo
                    </button>
                  </div>

                  {/* Search Bar Input (Mock) */}
                  <div className="px-4 py-3 bg-white border-b border-gray-100 flex gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Buscar faldas, blusas, hoodies..."
                        className="w-full h-10 pl-9 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-kawaii-pink-dark text-kawaii-dark"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentScreen('catalog');
                        }}
                      />
                    </div>
                  </div>

                  {/* Trust Banner (Always Visible on Home as requested in 4.3) */}
                  <div className="bg-white my-3 px-4 py-3 border-y border-gray-100">
                    <div className="grid grid-cols-3 gap-1 text-center">
                      <div className="flex flex-col items-center">
                        <Truck className="w-5 h-5 text-kawaii-pink-dark mb-1" />
                        <span className="text-[10px] font-bold text-kawaii-dark leading-tight">Envíos Ecuador</span>
                        <span className="text-[9px] text-gray-400">Servientrega $3.50</span>
                      </div>
                      <div className="flex flex-col items-center border-x border-gray-100">
                        <RotateCcw className="w-5 h-5 text-kawaii-mint-dark mb-1" />
                        <span className="text-[10px] font-bold text-kawaii-dark leading-tight">Primer Cambio</span>
                        <span className="text-[9px] text-gray-400">¡100% Gratis!</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <ShieldCheck className="w-5 h-5 text-kawaii-lila-dark mb-1" />
                        <span className="text-[10px] font-bold text-kawaii-dark leading-tight">Compra Segura</span>
                        <span className="text-[9px] text-gray-400">Deuna · Payphone</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Virtual Closet Banner */}
                  <div className="mx-4 mb-4 bg-gradient-to-r from-kawaii-lila to-kawaii-pink/50 rounded-2xl p-4 border border-white shadow-sm relative overflow-hidden flex items-center justify-between">
                    <div className="max-w-[62%] z-10">
                      <span className="inline-block bg-white text-kawaii-dark text-[9px] font-bold px-2 py-0.5 rounded-full mb-1.5 uppercase">
                        Probador Virtual 2D
                      </span>
                      <h3 className="font-rounded text-sm font-bold text-kawaii-dark mb-1">
                        ¿Cómo te quedará puesto?
                      </h3>
                      <p className="text-[11px] text-gray-600 leading-snug mb-3">
                        Crea tu avatar chibi con tus medidas reales para probar looks y recibir tu talle recomendado.
                      </p>
                      <button
                        onClick={() => {
                          setCurrentScreen('avatar-builder');
                          setWizardStep(1);
                        }}
                        className="h-9 px-4 bg-kawaii-dark text-white font-rounded font-semibold text-[11px] rounded-lg active:scale-95 transition-all flex items-center gap-1"
                        id="home-cta-avatar"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-pink-300" /> Crear Mi Avatar
                      </button>
                    </div>
                    {/* Tiny Chibi Avatar Preview */}
                    <div className="w-24 h-28 bg-white/60 rounded-xl p-1 shadow-inner flex items-center justify-center">
                      <ChibiAvatar
                        config={avatarConfig || {
                          ageType: 'myself',
                          height: 160,
                          bust: 88,
                          waist: 70,
                          hips: 92,
                          skinColor: '#FFE2D1',
                          hairStyle: 'twin-tails',
                          hairColor: '#FFAEC9',
                          accessory: 'ribbon',
                          activeClothingId: 'prod-1'
                        }}
                      />
                    </div>
                  </div>

                  {/* Quick Categories list */}
                  <div className="px-4 mb-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono mb-2">
                      Buscar por Colección
                    </h3>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'all', label: 'Todo', emoji: '🛍️', cat: 'all', style: 'all' },
                        { id: 'pastel', label: 'Pastel', emoji: '☁️', cat: 'adult', style: 'pastel' },
                        { id: 'lolita', label: 'Lolita', emoji: '👑', cat: 'adult', style: 'lolita' },
                        { id: 'girls', label: 'Niñas', emoji: '🎒', cat: 'niñas', style: 'all' }
                      ].map(item => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setFilterCategory(item.cat);
                            setFilterStyle(item.style);
                            setCurrentScreen('catalog');
                          }}
                          className="bg-white hover:bg-kawaii-pink/10 border border-gray-100 hover:border-kawaii-pink/40 p-2.5 rounded-xl text-center active:scale-95 transition-all flex flex-col items-center"
                        >
                          <span className="text-lg mb-1">{item.emoji}</span>
                          <span className="text-[10px] font-bold text-kawaii-dark truncate w-full">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Looks destacados section (Home Looks as in Wireframe 1) */}
                  <div className="px-4 mb-6">
                    <div className="flex justify-between items-center mb-2.5">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">
                        Looks Destacados
                      </h3>
                      <button
                        onClick={() => {
                          setFilterCategory('all');
                          setFilterStyle('all');
                          setCurrentScreen('catalog');
                        }}
                        className="text-xs text-kawaii-pink-dark font-bold font-rounded flex items-center gap-0.5 hover:underline"
                      >
                        Ver todo ➜
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {PRODUCTS.slice(0, 2).map(prod => (
                        <div
                          key={prod.id}
                          onClick={() => {
                            setSelectedProduct(prod);
                            setCurrentScreen('product-detail');
                          }}
                          className="bg-white rounded-2xl p-3 border border-gray-100 shadow-2xs hover:shadow-xs cursor-pointer active:scale-[0.98] transition-all flex flex-col justify-between"
                        >
                          <div className="bg-kawaii-pink/20 h-24 rounded-xl mb-2 flex items-center justify-center relative">
                            <span className="text-4xl">{prod.imageUrl}</span>
                            <span className="absolute top-1.5 left-1.5 bg-kawaii-dark text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wide">
                              {prod.style}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-400 font-mono block uppercase">Talla S - M - L</span>
                            <h4 className="font-rounded font-bold text-xs text-kawaii-dark leading-tight truncate mb-1">
                              {prod.name}
                            </h4>
                            <div className="flex justify-between items-center mt-1">
                              <span className="font-bold text-xs text-kawaii-dark">{formatUSD(prod.price)}</span>
                              <span className="text-[9px] text-red-500 font-bold bg-red-50 px-1 rounded">
                                Stock: {prod.stock}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SCREEN 2: CATALOG WITH FILTERS */}
              {currentScreen === 'catalog' && (
                <div className="animate-fade-in p-4">
                  {/* Search Query info */}
                  {searchQuery && (
                    <div className="mb-3 flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-gray-100 text-xs text-gray-600">
                      <span>Resultado de búsqueda: <strong>"{searchQuery}"</strong></span>
                      <button onClick={() => setSearchQuery('')} className="text-red-500 font-bold font-sans">✕</button>
                    </div>
                  )}

                  {/* Horizontal Filters Panel (Responsive selectors as in wireframe 2) */}
                  <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-3xs mb-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                      <span className="text-xs font-bold text-kawaii-dark font-rounded flex items-center gap-1">
                        Filtros de Búsqueda 🔍
                      </span>
                      <button
                        onClick={() => {
                          setFilterStyle('all');
                          setFilterCategory('all');
                          setFilterSize('all');
                          setFilterPriceRange(35);
                        }}
                        className="text-[10px] text-gray-400 hover:text-kawaii-pink-dark hover:underline"
                      >
                        Limpiar todo
                      </button>
                    </div>

                    {/* Category Filter Buttons (Edad) */}
                    <div>
                      <span className="block text-[10px] text-gray-400 font-mono uppercase mb-1">Edad / Colección</span>
                      <div className="flex gap-1.5">
                        {[
                          { id: 'all', label: 'Todo' },
                          { id: 'adult', label: 'Adultas (15-40)' },
                          { id: 'niñas', label: 'Niñas (8-14)' }
                        ].map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => setFilterCategory(opt.id)}
                            className={`flex-1 text-[10px] font-bold h-7.5 px-2 rounded-lg transition-all ${
                              filterCategory === opt.id
                                ? 'bg-kawaii-dark text-white'
                                : 'bg-slate-50 text-gray-600 hover:bg-slate-100'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Style and Size dropdown select row */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="block text-[10px] text-gray-400 font-mono uppercase mb-1">Estilo</span>
                        <select
                          value={filterStyle}
                          onChange={(e) => setFilterStyle(e.target.value)}
                          className="w-full h-8 bg-slate-50 border border-gray-100 rounded-lg text-xs text-kawaii-dark px-1.5 focus:outline-none font-medium"
                        >
                          <option value="all">Todos los estilos</option>
                          <option value="pastel">Pastel ☁️</option>
                          <option value="lolita">Lolita 👑</option>
                          <option value="street">Streetwear 🐻</option>
                        </select>
                      </div>

                      <div>
                        <span className="block text-[10px] text-gray-400 font-mono uppercase mb-1">Filtrar Talla</span>
                        <select
                          value={filterSize}
                          onChange={(e) => setFilterSize(e.target.value)}
                          className="w-full h-8 bg-slate-50 border border-gray-100 rounded-lg text-xs text-kawaii-dark px-1.5 focus:outline-none font-medium"
                        >
                          <option value="all">Todas las tallas</option>
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="Niña 8-10">Niña 8-10</option>
                          <option value="Niña 10-12">Niña 10-12</option>
                          <option value="Niña 12-14">Niña 12-14</option>
                        </select>
                      </div>
                    </div>

                    {/* Price Slider */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-gray-400 font-mono uppercase">Precio Máximo</span>
                        <span className="text-xs font-bold text-kawaii-dark">{formatUSD(filterPriceRange)}</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="35"
                        step="1"
                        value={filterPriceRange}
                        onChange={(e) => setFilterPriceRange(Number(e.target.value))}
                        className="w-full accent-kawaii-pink-dark h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Product Grid (Wireframe 2 layout) */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-gray-500 font-medium">Mostrando {filteredProducts.length} prendas</span>
                    {activeRecommendedSize && (
                      <span className="text-[10px] bg-kawaii-pink/40 text-kawaii-dark font-bold font-rounded px-2 py-0.5 rounded-full flex items-center gap-0.5 animate-pulse">
                        <Sparkles className="w-2.5 h-2.5 text-pink-600" /> Talla activa: {activeRecommendedSize}
                      </span>
                    )}
                  </div>

                  {filteredProducts.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center space-y-2">
                      <p className="text-2xl">😿</p>
                      <h4 className="font-rounded font-bold text-sm text-kawaii-dark">Sin prendas que coincidan</h4>
                      <p className="text-xs text-gray-500">Prueba ajustando los filtros o limpiando la búsqueda.</p>
                      <button
                        onClick={() => {
                          setFilterStyle('all');
                          setFilterCategory('all');
                          setFilterSize('all');
                          setFilterPriceRange(35);
                          setSearchQuery('');
                        }}
                        className="px-4 py-2 bg-kawaii-dark text-white rounded-lg text-xs font-semibold font-rounded"
                      >
                        Ver todo el catálogo
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {filteredProducts.map(product => {
                        const isRecommended = activeRecommendedSize && product.sizes.includes(activeRecommendedSize);
                        
                        return (
                          <div
                            key={product.id}
                            onClick={() => {
                              setSelectedProduct(product);
                              setCurrentScreen('product-detail');
                            }}
                            className="bg-white rounded-2xl p-3 border border-gray-100 shadow-3xs hover:shadow-2xs cursor-pointer active:scale-[0.98] transition-all flex flex-col justify-between"
                          >
                            <div>
                              <div className="bg-slate-50 h-28 rounded-xl mb-2 flex items-center justify-center relative overflow-hidden">
                                <span className="text-5xl">{product.imageUrl}</span>
                                {product.originalPrice && (
                                  <span className="absolute top-1.5 left-1.5 bg-pink-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                                    ¡Oferta!
                                  </span>
                                )}
                                <span className="absolute bottom-1.5 right-1.5 bg-kawaii-dark/80 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md">
                                  {product.style}
                                </span>
                              </div>

                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1">
                                  <span className="text-[9px] text-gray-400 uppercase font-mono">{product.category === 'niñas' ? 'Infantil' : 'Adultas'}</span>
                                  {isRecommended && (
                                    <span className="text-[8px] bg-kawaii-mint text-emerald-800 font-bold px-1 rounded">
                                      Tu talle ✓
                                    </span>
                                  )}
                                </div>
                                <h4 className="font-rounded font-bold text-xs text-kawaii-dark leading-tight line-clamp-1">
                                  {product.name}
                                </h4>
                              </div>
                            </div>

                            <div className="mt-2.5 pt-2 border-t border-gray-50 flex items-center justify-between">
                              <div className="flex flex-col">
                                {product.originalPrice && (
                                  <span className="text-[9px] text-gray-400 line-through leading-none">
                                    {formatUSD(product.originalPrice)}
                                  </span>
                                )}
                                <span className="font-bold text-xs text-kawaii-dark leading-none">
                                  {formatUSD(product.price)}
                                </span>
                              </div>

                              <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded ${
                                product.stock <= 3 
                                  ? 'bg-red-50 text-red-600' 
                                  : 'bg-kawaii-mint/40 text-emerald-800'
                              }`}>
                                {product.stock <= 3 ? `Últimos ${product.stock}!` : `Stock: ${product.stock}`}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* SCREEN 3: PRODUCT DETAIL (Ficha de producto) */}
              {currentScreen === 'product-detail' && selectedProduct && (
                <div className="animate-fade-in">
                  {/* Photo Carrousel (Mock with product detail design) */}
                  <div className="bg-gradient-to-b from-kawaii-pink/20 to-slate-100 p-8 flex items-center justify-center relative">
                    <button
                      onClick={() => setCurrentScreen('catalog')}
                      className="absolute top-3 left-3 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm"
                    >
                      <ArrowLeft className="w-4 h-4 text-kawaii-dark" />
                    </button>
                    <span className="text-8xl filter drop-shadow-md">{selectedProduct.imageUrl}</span>
                    <span className="absolute bottom-3 right-3 bg-kawaii-dark text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                      Fotos 100% Reales de Clientas Ecuatorianas 📸
                    </span>
                  </div>

                  <div className="p-4 space-y-4">
                    {/* Header info */}
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h2 className="font-rounded text-base font-bold text-kawaii-dark leading-snug">
                          {selectedProduct.name}
                        </h2>
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-base text-kawaii-dark">{formatUSD(selectedProduct.price)}</span>
                          {selectedProduct.originalPrice && (
                            <span className="text-xs text-gray-400 line-through leading-none">
                              {formatUSD(selectedProduct.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <div className="flex items-center text-yellow-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="ml-0.5">{selectedProduct.rating}</span>
                        </div>
                        <span className="text-gray-400">({selectedProduct.reviewsCount} reseñas verificadas)</span>
                      </div>
                    </div>

                    {/* SIZING RECOMMENDATION ZONE (UX Requirement 4.3) */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-3.5 shadow-3xs">
                      {avatarConfig ? (
                        <div className="flex items-start gap-2.5">
                          <div className="w-10 h-10 bg-kawaii-pink/20 rounded-xl p-0.5 flex-shrink-0">
                            <ChibiAvatar config={avatarConfig} showClothing={false} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-kawaii-dark font-rounded">
                              ✨ A tu avatar {avatarConfig.ageType === 'daughter' ? 'Emma' : ''} le queda la talla:{' '}
                              <span className="text-pink-600 underline decoration-pink-300 font-bold">
                                {activeRecommendedSize}
                              </span>
                            </p>
                            <p className="text-[10px] text-gray-500 mt-0.5">
                              Calculado con precisión usando sus medidas de {avatarConfig.bust}cm busto y {avatarConfig.waist}cm cintura.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <div className="space-y-0.5">
                            <p className="text-xs font-bold text-kawaii-dark font-rounded">
                              📐 ¿Qué talla me quedará mejor?
                            </p>
                            <p className="text-[10px] text-gray-500">
                              Crea un avatar 2D con tus medidas para ver tu recomendación de talle en tiempo real.
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setCurrentScreen('avatar-builder');
                              setWizardStep(1);
                            }}
                            className="bg-kawaii-pink text-kawaii-dark font-rounded font-bold text-[11px] px-3 py-2 rounded-xl border border-kawaii-pink-dark active:scale-95 transition-all flex-shrink-0"
                          >
                            Crear Avatar
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Size selectors (Tactile and large as in wireframe 3) */}
                    <div>
                      <span className="block text-[11px] text-gray-400 font-mono uppercase mb-2">Selecciona tu talle</span>
                      <div className="flex gap-2">
                        {selectedProduct.sizes.map(sz => {
                          const isRecommended = activeRecommendedSize === sz;
                          return (
                            <button
                              key={sz}
                              className={`flex-1 h-12 rounded-xl text-xs font-bold font-rounded flex flex-col items-center justify-center border transition-all ${
                                isRecommended
                                  ? 'border-kawaii-dark bg-kawaii-pink/30 text-kawaii-dark ring-1 ring-kawaii-dark'
                                  : 'border-gray-200 bg-white text-gray-600 hover:bg-slate-50'
                              }`}
                              onClick={() => {
                                triggerToast(`Talla ${sz} seleccionada`);
                              }}
                            >
                              <span>{sz}</span>
                              {isRecommended && <span className="text-[8px] text-pink-700 leading-none">Ideal ✨</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Collapsible Measurement Guide (as in wireframe 3) */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-kawaii-dark font-rounded mb-1.5">
                        <Info className="w-3.5 h-3.5 text-gray-500" /> Guía de Medidas Físicas (cm)
                      </div>
                      <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-mono text-gray-600">
                        <div className="font-bold bg-slate-200 py-0.5 rounded">Talle</div>
                        <div className="font-bold bg-slate-200 py-0.5 rounded">Busto</div>
                        <div className="font-bold bg-slate-200 py-0.5 rounded">Cintura</div>
                        <div className="font-bold bg-slate-200 py-0.5 rounded">Cadera</div>
                        {selectedProduct.measurementsGuide.map(guide => (
                          <React.Fragment key={guide.size}>
                            <div className="bg-white py-1 border border-slate-100 rounded font-bold text-kawaii-dark">{guide.size}</div>
                            <div className="bg-white py-1 border border-slate-100 rounded">{guide.busto}</div>
                            <div className="bg-white py-1 border border-slate-100 rounded">{guide.cintura}</div>
                            <div className="bg-white py-1 border border-slate-100 rounded">{guide.cadera}</div>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* Delivery and Exchange trust cues */}
                    <div className="space-y-2 border-t border-gray-100 pt-3">
                      <div className="flex items-start gap-2.5 text-xs text-gray-600">
                        <Truck className="w-4.5 h-4.5 text-kawaii-pink-dark mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-kawaii-dark leading-tight">
                            Llega el {getEstimatedDeliveryDate()}
                          </p>
                          <p className="text-[11px] text-gray-500">Envío nacional prioritario vía Servientrega por solo $3.50.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 text-xs text-gray-600">
                        <RotateCcw className="w-4.5 h-4.5 text-kawaii-mint-dark mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-kawaii-dark leading-tight">Primer cambio 100% GRATIS</p>
                          <p className="text-[11px] text-gray-500">¿No le quedó bien? Te lo cambiamos sin costo adicional.</p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5 text-xs text-gray-600 border-t border-gray-100 pt-3">
                      <h4 className="font-bold text-kawaii-dark font-rounded">Detalles de la Prenda</h4>
                      <p className="leading-relaxed">{selectedProduct.description}</p>
                    </div>

                    {/* DOUBLE CTA: Touch Targets >= 48px */}
                    <div className="space-y-2.5 pt-2">
                      <button
                        onClick={() => {
                          // Apply this clothing piece to avatar try-on
                          if (!avatarConfig) {
                            // If no avatar, boot builder
                            setCurrentScreen('avatar-builder');
                            setWizardStep(1);
                          } else {
                            const updated = { ...avatarConfig, activeClothingId: selectedProduct.id };
                            setAvatarConfig(updated);
                            setCurrentScreen('virtual-try-on');
                          }
                        }}
                        className="w-full h-12 bg-white text-kawaii-dark hover:bg-slate-50 border-2 border-kawaii-dark rounded-xl font-rounded font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        👗 Ver en mi Avatar Chibi 2D
                      </button>

                      <button
                        onClick={() => {
                          const size = activeRecommendedSize || selectedProduct.sizes[0];
                          const color = selectedProduct.colors[0];
                          handleAddToCart(selectedProduct, size, color);
                        }}
                        className="w-full h-12 bg-kawaii-dark text-white hover:bg-black rounded-xl font-rounded font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md"
                        id="pdp-add-to-cart"
                      >
                        <ShoppingCart className="w-4 h-4" /> Añadir al Carrito de Compras
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SCREEN 4: REGISTER / AVATAR BUILDER (3 pasos) */}
              {currentScreen === 'avatar-builder' && (
                <div className="animate-fade-in p-4 space-y-4">
                  {/* Step bar indicator */}
                  <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 font-mono">Paso {wizardStep} de 3</span>
                    <div className="flex gap-1">
                      {[1, 2, 3].map(st => (
                        <span
                          key={st}
                          className={`w-6 h-1.5 rounded-full ${
                            wizardStep >= st ? 'bg-kawaii-pink-dark' : 'bg-gray-200'
                          }`}
                        ></span>
                      ))}
                    </div>
                  </div>

                  {/* STEP 1: MEASUREMENTS */}
                  {wizardStep === 1 && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="space-y-1 text-center">
                        <h3 className="font-rounded text-base font-bold text-kawaii-dark">¿Para quién es la ropa? 📐</h3>
                        <p className="text-xs text-gray-500">Esto nos ayuda a recomendar la talla infantil o de adulta.</p>
                      </div>

                      {/* Audience selection */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setWizardAgeType('myself')}
                          className={`h-12 rounded-xl text-xs font-bold font-rounded flex flex-col items-center justify-center border transition-all ${
                            wizardAgeType === 'myself'
                              ? 'border-kawaii-dark bg-kawaii-pink/20 text-kawaii-dark'
                              : 'border-gray-200 bg-white text-gray-500'
                          }`}
                        >
                          <span>Para mí 👩</span>
                          <span className="text-[9px] text-gray-400 font-sans font-normal">Tallas S / M / L</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setWizardAgeType('daughter')}
                          className={`h-12 rounded-xl text-xs font-bold font-rounded flex flex-col items-center justify-center border transition-all ${
                            wizardAgeType === 'daughter'
                              ? 'border-kawaii-dark bg-kawaii-pink/20 text-kawaii-dark'
                              : 'border-gray-200 bg-white text-gray-500'
                          }`}
                        >
                          <span>Para mi Hija 👧</span>
                          <span className="text-[9px] text-gray-400 font-sans font-normal">Tallas 8 - 14 años</span>
                        </button>
                      </div>

                      {/* Privacy & Safeguard notice (UX design decision 4.3) */}
                      {wizardAgeType === 'daughter' ? (
                        <div className="bg-kawaii-mint/40 border border-kawaii-mint-dark/30 rounded-xl p-3 flex gap-2">
                          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <div className="text-[10.5px] text-emerald-800 leading-normal">
                            <strong>Privacidad Infantil Protegida:</strong> No solicitamos fotos, nombres ni cuentas de menores de edad. Las medidas las ingresas tú para calcular la prenda ideal.
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-100 rounded-xl p-3 flex gap-2">
                          <ShieldCheck className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                          <div className="text-[10.5px] text-gray-600 leading-normal">
                            Medidas seguras de talle. Usamos los cm reales para evitar devoluciones y cuidar el medio ambiente reduciendo retornos.
                          </div>
                        </div>
                      )}

                      {/* Measurement Sliders */}
                      <div className="bg-white p-4 rounded-2xl border border-gray-100 space-y-3.5">
                        {/* Height slider */}
                        <div>
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="font-rounded font-semibold text-kawaii-dark">Altura (Estatura)</span>
                            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded font-bold text-kawaii-dark">
                              {wizardHeight} cm
                            </span>
                          </div>
                          <input
                            type="range"
                            min={wizardAgeType === 'daughter' ? 120 : 145}
                            max={wizardAgeType === 'daughter' ? 155 : 185}
                            value={wizardHeight}
                            onChange={(e) => setWizardHeight(Number(e.target.value))}
                            className="w-full accent-kawaii-pink-dark"
                          />
                        </div>

                        {/* Bust slider */}
                        <div>
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="font-rounded font-semibold text-kawaii-dark">Contorno de Busto / Pecho</span>
                            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded font-bold text-kawaii-dark">
                              {wizardBust} cm
                            </span>
                          </div>
                          <input
                            type="range"
                            min={wizardAgeType === 'daughter' ? 60 : 78}
                            max={wizardAgeType === 'daughter' ? 88 : 115}
                            value={wizardBust}
                            onChange={(e) => setWizardBust(Number(e.target.value))}
                            className="w-full accent-kawaii-pink-dark"
                          />
                        </div>

                        {/* Waist slider */}
                        <div>
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="font-rounded font-semibold text-kawaii-dark">Contorno de Cintura</span>
                            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded font-bold text-kawaii-dark">
                              {wizardWaist} cm
                            </span>
                          </div>
                          <input
                            type="range"
                            min={wizardAgeType === 'daughter' ? 50 : 58}
                            max={wizardAgeType === 'daughter' ? 76 : 105}
                            value={wizardWaist}
                            onChange={(e) => setWizardWaist(Number(e.target.value))}
                            className="w-full accent-kawaii-pink-dark"
                          />
                        </div>

                        {/* Hips slider */}
                        <div>
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="font-rounded font-semibold text-kawaii-dark">Contorno de Cadera</span>
                            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded font-bold text-kawaii-dark">
                              {wizardHips} cm
                            </span>
                          </div>
                          <input
                            type="range"
                            min={wizardAgeType === 'daughter' ? 64 : 80}
                            max={wizardAgeType === 'daughter' ? 94 : 125}
                            value={wizardHips}
                            onChange={(e) => setWizardHips(Number(e.target.value))}
                            className="w-full accent-kawaii-pink-dark"
                          />
                        </div>
                      </div>

                      {/* Quick How to Measure Video Link */}
                      <div className="bg-kawaii-yellow p-3 rounded-xl border border-kawaii-yellow-dark/40 flex items-center justify-between text-xs text-kawaii-dark">
                        <span className="flex items-center gap-1">🎥 <strong>¿No sabes medirte?</strong> Ver guía de 30 seg</span>
                        <span className="text-[10px] font-bold underline cursor-pointer">Ver video</span>
                      </div>

                      <button
                        onClick={() => setWizardStep(2)}
                        className="w-full h-12 bg-kawaii-dark text-white rounded-xl font-rounded font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-1 shadow-md"
                        id="wizard-step-1-btn"
                      >
                        Siguiente: Personalizar Apariencia ➜
                      </button>
                    </div>
                  )}

                  {/* STEP 2: APPEARANCE CUSTOMIZATION */}
                  {wizardStep === 2 && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="space-y-1 text-center">
                        <h3 className="font-rounded text-base font-bold text-kawaii-dark">Personaliza tu Chibi 🎨</h3>
                        <p className="text-xs text-gray-500">Dale tu estilo eligiendo tono de piel, peinado y accesorios.</p>
                      </div>

                      {/* Dual split: Live preview on left, options on right */}
                      <div className="flex gap-3">
                        <div className="w-[42%] bg-white rounded-2xl p-2 border border-gray-100 shadow-3xs flex flex-col justify-center items-center h-52">
                          <ChibiAvatar
                            config={{
                              ageType: wizardAgeType,
                              height: wizardHeight,
                              bust: wizardBust,
                              waist: wizardWaist,
                              hips: wizardHips,
                              skinColor: wizardSkin,
                              hairStyle: wizardStyle,
                              hairColor: wizardColor,
                              accessory: wizardAccessory,
                              activeClothingId: selectedProduct ? selectedProduct.id : 'prod-1'
                            }}
                          />
                        </div>

                        {/* Scrolling customization properties */}
                        <div className="flex-1 h-52 overflow-y-auto space-y-3.5 pr-1 text-xs">
                          {/* Skin tones */}
                          <div>
                            <span className="block text-[10px] text-gray-400 font-mono uppercase mb-1">Tono de Piel</span>
                            <div className="flex gap-1.5">
                              {SKIN_TONES.map(sk => (
                                <button
                                  key={sk.id}
                                  onClick={() => setWizardSkin(sk.value)}
                                  className={`w-6.5 h-6.5 rounded-full border-2 transition-all ${
                                    wizardSkin === sk.value ? 'border-kawaii-dark scale-110' : 'border-transparent'
                                  }`}
                                  style={{ backgroundColor: sk.value }}
                                  title={sk.name}
                                ></button>
                              ))}
                            </div>
                          </div>

                          {/* Hairstyles */}
                          <div>
                            <span className="block text-[10px] text-gray-400 font-mono uppercase mb-1">Peinado Chibi</span>
                            <div className="grid grid-cols-2 gap-1">
                              {HAIRSTYLES.map(hair => (
                                <button
                                  key={hair.id}
                                  onClick={() => setWizardStyle(hair.id)}
                                  className={`px-1 py-1 bg-white text-[10px] font-medium rounded-lg border text-center transition-all ${
                                    wizardStyle === hair.id ? 'border-kawaii-dark bg-kawaii-pink/10' : 'border-gray-100'
                                  }`}
                                >
                                  {hair.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Hair Color */}
                          <div>
                            <span className="block text-[10px] text-gray-400 font-mono uppercase mb-1">Color de Pelo</span>
                            <div className="flex gap-1.5 flex-wrap">
                              {HAIR_COLORS.map(color => (
                                <button
                                  key={color.id}
                                  onClick={() => setWizardColor(color.value)}
                                  className={`w-6.5 h-6.5 rounded-full border-2 transition-all ${
                                    wizardColor === color.value ? 'border-kawaii-dark scale-110' : 'border-transparent'
                                  }`}
                                  style={{ backgroundColor: color.value }}
                                  title={color.name}
                                ></button>
                              ))}
                            </div>
                          </div>

                          {/* Accessories */}
                          <div>
                            <span className="block text-[10px] text-gray-400 font-mono uppercase mb-1">Accesorios</span>
                            <div className="grid grid-cols-2 gap-1">
                              {ACCESSORIES.map(acc => (
                                <button
                                  key={acc.id}
                                  onClick={() => setWizardAccessory(acc.id)}
                                  className={`px-1 py-1 bg-white text-[10px] font-medium rounded-lg border text-center transition-all ${
                                    wizardAccessory === acc.id ? 'border-kawaii-dark bg-kawaii-pink/10' : 'border-gray-100'
                                  }`}
                                >
                                  {acc.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Navigation buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setWizardStep(1)}
                          className="flex-1 h-12 bg-white text-kawaii-dark border border-gray-200 rounded-xl font-rounded font-semibold text-xs active:scale-95 transition-all"
                        >
                          Atrás: Medidas
                        </button>
                        <button
                          onClick={handleCompleteAvatarWizard}
                          className="flex-[1.4] h-12 bg-kawaii-dark text-white rounded-xl font-rounded font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-1 shadow-md"
                          id="wizard-step-2-btn"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-pink-300" /> ¡Completar Avatar!
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: CONGRATULATIONS */}
                  {wizardStep === 3 && (
                    <div className="space-y-4 animate-fade-in text-center py-4">
                      <div className="w-24 h-24 bg-gradient-to-tr from-kawaii-pink to-kawaii-lila rounded-full mx-auto flex items-center justify-center text-5xl animate-bounce">
                        🎉
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-rounded text-lg font-bold text-kawaii-dark">¡Tu Avatar Chibi está listo!</h3>
                        <p className="text-xs text-gray-500">
                          Se calculó que la talla recomendada es: <strong className="text-pink-600 text-sm font-bold font-rounded">{activeRecommendedSize}</strong>
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-center gap-3">
                        <div className="w-28 h-32 bg-slate-50 rounded-xl p-1 shadow-inner">
                          {avatarConfig && <ChibiAvatar config={avatarConfig} />}
                        </div>
                        <p className="text-[11px] text-gray-500 leading-normal max-w-xs">
                          Tus medidas han sido guardadas temporalmente en esta sesión. Ahora podrás ver qué ropa te queda con la etiqueta de <strong className="text-emerald-800">"Tu talle ✓"</strong> en el catálogo.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            setCurrentScreen('virtual-try-on');
                          }}
                          className="w-full h-12 bg-kawaii-dark text-white hover:bg-black rounded-xl font-rounded font-bold text-sm active:scale-95 transition-all"
                          id="wizard-step-3-probador"
                        >
                          Ir al Probador Virtual 🎀
                        </button>

                        <button
                          onClick={() => {
                            setFilterCategory(wizardAgeType === 'daughter' ? 'niñas' : 'adult');
                            setCurrentScreen('catalog');
                          }}
                          className="w-full h-12 bg-white text-kawaii-dark border border-gray-200 hover:bg-slate-50 rounded-xl font-rounded font-semibold text-xs active:scale-95 transition-all"
                        >
                          Ver el Catálogo con mi Talla
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SCREEN 4b: PROBADOR VIRTUAL */}
              {currentScreen === 'virtual-try-on' && (
                <div className="animate-fade-in p-4 space-y-4">
                  {/* Virtual Try-On split screen layout as in wireframe 4b */}
                  <div className="flex gap-3">
                    {/* Left: Huge Interactive Avatar Canvas */}
                    <div className="w-[48%] bg-white rounded-2xl p-3 border border-gray-100 shadow-2xs flex flex-col justify-between items-center h-[340px] relative">
                      {avatarConfig ? (
                        <>
                          {/* Sizing pill indicator */}
                          <div className="bg-kawaii-mint/50 px-2 py-1 rounded-full text-center z-10">
                            <p className="text-[10px] font-bold text-emerald-800 leading-none">
                              Talle Ideal: {activeRecommendedSize}
                            </p>
                          </div>

                          <div className="w-full h-44 my-auto flex items-center justify-center">
                            <ChibiAvatar config={avatarConfig} />
                          </div>

                          {/* Info footer */}
                          <div className="text-center bg-slate-50 w-full p-1.5 rounded-lg border border-gray-50 text-[9.5px] text-gray-500">
                            ✨ Vistiendo: <strong className="text-kawaii-dark truncate block max-w-full">
                              {avatarConfig.activeClothingId
                                ? PRODUCTS.find(p => p.id === avatarConfig.activeClothingId)?.name
                                : 'Ropa interior chibi'}
                            </strong>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center p-3 space-y-2">
                          <p className="text-3xl">🧩</p>
                          <p className="text-xs font-bold text-kawaii-dark font-rounded">Sin avatar activo</p>
                          <p className="text-[10px] text-gray-500">Crea tu avatar chibi con medidas para habilitar el probador.</p>
                          <button
                            onClick={() => {
                              setCurrentScreen('avatar-builder');
                              setWizardStep(1);
                            }}
                            className="h-8.5 px-3 bg-kawaii-pink text-kawaii-dark border border-kawaii-pink-dark font-rounded font-bold text-[10.5px] rounded-lg active:scale-95 transition-all"
                          >
                            Crear Avatar
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Right: Wardrobe garment cards to switch clothes dynamically */}
                    <div className="flex-1 flex flex-col h-[340px] justify-between">
                      <div className="space-y-1.5">
                        <span className="block text-[10px] text-gray-400 font-mono uppercase">Guardarropa 👗</span>
                        
                        <div className="space-y-2 max-h-[290px] overflow-y-auto pr-0.5">
                          {/* We list clothes of appropriate category based on avatar age type */}
                          {PRODUCTS.filter(p => !avatarConfig || p.category === (avatarConfig.ageType === 'daughter' ? 'niñas' : 'adult')).map(prod => {
                            const isBeingTried = avatarConfig?.activeClothingId === prod.id;
                            
                            return (
                              <div
                                key={prod.id}
                                onClick={() => {
                                  if (avatarConfig) {
                                    setAvatarConfig({ ...avatarConfig, activeClothingId: prod.id });
                                  } else {
                                    // Instantiate default avatar config first
                                    setAvatarConfig({
                                      ageType: prod.category === 'niñas' ? 'daughter' : 'myself',
                                      height: prod.category === 'niñas' ? 135 : 160,
                                      bust: prod.category === 'niñas' ? 71 : 88,
                                      waist: prod.category === 'niñas' ? 62 : 70,
                                      hips: prod.category === 'niñas' ? 76 : 92,
                                      skinColor: '#FFE2D1',
                                      hairStyle: 'twin-tails',
                                      hairColor: '#FFAEC9',
                                      accessory: 'ribbon',
                                      activeClothingId: prod.id
                                    });
                                  }
                                  triggerToast(`Probando: ${prod.name}`);
                                }}
                                className={`p-2 rounded-xl border text-left cursor-pointer active:scale-95 transition-all flex items-center justify-between ${
                                  isBeingTried
                                    ? 'border-kawaii-dark bg-kawaii-pink/20 shadow-2xs'
                                    : 'border-gray-100 bg-white'
                                }`}
                              >
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <span className="text-2xl flex-shrink-0">{prod.imageUrl}</span>
                                  <div className="min-w-0">
                                    <h5 className="font-rounded font-bold text-[11px] text-kawaii-dark truncate leading-tight">
                                      {prod.name}
                                    </h5>
                                    <span className="text-[10px] font-mono font-bold text-gray-500 leading-none">
                                      {formatUSD(prod.price)}
                                    </span>
                                  </div>
                                </div>
                                
                                {isBeingTried && (
                                  <Check className="w-3.5 h-3.5 text-pink-600 flex-shrink-0" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        if (avatarConfig?.activeClothingId) {
                          const currentProd = PRODUCTS.find(p => p.id === avatarConfig.activeClothingId);
                          if (currentProd) {
                            const size = activeRecommendedSize || currentProd.sizes[0];
                            const color = currentProd.colors[0];
                            handleAddToCart(currentProd, size, color);
                          }
                        } else {
                          triggerToast('❌ Elige una prenda para añadir');
                        }
                      }}
                      className="w-full h-12 bg-kawaii-dark text-white rounded-xl font-rounded font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
                      id="tryon-add-to-cart"
                    >
                      <ShoppingCart className="w-4 h-4" /> Añadir Look al Carrito —{' '}
                      {avatarConfig?.activeClothingId
                        ? formatUSD(PRODUCTS.find(p => p.id === avatarConfig.activeClothingId)?.price || 0)
                        : '$0.00'}
                    </button>

                    {/* SHARE MY LOOK (Modo Mamá, lists, changes etc as in Wireframe 4b) */}
                    <button
                      onClick={() => setShareModalOpen(true)}
                      className="w-full h-11 bg-white hover:bg-slate-50 text-kawaii-dark border border-gray-200 rounded-xl font-rounded font-semibold text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Share2 className="w-4 h-4 text-pink-500" /> Compartir mi look (Modo Mamá) 💌
                    </button>
                  </div>
                </div>
              )}

              {/* SCREEN 5: SHOPPING CART */}
              {currentScreen === 'cart' && (
                <div className="animate-fade-in p-4 space-y-4">
                  {cart.length === 0 ? (
                    <div className="bg-white py-12 px-6 rounded-2xl border border-gray-100 text-center space-y-2">
                      <p className="text-4xl">🛒</p>
                      <h4 className="font-rounded font-bold text-sm text-kawaii-dark">Tu carrito está vacío</h4>
                      <p className="text-xs text-gray-500">¿Qué tal si te das una vuelta por el catálogo?</p>
                      <button
                        onClick={() => setCurrentScreen('catalog')}
                        className="px-5 h-10 bg-kawaii-dark text-white rounded-lg text-xs font-bold font-rounded"
                      >
                        Explorar Catálogo
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Cart items list (as in wireframe 5) */}
                      <div className="space-y-2">
                        {cart.map((item, index) => (
                          <div
                            key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                            className="bg-white rounded-2xl p-3 border border-gray-100 flex gap-3 shadow-3xs"
                          >
                            <div className="bg-slate-50 w-16 h-16 rounded-xl flex items-center justify-center text-4xl">
                              {item.product.imageUrl}
                            </div>

                            <div className="flex-1 flex flex-col justify-between min-w-0">
                              <div className="flex justify-between items-start gap-1">
                                <div className="min-w-0">
                                  <h4 className="font-rounded font-bold text-xs text-kawaii-dark truncate">
                                    {item.product.name}
                                  </h4>
                                  <p className="text-[10px] text-gray-500">
                                    Talla: <strong>{item.selectedSize}</strong> · Color: {item.selectedColor}
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleRemoveFromCart(index)}
                                  className="p-1 text-gray-300 hover:text-red-500"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="flex justify-between items-center mt-1">
                                <span className="font-bold text-xs text-kawaii-dark">
                                  {formatUSD(item.product.price)}
                                </span>

                                {/* Quantity selector h >= 48px is target, but layout wise nice buttons */}
                                <div className="flex items-center gap-2.5 bg-slate-100 px-2 py-1 rounded-lg">
                                  <button
                                    onClick={() => handleUpdateQuantity(index, -1)}
                                    className="p-0.5 hover:bg-slate-200 rounded"
                                  >
                                    <Minus className="w-3.5 h-3.5 text-kawaii-dark" />
                                  </button>
                                  <span className="text-xs font-mono font-bold text-kawaii-dark">{item.quantity}</span>
                                  <button
                                    onClick={() => handleUpdateQuantity(index, 1)}
                                    className="p-0.5 hover:bg-slate-200 rounded"
                                  >
                                    <Plus className="w-3.5 h-3.5 text-kawaii-dark" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Coupon entry (as in wireframe 5) */}
                      <div className="bg-white p-3 rounded-2xl border border-gray-100 flex gap-2">
                        <input
                          type="text"
                          placeholder="¿Tienes un cupón? (Prueba KAWAII10)"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          disabled={couponApplied}
                          className="flex-1 bg-slate-50 border border-gray-200 rounded-xl px-3 text-xs focus:outline-none focus:ring-1 focus:ring-kawaii-pink-dark text-kawaii-dark uppercase"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={couponApplied}
                          className={`px-4 text-xs font-bold font-rounded rounded-xl active:scale-95 transition-all ${
                            couponApplied
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-kawaii-dark text-white hover:bg-black'
                          }`}
                        >
                          {couponApplied ? 'Aplicado ✓' : 'Aplicar'}
                        </button>
                      </div>

                      {/* Price breakdown summary (Costo de envío visible antes del checkout!) */}
                      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-3xs space-y-2.5 text-xs text-gray-600">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span className="font-mono text-kawaii-dark">{formatUSD(cartSubtotal)}</span>
                        </div>

                        {couponApplied && (
                          <div className="flex justify-between text-emerald-600">
                            <span>Descuento (Cupón 10%)</span>
                            <span className="font-mono">- {formatUSD(discountAmount)}</span>
                          </div>
                        )}

                        <div className="flex justify-between border-t border-gray-50 pt-2 text-gray-500">
                          <div className="flex flex-col">
                            <span className="font-bold text-kawaii-dark">Envío nacional prioritario 🚚</span>
                            <span className="text-[10px] text-gray-400">Entregado por Servientrega o Urbano</span>
                          </div>
                          <span className="font-mono text-kawaii-dark">{formatUSD(SHIPPING_COST)}</span>
                        </div>

                        <div className="flex justify-between border-t border-gray-100 pt-2 text-sm text-kawaii-dark font-bold">
                          <span className="font-rounded">Total a pagar</span>
                          <span className="font-mono">{formatUSD(cartTotal)}</span>
                        </div>
                      </div>

                      {/* Checkout actions */}
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            setCheckoutStep(1);
                            setCurrentScreen('checkout');
                          }}
                          className="w-full h-12 bg-kawaii-dark text-white hover:bg-black rounded-xl font-rounded font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-1 shadow-md"
                          id="cart-checkout-btn"
                        >
                          Comprar como Invitada → {formatUSD(cartTotal)}
                        </button>

                        <button
                          onClick={() => setCurrentScreen('catalog')}
                          className="w-full h-11 bg-white text-gray-500 border border-gray-200 rounded-xl font-rounded font-semibold text-xs active:scale-95 transition-all"
                        >
                          Seguir Explorando el Catálogo
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SCREEN 6: CHECKOUT (3 pasos) */}
              {currentScreen === 'checkout' && (
                <form onSubmit={handlePlaceOrder} className="animate-fade-in p-4 space-y-4">
                  {/* Steps Progress header */}
                  <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 font-mono">Paso {checkoutStep} de 3</span>
                    <div className="flex gap-1.5">
                      {[1, 2, 3].map(st => (
                        <span
                          key={st}
                          className={`w-6 h-1.5 rounded-full ${
                            checkoutStep >= st ? 'bg-kawaii-dark' : 'bg-gray-200'
                          }`}
                        ></span>
                      ))}
                    </div>
                  </div>

                  {/* STEP 1: CONTACT INFO */}
                  {checkoutStep === 1 && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="bg-white p-4 rounded-2xl border border-gray-100 space-y-3">
                        <h4 className="font-rounded font-bold text-sm text-kawaii-dark border-b border-gray-50 pb-1.5">
                          Información de Contacto 📬
                        </h4>
                        
                        <div className="space-y-1">
                          <label className="block text-[10.5px] font-bold text-gray-500">
                            WhatsApp o Correo Electrónico <span className="text-pink-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Ej: 0987654321 o nikoole@gmail.com"
                            required
                            className="w-full h-11 bg-slate-50 border border-gray-200 rounded-xl px-3 text-xs focus:outline-none focus:ring-1 focus:ring-kawaii-pink-dark text-kawaii-dark"
                            value={contactInfo}
                            onChange={(e) => setContactInfo(e.target.value)}
                          />
                          <p className="text-[9.5px] text-gray-400">Te enviaremos las alertas de rastreo por este medio.</p>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10.5px] font-bold text-gray-500">
                            Nombre y Apellido Completo <span className="text-pink-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Ej: Nikole Ivess"
                            required
                            className="w-full h-11 bg-slate-50 border border-gray-200 rounded-xl px-3 text-xs focus:outline-none focus:ring-1 focus:ring-kawaii-pink-dark text-kawaii-dark"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (contactInfo.trim() && fullName.trim()) {
                            setCheckoutStep(2);
                          } else {
                            triggerToast('❌ Por favor, llena los campos requeridos');
                          }
                        }}
                        className="w-full h-12 bg-kawaii-dark text-white rounded-xl font-rounded font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-1 shadow-md"
                        id="checkout-step-1-btn"
                      >
                        Continuar a Detalles de Envío ➜
                      </button>
                    </div>
                  )}

                  {/* STEP 2: SHIPPING INFO */}
                  {checkoutStep === 2 && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="bg-white p-4 rounded-2xl border border-gray-100 space-y-3">
                        <h4 className="font-rounded font-bold text-sm text-kawaii-dark border-b border-gray-50 pb-1.5">
                          Dirección de Entrega 🚚
                        </h4>

                        <div className="space-y-1">
                          <label className="block text-[10.5px] font-bold text-gray-500">Provincia *</label>
                          <select
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                            className="w-full h-11 bg-slate-50 border border-gray-200 rounded-xl px-3 text-xs focus:outline-none text-kawaii-dark"
                          >
                            {ECUADOR_PROVINCES.map(prov => (
                              <option key={prov} value={prov}>{prov}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10.5px] font-bold text-gray-500">Ciudad *</label>
                          <input
                            type="text"
                            placeholder="Ej: Quito, Guayaquil, Cuenca"
                            required
                            className="w-full h-11 bg-slate-50 border border-gray-200 rounded-xl px-3 text-xs focus:outline-none focus:ring-1 focus:ring-kawaii-pink-dark text-kawaii-dark"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10.5px] font-bold text-gray-500">
                            Dirección de Calle y Referencias *
                          </label>
                          <textarea
                            placeholder="Ej: Av. Amazonas y Shyris, junto al Edificio El Parque, depto 402"
                            required
                            className="w-full h-16 bg-slate-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-kawaii-pink-dark text-kawaii-dark resize-none"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setCheckoutStep(1)}
                          className="flex-1 h-12 bg-white text-kawaii-dark border border-gray-200 rounded-xl font-rounded font-semibold text-xs active:scale-95 transition-all"
                        >
                          Atrás
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (address.trim() && city.trim() && province.trim()) {
                              setCheckoutStep(3);
                            } else {
                              triggerToast('❌ Por favor, llena todos los datos');
                            }
                          }}
                          className="flex-[1.4] h-12 bg-kawaii-dark text-white rounded-xl font-rounded font-bold text-xs active:scale-95 transition-all shadow-md"
                          id="checkout-step-2-btn"
                        >
                          Ir al Método de Pago ➜
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: PAYMENT METHOD */}
                  {checkoutStep === 3 && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="bg-white p-4 rounded-2xl border border-gray-100 space-y-4">
                        <h4 className="font-rounded font-bold text-sm text-kawaii-dark border-b border-gray-50 pb-1.5">
                          Método de Pago Seguro 🔒
                        </h4>

                        {/* Payment Selector Buttons (as in wireframe 6) */}
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'tarjeta', label: '💳 Tarjeta', sub: 'Débito/Crédito' },
                            { id: 'payphone', label: '📱 Payphone', sub: 'Pasarela Local' },
                            { id: 'deuna', label: '💵 Deuna', sub: 'Banco Pichincha' },
                            { id: 'transferencia', label: '🏦 Transf.', sub: 'Bancos Locales' }
                          ].map(pay => (
                            <button
                              type="button"
                              key={pay.id}
                              onClick={() => setPaymentMethod(pay.id as any)}
                              className={`p-2 rounded-xl border text-left flex flex-col justify-between transition-all ${
                                paymentMethod === pay.id
                                  ? 'border-kawaii-dark bg-kawaii-pink/20 text-kawaii-dark ring-1 ring-kawaii-dark'
                                  : 'border-gray-100 bg-slate-50 text-gray-600'
                              }`}
                            >
                              <span className="text-[11px] font-bold font-rounded">{pay.label}</span>
                              <span className="text-[9px] text-gray-400 font-sans">{pay.sub}</span>
                            </button>
                          ))}
                        </div>

                        {/* Interactive dynamic sub-forms based on payment selection */}
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                          {paymentMethod === 'tarjeta' && (
                            <div className="space-y-2.5">
                              <p className="text-[10px] text-gray-500 font-bold uppercase font-mono">Detalles de Tarjeta</p>
                              <input
                                type="text"
                                placeholder="Número de Tarjeta (Ej: 4000 1234 5678 9010)"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                className="w-full h-9 bg-white border border-gray-200 rounded-lg px-2.5 text-xs text-kawaii-dark focus:outline-none"
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  placeholder="MM/AA"
                                  value={cardExpiry}
                                  onChange={(e) => setCardExpiry(e.target.value)}
                                  className="w-full h-9 bg-white border border-gray-200 rounded-lg px-2.5 text-xs text-kawaii-dark text-center focus:outline-none"
                                />
                                <input
                                  type="text"
                                  placeholder="CVV"
                                  value={cardCVV}
                                  onChange={(e) => setCardCVV(e.target.value)}
                                  className="w-full h-9 bg-white border border-gray-200 rounded-lg px-2.5 text-xs text-kawaii-dark text-center focus:outline-none"
                                />
                              </div>
                            </div>
                          )}

                          {paymentMethod === 'payphone' && (
                            <div className="space-y-1.5 text-center py-1">
                              <p className="font-bold text-gray-700">Pasarela PayPhone Ecuador 🇪🇨</p>
                              <p className="text-[11px] text-gray-500">Se abrirá la ventana de cobros oficial para pagar con tu saldo de la billetera o cualquier tarjeta local sin recargos.</p>
                            </div>
                          )}

                          {paymentMethod === 'deuna' && (
                            <div className="space-y-2 text-center py-1 flex flex-col items-center">
                              <p className="font-bold text-emerald-800">Pago Express con Deuna! 💸</p>
                              <p className="text-[10.5px] text-gray-600">Escanea el código QR de Banco Pichincha desde tu app móvil o ingresa tu número celular para procesar el débito.</p>
                              <div className="w-16 h-16 bg-slate-300 rounded flex items-center justify-center text-xs text-gray-600">QR Code</div>
                            </div>
                          )}

                          {paymentMethod === 'transferencia' && (
                            <div className="space-y-1 text-gray-600">
                              <p className="font-bold text-kawaii-dark">Datos de Cuenta Corriente:</p>
                              <p className="text-[10.5px]"><strong>Banco Pichincha:</strong> Cuenta #2201928402 (Ahorros)</p>
                              <p className="text-[10.5px]"><strong>Titular:</strong> Your Kawaii Closet S.A.S</p>
                              <p className="text-[10.5px]"><strong>RUC / ID:</strong> 1792847291001</p>
                              <p className="text-[10px] text-gray-400 mt-1">Por favor envía el comprobante de transferencia a nuestro WhatsApp una vez finalizado.</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Security Shield badge */}
                      <div className="flex items-center justify-center gap-1.5 text-gray-500 text-[10.5px] py-1 text-center bg-white rounded-xl border border-gray-100">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span>Transacciones protegidas con cifrado SSL de 256 bits</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setCheckoutStep(2)}
                          className="flex-1 h-12 bg-white text-kawaii-dark border border-gray-200 rounded-xl font-rounded font-semibold text-xs active:scale-95 transition-all"
                        >
                          Atrás
                        </button>
                        <button
                          type="submit"
                          className="flex-[1.4] h-12 bg-kawaii-dark hover:bg-black text-white rounded-xl font-rounded font-bold text-xs active:scale-95 transition-all shadow-md flex items-center justify-center gap-1"
                          id="submit-order-btn"
                        >
                          Finalizar Pedido — {formatUSD(cartTotal)}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              )}

              {/* SCREEN 7: CONFIRMATION (¡Pedido confirmado!) */}
              {currentScreen === 'confirmation' && placedOrder && (
                <div className="animate-fade-in p-4 space-y-4">
                  <div className="bg-white p-5 rounded-3xl border border-gray-100 text-center space-y-3 shadow-3xs">
                    <div className="w-14 h-14 bg-kawaii-mint/50 rounded-full mx-auto flex items-center justify-center text-3xl">
                      🌸
                    </div>

                    <div className="space-y-0.5">
                      <h3 className="font-rounded text-base font-bold text-kawaii-dark">¡Muchas gracias, {placedOrder.fullname}!</h3>
                      <p className="text-xs text-gray-500">Tu pedido {placedOrder.id} está siendo preparado.</p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs text-left text-gray-600">
                      <p className="flex justify-between">
                        <span>Llega el:</span>
                        <strong className="text-kawaii-dark">{placedOrder.deliveryDate}</strong>
                      </p>
                      <p className="flex justify-between">
                        <span>Ciudad:</span>
                        <span className="font-medium text-kawaii-dark">{placedOrder.city}, {placedOrder.province}</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Pago vía:</span>
                        <span className="font-medium text-kawaii-dark uppercase">{placedOrder.paymentMethod}</span>
                      </p>
                      <p className="flex justify-between border-t border-gray-200 pt-1.5 mt-1 text-kawaii-dark font-bold">
                        <span>Total cancelado:</span>
                        <span>{formatUSD(placedOrder.total)}</span>
                      </p>
                    </div>
                  </div>

                  {/* Tracking / CTA Actions (as in wireframe 7) */}
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        triggerToast('📦 Abriendo portal de rastreo Servientrega...');
                      }}
                      className="w-full h-11 bg-white hover:bg-slate-50 text-kawaii-dark border border-gray-200 rounded-xl font-rounded font-semibold text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Truck className="w-4 h-4 text-pink-500" /> Rastrear Mi Pedido en Vivo
                    </button>

                    <button
                      onClick={() => {
                        triggerToast('💬 Alertas de WhatsApp configuradas con éxito!');
                      }}
                      className="w-full h-11 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-rounded font-semibold text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Smartphone className="w-4 h-4 text-emerald-600" /> Recibir avisos automáticos por WhatsApp
                    </button>
                  </div>

                  {/* Save measurements account promo (as in wireframe 7) */}
                  <div className="bg-gradient-to-r from-kawaii-pink/20 to-kawaii-lila/20 rounded-2xl p-4 border border-white text-center space-y-3 shadow-3xs">
                    <div className="space-y-0.5">
                      <h4 className="font-rounded text-xs font-bold text-kawaii-dark">
                        🎀 ¿Quieres guardar tu avatar para la próxima?
                      </h4>
                      <p className="text-[10px] text-gray-500">
                        Crea tu cuenta de clienta en 10 segundos para dejar guardadas tus medidas de talle y tu avatar chibi.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          triggerToast('¡Cuenta creada con éxito! Tus medidas están sincronizadas 🔒');
                        }}
                        className="flex-1 h-9 bg-kawaii-dark text-white rounded-lg text-[10px] font-bold font-rounded active:scale-95 transition-all"
                      >
                        Crear Cuenta 🌸
                      </button>
                      <button
                        onClick={() => {
                          setCurrentScreen('home');
                        }}
                        className="flex-1 h-9 bg-white text-gray-500 border border-gray-200 rounded-lg text-[10px] font-medium font-rounded active:scale-95 transition-all"
                      >
                        Ahora No, Volver
                      </button>
                    </div>
                  </div>

                  {/* Foto + Puntos promo */}
                  <div className="bg-white p-3.5 rounded-2xl border border-gray-100 text-center space-y-1">
                    <p className="text-xl">📸</p>
                    <h4 className="font-rounded font-bold text-[11px] text-kawaii-dark">¡Gana puntos con tus fotos!</h4>
                    <p className="text-[10px] text-gray-500">
                      Cuando llegue tu compra, sube tu foto real usando la prenda en la app y obtén $5 de descuento en tu próximo pedido.
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* FLOATING MOBILE TABBAR NAVIGATION BAR (As requested in wireframe and goals) */}
            <nav className="absolute bottom-0 left-0 right-0 h-14 bg-white border-t border-gray-100 px-2 flex justify-around items-center z-40">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCurrentScreen('home');
                }}
                className={`flex flex-col items-center gap-0.5 flex-1 py-1.5 ${
                  currentScreen === 'home' ? 'text-kawaii-pink-dark font-bold' : 'text-gray-400'
                }`}
              >
                <HomeIcon className="w-5 h-5" />
                <span className="text-[9px] font-rounded">Inicio</span>
              </button>

              <button
                onClick={() => {
                  setCurrentScreen('catalog');
                }}
                className={`flex flex-col items-center gap-0.5 flex-1 py-1.5 ${
                  currentScreen === 'catalog' || currentScreen === 'product-detail'
                    ? 'text-kawaii-pink-dark font-bold'
                    : 'text-gray-400'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="text-[9px] font-rounded">Catálogo</span>
              </button>

              <button
                onClick={() => {
                  if (!avatarConfig) {
                    setCurrentScreen('avatar-builder');
                    setWizardStep(1);
                  } else {
                    setCurrentScreen('virtual-try-on');
                  }
                }}
                className={`flex flex-col items-center gap-0.5 flex-1 py-1.5 ${
                  currentScreen === 'avatar-builder' || currentScreen === 'virtual-try-on'
                    ? 'text-kawaii-pink-dark font-bold'
                    : 'text-gray-400'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                <span className="text-[9px] font-rounded">Mi Probador</span>
              </button>

              <button
                onClick={() => {
                  setCurrentScreen('cart');
                }}
                className={`flex flex-col items-center gap-0.5 flex-1 py-1.5 ${
                  currentScreen === 'cart' || currentScreen === 'checkout'
                    ? 'text-kawaii-pink-dark font-bold'
                    : 'text-gray-400'
                }`}
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                      {cart.reduce((sum, i) => sum + i.quantity, 0)}
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-rounded">Carrito</span>
              </button>
            </nav>

            {/* TOAST NOTIFICATION FEEDBACK POPUP */}
            {toastMessage && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-kawaii-dark text-white px-3.5 py-2.5 rounded-xl shadow-lg flex items-center gap-1.5 z-50 text-[11px] font-medium border border-gray-700 animate-slide-up">
                <span className="text-sm">✨</span>
                <span>{toastMessage}</span>
              </div>
            )}

            {/* SHARE MODAL - MODO MAMÁ WISHLIST */}
            {shareModalOpen && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs z-50 flex items-end justify-center">
                <div className="bg-white w-full rounded-t-3xl p-5 space-y-4 animate-slide-up max-h-[90%] overflow-y-auto">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <h4 className="font-rounded text-sm font-bold text-kawaii-dark flex items-center gap-1">
                        💌 Compartir mi Look (Modo Mamá)
                      </h4>
                      <p className="text-[10px] text-gray-500">
                        Envía tu lista de deseos de forma segura para que mamá complete el pago en su talle ideal.
                      </p>
                    </div>
                    <button
                      onClick={() => setShareModalOpen(false)}
                      className="text-gray-400 hover:text-kawaii-dark text-lg font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Sizing & details overview */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-3">
                    <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-gray-400">
                      Resumen del Look seleccionado:
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-14 bg-white rounded-lg p-0.5 shadow-inner">
                        {avatarConfig && <ChibiAvatar config={avatarConfig} />}
                      </div>
                      <div className="text-xs">
                        <p className="font-bold text-kawaii-dark">Prenda seleccionada:</p>
                        <p className="text-pink-600 font-bold">
                          {avatarConfig?.activeClothingId 
                            ? PRODUCTS.find(p => p.id === avatarConfig.activeClothingId)?.name 
                            : 'Ninguna prenda activa'}
                        </p>
                        <p className="text-gray-500">Talla recomendada: <strong>{activeRecommendedSize}</strong></p>
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl text-[10.5px] border border-gray-50 text-gray-600 space-y-1">
                      <p><strong>Precio Prenda:</strong> {formatUSD(PRODUCTS.find(p => p.id === avatarConfig?.activeClothingId)?.price || 0)}</p>
                      <p><strong>Costo Envío (Quito/Guayaquil/Ecuador):</strong> {formatUSD(SHIPPING_COST)}</p>
                      <p className="border-t border-gray-100 pt-1 mt-1 font-bold text-kawaii-dark flex justify-between">
                        <span>Total del Look:</span>
                        <span>{formatUSD((PRODUCTS.find(p => p.id === avatarConfig?.activeClothingId)?.price || 0) + SHIPPING_COST)}</span>
                      </p>
                    </div>
                  </div>

                  {/* Prewritten cute microcopy message for Mom */}
                  <div className="space-y-1">
                    <span className="block text-[10px] text-gray-400 font-mono uppercase">Mensaje predeterminado para Mamá:</span>
                    <div className="bg-slate-100 p-2.5 rounded-xl text-[11px] italic text-gray-600 leading-normal border border-slate-200">
                      "Hola mamá 💖, me encantaría este look de Your Kawaii Closet. El probador virtual calculó que mi talla ideal es la <strong className="text-pink-600">{activeRecommendedSize}</strong> con mis medidas. Tienen envíos rápidos a todo el país y el primer cambio de talle es gratis por si acaso. ¿Me lo compras? 🥰 Link: {window.location.origin}/share-look"
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `Hola mamá 💖, me encantaría este look de Your Kawaii Closet. El probador virtual calculó que mi talla ideal es la ${activeRecommendedSize} con mis medidas. Link: ${window.location.origin}/share-look`
                        );
                        triggerToast('📋 ¡Mensaje copiado al portapapeles!');
                        setShareModalOpen(false);
                      }}
                      className="w-full h-11 bg-kawaii-dark text-white rounded-xl font-rounded font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Copy className="w-4 h-4" /> Copiar y Enviar por WhatsApp 📱
                    </button>

                    <button
                      onClick={() => setShareModalOpen(false)}
                      className="w-full h-11 bg-white text-gray-500 border border-gray-200 rounded-xl font-rounded font-semibold text-xs active:scale-95 transition-all"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Device Indicator Bar */}
          <div className="w-full h-4 flex justify-center items-end select-none">
            <span className="w-32 h-1 bg-white/40 rounded-full"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
