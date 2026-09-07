"use client";
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PageTransition from '@/components/PageTransition';
import { supabase } from '../lib/supabase';
import { Lock, Unlock, RefreshCw, Trash2, Mail, Phone, Calendar, User, LayoutDashboard, IndianRupee, Image as ImageIcon, Edit2, X, Save, Upload, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState<'inquiries' | 'pricing' | 'content' | 'gallery' | 'blogs'>('content');
  
  // Site Content State
  const [siteContent, setSiteContent] = useState<any[]>([]);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [isSavingContent, setIsSavingContent] = useState(false);
  
  // Inquiries State
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Pricing State
  const [pricingPlans, setPricingPlans] = useState<any[]>([]);
  const [isLoadingPricing, setIsLoadingPricing] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Gallery State
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [editingGallery, setEditingGallery] = useState<any | null>(null);

  // Blogs State
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);

  const ADMIN_PASSWORD = '123';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
      fetchSiteContent();
      fetchMessages();
      fetchPricingPlans();
      fetchGalleryItems();
      fetchBlogPosts();
    } else {
      setError('Incorrect password');
    }
  };

  // --- SITE CONTENT LOGIC ---
  const fetchSiteContent = async () => {
    setIsLoadingContent(true);
    try {
      const { data, error } = await supabase.from('site_content').select('*').order('section', { ascending: true });
      if (error) throw error;
      setSiteContent(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingContent(false);
    }
  };

  const handleContentChange = (key: string, newValue: string) => {
    setSiteContent(prev => prev.map(item => item.key === key ? { ...item, value: newValue } : item));
  };

  const handleContentImageUpload = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `content_${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      handleContentChange(key, data.publicUrl);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image.');
    }
  };

  const handleSaveAllContent = async () => {
    setIsSavingContent(true);
    try {
      for (const item of siteContent) {
        await supabase.from('site_content').update({ value: item.value }).eq('key', item.key);
      }
      alert('All site content updated successfully! Changes are live.');
    } catch (err) {
      console.error(err);
      alert('Failed to save some content.');
    } finally {
      setIsSavingContent(false);
    }
  };

  const groupedContent = siteContent.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, any[]>);


  // --- INQUIRIES LOGIC ---
  const fetchMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleDeleteMessage = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      const { error } = await supabase.from('contacts').delete().eq('id', id);
      if (error) throw error;
      setMessages(messages.filter(msg => msg.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete message.');
    }
  };

  // --- PRICING LOGIC ---
  const fetchPricingPlans = async () => {
    setIsLoadingPricing(true);
    try {
      const { data, error } = await supabase.from('pricing_plans').select('*').order('id', { ascending: true });
      if (error) throw error;
      setPricingPlans(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingPricing(false);
    }
  };

  const handleImageUploadGeneric = async (e: React.ChangeEvent<HTMLInputElement>, setterFunc: (url: string) => void) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    setUploadingImage(true);
    try {
      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      setterFunc(data.publicUrl);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please check if bucket is created.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSavePlan = async () => {
    if (!editingPlan) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.from('pricing_plans').update({
        title: editingPlan.title, price: editingPlan.price, suffix: editingPlan.suffix,
        best_for: editingPlan.best_for, feats: editingPlan.feats, image: editingPlan.image,
        is_premium: editingPlan.is_premium, highlighted: editingPlan.highlighted
      }).eq('id', editingPlan.id);
      if (error) throw error;
      setEditingPlan(null);
      fetchPricingPlans();
      alert('Plan updated successfully!');
    } catch (err) {
      alert('Failed to save plan.');
    } finally {
      setIsSaving(false);
    }
  };

  // --- GALLERY LOGIC ---
  const fetchGalleryItems = async () => {
    setIsLoadingGallery(true);
    try {
      const { data, error } = await supabase.from('gallery_items').select('*').order('order_index', { ascending: true });
      if (error) throw error;
      setGalleryItems(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingGallery(false);
    }
  };

  const handleSaveGallery = async () => {
    if (!editingGallery) return;
    setIsSaving(true);
    try {
      if (editingGallery.id) {
        const { error } = await supabase.from('gallery_items').update(editingGallery).eq('id', editingGallery.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('gallery_items').insert([editingGallery]);
        if (error) throw error;
      }
      setEditingGallery(null);
      fetchGalleryItems();
      alert('Gallery item saved successfully!');
    } catch (err) {
      alert('Failed to save gallery item. Make sure you ran the SQL script.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!window.confirm('Delete this gallery item?')) return;
    try {
      await supabase.from('gallery_items').delete().eq('id', id);
      fetchGalleryItems();
    } catch (err) {
      alert('Failed to delete item.');
    }
  };

  // --- BLOGS LOGIC ---
  const fetchBlogPosts = async () => {
    setIsLoadingBlogs(true);
    try {
      const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setBlogPosts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingBlogs(false);
    }
  };

  const handleSaveBlog = async () => {
    if (!editingBlog) return;
    setIsSaving(true);
    try {
      if (editingBlog.id) {
        const { error } = await supabase.from('blogs').update(editingBlog).eq('id', editingBlog.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('blogs').insert([editingBlog]);
        if (error) throw error;
      }
      setEditingBlog(null);
      fetchBlogPosts();
      alert('Blog post saved successfully!');
    } catch (err) {
      alert('Failed to save blog. Make sure you ran the SQL script.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      await supabase.from('blogs').delete().eq('id', id);
      fetchBlogPosts();
    } catch (err) {
      alert('Failed to delete blog.');
    }
  };


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (!isAuthenticated) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-32 pb-20 bg-[#f4f9fd] flex items-center justify-center px-4">
          <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl w-full max-w-md border border-black/5 text-center fade-up">
            <div className="w-20 h-20 bg-[#F6F2EB] rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-[#432c1c]" />
            </div>
            <h1 className="text-3xl font-sans font-bold text-[#111] mb-2">Admin Panel</h1>
            <p className="text-gray-500 mb-8 font-light">Please enter the password to access the CMS.</p>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full bg-[#f8f8f8] border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#ffa602] transition-colors text-center font-medium tracking-widest"
                />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>

              <Button type="submit" className="w-full h-12 rounded-xl bg-[#ffa602] text-[#111] hover:bg-[#e09612] font-bold tracking-wider uppercase transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                <Unlock className="w-5 h-5" />
                Unlock Dashboard
              </Button>
            </form>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-32 pb-20 bg-[#f4f9fd]">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Header & Tabs */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 fade-up">
            <div>
              <h1 className="text-4xl md:text-5xl font-sans font-bold text-[#111] mb-2">Dashboard</h1>
              <p className="text-gray-500 text-lg">Manage your website content and inquiries.</p>
            </div>
            
            <div className="flex flex-wrap gap-2 bg-white rounded-xl shadow-sm border border-gray-200 p-1">
              <button onClick={() => setActiveTab('content')} className={`px-4 py-2.5 rounded-lg flex items-center gap-2 font-bold transition-all ${activeTab === 'content' ? 'bg-[#432c1c] text-[#ffa602]' : 'text-gray-500 hover:bg-gray-50'}`}>
                <LayoutDashboard className="w-4 h-4" /> Site Content
              </button>
              <button onClick={() => setActiveTab('inquiries')} className={`px-4 py-2.5 rounded-lg flex items-center gap-2 font-bold transition-all ${activeTab === 'inquiries' ? 'bg-[#432c1c] text-[#ffa602]' : 'text-gray-500 hover:bg-gray-50'}`}>
                <Mail className="w-4 h-4" /> Inquiries
              </button>
              <button onClick={() => setActiveTab('pricing')} className={`px-4 py-2.5 rounded-lg flex items-center gap-2 font-bold transition-all ${activeTab === 'pricing' ? 'bg-[#432c1c] text-[#ffa602]' : 'text-gray-500 hover:bg-gray-50'}`}>
                <IndianRupee className="w-4 h-4" /> Pricing Plans
              </button>
              <button onClick={() => setActiveTab('gallery')} className={`px-4 py-2.5 rounded-lg flex items-center gap-2 font-bold transition-all ${activeTab === 'gallery' ? 'bg-[#432c1c] text-[#ffa602]' : 'text-gray-500 hover:bg-gray-50'}`}>
                <ImageIcon className="w-4 h-4" /> Gallery
              </button>
              <button onClick={() => setActiveTab('blogs')} className={`px-4 py-2.5 rounded-lg flex items-center gap-2 font-bold transition-all ${activeTab === 'blogs' ? 'bg-[#432c1c] text-[#ffa602]' : 'text-gray-500 hover:bg-gray-50'}`}>
                <Edit2 className="w-4 h-4" /> Blogs
              </button>
            </div>
          </div>

          {/* ================= SITE CONTENT TAB ================= */}
          {activeTab === 'content' && (
            <div className="space-y-8 fade-up">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex justify-between items-center sticky top-0 z-20">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2"><LayoutDashboard className="w-5 h-5 text-[#ffa602]" /> Website Content</h2>
                </div>
                <div className="flex items-center gap-4">
                  <Button onClick={fetchSiteContent} disabled={isLoadingContent} variant="outline" className="gap-2">
                    <RefreshCw className={`w-4 h-4 ${isLoadingContent ? 'animate-spin' : ''}`} /> Refresh
                  </Button>
                  <Button onClick={handleSaveAllContent} disabled={isSavingContent} className="gap-2 bg-[#ffa602] text-black hover:bg-[#e09612] font-bold">
                    <Save className={`w-4 h-4 ${isSavingContent ? 'animate-pulse' : ''}`} /> Publish
                  </Button>
                </div>
              </div>

              {isLoadingContent ? (
                <div className="p-20 text-center"><RefreshCw className="w-10 h-10 animate-spin text-[#ffa602] mx-auto" /></div>
              ) : (
                <div className="space-y-8">
                  {(Object.entries(groupedContent) as [string, any[]][]).map(([section, items]) => (
                    <div key={section} className="bg-white rounded-[2rem] shadow-sm border border-black/5 overflow-hidden">
                      <div className="bg-gray-50/50 px-8 py-5 border-b border-gray-100">
                        <h3 className="text-2xl font-bold text-[#111]">{section}</h3>
                      </div>
                      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {items.map((item) => (
                          <div key={item.key} className={`space-y-2 ${item.content_type === 'textarea' ? 'md:col-span-2' : ''}`}>
                            <label className="block text-sm font-bold text-gray-700 capitalize">{item.key.replace(/_/g, ' ')}</label>
                            {item.content_type === 'text' && <input type="text" value={item.value} onChange={(e) => handleContentChange(item.key, e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-[#ffa602] outline-none" />}
                            {item.content_type === 'textarea' && <textarea value={item.value} onChange={(e) => handleContentChange(item.key, e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-[#ffa602] outline-none min-h-[120px]" />}
                            {item.content_type === 'image_url' && (
                              <div className="space-y-3">
                                {item.value && <div className="h-40 rounded-xl overflow-hidden border border-gray-200 relative"><img src={item.value} className="w-full h-full object-cover" alt="CMS Upload" /></div>}
                                <div className="flex gap-3">
                                  <input type="text" value={item.value} onChange={(e) => handleContentChange(item.key, e.target.value)} placeholder="Image URL" className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3" />
                                  <label className="cursor-pointer bg-gray-100 text-gray-700 font-bold py-3 px-4 rounded-xl flex items-center gap-2 hover:bg-gray-200"><Upload className="w-4 h-4" /> Upload<input type="file" accept="image/*" className="hidden" onChange={(e) => handleContentImageUpload(item.key, e)} /></label>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= INQUIRIES TAB ================= */}
          {activeTab === 'inquiries' && (
            <div className="bg-white rounded-[2rem] shadow-xl border border-black/5 overflow-hidden fade-up">
              {/* Similar to existing inquiries logic... abbreviated for brevity as it's not the focus but preserved */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-xl font-bold flex items-center gap-2"><Mail className="w-5 h-5 text-[#ffa602]" /> Recent Messages</h2>
              </div>
              <div className="overflow-x-auto p-4">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#432c1c] text-white text-sm uppercase tracking-wider">
                        <th className="p-5 font-medium whitespace-nowrap">Date</th>
                        <th className="p-5 font-medium whitespace-nowrap">Contact Details</th>
                        <th className="p-5 font-medium w-1/2">Message</th>
                        <th className="p-5 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {messages.map((msg) => (
                        <tr key={msg.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="p-5 align-top">{formatDate(msg.created_at)}</td>
                          <td className="p-5 align-top"><div className="font-bold">{msg.name}</div><div className="text-sm">{msg.email}</div><div className="text-sm">{msg.phone}</div></td>
                          <td className="p-5 align-top">{msg.message}</td>
                          <td className="p-5 align-top text-right"><button onClick={() => handleDeleteMessage(msg.id)} className="text-red-500"><Trash2 className="w-5 h-5" /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              </div>
            </div>
          )}

          {/* ================= PRICING PLANS TAB ================= */}
          {activeTab === 'pricing' && (
            <div className="space-y-6 fade-up">
              {/* Preserved pricing logic */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2"><IndianRupee className="w-5 h-5 text-[#ffa602]" /> Manage Pricing Plans</h2>
                <Button onClick={fetchPricingPlans} variant="outline"><RefreshCw className="w-4 h-4 mr-2" /> Refresh</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pricingPlans.map((plan) => (
                  <div key={plan.id} className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-gray-100">
                    <img src={plan.image} alt={plan.title} className="w-full h-48 object-cover bg-gray-100" />
                    <div className="p-6">
                      <h3 className="text-2xl font-bold">{plan.title}</h3>
                      <div className="text-xl text-[#ffa602] font-bold mt-2 mb-4">₹{plan.price} {plan.suffix}</div>
                      <Button onClick={() => setEditingPlan(plan)} variant="outline" className="w-full">Edit Plan</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= GALLERY TAB ================= */}
          {activeTab === 'gallery' && (
            <div className="space-y-6 fade-up">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2"><ImageIcon className="w-5 h-5 text-[#ffa602]" /> Manage Gallery & Tour</h2>
                <div className="flex gap-4">
                  <Button onClick={fetchGalleryItems} variant="outline"><RefreshCw className="w-4 h-4 mr-2" /> Refresh</Button>
                  <Button onClick={() => setEditingGallery({ type: 'image', title: '', url: '', order_index: 0 })} className="bg-[#432c1c] text-white"><Plus className="w-4 h-4 mr-2" /> Add New</Button>
                </div>
              </div>
              {galleryItems.length === 0 && !isLoadingGallery ? (
                <div className="p-10 text-center text-gray-500 bg-white rounded-[2rem]">No gallery items. Ensure you ran the SQL setup script.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {galleryItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-gray-100">
                      {item.type === 'video' ? (
                        <video src={item.url} className="w-full h-48 object-cover bg-gray-100" muted />
                      ) : (
                        <img src={item.url} className="w-full h-48 object-cover bg-gray-100" />
                      )}
                      <div className="p-6">
                        <span className="text-xs font-bold uppercase text-gray-400">{item.type}</span>
                        <h3 className="text-lg font-bold truncate mt-1">{item.title}</h3>
                        <div className="flex gap-2 mt-4">
                          <Button onClick={() => setEditingGallery(item)} variant="outline" className="flex-1">Edit</Button>
                          <Button onClick={() => handleDeleteGallery(item.id)} variant="outline" className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= BLOGS TAB ================= */}
          {activeTab === 'blogs' && (
            <div className="space-y-6 fade-up">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2"><Edit2 className="w-5 h-5 text-[#ffa602]" /> Manage Blogs</h2>
                <div className="flex gap-4">
                  <Button onClick={fetchBlogPosts} variant="outline"><RefreshCw className="w-4 h-4 mr-2" /> Refresh</Button>
                  <Button onClick={() => setEditingBlog({ title: '', slug: '', excerpt: '', content: '', date: '', author: 'Admin', category: 'Coworking Office Space', read_time: '5 min read', image_url: '' })} className="bg-[#432c1c] text-white"><Plus className="w-4 h-4 mr-2" /> Add Blog</Button>
                </div>
              </div>
              {blogPosts.length === 0 && !isLoadingBlogs ? (
                <div className="p-10 text-center text-gray-500 bg-white rounded-[2rem]">No blogs found. Ensure you ran the SQL setup script.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {blogPosts.map((blog) => (
                    <div key={blog.id} className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 flex p-4 gap-4">
                      <img src={blog.image_url} className="w-32 h-32 rounded-xl object-cover bg-gray-100 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold truncate">{blog.title}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{blog.excerpt}</p>
                        <div className="flex gap-2 mt-4">
                          <Button onClick={() => setEditingBlog(blog)} variant="outline" className="flex-1">Edit</Button>
                          <Button onClick={() => handleDeleteBlog(blog.id)} variant="outline" className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* MODALS */}
      
      {/* Edit Gallery Modal */}
      {editingGallery && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl p-8 shadow-2xl relative">
            <button onClick={() => setEditingGallery(null)} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X className="w-5 h-5" /></button>
            <h2 className="text-2xl font-bold mb-6">{editingGallery.id ? 'Edit' : 'Add'} Gallery Item</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-bold mb-1">Title</label><input type="text" value={editingGallery.title} onChange={e => setEditingGallery({...editingGallery, title: e.target.value})} className="w-full bg-gray-50 border rounded-xl px-4 py-3" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-bold mb-1">Type</label>
                  <select value={editingGallery.type} onChange={e => setEditingGallery({...editingGallery, type: e.target.value})} className="w-full bg-gray-50 border rounded-xl px-4 py-3">
                    <option value="image">Image</option><option value="video">Video</option>
                  </select>
                </div>
                <div><label className="block text-sm font-bold mb-1">Order Index (1, 2, 3..)</label><input type="number" value={editingGallery.order_index} onChange={e => setEditingGallery({...editingGallery, order_index: parseInt(e.target.value)})} className="w-full bg-gray-50 border rounded-xl px-4 py-3" /></div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Media URL</label>
                <div className="flex gap-3">
                  <input type="text" value={editingGallery.url} onChange={e => setEditingGallery({...editingGallery, url: e.target.value})} className="flex-1 bg-gray-50 border rounded-xl px-4 py-3" placeholder="Paste URL..." />
                  <label className="cursor-pointer bg-[#ffa602] font-bold py-3 px-6 rounded-xl whitespace-nowrap">Upload Device<input type="file" accept="image/*,video/*" className="hidden" onChange={e => handleImageUploadGeneric(e, (url) => setEditingGallery({...editingGallery, url}))} /></label>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-4">
              <Button onClick={() => setEditingGallery(null)} variant="outline">Cancel</Button>
              <Button onClick={handleSaveGallery} className="bg-[#432c1c] text-white">Save Item</Button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Blog Modal */}
      {editingBlog && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl relative">
            <button onClick={() => setEditingBlog(null)} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X className="w-5 h-5" /></button>
            <h2 className="text-2xl font-bold mb-6">{editingBlog.id ? 'Edit' : 'Add'} Blog Post</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div><label className="block text-sm font-bold mb-1">Title</label><input type="text" value={editingBlog.title} onChange={e => setEditingBlog({...editingBlog, title: e.target.value})} className="w-full bg-gray-50 border rounded-xl px-4 py-3" /></div>
                <div><label className="block text-sm font-bold mb-1">Slug (URL Path)</label><input type="text" value={editingBlog.slug} onChange={e => setEditingBlog({...editingBlog, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} className="w-full bg-gray-50 border rounded-xl px-4 py-3" /></div>
                <div><label className="block text-sm font-bold mb-1">Excerpt</label><textarea value={editingBlog.excerpt} onChange={e => setEditingBlog({...editingBlog, excerpt: e.target.value})} className="w-full bg-gray-50 border rounded-xl px-4 py-3 h-24" /></div>
              </div>
              <div className="space-y-4">
                <div><label className="block text-sm font-bold mb-1">Cover Image URL</label>
                  <div className="flex gap-3">
                    <input type="text" value={editingBlog.image_url} onChange={e => setEditingBlog({...editingBlog, image_url: e.target.value})} className="flex-1 bg-gray-50 border rounded-xl px-4 py-3" />
                    <label className="cursor-pointer bg-[#ffa602] font-bold py-3 px-4 rounded-xl whitespace-nowrap">Upload<input type="file" accept="image/*" className="hidden" onChange={e => handleImageUploadGeneric(e, (url) => setEditingBlog({...editingBlog, image_url: url}))} /></label>
                  </div>
                  {editingBlog.image_url && <img src={editingBlog.image_url} className="mt-2 h-20 rounded-lg object-cover" />}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-bold mb-1">Date</label><input type="text" value={editingBlog.date} onChange={e => setEditingBlog({...editingBlog, date: e.target.value})} className="w-full bg-gray-50 border rounded-xl px-4 py-2" /></div>
                  <div><label className="block text-sm font-bold mb-1">Author</label><input type="text" value={editingBlog.author} onChange={e => setEditingBlog({...editingBlog, author: e.target.value})} className="w-full bg-gray-50 border rounded-xl px-4 py-2" /></div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-bold mb-1">Full Content (Use \n for new lines)</label>
              <textarea value={editingBlog.content} onChange={e => setEditingBlog({...editingBlog, content: e.target.value})} className="w-full bg-gray-50 border rounded-xl px-4 py-3 min-h-[300px]" />
            </div>
            <div className="mt-8 flex justify-end gap-4">
              <Button onClick={() => setEditingBlog(null)} variant="outline">Cancel</Button>
              <Button onClick={handleSaveBlog} className="bg-[#432c1c] text-white px-8">Save Blog</Button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Editing Plan Modal Preserved (minimized for brevity, it's mostly untouched in logic, but I need to include it since it was replaced) */}
      {editingPlan && createPortal(
         <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl relative">
            <button onClick={() => setEditingPlan(null)} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X className="w-5 h-5" /></button>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Edit2 className="w-6 h-6 text-[#ffa602]" /> Edit Plan: {editingPlan.title}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div><label className="block text-sm font-bold mb-1">Title</label><input type="text" value={editingPlan.title} onChange={e => setEditingPlan({...editingPlan, title: e.target.value})} className="w-full bg-gray-50 border rounded-xl px-4 py-3" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-bold mb-1">Price</label><input type="text" value={editingPlan.price} onChange={e => setEditingPlan({...editingPlan, price: e.target.value})} className="w-full bg-gray-50 border rounded-xl px-4 py-3" /></div>
                  <div><label className="block text-sm font-bold mb-1">Suffix</label><input type="text" value={editingPlan.suffix} onChange={e => setEditingPlan({...editingPlan, suffix: e.target.value})} className="w-full bg-gray-50 border rounded-xl px-4 py-3" /></div>
                </div>
                <div><label className="block text-sm font-bold mb-1">Best For</label><textarea value={editingPlan.best_for} onChange={e => setEditingPlan({...editingPlan, best_for: e.target.value})} className="w-full bg-gray-50 border rounded-xl px-4 py-3 h-20" /></div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border flex-1"><input type="checkbox" checked={editingPlan.is_premium} onChange={e => setEditingPlan({...editingPlan, is_premium: e.target.checked})} className="w-5 h-5" /> Premium</label>
                  <label className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border flex-1"><input type="checkbox" checked={editingPlan.highlighted} onChange={e => setEditingPlan({...editingPlan, highlighted: e.target.checked})} className="w-5 h-5" /> Highlight</label>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl border">
                  <label className="block text-sm font-bold mb-2">Image URL</label>
                  <div className="flex gap-3 mb-3">
                    <input type="text" value={editingPlan.image} onChange={e => setEditingPlan({...editingPlan, image: e.target.value})} className="flex-1 bg-white border rounded-lg px-3 py-2 text-sm" />
                    <label className="cursor-pointer bg-[#ffa602] text-black font-bold py-2 px-4 rounded-lg flex items-center gap-2"><Upload className="w-4 h-4"/>Upload<input type="file" accept="image/*" className="hidden" onChange={e => handleImageUploadGeneric(e, (url) => setEditingPlan({...editingPlan, image: url}))} /></label>
                  </div>
                  {editingPlan.image && <img src={editingPlan.image} className="w-full h-32 object-cover rounded-lg" />}
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Features (Max 6)</label>
                  <div className="space-y-2">
                    {editingPlan.feats.map((feat: string, idx: number) => (
                      <input key={idx} type="text" value={feat} onChange={e => { const f = [...editingPlan.feats]; f[idx] = e.target.value; setEditingPlan({...editingPlan, feats: f}) }} className="w-full bg-white border rounded-lg px-3 py-2 text-sm" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-4 border-t pt-6">
              <Button onClick={() => setEditingPlan(null)} variant="outline">Cancel</Button>
              <Button onClick={handleSavePlan} className="bg-[#432c1c] text-white">Save Changes</Button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </PageTransition>
  );
}
