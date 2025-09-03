import type { SVGProps } from 'react';

export function OrwellLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="2" y2="22" strokeWidth="0.5" opacity="0.3"/>
      <line x1="2" y1="12" y2="22" x2="22" strokeWidth="0.5" opacity="0.3"/>
    </svg>
  );
}
