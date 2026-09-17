import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import api from '../services/api';

export default function OrderSuccess() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    async function fetchOrder() {
      if (!order && id) {
        try {
          setLoading(true);
          const res = await api.get(`/orders/${id}`);
          setOrder(res.data);
        } catch (err) {
          console.error('Error loading order:', err);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchOrder();
  }, [id, order]);

  // Periodic status poll so live demo shows status progressing
  useEffect(() => {
    if (!order) return;
    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/orders/${order.id}`);
        setOrder(res.data);
      } catch (err) {
        // silent fail
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [order?.id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading order details...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning rounded-4 max-w-md mx-auto p-4">
          <h4>Order Not Found</h4>
          <p className="text-muted">Could not retrieve the details for order #{id}.</p>
          <Link to="/my-orders" className="btn btn-warning rounded-pill px-4">
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  const getStepClass = (stepName) => {
    const currentStatus = order.orderStatus;
    const sequence = ['PLACED', 'PREPARING', 'READY_FOR_PICKUP', 'COMPLETED'];
    const currentIndex = sequence.indexOf(currentStatus);
    const stepIndex = sequence.indexOf(stepName);

    if (currentIndex >= stepIndex) {
      return 'bg-success text-white border-success';
    }
    return 'bg-light text-muted border-secondary-subtle';
  };

  return (
    <div className="order-success-page py-5">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          {/* Main Card */}
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white p-4 p-md-5">
            {/* Top Success Badge */}
            <div className="text-center mb-4">
              <div
                className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center mb-3 shadow"
                style={{ width: 80, height: 80 }}
              >
                <i className="bi bi-check-lg fs-1"></i>
              </div>
              <h2 className="fw-bold text-dark">Order Confirmed!</h2>
              <p className="text-muted">
                Your order has been saved in the campus kitchen database and stock has been deducted.
              </p>
              <div className="badge bg-light text-dark border px-3 py-2 fs-6 rounded-pill">
                Order ID: <strong className="text-primary">#{order.id}</strong>
              </div>
            </div>

            {/* Live Progress Bar */}
            <div className="card bg-light border-0 rounded-4 p-4 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-bold text-dark">
                  <i className="bi bi-activity text-primary me-2"></i>
                  Live Order Tracker
                </span>
                <span className="badge bg-primary rounded-pill px-3 py-1">
                  Status: {order.orderStatus}
                </span>
              </div>

              {/* Steps Graphic */}
              <div className="d-flex justify-content-between position-relative py-2">
                <div className="text-center" style={{ width: '25%' }}>
                  <div className={`rounded-circle mx-auto d-flex align-items-center justify-content-center border ${getStepClass('PLACED')}`} style={{ width: 36, height: 36 }}>
                    <i className="bi bi-receipt"></i>
                  </div>
                  <small className="d-block mt-2 fw-semibold">Placed</small>
                </div>

                <div className="text-center" style={{ width: '25%' }}>
                  <div className={`rounded-circle mx-auto d-flex align-items-center justify-content-center border ${getStepClass('PREPARING')}`} style={{ width: 36, height: 36 }}>
                    <i className="bi bi-fire"></i>
                  </div>
                  <small className="d-block mt-2 fw-semibold">Preparing</small>
                </div>

                <div className="text-center" style={{ width: '25%' }}>
                  <div className={`rounded-circle mx-auto d-flex align-items-center justify-content-center border ${getStepClass('READY_FOR_PICKUP')}`} style={{ width: 36, height: 36 }}>
                    <i className="bi bi-bag-check"></i>
                  </div>
                  <small className="d-block mt-2 fw-semibold">Ready</small>
                </div>

                <div className="text-center" style={{ width: '25%' }}>
                  <div className={`rounded-circle mx-auto d-flex align-items-center justify-content-center border ${getStepClass('COMPLETED')}`} style={{ width: 36, height: 36 }}>
                    <i className="bi bi-check2-all"></i>
                  </div>
                  <small className="d-block mt-2 fw-semibold">Completed</small>
                </div>
              </div>

              <div className="text-center mt-3 pt-2 border-top text-muted small">
                <i className="bi bi-clock-history me-1 text-warning"></i>
                Estimated Preparation Time: <strong className="text-dark">{order.estimatedTime || '12-18 mins'}</strong>
              </div>
            </div>

            {/* Sustainability EcoScore Notice */}
            {order.ecoMessage && (
              <div className="alert alert-success border-success-subtle rounded-4 p-3 mb-4 d-flex align-items-center gap-3">
                <span className="fs-3">🌱</span>
                <div>
                  <h6 className="fw-bold text-success-emphasis mb-1">CampusBite EcoScore Achievement</h6>
                  <p className="mb-0 small text-success-emphasis">{order.ecoMessage}</p>
                </div>
              </div>
            )}

            {/* Order Specification Summary */}
            <div className="border rounded-4 p-4 mb-4 bg-white">
              <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">Order Particulars</h6>
              <div className="row g-3">
                <div className="col-sm-6">
                  <small className="text-muted d-block">Pickup Destination</small>
                  <strong className="text-dark d-flex align-items-center gap-1">
                    <i className="bi bi-geo-alt-fill text-danger"></i> {order.pickupLocation}
                  </strong>
                </div>
                <div className="col-sm-6">
                  <small className="text-muted d-block">Payment Method</small>
                  <strong className="text-dark d-flex align-items-center gap-1">
                    <i className="bi bi-credit-card text-success"></i> {order.paymentMethod}
                  </strong>
                </div>
                <div className="col-sm-6">
                  <small className="text-muted d-block">Total Paid / Payable</small>
                  <strong className="fs-5 text-dark">₹{Number(order.totalAmount).toFixed(2)}</strong>
                </div>
                <div className="col-sm-6">
                  <small className="text-muted d-block">Order Timestamp</small>
                  <span className="text-dark">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {/* Items List */}
              {order.items && order.items.length > 0 && (
                <div className="mt-4 pt-3 border-top">
                  <small className="text-muted d-block mb-2">Prepared Dishes:</small>
                  <div className="d-flex flex-column gap-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="d-flex justify-content-between small">
                        <span>{item.quantity}x {item.productName}</span>
                        <span className="fw-semibold">₹{Number(item.subtotal).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Actions */}
            <div className="d-flex flex-column flex-sm-row gap-3">
              <Link to="/my-orders" className="btn btn-primary btn-lg rounded-pill fw-bold flex-fill d-flex align-items-center justify-content-center gap-2">
                <i className="bi bi-receipt"></i> View in My Orders
              </Link>
              <Link to="/menu" className="btn btn-outline-secondary btn-lg rounded-pill fw-semibold flex-fill d-flex align-items-center justify-content-center gap-2">
                <i className="bi bi-arrow-left"></i> Order More Food
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
