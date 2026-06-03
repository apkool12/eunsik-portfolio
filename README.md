# Hamsik's Journey

우은식의 개인 포트폴리오 웹사이트입니다. 단순히 이력과 프로젝트를 나열하는 페이지가 아니라, 화면 전환, 커서 반응, 모바일 흐름, 블로그 글 읽기 경험까지 하나의 인터랙션 경험으로 설계한 포트폴리오입니다.

배포 주소: [https://hamsik.kr](https://hamsik.kr)

이 프로젝트는 Next.js App Router 기반으로 제작했으며, Emotion으로 스타일 시스템을 구성하고 GSAP으로 페이지별 모션을 구현했습니다. About, Projects, Blog, Contact 각 페이지가 서로 다른 성격을 가지되, 검정/흰색 중심의 강한 타이포그래피와 연두색 포인트 컬러로 하나의 톤을 유지하도록 만들었습니다.

## 주요 목표

- 큰 타이포그래피와 대비가 강한 레이아웃으로 첫인상을 명확하게 전달합니다.
- 데스크톱에서는 전시형, 모바일에서는 읽기 쉬운 자연 스크롤형 UX를 제공합니다.
- GSAP 기반 애니메이션으로 페이지별 개성을 만들되, 사용성을 방해하지 않도록 조정합니다.
- 프로젝트, 활동, 블로그, 연락 기능을 하나의 개인 홈페이지 안에서 완성도 있게 연결합니다.
- 실제 Contact 메일 전송 API를 포함하여 정적 포트폴리오를 넘어서는 기능을 제공합니다.

## 기술 스택

### Core

- Next.js `16.2.6`
- React `19.2.4`
- TypeScript
- App Router
- Server Route Handler

### Styling

- Emotion
- CSS custom properties
- Pretendard
- Material Symbols

### Animation

- GSAP
- `@gsap/react`
- GSAP Observer
- requestAnimationFrame 기반 커서 팔로워

### Data / API

- 정적 상수 기반 프로젝트 및 블로그 데이터
- Next.js Route Handler 기반 Contact 메일 API
- Naver SMTP 직접 연동
- Apollo Client 구성 포함

### Tooling

- ESLint
- TypeScript
- Vercel 배포 대응

## 페이지 구성

### Home

첫 화면은 포트폴리오의 인상을 결정하는 페이지입니다.

- `This is My Journey` 타이핑 애니메이션
- 검정 블록과 `M` 글자 강조
- 흐릿한 문장 배경 마키
- 커스텀 커서 팔로워
- 모바일에서 `My Journey`가 줄바꿈으로 깨지지 않도록 별도 폰트 크기와 폭 제어

관련 파일:

- `src/app/page.tsx`
- `src/app/page.module.css`
- `src/components/sections/HeroTitle/HeroTitle.tsx`
- `src/components/sections/HeroMarquee/HeroMarquee.tsx`

### About

About 페이지는 소개, 기술 스택, 소속/대회/대외활동을 하나의 흐름으로 보여줍니다.

데스크톱에서는 패널 단위 이동을 사용하고, 모바일/태블릿에서는 자연 스크롤 흐름으로 전환합니다. 모바일에서 패널 전환이 콘텐츠 접근성을 막지 않도록 `PanelPager`는 `1100px` 이하에서 일반 문서 흐름으로 동작합니다.

구성:

- Intro: 프로필 이미지, 소개 문구, 기본 정보, SNS 링크
- Skills: 개발 기술, 스타일링, 백엔드 및 배포
- Affiliation: 소속, 대회, 대외활동 탭

특징:

- Intro 진입 애니메이션
- Skills 카드 hover 및 모바일 active 카드 표시
- Affiliation 탭 전환
- 대회 항목 가로 캐러셀
- 대외활동은 기존 소속/대회와 다른 스타일의 리스트로 구성
- 섹션 진입 애니메이션은 초기 진입에만 재생되도록 제어

관련 파일:

- `src/app/about/page.tsx`
- `src/components/layout/PanelPager/PanelPager.tsx`
- `src/components/sections/AboutIntro/AboutIntro.tsx`
- `src/components/sections/AboutSkills/AboutSkills.tsx`
- `src/components/sections/AboutAffiliation/AboutAffiliation.tsx`

### Projects

Projects 페이지는 프로젝트를 단순 카드 목록이 아니라 하나씩 집중해서 볼 수 있는 전시형 페이지로 구성했습니다.

데스크톱:

- 화면을 고정한 풀스크린 패널 구조
- 마우스 휠 또는 점 네비게이션으로 프로젝트 전환
- 프로젝트 제목, 미리보기, 설명 영역을 한 화면에 배치
- GSAP morph 애니메이션으로 프로젝트 간 전환

모바일:

- 고정 프레임을 해제하고 자연 스크롤로 변경
- `Project,` 제목 아래 미리보기 이미지를 먼저 노출
- 그 아래 설명, 제작 기간, 팀원, 기술 스택, GitHub 버튼을 배치
- 점 네비게이션은 화면을 가리지 않도록 모바일 흐름에 맞게 조정

등록된 프로젝트:

- 포트폴리오 웹사이트
- Kracker
- BYTE GAME
- 느림의 미학

관련 파일:

- `src/app/projects/page.tsx`
- `src/components/sections/ProjectPanel/ProjectMorphView.tsx`
- `src/components/sections/ProjectPanel/ProjectPanel.tsx`
- `src/constants/projects.ts`

### Blog

블로그는 개발 회고와 개인 기록을 함께 담을 수 있도록 구성했습니다.

목록 페이지:

- All, Dev Notes, Daily 탭
- 큰 아카이브 바
- 원형 썸네일
- 글 제목, 설명, 태그, 날짜
- 모바일 초기 진입 시 좌측으로 붙어 보이지 않도록 애니메이션 방향 조정

상세 페이지:

- 정적 생성 `generateStaticParams`
- 글별 메타 정보, 태그, 썸네일
- Index 목차
- 현재 읽는 섹션 active 표시
- Previous / Next 네비게이션
- 코드블록 컴포넌트

모바일 상세 페이지에서는 Index pill과 코드블록이 본문 폭을 밀어내지 않도록 별도 폭 제어를 넣었습니다. 글 본문은 작은 화면에서 지나치게 크게 보이지 않도록 폰트 크기와 행간을 낮추고, 코드블록은 화면 안에서 줄바꿈되도록 처리했습니다.

관련 파일:

- `src/app/blog/page.tsx`
- `src/app/blog/[slug]/page.tsx`
- `src/components/sections/BlogArticle/BlogArticle.tsx`
- `src/components/ui/BlogCodeBlock/BlogCodeBlock.tsx`
- `src/constants/blog.ts`

### Contact

Contact 페이지는 Mac 터미널을 모티프로 만든 SendMail 인터랙션을 사용합니다.

구성:

- `Contact,` 타이틀
- 감사 문구
- 터미널 스타일 SendMail 영역
- GSAP typing 애니메이션
- SendMail 클릭 시 메일 작성 모달
- 제목, 보낼 이메일, 내용 입력
- Next.js API를 통한 실제 메일 전송

메일은 `apkool12@naver.com`으로 전송됩니다. SMTP 인증은 `.env.local`에서 설정합니다.

관련 파일:

- `src/app/contact/page.tsx`
- `src/app/api/contact/send/route.ts`

## 인터랙션 및 애니메이션

이 프로젝트는 페이지별로 서로 다른 애니메이션 전략을 사용합니다.

### Home 타이핑 애니메이션

`HeroTitle`은 `This is`와 `My Journey`를 순차적으로 보여줍니다. 두 번째 줄에서는 검정 블록과 흰색 `M`을 활용해 타이핑 효과와 그래픽 요소를 함께 사용합니다.

### Projects morph 전환

프로젝트가 변경될 때 제목 글자, 설명 텍스트, 미리보기 이미지가 함께 전환됩니다. 데스크톱에서는 GSAP Observer를 사용하여 wheel, touch, pointer 입력으로 프로젝트 전환을 제어합니다.

### About 패널 이동

`PanelPager`는 데스크톱에서 패널 단위 전환을 담당합니다. 내부에 스크롤 가능한 영역이 있을 때는 패널 전환을 막고 내부 스크롤을 우선합니다. 모바일에서는 이 구조가 불편할 수 있어 일반 스크롤로 전환합니다.

### Custom Cursor

`CursorFollower`는 두 겹 구조의 커스텀 커서입니다.

- 작은 점은 빠르게 따라옵니다.
- 바깥 링은 느리게 따라옵니다.
- 속도에 따라 squash & stretch 형태로 변형됩니다.
- hover 가능한 요소 위에서는 반응 상태가 바뀝니다.
- 터치 환경과 reduced motion 환경에서는 비활성화됩니다.

### Blog Index

블로그 상세 페이지는 현재 읽는 섹션을 계산해 Index에 표시합니다. 모바일에서는 sticky 목차가 스크롤을 막지 않도록 정적 흐름으로 풀고, 가로 스크롤 가능한 목차 pill로 제공합니다.

## 반응형 전략

이 프로젝트는 데스크톱 디자인을 그대로 줄이는 방식이 아니라, 구간별로 다른 구조를 사용합니다.

### 전역 기준

`globals.css`에서 주요 전역 변수를 관리합니다.

- `--header-height`
- `--page-gutter`
- `--project-details-width`
- `--project-content-gap`
- `--project-dots-reserve`
- `--global-scale`

데스크톱에서는 큰 화면 비율을 유지하기 위해 `--global-scale`을 사용하고, 모바일에서는 실제 반응형 레이아웃이 작동하도록 scale을 `1`로 돌립니다.

### 주요 breakpoint

- `1100px`: About 패널 전환 해제, Projects 모바일/태블릿 흐름 전환
- `900px`: 일반적인 1열 구조 전환, Blog/Contact/About 일부 모바일 레이아웃
- `640px`: 모바일 상세 최적화, 프로젝트 변수 재설정, header 높이 조정
- `480px`: 작은 모바일 화면용 폰트, 간격, 버튼 조정

### 모바일에서 별도로 바꾼 부분

- Home: `My Journey` 줄바꿈/잘림 방지
- About: 패널 이동 대신 자연 스크롤
- About Skills: 가로 카드 레일과 active 카드 표시
- Projects: 고정 전시형 구조 대신 미리보기 우선 스크롤 구조
- Blog Detail: Index/본문/코드블록이 화면 폭을 넘지 않도록 폭 제어
- Contact: 터미널 UI와 모달을 작은 화면에 맞게 축소

## 프로젝트 구조

```txt
src
├── app
│   ├── about
│   ├── api/contact/send
│   ├── blog
│   ├── contact
│   ├── projects
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── icons
│   ├── layout
│   │   ├── Header
│   │   ├── PageScaleWrapper
│   │   └── PanelPager
│   ├── providers
│   ├── sections
│   │   ├── AboutAffiliation
│   │   ├── AboutIntro
│   │   ├── AboutSkills
│   │   ├── BlogArticle
│   │   ├── HeroMarquee
│   │   ├── HeroTitle
│   │   └── ProjectPanel
│   └── ui
│       ├── BlogCodeBlock
│       └── CursorFollower
├── constants
│   ├── blog.ts
│   ├── navigation.ts
│   ├── projects.ts
│   └── social.ts
└── lib
    ├── apollo
    └── emotion
```

## 데이터 관리

현재 프로젝트와 블로그 데이터는 별도 CMS 없이 TypeScript 상수로 관리합니다.

### 프로젝트 데이터

`src/constants/projects.ts`

```ts
export type Project = {
  id: string;
  name: string;
  description: string;
  period: string;
  members: string;
  techStack: string[];
  githubUrl?: string;
  imageSrc?: string;
  imageAlt?: string;
};
```

새 프로젝트를 추가하려면 `PROJECTS` 배열에 항목을 추가하고, 필요한 이미지를 `public` 폴더에 넣으면 됩니다.

### 블로그 데이터

`src/constants/blog.ts`

블로그는 `BLOG_POSTS` 배열로 관리합니다. 각 글은 slug, 제목, 설명, 날짜, 태그, 카테고리, 본문 section을 가집니다.

코드블록은 아래 형태로 추가할 수 있습니다.

```ts
{
  type: "code",
  language: "typescript",
  caption: "설명",
  code: `const message = "hello";`,
}
```

`src/app/blog/[slug]/page.tsx`에서 `generateStaticParams`를 통해 정적 페이지로 생성합니다.

## Contact 메일 API

Contact 페이지의 SendMail 기능은 Next.js Route Handler에서 Naver SMTP로 메일을 전송합니다.

API 위치:

```txt
src/app/api/contact/send/route.ts
```

요청 형식:

```json
{
  "title": "메일 제목",
  "email": "sender@example.com",
  "content": "메일 내용"
}
```

검증:

- 제목 필수
- 이메일 필수
- 이메일 형식 검증
- 내용 필수
- 제목 최대 120자
- 이메일 최대 160자
- 내용 최대 5000자

SMTP 설정이 없거나 전송 실패 시 500 응답을 반환합니다.

## 환경 변수

루트에 `.env.local` 파일을 만들고 아래 값을 설정합니다.

```bash
NAVER_SMTP_USER=apkool12@naver.com
NAVER_SMTP_APP_PASSWORD=your-naver-application-password
```

선택 환경 변수:

```bash
NEXT_PUBLIC_GRAPHQL_URI=http://localhost:4000/graphql
```

`NAVER_SMTP_APP_PASSWORD`는 네이버 계정 비밀번호가 아니라, SMTP 사용을 위해 발급한 애플리케이션 비밀번호 또는 SMTP 인증용 비밀번호를 넣어야 합니다. 네이버 메일 환경에서 POP3/SMTP 사용을 허용해야 정상 동작합니다.

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

루트에 `.env.local` 파일을 직접 생성합니다.

```bash
NAVER_SMTP_USER=apkool12@naver.com
NAVER_SMTP_APP_PASSWORD=your-naver-application-password
```

### 3. 개발 서버 실행

```bash
npm run dev
```

개발 서버는 모든 호스트에서 접근 가능하도록 아래 명령을 사용합니다.

```json
"dev": "next dev --hostname 0.0.0.0"
```

브라우저에서 접속합니다.

```txt
http://localhost:3000
```

### 4. 프로덕션 빌드

```bash
npm run build
```

### 5. 프로덕션 실행

```bash
npm run start
```

### 6. 린트

```bash
npm run lint
```

## 배포

Vercel 배포를 기준으로 구성되어 있으며, 현재 운영 주소는 [https://hamsik.kr](https://hamsik.kr)입니다.

배포 시 확인할 것:

- Node.js 런타임에서 Contact API가 동작해야 합니다.
- Vercel Environment Variables에 SMTP 값을 등록해야 합니다.
- `NAVER_SMTP_USER`
- `NAVER_SMTP_APP_PASSWORD`
- Contact API는 `runtime = "nodejs"`를 사용합니다.
- 커스텀 도메인 `hamsik.kr`의 DNS가 Vercel 프로젝트를 바라보도록 설정되어 있어야 합니다.

Vercel에 환경 변수를 등록하지 않으면 Contact 폼은 렌더링되지만 메일 전송은 실패합니다.

## 트러블슈팅 기록

### 다른 화면에서 90% 줌이 필요해 보이던 문제

초기 화면은 개발 환경 기준으로는 안정적이었지만, 노트북 해상도나 세로가 낮은 화면에서는 콘텐츠가 잘려 90% 브라우저 줌이 필요해 보이는 문제가 있었습니다. 전체를 고정 `zoom: 0.9`로 줄이는 방식은 임시 해결에 가깝기 때문에, 전역 `--global-scale`을 화면 폭과 높이에 맞춰 계산하고 모바일에서는 실제 반응형 레이아웃이 작동하도록 `1`로 되돌렸습니다.

확인 기준:

- 데스크톱에서는 큰 타이포그래피와 패널 비율이 유지되는지 확인합니다.
- 세로가 낮은 화면에서는 프로젝트 프리뷰와 설명 영역이 한 화면 안에 들어오는지 확인합니다.
- 모바일에서는 scale 축소가 아니라 1열 자연 스크롤 구조로 보이는지 확인합니다.

관련 파일:

- `src/app/globals.css`
- `src/components/layout/PageScaleWrapper/PageScaleWrapper.tsx`
- `src/app/page.module.css`

### About 페이지에서 아래 콘텐츠가 있는지 알기 어려웠던 문제

About 페이지는 데스크톱에서 패널 단위 이동을 사용하기 때문에 첫 화면만 보면 스크롤 가능한 페이지인지 모호할 수 있었습니다. Projects 페이지와 같은 점 네비게이션 언어를 재사용해 현재 위치와 다음 섹션이 있다는 신호를 추가했고, `1100px` 이하에서는 패널 이동을 풀어 자연 스크롤로 전환했습니다.

확인 기준:

- 데스크톱에서는 점 네비게이션으로 현재 섹션 위치가 드러나야 합니다.
- 내부 스크롤이 필요한 영역에서는 패널 전환보다 내부 스크롤이 우선되어야 합니다.
- 모바일/태블릿에서는 콘텐츠가 끊기지 않고 문서 흐름으로 이어져야 합니다.

관련 파일:

- `src/components/layout/PanelPager/PanelPager.tsx`
- `src/app/about/page.tsx`
- `src/components/sections/AboutAffiliation/AboutAffiliation.tsx`

### Projects 페이지가 모바일에서 전시형 구조를 유지하던 문제

데스크톱의 풀스크린 전시형 패널은 프로젝트 하나에 집중하기 좋지만, 모바일에서는 고정 프레임과 점 네비게이션이 콘텐츠 접근성을 떨어뜨릴 수 있었습니다. 모바일에서는 프리뷰 이미지를 먼저 보여주고, 설명과 메타 정보를 아래에 이어 배치하는 자연 스크롤 구조로 분리했습니다.

확인 기준:

- 데스크톱에서는 wheel, touch, pointer 입력으로 프로젝트 전환이 부드럽게 동작해야 합니다.
- 모바일에서는 이미지, 설명, 기간, 팀원, 기술 스택, GitHub 버튼 순서로 읽혀야 합니다.
- 점 네비게이션이 본문이나 버튼을 가리지 않아야 합니다.

관련 파일:

- `src/components/sections/ProjectPanel/ProjectMorphView.tsx`
- `src/components/sections/ProjectPanel/ProjectPanel.tsx`
- `src/constants/projects.ts`

### Blog 상세의 Index와 코드블록이 모바일 폭을 밀어내던 문제

블로그 상세 페이지의 Index와 코드블록은 데스크톱에서는 읽기 편했지만, 모바일에서는 본문 폭을 밀어내거나 가로 overflow를 만들 수 있었습니다. 모바일에서 Index를 sticky 사이드바가 아닌 가로 pill 형태로 풀고, 코드블록은 작은 화면 안에서 줄바꿈되도록 조정했습니다.

확인 기준:

- 모바일에서 본문이 좌우로 흔들리지 않아야 합니다.
- Index pill은 가로 스크롤 가능하되 페이지 전체 폭을 넘기지 않아야 합니다.
- 코드블록은 화면을 밀지 않고 내부에서 읽을 수 있어야 합니다.

관련 파일:

- `src/app/blog/[slug]/page.tsx`
- `src/components/sections/BlogArticle/BlogArticle.tsx`
- `src/components/ui/BlogCodeBlock/BlogCodeBlock.tsx`

### Contact 메일 전송 실패

Contact API는 Naver SMTP를 직접 사용합니다. 로컬이나 Vercel 환경에 SMTP 환경 변수가 없거나, 네이버 메일에서 POP3/SMTP 사용이 꺼져 있으면 전송은 실패하고 500 응답을 반환합니다.

확인 순서:

1. `.env.local` 또는 Vercel Environment Variables에 `NAVER_SMTP_USER`와 `NAVER_SMTP_APP_PASSWORD`가 등록되어 있는지 확인합니다.
2. `NAVER_SMTP_APP_PASSWORD`에 네이버 계정 비밀번호가 아니라 SMTP 인증용 비밀번호가 들어갔는지 확인합니다.
3. 네이버 메일 설정에서 POP3/SMTP 사용이 허용되어 있는지 확인합니다.
4. Vercel 배포 후 Contact API가 Node.js runtime으로 동작하는지 확인합니다.

관련 파일:

- `src/app/api/contact/send/route.ts`

## 접근성과 사용성 고려

- 주요 네비게이션은 `aria-label`을 사용합니다.
- 블로그 글 목록과 Index 영역에 의미 있는 label을 부여했습니다.
- 커스텀 커서는 pointer event를 막지 않도록 `pointer-events: none` 기반으로 동작합니다.
- `prefers-reduced-motion` 환경에서는 주요 애니메이션을 줄이거나 비활성화합니다.
- 터치 기기에서는 커스텀 커서를 숨깁니다.
- 모바일에서는 데스크톱용 강제 패널 이동을 해제해 콘텐츠 접근성을 우선합니다.

## 최근 개선 사항

이 프로젝트는 실제 피드백을 바탕으로 여러 차례 반응형과 사용성을 다듬었습니다.

- 90% 줌 없이 보이도록 전역 스케일과 페이지별 비율 조정
- About 페이지에 스크롤 신호와 모바일 자연 스크롤 구조 적용
- Projects 모바일에서 미리보기 우선 흐름으로 재구성
- Blog 상세 Index가 본문 폭을 밀어내던 문제 해결
- Blog 본문/코드블록 모바일 overflow 제거
- Skills 모바일 카드 active 표시 방식 개선
- 대외활동 탭 이동 시 애니메이션 반복 재생 방지
- Contact 메일 전송 API 추가

## 앞으로 개선하고 싶은 부분

- 블로그 글을 외부 플랫폼에도 백업할 수 있는 export 흐름 추가
- 프로젝트 상세 페이지 또는 모달 추가
- Contact 전송 성공/실패 히스토리 UI 개선
- 블로그 글 검색 기능
- 이미지 최적화 및 blur placeholder 적용
- 활동 데이터도 상수 파일로 분리하여 유지보수성 개선

## 작성자

우은식

- GitHub: [apkool12](https://github.com/apkool12)
- Instagram: [@dmd_.sik](https://www.instagram.com/dmd_.sik)
