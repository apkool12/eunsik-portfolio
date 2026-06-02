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

/** 추후 실제 프로젝트로 교체 */
export const PROJECTS: Project[] = [
  {
    id: "portfolio",
    name: "포트폴리오 웹사이트",
    description:
      "Next.js와 Emotion으로 제작한 개인 포트폴리오입니다. GSAP 기반 풀스크린 패널 전환과 반응형 레이아웃을 적용했습니다.",
    period: "2026.05 — 2026.06",
    members: "우은식 (1인)",
    techStack: ["Next.js", "TypeScript", "Emotion"],
    githubUrl: "https://github.com/apkool12/eunsik-portfolio",
    imageSrc: "/Project_portfolio.png",
    imageAlt: "포트폴리오 웹사이트 미리보기",
  },
  {
    id: "kracker",
    name: "Kracker",
    description:
      "크래프톤 정글에서 6일간 제작한 멀티플레이어 웹 슈팅 게임입니다. Phaser 3 기반 실시간 전투, Socket.IO 동기화, 라운드별 증강 선택 시스템을 구현했습니다.",
    period: "2025.08.16 — 2025.08.22",
    members: "우은식(풀스택) 정욱(프론트)",
    techStack: ["React", "TypeScript", "Phaser 3", "Socket.IO", "Node.js"],
    githubUrl: "https://github.com/apkool12/kracker/tree/main/kracker",
    imageSrc: "/kracker.png",
    imageAlt: "Kracker 게임 미리보기",
  },
  {
    id: "byte-game",
    name: "BYTE GAME",
    description:
      "컴퓨터공학과 MT 레크레이션 관리을 위해 제작한 웹사이트입니다. Emotion으로 UI를 구성하고 Socket으로 실시간 연동하며, Prisma로 데이터를 관리합니다.",
    period: "2026.02 — 2026.03",
    members: "우은식 (1인)",
    techStack: ["Next.js", "TypeScript", "Emotion", "Socket.IO", "Prisma"],
    githubUrl: "https://github.com/apkool12/byte_game",
    imageSrc: "/bytegame.png",
    imageAlt: "BYTE GAME 미리보기",
  },
  {
    id: "hackathon-front",
    name: "느림의 미학",
    description:
      "멋쟁이사자처럼 해커톤 프론트엔드 프로젝트입니다. React로 단계·할 일 UI를 구현하고, Django REST API 연동 과정에서 CORS·CSRF 이슈를 해결했습니다.",
    period: "2024.07 — 2024.08",
    members: "김영권(풀스택) 우은식(프론트) 남지우(백엔드) 김봉경(백엔드) 전지우(디자인)",
    techStack: ["React", "JavaScript", "CSS"],
    githubUrl: "https://github.com/apkool12/Hackathon-Front",
    imageSrc: "/느림의미학.png",
    imageAlt: "느림의 미학 미리보기",
  },
];
