export default function TabView({ tabs, activeTab }) {
  return (
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
  );
}
