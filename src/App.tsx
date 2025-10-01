import "./App.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";


function App() {
 
  return <>
    <Navbar/>
    <Register/>
    <Login/>
    <Footer/>
  </>;
}
export default App;
