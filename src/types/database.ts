export interface Page {
  id: string;
  name: string;
  description: string | null;
  slug: string | null;
  created_at: string;
}

export interface ProductImage {
  id: string;
  image_url: string;
  created_at: string;
}

export interface ProductSize {
  id: number;
  service_id: number;
  size: string;
  price: number;
  sale_price?: number | null;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  name: string;
  logo_url: string | null;
  description: string | null;
  specialization_id: string;
  is_active: boolean;
  created_at: string;
  specialization?: Specialization;
}

// Keeping Service for backward compatibility or if services are still needed
export interface Service {
  id: number;
  page_id: string; // Renamed from category_id
  specialization_id?: string | null; // Renamed from subcategory_id
  title: string;
  description: string | null;
  image_url: string | null;
  images?: ProductImage[]; 
  gallery?: string[]; 
  price?: number | null;
  sale_price?: number | null;
  has_multiple_sizes?: boolean;
  sizes?: ProductSize[]; 
  is_featured?: boolean; 
  is_best_seller?: boolean; 
  dst_file_url?: string | null;
  emb_file_url?: string | null;
  created_at: string;
  page?: Page; // Renamed from category
  specialization?: Specialization; // Renamed from subcategory
  displayImage?: string;
}

export interface Banner {
  id: string;
  type: 'image' | 'text' | 'strip';
  title: string | null;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  strip_text_color?: string | null;
  strip_background_color?: string | null;
  strip_position?: 'above_main' | 'below_main' | null;
  page_id?: string | null; // Added page_id
  page?: Page;
}

export interface StoreSettings {
  id: string;
  store_name: string | null;
  store_description: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  og_image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  keywords: string[] | null;
  facebook_url: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  snapchat_url: string | null;
  tiktok_url: string | null;
  theme_settings?: {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    backgroundGradient?: string;
    fontFamily?: string;
  } | null;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  image_url?: string | null;
  customer_image_url?: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Specialization {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar?: string | null;
  description_en?: string | null;
  page_id: string; // Renamed from category_id
  created_at: string;
  page?: Page;
}

// Aliases for backward compatibility during refactoring
export type Category = Page;
export type Subcategory = Specialization;
