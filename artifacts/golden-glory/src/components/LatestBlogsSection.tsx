"use client";
import React from 'react';
import { Calendar, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { blogs } from '@/data/blogs';

const BLOG_BASE = '/coworking-space-in-noida-blog';

// Latest 4 posts, newest first
const latestBlogs = [...blogs]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 4);

export default function LatestBlogsSection() {
  if (latestBlogs.length === 0) return null;

  const [featuredBlog, ...sidebarBlogs] = latestBlogs;

  return (
    <section className="py-20 lg:py-28 bg-[#faf8f5]">
      <div className="container mx-auto px-4 lg:px-8 max-w-[1300px]">

        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-16 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-5 font-bold text-[#f95b29] text-sm uppercase tracking-wider">
            <span>✱</span>
            <span>Latest Articles</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-sans tracking-tight text-[#111] leading-[1.1] max-w-3xl at-animation-heading-style-3">
            Stay informed and inspired for your next journey
          </h2>
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* Featured Blog (Left) */}
          <Link
            href={`${BLOG_BASE}/${featuredBlog.slug}`}
            className="lg:col-span-7 group relative block rounded-[2rem] overflow-hidden min-h-[420px] lg:min-h-[560px] image-anime"
          >
            <img
              src={featuredBlog.image_url}
              alt={featuredBlog.title}
              className="absolute inset-0 w-full h-full object-cover bg-gray-200 transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end">
              <span className="self-start mb-4 px-4 py-1.5 rounded-full bg-[#f95b29] text-white text-xs font-bold uppercase tracking-wider">
                {featuredBlog.category}
              </span>
              <div className="flex items-center gap-2 text-white/80 mb-3 text-sm font-medium">
                <Calendar className="w-4 h-4" />
                <span>{featuredBlog.date}</span>
              </div>
              <h3 className="text-white text-2xl sm:text-3xl lg:text-[2.25rem] font-bold leading-tight mb-6 max-w-xl">
                {featuredBlog.title}
              </h3>
              <div className="flex items-center gap-3 text-white font-bold text-[15px]">
                Read Story
                <span className="w-11 h-11 rounded-full bg-[#f95b29] text-white flex items-center justify-center transition-transform group-hover:rotate-45">
                  <ArrowUpRight className="w-5 h-5" />
                </span>
              </div>
            </div>
          </Link>

          {/* Sidebar Blogs (Right) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {sidebarBlogs.map((blog) => (
              <Link
                key={blog.id}
                href={`${BLOG_BASE}/${blog.slug}`}
                className="group flex flex-1 gap-4 sm:gap-5 p-3 sm:p-4 bg-white rounded-[1.5rem] border border-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image Block */}
                <div className="w-28 sm:w-40 shrink-0 self-stretch min-h-[110px] rounded-[1.1rem] overflow-hidden image-anime">
                  <img
                    src={blog.image_url}
                    alt={blog.title}
                    className="w-full h-full object-cover bg-gray-200 transition-transform duration-1000 group-hover:scale-110"
                  />
                </div>

                {/* Content Block */}
                <div className="flex flex-col justify-center min-w-0 py-1 pr-2">
                  <div className="flex items-center gap-2 text-gray-500 mb-2 text-xs sm:text-sm font-medium">
                    <Calendar className="w-4 h-4" />
                    <span>{blog.date}</span>
                  </div>
                  <h3 className="text-[#111] text-base sm:text-lg font-bold leading-snug mb-3 line-clamp-2 group-hover:text-[#f95b29] transition-colors">
                    {blog.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[#f95b29] font-bold text-sm">
                    Read Story
                    <span className="w-6 h-6 rounded-full bg-[#f95b29] text-white flex items-center justify-center transition-transform group-hover:translate-x-1">
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href={BLOG_BASE}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#111] text-white font-bold text-sm uppercase tracking-wider transition-colors hover:bg-[#f95b29]"
          >
            View All Articles
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
