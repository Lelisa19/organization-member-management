import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const GuestFooter: React.FC = () => {
  return (
    <footer className="bg-brand-dark text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <img src="/asset/image.png" alt="logo" className="h-10 w-auto brightness-0 invert" />
              <span className="text-2xl font-black tracking-tight">
                MemberShip<span className="text-brand-light">Pro</span>
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed mb-8">
              Modernizing the way organizations manage their membership experience through seamless integration and powerful tools.
            </p>
            <div className="flex space-x-4">
              <a href="#" title="Facebook" className="w-10 h-10 bg-brand-deep/30 rounded-xl flex items-center justify-center hover:bg-brand-medium transition-all group">
                <Facebook size={20} className="text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" title="Twitter" className="w-10 h-10 bg-brand-deep/30 rounded-xl flex items-center justify-center hover:bg-brand-medium transition-all group">
                <Twitter size={20} className="text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" title="Instagram" className="w-10 h-10 bg-brand-deep/30 rounded-xl flex items-center justify-center hover:bg-brand-medium transition-all group">
                <Instagram size={20} className="text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" title="LinkedIn" className="w-10 h-10 bg-brand-deep/30 rounded-xl flex items-center justify-center hover:bg-brand-medium transition-all group">
                <Linkedin size={20} className="text-gray-400 group-hover:text-white" />
              </a>
            </div>
          </div>

          <div>
            <h5 className="text-lg font-bold mb-8 text-brand-pale uppercase tracking-widest">Quick Links</h5>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-gray-400 hover:text-brand-light transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-brand-light transition-colors">Our Services</Link></li>
              <li><Link to="/events" className="text-gray-400 hover:text-brand-light transition-colors">Upcoming Events</Link></li>
              <li><Link to="/blogs" className="text-gray-400 hover:text-brand-light transition-colors">Latest Blogs</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-lg font-bold mb-8 text-brand-pale uppercase tracking-widest">Support</h5>
            <ul className="space-y-4">
              <li><Link to="/contact" className="text-gray-400 hover:text-brand-light transition-colors">Contact Us</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-brand-light transition-colors">Pricing Plans</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-brand-light transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-brand-light transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-lg font-bold mb-8 text-brand-pale uppercase tracking-widest">Contact Info</h5>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4">
                <MapPin size={22} className="text-brand-medium shrink-0 mt-1" />
                <span className="text-gray-400">123 Business Avenue, Tech City, TC 54321</span>
              </li>
              <li className="flex items-center space-x-4">
                <Phone size={22} className="text-brand-medium shrink-0" />
                <span className="text-gray-400">+1 (234) 567-890</span>
              </li>
              <li className="flex items-center space-x-4">
                <Mail size={22} className="text-brand-medium shrink-0" />
                <span className="text-gray-400">support@membership-pro.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-deep/30 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-gray-500 text-sm font-medium">
          <p>© 2026 MemberShip Pro. All rights reserved.</p>
          <div className="flex space-x-8">
            <a href="#" className="hover:text-brand-light transition-colors">Cookie Settings</a>
            <a href="#" className="hover:text-brand-light transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default GuestFooter;
