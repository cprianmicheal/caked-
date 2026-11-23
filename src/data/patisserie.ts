export interface PastryProduct {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  image: string;
  category: 'Tarts' | 'Layer Cakes' | 'Signature';
  description: string;
  tastingNotes: string;
  portion: string;
}

export interface HeroSlide {
  id: string;
  kicker: string;
  headline: string;
  tagline: string;
  image: string;
  productId: string;
  isVideoBackdrop?: boolean;
}

export interface PairingGuide {
  id: string;
  pastryName: string;
  beverageName: string;
  origin: string;
  notes: string;
  duoPrice: number;
  product: PastryProduct;
}

export interface BakeRoomMoment {
  id: string;
  time: string;
  title: string;
  caption: string;
  image: string;
}

export interface JournalPost {
  id: string;
  category: string;
  readTime: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export function formatNaira(amount: number): string {
  return `₦${Math.round(amount).toLocaleString('en-NG')}`;
}

export const INTRO_CAKE_IMAGE = '/src/assets/images/intro_red_velvet_cake_1795356257392.jpg';
export const ATELIER_IMAGE = '/src/assets/images/atelier_pastry_chef_1795356256939.jpg';
export const SALON_IMAGE = '/src/assets/images/salon_tea_table_1795356257636.jpg';

export const BAKEROOM_GALLERY: BakeRoomMoment[] = [
  {
    id: 'bake-1',
    time: '05:30 AM',
    title: 'Deck Oven First Pull',
    caption: 'Sponge tiers and berry tarts resting on steel cooling racks straight from our stone deck ovens.',
    image: '/src/assets/images/bakeroom_oven_racks_1795414185120.jpg',
  },
  {
    id: 'bake-2',
    time: '06:15 AM',
    title: 'Hand Dough Lamination',
    caption: 'Cold cultured butter folded by hand on seasoned butcher blocks for crisp, flaky tart crusts.',
    image: '/src/assets/images/bakeroom_dough_lamination_1795414185097.jpg',
  },
  {
    id: 'bake-3',
    time: '07:00 AM',
    title: 'Chantilly Piping Station',
    caption: 'Three-tier cakes hand-finished with whipped vanilla bean cream on chilled marble counters.',
    image: '/src/assets/images/bakeroom_piping_station_1795414184413.jpg',
  },
  {
    id: 'bake-4',
    time: '08:30 AM',
    title: 'Open Counter & Kitchen',
    caption: 'Every tray glides directly from our glass-walled bake room to the morning display counter.',
    image: '/src/assets/images/bakeroom_showcase_counter_1795414185410.jpg',
  },
];

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    kicker: 'ÉLÉGANT',
    headline: 'ROLEX',
    tagline: 'FINE PATISSERIE · SCROLL TO DISCOVER',
    image: '/src/assets/images/hero_raspberry_cake_1795355935331.jpg',
    productId: 'signature-raspberry-entremet',
    isVideoBackdrop: true,
  },
  {
    id: 'slide-2',
    kicker: 'SIGNATURE',
    headline: 'ROLEX',
    tagline: 'FRAMBOISE ENTREMET',
    image: '/src/assets/images/hero_raspberry_cake_1795355935331.jpg',
    productId: 'signature-raspberry-entremet',
  },
  {
    id: 'slide-3',
    kicker: 'ARTISAN',
    headline: 'ROLEX',
    tagline: 'VANILLA RASPBERRY TART',
    image: '/src/assets/images/product_raspberry_tart_1795355935036.jpg',
    productId: 'raspberry-vanilla-tart',
  },
  {
    id: 'slide-4',
    kicker: 'CLASSIC',
    headline: 'ROLEX',
    tagline: 'RUBY BERRY LAYER CAKE',
    image: '/src/assets/images/product_berry_layer_cake_1795355936279.jpg',
    productId: 'ruby-berry-layer-cake',
  },
  {
    id: 'slide-5',
    kicker: 'SEASONAL',
    headline: 'ROLEX',
    tagline: 'ROSE MERINGUE TART',
    image: '/src/assets/images/product_pink_swirl_tart_1795355934415.jpg',
    productId: 'rose-swirl-tart',
  },
  {
    id: 'slide-6',
    kicker: 'PATISSERIE',
    headline: 'ROLEX',
    tagline: 'CHANTILLY ROSETTE CAKE',
    image: '/src/assets/images/product_chantilly_cake_1795355934841.jpg',
    productId: 'chantilly-berry-cake',
  },
  {
    id: 'slide-7',
    kicker: 'HERITAGE',
    headline: 'ROLEX',
    tagline: 'BLUEBERRY VICTORIA SPONGE',
    image: '/src/assets/images/product_blueberry_sponge_1795355935275.jpg',
    productId: 'blueberry-victoria-sponge',
  },
];

export const FEATURED_HERO_PRODUCT: PastryProduct = {
  id: 'signature-raspberry-entremet',
  name: 'Framboise Entremet',
  subtitle: 'Velvet raspberry mousse & almond crisp',
  price: 18500,
  image: '/src/assets/images/hero_raspberry_cake_1795355935331.jpg',
  category: 'Signature',
  description:
    'Our signature dome of whipped wild raspberry mousse over toasted almond feuilletine, finished with fresh berries and powdered sugar.',
  tastingNotes: 'Wild raspberry, Madagascar vanilla, toasted almond crunch',
  portion: 'Individual Grand Entremet (180g)',
};

export const RED_VELVET_ROYALE: PastryProduct = {
  id: 'red-velvet-royale',
  name: 'Velours Crimson',
  subtitle: 'Three-layer cocoa velvet & meringue',
  price: 9500,
  image: INTRO_CAKE_IMAGE,
  category: 'Signature',
  description:
    'Three tender crimson cocoa sponge layers folded with cultured mascarpone cream cheese frosting and topped with torched Swiss meringue peaks.',
  tastingNotes: 'Single-estate cocoa, tangy cultured mascarpone, toasted meringue',
  portion: 'Tall Salon Slice (175g)',
};

export const PRODUCTS: PastryProduct[] = [
  {
    id: 'raspberry-vanilla-tart',
    name: 'Amandine',
    subtitle: 'Crisp butter shell & vanilla cream',
    price: 4500,
    image: '/src/assets/images/product_raspberry_tart_1795355935036.jpg',
    category: 'Tarts',
    description:
      'Hand-pressed sweet pâte sucrée filled with piped Madagascar vanilla bean pastry cream and fresh orchard raspberries.',
    tastingNotes: 'Cultured butter, bourbon vanilla, bright berry acidity',
    portion: 'Single Tartlet (95g)',
  },
  {
    id: 'ruby-berry-layer-cake',
    name: 'Velours Rouge',
    subtitle: 'Three-tier sponge & berry compote',
    price: 6000,
    image: '/src/assets/images/product_berry_layer_cake_1795355936279.jpg',
    category: 'Layer Cakes',
    description:
      'Delicate golden sponge layered with house-simmered raspberry coulis and Swiss meringue buttercream.',
    tastingNotes: 'Silky Swiss meringue, tart berry jam, tender genoise',
    portion: 'Patisserie Slice (150g)',
  },
  {
    id: 'rose-swirl-tart',
    name: 'Roseraie',
    subtitle: 'Rosewater berry cream & shortcrust',
    price: 6200,
    image: '/src/assets/images/product_pink_swirl_tart_1795355934415.jpg',
    category: 'Tarts',
    description:
      'Golden shortcrust pastry crowned with hand-piped raspberry-rose cream rosettes and sun-ripened raspberries.',
    tastingNotes: 'Delicate rosewater, creamy raspberry ganache, crisp crust',
    portion: 'Single Tartlet (110g)',
  },
  {
    id: 'chantilly-berry-cake',
    name: 'Chantilly Blanc',
    subtitle: 'Whipped Chantilly & fresh berries',
    price: 6500,
    image: '/src/assets/images/product_chantilly_cake_1795355934841.jpg',
    category: 'Layer Cakes',
    description:
      'Petite sponge cake enveloped in light Chantilly cream rosettes and topped with powdered sugar and fresh red raspberries.',
    tastingNotes: 'Featherlight whipped cream, sweet vanilla sponge',
    portion: 'Petite Cake (140g)',
  },
  {
    id: 'blueberry-victoria-sponge',
    name: 'Myrtille Royale',
    subtitle: 'Double sponge, cream & blueberries',
    price: 12500,
    image: '/src/assets/images/product_blueberry_sponge_1795355935275.jpg',
    category: 'Signature',
    description:
      'Two-tier classic golden sponge sandwiching tart berry preserve and whipped vanilla bean cream, finished with fresh wild blueberries.',
    tastingNotes: 'Toasted golden crumb, wild blueberry, vanilla Chantilly',
    portion: 'Sharing Mini Cake (320g)',
  },
];

export const WORDPRESS_CATEGORIES = [
  {
    id: 'cat-tarts',
    title: 'Orchard Tarts',
    count: 'From ₦4,500',
    description: 'Hand-pressed pâte sucrée filled daily with Madagascar vanilla & berries.',
    filter: 'Tarts' as const,
  },
  {
    id: 'cat-layers',
    title: 'Layer Cakes',
    count: 'From ₦6,000',
    description: 'Three-tier sponge slices finished with Chantilly & Swiss meringue.',
    filter: 'Layer Cakes' as const,
  },
  {
    id: 'cat-signature',
    title: 'Signature Entremets',
    count: 'From ₦9,500',
    description: 'Velours Crimson, Framboise domes, and two-tier celebration sponges.',
    filter: 'Signature' as const,
  },
  {
    id: 'cat-all',
    title: 'Full Bake Counter',
    count: 'All Creations',
    description: 'Browse every fresh creation leaving the bake room each morning.',
    filter: 'All' as const,
  },
];

export const ATELIER_PILLARS = [
  {
    index: '01',
    title: 'Cultured Butter & Heritage Flour',
    detail:
      'Every tart shell and genoise sponge begins with stone-milled flour and 84% butterfat cultured creamery butter for clean snap and tender crumb.',
  },
  {
    index: '02',
    title: 'Orchard-Picked Morning Berries',
    detail:
      'Wild raspberries, alpine blueberries, and damask rose petals arrive before 06:00 each morning and are glazed raw to preserve bright natural acidity.',
  },
  {
    index: '03',
    title: 'Hand-Piped & Tempered Small Batches',
    detail:
      'Our pastry chefs temper couverture chocolate and whip fresh Chantilly in small batches throughout the day so each slice reaches the table at peak texture.',
  },
];

export const ATELIER_METRICS = [
  { value: '05:30', label: 'Daily First Oven Pull' },
  { value: '48 hrs', label: 'Pastry Dough Rest' },
  { value: '84%', label: 'Butterfat Lamination' },
  { value: '18', label: 'Seasonal Creations' },
];

export const PAIRING_GUIDES: PairingGuide[] = [
  {
    id: 'pair-velours-crimson',
    pastryName: 'Velours Crimson',
    beverageName: 'Single-Origin Ethiopian Guji Pour-Over',
    origin: 'Roasted light-medium · Bergamot & dark cherry',
    notes:
      'Bright floral bergamot lifts the rich crimson cocoa crumb while cutting cleanly through cultured mascarpone frosting.',
    duoPrice: 14500,
    product: RED_VELVET_ROYALE,
  },
  {
    id: 'pair-framboise',
    pastryName: 'Framboise Entremet',
    beverageName: 'First-Flush Darjeeling Margaret’s Hope',
    origin: 'Steeped 3 min at 85°C · Muscatel & white peach',
    notes:
      'Crisp muscatel tannins mirror the wild raspberry mousse while leaving a delicate almond finish on the palate.',
    duoPrice: 23000,
    product: FEATURED_HERO_PRODUCT,
  },
  {
    id: 'pair-amandine',
    pastryName: 'Amandine Tart',
    beverageName: 'Kyoto Ceremonial Matcha Usucha',
    origin: 'Hand-whisked · Sweet umami & toasted chestnut',
    notes:
      'Velvety vegetal umami balances the sweet Madagascar vanilla pastry cream and crisp buttered pâte sucrée.',
    duoPrice: 9500,
    product: PRODUCTS[0],
  },
  {
    id: 'pair-myrtille',
    pastryName: 'Myrtille Royale',
    beverageName: 'Roasted Taiwanese High-Mountain Oolong',
    origin: 'Alishan cultivar · Honeyed orchid & baked stone fruit',
    notes:
      'Aromatic orchid warmth echoes the golden double sponge and dark wild blueberries for an unhurried afternoon service.',
    duoPrice: 17500,
    product: PRODUCTS[4],
  },
];

export const PATRON_NOTES = [
  {
    quote:
      'The Framboise Entremet has the lightest mousse I have tasted—bright fruit forward, never overly sweet, with an effortless almond crunch.',
    author: 'Amaka Okafor',
    context: 'Culinary Editor · Victoria Island',
  },
  {
    quote:
      'We commissioned a three-tier Velours Crimson cake for an anniversary dinner. Every guest asked where the Swiss meringue and cocoa sponge came from.',
    author: 'Tunde Adeyemi',
    context: 'Private Collector · Ikoyi',
  },
  {
    quote:
      'Stopping by at 08:30 for an Amandine tart and tea is my favorite morning ritual. The butter crust still crackles when your fork meets it.',
    author: 'Nadia Benali',
    context: 'Architectural Designer · Lekki',
  },
];

export const JOURNAL_POSTS: JournalPost[] = [
  {
    id: 'post-bakeroom',
    category: 'Bake Room',
    readTime: '3 min read',
    title: 'Inside Our 05:30 AM Deck Oven Ritual',
    excerpt:
      'How pre-dawn fermentation and cast-iron steam injection give our tart crusts and sponges their signature golden lift.',
    content:
      'Long before Victoria Island wakes, our ovens are calibrated to 205°C. Every sheet of tart dough rests for 48 hours at 3°C so the gluten relaxes and cultured butter stays distinct. That slow cold rest is why our Amandine shells hold crisp edges even beneath velvety vanilla bean cream.',
    image: '/src/assets/images/bakeroom_oven_racks_1795414185120.jpg',
  },
  {
    id: 'post-piping',
    category: 'Craftsmanship',
    readTime: '4 min read',
    title: 'The Precision Behind Hand-Piped Chantilly',
    excerpt:
      'Why we whip cream in chilled stainless bowls at the marble station rather than stabilizing ahead of time.',
    content:
      'Industrial whipped creams rely on gums and heavy stabilizers that coat the palate. In our bake room, our pastry chefs whip cold cream with scraped Madagascar vanilla pods just minutes before assembly, piping each rosette by hand so every forkful melts cleanly.',
    image: '/src/assets/images/bakeroom_piping_station_1795414184413.jpg',
  },
  {
    id: 'post-tiers',
    category: 'Celebrations',
    readTime: '3 min read',
    title: 'Choosing the Right Tiered Cake for Your Table',
    excerpt:
      'A practical guide to portion sizing, sponge density, and flavor balancing for intimate dinners or 80-guest receptions.',
    content:
      'For gatherings of 20 to 25 guests, a two-tier Velours Crimson balances rich cocoa crumb with light mascarpone cream. Larger celebrations benefit from a three-tier Framboise Grand anchored by toasted almond feuilletine so slices hold crisp structure from presentation to plating.',
    image: '/src/assets/images/bakeroom_showcase_counter_1795414185410.jpg',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-delivery',
    question: 'Do you offer same-day chilled dispatch in Naira?',
    answer:
      'Yes. Orders placed before 14:00 are delivered in temperature-controlled pastry boxes the same day across Victoria Island, Ikoyi, and Lekki, or prepared for boutique pickup within 45 minutes.',
  },
  {
    id: 'faq-bespoke',
    question: 'How far in advance should I reserve a tiered celebration cake?',
    answer:
      'We recommend 5 days for custom 2-tier and 3-tier commissions via our Concierge Desk, though selected signature cakes are freshly finished every morning for immediate purchase.',
  },
  {
    id: 'faq-storage',
    question: 'How should Rolex pastries and cakes be stored?',
    answer:
      'Keep Chantilly cakes and berry entremets refrigerated between 2°C and 5°C, and bring sliced layer cakes to room temperature 15 minutes before serving for optimal cream texture.',
  },
  {
    id: 'faq-allergens',
    question: 'Can I request nut-free or custom inscription options?',
    answer:
      'Yes. While our Framboise Entremet contains toasted almond feuilletine, our Velours Crimson, Velours Rouge, and Chantilly Blanc can be prepared in a nut-free workspace with complimentary chocolate plaque lettering.',
  },
];
