import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  MapPin, 
  BookOpen, 
  Camera, 
  Coffee, 
  CircleDot, 
  Palette, 
  Target, 
  Layers, 
  Users,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useStore } from '@/state/store';
import { KolkataWatermark } from '@/components/KolkataWatermark';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Lobby', icon: Home },
  { path: '/passport', label: 'Passport', icon: MapPin },
  { path: '/map', label: 'Map', icon: MapPin },
  { path: '/scrapbook', label: 'Scrapbook', icon: Camera },
  { path: '/taste-profile', label: 'Taste', icon: Coffee },
  { path: '/treat-wheel', label: 'Treat Wheel', icon: CircleDot },
  { path: '/moodboard', label: 'Moodboard', icon: Palette },
  { path: '/goals-2025', label: 'Goals 2025', icon: Target },
  { path: '/modes', label: 'Modes', icon: Layers },
  { path: '/tales-vault', label: 'Tales Vault', icon: Users },
];

export const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background noise-overlay flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 wood-panel border-r border-border/50 relative overflow-hidden">
        {/* Hotel directory header */}
        <div className="p-6 border-b border-primary/20">
          <motion.h1 
            className="font-display text-2xl text-gradient-gold"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            House of Swass
          </motion.h1>
          <p className="font-script text-primary text-sm mt-1">Est. 2024</p>
        </div>

        {/* User info */}
        {user && (
          <div className="p-4 border-b border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/50">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center font-display text-primary">
                    {user.name[0]}
                  </div>
                )}
              </div>
              <div>
                <p className="font-serif-alt text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">Resident</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-left',
                  isActive 
                    ? 'bg-primary/20 text-primary border border-primary/30' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                )}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 4 }}
              >
                <Icon className="w-4 h-4" />
                <span className="font-body text-sm">{item.label}</span>
                {isActive && (
                  <motion.div
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                    layoutId="activeIndicator"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border/30">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-body text-sm">Check Out</span>
          </button>
        </div>

        {/* Decorative element */}
        <div className="absolute bottom-20 left-0 right-0 h-32 opacity-10">
          <KolkataWatermark variant="howrah" opacity={0.1} />
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center justify-between p-4">
          <h1 className="font-display text-xl text-gradient-gold">House of Swass</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-muted/50"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 z-30 bg-background/95 backdrop-blur-md pt-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <nav className="p-4 space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                      isActive 
                        ? 'bg-primary/20 text-primary' 
                        : 'text-muted-foreground'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-body">{item.label}</span>
                  </button>
                );
              })}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-accent mt-4"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-body">Check Out</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:p-8 p-4 pt-20 lg:pt-8 overflow-auto relative">
        {/* Background lamp glows */}
        <div className="fixed top-20 right-20 w-96 h-96 lamp-glow pointer-events-none" />
        <div className="fixed bottom-20 left-1/3 w-64 h-64 lamp-glow pointer-events-none" />
        
        {/* Watermark */}
        <div className="fixed bottom-0 right-0 w-[600px] h-[400px] pointer-events-none">
          <KolkataWatermark variant="combined" opacity={0.03} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
