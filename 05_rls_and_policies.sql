-- =====================================================
-- المرحلة 5: تفعيل RLS وإنشاء سياسات الأمان
-- Stage 5: Enable RLS and Create Security Policies
-- =====================================================

-- =====================================================
-- تفعيل Row Level Security (RLS)
-- =====================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- إنشاء سياسات الأمان (Security Policies)
-- =====================================================

-- Categories policies
DROP POLICY IF EXISTS "Public can view active categories" ON categories;
CREATE POLICY "Public can view active categories"
  ON categories FOR SELECT
  TO public
  USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated can manage categories" ON categories;
CREATE POLICY "Authenticated can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Subcategories policies
DROP POLICY IF EXISTS "Public can view active subcategories" ON subcategories;
CREATE POLICY "Public can view active subcategories"
  ON subcategories FOR SELECT
  TO public
  USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated can manage subcategories" ON subcategories;
CREATE POLICY "Authenticated can manage subcategories"
  ON subcategories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Services policies
DROP POLICY IF EXISTS "Public can view active services" ON services;
CREATE POLICY "Public can view active services"
  ON services FOR SELECT
  TO public
  USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated can manage services" ON services;
CREATE POLICY "Authenticated can manage services"
  ON services FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Product sizes policies
DROP POLICY IF EXISTS "Public can view product sizes" ON product_sizes;
CREATE POLICY "Public can view product sizes"
  ON product_sizes FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Authenticated can manage product sizes" ON product_sizes;
CREATE POLICY "Authenticated can manage product sizes"
  ON product_sizes FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Product images policies
DROP POLICY IF EXISTS "Public can view product images" ON product_images;
CREATE POLICY "Public can view product images"
  ON product_images FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Authenticated can manage product images" ON product_images;
CREATE POLICY "Authenticated can manage product images"
  ON product_images FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Banners policies
DROP POLICY IF EXISTS "Public can view active banners" ON banners;
CREATE POLICY "Public can view active banners"
  ON banners FOR SELECT
  TO public
  USING (is_active = true AND (start_date IS NULL OR start_date <= NOW()) AND (end_date IS NULL OR end_date >= NOW()));

DROP POLICY IF EXISTS "Authenticated can manage banners" ON banners;
CREATE POLICY "Authenticated can manage banners"
  ON banners FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Store settings policies
DROP POLICY IF EXISTS "Public can view store settings" ON store_settings;
CREATE POLICY "Public can view store settings"
  ON store_settings FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Authenticated can manage store settings" ON store_settings;
CREATE POLICY "Authenticated can manage store settings"
  ON store_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Testimonials policies
DROP POLICY IF EXISTS "Public can view active testimonials" ON testimonials;
CREATE POLICY "Public can view active testimonials"
  ON testimonials FOR SELECT
  TO public
  USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated can manage testimonials" ON testimonials;
CREATE POLICY "Authenticated can manage testimonials"
  ON testimonials FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = id::text);

-- Orders policies
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can create orders" ON orders;
CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can update their own orders" ON orders;
CREATE POLICY "Users can update their own orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);

-- Order items policies
DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;
CREATE POLICY "Users can view their own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id::text = auth.uid()::text
  ));

DROP POLICY IF EXISTS "Users can create order items" ON order_items;
CREATE POLICY "Users can create order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id::text = auth.uid()::text
  ));

-- Coupons policies
DROP POLICY IF EXISTS "Public can view active coupons" ON coupons;
CREATE POLICY "Public can view active coupons"
  ON coupons FOR SELECT
  TO public
  USING (is_active = true AND (start_date IS NULL OR start_date <= NOW()) AND (end_date IS NULL OR end_date >= NOW()));

DROP POLICY IF EXISTS "Authenticated can manage coupons" ON coupons;
CREATE POLICY "Authenticated can manage coupons"
  ON coupons FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Product reviews policies
DROP POLICY IF EXISTS "Public can view approved reviews" ON product_reviews;
CREATE POLICY "Public can view approved reviews"
  ON product_reviews FOR SELECT
  TO public
  USING (is_approved = true);

DROP POLICY IF EXISTS "Users can view their own reviews" ON product_reviews;
CREATE POLICY "Users can view their own reviews"
  ON product_reviews FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can create reviews" ON product_reviews;
CREATE POLICY "Users can create reviews"
  ON product_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can update their own reviews" ON product_reviews;
CREATE POLICY "Users can update their own reviews"
  ON product_reviews FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Authenticated can manage reviews" ON product_reviews;
CREATE POLICY "Authenticated can manage reviews"
  ON product_reviews FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Wishlist policies
DROP POLICY IF EXISTS "Users can manage their own wishlist" ON wishlist;
CREATE POLICY "Users can manage their own wishlist"
  ON wishlist FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);

-- Cart items policies
DROP POLICY IF EXISTS "Users can manage their own cart" ON cart_items;
CREATE POLICY "Users can manage their own cart"
  ON cart_items FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);

-- Downloads policies
DROP POLICY IF EXISTS "Everyone can view active downloads" ON downloads;
CREATE POLICY "Everyone can view active downloads" 
    ON downloads FOR SELECT 
    USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated users can download files" ON downloads;
CREATE POLICY "Authenticated users can download files" 
    ON downloads FOR SELECT 
    TO authenticated 
    USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated users can upload files" ON downloads;
CREATE POLICY "Authenticated users can upload files" 
    ON downloads FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own files" ON downloads;
CREATE POLICY "Users can update their own files" 
    ON downloads FOR UPDATE 
    TO authenticated 
    USING (auth.uid()::text = uploaded_by::text) 
    WITH CHECK (auth.uid()::text = uploaded_by::text);

DROP POLICY IF EXISTS "Users can delete their own files" ON downloads;
CREATE POLICY "Users can delete their own files" 
    ON downloads FOR DELETE 
    TO authenticated 
    USING (auth.uid()::text = uploaded_by::text);

