import "./App.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute'
import Privacy from "./pages/Privacy";
import EditProfile from "./pages/EditProfile";
import NotFoundPage from "./pages/NotFoundPage";
import ContactUs from "./pages/ContactUs";
import Terms from "./pages/Terms";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route element={<PublicOnlyRoute />}> 
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
        </Route>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/about" element={<div>About Page</div>} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/privacy" element={<Privacy/>} />
        <Route path="/terms" element={<Terms/>} />
      </Routes>
      <Footer />
    </>
  );
}
export default App;

