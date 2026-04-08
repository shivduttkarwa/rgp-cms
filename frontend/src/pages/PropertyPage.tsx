import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import PropDetail from "../components/reusable/PropDetails";
import type { PropertyData } from "../components/reusable/PropDetails";
import { fetchListingDetailBySlug } from "../hooks/useListings";

export default function PropertyPage() {
  const { slug } = useParams<{ slug: string }>();
  const [property, setProperty] = useState<PropertyData | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    if (!slug) {
      setProperty(null);
      return;
    }

    fetchListingDetailBySlug(slug)
      .then((data) => {
        if (!cancelled) setProperty(data);
      })
      .catch(() => {
        if (!cancelled) setProperty(null);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (property === undefined) return null;

  if (!property) return <Navigate to="/" replace />;

  return (
    <>
      <PropDetail
        property={property}
        onContactSubmit={(data) => console.log("Contact:", data)}
        onSaveProperty={() => {}}
        onShareProperty={() => {}}
        onScheduleViewing={() => {}}
        onDownloadBrochure={() => {}}
      />
    </>
  );
}
