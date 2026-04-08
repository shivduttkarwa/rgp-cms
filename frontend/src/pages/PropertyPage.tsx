import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import PropDetail from "../components/reusable/PropDetails";
import type { PropertyData } from "../components/reusable/PropDetails";
import { fetchListingDetailBySlug } from "../hooks/useListings";
import "./PageShell.css";

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

  if (property === undefined) {
    return (
      <section className="page-shell page-shell--compact" aria-busy="true">
        <div className="page-shell__inner">
          <div className="page-shell__spinner" aria-hidden="true" />
          <p className="page-shell__sub">Loading property details...</p>
        </div>
      </section>
    );
  }

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
