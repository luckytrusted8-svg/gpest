"use client";

import React, { useRef, useState, useEffect } from "react";
import { RotateCcw, Check, PenLine } from "lucide-react";

interface SignaturePadProps {
  onSave: (signatureDataUrl: string) => void;
  customerName: string;
}

export function SignaturePad({ onSave, customerName }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#10b981"; // Emerald line
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: (e as React.MouseEvent).clientX - rect.left,
      y: (e as React.MouseEvent).clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current && hasDrawn) {
      onSave(canvasRef.current.toDataURL("image/png"));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onSave("");
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5 font-medium">
          <PenLine className="h-3.5 w-3.5 text-emerald-400" />
          Tanda Tangan PIC Pelanggan ({customerName || "Customer"})
        </span>
        <button
          type="button"
          onClick={clearCanvas}
          className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          Ulangi
        </button>
      </div>

      <div className="relative border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-xl bg-slate-900/90 overflow-hidden cursor-crosshair transition-colors">
        <canvas
          ref={canvasRef}
          width={400}
          height={160}
          className="w-full h-40 touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {!hasDrawn && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-500 text-xs gap-1">
            <span>Tanda tangani di sini (Layar Sentuh / Mouse)</span>
            <span className="text-[10px] text-slate-600">Digital verification stamp akan otomatis dibuat</span>
          </div>
        )}
      </div>
    </div>
  );
}
