import { useEffect, useState } from "react";
import { resolveMediaUrl } from "./useHomePage";
import type { Category } from "../components/reusable/PropertyCard";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

const CARD_FIELDS = [
  "category", "location", "price", "sold_price", "card_image",
  "beds", "baths", "sqft", "garage", "badge", "is_new", "views",
  "sold_date", "days_on_market", "deposit", "min_lease", "card_features",
  "has_detail_page",
].join(",");

const DETAIL_FIELDS = [
  "address", "city", "state", "zip_code", "status", "price_label",
  "featured", "overview", "map_embed_url", "video_tour_url", "video_thumbnail",
  "agent_name", "agent_title", "agent_image", "agent_phone", "agent_email",
  "agent_rating", "agent_review_count",
  "gallery_images", "detail_stats", "detail_features", "detail_rows", "nearby_locations",
].join(",");

export interface CmsListing {
  id: number;
  title: string;
  slug: string;
  meta: { slug: string };
  category: Category;
  location: string;
  price: number;
  sold_price: number | null;
  card_image: { url: string } | null;
  beds: number;
  baths: number;
  sqft: number;
  garage: number;
  badge: string;
  is_new: boolean;
  views: number;
  sold_date: string;
  days_on_market: number | null;
  deposit: number | null;
  min_lease: string;
  card_features: string;
  has_detail_page: boolean;
}

// Convert a CmsListing to the shape PropertyCard expects
export function toPropertyCardShape(l: CmsListing) {
  return {
    id: l.id,
    slug: l.meta?.slug ?? String(l.id),
    category: l.category,
    title: l.title,
    location: l.location,
    price: l.price,
    soldPrice: l.sold_price ?? undefined,
    image: resolveMediaUrl(l.card_image?.url) ?? "",
    beds: l.beds,
    baths: l.baths,
    sqft: l.sqft,
    garage: l.garage,
    features: l.card_features ? l.card_features.split(",").map((s) => s.trim()) : [],
    badge: l.badge || undefined,
    isNew: l.is_new,
    views: l.views || undefined,
    soldDate: l.sold_date || undefined,
    daysOnMarket: l.days_on_market ?? undefined,
    deposit: l.deposit ?? undefined,
    minLease: l.min_lease || undefined,
  };
}

let cache: CmsListing[] | null = null;

export function useListings() {
  const [listings, setListings] = useState<CmsListing[]>(cache ?? []);

  useEffect(() => {
    if (cache) return;
    fetch(
      `${API_BASE}/api/v2/pages/?type=listings.ListingPage&fields=${CARD_FIELDS}&limit=100&order=-first_published_at`,
    )
      .then((r) => r.json())
      .then((json) => {
        if (Array.isArray(json?.items)) {
          cache = json.items as CmsListing[];
          setListings(cache);
        }
      })
      .catch(() => {});
  }, []);

  return listings;
}

// Fetch a single listing with full detail fields (no cache — always fresh)
export async function fetchListingDetail(pageId: number) {
  const res = await fetch(
    `${API_BASE}/api/v2/pages/${pageId}/?fields=${CARD_FIELDS},${DETAIL_FIELDS}`,
  );
  return res.json();
}
