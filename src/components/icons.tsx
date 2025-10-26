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


export function NICIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 30"
      fill="none"
      {...props}
    >
      <text
        x="5"
        y="20"
        fontFamily="Arial, sans-serif"
        fontSize="20"
        fontWeight="bold"
        fill="currentColor"
      >
        NIC
      </text>
      <text
        x="45"
        y="12"
        fontFamily="Arial, sans-serif"
        fontSize="8"
        fill="currentColor"
      >
        एनआईसी
      </text>
      <text
        x="45"
        y="22"
        fontFamily="Arial, sans-serif"
        fontSize="8"
        fill="currentColor"
      >
        National Informatics Centre
      </text>
    </svg>
  );
}

export function DigitalIndiaIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 30"
      fill="currentColor"
      {...props}
    >
      <text
        x="0"
        y="20"
        fontFamily="Arial, sans-serif"
        fontSize="20"
        fontWeight="bold"
      >
        <tspan fill="#FF6F00">D</tspan>
        <tspan fill="#000">igital </tspan>
        <tspan fill="#00C853">I</tspan>
        <tspan fill="#000">ndia</tspan>
      </text>
      <text
        x="0"
        y="28"
        fontFamily="Arial, sans-serif"
        fontSize="6"
        fill="#000"
      >
        Power To Empower
      </text>
    </svg>
  );
}
