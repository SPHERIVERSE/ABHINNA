"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, BookOpen, Trophy, Users, Bell, 
  CheckCircle2, GraduationCap, MapPin, Phone, Star, MessageCircle 
} from "lucide-react";

// 👇 CONFIGURATION: ENTER YOUR WHATSAPP NUMBER HERE
const WA_NUMBER = "919876543210"; 
const WA_MESSAGE = "Hello Abhinna Institute, I am interested in your courses. Please guide me regarding admissions.";
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;

// Types
type HomeData = {
  courses: any[];
  faculty: any[];
  notifications: any[];
  banners: any[];
  results: any[];
};

export default function HomePage() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/home`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      
      {/* 🔹 1. TOP BAR: The Urgent "Hook" */}
      {data?.notifications.length ? (
        <div className="bg-[#002b5c] text-white text-xs md:text-sm py-2 relative z-50">
          <div className="max-w-7xl mx-auto flex items-center px-4">
            <div className="bg-amber-500 text-[#002b5c] px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm mr-4 flex-shrink-0">
              New
            </div>
            <div className="overflow-hidden w-full relative h-6">
                <div className="absolute animate-marquee whitespace-nowrap flex gap-16">
                    {data.notifications.map((n: any) => (
                    <a 
                        key={n.id} 
                        href={n.link || "#"} 
                        target={n.link ? "_blank" : "_self"}
                        className="flex items-center gap-2 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        {n.message}
                    </a>
                    ))}
                </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* 🔹 2. NAVBAR: Brand Identity */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo Mark */}
            <div className="w-10 h-10 bg-[#002b5c] rounded-lg flex items-center justify-center text-amber-400 font-bold text-lg shadow-lg shadow-blue-900/20">
                A
            </div>
            <div>
                <span className="block text-xl font-extrabold text-[#002b5c] tracking-tight leading-none">
                ABHINNA
                </span>
                <span className="block text-xs font-semibold text-amber-600 tracking-widest uppercase">
                INSTITUTE
                </span>
            </div>
          </div>
          
          <div className="hidden md:flex gap-8 text-sm font-semibold text-gray-600">
            <Link href="#about" className="hover:text-[#002b5c] transition">Why Us</Link>
            <Link href="#courses" className="hover:text-[#002b5c] transition">Courses</Link>
            <Link href="#results" className="hover:text-[#002b5c] transition">Results</Link>
            <Link href="#faculty" className="hover:text-[#002b5c] transition">Faculty</Link>
          </div>

          {/* ✅ CTA REPLACEMENT: WhatsApp Button */}
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 bg-[#25D366] text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-[#1fb855] transition-all shadow-md hover:shadow-lg"
          >
            <MessageCircle size={18} fill="white" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </nav>

      {/* 🔹 3. HERO: The "Promise" */}
      <header className="relative bg-[#002b5c] text-white py-20 md:py-28 px-6 overflow-hidden">
        {/* Abstract Gold/Silver Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
        
        <div className="max-w-7xl mx-auto relative z-10 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-md">
              <Star size={12} className="fill-amber-300" />
              Admissions Open 2025-26
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
              Forging <span className="text-amber-400">Excellence.</span> <br />
              Inspiring Minds.
            </h1>
            
            <p className="text-lg text-gray-300 max-w-lg leading-relaxed font-light">
              Join Guwahati's premier institute for HS, Degree, and Competitive Exams. Traversing the paragon of creativity locked in every student.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              {/* ✅ PRIMARY HERO CTA: Enquire Now (WhatsApp) */}
              <a 
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-amber-500 text-[#002b5c] px-8 py-3.5 rounded-lg font-bold text-sm uppercase tracking-wide hover:bg-amber-400 transition shadow-lg shadow-amber-500/20 flex items-center gap-2"
              >
                <MessageCircle size={18} />
                Admission Enquiry
              </a>
              
              <Link href="#courses" className="border border-gray-500 text-gray-200 px-8 py-3.5 rounded-lg font-bold text-sm uppercase tracking-wide hover:bg-white/5 transition">
                View Courses
              </Link>
            </div>
          </div>
          
          {/* Hero Image / Banner Slider */}
          <div className="relative group perspective-1000">
             <div className="aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 bg-slate-800 relative z-10 transform transition duration-500 hover:rotate-1">
               {data?.banners[0] ? (
                 <img src={data.banners[0].fileUrl} alt="Hero" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition" />
               ) : (
                 <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900">
                    <GraduationCap size={64} className="opacity-20 mb-4" />
                    <p className="text-xs font-mono uppercase">Banner Asset Slot</p>
                 </div>
               )}
               
               {/* Floating Badge */}
               <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur text-[#002b5c] p-4 rounded-xl shadow-xl border-l-4 border-amber-500 hidden md:block">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-50 p-2 rounded-full">
                            <Trophy size={20} className="text-[#002b5c]" />
                        </div>
                        <div>
                            <p className="text-lg font-bold leading-none">Top Results</p>
                            <p className="text-xs text-gray-500 mt-1">Consistently since 2015</p>
                        </div>
                    </div>
               </div>
             </div>
             <div className="absolute -inset-4 bg-gradient-to-tr from-amber-500/20 to-transparent rounded-3xl -z-10 blur-xl"></div>
          </div>
        </div>
      </header>

      {/* 🔹 4. AUTHORITY: The "Why Us" */}
      <section id="about" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
                <h2 className="text-3xl font-bold text-[#002b5c] mb-4">Why Choose Abhinna?</h2>
                <div className="h-1 w-24 bg-amber-500 mx-auto rounded-full mb-6" />
                <p className="text-gray-600 leading-relaxed">
                    "Excellent faculty members, easy connectivity, and a supportive administration."
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
                {/* Director 1 */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition flex gap-6 items-start group">
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-[#002b5c] transition-colors">
                        <Users size={28} className="text-[#002b5c] group-hover:text-amber-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-[#002b5c]">Dr. Debajit Sharma</h3>
                        <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3">Director & Co-founder</p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Former researcher at CIIL, Mysore (12 years). Recipient of DoRa International Scholarship, Estonia. Expert in language documentation.
                        </p>
                    </div>
                </div>

                {/* Director 2 */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition flex gap-6 items-start group">
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-[#002b5c] transition-colors">
                        <Users size={28} className="text-[#002b5c] group-hover:text-amber-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-[#002b5c]">Mr. Shuvam Sarma</h3>
                        <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3">Joint Director</p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            HR Professional (MBA in Strategic Management). Focuses on creating positive workplace culture and student-centric administration.
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                {["Library Space", "Mock Tests", "Parent-Teacher Meet", "Spoken English"].map((item, i) => (
                    <div key={i} className="bg-white py-4 px-6 rounded-lg border border-gray-100 text-center text-sm font-semibold text-gray-700 shadow-sm flex items-center justify-center gap-2">
                        <CheckCircle2 size={16} className="text-amber-500" /> {item}
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 🔹 5. PRODUCT: Courses Grid */}
      <section id="courses" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12">
                <div>
                    <span className="text-amber-600 font-bold uppercase tracking-wider text-xs">Academic Programs</span>
                    <h2 className="text-3xl font-bold text-[#002b5c] mt-2">Targeted Learning</h2>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
            {loading ? (
                [1,2,3].map(i => <div key={i} className="h-72 bg-gray-100 rounded-xl animate-pulse" />)
            ) : (
                data?.courses.map((course: any) => (
                <div key={course.id} className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-blue-100 transition-all duration-300 relative flex flex-col h-full">
                    <div className="h-2 bg-[#002b5c] w-full" />
                    <div className="p-8 flex-1 flex flex-col">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-[#002b5c] mb-6 group-hover:scale-110 transition-transform">
                            <BookOpen size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#002b5c] transition-colors">{course.title}</h3>
                        <p className="text-gray-500 text-sm mb-8 line-clamp-3 leading-relaxed">{course.description}</p>
                        
                        <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                            {/* Course card "Details" button also opens WhatsApp for enquiry */}
                             <a href={WA_LINK} target="_blank" className="text-sm font-bold text-[#002b5c] hover:text-amber-600 transition flex items-center gap-1">
                                Enquire <ArrowRight size={16} />
                             </a>
                        </div>
                    </div>
                </div>
                ))
            )}
            </div>
        </div>
      </section>

      {/* 🔹 6. PROOF: Hall of Fame */}
      <section id="results" className="py-24 bg-[#002b5c] text-white overflow-hidden relative">
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
         
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="md:w-1/3">
                    <Trophy className="text-amber-400 mb-6" size={48} />
                    <h2 className="text-4xl font-bold mb-4">Hall of Fame</h2>
                    <p className="text-gray-300 mb-8 leading-relaxed">
                        Our students consistently secure top ranks in HS Final Exams and Competitive Entrances.
                    </p>
                    <a href={WA_LINK} target="_blank" className="inline-block border border-amber-500 text-amber-400 px-6 py-3 rounded-lg font-bold text-sm hover:bg-amber-500 hover:text-[#002b5c] transition">
                        Join the Toppers
                    </a>
                </div>

                <div className="md:w-2/3 flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x">
                    {data?.results.map((res: any) => (
                        <div key={res.id} className="min-w-[200px] snap-start relative aspect-[3/4] rounded-lg overflow-hidden bg-slate-800 border border-white/10 group shadow-lg">
                            <img src={res.fileUrl} alt={res.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90 group-hover:opacity-100" />
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4">
                                <p className="text-sm font-bold text-white truncate">{res.title}</p>
                                <p className="text-xs text-amber-400 font-medium">Top Performer</p>
                            </div>
                        </div>
                    ))}
                    {!data?.results.length && (
                        <div className="min-w-[200px] aspect-[3/4] bg-white/5 rounded-lg border border-dashed border-white/20 flex items-center justify-center text-gray-500 text-sm">
                            Results Coming Soon
                        </div>
                    )}
                </div>
            </div>
         </div>
      </section>

      {/* 🔹 7. FOOTER */}
      <footer className="bg-slate-900 text-white pt-16 pb-8 border-t border-slate-800">
         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-amber-500 rounded-sm flex items-center justify-center text-[#002b5c] font-bold">A</div>
                    <span className="text-xl font-bold">ABHINNA INSTITUTE</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                    An initiative born out of passion for the student community.
                </p>
            </div>
            
            <div>
                <h4 className="font-bold text-amber-400 mb-6 uppercase text-xs tracking-wider">Contact Us</h4>
                <div className="space-y-4 text-sm text-gray-300">
                    <div className="flex gap-3 items-start">
                        <MapPin size={18} className="text-gray-500 mt-1" />
                        <span>Guwahati, Assam</span>
                    </div>
                    {/* Phone Number Clickable for Call */}
                    <a href={`tel:+${WA_NUMBER}`} className="flex gap-3 items-center hover:text-white transition">
                        <Phone size={18} className="text-gray-500" />
                        <span>+91 98765 43210</span>
                    </a>
                </div>
            </div>
         </div>
         
         <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <p>© 2026 Abhinna Institute.</p>
            {/* Small subtle Admin link for you */}
            <Link href="/login" className="hover:text-gray-400 opacity-50">Admin Login</Link>
         </div>
      </footer>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}