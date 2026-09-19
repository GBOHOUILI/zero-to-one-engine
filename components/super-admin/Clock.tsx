// components/super-admin/Clock.tsx
"use client";
import { useEffect, useRef } from "react";

const pad2 = (n: number) => String(n).padStart(2, "0");
const DAYS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

function getWeek(d: Date) {
  const dt = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = dt.getUTCDay() || 7;
  dt.setUTCDate(dt.getUTCDate() + 4 - day);
  const y0 = new Date(Date.UTC(dt.getUTCFullYear(), 0, 1));
  return Math.ceil(((dt.getTime() - y0.getTime()) / 86400000 + 1) / 7);
}

export default function Clock() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dayRef = useRef<HTMLSpanElement>(null);
  const dateRef = useRef<HTMLSpanElement>(null);
  const weekRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const CX = 110,
      CY = 110,
      R = 100;

    function draw() {
      const cv = canvasRef.current;
      if (!cv) return;
      const ctx = cv.getContext("2d")!;
      const now = new Date();
      const h = now.getHours() % 12;
      const m = now.getMinutes();
      const s = now.getSeconds();
      const ms = now.getMilliseconds();
      const sDeg = (s + ms / 1000) * 6;
      const mDeg = (m + (s + ms / 1000) / 60) * 6;
      const hDeg = (h + m / 60) * 30;

      ctx.clearRect(0, 0, 220, 220);

      // outer ring
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,255,136,0.18)";
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // seconds arc
      ctx.beginPath();
      ctx.arc(
        CX,
        CY,
        R,
        -Math.PI / 2,
        -Math.PI / 2 + (sDeg * Math.PI) / 180,
        false,
      );
      ctx.strokeStyle = "rgba(0,204,255,0.55)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // hour ticks
      for (let i = 0; i < 12; i++) {
        const a = ((i * 30 - 90) * Math.PI) / 180;
        const main = i % 3 === 0;
        ctx.beginPath();
        ctx.moveTo(
          CX + Math.cos(a) * (main ? R - 5 : R - 3),
          CY + Math.sin(a) * (main ? R - 5 : R - 3),
        );
        ctx.lineTo(
          CX + Math.cos(a) * (main ? R - 12 : R - 8),
          CY + Math.sin(a) * (main ? R - 12 : R - 8),
        );
        ctx.strokeStyle = main
          ? "rgba(0,255,136,0.7)"
          : "rgba(255,255,255,0.18)";
        ctx.lineWidth = main ? 1.5 : 0.5;
        ctx.stroke();
      }

      // minute ticks
      for (let i = 0; i < 60; i++) {
        if (i % 5 === 0) continue;
        const a = ((i * 6 - 90) * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(CX + Math.cos(a) * (R - 2), CY + Math.sin(a) * (R - 2));
        ctx.lineTo(CX + Math.cos(a) * (R - 5), CY + Math.sin(a) * (R - 5));
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // inner ring
      ctx.beginPath();
      ctx.arc(CX, CY, R - 18, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // name + digital
      ctx.font = "500 9px monospace";
      ctx.fillStyle = "rgba(0,255,136,0.6)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("ELDO-MORÉO", CX, CY - 10);
      ctx.font = "400 8px monospace";
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.fillText(
        `${pad2(now.getHours())}:${pad2(m)}:${pad2(s)}`,
        CX,
        CY + 20,
      );

      const hand = (
        deg: number,
        lf: number,
        lb: number,
        w: number,
        color: string,
      ) => {
        const a = ((deg - 90) * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(CX - Math.cos(a) * lb, CY - Math.sin(a) * lb);
        ctx.lineTo(CX + Math.cos(a) * lf, CY + Math.sin(a) * lf);
        ctx.strokeStyle = color;
        ctx.lineWidth = w;
        ctx.lineCap = "round";
        ctx.stroke();
      };

      hand(hDeg, 48, 10, 3.5, "rgba(255,255,255,0.9)");
      hand(mDeg, 68, 12, 2, "rgba(255,255,255,0.75)");
      hand(sDeg, 78, 16, 1, "#00ccff");

      // center cap
      ctx.beginPath();
      ctx.arc(CX, CY, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#07100a";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(CX, CY, 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(CX, CY, 2, 0, Math.PI * 2);
      ctx.fillStyle = "#00ccff";
      ctx.fill();

      // date cells
      if (dayRef.current) dayRef.current.textContent = DAYS[now.getDay()];
      if (dateRef.current)
        dateRef.current.textContent = `${pad2(now.getDate())}/${pad2(now.getMonth() + 1)}`;
      if (weekRef.current)
        weekRef.current.textContent = `W${pad2(getWeek(now))}`;
    }

    draw();
    const id = setInterval(draw, 50);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="font-mono select-none w-[300px] bg-[#07100a] border border-[#00ff8826] rounded-[20px] px-[22px] pt-[22px] pb-[18px] relative overflow-hidden">
      <div className="absolute top-0 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-[#00ff88] to-[#00ccff] opacity-50" />

      <div className="flex justify-between items-center mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
        <span className="text-[10px] tracking-[.15em] text-white/25 uppercase">
          {typeof Intl !== "undefined"
            ? Intl.DateTimeFormat().resolvedOptions().timeZone.replace("_", " ")
            : "UTC"}
        </span>
      </div>

      <div className="flex justify-center mb-4">
        <canvas ref={canvasRef} width={220} height={220} />
      </div>

      <div className="h-px bg-white/[.08] mb-3" />

      <div className="text-center mb-3">
        <p className="text-[9px] tracking-[.22em] text-white/20 uppercase mb-1">
          CEO
        </p>
        <p className="text-[14px] font-medium tracking-[.1em] text-white/88">
          <span className="text-[#00ff88]">Eldo-Moréo</span>
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          [
            "Jour",
            <span ref={dayRef} key="d">
              —
            </span>,
          ],
          [
            "Date",
            <span ref={dateRef} key="dt">
              —
            </span>,
          ],
          [
            "Sem.",
            <span ref={weekRef} key="w">
              —
            </span>,
          ],
        ].map(([lbl, val]) => (
          <div
            key={String(lbl)}
            className="bg-white/[.04] border border-white/[.07] rounded-[10px] py-2 text-center"
          >
            <p className="text-[9px] tracking-[.1em] text-white/25 uppercase mb-1">
              {lbl}
            </p>
            <p className="text-[12px] text-white/75 tabular-nums">{val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
