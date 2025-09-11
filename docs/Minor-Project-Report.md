# Cafe Delight – Minor Project Report

## 1) Cover Page
- Project Title: Cafe Delight – Full-Stack Cafe Ordering System
- Prepared By: [Your Name]
- Enrollment/ID: [Your ID]
- Department/Institute: [Your Institute]
- Guide/Mentor: [Mentor Name]
- Submission Date: [Date]

## 2) Minor Project Completion Certificate
This is to certify that the Minor Project titled “Cafe Delight – Full-Stack Cafe Ordering System” has been carried out by [Your Name], [Your ID], under the guidance of [Mentor Name], in partial fulfillment of the requirements for the [Program Name] at [Institute]. To the best of our knowledge, the work reported herein is original and has not been submitted to any other institution.

Signature (Student)          Signature (Guide)          Signature (HOD)

Date: __________             Date: __________           Date: __________

## 3) Index
- 1) Cover Page
- 2) Minor Project Completion Certificate
- 3) Index
- 4) Introduction
- 5) Limitation of Existing System
- 6) Objectives
- 7) Scope
- 8) Advantages
- 9) System Design
  - a) Database Design
- 10) Screenshots
- 11) Coding
- 12) References

## 4) Introduction
Cafe Delight is a MERN-stack application that enables customers to browse a menu, add items to a cart, and place orders. Admin users can manage products, users, and orders through a secure dashboard. The system includes authentication, protected routes, role-based access control, image uploads, and an admin-friendly product management UI.

Tech stack:
- Frontend: React, React Router, React Query, Axios
- Backend: Node.js, Express, Mongoose (MongoDB)
- Auth: JWT-based login for users and admins
- Media: Multer for server-side image upload and static serving

## 5) Limitation of Existing System
- Manual order tracking and product updates are error-prone.
- No centralized inventory or pricing updates.
- Static menus without media hosting complicate content management.
- Lacks role-based access for staff/admin operations.

## 6) Objectives
- Provide a responsive storefront for browsing products and placing orders.
- Implement secure authentication and role-based authorization.
- Enable admin management of products, users, and orders.
- Support image upload and reliable serving of media.
- Ensure maintainable APIs and a clean frontend state management approach.

## 7) Scope
- Customer features: browse menu, search/filter, cart, orders, profile.
- Admin features: dashboard, product CRUD, user management (edit/delete/toggle active), order management, reports.
- Media management: upload a product image and serve via `/uploads`.

## 8) Advantages
- Centralized, role-aware admin panel.
- Fast UX with client caching (React Query).
- Secure APIs with JWT and middleware guards.
- Portable image handling (local uploads with absolute URLs from API).

## 9) System Design
### a) Database Design (MongoDB via Mongoose)
- User (`BE/src/models/User.js`)
  - name: String
  - email: String (unique)
  - password: String (hashed, select: false)
  - role: "user" | "admin"
  - active: Boolean (default: true)
  - passwordResetToken, passwordResetExpires

- Product (`BE/src/models/Product.js`)
  - title: String
  - description: String
  - category: String
  - price: Number
  - inStock: Number
  - images: [String] (stores URL returned by upload API)
  - active: Boolean

- Cart (`BE/src/models/Cart.js`)
  - user: ObjectId (User)
  - items: [{ product: ObjectId(Product), quantity: Number, price: Number }]

- Order (`BE/src/models/Order.js`)
  - user: ObjectId (User)
  - items: [{ product, quantity, price }]
  - subtotal, total: Number
  - status: enum

- Review (`BE/src/models/Review.js`)
  - product: ObjectId (Product)
  - user: ObjectId (User)
  - rating: Number, comment: String

Key backend modules:
- Auth: `BE/src/controllers/authController.js`, routes: `BE/src/routes/authRoutes.js`
- Admin: `BE/src/controllers/adminController.js`, routes: `BE/src/routes/adminRoutes.js`
- Products: `BE/src/controllers/productController.js`, routes: `BE/src/routes/productRoutes.js`
- Uploads: `BE/src/middlewares/upload.js`, `BE/src/routes/uploadRoutes.js`
- Middleware: `BE/src/middlewares/auth.js`, `BE/src/middlewares/errorHandler.js`
- App bootstrap: `BE/src/app.js`, `BE/src/routes/index.js`

## 10) Screenshots
Paste or insert screenshots in this section (replace placeholders):
- Login page (User/Admin)
- Home/Menu page with products
- Cart page with items
- Orders page
- Admin Dashboard
- Admin Product Management (list, add/edit with image upload)
- Admin User Management (list, edit, toggle active)
- Uploads working (image visible from `/uploads/...`)

## 11) Coding
Important file references:
- Frontend
  - Routing and guards: `FE/src/App.jsx`, `FE/src/components/ProtectedRoute.jsx`
  - Auth context: `FE/src/contexts/AuthContext.jsx`
  - API layer: `FE/src/services/api.js`
  - Navbar with cart badge: `FE/src/components/Layout/Navbar.jsx`
  - Admin pages: `FE/src/pages/admin/AdminDashboard.jsx`
  - Admin components: `FE/src/components/admin/ProductManagement.jsx`, `ProductForm.jsx`, `UserManagement.jsx`, `OrderManagement.jsx`

- Backend
  - App setup: `BE/src/app.js`
  - Auth: `BE/src/controllers/authController.js`, `BE/src/routes/authRoutes.js`
  - Admin: `BE/src/controllers/adminController.js`, `BE/src/routes/adminRoutes.js`
  - Products: `BE/src/controllers/productController.js`, `BE/src/routes/productRoutes.js`
  - Upload: `BE/src/middlewares/upload.js`, `BE/src/routes/uploadRoutes.js`, static serve in `app.js`
  - Auth middleware: `BE/src/middlewares/auth.js`

Build/Run:
- Backend: in `BE/` → `npm run dev`
- Frontend: in `FE/` → `npm run dev`
- Prettier: in each package → `npm run format`

## 12) References
- React Docs: https://react.dev/
- React Router: https://reactrouter.com/
- TanStack Query: https://tanstack.com/query/latest
- Axios: https://axios-http.com/
- Express: https://expressjs.com/
- Mongoose: https://mongoosejs.com/
- Multer: https://github.com/expressjs/multer
- JWT: https://jwt.io/

---

Export to Word (Options):
- Open this Markdown in Microsoft Word and save as .docx.
- Or use VS Code “Markdown PDF” / “Markdown All in One” extensions to export.
- If you have Pandoc installed, run:
  pandoc docs/Minor-Project-Report.md -o docs/Minor-Project-Report.docx
