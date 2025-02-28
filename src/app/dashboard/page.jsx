// DashboardPage.js - Main dashboard component
"use client";

import { useEffect, useState } from "react";
import { db } from "../../../config";
import { ref, get } from "firebase/database";
import Approved from "../components/Approved";
import dynamic from "next/dynamic";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const ScanQRTabContent = dynamic(() => import("./tabs/ScanQRTabContent"), {
  ssr: false,
});
const TeamTabContent = dynamic(() => import("./tabs/TeamsTabContent"), {
  ssr: false,
});

const IndividualAppsTabContent = dynamic(
  () => import("./tabs/IndividualTabContent"),
  {
    ssr: false,
  }
);

export default function DashboardPage() {
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
      // Default to 'team_tab' if no tab is set
      setActiveTab("team_tab");
    }
  }, [searchParams]);

  const tabs = [
    {
      key: "individual_apps",
      label: "All Applications",
      component: <IndividualAppsTabContent />,
    },
    {
      key: "team_apps",
      label: "All Team Applications",
      component: <TeamTabContent />,
    },

    {
      key: "scan_qr",
      label: "Scan QR Code",
      component: <ScanQRTabContent />,
    },
  ];

  const handleTabClick = (tabKey) => {
    // Update the query parameter when a tab is clicked
    setActiveTab(tabKey);
    router.push(`/dashboard?tab=${tabKey}`, undefined, { shallow: true });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Dashboard</h1>

      {/* Tab Navigation */}
      <div className="flex justify-center space-x-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 rounded-lg ${
              activeTab === tab.key ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
            onClick={() => handleTabClick(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {tabs.map(
          (tab) =>
            activeTab === tab.key && (
              <div key={tab.key} className="tab-panel">
                {tab.component}
              </div>
            )
        )}
      </div>
    </div>
  );
}
