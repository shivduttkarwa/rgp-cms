import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import HeroSection from "../sections/HeroSection";
import HeroSearchPanel from "../components/HeroSearchPanel";
import Intro from "../sections/Intro";
import PortfolioShowcase from "../sections/PortfolioShowcase";
import PropertyListingSection from "@/sections/PropertyListingSection";
import ServiceSelection from "@/sections/ServiceSelection";
import PhilosophyPillars from "@/sections/Philosophy";
import { initGsapSwitchAnimations } from "@/lib/gsapSwitchAnimations";
import { useHomePage, resolveMediaUrl } from "@/hooks/useHomePage";

/** Wraps the highlight word in a <span> with the given class. */
function withHighlight(text: string, highlight: string, cls: string) {
  if (!highlight || !text.includes(highlight)) return <>{text}</>;
  const [before, after] = text.split(highlight);
  return (
    <>
      {before}
      <span className={cls}>{highlight}</span>
      {after}
    </>
  );
}

export default function HomePage({ ready = false }: { ready?: boolean }) {
  const pageRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const page = useHomePage();
  const homeReady = page !== undefined;
  const hero = page?.hero ?? null;
  const intro = page?.intro ?? null;

  useEffect(() => {
    const guards = [
      "clipRevealInit", "clipRevealRtlInit", "clipRevealTopInit",
      "clipRevealLeftInit", "clipRevealRightInit", "wordRevealInit",
      "wordWriteInit", "clipSmoothInit", "clipSmoothDownInit", "charRevealInit",
    ];
    guards.forEach((key) => {
      pageRef.current
        ?.querySelectorAll<HTMLElement>(
          `[data-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}]`,
        )
        .forEach((el) => delete el.dataset[key]);
    });
    const cleanup = initGsapSwitchAnimations(pageRef.current);
    return cleanup;
  }, [location.key, page]);

  // ── Hero ─────────────────────────────────────────────────────────
  const titleLine1 = hero
    ? withHighlight(hero.title_line1, hero.title_line1_highlight, "rg-gold")
    : undefined;

  const titleLine2 = hero
    ? withHighlight(hero.title_line2, hero.title_line2_highlight, "rg-amber")
    : undefined;

  const bgImage = resolveMediaUrl(hero?.bg_image?.url);
  const bgVideo = hero?.bg_video_url || undefined;

  // Resolve CTA from StreamBlock (0 or 1 items)
  const ctaBlock = hero?.cta?.[0] ?? null;

  // If CMS says single_cta, show the button. Otherwise always render the panel
  // (with CMS btns when available, defaults when not) so GSAP always uses the
  // clip-path animation path — avoids a timing mismatch on first load.
  const isSingleCta = ctaBlock?.type === "single_cta";
  const showCta = isSingleCta;
  const ctaLabel = isSingleCta ? (ctaBlock as { type: "single_cta"; value: { label: string; url: string } }).value.label : undefined;

  const panelBtns =
    ctaBlock?.type === "panel_buttons"
      ? [
          { label: ctaBlock.value.btn1.label, url: ctaBlock.value.btn1.url },
          { label: ctaBlock.value.btn2.label, url: ctaBlock.value.btn2.url },
          { label: ctaBlock.value.btn3.label, url: ctaBlock.value.btn3.url },
          { label: ctaBlock.value.btn4.label, url: ctaBlock.value.btn4.url },
        ]
      : undefined; // HeroSearchPanel will use its own defaults

  const heroPanel = isSingleCta ? undefined : <HeroSearchPanel btns={panelBtns} />;

  return (
    <div ref={pageRef}>
      <HeroSection
        key={location.key}
        ready={ready}
        titleLine1={titleLine1}
        titleLine2={titleLine2}
        subtitle={hero?.subtitle}
        showCta={showCta}
        ctaLabel={ctaLabel}
        bgImage={bgImage}
        bgVideo={bgVideo}
        panel={heroPanel ?? undefined}
      />

      {homeReady && (
        <Intro
          label={intro?.label}
          headline1={intro?.headline1}
          headline2={intro?.headline2}
          founderName={intro?.founder_name}
          text={intro?.text}
          cta1Label={intro?.cta1_label}
          cta1Url={intro?.cta1_url}
          cta2Label={intro?.cta2_label}
          cta2Url={intro?.cta2_url}
          imageUrl={resolveMediaUrl(intro?.image?.url)}
        />
      )}
      {homeReady && (
        <PropertyListingSection
          cms={page?.listing_section}
          eoiCms={page?.eoi_cta}
        />
      )}
      {homeReady && page?.service_section && (
        <ServiceSelection
          key={`${page.service_section.header?.title_prefix ?? ""}-${page.service_section.header?.title_highlight ?? ""}-${page.service_section.cta?.title_prefix ?? ""}-${page.service_section.cta?.title_highlight ?? ""}`}
          cms={page.service_section}
        />
      )}
      <PhilosophyPillars />
      <PortfolioShowcase />
    </div>
  );
}
