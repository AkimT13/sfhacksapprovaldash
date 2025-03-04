export default function TabNavigation({ tabs, activeTab, handleTabClick }) {
  return (
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
  );
}
