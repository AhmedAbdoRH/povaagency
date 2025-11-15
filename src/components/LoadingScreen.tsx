import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  logoUrl?: string;
  onFinish?: () => void;
}

export default function LoadingScreen({ logoUrl, onFinish }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      onFinish?.();
    }, 2000);

    return () => {
      clearTimeout(hideTimer);
    };
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        {/* Logo Container with Glass/Metallic Shine Effect */}
        <div className="relative inline-block">
          <img
            src={logoUrl && !logoUrl.includes('supabase.co') ? logoUrl : '/‏‏logo.png'}
            alt="Logo"
            className="w-40 h-40 md:w-48 md:h-48 object-contain relative z-10"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/‏‏logo.png';
            }}
          />
          
          {/* Metallic/Glass Shine Overlay */}
          <motion.div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              background: 'linear-gradient(110deg, transparent 40%, rgba(255, 255, 255, 0.8) 50%, transparent 60%)',
              mixBlendMode: 'overlay',
            }}
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatDelay: 1,
              ease: "easeInOut"
            }}
          />
          
          {/* Secondary Shine Effect */}
          <motion.div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              background: 'linear-gradient(120deg, transparent 45%, rgba(255, 255, 255, 0.6) 50%, transparent 55%)',
              mixBlendMode: 'soft-light',
            }}
            animate={{
              x: ['200%', '-100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 0.5,
              ease: "easeInOut"
            }}
          />
          
          {/* Subtle Glow Effect */}
          <motion.div
            className="absolute inset-0 z-0"
            style={{
              background: 'radial-gradient(circle, rgba(0, 0, 0, 0.05) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>
      
      {/* CSS for additional shine effects */}
      <style>{`
        @keyframes metallic-shine {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        
        .logo-shine {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          background-size: 200% 100%;
          animation: metallic-shine 2.5s infinite;
          mix-blend-mode: overlay;
        }
      `}</style>
    </motion.div>
  );
}