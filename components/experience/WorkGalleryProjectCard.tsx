import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import type { WorkGalleryItem } from "@/components/experience/work-gallery-data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type WorkGalleryProjectCardProps = {
  project: WorkGalleryItem;
  isActive: boolean;
  className?: string;
  /** Larger type + padding for mobile featured slides */
  variant?: "wheel" | "featured";
  /** Next/Image LCP hint — only first card in a list */
  imagePriority?: boolean;
};

export function WorkGalleryProjectCard({
  project,
  isActive,
  className,
  variant = "wheel",
  imagePriority = false,
}: WorkGalleryProjectCardProps) {
  const featured = variant === "featured";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-neutral-950 border border-white/10 shadow-lg",
        featured && "rounded-2xl border-white/[0.12] shadow-black/40",
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0 overflow-hidden flex items-center justify-center",
          featured ? "p-4 sm:p-5" : "p-2",
        )}
      >
        <Image
          src={project.src}
          alt={project.alt}
          fill
          className={cn(
            "object-contain object-center transition-[filter,opacity] duration-300 ease-out",
            isActive ? "opacity-100" : "opacity-[0.88] grayscale-[20%]",
          )}
          sizes={featured ? "(max-width: 768px) 90vw, 400px" : "220px"}
          draggable={false}
          priority={imagePriority}
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/5 to-transparent",
            featured ? "opacity-80" : "opacity-70",
          )}
        />
      </div>

      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-between",
          featured ? "p-5 sm:p-6" : "p-4",
        )}
      >
        <div className="flex justify-between items-start gap-2">
          <Badge
            variant="secondary"
            className={cn(
              "text-[10px] px-2 py-0 bg-black/70 text-white border-white/10 backdrop-blur",
              featured && "text-[11px] px-2.5",
            )}
          >
            {project.cat}
          </Badge>
          <div
            className={cn(
              "shrink-0 rounded-full bg-white text-black flex items-center justify-center transition-all duration-300",
              featured ? "w-8 h-8" : "w-6 h-6",
              isActive ? "opacity-100 rotate-0" : "opacity-0 -rotate-45 scale-90",
            )}
          >
            <ArrowUpRight size={featured ? 14 : 12} />
          </div>
        </div>

        <div>
          <h3
            className={cn(
              "font-bold leading-tight text-white tracking-tight",
              featured ? "text-2xl sm:text-3xl" : "text-xl",
            )}
          >
            {project.title}
          </h3>
          <div
            className={cn(
              "h-0.5 bg-white mt-2 transition-all duration-300",
              isActive ? "w-full opacity-100" : "w-0 opacity-0",
            )}
          />
        </div>
      </div>
    </div>
  );
}
