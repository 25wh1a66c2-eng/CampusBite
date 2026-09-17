import api from './api';
import {
  getLocalProducts,
  saveLocalProducts,
  addLocalProduct,
  filterProductsLocally,
  DEFAULT_PRODUCTS,
} from '../data/defaultProducts';

export const foodService = {
  /**
   * Fetch all products with search and category filters.
   * Tries backend API first; seamlessly falls back to cached/default food items
   * if backend is unreachable, offline, or returns an error.
   */
  async getProducts(filters = {}) {
    const { search = '', category = 'All', foodType = 'All' } = filters;
    const params = {};
    if (search && search.trim()) params.search = search.trim();
    if (category && category !== 'All') params.category = category;
    if (foodType && foodType !== 'All') params.foodType = foodType;

    try {
      const response = await api.get('/products', { params });
      if (Array.isArray(response.data) && response.data.length > 0) {
        // If it was an unfiltered request, sync to localStorage
        if (!params.search && !params.category && !params.foodType) {
          saveLocalProducts(response.data);
        }
        return response.data;
      }
      
      // If the backend returned an empty array for an unfiltered query, fallback to defaults
      if (!params.search && (!params.category || params.category === 'All') && (!params.foodType || params.foodType === 'All')) {
        const local = getLocalProducts();
        return local;
      }

      // If user performed a specific filter on backend and got 0 results, check local
      const localFiltered = filterProductsLocally(getLocalProducts(), { search, category, foodType });
      return localFiltered;
    } catch (err) {
      console.warn('Backend API request failed, serving food items from local cache:', err.message);
      const local = getLocalProducts();
      const filtered = filterProductsLocally(local, { search, category, foodType });
      return filtered;
    }
  },

  /**
   * Fetch a single food item by ID
   */
  async getProductById(id) {
    const numId = Number(id);
    try {
      const response = await api.get(`/products/${numId}`);
      if (response.data && response.data.id) {
        return response.data;
      }
    } catch (err) {
      console.warn(`Could not fetch product ${id} from API, looking in local cache:`, err.message);
    }

    const localList = getLocalProducts();
    const found = localList.find((p) => Number(p.id) === numId);
    if (found) return found;
    throw new Error(`Food item with ID ${id} not found.`);
  },

  /**
   * Add / Sell a new food item
   */
  async addProduct(productPayload) {
    let savedProduct = null;
    try {
      const response = await api.post('/products', productPayload);
      if (response.data && response.data.id) {
        savedProduct = response.data;
      }
    } catch (err) {
      console.warn('Could not post product to backend API, saving locally:', err.message);
    }

    // Always persist to local cache as well so the item appears immediately in the UI
    const localSaved = addLocalProduct(savedProduct || productPayload);
    return savedProduct || localSaved;
  },

  /**
   * Reset food items to factory defaults
   */
  resetToDefaults() {
    saveLocalProducts(DEFAULT_PRODUCTS);
    return DEFAULT_PRODUCTS;
  },
};

export default foodService;
