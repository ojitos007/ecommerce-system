import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'ADMIN' || user?.email?.toLowerCase().includes('admin') || user?.name?.toLowerCase().includes('admin');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', background: '#1e293b', color: '#fff' }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
        <Link to="/products" style={{ color: '#fff', textDecoration: 'none' }}>🛒 E-Commerce System</Link>
      </div>
      {user && (
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/products" style={{ color: '#fff', textDecoration: 'none' }}>Productos</Link>
          <Link to="/orders" style={{ color: '#fff', textDecoration: 'none' }}>Mis Pedidos</Link>
          {isAdmin && (
            <Link to="/users" style={{ color: '#f39c12', fontWeight: 'bold', textDecoration: 'none' }}>👥 Usuarios</Link>
          )}
          <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
            👤 {user.name} {isAdmin && '(Admin)'}
          </span>
          <button 
            onClick={handleLogout} 
            style={{ background: '#e74c3c', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}
          >
            Salir
          </button>
        </div>
      )}
    </nav>
  );
};