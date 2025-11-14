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
      className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-md"
      style={{
        backgroundColor: '#182441',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="relative"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 1,
          ease: "easeOut",
        }}
      >
        <motion.img
          src={logoUrl && !logoUrl.includes('supabase.co') ? logoUrl : '/‏‏logo.png'}
          alt="Logo"
          className="w-40 h-40 md:w-48 md:h-48 object-contain"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/‏‏logo.png';
          }}
        />
      </motion.div>
    </motion.div>
  );
}