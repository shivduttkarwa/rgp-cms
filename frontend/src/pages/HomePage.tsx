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
  }, []);

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

  let heroPanel: React.ReactNode = null;
  let showCta = false;
  let ctaLabel: string | undefined;

  if (ctaBlock?.type === "panel_buttons") {
    const v = ctaBlock.value;
    heroPanel = (
      <HeroSearchPanel
        btns={[
          { label: v.btn1.label, url: v.btn1.url },
          { label: v.btn2.label, url: v.btn2.url },
          { label: v.btn3.label, url: v.btn3.url },
          { label: v.btn4.label, url: v.btn4.url },
        ]}
      />
    );
  } else if (ctaBlock?.type === "single_cta") {
    showCta = true;
    ctaLabel = ctaBlock.value.label;
  }

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
      <PropertyListingSection />
      <ServiceSelection />
      <PhilosophyPillars />
      <PortfolioShowcase />
    </div>
  );
}
