"use client";

import React, { useState } from "react";
import { Shield, FileText, Calendar, MessageSquare, Plus, Download, CheckCircle, Clock, MapPin } from "lucide-react";
import { api } from "@/lib/api";

export function CustomerPortalView() {
  const [activeTab, setActiveTab] = useState<"CONTRACTS" | "SCHEDULES" | "REPORTS" | "TICKETS">("CONTRACTS");
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const customer = {
    name: "Resto Sedap Rasa",
    pic: "Pak Doni (Store Manager)",
    phone: "08119876543",
    email: "manager@sedaprasa.co.id",
    branch: "Cabang Senopati (Jl. Senopati No. 12, Jakarta Selatan)",
  };

  const contracts = [
    {
      contractNumber: "CTR-2026-0012",
      service: "General Pest & Rodent Management",
      frequency: "Bulanan (Monthly Routine)",
      status: "AKTIF",
      period: "01 Jan 2026 - 31 Des 2026",
      warrantyStatus: "Garansi Aktif (30 Hari Pasca Treatment)",
    },
  ];

  const upcomingSchedules = [
    {
      date: "25 September 2026",
      time: "09:00 - 11:00 WIB",
      service: "Treatment Rutin Kecoa & Semut Area Kitchen",
      technician: "Rian Pratama",
      status: "TERJADWAL",
    },
    {
      date: "09 Oktober 2026",
      time: "09:00 - 11:00 WIB",
      service: "Penggantian Umpan Rodent Box Gudang",
      technician: "Ahmad Teknisi",
      status: "TERJADWAL",
    },
  ];

  const workReports = [
    {
      reportNumber: "WR-2026-0001",
      date: "22 September 2026",
      service: "Inspeksi & Treatment Residual Barrier",
      technician: "Rian Pratama",
      findings: "Ditemukan 4 kecoa di area drainase bawah kitchen. Telah dilakukan spraying Cypermethrin.",
      signedBy: "Pak Doni (Digital Signed)",
    },
  ];

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle) return;

    await api.post("/tickets", {
      tenantId: "demo-pest",
      customerId: "demo-cust-01",
      title: ticketTitle,
      description: ticketDescription,
      priority: "HIGH",
    }).catch(() => {});

    setTicketSubmitted(true);
    setTicketTitle("");
    setTicketDescription("");
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      {/* Customer Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-slate-950 flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-500/20">
            RS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{customer.name}</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                Customer Portal
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              {customer.branch}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("TICKETS")}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-500/20 hover:opacity-95 transition-all"
          >
            <MessageSquare className="h-4 w-4" />
            Lapor Masalah Hama (Tiket)
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("CONTRACTS")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === "CONTRACTS"
              ? "bg-slate-800 text-emerald-400 border border-slate-700"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Shield className="h-4 w-4" />
          Kontrak & Layanan Aktif
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("SCHEDULES")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === "SCHEDULES"
              ? "bg-slate-800 text-emerald-400 border border-slate-700"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Calendar className="h-4 w-4" />
          Jadwal Kunjungan Mendatang
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("REPORTS")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === "REPORTS"
              ? "bg-slate-800 text-emerald-400 border border-slate-700"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <FileText className="h-4 w-4" />
          Berita Acara & Laporan
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("TICKETS")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === "TICKETS"
              ? "bg-slate-800 text-emerald-400 border border-slate-700"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          Tiket Komplain & Garansi
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex flex-col gap-4">
        {activeTab === "CONTRACTS" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contracts.map((c, i) => (
              <div key={i} className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    {c.contractNumber}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-emerald-300 font-bold">
                    {c.status}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{c.service}</h3>
                  <p className="text-xs text-slate-400 mt-1 font-mono">Frekuensi: {c.frequency}</p>
                  <p className="text-xs text-slate-400 font-mono">Periode: {c.period}</p>
                </div>
                <div className="pt-3 border-t border-slate-800 flex items-center gap-2 text-xs text-emerald-400 font-medium">
                  <CheckCircle className="h-4 w-4" />
                  {c.warrantyStatus}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "SCHEDULES" && (
          <div className="flex flex-col gap-3">
            {upcomingSchedules.map((s, i) => (
              <div key={i} className="p-4 rounded-2xl border border-slate-800 bg-slate-900/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-slate-800 text-cyan-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{s.service}</h4>
                    <p className="text-xs text-slate-400 font-mono">
                      {s.date} &bull; {s.time} &bull; Teknisi: {s.technician}
                    </p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "REPORTS" && (
          <div className="flex flex-col gap-3">
            {workReports.map((r, i) => (
              <div key={i} className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-400">{r.reportNumber}</span>
                    <span className="text-xs text-slate-500">&bull;</span>
                    <span className="text-xs text-slate-400">{r.date}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{r.service}</h4>
                  <p className="text-xs text-slate-400 max-w-xl">{r.findings}</p>
                  <span className="text-[11px] text-slate-500 font-mono mt-1">
                    Disahkan oleh: {r.signedBy}
                  </span>
                </div>

                <a
                  href={`http://localhost:4000/api/v1/reports/${r.reportNumber}/pdf`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-2 border border-slate-700 transition-colors shrink-0"
                >
                  <Download className="h-4 w-4 text-emerald-400" />
                  Unduh Berita Acara (PDF)
                </a>
              </div>
            ))}
          </div>
        )}

        {activeTab === "TICKETS" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 flex flex-col gap-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-rose-400" />
                Form Komplain / Klaim Garansi Hama
              </h3>
              <p className="text-xs text-slate-400">
                Jika hama muncul kembali dalam masa garansi 30 hari, laporkan di sini agar supervisor segera menugaskan teknisi untuk tindakan re-treatment gratis.
              </p>

              {ticketSubmitted && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  Tiket berhasil dibuat! Teknisi akan segera dikirimkan ke lokasi Anda.
                </div>
              )}

              <form onSubmit={handleCreateTicket} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400">Judul Laporan *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Muncul kecoa kembali di bawah meja kasir"
                    value={ticketTitle}
                    onChange={(e) => setTicketTitle(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-500 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400">Deskripsi Masalah & Area *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tolong dikirimkan teknisi untuk penanganan ulang di area kitchen dan dining room..."
                    value={ticketDescription}
                    onChange={(e) => setTicketDescription(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-500 outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold text-xs hover:opacity-95 transition-all shadow-lg shadow-rose-500/20"
                >
                  Kirim Laporan Komplain
                </button>
              </form>
            </div>

            {/* Existing Active Tickets List */}
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-sm text-slate-300">Riwayat Tiket & Respon Petugas</h3>
              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/30 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400">TCK-2026-0001</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                    DISPATCHED
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white">Rayap muncul pada kusen pintu gudang</h4>
                <p className="text-xs text-slate-400">
                  Respon Admin: "Teknisi Rian Pratama telah ditugaskan untuk kunjungan re-treatment garansi pada besok pagi."
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
