import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import foodService from '../services/foodService';

export default function AddProduct() {
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Breakfast',
    foodType: 'Vegetarian',
    imageUrl: '',
    restaurantName: 'South Canteen',
    stock: 20,
    available: true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
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

  const foodTypes = ['Vegetarian', 'Non-Vegetarian', 'Vegan'];

  const canteens = [
    'South Canteen',
    'Campus Food Court',
    'Biryani Hub',
    'Burger Street',
    'Bistro 101',
    'Fast Bites',
    'Central Canteen',
    'Campus Brews',
    'Juice Junction',
    'Sweet Treats Bakery',
    'Night Cafe',
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleQuickImage = (url) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Food Name is required.');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError('Price must be greater than ₹0.');
      return;
    }
    if (formData.stock === '' || Number(formData.stock) < 0) {
      setError('Stock quantity cannot be negative.');
      return;
    }
    if (!formData.restaurantName.trim()) {
      setError('Restaurant or Canteen Name is required.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        foodType: formData.foodType,
        imageUrl: formData.imageUrl.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        restaurantName: formData.restaurantName.trim(),
        stock: parseInt(formData.stock, 10),
        available: formData.available,
      };

      const created = await foodService.addProduct(payload);

      addNotification(`"${created.name}" added to menu successfully!`, 'success', 'Food Item Added');
      navigate('/menu');
    } catch (err) {
      setError(err.message || 'Failed to save food item. Please check backend.');
      addNotification(err.message, 'danger', 'Submission Error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-product-page py-5">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-4">
            <span className="badge bg-warning text-dark px-3 py-1 rounded-pill fw-bold mb-2">
              <i className="bi bi-shop me-1"></i> Canteen Seller Portal
            </span>
            <h1 className="fw-bold text-dark mb-1">Add or Sell Food Item</h1>
            <p className="text-muted">
              Publish dishes directly to the CampusBite student catalogue with live stock count and price in INR.
            </p>
          </div>

          {error && (
            <div className="alert alert-danger rounded-4 mb-4" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
            </div>
          )}

          {/* Form Card */}
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {/* Food Name */}
                <div className="col-12">
                  <label className="form-label fw-semibold text-dark">
                    Food Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-control form-control-lg"
                    placeholder="e.g. Masala Dosa, Paneer Roll, Cold Coffee"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Description */}
                <div className="col-12">
                  <label className="form-label fw-semibold text-dark">Description</label>
                  <textarea
                    name="description"
                    rows="3"
                    className="form-control"
                    placeholder="Describe ingredients, cooking style, portion size, dips included..."
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>

                {/* Price & Stock */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark">
                    Price (in ₹ INR) <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text fw-bold">₹</span>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      name="price"
                      className="form-control"
                      placeholder="e.g. 70.00"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark">
                    Initial Stock Portions <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="stock"
                    className="form-control"
                    placeholder="e.g. 25"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Category & Food Type */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark">
                    Category <span className="text-danger">*</span>
                  </label>
                  <select
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark">
                    Dietary Classification <span className="text-danger">*</span>
                  </label>
                  <select
                    name="foodType"
                    className="form-select"
                    value={formData.foodType}
                    onChange={handleChange}
                  >
                    {foodTypes.map((ft) => (
                      <option key={ft} value={ft}>
                        {ft}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Restaurant / Canteen Name */}
                <div className="col-12">
                  <label className="form-label fw-semibold text-dark">
                    Restaurant or Canteen Name <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-shop"></i></span>
                    <input
                      type="text"
                      list="canteens-list"
                      name="restaurantName"
                      className="form-control"
                      placeholder="Select or enter canteen name..."
                      value={formData.restaurantName}
                      onChange={handleChange}
                      required
                    />
                    <datalist id="canteens-list">
                      {canteens.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>
                </div>

                {/* Image URL */}
                <div className="col-12">
                  <label className="form-label fw-semibold text-dark">Food Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    className="form-control"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.imageUrl}
                    onChange={handleChange}
                  />
                  <small className="text-muted d-block mt-1">
                    Or pick a fast demo placeholder image:
                  </small>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm rounded-pill"
                      onClick={() => handleQuickImage('https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80')}
                    >
                      Dosa Photo
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm rounded-pill"
                      onClick={() => handleQuickImage('https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80')}
                    >
                      Biryani Photo
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm rounded-pill"
                      onClick={() => handleQuickImage('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80')}
                    >
                      Burger Photo
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm rounded-pill"
                      onClick={() => handleQuickImage('https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80')}
                    >
                      Coffee Photo
                    </button>
                  </div>
                </div>

                {/* Available Toggle */}
                <div className="col-12">
                  <div className="form-check form-switch pt-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="availableSwitch"
                      name="available"
                      checked={formData.available}
                      onChange={handleChange}
                    />
                    <label className="form-check-label fw-medium text-dark" htmlFor="availableSwitch">
                      Available for Immediate Student Orders
                    </label>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="col-12 pt-3 border-top mt-4">
                  <div className="d-flex gap-3">
                    <button
                      type="button"
                      onClick={() => navigate('/menu')}
                      className="btn btn-outline-secondary btn-lg rounded-pill px-4 flex-fill"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn btn-warning btn-lg rounded-pill fw-bold text-dark px-4 flex-fill shadow-sm"
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Saving Dish...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i> Save & Publish Food Item
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
