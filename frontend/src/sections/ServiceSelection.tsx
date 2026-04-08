import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import type { ServiceSectionData } from "@/hooks/useHomePage";
import "./ServiceSelection.css";

type ServiceCard = {
  id: "buy" | "sell" | "rent";
  label: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  theme: "buy" | "sell" | "rent";
};

type ServiceCardInput = Omit<ServiceCard, "ctaUrl"> & {
  ctaUrl?: string;
};

type ServiceHeader = {
  eyebrow: string;
  titlePrefix: string;
  titleHighlight: string;
  subtitle: string;
};

type TrustStat = {
  value: string;
  label: string;
};

type ServiceCta = {
  eyebrow: string;
  titlePrefix: string;
  titleHighlight: string;
  text: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  trustStats: TrustStat[];
};

type ServiceSelectionProps = {
  cms?: ServiceSectionData | null;
  services?: ServiceCardInput[];
  header?: ServiceHeader;
  cta?: Omit<ServiceCta, "trustStats"> & { trustStats?: TrustStat[] };
};

const DEFAULT_SERVICES: ServiceCard[] = [
  {
    id: "buy",
    label: "Buy",
    description:
      "Clear advice and local insight to help you buy with confidence—pricing, comparables, and negotiation support tailored to your goals.",
    ctaLabel: "Speak With Us",
    ctaUrl: "/contact",
    theme: "buy",
  },
  {
    id: "sell",
    label: "Sell",
    description:
      "Professional appraisals, transparent pricing strategy, and data-led guidance to help you make the right move at the right time.",
    ctaLabel: "Request an Appraisal",
    ctaUrl: "/contact",
    theme: "sell",
  },
  {
    id: "rent",
    label: "Rent",
    description:
      "Reliable tenancy, proactive maintenance, and smooth day-to-day management for landlords and tenants alike.",
    ctaLabel: "Get In Touch",
    ctaUrl: "/contact",
    theme: "rent",
  },
];

const DEFAULT_HEADER: ServiceHeader = {
  eyebrow: "How Can We Help You?",
  titlePrefix: "What Are You",
  titleHighlight: "Looking For?",
  subtitle:
    "Whether you're buying, selling, or renting — we're here to make your real estate journey seamless and rewarding.",
};

const DEFAULT_CTA: ServiceCta = {
  eyebrow: "Need Guidance?",
  titlePrefix: "Not Sure Where to",
  titleHighlight: "Start?",
  text: "Our experienced advisors are here to understand your needs and guide you through every step of your real estate journey.",
  primaryLabel: "Talk to an Expert",
  primaryHref: "/contact",
  secondaryLabel: "0450 009 291",
  secondaryHref: "tel:+61450009291",
  trustStats: [
    { value: "5+", label: "Years Experience" },
    { value: "100+", label: "Happy Clients" },
    { value: "24/7", label: "Support Available" },
  ],
};

function defaultCardLabel(id: ServiceCard["id"]) {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

function normalizeCards(cards: ServiceCardInput[]): ServiceCard[] {
  return cards.map((card) => ({
    ...card,
    label: card.label || defaultCardLabel(card.id),
    ctaUrl: card.ctaUrl || "/contact",
    theme: card.theme || card.id,
  }));
}

function normalizeSection({
  cms,
  services,
  header,
  cta,
}: ServiceSelectionProps): {
  services: ServiceCard[];
  header: ServiceHeader;
  cta: ServiceCta;
} {
  if (!cms) {
    return {
      services: normalizeCards(services ?? DEFAULT_SERVICES),
      header: header ?? DEFAULT_HEADER,
      cta: {
        ...(cta ?? DEFAULT_CTA),
        trustStats: cta?.trustStats ?? DEFAULT_CTA.trustStats,
      },
    };
  }

  const cmsCards: ServiceCard[] = (cms.services?.length ? cms.services : DEFAULT_SERVICES).map(
    (card) => {
      const normalizedCard = card as ServiceSectionData["services"][number] &
        ServiceCardInput & {
          cta?: string;
        };

      return {
        id: normalizedCard.id,
        label: normalizedCard.label || defaultCardLabel(normalizedCard.id),
        description: normalizedCard.description,
        ctaLabel: normalizedCard.cta_label || normalizedCard.cta || "Learn More",
        ctaUrl: normalizedCard.cta_url || normalizedCard.ctaUrl || "/contact",
        theme: normalizedCard.id,
      };
    },
  );

  const legacyHeader = cms.header as ServiceSectionData["header"] & {
    title?: string;
    title_em?: string;
  };
  const legacyCta = cms.cta as ServiceSectionData["cta"] & {
    title?: string;
    title_em?: string;
  };

  return {
    header: {
      eyebrow: cms.header?.eyebrow || DEFAULT_HEADER.eyebrow,
      titlePrefix:
        cms.header?.title_prefix || legacyHeader?.title || DEFAULT_HEADER.titlePrefix,
      titleHighlight:
        cms.header?.title_highlight ||
        legacyHeader?.title_em ||
        DEFAULT_HEADER.titleHighlight,
      subtitle: cms.header?.subtitle || DEFAULT_HEADER.subtitle,
    },
    services: cmsCards,
    cta: {
      eyebrow: cms.cta?.eyebrow || DEFAULT_CTA.eyebrow,
      titlePrefix:
        cms.cta?.title_prefix || legacyCta?.title || DEFAULT_CTA.titlePrefix,
      titleHighlight:
        cms.cta?.title_highlight ||
        legacyCta?.title_em ||
        DEFAULT_CTA.titleHighlight,
      text: cms.cta?.text || DEFAULT_CTA.text,
      primaryLabel: cms.cta?.primary_label || DEFAULT_CTA.primaryLabel,
      primaryHref: cms.cta?.primary_href || DEFAULT_CTA.primaryHref,
      secondaryLabel: cms.cta?.secondary_label || DEFAULT_CTA.secondaryLabel,
      secondaryHref: cms.cta?.secondary_href || DEFAULT_CTA.secondaryHref,
      trustStats: cms.cta?.trust_stats?.length
        ? cms.cta.trust_stats
        : DEFAULT_CTA.trustStats,
    },
  };
}

const ServiceSelection = (props: ServiceSelectionProps) => {
  const { services, header, cta } = normalizeSection(props);

  return (
    <section className="svc">
      <div className="svc__container">
        <header className="svc__header">
          <span className="svc__eyebrow" data-gsap="fade-up">
            {header.eyebrow}
          </span>
          <h2
            className="svc__title"
            data-gsap="char-reveal"
            data-gsap-start="top 85%"
          >
            {header.titlePrefix} <em>{header.titleHighlight}</em>
          </h2>
          <p
            className="svc__subtitle"
            data-gsap="fade-up"
            data-gsap-delay="0.2"
          >
            {header.subtitle}
          </p>
        </header>

        <div className="svc__grid">
          {services.map((service, i) => (
            <article
              key={`${service.id}-${i}`}
              className={`svc-card svc-card--${service.theme}`}
              data-gsap="clip-smooth-down"
              data-gsap-delay={`${i * 0.14}`}
              data-gsap-start="top 88%"
            >
              <h3 className="svc-card__word">{service.label}</h3>
              <p className="svc-card__desc">{service.description}</p>
              <div className="svc-card__footer">
                <Link to={service.ctaUrl} className="svc-card__btn">
                  <span>{service.ctaLabel}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="svc-cta">
        <div className="svc-cta__container">
          <div className="svc-cta__decor svc-cta__decor--left" />
          <div className="svc-cta__decor svc-cta__decor--right" />

          <div className="svc-cta__content">
            <span className="svc-cta__eyebrow" data-gsap="fade-up">
              {cta.eyebrow}
            </span>
            <h3
              className="svc-cta__title"
              data-gsap="char-reveal"
              data-gsap-start="top 85%"
            >
              {cta.titlePrefix} <em>{cta.titleHighlight}</em>
            </h3>
            <p
              className="svc-cta__text"
              data-gsap="fade-up"
              data-gsap-delay="0.15"
            >
              {cta.text}
            </p>

            <div className="svc-cta__actions">
              <Link
                to={cta.primaryHref}
                className="svc-cta__btn svc-cta__btn--primary"
                data-gsap="btn-clip-reveal"
                data-gsap-delay="0.2"
              >
                <MessageCircle size={20} />
                <span>{cta.primaryLabel}</span>
                <ArrowRight size={18} />
              </Link>
              <a
                data-gsap="btn-clip-reveal"
                data-gsap-delay="0.2"
                href={cta.secondaryHref}
                className="svc-cta__btn svc-cta__btn--secondary"
              >
                <Phone size={18} />
                <span>{cta.secondaryLabel}</span>
              </a>
            </div>

            <div
              data-gsap="zoom-in"
              data-gsap-stagger="0.3 "
              className="svc-cta__trust"
            >
              {cta.trustStats.map((stat, index) => (
                <div
                  key={`${stat.value}-${stat.label}-${index}`}
                  style={{ display: "contents" }}
                >
                  <div className="svc-cta__trust-item">
                    <span className="svc-cta__trust-value">{stat.value}</span>
                    <span className="svc-cta__trust-label">{stat.label}</span>
                  </div>
                  {index < cta.trustStats.length - 1 && (
                    <div className="svc-cta__trust-divider" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSelection;
