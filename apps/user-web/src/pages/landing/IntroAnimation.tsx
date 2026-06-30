import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Cloud, AlertTriangle, CheckCircle, XCircle, TreePine, Navigation } from 'lucide-react';

interface IntroAnimationProps {
  onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [scene, setScene] = useState<1 | 2 | 3 | 4>(1);

  useEffect(() => {
    const t1 = setTimeout(() => setScene(2), 2500); // RideSync enters
    const t2 = setTimeout(() => setScene(3), 5000); // AutoShift
    const t3 = setTimeout(() => setScene(4), 7500); // Fade out
    const t4 = setTimeout(() => onComplete(), 8000); // Remove component

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: scene === 4 ? 0 : 1 }}
      transition={{ duration: 0.5 }}
      style={{
        backgroundColor: scene >= 2 ? '#E0F2FE' : '#F3F4F6' // Sky changes to blue
      }}
    >
      {/* Background Elements */}
      <AnimatePresence>
        {scene >= 2 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-0 w-full h-1/3 bg-green-500/20 flex items-end justify-around pb-12"
          >
            {[...Array(5)].map((_, i) => (
              <TreePine key={i} className="text-green-600/40 w-24 h-24 sm:w-32 sm:h-32" />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-1/2 -translate-y-1/2 w-full max-w-4xl px-4">
        
        {/* Title */}
        <div className="text-center mb-16">
          <AnimatePresence mode="wait">
            {scene === 1 && (
              <motion.h2 
                key="s1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-4xl md:text-5xl font-black text-gray-800"
              >
                Why Carpooling?
              </motion.h2>
            )}
            {scene === 2 && (
              <motion.h2 
                key="s2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-4xl md:text-5xl font-black text-blue-600"
              >
                RideSync Carpool
              </motion.h2>
            )}
            {scene === 3 && (
              <motion.h2 
                key="s3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-4xl md:text-5xl font-black text-indigo-600 flex items-center justify-center gap-3"
              >
                <AlertTriangle className="w-10 h-10 text-yellow-500" />
                AutoShift Technology
              </motion.h2>
            )}
          </AnimatePresence>
        </div>

        {/* Road and Cars */}
        <div className="relative w-full h-48 border-b-4 border-gray-400 border-dashed">
          
          {/* Scene 1: 4 separate cars */}
          <AnimatePresence>
            {scene === 1 && (
              <motion.div exit={{ opacity: 0, x: 200 }} className="absolute inset-0 flex items-end justify-around pb-2">
                {[...Array(4)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                    className="relative flex flex-col items-center"
                  >
                    <Cloud className="absolute -top-6 -right-4 w-8 h-8 text-gray-500 animate-pulse opacity-80" />
                    <Car className="w-12 h-12 text-gray-700" />
                    <div className="w-3 h-3 bg-red-400 rounded-full mt-1" /> {/* Passenger */}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scene 2 & 3: RideSync Car */}
          <AnimatePresence>
            {scene >= 2 && (
              <motion.div 
                initial={{ x: -200, opacity: 0 }}
                animate={{ 
                  x: scene === 3 ? 0 : '100%', 
                  opacity: 1 
                }}
                transition={{ 
                  duration: scene === 3 ? 0.5 : 4, 
                  ease: "linear" 
                }}
                className="absolute inset-0 flex items-end pb-2"
                style={{ left: scene === 3 ? '40%' : '0' }}
              >
                {/* Main RideSync Vehicle */}
                <motion.div 
                  animate={scene === 3 ? {} : { y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className="relative flex flex-col items-center"
                >
                  <Car className={`w-16 h-16 ${scene === 3 ? 'text-gray-400' : 'text-blue-600'}`} />
                  <div className="flex gap-1 mt-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-3 h-3 bg-blue-400 rounded-full" /> 
                    ))}
                  </div>
                  {scene === 3 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute -top-12 bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded whitespace-nowrap"
                    >
                      Issue Detected
                    </motion.div>
                  )}
                </motion.div>

                {/* Scene 3: Replacement Vehicle */}
                <AnimatePresence>
                  {scene === 3 && (
                    <motion.div 
                      initial={{ x: 300, opacity: 0 }}
                      animate={{ x: 100, opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="absolute bottom-2 flex flex-col items-center"
                    >
                      <motion.div 
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.5 }}
                      >
                        <Car className="w-16 h-16 text-indigo-600" />
                        <div className="flex gap-1 mt-1 absolute bottom-0">
                          {/* Empty initially, then filled */}
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 }}
                            className="flex gap-1"
                          >
                            {[...Array(4)].map((_, i) => (
                              <div key={i} className="w-3 h-3 bg-indigo-400 rounded-full" /> 
                            ))}
                          </motion.div>
                        </div>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 }}
                        className="absolute -top-12 bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded whitespace-nowrap flex items-center gap-1"
                      >
                        <Navigation className="w-3 h-3" /> Replacement
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Status / Badges */}
        <div className="mt-16 flex flex-wrap justify-center gap-4">
          <AnimatePresence mode="wait">
            {scene === 1 && (
              <motion.div 
                key="b1"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-wrap justify-center gap-4 w-full"
              >
                <Badge icon={<XCircle className="w-4 h-4" />} text="More Fuel" type="error" />
                <Badge icon={<XCircle className="w-4 h-4" />} text="More Pollution" type="error" />
                <Badge icon={<XCircle className="w-4 h-4" />} text="More Traffic" type="error" />
                <Badge icon={<XCircle className="w-4 h-4" />} text="Higher Cost" type="error" />
              </motion.div>
            )}
            {scene === 2 && (
              <motion.div 
                key="b2"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-wrap justify-center gap-4 w-full"
              >
                <Badge icon={<CheckCircle className="w-4 h-4" />} text="Save Money" type="success" />
                <Badge icon={<CheckCircle className="w-4 h-4" />} text="Save Fuel" type="success" />
                <Badge icon={<CheckCircle className="w-4 h-4" />} text="Save Environment" type="success" />
                <Badge icon={<CheckCircle className="w-4 h-4" />} text="Reduce Traffic" type="success" />
              </motion.div>
            )}
            {scene === 3 && (
              <motion.div 
                key="b3"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 w-full"
              >
                <div className="text-sm font-mono bg-gray-900 text-green-400 px-4 py-2 rounded-lg">
                  &gt; Redis GEOSEARCH Active...
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  <Badge icon={<CheckCircle className="w-4 h-4" />} text="AutoShift Activated" type="success" />
                  <Badge icon={<CheckCircle className="w-4 h-4" />} text="Nearby Driver Assigned" type="success" />
                  <Badge icon={<CheckCircle className="w-4 h-4" />} text="Journey Continued" type="success" />
                  <Badge icon={<CheckCircle className="w-4 h-4" />} text="No Rebooking Required" type="success" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
}

function Badge({ icon, text, type }: { icon: React.ReactNode, text: string, type: 'error' | 'success' }) {
  const colors = type === 'error' 
    ? 'bg-red-100 text-red-700 border-red-200' 
    : 'bg-green-100 text-green-700 border-green-200';

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border font-bold text-sm shadow-sm ${colors}`}>
      {icon} {text}
    </div>
  );
}
