"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck2,
  MapPin,
  MessageSquareWarning,
  Clock,
  Settings,
  ShieldCheck,
  Server,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileCheck,
  Smartphone,
  UserCheck,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import { LiveTrackingMap } from "@/components/maps/LiveTrackingMap";
import { TechnicianWorkView } from "@/components/technician/TechnicianWorkView";
import { CrmPipeline } from "@/components/crm/CrmPipeline";
import { CustomerPortalView } from "@/components/customer/CustomerPortalView";
import { api } from "@/lib/api";

type RoleMode = "ADMIN" | "TECHNICIAN" | "CUSTOMER";
type AdminTab = "DASHBOARD" | "CRM" | "CUSTOMERS" | "WORK_ORDERS" | "TRACKING" | "TICKETS" | "HR";

export default function AppHome() {
  const [role, setRole] = useState<RoleMode>("ADMIN");
  const [adminTab, setAdminTab] = useState<AdminTab>("DASHBOARD");

  // Live state from backend
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBackendData = async () => {
    setIsLoading(true);
    try {
      const [dashRes, custRes, taskRes, tickRes] = await Promise.all([
        api.get("/analytics/dashboard").catch(() => null),
        api.get("/customers").catch(() => null),
        api.get("/tasks").catch(() => null),
        api.get("/tickets").catch(() => null),
      ]);

      if (dashRes?.data) setDashboardData(dashRes.data);
      if (custRes?.data) setCustomers(custRes.data);
      if (taskRes?.data) setTasks(taskRes.data);
      if (tickRes?.data) setTickets(tickRes.data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBackendData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              <ShieldCheck className="h-6 w-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  G-PEST
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  FIELD SERVICE ERP
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Pest Control Management Platform</p>
            </div>
          </div>

          {/* Role Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => setRole("ADMIN")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                role === "ADMIN"
                  ? "bg-slate-800 text-emerald-400 border border-slate-700 shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Admin Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => setRole("TECHNICIAN")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                role === "TECHNICIAN"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Teknisi (Mobile)</span>
            </button>

            <button
              type="button"
              onClick={() => setRole("CUSTOMER")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                role === "CUSTOMER"
                  ? "bg-slate-800 text-cyan-400 border border-slate-700 shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Customer Portal</span>
            </button>
          </div>

          {/* Live System Indicator */}
          <div className="hidden lg:flex items-center gap-3 text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>MySQL 8 Laragon</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col">
        {/* VIEW 1: FIELD TECHNICIAN MOBILE */}
        {role === "TECHNICIAN" && (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="mb-4 text-center">
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                Field Service Mobile Simulator
              </span>
              <h2 className="text-xl font-bold text-white mt-1">Alur Kerja Teknisi Lapangan (Mobile App)</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-0.5">
                Mencakup GPS Check-in, formulir dinamis inspeksi hama, pencatatan obat kimia, dan tanda tangan digital pelanggan.
              </p>
            </div>
            <TechnicianWorkView />
          </div>
        )}

        {/* VIEW 2: CUSTOMER PORTAL */}
        {role === "CUSTOMER" && <CustomerPortalView />}

        {/* VIEW 3: ADMIN & SUPERVISOR DASHBOARD */}
        {role === "ADMIN" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-3 flex flex-col gap-1.5 p-3 rounded-3xl bg-slate-900/50 border border-slate-800/80 h-fit">
              <div className="px-3 py-2 text-[11px] font-mono uppercase tracking-wider text-slate-500">
                Menu Utama (PRD Scope)
              </div>

              {[
                { key: "DASHBOARD", label: "Dashboard Ringkasan", icon: LayoutDashboard },
                { key: "TRACKING", label: "Live GPS Tracking", icon: MapPin, badge: "Live" },
                { key: "WORK_ORDERS", label: "Work Orders & Tugas", icon: CalendarCheck2 },
                { key: "CRM", label: "CRM & Pipeline Leads", icon: Users },
                { key: "CUSTOMERS", label: "Pelanggan & Sites", icon: Building2 },
                { key: "TICKETS", label: "Tiket & Komplain", icon: MessageSquareWarning },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = adminTab === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setAdminTab(item.key as AdminTab)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 ${isActive ? "text-emerald-400" : "text-slate-500"}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="pt-4 mt-2 border-t border-slate-800/80 px-3 flex flex-col gap-2 text-xs text-slate-500">
                <span className="text-[10px] font-mono uppercase">Quick Actions</span>
                <button
                  type="button"
                  onClick={fetchBackendData}
                  className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh Data API
                </button>
              </div>
            </aside>

            {/* Content Area */}
            <main className="lg:col-span-9 flex flex-col gap-6">
              {/* Tab: Dashboard Summary */}
              {adminTab === "DASHBOARD" && (
                <div className="flex flex-col gap-6">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col gap-1">
                      <span className="text-xs text-slate-400">Total Customer</span>
                      <span className="text-2xl font-bold font-mono text-white">
                        {dashboardData?.kpi?.totalCustomers ?? (customers.length || 1)}
                      </span>
                      <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                        <TrendingUp className="h-3 w-3" /> Aktif Terlayani
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col gap-1">
                      <span className="text-xs text-slate-400">Kontrak Berjalan</span>
                      <span className="text-2xl font-bold font-mono text-cyan-400">
                        {dashboardData?.kpi?.activeContracts ?? 1}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">SLA Bulanan</span>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col gap-1">
                      <span className="text-xs text-slate-400">Pekerjaan Selesai</span>
                      <span className="text-2xl font-bold font-mono text-emerald-400">
                        {dashboardData?.kpi?.completedTasks ?? 1}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">Berita Acara Ready</span>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col gap-1">
                      <span className="text-xs text-slate-400">Teknisi Lapangan</span>
                      <span className="text-2xl font-bold font-mono text-purple-400">
                        {dashboardData?.kpi?.activeTechnicians ?? 1}
                      </span>
                      <span className="text-[11px] text-emerald-400 font-mono">1 Online GPS</span>
                    </div>
                  </div>

                  {/* Live Tracking Map Preview on Dashboard */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-emerald-400" />
                        Pemantauan GPS Teknisi Lapangan Real-time
                      </h3>
                      <button
                        type="button"
                        onClick={() => setAdminTab("TRACKING")}
                        className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        Buka Peta Penuh <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <LiveTrackingMap />
                  </div>

                  {/* Recent Work Orders & CRM Preview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Work Orders List */}
                    <div className="p-5 rounded-3xl border border-slate-800 bg-slate-900/50 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-white flex items-center gap-2">
                          <CalendarCheck2 className="h-4 w-4 text-cyan-400" />
                          Work Orders Terbaru
                        </h4>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                          Hari Ini
                        </span>
                      </div>

                      <div className="flex flex-col gap-2.5">
                        {(tasks.length > 0 ? tasks : [
                          {
                            taskNumber: "TSK-2026-0001",
                            customer: { name: "Resto Sedap Rasa" },
                            customerLocation: { branchName: "Cabang Senopati" },
                            status: "ASSIGNED",
                            timeSlot: "09:00 - 11:00 WIB",
                          },
                        ]).map((t: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold text-emerald-400">{t.taskNumber}</span>
                                <span className="text-xs font-semibold text-slate-200">{t.customer?.name}</span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {t.customerLocation?.branchName} &bull; {t.timeSlot}
                              </p>
                            </div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold">
                              {t.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Master Services Catalog */}
                    <div className="p-5 rounded-3xl border border-slate-800 bg-slate-900/50 flex flex-col gap-3">
                      <h4 className="font-bold text-sm text-white flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-emerald-400" />
                        Layanan Pest Control Terdaftar
                      </h4>

                      <div className="flex flex-col gap-2">
                        {[
                          { name: "General Pest Control", desc: "Semut, Kecoa, Lalat", code: "GENERAL_PEST", price: "Rp 750.000" },
                          { name: "Termite Control", desc: "Barrier & Baiting Rayap", code: "TERMITE_CONTROL", price: "Rp 3.500.000" },
                          { name: "Rodent Management", desc: "Bait Station & Trapping Tikus", code: "RODENT_CONTROL", price: "Rp 900.000" },
                          { name: "Fumigasi Gudang", desc: "Standard Ekspor / Karantina", code: "FUMIGATION", price: "Rp 5.000.000" },
                        ].map((s, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                            <div>
                              <span className="font-semibold text-slate-200">{s.name}</span>
                              <span className="text-slate-500 text-[11px] block">{s.desc}</span>
                            </div>
                            <span className="font-mono text-emerald-400 font-semibold">{s.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Full Live GPS Tracking */}
              {adminTab === "TRACKING" && (
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-emerald-400" />
                      Live Technician Location & Geofencing Radar
                    </h2>
                    <p className="text-xs text-slate-400">
                      Pantau pergerakan teknisi di lapangan secara real-time melalui WebSocket dan deteksi radius geofence lokasi tugas.
                    </p>
                  </div>
                  <LiveTrackingMap />
                </div>
              )}

              {/* Tab: CRM Pipeline */}
              {adminTab === "CRM" && <CrmPipeline />}

              {/* Tab: Customers & Sites */}
              {adminTab === "CUSTOMERS" && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-emerald-400" />
                        Daftar Pelanggan & Multi-Site Cabang
                      </h2>
                      <p className="text-xs text-slate-400">
                        Data pelanggan terpusat dengan multi-lokasi cabang, koordinat GPS, dan radius geofence.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(customers.length > 0 ? customers : [
                      {
                        name: "Resto Sedap Rasa",
                        companyName: "PT Kuliner Nusantara",
                        phone: "08119876543",
                        email: "manager@sedaprasa.co.id",
                        locations: [
                          {
                            branchName: "Cabang Senopati",
                            address: "Jl. Senopati No. 12, Kebayoran Baru, Jakarta Selatan",
                            latitude: -6.2297,
                            longitude: 106.8075,
                            geofenceRadius: 100,
                          },
                        ],
                      },
                    ]).map((c: any, i: number) => (
                      <div key={i} className="p-5 rounded-3xl border border-slate-800 bg-slate-900/60 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-base text-white">{c.name}</h3>
                          <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                            {c.companyName || "Corporate"}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 font-mono flex flex-col gap-1">
                          <span>Telp: {c.phone}</span>
                          <span>Email: {c.email || "-"}</span>
                        </div>

                        <div className="pt-3 border-t border-slate-800 flex flex-col gap-1.5">
                          <span className="text-xs font-semibold text-slate-300">Lokasi / Sites ({c.locations?.length || 0}):</span>
                          {c.locations?.map((loc: any, li: number) => (
                            <div key={li} className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                              <span className="font-medium text-slate-200">{loc.branchName}</span>
                              <span className="text-[11px] font-mono text-emerald-400">
                                Geofence: {loc.geofenceRadius}m
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: Work Orders */}
              {adminTab === "WORK_ORDERS" && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <CalendarCheck2 className="h-5 w-5 text-emerald-400" />
                        Manajemen Work Orders & Penugasan
                      </h2>
                      <p className="text-xs text-slate-400">
                        Daftar jadwal inspeksi dan treatment lapangan beserta status pengerjaannya.
                      </p>
                    </div>
                  </div>

                  <div className="p-5 rounded-3xl border border-slate-800 bg-slate-900/50 flex flex-col gap-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono pb-2 border-b border-slate-800">
                      <span>No. WO</span>
                      <span>Customer & Cabang</span>
                      <span>Teknisi</span>
                      <span>Status</span>
                    </div>

                    {(tasks.length > 0 ? tasks : [
                      {
                        taskNumber: "TSK-2026-0001",
                        customer: { name: "Resto Sedap Rasa" },
                        customerLocation: { branchName: "Cabang Senopati" },
                        technician: { name: "Rian Pratama" },
                        status: "ASSIGNED",
                      },
                    ]).map((t: any, i: number) => (
                      <div key={i} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-emerald-400">{t.taskNumber}</span>
                        <div>
                          <span className="font-semibold text-slate-200 block">{t.customer?.name}</span>
                          <span className="text-slate-400 text-[11px]">{t.customerLocation?.branchName}</span>
                        </div>
                        <span className="text-slate-300">{t.technician?.name || "Belum di-assign"}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold font-mono text-[11px]">
                          {t.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: Tickets */}
              {adminTab === "TICKETS" && (
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <MessageSquareWarning className="h-5 w-5 text-rose-400" />
                      Customer Complaints & Warranty Dispatch
                    </h2>
                    <p className="text-xs text-slate-400">
                      Tiket keluhan hama dari customer portal yang dapat langsung di-dispatch menjadi tugas re-treatment garansi.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="p-5 rounded-3xl border border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-amber-400">TCK-2026-0001</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                            HIGH PRIORITY
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-white">Rayap muncul pada kusen pintu gudang</h4>
                        <p className="text-xs text-slate-400">
                          Customer: Resto Sedap Rasa (Cabang Senopati)
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => alert("Tugas garansi berhasil di-dispatch ke Teknisi Rian Pratama!")}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:opacity-95 shrink-0 shadow-lg shadow-emerald-500/20"
                      >
                        Dispatch Teknisi (Garansi)
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-600">
        G-PEST Field Service Management System &copy; 2026. Built with Next.js, NestJS, and MySQL Laragon.
      </footer>
    </div>
  );
}
