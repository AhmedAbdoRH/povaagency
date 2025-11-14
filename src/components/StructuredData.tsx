import { Helmet } from 'react-helmet-async';
import type { Service, Category, StoreSettings } from '../types/database';

interface StructuredDataProps {
  type: 'organization' | 'product' | 'category' | 'breadcrumb';
  data?: Service | Category | StoreSettings;
  services?: Service[];
  categories?: Category[];
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export default function StructuredData({ type, data, services, categories, breadcrumbs }: StructuredDataProps) {
  const generateStructuredData = () => {
    const baseUrl = 'https://pova.com';
    
    switch (type) {
      case 'organization':
        const storeSettings = data as StoreSettings;
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": storeSettings?.store_name || "POVA",
          "description": storeSettings?.store_description || "شركة تسويق إلكتروني متكاملة تقدم خدمات تحليل البيانات، تصميم الهوية البصرية، كتابة المحتوى الإبداعي، التصوير الفوتوغرافي، الموشن جرافيك، إدارة الحملات الإعلانية وإدارة وسائل التواصل الاجتماعي",
          "url": baseUrl,
          "logo": storeSettings?.logo_url ? `${baseUrl}${storeSettings.logo_url}` : `${baseUrl}/‏‏logo.png`,
          "image": storeSettings?.og_image_url ? `${baseUrl}${storeSettings.og_image_url}` : `${baseUrl}/‏‏logo.png`,
          "address": [
            {
              "@type": "PostalAddress",
              "addressCountry": "EG",
              "addressLocality": "Cairo"
            }
          ],
          "contactPoint": [
            {
              "@type": "ContactPoint",
              "telephone": "+201006464349",
              "contactType": "customer service",
              "areaServed": "EG",
              "availableLanguage": "Arabic"
            },
            {
              "@type": "ContactPoint",
              "telephone": "+201006464349",
              "contactType": "customer service",
              "areaServed": "EG",
              "availableLanguage": "Arabic"
            }
          ],
          "sameAs": [
            storeSettings?.facebook_url,
            storeSettings?.instagram_url,
            storeSettings?.twitter_url,
            storeSettings?.snapchat_url,
            storeSettings?.tiktok_url
          ].filter(Boolean),
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "خدمات التسويق الرقمي",
            "itemListElement": services?.map((service, index) => ({
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": service.title,
                "description": service.description,
                "image": service.image_url ? `${baseUrl}${service.image_url}` : `${baseUrl}/placeholder-product.jpg`,
                "url": `${baseUrl}/product/${service.id}`
              },
              "price": service.price,
              "priceCurrency": "EGP",
              "availability": "https://schema.org/InStock"
            })) || []
          }
        };

      case 'product':
        const service = data as Service;
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": service.title,
          "description": service.description,
          "image": service.image_url ? `${baseUrl}${service.image_url}` : `${baseUrl}/placeholder-product.jpg`,
          "url": `${baseUrl}/product/${service.id}`,
          "brand": {
            "@type": "Brand",
            "name": "POVA"
          },
          "category": service.category?.name || "مفروشات",
          "offers": {
            "@type": "Offer",
            "price": service.sale_price || service.price,
            "priceCurrency": "EGP",
            "availability": "https://schema.org/InStock",
            "seller": {
              "@type": "Organization",
              "name": "POVA"
            }
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.5",
            "reviewCount": "50"
          }
        };

      case 'category':
        const category = data as Category;
        return {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": category.name,
          "description": category.description || `خدمات ${category.name} من POVA`,
          "url": `${baseUrl}/category/${category.id}`,
          "mainEntity": {
            "@type": "ItemList",
            "itemListElement": services?.map((service, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "Product",
                "name": service.title,
                "url": `${baseUrl}/product/${service.id}`,
                "image": service.image_url ? `${baseUrl}${service.image_url}` : `${baseUrl}/placeholder-product.jpg`
              }
            })) || []
          }
        };

      case 'breadcrumb':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": breadcrumbs?.map((breadcrumb, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": breadcrumb.name,
            "item": breadcrumb.url
          })) || []
        };

      default:
        return null;
    }
  };

  const structuredData = generateStructuredData();

  if (!structuredData) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData, null, 2)}
      </script>
    </Helmet>
  );
}
