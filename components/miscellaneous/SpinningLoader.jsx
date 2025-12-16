import React from 'react';
import { LoaderCircle } from 'lucide-react';

const SpinningLoader = ({ color = 'text-blue-500', size = 32 }) => {
  return (
    <div
      className={`
        flex 
        items-center 
        justify-center 
        ${color}
      `}
      role="status"
      aria-label="Loading"
    >
      <LoaderCircle 
        size={size} 
        className="animate-spin" 
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default SpinningLoader;