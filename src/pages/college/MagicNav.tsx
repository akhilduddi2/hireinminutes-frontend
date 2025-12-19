import React from 'react';
import type { MenuItem } from './types';

interface MagicNavProps {
  menuItems: MenuItem[];
  isVisible: boolean;
  activeSection?: string;
  onNavigate?: (section: string) => void;
}

export const MagicNav: React.FC<MagicNavProps> = ({ menuItems, isVisible, activeSection = 'overview', onNavigate }) => {
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <ul
        className="relative flex justify-center items-center gap-4"
        style={{
          width: '400px',
          height: '80px',
          background: '#242433',
          boxShadow: 'inset 5px 5px 10px rgba(0, 0, 0, 0.5), inset 5px 5px 20px rgba(255, 255, 255, 0.2), inset -5px -5px 15px rgba(0, 0, 0, 0.75)',
          borderRadius: '20px',
          paddingLeft: '20px',
          paddingRight: '20px',
        }}
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <li
              key={item.id}
              className="relative list-none"
              style={{ width: '80px' }}
            >
              <button
                onClick={() => onNavigate?.(item.id)}
                className="flex items-center justify-center flex-col w-full h-full relative group"
                title={item.label}
              >
                {/* Icon Circle */}
                <div
                  className="absolute flex items-center justify-center rounded-full transition-all duration-500"
                  style={{
                    width: '55px',
                    height: '55px',
                    color: isActive ? '#fff' : '#aaa',
                    background: isActive ? '#fff' : 'transparent',
                    transform: isActive ? 'translateY(-38px)' : 'translateY(0)',
                    boxShadow: isActive
                      ? '5px 5px 7px rgba(0, 0, 0, 0.25), inset 2px 2px 3px rgba(255, 255, 255, 0.25), inset -3px -3px 5px rgba(0, 0, 0, 0.5)'
                      : 'none',
                    transitionDelay: isActive ? '0s' : '0.2s',
                  }}
                >
                  {/* Inner circle for active state */}
                  <div
                    className="absolute rounded-full transition-all duration-500"
                    style={{
                      inset: '7px',
                      background: '#2f363e',
                      boxShadow: '5px 5px 5px rgba(0, 0, 0, 0.5), inset 2px 2px 3px rgba(255, 255, 255, 0.25), inset -3px -3px 5px rgba(0, 0, 0, 0.5)',
                      transform: isActive ? 'scale(1)' : 'scale(0)',
                    }}
                  />
                  <Icon className={`relative z-10 w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />

                  {/* Notification Badge */}
                  {item.count !== null && item.count > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-[#242433] shadow-lg z-20">
                      {item.count > 9 ? '9+' : item.count}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  className="absolute text-xs font-medium transition-all duration-500 mt-1"
                  style={{
                    color: isActive ? '#fff' : '#aaa',
                    transform: isActive ? 'translateY(-45px)' : 'translateY(0)',
                    opacity: isActive ? 1 : 0,
                  }}
                >
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MagicNav;
