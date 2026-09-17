import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import FoodCard from '../components/FoodCard';
import api from '../services/api';

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states initialized from URL params if available
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedFoodType, setSelectedFoodType] = useState(searchParams.get('foodType') || 'All');

  const categories = [
    'All',
    'Breakfast',
    'Meals',
    'Snacks',
    'Beverages',
    'Desserts',
    'Fast Food',
    'Healthy Food',
    'Combos',
    'Other',
  ];

  const foodTypes = ['All', 'Vegetarian', 'Non-Vegetarian', 'Vegan'];

  // Fetch products based on filters
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedFoodType !== 'All') params.foodType = selectedFoodType;

      const response = await api.get('/products', { params });
      setProducts(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load food catalogue');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, selectedFoodType]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Update query params when filters change
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') newParams.delete('category');
    else newParams.set('category', cat);
    setSearchParams(newParams);
  };

  const handleFoodTypeChange = (type) => {
    setSelectedFoodType(type);
    const newParams = new URLSearchParams(searchParams);
    if (type === 'All') newParams.delete('foodType');
    else newParams.set('foodType', type);
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedFoodType('All');
    setSearchParams({});
  };

  return (
    <div className="menu-page py-4">
      <div className="container">
        {/* Header Title */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h1 className="fw-bold text-dark mb-1">Campus Food Catalogue</h1>
            <p className="text-muted mb-0">Browse fresh meals, quick snacks, and beverages prepared across campus canteens.</p>
          </div>
          <Link to="/add-food" className="btn btn-outline-dark rounded-pill px-3 d-flex align-items-center gap-2 align-self-start align-self-md-auto">
            <i className="bi bi-plus-circle"></i> Add Food Item
          </Link>
        </div>

        {/* Filter & Search Bar Card */}
        <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
          <div className="row g-3">
            {/* Search Input */}
            <div className="col-12 col-md-5">
              <label className="form-label small fw-semibold text-secondary mb-1">Search Food</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-start-0"
                  placeholder="Search dosa, biryani, burger, coffee..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button className="btn btn-light border-start-0" onClick={() => setSearchTerm('')}>
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Category Dropdown/Selector */}
            <div className="col-6 col-md-4">
              <label className="form-label small fw-semibold text-secondary mb-1">Category</label>
              <select
                className="form-select bg-light"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c} {c === 'All' ? '(All Categories)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Food Type Selector */}
            <div className="col-6 col-md-3">
              <label className="form-label small fw-semibold text-secondary mb-1">Dietary Preference</label>
              <select
                className="form-select bg-light"
                value={selectedFoodType}
                onChange={(e) => handleFoodTypeChange(e.target.value)}
              >
                {foodTypes.map((t) => (
                  <option key={t} value={t}>
                    {t === 'All' ? 'All Types' : t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Category Chips for Touch / Click */}
          <div className="d-flex flex-wrap gap-2 mt-3 pt-3 border-top">
            <span className="small text-muted align-self-center me-1">Quick filter:</span>
            {categories.slice(0, 7).map((c) => (
              <button
                key={c}
                onClick={() => handleCategoryChange(c)}
                className={`btn btn-sm rounded-pill px-3 py-1 ${
                  selectedCategory === c ? 'btn-dark' : 'btn-outline-secondary'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info & Active Filters */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="small text-muted">
            Showing <strong className="text-dark">{products.length}</strong> items
            {selectedCategory !== 'All' && <span> in <strong>{selectedCategory}</strong></span>}
            {selectedFoodType !== 'All' && <span> • <strong>{selectedFoodType}</strong></span>}
          </div>
          {(searchTerm || selectedCategory !== 'All' || selectedFoodType !== 'All') && (
            <button onClick={handleClearFilters} className="btn btn-link btn-sm text-danger text-decoration-none p-0">
              <i className="bi bi-x-circle me-1"></i> Reset Filters
            </button>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger rounded-4 mb-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading catalogue...</span>
            </div>
            <p className="text-muted mt-3">Fetching fresh campus food options...</p>
          </div>
        ) : products.length === 0 ? (
          /* Empty State */
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white my-4">
            <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: 80, height: 80 }}>
              <i className="bi bi-search fs-1 text-muted"></i>
            </div>
            <h4 className="fw-bold text-dark">No Food Items Match Your Search</h4>
            <p className="text-muted max-w-md mx-auto mb-4">
              We couldn't find any dishes matching "{searchTerm || selectedCategory || selectedFoodType}". Try adjusting your category or food type filters.
            </p>
            <div>
              <button onClick={handleClearFilters} className="btn btn-warning rounded-pill px-4 me-2">
                Clear Filters
              </button>
              <Link to="/add-food" className="btn btn-outline-dark rounded-pill px-4">
                Add This Dish
              </Link>
            </div>
          </div>
        ) : (
          /* Food Grid */
          <div className="row g-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
            {products.map((product) => (
              <div key={product.id} className="col">
                <FoodCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
