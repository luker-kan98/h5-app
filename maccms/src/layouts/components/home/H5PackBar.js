import Link from "next/link";
import { useTranslation } from "react-i18next";
import { HiArrowRight } from "react-icons/hi2";

const ICONS = [
  { src: "/images/home/h5-pack/ic-android.svg", alt: "Android" },
  { src: "/images/home/h5-pack/ic-apple.svg", alt: "iOS" },
  { src: "/images/home/h5-pack/ic-macos.svg", alt: "macOS" },
  { src: "/images/home/h5-pack/ic-windows.svg", alt: "Windows" },
];

export default function H5PackBar() {
  const { t } = useTranslation();

  return (
    <Link
      href="/h5-package"
      className="group inline-flex max-w-full items-center gap-3 rounded-full border border-gray-200/90 bg-white px-3.5 py-2 shadow-sm transition hover:border-primary/35 hover:shadow-md md:gap-4 md:px-5 md:py-2.5"
      aria-label={t("home.h5PackAria")}
    >
      <span className="flex shrink-0 items-center gap-2 md:gap-2.5" aria-hidden>
        {ICONS.map((icon) => (
          <img
            key={icon.alt}
            src={icon.src}
            alt={icon.alt}
            width={20}
            height={20}
            className="h-[18px] w-[18px] shrink-0 md:h-5 md:w-5"
            decoding="async"
          />
        ))}
      </span>
      <span className="min-w-0 text-sm font-medium text-dark md:text-base">
        {t("home.h5PackLabel")}
      </span>
      <HiArrowRight
        className="h-4 w-4 shrink-0 text-dark md:h-[18px] md:w-[18px]"
        aria-hidden
      />
    </Link>
  );
}
