import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

interface UserItem {
  id: number;
  name: string;
  email: string;
  role?: string;
}

export const Users: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(Array.isArray(res.data) ? res.data : res.data.users || []);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container"><p>Cargando lista de usuarios...</p></div>;

  return (
    <div className="container">
      <h2>Usuarios Registrados (Panel de Administración)</h2>
      <br />
      {users.length === 0 ? (
        <p>No se encontraron usuarios registrados.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo Electrónico</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>#{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span style={{ fontWeight: 'bold', color: u.role === 'ADMIN' || u.email.includes('admin') ? '#e74c3c' : '#27ae60' }}>
                    {u.role || (u.email.includes('admin') ? 'ADMIN' : 'CLIENTE')}
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