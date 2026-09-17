import React from 'react';

export default function BackendGuide() {
  return (
    <div className="backend-guide-page py-5 bg-light">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-5">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-success-subtle text-success border border-success-subtle small fw-bold mb-2">
            <i className="bi bi-cpu-fill"></i> Spring Boot 3 & MySQL Architecture
          </div>
          <h1 className="fw-bold text-dark">Developer & Evaluator Guide</h1>
          <p className="text-muted">
            Complete technical specification, entity schemas, REST API endpoints, and step-by-step local execution commands.
          </p>
        </div>

        <div className="row g-4">
          {/* Section 1: Architecture Summary */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <h4 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-diagram-3-fill text-primary"></i> Backend Layered Architecture
              </h4>
              <p className="text-secondary small">
                The backend is designed following clean enterprise architecture standards:
              </p>
              <ul className="list-group list-group-flush small">
                <li className="list-group-item px-0 py-2 d-flex justify-content-between align-items-start">
                  <div>
                    <strong className="text-dark">Controller Layer</strong>
                    <div className="text-muted"><code>AuthController</code>, <code>ProductController</code>, <code>CartController</code>, <code>OrderController</code></div>
                  </div>
                  <span className="badge bg-primary">REST</span>
                </li>
                <li className="list-group-item px-0 py-2 d-flex justify-content-between align-items-start">
                  <div>
                    <strong className="text-dark">Service Layer</strong>
                    <div className="text-muted"><code>AuthService</code>, <code>ProductService</code>, <code>CartService</code>, <code>OrderService</code> (Transactional)</div>
                  </div>
                  <span className="badge bg-info text-dark">Business Logic</span>
                </li>
                <li className="list-group-item px-0 py-2 d-flex justify-content-between align-items-start">
                  <div>
                    <strong className="text-dark">Repository Layer (JPA)</strong>
                    <div className="text-muted"><code>UserRepository</code>, <code>ProductRepository</code>, <code>CartRepository</code>, <code>OrderRepository</code></div>
                  </div>
                  <span className="badge bg-secondary">Data Access</span>
                </li>
                <li className="list-group-item px-0 py-2 d-flex justify-content-between align-items-start">
                  <div>
                    <strong className="text-dark">Database Entities</strong>
                    <div className="text-muted"><code>User</code>, <code>Product</code>, <code>Cart</code>, <code>CartItem</code>, <code>Order</code>, <code>OrderItem</code></div>
                  </div>
                  <span className="badge bg-dark">MySQL</span>
                </li>
              </ul>

              <div className="mt-4 p-3 bg-light rounded-3 border small">
                <div className="fw-bold text-dark mb-1">Dual-Backend Execution Design:</div>
                <div className="text-muted">
                  • <strong>Spring Boot 3 + MySQL:</strong> Provided in <code>/backend/</code> with complete <code>pom.xml</code>, JPA entities, repositories, and controllers.<br />
                  • <strong>Embedded Server:</strong> Built in <code>server.ts</code> with exact contract parity, allowing immediate live demonstration in this container!
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Setup Commands */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <h4 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-terminal-fill text-dark"></i> Local Setup Instructions
              </h4>

              <h6 className="fw-bold text-dark mt-2 small text-uppercase">1. MySQL Database Creation</h6>
              <pre className="bg-dark text-light p-3 rounded-3 small">
                <code>
{`CREATE DATABASE campusbite_db;
CREATE USER 'root'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON campusbite_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;`}
                </code>
              </pre>

              <h6 className="fw-bold text-dark mt-2 small text-uppercase">2. Run Spring Boot Backend</h6>
              <pre className="bg-dark text-light p-3 rounded-3 small">
                <code>
{`cd backend
mvn clean install
mvn spring-boot:run`}
                </code>
              </pre>

              <h6 className="fw-bold text-dark mt-2 small text-uppercase">3. Run React + Vite Frontend</h6>
              <pre className="bg-dark text-light p-3 rounded-3 small">
                <code>
{`npm install
npm run dev`}
                </code>
              </pre>
            </div>
          </div>

          {/* Section 3: REST API Contract */}
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h4 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-cloud-arrow-up-fill text-success"></i> REST API Endpoints Specification
              </h4>

              <div className="table-responsive">
                <table className="table table-bordered align-middle small">
                  <thead className="table-light">
                    <tr>
                      <th>Module</th>
                      <th>Method</th>
                      <th>Endpoint</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td rowSpan={2} className="fw-bold">Auth</td>
                      <td><span className="badge bg-success">POST</span></td>
                      <td><code>/api/auth/register</code></td>
                      <td>Register new student or staff account</td>
                    </tr>
                    <tr>
                      <td><span className="badge bg-success">POST</span></td>
                      <td><code>/api/auth/login</code></td>
                      <td>Authenticate user and return JWT / token</td>
                    </tr>

                    <tr>
                      <td rowSpan={4} className="fw-bold">Products</td>
                      <td><span className="badge bg-primary">GET</span></td>
                      <td><code>/api/products</code></td>
                      <td>Get all food items with search, category, and foodType filters</td>
                    </tr>
                    <tr>
                      <td><span className="badge bg-primary">GET</span></td>
                      <td><code>/api/products/{`{id}`}</code></td>
                      <td>Get single food item details</td>
                    </tr>
                    <tr>
                      <td><span className="badge bg-success">POST</span></td>
                      <td><code>/api/products</code></td>
                      <td>Add/Sell new food item to catalogue</td>
                    </tr>
                    <tr>
                      <td><span className="badge bg-warning text-dark">PUT</span></td>
                      <td><code>/api/products/{`{id}`}</code></td>
                      <td>Update food item details & availability</td>
                    </tr>

                    <tr>
                      <td rowSpan={4} className="fw-bold">Cart</td>
                      <td><span className="badge bg-primary">GET</span></td>
                      <td><code>/api/cart?userId={'{id}'}</code></td>
                      <td>Get active user cart with subtotal & item quantities</td>
                    </tr>
                    <tr>
                      <td><span className="badge bg-success">POST</span></td>
                      <td><code>/api/cart/items</code></td>
                      <td>Add food item to cart with stock validation</td>
                    </tr>
                    <tr>
                      <td><span className="badge bg-warning text-dark">PUT</span></td>
                      <td><code>/api/cart/items/{`{id}`}</code></td>
                      <td>Update item quantity in cart</td>
                    </tr>
                    <tr>
                      <td><span className="badge bg-danger">DELETE</span></td>
                      <td><code>/api/cart/items/{`{id}`}</code></td>
                      <td>Remove item from cart</td>
                    </tr>

                    <tr>
                      <td rowSpan={4} className="fw-bold">Orders</td>
                      <td><span className="badge bg-success">POST</span></td>
                      <td><code>/api/orders</code></td>
                      <td>Place order: deducts stock, clears cart, computes EcoScore</td>
                    </tr>
                    <tr>
                      <td><span className="badge bg-primary">GET</span></td>
                      <td><code>/api/orders?userId={'{id}'}</code></td>
                      <td>Get user order history</td>
                    </tr>
                    <tr>
                      <td><span className="badge bg-primary">GET</span></td>
                      <td><code>/api/orders/{`{id}`}</code></td>
                      <td>Get specific order tracking particulars</td>
                    </tr>
                    <tr>
                      <td><span className="badge bg-info text-dark">PATCH</span></td>
                      <td><code>/api/orders/{`{id}`}/status</code></td>
                      <td>Update order status (PLACED, PREPARING, READY_FOR_PICKUP, COMPLETED)</td>
                    </tr>

                    <tr>
                      <td className="fw-bold">Payments</td>
                      <td><span className="badge bg-success">POST</span></td>
                      <td><code>/api/payment/stripe-intent</code></td>
                      <td>Stripe PaymentIntent simulation with client secret</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
