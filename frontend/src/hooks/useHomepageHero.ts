import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

const FIELDS = [
  "hero_title_line1",
  "hero_title_line1_highlight",
  "hero_title_line2",
  "hero_title_line2_highlight",
  "hero_subtitle",
  "hero_bg_image",
  "hero_bg_video_url",
  "hero_btn1_label", "hero_btn1_url",
  "hero_btn2_label", "hero_btn2_url",
  "hero_btn3_label", "hero_btn3_url",
  "hero_btn4_label", "hero_btn4_url",
  "intro_label",
  "intro_headline1",
  "intro_headline2",
  "intro_founder_name",
  "intro_text",
  "intro_cta1_label", "intro_cta1_url",
  "intro_cta2_label", "intro_cta2_url",
  "intro_image",
].join(",");

export interface HeroPanelBtn {
  label: string;
  url: string;
}

export interface HomepageHeroData {
  hero_title_line1: string;
  hero_title_line1_highlight: string;
  hero_title_line2: string;
  hero_title_line2_highlight: string;
  hero_subtitle: string;
  hero_bg_image: { url: string } | null;
  hero_bg_video_url: string;
  hero_btn1_label: string; hero_btn1_url: string;
  hero_btn2_label: string; hero_btn2_url: string;
  hero_btn3_label: string; hero_btn3_url: string;
  hero_btn4_label: string; hero_btn4_url: string;
  intro_label: string;
  intro_headline1: string;
  intro_headline2: string;
  intro_founder_name: string;
  intro_text: string;
  intro_cta1_label: string; intro_cta1_url: string;
  intro_cta2_label: string; intro_cta2_url: string;
  intro_image: { url: string } | null;
}

// Resolve media URLs that come from Wagtail as relative paths (e.g. /media/...)
export function resolveMediaUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
}

// Module-level cache — survives navigations so the data is available
// synchronously on re-renders, preventing GSAP DOM mutations being
// overwritten by a late-arriving state update.
let cache: HomepageHeroData | null = null;

export function useHomepageHero() {
  const [data, setData] = useState<HomepageHeroData | null>(cache);

  useEffect(() => {
    if (cache) return; // already fetched, no need to refetch
    fetch(
      `${API_BASE}/api/v2/pages/?type=home.HomePage&fields=${FIELDS}&limit=1`,
    )
      .then((r) => r.json())
      .then((json) => {
        const page = json?.items?.[0];
        if (page) {
          cache = page as HomepageHeroData;
          setData(cache);
        }
      })
      .catch(() => {
        // API unavailable — HeroSection will use its built-in defaults
      });
  }, []);

  return data;
}
