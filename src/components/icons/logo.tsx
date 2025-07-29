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
        d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm41.16 148.85a8 8 0 0 1-11.32 0L128 143.14l-29.84 29.71a8 8 0 0 1-11.32-11.31L116.69 132l-29.86-29.85a8 8 0 0 1 11.32-11.31L128 120.69l29.84-29.85a8 8 0 0 1 11.32 11.31L139.31 132l29.85 29.85a8 8 0 0 1 0 11.31Z"
      />
    </svg>
  );
}
