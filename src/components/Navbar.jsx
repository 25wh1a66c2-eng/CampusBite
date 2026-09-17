import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // State to control the Three Lines (Hamburger) Navigation Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close drawer & dropdown whenever the user changes routes
  useEffect(() => {
    setIsDrawerOpen(false);
    setIsUserDropdownOpen(false);
  }, [location.pathname]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsDrawerOpen(false);
        setIsUserDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDrawerOpen(false);
    setIsUserDropdownOpen(false);
    navigate('/login');
  };

  const navTabs = [
    {
      id: 'drawer-tab-home',
      path: '/',
      name: 'Home',
      icon: 'bi-house-door-fill',
      description: 'Campus food hub & recommendations',
      badge: null,
    },
    {
      id: 'drawer-tab-menu',
      path: '/menu',
      name: 'Menu',
      icon: 'bi-grid-3x3-gap-fill',
      description: 'Browse all dishes, snacks & drinks',
      badge: 'Live Stock',
    },
    {
      id: 'drawer-tab-add-or-sell',
      path: '/add-food',
      name: 'Add or Sell',
      icon: 'bi-plus-circle-fill',
      description: 'Canteen seller portal to publish items',
      badge: 'Seller Hub',
    },
    {
      id: 'drawer-tab-my-orders',
      path: '/my-orders',
      name: 'My Orders',
      icon: 'bi-receipt-cutoff',
      description: 'Track your live orders & pickup status',
      badge: 'Live Status',
    },
    {
      id: 'drawer-tab-architecture',
      path: '/backend-guide',
      name: 'Architecture',
      icon: 'bi-cpu-fill',
      description: 'Spring Boot 3 + MySQL system specs',
      badge: 'Java 17',
    },
  ];

  return (
    <>
      {/* ========================================================
          1. TOP MAIN NAVIGATION BAR
          ======================================================== */}
      <nav 
        id="top-main-navbar"
        className="navbar sticky-top shadow-sm py-2" 
        style={{ backgroundColor: '#1a365d', zIndex: 1020 }}
      >
        <div className="container d-flex align-items-center justify-content-between">
          
          {/* LEFT: Three Lines Icon Button + Brand Logo */}
          <div className="d-flex align-items-center gap-3">
            
            {/* The Three Lines Icon Button (ALWAYS VISIBLE & PROMINENT) */}
            <button
              id="three-lines-menu-btn"
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="btn btn-warning text-dark fw-bold d-flex align-items-center gap-2 px-3 py-2 rounded-3 shadow-sm border-0 cursor-pointer"
              title="Click the three lines to view all tabs"
              aria-label="Toggle navigation tabs drawer"
              style={{ transition: 'transform 0.15s ease' }}
            >
              {/* Three Horizontal Lines Icon */}
              <span 
                className="d-flex flex-column justify-content-between" 
                style={{ width: 22, height: 16 }}
                aria-hidden="true"
              >
                <span className="bg-dark rounded-pill" style={{ height: 2.8, width: '100%' }}></span>
                <span className="bg-dark rounded-pill" style={{ height: 2.8, width: '100%' }}></span>
                <span className="bg-dark rounded-pill" style={{ height: 2.8, width: '100%' }}></span>
              </span>
              <span className="fw-extrabold small d-none d-sm-inline">Tabs Menu</span>
            </button>

            {/* Brand Logo & Name */}
            <Link 
              id="navbar-brand-logo"
              className="navbar-brand d-flex align-items-center gap-2 fw-bold text-white fs-4 m-0" 
              to="/"
              onClick={() => setIsDrawerOpen(false)}
            >
              <span className="bg-warning text-dark px-2 py-1 rounded-3 shadow-sm d-inline-flex align-items-center justify-content-center">
                <i className="bi bi-egg-fried"></i>
              </span>
              <span>Campus<span className="text-warning">Bite</span></span>
            </Link>
          </div>

          {/* CENTER: Desktop Top Tabs (For fast desktop tab switching) */}
          <div className="d-none d-lg-flex align-items-center gap-1">
            <NavLink 
              id="top-tab-home"
              className={({ isActive }) => `btn btn-sm rounded-pill px-3 py-1 fw-semibold d-flex align-items-center gap-1 ${isActive ? 'btn-warning text-dark shadow-sm' : 'text-light btn-outline-light border-0'}`} 
              to="/"
            >
              <i className="bi bi-house-door"></i>
              <span>Home</span>
            </NavLink>
            <NavLink 
              id="top-tab-menu"
              className={({ isActive }) => `btn btn-sm rounded-pill px-3 py-1 fw-semibold d-flex align-items-center gap-1 ${isActive ? 'btn-warning text-dark shadow-sm' : 'text-light btn-outline-light border-0'}`} 
              to="/menu"
            >
              <i className="bi bi-grid-3x3-gap"></i>
              <span>Menu</span>
            </NavLink>
            <NavLink 
              id="top-tab-add-or-sell"
              className={({ isActive }) => `btn btn-sm rounded-pill px-3 py-1 fw-semibold d-flex align-items-center gap-1 ${isActive ? 'btn-warning text-dark shadow-sm' : 'text-light btn-outline-light border-0'}`} 
              to="/add-food"
            >
              <i className="bi bi-plus-circle"></i>
              <span>Add or Sell</span>
            </NavLink>
            <NavLink 
              id="top-tab-my-orders"
              className={({ isActive }) => `btn btn-sm rounded-pill px-3 py-1 fw-semibold d-flex align-items-center gap-1 ${isActive ? 'btn-warning text-dark shadow-sm' : 'text-light btn-outline-light border-0'}`} 
              to="/my-orders"
            >
              <i className="bi bi-receipt"></i>
              <span>My Orders</span>
            </NavLink>
            <NavLink 
              id="top-tab-architecture"
              className={({ isActive }) => `btn btn-sm rounded-pill px-3 py-1 fw-semibold d-flex align-items-center gap-1 ${isActive ? 'btn-warning text-dark shadow-sm' : 'text-light btn-outline-light border-0'}`} 
              to="/backend-guide"
            >
              <i className="bi bi-diagram-3"></i>
              <span>Architecture</span>
            </NavLink>
          </div>

          {/* RIGHT: Cart & Authentication */}
          <div className="d-flex align-items-center gap-2">
            
            {/* Cart Button */}
            <Link 
              id="nav-cart-btn"
              to="/cart" 
              className="btn btn-outline-warning position-relative d-flex align-items-center gap-2 rounded-pill px-3 py-1 fw-semibold"
            >
              <i className="bi bi-cart3 fs-5"></i>
              <span className="d-none d-md-inline">Cart</span>
              {totalItems > 0 && (
                <span className="badge rounded-pill bg-danger border border-light">
                  {totalItems}
                  <span className="visually-hidden">items in cart</span>
                </span>
              )}
            </Link>

            {/* Auth Menu */}
            {isAuthenticated ? (
              <div className="dropdown position-relative" ref={dropdownRef}>
                <button
                  id="user-profile-dropdown-btn"
                  className={`btn btn-dark dropdown-toggle d-flex align-items-center gap-2 border-secondary rounded-pill px-3 py-1 ${isUserDropdownOpen ? 'show' : ''}`}
                  type="button"
                  onClick={() => setIsUserDropdownOpen(prev => !prev)}
                  aria-expanded={isUserDropdownOpen}
                >
                  <span className="rounded-circle bg-warning text-dark fw-bold d-inline-flex justify-content-center align-items-center" style={{ width: 26, height: 26, fontSize: '0.8rem' }}>
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </span>
                  <span className="text-white text-truncate d-none d-sm-inline" style={{ maxWidth: 110 }}>
                    {user?.name?.split(' ')[0] || 'Student'}
                  </span>
                </button>
                
                {/* Dropdown Menu */}
                <ul 
                  className={`dropdown-menu dropdown-menu-end shadow border-0 mt-2 ${isUserDropdownOpen ? 'show' : ''}`}
                  style={{
                    display: isUserDropdownOpen ? 'block' : 'none',
                    position: 'absolute',
                    zIndex: 1060
                  }}
                >
                  <li className="px-3 py-2 border-bottom">
                    <div className="fw-bold text-dark">{user?.name}</div>
                    <small className="text-muted">{user?.email}</small>
                  </li>
                  <li>
                    <Link 
                      id="dropdown-order-history-link"
                      className="dropdown-item py-2" 
                      to="/my-orders"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <i className="bi bi-clock-history me-2 text-primary"></i> My Orders
                    </Link>
                  </li>
                  <li>
                    <Link 
                      id="dropdown-seller-portal-link"
                      className="dropdown-item py-2" 
                      to="/add-food"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <i className="bi bi-shop me-2 text-success"></i> Add or Sell Food
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button 
                      id="dropdown-logout-btn"
                      className="dropdown-item text-danger py-2" 
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-1">
                <Link 
                  id="nav-login-btn"
                  to="/login" 
                  className="btn btn-outline-light rounded-pill px-3 py-1 btn-sm"
                >
                  Login
                </Link>
                <Link 
                  id="nav-register-btn"
                  to="/register" 
                  className="btn btn-warning rounded-pill px-3 py-1 text-dark fw-bold btn-sm d-none d-sm-inline-block"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

        </div>
      </nav>

      {/* ========================================================
          2. SLIDE-OUT TABS DRAWER (Triggered by Three Lines Icon)
          ======================================================== */}
      {isDrawerOpen && (
        <div 
          id="tabs-drawer-backdrop"
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75"
          style={{ zIndex: 1070, backdropFilter: 'blur(3px)', transition: 'opacity 0.2s ease' }}
          onClick={() => setIsDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        id="three-lines-tabs-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Tabs"
        className={`position-fixed top-0 start-0 h-100 bg-white shadow-lg d-flex flex-column ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          width: 'min(380px, 88vw)',
          zIndex: 1080,
          transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isDrawerOpen ? 'translateX(0)' : 'translateX(-100%)',
          visibility: isDrawerOpen ? 'visible' : 'hidden',
        }}
      >
        {/* Drawer Header */}
        <div className="p-3 text-white d-flex align-items-center justify-content-between" style={{ backgroundColor: '#1a365d' }}>
          <div className="d-flex align-items-center gap-2">
            <span className="bg-warning text-dark px-2 py-1 rounded-2 fw-bold d-inline-flex align-items-center justify-content-center">
              <i className="bi bi-egg-fried fs-5"></i>
            </span>
            <div>
              <div className="fw-bold fs-5 leading-tight">Campus<span className="text-warning">Bite</span></div>
              <small className="text-warning text-opacity-80" style={{ fontSize: '0.75rem' }}>Navigation Tabs</small>
            </div>
          </div>
          
          {/* Close Button (✕) */}
          <button
            id="close-tabs-drawer-btn"
            type="button"
            className="btn btn-sm btn-outline-light rounded-circle d-inline-flex align-items-center justify-content-center"
            style={{ width: 34, height: 34 }}
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Close navigation tabs"
          >
            <i className="bi bi-x-lg fs-6"></i>
          </button>
        </div>

        {/* Quick Helper Alert */}
        <div className="px-3 pt-3 pb-1">
          <div className="bg-warning bg-opacity-10 border border-warning border-opacity-25 rounded-3 p-2 d-flex align-items-center gap-2">
            <i className="bi bi-arrow-down-circle text-warning fs-5"></i>
            <span className="small text-dark fw-medium">
              Click any tab below to change sections instantly:
            </span>
          </div>
        </div>

        {/* Drawer Tabs List */}
        <div className="flex-grow-1 overflow-y-auto px-3 py-2">
          <div className="d-flex flex-column gap-2">
            {navTabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              return (
                <Link
                  key={tab.id}
                  id={tab.id}
                  to={tab.path}
                  onClick={() => setIsDrawerOpen(false)}
                  className={`p-3 rounded-3 text-decoration-none border transition-all d-flex align-items-center gap-3 ${
                    isActive
                      ? 'bg-warning bg-opacity-15 border-warning text-dark shadow-sm'
                      : 'bg-light border-light-subtle text-dark hover-lift'
                  }`}
                  style={{
                    backgroundColor: isActive ? '#fef3c7' : '#f8fafc',
                    borderColor: isActive ? '#f59e0b' : '#e2e8f0',
                  }}
                >
                  <div 
                    className={`rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 ${
                      isActive ? 'bg-warning text-dark' : 'bg-white text-secondary border'
                    }`}
                    style={{ width: 44, height: 44 }}
                  >
                    <i className={`bi ${tab.icon} fs-4`}></i>
                  </div>
                  
                  <div className="flex-grow-1 min-w-0">
                    <div className="d-flex align-items-center justify-content-between mb-0">
                      <span className={`fw-bold fs-6 ${isActive ? 'text-dark' : 'text-dark'}`}>
                        {tab.name}
                      </span>
                      {isActive && (
                        <span className="badge bg-warning text-dark px-2 py-0.5 rounded-pill small">
                          Current Tab
                        </span>
                      )}
                      {!isActive && tab.badge && (
                        <span className="badge bg-secondary-subtle text-secondary px-2 py-0.5 rounded-pill small">
                          {tab.badge}
                        </span>
                      )}
                    </div>
                    <small className="text-muted d-block text-truncate" style={{ fontSize: '0.78rem' }}>
                      {tab.description}
                    </small>
                  </div>

                  <i className={`bi bi-chevron-right ${isActive ? 'text-warning fw-bold' : 'text-muted'} small`}></i>
                </Link>
              );
            })}

            {/* Quick Cart Link in Drawer */}
            <Link
              id="drawer-tab-cart"
              to="/cart"
              onClick={() => setIsDrawerOpen(false)}
              className="p-3 rounded-3 text-decoration-none border bg-light border-light-subtle text-dark d-flex align-items-center gap-3 mt-1 hover-lift"
            >
              <div 
                className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 bg-white text-warning border"
                style={{ width: 44, height: 44 }}
              >
                <i className="bi bi-cart3 fs-4"></i>
              </div>
              <div className="flex-grow-1">
                <div className="d-flex align-items-center justify-content-between">
                  <span className="fw-bold fs-6 text-dark">Cart & Checkout</span>
                  {totalItems > 0 ? (
                    <span className="badge bg-danger rounded-pill px-2">{totalItems} items</span>
                  ) : (
                    <span className="badge bg-light text-secondary border">Empty</span>
                  )}
                </div>
                <small className="text-muted d-block" style={{ fontSize: '0.78rem' }}>
                  Review selected items and campus pickup
                </small>
              </div>
              <i className="bi bi-chevron-right text-muted small"></i>
            </Link>
          </div>
        </div>

        {/* Drawer Footer (User Profile or Auth) */}
        <div className="p-3 bg-light border-top">
          {isAuthenticated ? (
            <div>
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="rounded-circle bg-warning text-dark fw-bold d-inline-flex justify-content-center align-items-center" style={{ width: 36, height: 36 }}>
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </span>
                <div className="overflow-hidden">
                  <div className="fw-bold text-dark text-truncate">{user?.name}</div>
                  <small className="text-muted text-truncate d-block">{user?.email}</small>
                </div>
              </div>
              <button 
                id="drawer-logout-btn"
                className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 rounded-pill py-2"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right"></i>
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <Link 
                id="drawer-login-btn"
                to="/login" 
                onClick={() => setIsDrawerOpen(false)}
                className="btn btn-outline-dark w-50 rounded-pill py-2 fw-semibold"
              >
                Login
              </Link>
              <Link 
                id="drawer-register-btn"
                to="/register" 
                onClick={() => setIsDrawerOpen(false)}
                className="btn btn-warning w-50 rounded-pill py-2 text-dark fw-bold"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          3. MOBILE BOTTOM QUICK TAB BAR (For fast one-tap tab switching)
          ======================================================== */}
      <div 
        id="mobile-bottom-quick-bar"
        className="d-lg-none fixed-bottom bg-white border-top shadow-lg py-1 px-2 d-flex justify-content-around align-items-center"
        style={{ zIndex: 1010 }}
      >
        <NavLink 
          to="/" 
          className={({ isActive }) => `d-flex flex-column align-items-center text-decoration-none py-1 px-2 rounded-2 ${isActive ? 'text-warning fw-bold' : 'text-secondary'}`}
        >
          <i className="bi bi-house-door fs-5"></i>
          <span style={{ fontSize: '0.7rem' }}>Home</span>
        </NavLink>

        <NavLink 
          to="/menu" 
          className={({ isActive }) => `d-flex flex-column align-items-center text-decoration-none py-1 px-2 rounded-2 ${isActive ? 'text-warning fw-bold' : 'text-secondary'}`}
        >
          <i className="bi bi-grid-3x3-gap fs-5"></i>
          <span style={{ fontSize: '0.7rem' }}>Menu</span>
        </NavLink>

        <NavLink 
          to="/add-food" 
          className={({ isActive }) => `d-flex flex-column align-items-center text-decoration-none py-1 px-2 rounded-2 ${isActive ? 'text-warning fw-bold' : 'text-secondary'}`}
        >
          <i className="bi bi-plus-circle fs-5"></i>
          <span style={{ fontSize: '0.7rem' }}>Add/Sell</span>
        </NavLink>

        <NavLink 
          to="/my-orders" 
          className={({ isActive }) => `d-flex flex-column align-items-center text-decoration-none py-1 px-2 rounded-2 ${isActive ? 'text-warning fw-bold' : 'text-secondary'}`}
        >
          <i className="bi bi-receipt fs-5"></i>
          <span style={{ fontSize: '0.7rem' }}>Orders</span>
        </NavLink>

        {/* Quick Menu Button to trigger Three Lines Drawer */}
        <button 
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="btn btn-warning rounded-circle p-0 d-flex align-items-center justify-content-center text-dark shadow-sm"
          style={{ width: 38, height: 38 }}
          title="All Tabs"
          aria-label="Open all tabs"
        >
          <span className="d-flex flex-column justify-content-between" style={{ width: 16, height: 12 }}>
            <span className="bg-dark rounded-pill" style={{ height: 2, width: '100%' }}></span>
            <span className="bg-dark rounded-pill" style={{ height: 2, width: '100%' }}></span>
            <span className="bg-dark rounded-pill" style={{ height: 2, width: '100%' }}></span>
          </span>
        </button>
      </div>
    </>
  );
}
