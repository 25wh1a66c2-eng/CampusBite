// Default campus food items catalogue for CampusBite
export const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: 'Crispy Masala Dosa',
    description: 'Golden crisp fermented crepe made from rice and lentils, stuffed with spiced potato mash, served with coconut chutney & piping hot sambar.',
    price: 70.0,
    category: 'Breakfast',
    foodType: 'Vegetarian',
    imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
    restaurantName: 'South Canteen',
    stock: 25,
    available: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Royal Dum Chicken Biryani',
    description: 'Fragrant basmati rice slow-cooked on dum with tender marinated chicken, saffron, ghee, and authentic whole spices. Accompanied by mirchi ka salan and raita.',
    price: 180.0,
    category: 'Meals',
    foodType: 'Non-Vegetarian',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    restaurantName: 'Biryani Hub',
    stock: 20,
    available: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Hyderabadi Veg Biryani',
    description: 'Aromatic long-grain basmati rice layered with garden-fresh vegetables, paneer cubes, fried onions, mint, and saffron.',
    price: 130.0,
    category: 'Meals',
    foodType: 'Vegetarian',
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    restaurantName: 'Campus Food Court',
    stock: 30,
    available: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Steamed Idli Sambar Platter',
    description: 'Four pillowy soft steamed rice cakes served with aromatic lentil vegetable sambar and fresh grated coconut chutney.',
    price: 50.0,
    category: 'Breakfast',
    foodType: 'Vegan',
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    restaurantName: 'South Canteen',
    stock: 35,
    available: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    name: 'Paneer Fried Rice & Manchurian Combo',
    description: 'Wok-tossed basmati rice with golden paneer cubes, bell peppers, scallions paired with flavorful vegetable Manchurian gravy.',
    price: 140.0,
    category: 'Combos',
    foodType: 'Vegetarian',
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
    restaurantName: 'Night Cafe',
    stock: 18,
    available: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 6,
    name: 'Grilled Cheese & Veggie Sandwich',
    description: 'Toasted jumbo artisanal bread layered with cucumber, tomato, capsicum, mint chutney, and molten cheddar mozzarella cheese.',
    price: 65.0,
    category: 'Snacks',
    foodType: 'Vegetarian',
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    restaurantName: 'Bistro 101',
    stock: 22,
    available: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 7,
    name: 'Crispy Fried Chicken Burger',
    description: 'Crisp buttermilk fried chicken fillet topped with fresh crunchy iceberg lettuce, pickled gherkins, and creamy chipotle mayo in a brioche bun.',
    price: 120.0,
    category: 'Fast Food',
    foodType: 'Non-Vegetarian',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    restaurantName: 'Burger Street',
    stock: 15,
    available: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 8,
    name: 'Peri Peri Masala French Fries',
    description: 'Golden shoestring potatoes deep fried to perfection and tossed in tangy spicy African peri-peri seasoning. Served with garlic dip.',
    price: 75.0,
    category: 'Fast Food',
    foodType: 'Vegan',
    imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80',
    restaurantName: 'Fast Bites',
    stock: 40,
    available: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 9,
    name: 'Punjabi Samosa Plate (2 Pcs)',
    description: 'Crispy triangular pastry crust filled with spiced potatoes, green peas, cumin, and coriander. Served with sweet tamarind and spicy green chutney.',
    price: 35.0,
    category: 'Snacks',
    foodType: 'Vegan',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    restaurantName: 'Central Canteen',
    stock: 50,
    available: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 10,
    name: 'Thick Chilled Cold Coffee',
    description: 'Creamy blended brewed espresso with rich chilled milk, vanilla syrup, and a scoop of vanilla ice cream.',
    price: 60.0,
    category: 'Beverages',
    foodType: 'Vegetarian',
    imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
    restaurantName: 'Campus Brews',
    stock: 30,
    available: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 11,
    name: 'Fresh Mint Lime Cooler',
    description: 'Invigorating freshly squeezed whole lemon with crushed garden mint leaves, rock salt, and sparkling soda.',
    price: 40.0,
    category: 'Beverages',
    foodType: 'Vegan',
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    restaurantName: 'Juice Junction',
    stock: 40,
    available: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 12,
    name: 'Belgian Dark Chocolate Cake Slice',
    description: 'Moist Dutch cocoa sponge layered with velvety Belgian dark chocolate ganache and chocolate shavings.',
    price: 90.0,
    category: 'Desserts',
    foodType: 'Vegetarian',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    restaurantName: 'Sweet Treats Bakery',
    stock: 12,
    available: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 13,
    name: 'Fresh Green Detox Salad Bowl',
    description: 'Crisp organic cucumber, cherry tomatoes, baby spinach, sprouted moong, roasted pumpkin seeds, and cold-pressed lemon-herb dressing.',
    price: 85.0,
    category: 'Healthy Food',
    foodType: 'Vegan',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    restaurantName: 'Juice Junction',
    stock: 20,
    available: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 14,
    name: 'Paneer Protein Power Wrap',
    description: 'Whole wheat flatbread rolled with grilled spiced paneer tikka, mixed bell peppers, shredded lettuce, and hung curd mint spread.',
    price: 95.0,
    category: 'Healthy Food',
    foodType: 'Vegetarian',
    imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80',
    restaurantName: 'Bistro 101',
    stock: 25,
    available: true,
    createdAt: new Date().toISOString(),
  },
];

const STORAGE_KEY = 'campusbite_products_cache';

// Helper to get local stored products with fallback to DEFAULT_PRODUCTS
export function getLocalProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to read products from localStorage:', e);
  }
  // Initialize storage with defaults
  saveLocalProducts(DEFAULT_PRODUCTS);
  return DEFAULT_PRODUCTS;
}

// Helper to save products to localStorage
export function saveLocalProducts(products) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.warn('Failed to save products to localStorage:', e);
  }
}

// Helper to add a single product to localStorage
export function addLocalProduct(newProduct) {
  const current = getLocalProducts();
  const nextId = current.length > 0 ? Math.max(...current.map((p) => Number(p.id) || 0)) + 1 : 1;
  const productWithId = {
    ...newProduct,
    id: newProduct.id || nextId,
    createdAt: newProduct.createdAt || new Date().toISOString(),
  };
  const updated = [productWithId, ...current];
  saveLocalProducts(updated);
  return productWithId;
}

// Helper to filter products locally
export function filterProductsLocally(products, { search = '', category = 'All', foodType = 'All' } = {}) {
  let list = Array.isArray(products) ? [...products] : [];

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.restaurantName && p.restaurantName.toLowerCase().includes(q))
    );
  }

  if (category && category.toLowerCase() !== 'all') {
    list = list.filter((p) => (p.category || '').toLowerCase() === category.toLowerCase());
  }

  if (foodType && foodType.toLowerCase() !== 'all') {
    list = list.filter((p) => (p.foodType || '').toLowerCase() === foodType.toLowerCase());
  }

  return list;
}
