import { Link } from 'react-router-dom';
import Logo from './Logo';
import '../../styles/footer.css';

const Footer = () => {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-main container">
        <div className="footer-brand-col">
          <Logo size="md" variant="dark" />
          <p className="footer-desc">
            From village farms to your family’s table.
            Fresh products, trusted farmers, and a direct connection.
          </p>
          <div className="footer-socials">

            <a
              href="https://www.instagram.com/farmiax_india/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="social-icon"
            >
              <i className="ri-instagram-line" />
            </a>
            <a
              href="https://www.facebook.com/people/Farmiax-India/pfbid031cevqVDsA4s27J8dTeYd7airb2fQQfePCckKScmjsPqY7WZrF8KazvC8wHyNVCzsl/?rdid=qvOcIvWIdvXaoZsR&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1CyU2gthwK%2F"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="social-icon"
            >
              <i className="ri-facebook-line" />
            </a>


          </div>
        </div>

        <div className="footer-links-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/customer/shop">Shop</Link></li>
            <li><Link to="/customer/shop">Categories</Link></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#how-it-works">Farmers</a></li>
            <li><Link to="/customer/shop">Offers</Link></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h4>Customer Service</h4>
          <ul>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Shipping & Delivery</a></li>
            <li><a href="#">Returns & Refunds</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h4>For Farmers</h4>
          <ul>
            <li><a href="#how-it-works">How it Works</a></li>
            <li><a href="#benefits">Benefits</a></li>
            <li><a href="#testimonials">Success Stories</a></li>
            <li><Link to="/farmer/signup">Join as a Farmer</Link></li>
            <li><Link to="/farmer/signin">Farmer Login</Link></li>
          </ul>
        </div>

        <div className="footer-links-col" id="about">
          <h4>Contact Us</h4>
          <ul className="footer-contact-list">
            <li>
              <i className="ri-mail-line contact-icon" />
              <span>farmiax@zohomail.in</span>
            </li>
            <li>
              <i className="ri-phone-line contact-icon" />
              <span>+91 7796372787</span>
            </li>
            <li>
              <i className="ri-map-pin-line contact-icon" />
              <span>India</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-flex">
          <p>© {new Date().getFullYear()} Farmiax. All rights reserved.</p>
          <div className="footer-legal-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
