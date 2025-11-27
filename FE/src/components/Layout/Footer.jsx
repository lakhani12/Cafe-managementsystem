import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, MapPin, Phone, Mail, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4">
            <div className="d-flex align-items-center mb-3">
              <Coffee className="me-2" size={24} />
              <h5 className="mb-0">Cafe Delight</h5>
            </div>
            <p className="text-light">
              Experience the perfect blend of taste and ambiance at Cafe Delight. We serve the
              finest coffee and delicious meals in a cozy atmosphere.
            </p>
          </div>

          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="text-cafe-primary mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-light text-decoration-none">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/menu" className="text-light text-decoration-none">
                  Menu
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-light text-decoration-none">
                  About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-light text-decoration-none">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <h6 className="text-cafe-primary mb-3">Contact Info</h6>
            <div className="d-flex align-items-center mb-2">
              <MapPin size={16} className="me-2 text-cafe-secondary" />
              <span className="text-light">1,2,3,12th flore,MBH laxuriya varachha surat,Gujarat,India</span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <Phone size={16} className="me-2 text-cafe-secondary" />
              <span className="text-light">+91 9106182982</span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <Mail size={16} className="me-2 text-cafe-secondary" />
              <span className="text-light">delightcafe@gmail.com</span>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <h6 className="text-cafe-primary mb-3">Opening Hours</h6>
            <div className="d-flex align-items-center mb-2">
              <Clock size={16} className="me-2 text-cafe-secondary" />
              <div>
                <div className="text-light">Mon - Fri: 7:00 AM - 9:00 PM</div>
                <div className="text-light">Sat - Sun: 8:00 AM - 10:00 PM</div>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-4" />
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="text-light mb-0">© 2025 Cafe Delight. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="text-light mb-0">Made with ❤️ for coffee lovers</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
