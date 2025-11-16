import Head from "next/head";
import { WorkspaceAnalytics } from "@/components/workspace/WorkspaceAnalytics";
import { useRouter } from "next/router";
import { useWorkspace } from "@/contexts/workspace-context";
import { useLayout } from "@/contexts/layout-context";
import NotFound from "@/pages/404";

export default function WorkspacePage() {
  const router = useRouter();
  const { workspaceSlug } = router.query;
  const { error, workspace } = useWorkspace();
  const { setShow404 } = useLayout();

  if (error) {
    // Check if it's a 404/not found error
    const is404Error = error.toLowerCase().includes('not found') ||
                       error.toLowerCase().includes('404') ||
                       error.toLowerCase().includes('workspace not found');

    if (is404Error) {
      setShow404(true);
      return <NotFound />;
    }
    // For other errors, redirect to workspaces page
    router.replace("/workspaces");
    return null;
  }

  if (!workspaceSlug) {
    router.replace("/workspaces");
    return null;
  }

  return (
    <>
      <Head>
        <title>{workspace?.name || 'Workspace'} - AadyaBoard</title>
        <meta name="description" content={`View analytics and manage ${workspace?.name || 'workspace'}`} />
      </Head>
      <div className="dashboard-container">
        <WorkspaceAnalytics workspaceSlug={workspaceSlug as string} />
      </div>
    </>
  );
}
