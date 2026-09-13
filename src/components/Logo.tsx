import Image from "next/image";

type BrandLogoProps = {
  name: string;
  compact?: boolean;
};

export function BrandLogo({ name, compact }: BrandLogoProps) {
  const shortName = name
    .replace("پروفسور ", "")
    .replace("Prof. ", "")
    .replace(" Polyclinic", "");

  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <Image
        src="/brand/clinic-logo.jpg"
        alt=""
        width={compact ? 36 : 42}
        height={compact ? 36 : 42}
        className="size-9 shrink-0 rounded-lg bg-primary-ink object-cover md:size-[42px]"
      />
      <span
        title={name}
        className={`min-w-0 font-extrabold leading-5 text-ink ${
          compact ? "text-[13px] sm:text-sm" : "text-sm"
        }`}
      >
        <span className="block truncate">{compact ? shortName : name}</span>
      </span>
    </span>
  );
}
