import Head from "next/head";
import WorkspacesPageContent from "@/components/workspace/WorkspacesPageContent";
import { TokenManager } from "@/lib/api";

export default function WorkspacesPage() {
  const orgId = TokenManager.getCurrentOrgId();

  return (
    <>
      <Head>
        <title>Workspaces - AadyaBoard</title>
        <meta name="description" content="Manage your workspaces and organize your team's projects" />
      </Head>
      <WorkspacesPageContent organizationId={orgId} />
    </>
  );
}
