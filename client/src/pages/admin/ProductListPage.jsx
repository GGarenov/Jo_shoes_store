import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  deleteProduct,
} from "../../features/products/productSlice";

const ProductListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error, success } = useSelector(
    (state) => state.products
  );
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate("/login");
    } else {
      dispatch(fetchProducts());
    }
  }, [dispatch, navigate, userInfo, success]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  const createProductHandler = () => {
    navigate("/admin/product/create");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={createProductHandler}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          <i className="fas fa-plus"></i> Create Product
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">ID</th>
                <th className="py-2 px-4 border">NAME</th>
                <th className="py-2 px-4 border">PRICE</th>
                <th className="py-2 px-4 border">CATEGORY</th>
                <th className="py-2 px-4 border">BRAND</th>
                <th className="py-2 px-4 border">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(products) && products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border">{product._id}</td>
                    <td className="py-2 px-4 border">{product.name}</td>
                    <td className="py-2 px-4 border">${product.price}</td>
                    <td className="py-2 px-4 border">{product.category}</td>
                    <td className="py-2 px-4 border">{product.brand}</td>
                    <td className="py-2 px-4 border flex space-x-2">
                      <Link
                        to={`/admin/product/${product._id}/edit`}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                      >
                        <i className="fas fa-edit"></i>
                      </Link>
                      <button
                        onClick={() => deleteHandler(product._id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-4 text-center">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductListPage;
