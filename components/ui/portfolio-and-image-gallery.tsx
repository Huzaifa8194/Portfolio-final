"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  Ref,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function useMergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return useMemo(() => {
    if (refs.every((ref) => ref == null)) return null;
    return (node: T) => {
      refs.forEach((ref) => {
        if (typeof ref === "function") {
          ref(node);
        } else if (ref != null) {
          (ref as React.MutableRefObject<T | null>).current = node;
        }
      });
    };
  }, [refs]);
}

function useResponsiveValue(baseValue: number, mobileValue: number) {
  const [value, setValue] = useState(baseValue);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setValue(window.innerWidth < 768 ? mobileValue : baseValue);
    };

    handleResize();

    let timeoutId: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [baseValue, mobileValue]);

  return value;
}

/** Same turn rate as vertical scroll scrub: degrees per pixel of vertical scroll on desktop. */
function degreesPerPixel(scrollDuration: number) {
  return 360 / scrollDuration;
}

export interface RadialScrollGalleryProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children: (hoveredIndex: number | null) => ReactNode[];
  scrollDuration?: number;
  fullRotations?: number;
  visiblePercentage?: number;
  baseRadius?: number;
  mobileRadius?: number;
  startTrigger?: string;
  onItemSelect?: (index: number) => void;
  direction?: "ltr" | "rtl";
  disabled?: boolean;
}

export const RadialScrollGallery = forwardRef<
  HTMLDivElement,
  RadialScrollGalleryProps
>(
  (
    {
      children,
      scrollDuration = 2500,
      fullRotations = 32,
      visiblePercentage = 45,
      baseRadius = 550,
      mobileRadius = 220,
      className = "",
      startTrigger = "center center",
      onItemSelect,
      direction = "ltr",
      disabled = false,
      style,
      ...rest
    },
    ref,
  ) => {
    const pinRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLUListElement>(null);
    const childRef = useRef<HTMLLIElement>(null);

    const mergedRef = useMergeRefs(ref, pinRef);

    const [interaction, setInteraction] = useState<"scroll" | "swipe" | "pending">(
      "pending",
    );

    useLayoutEffect(() => {
      const mq = window.matchMedia("(max-width: 767px)");
      const sync = () => setInteraction(mq.matches ? "swipe" : "scroll");
      sync();
      mq.addEventListener("change", sync);
      return () => mq.removeEventListener("change", sync);
    }, []);

    const [hoverFinePointer, setHoverFinePointer] = useState(true);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
      const sync = () => setHoverFinePointer(mq.matches);
      sync();
      mq.addEventListener("change", sync);
      return () => mq.removeEventListener("change", sync);
    }, []);

    useEffect(() => {
      if (typeof window === "undefined") return;
      if (interaction !== "scroll") return;
      let timeoutId: ReturnType<typeof setTimeout>;
      const refresh = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          ScrollTrigger.refresh();
        }, 200);
      };
      window.addEventListener("orientationchange", refresh);
      window.addEventListener("resize", refresh);
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener("orientationchange", refresh);
        window.removeEventListener("resize", refresh);
      };
    }, [interaction]);

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [childSize, setChildSize] = useState<{ w: number; h: number } | null>(
      null,
    );
    const [isMounted, setIsMounted] = useState(false);

    const touchRotationRef = useRef(0);

    const currentRadius = useResponsiveValue(baseRadius, mobileRadius);
    const circleDiameter = currentRadius * 2;

    const { visibleDecimal, hiddenDecimal } = useMemo(() => {
      const clamped = Math.max(10, Math.min(100, visiblePercentage));
      const v = clamped / 100;
      return { visibleDecimal: v, hiddenDecimal: 1 - v };
    }, [visiblePercentage]);

    const childrenNodes = useMemo(
      () => React.Children.toArray(children(hoveredIndex)),
      [children, hoveredIndex],
    );
    const childrenCount = childrenNodes.length;

    useEffect(() => {
      setIsMounted(true);

      if (!childRef.current) return;

      const observer = new ResizeObserver((entries) => {
        let hasChanged = false;
        for (const entry of entries) {
          setChildSize({
            w: entry.contentRect.width,
            h: entry.contentRect.height,
          });
          hasChanged = true;
        }
        if (hasChanged && interaction === "scroll") {
          ScrollTrigger.refresh();
        }
      });

      observer.observe(childRef.current);
      return () => observer.disconnect();
    }, [childrenCount, interaction]);

    useGSAP(
      () => {
        if (interaction === "pending") return;
        if (!pinRef.current || !containerRef.current || childrenCount === 0)
          return;

        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        if (prefersReducedMotion) return;

        const totalDeg = 360 * fullRotations;
        const degPerPx = degreesPerPixel(scrollDuration);
        const rtl = direction === "rtl" ? -1 : 1;

        const intro = () => {
          gsap.fromTo(
            containerRef.current!.children,
            { scale: 0, autoAlpha: 0 },
            {
              scale: 1,
              autoAlpha: 1,
              duration: 1.2,
              ease: "back.out(1.2)",
              stagger: 0.05,
              ...(interaction === "scroll"
                ? {
                    scrollTrigger: {
                      trigger: pinRef.current!,
                      start: "top 80%",
                      toggleActions: "play none none reverse",
                    },
                  }
                : {}),
            },
          );
        };

        if (interaction === "scroll") {
          intro();

          gsap.to(containerRef.current, {
            rotation: totalDeg,
            ease: "none",
            scrollTrigger: {
              trigger: pinRef.current,
              pin: true,
              pinSpacing: true,
              start: startTrigger,
              end: `+=${scrollDuration * fullRotations}`,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          return () => {};
        }

        /* —— Swipe (mobile): same total rotation range, driven by horizontal drag —— */
        intro();

        touchRotationRef.current = 0;
        gsap.set(containerRef.current, { rotation: 0 });

        const list = containerRef.current;
        const zone = pinRef.current;
        let dragging = false;
        let lastX = 0;

        const applyRotation = (next: number) => {
          const clamped = Math.max(0, Math.min(totalDeg, next));
          touchRotationRef.current = clamped;
          gsap.set(list, { rotation: clamped });
        };

        const onPointerDown = (e: PointerEvent) => {
          if (disabled) return;
          if (e.pointerType === "mouse" && e.button !== 0) return;
          dragging = true;
          lastX = e.clientX;
          zone.setPointerCapture(e.pointerId);
        };

        const onPointerMove = (e: PointerEvent) => {
          if (!dragging || disabled) return;
          const dx = e.clientX - lastX;
          lastX = e.clientX;
          const deltaDeg = dx * degPerPx * rtl;
          applyRotation(touchRotationRef.current + deltaDeg);
        };

        const endDrag = (e: PointerEvent) => {
          if (!dragging) return;
          dragging = false;
          try {
            zone.releasePointerCapture(e.pointerId);
          } catch {
            /* ignore */
          }
        };

        zone.addEventListener("pointerdown", onPointerDown);
        zone.addEventListener("pointermove", onPointerMove);
        zone.addEventListener("pointerup", endDrag);
        zone.addEventListener("pointercancel", endDrag);
        zone.addEventListener("lostpointercapture", endDrag);

        return () => {
          zone.removeEventListener("pointerdown", onPointerDown);
          zone.removeEventListener("pointermove", onPointerMove);
          zone.removeEventListener("pointerup", endDrag);
          zone.removeEventListener("pointercancel", endDrag);
          zone.removeEventListener("lostpointercapture", endDrag);
        };
      },
      {
        scope: pinRef,
        dependencies: [
          interaction,
          scrollDuration,
          fullRotations,
          currentRadius,
          startTrigger,
          childrenCount,
          direction,
          disabled,
        ],
      },
    );

    if (childrenCount === 0) return null;

    if (interaction === "pending") {
      return (
        <div
          className={`min-h-[min(100dvh,720px)] w-full bg-black ${className}`}
          aria-hidden
        />
      );
    }

    const scaleFactor = 1.25;
    const calculatedBuffer = childSize
      ? childSize.h * scaleFactor - childSize.h + 60
      : 150;

    const visibleAreaHeight = childSize
      ? circleDiameter * visibleDecimal + childSize.h / 2 + calculatedBuffer
      : circleDiameter * visibleDecimal + 200;

    const swipeZoneClass =
      interaction === "swipe"
        ? "touch-none cursor-grab active:cursor-grabbing select-none"
        : "touch-pan-y";

    return (
      <div
        ref={mergedRef}
        className={`min-h-screen w-full relative flex items-center justify-center overflow-hidden overscroll-y-contain ${swipeZoneClass} ${className}`}
        style={{ overscrollBehaviorY: "contain", ...style }}
        role={interaction === "swipe" ? "application" : undefined}
        aria-label={
          interaction === "swipe"
            ? "Spin the project wheel by dragging horizontally"
            : undefined
        }
        {...rest}
      >
        {interaction === "swipe" && (
          <p className="pointer-events-none absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-0 right-0 z-20 text-center text-[11px] tracking-wide text-white/40 px-4">
            Drag left or right to spin
          </p>
        )}
        <div
          className="relative w-full overflow-hidden overscroll-y-contain"
          style={{
            height: `${visibleAreaHeight}px`,
            maskImage:
              "linear-gradient(to top, transparent 0%, black 40%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to top, transparent 0%, black 40%, black 100%)",
          }}
        >
          <ul
            ref={containerRef}
            className={`
              absolute left-1/2 -translate-x-1/2 will-change-transform m-0 p-0 list-none
              transition-opacity duration-500 ease-out
              ${disabled ? "opacity-50 pointer-events-none grayscale" : ""}
              ${isMounted ? "opacity-100" : "opacity-0"}
            `}
            dir={direction}
            style={{
              width: circleDiameter,
              height: circleDiameter,
              bottom: -(circleDiameter * hiddenDecimal),
            }}
          >
            {childrenNodes.map((child, index) => {
              const angle = (index / childrenCount) * 2 * Math.PI;
              let x = currentRadius * Math.cos(angle);
              const y = currentRadius * Math.sin(angle);

              if (direction === "rtl") {
                x = -x;
              }

              const rotationAngle = (angle * 180) / Math.PI;
              const isHovered = hoveredIndex === index;
              const isAnyHovered = hoveredIndex !== null;

              return (
                <li
                  key={index}
                  ref={index === 0 ? childRef : null}
                  className="absolute top-1/2 left-1/2"
                  style={{
                    zIndex: isHovered ? 100 : 10,
                    transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) rotate(${
                      rotationAngle + 90
                    }deg)`,
                  }}
                >
                  <div
                    role="button"
                    tabIndex={disabled ? -1 : 0}
                    onClick={() => !disabled && onItemSelect?.(index)}
                    onKeyDown={(e) => {
                      if (disabled) return;
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onItemSelect?.(index);
                      }
                    }}
                    onMouseEnter={() =>
                      !disabled && hoverFinePointer && setHoveredIndex(index)
                    }
                    onMouseLeave={() =>
                      !disabled && hoverFinePointer && setHoveredIndex(null)
                    }
                    onPointerDown={() =>
                      !disabled &&
                      interaction === "swipe" &&
                      !hoverFinePointer &&
                      setHoveredIndex(index)
                    }
                    onPointerUp={() =>
                      !disabled &&
                      interaction === "swipe" &&
                      !hoverFinePointer &&
                      setHoveredIndex(null)
                    }
                    onFocus={() => !disabled && setHoveredIndex(index)}
                    onBlur={() => !disabled && setHoveredIndex(null)}
                    className={`
                      block cursor-pointer outline-none text-left
                      focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black
                      rounded-xl transition-[filter,opacity,transform] duration-500 ease-out will-change-transform
                      ${hoverFinePointer && isHovered ? "md:scale-105 md:-translate-y-3" : "scale-100 translate-y-0"}
                      ${
                        hoverFinePointer && isAnyHovered && !isHovered
                          ? "blur-[2px] opacity-40 grayscale"
                          : "blur-0 opacity-100"
                      }
                    `}
                  >
                    {child}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  },
);

RadialScrollGallery.displayName = "RadialScrollGallery";
