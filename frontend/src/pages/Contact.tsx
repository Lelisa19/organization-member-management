import React, { useState } from 'react';
import GuestNavbar from '../components/GuestNavbar';
import GuestFooter from '../components/GuestFooter';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  const contactInfo = [
    { label: 'Email', value: 'support@membership-pro.com', icon: <Mail size={24} /> },
    { label: 'Phone', value: '+1 (555) 123-4567', icon: <Phone size={24} /> },
    { label: 'Address', value: '123 Innovation Drive, Tech City, CA 94103', icon: <MapPin size={24} /> },
    { label: 'Hours', value: 'Mon - Fri, 9am - 6pm EST', icon: <Clock size={24} /> },
  ];

  return (
    <div className="min-h-screen bg-white font-poppins">
      <GuestNavbar />

      <section className="relative pt-24 pb-32 bg-brand-pale/10 overflow-hidden text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
           <h1 className="text-5xl md:text-6xl font-black text-brand-dark leading-tight tracking-tight">
             Get in <span className="text-brand-medium">Touch</span>
           </h1>
           <p className="text-xl text-brand-deep max-w-3xl mx-auto leading-relaxed font-medium">
             Have questions or need assistance? Our team is here to help you get the most out of MemberShip Pro.
           </p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-20">
           <div className="space-y-16">
              <div className="space-y-6">
                 <h2 className="text-4xl font-black text-brand-dark tracking-tight">Contact Information</h2>
                 <p className="text-gray-600 leading-relaxed max-w-md text-lg font-medium">Reach out through any of these channels and we will get back to you within 24 hours.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                 {contactInfo.map((info, idx) => (
                    <div key={idx} className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100 flex flex-col space-y-6 hover:shadow-2xl transition-all transform hover:-translate-y-2 group">
                       <div className="w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center text-brand-medium group-hover:bg-brand-medium group-hover:text-white transition-all duration-300">{info.icon}</div>
                       <div>
                          <h4 className="text-xs font-black text-brand-deep uppercase tracking-widest mb-2">{info.label}</h4>
                          <p className="text-brand-dark font-bold text-lg">{info.value}</p>
                       </div>
                    </div>
                 ))}
              </div>
              <div className="p-10 rounded-[2.5rem] bg-brand-medium text-white flex items-center justify-between space-x-8 shadow-2xl relative overflow-hidden group">
                 <div className="absolute -right-8 -top-8 w-32 h-32 bg-white opacity-10 rounded-full group-hover:scale-125 transition-transform duration-500"></div>
                 <div className="relative z-10">
                    <h3 className="text-2xl font-black mb-2 uppercase tracking-wide">Live Chat</h3>
                    <p className="text-brand-pale/80 text-sm font-bold leading-relaxed">Chat with us live for instant support and guidance.</p>
                 </div>
                 <button className="bg-white text-brand-medium px-8 py-4 rounded-2xl font-black text-sm hover:bg-brand-pale transition-all relative z-10 flex items-center space-x-2 shadow-lg">
                    <MessageSquare size={20} />
                    <span>Start Chat</span>
                 </button>
              </div>
           </div>

           <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl p-12 relative">
              {sent ? (
                 <div className="text-center py-20 space-y-10 animate-fade-in-up">
                    <div className="w-24 h-24 bg-brand-pale/30 text-brand-medium rounded-full flex items-center justify-center mx-auto shadow-sm">
                       <Send size={48} />
                    </div>
                    <h3 className="text-4xl font-black text-brand-dark">Message Sent!</h3>
                    <p className="text-gray-600 max-w-sm mx-auto leading-relaxed text-lg font-medium">Thank you for reaching out. We have received your message and will get back to you shortly.</p>
                    <button onClick={() => setSent(false)} className="text-brand-medium font-black hover:underline uppercase tracking-widest text-sm">Send another message</button>
                 </div>
              ) : (
                 <form onSubmit={handleSubmit} className="space-y-8">
                    <h2 className="text-3xl font-black text-brand-dark mb-10 tracking-tight">Send Us a Message</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className="text-xs font-black text-brand-deep uppercase tracking-widest ml-1">Your Name</label>
                          <input
                             required
                             type="text"
                             value={formData.name}
                             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                             className="w-full border-2 border-gray-50 rounded-2xl px-6 py-4 focus:border-brand-medium focus:ring-0 transition-all bg-gray-50 font-medium"
                             placeholder="John Doe"
                          />
                       </div>
                       <div className="space-y-3">
                          <label className="text-xs font-black text-brand-deep uppercase tracking-widest ml-1">Email Address</label>
                          <input
                             required
                             type="email"
                             value={formData.email}
                             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                             className="w-full border-2 border-gray-50 rounded-2xl px-6 py-4 focus:border-brand-medium focus:ring-0 transition-all bg-gray-50 font-medium"
                             placeholder="john@example.com"
                          />
                       </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-xs font-black text-brand-deep uppercase tracking-widest ml-1">Subject</label>
                       <input
                          required
                          type="text"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full border-2 border-gray-50 rounded-2xl px-6 py-4 focus:border-brand-medium focus:ring-0 transition-all bg-gray-50 font-medium"
                          placeholder="How can we help?"
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-xs font-black text-brand-deep uppercase tracking-widest ml-1">Message</label>
                       <textarea
                          required
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full border-2 border-gray-100 rounded-3xl px-6 py-4 focus:border-brand-medium focus:ring-0 transition-all bg-gray-50 font-medium"
                          placeholder="Your message here..."
                       ></textarea>
                    </div>
                    <button
                       disabled={loading}
                       type="submit"
                       className="w-full bg-brand-medium text-white py-5 rounded-2xl font-black text-lg hover:bg-brand-light transition-all shadow-xl hover:shadow-brand-medium/30 flex items-center justify-center space-x-3 disabled:opacity-70"
                    >
                       {loading ? <span>Sending...</span> : (
                          <>
                             <span>Send Message</span>
                             <Send size={20} />
                          </>
                       )}
                    </button>
                 </form>
              )}
           </div>
        </div>
      </section>

      <GuestFooter />
    </div>
  );
};

export default Contact;
