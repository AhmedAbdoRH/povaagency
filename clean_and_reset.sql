-- =====================================================
-- Clean and Reset Database
-- This will DROP all existing tables and recreate them
-- =====================================================

-- Drop all tables in correct order (respecting foreign keys)
DROP TABLE IF EXISTS wishlist CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_reviews CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS product_sizes CASCADE;
DROP TABLE IF EXISTS services CASCADE; -- Old services table if exists
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS specializations CASCADE;
DROP TABLE IF EXISTS banners CASCADE;
DROP TABLE IF EXISTS store_settings CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS pages CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS subcategories CASCADE;

DROP TABLE IF EXISTS services_new CASCADE; -- Just in case

-- Drop the new services table if it exists from previous attempt
DROP TABLE IF EXISTS services CASCADE;

DO $$
BEGIN
    RAISE NOTICE 'All tables dropped successfully. Now run new_database_setup.sql';
END $$;
