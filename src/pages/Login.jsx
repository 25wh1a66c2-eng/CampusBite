import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      await login(email, password);
      addNotification('Logged in successfully! Welcome to CampusBite.', 'success', 'Login Successful');
      navigate('/menu');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
  };

  return (
    <div className="login-page py-5 bg-light" style={{ minHeight: '80vh' }}>
      <div className="container">
        <div className="max-w-md mx-auto">
          {/* Card */}
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
            <div className="text-center mb-4">
              <div className="bg-warning text-dark d-inline-flex align-items-center justify-content-center rounded-3 p-2 mb-2">
                <i className="bi bi-egg-fried fs-2"></i>
              </div>
              <h2 className="fw-bold text-dark">Student Login</h2>
              <p className="text-muted small">Sign in to order food, track campus pickups and view meal history.</p>
            </div>

            {error && (
              <div className="alert alert-danger rounded-3 py-2 small" role="alert">
                <i className="bi bi-exclamation-circle me-1"></i> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Campus Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted"><i className="bi bi-envelope"></i></span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="student@campus.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-secondary">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted"><i className="bi bi-lock"></i></span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-warning btn-lg w-100 rounded-pill fw-bold text-dark mb-3 shadow-sm"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Authenticating...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Quick Demo Fill Buttons */}
            <div className="p-3 bg-light rounded-3 text-center mb-3">
              <small className="text-muted d-block mb-2 fw-semibold">Quick Demo 1-Click Fill:</small>
              <div className="d-flex justify-content-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('student@campus.edu', 'password123')}
                  className="btn btn-outline-primary btn-sm rounded-pill"
                >
                  Student (Rahul)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('canteen@campus.edu', 'password123')}
                  className="btn btn-outline-secondary btn-sm rounded-pill"
                >
                  Canteen Staff
                </button>
              </div>
            </div>

            <div className="text-center small text-muted">
              Don't have a campus account?{' '}
              <Link to="/register" className="text-primary fw-bold text-decoration-none">
                Register here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
