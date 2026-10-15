import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from "react-router";

import type { Route } from "./+types/root";
import {
  Arrow,
  LoadingScreen,
  Pokeball,
  SiteHeader,
} from "./components/pokemon-ui";
import "./app.css";

export function meta() {
  return [{ title: "Pokédex | 포켓몬 도감" }];
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#e3483d" />
        <link rel="icon" href="/pokeball.svg" type="image/svg+xml" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const navigation = useNavigation();
  return (
    <>
      <a className="skip-link" href="#main-content">
        본문으로 건너뛰기
      </a>
      <SiteHeader />
      {navigation.state !== "idle" && (
        <div className="navigation-progress" role="status">
          포켓몬 정보를 불러오는 중…
        </div>
      )}
      <div id="main-content">
        <Outlet />
      </div>
      <footer className="site-footer page-width">
        <div>
          <Pokeball />
          <span>모든 모험은 작은 호기심에서 시작돼요.</span>
        </div>
        <p>
          Data & artwork by{" "}
          <a href="https://pokeapi.co/" target="_blank" rel="noreferrer">
            PokéAPI ↗
          </a>
          <span>학습용 비공식 포켓몬 도감</span>
        </p>
      </footer>
    </>
  );
}

// SPA의 첫 데이터 요청 동안 표시되는 화면입니다.
export function HydrateFallback() {
  return <LoadingScreen />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  return (
    <>
      <SiteHeader />
      <main className="error-screen page-width">
        <Pokeball />
        <p className="eyebrow">
          {notFound ? "POKÉMON NOT FOUND" : "CONNECTION LOST"}
        </p>
        <h1>
          {notFound ? "길을 조금 벗어났네요!" : "포켓몬을 불러오지 못했어요"}
        </h1>
        <p>
          {notFound
            ? "도감에 없는 주소예요. 1~100번 포켓몬을 선택해 주세요."
            : "인터넷 연결을 확인한 뒤 다시 시도해 주세요."}
        </p>
        <div className="error-actions">
          <Link to="/" className="primary-button">
            도감으로 돌아가기 <Arrow />
          </Link>
          {!notFound && (
            <button
              className="secondary-button"
              onClick={() => window.location.reload()}
            >
              다시 시도
            </button>
          )}
        </div>
      </main>
    </>
  );
}
