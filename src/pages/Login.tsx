import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useStore } from '@/state/store';
import { HeritageInput } from '@/components/HeritageInput';
import { HeritageButton } from '@/components/HeritageButton';
import { KolkataWatermark } from '@/components/KolkataWatermark';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // TODO: connect to backend API for real authentication
      const success = await login(email, password);
      if (success) {
        navigate('/');
      }
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-heritage-gradient noise-overlay flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        {/* Lamp glows */}
        <motion.div 
          className="absolute top-20 left-20 w-64 h-64 lamp-glow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-96 h-96 lamp-glow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/4 w-48 h-48 lamp-glow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
        />
      </div>

      {/* Kolkata watermarks */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[300px]">
        <KolkataWatermark variant="howrah" opacity={0.05} />
      </div>
      <div className="absolute top-10 right-10 w-[300px] h-[250px]">
        <KolkataWatermark variant="victoria" opacity={0.04} />
      </div>

      {/* Login Card */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="glass-card rounded-2xl p-8 md:p-10 border-primary/20">
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="label-caps text-primary">Welcome to</span>
            <h1 className="font-display text-4xl md:text-5xl text-gradient-gold mt-2 gold-underline pb-2">
              House of Swass
            </h1>
            <p className="font-serif-alt text-muted-foreground mt-4 text-lg">
              A private Kolkata residence for her stories
            </p>
          </motion.div>

          {/* Form */}
          <motion.form 
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <HeritageInput
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-5 h-5" />}
              required
            />

            <HeritageInput
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-5 h-5" />}
              required
            />

            {error && (
              <motion.p 
                className="text-accent text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.p>
            )}

            <HeritageButton
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : null}
              {isLoading ? 'Entering...' : 'Enter the House'}
            </HeritageButton>
          </motion.form>

          {/* Footer */}
          <motion.p 
            className="text-center mt-8 font-script text-primary text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            "Where every cup tells a story"
          </motion.p>
        </div>

        {/* Decorative corner elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-primary/30 rounded-tl-lg" />
        <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-primary/30 rounded-tr-lg" />
        <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-primary/30 rounded-bl-lg" />
        <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-primary/30 rounded-br-lg" />
      </motion.div>
    </div>
  );
};

export default Login;
