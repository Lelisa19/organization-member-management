import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Blog } from '../types';
import { BookOpen, User, Calendar, ArrowRight } from 'lucide-react';
import GuestNavbar from '../components/GuestNavbar';
import GuestFooter from '../components/GuestFooter';

const PublicBlogs: React.FC = () => {
  const { data: blogs, isLoading } = useQuery<Blog[]>({
    queryKey: ['public-blogs'],
    queryFn: () => api.get('/blogs').then(res => res.data),
  });

  return (
    <div className="min-h-screen bg-white font-poppins">
      <GuestNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-black text-brand-dark mb-6 tracking-tight">Our Insights & Stories</h1>
          <p className="text-xl text-brand-deep max-w-2xl mx-auto font-medium">Discover articles, updates, and news from our thriving community members.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[32rem] bg-brand-pale/10 animate-pulse rounded-[2.5rem]"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {blogs?.map((blog) => (
              <article key={blog.id} className="bg-white rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-500 flex flex-col border border-gray-100 hover:-translate-y-2">
                <div className="relative h-72 overflow-hidden">
                  {blog.image ? (
                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-brand-pale/10 flex items-center justify-center">
                      <BookOpen size={64} className="text-brand-medium/20" />
                    </div>
                  )}
                  <div className="absolute top-6 left-6 bg-brand-medium text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                    Insight
                  </div>
                </div>
                <div className="p-10 flex-1 flex flex-col">
                  <div className="flex items-center space-x-4 text-xs font-bold text-brand-deep/50 uppercase tracking-widest mb-6">
                    <div className="flex items-center space-x-1.5">
                      <Calendar size={14} className="text-brand-medium" />
                      <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-brand-dark mb-4 group-hover:text-brand-medium transition-colors line-clamp-2 leading-tight">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-3 mb-8 leading-relaxed font-medium">
                    {blog.content}
                  </p>
                  <div className="mt-auto pt-8 border-t border-gray-50 flex items-center justify-between">
                     <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-brand-pale/30 flex items-center justify-center text-brand-medium font-black text-sm uppercase">
                           {blog.author_id}
                        </div>
                        <div className="flex flex-col">
                           <span className="text-sm font-bold text-brand-dark">Community</span>
                           <span className="text-[10px] font-bold text-brand-deep uppercase tracking-tighter">Contributor</span>
                        </div>
                     </div>
                     <button className="text-brand-medium font-black flex items-center text-sm group-hover:translate-x-1 transition-transform">
                        Read Story <ArrowRight size={18} className="ml-1" />
                     </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      <GuestFooter />
    </div>
  );
};

export default PublicBlogs;
