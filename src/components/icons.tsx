import type { SVGProps } from 'react';

export function SealOfMaharashtra(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      fill="currentColor"
      {...props}
    >
      <g>
        <path d="M100 10a90 90 0 1 0 0 180a90 90 0 0 0 0-180zm0 10a80 80 0 1 1 0 160a80 80 0 0 1 0-160z" />
        <path d="M100 30a70 70 0 1 0 0 140a70 70 0 0 0 0-140zm0 10a60 60 0 1 1 0 120a60 60 0 0 1 0-120z" />
        <circle cx="100" cy="100" r="25" />
        <path d="m100 45 5 10h10l-8 6 3 10-8-6-8 6 3-10-8-6h10z" />
        <path d="M50 100h100M100 50v100" stroke="currentColor" strokeWidth="5" fill="none" />
        <path d="M60 60 L140 140 M60 140 L140 60" stroke="currentColor" strokeWidth="5" fill="none" />
        <text
          x="100"
          y="155"
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          fill="currentColor"
        >
          सत्यमेव जयते
        </text>
      </g>
    </svg>
  );
}
