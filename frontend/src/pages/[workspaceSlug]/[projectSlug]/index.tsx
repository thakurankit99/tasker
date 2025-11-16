// In your project page

import Head from "next/head";
import { ProjectAnalytics } from "@/components/projects/ProjectAnalytics";
import { useRouter } from "next/router";
import { useProjectContext } from "@/contexts/project-context";

export default function ProjectPage() {
  const router = useRouter();
  const { projectSlug } = router.query;
  const { currentProject } = useProjectContext();

  return (
    <>
      <Head>
        <title>{currentProject?.name || 'Project'} - AadyaBoard</title>
        <meta name="description" content={`View analytics and manage ${currentProject?.name || 'project'}`} />
      </Head>
      <div className="dashboard-container">
        <ProjectAnalytics projectSlug={projectSlug as string} />
      </div>
    </>
  );
}
