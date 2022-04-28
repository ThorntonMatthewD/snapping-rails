import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { Theme } from "./configs/theme";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthProvider";

function App() {
  return (
    <BrowserRouter basename={process.env.REACT_APP_API_URL}>
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
                <Route exact path="/profile" element={<Profile />} />
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
