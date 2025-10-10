import "./App.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ListDetails from "./pages/ListDetails";
import Profile from "./pages/Profile";
import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute'
import Privacy from "./pages/Privacy";
import EditProfile from "./pages/EditProfile";
import NotFoundPage from "./pages/NotFoundPage";
import ContactUs from "./pages/ContactUs";
import Terms from "./pages/Terms";
import LandingPage from "./pages/LandingPage";
import About from "./pages/About";

function App() {
  return (
    <div className="app-shell">
     
      <div className="app-content">
      <Routes>
        <Route element={<PublicOnlyRoute />}> 
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<LandingPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/home/:listId" element={<ListDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
        </Route>
        
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/privacy" element={<Privacy/>} />
        <Route path="/terms" element={<Terms/>} />
      </Routes>
      </div>
     
    </div>
  );
}
export default App;

