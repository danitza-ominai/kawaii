export type ActiveScreen =
  | 'home'
  | 'catalog'
  | 'product-detail'
  | 'avatar-builder'
  | 'virtual-try-on'
  | 'cart'
  | 'checkout'
  | 'confirmation';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  stock: number;
  rating: number;
  reviewsCount: number;
  category: 'adult' | 'niñas';
  style: 'pastel' | 'lolita' | 'street';
  description: string;
  imageUrl: string;
  clothingType: 'falda' | 'blusa' | 'vestido' | 'hoodie';
  colors: string[];
  sizes: string[];
  measurementsGuide: {
    size: string;
    busto: string; // range in cm
    cintura: string;
    cadera: string;
    altura?: string;
  }[];
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export type AgeType = 'myself' | 'daughter';

export interface AvatarConfig {
  ageType: AgeType;
  height: number; // in cm
  bust: number; // in cm
  waist: number; // in cm
  hips: number; // in cm
  skinColor: string; // hex
  hairStyle: string; // 'twin-tails' | 'bob' | 'wavy' | 'bun'
  hairColor: string; // hex
  accessory: string; // 'ribbon' | 'cat-ears' | 'glasses' | 'none'
  activeClothingId: string | null; // Product ID being tried on
}

export interface OrderInfo {
  id: string;
  emailOrWhatsapp: string;
  fullname: string;
  address: string;
  city: string;
  province: string;
  paymentMethod: 'tarjeta' | 'payphone' | 'deuna' | 'transferencia';
  subtotal: number;
  shippingCost: number;
  total: number;
  deliveryDate: string;
}
