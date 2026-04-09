// VideoTestimonial.tsx
import { useRef, useState, useEffect } from "react";
import type { Swiper as SwiperType } from "swiper";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;
const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./VideoTestimonial.css";
import type { VideoTestimonialSectionData } from "@/hooks/useHomePage";

type Testimonial = {
  kicker: string;
  title: string;
  video: string;
  poster: string;
  tintVar: "gold" | "amber" | "crimson";
};

function resolveUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
}

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    kicker: "SUNNYBANK · SOLD",
    title: "SARAH M.",
    video: `${base}vids/rgp-video.mp4`,
    poster:
      "https://files.staging.peachworlds.com/website/dbf16c23-6134-4df6-a509-bd2a6b79ab37/chatgpt-image-3-apr-2025-16-33-58.webp",
    tintVar: "gold",
  },
  {
    kicker: "UNDERWOOD · PURCHASED",
    title: "JAMES & LISA",
    video: `${base}vids/rgp-video.mp4`,
    poster:
      "https://files.staging.peachworlds.com/website/d80b404a-7e8e-40ee-a08c-cbab3f8a7ad3/chatgpt-image-3-apr-2025-16-23-38.webp",
    tintVar: "amber",
  },
  {
    kicker: "EIGHT MILE PLAINS · APPRAISAL",
    title: "DAVID K.",
    video: `${base}vids/rgp-video.mp4`,
    poster:
      "https://files.staging.peachworlds.com/website/504aad69-04e9-4c61-8e60-4bf340ec746f/chatgpt-image-3-apr-2025-16-23-32.webp",
    tintVar: "crimson",
  },
  {
    kicker: "MOUNT GRAVATT · SOLD",
    title: "PRIYA & ROHAN",
    video: `${base}vids/rgp-video.mp4`,
    poster:
      "https://files.staging.peachworlds.com/website/dbf16c23-6134-4df6-a509-bd2a6b79ab37/chatgpt-image-3-apr-2025-16-33-58.webp",
    tintVar: "gold",
  },
  {
    kicker: "CARINDALE · PURCHASED",
    title: "MICHAEL T.",
    video: `${base}vids/rgp-video.mp4`,
    poster:
      "https://files.staging.peachworlds.com/website/d80b404a-7e8e-40ee-a08c-cbab3f8a7ad3/chatgpt-image-3-apr-2025-16-23-38.webp",
    tintVar: "amber",
  },
  {
    kicker: "WISHART · APPRAISAL",
    title: "CLAIRE B.",
    video: `${base}vids/rgp-video.mp4`,
    poster:
      "https://files.staging.peachworlds.com/website/504aad69-04e9-4c61-8e60-4bf340ec746f/chatgpt-image-3-apr-2025-16-23-32.webp",
    tintVar: "crimson",
  },
];

function TestiCard({
  t,
  activeId,
  setActiveId,
}: {
  t: Testimonial;
  activeId: string | null;
  setActiveId: (id: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fullPlay, setFullPlay] = useState(false);

  useEffect(() => {
    const isMobile = window.matchMedia(
      "(hover: none) and (pointer: coarse)",
    ).matches;
    if (isMobile && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const handleMouseEnter = () => {
    if (fullPlay) return;
    videoRef.current?.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    if (fullPlay) return;
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    setFullPlay(true);
    setActiveId(t.title);
    v.play().catch(() => {});
  };

  useEffect(() => {
    if (activeId === t.title) return;
    if (!fullPlay) return;
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    v.muted = true;
    setFullPlay(false);
  }, [activeId, fullPlay, t.title]);

  return (
    <article
      className="rg-philo__card"
      data-tint={t.tintVar}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="rg-philo__media">
        <video
          ref={videoRef}
          className="rg-philo__img"
          src={t.video}
          poster={t.poster}
          muted
          playsInline
          loop
          preload="none"
          controls={fullPlay}
        />
      </div>

      {!fullPlay && (
        <>
          <div className="rg-philo__overlay" aria-hidden="true" />
          <div className="rg-philo__pill">
            <div className="rg-philo__pillKicker">{t.kicker}</div>
            <div className="rg-philo__pillTitle">{t.title}</div>
          </div>
          <button
            className="rg-philo__play-btn"
            onClick={handlePlayClick}
            aria-label={`Play ${t.title} testimonial`}
          >
            <svg viewBox="0 0 48 48" fill="none">
              <circle
                cx="24"
                cy="24"
                r="23"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path d="M19 16l14 8-14 8V16z" fill="currentColor" />
            </svg>
          </button>
        </>
      )}
    </article>
  );
}

export default function VideoTestimonial({
  cms,
}: {
  cms?: VideoTestimonialSectionData | null;
}) {
  const c = cms ?? null;

  // Derive card data — CMS wins, fallback to hardcoded
  const testimonials: Testimonial[] =
    c?.selected_testimonials?.length
      ? c.selected_testimonials.map((t) => ({
          kicker:   t.kicker,
          title:    t.title,
          video:    resolveUrl(t.video_url) || `${base}vids/rgp-video.mp4`,
          poster:   resolveUrl(t.poster?.url),
          tintVar:  t.tint_var,
        }))
      : FALLBACK_TESTIMONIALS;

  const label     = c?.label     ?? "Testimonials";
  const headline  = c?.headline  ?? "What Our Clients Say";
  const highlight = c?.headline_highlight ?? "Clients";
  const ctaLabel  = c?.cta_label ?? "Read All Reviews";
  const ctaUrl    = c?.cta_url   ?? "/testimonials";

  const [activeId, setActiveId] = useState<string | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const sliderOuterRef = useRef<HTMLDivElement>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const updateNavState = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  useEffect(() => {
    const slides = sliderOuterRef.current?.querySelectorAll<HTMLElement>(".rg-philo__slide");
    if (!slides?.length) return;

    gsap.set(slides, { clipPath: "inset(100% 0 0 0)", willChange: "clip-path" });

    const trigger = ScrollTrigger.create({
      trigger: sliderOuterRef.current,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(slides, {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.2,
          ease: "power3.inOut",
          stagger: 0.12,
          onComplete: () => {
            gsap.set(slides, { clearProps: "will-change,clip-path" });
          },
        });
      },
    });

    return () => {
      trigger.kill();
      gsap.set(slides, { clearProps: "will-change,clip-path" });
    };
  }, []);

  return (
    <section className="rg-philo" aria-label="Client Testimonials">
      <div className="rg-philo__wrap">
        <header className="rg-philo__head">
          <p data-gsap="fade-up" className="rg-philo__label">
            {label}
          </p>
          <h2
            data-gsap="char-reveal"
            data-gsap-start="top 85%"
            className="rg-philo__title"
          >
            {headline.replace(highlight, "").trimEnd() || "What Our"}{" "}
            <em>{highlight}</em>
            {headline.split(highlight)[1] ?? " Say"}
          </h2>
        </header>

        <div className="rg-philo__divider" role="separator" />

        {/* Unified slider — desktop + mobile */}
        <div className="rg-philo__slider-outer" ref={sliderOuterRef}>
          <Swiper
            modules={[Pagination, Navigation]}
            spaceBetween={20}
            slidesPerView={1.1}
            grabCursor
            speed={540}
            pagination={{ el: "#rg-philo-pagination", clickable: true }}
            breakpoints={{
              480: { slidesPerView: 1.25, spaceBetween: 22 },
              768: { slidesPerView: 2.2, spaceBetween: 26 },
              1024: { slidesPerView: 3, spaceBetween: 30 },
              1280: { slidesPerView: 3.15, spaceBetween: 32 },
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              updateNavState(swiper);
            }}
            onSlideChange={updateNavState}
            onReachBeginning={(swiper) => updateNavState(swiper)}
            onReachEnd={(swiper) => updateNavState(swiper)}
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.title} className="rg-philo__slide">
                <TestiCard
                  t={t}
                  activeId={activeId}
                  setActiveId={setActiveId}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Controls row: pagination + nav arrows */}
        <div className="rg-philo__controls">
          <div id="rg-philo-pagination" className="rg-philo__pagination" />
          <div className="rg-philo__nav">
            <button
              className="rg-philo__nav-btn"
              onClick={() => swiperRef.current?.slidePrev()}
              disabled={isBeginning}
              aria-label="Previous testimonial"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              className="rg-philo__nav-btn"
              onClick={() => swiperRef.current?.slideNext()}
              disabled={isEnd}
              aria-label="Next testimonial"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* CTA */}
        <div className="rg-philo__cta-row">
          <Link
            to={ctaUrl}
            className="rg-philo__cta-btn"
            data-gsap="btn-clip-reveal"
          >
            <span>{ctaLabel}</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
