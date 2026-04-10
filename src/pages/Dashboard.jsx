import { BarChart3, Sparkles, Zap } from "lucide-react";

const highlights = [
  {
    icon: Sparkles,
    title: "AI Post Ideas",
    value: "24",
    subtext: "Generated this week",
    tone: "from-orange-500/30 to-orange-700/20 text-orange-200",
  },
  {
    icon: BarChart3,
    title: "Avg Engagement",
    value: "5.2%",
    subtext: "Across your channels",
    tone: "from-blue-500/30 to-blue-700/20 text-blue-200",
  },
  {
    icon: Zap,
    title: "Publishing Streak",
    value: "11 days",
    subtext: "Consistency momentum",
    tone: "from-emerald-500/30 to-emerald-700/20 text-emerald-200",
  },
];

export default function Dashboard() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Dashboard</p>
        <h2 className="mt-2 text-3xl font-bold text-white">Content Performance Pulse</h2>
        <p className="mt-3 max-w-2xl text-gray-400">
          Track growth and discover opportunities to create your next breakout post.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {highlights.map(({ icon: Icon, title, value, subtext, tone }) => (
          <article
            key={title}
            className={`rounded-2xl border border-gray-700 bg-gradient-to-br p-5 ${tone}`}
          >
            <div className="mb-3 inline-flex rounded-lg bg-gray-900/60 p-2">
              <Icon size={18} />
            </div>
            <p className="text-sm font-medium">{title}</p>
            <p className="mt-2 text-2xl font-bold text-white">{value}</p>
            <p className="mt-1 text-sm text-gray-300">{subtext}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
