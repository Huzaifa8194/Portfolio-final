export type ProjectSlide = {
  title: string;
  description: string;
  image: string;
};

/** Used when `/images/*.png` is missing or fails to load (e.g. before you add assets). */
export const SELECTED_PROJECT_IMAGE_FALLBACKS = [
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80",
  "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&q=80",
  "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1920&q=80",
] as const;

export const SELECTED_PROJECTS: ProjectSlide[] = [
  {
    title: "Rivera Travels",
    description:
      "A visually immersive travel platform that transforms destination discovery into a seamless booking experience designed to inspire exploration, refined to turn dream trips into reality.",
    image: "/images/rivera_1.png",
  },
  {
    title: "Mayvn",
    description:
      "An AI-powered marketing assistant that automates campaigns from idea to execution — built to simplify complex workflows, refined to make high-impact marketing feel effortless.",
    image: "/images/mayvn_1.png",
  },
  {
    title: "iWrity",
    description:
      "A conversion-focused platform that connects authors with genuine readers for authentic, compliant reviews built to navigate strict marketplace policies, refined to deliver real growth without risking account integrity.",
    image: "/images/iwrity_1.png",
  },
];
