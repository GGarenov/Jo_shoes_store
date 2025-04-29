import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllOrders } from "../../features/orders/orderSlice";
import Loader from "../../components/layout/Loader";
import Message from "../../components/layout/Message";

const OrderListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders, loadingAllOrders, errorAllOrders } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const viewOrderDetailsHandler = (orderId) => {
    navigate(`/admin/order/${orderId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Orders</h1>

      {loadingAllOrders ? (
        <Loader />
      ) : errorAllOrders ? (
        <Message variant="error">{errorAllOrders}</Message>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Order ID</th>
              <th className="border p-2">User</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Paid</th>
              <th className="border p-2">Delivered</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(orders) && orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id}>
                  <td className="border p-2">{order._id}</td>
                  <td className="border p-2">{order.user?.name || "N/A"}</td>
                  <td className="border p-2">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border p-2">
                    ${order.totalPrice?.toFixed(2) || "N/A"}
                  </td>
                  <td className="border p-2">
                    {order.isPaid ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-red-600">No</span>
                    )}
                  </td>
                  <td className="border p-2">
                    {order.isDelivered ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-red-600">No</span>
                    )}
                  </td>
                  <td className="border p-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => viewOrderDetailsHandler(order._id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderListPage;
