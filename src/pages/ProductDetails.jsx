import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import foodService from '../services/foodService';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';

const FALLBACK_FOOD_IMG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="%23f8f9fa"><rect width="600" height="400" fill="%23f1f5f9"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-size="64">🍲</text><text x="50%" y="70%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="600" font-size="20" fill="%2364748b">Fresh Campus Dish</text></svg>';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addNotification } = useNotification();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setError(null);
        const data = await foodService.getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Food item not found');
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading food details...</span>
        </div>
        <p className="text-muted mt-2">Loading food item...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger rounded-4 max-w-lg mx-auto p-4">
          <i className="bi bi-exclamation-triangle-fill fs-2 mb-2 d-block"></i>
          <h4>Food Item Not Found</h4>
          <p className="text-muted mb-3">{error || 'The requested food item does not exist.'}</p>
          <Link to="/menu" className="btn btn-outline-dark rounded-pill px-4">
            Back to Campus Menu
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable = product.available && product.stock > 0;
  const isEcoFriendly =
    product.foodType.toLowerCase() === 'vegetarian' || product.foodType.toLowerCase() === 'vegan';

  const handleAddToCart = async () => {
    if (!isAvailable || adding) return;
    try {
      setAdding(true);
      await addToCart(product, quantity);
      addNotification(`Added ${quantity}x ${product.name} to cart!`, 'success', 'Added to Cart');
    } catch (err) {
      addNotification(err.message, 'danger', 'Cart Error');
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAvailable) return;
    try {
      await addToCart(product, quantity);
      navigate('/cart');
    } catch (err) {
      addNotification(err.message, 'danger', 'Cart Error');
    }
  };

  return (
    <div className="product-details-page py-5">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/menu" className="text-decoration-none">Menu</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
          </ol>
        </nav>

        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white p-4 p-lg-5">
          <div className="row g-5">
            {/* Left: Food Image */}
            <div className="col-lg-6">
              <div className="position-relative rounded-4 overflow-hidden shadow-sm" style={{ maxHeight: '420px' }}>
                <img
                  src={product.imageUrl || FALLBACK_FOOD_IMG}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-100 h-100 object-fit-cover"
                  style={{ minHeight: '320px', maxHeight: '420px' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = FALLBACK_FOOD_IMG;
                  }}
                />
                <div className="position-absolute top-0 start-0 p-3">
                  <span className="badge bg-dark bg-opacity-75 fs-6 px-3 py-2 rounded-pill">
                    {product.category}
                  </span>
                </div>
                <div className="position-absolute top-0 end-0 p-3">
                  <span
                    className={`badge fs-6 px-3 py-2 rounded-pill ${
                      product.foodType.toLowerCase() === 'vegan'
                        ? 'bg-success'
                        : product.foodType.toLowerCase() === 'vegetarian'
                        ? 'bg-success text-white'
                        : 'bg-danger text-white'
                    }`}
                  >
                    {product.foodType}
                  </span>
                </div>
              </div>

              {/* EcoScore Sustainability Notice */}
              {isEcoFriendly && (
                <div className="mt-3 p-3 bg-success-subtle border border-success-subtle rounded-4 d-flex align-items-center gap-3">
                  <span className="fs-3">🌱</span>
                  <div>
                    <div className="fw-bold text-success-emphasis small">CampusBite EcoScore Choice</div>
                    <small className="text-success-emphasis">
                      Selecting this plant-based / vegetarian meal lowers campus culinary carbon footprint and saves water!
                    </small>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Food Info & Action */}
            <div className="col-lg-6 d-flex flex-column justify-content-between">
              <div>
                {/* Canteen source */}
                <div className="d-flex align-items-center gap-2 text-muted mb-2">
                  <i className="bi bi-shop text-warning fs-5"></i>
                  <span className="fw-semibold text-dark">{product.restaurantName}</span>
                  <span>•</span>
                  <span>Campus Kitchen Verified</span>
                </div>

                <h1 className="fw-bold text-dark mb-3">{product.name}</h1>

                {/* Price Display */}
                <div className="d-flex align-items-baseline gap-2 mb-3">
                  <span className="display-6 fw-bold text-dark">₹{Number(product.price).toFixed(2)}</span>
                  <span className="text-muted small">Inclusive of all taxes</span>
                </div>

                {/* Availability Stock Tag */}
                <div className="mb-4">
                  {isAvailable ? (
                    <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fs-6">
                      <i className="bi bi-check-circle-fill me-1"></i> Available Now ({product.stock} left in stock)
                    </span>
                  ) : (
                    <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-2 rounded-pill fs-6">
                      <i className="bi bi-x-circle-fill me-1"></i> Currently Out of Stock
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <h6 className="fw-bold text-dark">Description</h6>
                  <p className="text-secondary leading-relaxed">
                    {product.description || 'Authentic freshly-made campus dish prepared with hygienic ingredients, cooked to order to ensure high taste and safety.'}
                  </p>
                </div>
              </div>

              {/* Quantity Selector & Action Controls */}
              <div className="pt-4 border-top">
                {isAvailable ? (
                  <>
                    <div className="d-flex align-items-center gap-3 mb-4">
                      <span className="fw-semibold text-dark">Select Portions:</span>
                      <div className="input-group" style={{ width: '130px' }}>
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          disabled={quantity <= 1}
                        >
                          <i className="bi bi-dash"></i>
                        </button>
                        <input
                          type="text"
                          className="form-control text-center bg-light fw-bold"
                          value={quantity}
                          readOnly
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                          disabled={quantity >= product.stock}
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                      <small className="text-muted">
                        Max available: {product.stock}
                      </small>
                    </div>

                    <div className="d-flex flex-column flex-sm-row gap-3">
                      <button
                        onClick={handleAddToCart}
                        disabled={adding}
                        className="btn btn-warning btn-lg rounded-pill fw-bold text-dark flex-fill d-flex align-items-center justify-content-center gap-2 shadow-sm"
                      >
                        {adding ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            <span>Adding to Cart...</span>
                          </>
                        ) : (
                          <>
                            <i className="bi bi-cart-plus"></i> Add to Cart (₹{(product.price * quantity).toFixed(2)})
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleBuyNow}
                        className="btn btn-dark btn-lg rounded-pill fw-bold text-white flex-fill d-flex align-items-center justify-content-center gap-2"
                      >
                        <i className="bi bi-lightning-fill text-warning"></i> Checkout Now
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="alert alert-warning py-3 rounded-4" role="alert">
                    <i className="bi bi-info-circle-fill me-2"></i>
                    This item has sold out for the current shift. Please check other delicious campus options or contact the canteen manager.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
