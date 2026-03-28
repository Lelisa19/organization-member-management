import React from 'react';
import { Link } from 'react-router-dom';
import GuestNavbar from '../components/GuestNavbar';
import GuestFooter from '../components/GuestFooter';
import { Target, Users, Globe, ShieldCheck, Calendar, Award } from 'lucide-react';

const About: React.FC = () => {
  const timeline = [
    {
      year: '2015',
      title: 'Our Humble Beginnings',
      desc: 'Founded by a team of nonprofit professionals and tech enthusiasts who saw the need for better membership management tools.',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2070&auto=format&fit=crop'
    },
    {
      year: '2017',
      title: 'First Major Release',
      desc: 'Launched our comprehensive membership management platform serving 100+ organizations. Received the "Innovation in Nonprofit Tech" award.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop'
    },
    {
      year: '2020',
      title: 'Global Expansion',
      desc: 'Expanded to serve international organizations. Launched multilingual support and added 15 new team members across 3 continents.',
      image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2070&auto=format&fit=crop'
    },
    {
      year: '2023',
      title: "Today's OMMS",
      desc: 'Supporting over 12,000 organizations worldwide with a team of 45+ dedicated professionals.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop'
    }
  ];
  const stats = [
    { label: 'Founded', value: '2022', icon: <Target className="text-brand-medium" /> },
    { label: 'Users Worldwide', value: '50K+', icon: <Users className="text-brand-medium" /> },
    { label: 'Active Orgs', value: '5,000+', icon: <Globe className="text-brand-medium" /> },
    { label: 'Uptime', value: '99.9%', icon: <ShieldCheck className="text-brand-medium" /> },
  ];

  return (
    <div className="min-h-screen bg-white font-poppins">
      <GuestNavbar />

      <section className="relative pt-24 pb-32 overflow-hidden bg-brand-pale/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-10">
            <h1 className="text-5xl md:text-6xl font-black text-brand-dark leading-tight tracking-tight">
              Our Mission is to Empower <span className="text-brand-medium">Your Community</span>
            </h1>
            <p className="text-xl text-brand-deep leading-relaxed font-medium">
              We started MemberShip Pro with a simple goal: to help organization admins focus on building their community rather than managing their database and billing.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <div className="space-y-10">
                <h2 className="text-4xl font-black text-brand-dark leading-tight tracking-tight">Why We Built MemberShip Pro</h2>
                <div className="space-y-8">
                   <div className="flex space-x-6 group">
                      <div className="flex-shrink-0 w-16 h-16 bg-brand-pale/30 rounded-2xl flex items-center justify-center text-brand-medium group-hover:bg-brand-medium group-hover:text-white transition-all duration-300">
                         <Target size={28} />
                      </div>
                      <div>
                         <h3 className="text-2xl font-bold text-brand-dark mb-3 uppercase tracking-wide">Efficiency First</h3>
                         <p className="text-gray-600 leading-relaxed text-lg font-medium">We focus on eliminating repetitive tasks with smart automation, from membership renewals to automated event reminders.</p>
                      </div>
                   </div>
                   <div className="flex space-x-6 group">
                      <div className="flex-shrink-0 w-16 h-16 bg-brand-pale/30 rounded-2xl flex items-center justify-center text-brand-medium group-hover:bg-brand-medium group-hover:text-white transition-all duration-300">
                         <ShieldCheck size={28} />
                      </div>
                      <div>
                         <h3 className="text-2xl font-bold text-brand-dark mb-3 uppercase tracking-wide">Data Security</h3>
                         <p className="text-gray-600 leading-relaxed text-lg font-medium">Security is our top priority. We use modern encryption and security protocols to ensure your data stays private.</p>
                      </div>
                   </div>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-10">
                {stats.map((stat, idx) => (
                  <div key={idx} className="p-10 rounded-[2.5rem] bg-gray-50 border border-gray-100 flex flex-col items-center text-center space-y-6 hover:shadow-2xl transition-all transform hover:-translate-y-2 group">
                    <div className="p-5 bg-white rounded-2xl shadow-md text-brand-medium group-hover:bg-brand-medium group-hover:text-white transition-all duration-300">{stat.icon}</div>
                    <div>
                      <h4 className="text-4xl font-black text-brand-dark">{stat.value}</h4>
                      <p className="text-sm font-bold text-brand-deep uppercase tracking-widest">{stat.label}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-brand-dark tracking-tight mb-4">Our Journey</h2>
            <p className="text-brand-deep font-medium">From a small team to a global community management leader</p>
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-brand-pale hidden lg:block"></div>
            
            <div className="space-y-20">
              {timeline.map((item, idx) => (
                <div key={idx} className={`flex flex-col lg:flex-row items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className="lg:w-1/2 px-10">
                    <div className="relative group overflow-hidden rounded-[2rem] shadow-2xl">
                      <img src={item.image} alt={item.title} className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-6 left-6 bg-brand-medium text-white px-6 py-2 rounded-full font-black text-xl shadow-lg">
                        {item.year}
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:w-1/2 px-10 mt-10 lg:mt-0 text-center lg:text-left">
                    <h3 className="text-3xl font-black text-brand-dark mb-4 tracking-tight">{item.title}</h3>
                    <p className="text-lg text-gray-600 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-brand-dark text-white text-center space-y-10">
         <h2 className="text-5xl font-black tracking-tight">Ready to join our community?</h2>
         <p className="text-brand-pale/70 text-xl max-w-xl mx-auto leading-relaxed font-medium">Join over 12,000 organizations and experience the power of modern community management.</p>
         <Link 
            to="/register"
            className="inline-block bg-brand-medium text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-brand-light transition-all shadow-2xl hover:shadow-brand-medium/30"
          >
            Get Started Now
          </Link>
      </section>

      <GuestFooter />
    </div>
  );
};

export default About;
