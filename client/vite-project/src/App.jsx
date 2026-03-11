import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import SweetCollection from './pages/SweetCollection';
import GiftPacks from './pages/GiftPacks';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import UserDashboard from './pages/UserDashboard';
import AuthModal from './components/AuthModal';

function App() {
  return (
    <Router>
      <div className="relative flex min-h-screen flex-col">
        <Navbar />
        <AuthModal />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/sweets" element={<SweetCollection />} />
            <Route path="/gifts" element={<GiftPacks />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/confirmation" element={<OrderConfirmation />} />
            <Route path="/dashboard" element={<UserDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
