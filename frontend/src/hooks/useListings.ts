import { useEffect, useState } from "react";
import { resolveMediaUrl } from "./useHomePage";
import type { Category } from "../components/reusable/PropertyCard";
import type { PropertyData } from "../components/reusable/PropDetails";

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
  card_image:
    | { url: string }
    | { meta?: { download_url?: string } }
    | null;
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

interface CmsImageRef {
  url: string;
  alt?: string;
}

function listingCardImageUrl(
  image: CmsListing["card_image"],
): string | undefined {
  if (!image) return undefined;
  if ("url" in image && image.url) return resolveMediaUrl(image.url);
  if ("meta" in image && image.meta?.download_url) {
    return resolveMediaUrl(image.meta.download_url);
  }
  return undefined;
}

interface CmsListingDetail extends CmsListing {
  address: string;
  city: string;
  state: string;
  zip_code: string;
  status: "For Sale" | "For Rent" | "Sold" | "Pending" | "";
  price_label: string;
  featured: boolean;
  overview: string;
  map_embed_url: string;
  video_tour_url: string;
  agent_name: string;
  agent_title: string;
  agent_phone: string;
  agent_email: string;
  agent_rating: number;
  agent_review_count: number;
  api_gallery_images?: Array<{ url: string; alt: string }>;
  api_detail_stats?: Array<{ icon: "bed" | "bath" | "area" | "garage" | "year" | "lot"; value: string; label: string }>;
  api_detail_features?: Array<{ icon: "smart-home" | "kitchen" | "ocean" | "wine" | "pool" | "dock" | "theater" | "gym" | "security" | "garden" | "spa" | "garage"; title: string; description: string }>;
  api_detail_rows?: Array<{ label: string; value: string }>;
  api_nearby_locations?: Array<{ name: string; distance: string; type: "shopping" | "airport" | "dining" | "golf" | "beach" | "school" | "hospital" }>;
  api_video_thumbnail?: CmsImageRef | null;
  api_agent_image?: CmsImageRef | null;
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
    image: listingCardImageUrl(l.card_image) ?? "",
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
    hasDetailPage: l.has_detail_page,
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

const LISTING_DETAIL_FIELDS = [
  CARD_FIELDS,
  "address",
  "city",
  "state",
  "zip_code",
  "status",
  "price_label",
  "featured",
  "overview",
  "map_embed_url",
  "video_tour_url",
  "agent_name",
  "agent_title",
  "agent_phone",
  "agent_email",
  "agent_rating",
  "agent_review_count",
  "api_gallery_images",
  "api_detail_stats",
  "api_detail_features",
  "api_detail_rows",
  "api_nearby_locations",
  "api_video_thumbnail",
  "api_agent_image",
].join(",");

const FALLBACK_AGENT_IMAGE = "/images/rahul-singh.jpg";

function richTextToParagraphs(html: string): string[] {
  if (!html) return [];
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .split("\n")
    .map((part) => part.trim())
    .filter(Boolean);
}

function resolveStatus(listing: CmsListingDetail): PropertyData["status"] {
  if (listing.status) return listing.status;
  if (listing.category === "sold") return "Sold";
  if (listing.category === "for-rent") return "For Rent";
  return "For Sale";
}

function imageUrl(image?: CmsImageRef | null): string | undefined {
  return resolveMediaUrl(image?.url);
}

export function toPropertyDetailShape(listing: CmsListingDetail): PropertyData {
  const fullLocation = [listing.location, listing.city, listing.state]
    .filter(Boolean)
    .join(", ");
  const galleryImages = (listing.api_gallery_images ?? [])
    .map((item) => ({
      url: imageUrl(item) ?? "",
      alt: item.alt || listing.title,
    }))
    .filter((item) => item.url);
  const heroImage = listingCardImageUrl(listing.card_image) ?? "";
  const images = galleryImages.length
    ? galleryImages
    : (heroImage ? [{ url: heroImage, alt: listing.title }] : []);
  const overview = richTextToParagraphs(listing.overview);
  const detailRows = listing.api_detail_rows?.length
    ? listing.api_detail_rows
    : [
        { label: "Status", value: resolveStatus(listing) },
        { label: "Bedrooms", value: String(listing.beds) },
        { label: "Bathrooms", value: String(listing.baths) },
        { label: "Garages", value: String(listing.garage) },
        { label: "Location", value: fullLocation || listing.location },
      ];
  const detailStats = listing.api_detail_stats?.length
    ? listing.api_detail_stats
    : [
        { icon: "bed" as const, value: String(listing.beds), label: "Bedrooms" },
        { icon: "bath" as const, value: String(listing.baths), label: "Bathrooms" },
        { icon: "area" as const, value: String(listing.sqft), label: "Sq. Ft." },
        { icon: "garage" as const, value: String(listing.garage), label: "Garages" },
      ];
  const detailFeatures = listing.api_detail_features?.length
    ? listing.api_detail_features
    : (listing.card_features || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => ({
          icon: "garden" as const,
          title: item,
          description: item,
        }));

  return {
    id: listing.slug,
    title: listing.title,
    address: listing.address || listing.title,
    city: listing.city || listing.location,
    state: listing.state || "",
    zipCode: listing.zip_code || "",
    price: listing.sold_price ?? listing.price,
    priceLabel: listing.price_label || (resolveStatus(listing) === "Sold" ? "Sold For" : "Listed Price"),
    status: resolveStatus(listing),
    featured: listing.featured,
    images,
    stats: detailStats,
    overview: overview.length ? overview : [`${listing.title} in ${fullLocation || listing.location}.`],
    features: detailFeatures,
    details: detailRows,
    mapEmbedUrl: listing.map_embed_url || undefined,
    nearbyLocations: listing.api_nearby_locations ?? [],
    videoTourUrl: listing.video_tour_url || undefined,
    videoThumbnail: imageUrl(listing.api_video_thumbnail),
    agent: {
      name: listing.agent_name || "Property Consultant",
      title: listing.agent_title || "Sales Consultant",
      image: imageUrl(listing.api_agent_image) ?? FALLBACK_AGENT_IMAGE,
      phone: listing.agent_phone || "",
      email: listing.agent_email || "",
      rating: Number(listing.agent_rating || 5),
      reviewCount: listing.agent_review_count || 0,
    },
  };
}

export async function fetchListingDetailBySlug(slug: string): Promise<PropertyData | null> {
  const limit = 20;
  let offset = 0;

  while (true) {
    const res = await fetch(
      `${API_BASE}/api/v2/listings/?limit=${limit}&offset=${offset}&fields=${LISTING_DETAIL_FIELDS}`,
    );
    const json = await res.json();
    const items = Array.isArray(json?.items) ? (json.items as CmsListingDetail[]) : [];
    const listing = items.find((item) => item.slug === slug);

    if (listing) {
      if (!listing.has_detail_page) return null;
      return toPropertyDetailShape(listing);
    }

    if (items.length < limit) return null;
    offset += limit;
  }
}
