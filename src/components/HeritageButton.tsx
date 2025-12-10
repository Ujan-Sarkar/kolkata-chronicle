import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface HeritageButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'tag';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export const HeritageButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
}: HeritageButtonProps) => {
  const baseStyles = 'relative inline-flex items-center justify-center font-body font-medium transition-all duration-300 overflow-hidden';
  
  const variants = {
    primary: 'btn-heritage text-foreground rounded-lg border border-primary/30',
    secondary: 'bg-secondary/50 hover:bg-secondary text-foreground rounded-lg border border-secondary',
    ghost: 'bg-transparent hover:bg-muted/50 text-foreground rounded-lg',
    tag: 'bg-primary/10 text-primary rounded-full border border-primary/30 hover:bg-primary/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(baseStyles, variants[variant], sizes[size], className, disabled && 'opacity-50 cursor-not-allowed')}
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {variant === 'primary' && (
        <motion.div
          className="absolute inset-0 bg-gold-shimmer bg-[length:200%_100%]"
          animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{ opacity: 0.1 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};
