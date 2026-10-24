"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PageTransition from '@/components/PageTransition';
import { ArrowLeft, Clock, Calendar, User, Tag, Facebook, Instagram, Linkedin, MessageCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { blogs, BlogPost as BlogPostType } from '@/data/blogs';

export default function BlogPost() {
  const params = useParams();
  const [blog, setBlog] = useState<BlogPostType | null>(null);
  const [commentData, setCommentData] = useState({ name: '', email: '', comment: '' });
  const [commentErrors, setCommentErrors] = useState<{ name?: string; email?: string; comment?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCommentData(prev => ({ ...prev, [name]: value }));
    setCommentErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validateComment = () => {
    const errors: typeof commentErrors = {};
    if (!commentData.name.trim()) errors.name = 'Please enter your name.';
    if (!commentData.email.trim()) errors.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(commentData.email.trim())) errors.email = 'Please enter a valid email address.';
    if (!commentData.comment.trim()) errors.comment = 'Please write a comment.';
    setCommentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!blog || !validateComment()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('blog_comments').insert([
        {
          blog_slug: blog.slug,
          name: commentData.name.trim(),
          email: commentData.email.trim(),
          comment: commentData.comment.trim()
        }
      ]);

      if (error) throw error;

      setIsSubmitted(true);
      setCommentData({ name: '', email: '', comment: '' });
    } catch (error) {
      console.log(error);
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (params?.slug) {
      const foundBlog = blogs.find(b => b.slug === params.slug);
      setBlog(foundBlog || null);
    }
  }, [params?.slug]);



  if (!blog) {
    return (
      <PageTransition>
        <section className="relative pt-40 pb-20 min-h-screen flex items-center justify-center bg-white">
          <div className="container relative mx-auto text-center">
            <h1 className="text-4xl font-serif font-bold text-[#111] mb-4">Blog Post Not Found</h1>
            <p className="text-gray-500 mb-8">We couldn't find the article you were looking for. Ensure the database script is run.</p>
            <Link href="/coworking-space-in-noida-blog" className="text-[#c08d3e] font-bold tracking-wider uppercase text-sm hover:text-[#a07430] transition-colors inline-flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blogs
            </Link>
          </div>
        </section>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="bg-white min-h-screen">
        
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] w-full flex items-end justify-center pb-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src={blog.image_url} className="w-full h-full object-cover scale-105 animate-[kenburns_20s_ease-in-out_infinite_alternate]" alt={blog.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          </div>
          
          <div className="container relative z-10 mx-auto px-4 lg:px-8 max-w-5xl text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="font-sans text-3xl md:text-5xl lg:text-6xl text-white font-bold leading-tight mb-6 drop-shadow-lg max-w-4xl mx-auto">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-white/90 tracking-wide">
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {blog.date}</span>
              <span className="flex items-center gap-2"><Tag className="w-4 h-4" /> {blog.category}</span>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-[850px]">
            
            {/* HTML Content Rendered with custom styles */}
            <article 
              className="[&>p]:text-gray-700 [&>p]:leading-loose [&>p]:mb-6 [&>p]:text-lg [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:text-[#111] [&>h2]:mb-6 [&>h2]:mt-12 [&>blockquote]:bg-[#ffa602] [&>blockquote]:text-white [&>blockquote]:p-8 md:[&>blockquote]:p-12 [&>blockquote]:rounded-2xl [&>blockquote]:my-10 [&>blockquote]:text-xl md:[&>blockquote]:text-2xl [&>blockquote]:font-medium [&>blockquote]:leading-relaxed [&>blockquote]:relative before:[&>blockquote]:content-[''] before:[&>blockquote]:absolute before:[&>blockquote]:opacity-20 before:[&>blockquote]:top-4 before:[&>blockquote]:left-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-4 [&>ul]:mb-8 [&>ul]:mt-4 [&>li]:text-gray-700 [&>li]:text-lg [&>li]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Tags & Social Share */}
            <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <span className="font-bold text-[#111] text-lg">Tags:</span>
                {blog.tags.map((tag, idx) => (
                  <span key={idx} className="bg-[#ffa602] text-white px-4 py-1.5 rounded text-sm font-semibold hover:bg-[#e69500] transition-colors cursor-pointer">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <a href="https://www.facebook.com/people/Golden-Glory/61579901225099/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 bg-[#ffa602] text-white flex items-center justify-center rounded hover:bg-[#e69500] transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://wa.me/919311076106" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-10 h-10 bg-[#ffa602] text-white flex items-center justify-center rounded hover:bg-[#e69500] transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/goldenglory_space/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 bg-[#ffa602] text-white flex items-center justify-center rounded hover:bg-[#e69500] transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://www.linkedin.com/company/110180018/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 bg-[#ffa602] text-white flex items-center justify-center rounded hover:bg-[#e69500] transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Leave a Reply Section */}
            <div className="mt-20">
              <h2 className="text-3xl font-bold text-[#111] mb-2">Leave a Reply</h2>
              <p className="text-gray-500 mb-8">Your email address will not be published. Required fields are marked *</p>
              
              {isSubmitted ? (
                <div className="flex flex-col items-center text-center gap-4 bg-[#FAF8ED] border border-gray-200 rounded-2xl px-6 py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#111]">Thank you for your comment!</h3>
                  <p className="text-gray-500 max-w-md">Your comment has been submitted successfully and will appear once it is reviewed.</p>
                  <button type="button" onClick={() => setIsSubmitted(false)} className="text-[#f95b29] font-bold hover:underline">
                    Post another comment
                  </button>
                </div>
              ) : (
              <form className="space-y-6" onSubmit={handleCommentSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <input type="text" name="name" value={commentData.name} onChange={handleCommentChange} placeholder="Name *" className={`w-full bg-[#FAF8ED] border px-6 py-4 rounded-xl focus:outline-none focus:border-[#ffa602] transition-colors ${commentErrors.name ? 'border-red-400' : 'border-gray-200'}`} />
                    {commentErrors.name && <p className="text-red-500 text-sm font-medium mt-2">{commentErrors.name}</p>}
                  </div>
                  <div>
                    <input type="email" name="email" value={commentData.email} onChange={handleCommentChange} placeholder="Email *" className={`w-full bg-[#FAF8ED] border px-6 py-4 rounded-xl focus:outline-none focus:border-[#ffa602] transition-colors ${commentErrors.email ? 'border-red-400' : 'border-gray-200'}`} />
                    {commentErrors.email && <p className="text-red-500 text-sm font-medium mt-2">{commentErrors.email}</p>}
                  </div>
                </div>
                <div>
                  <textarea name="comment" value={commentData.comment} onChange={handleCommentChange} placeholder="Comment *" rows={6} className={`w-full bg-[#FAF8ED] border px-6 py-4 rounded-xl focus:outline-none focus:border-[#ffa602] transition-colors resize-none ${commentErrors.comment ? 'border-red-400' : 'border-gray-200'}`}></textarea>
                  {commentErrors.comment && <p className="text-red-500 text-sm font-medium mt-2">{commentErrors.comment}</p>}
                </div>
                {submitError && (
                  <p className="text-red-500 text-sm font-medium">{submitError}</p>
                )}
                <div>
                  <button type="submit" disabled={isSubmitting} className="bg-[#a4d232] text-[#111] font-bold px-8 py-4 rounded-xl hover:bg-[#91ba2d] transition-colors shadow-lg shadow-[#a4d232]/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </form>
              )}
            </div>
            
          </div>
        </section>
        
      </div>
    </PageTransition>
  );
}
