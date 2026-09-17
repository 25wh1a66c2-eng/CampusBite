import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FoodCard from '../components/FoodCard';
import foodService from '../services/foodService';
import { getLocalProducts } from '../data/defaultProducts';

export default function Home() {
  // Pre-seed with local cached food items so items appear instantly without waiting
  const [featuredProducts, setFeaturedProducts] = useState(() => {
    const initial = getLocalProducts();
    return Array.isArray(initial) && initial.length > 0 ? initial.slice(0, 6) : [];
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProducts() {
      try {
        const items = await foodService.getProducts();
        if (Array.isArray(items) && items.length > 0) {
          setFeaturedProducts(items.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to load featured products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const categories = [
    { name: 'Breakfast', icon: 'bi-sunrise-fill', color: '#ff7849' },
    { name: 'Meals', icon: 'bi-cup-hot-fill', color: '#e53e3e' },
    { name: 'Snacks', icon: 'bi-cookie', color: '#dd6b20' },
    { name: 'Beverages', icon: 'bi-cup-straw', color: '#319795' },
    { name: 'Desserts', icon: 'bi-cake2-fill', color: '#d53f8c' },
    { name: 'Fast Food', icon: 'bi-lightning-charge-fill', color: '#805ad5' },
    { name: 'Healthy Food', icon: 'bi-heart-pulse-fill', color: '#38a169' },
    { name: 'Combos', icon: 'bi-box2-heart-fill', color: '#3182ce' },
  ];

  return (
    <div className="home-page pb-5">
      {/* 1. Hero Section */}
      <section className="hero-section text-white py-5 position-relative overflow-hidden" style={{ backgroundColor: '#0f294a' }}>
        <div className="container py-4 position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-white bg-opacity-10 border border-white border-opacity-20 text-warning small mb-3">
                <i className="bi bi-stars"></i>
                <span className="fw-semibold">Smart Campus Food Delivery & Pickup</span>
              </div>
              <h1 className="display-4 fw-extrabold mb-3 lh-sm">
                Order Smart. Eat Fresh. <br />
                <span className="text-warning">CampusBite.</span>
              </h1>
              <p className="lead text-light text-opacity-75 mb-4 pe-lg-4">
                Your campus food ordering platform for meals, snacks, beverages and everyday student cravings. Skip lines, pick up hot food between lectures, and eat fresh every day.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/menu" className="btn btn-warning btn-lg px-4 py-2 rounded-pill fw-bold text-dark shadow d-flex align-items-center gap-2">
                  <i className="bi bi-cart-check"></i> Order Now
                </Link>
                <Link to="/add-food" className="btn btn-outline-light btn-lg px-4 py-2 rounded-pill fw-semibold d-flex align-items-center gap-2">
                  <i className="bi bi-plus-circle"></i> Add or Sell Food
                </Link>
              </div>

              {/* Quick Perks */}
              <div className="row g-3 mt-4 pt-3 border-top border-white border-opacity-10 text-light text-opacity-80 small">
                <div className="col-auto d-flex align-items-center gap-2">
                  <i className="bi bi-clock-history text-warning fs-5"></i>
                  <span>10-15 Min Ready</span>
                </div>
                <div className="col-auto d-flex align-items-center gap-2">
                  <i className="bi bi-geo-alt text-warning fs-5"></i>
                  <span>5 Campus Hubs</span>
                </div>
                <div className="col-auto d-flex align-items-center gap-2">
                  <i className="bi bi-tree-fill text-success fs-5"></i>
                  <span>Campus EcoScore</span>
                </div>
              </div>
            </div>

            {/* Hero Image / Illustration Showcase */}
            <div className="col-lg-5 text-center">
              <div className="position-relative d-inline-block">
                <img
                  src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80"
                  alt="Campus Meal Special"
                  className="rounded-5 shadow-lg border border-4 border-white img-fluid"
                  style={{ maxHeight: '380px', objectFit: 'cover' }}
                />
                <div className="position-absolute bottom-0 start-0 translate-middle-y bg-white p-3 rounded-4 shadow text-dark text-start ms-n3 border">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-success-subtle text-success border border-success">
                      <i className="bi bi-tree"></i> EcoScore
                    </span>
                    <small className="text-muted">Student Choice</small>
                  </div>
                  <div className="fw-bold mt-1">Royal Dum Biryani</div>
                  <small className="text-muted">₹180.00 • Biryani Hub</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Sustainability EcoScore Notice */}
      <section className="bg-success-subtle py-3 border-bottom border-success-subtle">
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">
            <div className="d-flex align-items-center gap-2">
              <span className="fs-4">🌱</span>
              <span className="fw-semibold text-success-emphasis">
                CampusBite EcoScore: Supporting plant-based meals and consolidated batch deliveries across university hostels and faculties!
              </span>
            </div>
            <Link to="/menu?foodType=Vegetarian" className="btn btn-outline-success btn-sm rounded-pill px-3">
              Explore Eco-Friendly Meals <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Food Categories Section */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <span className="text-warning fw-bold text-uppercase small">Categories</span>
              <h2 className="fw-bold text-dark mb-0">Browse by Food Category</h2>
            </div>
            <Link to="/menu" className="btn btn-outline-dark btn-sm rounded-pill px-3">
              View All <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          <div className="row g-3 row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-4">
            {categories.map((cat) => (
              <div key={cat.name} className="col">
                <div
                  onClick={() => navigate(`/menu?category=${encodeURIComponent(cat.name)}`)}
                  className="card h-100 border-0 shadow-sm rounded-4 p-3 text-center cursor-pointer transition-all hover-lift bg-white"
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    className="rounded-circle mx-auto d-flex align-items-center justify-content-center text-white mb-2 shadow-sm"
                    style={{ width: 56, height: 56, backgroundColor: cat.color }}
                  >
                    <i className={`bi ${cat.icon} fs-4`}></i>
                  </div>
                  <h6 className="fw-bold text-dark mb-1">{cat.name}</h6>
                  <small className="text-muted">Fast campus orders</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Food Section */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <span className="text-danger fw-bold text-uppercase small">Hot & Fresh</span>
              <h2 className="fw-bold text-dark mb-0">Featured Campus Dishes</h2>
            </div>
            <Link to="/menu" className="btn btn-warning text-dark fw-semibold rounded-pill px-3">
              See Full Menu ({featuredProducts.length}+)
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading food items...</span>
              </div>
              <p className="text-muted mt-2">Fetching delicious food from campus canteens...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-5 bg-light rounded-4">
              <i className="bi bi-egg-fried fs-1 text-muted"></i>
              <h5 className="mt-2 text-dark">No food items added yet</h5>
              <p className="text-muted">Be the first to add a dish to the menu!</p>
              <Link to="/add-food" className="btn btn-warning rounded-pill px-4">
                Add Food Item
              </Link>
            </div>
          ) : (
            <div className="row g-4 row-cols-1 row-cols-sm-2 row-cols-md-3">
              {featuredProducts.map((product) => (
                <div key={product.id} className="col">
                  <FoodCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Why CampusBite? Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-5">
            <span className="text-primary fw-bold text-uppercase small">Built For Students & Staff</span>
            <h2 className="fw-bold text-dark">Why Choose CampusBite?</h2>
            <p className="text-muted">
              Designed to solve real university lunch break bottlenecks with fast pickups, verified student pricing, and zero order friction.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center bg-white">
                <div className="rounded-circle bg-primary bg-opacity-10 text-primary mx-auto d-flex align-items-center justify-content-center mb-3" style={{ width: 64, height: 64 }}>
                  <i className="bi bi-stopwatch-fill fs-2"></i>
                </div>
                <h5 className="fw-bold text-dark">Zero Counter Waiting</h5>
                <p className="text-muted small mb-0">
                  Place orders ahead of time during class or study sessions. Walk directly to the priority collection counter when your food is ready.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center bg-white">
                <div className="rounded-circle bg-warning bg-opacity-10 text-warning mx-auto d-flex align-items-center justify-content-center mb-3" style={{ width: 64, height: 64 }}>
                  <i className="bi bi-geo-alt-fill fs-2"></i>
                </div>
                <h5 className="fw-bold text-dark">Multiple Campus Hubs</h5>
                <p className="text-muted small mb-0">
                  Pick up at CSE Department, Central Library, Student Activity Centre, Hostels, or University Main Gate based on your timetable.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center bg-white">
                <div className="rounded-circle bg-success bg-opacity-10 text-success mx-auto d-flex align-items-center justify-content-center mb-3" style={{ width: 64, height: 64 }}>
                  <i className="bi bi-shield-check fs-2"></i>
                </div>
                <h5 className="fw-bold text-dark">Fresh & Eco-Friendly</h5>
                <p className="text-muted small mb-0">
                  Every order is prepared fresh on campus with real-time stock counters. Earn EcoScore badges for selecting vegetarian and plant-based dishes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
