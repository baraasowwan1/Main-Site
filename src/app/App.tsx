import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Services from './pages/Services';
import EnhancedWebsiteBuilder from './pages/EnhancedWebsiteBuilder';
import CustomRequest from './pages/CustomRequest';
import PaymentSuccess from './pages/PaymentSuccess';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Client-facing routes only - Admin is a separate deployment */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/website-builder" element={<EnhancedWebsiteBuilder />} />
        <Route path="/custom-request" element={<CustomRequest />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
      </Routes>
    </Router>
  );
}
