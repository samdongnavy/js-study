import { Link, useLoaderData } from "react-router";
import type { Route } from "./+types/detail";
import {
  Arrow,
  Pokeball,
  PokemonImage,
  TypeBadges,
} from "../components/pokemon-ui";
import {
  getPokemon,
  POKEMON_LIMIT,
  pokemonNumber,
  STAT_NAMES,
} from "../lib/pokemon";

export async function clientLoader({
  params,
  request,
}: Route.ClientLoaderArgs) {
  // detail/:id의 :id를 params.id로 받습니다. 잘못된 번호는 바로 돌려보냅니다.
  const id = Number(params.id);
  if (!Number.isInteger(id) || id < 1 || id > POKEMON_LIMIT) {
    throw new Response("도감에 없는 번호예요. 1~100번을 선택해 주세요.", {
      status: 404,
    });
  }
  return getPokemon(id, request.signal);
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    {
      title: loaderData
        ? `${loaderData.name} | Pokédex`
        : "포켓몬 상세 | Pokédex",
    },
  ];
}

export default function Detail() {
  const pokemon = useLoaderData<typeof clientLoader>();
  return (
    <main className="page-width detail-main">
      <Link to="/" className="back-link">
        <Arrow direction="left" /> 목록으로 돌아가기
      </Link>
      <article className={`detail-panel habitat-${pokemon.types[0]}`}>
        <div className="detail-visual">
          <span className="detail-big-number">{pokemonNumber(pokemon.id)}</span>
          <Pokeball className="detail-watermark" />
          <PokemonImage
            key={pokemon.id}
            src={pokemon.image}
            name={pokemon.name}
            className="detail-image"
            eager
          />
          <span className="detail-art-caption">POKÉMON FIELD NOTES</span>
        </div>
        <div className="detail-copy">
          <p className="eyebrow">
            POKÉDEX ENTRY <span>NO. {pokemonNumber(pokemon.id)}</span>
          </p>
          <p className="detail-genus">{pokemon.genus}</p>
          <h1>{pokemon.name}</h1>
          <p className="detail-english">{pokemon.englishName}</p>
          <TypeBadges types={pokemon.types} />
          <p className="detail-description">{pokemon.description}</p>
          <dl className="measurements">
            <div>
              <dt>키</dt>
              <dd>
                {pokemon.height.toLocaleString("ko-KR")} <span>m</span>
              </dd>
            </div>
            <div>
              <dt>몸무게</dt>
              <dd>
                {pokemon.weight.toLocaleString("ko-KR")} <span>kg</span>
              </dd>
            </div>
            <div>
              <dt>분류</dt>
              <dd className="genus-value">{pokemon.genus}</dd>
            </div>
          </dl>
          <div className="stats-heading">
            <h2>기본 능력치</h2>
            <span>
              합계{" "}
              <strong>
                {pokemon.stats.reduce((total, stat) => total + stat.value, 0)}
              </strong>
            </span>
          </div>
          <div className="stats-list">
            {pokemon.stats.map((stat) => (
              <div key={stat.name} className="stat-row">
                <span>{STAT_NAMES[stat.name] || stat.name}</span>
                <strong>{stat.value}</strong>
                <div
                  className="stat-track"
                  role="meter"
                  aria-label={STAT_NAMES[stat.name] || stat.name}
                  aria-valuenow={stat.value}
                  aria-valuemin={0}
                  aria-valuemax={255}
                >
                  <span style={{ width: `${(stat.value / 255) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>
      <nav className="detail-navigation" aria-label="이전 다음 포켓몬">
        {pokemon.id > 1 ? (
          <Link to={`/detail/${pokemon.id - 1}`}>
            <Arrow direction="left" />
            <span>
              이전 포켓몬 <strong>No. {pokemonNumber(pokemon.id - 1)}</strong>
            </span>
          </Link>
        ) : (
          <span />
        )}
        <Link to="/" className="all-pokemon">
          전체 도감 보기
        </Link>
        {pokemon.id < POKEMON_LIMIT ? (
          <Link to={`/detail/${pokemon.id + 1}`} className="next-pokemon">
            <span>
              다음 포켓몬 <strong>No. {pokemonNumber(pokemon.id + 1)}</strong>
            </span>
            <Arrow />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
