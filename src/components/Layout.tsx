import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  BookOpen, 
  Brain, 
  Zap, 
  Crosshair, 
  ShieldAlert, 
  Target,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "갤러리 커리큘럼", path: "/gallery", icon: BookOpen, color: "bg-neon-green" },
  { name: "실전 응용 강화", path: "/practical", icon: Brain, color: "bg-neon-pink" },
  { name: "도파민 번역기", path: "/dopamine", icon: Zap, color: "bg-yellow-400" },
  { name: "빌런 소탕", path: "/villain", icon: Crosshair, color: "bg-red-500" },
  { name: "뱅크런 방어", path: "/bankrun", icon: ShieldAlert, color: "bg-blue-400" },
  { name: "기출 학살", path: "/exam", icon: Target, color: "bg-purple-400" },
];

export default function Layout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-brutal-white">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 brutal-border border-b-0 bg-brutal-white z-50">
        <Link to="/" className="text-2xl font-display tracking-wider">뇌피셜 EDU</Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 brutal-border brutal-shadow bg-neon-green">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:sticky top-0 left-0 h-screen w-full md:w-64 brutal-border bg-brutal-white z-40 flex flex-col transition-transform duration-300 ease-in-out",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-6 hidden md:block border-b-3 border-brutal-black">
          <Link to="/" className="text-4xl font-display tracking-wider hover:text-neon-pink transition-colors">
            뇌피셜<br/>EDU
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-4 mt-16 md:mt-0">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 p-3 brutal-border brutal-shadow text-lg font-bold transition-all",
                  isActive ? item.color : "bg-white hover:bg-brutal-gray"
                )}
              >
                <item.icon size={24} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t-3 border-brutal-black">
          <div className="text-xs font-bold uppercase tracking-widest">
            User: kwoncho1001
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen brutal-border md:border-l-0 p-4 md:p-8 lg:p-12 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
