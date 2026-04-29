export interface Page {
  id: string;
  name: string;
  name_en: string | null;
  description: string | null;
  description_en: string | null;
  image_url: string | null; // الصورة الرئيسية المربعة
  banner_url: string | null; // البانر
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
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
  name_en: string | null;
  logo_url: string | null;
  description: string | null;
  description_en: string | null;
  image_url: string | null;
  project_url: string | null;
  specialization_id: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  specialization?: Specialization;
  content?: ClientContent[];
}

export interface ClientContent {
  id: string;
  client_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  video_url: string | null;
  content_type: 'image' | 'video' | 'text';
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  client?: Client;
}

// Service - Level 2 in hierarchy (belongs to Page)
export interface Service {
  id: string;
  page_id: string;
  name: string;
  name_en: string | null;
  description: string | null;
  description_en: string | null;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  page?: Page;
  specializations?: Specialization[];
}

// Legacy Service interface for backward compatibility
export interface LegacyService {
  id: number;
  page_id: string;
  specialization_id?: string | null;
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
  page?: Page;
  specialization?: Specialization;
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
  service_id: string; // Links to Service (Level 2)
  name: string;
  name_en: string | null;
  description: string | null;
  description_en: string | null;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  service?: Service;
  clients?: Client[];
}

// Legacy Specialization interface for backward compatibility
export interface LegacySpecialization {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar?: string | null;
  description_en?: string | null;
  page_id: string;
  created_at: string;
  page?: Page;
}

// Aliases for backward compatibility during refactoring
export type Category = Page;
export type Subcategory = Specialization;
