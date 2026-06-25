import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { FlightPage } from './pages/FlightPage';
import { BookingListPage } from './pages/BookingListPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FlightPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/mis-reservas" element={<BookingListPage />} />
        {/* Redirección automática si intentan acceder a una url rota */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
