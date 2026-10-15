import { Link, useLoaderData, useSearchParams } from "react-router";
import type { CSSProperties } from "react";
import type { Route } from "./+types/list";
import {
  Arrow,
  Pokeball,
  PokemonImage,
  TypeBadges,
} from "../components/pokemon-ui";
import {
  artwork,
  getPokemonList,
  pokemonNumber,
  TYPE_NAMES,
} from "../lib/pokemon";

export function meta() {
  return [
    { title: "Pokédex | 나의 포켓몬 도감" },
    {
      name: "description",
      content:
        "100마리의 포켓몬을 만나 보세요. 한국어 이름, 타입, 도감 설명을 확인할 수 있는 포켓몬 도감.",
    },
  ];
}
// React Router가 화면을 보여주기 전에 이 함수를 실행합니다.
export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  return getPokemonList(request.signal);
}
// 검색은 이미 받은 목록에서 하므로 검색 조건만 바뀔 때 다시 요청하지 않습니다.
export function shouldRevalidate() {
  return false;
}

export default function List() {
  const pokemons = useLoaderData<typeof clientLoader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const selectedType = searchParams.get("type") || "";
  const sort = searchParams.get("sort") || "number";
  const availableTypes = Object.keys(TYPE_NAMES).filter((type) =>
    pokemons.some((p) => p.types.includes(type)),
  );
  function updateFilter(key: string, value: string) {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true, preventScrollReset: true },
    );
  }
  const normalizedQuery = query.trim().toLowerCase().replace(/^#/, "");
  const filtered = pokemons
    .filter((p) => {
      const matchesName =
        p.name.includes(normalizedQuery) ||
        p.englishName.includes(normalizedQuery);
      const matchesNumber =
        /^\d+$/.test(normalizedQuery) && p.id === Number(normalizedQuery);
      return (
        (!normalizedQuery || matchesName || matchesNumber) &&
        (!selectedType || p.types.includes(selectedType))
      );
    })
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name, "ko")
        : sort === "reverse"
          ? b.id - a.id
          : a.id - b.id,
    );
  return (
    <main className="page-width">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <span className="hero-label">
            <span />
            작은 발견, 새로운 모험
          </span>
          <h1 id="hero-title">
            좋아하는 포켓몬을
            <br />
            <span>만나러 가볼까요?</span>
          </h1>
          <p>
            풀숲 속 작은 친구부터 짜릿한 전기 포켓몬까지.
            <br className="desktop-break" /> 100마리의 포켓몬과 나만의 모험을
            시작해 보세요.
          </p>
          <a className="primary-button" href="#pokemon-list">
            도감 둘러보기 <Arrow />
          </a>
          <div className="hero-note">
            <span className="note-line" /> GOTTA CATCH ’EM ALL!
          </div>
        </div>
        <div className="hero-art">
          <span className="hero-orbit" />
          <span className="hero-star star-one">✦</span>
          <span className="hero-star star-two">✧</span>
          <span className="hero-art-number">025</span>
          <PokemonImage
            src={artwork(25)}
            name="피카츄"
            className="hero-pikachu"
            eager
          />
          <Link to="/detail/25" className="hero-nameplate">
            <span>
              <small>오늘의 포켓몬</small>
              <strong>
                피카츄 <span>PIKACHU</span>
              </strong>
            </span>
            <span className="hero-arrow">
              <Arrow />
            </span>
          </Link>
        </div>
      </section>
      <section
        id="pokemon-list"
        className="collection"
        aria-labelledby="collection-title"
      >
        <div className="collection-heading">
          <div>
            <p className="eyebrow">THE POKÉMON COLLECTION</p>
            <h2 id="collection-title">
              포켓몬 도감 <span>{pokemons.length}</span>
            </h2>
          </div>
          <p className="collection-hint">어떤 포켓몬이 궁금한가요?</p>
        </div>
        <div className="filter-toolbar">
          <label className="search-box">
            <svg
              aria-hidden="true"
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="10.5"
                cy="10.5"
                r="6.5"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path
                d="m16 16 4.5 4.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
            <span className="sr-only">포켓몬 이름 또는 번호 검색</span>
            <input
              value={query}
              onChange={(e) => updateFilter("q", e.target.value)}
              placeholder="이름 또는 도감 번호로 검색해 보세요"
              type="search"
            />
          </label>
          <label className="select-box">
            <span className="sr-only">포켓몬 타입</span>
            <select
              aria-label="포켓몬 타입"
              value={selectedType}
              onChange={(e) => updateFilter("type", e.target.value)}
            >
              <option value="">모든 타입</option>
              {availableTypes.map((type) => (
                <option key={type} value={type}>
                  {TYPE_NAMES[type]}
                </option>
              ))}
            </select>
          </label>
          <label className="select-box">
            <span className="sr-only">정렬 순서</span>
            <select
              aria-label="정렬 순서"
              value={sort}
              onChange={(e) => updateFilter("sort", e.target.value)}
            >
              <option value="number">도감 번호순</option>
              <option value="reverse">번호 역순</option>
              <option value="name">이름순</option>
            </select>
          </label>
        </div>
        <div className="results-line">
          <p role="status">
            총 <strong>{filtered.length}</strong>마리의 포켓몬
          </p>
          {(query || selectedType || sort !== "number") && (
            <button
              onClick={() =>
                setSearchParams({}, { replace: true, preventScrollReset: true })
              }
            >
              필터 초기화 ↺
            </button>
          )}
        </div>
        {filtered.length > 0 ? (
          <div className="pokemon-grid grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((pokemon, index) => (
              <Link
                to={`/detail/${pokemon.id}`}
                key={pokemon.id}
                className={`pokemon-card habitat-${pokemon.types[0]} hover:-translate-y-1 transition-transform`}
                style={{ "--card-order": Math.min(index, 11) } as CSSProperties}
                aria-label={`${pokemon.name}, 도감 번호 ${pokemon.id}, 상세 보기`}
              >
                <div className="card-visual">
                  <span className="card-number">
                    No. {pokemonNumber(pokemon.id)}
                  </span>
                  <Pokeball className="card-watermark" />
                  <PokemonImage
                    src={pokemon.image}
                    name={pokemon.name}
                    eager={index < 8}
                    className="card-image"
                  />
                </div>
                <div className="card-info">
                  <p className="english-name">{pokemon.englishName}</p>
                  <div className="card-title">
                    <h3>{pokemon.name}</h3>
                    <span className="card-arrow">
                      <Arrow />
                    </span>
                  </div>
                  <TypeBadges types={pokemon.types} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Pokeball />
            <h3>아직 발견하지 못한 포켓몬이에요</h3>
            <p>1~100번 포켓몬의 이름이나 번호로 다시 검색해 보세요.</p>
            <button
              className="primary-button"
              onClick={() => setSearchParams({})}
            >
              전체 포켓몬 보기 <Arrow />
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
