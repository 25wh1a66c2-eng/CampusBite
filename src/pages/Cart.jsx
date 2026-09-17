import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';

export default function Cart() {
  const { items, subtotal, grandTotal, updateQuantity, removeFromCart, clearCart, loading, cartError } = useCart();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const handleQuantityChange = async (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      handleRemove(item);
      return;
    }

    if (item.availableStock !== undefined && newQty > item.availableStock) {
      addNotification(`Only ${item.availableStock} portions available in stock for ${item.name}`, 'warning', 'Stock Limit');
      return;
    }

    try {
      await updateQuantity(item.id, newQty, item.availableStock);
    } catch (err) {
      addNotification(err.message, 'danger', 'Cart Error');
    }
  };

  const handleRemove = async (item) => {
    try {
      await removeFromCart(item.id);
      addNotification(`Removed ${item.name} from cart`, 'info', 'Item Removed');
    } catch (err) {
      addNotification(err.message, 'danger', 'Error');
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-page py-5">
        <div className="container">
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white max-w-lg mx-auto">
            <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: 90, height: 90 }}>
              <i className="bi bi-cart-x fs-1 text-muted"></i>
            </div>
            <h3 className="fw-bold text-dark">Your CampusBite Cart is Empty</h3>
            <p className="text-muted mb-4">
              Looks like you haven't added any campus meals or snacks yet. Browse through our canteen menu to satisfy your cravings!
            </p>
            <div>
              <Link to="/menu" className="btn btn-warning btn-lg rounded-pill px-5 fw-bold text-dark shadow-sm">
                <i className="bi bi-egg-fried me-2"></i> Browse Food Menu
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // EcoScore sustainability check
  const hasPlantBased = items.some(
    (i) => i.foodType?.toLowerCase() === 'vegetarian' || i.foodType?.toLowerCase() === 'vegan'
  );

  return (
    <div className="cart-page py-5">
      <div className="container">
        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-bold text-dark mb-1">Your Food Cart</h1>
            <p className="text-muted mb-0">Review items, adjust portions, and proceed to campus pickup checkout.</p>
          </div>
          <button
            onClick={clearCart}
            className="btn btn-outline-danger btn-sm rounded-pill px-3 d-flex align-items-center gap-1"
          >
            <i className="bi bi-trash"></i> Clear Cart
          </button>
        </div>

        {cartError && (
          <div className="alert alert-danger rounded-4 mb-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i> {cartError}
          </div>
        )}

        <div className="row g-4">
          {/* Left Column: Cart Items List */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-3">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" className="ps-4">Food Item</th>
                      <th scope="col" className="text-center">Price</th>
                      <th scope="col" className="text-center">Quantity</th>
                      <th scope="col" className="text-end pe-4">Subtotal</th>
                      <th scope="col" className="text-center" style={{ width: '50px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        {/* Food Info */}
                        <td className="ps-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
                              alt={item.name}
                              className="rounded-3 object-fit-cover shadow-sm"
                              style={{ width: '60px', height: '60px' }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
                              }}
                            />
                            <div>
                              <h6 className="fw-bold text-dark mb-0">{item.name}</h6>
                              <small className="text-muted d-block">
                                <i className="bi bi-shop me-1"></i> {item.restaurantName || 'Campus Canteen'}
                              </small>
                              <span
                                className={`badge small px-2 py-0.5 rounded-pill ${
                                  item.foodType?.toLowerCase() === 'vegan'
                                    ? 'bg-success'
                                    : item.foodType?.toLowerCase() === 'vegetarian'
                                    ? 'bg-success-subtle text-success border border-success'
                                    : 'bg-danger-subtle text-danger border border-danger'
                                }`}
                              >
                                {item.foodType || 'Vegetarian'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="text-center fw-semibold text-secondary">
                          ₹{Number(item.price).toFixed(2)}
                        </td>

                        {/* Quantity Controller */}
                        <td className="text-center">
                          <div className="d-inline-flex align-items-center border rounded-pill bg-light p-1">
                            <button
                              type="button"
                              className="btn btn-sm btn-link text-dark text-decoration-none px-2 py-0"
                              onClick={() => handleQuantityChange(item, -1)}
                            >
                              <i className="bi bi-dash"></i>
                            </button>
                            <span className="px-2 fw-bold text-dark small" style={{ minWidth: '24px' }}>
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              className="btn btn-sm btn-link text-dark text-decoration-none px-2 py-0"
                              onClick={() => handleQuantityChange(item, 1)}
                              disabled={item.availableStock !== undefined && item.quantity >= item.availableStock}
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          </div>
                          {item.availableStock !== undefined && (
                            <small className="d-block text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                              Max: {item.availableStock}
                            </small>
                          )}
                        </td>

                        {/* Subtotal */}
                        <td className="text-end pe-4 fw-bold text-dark">
                          ₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                        </td>

                        {/* Delete Button */}
                        <td className="text-center pe-3">
                          <button
                            type="button"
                            className="btn btn-sm text-danger hover-bg-danger-subtle rounded-circle"
                            onClick={() => handleRemove(item)}
                            title="Remove item"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* EcoScore Sustainability Box */}
            {hasPlantBased && (
              <div className="p-3 bg-success-subtle border border-success-subtle rounded-4 d-flex align-items-center gap-3">
                <span className="fs-3">🌱</span>
                <div>
                  <strong className="text-success-emphasis d-block">EcoScore Active in Cart!</strong>
                  <span className="small text-success-emphasis">
                    Great choice! You made a more sustainable food choice. Combining items into one pickup helps reduce unnecessary trips across campus.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary & Checkout Card */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-top" style={{ top: '90px' }}>
              <h5 className="fw-bold text-dark mb-3">Order Summary</h5>

              <div className="d-flex justify-content-between text-secondary mb-2">
                <span>Items Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between text-secondary mb-2">
                <span>Campus Pickup Fee</span>
                <span className="text-success fw-semibold">FREE (₹0.00)</span>
              </div>

              <div className="d-flex justify-content-between text-secondary mb-3">
                <span>Estimated Prep Time</span>
                <span className="text-dark fw-medium">10 - 15 Mins</span>
              </div>

              <hr className="my-3" />

              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="fs-5 fw-bold text-dark">Grand Total</span>
                <span className="fs-4 fw-bold text-dark">₹{grandTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn btn-warning btn-lg w-100 rounded-pill fw-bold text-dark shadow-sm d-flex align-items-center justify-content-center gap-2 mb-3"
              >
                <span>Proceed to Checkout</span>
                <i className="bi bi-arrow-right"></i>
              </button>

              <Link to="/menu" className="btn btn-outline-secondary w-100 rounded-pill d-flex align-items-center justify-content-center gap-1">
                <i className="bi bi-arrow-left"></i> Add More Items
              </Link>

              {/* Guarantees */}
              <div className="mt-4 pt-3 border-top text-muted small text-center">
                <div className="d-flex justify-content-center gap-3">
                  <span><i className="bi bi-shield-check text-success me-1"></i> Freshly Prepared</span>
                  <span><i className="bi bi-lightning-charge text-warning me-1"></i> Hot Handover</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
