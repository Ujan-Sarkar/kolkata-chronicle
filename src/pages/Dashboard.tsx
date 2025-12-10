import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, BookOpen, Target, Sparkles } from 'lucide-react';
import { useStore } from '@/state/store';
import { HeritageButton } from '@/components/HeritageButton';
import { KolkataWatermark } from '@/components/KolkataWatermark';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, places, tales, goals } = useStore();
  
  const completedGoals = goals.filter(g => g.completed).length;
  const goalProgress = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;

  const stats = [
    { label: 'Places Visited', value: places.length, icon: MapPin },
    { label: 'Tales Written', value: tales.length, icon: BookOpen },
    { label: 'Goals Progress', value: `${goalProgress}%`, icon: Target },
  ];

  const quickActions = [
    { label: 'Open Passport', path: '/passport', icon: MapPin },
    { label: 'Add New Place', path: '/passport', icon: MapPin },
    { label: 'Write a Tale', path: '/tales-vault', icon: BookOpen },
    { label: 'Spin Treat Wheel', path: '/treat-wheel', icon: Sparkles },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="max-w-6xl mx-auto space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.div 
        className="relative glass-card rounded-2xl p-8 md:p-12 overflow-hidden"
        variants={itemVariants}
      >
        <div className="absolute top-0 right-0 w-96 h-96 opacity-10">
          <KolkataWatermark variant="victoria" opacity={0.15} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          {/* Portrait Frame */}
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-40 h-52 rounded-lg overflow-hidden border-4 border-primary/30 shadow-xl">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user?.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center">
                  <span className="font-display text-4xl text-primary">{user?.name?.[0]}</span>
                </div>
              )}
            </div>
            {/* Frame decoration */}
            <div className="absolute -inset-2 border-2 border-primary/20 rounded-lg pointer-events-none" />
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-card px-3 py-1 rounded border border-primary/30">
              <span className="font-script text-primary text-sm">The Resident</span>
            </div>
          </motion.div>

          {/* Welcome Text */}
          <div className="flex-1 text-center md:text-left">
            <span className="label-caps text-primary">Welcome back to</span>
            <h1 className="font-display text-3xl md:text-5xl text-gradient-gold mt-2 leading-tight">
              House of Swass
            </h1>
            <p className="font-serif-alt text-muted-foreground text-lg md:text-xl mt-4 max-w-xl">
              Your Kolkata of cafés, tales & moods, under one roof. Every corner holds a story waiting to be told.
            </p>
          </div>
        </div>

        {/* Decorative line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </motion.div>

      {/* Stats Row */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        variants={itemVariants}
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className="glass-card rounded-xl p-6 relative overflow-hidden group card-lift"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              {/* Brass plaque effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="label-caps">{stat.label}</p>
                  <p className="font-display text-3xl text-foreground mt-1">{stat.value}</p>
                </div>
              </div>

              {/* Plaque edge effect */}
              <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-primary/30 rounded-tl" />
              <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-primary/30 rounded-tr" />
              <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-primary/30 rounded-bl" />
              <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-primary/30 rounded-br" />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-4 mb-4">
          <span className="label-caps">Quick Actions</span>
          <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <HeritageButton
                  variant="secondary"
                  className="w-full h-full py-6 flex-col gap-2"
                  onClick={() => navigate(action.path)}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm">{action.label}</span>
                </HeritageButton>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div 
        className="glass-card rounded-xl p-6"
        variants={itemVariants}
      >
        <h3 className="font-serif-alt text-xl text-foreground mb-4">Recent Tales</h3>
        
        {tales.length > 0 ? (
          <div className="space-y-4">
            {tales.slice(0, 3).map((tale, index) => (
              <motion.div
                key={tale.id}
                className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                onClick={() => navigate('/tales-vault')}
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif-alt text-foreground truncate">{tale.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{tale.story}</p>
                  <p className="font-script text-primary text-sm mt-2">{tale.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No tales yet. Start writing your first story!
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
