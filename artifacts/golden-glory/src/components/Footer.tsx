"use client";
import React from 'react';
import Link from 'next/link';
import { MapPin, Instagram, Facebook, Linkedin, Mail, Phone, ArrowRight } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { get } = useSiteContent();

  return (
    <footer className="bg-[#432c1c] text-white pt-12 pb-6 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#ffa602]/10 blur-[120px]"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-white/5 blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 mb-8">

          {/* Column 1: Brand Info (Spans 4 columns) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2 mb-6 group hover:scale-105 transition-all inline-block w-fit">
              <img src="/logo.png" alt="Golden Glory Logo" className="h-16 md:h-24 lg:h-28 object-contain rounded-xl" />
            </Link>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-sm font-light">
              A premium coworking space in Noida designed to inspire creativity, foster collaboration, and drive your business forward.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/goldenglory_space/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-[#ffa602] hover:text-[#111] hover:border-[#ffa602] transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/people/Golden-Glory/61579901225099/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-[#ffa602] hover:text-[#111] hover:border-[#ffa602] transition-all duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/company/110180018/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-[#ffa602] hover:text-[#111] hover:border-[#ffa602] transition-all duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (Spans 2 columns) */}
          <div className="lg:col-span-2">
            <h4 className="text-lg font-sans font-bold mb-4 text-white tracking-wide">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-gray-400 hover:text-[#ffa602] transition-colors relative inline-block group">Home<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#ffa602] transition-all duration-300 group-hover:w-full"></span></Link></li>
              <li><Link href="/about-coworking-space-in-noida" className="text-gray-400 hover:text-[#ffa602] transition-colors relative inline-block group">About Us<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#ffa602] transition-all duration-300 group-hover:w-full"></span></Link></li>
              <li><Link href="/our-offerings" className="text-gray-400 hover:text-[#ffa602] transition-colors relative inline-block group">Our Offerings<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#ffa602] transition-all duration-300 group-hover:w-full"></span></Link></li>
              <li><Link href="/coworking-space-gallery" className="text-gray-400 hover:text-[#ffa602] transition-colors relative inline-block group">Gallery/Tour<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#ffa602] transition-all duration-300 group-hover:w-full"></span></Link></li>
              <li><Link href="/coworking-space-in-noida-blog" className="text-gray-400 hover:text-[#ffa602] transition-colors relative inline-block group">Blog<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#ffa602] transition-all duration-300 group-hover:w-full"></span></Link></li>
              <li>
                <Link 
                  href="/contact-us#contact-us-section" 
                  className="text-gray-400 hover:text-[#ffa602] transition-colors relative inline-block group"
                  onClick={() => {
                    setTimeout(() => {
                      const el = document.getElementById('contact-us-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 600);
                  }}
                >
                  Contact Us<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#ffa602] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Workspaces (Spans 3 columns) */}
          <div className="lg:col-span-3">
            <h4 className="text-lg font-sans font-bold mb-4 text-white tracking-wide">Workspaces</h4>
            <ul className="space-y-4">
              {['Flexible Desk', 'Dedicated Desk', 'Enclosed Cabin', 'Executive Cabin', 'Day Pass', 'Meeting Room'].map((item) => (
                <li key={item}>
                  <Link
                    href="/our-offerings#pricing"
                    onClick={() => {
                      setTimeout(() => {
                        const el = document.getElementById('pricing');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 600);
                    }}
                    className="text-gray-400 hover:text-[#ffa602] transition-colors relative inline-block group"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#ffa602] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info (Spans 3 columns) */}
          <div className="lg:col-span-3">
            <h4 className="text-lg font-sans font-bold mb-4 text-white tracking-wide">Get in Touch</h4>
            <ul className="space-y-6">
              <li 
                className="text-gray-400 hover:text-white transition-colors group cursor-pointer"
                onClick={(e) => {
                  if (window.location.pathname === '/contact-us') {
                    e.preventDefault();
                    const el = document.getElementById('map');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    window.history.pushState(null, '', '#map');
                  } else {
                    window.location.href = '/contact-us#map';
                  }
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-white/5 p-2 rounded-lg group-hover:bg-[#ffa602] group-hover:text-[#111] transition-colors">
                    <MapPin className="w-5 h-5 text-[#ffa602] group-hover:text-[#111]" />
                  </div>
                  <span 
                    className="pt-1 whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: get('contact_address', '111, F-Block, Sector-8, <br />Noida-201301, India') }}
                  />
                </div>
              </li>
              <li>
                <a href={`mailto:${get('contact_email', 'info@goldenglory.space')}`} className="flex items-center gap-4 text-gray-400 hover:text-[#ffa602] transition-colors group cursor-pointer">
                  <div className="bg-white/5 p-2 rounded-lg group-hover:bg-[#ffa602] group-hover:text-[#111] transition-colors">
                    <Mail className="w-5 h-5 text-[#ffa602] group-hover:text-[#111]" />
                  </div>
                  <span className="pt-1">{get('contact_email', 'info@goldenglory.space')}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${get('contact_phone', '+919311076106')}`} className="flex items-center gap-4 text-gray-400 hover:text-[#ffa602] transition-colors group cursor-pointer">
                  <div className="bg-white/5 p-2 rounded-lg group-hover:bg-[#ffa602] group-hover:text-[#111] transition-colors">
                    <Phone className="w-5 h-5 text-[#ffa602] group-hover:text-[#111]" />
                  </div>
                  <span className="pt-1">{get('contact_phone', '+91-99-588-49-645')}</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500 font-medium">
          <p>© {currentYear} Golden Glory. All Rights Reserved.</p>
          <div className="flex items-center flex-wrap justify-center gap-4">
            <span>Designed By: <a href="https://sprintdigitech.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-gray-300">Sprint Digitech</a></span>
            <span className="w-1 h-1 rounded-full bg-gray-600 hidden sm:block"></span>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="w-1 h-1 rounded-full bg-gray-600 hidden sm:block"></span>
            <Link href="/faq" className="hover:text-white transition-colors">FAQs</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
