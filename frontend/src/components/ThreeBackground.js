// src/components/ThreeBackground.js
import React from 'react';

// Fallback component that doesn't use Three.js at all
const ThreeBackground = ({ style }) => {
  return (
    <div 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        background: 'linear-gradient(135deg, #323259 0%, #5e8bff 100%)',
        ...style 
      }}
    >
      {/* Animated background with CSS instead of Three.js */}
      <div className="animated-bg"></div>
    </div>
  );
};

export default ThreeBackground;