# finding-unknowns

**"내가 모르는 것"을 — 고치기 비싸지기 전에 — 발견하게 해주는 Claude Code 플러그인.**

Claude Code 팀 [Thariq(@trq212)](https://x.com/trq212)의 아티클 [*A Field Guide to Fable: Finding Your Unknowns*](https://x.com/trq212/article/2073100352921215386)의 기법들을 10개의 스킬로 패키징했습니다.

> 지도는 영토가 아니다. 지도는 당신의 프롬프트와 컨텍스트이고, 영토는 코드베이스와 그 실제 제약이다. 그 간극이 당신의 **unknowns**이며 — 요즘 모델에서 작업 품질의 병목은 그것을 명확히 하는 당신의 능력이다.

🇺🇸 [English README](README.md)

## 설치

```
/plugin marketplace add junwon/finding-unknowns
/plugin install finding-unknowns@finding-unknowns
```

로컬에서 먼저 써보기:

```
claude --plugin-dir /path/to/finding-unknowns
```

## 빠른 시작

두 커맨드로 사용량의 80%가 해결됩니다:

```
/unknowns  리포트 페이지에 CSV 내보내기 추가
```
→ 이 작업에 대해 아는 것/모르는 것을 지도로 그리고, 구현 전에 돌릴 가치가 있는 기법이 있다면(없을 수도 있음) 골라줍니다.

```
/diagnose  대시보드가 상상했던 거랑 완전히 다르게 나왔어
```
→ 결과가 빗나갔을 때: 어떤 unknown이 원인인지 역추적하고, 교훈을 저장하고, 그 교훈을 상속한 재시도를 준비합니다.

## 치트시트

머릿속 문장을 커맨드로 바꾸세요:

| 이런 생각이 들 때… | 커맨드 | 예시 |
|---|---|---|
| "어디서 시작해야 할지 모르겠다" | `/unknowns` | `/unknowns 크론잡을 큐로 마이그레이션` |
| "이 코드/도메인은 처음이다" | `/blindspot` | `/blindspot 빌링 모듈 — 한 번도 안 만져봄` |
| "보면 알겠는데 말로는 못 하겠다" | `/brainstorm` | `/brainstorm 설정 페이지 완전히 다른 방향 4개` |
| "아직 결정 안 한 게 남아 있다" | `/interview` | `/interview 알림 스펙에 대해 인터뷰해줘` |
| "저것처럼 동작하게 해줘" | `/reference` | `/reference vendor/rate-limiter — 같은 백오프를 우리 TS 클라이언트에` |
| "이제 만들자 — 계획 짜줘" | `/impl-plan` | `/impl-plan 지금까지 결정 반영해서 CSV 대량 임포트` |
| "구현해줘" (새 세션에서 계획과 함께) | `/impl-notes` | `.unknowns/plan-csv-import.md 구현, /impl-notes 켜고` |
| "승인/컨펌 받아야 한다" | `/pitch` | `/pitch 팀 채널용으로 이 변경 정리` |
| "방금 만들어진 걸 내가 이해하긴 한 걸까?" | `/quiz` | `/quiz 머지 전에 이 브랜치 퀴즈` |
| "…이게 아닌데" | `/diagnose` | `/diagnose 내보내기 포맷이 틀렸어` |

## 실전 루프

실제 기능 하나를 만들 때의 흐름:

1. **스코프** — `/unknowns` (간극이 뭔지 이미 알면 해당 기법으로 바로 점프).
2. **중요한 간극만 닫기** — 보통 `/blindspot`, `/brainstorm`, `/interview`, `/reference` 중 한두 개. 기본값으로 전부 돌리지 않습니다.
3. **계획** — `/impl-plan`이 모든 산출물을 "결정 우선" 계획으로 통합. 리뷰는 Tier 1만 5분이면 됩니다 (기계적인 작업은 일부러 맨 아래 묻어둠).
4. **새 세션에서 구현** — 계획 파일을 넘기고, `/impl-notes`가 계획과 달라지는 지점을 기록.
5. **검증하고 배포** — 머지 전 `/quiz`(만점 필수), 승인이 필요하면 `/pitch`.
6. **빗나갔을 때** — `/diagnose`로 교훈을 저장하고, 그걸 상속한 재시도.

작은 작업은 1번에서 바로 "그냥 구현"으로 건너뜁니다. 그게 반칙이 아니라 올바른 사용법입니다.

### 구현 전 기법들, 어떤 순서로? 다 해야 하나?

여러 개가 필요할 때의 표준 순서: **blindspot → brainstorm → interview → impl-plan** (`/reference`는 가리킬 대상이 생기는 순간 아무 때나). 각 단계가 다음 단계를 좋게 만들기 때문입니다: 모르는 도메인에선 브레인스토밍이 뻔해지고, 프로토타입에 대한 반응이 빈 종이보다 좋은 인터뷰 질문을 만듭니다.

| 상황 | 시퀀스 |
|---|---|
| 익숙한 코드의 사소한 수정 | 없음 — 바로 구현 |
| 익숙한 영역의 중간 규모 기능 | 가벼운 `/brainstorm` → `/impl-plan` |
| 스펙은 명확, 디테일만 열림 | `/interview` → `/impl-plan` |
| 코드베이스의 낯선 영역 | `/blindspot` → `/interview` → `/impl-plan` |
| 취향이 중요한 작업 (UI/디자인/톤) | `/brainstorm` → `/interview` → `/impl-plan` |
| 새 도메인 + 취향까지 중요 | 4개 전부 |
| "X처럼 만들어줘" | `/reference` → `/impl-plan` |

## 스킬들이 이어지는 방식

스킬들은 레포 루트의 `.unknowns/` 디렉토리(기본 gitignore)를 공유해서, 각자가 이전 산출물을 이어받습니다 — 덕분에 **새 세션에서 구현해도** 잃는 게 없습니다:

```
.unknowns/
  map.md                  ← /unknowns      knowns/unknowns 2×2
  blindspot-<topic>.md    ← /blindspot     물어볼 줄도 몰랐던 것들
  brainstorm-<topic>.html ← /brainstorm    반응하기 위한 일회용 프로토타입
  decisions.md            ← /interview     결정 기록(append-only) + 취향 criteria
  plan-<topic>.md         ← /impl-plan     결정 우선 계획 (decisions.md 준수)
  pitch-<topic>.html      ← /pitch         노트+계획으로 만든 승인용 문서
  quiz-<topic>.html       ← /quiz          인터랙티브 리포트 + 자동 채점 퀴즈
implementation-notes.md   ← /impl-notes    이탈 로그 (아티클대로 레포 루트에)
```

스킬마다 템플릿이 내장되어 있어(디자인 방향 비교 페이지, 채점 내장 퀴즈, 구현 노트 양식, 결정 우선 계획서, 피치 문서) Claude가 매번 포맷을 즉흥으로 만들지 않고 검증된 형식을 채웁니다.

## 이 플러그인의 정신

원문 아티클에서 가져온, 스킬들의 바탕이 되는 약속들:

- **파이프라인이 아니라 field guide.** 특정 간극이 보일 때 꺼내 드는 도구 — 대부분의 작업에서 대부분을 건너뛰는 게 맞습니다.
- **사고 파트너.** 모든 스킬은 당신의 시작점(사고의 어느 지점에 있는지, 문제와 코드베이스를 얼마나 아는지) 파악에서 시작합니다.
- **반복적.** unknowns는 구현 전·중·후 어디서든 나타나고, 되돌아가는 것(이탈이 쌓여 재프레이밍)은 프로세스의 실패가 아니라 작동입니다.
- **당신이 늘어야 합니다.** unknowns를 줄이는 것이 곧 agentic coding의 스킬이고, 훈련 가능합니다. 말로 표현한 반응 하나, 진단한 미스파이어 하나가 그 스킬을 복리로 쌓습니다 — 이 플러그인은 코드와 함께 당신의 성장을 산출물로 취급합니다.
- **잘못된 결과는 판결이 아니라 신호.** 장기 작업이 빗나갔다면 대개 unknowns 정의가 부족했거나 계획에 임기응변의 여지가 없었던 것 — `/diagnose`가 정확히 그걸 수행합니다.

## 크레딧 & 라이선스

모든 아이디어의 공은 [Thariq의 원문 아티클](https://x.com/trq212/article/2073100352921215386)에 있습니다 — 이 플러그인은 그 패턴들의 패키징입니다. MIT 라이선스.
