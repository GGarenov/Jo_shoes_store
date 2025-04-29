import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../features/cart/cartSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const addToCartHandler = () => {
    dispatch(addToCart({ id: product._id, qty: 1 }));
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <Link to={`/product/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
        </Link>
        <div className="flex items-center mb-2">
          <div className="text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <span key={i}>{product.rating >= i + 1 ? "★" : "☆"}</span>
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-1">
            ({product.numReviews} reviews)
          </span>
        </div>
        <p className="text-xl font-bold">${product.price.toFixed(2)}</p>
        <button
          onClick={addToCartHandler}
          className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={product.countInStock === 0}
        >
          {product.countInStock > 0 ? "Add To Cart" : "Out Of Stock"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
