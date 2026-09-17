import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import StripeModal from '../components/StripeModal';
import api from '../services/api';

export default function Checkout() {
  const { items, subtotal, grandTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  // Locations mandated in prompt
  const locations = [
    { id: 'CSE Department', name: 'CSE Department (Block A Foyer)', icon: 'bi-laptop' },
    { id: 'Library', name: 'Central University Library Entrance', icon: 'bi-book' },
    { id: 'Main Gate', name: 'University Main Gate Security Booth', icon: 'bi-door-open' },
    { id: 'Hostel', name: 'Student Residential Hostels (Block 3 Counter)', icon: 'bi-buildings' },
    { id: 'Student Activity Centre', name: 'Student Activity Centre (SAC Plaza)', icon: 'bi-trophy' },
  ];

  const [pickupLocation, setPickupLocation] = useState('Library');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Pickup');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showStripeModal, setShowStripeModal] = useState(false);

  if (items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning rounded-4 max-w-lg mx-auto p-4">
          <i className="bi bi-cart-x fs-2 mb-2 d-block"></i>
          <h4>Your Cart is Empty</h4>
          <p className="text-muted">Please add food items to your cart before proceeding to checkout.</p>
          <Link to="/menu" className="btn btn-warning rounded-pill px-4 fw-bold text-dark">
            View Menu
          </Link>
        </div>
      </div>
    );
  }

  // Handle Order Placement
  const handlePlaceOrder = async (overridePaymentMethod = null, stripeIntentId = null) => {
    const finalPaymentMethod = overridePaymentMethod || paymentMethod;

    // If user selected Stripe and hasn't gone through Stripe Modal yet, pop the modal
    if (finalPaymentMethod === 'Stripe / Online Card' && !stripeIntentId) {
      setShowStripeModal(true);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const orderPayload = {
        userId: user?.id || 1,
        pickupLocation,
        paymentMethod: finalPaymentMethod,
        stripePaymentIntentId: stripeIntentId || null,
        specialInstructions,
      };

      const response = await api.post('/orders', orderPayload);
      const placedOrder = response.data;

      // Clear local cart
      await clearCart();

      // Trigger instant push notification
      addNotification(
        `Order #${placedOrder.id} placed successfully! Pickup at ${pickupLocation}.`,
        'success',
        'Order Confirmed'
      );

      // Navigate to order-success page with order data
      navigate(`/order-success/${placedOrder.id}`, { state: { order: placedOrder } });
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
      addNotification(err.message, 'danger', 'Order Failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStripeSuccess = (paymentDetails) => {
    setShowStripeModal(false);
    handlePlaceOrder('Stripe Card (Paid Online)', paymentDetails.paymentIntentId);
  };

  return (
    <div className="checkout-page py-5">
      <div className="container">
        {/* Title */}
        <div className="mb-4">
          <h1 className="fw-bold text-dark mb-1">Campus Checkout</h1>
          <p className="text-muted mb-0">Select your preferred campus pickup location and payment method.</p>
        </div>

        {error && (
          <div className="alert alert-danger rounded-4 mb-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
          </div>
        )}

        <div className="row g-5">
          {/* Left Column: Pickup Spot & Payment Options */}
          <div className="col-lg-7">
            {/* 1. Student Identity Confirmation */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
              <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <span className="badge bg-primary rounded-circle" style={{ width: 28, height: 28, lineHeight: '18px' }}>1</span>
                Student Profile
              </h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small text-muted mb-1">Student Name</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={user?.name || 'Rahul Sharma'}
                    readOnly
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small text-muted mb-1">Student Email</label>
                  <input
                    type="email"
                    className="form-control bg-light"
                    value={user?.email || 'student@campus.edu'}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* 2. Campus Pickup Location */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
              <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <span className="badge bg-primary rounded-circle" style={{ width: 28, height: 28, lineHeight: '18px' }}>2</span>
                Select Campus Pickup Location
              </h5>
              <p className="text-muted small mb-3">
                Your order will be dispatched to the designated collection locker or counter at this spot:
              </p>

              <div className="d-flex flex-column gap-2">
                {locations.map((loc) => (
                  <label
                    key={loc.id}
                    className={`card border p-3 rounded-4 cursor-pointer transition-all ${
                      pickupLocation === loc.id
                        ? 'border-primary bg-primary-subtle shadow-sm'
                        : 'border-light-subtle bg-white hover-bg-light'
                    }`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-3">
                        <input
                          type="radio"
                          name="pickupLocation"
                          value={loc.id}
                          checked={pickupLocation === loc.id}
                          onChange={(e) => setPickupLocation(e.target.value)}
                          className="form-check-input mt-0 fs-5"
                        />
                        <div>
                          <span className="fw-bold text-dark d-block">
                            <i className={`bi ${loc.icon} me-2 text-primary`}></i>
                            {loc.id}
                          </span>
                          <small className="text-muted">{loc.name}</small>
                        </div>
                      </div>
                      <span className="badge bg-white text-dark border small">10-15 Min</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 3. Payment Option */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
              <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <span className="badge bg-primary rounded-circle" style={{ width: 28, height: 28, lineHeight: '18px' }}>3</span>
                Payment Method
              </h5>

              <div className="d-flex flex-column gap-3">
                {/* Cash on Pickup */}
                <label
                  className={`card border p-3 rounded-4 cursor-pointer ${
                    paymentMethod === 'Cash on Pickup'
                      ? 'border-warning bg-warning-subtle shadow-sm'
                      : 'border-light-subtle bg-white'
                  }`}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Cash on Pickup"
                        checked={paymentMethod === 'Cash on Pickup'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="form-check-input mt-0 fs-5"
                      />
                      <div>
                        <span className="fw-bold text-dark d-block">
                          <i className="bi bi-cash-coin me-2 text-success"></i> Cash on Pickup
                        </span>
                        <small className="text-muted">Pay with cash or UPI QR directly at the counter upon food handover.</small>
                      </div>
                    </div>
                    <span className="badge bg-success">Recommended</span>
                  </div>
                </label>

                {/* Demo Payment */}
                <label
                  className={`card border p-3 rounded-4 cursor-pointer ${
                    paymentMethod === 'Demo Payment'
                      ? 'border-warning bg-warning-subtle shadow-sm'
                      : 'border-light-subtle bg-white'
                  }`}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Demo Payment"
                      checked={paymentMethod === 'Demo Payment'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="form-check-input mt-0 fs-5"
                    />
                    <div>
                      <span className="fw-bold text-dark d-block">
                        <i className="bi bi-wallet2 me-2 text-primary"></i> Demo Student Credit / Campus Card
                      </span>
                      <small className="text-muted">Instant mock approval for development challenge evaluation.</small>
                    </div>
                  </div>
                </label>

                {/* Stripe / Online Card */}
                <label
                  className={`card border p-3 rounded-4 cursor-pointer ${
                    paymentMethod === 'Stripe / Online Card'
                      ? 'border-warning bg-warning-subtle shadow-sm'
                      : 'border-light-subtle bg-white'
                  }`}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Stripe / Online Card"
                        checked={paymentMethod === 'Stripe / Online Card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="form-check-input mt-0 fs-5"
                      />
                      <div>
                        <span className="fw-bold text-dark d-block">
                          <i className="bi bi-credit-card-2-front me-2 text-purple" style={{ color: '#635BFF' }}></i> Stripe Online Card Processing
                        </span>
                        <small className="text-muted">Interactive test card modal with instant validation & payment confirmation.</small>
                      </div>
                    </div>
                    <span className="badge text-white" style={{ backgroundColor: '#635BFF' }}>Stripe</span>
                  </div>
                </label>
              </div>

              {/* Special Instructions Note */}
              <div className="mt-4">
                <label className="form-label small fw-semibold text-secondary">
                  Special Pickup Notes / Cutlery Requests (Optional)
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Less spicy, extra tissues, call me when ready..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Order Confirmation Summary */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-top" style={{ top: '90px' }}>
              <h5 className="fw-bold text-dark mb-3">Order Summary ({items.length} items)</h5>

              {/* Items List */}
              <div className="mb-3 max-h-60 overflow-y-auto pe-1">
                {items.map((item) => (
                  <div key={item.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <div>
                      <span className="fw-bold text-dark small">{item.quantity}x {item.name}</span>
                      <small className="text-muted d-block">{item.restaurantName || 'Campus Canteen'}</small>
                    </div>
                    <span className="fw-semibold text-dark small">
                      ₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Calculation */}
              <div className="d-flex justify-content-between text-secondary mb-2 small">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between text-secondary mb-2 small">
                <span>Campus Pickup Convenience Fee</span>
                <span className="text-success fw-bold">FREE (₹0.00)</span>
              </div>
              <div className="d-flex justify-content-between text-secondary mb-3 small">
                <span>Target Pickup Location</span>
                <span className="text-dark fw-bold">{pickupLocation}</span>
              </div>

              <hr className="my-3" />

              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="fs-5 fw-bold text-dark">Total Amount</span>
                <span className="fs-3 fw-bold text-dark">₹{grandTotal.toFixed(2)}</span>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handlePlaceOrder()}
                disabled={submitting}
                className="btn btn-warning btn-lg w-100 rounded-pill fw-bold text-dark shadow d-flex align-items-center justify-content-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span>Placing Order in MySQL...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-check2-circle fs-5"></i>
                    <span>Place Order (₹{grandTotal.toFixed(2)})</span>
                  </>
                )}
              </button>

              <div className="mt-3 text-center">
                <small className="text-muted">
                  <i className="bi bi-lock-fill text-success me-1"></i>
                  By placing order, stock is automatically reserved in the campus canteen database.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stripe Payment Simulation Modal */}
      <StripeModal
        isOpen={showStripeModal}
        onClose={() => setShowStripeModal(false)}
        amount={grandTotal}
        onSuccess={handleStripeSuccess}
      />
    </div>
  );
}
