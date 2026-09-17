import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// CORS & Preflight handling for seamless browser & iframe preview compatibility
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// In-Memory Database for Live Demo matching Spring Boot entities
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  foodType: string;
  imageUrl: string;
  restaurantName: string;
  stock: number;
  available: boolean;
  createdAt: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
}

interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  id: number;
  userId: number;
  userName: string;
  totalAmount: number;
  pickupLocation: string;
  paymentMethod: string;
  orderStatus: string; // PLACED, PREPARING, READY_FOR_PICKUP, COMPLETED
  ecoMessage: string;
  estimatedTime: string;
  createdAt: string;
  items: OrderItem[];
}

// Initial demo users
const users: User[] = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'student@campus.edu',
    password: 'password123',
    role: 'STUDENT',
  },
  {
    id: 2,
    name: 'Canteen Manager',
    email: 'admin@campusbite.com',
    password: 'admin123',
    role: 'ADMIN',
  },
];

// 12 Initial demo products
let products: Product[] = [
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

// User carts in memory
const carts: Record<number, CartItem[]> = {
  1: [],
};

// Orders in memory
let orders: Order[] = [
  {
    id: 1001,
    userId: 1,
    userName: 'Rahul Sharma',
    totalAmount: 135.0,
    pickupLocation: 'Library',
    paymentMethod: 'Cash on Pickup',
    orderStatus: 'COMPLETED',
    ecoMessage: '🌱 Great choice! You made a more sustainable food choice. ♻️ Smart ordering! Combining items into one pickup helps reduce unnecessary trips.',
    estimatedTime: 'Delivered',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    items: [
      {
        id: 1,
        productId: 1,
        productName: 'Crispy Masala Dosa',
        quantity: 1,
        price: 70.0,
        subtotal: 70.0,
      },
      {
        id: 2,
        productId: 6,
        productName: 'Grilled Cheese & Veggie Sandwich',
        quantity: 1,
        price: 65.0,
        subtotal: 65.0,
      },
    ],
  },
];

// Helper to calculate cart response
function buildCartResponse(userId: number = 1) {
  const userCart = carts[userId] || [];
  let subtotal = 0;
  let totalItems = 0;

  const items = userCart.map((item, idx) => {
    const p = products.find((prod) => prod.id === item.productId);
    const itemSubtotal = p ? p.price * item.quantity : 0;
    subtotal += itemSubtotal;
    totalItems += item.quantity;
    return {
      id: item.id || idx + 1,
      productId: item.productId,
      name: p ? p.name : 'Unknown Product',
      category: p ? p.category : 'General',
      foodType: p ? p.foodType : 'Vegetarian',
      imageUrl: p ? p.imageUrl : '',
      restaurantName: p ? p.restaurantName : 'Campus Canteen',
      price: p ? p.price : 0,
      quantity: item.quantity,
      availableStock: p ? p.stock : 0,
      subtotal: itemSubtotal,
    };
  });

  return {
    id: userId,
    userId,
    items,
    subtotal,
    grandTotal: subtotal,
    totalItems,
  };
}

// -------------------------------------------------------------
// REST API ENDPOINTS (Identical contract to Spring Boot)
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  return res.json({ status: 'ok', service: 'CampusBite API', version: '1.0.0' });
});

// Auth: Register
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Validation Failed', message: 'Email and password are required' });
  }

  const existing = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'Validation Failed', message: `An account with email ${email} already exists.` });
  }

  const newUser: User = {
    id: users.length + 1,
    name: name ? name.trim() : email.split('@')[0],
    email: email.trim().toLowerCase(),
    password,
    role: 'STUDENT',
  };
  users.push(newUser);
  carts[newUser.id] = [];

  const token = Buffer.from(`${newUser.id}:${newUser.email}`).toString('base64');
  return res.status(201).json({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    token,
    message: 'Registration successful!',
  });
});

// Auth: Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email.toLowerCase() === (email || '').trim().toLowerCase());

  if (!user || user.password !== password) {
    return res.status(400).json({ error: 'Bad Request', message: 'Invalid email or password.' });
  }

  const token = Buffer.from(`${user.id}:${user.email}`).toString('base64');
  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
    message: 'Login successful!',
  });
});

// Products: List & Search & Filter
app.get('/api/products', (req: Request, res: Response) => {
  const { search, category, foodType } = req.query;

  let filtered = [...products];

  if (search && typeof search === 'string' && search.trim() !== '') {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  if (category && typeof category === 'string' && category.trim().toLowerCase() !== 'all') {
    filtered = filtered.filter((p) => p.category.toLowerCase() === category.trim().toLowerCase());
  }

  if (foodType && typeof foodType === 'string' && foodType.trim().toLowerCase() !== 'all') {
    filtered = filtered.filter((p) => p.foodType.toLowerCase() === foodType.trim().toLowerCase());
  }

  return res.json(filtered);
});

// Products: Get by ID
app.get('/api/products/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const product = products.find((p) => p.id === id);
  if (!product) {
    return res.status(404).json({ error: 'Not Found', message: `Food item not found with id: ${id}` });
  }
  return res.json(product);
});

// Products: Create (Add Food Item)
app.post('/api/products', (req: Request, res: Response) => {
  const { name, description, price, category, foodType, imageUrl, restaurantName, stock } = req.body;

  if (!name || !price || !category || !foodType || !restaurantName) {
    return res.status(400).json({
      error: 'Validation Failed',
      message: 'Name, price, category, foodType, and restaurantName are required',
    });
  }

  const newStock = parseInt(stock, 10) || 0;
  const newProduct: Product = {
    id: products.length + 1,
    name: name.trim(),
    description: description || '',
    price: parseFloat(price),
    category: category.trim(),
    foodType: foodType.trim(),
    imageUrl:
      imageUrl && imageUrl.trim() !== ''
        ? imageUrl.trim()
        : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    restaurantName: restaurantName.trim(),
    stock: newStock,
    available: newStock > 0,
    createdAt: new Date().toISOString(),
  };

  products.push(newProduct);
  return res.status(201).json(newProduct);
});

// Cart: Get
app.get('/api/cart', (req: Request, res: Response) => {
  const userId = parseInt((req.query.userId as string) || '1', 10);
  return res.json(buildCartResponse(userId));
});

// Cart: Add Item
app.post('/api/cart/items', (req: Request, res: Response) => {
  const { productId, quantity, userId = 1 } = req.body;
  const uid = parseInt(userId, 10);
  const pid = parseInt(productId, 10);
  const qty = parseInt(quantity, 10) || 1;

  const product = products.find((p) => p.id === pid);
  if (!product) {
    return res.status(404).json({ error: 'Not Found', message: `Food item not found with id: ${pid}` });
  }

  if (!product.available || product.stock <= 0) {
    return res.status(400).json({ error: 'Insufficient Stock', message: `'${product.name}' is currently sold out or unavailable.` });
  }

  if (!carts[uid]) {
    carts[uid] = [];
  }

  const existing = carts[uid].find((item) => item.productId === pid);
  if (existing) {
    const newQty = existing.quantity + qty;
    if (newQty > product.stock) {
      return res.status(400).json({
        error: 'Insufficient Stock',
        message: `Only ${product.stock} portions of '${product.name}' are available in stock.`,
      });
    }
    existing.quantity = newQty;
  } else {
    if (qty > product.stock) {
      return res.status(400).json({
        error: 'Insufficient Stock',
        message: `Cannot add ${qty} portions. Only ${product.stock} available.`,
      });
    }
    carts[uid].push({
      id: Date.now(),
      productId: pid,
      quantity: qty,
    });
  }

  return res.json(buildCartResponse(uid));
});

// Cart: Update Item Quantity
app.put('/api/cart/items/:id', (req: Request, res: Response) => {
  const itemId = parseInt(req.params.id, 10);
  const { quantity } = req.body;
  const userId = parseInt((req.query.userId as string) || '1', 10);
  const qty = parseInt(quantity, 10);

  if (!carts[userId]) carts[userId] = [];
  const item = carts[userId].find((i) => i.id === itemId);

  if (!item) {
    return res.status(404).json({ error: 'Not Found', message: 'Cart item not found' });
  }

  const product = products.find((p) => p.id === item.productId);
  if (!product) {
    return res.status(404).json({ error: 'Not Found', message: 'Product not found' });
  }

  if (qty <= 0) {
    carts[userId] = carts[userId].filter((i) => i.id !== itemId);
  } else {
    if (qty > product.stock) {
      return res.status(400).json({
        error: 'Insufficient Stock',
        message: `Only ${product.stock} items of '${product.name}' currently in stock.`,
      });
    }
    item.quantity = qty;
  }

  return res.json(buildCartResponse(userId));
});

// Cart: Remove Item
app.delete('/api/cart/items/:id', (req: Request, res: Response) => {
  const itemId = parseInt(req.params.id, 10);
  const userId = parseInt((req.query.userId as string) || '1', 10);

  if (carts[userId]) {
    carts[userId] = carts[userId].filter((i) => i.id !== itemId);
  }

  return res.json(buildCartResponse(userId));
});

// Cart: Clear
app.delete('/api/cart', (req: Request, res: Response) => {
  const userId = parseInt((req.query.userId as string) || '1', 10);
  carts[userId] = [];
  return res.json({ message: 'Cart cleared successfully' });
});

// Payment: Stripe Simulation Intent
app.post('/api/payment/stripe-intent', (req: Request, res: Response) => {
  const { amount, currency = 'inr' } = req.body;
  // Simulates creating a Stripe payment intent securely
  const clientSecret = `pi_test_${Date.now()}_secret_${Math.random().toString(36).substring(2, 10)}`;
  return res.json({
    clientSecret,
    amount,
    currency,
    status: 'requires_confirmation',
  });
});

// Orders: Place Order
app.post('/api/orders', (req: Request, res: Response) => {
  const { userId = 1, pickupLocation, paymentMethod } = req.body;
  const uid = parseInt(userId, 10);

  if (!pickupLocation || !paymentMethod) {
    return res.status(400).json({
      error: 'Validation Failed',
      message: 'Pickup location and payment method are required',
    });
  }

  const userCart = carts[uid] || [];
  if (userCart.length === 0) {
    return res.status(400).json({ error: 'Bad Request', message: 'Cannot place an order with an empty cart.' });
  }

  // Stock check
  for (const item of userCart) {
    const product = products.find((p) => p.id === item.productId);
    if (!product || product.stock < item.quantity) {
      return res.status(400).json({
        error: 'Insufficient Stock',
        message: `Insufficient stock for '${product ? product.name : 'item'}'. Available: ${product ? product.stock : 0}`,
      });
    }
  }

  // Deduct stock and build order items
  const orderItems: OrderItem[] = [];
  let totalAmount = 0;
  let hasVegOrVegan = false;
  let totalQuantity = 0;

  for (const item of userCart) {
    const product = products.find((p) => p.id === item.productId)!;
    product.stock -= item.quantity;
    if (product.stock <= 0) {
      product.available = false;
    }

    const sub = product.price * item.quantity;
    totalAmount += sub;
    totalQuantity += item.quantity;

    if (product.foodType.toLowerCase() === 'vegetarian' || product.foodType.toLowerCase() === 'vegan') {
      hasVegOrVegan = true;
    }

    orderItems.push({
      id: Date.now() + Math.floor(Math.random() * 1000),
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      price: product.price,
      subtotal: sub,
    });
  }

  let ecoMessage = '';
  if (hasVegOrVegan) {
    ecoMessage += '🌱 Great choice! You made a more sustainable food choice. ';
  }
  if (totalQuantity > 1 || orderItems.length > 1) {
    ecoMessage += '♻️ Smart ordering! Combining items into one pickup helps reduce unnecessary trips.';
  }

  const user = users.find((u) => u.id === uid) || { name: 'Rahul Sharma' };

  const newOrder: Order = {
    id: 1000 + orders.length + 1,
    userId: uid,
    userName: user.name,
    totalAmount,
    pickupLocation,
    paymentMethod,
    orderStatus: 'PLACED',
    ecoMessage: ecoMessage.trim(),
    estimatedTime: '12-18 mins',
    createdAt: new Date().toISOString(),
    items: orderItems,
  };

  orders.unshift(newOrder);

  // Clear user cart
  carts[uid] = [];

  // Simulate automated real-time status progression for demo
  setTimeout(() => {
    if (newOrder.orderStatus === 'PLACED') {
      newOrder.orderStatus = 'PREPARING';
      newOrder.estimatedTime = '8-10 mins';
    }
  }, 12000);

  setTimeout(() => {
    if (newOrder.orderStatus === 'PREPARING') {
      newOrder.orderStatus = 'READY_FOR_PICKUP';
      newOrder.estimatedTime = 'Ready now!';
    }
  }, 26000);

  return res.status(201).json(newOrder);
});

// Orders: Get All for user
app.get('/api/orders', (req: Request, res: Response) => {
  const userId = req.query.userId ? parseInt(req.query.userId as string, 10) : null;
  if (userId) {
    const userOrders = orders.filter((o) => o.userId === userId);
    return res.json(userOrders);
  }
  return res.json(orders);
});

// Orders: Get by ID
app.get('/api/orders/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const order = orders.find((o) => o.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Not Found', message: `Order not found with id: ${id}` });
  }
  return res.json(order);
});

// Orders: Advance/Update status
app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { status } = req.body;
  const order = orders.find((o) => o.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Not Found', message: `Order not found with id: ${id}` });
  }

  if (status) {
    order.orderStatus = status;
    if (status === 'READY_FOR_PICKUP') order.estimatedTime = 'Ready for pickup at counter!';
    if (status === 'COMPLETED') order.estimatedTime = 'Completed';
  }
  return res.json(order);
});

// -------------------------------------------------------------
// Vite Server Integration
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(` CampusBite Full-Stack server running on port ${PORT}`);
    console.log(` REST APIs & React Web App ready at http://0.0.0.0:${PORT}`);
    console.log(`====================================================`);
  });
}

startServer();
