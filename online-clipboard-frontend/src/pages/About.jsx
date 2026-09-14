import { useEffect } from "react";
import { Terminal, Cpu, ShieldAlert, Sparkles, BookOpen, User, ExternalLink, Globe, Github, Linkedin, Twitter, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const socialLinks = [
    {
      name: "Portfolio",
      url: "https://shaurya01836.vercel.app/",
      icon: <Globe className="w-5 h-5 text-emerald-400" />,
      tag: "shaurya01836.vercel.app",
      gradient: "border-[#141416] hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]",
      textColor: "text-emerald-400"
    },
    {
      name: "GitHub",
      url: "https://github.com/Shaurya01836",
      icon: <Github className="w-5 h-5 text-purple-400" />,
      tag: "@Shaurya01836",
      gradient: "border-[#141416] hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]",
      textColor: "text-purple-400"
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/this-is-shaurya-upadhyay/",
      icon: <Linkedin className="w-5 h-5 text-blue-400" />,
      tag: "Shaurya Upadhyay",
      gradient: "border-[#141416] hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]",
      textColor: "text-blue-400"
    },
    {
      name: "X (Twitter)",
      url: "https://x.com/shaurya01836",
      icon: <Twitter className="w-5 h-5 text-sky-400" />,
      tag: "@shaurya01836",
      gradient: "border-[#141416] hover:border-sky-500/50 hover:shadow-[0_0_15px_rgba(56,189,248,0.15)]",
      textColor: "text-sky-400"
    }
  ];

  return (
    <div className="max-w-[1000px] mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-20 font-sans">
      {/* Back button */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-blue-400 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Clipboard
      </Link>

      {/* Header Section */}
      <div className="mb-12 border-l-4 border-purple-500 pl-4 md:pl-6 py-2">
        <div className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-widest mb-2">
          <BookOpen className="w-4 h-4" /> Origin Story
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
          Why I Built This Online Clipboard
        </h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl">
          A project born out of real college lab frustration, low-spec PCs, and a desire to build a fast, clean developer utility.
        </p>
      </div>

      {/* Main Story Cards */}
      <div className="space-y-8">
        
        {/* Card 1: The College Lab Dilemma */}
        <div className="bg-[#0A0A0A] border border-[#141416] rounded-md p-6 md:p-8 relative overflow-hidden group hover:border-[#252528] transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider bg-red-950/30 px-2 py-0.5 rounded border border-red-900/40">
                Phase 1: The Problem
              </span>
              <h2 className="text-lg font-bold text-gray-100">
                Low-Spec College PCs & MATLAB Labs
              </h2>
            </div>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Back in my <strong className="text-white">3rd year of B.Tech</strong>, I spent a lot of hours in our college <strong className="text-white">MATLAB lab</strong>. 
            After running experiments and generating output images, I needed a fast way to transfer the code and result screenshots from the lab computer back to my personal laptop.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="bg-[#111] border border-[#1A1A1E] p-4 rounded text-xs">
              <div className="text-red-400 font-bold mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" /> Laggy Web Apps & Privacy Risks
              </div>
              <p className="text-gray-400 leading-normal">
                Opening WhatsApp Web or Gmail on low-spec lab desktop PCs was painfully slow. Worse, forgetting to log out of personal accounts on shared lab PCs was a constant security risk.
              </p>
            </div>
            <div className="bg-[#111] border border-[#1A1A1E] p-4 rounded text-xs">
              <div className="text-yellow-400 font-bold mb-1 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" /> Cluttered Existing Clipboards
              </div>
              <p className="text-gray-400 leading-normal">
                I looked for simple online clipboards online, but existing tools were either slow, broken, bloated with ads, or suffered from cluttered UI/UX.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: The Solution & Spring Boot */}
        <div className="bg-[#0A0A0A] border border-[#141416] rounded-md p-6 md:p-8 relative overflow-hidden group hover:border-[#252528] transition-colors">
          <div className="flex items-center gap-3 mb-4">
           
            <div>
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider bg-blue-950/30 px-2 py-0.5 rounded border border-blue-900/40">
                Phase 2: Building The Solution
              </span>
              <h2 className="text-lg font-bold text-gray-100">
                Learning Spring Boot & Building for Personal Use
              </h2>
            </div>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            At that time, I was actively learning <strong className="text-white">Spring Boot</strong> and wanted to build a practical, real-world project. I decided to fix my own problem by creating a lightweight, instant Online Clipboard that required zero account login to quickly send clips and files.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            I started using it every single day during lab sessions. Soon enough, my classmates noticed how fast and hassle-free it was, and they started using it too!
          </p>
        </div>

        {/* Card 3: Key Features Highlight */}
        <div className="bg-[#0A0A0A] border border-[#141416] rounded-md p-6 md:p-8">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2 font-mono">
            <Terminal className="w-4 h-4 text-emerald-400" /> Core Design Philosophy
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-[#111] p-4 rounded border border-[#1A1A1E]">
              <div className="text-emerald-400 font-bold text-sm mb-1">⚡ Zero Friction</div>
              <p className="text-gray-400 text-xs leading-normal">
                Paste text or select files, hit Save, get a 5-digit code. No mandatory sign-ins required.
              </p>
            </div>
            <div className="bg-[#111] p-4 rounded border border-[#1A1A1E]">
              <div className="text-blue-400 font-bold text-sm mb-1">🔒 Safe & Anonymous</div>
              <p className="text-gray-400 text-xs leading-normal">
                No personal data leaks on shared public machines. Automatic expiration keeps clips clean.
              </p>
            </div>
            <div className="bg-[#111] p-4 rounded border border-[#1A1A1E]">
              <div className="text-purple-400 font-bold text-sm mb-1">💻 Developer First</div>
              <p className="text-gray-400 text-xs leading-normal">
                Sleek, dark terminal design focused on readability, speed, and responsiveness.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Developer Links Footer Section */}
      <div className="mt-16 border-t border-[#141416] pt-12">
        <div className="flex items-center gap-2 mb-8 opacity-60">
          <User className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-purple-400 tracking-widest uppercase">
            Built by Shaurya Upadhyay
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {socialLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group bg-[#0A0A0A] p-5 rounded-md transition-all duration-300 flex items-center justify-between hover:bg-[#111] border ${link.gradient}`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded bg-black border border-[#141416] group-hover:scale-110 transition-transform">
                  {link.icon}
                </div>
                <div>
                  <h4 className="text-gray-200 font-bold text-sm group-hover:text-white flex items-center gap-1.5">
                    {link.name}
                  </h4>
                  <p className="text-gray-500 text-xs mt-0.5 font-mono">
                    {link.tag}
                  </p>
                </div>
              </div>
              <ExternalLink className={`w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all ${link.textColor}`} />
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}
