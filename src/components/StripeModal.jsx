import React, { useState } from 'react';
import api from '../services/api';

export default function StripeModal({ isOpen, onClose, amount, onSuccess }) {
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('888');
  const [cardHolder, setCardHolder] = useState('Rahul Sharma');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handlePay = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    try {
      // Call simulated Stripe PaymentIntent endpoint
      const response = await api.post('/payment/stripe-intent', {
        amount,
        currency: 'inr',
      });

      // Simulate payment network roundtrip
      setTimeout(() => {
        setProcessing(false);
        onSuccess({
          paymentMethod: 'Stripe Card (Online)',
          paymentIntentId: response.data.clientSecret,
        });
      }, 1200);
    } catch (err) {
      setProcessing(false);
      setError('Payment processing failed. Please try again or use Cash on Pickup.');
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 1080 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
          {/* Header */}
          <div className="modal-header text-white p-3" style={{ backgroundColor: '#635BFF' }}>
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-stripe fs-3"></i>
              <div>
                <h6 className="modal-title fw-bold mb-0">Stripe Secure Checkout</h6>
                <small className="opacity-75">Encrypted 256-bit SSL Payment</small>
              </div>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              disabled={processing}
            ></button>
          </div>

          {/* Form */}
          <form onSubmit={handlePay}>
            <div className="modal-body p-4 bg-light">
              <div className="d-flex justify-content-between align-items-center mb-3 bg-white p-3 rounded-3 border">
                <span className="text-muted">Total Payable:</span>
                <span className="fs-4 fw-bold text-dark">₹{Number(amount).toFixed(2)}</span>
              </div>

              {error && (
                <div className="alert alert-danger py-2 small" role="alert">
                  <i className="bi bi-exclamation-circle me-1"></i> {error}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Cardholder Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Card Number</label>
                <div className="input-group">
                  <span className="input-group-text bg-white text-primary">
                    <i className="bi bi-credit-card-2-front"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control font-monospace"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    required
                  />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold text-secondary">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    className="form-control font-monospace"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="12/28"
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold text-secondary">CVC / CVV</label>
                  <input
                    type="password"
                    maxLength="4"
                    className="form-control font-monospace"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="123"
                    required
                  />
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-between p-2 rounded bg-white border small text-muted">
                <div className="d-flex align-items-center gap-1">
                  <i className="bi bi-shield-check text-success fs-5"></i>
                  <span>Demo Stripe Test Mode</span>
                </div>
                <span className="badge bg-secondary">Test Card Ready</span>
              </div>
            </div>

            <div className="modal-footer bg-white border-0 px-4 pb-4 pt-0">
              <button
                type="button"
                className="btn btn-outline-secondary rounded-pill px-4"
                onClick={onClose}
                disabled={processing}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn text-white rounded-pill px-4 fw-semibold d-flex align-items-center gap-2"
                style={{ backgroundColor: '#635BFF' }}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span>Authorizing...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-lock-fill"></i> Pay ₹{Number(amount).toFixed(2)}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
