//import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer style={{ marginTop: 10}}>
            <h3 id="footer-text" style={{ color: 'white' }}>
                ©{new Date().getFullYear()} Matt Thornton
            </h3>
        </footer>
    );
}

export default Footer;
