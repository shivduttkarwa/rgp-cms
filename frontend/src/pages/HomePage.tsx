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
import { useHomepageHero, resolveMediaUrl } from "@/hooks/useHomepageHero";

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
  const hero = useHomepageHero();

  useEffect(() => {
    const guards = [
      "clipRevealInit",
      "clipRevealRtlInit",
      "clipRevealTopInit",
      "clipRevealLeftInit",
      "clipRevealRightInit",
      "wordRevealInit",
      "wordWriteInit",
      "clipSmoothInit",
      "clipSmoothDownInit",
      "charRevealInit",
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

  // Build hero props from CMS data (falls back to HeroSection defaults when null)
  const titleLine1 = hero
    ? withHighlight(hero.hero_title_line1, hero.hero_title_line1_highlight, "rg-gold")
    : undefined;

  const titleLine2 = hero
    ? withHighlight(hero.hero_title_line2, hero.hero_title_line2_highlight, "rg-amber")
    : undefined;

  const bgImage = resolveMediaUrl(hero?.hero_bg_image?.url);
  const bgVideo = hero?.hero_bg_video_url || undefined;

  return (
    <div ref={pageRef}>
      <HeroSection
        key={location.key}
        ready={ready}
        titleLine1={titleLine1}
        titleLine2={titleLine2}
        subtitle={hero?.hero_subtitle}
        showCta={false}
        bgImage={bgImage}
        bgVideo={bgVideo}
        panel={
          <HeroSearchPanel
            btns={hero ? [
              { label: hero.hero_btn1_label, url: hero.hero_btn1_url },
              { label: hero.hero_btn2_label, url: hero.hero_btn2_url },
              { label: hero.hero_btn3_label, url: hero.hero_btn3_url },
              { label: hero.hero_btn4_label, url: hero.hero_btn4_url },
            ] : undefined}
          />
        }
      />

      <Intro
        label={hero?.intro_label}
        headline1={hero?.intro_headline1}
        headline2={hero?.intro_headline2}
        founderName={hero?.intro_founder_name}
        text={hero?.intro_text}
        cta1Label={hero?.intro_cta1_label}
        cta1Url={hero?.intro_cta1_url}
        cta2Label={hero?.intro_cta2_label}
        cta2Url={hero?.intro_cta2_url}
        imageUrl={resolveMediaUrl(hero?.intro_image?.url)}
      />
      <PropertyListingSection />
      <ServiceSelection />
      <PhilosophyPillars />
      <PortfolioShowcase />
    </div>
  );
}
