import React, { useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useReducedMotion,
} from 'motion/react';
import {
  Menu,
  X,
  Plus,
  Minus,
  ShoppingBag,
  Clock,
  MapPin,
  Check,
  Trash2,
  RotateCcw,
  Coffee,
  Calendar,
  ChevronDown,
  ArrowUp,
  ArrowRight,
  User,
} from 'lucide-react';
import {
  HERO_SLIDES,
  PRODUCTS,
  FEATURED_HERO_PRODUCT,
  RED_VELVET_ROYALE,
  ATELIER_IMAGE,
  SALON_IMAGE,
  BAKEROOM_GALLERY,
  WORDPRESS_CATEGORIES,
  ATELIER_PILLARS,
  ATELIER_METRICS,
  PAIRING_GUIDES,
  PATRON_NOTES,
  JOURNAL_POSTS,
  FAQ_ITEMS,
  formatNaira,
  type PastryProduct,
  type JournalPost,
} from './data/patisserie';
import { IntroCurtain } from './components/IntroCurtain';
import { ScrollScrubVideo } from './components/ScrollScrubVideo';
import { ScrollFadeSection } from './components/ScrollFadeSection';
import {
  ClientAccountModal,
  type ClientAccount,
} from './components/ClientAccountModal';

interface CartItem {
  product: PastryProduct;
  quantity: number;
}

type CategoryFilter = 'All' | 'Tarts' | 'Layer Cakes' | 'Signature';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const CLIENT_STORAGE_KEY = 'rolex_patisserie_client_account';

function CrownEmblem({ className = 'w-6 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M5 19L3 8.5L11 13.5L18 4.5L25 13.5L33 8.5L31 19H5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M5 21.5H31" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="3" cy="6.5" r="1.4" fill="currentColor" />
      <circle cx="18" cy="2.5" r="1.6" fill="currentColor" />
      <circle cx="33" cy="6.5" r="1.4" fill="currentColor" />
    </svg>
  );
}

function SafeImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (failed) {
    return (
      <div
        className={`${className ?? ''} flex flex-col items-center justify-center bg-gradient-to-br from-[#2B221E] to-[#1D1613] text-stone-300 p-4 text-center`}
        role="img"
        aria-label={alt}
      >
        <CrownEmblem className="w-8 h-6 mb-2 text-stone-400" />
        <span className="text-xs font-medium tracking-wide uppercase">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

export default function App() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();

  // Smoothly fade & lift Hero completely off as soon as user starts scrolling down
  const heroOpacity = useTransform(scrollY, [0, 260], [1, 0]);
  const heroY = useTransform(scrollY, [0, 260], [0, -54]);

  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 450);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const [showIntro, setShowIntro] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');
  const [activePairingId, setActivePairingId] = useState(PAIRING_GUIDES[0].id);
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQ_ITEMS[0].id);
  const [activeJournalPost, setActiveJournalPost] = useState<JournalPost | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const [hoursOpen, setHoursOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<PastryProduct | null>(null);
  const [modalQty, setModalQty] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderConfirmed, setOrderConfirmed] = useState<string | null>(null);

  // Client Account State
  const [clientAccount, setClientAccount] = useState<ClientAccount | null>(() => {
    try {
      const saved = window.localStorage.getItem(CLIENT_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as ClientAccount) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (clientAccount) {
        window.localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(clientAccount));
      } else {
        window.localStorage.removeItem(CLIENT_STORAGE_KEY);
      }
    } catch {
      // Ignore storage quota errors
    }
  }, [clientAccount]);

  // Salon & Bespoke Reservation Form State
  const [bookingType, setBookingType] = useState<'salon' | 'bespoke'>('salon');
  const [bookingGuestName, setBookingGuestName] = useState(clientAccount?.fullName ?? '');
  const [bookingEmail, setBookingEmail] = useState(clientAccount?.email ?? '');
  const [bookingDate, setBookingDate] = useState('2026-11-28');
  const [bookingDetail, setBookingDetail] = useState('2 Guests · Afternoon Tea (₦28,000)');
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingRef, setBookingRef] = useState<string | null>(null);

  // Morning Menu Dispatch Signup State
  const [dispatchEmail, setDispatchEmail] = useState('');
  const [dispatchError, setDispatchError] = useState<string | null>(null);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  const currentSlide = HERO_SLIDES[activeSlide] ?? HERO_SLIDES[0];
  const activePairing =
    PAIRING_GUIDES.find((p) => p.id === activePairingId) ?? PAIRING_GUIDES[0];

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const allCatalogProducts: PastryProduct[] = [
    FEATURED_HERO_PRODUCT,
    RED_VELVET_ROYALE,
    ...PRODUCTS,
  ];

  const filteredProducts: PastryProduct[] = (() => {
    if (categoryFilter === 'All') {
      return PRODUCTS;
    }
    if (categoryFilter === 'Signature') {
      return [PRODUCTS[4], FEATURED_HERO_PRODUCT, RED_VELVET_ROYALE];
    }
    return PRODUCTS.filter((p) => p.category === categoryFilter);
  })();

  const handleEnterWebsite = () => {
    setShowIntro(false);
    window.scrollTo({ top: 0 });
  };

  const openProductModal = (product: PastryProduct) => {
    setSelectedProduct(product);
    setModalQty(1);
  };

  const addToCart = (product: PastryProduct, quantity = 1) => {
    setOrderConfirmed(null);
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleCheckout = () => {
    const code = `RX-${Math.floor(1000 + Math.random() * 9000)}`;
    if (clientAccount && cart.length > 0) {
      const summary = cart.map((i) => `${i.quantity}x ${i.product.name}`).join(', ');
      const today = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      setClientAccount((prev) =>
        prev
          ? {
              ...prev,
              orders: [
                { id: code, date: today, itemsSummary: summary, total: subtotal },
                ...prev.orders,
              ],
            }
          : prev
      );
    }
    setOrderConfirmed(code);
    setCart([]);
  };

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = bookingGuestName.trim();
    const trimmedEmail = bookingEmail.trim();
    if (trimmedName.length < 2) {
      setBookingError('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setBookingError('Please enter a valid email address.');
      return;
    }
    setBookingError(null);
    const ref = `RX-SALON-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingRef(ref);
    if (clientAccount) {
      setClientAccount((prev) =>
        prev
          ? {
              ...prev,
              reservations: [
                { ref, type: bookingType, date: bookingDate, detail: bookingDetail },
                ...prev.reservations,
              ],
            }
          : prev
      );
    }
  };

  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = dispatchEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setDispatchError('Please enter a valid email address.');
      return;
    }
    setDispatchError(null);
    setDispatchSuccess(true);
    setDispatchEmail('');
  };

  const clientFirstName = clientAccount?.fullName.split(' ')[0] ?? null;

  return (
    <div className="relative min-h-screen flex flex-col text-white font-sans">
      {/* Fixed Full-Viewport Scroll-Scrubbed Cake Video Body */}
      <ScrollScrubVideo unlocked={!showIntro} />

      {/* Rolling Animated Red Velvet Cake Intro Curtain */}
      <IntroCurtain visible={showIntro} onEnter={handleEnterWebsite} />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#1C1613]/75 backdrop-blur-md text-white">
        <div className="max-w-[1440px] mx-auto h-[72px] px-6 sm:px-10 flex items-center justify-between gap-8">
          {/* Left: Hamburger + Crown & ROLEX Brand */}
          <div className="flex items-center gap-5 shrink-0">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              className="p-2 -ml-2 text-white/90 hover:text-white transition-colors cursor-pointer rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <Menu className="w-5 h-5 stroke-[1.5]" />
            </button>

            <a
              href="#top"
              className="flex flex-col items-center justify-center text-white whitespace-nowrap shrink-0 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-white rounded px-1"
            >
              <CrownEmblem className="w-6 h-4 text-white/90 group-hover:text-white transition-colors" />
              <span className="text-[17px] tracking-[0.22em] font-semibold leading-none mt-1">
                ROLEX
              </span>
            </a>
          </div>

          {/* Right: Clean Single-Line Nav Links + Login Icon + Order Pill */}
          <div className="flex items-center gap-6 sm:gap-8 shrink-0">
            <nav
              aria-label="Primary navigation"
              className="hidden md:flex items-center gap-7 text-[11px] font-medium tracking-[0.18em] uppercase text-white/85"
            >
              <a
                href="#products"
                className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1"
              >
                PASTRIES
              </a>
              <a
                href="#bakeroom"
                className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1"
              >
                BAKE ROOM
              </a>
              <a
                href="#salon"
                className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1"
              >
                SALON
              </a>
              <a
                href="#journal"
                className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1"
              >
                JOURNAL
              </a>
            </nav>

            <div className="flex items-center gap-3 shrink-0">
              {/* Client Account Login Icon Button */}
              <button
                type="button"
                onClick={() => setAccountOpen(true)}
                aria-label={
                  clientFirstName ? `Client Account (${clientFirstName})` : 'Client Sign In'
                }
                title={clientFirstName ? `Account · ${clientFirstName}` : 'Client Sign In'}
                className="inline-flex items-center gap-2 h-10 px-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                <User className="w-4 h-4 stroke-[1.75]" />
                {clientFirstName && (
                  <span className="hidden sm:inline text-[11px] font-medium tracking-[0.08em]">
                    {clientFirstName}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setBagOpen(true)}
                className="px-5 py-2 rounded-full bg-white/15 hover:bg-white hover:text-[#1D1918] text-[11px] font-medium tracking-[0.16em] uppercase text-white transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                {totalItems > 0 ? `MY BAG (${totalItems})` : 'ORDER NOW'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main id="top" className="relative z-10 flex-1">
        {/* Section 1: Full-Viewport First-Glance Hero (Video + Hero Features Only; fades completely away on scroll down) */}
        <section className="relative w-full min-h-[calc(100vh-72px)] flex items-center overflow-hidden">
          {!currentSlide.isVideoBackdrop && (
            <SafeImage
              src={currentSlide.image}
              alt={`${currentSlide.kicker} ${currentSlide.headline} — ${currentSlide.tagline}`}
              className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500"
            />
          )}

          <motion.div
            style={prefersReducedMotion ? undefined : { opacity: heroOpacity }}
            className="absolute inset-0 bg-gradient-to-r from-[#140F0B]/70 via-[#140F0B]/30 to-transparent pointer-events-none"
            aria-hidden="true"
          />

          <motion.div
            style={prefersReducedMotion ? undefined : { opacity: heroOpacity, y: heroY }}
            className="relative z-10 w-full max-w-[1440px] mx-auto px-8 sm:px-14 lg:px-20 py-20 flex flex-col justify-center"
          >
            <div className="max-w-xl">
              <p className="text-[13px] sm:text-sm font-light tracking-[0.24em] uppercase text-white/95">
                {currentSlide.kicker}
              </p>
              <h1 className="text-5xl sm:text-6xl lg:text-[74px] font-semibold tracking-[0.04em] leading-[1.02] text-white mt-2 uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
                {currentSlide.headline}
              </h1>
              <p className="text-[13px] sm:text-sm font-light tracking-[0.22em] uppercase text-white/90 mt-3 drop-shadow-sm">
                {currentSlide.tagline}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-5">
                <button
                  type="button"
                  onClick={() => scrollToSection('products')}
                  className="inline-flex items-center justify-center bg-white text-[#1D1918] rounded-full px-7 py-3 text-[11px] font-semibold tracking-[0.14em] uppercase shadow-lg hover:bg-stone-100 active:scale-[0.98] transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                >
                  ORDER NOW
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const found = allCatalogProducts.find((p) => p.id === currentSlide.productId);
                    if (found) openProductModal(found);
                  }}
                  className="text-[11px] font-medium tracking-[0.16em] uppercase text-white/90 hover:text-white underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0"
                >
                  View Featured Cake
                </button>
              </div>
            </div>
          </motion.div>

          {/* 7 Interactive Carousel Pagination Dots */}
          <motion.div
            style={prefersReducedMotion ? undefined : { opacity: heroOpacity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2.5"
            role="tablist"
            aria-label="Hero showcase slides"
          >
            {HERO_SLIDES.map((slide, index) => {
              const isActive = index === activeSlide;
              return (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`View slide ${index + 1}: ${slide.tagline}`}
                  onClick={() => setActiveSlide(index)}
                  className={`h-2.5 w-2.5 rounded-full transition-all duration-200 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 ${
                    isActive ? 'bg-white scale-110' : 'bg-white/45 hover:bg-white/80'
                  }`}
                />
              );
            })}
          </motion.div>
        </section>

        {/* Section 2: Borderless Cakes Appearing Sweetly One After Another & Disappearing on Scroll Away */}
        <ScrollFadeSection id="products" className="py-24 sm:py-32">
          <div className="max-w-[1380px] mx-auto px-6 sm:px-10">
            <div className="flex flex-col items-center text-center mb-12">
              <p className="text-[11px] font-medium tracking-[0.22em] uppercase text-[#F4D9AC]">
                Freshly Finished
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-[0.16em] uppercase text-white mt-2 drop-shadow-sm">
                PRODUCTS
              </h2>

              <div
                className="mt-6 inline-flex flex-wrap items-center justify-center gap-1.5 p-1 bg-black/35 backdrop-blur-sm rounded-full"
                role="tablist"
                aria-label="Filter patisserie products"
              >
                {(['All', 'Tarts', 'Layer Cakes', 'Signature'] as CategoryFilter[]).map((tab) => {
                  const active = categoryFilter === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setCategoryFilter(tab)}
                      className={`px-4 py-1.5 text-[11px] font-medium tracking-[0.12em] uppercase rounded-full transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        active ? 'bg-white text-[#1D1918]' : 'text-white/80 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              className={`grid gap-7 sm:gap-8 ${
                filteredProducts.length >= 5
                  ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto'
              }`}
            >
              {filteredProducts.map((product, index) => (
                <motion.article
                  key={`${categoryFilter}-${product.id}`}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 56, scale: 0.94 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.18 }}
                  transition={{
                    duration: 0.55,
                    delay: prefersReducedMotion ? 0 : index * 0.11,
                    ease: EASE_OUT,
                  }}
                  onClick={() => openProductModal(product)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openProductModal(product);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`View ${product.name} — ${formatNaira(product.price)}`}
                  className="group cursor-pointer flex flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-white rounded-xl"
                >
                  <div className="relative aspect-[4/3.6] w-full overflow-hidden rounded-xl shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
                    <SafeImage
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-300"
                    />
                  </div>

                  <div className="pt-3.5 px-1 flex-1 flex flex-col justify-between text-left">
                    <div>
                      <h3 className="text-[17px] font-medium text-white leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]">
                        {product.name}
                      </h3>
                      <p className="text-[12px] text-white/80 mt-0.5 truncate drop-shadow-[0_1px_6px_rgba(0,0,0,0.65)]">
                        {product.subtitle}
                      </p>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-[15px] font-semibold text-[#F4D9AC] tabular-nums drop-shadow-[0_1px_6px_rgba(0,0,0,0.65)]">
                        {formatNaira(product.price)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product, 1);
                          setBagOpen(true);
                        }}
                        aria-label={`Add ${product.name} to bag`}
                        className="text-[11px] font-medium tracking-[0.12em] uppercase text-white/90 hover:text-white underline underline-offset-4 transition-opacity px-1.5 py-1 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </ScrollFadeSection>

        {/* Section 3: WordPress-Style Featured Collections & Quick Jump */}
        <ScrollFadeSection id="collections" className="py-20 sm:py-24">
          <div className="max-w-[1380px] mx-auto px-6 sm:px-10">
            <div className="mb-10">
              <p className="text-[11px] font-medium tracking-[0.22em] uppercase text-[#F4D9AC]">
                Browse By Selection
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-white mt-2">
                Curated Patisserie Collections
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {WORDPRESS_CATEGORIES.map((cat, index) => (
                <motion.button
                  key={cat.id}
                  type="button"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: prefersReducedMotion ? 0 : index * 0.1,
                    ease: EASE_OUT,
                  }}
                  onClick={() => {
                    setCategoryFilter(cat.filter);
                    scrollToSection('products');
                  }}
                  className="text-left bg-black/35 backdrop-blur-md hover:bg-black/50 rounded-xl p-6 transition-colors cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <p className="text-xs font-medium text-[#F4D9AC] tabular-nums">{cat.count}</p>
                    <h3 className="text-lg font-semibold text-white mt-1.5">{cat.title}</h3>
                    <p className="text-xs text-white/75 leading-relaxed mt-2">{cat.description}</p>
                  </div>
                  <div className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.14em] uppercase text-white/90 group-hover:text-white">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </ScrollFadeSection>

        {/* Section 4: Real Bake Room Behind-The-Scenes Gallery */}
        <ScrollFadeSection id="bakeroom" className="py-20 sm:py-28">
          <div className="max-w-[1380px] mx-auto px-6 sm:px-10">
            <div className="max-w-2xl mb-12">
              <p className="text-[11px] font-medium tracking-[0.22em] uppercase text-[#F4D9AC]">
                Real Bake Room · Live Kitchen
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold leading-tight text-white mt-2 [text-wrap:balance]">
                Inside the Rolex Bake Room
              </h2>
              <p className="text-sm sm:text-[15px] text-white/80 leading-relaxed mt-3">
                Every photograph below captures our working bake room—from pre-dawn deck oven
                pulls to marble cream piping and morning counter display.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
              {BAKEROOM_GALLERY.map((moment, index) => (
                <motion.figure
                  key={moment.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 50, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.16 }}
                  transition={{
                    duration: 0.58,
                    delay: prefersReducedMotion ? 0 : index * 0.12,
                    ease: EASE_OUT,
                  }}
                  className="flex flex-col"
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
                    <SafeImage
                      src={moment.image}
                      alt={moment.title}
                      className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-500"
                    />
                  </div>
                  <figcaption className="pt-3.5 px-1">
                    <p className="text-[11px] font-medium tracking-[0.16em] uppercase text-[#F4D9AC] tabular-nums">
                      {moment.time}
                    </p>
                    <h3 className="text-base font-semibold text-white mt-1">{moment.title}</h3>
                    <p className="text-xs text-white/75 leading-relaxed mt-1">{moment.caption}</p>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        </ScrollFadeSection>

        {/* Section 5: The Atelier & Craftsmanship Directly on Video */}
        <ScrollFadeSection id="atelier" className="py-20 sm:py-28">
          <div className="max-w-[1380px] mx-auto px-6 sm:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
              <div className="lg:col-span-6 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.45)] min-h-[340px]">
                <SafeImage
                  src={ATELIER_IMAGE}
                  alt="Head pastry chef finishing a raspberry glaze entremet on marble in the bake room"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="lg:col-span-6 flex flex-col justify-between py-2">
                <div>
                  <p className="text-[11px] font-medium tracking-[0.22em] uppercase text-[#F4D9AC]">
                    Savoir-Faire · Bake Room Standards
                  </p>
                  <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-semibold leading-[1.18] text-white mt-3 max-w-xl [text-wrap:balance]">
                    Hand-Finished Every Morning Before Dawn
                  </h2>
                  <p className="text-[15px] text-white/85 leading-relaxed mt-4 max-w-xl">
                    Inside our marble-lined bake room, every tart shell, fruit compote, and whipped
                    mousse is prepared in small daily batches without artificial stabilizers or frozen
                    shortcuts.
                  </p>
                </div>

                <div className="mt-8 space-y-5">
                  {ATELIER_PILLARS.map((pillar, index) => (
                    <motion.div
                      key={pillar.index}
                      initial={prefersReducedMotion ? false : { opacity: 0, x: 24 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.25 }}
                      transition={{
                        duration: 0.45,
                        delay: prefersReducedMotion ? 0 : index * 0.1,
                        ease: EASE_OUT,
                      }}
                      className="flex items-start gap-4"
                    >
                      <span className="text-xs font-semibold tracking-[0.12em] text-[#F4D9AC] tabular-nums pt-0.5 shrink-0">
                        {pillar.index}.
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold text-white">{pillar.title}</h3>
                        <p className="text-xs sm:text-[13px] text-white/80 leading-relaxed mt-1">
                          {pillar.detail}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Full-Width 4-Column Craftsmanship Metrics Strip */}
            <div className="mt-14 pt-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
              {ATELIER_METRICS.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{
                    duration: 0.45,
                    delay: prefersReducedMotion ? 0 : index * 0.08,
                    ease: EASE_OUT,
                  }}
                >
                  <p className="text-3xl sm:text-4xl font-semibold text-[#F4D9AC] tabular-nums drop-shadow-sm">
                    {metric.value}
                  </p>
                  <p className="text-xs tracking-[0.14em] uppercase text-white/80 mt-1.5">
                    {metric.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollFadeSection>

        {/* Section 6: Tea Salon & Bespoke Celebrations Concierge */}
        <ScrollFadeSection id="salon" className="py-20 sm:py-28">
          <div className="max-w-[1380px] mx-auto px-6 sm:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <p className="text-[11px] font-medium tracking-[0.22em] uppercase text-[#F4D9AC]">
                    The Salon & Bespoke Commissions
                  </p>
                  <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-semibold leading-[1.18] text-white mt-3 [text-wrap:balance]">
                    Afternoon High Tea & Custom Tiered Cakes
                  </h2>
                  <p className="text-[15px] text-white/85 leading-relaxed mt-4 max-w-2xl">
                    Reserve a quiet window table in our tea salon for tiered afternoon service, or
                    commission a bespoke multi-tier Velours Crimson or Framboise cake for private
                    celebrations.
                  </p>
                </div>

                <div className="mt-8 rounded-xl overflow-hidden aspect-[16/9] shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
                  <SafeImage
                    src={SALON_IMAGE}
                    alt="Rolex Patisserie tea salon interior with tiered pastry stands"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Borderless Translucent Concierge Desk */}
              <div className="lg:col-span-5 bg-black/45 backdrop-blur-md rounded-xl p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-4 pb-5">
                    <div className="flex items-center gap-2 text-xs tracking-[0.16em] uppercase text-white/90">
                      <Calendar className="w-4 h-4 text-[#F4D9AC]" />
                      <span>Concierge Desk</span>
                    </div>

                    <div className="flex items-center gap-1 p-1 bg-white/10 rounded-full">
                      <button
                        type="button"
                        onClick={() => {
                          setBookingType('salon');
                          setBookingDetail('2 Guests · Afternoon Tea (₦28,000)');
                          setBookingRef(null);
                        }}
                        className={`px-3 py-1 text-[11px] font-medium rounded-full transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          bookingType === 'salon'
                            ? 'bg-white text-[#1D1918]'
                            : 'text-white/80 hover:text-white'
                        }`}
                      >
                        Tea Table
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setBookingType('bespoke');
                          setBookingDetail('2-Tier Velours Crimson · ₦95,000');
                          setBookingRef(null);
                        }}
                        className={`px-3 py-1 text-[11px] font-medium rounded-full transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          bookingType === 'bespoke'
                            ? 'bg-white text-[#1D1918]'
                            : 'text-white/80 hover:text-white'
                        }`}
                      >
                        Bespoke Cake
                      </button>
                    </div>
                  </div>

                  {bookingRef ? (
                    <div className="py-10 text-center">
                      <div className="w-11 h-11 rounded-full bg-white/15 text-white flex items-center justify-center mx-auto mb-4">
                        <Check className="w-5 h-5" />
                      </div>
                      <h3 className="text-2xl font-semibold text-white">
                        Confirmed · {bookingRef}
                      </h3>
                      <p className="text-sm text-white/85 mt-2 leading-relaxed">
                        {bookingGuestName}, our salon concierge has logged your{' '}
                        {bookingType === 'salon' ? 'table reservation' : 'custom cake inquiry'} for{' '}
                        <span className="text-white font-medium">{bookingDate}</span> (
                        {bookingDetail}).
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setBookingRef(null);
                          setBookingGuestName('');
                          setBookingEmail('');
                        }}
                        className="mt-6 px-6 py-2.5 rounded-full bg-white/15 text-xs font-medium tracking-[0.14em] uppercase text-white hover:bg-white hover:text-[#1D1918] transition-colors cursor-pointer"
                      >
                        Make Another Request
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleBookingSubmit} className="mt-4 space-y-4">
                      <div>
                        <label
                          htmlFor="booking-name"
                          className="block text-[11px] tracking-[0.14em] uppercase text-white/75 mb-1.5"
                        >
                          Guest Name
                        </label>
                        <input
                          id="booking-name"
                          type="text"
                          value={bookingGuestName}
                          onChange={(e) => setBookingGuestName(e.target.value)}
                          placeholder="Amaka Okafor"
                          className="w-full rounded-lg bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:bg-white/15"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="booking-email"
                          className="block text-[11px] tracking-[0.14em] uppercase text-white/75 mb-1.5"
                        >
                          Email Address
                        </label>
                        <input
                          id="booking-email"
                          type="email"
                          value={bookingEmail}
                          onChange={(e) => setBookingEmail(e.target.value)}
                          placeholder="amaka@example.com"
                          className="w-full rounded-lg bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:bg-white/15"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="booking-date"
                            className="block text-[11px] tracking-[0.14em] uppercase text-white/75 mb-1.5"
                          >
                            Preferred Date
                          </label>
                          <input
                            id="booking-date"
                            type="date"
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            className="w-full rounded-lg bg-white/10 px-3.5 py-2.5 text-sm text-white tabular-nums focus:outline-none focus:bg-white/15"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="booking-option"
                            className="block text-[11px] tracking-[0.14em] uppercase text-white/75 mb-1.5"
                          >
                            {bookingType === 'salon' ? 'Party Size' : 'Cake Tier'}
                          </label>
                          <select
                            id="booking-option"
                            value={bookingDetail}
                            onChange={(e) => setBookingDetail(e.target.value)}
                            className="w-full rounded-lg bg-[#241C18] px-3.5 py-2.5 text-sm text-white focus:outline-none"
                          >
                            {bookingType === 'salon' ? (
                              <>
                                <option value="2 Guests · Afternoon Tea (₦28,000)">
                                  2 Guests · Afternoon Tea (₦28,000)
                                </option>
                                <option value="4 Guests · Tiered Salon (₦52,000)">
                                  4 Guests · Tiered Salon (₦52,000)
                                </option>
                                <option value="6 Guests · Window Alcove (₦76,000)">
                                  6 Guests · Window Alcove (₦76,000)
                                </option>
                              </>
                            ) : (
                              <>
                                <option value="2-Tier Velours Crimson · ₦95,000">
                                  2-Tier Velours Crimson · ₦95,000
                                </option>
                                <option value="3-Tier Framboise Grand · ₦185,000">
                                  3-Tier Framboise Grand · ₦185,000
                                </option>
                                <option value="Salon Pastry Tower (36 pcs) · ₦68,000">
                                  Salon Pastry Tower (36 pcs) · ₦68,000
                                </option>
                              </>
                            )}
                          </select>
                        </div>
                      </div>

                      {bookingError && (
                        <p role="alert" className="text-xs text-rose-300">
                          {bookingError}
                        </p>
                      )}

                      <button
                        type="submit"
                        className="w-full mt-2 py-3 rounded-full bg-white text-[#1D1918] text-xs font-semibold tracking-[0.16em] uppercase hover:bg-stone-100 transition-colors cursor-pointer"
                      >
                        {bookingType === 'salon'
                          ? 'Reserve Tasting Table'
                          : 'Request Cake Consultation'}
                      </button>
                    </form>
                  )}
                </div>

                <p className="text-[11px] text-white/60 mt-6 pt-4">
                  Complimentary tea tasting included with all custom cake commissions.
                </p>
              </div>
            </div>
          </div>
        </ScrollFadeSection>

        {/* Section 7: Sommelier Pairing Guide & Patron Notes */}
        <ScrollFadeSection id="pairings" className="py-20 sm:py-28">
          <div className="max-w-[1380px] mx-auto px-6 sm:px-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-[11px] font-medium tracking-[0.22em] uppercase text-[#F4D9AC]">
                  Curated Harmonies
                </p>
                <h2 className="text-3xl sm:text-4xl font-semibold text-white mt-2">
                  Tea & Espresso Pairing Guide
                </h2>
              </div>

              <div
                className="flex flex-wrap items-center gap-1.5 p-1 bg-black/35 backdrop-blur-sm rounded-full"
                role="tablist"
                aria-label="Select pastry pairing"
              >
                {PAIRING_GUIDES.map((guide) => {
                  const active = guide.id === activePairing.id;
                  return (
                    <button
                      key={guide.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActivePairingId(guide.id)}
                      className={`px-4 py-1.5 text-[11px] font-medium rounded-full transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        active ? 'bg-white text-[#1D1918]' : 'text-white/80 hover:text-white'
                      }`}
                    >
                      {guide.pastryName}
                    </button>
                  );
                })}
              </div>
            </div>

            <motion.div
              key={activePairing.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              <div className="lg:col-span-4 aspect-[4/3] rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
                <SafeImage
                  src={activePairing.product.image}
                  alt={activePairing.pastryName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="lg:col-span-8 flex flex-col justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#F4D9AC]">
                    <Coffee className="w-4 h-4" />
                    <span>Recommended Pairing</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-white/85">{activePairing.origin}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-semibold text-white mt-2">
                    {activePairing.pastryName} & {activePairing.beverageName}
                  </h3>
                  <p className="text-[15px] text-white/85 leading-relaxed mt-3 max-w-2xl">
                    {activePairing.notes}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="text-sm text-white/80">
                    <span>Pastry solo </span>
                    <span className="font-semibold text-[#F4D9AC] tabular-nums">
                      {formatNaira(activePairing.product.price)}
                    </span>
                    <span className="mx-2 text-white/40" aria-hidden="true">
                      /
                    </span>
                    <span>In-salon duo service </span>
                    <span className="font-semibold text-[#F4D9AC] tabular-nums">
                      {formatNaira(activePairing.duoPrice)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => openProductModal(activePairing.product)}
                      className="px-5 py-2 rounded-full bg-white/15 text-xs font-medium tracking-[0.12em] uppercase text-white hover:bg-white hover:text-[#1D1918] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      View Pastry
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(activePairing.product, 1);
                        setBagOpen(true);
                      }}
                      className="px-5 py-2 rounded-full bg-white text-[#1D1918] text-xs font-semibold tracking-[0.12em] uppercase hover:bg-stone-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Add to Bag
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Patron Notes */}
            <div className="mt-16 pt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              {PATRON_NOTES.map((note, index) => (
                <motion.blockquote
                  key={note.author}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: prefersReducedMotion ? 0 : index * 0.1,
                    ease: EASE_OUT,
                  }}
                  className="flex flex-col justify-between"
                >
                  <p className="text-sm text-white/90 leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
                    “{note.quote}”
                  </p>
                  <footer className="mt-4 text-xs text-white/75">
                    <span className="font-semibold text-[#F4D9AC]">{note.author}</span>
                    <span className="mx-1.5" aria-hidden="true">
                      ·
                    </span>
                    <span>{note.context}</span>
                  </footer>
                </motion.blockquote>
              ))}
            </div>
          </div>
        </ScrollFadeSection>

        {/* Section 8: WordPress Editorial Journal & Interactive FAQ Accordion */}
        <ScrollFadeSection id="journal" className="py-20 sm:py-28">
          <div className="max-w-[1380px] mx-auto px-6 sm:px-10">
            <div className="mb-12">
              <p className="text-[11px] font-medium tracking-[0.22em] uppercase text-[#F4D9AC]">
                Bakehouse Journal
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white mt-2">
                Notes From Our Pastry Chefs
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {JOURNAL_POSTS.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 44 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.18 }}
                  transition={{
                    duration: 0.55,
                    delay: prefersReducedMotion ? 0 : index * 0.12,
                    ease: EASE_OUT,
                  }}
                  onClick={() => setActiveJournalPost(post)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveJournalPost(post);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  className="group cursor-pointer flex flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-white rounded-xl"
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
                    <SafeImage
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                    />
                  </div>
                  <div className="pt-4 px-1">
                    <div className="flex items-center gap-2 text-[11px] text-[#F4D9AC]">
                      <span>{post.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-white/75">{post.readTime}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mt-1.5 group-hover:text-[#F4D9AC] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-white/80 leading-relaxed mt-2">{post.excerpt}</p>
                    <span className="inline-flex items-center gap-1.5 mt-3 text-[11px] font-medium tracking-[0.14em] uppercase text-white/90 underline underline-offset-4">
                      Read Story
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Interactive WordPress FAQ Accordion */}
            <div className="mt-20 max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <p className="text-[11px] font-medium tracking-[0.22em] uppercase text-[#F4D9AC]">
                  Guest Information
                </p>
                <h2 className="text-2xl sm:text-3xl font-semibold text-white mt-2">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-3">
                {FAQ_ITEMS.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="bg-black/35 backdrop-blur-md rounded-xl overflow-hidden"
                    >
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                        className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left cursor-pointer"
                      >
                        <span className="text-sm font-medium text-white">{faq.question}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#F4D9AC] shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: EASE_OUT }}
                            className="overflow-hidden"
                          >
                            <p className="px-6 pb-5 text-xs sm:text-sm text-white/80 leading-relaxed">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollFadeSection>

        {/* Section 9: Flagship Boutique Visit & Morning Menu Dispatch */}
        <ScrollFadeSection id="visit" className="py-20 sm:py-28">
          <div className="max-w-[1380px] mx-auto px-6 sm:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-6 space-y-4">
              <p className="text-[11px] font-medium tracking-[0.22em] uppercase text-[#F4D9AC]">
                Flagship Boutique
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white">
                Visit Rolex Patisserie
              </h2>
              <p className="text-sm text-white/85 leading-relaxed max-w-md">
                14 Adeola Odeku, Victoria Island · Open daily from 08:00 to 20:00. Walk-in counter
                boxes and pre-ordered celebration cakes ready from 08:30.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setHoursOpen(true)}
                  className="px-6 py-2.5 rounded-full bg-white text-[#1D1918] text-xs font-semibold tracking-[0.14em] uppercase hover:bg-stone-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Hours & Directions
                </button>
                <button
                  type="button"
                  onClick={() => setShowIntro(true)}
                  className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.12em] uppercase text-white/85 hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Replay Intro</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 bg-black/40 backdrop-blur-md rounded-xl p-6 sm:p-8">
              <h3 className="text-2xl font-semibold text-white">Morning Menu Dispatch</h3>
              <p className="text-sm text-white/80 mt-1.5">
                Receive weekly notes when seasonal orchard tarts and limited weekend entremets
                leave the bake room.
              </p>

              {dispatchSuccess ? (
                <div className="mt-5 flex items-center gap-2.5 text-sm text-emerald-100 bg-emerald-950/70 rounded-lg px-4 py-3">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>You are subscribed to the Morning Menu Dispatch.</span>
                </div>
              ) : (
                <form onSubmit={handleDispatchSubmit} className="mt-5">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <label htmlFor="dispatch-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="dispatch-email"
                      type="email"
                      value={dispatchEmail}
                      onChange={(e) => setDispatchEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="flex-1 rounded-full bg-white/15 px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:bg-white/20"
                    />
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-white text-[#1D1918] text-xs font-semibold tracking-[0.14em] uppercase hover:bg-stone-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Join Dispatch
                    </button>
                  </div>
                  {dispatchError && (
                    <p role="alert" className="text-xs text-rose-300 mt-2">
                      {dispatchError}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </ScrollFadeSection>
      </main>

      {/* Quiet Minimal Footer Over Video */}
      <footer className="relative z-10 bg-black/40 backdrop-blur-sm text-white/75 py-8">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="tracking-[0.18em] text-white font-semibold">ROLEX</span>
            <span aria-hidden="true">·</span>
            <span>Artisan Patisserie & Bake Room</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href="#products" className="hover:text-white transition-colors">
              Pastries
            </a>
            <a href="#bakeroom" className="hover:text-white transition-colors">
              Bake Room
            </a>
            <a href="#salon" className="hover:text-white transition-colors">
              Tea Salon
            </a>
            <a href="#journal" className="hover:text-white transition-colors">
              Journal
            </a>
            <button
              type="button"
              onClick={() => setAccountOpen(true)}
              className="hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {clientFirstName ? `Account (${clientFirstName})` : 'Client Login'}
            </button>
            <button
              type="button"
              onClick={() => setHoursOpen(true)}
              className="hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Daily 08:00 – 20:00
            </button>
            <button
              type="button"
              onClick={() => setBagOpen(true)}
              className="hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              My Bag ({totalItems})
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Scroll-to-Top Button (returns video smoothly to 00:00) */}
      <AnimatePresence>
        {showBackToTop && !showIntro && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll back to top"
            className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-white text-[#1D1918] shadow-xl flex items-center justify-center hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Client Account Modal */}
      <ClientAccountModal
        open={accountOpen}
        onClose={() => setAccountOpen(false)}
        account={clientAccount}
        onSignIn={(acct) => {
          setClientAccount(acct);
          if (!bookingGuestName) setBookingGuestName(acct.fullName);
          if (!bookingEmail) setBookingEmail(acct.email);
        }}
        onUpdateAddress={(addr) =>
          setClientAccount((prev) => (prev ? { ...prev, address: addr } : prev))
        }
        onSignOut={() => {
          setClientAccount(null);
          setAccountOpen(false);
        }}
      />

      {/* Left Slide-Out Navigation Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/45 transition-opacity"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <aside
            className="relative z-10 w-80 max-w-[85vw] bg-[#211C1B] text-white h-full flex flex-col justify-between p-8 shadow-2xl"
            aria-label="Site navigation"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <CrownEmblem className="w-6 h-4 text-white" />
                  <span className="text-lg font-semibold tracking-[0.2em]">ROLEX</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="p-2 text-white/75 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-8 flex flex-col gap-4 text-sm tracking-[0.14em] uppercase">
                <button
                  type="button"
                  onClick={() => scrollToSection('top')}
                  className="text-left py-1 text-white/85 hover:text-white transition-colors cursor-pointer"
                >
                  Showcase
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('products')}
                  className="text-left py-1 text-white/85 hover:text-white transition-colors cursor-pointer"
                >
                  Pastries & Cakes
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('collections')}
                  className="text-left py-1 text-white/85 hover:text-white transition-colors cursor-pointer"
                >
                  Collections
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('bakeroom')}
                  className="text-left py-1 text-white/85 hover:text-white transition-colors cursor-pointer"
                >
                  Real Bake Room
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('salon')}
                  className="text-left py-1 text-white/85 hover:text-white transition-colors cursor-pointer"
                >
                  Tea Salon
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('pairings')}
                  className="text-left py-1 text-white/85 hover:text-white transition-colors cursor-pointer"
                >
                  Pairing Guide
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('journal')}
                  className="text-left py-1 text-white/85 hover:text-white transition-colors cursor-pointer"
                >
                  Journal & FAQ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setAccountOpen(true);
                  }}
                  className="text-left py-1 text-[#F4D9AC] hover:text-white transition-colors cursor-pointer"
                >
                  {clientFirstName ? `Account (${clientFirstName})` : 'Client Login'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setHoursOpen(true);
                  }}
                  className="text-left py-1 text-white/85 hover:text-white transition-colors cursor-pointer"
                >
                  Boutique Hours
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setShowIntro(true);
                  }}
                  className="text-left py-1 text-white/65 hover:text-white transition-colors cursor-pointer"
                >
                  Replay Intro
                </button>
              </nav>
            </div>

            <div className="pt-6 border-t border-white/10 text-xs text-white/60 space-y-1.5">
              <p className="text-white/85 tracking-[0.12em] uppercase">Rolex Patisserie</p>
              <p>14 Adeola Odeku, VI · Open Daily 08:00 – 20:00</p>
            </div>
          </aside>
        </div>
      )}

      {/* Journal Story Reader Modal */}
      {activeJournalPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={() => setActiveJournalPost(null)}
            aria-hidden="true"
          />
          <article
            role="dialog"
            aria-modal="true"
            aria-labelledby="journal-modal-title"
            className="relative z-10 w-full max-w-2xl bg-white text-[#1D1918] rounded-xl overflow-hidden shadow-2xl"
          >
            <div className="aspect-[16/9] bg-stone-100">
              <SafeImage
                src={activeJournalPost.image}
                alt={activeJournalPost.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <span className="font-medium text-[#1D1918]">{activeJournalPost.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeJournalPost.readTime}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveJournalPost(null)}
                  aria-label="Close journal article"
                  className="p-1.5 text-stone-400 hover:text-[#1D1918] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <h3 id="journal-modal-title" className="text-2xl font-semibold text-[#1D1918] mt-2">
                {activeJournalPost.title}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed mt-4">
                {activeJournalPost.content}
              </p>
              <button
                type="button"
                onClick={() => setActiveJournalPost(null)}
                className="mt-6 px-6 py-2.5 rounded-full bg-[#211C1B] text-white text-xs font-medium tracking-[0.14em] uppercase hover:bg-[#332B29] cursor-pointer"
              >
                Close Article
              </button>
            </div>
          </article>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/55 backdrop-blur-[2px]"
            onClick={() => setSelectedProduct(null)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
            className="relative z-10 w-full max-w-2xl bg-white text-[#1D1918] rounded-xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2"
          >
            <div className="aspect-[4/3] md:aspect-auto md:h-full bg-stone-100">
              <SafeImage
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-stone-400">
                      {selectedProduct.category}
                    </p>
                    <h3
                      id="product-modal-title"
                      className="text-2xl font-semibold text-[#1D1918] mt-1"
                    >
                      {selectedProduct.name}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    aria-label="Close product details"
                    className="p-1.5 text-stone-400 hover:text-[#1D1918] transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-lg font-semibold text-[#1D1918] mt-3 tabular-nums">
                  {formatNaira(selectedProduct.price)}
                </p>

                <p className="text-sm text-stone-600 leading-relaxed mt-4">
                  {selectedProduct.description}
                </p>

                <div className="mt-5 pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-500">
                  <div>
                    <span className="font-medium text-[#1D1918]">Tasting Notes: </span>
                    <span>{selectedProduct.tastingNotes}</span>
                  </div>
                  <div>
                    <span className="font-medium text-[#1D1918]">Portion: </span>
                    <span>{selectedProduct.portion}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-3">
                <div className="flex items-center border border-stone-200 rounded-full px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="p-1.5 text-stone-500 hover:text-[#1D1918] cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-7 text-center text-sm font-medium tabular-nums">
                    {modalQty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setModalQty((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="p-1.5 text-stone-500 hover:text-[#1D1918] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    addToCart(selectedProduct, modalQty);
                    setSelectedProduct(null);
                    setBagOpen(true);
                  }}
                  className="flex-1 bg-[#211C1B] text-white rounded-full px-5 py-2.5 text-xs font-medium tracking-[0.14em] uppercase hover:bg-[#332B29] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Add · {formatNaira(selectedProduct.price * modalQty)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Right Slide-Out Shopping Bag Drawer */}
      {bagOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setBagOpen(false)}
            aria-hidden="true"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping Bag"
            className="relative z-10 w-full max-w-md bg-white text-[#1D1918] h-full flex flex-col justify-between shadow-2xl"
          >
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-[#1D1918]" />
                <h3 className="text-sm font-semibold tracking-[0.16em] uppercase text-[#1D1918]">
                  Your Bag ({totalItems})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setBagOpen(false)}
                aria-label="Close bag"
                className="p-2 text-stone-400 hover:text-[#1D1918] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {orderConfirmed ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-2xl font-semibold text-[#1D1918]">
                    Order {orderConfirmed} Confirmed
                  </h4>
                  <p className="text-sm text-stone-500 mt-2 max-w-xs leading-relaxed">
                    Your fresh pastries are being boxed by our patissiers for chilled dispatch or
                    salon pickup.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setOrderConfirmed(null);
                      setBagOpen(false);
                    }}
                    className="mt-6 px-6 py-2.5 rounded-full bg-[#211C1B] text-white text-xs font-medium tracking-[0.14em] uppercase hover:bg-[#332B29] cursor-pointer"
                  >
                    Continue Browsing
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <CrownEmblem className="w-8 h-6 text-stone-300 mb-3" />
                  <p className="text-sm font-medium text-[#1D1918]">Your pastry bag is empty</p>
                  <p className="text-xs text-stone-400 mt-1 max-w-xs">
                    Select any tart or layer cake from our daily selection to begin your order.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setBagOpen(false);
                      scrollToSection('products');
                    }}
                    className="mt-6 px-6 py-2.5 rounded-full border border-[#211C1B] text-[#211C1B] text-xs font-medium tracking-[0.14em] uppercase hover:bg-[#211C1B] hover:text-white transition-colors cursor-pointer"
                  >
                    Explore Products
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-stone-100">
                  {cart.map(({ product, quantity }) => (
                    <li key={product.id} className="py-4 flex items-center gap-4">
                      <SafeImage
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 rounded object-cover shrink-0 bg-stone-100"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-[#1D1918] truncate">
                          {product.name}
                        </h4>
                        <p className="text-xs text-stone-400 tabular-nums mt-0.5">
                          {formatNaira(product.price)} each
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="inline-flex items-center border border-stone-200 rounded-full">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(product.id, -1)}
                              aria-label={`Decrease quantity of ${product.name}`}
                              className="p-1.5 text-stone-500 hover:text-[#1D1918] cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-medium tabular-nums">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(product.id, 1)}
                              aria-label={`Increase quantity of ${product.name}`}
                              className="p-1.5 text-stone-500 hover:text-[#1D1918] cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(product.id)}
                            aria-label={`Remove ${product.name}`}
                            className="p-1.5 text-stone-300 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-[#1D1918] tabular-nums">
                        {formatNaira(product.price * quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cart.length > 0 && !orderConfirmed && (
              <div className="p-6 border-t border-stone-100 bg-stone-50/70 space-y-4">
                {clientAccount && (
                  <p className="text-[11px] text-stone-500">
                    Dispatching to <span className="font-medium text-[#1D1918]">{clientAccount.fullName}</span>
                  </p>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500">Subtotal</span>
                  <span className="text-base font-semibold text-[#1D1918] tabular-nums">
                    {formatNaira(subtotal)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full py-3 rounded-full bg-[#211C1B] text-white text-xs font-medium tracking-[0.16em] uppercase hover:bg-[#332B29] transition-colors cursor-pointer"
                >
                  Place Patisserie Order
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Boutique Hours Modal */}
      {hoursOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/55 backdrop-blur-[2px]"
            onClick={() => setHoursOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="hours-modal-title"
            className="relative z-10 w-full max-w-md bg-white text-[#1D1918] rounded-xl p-7 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] tracking-[0.18em] uppercase text-stone-400">
                  Boutique & Tea Salon
                </p>
                <h3 id="hours-modal-title" className="text-2xl font-semibold text-[#1D1918] mt-1">
                  Rolex Patisserie
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setHoursOpen(false)}
                aria-label="Close hours"
                className="p-1.5 text-stone-400 hover:text-[#1D1918] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm text-stone-600">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#211C1B] mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-[#1D1918]">Opening Hours</p>
                  <p className="text-xs text-stone-500 mt-0.5 tabular-nums">
                    Monday – Sunday · 08:00 – 20:00
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Fresh tarts & entremets glazed every morning at 07:30.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#211C1B] mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-[#1D1918]">Flagship Salon</p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    14 Adeola Odeku, Victoria Island
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setHoursOpen(false)}
              className="mt-6 w-full py-2.5 rounded-full bg-[#211C1B] text-white text-xs font-medium tracking-[0.14em] uppercase hover:bg-[#332B29] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
