import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import type { LoginRequest, AuthResponse } from '../interfaces/types';

export const LoginPage = () => {
  const [credentials, setCredentials] = useState<LoginRequest>({
    email: '',
    password: ''
  });

  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!credentials.email.trim() || !credentials.password.trim()) {
      setError('Por favor, ingresa tu correo y contraseña.');
      return;
    }

    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err: any) {
      console.error("Fallo detectado en el login:", err.response);
      const responseData = err.response?.data;
      let mensajeError = '';

      if (responseData) {
        mensajeError = responseData.message || responseData.error;
      }

      if (!mensajeError) {
        mensajeError = 'Datos incorrectos, verifica tu correo o contraseña.';
      }

      setError(mensajeError);
    }
  };

  return (
    <div style={{
      backgroundColor: '#EBF3FC',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      fontFamily: '"Montserrat", "Segoe UI", sans-serif',
      boxSizing: 'border-box',
      margin: 0
    }}>
      
      <style>{`
        @import url('https://googleapis.com');
      `}</style>

      <div style={{
        backgroundColor: '#ffffff',
        padding: '45px 40px',
        borderRadius: '0px',
        boxShadow: '0 10px 30px rgba(15, 30, 67, 0.03)',
        width: '440px',
        border: '1px solid #D3E4F6',
        boxSizing: 'border-box'
      }}>
        
        <div style={{ marginBottom: '35px', textAlign: 'center' }}>
          <h1 style={{ 
            fontFamily: '"Pinyon Script", cursive', 
            fontSize: '52px', 
            color: '#1E3A8A', 
            margin: '0 0 15px 0',
            fontWeight: 'normal',
            lineHeight: '1'
          }}>
            Fly Away Travel
          </h1>
          <p style={{ 
            fontFamily: '"Cinzel", serif',
            fontSize: '13px', 
            color: '#64748B', 
            fontWeight: '600', 
            margin: 0, 
            letterSpacing: '1.5px',
            textTransform: 'uppercase'
          }}>
            ¿Cuál es tu siguiente destino?
          </p>
        </div>
        
        {error && (
          <div style={{ backgroundColor: '#FEF2F2', color: '#B91C1C', border: '1px solid #FEE2E2', padding: '12px 14px', borderRadius: '0px', fontSize: '13px', fontWeight: '500', marginBottom: '25px', lineHeight: '1.4', textAlign: 'left', fontFamily: '"Montserrat", sans-serif' }}>
           {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#1E3A8A', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Correo electrónico</label>
            <input 
              type="email" 
              placeholder="nombre@ejemplo.com" 
              style={{ width: '100%', border: '1px solid #CBD5E1', padding: '12px', borderRadius: '0px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: '#1F2937', fontFamily: '"Montserrat", sans-serif', fontWeight: '400' }}
              value={credentials.email}
              onChange={e => setCredentials({...credentials, email: e.target.value})} 
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#1E3A8A', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                style={{ width: '100%', border: '1px solid #CBD5E1', padding: '12px 85px 12px 12px', borderRadius: '0px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: '#1F2937', fontFamily: '"Montserrat", sans-serif', fontWeight: '400' }}
                value={credentials.password}
                onChange={e => setCredentials({...credentials, password: e.target.value})} 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '13px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', fontFamily: '"Montserrat", sans-serif', letterSpacing: '1px' }}
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              backgroundColor: '#1E3A8A',
              color: '#ffffff', 
              fontWeight: '600', 
              padding: '14px', 
              borderRadius: '0px', 
              fontSize: '13px', 
              border: 'none', 
              cursor: 'pointer',
              marginTop: '10px',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontFamily: '"Montserrat", sans-serif',
              transition: 'background-color 0.2s'
            }}
          >
            Iniciar Sesión
          </button>
        </form>

        <div style={{ borderTop: '1px solid #E2E8F0', marginTop: '25px', paddingTop: '18px', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: '#4B5563', margin: 0, fontFamily: '"Montserrat", sans-serif', fontWeight: '400' }}>
            ¿No tienes cuenta aún?{' '}
            <Link to="/register" style={{ color: '#674ea7', fontWeight: '600', textDecoration: 'none', letterSpacing: '0.3px' }}>
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
