import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export const Products: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Determinar si el usuario actual es Administrador
  const isAdmin = user?.role === 'ADMIN' || user?.email?.toLowerCase().includes('admin') || user?.name?.toLowerCase().includes('admin');

  // Estado del nuevo producto
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Error al cargar productos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      await api.post('/products', {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
      });

      setMessage('¡Producto creado con éxito!');
      setName('');
      setDescription('');
      setPrice('');
      setStock('');
      setShowForm(false);
      fetchProducts();
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Error al crear el producto');
    }
  };

  const handleBuy = async (productId: number) => {
    try {
      await api.post('/orders', {
        items: [{ productId, quantity: 1 }],
      });
      alert('¡Pedido realizado con éxito!');
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al realizar el pedido');
    }
  };

  if (loading) return <div className="container"><p>Cargando catálogo...</p></div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Catálogo de Productos</h2>
        {isAdmin && (
          <button 
            onClick={() => setShowForm(!showForm)}
            style={{ background: '#27ae60', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {showForm ? 'Cancelar' : '+ Agregar Producto'}
          </button>
        )}
      </div>

      {message && <p style={{ color: message.includes('éxito') ? 'green' : 'red' }}>{message}</p>}

      {isAdmin && showForm && (
        <form onSubmit={handleCreateProduct} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
          <h3>Nuevo Producto (Panel de Administrador)</h3>
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
            <input 
              type="text" 
              placeholder="Nombre del producto" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              style={{ padding: '0.5rem' }}
            />
            <input 
              type="text" 
              placeholder="Descripción" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
              style={{ padding: '0.5rem' }}
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input 
                type="number" 
                step="0.01" 
                placeholder="Precio ($)" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                required 
                style={{ padding: '0.5rem', flex: 1 }}
              />
              <input 
                type="number" 
                placeholder="Stock disponible" 
                value={stock} 
                onChange={(e) => setStock(e.target.value)} 
                required 
                style={{ padding: '0.5rem', flex: 1 }}
              />
            </div>
            <button type="submit" style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.6rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              Guardar en BD
            </button>
          </div>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {products.map((prod) => (
          <div key={prod.id} className="card" style={{ border: '1px solid #cbd5e1', padding: '1rem', borderRadius: '8px', background: '#fff' }}>
            <h3>{prod.name}</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{prod.description}</p>
            <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#0f172a' }}>${Number(prod.price).toFixed(2)}</p>
            <p style={{ color: prod.stock > 0 ? '#16a34a' : '#dc2626', fontSize: '0.85rem' }}>
              Stock: {prod.stock} disponibles
            </p>
            <button 
              onClick={() => handleBuy(prod.id)} 
              disabled={prod.stock <= 0}
              style={{ 
                width: '100%', 
                marginTop: '1rem', 
                padding: '0.5rem', 
                background: prod.stock > 0 ? '#0284c7' : '#94a3b8', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: prod.stock > 0 ? 'pointer' : 'not-allowed' 
              }}
            >
              {prod.stock > 0 ? 'Comprar Ahora' : 'Agotado'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};