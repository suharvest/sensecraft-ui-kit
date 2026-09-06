/** 内联 SVG 线框图标：避免把 @ant-design/icons 变成 kit 的硬依赖 */
import type { SVGProps } from 'react';

const base: SVGProps<SVGSVGElement> = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const MenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

export const GlobeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
  </svg>
);

export const UserIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" />
  </svg>
);

export const InboxIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props}>
    <path d="M3 13h5l1 3h6l1-3h5" />
    <path d="M5 5h14l2 8v6H3v-6z" />
  </svg>
);
