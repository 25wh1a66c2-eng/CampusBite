import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark text-light pt-5 pb-4 mt-auto border-top border-secondary">
      <div className="container">
        <div className="row g-4">
          {/* Col 1: Brand & Bio */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="bg-warning text-dark px-2 py-1 rounded-3 fw-bold">
                <i className="bi bi-egg-fried"></i>
              </span>
              <span className="fs-4 fw-bold text-white">Campus<span className="text-warning">Bite</span></span>
            </div>
            <p className="text-secondary small pe-lg-4">
              Smart campus food ordering web platform tailored for university students, faculty, and campus canteens. Skip long counter lines with pre-orders and instant pickup notifications.
            </p>
            <div className="d-flex gap-2 align-items-center text-success small">
              <i className="bi bi-tree-fill"></i>
              <span>Proud supporter of campus food waste reduction & EcoScore initiatives.</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-white fw-bold mb-3">Quick Navigation</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link to="/" className="text-secondary text-decoration-none hover-white">Home</Link></li>
              <li className="mb-2"><Link to="/menu" className="text-secondary text-decoration-none">Full Campus Menu</Link></li>
              <li className="mb-2"><Link to="/add-food" className="text-secondary text-decoration-none">Canteen Seller Portal</Link></li>
              <li className="mb-2"><Link to="/my-orders" className="text-secondary text-decoration-none">Track My Orders</Link></li>
              <li className="mb-2"><Link to="/backend-guide" className="text-secondary text-decoration-none">Spring Boot 3 Specs</Link></li>
            </ul>
          </div>

          {/* Col 3: Pickup Locations */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3">Official Pickup Spots</h6>
            <ul className="list-unstyled small text-secondary">
              <li className="mb-2"><i className="bi bi-geo-alt-fill text-warning me-2"></i> CSE Department Counter</li>
              <li className="mb-2"><i className="bi bi-geo-alt-fill text-warning me-2"></i> Central Library Foyer</li>
              <li className="mb-2"><i className="bi bi-geo-alt-fill text-warning me-2"></i> University Main Gate</li>
              <li className="mb-2"><i className="bi bi-geo-alt-fill text-warning me-2"></i> Student Activity Centre (SAC)</li>
              <li className="mb-2"><i className="bi bi-geo-alt-fill text-warning me-2"></i> Men's & Women's Hostels</li>
            </ul>
          </div>

          {/* Col 4: Demo Stack Highlights */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3">Solo Challenge Tech Stack</h6>
            <div className="d-flex flex-wrap gap-1 mb-3">
              <span className="badge bg-secondary">Java 17</span>
              <span className="badge bg-secondary">Spring Boot 3</span>
              <span className="badge bg-secondary">Spring Data JPA</span>
              <span className="badge bg-secondary">MySQL</span>
              <span className="badge bg-secondary">React + Vite</span>
              <span className="badge bg-secondary">Bootstrap 5</span>
              <span className="badge bg-secondary">Axios</span>
            </div>
            <p className="text-secondary small mb-0">
              Database: <code className="text-warning">campusbite_db</code><br />
              Canteen Hours: 7:30 AM – 10:30 PM
            </p>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center small text-secondary">
          <p className="mb-0">© {new Date().getFullYear()} CampusBite. Smart Campus Food Ordering App.</p>
          <p className="mb-0 mt-2 mt-sm-0">
            Engineered for reliability, zero lag, and fresh campus eating.
          </p>
        </div>
      </div>
    </footer>
  );
}
