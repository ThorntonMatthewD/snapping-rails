import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import { Theme } from './Configs/theme';

import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import NotFound from './Pages/NotFound';


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <ThemeProvider theme={Theme}>
          <Navbar />
          <div className="content">
            <Routes>
              <Route exact path="/" element={<Home />} /> 
              <Route path="*" element={<NotFound />} /> 
            </Routes>
          </div>
          <Footer />
        </ThemeProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
