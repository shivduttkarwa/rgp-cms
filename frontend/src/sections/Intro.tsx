import { Link } from "react-router-dom";
import "./Intro.css";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

interface IntroProps {
  label?: string;
  headline1?: string;
  headline2?: string;
  founderName?: string;
  text?: string;
  cta1Label?: string;
  cta1Url?: string;
  cta2Label?: string;
  cta2Url?: string;
  imageUrl?: string;
}

const Intro = ({
  label       = "About the Founder",
  headline1   = "Building Wealth",
  headline2   = "Through Property,",
  founderName = "— Rahul Singh",
  text        = "Real Gold Properties is a vision turned reality — a private equity approach to multi-family real estate. Founded by Rahul Singh, we focus on disciplined acquisitions that deliver consistent returns.",
  cta1Label   = "Book a Free Appraisal",
  cta1Url     = "/contact",
  cta2Label   = "Meet Rahul",
  cta2Url     = "/about",
  imageUrl,
}: IntroProps) => {
  const imgSrc = imageUrl ?? `${base}images/rahul-singh.jpg`;

  return (
    <section className="intro">
      {/* Left: Content */}
      <div className="intro-content">
        <span className="intro-label" data-gsap="fade-up">
          {label}
        </span>

        <h1
          className="intro-headline"
          data-gsap="char-reveal"
          data-gsap-start="top 85%"
        >
          {headline1}
          <br />
          {headline2}
          <span className="founder">{founderName}</span>
        </h1>

        <p className="intro-text" data-gsap="fade-up" data-gsap-delay="0.2">
          {text}
        </p>

        <div className="intro-cta-group">
          <Link
            to={cta1Url}
            className="intro-cta intro-cta--primary"
            data-gsap="btn-clip-reveal"
            data-gsap-delay="0.2"
          >
            <span>{cta1Label}</span>
            <svg viewBox="0 0 24 24">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          <Link
            to={cta2Url}
            className="intro-cta intro-cta--ghost"
            data-gsap="btn-clip-reveal"
            data-gsap-delay="0.3"
          >
            <span>{cta2Label}</span>
          </Link>
        </div>
      </div>

      {/* Right: Image */}
      <div
        className="intro-image"
        data-gsap="clip-reveal-right"
        data-gsap-start="top 60%"
      >
        <img src={imgSrc} alt={founderName} />
        <div className="intro-img-gradient" />
        <div className="intro-img-corner intro-img-corner--tl" />
        <div className="intro-img-corner intro-img-corner--br" />
      </div>
    </section>
  );
};

export default Intro;
