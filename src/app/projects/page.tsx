import {
  ProjectMorphView,
  ProjectPanelShell,
  ProjectsPageFrame,
} from "@/components/sections/ProjectPanel";

export default function ProjectsPage() {
  return (
    <ProjectsPageFrame>
      <ProjectPanelShell>
        <ProjectMorphView />
      </ProjectPanelShell>
    </ProjectsPageFrame>
  );
}
