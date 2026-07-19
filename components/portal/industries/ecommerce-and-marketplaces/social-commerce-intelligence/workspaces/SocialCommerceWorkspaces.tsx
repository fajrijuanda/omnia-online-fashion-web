import { RoundedSelect } from "@/components/portal/ui";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Circle, Lock, Plus, RefreshCcw, SlidersHorizontal, PlayCircle, BarChart, TrendingUp, Calendar, ArrowRight, Download, Share2, Settings2, ShieldCheck, Mail } from "lucide-react";
import { Panel, SimpleTable } from "@/components/portal/ui";
import {
  liveSignals,
  type SocialCommerceModuleKey
} from "../socialCommerceData";
import {
  categoryOptions,
  channelOptions,
  connectorStatusLabel,
  fallbackSocialSnapshot,
  fetchSocialProducts,
  type SocialConnector,
  type SocialProductTrend,
  type SocialSnapshot
} from "../socialCommerceApi";

export function SocialCommerceWorkspace({
  moduleKey,
  locked,
  onLockedModule,
  snapshot = fallbackSocialSnapshot,
  loading = false,
  refreshSnapshot
}: {
  moduleKey: SocialCommerceModuleKey;
  locked: boolean;
  onLockedModule: () => void;
  snapshot?: SocialSnapshot;
  loading?: boolean;
  refreshSnapshot?: () => void;
}) {
  if (locked) {
    return (
      <Panel className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-slate-100 text-slate-400">
              <Lock className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Locked module</p>
              <h2 className="mt-1 text-2xl font-black text-[#172033]">Upgrade untuk membuka workflow ini</h2>
              <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-slate-500">
                Modul ini tetap terlihat agar pelanggan memahami roadmap tier, tetapi aksi operasionalnya dikunci sampai subscription sesuai.
              </p>
            </div>
          </div>
          <button onClick={onLockedModule} className="w-fit rounded-full bg-[#172033] px-5 py-3 text-sm font-black text-white" type="button">
            Lihat opsi upgrade
          </button>
        </div>
      </Panel>
    );
  }

  if (moduleKey === "setup") return <SetupWorkspace snapshot={snapshot} />;
  if (moduleKey === "product-radar") return <ProductRadarWorkspace snapshot={snapshot} loading={loading} />;
  if (moduleKey === "creator-intelligence") return <CreatorWorkspace snapshot={snapshot} />;
  if (moduleKey === "competitor-watchlist") return <CompetitorWorkspace snapshot={snapshot} />;
  if (moduleKey === "live-cockpit") return <LiveCockpitWorkspace />;
  if (moduleKey === "ad-radar") return <AdRadarWorkspace />;
  if (moduleKey === "campaign-planner") return <CampaignPlannerWorkspace />;
  if (moduleKey === "experiment-board") return <ExperimentBoardWorkspace snapshot={snapshot} />;
  if (moduleKey === "reports") return <ReportsWorkspace snapshot={snapshot} />;
  if (moduleKey === "alerts") return <AlertsWorkspace snapshot={snapshot} />;
  if (moduleKey === "connectors") return <ConnectorsWorkspace snapshot={snapshot} refreshSnapshot={refreshSnapshot} />;
  if (moduleKey === "settings") return <SettingsWorkspace snapshot={snapshot} />;
  return <DashboardWorkspace snapshot={snapshot} refreshSnapshot={refreshSnapshot} loading={loading} />;
}

function DashboardWorkspace({ snapshot, refreshSnapshot, loading }: { snapshot: SocialSnapshot; refreshSnapshot?: () => void; loading: boolean }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <Panel className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-600">Action-first inbox</p>
            <h2 className="mt-1 text-2xl font-black text-[#172033]">Rekomendasi hari ini</h2>
          </div>
          <button onClick={refreshSnapshot} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-black text-slate-600" type="button">
            <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
        <div className="mt-5 grid gap-3">
          {snapshot.actionCards.map((card) => (
            <article key={card.title} className="rounded-[18px] border border-slate-100 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-base font-black text-[#172033]">{card.title}</h3>
                  <p className="mt-1 text-sm font-bold leading-6 text-slate-500">{card.body}</p>
                </div>
                <span className="w-fit rounded-full bg-cyan-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-cyan-700">{card.confidence}</span>
              </div>
              <button className="mt-4 rounded-full bg-pink-600 px-4 py-2 text-xs font-black text-white" type="button">{card.actionLabel}</button>
            </article>
          ))}
        </div>
      </Panel>
      <Panel className="p-4 sm:p-5">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">Weekly plan</p>
        <h2 className="mt-1 text-2xl font-black text-[#172033]">7-day commerce loop</h2>
        <div className="mt-5 grid gap-3">
          {["Pilih 3 produk fresh", "Shortlist 6 creator micro", "Jalankan 2 script comparison", "Pantau 5 kompetitor", "Buat weekly owner report"].map((item, index) => (
            <div key={item} className="flex items-center gap-3 rounded-[16px] bg-slate-50 p-3">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-xs font-black text-pink-600 ring-1 ring-slate-100">{index + 1}</span>
              <p className="text-sm font-black text-[#172033]">{item}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function SetupWorkspace({ snapshot }: { snapshot: SocialSnapshot }) {
  const steps = ["Persona", snapshot.settings?.market ?? "Indonesia", snapshot.settings?.preset ?? "Kategori", "Model bisnis", "Harga target", "Budget test", "Data source"];
  return (
    <Panel className="p-4 sm:p-5">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-600">Zero-confusion setup</p>
      <h2 className="mt-1 text-2xl font-black text-[#172033]">Wizard 7 pertanyaan</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <div key={step} className="rounded-[16px] border border-slate-100 bg-slate-50 p-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-slate-400">Step {index + 1}</p>
            <p className="mt-1 text-sm font-black text-[#172033]">{step}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ProductRadarWorkspace({ snapshot, loading }: { snapshot: SocialSnapshot; loading: boolean }) {
  const [channel, setChannel] = useState("all");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [rows, setRows] = useState<SocialProductTrend[]>(snapshot.products);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRows(snapshot.products);
  }, [snapshot.products]);

  const refresh = useCallback(async () => {
    setFetching(true);
    setError(null);
    try {
      setRows(await fetchSocialProducts({ channel, category, status }));
    } catch (err) {
      setRows(snapshot.products);
      setError(err instanceof Error ? err.message : "Gagal memuat product radar.");
    } finally {
      setFetching(false);
    }
  }, [category, channel, snapshot.products, status]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const filteredRows = useMemo(
    () =>
      rows.filter((row) =>
        (channel === "all" || row.channel === channel) &&
        (category === "all" || row.category === category) &&
        (status === "all" || row.status === status)
      ),
    [category, channel, rows, status]
  );

  return (
    <Panel className="overflow-hidden p-0">
      <div className="border-b border-slate-100 p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-600">Product radar</p>
            <h2 className="mt-1 max-w-full text-xl font-black leading-tight text-[#172033] sm:text-2xl">Produk tren per online shop Indonesia</h2>
            <p className="mt-1 text-sm font-bold leading-6 text-slate-500">Demo seeded data untuk TikTok Shop, Shopee, Tokopedia, Lazada, dan Blibli.</p>
          </div>
          <button onClick={refresh} className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-black text-slate-600" type="button">
            <RefreshCcw className={`h-4 w-4 ${fetching || loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <FilterSelect label="Channel" value={channel} onChange={setChannel} options={channelOptions} />
          <FilterSelect label="Category" value={category} onChange={setCategory} options={categoryOptions.map((item) => ({ value: item, label: item === "all" ? "All categories" : item }))} />
          <FilterSelect label="Status" value={status} onChange={setStatus} options={["all", "watch", "scale", "review", "avoid"].map((item) => ({ value: item, label: item === "all" ? "All status" : item }))} />
        </div>
        {error ? <p className="mt-3 text-xs font-bold text-amber-700">Fallback lokal aktif: {error.slice(0, 150)}</p> : null}
      </div>
      <ProductTrendList rows={filteredRows} />
    </Panel>
  );
}

function CreatorWorkspace({ snapshot }: { snapshot: SocialSnapshot }) {
  const rows = snapshot.creators.map((item) => ({
    creator: item.handle,
    channel: item.channelLabel,
    niche: item.niche,
    fit: item.fitScore,
    gmv: `Rp${item.gmvProxy.toLocaleString("id-ID")}`,
    commission: item.commissionRange,
    note: item.note ?? item.audienceFit
  }));
  return <DataTable title="Creator shortlist" rows={rows} columns={["creator", "channel", "niche", "fit", "gmv", "commission", "note"]} />;
}

function CompetitorWorkspace({ snapshot }: { snapshot: SocialSnapshot }) {
  const rows = snapshot.competitors.map((item) => ({
    shop: item.shopName,
    channel: item.channelLabel,
    category: item.category,
    movement: item.movement,
    risk: item.risk,
    response: item.response,
    velocity: item.velocityScore
  }));
  return <DataTable title="Competitor movement" rows={rows} columns={["shop", "channel", "category", "movement", "risk", "response", "velocity"]} />;
}

function LiveCockpitWorkspace() {
  return (
    <Panel className="p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-600">Live commerce cockpit</p>
          <h2 className="mt-1 text-2xl font-black text-[#172033]">Real-time signal board</h2>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-600">Live ready</span>
      </div>
      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {liveSignals.map((signal) => (
          <div key={signal} className="rounded-[18px] border border-slate-100 bg-slate-50 p-4">
            <Circle className="h-4 w-4 fill-cyan-400 text-cyan-400" />
            <p className="mt-3 text-sm font-black leading-6 text-[#172033]">{signal}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function AdRadarWorkspace() {
  const ads = [
    { title: "Hook before-after serum", status: "Scaling", watchRate: "45%", cpa: "Rp12.000", roas: "4.2x", trend: "up" },
    { title: "CTA diskon bundling", status: "Fatigue", watchRate: "12%", cpa: "Rp45.000", roas: "1.1x", trend: "down" },
    { title: "Format split-screen demo", status: "Testing", watchRate: "38%", cpa: "Rp18.000", roas: "2.8x", trend: "up" },
    { title: "Creator unboxing POV", status: "Stable", watchRate: "28%", cpa: "Rp22.000", roas: "2.1x", trend: "up" }
  ];

  return (
    <Panel className="p-4 sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-600">Ad creative radar</p>
          <h2 className="mt-1 text-2xl font-black text-[#172033]">Creative Performance Matrix</h2>
          <p className="mt-1 text-sm font-bold leading-6 text-slate-500">Mendeteksi ad fatigue dan winning formula secara real-time dari TikTok dan Meta.</p>
        </div>
        <button className="inline-flex w-fit items-center gap-2 rounded-full bg-[#172033] px-4 py-2 text-xs font-black text-white" type="button">
          <Plus className="h-4 w-4" /> Tracker baru
        </button>
      </div>
      
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {ads.map((ad, i) => (
          <article key={i} className="rounded-[18px] border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] ${ad.status === 'Scaling' ? 'bg-emerald-50 text-emerald-600' : ad.status === 'Fatigue' ? 'bg-rose-50 text-rose-600' : 'bg-cyan-50 text-cyan-700'}`}>
                {ad.status}
              </span>
              {ad.trend === 'up' ? <TrendingUp className="h-4 w-4 text-emerald-500" /> : <TrendingUp className="h-4 w-4 text-rose-500 rotate-180" />}
            </div>
            <h3 className="mt-4 text-base font-black leading-tight text-[#172033]">{ad.title}</h3>
            
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-[12px] bg-slate-50 p-2 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">Watch rate</p>
                <p className="mt-1 text-sm font-black text-[#172033]">{ad.watchRate}</p>
              </div>
              <div className="rounded-[12px] bg-slate-50 p-2 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">ROAS</p>
                <p className="mt-1 text-sm font-black text-[#172033]">{ad.roas}</p>
              </div>
            </div>
            
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-xs font-bold text-slate-500">CPA: {ad.cpa}</span>
              <button className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-pink-50 hover:text-pink-600" type="button"><PlayCircle className="h-4 w-4" /></button>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}

function CampaignPlannerWorkspace() {
  const campaigns = [
    { name: "Serum mini test", target: "ROAS 2.5x", budget: "Rp1.500.000", creators: 3, status: "Active", progress: 65 },
    { name: "Payday Mega Sale", target: "GMV Rp50jt", budget: "Rp15.000.000", creators: 12, status: "Draft", progress: 0 },
    { name: "Portable blender demo", target: "CPA < Rp38k", budget: "Rp5.000.000", creators: 5, status: "Completed", progress: 100 }
  ];

  return (
    <Panel className="p-4 sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-600">Campaign planner</p>
          <h2 className="mt-1 text-2xl font-black text-[#172033]">Marketing Action Plan</h2>
          <p className="mt-1 text-sm font-bold leading-6 text-slate-500">Rencanakan budget, target metric, dan eksekusi creator untuk campaign terpadu.</p>
        </div>
        <button className="inline-flex w-fit items-center gap-2 rounded-full bg-pink-600 px-5 py-2.5 text-sm font-black text-white" type="button">
          <Plus className="h-4 w-4" /> Buat Campaign
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {campaigns.map((camp, i) => (
          <article key={i} className="flex flex-col gap-4 rounded-[18px] border border-slate-100 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4 md:w-1/3">
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-[16px] ${camp.status === 'Active' ? 'bg-pink-50 text-pink-600' : camp.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                <Calendar className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base font-black text-[#172033]">{camp.name}</h3>
                <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.1em] ${camp.status === 'Active' ? 'bg-pink-100 text-pink-700' : camp.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {camp.status}
                </span>
              </div>
            </div>
            
            <div className="flex flex-1 items-center gap-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">Budget</p>
                <p className="mt-1 text-sm font-black text-[#172033]">{camp.budget}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">Target</p>
                <p className="mt-1 text-sm font-black text-[#172033]">{camp.target}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">Creators</p>
                <p className="mt-1 text-sm font-black text-[#172033]">{camp.creators} orang</p>
              </div>
            </div>

            <div className="flex items-center gap-3 md:w-1/4">
              <div className="flex-1">
                <div className="flex items-center justify-between text-[10px] font-black text-slate-500">
                  <span>Progress</span>
                  <span>{camp.progress}%</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${camp.status === 'Active' ? 'bg-pink-500' : 'bg-emerald-500'}`} style={{ width: `${camp.progress}%` }} />
                </div>
              </div>
              <button className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-pink-600" type="button">
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}

function ExperimentBoardWorkspace({ snapshot }: { snapshot: SocialSnapshot }) {
  return (
    <Panel className="p-4 sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-600">Experiment board</p>
          <h2 className="mt-1 text-2xl font-black text-[#172033]">A/B Testing & Insights</h2>
        </div>
        <button className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-600 shadow-sm" type="button">
          <Plus className="h-4 w-4" /> New Experiment
        </button>
      </div>
      
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {snapshot.experiments.map((exp, index) => (
          <article key={index} className="rounded-[20px] border border-slate-100 bg-slate-50 p-5">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-black leading-tight text-[#172033]">{exp.title}</h3>
              <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] ${exp.status === 'running' ? 'bg-cyan-100 text-cyan-700' : exp.status === 'concluded' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                {exp.status}
              </span>
            </div>
            
            <div className="mt-4 rounded-[14px] bg-white p-3 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">Target Metric</p>
              <p className="mt-1 text-base font-black text-[#172033]">{exp.targetMetric ?? "TBD"}</p>
            </div>
            
            <div className="mt-4 text-sm font-bold leading-6 text-slate-600">
              <p><span className="mr-2 inline-block h-2 w-2 rounded-full bg-pink-500"></span><strong className="text-[#172033]">Variant A:</strong> Control group / Baseline</p>
              <p className="mt-1"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-cyan-500"></span><strong className="text-[#172033]">Variant B:</strong> Treatment group</p>
            </div>
            
            {exp.status === 'concluded' && (
              <div className="mt-4 flex items-center gap-2 rounded-[12px] bg-emerald-50 p-3 text-sm font-bold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" /> Variant B memenangkan {exp.targetMetric} dengan uplift 14%.
              </div>
            )}
            {exp.status === 'running' && (
              <div className="mt-4 flex items-center gap-2 rounded-[12px] bg-cyan-50 p-3 text-sm font-bold text-cyan-700">
                <RefreshCcw className="h-4 w-4 animate-spin" /> Mengumpulkan data statistik (confidence 82%).
              </div>
            )}
          </article>
        ))}
      </div>
    </Panel>
  );
}

function ReportsWorkspace({ snapshot }: { snapshot: SocialSnapshot }) {
  return (
    <Panel className="p-4 sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-600">Automated reports</p>
          <h2 className="mt-1 text-2xl font-black text-[#172033]">Client & Management Reports</h2>
          <p className="mt-1 text-sm font-bold leading-6 text-slate-500">Generate report komprehensif dalam satu klik untuk stakeholder.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-black text-slate-600" type="button">
            <Share2 className="h-4 w-4" /> Share Link
          </button>
          <button className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-4 py-2 text-xs font-black text-white" type="button">
            <Download className="h-4 w-4" /> Export PDF
          </button>
        </div>
      </div>
      
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {snapshot.reports.map((report, idx) => (
          <article key={idx} className="flex flex-col justify-between rounded-[20px] border border-slate-100 bg-white p-5 shadow-sm">
            <div>
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-pink-50 text-pink-600">
                  <BarChart className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black text-[#172033]">{report.title}</h3>
              </div>
              <p className="mt-4 text-sm font-bold leading-6 text-slate-500">{report.summary}</p>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {report.sections.map((section, sidx) => (
                  <span key={sidx} className="rounded-[10px] bg-slate-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">
                    {section}
                  </span>
                ))}
              </div>
            </div>
            
            <button className="mt-6 w-full rounded-[14px] bg-slate-100 py-2.5 text-xs font-black text-slate-600 transition hover:bg-slate-200" type="button">
              Preview Report
            </button>
          </article>
        ))}
      </div>
    </Panel>
  );
}

function AlertsWorkspace({ snapshot }: { snapshot: SocialSnapshot }) {
  return (
    <Panel className="p-4 sm:p-5">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-600">Alert center</p>
      <h2 className="mt-1 text-2xl font-black text-[#172033]">Trend, kompetitor, dan margin warning</h2>
      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {snapshot.alerts.map((alert) => (
          <article key={alert.id} className="rounded-[18px] border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <span className={`grid h-10 w-10 place-items-center rounded-[14px] ${alert.severity === "high" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"}`}>
                <AlertTriangle className="h-5 w-5" />
              </span>
              <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">{alert.status}</span>
            </div>
            <h3 className="mt-4 text-base font-black text-[#172033]">{alert.title}</h3>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-500">{alert.body}</p>
            <p className="mt-3 text-xs font-black text-pink-600">{alert.channelLabel} · {alert.rule}</p>
          </article>
        ))}
      </div>
    </Panel>
  );
}

function ConnectorsWorkspace({ snapshot, refreshSnapshot }: { snapshot: SocialSnapshot; refreshSnapshot?: () => void }) {
  return (
    <Panel className="p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-600">Data connectors</p>
          <h2 className="mt-1 text-2xl font-black text-[#172033]">Kanal online shop Indonesia</h2>
          <p className="mt-1 text-sm font-bold leading-6 text-slate-500">Connector live disiapkan, tetapi data saat ini ditandai sebagai demo seeded.</p>
        </div>
        <button onClick={refreshSnapshot} className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-black text-slate-600" type="button">
          <RefreshCcw className="h-4 w-4" /> Refresh
        </button>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {snapshot.connectors.map((connector) => <ConnectorCard key={connector.id} connector={connector} />)}
      </div>
    </Panel>
  );
}

function SettingsWorkspace({ snapshot }: { snapshot: SocialSnapshot }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <Panel className="p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <Settings2 className="h-6 w-6 text-pink-600" />
          <h2 className="text-2xl font-black text-[#172033]">Workspace settings</h2>
        </div>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-500">Konfigurasi environment dan data source untuk social commerce engine.</p>
        
        <div className="mt-6 grid gap-4">
          <label className="block rounded-[16px] border border-slate-100 bg-slate-50 p-4">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Target Market</span>
            <select className="mt-2 w-full bg-transparent text-base font-black text-[#172033] outline-none">
              <option>{snapshot.settings?.market ?? "Indonesia"}</option>
              <option>Malaysia</option>
              <option>Singapore</option>
            </select>
          </label>
          <label className="block rounded-[16px] border border-slate-100 bg-slate-50 p-4">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Industry Preset</span>
            <select className="mt-2 w-full bg-transparent text-base font-black text-[#172033] outline-none">
              <option>{snapshot.settings?.preset ?? "Beauty & skincare"}</option>
              <option>Fashion & Apparel</option>
              <option>Electronics</option>
            </select>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-[16px] border border-slate-100 bg-slate-50 p-4">
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Data Mode</span>
              <p className="mt-2 text-sm font-black text-[#172033]">{snapshot.settings?.dataMode ?? snapshot.dataMode}</p>
            </div>
            <div className="rounded-[16px] border border-slate-100 bg-slate-50 p-4">
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Refresh Rate</span>
              <p className="mt-2 text-sm font-black text-[#172033]">{snapshot.settings?.refreshMode ?? "Hourly"}</p>
            </div>
          </div>
        </div>
      </Panel>
      
      <div className="grid gap-4">
        <Panel className="p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-cyan-600" />
            <h3 className="text-lg font-black text-[#172033]">Role Permissions</h3>
          </div>
          <div className="mt-4 grid gap-2">
            {["Owner", "Analyst", "Campaign Manager", "Client Viewer"].map(role => (
              <div key={role} className="flex items-center justify-between rounded-[12px] bg-slate-50 px-4 py-3">
                <span className="text-sm font-bold text-[#172033]">{role}</span>
                <button className="text-xs font-black text-pink-600 hover:underline">Edit</button>
              </div>
            ))}
          </div>
        </Panel>
        
        <Panel className="p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-black text-[#172033]">Notification Preferences</h3>
          </div>
          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-pink-600" />
              <span className="text-sm font-bold text-slate-600">Alert margin produk drop</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-pink-600" />
              <span className="text-sm font-bold text-slate-600">Daily creator performance</span>
            </label>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function DataTable({ title, rows, columns }: { title: string; rows: Array<Record<string, string | number>>; columns: string[] }) {
  const tableRows = rows.map((row) =>
    Object.fromEntries(columns.map((column) => [column.replace(/-/g, " "), row[column] ?? "-"])) as Record<string, string | number>
  );

  return (
    <Panel className="overflow-hidden p-0">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-600">Intelligence table</p>
          <h2 className="mt-1 text-2xl font-black text-[#172033]">{title}</h2>
        </div>
        <button className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-black text-slate-600" type="button">
          <RefreshCcw className="h-4 w-4" /> Refresh
        </button>
      </div>
      <div className="hidden md:block">
        <SimpleTable rows={tableRows} />
      </div>
      <div className="grid gap-3 p-4 md:hidden">
        {tableRows.map((row, index) => (
          <article key={index} className="rounded-[16px] border border-slate-100 bg-white p-4">
            {Object.entries(row).map(([key, value], itemIndex) => (
              <div key={key} className={itemIndex === 0 ? "" : "mt-3 border-t border-slate-100 pt-3"}>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">{key}</p>
                <p className="mt-1 break-words text-sm font-black text-[#172033]">{value}</p>
              </div>
            ))}
          </article>
        ))}
      </div>
    </Panel>
  );
}

function SimpleBoard({ title, items, caption }: { title: string; items: string[]; caption?: string }) {
  return (
    <Panel className="p-4 sm:p-5">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-600">Workspace</p>
      <h2 className="mt-1 text-2xl font-black text-[#172033]">{title}</h2>
      {caption ? <p className="mt-2 text-sm font-bold leading-6 text-slate-500">{caption}</p> : null}
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <div key={item} className="flex items-center gap-3 rounded-[16px] border border-slate-100 bg-slate-50 p-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[12px] bg-white text-pink-600 shadow-sm">
              <Plus className="h-4 w-4" />
            </span>
            <p className="text-sm font-black text-[#172033]">{item}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<{ value: string; label: string }> }) {
  return (
    <label className="block rounded-[16px] border border-slate-100 bg-slate-50 p-3">
      <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
        <SlidersHorizontal className="h-3.5 w-3.5" /> {label}
      </span>
      <RoundedSelect value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full bg-transparent text-sm font-black text-[#172033] outline-none">
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </RoundedSelect>
    </label>
  );
}

function ProductTrendList({ rows }: { rows: SocialProductTrend[] }) {
  const tableRows = rows.map((row) => ({
    product: row.productName,
    channel: row.channelLabel,
    category: row.category,
    freshness: row.freshnessScore,
    saturation: row.saturationLevel,
    confidence: row.confidenceScore,
    margin: `${row.marginEstimate}%`,
    price: row.priceRange,
    signal: row.signal,
    action: row.recommendedAction
  }));

  return (
    <>
      <div className="hidden md:block p-4">
        <SimpleTable rows={tableRows} />
      </div>
      <div className="grid gap-3 p-4 md:hidden">
        {rows.map((row) => (
          <article key={row.id} className="rounded-[18px] border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-pink-600">{row.channelLabel} · {row.category}</p>
                <h3 className="mt-1 text-base font-black leading-5 text-[#172033]">{row.productName}</h3>
              </div>
              <span className="shrink-0 rounded-full bg-cyan-50 px-2.5 py-1 text-[10px] font-black text-cyan-700">#{row.marketplaceRank ?? "-"}</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <MiniStat label="Fresh" value={row.freshnessScore} />
              <MiniStat label="Conf." value={row.confidenceScore} />
              <MiniStat label="Margin" value={`${row.marginEstimate}%`} />
            </div>
            <p className="mt-3 text-sm font-bold leading-6 text-slate-500">{row.signal}</p>
            <div className="mt-3 rounded-[14px] bg-slate-50 p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Recommended action</p>
              <p className="mt-1 text-sm font-black leading-5 text-[#172033]">{row.recommendedAction}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[14px] bg-slate-50 p-2">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-black text-[#172033]">{value}</p>
    </div>
  );
}

function ConnectorCard({ connector }: { connector: SocialConnector }) {
  const statusTone =
    connector.status === "active" ? "bg-emerald-50 text-emerald-600" :
    connector.status === "queued" ? "bg-cyan-50 text-cyan-700" :
    connector.status === "needs_credentials" ? "bg-amber-50 text-amber-700" :
    "bg-slate-100 text-slate-500";

  return (
    <article className="rounded-[18px] border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-[14px] bg-white text-pink-600 shadow-sm">
          <CheckCircle2 className="h-5 w-5" />
        </span>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] ${statusTone}`}>
          {connectorStatusLabel(connector.status)}
        </span>
      </div>
      <h3 className="mt-4 text-base font-black text-[#172033]">{connector.label}</h3>
      <p className="mt-2 text-xs font-bold leading-5 text-slate-500">{connector.notes ?? connector.credentialHint ?? "Connector ready."}</p>
      <p className="mt-3 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">{connector.lastSyncAt ? "Demo sync available" : "Official credential required"}</p>
    </article>
  );
}


