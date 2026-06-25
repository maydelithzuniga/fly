import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import type { RegisterRequest } from '../interfaces/types';

export const RegisterPage = () => {
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    firstName: '',
    lastName: '',
    password: ''
  });

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.email.trim() || !formData.firstName.trim() || !formData.lastName.trim() || !formData.password.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    const nombreRegex = /^[A-Z][a-zA-Z]*$/;
    if (!nombreRegex.test(formData.firstName) || !nombreRegex.test(formData.lastName)) {
      setError('El Nombre y Apellido deben comenzar mayúscula.');
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('La contraseña debe tener mínimo 8 caracteres, incluir al menos una letra Mayúscula y un número.');
      return;
    }

    try {
      await api.post('/users/register', formData);
      setSuccess('¡Registro exitoso! Redirigiendo al inicio de sesión...');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err: any) {
      console.error("Detalle completo del error 400:", err.response);
      
      const responseData = err.response?.data;
      let mensajeEspecifico = '';

      if (responseData) {
        if (responseData.message) {
          mensajeEspecifico = responseData.message;
        } 
        else if (responseData.error) {
          mensajeEspecifico = responseData.error;
        }
        else if (Array.isArray(responseData.errors) && responseData.errors.length > 0) {
          mensajeEspecifico = responseData.errors.join(", ");
        }
      }

      if (!mensajeEspecifico) {
        if (err.response?.status === 400) {
          mensajeEspecifico = 'El correo electrónico ya se encuentra registrado.';
        } else {
          mensajeEspecifico = err.message || 'Error de conexión con el servidor.';
        }
      }

      setError(mensajeEspecifico);
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
      
      {/* Carga e inyección de las fuentes de lujo */}
      <style>{`
        @import url('https://googleapis.com');
      `}</style>

      <div style={{
        backgroundColor: '#ffffff',
        padding: '45px 40px',
        borderRadius: '0px',
        boxShadow: '0 10px 30px rgba(15, 30, 67, 0.03)',
        width: '460px',
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
            Empieza tu primer viaje
          </p>
        </div>
        
        {error && (
          <div style={{ backgroundColor: '#FEF2F2', color: '#B91C1C', border: '1px solid #FEE2E2', padding: '12px 14px', borderRadius: '0px', fontSize: '13px', fontWeight: '500', marginBottom: '25px', lineHeight: '1.4', textAlign: 'left', fontFamily: '"Montserrat", sans-serif' }}>
             {error}
          </div>
        )}

        {success && (
          <div style={{ backgroundColor: '#ECFDF5', color: '#047857', border: '1px solid #D1FAE5', padding: '12px 14px', borderRadius: '0px', fontSize: '13px', fontWeight: '500', textAlign: 'center', marginBottom: '25px', fontFamily: '"Montserrat", sans-serif' }}>
            check {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#1E3A8A', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Nombre</label>
              <input 
                type="text" 
                placeholder="Nombre" 
                style={{ width: '100%', border: '1px solid #CBD5E1', padding: '12px', borderRadius: '0px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: '#1F2937', fontFamily: '"Montserrat", sans-serif', fontWeight: '400' }}
                value={formData.firstName}
                onChange={e => setFormData({...formData, firstName: e.target.value})} 
              />
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#1E3A8A', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Apellido</label>
              <input 
                type="text" 
                placeholder="Apellido" 
                style={{ width: '100%', border: '1px solid #CBD5E1', padding: '12px', borderRadius: '0px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: '#1F2937', fontFamily: '"Montserrat", sans-serif', fontWeight: '400' }}
                value={formData.lastName}
                onChange={e => setFormData({...formData, lastName: e.target.value})} 
              />
            </div>
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#1E3A8A', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Correo electrónico</label>
            <input 
              type="email" 
              placeholder="nombre@ejemplo.com" 
              style={{ width: '100%', border: '1px solid #CBD5E1', padding: '12px', borderRadius: '0px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: '#1F2937', fontFamily: '"Montserrat", sans-serif', fontWeight: '400' }}
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})} 
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#1E3A8A', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                style={{ width: '100%', border: '1px solid #CBD5E1', padding: '12px 85px 12px 12px', borderRadius: '0px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: '#1F2937', fontFamily: '"Montserrat", sans-serif', fontWeight: '400' }}
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})} 
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
            Registrarse
          </button>
        </form>

        <div style={{ borderTop: '1px solid #E2E8F0', marginTop: '25px', paddingTop: '18px', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: '#4B5563', margin: 0, fontFamily: '"Montserrat", sans-serif', fontWeight: '400' }}>
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" style={{ color: '#674ea7', fontWeight: '600', textDecoration: 'none', letterSpacing: '0.3px' }}>
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
