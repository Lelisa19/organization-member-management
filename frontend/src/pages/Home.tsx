import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, CreditCard, Smile, ChevronRight } from 'lucide-react';
import GuestNavbar from '../components/GuestNavbar';
import GuestFooter from '../components/GuestFooter';

import './Home.css';

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: '/asset/membership-management-system.webp',
      title: 'Streamline Your Membership Management',
      subtitle: 'OMMS provides powerful tools to manage members, events, and payments all in one platform.',
    },
    {
      image: '/asset/c_magnifying_glass_with_illustrative_people_dark.jpg',
      title: 'Plan and Manage Unforgettable Events',
      subtitle: 'Everything you need to organize, promote, and track attendance for your events.',
    },
    {
      image: '/asset/eventmanagementpowerpointpresentationslides-210810034621-thumbnail.webp',
      title: 'Secure and Easy Payment Processing',
      subtitle: 'Accept membership fees, event registrations, and donations with ease.',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { label: 'Organizations', value: '1000+', icon: <Users size={24} /> },
    { label: 'Events Managed', value: '1009+', icon: <Calendar size={24} /> },
    { label: 'Million Processed', value: '1M+', icon: <CreditCard size={24} /> },
    { label: 'Satisfaction', value: '100%', icon: <Smile size={24} /> },
  ];

  const features = [
    {
      title: 'Member Management',
      desc: 'Easily manage member profiles, groups, and communication with our intuitive interface.',
      icon: <Users className="text-brand-medium" />,
    },
    {
      title: 'Event Coordination',
      desc: "Plan, promote, and track attendance for all your organization's events in one place.",
      icon: <Calendar className="text-brand-medium" />,
    },
    {
      title: 'Payment Processing',
      desc: 'Secure payment collection with support for multiple gateways and recurring billing.',
      icon: <CreditCard className="text-brand-medium" />,
    },
  ];

  return (
    <div className="min-h-screen bg-white font-poppins">
      <GuestNavbar />

      {/* Hero Slider */}
      <section className="relative h-[85vh] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out hero-slide ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            style={{ '--bg-image': `url(${slide.image})` } as React.CSSProperties}          >
            <div
              className="absolute inset-0 bg-hero bg-cover bg-center bg-no-repeat transition-transform duration-[5000ms] scale-105"
            ></div>
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-down">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl mb-10 max-w-3xl animate-fade-in-up">
                {slide.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-up">
                <Link
                  to="/register"
                  className="bg-brand-medium text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-light transition-all shadow-lg hover:shadow-brand-medium/30"
                >
                  Get Started
                </Link>
                <Link
                  to="/services"
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-brand-medium transition-all"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        ))}
        {/* Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              title={`Go to slide ${index + 1}`}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-brand-medium w-8' : 'bg-white/50'
              }`}
            ></button>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-brand-pale/20 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-md text-brand-medium mb-6 group-hover:bg-brand-medium group-hover:text-white transition-all duration-300">
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-bold text-brand-dark mb-2">{stat.value}</h3>
                <p className="text-brand-deep font-medium uppercase tracking-wider text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-brand-dark mb-4 relative inline-block">
              Powerful Features
              <span className="block w-20 h-1 bg-brand-medium mx-auto mt-4 rounded-full"></span>
            </h2>
            <p className="text-xl text-brand-deep max-w-2xl mx-auto font-medium mt-4">Everything you need to manage your organization efficiently</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, idx) => (
              <div key={idx} className="p-10 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl bg-brand-pale/30 flex items-center justify-center mb-8 text-brand-medium group-hover:bg-brand-medium group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-brand-dark mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg mb-6">{feature.desc}</p>
                <Link to="/services" className="text-brand-medium font-bold flex items-center group-hover:underline">
                  Details <ChevronRight size={20} className="ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GuestFooter />
    </div>
  );
};

export default Home;
