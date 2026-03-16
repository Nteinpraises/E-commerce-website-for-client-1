require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const User = require('./models/User');
const Vendor = require('./models/Vendor');
const Product = require('./models/Product');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to DB');

  await Category.deleteMany({});
  await Product.deleteMany({});
  console.log('🗑️ Cleared old data');

  const categories = await Category.insertMany([
    { name: 'Suits & Blazers', slug: 'suits-blazers', icon: '🤵', isActive: true, sortOrder: 1 },
    { name: 'Shirts', slug: 'shirts', icon: '👔', isActive: true, sortOrder: 2 },
    { name: 'T-Shirts', slug: 't-shirts', icon: '👕', isActive: true, sortOrder: 3 },
    { name: 'Jeans & Trousers', slug: 'jeans-trousers', icon: '👖', isActive: true, sortOrder: 4 },
    { name: 'Shoes', slug: 'shoes', icon: '👟', isActive: true, sortOrder: 5 },
    { name: 'Socks & Underwear', slug: 'socks-underwear', icon: '🧦', isActive: true, sortOrder: 6 },
    { name: 'Jackets & Coats', slug: 'jackets-coats', icon: '🧥', isActive: true, sortOrder: 7 },
    { name: "Women's Fashion", slug: 'womens-fashion', icon: '👗', isActive: true, sortOrder: 8 },
  ]);
  console.log('📦 Categories created');

  const getCat = (name) => categories.find(c => c.name === name)._id;

  let vendorUser = await User.findOne({ email: 'vendor@fashionvault.com' });
  if (!vendorUser) {
    vendorUser = await User.create({
      name: 'FashionVault Official',
      email: 'vendor@fashionvault.com',
      password: 'vendor123456',
      role: 'vendor',
    });
  }

  let vendor = await Vendor.findOne({ user: vendorUser._id });
  if (!vendor) {
    vendor = await Vendor.create({
      user: vendorUser._id,
      storeName: 'FashionVault Official',
      storeSlug: 'fashionvault-official',
      description: 'Premium menswear and fashion for every occasion.',
      status: 'approved',
      rating: 4.9,
      totalReviews: 3200,
    });
  }
  console.log('🏪 Vendor created');

  const products = [
    // SUITS & BLAZERS
    {
      name: 'Classic Black 3-Piece Suit',
      price: 299.99, comparePrice: 449.99,
      category: getCat('Suits & Blazers'), stock: 40, rating: 4.9, totalReviews: 876, totalSales: 540,
      isFeatured: true, freeShipping: true,
      shortDescription: 'Sharp, tailored 3-piece suit for weddings, business and formal events.',
      description: 'This classic black 3-piece suit is crafted from premium wool blend fabric. Includes jacket, waistcoat and matching trousers. Perfect for weddings, job interviews and formal occasions.',
      tags: ['suit', 'formal', 'black', 'wedding', 'business'],
      images: [{ url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500', isMain: true }]
    },
    {
      name: 'Navy Blue Slim Fit Suit',
      price: 259.99, comparePrice: 389.99,
      category: getCat('Suits & Blazers'), stock: 35, rating: 4.8, totalReviews: 654, totalSales: 430,
      isFeatured: true, freeShipping: true,
      shortDescription: 'Modern slim fit navy suit — ideal for the office or formal events.',
      description: 'Slim fit navy blue suit made from Italian wool blend. Features a two-button jacket with notch lapels and flat-front trousers.',
      tags: ['suit', 'navy', 'slim fit', 'office', 'formal'],
      images: [{ url: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4e5b?w=500', isMain: true }]
    },
    {
      name: 'Grey Herringbone Blazer',
      price: 149.99, comparePrice: 219.99,
      category: getCat('Suits & Blazers'), stock: 50, rating: 4.7, totalReviews: 432, totalSales: 310,
      isFeatured: false, freeShipping: true,
      shortDescription: 'Versatile herringbone blazer — dress it up or down with ease.',
      description: 'A sophisticated grey herringbone pattern blazer that works for both smart casual and business occasions. Pair with chinos or dress trousers.',
      tags: ['blazer', 'grey', 'herringbone', 'smart casual'],
      images: [{ url: 'https://images.unsplash.com/photo-1555069519-127aadedf1ee?w=500', isMain: true }]
    },
    {
      name: 'Tan Linen Summer Suit',
      price: 189.99, comparePrice: 269.99,
      category: getCat('Suits & Blazers'), stock: 30, rating: 4.6, totalReviews: 321, totalSales: 198,
      isFeatured: false, freeShipping: true,
      shortDescription: 'Breathable linen suit perfect for summer weddings and holidays.',
      description: 'Lightweight tan linen 2-piece suit designed for warm weather. Relaxed fit with natural breathable fabric.',
      tags: ['suit', 'linen', 'summer', 'tan', 'holiday'],
      images: [{ url: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500', isMain: true }]
    },

    // SHIRTS
    {
      name: 'White Oxford Dress Shirt',
      price: 49.99, comparePrice: 79.99,
      category: getCat('Shirts'), stock: 150, rating: 4.8, totalReviews: 2345, totalSales: 1890,
      isFeatured: true, freeShipping: false,
      shortDescription: 'Crisp white Oxford shirt — a wardrobe essential for every man.',
      description: 'Classic white Oxford dress shirt made from 100% Egyptian cotton. Features button-down collar, single cuff and a regular fit.',
      tags: ['shirt', 'white', 'oxford', 'formal', 'office'],
      images: [{ url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500', isMain: true }]
    },
    {
      name: 'Blue Slim Fit Dress Shirt',
      price: 44.99, comparePrice: 69.99,
      category: getCat('Shirts'), stock: 120, rating: 4.7, totalReviews: 1876, totalSales: 1540,
      isFeatured: true, freeShipping: false,
      shortDescription: 'Sharp slim fit blue dress shirt for office and smart casual.',
      description: 'Premium slim fit dress shirt in light blue. Made from cotton-blend fabric with a spread collar. Perfect for pairing with a tie or open collar.',
      tags: ['shirt', 'blue', 'slim fit', 'dress shirt', 'office'],
      images: [{ url: 'https://images.unsplash.com/photo-1563630423918-b58f07336ac9?w=500', isMain: true }]
    },
    {
      name: 'Flannel Check Casual Shirt',
      price: 39.99, comparePrice: 59.99,
      category: getCat('Shirts'), stock: 90, rating: 4.6, totalReviews: 987, totalSales: 780,
      isFeatured: false, freeShipping: false,
      shortDescription: 'Comfortable flannel check shirt for weekends and casual wear.',
      description: 'Soft brushed flannel shirt in classic check pattern. Regular fit with a button-down front. Great layered over a t-shirt.',
      tags: ['shirt', 'flannel', 'check', 'casual', 'weekend'],
      images: [{ url: 'https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?w=500', isMain: true }]
    },
    {
      name: 'Black Satin Evening Shirt',
      price: 59.99, comparePrice: 89.99,
      category: getCat('Shirts'), stock: 60, rating: 4.7, totalReviews: 543, totalSales: 420,
      isFeatured: false, freeShipping: true,
      shortDescription: 'Luxurious satin finish shirt for parties and evening events.',
      description: 'Sleek black satin shirt with a slim fit cut. Features a pointed collar and button-front with a subtle sheen for a sophisticated look.',
      tags: ['shirt', 'black', 'satin', 'evening', 'party'],
      images: [{ url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500', isMain: true }]
    },

    // T-SHIRTS
    {
      name: 'Premium White Crew Neck T-Shirt',
      price: 24.99, comparePrice: 34.99,
      category: getCat('T-Shirts'), stock: 300, rating: 4.8, totalReviews: 5432, totalSales: 4200,
      isFeatured: true, freeShipping: false,
      shortDescription: 'Essential white tee made from 100% organic cotton. Super soft.',
      description: 'A wardrobe staple. Our premium crew neck t-shirt is made from 100% GOTS-certified organic cotton. Pre-shrunk and built to last.',
      tags: ['t-shirt', 'white', 'basic', 'organic cotton', 'crew neck'],
      images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', isMain: true }]
    },
    {
      name: 'Black Graphic Print T-Shirt',
      price: 29.99, comparePrice: 39.99,
      category: getCat('T-Shirts'), stock: 200, rating: 4.6, totalReviews: 3210, totalSales: 2560,
      isFeatured: true, freeShipping: false,
      shortDescription: 'Bold graphic tee with premium print quality that won\'t fade.',
      description: 'Statement graphic t-shirt in jet black. Features a high-quality DTG print on heavy 220gsm cotton. Relaxed fit.',
      tags: ['t-shirt', 'black', 'graphic', 'streetwear', 'print'],
      images: [{ url: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500', isMain: true }]
    },
    {
      name: 'Polo Ralph Lauren Classic Polo',
      price: 89.99, comparePrice: 109.99,
      category: getCat('T-Shirts'), stock: 180, rating: 4.9, totalReviews: 7654, totalSales: 6200,
      isFeatured: true, freeShipping: true,
      shortDescription: 'Iconic Ralph Lauren polo shirt in premium pique cotton.',
      description: 'The original polo shirt. Made from soft pique cotton with the iconic embroidered pony logo. Available in multiple colours.',
      tags: ['polo', 'ralph lauren', 'smart casual', 'pique cotton'],
      images: [{ url: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500', isMain: true }]
    },
    {
      name: 'Striped Breton Long Sleeve Top',
      price: 34.99, comparePrice: 49.99,
      category: getCat('T-Shirts'), stock: 140, rating: 4.5, totalReviews: 876, totalSales: 650,
      isFeatured: false, freeShipping: false,
      shortDescription: 'Classic navy and white Breton stripe long sleeve top.',
      description: 'Timeless Breton stripe long sleeve top in navy and white. Made from soft jersey cotton. A casual classic.',
      tags: ['t-shirt', 'striped', 'breton', 'long sleeve', 'casual'],
      images: [{ url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500', isMain: true }]
    },

    // JEANS & TROUSERS
    {
      name: 'Slim Fit Dark Wash Jeans',
      price: 79.99, comparePrice: 109.99,
      category: getCat('Jeans & Trousers'), stock: 200, rating: 4.8, totalReviews: 4321, totalSales: 3400,
      isFeatured: true, freeShipping: false,
      shortDescription: 'Premium dark wash slim fit jeans — smart enough for a night out.',
      description: 'Dark indigo slim fit jeans made from stretch denim. Low rise with a tapered leg. Versatile enough for work or the weekend.',
      tags: ['jeans', 'slim fit', 'dark wash', 'denim', 'stretch'],
      images: [{ url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', isMain: true }]
    },
    {
      name: 'Classic Chino Trousers',
      price: 59.99, comparePrice: 84.99,
      category: getCat('Jeans & Trousers'), stock: 180, rating: 4.7, totalReviews: 2987, totalSales: 2340,
      isFeatured: true, freeShipping: false,
      shortDescription: 'Versatile slim chino trousers. Smart casual essential.',
      description: 'Slim fit chino trousers in a cotton twill fabric. Features a flat front, zip fly and side slash pockets. Perfect for office and smart casual looks.',
      tags: ['chinos', 'trousers', 'slim fit', 'smart casual', 'office'],
      images: [{ url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500', isMain: true }]
    },
    {
      name: 'Relaxed Fit Cargo Trousers',
      price: 54.99, comparePrice: 74.99,
      category: getCat('Jeans & Trousers'), stock: 150, rating: 4.5, totalReviews: 1654, totalSales: 1230,
      isFeatured: false, freeShipping: false,
      shortDescription: 'Comfortable cargo trousers with multiple utility pockets.',
      description: 'Relaxed fit cargo trousers in durable cotton canvas. Features six pockets including two large cargo pockets on the thighs.',
      tags: ['cargo', 'trousers', 'relaxed fit', 'casual', 'utility'],
      images: [{ url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500', isMain: true }]
    },
    {
      name: 'Straight Leg Light Wash Jeans',
      price: 69.99, comparePrice: 99.99,
      category: getCat('Jeans & Trousers'), stock: 170, rating: 4.6, totalReviews: 2109, totalSales: 1670,
      isFeatured: false, freeShipping: false,
      shortDescription: 'Vintage-inspired straight leg jeans in a faded light wash.',
      description: 'Classic straight leg jeans with a vintage light wash. Mid-rise fit with a zip fly and five-pocket styling.',
      tags: ['jeans', 'straight leg', 'light wash', 'vintage', 'denim'],
      images: [{ url: 'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=500', isMain: true }]
    },

    // SHOES
    {
      name: 'White Leather Sneakers',
      price: 119.99, comparePrice: 159.99,
      category: getCat('Shoes'), stock: 100, rating: 4.8, totalReviews: 3456, totalSales: 2780,
      isFeatured: true, freeShipping: true,
      shortDescription: 'Minimalist white leather sneakers. Clean and versatile.',
      description: 'Premium white full-grain leather sneakers with a cushioned sole. Versatile enough to wear with jeans, chinos or even a suit.',
      tags: ['shoes', 'sneakers', 'white', 'leather', 'minimalist'],
      images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', isMain: true }]
    },
    {
      name: 'Oxford Leather Dress Shoes',
      price: 189.99, comparePrice: 249.99,
      category: getCat('Shoes'), stock: 60, rating: 4.9, totalReviews: 1234, totalSales: 890,
      isFeatured: true, freeShipping: true,
      shortDescription: 'Classic Oxford brogues in premium full-grain leather.',
      description: 'Handcrafted Oxford dress shoes in rich tan leather. Features Goodyear welt construction, leather sole and a cushioned insole.',
      tags: ['shoes', 'oxford', 'leather', 'formal', 'brogues'],
      images: [{ url: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500', isMain: true }]
    },
    {
      name: 'Chelsea Boots in Black Leather',
      price: 159.99, comparePrice: 219.99,
      category: getCat('Shoes'), stock: 75, rating: 4.7, totalReviews: 2109, totalSales: 1650,
      isFeatured: true, freeShipping: true,
      shortDescription: 'Sleek black Chelsea boots — from office to evening.',
      description: 'Classic black leather Chelsea boots with elastic side panels and pull tab. Stacked heel and rubber sole for everyday comfort.',
      tags: ['boots', 'chelsea', 'black', 'leather', 'smart casual'],
      images: [{ url: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=500', isMain: true }]
    },
    {
      name: 'Nike Air Force 1 Low White',
      price: 109.99, comparePrice: 129.99,
      category: getCat('Shoes'), stock: 120, rating: 4.9, totalReviews: 12456, totalSales: 9800,
      isFeatured: true, freeShipping: true,
      shortDescription: 'The iconic Nike Air Force 1 in classic all-white.',
      description: 'The Air Force 1 was the first basketball shoe to use Nike Air technology. Now a streetwear icon. Full leather upper, rubber outsole.',
      tags: ['shoes', 'nike', 'air force 1', 'sneakers', 'white'],
      images: [{ url: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500', isMain: true }]
    },
    {
      name: 'Loafers in Brown Suede',
      price: 129.99, comparePrice: 179.99,
      category: getCat('Shoes'), stock: 55, rating: 4.6, totalReviews: 876, totalSales: 650,
      isFeatured: false, freeShipping: false,
      shortDescription: 'Premium brown suede penny loafers. Smart casual perfection.',
      description: 'Slip-on penny loafers in soft brown suede. Leather lining and a flexible rubber sole. Wear with or without socks.',
      tags: ['shoes', 'loafers', 'brown', 'suede', 'smart casual'],
      images: [{ url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500', isMain: true }]
    },

    // SOCKS & UNDERWEAR
    {
      name: 'Premium Cotton Boxer Briefs 5-Pack',
      price: 34.99, comparePrice: 49.99,
      category: getCat('Socks & Underwear'), stock: 400, rating: 4.8, totalReviews: 6543, totalSales: 5200,
      isFeatured: true, freeShipping: false,
      shortDescription: 'Soft, supportive boxer briefs in a 5-pack. All-day comfort.',
      description: 'Pack of 5 premium cotton boxer briefs with a contoured pouch for support. Made from 95% cotton and 5% elastane.',
      tags: ['underwear', 'boxer briefs', 'cotton', 'multipack'],
      images: [{ url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500', isMain: true }]
    },
    {
      name: 'Luxury Dress Socks 6-Pack',
      price: 24.99, comparePrice: 39.99,
      category: getCat('Socks & Underwear'), stock: 500, rating: 4.7, totalReviews: 3456, totalSales: 2890,
      isFeatured: false, freeShipping: false,
      shortDescription: 'Colourful dress socks in fine mercerised cotton. 6 pairs.',
      description: 'Set of 6 pairs of luxury dress socks in assorted colours and patterns. Made from fine mercerised cotton with a reinforced heel and toe.',
      tags: ['socks', 'dress socks', 'cotton', 'multipack', 'colourful'],
      images: [{ url: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=500', isMain: true }]
    },

    // JACKETS & COATS
    {
      name: 'Black Puffer Jacket',
      price: 129.99, comparePrice: 189.99,
      category: getCat('Jackets & Coats'), stock: 80, rating: 4.7, totalReviews: 2109, totalSales: 1650,
      isFeatured: true, freeShipping: true,
      shortDescription: 'Warm quilted puffer jacket. Lightweight and packable.',
      description: 'Lightweight black puffer jacket filled with recycled down insulation. Water-resistant shell, two zip pockets and packable into its own pocket.',
      tags: ['jacket', 'puffer', 'black', 'winter', 'warm'],
      images: [{ url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500', isMain: true }]
    },
    {
      name: 'Camel Wool Overcoat',
      price: 299.99, comparePrice: 449.99,
      category: getCat('Jackets & Coats'), stock: 40, rating: 4.9, totalReviews: 876, totalSales: 560,
      isFeatured: true, freeShipping: true,
      shortDescription: 'Luxurious camel wool overcoat. Timeless and elegant.',
      description: 'Premium camel-coloured overcoat made from Italian wool blend. Single-breasted with notch lapels and a belted waist. A timeless investment piece.',
      tags: ['coat', 'overcoat', 'camel', 'wool', 'winter', 'luxury'],
      images: [{ url: 'https://images.unsplash.com/photo-1608063615781-e2ef8c73d114?w=500', isMain: true }]
    },
    {
      name: 'Brown Leather Biker Jacket',
      price: 249.99, comparePrice: 349.99,
      category: getCat('Jackets & Coats'), stock: 45, rating: 4.8, totalReviews: 1234, totalSales: 890,
      isFeatured: true, freeShipping: true,
      shortDescription: 'Classic brown genuine leather biker jacket with asymmetric zip.',
      description: 'Genuine leather biker jacket in rich brown. Features asymmetric zip, quilted shoulder panels, zip cuffs and two front zip pockets.',
      tags: ['jacket', 'leather', 'biker', 'brown', 'moto'],
      images: [{ url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', isMain: true }]
    },
    {
      name: 'Denim Trucker Jacket',
      price: 89.99, comparePrice: 129.99,
      category: getCat('Jackets & Coats'), stock: 90, rating: 4.6, totalReviews: 1987, totalSales: 1540,
      isFeatured: false, freeShipping: false,
      shortDescription: 'Classic denim trucker jacket — a wardrobe staple.',
      description: 'Iconic trucker jacket in mid-wash denim. Regular fit with button front, chest pockets and adjustable button cuffs.',
      tags: ['jacket', 'denim', 'trucker', 'casual', 'classic'],
      images: [{ url: 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=500', isMain: true }]
    },

    // WOMEN'S FASHION
    {
      name: 'Floral Wrap Midi Dress',
      price: 69.99, comparePrice: 99.99,
      category: getCat("Women's Fashion"), stock: 120, rating: 4.8, totalReviews: 3210, totalSales: 2540,
      isFeatured: true, freeShipping: true,
      shortDescription: 'Elegant floral wrap dress. Perfect for any occasion.',
      description: 'Beautiful floral print wrap midi dress in lightweight viscose. V-neckline, wrap front and a flowing skirt. Wear to weddings, garden parties or date nights.',
      tags: ['dress', 'floral', 'midi', 'wrap', 'women', 'elegant'],
      images: [{ url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500', isMain: true }]
    },
    {
      name: "Women's High Waist Skinny Jeans",
      price: 64.99, comparePrice: 89.99,
      category: getCat("Women's Fashion"), stock: 160, rating: 4.7, totalReviews: 4321, totalSales: 3450,
      isFeatured: true, freeShipping: false,
      shortDescription: 'Flattering high-waist skinny jeans in stretch denim.',
      description: 'High-waisted skinny jeans in power stretch denim. Sculpting waistband for a smooth silhouette. Available in multiple washes.',
      tags: ['jeans', 'women', 'skinny', 'high waist', 'stretch denim'],
      images: [{ url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500', isMain: true }]
    },
    {
      name: "Women's Tailored Blazer",
      price: 119.99, comparePrice: 169.99,
      category: getCat("Women's Fashion"), stock: 80, rating: 4.8, totalReviews: 1876, totalSales: 1340,
      isFeatured: true, freeShipping: true,
      shortDescription: 'Sharp tailored blazer for a powerful, polished look.',
      description: 'Structured single-breasted blazer in a stretch crepe fabric. Padded shoulders, flap pockets and a fitted silhouette. Perfect for the office.',
      tags: ['blazer', 'women', 'tailored', 'office', 'smart'],
      images: [{ url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500', isMain: true }]
    },
    {
      name: "Women's Ankle Strap Heels",
      price: 89.99, comparePrice: 129.99,
      category: getCat("Women's Fashion"), stock: 90, rating: 4.6, totalReviews: 2109, totalSales: 1670,
      isFeatured: false, freeShipping: true,
      shortDescription: 'Elegant block heel sandals with ankle strap. Day to night.',
      description: 'Chic block heel sandals with an ankle strap. Cushioned footbed for all-day comfort. Available in black and nude.',
      tags: ['shoes', 'heels', 'women', 'sandals', 'ankle strap'],
      images: [{ url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500', isMain: true }]
    },
  ];

  const productsWithVendor = products.map(p => ({ ...p, vendor: vendor._id, isActive: true }));
  await Product.insertMany(productsWithVendor);
  console.log(`✅ ${products.length} fashion products created!`);

  console.log('\n🎉 Seed complete! Your fashion store is ready.');
  console.log('👔 Visit localhost:3000 to see your store!');
  process.exit(0);
};

seed().catch(err => { console.error('❌ Seed error:', err.message); process.exit(1); });
