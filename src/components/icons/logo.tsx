import React from 'react';

export const Logo = React.forwardRef<
  SVGSVGElement,
  React.SVGProps<SVGSVGElement>
>((props, ref) => {
  return (
    <svg
      ref={ref}
      viewBox="0 0 100 130"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g>
        <rect x="30" y="20" width="40" height="15" fill="#0f5159" />
        <rect x="42.5" y="5" width="15" height="45" fill="#f3b83f" />
        <path
          d="M 55,20 C 85,20 85,50 65,50 C 55,50 55,55 60,60"
          stroke="#0f5159"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="65" cy="65" r="7" fill="#f3b83f" />
        <circle
          cx="65"
          cy="65"
          r="8"
          stroke="#0f5159"
          strokeWidth="2"
          fill="none"
        />
      </g>
      <text
        x="50"
        y="95"
        fontFamily="sans-serif"
        fontSize="14"
        fill="#62cddc"
        textAnchor="middle"
        fontWeight="bold"
      >
        AFYA.AI
      </text>
      <text
        x="50"
        y="115"
        fontFamily="sans-serif"
        fontSize="8"
        fill="#62cddc"
        textAnchor="middle"
        letterSpacing="1"
      >
        Milleast.tech
      </text>
    </svg>
  );
});

Logo.displayName = 'Logo';
