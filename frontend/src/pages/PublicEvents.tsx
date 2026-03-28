import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Event } from '../types';
import { Calendar as CalendarIcon, MapPin, ArrowRight } from 'lucide-react';
import GuestNavbar from '../components/GuestNavbar';
import GuestFooter from '../components/GuestFooter';

const PublicEvents: React.FC = () => {
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ['public-events'],
    queryFn: () => api.get('/events').then(res => res.data),
  });

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      <GuestNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-black text-brand-dark mb-6 tracking-tight">Upcoming Events</h1>
          <p className="text-xl text-brand-deep max-w-2xl mx-auto font-medium">Join our community events, workshops, and seminars to grow your network and skills.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white animate-pulse rounded-[2rem] h-[32rem] shadow-sm"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {events?.map((event) => (
              <div key={event.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-500 flex flex-col hover:-translate-y-2">
                <div className="relative h-64 overflow-hidden">
                  {event.image ? (
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-brand-pale/10 flex items-center justify-center">
                      <CalendarIcon size={64} className="text-brand-medium/20" />
                    </div>
                  )}
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-brand-pale/30">
                    <div className="flex flex-col items-center">
                      <span className="text-brand-medium font-black text-lg leading-none">
                        {new Date(event.date).getDate()}
                      </span>
                      <span className="text-brand-dark font-bold text-xs uppercase tracking-wider">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex items-center text-brand-deep text-sm font-bold">
                      <MapPin size={16} className="mr-1.5 text-brand-medium" />
                      <span>{event.location || 'Online Event'}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-brand-dark mb-4 group-hover:text-brand-medium transition-colors leading-tight">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-3 mb-8 leading-relaxed font-medium">
                    {event.description}
                  </p>
                  <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                    <button className="bg-brand-medium text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-brand-light transition-all shadow-lg shadow-brand-medium/20">
                      Register Now
                    </button>
                    <button className="text-brand-dark font-bold flex items-center text-sm hover:text-brand-medium transition-colors">
                      Details <ArrowRight size={18} className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <GuestFooter />
    </div>
  );
};

export default PublicEvents;
