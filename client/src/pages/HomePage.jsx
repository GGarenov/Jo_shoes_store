import React from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../features/products/productSlice";
import { addToCart } from "../features/cart/cartSlice";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state) => state.products);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = (product) => {
    if (!userInfo) {
      navigate("/login");
      return;
    }

    dispatch(
      addToCart({
        id: product._id,
        qty: 1,
        userId: userInfo._id,
        token: userInfo.token,
      })
    )
      .unwrap()
      .then(() => {
        navigate("/cart");
      })
      .catch((error) => {
        console.error("Failed to add product to cart", error);
      });
  };

  return (
    <div>
      {/* top */}
      <div
        className="flex flex-col gap-6 p-6 md:p-28 px-4
       max-w-6xl mx-auto"
      >
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Discover your new <span className="text-slate-500">style</span>
          <br />
          and express your true self
        </h1>
        <div className="text-gray-400 text-xs sm:text-xl">
          Explore the latest trends and timeless classics at Garenov Apparel.
          <br />
          Find the perfect outfits that match your unique style.
        </div>
        <Link
          to={"/"}
          className="text-xl sm:text-xl text-blue-800 font-bold hover:underline"
        >
          Search Now..
        </Link>
      </div>

      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Featured Products
      </h2>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <a href={`/product/${product._id}`}>
                  <img
                    src={
                      product.image.startsWith("http")
                        ? product.image
                        : `http://localhost:5000${product.image}`
                    }
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                </a>
                <div className="p-4">
                  <a href={`/product/${product._id}`}>
                    <h3 className="text-lg font-semibold mb-2 hover:text-blue-600">
                      {product.name}
                    </h3>
                  </a>
                  <div className="flex items-center mb-2">
                    <div className="text-yellow-400 flex mr-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          {product.rating >= i + 1 ? (
                            <i className="fas fa-star"></i>
                          ) : product.rating >= i + 0.5 ? (
                            <i className="fas fa-star-half-alt"></i>
                          ) : (
                            <i className="far fa-star"></i>
                          )}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.numReviews} reviews
                    </span>
                  </div>
                  <p className="text-xl font-bold text-gray-800">
                    ${product.price?.toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={product.countInStock === 0}
                  >
                    {product.countInStock > 0 ? "Add To Cart" : "Out Of Stock"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              <i className="fas fa-box-open text-5xl mb-4"></i>
              <p className="text-xl">No products found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
