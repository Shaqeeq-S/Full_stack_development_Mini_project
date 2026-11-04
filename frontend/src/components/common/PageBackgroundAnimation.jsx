import React from 'react';
import { Droplet } from 'lucide-react';

const PageBackgroundAnimation = ({ variant = 'default', showEcg = false }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Ambient Pulsing Radial Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-red-100/50 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-rose-200/35 rounded-full blur-3xl animate-float-drift" />

      {/* Floating Red Blood Cell 1 (Top Left) */}
      <div className="absolute top-16 left-[5%] hidden lg:block animate-float-slow opacity-60">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-md shadow-red-500/25 flex items-center justify-center p-2.5 border border-red-300/50">
          <div className="w-6 h-6 rounded-full bg-red-900/60 shadow-inner" />
        </div>
      </div>

      {/* Floating Red Blood Cell 2 (Top Right) */}
      <div className="absolute top-24 right-[7%] hidden lg:block animate-float-reverse opacity-50">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-rose-700 shadow-lg shadow-red-500/20 flex items-center justify-center p-3 border border-red-300/40">
          <div className="w-7 h-7 rounded-full bg-red-950/60 shadow-inner" />
        </div>
      </div>

      {/* Floating Red Blood Cell 3 (Bottom Left) */}
      <div className="absolute bottom-16 left-[10%] hidden xl:block animate-float-drift opacity-40">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-red-700 shadow-sm flex items-center justify-center p-2 border border-red-200">
          <div className="w-5 h-5 rounded-full bg-red-900/50 shadow-inner" />
        </div>
      </div>

      {/* Micro Blood Drop Particles */}
      <div className="absolute top-36 left-[18%] hidden md:block animate-float-drift opacity-40">
        <Droplet className="w-5 h-5 text-red-500 fill-red-400" />
      </div>
      <div className="absolute bottom-28 right-[15%] hidden md:block animate-float-slow opacity-40">
        <Droplet className="w-6 h-6 text-red-600 fill-red-500" />
      </div>

      {/* Optional ECG Heartbeat Line */}
      {showEcg && (
        <div className="absolute inset-x-0 bottom-0 opacity-30">
          <svg
            className="w-full h-20 text-red-600"
            viewBox="0 0 1200 120"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0 60 L200 60 L220 60 L235 25 L250 100 L265 40 L280 75 L295 60 L500 60 L520 60 L535 20 L550 105 L565 35 L580 80 L595 60 L800 60 L820 60 L835 25 L850 100 L865 40 L880 75 L895 60 L1200 60"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-ecg"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default PageBackgroundAnimation;
