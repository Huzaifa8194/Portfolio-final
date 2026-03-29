import { BUILT_SLIDES } from "./built-carousel-data";

export type WorkGalleryItem = {
  id: number;
  title: string;
  cat: string;
  src: string;
  alt: string;
  /** Case study / project page — set when a page exists */
  detailHref?: string;
};

/** Inferred display names and categories from image filenames + carousel alts. */
function metaFromSrc(src: string, alt: string): { title: string; cat: string } {
  const base = src.replace(/^\/images\//, "").replace(/\.(png|jpe?g|webp|gif)$/i, "");

  const titled: Record<string, { title: string; cat: string }> = {
    mayvn: { title: "Mayvn", cat: "Marketing" },
    rivera: { title: "Rivera Travels", cat: "Travel" },
    iwrity: { title: "iWrity", cat: "Writing" },
    iwrity2: { title: "iWrity II", cat: "Writing" },
    bce: { title: "Best Car Events", cat: "Commerce" },
    oracle: { title: "Oracle Grupo", cat: "Enterprise" },
    lawandbar: { title: "Law & Bar", cat: "Legal" },
    sr: { title: "Nordic Relocators", cat: "Brand" },
  };

  const hit = titled[base];
  if (hit) return hit;

  const words = base.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return { title: words || alt, cat: "Work" };
}

function detailHrefFromSrc(src: string): string | undefined {
  const base = src.replace(/^\/images\//, "").replace(/\.(png|jpe?g|webp|gif)$/i, "");
  if (base === "iwrity" || base === "iwrity2") return "/projects/iwrity";
  if (base === "lawandbar") return "/projects/lawandbar";
  if (base === "sr") return "/projects/sr";
  if (base === "bce") return "/projects/bce";
  if (base === "oracle") return "/projects/oracle";
  if (base === "rivera") return "/projects/rivera";
  if (base === "mayvn") return "/projects/mayvn";
  return undefined;
}

export const WORK_GALLERY_ITEMS: WorkGalleryItem[] = BUILT_SLIDES.map((slide, i) => {
  const { title, cat } = metaFromSrc(slide.src, slide.alt);
  return {
    id: i + 1,
    title,
    cat,
    src: slide.src,
    alt: slide.alt,
    detailHref: detailHrefFromSrc(slide.src),
  };
});
