import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails } from "../features/products/productSlice";
import { addToCart } from "../features/cart/cartSlice";
import Loader from "../components/layout/Loader";
import Message from "../components/layout/Message";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [qty, setQty] = useState(1);

  const { product, loading, error } = useSelector((state) => state.products);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  const addToCartHandler = () => {
    if (!userInfo) {
      navigate("/login");
      return;
    }

    dispatch(
      addToCart({
        id,
        qty,
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
    <div className="py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back
      </button>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : product ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img
              src={
                product.image.startsWith("http")
                  ? product.image
                  : `http://localhost:5000${product.image}`
              }
              alt={product.name}
              className="w-full h-auto max-h-[500px] object-contain"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center mb-4">
              <div className="text-yellow-500 text-xl">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>{product.rating >= i + 1 ? "★" : "☆"}</span>
                ))}
              </div>
              <span className="text-gray-600 ml-2">
                {product.numReviews} reviews
              </span>
            </div>

            <div className="text-2xl font-bold mb-4">
              ${product.price.toFixed(2)}
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Description:</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>

            {product.countInStock > 0 && (
              <div className="mb-4">
                <label
                  htmlFor="qty"
                  className="block text-lg font-semibold mb-2"
                >
                  Quantity:
                </label>
                <select
                  id="qty"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="border p-2 rounded w-20"
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Status:</h3>
              <p
                className={
                  product.countInStock > 0 ? "text-green-600" : "text-red-600"
                }
              >
                {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
              </p>
            </div>

            {product.frameType && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Frame Type:</h3>
                <p className="text-gray-700">{product.frameType}</p>
              </div>
            )}

            {product.lensType && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Lens Type:</h3>
                <p className="text-gray-700">{product.lensType}</p>
              </div>
            )}

            {product.uvProtection !== undefined && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">UV Protection:</h3>
                <p className="text-gray-700">
                  {product.uvProtection ? "Yes" : "No"}
                </p>
              </div>
            )}

            <button
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
              className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>
      ) : (
        <Message>Product not found</Message>
      )}
    </div>
  );
};

export default ProductPage;
