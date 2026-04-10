import { useMemo, useState } from "react";
import {
  BarChart3,
  Check,
  Clock3,
  Lightbulb,
  RadioTower,
  Search,
  Users,
} from "lucide-react";

const trendClusters = [
  {
    id: 1,
    topic: "Cold Plunge Morning Stack",
    platform: "TikTok",
    trendScore: "High",
    estimatedReach: "1.8M - 2.4M",
    bestPostingTime: "07:30 AM - 09:00 AM",
    angle: "7-day transformation montage with daily biomarker checkpoints.",
  },
  {
    id: 2,
    topic: "Underrated Creator Tech Setup",
    platform: "YouTube Shorts",
    trendScore: "Medium",
    estimatedReach: "620K - 900K",
    bestPostingTime: "12:00 PM - 02:00 PM",
    angle: "Budget vs pro split-screen comparison with conversion-focused CTA.",
  },
  {
    id: 3,
    topic: "Airport Outfit POV Challenges",
    platform: "Instagram Reels",
    trendScore: "High",
    estimatedReach: "1.1M - 1.6M",
    bestPostingTime: "05:30 PM - 07:00 PM",
    angle: "Fast transitions synced to trend audio + destination reveal hook.",
  },
  {
    id: 4,
    topic: "1-Minute Skill Compression",
    platform: "LinkedIn",
    trendScore: "Low",
    estimatedReach: "210K - 340K",
    bestPostingTime: "08:15 AM - 09:45 AM",
    angle: "Teach one niche growth skill with before/after business outcome.",
  },
  {
    id: 5,
    topic: "Creator Burnout Recovery Protocol",
    platform: "X",
    trendScore: "Medium",
    estimatedReach: "480K - 760K",
    bestPostingTime: "10:30 AM - 12:00 PM",
    angle: "Thread-style carousel: signs, causes, and a 3-step reset framework.",
  },
  {
    id: 6,
    topic: "Micro-Story Hook Engineering",
    platform: "Instagram Reels",
    trendScore: "High",
    estimatedReach: "1.4M - 2.0M",
    bestPostingTime: "06:00 PM - 08:30 PM",
    angle: "Open with conflict in first 1.5s, resolve in final 3s with proof.",
  },
];

const scoreStyles = {
  High: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  Medium: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
  Low: "bg-red-500/20 text-red-300 border border-red-500/30",
};

const platformStyles = {
  TikTok: "bg-pink-500/20 text-pink-300 border border-pink-500/30",
  "YouTube Shorts": "bg-red-500/20 text-red-300 border border-red-500/30",
  "Instagram Reels": "bg-purple-500/20 text-purple-300 border border-purple-500/30",
  LinkedIn: "bg-sky-500/20 text-sky-300 border border-sky-500/30",
  X: "bg-slate-500/20 text-slate-300 border border-slate-500/30",
};

export default function CompetitiveIntelligence() {
  const [handle, setHandle] = useState("");
  const [adopted, setAdopted] = useState({});

  const normalizedHandle = useMemo(() => {
    if (!handle.trim()) return "@competitor_handle";
    return handle.trim().startsWith("@") ? handle.trim() : `@${handle.trim()}`;
  }, [handle]);

  const toggleAdopt = (id) => {
    setAdopted((current) => ({ ...current, [id]: !current[id] }));
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-xl shadow-black/20">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Competitive Intelligence</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Trend Cluster Monitor</h2>
            <p className="mt-2 max-w-2xl text-sm text-gray-300">
              Track breakout concepts from rival creators and adapt winning angles to your content strategy.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-900 px-3 py-1 text-xs text-gray-300">
            <RadioTower size={14} />
            Live competitive feed
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={handle}
              onChange={(event) => setHandle(event.target.value)}
              placeholder="Search competitor handle (e.g. @alexrmedia)"
              className="w-full rounded-xl border border-gray-700 bg-gray-900 py-2.5 pl-10 pr-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-orange-500 focus:outline-none"
            />
          </label>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-400"
          >
            <BarChart3 size={16} />
            Analyze
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {trendClusters.map((cluster) => {
          const isAdopted = !!adopted[cluster.id];
          return (
            <article
              key={cluster.id}
              className="flex h-full flex-col rounded-2xl border border-gray-700 bg-gray-800 p-5 shadow-lg shadow-black/10"
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-lg font-semibold text-white">{cluster.topic}</h3>
                <div className="flex items-center gap-2">
                  <span
                    className={[
                      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                      platformStyles[cluster.platform] || "bg-gray-700 text-gray-200 border border-gray-600",
                    ].join(" ")}
                  >
                    {cluster.platform}
                  </span>
                  <span
                    className={[
                      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                      scoreStyles[cluster.trendScore],
                    ].join(" ")}
                  >
                    Trend Score: {cluster.trendScore}
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-200">
                <div className="flex items-start gap-2">
                  <Users size={16} className="mt-0.5 text-orange-400" />
                  <p>
                    <span className="text-gray-400">Estimated reach:</span> {cluster.estimatedReach}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Clock3 size={16} className="mt-0.5 text-orange-400" />
                  <p>
                    <span className="text-gray-400">Best posting time:</span> {cluster.bestPostingTime}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Lightbulb size={16} className="mt-0.5 text-orange-400" />
                  <p>
                    <span className="text-gray-400">Angle:</span> {cluster.angle}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => toggleAdopt(cluster.id)}
                  className={[
                    "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                    isAdopted
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-gray-900 text-gray-100 border border-gray-600 hover:border-orange-400 hover:text-white",
                  ].join(" ")}
                >
                  {isAdopted ? <Check size={16} /> : null}
                  {isAdopted ? "Adopted" : "Adopt"}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="rounded-xl border border-gray-700 bg-gray-800 p-4 text-sm text-gray-300">
        Showing signal clusters for <span className="font-semibold text-white">{normalizedHandle}</span>.
      </div>
    </section>
  );
}
