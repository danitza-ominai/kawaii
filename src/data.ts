import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Falda Pastel Dreams ✨',
    price: 18.99,
    originalPrice: 22.00,
    stock: 5,
    rating: 4.9,
    reviewsCount: 18,
    category: 'adult',
    style: 'pastel',
    clothingType: 'falda',
    description: 'Falda de corte A en tonos rosa y lila pastel, con delicados detalles de encaje y cintas de satén ajustables. Cintura elástica ultra cómoda, hecha con algodón local premium para un tacto suave.',
    colors: ['Rosa Pastel', 'Lila Mágico'],
    sizes: ['S', 'M', 'L'],
    imageUrl: '👗', // Use visual emojis or styled CSS overlays
    measurementsGuide: [
      { size: 'S', busto: '80-86', cintura: '60-66', cadera: '86-92', altura: '150-160' },
      { size: 'M', busto: '87-93', cintura: '67-73', cadera: '93-99', altura: '155-165' },
      { size: 'L', busto: '94-100', cintura: '74-80', cadera: '100-106', altura: '160-175' }
    ]
  },
  {
    id: 'prod-2',
    name: 'Blusa Chibi Neko 🐱',
    price: 14.50,
    originalPrice: 18.50,
    stock: 4,
    rating: 4.8,
    reviewsCount: 12,
    category: 'adult',
    style: 'street',
    clothingType: 'blusa',
    description: 'Blusa ligera blanca con cuello de marinero y un bordado de gatito durmiendo. Mangas bombachas con bordes lila. Combina increíble con faldas de talle alto.',
    colors: ['Blanco Puro', 'Crema Suave'],
    sizes: ['S', 'M', 'L'],
    imageUrl: '👚',
    measurementsGuide: [
      { size: 'S', busto: '80-86', cintura: '60-66', cadera: '86-92' },
      { size: 'M', busto: '87-93', cintura: '67-73', cadera: '93-99' },
      { size: 'L', busto: '94-100', cintura: '74-80', cadera: '100-106' }
    ]
  },
  {
    id: 'prod-3',
    name: 'Vestido Lolita de Algodón 🌸',
    price: 24.99,
    originalPrice: 29.99,
    stock: 3,
    rating: 5.0,
    reviewsCount: 8,
    category: 'adult',
    style: 'lolita',
    clothingType: 'vestido',
    description: 'Un espectacular vestido con volados, lazo central removible y falda amplia para usar con enagua. Hecho en Ecuador con forro de algodón suave para evitar roces y picazón.',
    colors: ['Rosa Sakura', 'Azul Celeste'],
    sizes: ['S', 'M', 'L'],
    imageUrl: '👗',
    measurementsGuide: [
      { size: 'S', busto: '82-88', cintura: '62-68', cadera: '88-94' },
      { size: 'M', busto: '89-95', cintura: '69-75', cadera: '95-101' },
      { size: 'L', busto: '96-102', cintura: '76-82', cadera: '102-108' }
    ]
  },
  {
    id: 'prod-4',
    name: 'Hoodie Oso Fluffy 🐻',
    price: 21.00,
    originalPrice: 25.00,
    stock: 6,
    rating: 4.7,
    reviewsCount: 22,
    category: 'adult',
    style: 'street',
    clothingType: 'hoodie',
    description: 'Hoddie oversized con orejitas de oso de peluche afelpado en la capucha y un gran bolsillo frontal para mantener tus manos calientes. Ideal para días fríos en Quito o Cuenca.',
    colors: ['Marrón Latte', 'Rosa Bebé'],
    sizes: ['S', 'M', 'L'],
    imageUrl: '🧥',
    measurementsGuide: [
      { size: 'S', busto: '84-90', cintura: '60-70', cadera: '88-96' },
      { size: 'M', busto: '91-98', cintura: '71-80', cadera: '97-105' },
      { size: 'L', busto: '99-108', cintura: '81-92', cadera: '106-116' }
    ]
  },
  {
    id: 'prod-5',
    name: 'Falda de Encajes Gothic Lolita 🖤',
    price: 26.50,
    originalPrice: 32.00,
    stock: 3,
    rating: 4.9,
    reviewsCount: 15,
    category: 'adult',
    style: 'lolita',
    clothingType: 'falda',
    description: 'Falda Lolita clásica con estampado de lunas y estrellas doradas, encaje de tul negro de alta densidad y pretina con corset ajustable atrás. Perfecta para amantes del estilo gótico elegante.',
    colors: ['Negro Mágico', 'Azul Noche'],
    sizes: ['S', 'M', 'L'],
    imageUrl: '👗',
    measurementsGuide: [
      { size: 'S', busto: '80-86', cintura: '58-64', cadera: '84-90' },
      { size: 'M', busto: '87-93', cintura: '65-71', cadera: '91-97' },
      { size: 'L', busto: '94-100', cintura: '72-78', cadera: '98-104' }
    ]
  },
  {
    id: 'prod-6',
    name: 'Cardigan Estrellas Brillantes ⭐️',
    price: 19.99,
    originalPrice: 24.50,
    stock: 5,
    rating: 4.8,
    reviewsCount: 10,
    category: 'adult',
    style: 'pastel',
    clothingType: 'hoodie',
    description: 'Suéter tejido liviano con botones en forma de estrella de mar y un bordado pastel de arcoíris. Un abrigo versátil y tierno para un look cute casual diario.',
    colors: ['Menta Suave', 'Lila Crema'],
    sizes: ['S', 'M', 'L'],
    imageUrl: '🧥',
    measurementsGuide: [
      { size: 'S', busto: '80-88', cintura: '60-70', cadera: '86-94' },
      { size: 'M', busto: '89-96', cintura: '71-78', cadera: '95-102' },
      { size: 'L', busto: '97-105', cintura: '79-88', cadera: '103-112' }
    ]
  },
  {
    id: 'prod-7',
    name: 'Vestido Marinero Infantil Sakura 🌸 (Niñas)',
    price: 22.50,
    originalPrice: 26.00,
    stock: 4,
    rating: 5.0,
    reviewsCount: 14,
    category: 'niñas',
    style: 'pastel',
    clothingType: 'vestido',
    description: 'Vestido marinero para niñas de 8 a 14 años. Cuenta con un tierno cuello de rayas, lazo rosa pastel en el pecho y tela transpirable 100% de algodón ecuatoriano hipoalergénico.',
    colors: ['Rosa Sakura', 'Azul Marino'],
    sizes: ['Niña 8-10', 'Niña 10-12', 'Niña 12-14'],
    imageUrl: '👗',
    measurementsGuide: [
      { size: 'Niña 8-10', busto: '64-70', cintura: '56-60', cadera: '68-74', altura: '125-135' },
      { size: 'Niña 10-12', busto: '71-77', cintura: '61-65', cadera: '75-81', altura: '135-145' },
      { size: 'Niña 12-14', busto: '78-84', cintura: '66-70', cadera: '82-88', altura: '145-155' }
    ]
  },
  {
    id: 'prod-8',
    name: 'Hoodie Nube Chibi ☁️ (Niñas)',
    price: 15.00,
    originalPrice: 19.00,
    stock: 8,
    rating: 4.9,
    reviewsCount: 9,
    category: 'niñas',
    style: 'street',
    clothingType: 'hoodie',
    description: 'Abrigo con capucha para niñas con bordado de nube sonriente y mangas con diseño de alas. Ideal para jugar cómodamente con un estilo super kawaii.',
    colors: ['Celeste Nube', 'Lila Pastel'],
    sizes: ['Niña 8-10', 'Niña 10-12', 'Niña 12-14'],
    imageUrl: '🧥',
    measurementsGuide: [
      { size: 'Niña 8-10', busto: '64-70', cintura: '56-60', cadera: '68-74', altura: '125-135' },
      { size: 'Niña 10-12', busto: '71-77', cintura: '61-65', cadera: '75-81', altura: '135-145' },
      { size: 'Niña 12-14', busto: '78-84', cintura: '66-70', cadera: '82-88', altura: '145-155' }
    ]
  }
];

export const SKIN_TONES = [
  { id: 'skin-porcelain', name: 'Porcelana', value: '#FFE2D1' },
  { id: 'skin-peach', name: 'Peach', value: '#FFCCAB' },
  { id: 'skin-honey', name: 'Bronceado', value: '#E29E75' },
  { id: 'skin-cocoa', name: 'Marrón', value: '#A36843' }
];

export const HAIRSTYLES = [
  { id: 'twin-tails', name: 'Coletas Kawaii 👧', label: 'Coletas' },
  { id: 'bob', name: 'Corte Bob Cute 💇‍♀️', label: 'Bob' },
  { id: 'wavy', name: 'Ondas de Ensueño 👩‍🦱', label: 'Ondas' },
  { id: 'bun', name: 'Moño Chibi 👱‍♀️', label: 'Moño' }
];

export const HAIR_COLORS = [
  { id: 'hair-pink', name: 'Rosa Algodón', value: '#FFAEC9' },
  { id: 'hair-lila', name: 'Lila Pastel', value: '#D7C4F2' },
  { id: 'hair-brown', name: 'Chocolate', value: '#704E35' },
  { id: 'hair-blonde', name: 'Rubio Dorado', value: '#FFE494' }
];

export const ACCESSORIES = [
  { id: 'ribbon', name: 'Lazo Gigante 🎀', label: 'Lazo' },
  { id: 'cat-ears', name: 'Orejitas Neko 🐱', label: 'Neko' },
  { id: 'glasses', name: 'Gafas de Corazón 😎', label: 'Gafas' },
  { id: 'none', name: 'Ninguno ❌', label: 'Ninguno' }
];

export const ECUADOR_PROVINCES = [
  'Pichincha',
  'Guayas',
  'Azuay',
  'Manabí',
  'Imbabura',
  'Tungurahua',
  'Loja',
  'Chimborazo',
  'El Oro',
  'Santo Domingo de los Tsáchilas',
  'Santa Elena',
  'Esmeraldas',
  'Cotopaxi',
  'Los Ríos',
  'Carchi',
  'Cañar',
  'Bolívar',
  'Morona Santiago',
  'Napo',
  'Pastaza',
  'Zamora Chinchipe',
  'Galápagos',
  'Orellana',
  'Sucumbíos'
];

export const SHIPPING_COST = 3.50;
