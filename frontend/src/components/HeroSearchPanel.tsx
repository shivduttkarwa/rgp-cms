import { useNavigate } from "react-router-dom";
import { Home, KeyRound, BadgeCheck, UserSearch } from "lucide-react";
import "./HeroSearchPanel.css";

const ICONS = [Home, KeyRound, BadgeCheck, UserSearch];

const DEFAULTS = [
  { label: "Buy",   href: "/properties?cat=for-sale" },
  { label: "Rent",  href: "/properties?cat=for-rent" },
  { label: "Sold",  href: "/properties?cat=sold"     },
  { label: "Agent", href: "/team"                    },
];

interface Props {
  btns?: { label: string; url: string }[];
}

export default function HeroSearchPanel({ btns }: Props) {
  const navigate = useNavigate();

  const tabs = btns && btns.length === 4
    ? btns.map((b, i) => ({ label: b.label, href: b.url, icon: ICONS[i] }))
    : DEFAULTS.map((d, i) => ({ ...d, icon: ICONS[i] }));

  return (
    <div className="hsp">
      {tabs.map(({ label, href, icon: Icon }) => (
        <button
          key={label}
          className="hsp__tab"
          onClick={() => navigate(href)}
          type="button"
        >
          <span className="hsp__tab-badge">
            <Icon size={31} aria-hidden="true" strokeWidth={1.75} />
          </span>
          <span className="hsp__tab-label">{label}</span>
        </button>
      ))}
    </div>
  );
}
