import {
  ProjectMorphView,
  ProjectPanelShell,
  ProjectsPageFrame,
} from "@/components/sections/ProjectPanel";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Projects",
  description:
    "프론트엔드와 UI 중심으로 진행한 프로젝트를 소개합니다. 기술 스택과 구현 포인트를 함께 확인할 수 있습니다.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <ProjectsPageFrame>
      <ProjectPanelShell>
        <ProjectMorphView />
      </ProjectPanelShell>
    </ProjectsPageFrame>
  );
}
