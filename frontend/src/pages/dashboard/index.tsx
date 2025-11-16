import Head from "next/head";
import { OrganizationAnalytics } from "@/components/organizations/OrganizationAnalytics";
import { TokenManager } from "@/lib/api";

export default function DashboarPage() {
  const orgId = TokenManager.getCurrentOrgId();
  return (
    <>
      <Head>
        <title>Dashboard - AadyaBoard</title>
        <meta name="description" content="Your AadyaBoard dashboard - manage projects, tasks, and team collaboration" />
      </Head>
      <div className="dashboard-container">
        <OrganizationAnalytics organizationId={orgId} />
      </div>
    </>
  );
}
