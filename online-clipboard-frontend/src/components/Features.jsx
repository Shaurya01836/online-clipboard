import { Zap, Shield, Globe, Lock, Info, ExternalLink, Github, Linkedin, Twitter, User, BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Features() {
  const features = [
    {
      icon: <Zap className="w-5 h-5 text-white" />,
      title: "Instant Sync",
      desc: "Your text moves between devices immediately. No waiting.",
      gradient: "from-blue-600 to-cyan-400",
      tag: "Fast"
    },
    {
      icon: <Shield className="w-5 h-5 text-white" />,
      title: "Auto-Delete",
      desc: "Clips disappear automatically after 24 hours to keep things clean.",
      gradient: "from-purple-600 to-indigo-500",
      tag: "Secure"
    },
    {
      icon: <Globe className="w-5 h-5 text-white" />,
      title: "Any Device",
      desc: "Works on your phone, tablet, or laptop browser. No app needed.",
      gradient: "from-emerald-500 to-green-400",
      tag: "Web"
    },
    {
      icon: <Lock className="w-5 h-5 text-white" />,
      title: "Private",
      desc: "We don't track you or read your clips. Simple and anonymous.",
      gradient: "from-orange-500 to-yellow-400",
      tag: "Safe"
    }
  ];

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
    <div className="mt-24 border-t border-[#141416] pt-12 font-sans">
      <div className="flex items-center gap-2 mb-8 opacity-60">
        <Info className="w-4 h-4 text-blue-500" />
        <span className="text-xs font-bold text-blue-500 tracking-widest uppercase">
          Why use this?
        </span>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, idx) => (
          <div 
            key={idx} 
            className="group bg-[#0A0A0A] border border-[#141416] p-6 rounded-md transition-all duration-300 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 rounded-bl-full transition-opacity`} />
            
            <div className={`w-10 h-10 mb-4 rounded flex items-center justify-center bg-gradient-to-br ${feature.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              {feature.icon}
            </div>
            
            <div className="mb-2 flex justify-between items-center">
              <h3 className="text-gray-200 font-bold text-sm">
                {feature.title}
              </h3>
              <span className="text-[10px] bg-[#111] text-gray-500 px-2 py-0.5 rounded border border-[#222]">
                {feature.tag}
              </span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Story Banner */}
      <div className="mt-12 bg-gradient-to-r from-purple-950/30 via-[#0A0A0A] to-blue-950/30 border border-[#222] p-6 rounded-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-purple-500/10 rounded border border-purple-500/20 text-purple-400 mt-0.5">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white font-bold text-base">Want to know why this was built?</h4>
            <p className="text-gray-400 text-xs mt-1">
              Read how a 3rd year B.Tech MATLAB lab struggle led to creating this instant, zero-login Online Clipboard.
            </p>
          </div>
        </div>
        <Link
          to="/about"
          className="inline-flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#222] border border-[#333] hover:border-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded transition-all whitespace-nowrap group"
        >
          Read Our Story <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-purple-400" />
        </Link>
      </div>

      {/* Connect & Developer Contact Section */}
      <div className="mt-16 border-t border-[#141416] pt-12">
        <div className="flex items-center gap-2 mb-8 opacity-60">
          <User className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-purple-400 tracking-widest uppercase">
            Connect & Contact
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