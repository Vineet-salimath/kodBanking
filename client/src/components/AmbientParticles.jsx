/**
 * AmbientParticles.jsx
 * Decorative floating particles — pure CSS/Framer Motion, zero logic impact.
 */
import { motion } from 'framer-motion';

const PARTICLES = [
  { id: 1, x: '10%',  y: '20%', size: 3,  delay: 0,   dur: 7  },
  { id: 2, x: '85%',  y: '15%', size: 2,  delay: 1,   dur: 9  },
  { id: 3, x: '50%',  y: '70%', size: 4,  delay: 2,   dur: 11 },
  { id: 4, x: '25%',  y: '55%', size: 2,  delay: 0.5, dur: 8  },
  { id: 5, x: '70%',  y: '40%', size: 3,  delay: 3,   dur: 10 },
  { id: 6, x: '40%',  y: '10%', size: 2,  delay: 1.5, dur: 6  },
  { id: 7, x: '90%',  y: '80%', size: 3,  delay: 4,   dur: 12 },
  { id: 8, x: '15%',  y: '85%', size: 2,  delay: 2.5, dur: 9  },
];

export default function AmbientParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {/* Background orbs */}
      <div
        className="absolute top-[-10%] left-[30%] w-[600px] h-[600px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #9333ea 0%, transparent 70%)', filter: 'blur(60px)' }}
      />
      <div
        className="absolute bottom-[-5%] right-[20%] w-80 h-80 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)', filter: 'blur(50px)' }}
      />
      <div
        className="absolute top-[40%] left-[-5%] w-64 h-64 rounded-full opacity-8"
        style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', filter: 'blur(40px)' }}
      />

      {/* Floating dots */}
      {PARTICLES.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.x,
            top:  p.y,
            width:  p.size,
            height: p.size,
            background: 'rgba(168, 85, 247, 0.6)',
            boxShadow: `0 0 ${p.size * 3}px rgba(168, 85, 247, 0.8)`,
          }}
          animate={{
            y:       [0, -40, -20, -60, 0],
            x:       [0, 15,  -10,  8,  0],
            opacity: [0.3, 0.7, 0.4, 0.6, 0.3],
          }}
          transition={{
            duration: p.dur,
            delay:    p.delay,
            repeat:   Infinity,
            ease:     'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
