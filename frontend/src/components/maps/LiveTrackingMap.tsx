"use client";

import React, { useState, useEffect } from "react";
import { Navigation, MapPin, Radio, ShieldAlert, CheckCircle, Battery, Gauge, Compass } from "lucide-react";
import { getSocket } from "@/lib/api";

interface LiveTrackingMapProps {
  technicianName?: string;
  customerName?: string;
  branchName?: string;
  destLat?: number;
  destLng?: number;
  geofenceRadius?: number;
}

export function LiveTrackingMap({
  technicianName = "Rian Pratama",
  customerName = "Resto Sedap Rasa",
  branchName = "Cabang Senopati",
  destLat = -6.2297,
  destLng = 106.8075,
  geofenceRadius = 100,
}: LiveTrackingMapProps) {
  // Current tech position starts slightly away (~350m)
  const [techPos, setTechPos] = useState({ lat: destLat - 0.0035, lng: destLng - 0.0028 });
  const [speed, setSpeed] = useState(38);
  const [battery, setBattery] = useState(92);
  const [isSimulating, setIsSimulating] = useState(false);
  const [distanceMeters, setDistanceMeters] = useState(420);
  const [isInsideGeofence, setIsInsideGeofence] = useState(false);

  // Listen to real-time socket events if available
  useEffect(() => {
    const socket = getSocket();
    socket.emit("join:tenant", { tenantId: "demo-pest" });

    socket.on("tech:live_position", (data: any) => {
      if (data?.latitude && data?.longitude) {
        setTechPos({ lat: data.latitude, lng: data.longitude });
        if (data.speed !== undefined) setSpeed(data.speed);
      }
    });

    return () => {
      socket.off("tech:live_position");
    };
  }, []);

  // Distance calculation & simulated trip
  useEffect(() => {
    // Quick approximation for delta
    const dLat = (destLat - techPos.lat) * 111320;
    const dLng = (destLng - techPos.lng) * 111320 * Math.cos((destLat * Math.PI) / 180);
    const dist = Math.round(Math.sqrt(dLat * dLat + dLng * dLng));
    setDistanceMeters(dist);
    setIsInsideGeofence(dist <= geofenceRadius);
  }, [techPos, destLat, destLng, geofenceRadius]);

  // Simulated GPS movement loop
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setTechPos((prev) => {
        const stepLat = (destLat - prev.lat) * 0.15;
        const stepLng = (destLng - prev.lng) * 0.15;

        // If very close, snap to destination
        if (Math.abs(stepLat) < 0.0001 && Math.abs(stepLng) < 0.0001) {
          setIsSimulating(false);
          setSpeed(0);
          return { lat: destLat, lng: destLng };
        }

        const newLat = prev.lat + stepLat;
        const newLng = prev.lng + stepLng;
        setSpeed(Math.floor(25 + Math.random() * 15));

        // Emit to socket server for real-time demonstration
        getSocket().emit("technician:location_update", {
          tenantId: "demo-pest",
          techId: "usr_demo_tech",
          techName: technicianName,
          latitude: newLat,
          longitude: newLng,
          speed: 35,
          battery: 90,
        });

        return { lat: newLat, lng: newLng };
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isSimulating, destLat, destLng, technicianName]);

  const resetPosition = () => {
    setTechPos({ lat: destLat - 0.0035, lng: destLng - 0.0028 });
    setIsSimulating(false);
    setSpeed(0);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Top Map Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-3 w-3 rounded-full bg-emerald-500 animate-ping absolute inset-0"></div>
            <div className="h-3 w-3 rounded-full bg-emerald-500 relative"></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-slate-100">{technicianName}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                {isInsideGeofence ? "DI LOKASI (ON SITE)" : "MENDEKATI (EN ROUTE)"}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Tujuan: <span className="text-slate-300 font-medium">{customerName}</span> ({branchName})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Gauge className="h-4 w-4 text-cyan-400" />
            <span>{speed} km/h</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Battery className="h-4 w-4 text-emerald-400" />
            <span>{battery}%</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-emerald-400 font-bold">
            <Compass className="h-4 w-4" />
            <span>Jarak: {distanceMeters}m</span>
          </div>
        </div>
      </div>

      {/* Visual GPS Radar / Map Canvas */}
      <div className="relative h-96 w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner flex items-center justify-center">
        {/* Stylized Grid Overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(#10b981 1px, transparent 1px), radial-gradient(#38bdf8 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            backgroundPosition: "0 0, 16px 16px",
          }}
        ></div>

        {/* Outer Circular Geofence Zone around Customer */}
        <div className="absolute flex items-center justify-center">
          {/* 100m geofence zone */}
          <div className="h-56 w-56 rounded-full border-2 border-dashed border-emerald-500/40 bg-emerald-500/5 flex items-center justify-center animate-pulse">
            <span className="text-[10px] text-emerald-400 font-mono absolute -top-5 bg-slate-900 px-2 py-0.5 rounded border border-emerald-500/30">
              Geofence Radius: {geofenceRadius}m
            </span>
          </div>

          {/* Customer Location Pin (Center) */}
          <div className="absolute flex flex-col items-center pointer-events-none">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/30">
              <MapPin className="h-6 w-6" />
            </div>
            <div className="mt-1 px-2.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[11px] font-bold text-white shadow">
              {customerName}
            </div>
          </div>
        </div>

        {/* Technician Marker Positioned dynamically */}
        <div
          className="absolute transition-all duration-1000 ease-out flex flex-col items-center pointer-events-none"
          style={{
            transform: `translate(${((techPos.lng - destLng) * 20000)}px, ${((techPos.lat - destLat) * 20000)}px)`,
          }}
        >
          <div className="relative flex items-center justify-center">
            <div className="h-10 w-10 rounded-full bg-cyan-500/20 animate-ping absolute"></div>
            <div className="p-2.5 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-xl shadow-cyan-500/50">
              <Navigation className="h-5 w-5 transform -rotate-45" />
            </div>
          </div>
          <div className="mt-1 px-2 py-0.5 rounded bg-slate-900/90 border border-cyan-500/50 text-[11px] font-mono text-cyan-300 font-semibold shadow">
            {technicianName} ({distanceMeters}m)
          </div>
        </div>

        {/* Geofence Status Badge Floating */}
        <div className="absolute bottom-4 left-4 z-10">
          {isInsideGeofence ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold backdrop-blur-md">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              Di Dalam Radius Geofence (Boleh Check-in)
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold backdrop-blur-md">
              <ShieldAlert className="h-4 w-4 text-amber-400" />
              Di Luar Radius ({distanceMeters}m &gt; {geofenceRadius}m)
            </div>
          )}
        </div>

        {/* Interactive Simulation Controls */}
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-lg ${
              isSimulating
                ? "bg-amber-500 text-slate-950 hover:bg-amber-400"
                : "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400"
            }`}
          >
            <Radio className="h-3.5 w-3.5" />
            {isSimulating ? "Jeda Simulasi GPS" : "Simulasi Perjalanan Live"}
          </button>
          <button
            type="button"
            onClick={resetPosition}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition-all"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
