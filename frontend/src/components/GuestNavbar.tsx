import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, LogIn, UserPlus } from 'lucide-react';

const GuestNavbar: React.FC = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 h-20 flex items-center font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/asset/image.png" alt="logo" className="h-12 w-auto" />
              <span className="text-2xl font-black text-brand-dark tracking-tight">
                MemberShip<span className="text-brand-medium">Pro</span>
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-10">
            <Link to="/" className="text-gray-900 hover:text-brand-medium font-bold transition-all hover:-translate-y-0.5">Home</Link>
            <Link to="/about" className="text-gray-900 hover:text-brand-medium font-bold transition-all hover:-translate-y-0.5">About</Link>
            <Link to="/services" className="text-gray-900 hover:text-brand-medium font-bold transition-all hover:-translate-y-0.5">Services</Link>
            <Link to="/events" className="text-gray-900 hover:text-brand-medium font-bold transition-all hover:-translate-y-0.5">Events</Link>
            <Link to="/blogs" className="text-gray-900 hover:text-brand-medium font-bold transition-all hover:-translate-y-0.5">Blogs</Link>
            <Link to="/contact" className="text-gray-900 hover:text-brand-medium font-bold transition-all hover:-translate-y-0.5">Contact</Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <Link
                to="/dashboard"
                className="bg-brand-medium text-white px-6 py-2.5 rounded-full font-bold hover:bg-brand-light transition-all shadow-lg shadow-brand-medium/20 flex items-center space-x-2"
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-900 font-bold hover:text-brand-medium transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-brand-medium text-white px-6 py-2.5 rounded-full font-bold hover:bg-brand-light transition-all shadow-lg shadow-brand-medium/20"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default GuestNavbar;
