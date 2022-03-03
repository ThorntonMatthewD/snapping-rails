import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import { Theme } from './Configs/theme';

import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import Login from './Pages/Login';
import About from './Pages/About';
import Contact from './Pages/Contact';
import NotFound from './Pages/NotFound';
import { AuthProvider } from './Contexts/AuthProvider';


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <ThemeProvider theme={Theme}>
          <AuthProvider>
            <Navbar />
            <div className="content">
              <Routes>
                <Route exact path="/" element={<Home />} /> 
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/about" element={<About />} /> 
                <Route exact path="/contact" element={<Contact />} /> 
                <Route path="*" element={<NotFound />} /> 
              </Routes>
            </div>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
