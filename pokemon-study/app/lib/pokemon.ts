import axios from "axios";

type NamedResource = { name: string; url: string };
type PokemonResponse = {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { type: NamedResource }[];
  stats: { base_stat: number; stat: NamedResource }[];
  sprites: {
    front_default: string | null;
    other: { "official-artwork": { front_default: string | null } };
  };
};
type SpeciesResponse = {
  names: { name: string; language: { name: string } }[];
  genera: { genus: string; language: { name: string } }[];
  flavor_text_entries: { flavor_text: string; language: { name: string } }[];
};
export type Pokemon = {
  id: number;
  name: string;
  englishName: string;
  image: string;
  types: string[];
  description: string;
  genus: string;
  height: number;
  weight: number;
  stats: { name: string; value: number }[];
};
export const POKEMON_LIMIT = 100;
export const TYPE_NAMES: Record<string, string> = {
  normal: "노말",
  fire: "불꽃",
  water: "물",
  electric: "전기",
  grass: "풀",
  ice: "얼음",
  fighting: "격투",
  poison: "독",
  ground: "땅",
  flying: "비행",
  psychic: "에스퍼",
  bug: "벌레",
  rock: "바위",
  ghost: "고스트",
  dragon: "드래곤",
  dark: "악",
  steel: "강철",
  fairy: "페어리",
};
export const STAT_NAMES: Record<string, string> = {
  hp: "HP",
  attack: "공격",
  defense: "방어",
  "special-attack": "특수공격",
  "special-defense": "특수방어",
  speed: "스피드",
};
export const artwork = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
export const pokemonNumber = (id: number) => String(id).padStart(3, "0");
const api = axios.create({
  baseURL: "https://pokeapi.co/api/v2/",
  timeout: 15000,
});
// 목록과 상세 페이지에서 같은 데이터를 다시 요청하지 않도록 보관합니다.
const pokemonCache = new Map<number, Pokemon>();
let listCache: Pokemon[] | undefined;

export async function getPokemon(
  id: number,
  signal?: AbortSignal,
): Promise<Pokemon> {
  signal?.throwIfAborted();
  const cached = pokemonCache.get(id);
  if (cached) return cached;
  // Promise.all: 서로 독립적인 API 요청을 동시에 기다립니다.
  const [pokemonResponse, speciesResponse] = await Promise.all([
    api.get<PokemonResponse>(`pokemon/${id}`, { signal }),
    api.get<SpeciesResponse>(`pokemon-species/${id}`, { signal }),
  ]);
  const p = pokemonResponse.data;
  const species = speciesResponse.data;
  const koreanName = species.names.find(
    (item) => item.language.name === "ko",
  )?.name;
  const description = species.flavor_text_entries.find(
    (item) => item.language.name === "ko",
  )?.flavor_text;
  const pokemon: Pokemon = {
    id: p.id,
    name: koreanName || p.name,
    englishName: p.name,
    image:
      p.sprites.other["official-artwork"].front_default ||
      p.sprites.front_default ||
      artwork(p.id),
    types: p.types.map((item) => item.type.name),
    description:
      description?.replace(/[\n\f\r]+/g, " ") ||
      "아직 등록된 한국어 설명이 없어요.",
    genus:
      species.genera.find((item) => item.language.name === "ko")?.genus ||
      "포켓몬",
    height: p.height / 10,
    weight: p.weight / 10,
    stats: p.stats.map((item) => ({
      name: item.stat.name,
      value: item.base_stat,
    })),
  };
  pokemonCache.set(id, pokemon);
  return pokemon;
}

export async function getPokemonList(signal: AbortSignal): Promise<Pokemon[]> {
  if (listCache) return listCache;
  const response = await api.get<{ results: NamedResource[] }>(
    `pokemon?limit=${POKEMON_LIMIT}`,
    { signal },
  );
  const results = response.data.results;
  const pokemons: Pokemon[] = new Array(results.length);
  let nextIndex = 0;
  // 수업의 map + Promise.all 방식에 동시 요청 제한을 더했습니다.
  // 100마리를 한꺼번에 요청하는 대신 최대 8마리씩 가져옵니다.
  await Promise.all(
    Array.from({ length: Math.min(8, results.length) }, async () => {
      while (nextIndex < results.length) {
        signal.throwIfAborted();
        const index = nextIndex++;
        const id = Number(results[index].url.split("/").filter(Boolean).pop());
        pokemons[index] = await getPokemon(id, signal);
      }
    }),
  );
  listCache = pokemons;
  return pokemons;
}
