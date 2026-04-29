-- =====================================================
-- ترجمة البيانات فقط (بعد إضافة الأعمدة)
-- Translate data only (after adding columns)
-- =====================================================

-- ترجمة صفحات غير مترجمة
UPDATE pages 
SET name_en = CASE 
    WHEN name = 'استراتيجية التسويق' THEN 'Marketing Strategy'
    WHEN name = 'صناعة المحتوى' THEN 'Content Creation'
    WHEN name = 'تصوير الفيديو' THEN 'Video Production'
    WHEN name = 'الإنتاج الإعلامي' THEN 'Media Production'
    WHEN name = 'بناء الهوية التجارية' THEN 'Brand Identity'
    WHEN name = 'تصميم المواقع' THEN 'Website Design'
    WHEN name = 'حملات السوشيال ميديا' THEN 'Social Media Campaigns'
    WHEN name = 'تصميم المنشورات' THEN 'Post Design'
    WHEN name = 'التصوير الفوتوغرافي' THEN 'Photography'
    ELSE COALESCE(name_en, name)
END,
description_en = CASE 
    WHEN description = 'صياغة استراتيجيات تسويقية متكاملة توجه قرارات النمو وتمنح مشروعك مسارًا واضحًا وقابلًا للتنفيذ.' THEN 'Formulating integrated marketing strategies that guide growth decisions and give your project a clear and executable path.'
    WHEN description = 'إنتاج محتوى يعبّر عن هويتك ويخاطب جمهورك بالشكل المناسب لكل منصة ومرحلة من رحلة العميل.' THEN 'Producing content that expresses your identity and addresses your audience appropriately for each platform and stage of the customer journey.'
    WHEN description = 'تنفيذ فيديوهات احترافية للإعلانات والمحتوى الترويجي والرسائل البصرية التي تعكس قيمة مشروعك.' THEN 'Executing professional videos for advertisements, promotional content, and visual messages that reflect your project value.'
    WHEN description = 'خدمات إنتاج متكاملة تشمل التخطيط والتنفيذ وما بعد الإنتاج لتقديم مخرجات جاهزة للنشر والتوزيع.' THEN 'Integrated production services including planning, execution, and post-production to deliver outputs ready for publishing and distribution.'
    WHEN description = 'تصميم هوية بصرية متماسكة تمنح علامتك شخصية واضحة وتترك انطباعًا احترافيًا ومستدامًا.' THEN 'Designing a cohesive visual identity that gives your brand a clear personality and leaves a professional and sustainable impression.'
    WHEN description = 'تصميم وتطوير مواقع حديثة وسريعة ومقنعة تساعد على تحويل الزيارات إلى فرص وعملاء محتملين.' THEN 'Designing and developing modern, fast, and impressive websites that help convert visits into opportunities and potential clients.'
    WHEN description = 'إدارة الحملات والمحتوى والإعلانات على منصات التواصل لبناء حضور فعّال وتحقيق نتائج قابلة للقياس.' THEN 'Managing campaigns, content, and advertisements on social platforms to build effective presence and achieve measurable results.'
    WHEN description = 'ابتكار تصاميم منشورات احترافية ومتسقة مع الهوية لتدعم المحتوى وتزيد من قوة الحضور البصري.' THEN 'Creating professional and identity-consistent post designs to support content and enhance visual presence power.'
    WHEN description = 'تصوير احترافي للمنتجات والفرق والأحداث والمواد التسويقية بما يرفع جودة الانطباع البصري للمشروع.' THEN 'Professional photography of products, teams, events, and marketing materials to elevate the visual impression quality of the project.'
    ELSE COALESCE(description_en, description)
END
WHERE name_en IS NULL OR name_en = '';

-- ترجمة خدمات غير مترجمة
UPDATE services 
SET name_en = CASE 
    WHEN name = 'استراتيجية التسويق' THEN 'Marketing Strategy'
    WHEN name = 'صناعة المحتوى' THEN 'Content Creation'
    WHEN name = 'تصوير الفيديو' THEN 'Video Production'
    WHEN name = 'الإنتاج الإعلامي' THEN 'Media Production'
    WHEN name = 'بناء الهوية التجارية' THEN 'Brand Identity'
    WHEN name = 'تصميم المواقع' THEN 'Website Design'
    WHEN name = 'حملات السوشيال ميديا' THEN 'Social Media Campaigns'
    WHEN name = 'تصميم المنشورات' THEN 'Post Design'
    WHEN name = 'التصوير الفوتوغرافي' THEN 'Photography'
    ELSE COALESCE(name_en, name)
END,
description_en = CASE 
    WHEN description = 'صياغة استراتيجيات تسويقية متكاملة توجه قرارات النمو وتمنح مشروعك مسارًا واضحًا وقابلًا للتنفيذ.' THEN 'Formulating integrated marketing strategies that guide growth decisions and give your project a clear and executable path.'
    WHEN description = 'إنتاج محتوى يعبّر عن هويتك ويخاطب جمهورك بالشكل المناسب لكل منصة ومرحلة من رحلة العميل.' THEN 'Producing content that expresses your identity and addresses your audience appropriately for each platform and stage of the customer journey.'
    WHEN description = 'تنفيذ فيديوهات احترافية للإعلانات والمحتوى الترويجي والرسائل البصرية التي تعكس قيمة مشروعك.' THEN 'Executing professional videos for advertisements, promotional content, and visual messages that reflect your project value.'
    WHEN description = 'خدمات إنتاج متكاملة تشمل التخطيط والتنفيذ وما بعد الإنتاج لتقديم مخرجات جاهزة للنشر والتوزيع.' THEN 'Integrated production services including planning, execution, and post-production to deliver outputs ready for publishing and distribution.'
    WHEN description = 'تصميم هوية بصرية متماسكة تمنح علامتك شخصية واضحة وتترك انطباعًا احترافيًا ومستدامًا.' THEN 'Designing a cohesive visual identity that gives your brand a clear personality and leaves a professional and sustainable impression.'
    WHEN description = 'تصميم وتطوير مواقع حديثة وسريعة ومقنعة تساعد على تحويل الزيارات إلى فرص وعملاء محتملين.' THEN 'Designing and developing modern, fast, and impressive websites that help convert visits into opportunities and potential clients.'
    WHEN description = 'إدارة الحملات والمحتوى والإعلانات على منصات التواصل لبناء حضور فعّال وتحقيق نتائج قابلة للقياس.' THEN 'Managing campaigns, content, and advertisements on social platforms to build effective presence and achieve measurable results.'
    WHEN description = 'ابتكار تصاميم منشورات احترافية ومتسقة مع الهوية لتدعم المحتوى وتزيد من قوة الحضور البصري.' THEN 'Creating professional and identity-consistent post designs to support content and enhance visual presence power.'
    WHEN description = 'تصوير احترافي للمنتجات والفرق والأحداث والمواد التسويقية بما يرفع جودة الانطباع البصري للمشروع.' THEN 'Professional photography of products, teams, events, and marketing materials to elevate the visual impression quality of the project.'
    ELSE COALESCE(description_en, description)
END
WHERE name_en IS NULL OR name_en = '';

-- ترجمة التخصصات غير مترجمة
UPDATE specializations 
SET name_en = CASE 
    WHEN name = 'استراتيجية التسويق' THEN 'Marketing Strategy'
    WHEN name = 'صناعة المحتوى' THEN 'Content Creation'
    WHEN name = 'تصوير الفيديو' THEN 'Video Production'
    WHEN name = 'الإنتاج الإعلامي' THEN 'Media Production'
    WHEN name = 'بناء الهوية التجارية' THEN 'Brand Identity'
    WHEN name = 'تصميم المواقع' THEN 'Website Design'
    WHEN name = 'حملات السوشيال ميديا' THEN 'Social Media Campaigns'
    WHEN name = 'تصميم المنشورات' THEN 'Post Design'
    WHEN name = 'التصوير الفوتوغرافي' THEN 'Photography'
    ELSE COALESCE(name_en, name)
END,
description_en = CASE 
    WHEN description = 'صياغة استراتيجيات تسويقية متكاملة توجه قرارات النمو وتمنح مشروعك مسارًا واضحًا وقابلًا للتنفيذ.' THEN 'Formulating integrated marketing strategies that guide growth decisions and give your project a clear and executable path.'
    WHEN description = 'إنتاج محتوى يعبّر عن هويتك ويخاطب جمهورك بالشكل المناسب لكل منصة ومرحلة من رحلة العميل.' THEN 'Producing content that expresses your identity and addresses your audience appropriately for each platform and stage of the customer journey.'
    WHEN description = 'تنفيذ فيديوهات احترافية للإعلانات والمحتوى الترويجي والرسائل البصرية التي تعكس قيمة مشروعك.' THEN 'Executing professional videos for advertisements, promotional content, and visual messages that reflect your project value.'
    WHEN description = 'خدمات إنتاج متكاملة تشمل التخطيط والتنفيذ وما بعد الإنتاج لتقديم مخرجات جاهزة للنشر والتوزيع.' THEN 'Integrated production services including planning, execution, and post-production to deliver outputs ready for publishing and distribution.'
    WHEN description = 'تصميم هوية بصرية متماسكة تمنح علامتك شخصية واضحة وتترك انطباعًا احترافيًا ومستدامًا.' THEN 'Designing a cohesive visual identity that gives your brand a clear personality and leaves a professional and sustainable impression.'
    WHEN description = 'تصميم وتطوير مواقع حديثة وسريعة ومقنعة تساعد على تحويل الزيارات إلى فرص وعملاء محتملين.' THEN 'Designing and developing modern, fast, and impressive websites that help convert visits into opportunities and potential clients.'
    WHEN description = 'إدارة الحملات والمحتوى والإعلانات على منصات التواصل لبناء حضور فعّال وتحقيق نتائج قابلة للقياس.' THEN 'Managing campaigns, content, and advertisements on social platforms to build effective presence and achieve measurable results.'
    WHEN description = 'ابتكار تصاميم منشورات احترافية ومتسقة مع الهوية لتدعم المحتوى وتزيد من قوة الحضور البصري.' THEN 'Creating professional and identity-consistent post designs to support content and enhance visual presence power.'
    WHEN description = 'تصوير احترافي للمنتجات والفرق والأحداث والمواد التسويقية بما يرفع جودة الانطباع البصري للمشروع.' THEN 'Professional photography of products, teams, events, and marketing materials to elevate the visual impression quality of the project.'
    ELSE COALESCE(description_en, description)
END
WHERE name_en IS NULL OR name_en = '';

-- ترجمة العملاء غير مترجمين
UPDATE clients 
SET name_en = CASE 
    WHEN name = 'استراتيجية التسويق' THEN 'Marketing Strategy'
    WHEN name = 'صناعة المحتوى' THEN 'Content Creation'
    WHEN name = 'تصوير الفيديو' THEN 'Video Production'
    WHEN name = 'الإنتاج الإعلامي' THEN 'Media Production'
    WHEN name = 'بناء الهوية التجارية' THEN 'Brand Identity'
    WHEN name = 'تصميم المواقع' THEN 'Website Design'
    WHEN name = 'حملات السوشيال ميديا' THEN 'Social Media Campaigns'
    WHEN name = 'تصميم المنشورات' THEN 'Post Design'
    WHEN name = 'التصوير الفوتوغرافي' THEN 'Photography'
    ELSE COALESCE(name_en, name)
END,
description_en = CASE 
    WHEN description = 'صياغة استراتيجيات تسويقية متكاملة توجه قرارات النمو وتمنح مشروعك مسارًا واضحًا وقابلًا للتنفيذ.' THEN 'Formulating integrated marketing strategies that guide growth decisions and give your project a clear and executable path.'
    WHEN description = 'إنتاج محتوى يعبّر عن هويتك ويخاطب جمهورك بالشكل المناسب لكل منصة ومرحلة من رحلة العميل.' THEN 'Producing content that expresses your identity and addresses your audience appropriately for each platform and stage of the customer journey.'
    WHEN description = 'تنفيذ فيديوهات احترافية للإعلانات والمحتوى الترويجي والرسائل البصرية التي تعكس قيمة مشروعك.' THEN 'Executing professional videos for advertisements, promotional content, and visual messages that reflect your project value.'
    WHEN description = 'خدمات إنتاج متكاملة تشمل التخطيط والتنفيذ وما بعد الإنتاج لتقديم مخرجات جاهزة للنشر والتوزيع.' THEN 'Integrated production services including planning, execution, and post-production to deliver outputs ready for publishing and distribution.'
    WHEN description = 'تصميم هوية بصرية متماسكة تمنح علامتك شخصية واضحة وتترك انطباعًا احترافيًا ومستدامًا.' THEN 'Designing a cohesive visual identity that gives your brand a clear personality and leaves a professional and sustainable impression.'
    WHEN description = 'تصميم وتطوير مواقع حديثة وسريعة ومقنعة تساعد على تحويل الزيارات إلى فرص وعملاء محتملين.' THEN 'Designing and developing modern, fast, and impressive websites that help convert visits into opportunities and potential clients.'
    WHEN description = 'إدارة الحملات والمحتوى والإعلانات على منصات التواصل لبناء حضور فعّال وتحقيق نتائج قابلة للقياس.' THEN 'Managing campaigns, content, and advertisements on social platforms to build effective presence and achieve measurable results.'
    WHEN description = 'ابتكار تصاميم منشورات احترافية ومتسقة مع الهوية لتدعم المحتوى وتزيد من قوة الحضور البصري.' THEN 'Creating professional and identity-consistent post designs to support content and enhance visual presence power.'
    WHEN description = 'تصوير احترافي للمنتجات والفرق والأحداث والمواد التسويقية بما يرفع جودة الانطباع البصري للمشروع.' THEN 'Professional photography of products, teams, events, and marketing materials to elevate the visual impression quality of the project.'
    ELSE COALESCE(description_en, description)
END
WHERE name_en IS NULL OR name_en = '';

-- عرض النتائج المحدثة
SELECT 
    'pages' as table_name,
    COUNT(*) as total,
    COUNT(CASE WHEN name_en IS NOT NULL AND name_en != '' THEN 1 END) as translated,
    COUNT(CASE WHEN description_en IS NOT NULL AND description_en != '' THEN 1 END) as descriptions_translated
FROM pages

UNION ALL

SELECT 
    'services' as table_name,
    COUNT(*) as total,
    COUNT(CASE WHEN name_en IS NOT NULL AND name_en != '' THEN 1 END) as translated,
    COUNT(CASE WHEN description_en IS NOT NULL AND description_en != '' THEN 1 END) as descriptions_translated
FROM services

UNION ALL

SELECT 
    'specializations' as table_name,
    COUNT(*) as total,
    COUNT(CASE WHEN name_en IS NOT NULL AND name_en != '' THEN 1 END) as translated,
    COUNT(CASE WHEN description_en IS NOT NULL AND description_en != '' THEN 1 END) as descriptions_translated
FROM specializations

UNION ALL

SELECT 
    'clients' as table_name,
    COUNT(*) as total,
    COUNT(CASE WHEN name_en IS NOT NULL AND name_en != '' THEN 1 END) as translated,
    COUNT(CASE WHEN description_en IS NOT NULL AND description_en != '' THEN 1 END) as descriptions_translated
FROM clients

ORDER BY table_name;
