import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Admin
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserListPage from "./pages/admin/UserListPage";
import ProductListPage from "./pages/admin/ProductListPage";
import OrderListPage from "./pages/admin/OrderListPage";
import CreateProductPage from "./pages/admin/CreateProductPage";

// PrivateRoute component
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Main layout */}
        <Header />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/cart/:id" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Admin routes with PrivateRoute */}
            <Route
              path="/admin"
              element={<PrivateRoute element={<AdminLayout />} />}
            >
              <Route
                path="dashboard"
                element={<PrivateRoute element={<AdminDashboard />} />}
              />
              <Route
                path="users"
                element={<PrivateRoute element={<UserListPage />} />}
              />
              <Route
                path="products"
                element={<PrivateRoute element={<ProductListPage />} />}
              />
              <Route
                path="orders"
                element={<PrivateRoute element={<OrderListPage />} />}
              />
              <Route
                path="product/create"
                element={<PrivateRoute element={<CreateProductPage />} />}
              />
            </Route>
          </Routes>
        </main>
        <Footer />
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
