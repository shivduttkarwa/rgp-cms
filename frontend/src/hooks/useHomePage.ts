import { useEffect, useState } from "react";
import type { CmsListing } from "./useListings";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

// ── Types ────────────────────────────────────────────────────────────────────

interface CmsImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

export interface SingleCTA {
  label: string;
  url: string;
}

export interface PanelButtons {
  btn1: SingleCTA;
  btn2: SingleCTA;
  btn3: SingleCTA;
  btn4: SingleCTA;
}

export type HeroCTA =
  | { type: "single_cta"; value: SingleCTA }
  | { type: "panel_buttons"; value: PanelButtons };

export interface HeroData {
  title_line1: string;
  title_line1_highlight: string;
  title_line2: string;
  title_line2_highlight: string;
  subtitle: string;
  bg_image: CmsImage | null;
  bg_video_url: string;
  cta: HeroCTA[];   // StreamBlock — array of 0 or 1 items
}

export interface IntroData {
  label: string;
  headline1: string;
  headline2: string;
  founder_name: string;
  text: string;
  cta1_label: string;
  cta1_url: string;
  cta2_label: string;
  cta2_url: string;
  image: CmsImage | null;
}

export interface FilterTab {
  category: "for-sale" | "sold" | "for-rent";
  label: string;
}

export interface ListingSectionData {
  badge_label: string;
  headline: string;
  subtitle: string;
  all_tab_label: string;
  filter_tabs: FilterTab[];
  selected_listings: CmsListing[];
  view_all_label: string;
  view_all_url: string;
}

export interface EoiCtaData {
  badge: string;
  title: string;
  text: string;
  button_label: string;
  button_url: string;
}

export interface ServiceHeaderData {
  eyebrow: string;
  title_prefix: string;
  title_highlight: string;
  subtitle: string;
}

export interface ServiceItemData {
  id: "buy" | "sell" | "rent";
  label: string;
  description: string;
  cta_label: string;
  cta_url: string;
}

export interface ServiceTrustStatData {
  value: string;
  label: string;
}

export interface ServiceCtaData {
  eyebrow: string;
  title_prefix: string;
  title_highlight: string;
  text: string;
  primary_label: string;
  primary_href: string;
  secondary_label: string;
  secondary_href: string;
  trust_stats: ServiceTrustStatData[];
}

export interface ServiceSectionData {
  header: ServiceHeaderData;
  services: ServiceItemData[];
  cta: ServiceCtaData;
}

export interface CmsVideoTestimonial {
  id: number;
  kicker: string;
  title: string;
  video_url: string;
  poster: { url: string } | null;
  tint_var: "gold" | "amber" | "crimson";
}

export interface VideoTestimonialSectionData {
  label: string;
  headline: string;
  headline_highlight: string;
  selected_testimonials: CmsVideoTestimonial[];
  cta_label: string;
  cta_url: string;
}

export interface HomePageData {
  hero: HeroData | null;
  intro: IntroData | null;
  listing_section: ListingSectionData | null;
  service_section: ServiceSectionData | null;
  testimonial_section: VideoTestimonialSectionData | null;
  eoi_cta: EoiCtaData | null;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export function resolveMediaUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
}

function parseBody(items: { type: string; value: unknown }[]): HomePageData {
  const data: HomePageData = { hero: null, intro: null, listing_section: null, service_section: null, testimonial_section: null, eoi_cta: null };
  for (const block of items) {
    if (block.type === "hero") data.hero = block.value as HeroData;
    if (block.type === "intro") data.intro = block.value as IntroData;
    if (block.type === "listing_section") data.listing_section = block.value as ListingSectionData;
    if (block.type === "service_section") data.service_section = block.value as ServiceSectionData;
    if (block.type === "testimonial_section") data.testimonial_section = block.value as VideoTestimonialSectionData;
    if (block.type === "eoi_cta") data.eoi_cta = block.value as EoiCtaData;
  }
  return data;
}

// ── Cache ─────────────────────────────────────────────────────────────────────

let cache: HomePageData | null = null;

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useHomePage() {
  const [data, setData] = useState<HomePageData | null | undefined>(
    cache ?? undefined,
  );

  useEffect(() => {
    fetch(`${API_BASE}/api/v2/pages/?type=home.HomePage&fields=body&limit=1`)
      .then((r) => r.json())
      .then((json) => {
        const body = json?.items?.[0]?.body;
        if (Array.isArray(body)) {
          cache = parseBody(body);
          setData(cache);
        }
      })
      .catch(() => {
        setData((current) => current ?? null);
      });
  }, []);

  return data;
}
