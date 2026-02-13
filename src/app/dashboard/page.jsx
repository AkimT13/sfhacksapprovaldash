// DashboardPage.js - Main dashboard component
"use client";

import { useEffect, useState, Suspense } from "react";
import { db } from "../../../config";
import { ref, get } from "firebase/database";
import Approved from "./tabs/ApprovedTabContent";
import dynamic from "next/dynamic";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ApprovedTabContent from "./tabs/ApprovedTabContent";
import TabNavigation from "../components/TabNavigation";
import TabView from "../components/TabView";
import WaitlistTabContent from "./tabs/WaitListTabContent";
import CheckedInTabContent from "./tabs/CheckedInTabContent";

const ScanQRTabContent = dynamic(() => import("./tabs/ScanQRTabContent"), {
  ssr: false,
});
const TeamTabContent = dynamic(() => import("./tabs/TeamsTabContent"), {
  ssr: false,
});
const IndividualAppsTabContent = dynamic(
  () => import("./tabs/IndividualTabContent"),
  { ssr: false }
);

function DashboardContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "team_tab"
  );

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    } else {
      setActiveTab("team_tab");
    }
  }, [searchParams]);

  const tabs = [
    
    { key: "scan_qr", label: "Scan QR Code", component: <ScanQRTabContent /> },
    
  ];

  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
    router.push(`/dashboard?tab=${tabKey}`, undefined, { shallow: true });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Dashboard</h1>
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        handleTabClick={handleTabClick}
      />

      <TabView tabs={tabs} activeTab={activeTab} />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
