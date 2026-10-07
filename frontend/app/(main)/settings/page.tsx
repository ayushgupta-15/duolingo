export default function SettingsPage() {
  const rows = [
    { icon: "🔔", label: "Notifications" },
    { icon: "🌐", label: "Language course" },
    { icon: "🔊", label: "Sound effects" },
    { icon: "🌙", label: "Dark mode" },
    { icon: "💳", label: "Super subscription" },
  ];
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black mb-6">Settings</h1>
      <div className="duo-card divide-y-2 divide-[var(--duo-border)]">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-4 px-5 py-4">
            <span className="text-2xl">{r.icon}</span>
            <span className="flex-1 font-bold">{r.label}</span>
            <span className="text-xs font-bold text-[var(--duo-gray)] uppercase bg-[var(--duo-bg-soft)] px-2 py-1 rounded-lg">
              Coming Soon
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
