"use client";

import React, { useState } from "react";
import {
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Camera,
  FileCheck,
  Send,
  Navigation,
  Shield,
  Layers,
  FlaskConical,
  Bug,
  Check,
  Smartphone,
} from "lucide-react";
import { SignaturePad } from "./SignaturePad";
import { api } from "@/lib/api";

export function TechnicianWorkView() {
  const [taskState, setTaskState] = useState<"ASSIGNED" | "EN_ROUTE" | "ON_SITE" | "COMPLETED">("ASSIGNED");
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [selectedPests, setSelectedPests] = useState<string[]>(["Cockroach", "Ant"]);
  const [infestationLevel, setInfestationLevel] = useState<string>("MEDIUM");
  const [targetAreas, setTargetAreas] = useState<string[]>(["Kitchen", "Drainage"]);
  const [chemicalName, setChemicalName] = useState("Cypermethrin 10EC");
  const [chemicalDosage, setChemicalDosage] = useState("150");
  const [chemicalUnit, setChemicalUnit] = useState("ml");
  const [treatmentMethod, setTreatmentMethod] = useState("Spraying & Residual Barrier");
  const [recommendations, setRecommendations] = useState(
    "Perbaiki celah kebocoran air di bawah wastafel dan tutup celah pintu belakang gudang."
  );
  const [picName, setPicName] = useState("Pak Doni");
  const [signatureUrl, setSignatureUrl] = useState<string>("");

  // Demo task info
  const task = {
    id: "demo-task-01",
    taskNumber: "TSK-2026-0001",
    customer: "Resto Sedap Rasa",
    branch: "Cabang Senopati",
    address: "Jl. Senopati No. 12, Kebayoran Baru, Jakarta Selatan",
    service: "General Pest Control (Kecoa & Semut)",
    timeSlot: "09:00 - 11:00 WIB",
  };

  const handleStartTrip = () => {
    setTaskState("EN_ROUTE");
  };

  const handleCheckIn = () => {
    setTaskState("ON_SITE");
    setStep(2);
  };

  const togglePest = (pest: string) => {
    setSelectedPests((prev) =>
      prev.includes(pest) ? prev.filter((p) => p !== pest) : [...prev, pest]
    );
  };

  const toggleArea = (area: string) => {
    setTargetAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleSubmitReport = async () => {
    setIsSubmitting(true);
    try {
      // Post to backend API
      await api.post("/tasks/TSK-2026-0001/work-report", {
        dynamicData: {
          selectedPests,
          infestationLevel,
          targetAreas,
        },
        chemicals: [
          {
            name: chemicalName,
            amountUsed: parseFloat(chemicalDosage) || 100,
            unit: chemicalUnit,
            method: treatmentMethod,
          },
        ],
        recommendations,
        customerPicName: picName,
        signatureUrl: signatureUrl || "data:image/png;base64,demo_sig",
      }).catch(() => {
        // Fallback demo mock if backend task id not matched
      });

      setTaskState("COMPLETED");
      setSuccessMessage("Work Report berhasil disubmit dan ditandatangani oleh customer!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-slate-100">
      {/* Mobile Top Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Smartphone className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-bold block text-slate-200">GPest Field Service</span>
            <span className="text-[10px] text-emerald-400 font-mono">Status: Online</span>
          </div>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
          Rian Pratama (Teknisi)
        </span>
      </div>

      {/* Task Summary Banner */}
      <div className="p-4 bg-gradient-to-b from-slate-800/60 to-slate-900 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
            {task.taskNumber}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
            <Clock className="h-3 w-3 text-cyan-400" />
            {task.timeSlot}
          </span>
        </div>

        <h3 className="font-bold text-base text-white mt-2">{task.customer}</h3>
        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
          <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          {task.branch} — {task.address}
        </p>
      </div>

      {/* Workflow Steps Indicator */}
      <div className="grid grid-cols-4 border-b border-slate-800 text-[11px] font-medium text-center">
        <div className={`py-2 border-b-2 transition-colors ${taskState !== "ASSIGNED" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-500"}`}>
          1. Trip
        </div>
        <div className={`py-2 border-b-2 transition-colors ${step >= 2 ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-500"}`}>
          2. Inspeksi
        </div>
        <div className={`py-2 border-b-2 transition-colors ${step >= 3 ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-500"}`}>
          3. Treatment
        </div>
        <div className={`py-2 border-b-2 transition-colors ${taskState === "COMPLETED" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-500"}`}>
          4. Selesai
        </div>
      </div>

      {/* Content Area Based on Step */}
      <div className="p-5 flex-1 flex flex-col gap-5 overflow-y-auto max-h-[520px]">
        {/* State 1: En Route & Check-in */}
        {taskState === "ASSIGNED" && (
          <div className="flex flex-col gap-4 text-center py-6">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Navigation className="h-8 w-8" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Tugas Baru Diterima</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Silakan tekan tombol di bawah untuk memulai perjalanan menuju lokasi customer.
              </p>
            </div>
            <button
              type="button"
              onClick={handleStartTrip}
              className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all"
            >
              Mulai Perjalanan (En Route)
            </button>
          </div>
        )}

        {taskState === "EN_ROUTE" && (
          <div className="flex flex-col gap-4 text-center py-4">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <MapPin className="h-8 w-8 animate-bounce" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Dalam Perjalanan</h4>
              <p className="text-xs text-slate-400 mt-1">
                GPS aktif streaming ke dashboard supervisor. Setibanya di lokasi, lakukan Check-in.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between font-mono">
              <span className="text-slate-400">Jarak ke Lokasi:</span>
              <span className="text-emerald-400 font-bold">25 meter (Dalam Geofence)</span>
            </div>

            <button
              type="button"
              onClick={handleCheckIn}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all"
            >
              Check-in Tugas di Lokasi
            </button>
          </div>
        )}

        {/* State 2 & 3: Inspection & Treatment Form */}
        {taskState === "ON_SITE" && step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-white flex items-center gap-1.5">
                <Bug className="h-4 w-4 text-emerald-400" />
                Formulir Inspeksi Hama
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Tahap 1/2</span>
            </div>

            {/* Target Area Checklist */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-400 font-medium">Area Ditemukan Hama:</label>
              <div className="grid grid-cols-2 gap-2">
                {["Kitchen", "Warehouse", "Drainage", "Dining Area", "Office", "Ceiling"].map((area) => {
                  const isChecked = targetAreas.includes(area);
                  return (
                    <button
                      type="button"
                      key={area}
                      onClick={() => toggleArea(area)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center justify-between transition-all ${
                        isChecked
                          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-semibold"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <span>{area}</span>
                      {isChecked && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pests Found */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-400 font-medium">Jenis Hama Ditemukan:</label>
              <div className="grid grid-cols-2 gap-2">
                {["Cockroach", "Rodent", "Ant", "Termite", "Fly", "Mosquito"].map((pest) => {
                  const isChecked = selectedPests.includes(pest);
                  return (
                    <button
                      type="button"
                      key={pest}
                      onClick={() => togglePest(pest)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center justify-between transition-all ${
                        isChecked
                          ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-300 font-semibold"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <span>{pest}</span>
                      {isChecked && <Check className="h-3.5 w-3.5 text-cyan-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Severity Level */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-400 font-medium">Tingkat Infestasi:</label>
              <div className="grid grid-cols-3 gap-2">
                {["LOW", "MEDIUM", "HIGH"].map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setInfestationLevel(lvl)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      infestationLevel === lvl
                        ? "bg-amber-500/20 border-amber-500 text-amber-300"
                        : "bg-slate-950 border-slate-800 text-slate-400"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(3)}
              className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:opacity-95"
            >
              Lanjut: Catat Bahan Kimia & Treatment
            </button>
          </div>
        )}

        {taskState === "ON_SITE" && step === 3 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-white flex items-center gap-1.5">
                <FlaskConical className="h-4 w-4 text-cyan-400" />
                Catatan Treatment & TTD
              </span>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-[11px] text-slate-400 hover:text-slate-200"
              >
                &larr; Kembali ke Inspeksi
              </button>
            </div>

            {/* Chemical Details */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-400 font-medium">Chemical / Obat yang Digunakan:</label>
              <input
                type="text"
                value={chemicalName}
                onChange={(e) => setChemicalName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-medium">Dosis / Jumlah:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={chemicalDosage}
                    onChange={(e) => setChemicalDosage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-emerald-500 outline-none font-mono"
                  />
                  <span className="text-xs text-slate-400 font-mono">{chemicalUnit}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-medium">Metode:</label>
                <input
                  type="text"
                  value={treatmentMethod}
                  onChange={(e) => setTreatmentMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Recommendations */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-medium">Rekomendasi untuk Customer:</label>
              <textarea
                rows={2}
                value={recommendations}
                onChange={(e) => setRecommendations(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-emerald-500 outline-none resize-none"
              />
            </div>

            {/* PIC Name & Signature Pad */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-medium">Nama PIC Pelanggan:</label>
              <input
                type="text"
                value={picName}
                onChange={(e) => setPicName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-emerald-500 outline-none"
              />
            </div>

            <SignaturePad
              customerName={picName}
              onSave={(sigData) => setSignatureUrl(sigData)}
            />

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmitReport}
              className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:opacity-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? "Mengirim Laporan..." : "Kirim Work Report & Selesai"}
            </button>
          </div>
        )}

        {/* State 4: Completed View */}
        {taskState === "COMPLETED" && (
          <div className="flex flex-col gap-4 text-center py-6">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <div>
              <h4 className="font-bold text-white text-lg">Pekerjaan Selesai!</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                {successMessage || "Laporan kerja telah tersimpan di database dan Berita Acara siap didownload."}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs flex flex-col gap-2 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Customer:</span>
                <span className="text-slate-200">{task.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tanda Tangan PIC:</span>
                <span className="text-emerald-400">Terverifikasi ({picName})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Chemical Digunakan:</span>
                <span className="text-cyan-400">{chemicalDosage} {chemicalUnit} {chemicalName}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setTaskState("ASSIGNED");
                setStep(1);
                setSuccessMessage(null);
              }}
              className="mt-2 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              Ulangi Alur untuk Simulasi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
