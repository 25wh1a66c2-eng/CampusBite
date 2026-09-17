import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';

export default function MyOrders() {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [advancingId, setAdvancingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = user?.id || 1;
      const res = await api.get(`/orders?userId=${userId}`);
      setOrders(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // 10s live sync
    return () => clearInterval(interval);
  }, [user]);

  // Demo helper: manually advance status to show live tracking in challenge
  const handleAdvanceStatus = async (order) => {
    const nextMap = {
      PLACED: 'PREPARING',
      PREPARING: 'READY_FOR_PICKUP',
      READY_FOR_PICKUP: 'COMPLETED',
      COMPLETED: 'PLACED',
    };
    const nextStatus = nextMap[order.orderStatus] || 'PLACED';

    try {
      setAdvancingId(order.id);
      await api.patch(`/orders/${order.id}/status`, { status: nextStatus });
      addNotification(`Order #${order.id} status updated to ${nextStatus}`, 'info', 'Status Updated');
      await fetchOrders();
    } catch (err) {
      addNotification(err.message, 'danger', 'Error updating status');
    } finally {
      setAdvancingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PLACED':
        return <span className="badge bg-secondary px-3 py-2 rounded-pill"><i className="bi bi-clock me-1"></i> Placed</span>;
      case 'PREPARING':
        return <span className="badge bg-warning text-dark px-3 py-2 rounded-pill"><i className="bi bi-fire me-1"></i> Preparing in Kitchen</span>;
      case 'READY_FOR_PICKUP':
        return <span className="badge bg-success px-3 py-2 rounded-pill"><i className="bi bi-bag-check-fill me-1"></i> Ready For Pickup!</span>;
      case 'COMPLETED':
        return <span className="badge bg-primary px-3 py-2 rounded-pill"><i className="bi bi-check2-all me-1"></i> Completed</span>;
      default:
        return <span className="badge bg-secondary px-3 py-2 rounded-pill">{status}</span>;
    }
  };

  return (
    <div className="my-orders-page py-5">
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h1 className="fw-bold text-dark mb-1">My Campus Orders</h1>
            <p className="text-muted mb-0">Track active orders, pickup progress, and review historic canteen meals.</p>
          </div>
          <div className="d-flex gap-2">
            <button onClick={fetchOrders} className="btn btn-outline-dark btn-sm rounded-pill px-3 d-flex align-items-center gap-1">
              <i className="bi bi-arrow-clockwise"></i> Refresh Status
            </button>
            <Link to="/menu" className="btn btn-warning btn-sm rounded-pill px-3 fw-semibold text-dark">
              <i className="bi bi-cart-plus me-1"></i> New Order
            </Link>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger rounded-4 mb-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
          </div>
        )}

        {loading && orders.length === 0 ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading orders...</span>
            </div>
            <p className="text-muted mt-2">Loading campus orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
            <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: 80, height: 80 }}>
              <i className="bi bi-receipt fs-1 text-muted"></i>
            </div>
            <h4 className="fw-bold text-dark">No Orders Placed Yet</h4>
            <p className="text-muted max-w-md mx-auto mb-4">
              You have not placed any food orders today. Head to the menu to grab freshly cooked campus delicacies!
            </p>
            <Link to="/menu" className="btn btn-warning rounded-pill px-4 fw-bold text-dark">
              Order Food Now
            </Link>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {orders.map((order) => (
              <div key={order.id} className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                {/* Order Card Top Bar */}
                <div className="card-header bg-light border-0 py-3 px-4 d-flex flex-wrap justify-content-between align-items-center gap-2">
                  <div className="d-flex align-items-center gap-3">
                    <span className="fw-bold text-dark fs-5">Order #{order.id}</span>
                    <span className="text-muted small">
                      <i className="bi bi-calendar3 me-1"></i>
                      {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div>
                    {getStatusBadge(order.orderStatus)}
                  </div>
                </div>

                {/* Card Content */}
                <div className="card-body p-4">
                  <div className="row g-4">
                    {/* Left: Items list */}
                    <div className="col-lg-7">
                      <h6 className="fw-bold text-secondary mb-3 small text-uppercase">Items in this Order</h6>
                      <div className="d-flex flex-column gap-2 mb-3">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, idx) => (
                            <div key={idx} className="d-flex justify-content-between align-items-center p-2 rounded-3 bg-light">
                              <span className="fw-medium text-dark small">
                                <span className="badge bg-dark text-warning rounded-circle me-2" style={{ width: 22, height: 22, lineHeight: '14px' }}>
                                  {item.quantity}
                                </span>
                                {item.productName}
                              </span>
                              <span className="fw-bold text-dark small">₹{Number(item.subtotal).toFixed(2)}</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-muted small">Items details stored in database.</div>
                        )}
                      </div>

                      {/* EcoScore badge */}
                      {order.ecoMessage && (
                        <div className="p-2 px-3 bg-success-subtle border border-success-subtle rounded-3 small text-success-emphasis d-flex align-items-center gap-2">
                          <span>🌱</span>
                          <span>{order.ecoMessage}</span>
                        </div>
                      )}
                    </div>

                    {/* Right: Summary details */}
                    <div className="col-lg-5 border-start-lg ps-lg-4">
                      <h6 className="fw-bold text-secondary mb-3 small text-uppercase">Pickup & Payment</h6>
                      <div className="d-flex flex-column gap-2 small">
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Pickup Location:</span>
                          <strong className="text-dark"><i className="bi bi-geo-alt-fill text-danger me-1"></i>{order.pickupLocation}</strong>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Payment Option:</span>
                          <span className="text-dark fw-medium">{order.paymentMethod}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Estimated Prep:</span>
                          <span className="text-primary fw-medium">{order.estimatedTime || '10-15 mins'}</span>
                        </div>
                        <hr className="my-2" />
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fs-6 fw-bold text-dark">Total Amount:</span>
                          <span className="fs-5 fw-bold text-dark">₹{Number(order.totalAmount).toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Quick demo tool to advance status */}
                      <div className="mt-3 pt-3 border-top">
                        <div className="d-flex align-items-center justify-content-between">
                          <small className="text-muted">Live Demo Tracker Control:</small>
                          <button
                            onClick={() => handleAdvanceStatus(order)}
                            disabled={advancingId === order.id}
                            className="btn btn-outline-primary btn-sm rounded-pill px-3"
                          >
                            {advancingId === order.id ? (
                              <span className="spinner-border spinner-border-sm" role="status"></span>
                            ) : (
                              <>Next Status <i className="bi bi-chevron-right"></i></>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
