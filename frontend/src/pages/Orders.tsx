import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

interface Order {
  id: number;
  total?: number | string;
  totalPrice?: number | string;
  total_price?: number | string;
  totalAmount?: number | string;
  status: string;
  createdAt?: string;
}

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/my-orders');
      setOrders(Array.isArray(res.data) ? res.data : res.data.orders || []);
    } catch (err) {
      console.error('Error al obtener pedidos:', err);
    } finally {
      setLoading(false);
    }
  };

  const getOrderTotal = (order: Order) => {
    const rawTotal = order.total ?? order.totalPrice ?? order.total_price ?? order.totalAmount ?? 0;
    const numericTotal = Number(rawTotal);
    return isNaN(numericTotal) ? rawTotal : numericTotal.toFixed(2);
  };

  if (loading) return <div className="container"><p>Cargando pedidos...</p></div>;

  return (
    <div className="container">
      <h2>Mis Pedidos</h2>
      <br />
      {orders.length === 0 ? (
        <p>No has realizado ningún pedido aún.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>${getOrderTotal(order)}</td>
                <td>
                  <span style={{ fontWeight: 'bold', color: order.status === 'COMPLETED' ? '#27ae60' : '#e67e22' }}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};