"use client";

import React, { useState, useEffect } from "react";
import { Users, Plus, ArrowRight, CheckCircle2, Phone, Mail, MapPin, Building, DollarSign } from "lucide-react";
import { api } from "@/lib/api";

interface Lead {
  id: string;
  leadNumber: string;
  contactName: string;
  companyName?: string;
  phone: string;
  email?: string;
  address?: string;
  pestIssue?: string;
  stage: "COLD" | "WARM" | "HOT" | "WON" | "LOST";
  estimatedValue?: number;
}

export function CrmPipeline() {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "demo-lead-1",
      leadNumber: "LEAD-2026-0001",
      contactName: "Ibu Maya",
      companyName: "PT Bintang Logistik",
      phone: "081299887766",
      email: "maya@bintanglog.id",
      address: "Kawasan Industri MM2100, Cikarang",
      pestIssue: "Kutu beras dan tikus di area gudang penyimpanan",
      stage: "HOT",
      estimatedValue: 12500000,
    },
    {
      id: "demo-lead-2",
      leadNumber: "LEAD-2026-0002",
      contactName: "Bpk. Rahmat",
      companyName: "Hotel Santika Harmoni",
      phone: "081377889900",
      email: "gm@santika-harmoni.com",
      address: "Jl. Hayam Wuruk No. 88, Jakarta Barat",
      pestIssue: "Inspeksi rutin rayap plafon dan semut kamar hotel",
      stage: "WARM",
      estimatedValue: 8500000,
    },
    {
      id: "demo-lead-3",
      leadNumber: "LEAD-2026-0003",
      contactName: "Dr. Lina",
      companyName: "Klinik Sehat Bugar",
      phone: "081822334455",
      email: "lina@sehatbugar.co.id",
      address: "Jl. Fatmawati No. 20, Jakarta Selatan",
      pestIssue: "Kecoa di pantry dan sterilisasi ruang tindakan",
      stage: "COLD",
      estimatedValue: 3500000,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newContact, setNewContact] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newPestIssue, setNewPestIssue] = useState("");
  const [newValue, setNewValue] = useState("5000000");

  // Fetch leads from backend if running
  useEffect(() => {
    api.get("/leads")
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setLeads(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleStageChange = async (id: string, newStage: Lead["stage"]) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, stage: newStage } : l))
    );

    await api.patch(`/leads/${id}/stage`, { stage: newStage }).catch(() => {});
  };

  const handleConvert = async (id: string) => {
    await api.post(`/leads/${id}/convert`).catch(() => {});
    handleStageChange(id, "WON");
    alert("Lead berhasil dikonversi menjadi Customer Aktif dengan lokasi cabang!");
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact || !newPhone) return;

    const newLeadItem: Lead = {
      id: `lead_${Date.now()}`,
      leadNumber: `LEAD-2026-000${leads.length + 1}`,
      contactName: newContact,
      companyName: newCompany,
      phone: newPhone,
      pestIssue: newPestIssue,
      estimatedValue: parseFloat(newValue) || 0,
      stage: "COLD",
    };

    setLeads([newLeadItem, ...leads]);
    setShowAddModal(false);
    setNewContact("");
    setNewCompany("");
    setNewPhone("");
    setNewPestIssue("");

    await api.post("/leads", {
      tenantId: "demo-pest",
      contactName: newContact,
      companyName: newCompany,
      phone: newPhone,
      pestIssue: newPestIssue,
      estimatedValue: parseFloat(newValue) || 0,
    }).catch(() => {});
  };

  const stages: Array<{ key: Lead["stage"]; title: string; color: string }> = [
    { key: "COLD", title: "Cold Leads", color: "border-blue-500/40 text-blue-400 bg-blue-500/5" },
    { key: "WARM", title: "Warm (Follow Up)", color: "border-amber-500/40 text-amber-400 bg-amber-500/5" },
    { key: "HOT", title: "Hot (Quotation)", color: "border-orange-500/40 text-orange-400 bg-orange-500/5" },
    { key: "WON", title: "Deal Won (Customer)", color: "border-emerald-500/40 text-emerald-400 bg-emerald-500/5" },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-400" />
            CRM & Pipeline Penjualan Pest Control
          </h2>
          <p className="text-xs text-slate-400">
            Kelola prospek dari inbound leads sampai konversi kontrak customer baru.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          Tambah Lead Baru
        </button>
      </div>

      {/* Kanban Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stg) => {
          const stageLeads = leads.filter((l) => l.stage === stg.key);
          return (
            <div
              key={stg.key}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 flex flex-col gap-3 min-h-[420px]"
            >
              <div className={`p-2.5 rounded-xl border ${stg.color} flex items-center justify-between`}>
                <span className="font-bold text-xs">{stg.title}</span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900">
                  {stageLeads.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 hover:border-slate-700 transition-all flex flex-col gap-2.5 shadow"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {lead.leadNumber}
                      </span>
                      {lead.estimatedValue && (
                        <span className="text-[11px] font-mono font-semibold text-emerald-400">
                          Rp {lead.estimatedValue.toLocaleString("id-ID")}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-slate-200">{lead.contactName}</h4>
                      {lead.companyName && (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Building className="h-3 w-3 text-slate-500" />
                          {lead.companyName}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 text-xs text-slate-400 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3 w-3 text-emerald-400 shrink-0" />
                        <span>{lead.phone}</span>
                      </div>
                      {lead.pestIssue && (
                        <p className="text-[11px] text-slate-400 line-clamp-2 italic mt-1 bg-slate-900 p-1.5 rounded border border-slate-800/80">
                          "{lead.pestIssue}"
                        </p>
                      )}
                    </div>

                    {/* Action Next Stage */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      {stg.key === "COLD" && (
                        <button
                          type="button"
                          onClick={() => handleStageChange(lead.id, "WARM")}
                          className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium flex items-center justify-center gap-1"
                        >
                          Follow Up &rarr;
                        </button>
                      )}
                      {stg.key === "WARM" && (
                        <button
                          type="button"
                          onClick={() => handleStageChange(lead.id, "HOT")}
                          className="w-full py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-medium flex items-center justify-center gap-1"
                        >
                          Kirim Penawaran &rarr;
                        </button>
                      )}
                      {stg.key === "HOT" && (
                        <button
                          type="button"
                          onClick={() => handleConvert(lead.id)}
                          className="w-full py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold flex items-center justify-center gap-1"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          Deal Won & Convert
                        </button>
                      )}
                      {stg.key === "WON" && (
                        <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Customer Aktif
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
            <h3 className="font-bold text-base text-white">Input Prospek Lead Baru</h3>

            <form onSubmit={handleAddLead} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400">Nama Kontak PIC *</label>
                <input
                  type="text"
                  required
                  placeholder="Bpk. Hendra"
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400">Nama Perusahaan / Resto</label>
                <input
                  type="text"
                  placeholder="PT Kuliner Jaya Mandiri"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400">Nomor WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="081234567890"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400">Estimasi Nilai (Rp)</label>
                  <input
                    type="number"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400">Masalah Hama yang Dihadapi</label>
                <textarea
                  rows={2}
                  placeholder="Kecoa di area dapur dan rayap pada kusen pintu..."
                  value={newPestIssue}
                  onChange={(e) => setNewPestIssue(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-500 outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
                >
                  Simpan Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
