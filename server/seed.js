require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');

const categories = [
  { name: 'Men Watches', slug: 'men-watches', gender: 'men', description: 'Premium dupe watches for men' },
  { name: 'Women Watches', slug: 'women-watches', gender: 'women', description: 'Elegant dupe watches for women' },
  { name: 'Men Bags', slug: 'men-bags', gender: 'men', description: 'Designer dupe bags for men' },
  { name: 'Women Bags', slug: 'women-bags', gender: 'women', description: 'Luxury dupe bags for women' },
  { name: 'Women Accessories', slug: 'women-accessories', gender: 'women', description: 'Luxury accessories for women' },
  { name: 'Men Accessories', slug: 'men-accessories', gender: 'men', description: 'Premium accessories for men' },
];

const watchImages = [
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
  'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800',
  'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800',
  'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=800',
  'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800',
  'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800',
];

const bagImages = [
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800',
  'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=800',
  'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800',
];

const seed = async () => {
  await connectDB();
  await Category.deleteMany();
  await Product.deleteMany();
  await User.deleteMany();

  const cats = await Category.insertMany(categories);
  const catMap = {};
  cats.forEach(c => { catMap[c.slug] = c._id; });

  const admin = await User.create({ name: 'Admin', email: 'admin@luxewatches.com', password: 'admin123', role: 'admin' });
  console.log('Admin created: admin@luxewatches.com / admin123');

  const products = [
    // Men Watches
    { name: 'Royal Oak Chronograph', slug: 'royal-oak-chronograph', brand: 'LuxeTime', originalBrand: 'Audemars Piguet', category: catMap['men-watches'], gender: 'men', type: 'watch', description: 'Stunning Royal Oak inspired chronograph with sapphire glass and steel bracelet. Swiss movement inspired precision at a fraction of the price.', shortDescription: 'AP Royal Oak inspired chronograph', price: 4999, originalPrice: 8999, discount: 44, images: [{ url: watchImages[0], alt: 'Royal Oak Chronograph' }, { url: watchImages[1], alt: 'Royal Oak Side View' }], stock: 25, sku: 'MW001', isFeatured: true, isNewArrival: true, isBestseller: true, specifications: [{ key: 'Movement', value: 'Automatic' }, { key: 'Case', value: '41mm Stainless Steel' }, { key: 'Glass', value: 'Sapphire Crystal' }, { key: 'Water Resistance', value: '50m' }], features: ['Chronograph', 'Date Display', 'Luminous Hands', 'Steel Bracelet'], tags: ['ap', 'royal oak', 'chronograph', 'luxury'], colors: [{ name: 'Silver', hex: '#C0C0C0' }, { name: 'Gold', hex: '#C9A84C' }], material: 'Stainless Steel', warranty: '1 Year', rating: 4.8, numReviews: 142 },
    { name: 'Submariner Black', slug: 'submariner-black', brand: 'DeepSea', originalBrand: 'Rolex', category: catMap['men-watches'], gender: 'men', type: 'watch', description: 'Iconic Submariner inspired dive watch with ceramic bezel and Oyster bracelet. Perfect for the man who demands style underwater and on land.', shortDescription: 'Rolex Submariner inspired diver', price: 5999, originalPrice: 11999, discount: 50, images: [{ url: watchImages[1], alt: 'Submariner Black' }, { url: watchImages[2], alt: 'Submariner Wrist' }], stock: 18, sku: 'MW002', isFeatured: true, isBestseller: true, specifications: [{ key: 'Movement', value: 'Automatic' }, { key: 'Case', value: '40mm Steel' }, { key: 'Bezel', value: 'Ceramic Unidirectional' }, { key: 'Water Resistance', value: '300m' }], features: ['Diver', 'Ceramic Bezel', 'Oyster Bracelet', 'Date'], tags: ['rolex', 'submariner', 'diver', 'luxury'], colors: [{ name: 'Black', hex: '#000000' }], rating: 4.9, numReviews: 287 },
    { name: 'Nautilus Blue Dial', slug: 'nautilus-blue-dial', brand: 'LuxeTime', originalBrand: 'Patek Philippe', category: catMap['men-watches'], gender: 'men', type: 'watch', description: 'The legendary Nautilus design with stunning blue sunburst dial. A masterpiece of horological art replicated with precision.', price: 6499, originalPrice: 14999, discount: 57, images: [{ url: watchImages[2], alt: 'Nautilus Blue' }], stock: 12, sku: 'MW003', isFeatured: true, specifications: [{ key: 'Movement', value: 'Automatic' }, { key: 'Case', value: '40mm' }], tags: ['patek', 'nautilus', 'blue dial'], rating: 4.7, numReviews: 98 },
    { name: 'Speedmaster Moonphase', slug: 'speedmaster-moonphase', brand: 'CosmosTime', originalBrand: 'Omega', category: catMap['men-watches'], gender: 'men', type: 'watch', description: 'Moon landing heritage in your wrist. Tachymeter bezel, moonphase display, and iconic hesalite crystal.', price: 3999, originalPrice: 7999, discount: 50, images: [{ url: watchImages[3], alt: 'Speedmaster' }], stock: 30, sku: 'MW004', tags: ['omega', 'speedmaster', 'moonphase'], rating: 4.6, numReviews: 67 },
    { name: 'Santos De Cartier XL', slug: 'santos-cartier-xl', brand: 'CarteBlanche', originalBrand: 'Cartier', category: catMap['men-watches'], gender: 'men', type: 'watch', description: 'The iconic Santos square case with exposed screws, Roman numeral dial, and interchangeable strap system.', price: 4499, originalPrice: 9499, discount: 53, images: [{ url: watchImages[4], alt: 'Santos XL' }], stock: 20, sku: 'MW005', isFeatured: true, tags: ['cartier', 'santos', 'square case'], rating: 4.5, numReviews: 54 },

    // Women Watches
    { name: 'Datejust Diamond Bezel', slug: 'datejust-diamond-bezel', brand: 'LuxeTime', originalBrand: 'Rolex', category: catMap['women-watches'], gender: 'women', type: 'watch', description: 'Timeless elegance with diamond-set bezel. Champagne dial with jubilee bracelet. The quintessential dress watch for the modern woman.', shortDescription: 'Rolex Datejust inspired ladies watch', price: 4999, originalPrice: 10999, discount: 55, images: [{ url: watchImages[5], alt: 'Datejust Diamond' }, { url: watchImages[0], alt: 'Datejust Side' }], stock: 22, sku: 'WW001', isFeatured: true, isBestseller: true, specifications: [{ key: 'Case', value: '31mm Steel & Gold' }, { key: 'Bezel', value: 'Diamond Set' }], tags: ['rolex', 'datejust', 'diamond', 'ladies'], colors: [{ name: 'Rose Gold', hex: '#B76E79' }, { name: 'Silver', hex: '#C0C0C0' }], rating: 4.9, numReviews: 203 },
    { name: 'Tank Solo Ladies', slug: 'tank-solo-ladies', brand: 'CarteBlanche', originalBrand: 'Cartier', category: catMap['women-watches'], gender: 'women', type: 'watch', description: 'Art deco masterpiece — the iconic rectangular Tank case with sapphire crown and elegant leather strap.', price: 3499, originalPrice: 7499, discount: 53, images: [{ url: watchImages[1], alt: 'Tank Solo' }], stock: 28, sku: 'WW002', isFeatured: true, tags: ['cartier', 'tank', 'art deco', 'ladies'], rating: 4.7, numReviews: 119 },
    { name: 'Lady-Datejust 28', slug: 'lady-datejust-28', brand: 'DeepSea', originalBrand: 'Rolex', category: catMap['women-watches'], gender: 'women', type: 'watch', description: 'The smaller Lady-Datejust with mother of pearl dial and diamond hour markers. Pure feminine luxury.', price: 4299, originalPrice: 9299, discount: 54, images: [{ url: watchImages[2], alt: 'Lady Datejust' }], stock: 15, sku: 'WW003', tags: ['rolex', 'lady datejust', 'mother of pearl'], rating: 4.8, numReviews: 87 },

    // Men Bags
    { name: 'Neverfull MM Tote', slug: 'neverfull-mm-tote', brand: 'LuxeBag', originalBrand: 'Louis Vuitton', category: catMap['men-bags'], gender: 'men', type: 'bag', description: 'The iconic LV Damier pattern in a spacious tote format. Perfect for travel and daily use with vachetta leather trim.', price: 2999, originalPrice: 6999, discount: 57, images: [{ url: bagImages[0], alt: 'Neverfull MM' }], stock: 35, sku: 'MB001', isBestseller: true, tags: ['lv', 'louis vuitton', 'neverfull', 'tote'], rating: 4.6, numReviews: 93 },
    { name: 'Briefcase Executive', slug: 'briefcase-executive', brand: 'EliteLeather', originalBrand: 'Montblanc', category: catMap['men-bags'], gender: 'men', type: 'bag', description: 'Premium Italian leather briefcase with laptop compartment. The ultimate executive accessory.', price: 3499, originalPrice: 7999, discount: 56, images: [{ url: bagImages[1], alt: 'Briefcase' }], stock: 20, sku: 'MB002', isFeatured: true, tags: ['montblanc', 'briefcase', 'leather', 'executive'], rating: 4.7, numReviews: 45 },

    // Women Bags
    { name: 'Classic Flap Medium', slug: 'classic-flap-medium', brand: 'ChanelDupe', originalBrand: 'Chanel', category: catMap['women-bags'], gender: 'women', type: 'bag', description: 'The eternal classic. Quilted leather with gold chain strap and iconic CC closure. Timeless elegance redefined.', shortDescription: 'Chanel Classic Flap inspired bag', price: 3999, originalPrice: 8999, discount: 56, images: [{ url: bagImages[2], alt: 'Classic Flap' }, { url: bagImages[3], alt: 'Classic Flap Detail' }], stock: 18, sku: 'WB001', isFeatured: true, isBestseller: true, tags: ['chanel', 'classic flap', 'quilted', 'chain'], colors: [{ name: 'Black', hex: '#000000' }, { name: 'Beige', hex: '#F5F0E8' }], rating: 4.9, numReviews: 312 },
    { name: 'Speedy 30 Monogram', slug: 'speedy-30-monogram', brand: 'LuxeBag', originalBrand: 'Louis Vuitton', category: catMap['women-bags'], gender: 'women', type: 'bag', description: 'LV Monogram canvas Speedy — the world\'s most recognizable bag. Perfect barrel shape with vachetta cowhide trim.', price: 2499, originalPrice: 5999, discount: 58, images: [{ url: bagImages[0], alt: 'Speedy 30' }], stock: 42, sku: 'WB002', isBestseller: true, tags: ['lv', 'louis vuitton', 'speedy', 'monogram'], rating: 4.8, numReviews: 241 },
    { name: 'Birkin 35 Togo', slug: 'birkin-35-togo', brand: 'HermesDupe', originalBrand: 'Hermès', category: catMap['women-bags'], gender: 'women', type: 'bag', description: 'The ultimate status symbol. Togo leather Birkin with palladium hardware. Premium craftsmanship at an accessible price.', price: 6999, originalPrice: 15999, discount: 56, images: [{ url: bagImages[1], alt: 'Birkin 35' }], stock: 8, sku: 'WB003', isFeatured: true, tags: ['hermes', 'birkin', 'togo', 'palladium'], colors: [{ name: 'Gold', hex: '#C9A84C' }, { name: 'Orange', hex: '#E86A30' }], rating: 4.9, numReviews: 178 },

    // Women Accessories
    { name: 'CC Logo Sunglasses', slug: 'cc-logo-sunglasses', brand: 'ChanelDupe', originalBrand: 'Chanel', category: catMap['women-accessories'], gender: 'women', type: 'sunglasses', description: 'Oversized butterfly frames with iconic CC logo. UV400 protection with gradient lenses.', price: 899, originalPrice: 2199, discount: 59, images: [{ url: bagImages[2], alt: 'CC Sunglasses' }], stock: 60, sku: 'WA001', tags: ['chanel', 'sunglasses', 'cc logo'], rating: 4.5, numReviews: 134 },
    { name: 'GG Marmont Wallet', slug: 'gg-marmont-wallet', brand: 'GucciDupe', originalBrand: 'Gucci', category: catMap['women-accessories'], gender: 'women', type: 'wallet', description: 'Matelassé leather wallet with GG marmont logo. Card slots, zip coin compartment, and bill fold.', price: 1299, originalPrice: 2999, discount: 57, images: [{ url: bagImages[3], alt: 'GG Wallet' }], stock: 45, sku: 'WA002', isFeatured: true, tags: ['gucci', 'marmont', 'wallet'], rating: 4.6, numReviews: 89 },
  ];

  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products and ${categories.length} categories`);
  process.exit(0);
};

seed().catch(e => { console.error(e); process.exit(1); });
