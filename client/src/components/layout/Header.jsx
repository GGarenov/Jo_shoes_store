import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/users/userSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Jo Fashion</span>
            <span className="text-slate-700">Real Estate</span>
          </h1>
        </Link>
        <nav>
          <ul className="flex space-x-6 items-center">
            <li>
              <Link
                to="/cart"
                className="flex items-center hover:text-blue-300 transition-colors"
              >
                <i className="fas fa-shopping-cart mr-1"></i> Cart
                {cartItems && cartItems.length > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.reduce(
                      (acc, item) => acc + (item.quantity || 0),
                      0
                    )}
                  </span>
                )}
              </Link>
            </li>
            {userInfo ? (
              <li className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center hover:text-blue-300 transition-colors"
                >
                  <i className="fas fa-user mr-1"></i> {userInfo.name}{" "}
                  <i className="fas fa-caret-down ml-1"></i>
                </button>
                {isDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
                    // Prevent dropdown from closing when mouse enters
                    onMouseEnter={(e) => e.stopPropagation()}
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        logoutHandler();
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </li>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="hover:text-blue-300 transition-colors"
                >
                  <i className="fas fa-sign-in-alt mr-1"></i> Sign In
                </Link>
              </li>
            )}
            {userInfo && userInfo.isAdmin && (
              <li className="relative group">
                <button className="flex items-center hover:text-blue-300 transition-colors">
                  <i className="fas fa-user-shield mr-1"></i> Admin{" "}
                  <i className="fas fa-caret-down ml-1"></i>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
                  <Link
                    to="/admin/userlist"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Users
                  </Link>
                  <Link
                    to="/admin/productlist"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Products
                  </Link>
                  <Link
                    to="/admin/orderlist"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Orders
                  </Link>
                </div>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
