"use client";
import { useState } from "react";

// ─── COLOR PALETTE ────────────────────────────────────────────────────────────
const THEME = {
  bg: "#1a0e2e",
  bgCard: "#240f3b",
  bgBlock: "#1e1133",
  border: "#3d1f6b",
  borderGlow: "#6b3fa0",
  text: "#e8dff5",
  textMuted: "#9b8bb4",
  accent: "#c084fc",
  accentDim: "#7c3aed",
};

// ─── CATEGORY COLORS ──────────────────────────────────────────────────────────
const CAT_COLORS: Record<string, { bg: string; border: string; glow: string; tag: string }> = {
  primary: { bg: "#2d1650", border: "#7c3aed", glow: "#7c3aed33", tag: "#c084fc" },
  money: { bg: "#1a2240", border: "#38bdf8", glow: "#38bdf833", tag: "#7dd3fc" },
  health: { bg: "#1a2e1a", border: "#4ade80", glow: "#4ade8033", tag: "#86efac" },
  relationship: { bg: "#2e1a2e", border: "#f472b6", glow: "#f472b633", tag: "#f9a8d4" },
  career: { bg: "#2e2310", border: "#fb923c", glow: "#fb923c33", tag: "#fdba74" },
  spiritual: { bg: "#2a1a2e", border: "#a78bfa", glow: "#a78bfa33", tag: "#c4b5fd" },
  lifestyle: { bg: "#1a2a2e", border: "#34d399", glow: "#34d39933", tag: "#6ee7b7" },
};

// ─── REALITY STATES (Primary Vision Layers) ──────────────────────────────────
const REALITY_STATES = [
  { key: "jelas", label: "Jelas", english: "Deep Clarity", icon: "◈" },
  { key: "dalam", label: "Dalam", english: "Depth", icon: "◉" },
  { key: "pasrah", label: "Pasrah", english: "Surrender", icon: "◇" },
  { key: "lepas", label: "Lepas", english: "Release", icon: "○" },
  { key: "bahagia", label: "Bahagia", english: "Happiness", icon: "✦" },
  { key: "tenang", label: "Tenang", english: "Peace", icon: "☽" },
  { key: "aman", label: "Aman", english: "Safety", icon: "⬡" },
  { key: "tawa", label: "Tawa", english: "Laughter", icon: "☀" },
  { key: "puas", label: "Puas", english: "Fulfillment", icon: "◐" },
  { key: "cukup", label: "Cukup", english: "Enough", icon: "△" },
  { key: "cinta_diri", label: "Cinta Diri", english: "Self-Love", icon: "♡" },
];

// ─── SECONDARY VISION CATEGORIES ─────────────────────────────────────────────
const SECONDARY_VISIONS: {
  category: string;
  label: string;
  description: string;
  color: string;
  visions: { name: string; states: string[] }[];
}[] = [
  {
    category: "money",
    label: "Financial Abundance",
    description: "Each financial vision must be trained through every reality state — clarity, depth, surrender, and beyond. Not a goal. An alignment.",
    color: "money",
    visions: [
      {
        name: "1 Million USD",
        states: [
          "1M USD — Jelas (Deep Clarity)",
          "1M USD — Dalam (Depth)",
          "1M USD — Pasrah (Surrender)",
          "1M USD — Lepas (Release)",
          "1M USD — Bahagia (Happiness)",
          "1M USD — Aman (Safety)",
        ],
      },
      {
        name: "Financial Freedom",
        states: [
          "Freedom — Jelas (Deep Clarity)",
          "Freedom — Dalam (Depth)",
          "Freedom — Pasrah (Surrender)",
          "Freedom — Lepas (Release)",
          "Freedom — Bahagia (Happiness)",
          "Freedom — Aman (Safety)",
        ],
      },
      {
        name: "Passive Income",
        states: [
          "Passive Income — Jelas (Deep Clarity)",
          "Passive Income — Dalam (Depth)",
          "Passive Income — Pasrah (Surrender)",
          "Passive Income — Lepas (Release)",
          "Passive Income — Bahagia (Happiness)",
          "Passive Income — Aman (Safety)",
        ],
      },
    ],
  },
  {
    category: "health",
    label: "Health & Body",
    description: "The body is the vessel. Each health vision must pass through surrender and release before it can manifest. Train 30–60 min daily, layer by layer.",
    color: "health",
    visions: [
      {
        name: "Healthy Back",
        states: [
          "Healthy Back — Jelas (Deep Clarity)",
          "Healthy Back — Dalam (Depth)",
          "Healthy Back — Pasrah (Surrender)",
          "Healthy Back — Lepas (Release)",
          "Healthy Back — Bahagia (Happiness)",
          "Healthy Back — Aman (Safety)",
          "Healthy Back — Puas (Fulfillment)",
        ],
      },
      {
        name: "Healthy Spine",
        states: [
          "Spine — Jelas (Deep Clarity)",
          "Spine — Dalam (Depth)",
          "Spine — Pasrah (Surrender)",
          "Spine — Lepas (Release)",
          "Spine — Bahagia (Happiness)",
          "Spine — Aman (Safety)",
          "Spine — Puas (Fulfillment)",
        ],
      },
      {
        name: "Ideal Body",
        states: [
          "Ideal Body — Jelas (Deep Clarity)",
          "Ideal Body — Dalam (Depth)",
          "Ideal Body — Pasrah (Surrender)",
          "Ideal Body — Lepas (Release)",
          "Ideal Body — Bahagia (Happiness)",
          "Ideal Body — Aman (Safety)",
        ],
      },
      {
        name: "Mental Clarity",
        states: [
          "Mental Clarity — Jelas (Deep Clarity)",
          "Mental Clarity — Dalam (Depth)",
          "Mental Clarity — Pasrah (Surrender)",
          "Mental Clarity — Lepas (Release)",
          "Mental Clarity — Tenang (Peace)",
          "Mental Clarity — Puas (Fulfillment)",
        ],
      },
    ],
  },
  {
    category: "relationship",
    label: "Relationships",
    description: "Relationships are mirrors. You cannot attract what you have not first aligned within yourself. Every relationship vision begins with self-love.",
    color: "relationship",
    visions: [
      {
        name: "Romantic Partnership",
        states: [
          "Partnership — Jelas (Deep Clarity)",
          "Partnership — Dalam (Depth)",
          "Partnership — Pasrah (Surrender)",
          "Partnership — Lepas (Release)",
          "Partnership — Bahagia (Happiness)",
          "Partnership — Aman (Safety)",
          "Partnership — Cinta Diri (Self-Love)",
        ],
      },
      {
        name: "Family Harmony",
        states: [
          "Family — Jelas (Deep Clarity)",
          "Family — Dalam (Depth)",
          "Family — Pasrah (Surrender)",
          "Family — Lepas (Release)",
          "Family — Tenang (Peace)",
          "Family — Bahagia (Happiness)",
          "Family — Aman (Safety)",
        ],
      },
      {
        name: "Deep Friendships",
        states: [
          "Friendships — Jelas (Deep Clarity)",
          "Friendships — Dalam (Depth)",
          "Friendships — Pasrah (Surrender)",
          "Friendships — Lepas (Release)",
          "Friendships — Bahagia (Happiness)",
          "Friendships — Puas (Fulfillment)",
        ],
      },
      {
        name: "Self-Acceptance",
        states: [
          "Self — Jelas (Deep Clarity)",
          "Self — Dalam (Depth)",
          "Self — Pasrah (Surrender)",
          "Self — Lepas (Release)",
          "Self — Cinta Diri (Self-Love)",
          "Self — Puas (Fulfillment)",
          "Self — Cukup (Enough)",
        ],
      },
    ],
  },
  {
    category: "career",
    label: "Career & Purpose",
    description: "Purpose is not found — it is aligned. Train each career vision through the full spectrum of reality states before expecting external results.",
    color: "career",
    visions: [
      {
        name: "Dream Career",
        states: [
          "Career — Jelas (Deep Clarity)",
          "Career — Dalam (Depth)",
          "Career — Pasrah (Surrender)",
          "Career — Lepas (Release)",
          "Career — Bahagia (Happiness)",
          "Career — Puas (Fulfillment)",
        ],
      },
      {
        name: "Leadership",
        states: [
          "Leadership — Jelas (Deep Clarity)",
          "Leadership — Dalam (Depth)",
          "Leadership — Pasrah (Surrender)",
          "Leadership — Aman (Safety)",
          "Leadership — Bahagia (Happiness)",
          "Leadership — Tenang (Peace)",
        ],
      },
      {
        name: "Creative Expression",
        states: [
          "Creativity — Jelas (Deep Clarity)",
          "Creativity — Dalam (Depth)",
          "Creativity — Lepas (Release)",
          "Creativity — Bahagia (Happiness)",
          "Creativity — Tawa (Laughter)",
          "Creativity — Puas (Fulfillment)",
        ],
      },
    ],
  },
  {
    category: "spiritual",
    label: "Spiritual Growth",
    description: "This is the foundation beneath all visions. Without spiritual alignment, every other category remains unstable. Begin here.",
    color: "spiritual",
    visions: [
      {
        name: "Inner Peace",
        states: [
          "Peace — Jelas (Deep Clarity)",
          "Peace — Dalam (Depth)",
          "Peace — Pasrah (Surrender)",
          "Peace — Lepas (Release)",
          "Peace — Tenang (Peace)",
          "Peace — Aman (Safety)",
        ],
      },
      {
        name: "Gratitude Mastery",
        states: [
          "Gratitude — Jelas (Deep Clarity)",
          "Gratitude — Dalam (Depth)",
          "Gratitude — Pasrah (Surrender)",
          "Gratitude — Bahagia (Happiness)",
          "Gratitude — Puas (Fulfillment)",
          "Gratitude — Cukup (Enough)",
        ],
      },
      {
        name: "Trust in Life",
        states: [
          "Trust — Jelas (Deep Clarity)",
          "Trust — Dalam (Depth)",
          "Trust — Pasrah (Surrender)",
          "Trust — Lepas (Release)",
          "Trust — Aman (Safety)",
          "Trust — Tenang (Peace)",
        ],
      },
    ],
  },
  {
    category: "lifestyle",
    label: "Lifestyle & Environment",
    description: "Your environment is a reflection of your inner state. Train each lifestyle vision until the inner and outer world become one.",
    color: "lifestyle",
    visions: [
      {
        name: "Dream Home",
        states: [
          "Home — Jelas (Deep Clarity)",
          "Home — Dalam (Depth)",
          "Home — Pasrah (Surrender)",
          "Home — Lepas (Release)",
          "Home — Aman (Safety)",
          "Home — Bahagia (Happiness)",
        ],
      },
      {
        name: "Travel & Freedom",
        states: [
          "Travel — Jelas (Deep Clarity)",
          "Travel — Dalam (Depth)",
          "Travel — Pasrah (Surrender)",
          "Travel — Lepas (Release)",
          "Travel — Bahagia (Happiness)",
          "Travel — Tawa (Laughter)",
        ],
      },
      {
        name: "Daily Harmony",
        states: [
          "Harmony — Jelas (Deep Clarity)",
          "Harmony — Dalam (Depth)",
          "Harmony — Pasrah (Surrender)",
          "Harmony — Tenang (Peace)",
          "Harmony — Puas (Fulfillment)",
          "Harmony — Cukup (Enough)",
        ],
      },
    ],
  },
];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function PrimaryVisionBlock() {
  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${CAT_COLORS.primary.bg}, #1a0e2e)`,
        border: `1px solid ${CAT_COLORS.primary.border}`,
        boxShadow: `0 0 24px ${CAT_COLORS.primary.glow}, inset 0 1px 0 #6b3fa044`,
        borderRadius: 20,
        padding: "40px 36px",
        marginBottom: 12,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 8 }}>
        <span
          style={{
            display: "inline-block",
            fontSize: 10,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: CAT_COLORS.primary.tag,
            fontFamily: "'Courier New', monospace",
            marginBottom: 10,
          }}
        >
          ◆ Foundation Layer
        </span>
        <h2
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 700,
            color: "#fff",
            fontFamily: "'Georgia', serif",
            letterSpacing: -0.5,
          }}
        >
          Primary Vision
        </h2>
        <div style={{ marginTop: 24, marginBottom: 24 }}>
          <h3 style={{ 
            fontSize: '2.2rem', 
            fontWeight: 900, 
            color: '#fff', 
            textAlign: 'center', 
            lineHeight: 1.2,
            textTransform: 'uppercase',
            background: 'linear-gradient(to right, #c084fc, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 8px rgba(192, 132, 252, 0.3))'
          }}>
            Your Reality Must Perfect First <br/> before any goal executed
          </h3>
        </div>
        <p
          style={{
            margin: "10px 0 0",
            fontSize: 13,
            color: THEME.textMuted,
            lineHeight: 1.6,
            maxWidth: 600,
            fontFamily: "'Segoe UI', sans-serif",
          }}
        >
          The law of attraction does not work on its own — it requires{" "}
          <span style={{ color: CAT_COLORS.primary.tag, fontWeight: 600 }}>alignment</span>. These
          are the core reality states you must master. Train each for 30–60 minutes daily, day by
          day, like building muscle at the gym. This is the root. Every secondary vision depends on
          it.
        </p>
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: `linear-gradient(90deg, transparent, ${CAT_COLORS.primary.border}, transparent)`,
          margin: "24px 0",
        }}
      />

      {/* Reality State Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 12,
        }}
      >
        {REALITY_STATES.map((state, i) => (
          <div
            key={state.key}
            style={{
              background: "#1e1133",
              border: `1px solid #3d1f6b`,
              borderRadius: 12,
              padding: "16px 18px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Index number */}
            <span
              style={{
                position: "absolute",
                top: 8,
                right: 12,
                fontSize: 10,
                color: "#3d1f6b",
                fontFamily: "'Courier New', monospace",
                fontWeight: 700,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            {/* Icon + Label */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 18, color: CAT_COLORS.primary.tag }}>{state.icon}</span>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#fff",
                  fontFamily: "'Georgia', serif",
                }}
              >
                {state.english}
              </span>
            </div>

            {/* Original term */}
            <span
              style={{
                fontSize: 11,
                color: THEME.textMuted,
                fontFamily: "'Courier New', monospace",
                letterSpacing: 1,
              }}
            >
              Realitas {state.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecondaryVisionCategory({
  category,
  label,
  description,
  color,
  visions,
  isOpen,
  onToggle,
}: {
  category: string;
  label: string;
  description: string;
  color: string;
  visions: { name: string; states: string[] }[];
  isOpen: boolean;
  onToggle: () => void;
}) {
  const c = CAT_COLORS[color];

  return (
    <div
      style={{
        background: `linear-gradient(145deg, ${c.bg}, ${THEME.bgBlock})`,
        border: `1px solid ${c.border}`,
        boxShadow: `0 0 18px ${c.glow}`,
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: 12,
      }}
    >
      {/* Category Header — clickable to expand/collapse */}
      <div
        onClick={onToggle}
        style={{
          padding: "24px 32px",
          cursor: "pointer",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          userSelect: "none",
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: c.border,
                boxShadow: `0 0 8px ${c.glow}`,
              }}
            />
            <span
              style={{
                fontSize: 10,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: c.tag,
                fontFamily: "'Courier New', monospace",
              }}
            >
              Secondary Vision
            </span>
          </div>
          <h3
            style={{
              margin: 0,
              fontSize: 21,
              fontWeight: 700,
              color: "#fff",
              fontFamily: "'Georgia', serif",
            }}
          >
            {label}
          </h3>
          <p
            style={{
              margin: "8px 0 0",
              fontSize: 12,
              color: THEME.textMuted,
              lineHeight: 1.55,
              maxWidth: 520,
              fontFamily: "'Segoe UI', sans-serif",
            }}
          >
            {description}
          </p>
        </div>

        {/* Expand arrow */}
        <span
          style={{
            color: c.tag,
            fontSize: 18,
            transition: "transform 0.3s ease",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            marginTop: 4,
          }}
        >
          ▾
        </span>
      </div>

      {/* Expanded Content */}
      {isOpen && (
        <div style={{ padding: "0 32px 28px" }}>
          {/* Thin separator */}
          <div
            style={{
              height: 1,
              background: `linear-gradient(90deg, transparent, ${c.border}55, transparent)`,
              marginBottom: 20,
            }}
          />

          {visions.map((vision, vi) => (
            <div key={vi} style={{ marginBottom: vi < visions.length - 1 ? 24 : 0 }}>
              {/* Vision Name */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    background: c.border + "22",
                    border: `1px solid ${c.border}`,
                    color: c.tag,
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "4px 14px",
                    borderRadius: 20,
                    fontFamily: "'Georgia', serif",
                  }}
                >
                  {vision.name}
                </span>
                <span
                  style={{
                    flex: 1,
                    height: 1,
                    background: `linear-gradient(90deg, ${c.border}44, transparent)`,
                  }}
                />
              </div>

              {/* States List */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: 8,
                }}
              >
                {vision.states.map((state, si) => (
                  <div
                    key={si}
                    style={{
                      background: THEME.bgBlock,
                      border: `1px solid ${c.border}33`,
                      borderLeft: `3px solid ${c.border}`,
                      borderRadius: 8,
                      padding: "9px 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 9,
                        color: c.tag,
                        fontFamily: "'Courier New', monospace",
                        minWidth: 18,
                        textAlign: "center",
                      }}
                    >
                      {String(si + 1).padStart(2, "0")}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: THEME.text,
                        fontFamily: "'Segoe UI', sans-serif",
                        lineHeight: 1.4,
                      }}
                    >
                      {state}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function ELVisionLibrary() {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    money: true,
    health: true,
    relationship: true,
    career: true,
    spiritual: true,
    lifestyle: true,
  });

  const toggleCategory = (cat: string) => {
    setOpenCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `radial-gradient(ellipse at 20% 50%, #2d1050 0%, ${THEME.bg} 50%, #0f0818 100%)`,
        color: THEME.text,
        fontFamily: "'Segoe UI', sans-serif",
        padding: "60px 24px",
      }}
    >
      {/* Subtle grain overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 860, margin: "0 auto" }}>
        {/* ── TOP HEADER ────────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          {/* Brand mark */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <span
              style={{
                fontSize: 28,
                background: `linear-gradient(135deg, #c084fc, #7c3aed)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 800,
                fontFamily: "'Georgia', serif",
                letterSpacing: -1,
              }}
            >
              eL
            </span>
            <span
              style={{
                fontSize: 10,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: THEME.textMuted,
                fontFamily: "'Courier New', monospace",
                paddingLeft: 4,
                borderLeft: `2px solid ${THEME.border}`,
                paddingTop: 2,
                paddingBottom: 2,
              }}
            >
              Vision Library
            </span>
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 38,
              fontWeight: 700,
              color: "#fff",
              fontFamily: "'Georgia', serif",
              letterSpacing: -1,
              lineHeight: 1.2,
            }}
          >
            Trained Reality
          </h1>
          <p
            style={{
              margin: "14px auto 0",
              fontSize: 14,
              color: THEME.textMuted,
              lineHeight: 1.7,
              maxWidth: 560,
            }}
          >
            The law of attraction requires{" "}
            <span style={{ color: THEME.accent, fontWeight: 600 }}>alignment, not effort</span>.
            This library maps every vision through layered reality states — trained daily like a
            muscle. Primary visions are the foundation. Secondary visions are the goals that emerge
            from that foundation.
          </p>

          {/* Decorative line */}
          <div
            style={{
              width: 60,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${THEME.accentDim}, transparent)`,
              margin: "28px auto 0",
            }}
          />
        </div>

        {/* ── TRAINING GUIDE BLOCK ──────────────────────────────────────── */}
        <div
          style={{
            background: "#1e1133",
            border: `1px solid ${THEME.border}`,
            borderRadius: 16,
            padding: "22px 28px",
            marginBottom: 32,
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          {[
            { icon: "⏱", title: "30–60 Min", sub: "per session" },
            { icon: "📅", title: "Daily", sub: "consistency builds alignment" },
            { icon: "📈", title: "Layer by Layer", sub: "like training a muscle" },
            { icon: "🔁", title: "Repeat", sub: "until it becomes inner state" },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                flex: "1 1 120px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{item.title}</div>
                <div style={{ fontSize: 11, color: THEME.textMuted }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── PRIMARY VISION BLOCK ──────────────────────────────────────── */}
        <PrimaryVisionBlock />

        {/* ── SECTION LABEL ─────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            margin: "44px 0 16px",
          }}
        >
          <div
            style={{
              flex: 1,
              height: 1,
              background: `linear-gradient(90deg, ${THEME.border}, transparent)`,
            }}
          />
          <span
            style={{
              fontSize: 10,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: THEME.textMuted,
              fontFamily: "'Courier New', monospace",
              whiteSpace: "nowrap",
            }}
          >
            Secondary Visions — Goal Categories
          </span>
          <div
            style={{
              flex: 1,
              height: 1,
              background: `linear-gradient(270deg, ${THEME.border}, transparent)`,
            }}
          />
        </div>

        {/* ── SECONDARY VISION BLOCKS ───────────────────────────────────── */}
        {SECONDARY_VISIONS.map((sec) => (
          <SecondaryVisionCategory
            key={sec.category}
            category={sec.category}
            label={sec.label}
            description={sec.description}
            color={sec.color}
            visions={sec.visions}
            isOpen={!!openCategories[sec.category]}
            onToggle={() => toggleCategory(sec.category)}
          />
        ))}

        {/* ── FOOTER NOTE ───────────────────────────────────────────────── */}
        <div
          style={{
            textAlign: "center",
            marginTop: 52,
            padding: "28px 24px",
            border: `1px solid ${THEME.border}33`,
            borderRadius: 14,
            background: "#1a0e2e88",
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: THEME.textMuted,
              lineHeight: 1.7,
              letterSpacing: 0.3,
            }}
          >
            This is not a checklist. It is a training program for your inner world.{" "}
            <span style={{ color: THEME.accent }}>
              Alignment is the only bridge between vision and reality.
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}