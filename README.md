# CampusBite – Smart Campus Food Ordering App

A full-stack food-ordering web application engineered specifically for university campuses. Designed for speed, high-traffic lunch breaks, campus-hub pickups, and food sustainability with EcoScore tracking.

---

## 🚀 Live Demo & Dual-Backend Architecture

CampusBite is architected with complete multi-environment support:

1. **Spring Boot 3 + MySQL Implementation (`/backend/`)**:
   - Enterprise-grade Java 17 + Spring Boot 3 architecture
   - Spring Data JPA, Hibernate, and MySQL schema
   - Layered Controller-Service-Repository pattern
   - Full REST API with DTOs and validation
2. **Interactive Node/Express Container Backend (`server.ts`)**:
   - Provides immediate, zero-latency runnability directly inside the AI Studio web preview
   - Mirrors the identical Spring Boot REST contract (`/api/auth/*`, `/api/products/*`, `/api/cart/*`, `/api/orders/*`, `/api/payment/*`)

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.0 (Java 17)
- **Data Access**: Spring Data JPA / Hibernate
- **Database**: MySQL 8.x
- **Build Tool**: Maven (`pom.xml`)
- **Payment Gateway**: Stripe PaymentIntent API (simulated/interactive)
- **Container Server**: Express.js + tsx for immediate web preview execution

### Frontend
- **Framework**: React 18
- **Tooling**: Vite
- **UI Library**: Bootstrap 5 + Bootstrap Icons + Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **State Management**: React Context API (`AuthContext`, `CartContext`, `NotificationContext`)

---

## ⚙️ Local Development Setup

### 1. MySQL Database Setup
Open your MySQL client or terminal:

```sql
CREATE DATABASE campusbite_db;

-- Optional: Create dedicated user
CREATE USER 'root'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON campusbite_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Configure Spring Boot `application.properties`
Navigate to `/backend/src/main/resources/application.properties` and verify your credentials:

```properties
spring.application.name=campusbite-backend
server.port=8080

# MySQL DataSource
spring.datasource.url=jdbc:mysql://localhost:3306/campusbite_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

### 3. Run the Spring Boot Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
The Spring Boot server will boot up at `http://localhost:8080`.

### 4. Run the React + Vite Frontend
In the root directory:
```bash
npm install
npm run dev
```
The application will open at `http://localhost:3000`.

---

## 🔑 Sample Test Credentials

| Role | Email | Password | Pre-loaded Data |
| :--- | :--- | :--- | :--- |
| **Student** | `student@campus.edu` | `password123` | Cart, active orders, Rahul Sharma |
| **Canteen Staff** | `canteen@campus.edu` | `password123` | South Canteen seller access |
| **Admin** | `admin@campus.edu` | `password123` | Full menu and analytics view |

*Tip: Quick 1-click fill buttons are available on the Login page for hassle-free testing!*

---

## 🗺️ Campus Pickup Hubs
Orders can be dispatched to any of the 5 official university pickup spots:
- **CSE Department** (Block A Foyer)
- **Central University Library** (Entrance Foyer)
- **University Main Gate** (Security Booth Locker)
- **Student Residential Hostels** (Block 3 Counter)
- **Student Activity Centre (SAC)** (Plaza Counter)

---

## 🌱 EcoScore Sustainability Feature
CampusBite actively promotes campus food waste reduction and sustainable meal choices:
- Plant-based and vegetarian dishes display an **EcoScore badge**.
- Consolidated cart orders reduce campus cross-building courier runs.
- Meaningful confirmation messages highlight sustainable dining choices.

---

## 📡 REST API Summary

- `POST /api/auth/register` - Student registration
- `POST /api/auth/login` - Student login & JWT token
- `GET /api/products` - List products with search, category & dietary filter
- `GET /api/products/{id}` - Single product details
- `POST /api/products` - Add product (Canteen Seller portal)
- `GET /api/cart?userId={id}` - Retrieve user cart
- `POST /api/cart/items` - Add product to cart with stock validation
- `PUT /api/cart/items/{id}` - Update quantity
- `DELETE /api/cart/items/{id}` - Remove item from cart
- `POST /api/orders` - Place order & reduce inventory
- `GET /api/orders?userId={id}` - Get order history
- `GET /api/orders/{id}` - Get order status
- `PATCH /api/orders/{id}/status` - Advance order lifecycle (PLACED -> PREPARING -> READY_FOR_PICKUP -> COMPLETED)
- `POST /api/payment/stripe-intent` - Stripe PaymentIntent generation
