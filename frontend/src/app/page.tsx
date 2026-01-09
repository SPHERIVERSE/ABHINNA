import Link from "next/link";
import { cn } from "@/lib/utils";
import PopupModal from "@/components/ui/PopupModal"; 
import CardCarousel from "@/components/ui/CardCarousel"; 
import BottomNav from "@/components/layout/BottomNav";
import LeadershipSection from "@/components/ui/LeadershipSection";
import FeedbackForm from "@/components/forms/FeedbackForm";
import FacultyCard from "@/components/ui/FacultyCard";
import TestimonialSection from "@/components/ui/TestimonialSection";
import HallOfFameCarousel from "@/components/ui/HallofFameCarousel";
import AutoScrollRow from "@/components/ui/AutoScrollRow";
import { 
  ArrowRight, BookOpen, Trophy, ChevronRight, Users, LayoutGrid,
  MessageCircle, Star, GraduationCap,
  MapPin, Phone, Globe, Facebook, Instagram, Twitter, Send, ExternalLink 
} from "lucide-react";

// CONFIGURATION
const WA_NUMBER = "919577828813"; 
const WA_MESSAGE = "Hello Abhinna Institute, I am interested in your courses. Please guide me regarding admissions.";
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;

// MAP CONFIGURATION
const MAP_QUERY = "Abhinna Institute Uzanbazar Guwahati";
const GOOGLE_MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`;
const MAP_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

// HELPER: URL CLEANER
const cleanUrl = (url: string | undefined) => {
  if (!url) return "";
  if (url.startsWith("data:") || url.startsWith("blob:")) return url;
  if (url.includes("/uploads/")) {
    return "/uploads/" + url.split("/uploads/")[1];
  }
  return url;
};

// CUSTOM WHATSAPP ICON
const WhatsAppIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <img 
    src="/whatsapp.svg" 
    alt="WhatsApp" 
    width={size} 
    height={size} 
    className={className}
    style={{ minWidth: size, minHeight: size }}
  />
);

// SMART DATA FETCHER
async function getHomeData() {
  try {
    const baseUrl = typeof window === "undefined" 
      ? "https://lecture-titten-huge-going.trycloudflare.com" 
      : process.env.NEXT_PUBLIC_API_URL;

    const fetchUrl = typeof window === "undefined" 
      ? `${baseUrl}/public/home` 
      : `${baseUrl}/public/home`;

    const res = await fetch(fetchUrl, { next: { revalidate: 60 } });
    
    if (!res.ok) throw new Error("Failed");
    const json = await res.json();

    if (json.success && json.data) {
       const d = json.data;
       if(d.gallery) d.gallery = d.gallery.map((i: any) => ({...i, fileUrl: cleanUrl(i.fileUrl)}));
       if(d.results) d.results = d.results.map((i: any) => ({...i, fileUrl: cleanUrl(i.fileUrl)}));
       if(d.faculty) d.faculty = d.faculty.map((i: any) => ({...i, photo: { ...i.photo, fileUrl: cleanUrl(i.photo?.fileUrl) }}));
       if(d.leadership) d.leadership = d.leadership.map((i: any) => ({...i, photo: { ...i.photo, fileUrl: cleanUrl(i.photo?.fileUrl) }}));
    }
    
    return json;
  } catch (e) {
    console.error("Home Data Fetch Error:", e);
    return { success: false, data: { courses: [], faculty: [], leadership: [], notifications: [], banners: [], gallery: [], results: [], videos: { landscape: [], shorts: [] }, testimonials: [] } };
  }
}

export default async function HomePage() {
  const { success, data } = await getHomeData();

  if (!success || !data) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-400 bg-slate-50">
        <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-[#003153]">System Maintenance</h1>
            <p>We are currently updating our content. Please check back shortly.</p>
        </div>
      </div>
    );
  }

  const entranceCourses = data?.courses?.filter((c: any) => c.category === "ENTRANCE") || [];
  const academicCourses = data?.courses?.filter((c: any) => c.category === "ACADEMIC") || [];

  // Group Academic Courses by Sub-Category
  const groupedAcademics = academicCourses.reduce((acc: any, course: any) => {
    const sub = course.subCategory || "General";
    if (!acc[sub]) acc[sub] = [];
    acc[sub].push(course);
    return acc;
  }, {});


  const { landscape = [], shorts = [] } = data?.videos || {};

  const topperVideos = shorts.filter((v: any) => v.category === "ACHIEVEMENT");
  const lifeVideos = shorts.filter((v: any) => v.category === "STUDENT_STORY");
  const facultyVideos = shorts.filter((v: any) => v.category === "FACULTY");
  const alumniVideos = landscape.filter((v: any) => v.category === "ALUMNI");
  const instituteVideos = landscape.filter((v: any) => v.category === "INSTITUTE");

  const testimonials = data?.testimonials || [];

  // Calculate Average Rating dynamically 
  const averageRating = testimonials.length > 0 
    ? (testimonials.reduce((acc: number, curr: any) => acc + curr.rating, 0) / testimonials.length).toFixed(1) 
    : "5.0";

  return (
    <div className="min-h-screen bg-[#EDDED3] font-sans text-slate-800 pb-10">
    
    {/* 🔹 POPUP MODAL */}
      <PopupModal notifications={data?.notifications || []} />

    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b-4 border-[#D4AF37] shadow-lg transition-all duration-300 flex flex-col">
    
      {/* 1. TICKER */}
      {data?.notifications.some((n: any) => n.type !== "POPUP") && (
        <div className="bg-[#003153] text-white text-xs md:text-sm py-2 relative z-50 border-b border-[#D4AF37]/30">
          <div className="max-w-7xl mx-auto flex items-center px-4">
            <div className="bg-[#D4AF37] text-[#003153] px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm mr-4 flex-shrink-0">New</div>
            <div className="overflow-hidden w-full relative h-6">
                <div className="absolute animate-marquee whitespace-nowrap flex gap-16">
                    {data.notifications.filter((n: any) => n.type !== "POPUP").map((n: any) => (
                        <a key={n.id} href={n.link || WA_LINK} target="_blank" className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors cursor-pointer">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                            {n.message}
                        </a>
                    ))}
                </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SIGNATURE NAVBAR */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 w-full h-24 flex items-center justify-between">
          
          <div className="flex items-center gap-3 md:gap-8">
          {/* RESPONSIVE HANGING BADGE */}
          <div className="h-24 w-28 md:h-36 md:w-40 relative shrink-0 z-50 transform translate-y-3 md:translate-y-5 transition-all duration-300 hover:scale-105 filter drop-shadow-2xl rounded-[10%] overflow-hidden bg-white">
              <img 
                src="/logo.avif" 
                alt="Abhinna Icon" 
                className="w-full h-full object-contain" 
              />
          </div>

          {/* RESPONSIVE BRAND CONTAINER */}
          <div className="flex flex-col justify-center h-full py-1 md:py-2 min-w-0">
              {/* Brand Image - Sizes down on mobile */}
              <div className="h-10 md:h-10 relative w-fit">
                <img 
                  src="/brand.avif" 
                  alt="ABHINNA" 
                  className="h-full w-full object-contain"
                />
              </div>
              
              {/* Smaller and allows wrapping on very small screens if necessary */}
              <p className="font-script text-[#D4AF37] tracking-wide text-sm md:text-lg mt-0.5 md:mt-1 ml-0.5 md:ml-1 whitespace-nowrap overflow-hidden text-ellipsis">
                A destination of Art & Academia
              </p>
          </div>
        </div>
          
          <div className="hidden lg:flex gap-8 text-sm font-bold text-[#003153] tracking-wider uppercase">
            <Link href="#about" className="hover:text-[#D4AF37] transition duration-300 transform hover:scale-105">Why Us</Link>
            <Link href="#courses" className="hover:text-[#D4AF37] transition duration-300 transform hover:scale-105">Courses</Link>
            <Link href="#results" className="hover:text-[#D4AF37] transition duration-300 transform hover:scale-105">Results</Link>
            <Link href="#faculty" className="hover:text-[#D4AF37] transition duration-300 transform hover:scale-105">Faculty</Link>
          </div>

          {/* DESKTOP: Full Button with Text (Hidden on Mobile/Tablet) */}
          <a 
             href={WA_LINK} 
             target="_blank" 
             className="hidden lg:flex items-center gap-2 bg-[#25D366] text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-[#1fb855] transition-all shadow-md transform hover:scale-105"
          >
            <WhatsAppIcon size={18} /> 
            <span>Chat Now</span>
          </a>
        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <header className="relative bg-[#003153] text-white pt-12 pb-20 px-6 overflow-hidden z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-5/12 space-y-8 z-20">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-[#D4AF37] px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-md">
              <Star size={12} className="fill-[#D4AF37]" /> Admissions Open 2026
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Forging <span className="text-[#D4AF37]">Excellence.</span> <br /> Inspiring Minds.
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed font-light">
              Join Guwahati's premier institute. Traversing the paragon of creativity locked in every student.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a href={WA_LINK} target="_blank" className="bg-[#D4AF37] text-[#003153] px-8 py-3.5 rounded-lg font-bold text-sm uppercase tracking-wide hover:bg-[#F4C430] transition shadow-lg flex items-center gap-2 hover:scale-105">
                <MessageCircle size={20} /> Admission Enquiry
              </a>
              <Link href="#courses" className="border border-gray-500 text-gray-200 px-8 py-3.5 rounded-lg font-bold text-sm uppercase tracking-wide hover:bg-white/5 hover:scale-105 transition">
                View Courses
              </Link>
            </div>
          </div>
          
          <div className="md:w-7/12 w-full h-[300px] md:h-[450px] relative"> 
             {data?.gallery && data.gallery.length > 0 ? (
                <CardCarousel items={data.gallery} variant="hero" />
             ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900/50 rounded-2xl border border-white/10">
                   <GraduationCap size={64} className="opacity-20 mb-4" />
                   <p className="text-xs font-mono uppercase">Upload 'GALLERY' Assets</p>
                </div>
             )}
          </div>
        </div>
      </header>


{/* 🔹 SECTION 5: COURSES WRAPPER */}
{(entranceCourses.length > 0 || academicCourses.length > 0) && (
  <div id="courses" className="bg-[#FDFBF7] pt-24 pb-8 space-y-8">
    
    {/* 🟢 MAIN TITLE: OUR DESIGNED COURSES */}
    <div className="max-w-4xl mx-auto text-center px-6 mb-12">
       {/* Badge */}
       <div className="inline-flex items-center gap-3 bg-[#003153]/5 border border-[#003153]/10 px-5 py-2 rounded-full mb-6">
          <LayoutGrid className="text-[#D4AF37]" size={18} />
          <span className="text-[#003153] text-[10px] font-black uppercase tracking-[0.3em]">
            Academic Structure
          </span>
       </div>

       {/* Title */}
       <h2 className="text-5xl md:text-6xl font-black text-[#003153] tracking-tighter leading-none mb-6">
         Our Designed <span className="text-[#D4AF37]">Courses</span>
       </h2>

       {/* Luxury Divider */}
       <div className="flex items-center justify-center gap-4 opacity-80 mb-6">
          <div className="h-[2px] w-16 md:w-24 bg-gradient-to-r from-transparent to-[#003153]" />
          <div className="w-3 h-3 bg-[#D4AF37] rotate-45 shadow-sm" />
          <div className="h-[2px] w-16 md:w-24 bg-gradient-to-l from-transparent to-[#003153]" />
       </div>

       {/* Subtext */}
       <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
         Meticulously crafted learning pathways designed to bridge the gap between ambition and achievement. 
         Explore our specialized programs below.
       </p>
    </div>

    {/* 🔹 SUB-SECTIONS (Entrance & Academics) */}
    <div className="space-y-4">
      
      {/* 5A: ENTRANCE EXAMINATIONS */}
      {entranceCourses.length > 0 && (
        <section id="entrance" className="py-5 bg-white overflow-hidden relative">
           {/* ... (Existing Entrance Code) ... */}
           <div className="max-w-7xl mx-auto relative z-10">
              {/* Optional: You can remove the large header here or keep it as a sub-header */}
              <div className="flex items-center gap-4 mb-10">
                 <div className="h-10 w-1.5 bg-[#D4AF37] rounded-full" />
                 <div>
                    <h3 className="text-2xl font-black text-[#003153] uppercase tracking-tight">Entrance Examinations</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Career Gateways</p>
                 </div>
              </div>

              <AutoScrollRow speed={50}>
                 {/* ... (Existing Entrance Cards) ... */}
                 {entranceCourses.map((course: any) => (
                    // ... your existing course card code ...
                    <div key={course.id} className="snap-start flex-shrink-0 w-[82vw] md:w-[360px] group relative bg-[#FAF1EB] rounded-[2.5rem] p-1 border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
                       {/* ... card content ... */}
                       <div className="p-8 flex-1 flex flex-col items-center text-center">
                          <div className="w-16 h-16 bg-[#FDFBF7] rounded-2xl flex items-center justify-center text-[#003153] mb-6 shadow-sm border border-[#D4AF37]/20 group-hover:bg-[#003153] group-hover:text-[#D4AF37] group-hover:rotate-6 transition-all duration-500">
                             <Trophy size={32} />
                          </div>
                          <h3 className="text-xl font-black text-[#003153] mb-3 uppercase tracking-tight leading-tight">{course.title}</h3> 
                          <div className="h-0.5 w-8 bg-[#D4AF37]/30 mb-4 rounded-full" />
                          <p className="text-slate-500 text-[12px] leading-relaxed mb-8 line-clamp-3 font-medium">{course.description}</p> 
                          <a href={WA_LINK} target="_blank" className="mt-auto w-full py-4 bg-[#003153] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#D4AF37] hover:text-[#003153] transition-all flex items-center justify-center gap-2 shadow-md">
                             View Details <ArrowRight size={14} />
                          </a>
                       </div>
                    </div>
                 ))}
              </AutoScrollRow>
           </div>
        </section>
      )}

      {/* 5B: ACADEMIC PROGRAMS */}
      {academicCourses.length > 0 && (
        <section id="academics" className="py-10 bg-[#F8F9FA] rounded-[3rem] md:rounded-[5rem] mx-2 md:mx-6 overflow-hidden border border-slate-200/60">
          <div className="max-w-7xl mx-auto">
             {/* Sub-Header */}
             <div className="flex items-center gap-4 mb-16 px-4">
                 <div className="h-10 w-1.5 bg-[#D4AF37] rounded-full" />
                 <div>
                    <h3 className="text-2xl font-black text-[#003153] uppercase tracking-tight">Academic Excellence</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Foundation & Growth</p>
                 </div>
              </div>

             <div className="space-y-16">
               {Object.entries(groupedAcademics).map(([subCategory, courses]: [string, any]) => (
                 <div key={subCategory} className="space-y-8">
                   <div className="flex items-center gap-4 px-4">
                     <div className="h-2 w-2 bg-[#D4AF37] rounded-full animate-pulse" />
                     <h3 className="text-xs font-black text-[#003153] uppercase tracking-[0.3em] opacity-80">{subCategory}</h3> 
                     <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
                   </div>

                   <AutoScrollRow speed={60}>
                     {/* ... (Existing Academic Cards) ... */}
                     {courses.map((course: any) => (
                        <div key={course.id} className="snap-start flex-shrink-0 w-[78vw] md:w-[340px] group bg-[#FAF1EB] rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden hover:-translate-y-1">
                           <div className="absolute top-0 right-0 px-5 py-2 bg-[#003153] text-[#D4AF37] rounded-bl-2xl text-[9px] font-black uppercase tracking-widest shadow-lg">{course.stream}</div>
                           <div className="w-12 h-12 bg-slate-50 text-[#003153] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500"><GraduationCap size={24} /></div>
                           <h4 className="text-xl font-black text-[#003153] mb-3 leading-tight tracking-tight pr-8">{course.title}</h4>
                           <p className="text-slate-500 text-[11px] leading-relaxed mb-8 line-clamp-3 font-medium">{course.description}</p>
                           <a href={WA_LINK} target="_blank" className="mt-auto inline-flex items-center gap-2 text-[#D4AF37] font-black text-[10px] uppercase tracking-widest hover:gap-3 transition-all border-b border-[#D4AF37]/30 pb-1 hover:border-[#D4AF37]">
                              Admission Details <ArrowRight size={12} />
                           </a>
                        </div>
                     ))}
                   </AutoScrollRow>
                 </div>
               ))}
             </div>
          </div>
        </section>
      )}
    </div>
  </div>
)}

<div className="space-y-4">

{/* 🔹 SECTION 4: LEADERSHIP & VISION */}
<section id="about" className="px-6 py-6 bg-[#FAF1EB]">
  <div className="max-w-6xl mx-auto">
    
    {/* 🟢 PROFESSIONAL HEADER */}
    <div className="text-center mb-20 space-y-4">
      <div className="inline-flex items-center gap-3 bg-[#003153]/5 border border-[#003153]/10 px-4 py-2 rounded-full">
        <Users className="text-[#D4AF37]" size={18} />
        <span className="text-[#003153] text-[10px] font-black uppercase tracking-[0.3em]">
          Founders & Management
        </span>
      </div>
      
      <h2 className="text-4xl md:text-5xl font-black text-[#003153] tracking-tighter">
        Leadership <span className="text-[#D4AF37]">& Vision</span>
      </h2>
      
      {/* Luxury Divider */}
      <div className="flex items-center justify-center gap-4">
        <div className="h-[2px] w-12 bg-[#D4AF37] rounded-full opacity-50" />
        <div className="h-1.5 w-1.5 bg-[#003153] rounded-full" />
        <div className="h-[2px] w-12 bg-[#D4AF37] rounded-full opacity-50" />
      </div>

      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] pt-2">
        Architects of Academic Excellence
      </p>
    </div>

    {/* 🟢 LEADERSHIP CONTENT */}
    <LeadershipSection leadership={data?.leadership || []} />
    
  </div>
</section>
      
      {/* 🔹 6A. TOPPERS & ACHIEVEMENTS (9:16 Shorts) */}
      {topperVideos.length > 0 && (
        <section className="py-10 px-6 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10 px-2">
              <span className="text-[#D4AF37] font-black uppercase tracking-[0.3em] text-[10px]">Success Stories</span>
              <h2 className="text-3xl font-black text-[#003153] mt-1 tracking-tight">Toppers & Achievements</h2>
            </div>
            {/* Horizontal Scroll for Shorts */}
            <div className="flex overflow-x-auto gap-5 pb-10 no-scrollbar snap-x touch-pan-x touch-pan-y scroll-smooth">
              {topperVideos.map((video: any) => (
                <div key={video.id} className="snap-start flex-shrink-0 w-[70vw] md:w-[280px] group">
                  <div className="aspect-[9/16] relative overflow-hidden rounded-[2.5rem] bg-slate-100 border-2 border-transparent group-hover:border-[#D4AF37] transition-all shadow-lg">
                    <iframe 
                      src={`https://www.youtube.com/embed/${video.externalId}?autoplay=0`} 
                      className="w-full h-full object-cover" 
                      allowFullScreen 
                    />
                  </div>
                  <h4 className="mt-4 font-bold text-sm text-[#003153] line-clamp-1 px-2">{video.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 🔹 6B. LIFE IN ABHINNA (9:16 Shorts) */}
      {lifeVideos.length > 0 && (
        <section className="py-10 px-6 bg-[#FDFBF7] rounded-[4rem] mx-2 md:mx-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10 px-2 text-center md:text-left">
              <span className="text-[#D4AF37] font-black uppercase tracking-[0.3em] text-[10px]">Behind the Scenes</span>
              <h2 className="text-3xl font-black text-[#003153] mt-1 tracking-tight">Student Life</h2>
            </div>
            <div className="flex overflow-x-auto gap-5 pb-10 no-scrollbar snap-x touch-pan-x touch-pan-y scroll-smooth">
              {lifeVideos.map((video: any) => (
                <div key={video.id} className="snap-start flex-shrink-0 w-[70vw] md:w-[280px] group">
                  <div className="aspect-[9/16] relative overflow-hidden rounded-[2.5rem] bg-slate-200 shadow-md">
                    <iframe 
                      src={`https://www.youtube.com/embed/${video.externalId}?autoplay=0`} 
                      className="w-full h-full object-cover" 
                      allowFullScreen 
                    />
                  </div>
                  <h4 className="mt-4 font-bold text-sm text-[#003153] line-clamp-1 px-2">{video.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 🔹 6C. FACULTY BYTES (9:16 Shorts) */}
      {facultyVideos.length > 0 && (
        <section className="py-10 px-6 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10 px-2">
              <span className="text-[#D4AF37] font-black uppercase tracking-[0.3em] text-[10px]">Expert Insights</span>
              <h2 className="text-3xl font-black text-[#003153] mt-1 tracking-tight">Faculty Wisdom</h2>
            </div>
            <div className="flex overflow-x-auto gap-5 pb-10 no-scrollbar snap-x touch-pan-x touch-pan-y scroll-smooth">
              {facultyVideos.map((video: any) => (
                <div key={video.id} className="snap-start flex-shrink-0 w-[70vw] md:w-[280px] group">
                  <div className="aspect-[9/16] relative overflow-hidden rounded-[2.5rem] bg-slate-100 border-2 border-slate-50 group-hover:border-[#003153] transition-all">
                    <iframe 
                      src={`https://www.youtube.com/embed/${video.externalId}?autoplay=0`} 
                      className="w-full h-full object-cover" 
                      allowFullScreen 
                    />
                  </div>
                  <h4 className="mt-4 font-bold text-sm text-[#003153] line-clamp-1 px-2">{video.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 🔹 6D. ALUMNI & INSTITUTION (16:9 Landscape Theater) */}
      {(alumniVideos.length > 0 || instituteVideos.length > 0) && (
        <section className="py-10 px-6 bg-[#003153] text-white rounded-[4rem] md:rounded-[6rem] mx-2 md:mx-6 my-10 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#D4AF37] font-black uppercase tracking-[0.3em] text-[10px]">Legacy & Vision</span>
              <h2 className="text-3xl font-black text-white mt-1 tracking-tight">Alumni Network & Our Institute</h2>
            </div>
            <div className="flex overflow-x-auto gap-8 pb-10 no-scrollbar snap-x touch-pan-x touch-pan-y scroll-smooth">
              {[...alumniVideos, ...instituteVideos].map((video: any) => (
                <div key={video.id} className="snap-start flex-shrink-0 w-[85vw] md:w-[500px] group">
                  <div className="aspect-video relative overflow-hidden rounded-[2.5rem] bg-black shadow-2xl border border-white/10 group-hover:border-[#D4AF37]/50 transition-all">
                    <iframe 
                      src={`https://www.youtube.com/embed/${video.externalId}?autoplay=0`} 
                      className="w-full h-full object-cover" 
                      allowFullScreen 
                    />
                  </div>
                  <div className="mt-5 px-4">
                    <span className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest">{video.category}</span>
                    <h4 className="font-bold text-lg text-white mt-1 group-hover:text-[#D4AF37] transition-colors">{video.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>



    {/* 🔹 SECTION 6: FACULTY SHOWCASE */}
{data?.faculty?.length > 0 && (
  <section id="faculty" className="pt-10 bg-[#FDFBF7] overflow-hidden">
    <div className="max-w-7xl mx-auto">
      
      {/* 🟢 PROFESSIONAL HEADER */}
      <div className="text-center mb-20 space-y-4">
        <div className="inline-flex items-center gap-3 bg-[#003153]/5 border border-[#003153]/10 px-4 py-2 rounded-full">
          <GraduationCap className="text-[#D4AF37]" size={18} />
          <span className="text-[#003153] text-[10px] font-black uppercase tracking-[0.3em]">
            Academic Mentors
          </span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-black text-[#003153] tracking-tighter">
          Meet Our <span className="text-[#D4AF37]">Expert Faculty</span>
        </h2>
        
        <div className="flex items-center justify-center gap-4">
          <div className="h-[2px] w-12 bg-[#D4AF37] rounded-full" />
          <div className="h-2 w-2 bg-[#003153] rotate-45" />
          <div className="h-[2px] w-12 bg-[#D4AF37] rounded-full" />
        </div>
        
        <p className="max-w-2xl mx-auto text-slate-500 font-medium text-sm md:text-base leading-relaxed pt-2">
          Learn from industry leaders and academic experts dedicated to your success. 
          Our faculty brings years of specialized experience to every session.
        </p>
      </div>

      {/* 🟢 CAROUSEL ROW */}
      <AutoScrollRow speed={60}>
        {data.faculty.map((f: any) => (
          <FacultyCard key={f.id} f={f} />
        ))}
      </AutoScrollRow>
      
    </div>
  </section>
)}

{/* 🔹 SECTION 7: HALL OF FAME / RESULTS */}
<section id="results" className="py-24 bg-[#003153] text-white overflow-hidden relative">
   {/* Background Glow */}
   <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[120px] -translate-y-1/3" />
   
   <div className="max-w-7xl mx-auto px-6 relative z-10">
       {/* Section Header */}
       <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
           <div className="space-y-4">
               <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
                  <Trophy className="text-[#D4AF37]" size={20} />
                  <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-widest">Excellence Gallery</span>
               </div>
               <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
                 Celebrating Our <span className="text-[#D4AF37]">Toppers</span>
               </h2>
           </div>
           <p className="text-blue-100/60 font-medium max-w-md md:text-right">
             Witness the journey of scholars who turned ambition into achievement through consistent effort.
           </p>
       </div>
       
       {/* 🟢 DIRECT INTEGRATION: Custom Result Carousel */}
       {data?.results && data.results.length > 0 ? (
           <HallOfFameCarousel results={data.results} />
       ) : (
           <div className="flex items-center justify-center h-64 border-2 border-dashed border-white/10 rounded-[3rem] text-white/30 italic">
              Results processing...
           </div>
       )}
   </div>
</section>

 <div className="my-5">
    <section>
      <div className="max-w-7xl mx-auto">
        
        {/* 1. PROFESSIONAL HEADER (Always Visible) */}
        <div className="text-center mb-16 space-y-4">
          <div className="items-center gap-2 bg-white mx-20 px-6 py-3 rounded-full shadow-2xl border border-slate-100">
            <div className="flex gap-1 justify-center py-4">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={30} 
                  className={i < Math.floor(Number(averageRating)) ? "fill-[#D4AF37] text-[#D4AF37]" : "text-slate-200"} 
                />
              ))}
            </div>
            <div className="text-sm font-black text-[#003153] tracking-tighter">
              {testimonials.length > 0 ? `Average Rating: ${averageRating}` : "Top Rated Institute"}
            </div>
          </div>
          <h2 className="text-4xl font-black text-[#003153] tracking-tight mt-10">Voices of Abhinna</h2>
          <p className="text-slate-500 font-medium max-w-xl mx-auto italic">
            "Your feedback drives our pursuit of academic excellence."
          </p>
        </div>
        {/* 🔹 2. CONDITIONAL REVIEW SLIDER */}

  
        <TestimonialSection testimonials={data?.testimonials || []} />

        {/* 3. PERMANENT FEEDBACK FORM (Always Visible) */}
        <div className="mt-10 max-w-4xl mx-auto px-1">
          <div className="bg-[#003153] p-1 rounded-[3.5rem] shadow-2xl overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="bg-[#003153] p-10 md:p-16 rounded-[3.4rem] border border-white/10 text-center space-y-8 relative z-10">
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-white">Share Your Own Experience</h3>
                <p className="text-blue-100/70 font-medium">Help future students by sharing your journey with us.</p>
              </div>
              
              <div className="max-w-xl mx-auto">
                 {/* This component handles its own POST request */}
                 <FeedbackForm /> 
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  </div>

      {/* 8. PROFESSIONAL FOOTER */}
      <footer className="bg-slate-900 text-white pt-20 pb-10 border-t border-slate-800">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12 mb-16">
               {/* Column 1: Brand & Desc */}
               <div className="space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="w-24 h-12 bg-white/10 rounded-lg p-1 flex items-center justify-center border border-white/10">
                        <img src="/logo.avif" alt="Logo" className="max-w-full max-h-full" />
                     </div>
                     <div>
                        <h3 className="font-bold text-lg text-[#D4AF37]">ABHINNA INSTITUTE</h3>
                        <p className="text-xs text-gray-500 uppercase tracking-widest">Est. 2016</p>
                     </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed pr-6">
                     Abhinna is an initiative born out of passion for the student community of Guwahati. Our quest is to traverse the paragon of excellence and creativity locked in every student and to help those students who have positive attitude towards academia.
                  </p>
                  
                  {/* Social Icons */}
                  <div className="flex gap-3 flex-wrap">
                     <a href="https://www.facebook.com/abhinna.assam/" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-gray-400 hover:bg-[#1877F2] hover:text-white transition-all hover:-translate-y-1">
                        <Facebook size={16} />
                     </a>
                     <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-gray-400 hover:bg-[#E4405F] hover:text-white transition-all hover:-translate-y-1">
                        <Instagram size={16} />
                     </a>
                     <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-gray-400 hover:bg-[#1DA1F2] hover:text-white transition-all hover:-translate-y-1">
                        <Twitter size={16} />
                     </a>
                     <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-gray-400 hover:bg-[#0088cc] hover:text-white transition-all hover:-translate-y-1">
                        <Send size={16} />
                     </a>
                  </div>
               </div>

               {/* Column 2: Contact Info */}
               <div>
                  <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                     <span className="w-8 h-[2px] bg-[#D4AF37]"></span> Visit Us
                  </h4>
                  <ul className="space-y-5">
                     <li className="flex items-start gap-4 text-gray-400">
                        <MapPin className="text-[#D4AF37] mt-1 shrink-0" size={20} />
                        <span className="text-sm leading-relaxed">
                           "ABHINNA" – Uzanbazar,<br /> Naojan Path, Guwahati - 781001
                        </span>
                     </li>
                     <li className="flex items-center gap-4 text-gray-400 group">
                        <Phone className="text-[#D4AF37] shrink-0" size={20} />
                        <div>
                           {/* Click to Call */}
                           <a href="tel:+919387866634" className="text-white font-medium group-hover:text-[#D4AF37] transition-colors block">
                              +91 93878 66634
                           </a>
                           <span className="text-xs text-gray-500 block mt-0.5">10:00 AM – 7:00 PM (Office Hours)</span>
                        </div>
                     </li>
                  </ul>
               </div>

               {/* Column 3: The Map */}
               <div>
                  <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                     <span className="w-8 h-[2px] bg-[#D4AF37]"></span> Locate Us
                  </h4>
                  {/* 🗺️ INTERACTIVE MAP LINK */}
                  <a 
                    href={GOOGLE_MAPS_LINK} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block relative w-full h-48 rounded-xl overflow-hidden border border-slate-700 shadow-2xl group hover:border-[#D4AF37] transition-colors"
                  >
                     {/* The Embed (COLORED) */}
                     <iframe 
                        src={MAP_EMBED_URL}
                        title="ABHINNA Map"
                        width="100%" 
                        height="100%" 
                        className="w-full h-full border-0 pointer-events-none"
                        loading="lazy"
                     />
                     
                     {/* Overlay Effect */}
                     <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors flex items-center justify-center pointer-events-none">
                        <div className="bg-white/90 text-slate-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all flex items-center gap-2">
                            <ExternalLink size={14} /> View on Google Maps
                        </div>
                     </div>
                  </a>
               </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-800 pb-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
               <p>© 2026 Abhinna Institute. All rights reserved.</p>
               <div className="flex gap-6">
                  <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
                  <Link href="#" className="hover:text-white transition">Terms of Service</Link>
               </div>
            </div>
         </div>
      </footer>

      {/* 🔹 MOBILE/TABLET FLOATING WHATSAPP BUTTON */}
      {/* Fixed position above bottom nav, hidden on Desktop (lg) */}
      <a
        href={WA_LINK}
        target="_blank"
        className="lg:hidden fixed bottom-24 right-8 z-50 bg-[#D4AF37] text-white rounded-full shadow-2xl animate-bounce"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon size={60} />
      </a>

      {/* 🔹 MOBILE BOTTOM NAVIGATION */}
      <BottomNav />
    </div>
  );
}
