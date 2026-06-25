import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { UserResponse } from '../interfaces/types';

export const BookingListPage = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const cargarHistorial = async () => {
      try {
        const perfilRes = await api.get<UserResponse>('/users/current');
        const usuarioActual = perfilRes.data;

        const idsGuardados: number[] = JSON.parse(localStorage.getItem('mis_reservas') || '[]');
        
        if (idsGuardados.length === 0) {
          setBookings([]);
          setLoading(false);
          return;
        }

        const peticiones = idsGuardados.map(id => 
          api.get(`/flights/book/${id}`).then(res => res.data).catch(() => null)
        );
        
        const resultados = await Promise.all(peticiones);
        
        const reservasValidadas = resultados.filter(b => {
          if (!b) return false;
          
          const esMismoId = b.customerId === usuarioActual.id;
          const esMismoNombre = b.customerFirstName?.trim().toLowerCase() === usuarioActual.firstName?.trim().toLowerCase();
          
          return esMismoId || esMismoNombre;
        });

        setBookings(reservasValidadas);
      } catch (err: any) {
        console.error("Error filtrando el historial:", err);
        setError("Error al recuperar tu historial privado de pases de abordar.");
      } finally {
        setLoading(false);
      }
    };

    cargarHistorial();
  }, [token, navigate]);

  return (
    <div style={{ backgroundColor: '#EBF3FC', minHeight: '100vh', width: '100vw', fontFamily: '"Montserrat", "Segoe UI", sans-serif', boxSizing: 'border-box', paddingBottom: '60px', paddingTop: '90px' }}>
      
      <style>{`
        @import url('https://googleapis.com');
      `}</style>
      
      <nav style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        zIndex: 1000,
        backgroundColor: '#DFEAF7', 
        color: '#1E3A8A', 
        padding: '18px 40px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderRadius: '0px',
        boxSizing: 'border-box',
        borderBottom: '1px solid #C5D6E8'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '22px', opacity: 0.85 }}></span>
          <h1 style={{ fontFamily: '"Cinzel", serif', fontSize: '24px', margin: 0, fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Mis Viajes
          </h1>
        </div>
        <button 
          onClick={() => navigate('/')} 
          style={{ backgroundColor: '#1E3A8A', color: '#ffffff', border: 'none', padding: '10px 24px', borderRadius: '0px', cursor: 'pointer', fontWeight: '600', fontSize: '12px', fontFamily: '"Montserrat", sans-serif', letterSpacing: '1.5px', textTransform: 'uppercase', transition: 'background-color 0.2s' }}
        >
          Volver al Buscador
        </button>
      </nav>

      {error && (
        <div style={{ color: '#B91C1C', backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2', textAlign: 'center', padding: '14px', maxWidth: '800px', margin: '20px auto', borderRadius: '0px', fontWeight: '500', fontFamily: '"Montserrat", sans-serif', fontSize: '14px' }}>
          error {error}
        </div>
      )}

      <div style={{ maxWidth: '850px', margin: '30px auto', padding: '0 20px', boxSizing: 'border-box' }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#1E3A8A', fontWeight: '500', letterSpacing: '1px', fontFamily: '"Montserrat", sans-serif' }}>Sincronizando pases de abordar...</p>
        ) : bookings.length === 0 ? (
          <div style={{ backgroundColor: '#ffffff', padding: '60px', borderRadius: '0px', textAlign: 'center', border: '1px solid #D3E4F6', color: '#64748B', fontFamily: '"Montserrat", sans-serif', letterSpacing: '0.5px', fontSize: '15px' }}>
            No tienes reservas guardadas en este dispositivo.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {bookings.map((b) => (
              <div 
                key={b.id} 
                style={{ backgroundColor: '#ffffff', borderRadius: '0px', border: '1px solid #D3E4F6', borderLeft: '6px solid #1E3A8A', padding: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box', boxShadow: '0 4px 15px rgba(30,58,138,0.01)' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', backgroundColor: '#F1F5F9', color: '#1E3A8A', padding: '5px 12px', borderRadius: '0px', textTransform: 'uppercase', letterSpacing: '1.5px', width: 'max-content', fontFamily: '"Montserrat", sans-serif' }}>
                    RESERVA CONFIRMADA #{b.id}
                  </span>
                  <h3 style={{ margin: '8px 0 2px 0', color: '#1E3A8A', fontSize: '22px', fontWeight: '600', fontFamily: '"Cinzel", serif', letterSpacing: '0.5px' }}>
                    {b.airlineName} — <span style={{ color: '#674ea7', fontWeight: '400' }}>{b.flightNumber}</span>
                  </h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#475569', fontWeight: '400', fontFamily: '"Montserrat", sans-serif', letterSpacing: '0.3px' }}>
                    <span style={{ color: '#94A3B8', fontWeight: '500', textTransform: 'uppercase', fontSize: '12px', marginRight: '6px' }}>Pasajero</span> 
                    <span style={{ fontWeight: '600', color: '#1E3A8A' }}>{b.customerFirstName} {b.customerLastName}</span>
                  </p>
                </div>

                <div style={{ textAlign: 'right', borderLeft: '1px dashed #D3E4F6', paddingLeft: '40px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: '"Montserrat", sans-serif' }}>Fecha de Salida</span>
                  <p style={{ margin: '8px 0 0 0', fontWeight: '600', color: '#1E3A8A', fontSize: '15px', fontFamily: '"Montserrat", sans-serif', letterSpacing: '0.5px' }}>
                    {new Date(b.estDepartureTime).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
