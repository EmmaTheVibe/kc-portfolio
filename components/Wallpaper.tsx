import Image from "next/image";
import desktopPhoto from "@/public/wallpaper-pc.jpg";
import phonePhoto from "@/public/wallpaper-mobile.jpg";

const photos = { macos: desktopPhoto, windows: desktopPhoto, ios: phonePhoto, android: phonePhoto };

const LIGHT = `radial-gradient(120% 90% at 15% 0%, #a7c4ec 0%, transparent 55%),
  radial-gradient(110% 80% at 90% 10%, #c9b8e8 0%, transparent 50%),
  radial-gradient(130% 100% at 50% 110%, #f0b98d 0%, transparent 55%),
  linear-gradient(165deg, #7ea6da 0%, #9db4e2 35%, #c4b3d9 60%, #e2af97 100%)`;

const DARK = `radial-gradient(120% 90% at 15% 0%, #1d2c4f 0%, transparent 55%),
  radial-gradient(110% 80% at 90% 10%, #35284f 0%, transparent 50%),
  radial-gradient(130% 100% at 50% 115%, #6d3f2e 0%, transparent 50%),
  linear-gradient(165deg, #101a33 0%, #1a2342 40%, #2b2547 65%, #3a2b33 100%)`;

/** Both gradient layers are always rendered; the `.dark` class crossfades them, so there's no flash. */
export function GradientBackdrop() {
  return (
    <>
      <div
        className="absolute inset-0 opacity-100 transition-opacity duration-700 dark:opacity-0"
        style={{ background: LIGHT }}
      />
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-700 dark:opacity-100"
        style={{ background: DARK }}
      />
    </>
  );
}

/** The gradient, with the skin's own photo on top once the skin is known (the same in both themes). */
export function Wallpaper({ skin }: { skin: keyof typeof photos | null }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <GradientBackdrop />
      {skin && (
        <Image
          key={photos[skin].src}
          src={photos[skin]}
          alt=""
          fill
          sizes="100vw"
          loading="eager"
          placeholder="blur"
          className="object-cover"
        />
      )}
    </div>
  );
}
