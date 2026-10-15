# 포켓몬 도감 실습

`Pokemon.pdf`의 마지막 단계까지 구현한 React Router Framework 프로젝트입니다.
기존에 작성하던 `pokemon-study` 폴더를 이어서 완성했습니다.

## 실행하기

현재 `js study` 폴더의 터미널에서 아래 명령을 실행하세요.

```powershell
cd pokemon-study
pnpm dev
```

터미널에 표시되는 Local 주소를 브라우저에서 여세요. 보통 `http://localhost:5173`입니다.
PowerShell에서 스크립트 실행 정책 오류가 나오면 `pnpm.cmd dev`로 실행하면 됩니다.
처음 실행할 때는 API에서 100마리의 정보를 받아오므로 잠시 기다려 주세요. 인터넷 연결이 필요합니다.

다른 컴퓨터에서 처음 설치할 때는 이 폴더에서 `pnpm install`을 먼저 실행하세요.

## 구현한 기능

- 1~100번 포켓몬의 한국어 이름과 공식 일러스트를 카드로 표시
- 카드를 누르면 `/detail/25` 같은 상세 페이지로 이동
- 한국어 도감 설명, 타입, 키, 몸무게, 기본 능력치
- 이름·영문 이름·번호 검색, 타입 필터, 번호순·역순·이름순 정렬
- 검색 조건을 URL에 보관하므로 뒤로 가기와 주소 공유 지원
- 모바일 화면, 로딩 화면, 검색 결과 없음, 통신 오류와 잘못된 주소 처리

## 코드 읽는 순서

| 파일                            | 여기서 배우는 것                                               |
| ------------------------------- | -------------------------------------------------------------- |
| `app/routes.ts`                 | `index()`와 `route()`로 주소와 화면 연결                       |
| `app/routes/list.tsx`           | `clientLoader`, `useLoaderData`, `map`, `Link`                 |
| `app/routes/detail.tsx`         | `params.id`로 선택한 포켓몬 찾기                               |
| `app/lib/pokemon.ts`            | Axios, `async/await`, `Promise.all`, `find`로 한국어 이름 선택 |
| `app/components/pokemon-ui.tsx` | 반복해서 사용하는 컴포넌트 분리                                |
| `app/app.css`                   | Tailwind 반응형 그리드와 화면 디자인                           |
| `react-router.config.ts`        | `ssr: false`로 SPA 모드 사용                                   |

흐름은 **주소 선택 → clientLoader에서 API 호출 → 데이터를 컴포넌트로 전달 → 화면 표시**입니다.
PDF 중간의 `useEffect + useState` 방식은 마지막 단계의 `clientLoader`로 정리했습니다.
`list.tsx`의 `map()`은 카드 여러 개를 만들고, `find()`는 API의 여러 언어 중 `ko`를 고릅니다.

API 코드는 수업과 같게 Axios를 사용합니다. API 요청은 최대 8마리씩 진행하고,
이미 읽은 포켓몬은 메모리에 보관해 목록과 상세 페이지 사이에서 재사용합니다.

## 확인 및 빌드

```powershell
pnpm typecheck
pnpm build
pnpm preview
```

빌드 결과는 `build/client`에 만들어집니다. `pnpm start`도 빌드된 화면을 미리 보여줍니다.
Vercel에 올릴 때는 프로젝트 루트를 `pokemon-study`로 선택하세요.
`vercel.json`에 빌드 명령, 출력 경로, 상세 주소 새로고침을 위한 SPA 라우팅 설정이 들어 있습니다.

데이터 및 그림: [PokéAPI](https://pokeapi.co/), [PokéAPI sprites](https://github.com/PokeAPI/sprites).
포켓몬은 원저작권자에게 권리가 있는 캐릭터이며 이 프로젝트는 학습용 비공식 도감입니다.
