import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { Flight, SearchResponse, UserResponse, BookingResponse } from '../interfaces/types';

export const FlightPage = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [airline, setAirline] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [boardingPass, setBoardingPass] = useState<any>(null);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      api.get<UserResponse>('/users/current')
        .then(res => setUser(res.data))
        .catch(() => handleLogout());
    }
    fetchFlights();
  }, []);

  const fetchFlights = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const params = new URLSearchParams();
      if (airline.trim()) params.append('airlineName', airline.trim());
      if (flightNumber.trim()) params.append('flightNumber', flightNumber.trim());
      if (dateFrom) params.append('estDepartureTimeFrom', new Date(dateFrom).toISOString());
      if (dateTo) params.append('estDepartureTimeTo', new Date(dateTo).toISOString());

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const res = await api.get<SearchResponse>(`/flights/search${queryString}`);
      setFlights(res.data.items || []);
      setError(null);
    } catch (err: any) {
      setError("Error al buscar vuelos");
    }
  };

  const handleBook = async (flightId: string | number) => {
    if (!token) {
      alert("Debes iniciar sesión para realizar una reserva.");
      navigate('/login');
      return;
    }

    try {
      const res = await api.post<BookingResponse>(`/flights/book`, { flightId });
      const bookingId = res.data.id;
      
      const saved = JSON.parse(localStorage.getItem('mis_reservas') || '[]');
      localStorage.setItem('mis_reservas', JSON.stringify([...saved, bookingId]));
      
      const details = await api.get(`/flights/book/${bookingId}`);
      setBoardingPass(details.data);
      setShowModal(true);
      setError(null);
      fetchFlights();
    } catch (err: any) {
      const mensajeEspecifico = err.response?.data?.message || "Error al procesar la reserva";
      setError(mensajeEspecifico);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const obtenerNombreLimpio = () => {
    if (!user) return 'Viajero';
    if (user.firstName && user.firstName.trim() !== '') {
      return user.firstName.trim().split(' ')[0]; 
    }
    if ((user as any).name && (user as any).name.trim() !== '') {
      return (user as any).name.trim().split(' ')[0];
    }
    const sugerencia = user.username || user.email || '';
    const parteInicial = sugerencia.split('@')[0];
    return parteInicial.charAt(0).toUpperCase() + parteInicial.slice(1);
  };

  return (
    <div style={{ backgroundColor: '#EBF3FC', minHeight: '100vh', width: '100vw', fontFamily: '"Montserrat", "Segoe UI", sans-serif', boxSizing: 'border-box', margin: 0, paddingBottom: '60px', paddingTop: '90px' }}>
      
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
                <h1 style={{ fontFamily: '"Pinyon Script", cursive', fontSize: '46px', margin: 0, fontWeight: 'normal', lineHeight: '1' }}>
          Fly Away Travel
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user && (
            <button 
              onClick={() => navigate('/mis-reservas')} 
              style={{ backgroundColor: '#10B981', color: '#ffffff', border: 'none', padding: '9px 20px', borderRadius: '0px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', fontFamily: '"Montserrat", sans-serif', letterSpacing: '1px', textTransform: 'uppercase' }}
            >
              Mis Reservas
            </button>
          )}
          {user ? (
            <button 
              onClick={handleLogout} 
              style={{ backgroundColor: '#EF4444', color: '#ffffff', border: 'none', padding: '9px 20px', borderRadius: '0px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', fontFamily: '"Montserrat", sans-serif', letterSpacing: '1px', textTransform: 'uppercase' }}
            >
              Salir
            </button>
          ) : (
            <button 
              onClick={() => navigate('/login')} 
              style={{ backgroundColor: '#1E3A8A', color: '#ffffff', border: 'none', padding: '9px 20px', borderRadius: '0px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', fontFamily: '"Montserrat", sans-serif', letterSpacing: '1px', textTransform: 'uppercase' }}
            >
              Iniciar Sesión
            </button>
          )}
        </div>
      </nav>

      {error && (
        <div style={{ color: '#B91C1C', backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2', padding: '14px', maxWidth: '1100px', margin: '20px auto', borderRadius: '0px', fontWeight: '500', fontFamily: '"Montserrat", sans-serif', fontSize: '14px' }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ maxWidth: '1140px', margin: '20px auto 30px auto', padding: '0 20px', boxSizing: 'border-box' }}>
        
        <div style={{ textAlign: 'left', marginBottom: '15px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#1E3A8A', margin: 0, fontFamily: '"Cinzel", serif', letterSpacing: '0.5px' }}>
            Hola, {obtenerNombreLimpio()} 
          </h2>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '30px 35px 35px 35px', borderRadius: '0px', border: '1px solid #D3E4F6', boxShadow: '0 4px 20px rgba(30,58,138,0.01)' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#674ea7', margin: 0, textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: '"Montserrat", sans-serif' }}>
              Reserva tu próximo destino
            </h3>
          </div>

          <form onSubmit={fetchFlights} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            
            <div style={{ flex: 1, minWidth: '180px', textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#1E3A8A', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Aerolínea</label>
              <input type="text" placeholder="Ej. LATAM" style={{ padding: '12px', border: '1px solid #CBD5E1', borderRadius: '0px', width: '100%', boxSizing: 'border-box', fontSize: '14px', outline: 'none', fontFamily: '"Montserrat", sans-serif' }} value={airline} onChange={e => setAirline(e.target.value)} />
            </div>
            
            <div style={{ flex: 1, minWidth: '140px', textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#1E3A8A', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>N° Vuelo</label>
              <input type="text" placeholder="Ej. LA101" style={{ padding: '12px', border: '1px solid #CBD5E1', borderRadius: '0px', width: '100%', boxSizing: 'border-box', fontSize: '14px', outline: 'none', fontFamily: '"Montserrat", sans-serif' }} value={flightNumber} onChange={e => setFlightNumber(e.target.value)} />
            </div>
            
            <div style={{ textAlign: 'left', flex: 1, minWidth: '160px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#1E3A8A', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Fecha Desde</label>
              <input type="datetime-local" style={{ padding: '11px', border: '1px solid #CBD5E1', borderRadius: '0px', color: '#334155', fontSize: '14px', width: '100%', boxSizing: 'border-box', outline: 'none', fontFamily: '"Montserrat", sans-serif' }} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            </div>
            
            <div style={{ textAlign: 'left', flex: 1, minWidth: '160px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#1E3A8A', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Fecha Hasta</label>
              <input type="datetime-local" style={{ padding: '11px', border: '1px solid #CBD5E1', borderRadius: '0px', color: '#334155', fontSize: '14px', width: '100%', boxSizing: 'border-box', outline: 'none', fontFamily: '"Montserrat", sans-serif' }} value={dateTo} onChange={e => setDateTo(e.target.value)} />
            </div>
            
            <button type="submit" style={{ backgroundColor: '#1E3A8A', color: '#ffffff', padding: '14px 35px', borderRadius: '0px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '13px', fontFamily: '"Montserrat", sans-serif', textTransform: 'uppercase', minWidth: '130px', letterSpacing: '1.5px' }}>
              Buscar
            </button>
            
          </form>
        </div>

      </div>

      <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 20px', boxSizing: 'border-box' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '0px', overflow: 'hidden', border: '1px solid #D3E4F6', boxShadow: '0 4px 15px rgba(30,58,138,0.01)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #D3E4F6' }}>
                <th style={{ padding: '18px 20px', fontSize: '12px', color: '#1E3A8A', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: '"Montserrat", sans-serif' }}>Número</th>
                <th style={{ padding: '18px 20px', fontSize: '12px', color: '#1E3A8A', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: '"Montserrat", sans-serif' }}>Aerolínea</th>
                <th style={{ padding: '18px 20px', fontSize: '12px', color: '#1E3A8A', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: '"Montserrat", sans-serif' }}>Salida</th>
                <th style={{ padding: '18px 20px', fontSize: '12px', color: '#1E3A8A', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: '"Montserrat", sans-serif' }}>Llegada</th>
                <th style={{ padding: '18px 20px', fontSize: '12px', color: '#1E3A8A', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: '"Montserrat", sans-serif' }}>Asientos</th>
                <th style={{ padding: '18px 20px', fontSize: '12px', color: '#1E3A8A', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: '"Montserrat", sans-serif', textAlign: 'center' }}>Acción</th>
              </tr>
            </thead>
            <tbody>

                            {flights.map((f) => (
                <tr key={f.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '600', color: '#674ea7', fontFamily: '"Montserrat", sans-serif' }}>
                    {f.flightNumber}
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#334155', fontFamily: '"Montserrat", sans-serif' }}>
                    {f.airlineName}
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '13px', color: '#475569', fontFamily: '"Montserrat", sans-serif' }}>
                    {new Date(f.estDepartureTime).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '13px', color: '#475569', fontFamily: '"Montserrat", sans-serif' }}>
                    {new Date(f.estArrivalTime).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#10B981', fontWeight: '600', fontFamily: '"Montserrat", sans-serif' }}>
                    {f.availableSeats} disponibles
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                    <button 
                      onClick={() => handleBook(f.id)} 
                      disabled={f.availableSeats <= 0}
                      style={{ 
                        backgroundColor: f.availableSeats > 0 ? '#1E3A8A' : '#94A3B8', 
                        color: '#ffffff', 
                        border: 'none', 
                        padding: '10px 22px', 
                        borderRadius: '0px', 
                        cursor: f.availableSeats > 0 ? 'pointer' : 'not-allowed', 
                        fontWeight: '600', 
                        fontSize: '12px', 
                        fontFamily: '"Montserrat", sans-serif', 
                        textTransform: 'uppercase', 
                        letterSpacing: '1px',
                        transition: 'background-color 0.2s'
                      }}
                    >
                      {f.availableSeats > 0 ? 'Reservar' : 'Agotado'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {flights.length === 0 && (
            <div style={{ padding: '50px', textAlign: 'center', color: '#64748B', fontWeight: '400', fontSize: '14px', fontFamily: '"Montserrat", sans-serif', letterSpacing: '0.5px' }}>
              No se encontraron itinerarios disponibles para esta búsqueda.
            </div>
          )}
        </div>
      </div>

      {showModal && boardingPass && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
          <div style={{ backgroundColor: '#ffffff', padding: '0px', borderRadius: '0px', maxWidth: '420px', width: '100%', border: '1px solid #D3E4F6', boxSizing: 'border-box', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            
            <div style={{ backgroundColor: '#1E3A8A', padding: '20px', textAlign: 'center' }}>
              <h2 style={{ margin: 0, color: '#ffffff', fontSize: '18px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: '"Cinzel", serif' }}>
                Pase de Abordar
              </h2>
            </div>

            <div style={{ padding: '30px 25px 25px 25px', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px', color: '#374151', textAlign: 'left', fontFamily: '"Montserrat", sans-serif' }}>
              <p style={{ margin: 0, borderBottom: '1px dashed #D3E4F6', paddingBottom: '8px' }}>
                <span style={{ color: '#94A3B8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>Código Reserva</span>
                <span style={{ fontWeight: '700', color: '#10B981', fontSize: '16px' }}>#{boardingPass.id}</span>
              </p>
              <p style={{ margin: 0, borderBottom: '1px dashed #D3E4F6', paddingBottom: '8px' }}>
                <span style={{ color: '#94A3B8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>Pasajero</span>
                <span style={{ fontWeight: '600', color: '#1E3A8A' }}>{boardingPass.customerFirstName} {boardingPass.customerLastName}</span>
              </p>
              <p style={{ margin: 0, borderBottom: '1px dashed #D3E4F6', paddingBottom: '8px' }}>
                <span style={{ color: '#94A3B8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>Vuelo / Línea</span>
                <span style={{ fontWeight: '600', color: '#674ea7' }}>{boardingPass.flightNumber}</span> — {boardingPass.airlineName}
              </p>
              <p style={{ margin: 0, paddingBottom: '8px' }}>
                <span style={{ color: '#94A3B8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>Fecha de Emisión</span>
                <span style={{ fontWeight: '500', color: '#334155' }}>{new Date(boardingPass.bookingDate).toLocaleString()}</span>
              </p>
              
              <button 
                onClick={() => setShowModal(false)} 
                style={{ width: '100%', padding: '13px', borderRadius: '0px', border: 'none', backgroundColor: '#1E3A8A', color: '#ffffff', cursor: 'pointer', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase', fontFamily: '"Montserrat", sans-serif', letterSpacing: '1.5px', marginTop: '10px' }}
              >
                Cerrar Confirmación
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
