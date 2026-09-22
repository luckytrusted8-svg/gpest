"use client";

import { useState } from "react";
import {
  Building2,
  Users2,
  CalendarCheck2,
  Truck,
  MapPin,
  MessageSquareWarning,
  FileText,
  Clock,
  Radio,
  Database,
  Server,
  LayoutDashboard,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const modules = [
    {
      id: 1,
      name: "Onboarding Tenant",
      tag: "Multi-Tenant SaaS",
      desc: "Pendaftaran perusahaan pest control, isolasi database per tenant, profil perusahaan, dan konfigurasi master layanan.",
      icon: Building2,
      endpoints: ["POST /api/v1/tenants/register", "POST /api/v1/tenants/invitations"],
      color: "from-blue-500/20 to-cyan-500/20 border-cyan-500/30 text-cyan-400",
    },
    {
      id: 2,
      name: "CRM & Pipeline Leads",
      tag: "Sales & Conversion",
      desc: "Manajemen siklus prospek Cold -> Warm -> Hot -> Won, survey lokasi, dan auto-konversi menjadi customer & kontrak.",
      icon: Users2,
      endpoints: ["POST /api/v1/leads", "POST /api/v1/leads/:id/convert"],
      color: "from-amber-500/20 to-orange-500/20 border-orange-500/30 text-orange-400",
    },
    {
      id: 3,
      name: "Task Scheduling",
      tag: "Contract Engine",
      desc: "Sistem generate tugas otomatis berbasis frekuensi kontrak (Weekly, Bi-weekly, Monthly) dan assignment teknisi.",
      icon: CalendarCheck2,
      endpoints: ["POST /api/v1/contracts", "PATCH /api/v1/tasks/:id/assign"],
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400",
    },
    {
      id: 4,
      name: "Field Work Execution",
      tag: "Mobile App Workflow",
      desc: "Absen GPS, live trip tracking, validasi geofencing lokasi, dynamic form work report, before/after photo, & signature PIC.",
      icon: Truck,
      endpoints: ["POST /api/v1/tasks/:id/check-in", "POST /api/v1/tasks/:id/work-report"],
      color: "from-violet-500/20 to-purple-500/20 border-purple-500/30 text-purple-400",
    },
    {
      id: 5,
      name: "Live Tracking & Monitoring",
      tag: "WebSocket Real-time",
      desc: "Peta monitoring posisi seluruh teknisi secara live via Socket.io, breadcrumbs rute perjalanan, dan alert geofence breach.",
      icon: MapPin,
      endpoints: ["WS /tracking (tech:live_position)", "GET /api/v1/monitoring/technicians/status"],
      color: "from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-400",
    },
    {
      id: 6,
      name: "Customer Ticketing",
      tag: "Complaint & Warranty",
      desc: "Portal komplain customer jika hama muncul kembali, otomatis dispatch tiket menjadi kunjungan garansi untuk teknisi.",
      icon: MessageSquareWarning,
      endpoints: ["POST /api/v1/tickets", "POST /api/v1/tickets/:id/dispatch-task"],
      color: "from-yellow-500/20 to-amber-500/20 border-yellow-500/30 text-yellow-400",
    },
    {
      id: 7,
      name: "Reporting & Invoicing",
      tag: "Puppeteer PDF Engine",
      desc: "Generate PDF Berita Acara Pekerjaan bersertifikat secara otomatis, kalkulasi chemical dosage, dan invoicing berkala.",
      icon: FileText,
      endpoints: ["GET /api/v1/reports/:id/pdf", "POST /api/v1/invoices"],
      color: "from-indigo-500/20 to-blue-500/20 border-indigo-500/30 text-indigo-400",
    },
    {
      id: 8,
      name: "HR & Attendance",
      tag: "Shift & Cuti",
      desc: "Pencatatan jam kerja clock-in/out dengan GPS & selfie, pengajuan cuti teknisi, dan rekapitulasi kehadiran bulanan.",
      icon: Clock,
      endpoints: ["POST /api/v1/attendance/check-in", "POST /api/v1/leaves/request"],
      color: "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="h-6 w-6 text-slate-950" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                G-PEST SYSTEM
              </span>
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                v2.0 (NestJS + Next.js)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>MySQL 8 Laragon Connected</span>
            </div>
            <a
              href="http://localhost:4000/api/v1"
              target="_blank"
              rel="noreferrer"
              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 flex items-center gap-1.5 transition-all"
            >
              <Server className="h-3.5 w-3.5" />
              API Docs
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full flex flex-col gap-12">
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950 p-8 md:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl flex flex-col gap-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 w-fit">
              <Zap className="h-3.5 w-3.5 text-emerald-400" />
              Arsitektur Baru Aktif: Decoupled Full-Stack SaaS
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Pest Control Management &{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Field Service Intelligence
              </span>
            </h1>

            <p className="text-slate-400 text-base md:text-lg leading-relaxed">
              Platform ERP & Field Operation multi-tenant terpadu dengan Next.js 15 App Router,
              NestJS Core API, Prisma ORM, Socket.io live tracking, dan Puppeteer automated PDF reporting.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-mono">Frontend</span>
                <span className="text-sm font-semibold text-slate-200">Next.js 15 (App Router)</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-mono">Backend API</span>
                <span className="text-sm font-semibold text-slate-200">NestJS 11 (Express)</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-mono">Database & ORM</span>
                <span className="text-sm font-semibold text-slate-200">MySQL 8 + Prisma</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-mono">Real-Time</span>
                <span className="text-sm font-semibold text-slate-200">Socket.io Gateway</span>
              </div>
            </div>
          </div>
        </section>

        {/* 8 Workflows Grid */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5 text-emerald-400" />
                8 Alur Kerja Sistem (End-to-End Workflows)
              </h2>
              <p className="text-sm text-slate-400">
                Pilih modul untuk melihat rincian endpoint API dan kontrak operasionalnya.
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono w-fit">
              8 of 8 Modules Mapped
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {modules.map((m, idx) => {
              const Icon = m.icon;
              const isSelected = activeTab === idx;
              return (
                <div
                  key={m.id}
                  onClick={() => setActiveTab(idx)}
                  className={`cursor-pointer rounded-2xl p-5 border transition-all flex flex-col justify-between gap-4 ${
                    isSelected
                      ? "bg-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30"
                      : "bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/70 hover:border-slate-700"
                  }`}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl border ${m.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        Flow 0{m.id}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-200 text-sm">{m.name}</h3>
                      <span className="text-xs text-emerald-400/80 font-medium">{m.tag}</span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {m.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span>{m.endpoints.length} endpoints</span>
                    <ChevronRight className={`h-4 w-4 transition-transform ${isSelected ? "text-emerald-400 translate-x-1" : ""}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Module Detail Banner */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl border ${modules[activeTab].color}`}>
                {(() => {
                  const ActiveIcon = modules[activeTab].icon;
                  return <ActiveIcon className="h-6 w-6" />;
                })()}
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-base">
                    Alur 0{modules[activeTab].id}: {modules[activeTab].name}
                  </h4>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {modules[activeTab].tag}
                  </span>
                </div>
                <p className="text-sm text-slate-400 max-w-2xl">
                  {modules[activeTab].desc}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto">
              <span className="text-xs font-mono text-slate-500 uppercase">Registered Endpoints:</span>
              <div className="flex flex-wrap gap-2">
                {modules[activeTab].endpoints.map((ep, i) => (
                  <code key={i} className="text-xs px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-emerald-300 font-mono">
                    {ep}
                  </code>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Architecture & Next Steps */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-emerald-400">
              <Database className="h-5 w-5" />
              <h4 className="font-semibold text-slate-200">Database & Migrasi</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Prisma Client telah di-generate dengan 12 entitas inti MySQL 8 Laragon.
              Jalankan <code className="text-emerald-300 font-mono">npx prisma migrate dev</code> di folder backend saat Laragon siap.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-cyan-400">
              <Radio className="h-5 w-5" />
              <h4 className="font-semibold text-slate-200">Live GPS & Geofencing</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Socket.io Gateway <code className="text-cyan-300 font-mono">/tracking</code> siap menangani stream koordinat teknisi, deviasi jarak 100m, dan auto-alert.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-purple-400">
              <CheckCircle2 className="h-5 w-5" />
              <h4 className="font-semibold text-slate-200">Single Dev Command</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cukup jalankan <code className="text-purple-300 font-mono">npm run dev</code> dari root folder untuk menyalakan Backend (port 4000) dan Frontend (port 3000) secara otomatis.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-600">
        G-PEST Multi-tenant Pest Control Management System &copy; 2026. Built with Next.js, NestJS, and MySQL.
      </footer>
    </div>
  );
}
