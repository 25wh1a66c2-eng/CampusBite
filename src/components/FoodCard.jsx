import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';

export default function FoodCard({ product }) {
  const { addToCart } = useCart();
  const { addNotification } = useNotification();
  const [adding, setAdding] = useState(false);

  const isAvailable = product.available && product.stock > 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAvailable || adding) return;

    try {
      setAdding(true);
      await addToCart(product, 1);
      addNotification(`Added 1x ${product.name} to cart!`, 'success', 'Item Added');
    } catch (err) {
      addNotification(err.message, 'danger', 'Cart Error');
    } finally {
      setTimeout(() => setAdding(false), 400);
    }
  };

  const getFoodTypeBadge = (type) => {
    const t = (type || '').toLowerCase();
    if (t === 'vegan') {
      return (
        <span className="badge bg-success d-inline-flex align-items-center gap-1">
          <i className="bi bi-flower1"></i> Vegan
        </span>
      );
    } else if (t === 'vegetarian' || t === 'veg') {
      return (
        <span className="badge bg-success-subtle text-success border border-success d-inline-flex align-items-center gap-1">
          <span className="rounded-circle bg-success d-inline-block" style={{ width: 8, height: 8 }}></span>
          Veg
        </span>
      );
    } else {
      return (
        <span className="badge bg-danger-subtle text-danger border border-danger d-inline-flex align-items-center gap-1">
          <span className="rounded-circle bg-danger d-inline-block" style={{ width: 8, height: 8 }}></span>
          Non-Veg
        </span>
      );
    }
  };

  return (
    <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden product-card transition-all" style={{ backgroundColor: '#ffffff' }}>
      {/* Image with Category & Food Type Badges */}
      <div className="position-relative overflow-hidden" style={{ height: '190px' }}>
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className="card-img-top w-100 h-100 object-fit-cover transition-transform"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
          }}
        />
        {/* Badges on top of image */}
        <div className="position-absolute top-0 start-0 p-2 d-flex flex-column gap-1">
          <span className="badge bg-dark bg-opacity-75 backdrop-blur text-white">
            {product.category}
          </span>
        </div>
        <div className="position-absolute top-0 end-0 p-2">
          {getFoodTypeBadge(product.foodType)}
        </div>

        {/* Canteen label overlay */}
        <div className="position-absolute bottom-0 start-0 w-100 p-2 bg-gradient-to-t" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.75))' }}>
          <small className="text-white fw-medium d-flex align-items-center gap-1">
            <i className="bi bi-shop text-warning"></i> {product.restaurantName}
          </small>
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body d-flex flex-column p-3">
        <h5 className="card-title fw-bold text-dark mb-1 text-truncate" title={product.name}>
          {product.name}
        </h5>

        <p className="card-text text-muted small flex-grow-1 line-clamp-2 mb-3" style={{ minHeight: '2.5rem' }}>
          {product.description || 'Freshly prepared campus delicacy made with quality ingredients.'}
        </p>

        {/* Price & Stock info */}
        <div className="d-flex justify-content-between align-items-center mb-3 pt-2 border-top">
          <div>
            <span className="fs-5 fw-bold text-dark">₹{Number(product.price).toFixed(2)}</span>
          </div>
          <div>
            {isAvailable ? (
              <span className="badge bg-success-subtle text-success small">
                <i className="bi bi-check-circle me-1"></i>
                {product.stock} in stock
              </span>
            ) : (
              <span className="badge bg-danger-subtle text-danger small">
                <i className="bi bi-x-circle me-1"></i> Sold Out
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex gap-2">
          <Link
            to={`/product/${product.id}`}
            className="btn btn-outline-secondary btn-sm flex-fill rounded-pill d-flex align-items-center justify-content-center gap-1"
          >
            <i className="bi bi-eye"></i> Details
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={!isAvailable || adding}
            className={`btn btn-sm flex-fill rounded-pill d-flex align-items-center justify-content-center gap-1 fw-semibold ${
              isAvailable ? 'btn-warning text-dark' : 'btn-secondary disabled'
            }`}
          >
            {adding ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Adding...</span>
              </>
            ) : (
              <>
                <i className="bi bi-bag-plus"></i> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
