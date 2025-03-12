import React from 'react';

const CaptureOverlay = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 86.89 280.63"
        className="h-full w-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <style>
            {`
              .cls-1 {
                fill: #fff;
                opacity: .5;
              }
              
              .cls-2 {
                fill: none;
                stroke: #fff;
                stroke-miterlimit: 10;
                stroke-width: 1px;
              }
            `}
          </style>
        </defs>
        <path 
          className="cls-1" 
          d="M48.87,139.83c2.41,0,4.37,1.83,4.37,4.07v7.52c0,.52.42.95.95.95s.95-.42.95-.95v-7.52c0-3.29-2.81-5.97-6.27-5.97s-6.27,2.68-6.27,5.97v3.11c0,.52.42.95.95.95s.95-.42.95-.95v-3.11c0-2.25,1.96-4.07,4.37-4.07M32.83,138.99c-.52,0-.95.42-.95.95v11.68c0,3.29,2.81,5.97,6.27,5.97s6.27-2.68,6.27-5.97c0-.52-.42-.95-.95-.95s-.95.42-.95.95c0,2.25-1.96,4.07-4.37,4.07s-4.37-1.83-4.37-4.07v-11.68c0-.52-.42-.95-.95-.95M53.85,162.4h-20.61c-2.39,0-4.33-1.94-4.33-4.33v-20.61c0-2.39,1.94-4.33,4.33-4.33h20.61c2.39,0,4.33,1.94,4.33,4.33v20.61c0,2.39-1.94,4.33-4.33,4.33"
        />
        <rect 
          className="cls-2" 
          x="5.67" 
          y="5.67" 
          width="75.55" 
          height="269.29"
        />
      </svg>
    </div>
  );
};

export default CaptureOverlay;