type LogoProps = {
  className?: string;
  size?: number;
};

export function LogoMark({ className, size = 36 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="16" fill="#1763D6" />
      <path
        d="M24 42c8.5-2.2 14.8-8.2 16.8-16.6"
        stroke="#fff"
        strokeWidth="4.4"
        strokeLinecap="round"
      />
      <path
        d="M20.5 35.2c7.2-1.6 12.4-6.6 14.2-13.6"
        stroke="#fff"
        strokeWidth="4.4"
        strokeLinecap="round"
      />
      <path
        d="M17.2 28.6c5.6-1.1 9.6-5 11.1-10.4"
        stroke="#fff"
        strokeWidth="4.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

type BrandLogoProps = {
  name: string;
  compact?: boolean;
};

export function BrandLogo({ name, compact }: BrandLogoProps) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark size={compact ? 32 : 36} />
      <span className={`font-extrabold leading-5 text-ink ${compact ? "max-w-40 truncate text-sm" : "text-sm"}`}>
        {name}
      </span>
    </span>
  );
}
