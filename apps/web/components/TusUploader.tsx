"use client";
import React, { useState, useRef } from "react";
import { Button } from "./ui/button";
import { ProgressBar } from "./ui/progress";

interface TusUploaderProps {
  onUploadComplete?: (cloudflareUid: string, fileSize: number) => void;
  label?: string;
  acceptedTypes?: string;
}

export function TusUploader({
  onUploadComplete,
  label = "Upload Master Cinema File (ProRes / 4K H.264 / H.265)",
  acceptedTypes = "video/*",
}: TusUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState<string>("");
  const [isDone, setIsDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const simulateTusUpload = () => {
    if (!file) return;
    setIsUploading(true);
    setProgress(0);
    setUploadSpeed("32.4 MB/s");

    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setProgress(Math.min(100, current));
      if (current >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        setIsDone(true);
        if (onUploadComplete) {
          onUploadComplete("mock_cf_stream_uid_987654", file.size);
        }
      }
    }, 120);
  };

  return (
    <div className="w-full rounded-2xl border border-dashed border-slate-800 bg-slate-950/60 p-8 text-center">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleSelect}
        className="hidden"
      />

      {!file ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer flex flex-col items-center justify-center space-y-3"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className="text-base font-semibold text-white">{label}</p>
            <p className="text-xs text-slate-400 mt-1">
              Drag and drop master video or click to browse. Supports files up to 50 GB.
            </p>
          </div>
          <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs text-slate-300 font-mono">
            Tus.io Resumable Protocol Enabled
          </span>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-left rounded-xl bg-slate-900 p-4 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                🎞️
              </div>
              <div>
                <p className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">{file.name}</p>
                <p className="text-xs text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
            {!isUploading && !isDone && (
              <Button size="sm" variant="ghost" onClick={() => setFile(null)}>Remove</Button>
            )}
            {isDone && (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                ✓ Ready for Transcoding
              </span>
            )}
          </div>

          {isUploading && (
            <div className="space-y-2 text-left">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Uploading chunked stream... {progress}%</span>
                <span>{uploadSpeed}</span>
              </div>
              <ProgressBar value={progress} />
            </div>
          )}

          {!isUploading && !isDone && (
            <Button onClick={simulateTusUpload} className="w-full" variant="primary">
              Start Cloudflare Direct Upload
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
