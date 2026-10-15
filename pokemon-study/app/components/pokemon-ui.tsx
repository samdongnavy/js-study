import { useState } from "react";
import { Link } from "react-router";
import { TYPE_NAMES } from "../lib/pokemon";

export function Pokeball({ className = "" }: { className?: string }) {
  return (
    <span className={`pokeball ${className}`} aria-hidden="true">
      <span />
    </span>
  );
}
export function Arrow({
  direction = "right",
}: {
  direction?: "left" | "right";
}) {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      style={{ transform: direction === "left" ? "rotate(180deg)" : undefined }}
    >
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function TypeBadges({ types }: { types: string[] }) {
  return (
    <div className="type-badges">
      {types.map((type) => (
        <span key={type} className={`type-badge type-${type}`}>
          {TYPE_NAMES[type] || type}
        </span>
      ))}
    </div>
  );
}
export function PokemonImage({
  src,
  name,
  className = "",
  eager = false,
}: {
  src: string;
  name: string;
  className?: string;
  eager?: boolean;
}) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  return failedSource === src ? (
    <div
      className={`image-fallback ${className}`}
      role="img"
      aria-label={`${name} 이미지 없음`}
    >
      <Pokeball />
      <span>이미지 준비 중</span>
    </div>
  ) : (
    <img
      className={className}
      src={src}
      alt={name}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailedSource(src)}
    />
  );
}
export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="page-width header-inner">
        <Link to="/" className="brand" aria-label="포켓몬 도감 홈">
          <Pokeball />
          <span>
            Pokédex<span className="brand-caption">포켓몬 도감</span>
          </span>
        </Link>
        <nav aria-label="메인 메뉴">
          <Link to="/" className="nav-current">
            포켓몬 도감
          </Link>
          <a
            href="https://pokeapi.co/"
            target="_blank"
            rel="noreferrer"
            className="api-link"
          >
            PokéAPI ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
export function LoadingScreen() {
  return (
    <>
      <SiteHeader />
      <main className="loading-screen" role="status">
        <Pokeball className="loading-ball" />
        <p className="eyebrow">ADVENTURE IS LOADING</p>
        <h1>포켓몬을 만나러 가는 중</h1>
        <p>처음에는 100마리의 정보를 가져오느라 잠시 걸려요.</p>
      </main>
    </>
  );
}
