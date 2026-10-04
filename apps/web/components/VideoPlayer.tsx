"use client";
import React, { useState, useRef } from "react";
import { Button } from "./ui/button";

interface VideoPlayerProps {
  title: string;
  director: string;
  streamPlaybackUrl?: string; // Signed Cloudflare Stream or MP4 URL
  trailerUrl?: string;
  isWatermarked?: boolean;
  watermarkText?: string;
  onProgressUpdate?: (seconds: number, percent: number) => void;
}

export function VideoPlayer({
  title,
  director,
  streamPlaybackUrl,
  trailerUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  isWatermarked = true,
  watermarkText = "FILMDROP SECURE STREAM • ID #82914-USER",
  onProgressUpdate,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);

  const videoSource = streamPlaybackUrl || trailerUrl;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setCurrentTime(current);
    if (onProgressUpdate) {
      onProgressUpdate(current, (current / dur) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = target;
      setCurrentTime(target);
    }
  };

  const toggleFullscreen = () => {
    const elem = document.getElementById("player-container");
    if (!elem) return;
    if (!document.fullscreenElement) {
      elem.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  return (
    <div
      id="player-container"
      className="group relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={videoSource}
        className="h-full w-full object-contain cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        playsInline
      />

      {/* Dynamic Watermark to protect indie filmmakers */}
      {isWatermarked && (
        <div className="pointer-events-none absolute top-4 right-4 z-20 select-none opacity-20 text-[10px] font-mono tracking-widest text-white uppercase">
          {watermarkText}
        </div>
      )}

      {/* Center Big Play Button when paused */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer backdrop-blur-[2px]"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-500 text-neutral-950 shadow-2xl shadow-amber-500/50 hover:scale-110 transition-transform">
            <span className="ml-1.5 text-2xl font-black">▶</span>
          </div>
        </div>
      )}

      {/* Player Overlays & Controls */}
      <div
        className={`absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 transition-opacity duration-300 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Scrubber */}
        <div className="relative mb-3 flex items-center">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-amber-500 hover:h-2 transition-all"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              className="text-white hover:text-amber-400"
            >
              {isPlaying ? "❚❚" : "▶"}
            </Button>
            <div className="text-xs font-mono text-slate-300">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            <div className="hidden sm:block text-xs font-semibold text-slate-400 border-l border-slate-700 pl-3">
              {title} • <span className="text-slate-500">{director}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="text-slate-300 hover:text-white"
            >
              ⛶
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
