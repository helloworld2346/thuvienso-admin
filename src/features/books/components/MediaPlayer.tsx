import { useCallback, useEffect, useRef, useState } from "react";
import {
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX,
  FiMaximize,
  FiRotateCcw,
  FiRotateCw,
} from "react-icons/fi";

interface MediaPlayerProps {
  src: string;
  kind: "video" | "audio";
  title: string;
  poster?: string;
}

const SPEEDS = [0.5, 1, 1.25, 1.5, 2] as const;
const WAVE_BARS = 48;

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function MediaPlayer({ src, kind, title, poster }: MediaPlayerProps) {
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const rafRef = useRef<number | null>(null);

  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    setPlaying(false);
    setCurrent(0);
    setDuration(0);
    setEnded(false);
    setSpeed(1);
    if (mediaRef.current) mediaRef.current.playbackRate = 1;
  }, [src]);

  const ensureAnalyser = useCallback(() => {
    const el = mediaRef.current;
    if (!el || sourceRef.current) return;
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const source = ctx.createMediaElementSource(el);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128;
    analyser.smoothingTimeConstant = 0.8;
    source.connect(analyser);
    analyser.connect(ctx.destination);
    audioCtxRef.current = ctx;
    sourceRef.current = source;
    analyserRef.current = analyser;
  }, []);

  const drawWave = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    const dpr = window.devicePixelRatio || 1;
    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    if (canvas.width !== cssW * dpr || canvas.height !== cssH * dpr) {
      canvas.width = cssW * dpr;
      canvas.height = cssH * dpr;
    }
    ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx2d.clearRect(0, 0, cssW, cssH);

    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);

    const gap = 3;
    const barW = (cssW - gap * (WAVE_BARS - 1)) / WAVE_BARS;
    const step = Math.floor(data.length / WAVE_BARS) || 1;
    const color =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--color-primary")
        .trim() || "#007A3F";

    for (let i = 0; i < WAVE_BARS; i++) {
      const v = data[i * step] / 255; // 0..1
      const h = Math.max(2, v * cssH);
      const x = i * (barW + gap);
      const y = (cssH - h) / 2;
      ctx2d.fillStyle = color;
      ctx2d.globalAlpha = 0.35 + v * 0.65;
      const r = Math.min(barW / 2, 3);
      ctx2d.beginPath();
      ctx2d.moveTo(x + r, y);
      ctx2d.arcTo(x + barW, y, x + barW, y + h, r);
      ctx2d.arcTo(x + barW, y + h, x, y + h, r);
      ctx2d.arcTo(x, y + h, x, y, r);
      ctx2d.arcTo(x, y, x + barW, y, r);
      ctx2d.closePath();
      ctx2d.fill();
    }
    ctx2d.globalAlpha = 1;
    rafRef.current = requestAnimationFrame(drawWave);
  }, []);

  useEffect(() => {
    if (playing) {
      rafRef.current = requestAnimationFrame(drawWave);
    } else if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [playing, drawWave]);

  useEffect(() => {
    return () => {
      void audioCtxRef.current?.close();
    };
  }, []);

  const togglePlay = useCallback(() => {
    const el = mediaRef.current;
    if (!el) return;
    ensureAnalyser();
    void audioCtxRef.current?.resume();
    if (el.paused) {
      void el.play();
    } else {
      el.pause();
    }
  }, [ensureAnalyser]);

  const skip = useCallback((delta: number) => {
    const el = mediaRef.current;
    if (!el) return;
    const next = Math.min(
      el.duration || 0,
      Math.max(0, el.currentTime + delta),
    );
    el.currentTime = next;
    setCurrent(next);
    setEnded(false);
  }, []);

  const cycleSpeed = useCallback(() => {
    const el = mediaRef.current;
    if (!el) return;
    const idx = SPEEDS.indexOf(speed as (typeof SPEEDS)[number]);
    const next = SPEEDS[(idx + 1) % SPEEDS.length];
    el.playbackRate = next;
    setSpeed(next);
  }, [speed]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = mediaRef.current;
    if (!el) return;
    const t = Number(e.target.value);
    el.currentTime = t;
    setCurrent(t);
    setEnded(false);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = mediaRef.current;
    if (!el) return;
    const v = Number(e.target.value);
    el.volume = v;
    el.muted = v === 0;
    setVolume(v);
    setMuted(v === 0);
  };

  const toggleMute = () => {
    const el = mediaRef.current;
    if (!el) return;
    const next = !el.muted;
    el.muted = next;
    setMuted(next);
  };

  const restart = () => {
    const el = mediaRef.current;
    if (!el) return;
    ensureAnalyser();
    void audioCtxRef.current?.resume();
    el.currentTime = 0;
    setEnded(false);
    void el.play();
  };

  const goFullscreen = () => {
    void wrapRef.current?.requestFullscreen?.();
  };

  const commonMediaProps = {
    ref: mediaRef as never,
    src,
    crossOrigin: "anonymous" as const,
    onLoadedMetadata: (
      e: React.SyntheticEvent<HTMLVideoElement | HTMLAudioElement>,
    ) => setDuration(e.currentTarget.duration),
    onTimeUpdate: (
      e: React.SyntheticEvent<HTMLVideoElement | HTMLAudioElement>,
    ) => setCurrent(e.currentTarget.currentTime),
    onPlay: () => {
      setPlaying(true);
      setEnded(false);
    },
    onPause: () => setPlaying(false),
    onEnded: () => {
      setPlaying(false);
      setEnded(true);
    },
  };

  return (
    <div
      ref={wrapRef}
      className="overflow-hidden rounded-2xl border border-app-border bg-surface"
    >
      {kind === "video" ? (
        <button
          type="button"
          onClick={togglePlay}
          className="group relative block w-full bg-black"
          aria-label={playing ? "Tạm dừng" : "Phát"}
        >
          <video
            {...commonMediaProps}
            poster={poster}
            playsInline
            className="mx-auto max-h-[60vh] w-full object-contain"
          />
          {!playing && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black/50 text-white ring-1 ring-white/30 backdrop-blur-sm transition-transform group-hover:scale-105">
                {ended ? <FiRotateCcw size={26} /> : <FiPlay size={28} />}
              </span>
            </span>
          )}
        </button>
      ) : (
        <div className="flex items-center gap-4 bg-gradient-to-br from-primary/10 to-primary/5 px-6 py-6 dark:from-primary/20 dark:to-primary/5">
          <audio {...commonMediaProps} />
          <button
            type="button"
            onClick={ended ? restart : togglePlay}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-md transition-transform hover:scale-105"
            aria-label={playing ? "Tạm dừng" : "Phát"}
          >
            {ended ? (
              <FiRotateCcw size={22} />
            ) : playing ? (
              <FiPause size={22} />
            ) : (
              <FiPlay size={22} className="ml-0.5" />
            )}
          </button>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </p>
            <canvas
              ref={canvasRef}
              className="h-12 w-full"
              aria-hidden="true"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(current)} / {formatTime(duration)}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 border-t border-app-border px-4 py-3">
        <button
          type="button"
          onClick={() => skip(-10)}
          className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-surface-3 dark:text-gray-400"
          aria-label="Tua ngược 10 giây"
          title="Tua ngược 10 giây"
        >
          <FiRotateCcw size={17} />
          <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold">
            10
          </span>
        </button>

        <button
          type="button"
          onClick={ended ? restart : togglePlay}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20 dark:bg-primary/20"
          aria-label={playing ? "Tạm dừng" : "Phát"}
        >
          {ended ? (
            <FiRotateCcw size={16} />
          ) : playing ? (
            <FiPause size={16} />
          ) : (
            <FiPlay size={16} className="ml-0.5" />
          )}
        </button>

        <button
          type="button"
          onClick={() => skip(10)}
          className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-surface-3 dark:text-gray-400"
          aria-label="Tua nhanh 10 giây"
          title="Tua nhanh 10 giây"
        >
          <FiRotateCw size={17} />
          <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold">
            10
          </span>
        </button>

        <span className="w-10 shrink-0 text-right text-xs tabular-nums text-gray-500 dark:text-gray-400">
          {formatTime(current)}
        </span>

        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={current}
          onChange={handleSeek}
          aria-label="Tua"
          className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-app-border accent-primary"
        />

        <span className="w-10 shrink-0 text-xs tabular-nums text-gray-500 dark:text-gray-400">
          {formatTime(duration)}
        </span>

        <button
          type="button"
          onClick={cycleSpeed}
          className="flex h-8 shrink-0 items-center justify-center rounded-full px-2 text-xs font-semibold text-gray-500 transition-colors hover:bg-surface-3 dark:text-gray-400"
          aria-label={`Tốc độ phát ${speed}x`}
          title="Đổi tốc độ phát"
        >
          {speed}x
        </button>

        <button
          type="button"
          onClick={toggleMute}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-surface-3 dark:text-gray-400"
          aria-label={muted ? "Bật tiếng" : "Tắt tiếng"}
        >
          {muted || volume === 0 ? (
            <FiVolumeX size={16} />
          ) : (
            <FiVolume2 size={16} />
          )}
        </button>

        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={muted ? 0 : volume}
          onChange={handleVolume}
          aria-label="Âm lượng"
          className="hidden h-1.5 w-20 cursor-pointer appearance-none rounded-full bg-app-border accent-primary sm:block"
        />

        {kind === "video" && (
          <button
            type="button"
            onClick={goFullscreen}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-surface-3 dark:text-gray-400"
            aria-label="Toàn màn hình"
          >
            <FiMaximize size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
