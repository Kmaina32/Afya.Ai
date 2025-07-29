import React from 'react';

export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="1em"
      height="1em"
      {...props}
    >
      <path fill="none" d="M0 0h256v256H0z" />
      <path
        fill="currentColor"
        d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm-8 48h16a8 8 0 0 1 0 16h-16a8 8 0 0 1 0-16Zm8 152a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88Z"
      />
      <path 
        fill="currentColor"
        d="M152 128a24 24 0 1 1-24-24 24 24 0 0 1 24 24Z"
      />
    </svg>
  );
}
