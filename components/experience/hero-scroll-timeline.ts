/**
 * Single source of truth for hero progress 0→1 (was scroll-scrubbed; now advanced by discrete
 * wheel steps — see {@link HERO_STORY_STEP_TARGETS}).
 *
 * Selected Work carousel (T_CAROUSEL_START → T_CAROUSEL_END) uses **piecewise** time:
 * each slide gets expand → hold (p frozen, “empty” scroll) → left rail fades in.
 * Scroll only advances **p** during expand sub-segments; holds consume scroll with no motion.
 * Before each new slide’s expand (except slide 0), the left rail fades out so the center
 * animation leads again, then a **dwell** (extra scroll, p frozen) runs so Mayvn / iWrity
 * don’t start expanding immediately, then p advances — final beat ends static with rail visible.
 */

export const T_DOORS_END = 0.26;

export const T_INTRO_OPACITY = [0.05, 0.15, 0.26, 0.36] as const;
export const T_INTRO_Y = [0.06, 0.15, 0.27, 0.36] as const;
export const T_INTRO_SCALE = [0.08, 0.17, 0.29, 0.36] as const;
export const T_INTRO_ROTATE = [0.06, 0.28] as const;

export const T_INTRO_FULLY_OUT = T_INTRO_OPACITY[3];

export const T_WORK_SCENE_START = 0.38;

/** Rivera / first beat: snap to full opacity — no long fade-in over the first slide */
export const T_WORK_SCENE_OPACITY = [0.38, 0.395, 1] as const;

export const T_WORK_CHROME_START = 0.41;
export const T_WORK_CHROME_END = 0.48;

/** Carousel window — same v-range as before; physical scroll length no longer drives it */
export const T_CAROUSEL_START = 0.52;
export const T_CAROUSEL_END = 0.99;

export const T_WORK_INTERACT = 0.44;

/**
 * Scroll (full-track v) after the work scene is fully visible until the carousel timeline
 * starts — idle Rivera, same band as “Next section / Your work, projects…” fading out before
 * the doors phase hands off to Selected Work. Used to tune inter-slide spacing below.
 */
export const REF_V_WORK_FULL_TO_CAROUSEL =
  T_CAROUSEL_START - T_WORK_SCENE_OPACITY[1];

/**
 * How wide a slice of carousel `t` would need to be to consume
 * {@link REF_V_WORK_FULL_TO_CAROUSEL} in full-track `v` (~0.266). The timeline cannot give
 * that much to every hold+left segment without shrinking beats or widening the carousel
 * window; segment edges use a shared hold+left width so Rivera → Mayvn and
 * Mayvn → iWrity match each other.
 */
export const REF_T_EQUIVALENT_WORK_TO_CAROUSEL =
  REF_V_WORK_FULL_TO_CAROUSEL / (T_CAROUSEL_END - T_CAROUSEL_START);

/** Higher = expansion reaches “full” later in p → slower motion (Selected Work only) */
export const EXPAND_RATIO = 0.99;

/** Crossfade width in p-space (must match SelectedWork BLEND) */
export const CAROUSEL_BLEND = 0.12;

/** Freeze p just below blend start so one slide stays “full” during hold + left-rail */
const P0 = 1 - CAROUSEL_BLEND - 0.01; // ~0.87 on slide 0
const P1 = 2 - CAROUSEL_BLEND - 0.01;
const P2 = 3 - CAROUSEL_BLEND - 0.01;

/** Fraction of s1_expand / s2_expand local u: rail fades out, then long dwell, then p moves */
const S12_RAIL_OUT_U = 0.11;
const S12_DWELL_U = 0.48;

/** Start of s0_expand: scroll with p=0 (Rivera idle) before expansion begins */
const S0_PRE_DWELL_U = 0.34;

/**
 * Cumulative t ∈ [0,1]. Each slide’s hold + left-rail pair uses the same width (~0.15 of
 * carousel t, ~0.0705 full-track v) so Rivera→Mayvn and Mayvn→iWrity feel even; see
 * {@link REF_V_WORK_FULL_TO_CAROUSEL} / {@link REF_T_EQUIVALENT_WORK_TO_CAROUSEL} for the
 * larger “work scene on → carousel starts” reference (~0.125 v).
 */
export const CAROUSEL_T_EDGES = [
  0, 0.095, 0.183, 0.245, 0.445, 0.533, 0.595, 0.795, 0.883, 0.945, 1,
] as const;

const EDGES = CAROUSEL_T_EDGES;

const SEGMENT_KINDS = [
  "s0_expand",
  "s0_hold",
  "s0_left",
  "s1_expand",
  "s1_hold",
  "s1_left",
  "s2_expand",
  "s2_hold",
  "s2_left",
  "tail",
] as const;

type SegmentKind = (typeof SEGMENT_KINDS)[number];

function segmentAt(t: number): { seg: SegmentKind; u: number } {
  const x = Math.min(1, Math.max(0, t));
  for (let i = 0; i < EDGES.length - 1; i++) {
    const a = EDGES[i];
    const b = EDGES[i + 1];
    const last = i === EDGES.length - 2;
    if (x >= a && (last ? x <= b : x < b)) {
      const u = b > a ? (Math.min(x, b) - a) / (b - a) : 0;
      return { seg: SEGMENT_KINDS[i], u: Math.min(1, Math.max(0, u)) };
    }
  }
  return { seg: "tail", u: 1 };
}

function smoothstep01(x: number): number {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
}

/** Slower-than-linear p within expand segments — same carousel window, gentler motion */
function expandEaseIn(u: number): number {
  const t = Math.min(1, Math.max(0, u));
  return Math.pow(t, 1.85);
}

/**
 * Effective carousel parameter p and left-rail opacity for editorial column.
 * Rail fades out at the start of s1/s2 expand, then expansion runs, then hold, then rail fades in.
 */
export function carouselTimeline(v: number): { p: number; railOpacity: number } {
  if (v <= T_CAROUSEL_START) return { p: 0, railOpacity: 0 };
  if (v >= T_CAROUSEL_END) return { p: 3, railOpacity: 1 };

  const t = (v - T_CAROUSEL_START) / (T_CAROUSEL_END - T_CAROUSEL_START);
  const { seg, u } = segmentAt(t);

  switch (seg) {
    case "s0_expand": {
      if (u < S0_PRE_DWELL_U) {
        return { p: 0, railOpacity: 0 };
      }
      const u2 = (u - S0_PRE_DWELL_U) / (1 - S0_PRE_DWELL_U);
      const p = P0 * expandEaseIn(u2);
      return { p, railOpacity: 0 };
    }
    case "s0_hold":
      return { p: P0, railOpacity: 0 };
    case "s0_left":
      return { p: P0, railOpacity: smoothstep01(u) };
    case "s1_expand": {
      const dwellEnd = S12_RAIL_OUT_U + S12_DWELL_U;
      if (u < S12_RAIL_OUT_U) {
        const ru = u / S12_RAIL_OUT_U;
        return { p: P0, railOpacity: 1 - smoothstep01(ru) };
      }
      if (u < dwellEnd) {
        return { p: P0, railOpacity: 0 };
      }
      const u2 = (u - dwellEnd) / (1 - dwellEnd);
      const p = P0 + expandEaseIn(u2) * (P1 - P0);
      return { p, railOpacity: 0 };
    }
    case "s1_hold":
      return { p: P1, railOpacity: 0 };
    case "s1_left":
      return { p: P1, railOpacity: smoothstep01(u) };
    case "s2_expand": {
      const dwellEnd = S12_RAIL_OUT_U + S12_DWELL_U;
      if (u < S12_RAIL_OUT_U) {
        const ru = u / S12_RAIL_OUT_U;
        return { p: P1, railOpacity: 1 - smoothstep01(ru) };
      }
      if (u < dwellEnd) {
        return { p: P1, railOpacity: 0 };
      }
      const u2 = (u - dwellEnd) / (1 - dwellEnd);
      const p = P1 + expandEaseIn(u2) * (P2 - P1);
      return { p, railOpacity: 0 };
    }
    case "s2_hold":
      return { p: P2, railOpacity: 0 };
    case "s2_left":
      return { p: P2, railOpacity: smoothstep01(u) };
    case "tail":
      return { p: 3, railOpacity: 1 };
    default:
      return { p: 3, railOpacity: 1 };
  }
}

/** @deprecated use carouselTimeline(v).p — kept name for minimal churn in components */
export function progressToP(v: number): number {
  return carouselTimeline(v).p;
}

export function expandProgressForSlide(p: number, slideIndex: number): number {
  const local = p - slideIndex;
  if (local <= 0) return 0;
  if (local >= 1) return 1;
  return Math.min(1, local / EXPAND_RATIO);
}

export function workChromeGate(v: number): number {
  if (v <= T_WORK_CHROME_START) return 0;
  if (v >= T_WORK_CHROME_END) return 1;
  return (v - T_WORK_CHROME_START) / (T_WORK_CHROME_END - T_WORK_CHROME_START);
}

/** Left rail opacity from timeline (replaces old p-only gate) */
export function leftRailOpacityFromV(v: number): number {
  return carouselTimeline(v).railOpacity;
}

/** True only while p is advancing (not rail-out or dwell on slides 1–2) */
export function carouselExpandMotionActive(v: number): boolean {
  if (v <= T_CAROUSEL_START || v >= T_CAROUSEL_END) return false;
  const t = (v - T_CAROUSEL_START) / (T_CAROUSEL_END - T_CAROUSEL_START);
  const { seg, u } = segmentAt(t);
  if (seg === "s0_expand") return u >= S0_PRE_DWELL_U;
  const dwellEnd = S12_RAIL_OUT_U + S12_DWELL_U;
  if (seg === "s1_expand" || seg === "s2_expand") {
    return u >= dwellEnd;
  }
  return false;
}

/** Monotonic 0→1 stops: one wheel / key step advances to the next value (animated) */
function buildHeroStoryStepTargets(): number[] {
  const span = T_CAROUSEL_END - T_CAROUSEL_START;
  const carouselVs = CAROUSEL_T_EDGES.map((e) => T_CAROUSEL_START + e * span);
  const pre: number[] = [
    0,
    0.04,
    T_DOORS_END * 0.35,
    T_DOORS_END * 0.72,
    T_DOORS_END,
    T_INTRO_OPACITY[0],
    T_INTRO_OPACITY[1],
    T_INTRO_OPACITY[2],
    T_INTRO_FULLY_OUT,
    T_WORK_SCENE_OPACITY[0],
    T_WORK_SCENE_OPACITY[1],
    T_CAROUSEL_START,
  ];
  const merged = [...pre, ...carouselVs.filter((v) => v > T_CAROUSEL_START + 1e-4)];
  const out = Array.from(new Set(merged.map((x) => Math.round(x * 1e6) / 1e6))).sort(
    (a, b) => a - b,
  );
  if (out[out.length - 1] < 1) out.push(1);
  return out;
}

export const HERO_STORY_STEP_TARGETS: readonly number[] = buildHeroStoryStepTargets();
