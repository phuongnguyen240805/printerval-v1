"use client";

import React from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/shared/layout/header/Header";
import { Footer } from "@/shared/layout/footer/Footer";
import Link from "next/link";

const LandingPage = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
      
      {/* --- SECTION 1: HERO BANNER --- */}
      <div className="relative w-full h-[500px] bg-[#fdf8f3] overflow-hidden flex flex-col items-center justify-center px-6 text-center">
        {/* Background Decor (Giả lập các hình khối trong ảnh) */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
           <div className="absolute top-10 left-10 w-32 h-32 bg-orange-200 rounded-full blur-3xl"></div>
           <div className="absolute bottom-10 right-10 w-48 h-48 bg-blue-100 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 space-y-4 max-w-4xl">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Start Your Business with Printerval - Free for New Sellers!
          </h1>
          <p className="text-lg md:text-xl text-slate-600 font-medium">
            Own a factory or supply products and dream of selling online? <br />
            Join Printerval and turn potential into profits today!
          </p>
        </div>
        
        {/* Lớp xé giấy (Ripped paper effect) ở dưới cùng Hero */}
        <div className="absolute bottom-0 left-0 w-full h-16 bg-white" style={{ clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 85% 35%, 70% 0%, 55% 45%, 40% 10%, 25% 40%, 10% 0%, 0% 30%)" }}></div>
      </div>

      {/* --- SECTION 2: STICKY NAVIGATION (QUAN TRỌNG) --- */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md py-4 shadow-sm border-b border-slate-100">
        <div className="flex justify-center gap-4 px-4">
          <button className="w-full max-w-[200px] h-12 bg-[#5542be] text-white rounded-full font-bold shadow-lg hover:bg-[#432db0] transition-all">
            Suppliers
          </button>
          <button className="w-full max-w-[200px] h-12 bg-white text-[#ff7a00] border-2 border-[#ff7a00] rounded-full font-bold hover:bg-orange-50 transition-all">
            Artists
          </button>
        </div>
        
        {/* Menu nhỏ bên dưới nút (Theo ảnh 2) */}
        <div className="mt-4 flex flex-wrap justify-center gap-6 text-sm md:text-base font-bold text-slate-800">
          <a href="#how" className="hover:text-[#ff7a00]">How Printerval works</a>
          <a href="#stories" className="hover:text-[#ff7a00]">Seller Stories</a>
          <a href="#what" className="hover:text-[#ff7a00]">What can you sell on Printerval?</a>
          <a href="#faq" className="hover:text-[#ff7a00]">FAQ</a>
        </div>
      </div>

      {/* --- SECTION 3: WHY CHOOSE US --- */}
      <div className="py-20 px-6 max-w-7xl mx-auto text-center space-y-16">
        <div className="inline-block border-b-2 border-orange-200 pb-2">
           <h2 className="text-3xl font-bold text-slate-900">Why choose us?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Item 1 */}
          <div className="space-y-4">
            <div className="h-48 flex items-center justify-center bg-slate-50 rounded-2xl">
              <span className="text-6xl">💰</span> {/* Thay bằng <img> minh họa của bạn */}
            </div>
            <h3 className="text-xl font-bold text-slate-800 leading-tight">Maximize profits. Minimize costs.</h3>
            <p className="text-slate-500 text-sm">Enjoy exclusive support with no fees for new sellers.</p>
          </div>
          {/* Item 2 */}
          <div className="space-y-4">
            <div className="h-48 flex items-center justify-center bg-slate-50 rounded-2xl">
              <span className="text-6xl">📢</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 leading-tight">Free Marketing & Advertising Support</h3>
            <p className="text-slate-500 text-sm">Connect with global customers with the help of our complimentary marketing and advertising support.</p>
          </div>
          {/* Item 3 */}
          <div className="space-y-4">
            <div className="h-48 flex items-center justify-center bg-slate-50 rounded-2xl">
              <span className="text-6xl">📦</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 leading-tight">Smooth Selling, Simple Management</h3>
            <p className="text-slate-500 text-sm">Easily manage orders and payments with our all-in-one platform.</p>
          </div>
        </div>
      </div>

      {/* --- SECTION 4: HOW IT WORKS --- */}
      <div id="how" className="py-20 bg-[#e3eefc] px-6 text-center space-y-12 relative overflow-hidden">
        {/* Background xé giấy phía trên section này */}
        <div className="absolute top-0 left-0 w-full h-8 bg-white" style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 85% 40%, 70% 100%, 55% 30%, 40% 90%, 25% 20%, 10% 100%, 0% 50%)" }}></div>

        <div className="inline-block border-b-2 border-orange-300 pb-2 mt-8">
           <h2 className="text-3xl font-bold text-slate-900">How Printerval works?</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto relative">
          {/* Line nối giữa các bước */}
          <div className="hidden lg:block absolute top-[40%] left-0 w-full h-[2px] bg-slate-300 -z-0"></div>
          
          {[
            "Register as a seller",
            "Set Up your store",
            "List your products",
            "Process orders and deliver on the Printerval platform"
          ].map((step, idx) => (
            <div key={idx} className="relative z-10 space-y-4 flex flex-col items-center">
              <div className="w-64 h-48 bg-white/50 rounded-xl mb-4 flex items-center justify-center text-5xl">🖼️</div>
              <div className="w-10 h-10 rounded-full bg-slate-300 text-white flex items-center justify-center font-bold">
                {idx + 1}
              </div>
              <p className="font-bold text-slate-800 text-sm max-w-[150px]">{step}</p>
            </div>
          ))}
        </div>
      </div>


      {/* --- SECTION 6: CALL TO ACTION --- */}
      <div className="py-24 bg-white px-6 text-center space-y-6 relative">
         {/* Hiệu ứng xé giấy mờ phía trên */}
         <div className="absolute top-0 left-0 w-full h-12 bg-[#fdf2f2] opacity-50" style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 85% 40%, 70% 100%, 55% 30%, 40% 90%, 25% 20%, 10% 100%, 0% 50%)" }}></div>

         <div className="w-64 h-48 mx-auto bg-slate-50 flex items-center justify-center text-6xl">🧩</div>
         
         <div className="space-y-2">
            <p className="font-bold text-slate-800 uppercase tracking-widest text-sm">Turn your products into profits</p>
            <h2 className="text-4xl font-black text-[#ff7a00] uppercase italic tracking-tighter">Join Printerval Today!</h2>
         </div>

        <Link href="https://prentival_mona.thecong2610.workers.dev/">
          <Button className="bg-[#ff7a00] hover:bg-[#e66e00] text-white font-bold px-12 h-14 rounded-full text-lg shadow-xl shadow-orange-200">
            Start Selling Now!
          </Button>
        </Link>
      </div>

      </div>
      <Footer />
    </>
  );
};

export default LandingPage;