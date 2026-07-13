import type {
  Product,
  CategoryInfo,
  Benefit,
  Testimonial,
  GalleryImage,
  BusinessInfo,
  NavItem,
  SaladSize,
  SaladSpecialTopping,
} from '@/types'

export const BUSINESS_INFO: BusinessInfo = {
  name: 'BarraFresh',
  tagline: 'Alimentación saludable para tu día',
  phone: '+525613013325',
  whatsapp: '525613013325',
  email: 'contacto@barrafresh.mx',
  address: 'Calle Lirio 20, Col. Lomas de San Miguel',
  city: 'Atizapán de Zaragoza, Estado de México, CP 52928',
  schedule: [
    { days: 'Lunes – Viernes', hours: '7:00 am – 8:00 pm' },
    { days: 'Sábado', hours: '8:00 am – 6:00 pm' },
    { days: 'Domingo', hours: '9:00 am – 3:00 pm' },
  ],
  socialMedia: {
    instagram: 'https://instagram.com/barrafresh',
    facebook: 'https://facebook.com/barrafresh',
    tiktok: 'https://tiktok.com/@barrafresh',
  },
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Menú', href: '#menu' },
  { label: 'Galería', href: '#galeria' },
  { label: 'Ubicación', href: '#ubicacion' },
  { label: 'Contacto', href: '#contacto' },
]

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'ensaladas',
    label: 'Ensaladas',
    emoji: '🥗',
    description: 'Frescas y nutritivas',
  },
  {
    id: 'jugos',
    label: 'Jugos',
    emoji: '🍊',
    description: 'Naturales y sin azúcar',
  },
  {
    id: 'licuados',
    label: 'Licuados',
    emoji: '🥤',
    description: 'Cremosos y energizantes',
  },
  {
    id: 'yogurt',
    label: 'Yogurt Preparado',
    emoji: '🍓',
    description: 'Con fruta y granola',
  },
  {
    id: 'smoothies',
    label: 'Smoothies',
    emoji: '🫐',
    description: 'Batidos saludables',
  },
  {
    id: 'snacks',
    label: 'Snacks',
    emoji: '🥜',
    description: 'Opciones saludables',
  },
]

export const SALAD_SIZES: SaladSize[] = [
  { id: 'chica', label: 'Chica', price: 65, maxToppings: 5 },
  { id: 'mediana', label: 'Mediana', price: 85, maxToppings: 7 },
  { id: 'grande', label: 'Grande', price: 105, maxToppings: 9 },
]

export const SALAD_TOPPINGS: string[] = [
  'Espinaca baby',
  'Jitomate cherry',
  'Pepino',
  'Zanahoria rallada',
  'Cebolla morada',
  'Pimiento',
  'Maíz',
  'Betabel',
  'Brócoli',
  'Champiñones',
  'Germinados',
]

export const SALAD_DRESSINGS: string[] = [
  'César',
  'Vinagreta',
  'Ranch',
  'Miel Mostaza',
  'Queso Parmesano',
]

export const SALAD_SPECIAL_TOPPINGS: SaladSpecialTopping[] = [
  { id: 'nuez', label: 'Nuez', price: 10 },
  { id: 'queso-feta', label: 'Queso Feta', price: 10 },
  { id: 'aguacate', label: 'Aguacate', price: 15 },
  { id: 'pollo', label: 'Pollo a la plancha', price: 20 },
  { id: 'almendras', label: 'Almendras', price: 10 },
]

export const PRODUCTS: Product[] = [
  // Jugos
  {
    id: 'jug-001',
    name: 'Verde Detox',
    description: 'Pepino, apio, espinaca, manzana verde, jengibre y limón',
    price: 65,
    image:
      'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&q=80',
    category: 'jugos',
    featured: true,
    tags: ['detox', 'vegano'],
  },
  {
    id: 'jug-002',
    name: 'Naranja & Zanahoria',
    description: 'Naranja fresca, zanahoria, jengibre y cúrcuma',
    price: 55,
    image:
      'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80',
    category: 'jugos',
    tags: ['vitamina C', 'antioxidante'],
  },
  {
    id: 'jug-003',
    name: 'Remolacha Power',
    description: 'Betabel, manzana, zanahoria, naranja y jengibre',
    price: 65,
    image:
      'https://images.unsplash.com/photo-1570696516188-ade861b84a49?w=400&q=80',
    category: 'jugos',
    tags: ['energizante', 'vegano'],
  },
  {
    id: 'jug-004',
    name: 'Tropical Fresh',
    description: 'Piña, mango, maracuyá y un toque de menta',
    price: 60,
    image:
      'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&q=80',
    category: 'jugos',
    featured: true,
    tags: ['tropical', 'vegano'],
  },
  // Licuados
  {
    id: 'lic-001',
    name: 'Licuado de Fresa',
    description: 'Fresas frescas, leche, plátano y miel de abeja',
    price: 70,
    image:
      'https://images.unsplash.com/photo-1553530666-ba11a90a3dcc?w=400&q=80',
    category: 'licuados',
    featured: true,
    tags: ['clásico'],
  },
  {
    id: 'lic-002',
    name: 'Licuado Verde',
    description: 'Espinaca, plátano, leche de almendra, chía y miel',
    price: 80,
    image:
      'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&q=80',
    category: 'licuados',
    tags: ['vegano', 'saludable'],
  },
  {
    id: 'lic-003',
    name: 'Chocolate Proteico',
    description: 'Cacao puro, plátano, leche, proteína vegetal y mantequilla de almendra',
    price: 90,
    image:
      'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80',
    category: 'licuados',
    tags: ['alta proteína', 'fitness'],
  },
  // Yogurt
  {
    id: 'yog-001',
    name: 'Parfait de Frutos Rojos',
    description: 'Yogurt griego, fresas, arándanos, frambuesas, granola artesanal y miel',
    price: 80,
    image:
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80',
    category: 'yogurt',
    featured: true,
    tags: ['probiótico', 'alto en calcio'],
  },
  {
    id: 'yog-002',
    name: 'Yogurt Tropical',
    description: 'Yogurt natural, mango, piña, coco rallado y granola',
    price: 80,
    image:
      'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&q=80',
    category: 'yogurt',
    tags: ['tropical', 'probiótico'],
  },
  {
    id: 'yog-003',
    name: 'Yogurt Fitness',
    description: 'Yogurt griego, plátano, nueces, semillas de chía y proteína',
    price: 95,
    image:
      'https://images.unsplash.com/photo-1571212515416-fca988083f0e?w=400&q=80',
    category: 'yogurt',
    tags: ['alta proteína', 'fitness'],
  },
  // Smoothies
  {
    id: 'smo-001',
    name: 'Smoothie Açaí',
    description: 'Açaí, arándanos, plátano, leche de almendra y granola',
    price: 110,
    image:
      'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80',
    category: 'smoothies',
    featured: true,
    tags: ['antioxidante', 'vegano'],
  },
  {
    id: 'smo-002',
    name: 'Green Smoothie',
    description: 'Espinaca, aguacate, pepino, limón, manzana verde y menta',
    price: 95,
    image:
      'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=400&q=80',
    category: 'smoothies',
    tags: ['detox', 'vegano'],
  },
  // Snacks
  {
    id: 'sna-001',
    name: 'Bowl de Fruta',
    description: 'Selección de fruta de temporada con chile, limón y chamoy opcional',
    price: 55,
    image:
      'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&q=80',
    category: 'snacks',
    tags: ['vegano', 'sin gluten'],
  },
  {
    id: 'sna-002',
    name: 'Mix de Nueces',
    description: 'Almendras, nueces, pistaches, arándanos y coco',
    price: 65,
    image:
      'https://images.unsplash.com/photo-1604210614637-99d697b20c0a?w=400&q=80',
    category: 'snacks',
    tags: ['vegano', 'keto'],
  },
]

export const FEATURED_PRODUCTS = PRODUCTS.filter((p) => p.featured)

export const BENEFITS: Benefit[] = [
  {
    id: 'ben-001',
    icon: '🌿',
    title: 'Ingredientes Frescos',
    description:
      'Seleccionamos los mejores ingredientes frescos cada día para garantizar la máxima calidad en cada platillo.',
  },
  {
    id: 'ben-002',
    icon: '⚡',
    title: 'Preparación al Momento',
    description:
      'Todo se prepara en el momento de tu pedido para que disfrutes los sabores y nutrientes al máximo.',
  },
  {
    id: 'ben-003',
    icon: '💚',
    title: 'Opciones Saludables',
    description:
      'Menú pensado para tu bienestar: sin conservadores, sin colorantes artificiales y con opciones veganas.',
  },
  {
    id: 'ben-004',
    icon: '🚀',
    title: 'Atención Rápida',
    description:
      'Sabemos que tu tiempo es valioso. Te atendemos en minutos sin sacrificar calidad.',
  },
]

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'tes-001',
    name: 'Ana García',
    rating: 5,
    comment:
      'La ensalada mediterránea es increíble. Fresca, con mucho sabor y los ingredientes se notan de calidad. Ya es mi lugar favorito para comer saludable.',
    date: '2024-12-15',
  },
  {
    id: 'tes-002',
    name: 'Carlos Mendoza',
    rating: 5,
    comment:
      'El smoothie de açaí es simplemente delicioso. Lo mejor es que todo es natural y te deja satisfecho. Muy buena atención y precio justo.',
    date: '2024-12-10',
  },
  {
    id: 'tes-003',
    name: 'Laura Pérez',
    rating: 5,
    comment:
      'Vengo todas las mañanas por mi jugo verde detox. Me ha cambiado el hábito de desayuno y me siento con mucha más energía. ¡Totalmente recomendado!',
    date: '2024-12-05',
  },
  {
    id: 'tes-004',
    name: 'Roberto Silva',
    rating: 4,
    comment:
      'El yogurt parfait es mi favorito. Granola casera, fruta fresca y el yogurt griego muy cremoso. El lugar es limpio y el personal muy amable.',
    date: '2024-11-28',
  },
  {
    id: 'tes-005',
    name: 'María Rodríguez',
    rating: 5,
    comment:
      'Descubrí BarraFresh por el QR que tienen en la mesa y desde entonces pido por WhatsApp. El servicio es rapidísimo y todo siempre fresco.',
    date: '2024-11-20',
  },
  {
    id: 'tes-006',
    name: 'Diego Torres',
    rating: 5,
    comment:
      'La ensalada proteica con quinoa y pollo es perfecta para después del gym. Buena porción, muy sabrosa y con ingredientes de verdad.',
    date: '2024-11-15',
  },
]

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 'gal-001',
    src: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
    alt: 'Ensalada colorida con vegetales frescos',
    category: 'ensaladas',
  },
  {
    id: 'gal-002',
    src: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&q=80',
    alt: 'Jugo verde detox natural',
    category: 'jugos',
  },
  {
    id: 'gal-003',
    src: 'https://images.unsplash.com/photo-1553530666-ba11a90a3dcc?w=600&q=80',
    alt: 'Licuado de fresa cremoso',
    category: 'licuados',
  },
  {
    id: 'gal-004',
    src: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80',
    alt: 'Parfait de yogurt con frutos rojos',
    category: 'yogurt',
  },
  {
    id: 'gal-005',
    src: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&q=80',
    alt: 'Ensalada César con crutones',
    category: 'ensaladas',
  },
  {
    id: 'gal-006',
    src: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&q=80',
    alt: 'Smoothie bowl de açaí',
    category: 'smoothies',
  },
  {
    id: 'gal-007',
    src: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&q=80',
    alt: 'Jugo de naranja y zanahoria',
    category: 'jugos',
  },
  {
    id: 'gal-008',
    src: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=600&q=80',
    alt: 'Bowl de fruta fresca de temporada',
    category: 'snacks',
  },
  {
    id: 'gal-009',
    src: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80',
    alt: 'Ensalada mediterránea con aceitunas',
    category: 'ensaladas',
  },
]
