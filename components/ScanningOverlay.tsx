
import React from 'react';

export const ScanningOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <div className="scanner-line"></div>
      <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>
    </div>
  );
};
