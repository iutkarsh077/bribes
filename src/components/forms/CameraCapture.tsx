"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, Upload, RotateCcw, Trash2, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraCaptureProps {
  onImageCaptured: (file: File, previewUrl: string) => void;
  onImageRemoved: () => void;
  currentPreviewUrl?: string;
}

export function CameraCapture({
  onImageCaptured,
  onImageRemoved,
  currentPreviewUrl,
}: CameraCaptureProps) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentPreviewUrl || null);
  const [error, setError] = useState<string | null>(null);
  const [imageMeta, setImageMeta] = useState<{ size: string; dimensions?: string } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (currentPreviewUrl) {
      setPreview(currentPreviewUrl);
    }
  }, [currentPreviewUrl]);

  // Clean up media stream on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    setError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (cameraInputRef.current) {
          cameraInputRef.current.click();
        }
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      mediaStreamRef.current = stream;
      setIsCameraActive(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(console.error);
        }
      }, 100);
    } catch (err: any) {
      console.warn("Direct webcam access failed, falling back to native camera input", err);
      if (cameraInputRef.current) {
        cameraInputRef.current.click();
      } else {
        setError("Camera permission denied. Please select an image file or allow camera permissions.");
      }
    }
  };

  const takeSnapshot = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError("Failed to capture image snapshot.");
          return;
        }

        const file = new File([blob], `evidence-${Date.now()}.webp`, {
          type: "image/webp",
        });

        const previewUrl = URL.createObjectURL(blob);
        setPreview(previewUrl);
        setImageMeta({
          size: `${(blob.size / 1024).toFixed(1)} KB`,
          dimensions: `${canvas.width}x${canvas.height}`,
        });

        onImageCaptured(file, previewUrl);
        stopCameraStream();
      },
      "image/webp",
      0.85
    );
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowed.includes(file.type.toLowerCase())) {
      setError("Invalid file format. Please upload JPG, PNG, or WEBP.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit.");
      return;
    }

    setError(null);
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setImageMeta({
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
    });

    onImageCaptured(file, previewUrl);
  };

  const handleRemove = () => {
    setPreview(null);
    setImageMeta(null);
    setError(null);
    stopCameraStream();
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    onImageRemoved();
  };

  return (
    <div className="w-full space-y-4">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileSelected}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* State 1: Live Viewfinder */}
      {isCameraActive && (
        <div className="relative aspect-[4/3] w-full max-w-lg mx-auto rounded-lg overflow-hidden bg-black border border-slate-700 shadow-md">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
          />

          <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-[10px] font-mono px-2.5 py-1 rounded flex items-center gap-1.5 border border-slate-700">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            <span>LIVE EVIDENCE VIEWFINDER</span>
          </div>

          <div className="absolute bottom-4 inset-x-0 flex items-center justify-between px-6">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={stopCameraStream}
              className="bg-slate-900/80 text-white border-slate-700 hover:bg-slate-800 text-xs"
            >
              Cancel
            </Button>

            <button
              type="button"
              onClick={takeSnapshot}
              className="h-14 w-14 rounded-full border-4 border-white bg-amber-400 hover:bg-amber-300 shadow-lg active:scale-95 transition-transform flex items-center justify-center cursor-pointer"
              aria-label="Capture evidence"
            >
              <div className="h-10 w-10 rounded-full border border-slate-900/30" />
            </button>
            <div className="w-14" />
          </div>
        </div>
      )}

      {/* State 2: Photo Captured & Attached */}
      {!isCameraActive && preview && (
        <div className="rounded-lg border border-slate-300 bg-white p-4 max-w-lg mx-auto space-y-3 shadow-xs">
          <div className="relative aspect-[4/3] w-full rounded-md overflow-hidden bg-slate-950 border border-slate-200">
            <img
              src={preview}
              alt="Attached evidence preview"
              className="h-full w-full object-contain"
            />
            <div className="absolute top-3 right-3 bg-slate-900/90 text-emerald-300 text-[11px] font-mono font-bold px-2.5 py-1 rounded flex items-center gap-1 border border-slate-700">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              EVIDENCE ATTACHED
            </div>
            <div className="absolute bottom-2 left-2 bg-slate-900/90 text-slate-300 text-[9px] font-mono px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1">
              <ShieldCheck className="h-2.5 w-2.5 text-emerald-400" />
              EXIF PURGE READY
            </div>
          </div>

          {imageMeta && (
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 px-1">
              <span>Resolution: {imageMeta.dimensions || "Original"}</span>
              <span>Size: {imageMeta.size}</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={startCamera}
              className="flex-1 gap-1.5 text-xs font-semibold uppercase tracking-wider border-slate-300"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Retake
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 gap-1.5 text-xs font-semibold uppercase tracking-wider border-slate-300"
            >
              <Upload className="h-3.5 w-3.5" />
              Replace
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              className="gap-1 text-xs"
              aria-label="Remove image"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* State 3: Empty State */}
      {!isCameraActive && !preview && (
        <div className="rounded-lg border-2 border-dashed border-slate-300 p-8 text-center max-w-lg mx-auto bg-slate-50 space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-slate-200 text-slate-700">
            <Camera className="h-6 w-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-mono">
              Exhibit Photographic Evidence
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Capture or upload an image of the public office, official refusal notice, defective work, or location. Camera and GPS EXIF metadata will be scrubbed automatically.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              type="button"
              size="default"
              onClick={startCamera}
              className="w-full sm:w-auto gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-xs"
            >
              <Camera className="h-4 w-4 text-amber-400" />
              Open Camera
            </Button>

            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto gap-2 border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider"
            >
              <Upload className="h-3.5 w-3.5 text-slate-500" />
              Upload from Device
            </Button>
          </div>

          <p className="text-[10px] font-mono text-slate-400">
            SUPPORTED FORMATS: JPG, PNG, WEBP (MAX 10MB)
          </p>
        </div>
      )}

      {error && (
        <div className="max-w-lg mx-auto flex items-center gap-2 p-3 rounded bg-amber-50 border border-amber-300 text-amber-900 text-xs">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-700" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
