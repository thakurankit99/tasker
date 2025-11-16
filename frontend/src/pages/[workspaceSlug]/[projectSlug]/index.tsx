// In your project page

import Head from "next/head";
import { ProjectAnalytics } from "@/components/projects/ProjectAnalytics";
import { useRouter } from "next/router";
import { useProjectContext } from "@/contexts/project-context";

export default function ProjectPage() {
  const router = useRouter();
  const { projectSlug } = router.query;
  const { project } = useProjectContext();

  return (
    <>
      <Head>
        <title>{project?.name || 'Project'} - AadyaBoard</title>
        <meta name="description" content={`View analytics and manage ${project?.name || 'project'}`} />
      </Head>
      <div className="dashboard-container">
        <ProjectAnalytics projectSlug={projectSlug as string} />
      </div>
    </>
  );
}
