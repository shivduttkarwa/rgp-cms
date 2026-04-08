import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Tag,
  Key,
  Building2,
} from "lucide-react";
import {
  PropertyCard,
  type Category,
} from "../components/reusable/PropertyCard";
import { toPropertyCardShape } from "../hooks/useListings";
import type { ListingSectionData, EoiCtaData } from "../hooks/useHomePage";
import "./PropertyListingsection.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "for-sale": Tag,
  "sold": CheckCircle,
  "for-rent": Key,
};

const DEFAULT_CMS: ListingSectionData = {
  badge_label:   "Prime Listings",
  headline:      "Discover Your Dream Home",
  subtitle:      "Explore our handpicked collection of premium properties designed for modern living",
  all_tab_label: "All",
  filter_tabs:   [
    { category: "for-sale", label: "For Sale" },
    { category: "sold",     label: "Sold"     },
    { category: "for-rent", label: "For Rent" },
  ],
  selected_listings: [],
  view_all_label: "View All Properties",
  view_all_url:   "/properties",
};

const DEFAULT_EOI: EoiCtaData = {
  badge:        "Expression of Interest",
  title:        "Ready to make an offer on a property you love?",
  text:         "Complete our full Expression of Interest form with the exact buyer, offer, condition, and solicitor details needed for a clean review.",
  button_label: "Open the Form",
  button_url:   "/expressions-of-interest",
};

const PropertyListingSection = ({
  cms,
  eoiCms,
}: {
  cms?: ListingSectionData | null;
  eoiCms?: EoiCtaData | null;
}) => {
  const c = cms ?? DEFAULT_CMS;
  const eoi = eoiCms ?? DEFAULT_EOI;
  const allProperties = (c.selected_listings ?? []).map(toPropertyCardShape);

  const [activeFilter, setActiveFilter] = useState<Category | "*">("for-sale");
  const [displayedFilter, setDisplayedFilter] = useState<Category | "*">(
    "for-sale",
  );
  const [isExiting, setIsExiting] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const filterTabsRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const pillInitialized = useRef(false);
  const hasPlayedInitialReveal = useRef(false);

  useLayoutEffect(() => {
    const container = filterTabsRef.current;
    const pill = pillRef.current;
    if (!container || !pill) return;

    const positionPill = (animate = false) => {
      const activeBtn =
        container.querySelector<HTMLElement>(".filter-tab.active");
      if (!activeBtn) return;

      const nextState = {
        left: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
      };

      if (!pillInitialized.current || !animate) {
        gsap.set(pill, nextState);
        pillInitialized.current = true;
        return;
      }

      gsap.to(pill, {
        ...nextState,
        duration: 0.38,
        ease: "expo.out",
        overwrite: "auto",
      });
    };

    const rafId = window.requestAnimationFrame(() => positionPill(pillInitialized.current));
    const handleResize = () => positionPill(false);

    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, [activeFilter, c.all_tab_label, c.filter_tabs]);

  useEffect(() => {
    const cards =
      gridRef.current?.querySelectorAll<HTMLElement>(".property-card");
    if (!cards?.length) return;

    if (hasPlayedInitialReveal.current) {
      gsap.set(cards, { clearProps: "will-change,clip-path" });
      return;
    }

    gsap.set(cards, { clipPath: "inset(100% 0 0 0)", willChange: "clip-path" });

    const trigger = ScrollTrigger.create({
      trigger: gridRef.current,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.2,
          ease: "power3.inOut",
          stagger: 0.12,
          onComplete: () => {
            hasPlayedInitialReveal.current = true;
            gsap.set(cards, { clearProps: "will-change,clip-path" });
          },
        });
      },
    });

    ScrollTrigger.refresh();

    return () => {
      trigger.kill();
      if (!hasPlayedInitialReveal.current) {
        gsap.set(cards, { clearProps: "will-change,clip-path" });
      }
    };
  }, [displayedFilter, allProperties.length]);

  const displayed =
    displayedFilter === "*"
      ? allProperties.reduce<typeof allProperties>((acc, p) => {
          const count = acc.filter((item) => item.category === p.category).length;
          if (count < 3) acc.push(p);
          return acc;
        }, [])
      : allProperties.filter((p) => p.category === displayedFilter).slice(0, 3);

  const handleFilterChange = (filter: Category | "*") => {
    if (filter === activeFilter || isExiting) return;
    setActiveFilter(filter);
    setIsExiting(true);
    setTimeout(() => {
      setDisplayedFilter(filter);
      setIsExiting(false);
    }, 280);
  };

  return (
    <section className="property-section">
      <div className="property-container">
        <header className="section-header">
          <div className="section-badge" data-gsap="fade-up">
            <Building2 size={16} />
            <span>{c.badge_label}</span>
          </div>
          <h2
            className="section-title"
            data-gsap="char-reveal"
            data-gsap-start="top 85%"
          >
            {c.headline}
          </h2>
          <p
            className="section-subtitle"
            data-gsap="fade-up"
            data-gsap-delay="0.15"
          >
            {c.subtitle}
          </p>
        </header>

        <div
          className="filter-wrapper"
          data-gsap="fade-up"
          data-gsap-delay="0.1"
        >
          <div
            ref={filterTabsRef}
            className="filter-tabs"
            data-gsap="fade-right"
            data-gsap-stagger="0.09"
            data-gsap-delay="0.25"
          >
            <div ref={pillRef} className="filter-pill" />
            <button
              onClick={() => handleFilterChange("*")}
              className={`filter-tab ${activeFilter === "*" ? "active" : ""}`}
            >
              <span>{c.all_tab_label}</span>
            </button>
            {c.filter_tabs.map((tab) => {
              const Icon = CATEGORY_ICONS[tab.category] ?? Tag;
              return (
                <button
                  key={tab.category}
                  onClick={() => handleFilterChange(tab.category as Category)}
                  className={`filter-tab ${activeFilter === tab.category ? "active" : ""}`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          ref={gridRef}
          key={displayedFilter}
          className={`property-grid ${isExiting ? "grid-exiting" : "grid-entering"}`}
        >
          {displayed.map((property, index) => (
            <div key={property.id} className="property-card-wrap">
              <PropertyCard property={property} cardIndex={index} />
            </div>
          ))}
        </div>

        <div
          key={`swiper-${displayedFilter}`}
          className={`property-swiper-wrapper ${isExiting ? "swiper-exiting" : "swiper-entering"}`}
        >
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={1.15}
            centeredSlides={false}
            grabCursor={true}
            speed={420}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation={{
              prevEl: ".swiper-btn-prev",
              nextEl: ".swiper-btn-next",
            }}
            breakpoints={{
              480: { slidesPerView: 1.3, spaceBetween: 20 },
              640: { slidesPerView: 1.8, spaceBetween: 24 },
            }}
            className="property-swiper"
          >
            {displayed.map((property, index) => (
              <SwiperSlide key={property.id}>
                <div
                  className="property-card-wrap"
                  data-gsap-mobile="slide-right"
                  data-gsap-start="top 70%"
                  data-gsap-duration="0.5"
                  data-gsap-ease="none"
                >
                  <PropertyCard property={property} cardIndex={index} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="swiper-nav" data-gsap-mobile="fade-up">
            <button
              className="swiper-btn swiper-btn-prev"
              aria-label="Previous"
            >
              <ArrowLeft size={20} />
            </button>
            <button className="swiper-btn swiper-btn-next" aria-label="Next">
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div className="view-all-wrapper">
          <Link
            to={c.view_all_url}
            className="view-all-btn"
            data-gsap="btn-clip-reveal"
          >
            <span>{c.view_all_label}</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        <div
          className="stats-bar"
          data-gsap="clip-smooth-down"
          data-gsap-start="top 88%"
        >
          <div className="listing-cta">
            <div className="listing-cta__copy">
              <div className="listing-cta__badge" data-gsap="fade-up">
                <Building2 size={20} />
                <span>{eoi.badge}</span>
              </div>
              <h3
                className="listing-cta__title"
                data-gsap="char-reveal"
                data-gsap-start="top 88%"
              >
                {eoi.title}
              </h3>
              <p
                className="listing-cta__text"
                data-gsap="fade-up"
                data-gsap-delay="0.14"
              >
                {eoi.text}
              </p>
            </div>

            <Link
              to={eoi.button_url}
              className="listing-cta__button"
              data-gsap="btn-clip-reveal"
              data-gsap-delay="0.2"
            >
              <span>{eoi.button_label}</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyListingSection;
