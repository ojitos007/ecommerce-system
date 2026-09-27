import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await api.post('/users/register', { name, email, password });
        alert('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
        setIsRegister(false);
      } else {
        const response = await api.post('/users/login', { email, password });
        login(response.data.token, response.data.user);
        navigate('/products');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Ocurrió un error en la autenticación');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '4rem' }}>
      <div className="card">
        <h2>{isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}</h2>
        {error && <p style={{ color: 'red', margin: '1rem 0' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label>Nombre Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn" style={{ width: '100%' }}>
            {isRegister ? 'Registrarse' : 'Ingresar'}
          </button>
        </form>
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
          <span
            style={{ color: '#2980b9', cursor: 'pointer', fontWeight: 'bold' }}
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
          >
            {isRegister ? 'Inicia Sesión' : 'Regístrate aquí'}
          </span>
        </p>
      </div>
    </div>
  );
};