import { useCallback, useEffect, useRef, useState } from "react";
import {
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX,
  FiMaximize,
  FiRotateCcw,
} from "react-icons/fi";

interface MediaPlayerProps {
  src: string;
  kind: "video" | "audio";
  title: string;
  poster?: string;
}

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function MediaPlayer({ src, kind, title, poster }: MediaPlayerProps) {
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [ended, setEnded] = useState(false);

  // Reset khi đổi file
  useEffect(() => {
    setPlaying(false);
    setCurrent(0);
    setDuration(0);
    setEnded(false);
  }, [src]);

  const togglePlay = useCallback(() => {
    const el = mediaRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
    } else {
      el.pause();
    }
  }, []);

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
      {/* Vùng hiển thị */}
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
        <div className="flex items-center gap-4 bg-gradient-to-br from-primary/10 to-primary/5 px-6 py-8 dark:from-primary/20 dark:to-primary/5">
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
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </p>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {formatTime(current)} / {formatTime(duration)}
            </p>
          </div>
        </div>
      )}

      {/* Thanh điều khiển */}
      <div className="flex items-center gap-3 border-t border-app-border px-4 py-3">
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
