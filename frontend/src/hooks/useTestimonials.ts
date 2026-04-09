import { useEffect, useState } from "react";
import type { SlideContent } from "@/components/reusable/SplitSlider";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

// ── API shapes (mirror backend api_*_card() methods) ─────────────────────────

export interface CmsTextTestimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  location: string;
}

export interface CmsFeaturedTestimonial {
  id: number;
  kicker: string;
  title_lines: string[];
  description: string;
  link_text: string;
  image: string | null;
  theme: SlideContent["theme"];
}

interface RawTestimonial {
  id: number;
  testimonial_type: "video" | "featured" | "text";
  api_video_card: unknown;
  api_featured_card: CmsFeaturedTestimonial;
  api_text_card: CmsTextTestimonial;
}

// ── Converters ────────────────────────────────────────────────────────────────

function resolveUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
}

export function toSlideContent(t: CmsFeaturedTestimonial): SlideContent {
  return {
    kicker:      t.kicker,
    titleLines:  t.title_lines,
    description: t.description,
    linkText:    t.link_text,
    image:       resolveUrl(t.image),
    theme:       t.theme,
  };
}

// ── Parsed result ─────────────────────────────────────────────────────────────

export interface TestimonialsData {
  featured: SlideContent[];
  text: CmsTextTestimonial[];
}

// ── Cache ─────────────────────────────────────────────────────────────────────

let cache: TestimonialsData | null = null;

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useTestimonials() {
  const [data, setData] = useState<TestimonialsData | null | undefined>(
    cache ?? undefined,
  );

  useEffect(() => {
    if (cache) {
      setData(cache);
      return;
    }

    fetch(`${API_BASE}/api/v2/testimonials/?limit=200&fields=testimonial_type,api_featured_card,api_text_card`)
      .then((r) => r.json())
      .then((json) => {
        const items: RawTestimonial[] = json?.items ?? [];

        const featured: SlideContent[] = items
          .filter((t) => t.testimonial_type === "featured")
          .map((t) => toSlideContent(t.api_featured_card));

        const text: CmsTextTestimonial[] = items
          .filter((t) => t.testimonial_type === "text")
          .map((t) => ({
            ...t.api_text_card,
            avatar: resolveUrl(t.api_text_card.avatar),
          }));

        cache = { featured, text };
        setData(cache);
      })
      .catch(() => {
        setData((current) => current ?? null);
      });
  }, []);

  return data;
}
