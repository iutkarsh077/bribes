"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Camera,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Navigation,
  ShieldCheck,
  Building,
  Car,
  GraduationCap,
  HeartPulse,
  BadgeAlert,
  FileCheck2,
  Home,
  HelpCircle,
  Scale,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CameraCapture } from "./CameraCapture";
import { INCIDENT_CATEGORIES, IncidentCategory } from "@/types/report";

const CATEGORY_ICONS: Record<string, any> = {
  "Road & Infrastructure": Car,
  "Education": GraduationCap,
  "School": GraduationCap,
  "Hospital & Healthcare": HeartPulse,
  "Police": BadgeAlert,
  "Municipal Services": Building,
  "Government Office": Building,
  "License / Certificate": FileCheck2,
  "Land / Property": Home,
  "Other": HelpCircle,
};

export function ReportWizard() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const [uploadedRemoteUrl, setUploadedRemoteUrl] = useState<string>("");

  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [area, setArea] = useState("");

  const [category, setCategory] = useState<IncidentCategory>("Road & Infrastructure");
  const [description, setDescription] = useState("");

  const [statesList, setStatesList] = useState<string[]>([]);
  const [districtsList, setDistrictsList] = useState<string[]>([]);

  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);

  useEffect(() => {
    async function loadStates() {
      try {
        const res = await fetch("/api/locations/states");
        if (res.ok) {
          const data = await res.json();
          setStatesList(data.states || []);
        }
      } catch (err) {
        console.error("Failed to load states:", err);
      }
    }
    loadStates();
  }, []);

  useEffect(() => {
    if (!state) {
      setDistrictsList([]);
      return;
    }
    async function loadDistricts() {
      try {
        const res = await fetch(`/api/locations/districts?state=${encodeURIComponent(state)}`);
        if (res.ok) {
          const data = await res.json();
          setDistrictsList(data.districts || []);
        }
      } catch (err) {
        console.error("Failed to load districts:", err);
      }
    }
    loadDistricts();
  }, [state]);

  const handleAutoDetectLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }

    setIsDetectingLocation(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;

          const res = await fetch(`/api/locations/reverse?lat=${lat}&lon=${lon}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success) {
              if (data.state) setState(data.state);
              if (data.district) setDistrict(data.district);
              if (data.area) setArea(data.area);
            } else {
              setGeoError("Could not determine address automatically. Please select manually below.");
            }
          } else {
            setGeoError("Location lookup server error. Please select manually.");
          }
        } catch (e: any) {
          setGeoError("Failed to lookup address coordinates. Please select manually.");
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (err) => {
        setIsDetectingLocation(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError("Location access was denied. Please select your state and district manually.");
        } else {
          setGeoError("Unable to retrieve GPS coordinates. Please select manually.");
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const canProceedStep1 = Boolean(imageFile || uploadedRemoteUrl);
  const canProceedStep2 = Boolean(state.trim() && district.trim() && area.trim());

  const handleSubmitReport = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let finalImageUrl = uploadedRemoteUrl;

      if (!finalImageUrl && imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const uploadErr = await uploadRes.json();
          throw new Error(uploadErr.error || "Failed to process and upload image.");
        }

        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.url;
        setUploadedRemoteUrl(finalImageUrl);
      }

      const reportPayload = {
        imageUrl: finalImageUrl,
        category,
        state: state.trim(),
        district: district.trim(),
        area: area.trim(),
        description: description.trim(),
      };

      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportPayload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Submission failed. Please verify required fields.");
      }

      const result = await res.json();
      setSubmittedReportId(result.reportId);
      setCurrentStep(5);
    } catch (err: any) {
      setSubmitError(err.message || "An unexpected error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10 sm:py-16 text-black">
      {/* Whistleblower Security Assurance Header */}
      <div className="mb-6 p-3 rounded border border-black bg-white flex items-center justify-between text-xs shadow-2xs">
        <div className="flex items-center gap-2 font-mono font-bold">
          <Lock className="h-3.5 w-3.5 text-black" />
          <span>256-BIT ANONYMOUS INTAKE • ZERO IP LOGS</span>
        </div>
        <span className="text-[10px] uppercase font-mono text-zinc-500 font-bold">EXIF REDACT ACTIVE</span>
      </div>

      {/* Step Tracker Indicator */}
      {currentStep < 5 && (
        <div className="mb-8 space-y-2">
          <div className="grid grid-cols-4 text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500">
            <span className={currentStep >= 1 ? "text-black" : ""}>1. Evidence</span>
            <span className={currentStep >= 2 ? "text-black" : ""}>2. Locality</span>
            <span className={currentStep >= 3 ? "text-black" : ""}>3. Sector</span>
            <span className={currentStep >= 4 ? "text-black" : ""}>4. Review</span>
          </div>

          <div className="w-full bg-zinc-200 h-1.5 rounded overflow-hidden">
            <div
              className="bg-black h-full transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* STEP 1: CAPTURE EVIDENCE */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="space-y-1 border-b border-black pb-4">
            <h2 className="text-xl font-bold tracking-tight text-black font-serif">
              Exhibit Photographic Evidence
            </h2>
            <p className="text-xs text-zinc-600">
              Provide photographic documentation of the public office, road defect, delayed counter, or official notice.
            </p>
          </div>

          <CameraCapture
            onImageCaptured={(file, previewUrl) => {
              setImageFile(file);
              setImagePreviewUrl(previewUrl);
              setUploadedRemoteUrl("");
            }}
            onImageRemoved={() => {
              setImageFile(null);
              setImagePreviewUrl("");
              setUploadedRemoteUrl("");
            }}
            currentPreviewUrl={imagePreviewUrl}
          />

          <div className="flex justify-end pt-2">
            <Button
              size="default"
              onClick={() => setCurrentStep(2)}
              disabled={!canProceedStep1}
              className="w-full sm:w-auto gap-2 bg-black hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded"
            >
              Continue to Jurisdiction
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: LOCATION SELECTION */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="space-y-1 border-b border-black pb-4">
            <h2 className="text-xl font-bold tracking-tight text-black font-serif">
              Administrative Jurisdiction
            </h2>
            <p className="text-xs text-zinc-600">
              Specify the state, district, and public area where the demand or duty failure took place.
            </p>
          </div>

          {/* Quick Auto-Detect Button */}
          <div className="rounded border border-black bg-zinc-100 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded bg-black text-white flex items-center justify-center shrink-0">
                <Navigation className="h-4 w-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-black font-mono">
                  Detect Administrative Locality
                </p>
                <p className="text-[11px] text-zinc-600">
                  Fills state and district from current coordinates automatically.
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAutoDetectLocation}
              disabled={isDetectingLocation}
              className="w-full sm:w-auto gap-2 border-black text-xs font-bold uppercase tracking-wider bg-white text-black hover:bg-zinc-100 rounded"
            >
              {isDetectingLocation ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Resolving...
                </>
              ) : (
                <>
                  <MapPin className="h-3.5 w-3.5 text-black" />
                  Auto-Detect GPS
                </>
              )}
            </Button>
          </div>

          {geoError && (
            <p className="text-xs text-black bg-zinc-100 p-2.5 rounded border border-black font-mono">
              {geoError}
            </p>
          )}

          {/* Manual Selection Form */}
          <div className="space-y-4 bg-white p-6 rounded border border-black shadow-2xs">
            {/* State Select */}
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-black mb-1">
                State / Union Territory *
              </label>
              <select
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  setDistrict("");
                }}
                className="w-full h-10 px-3 rounded border border-black bg-white text-xs text-black focus:outline-none"
              >
                <option value="">-- Choose Indian State or UT --</option>
                {statesList.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* District Select */}
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-black mb-1">
                Administrative District *
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                disabled={!state}
                className="w-full h-10 px-3 rounded border border-black bg-white text-xs text-black focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <option value="">
                  {state ? "-- Select District --" : "Select State First"}
                </option>
                {districtsList.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Area / Locality */}
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-black mb-1">
                Office / Public Landmark / Locality *
              </label>
              <Input
                type="text"
                placeholder="e.g. Sub-Registrar Office, Tehsil Compound, Ward 12 Highway"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="h-10 text-xs bg-white text-white border-black"
              />
              <p className="text-[10px] text-zinc-500 mt-1 font-mono">
                NOTICE: Specify public offices or civic localities. Never submit residential home addresses.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(1)}
              className="gap-1.5 text-xs font-bold uppercase tracking-wider border-black text-black hover:bg-zinc-100 rounded"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Button>
            <Button
              size="default"
              onClick={() => setCurrentStep(3)}
              disabled={!canProceedStep2}
              className="gap-2 bg-black hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded"
            >
              Continue to Sector
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: CATEGORY & DESCRIPTION */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="space-y-1 border-b border-black pb-4">
            <h2 className="text-xl font-bold tracking-tight text-black font-serif">
              Administrative Sector & Incident Statement
            </h2>
            <p className="text-xs text-zinc-600">
              Select the public department involved and articulate the factual grievance.
            </p>
          </div>

          {/* Quick-select Category Grid */}
          <div className="space-y-2">
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-black">
              Public Department / Sector *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {INCIDENT_CATEGORIES.map((cat) => {
                const Icon = CATEGORY_ICONS[cat] || HelpCircle;
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`flex items-center gap-2 p-2.5 rounded border text-left text-xs transition-all cursor-pointer ${
                      isSelected
                        ? "border-black bg-black text-white font-bold"
                        : "border-black bg-white hover:bg-zinc-100 text-black"
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-white" : "text-black"}`} />
                    <span className="truncate text-[11px]">{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-black">
                Sworn Incident Statement (Optional)
              </label>
              <span className="text-[10px] font-mono text-zinc-500">{description.length}/1000</span>
            </div>
            <Textarea
              rows={4}
              placeholder="State the factual account neutrally (e.g. 'Clerk demanded ₹5,000 cash facilitation fee to release sanction order for building plan'). Avoid personal names or abusive language."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-xs leading-relaxed text-white bg-black border-black rounded"
            />
          </div>

          {/* Civic Redaction Rule */}
          <div className="rounded border border-black bg-zinc-100 p-3 text-xs text-black flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-black mt-0.5" />
            <span>
              <strong>Evidentiary Rule:</strong> Keep accounts factual and focused on public offices. Unverified personal accusations, phone numbers, or hate speech will be redacted during moderation.
            </span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(2)}
              className="gap-1.5 text-xs font-bold uppercase tracking-wider border-black text-black hover:bg-zinc-100 rounded"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Button>
            <Button
              size="default"
              onClick={() => setCurrentStep(4)}
              className="gap-2 bg-black hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded"
            >
              Review Affidavit
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & SUBMIT */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="space-y-1 border-b border-black pb-4">
            <h2 className="text-xl font-bold tracking-tight text-black font-serif">
              Review Docket for Submission
            </h2>
            <p className="text-xs text-zinc-600">
              Confirm the exhibited evidence and administrative details before permanent intake into the civic queue.
            </p>
          </div>

          {/* Review Docket Card */}
          <div className="rounded border border-black bg-white p-5 shadow-2xs space-y-4">
            {/* Photographic Preview */}
            <div className="relative aspect-[16/9] w-full rounded overflow-hidden bg-black border border-black">
              <img
                src={imagePreviewUrl}
                alt="Captured evidence preview"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-zinc-300 pt-3 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block font-bold">
                  Sector / Department
                </span>
                <p className="font-bold text-black mt-0.5">
                  {category}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block font-bold">
                  Administrative Jurisdiction
                </span>
                <p className="font-bold text-black mt-0.5">
                  {area}, {district}, {state}
                </p>
              </div>
            </div>

            <div className="border-t border-zinc-300 pt-3 text-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block font-bold">
                Incident Narrative
              </span>
              <p className="text-black mt-1 italic font-serif bg-zinc-50 p-2.5 rounded border border-zinc-300">
                &ldquo;{description || "No narrative provided. Photographic documentation attached."}&rdquo;
              </p>
            </div>

            <div className="border-t border-zinc-300 pt-3 flex items-center gap-2 text-[11px] font-mono text-black font-bold">
              <ShieldCheck className="h-4 w-4 text-black shrink-0" />
              <span>
                Anonymous Submission • Hashed IP Storage • Non-Reversible Anonymity
              </span>
            </div>
          </div>

          {submitError && (
            <div className="p-3 rounded bg-zinc-100 border border-black text-black text-xs flex items-center gap-2 font-mono">
              <AlertTriangle className="h-4 w-4 shrink-0 text-black" />
              <span>{submitError}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(3)}
              disabled={isSubmitting}
              className="gap-1.5 text-xs font-bold uppercase tracking-wider border-black text-black hover:bg-zinc-100 rounded"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Button>

            <Button
              size="default"
              onClick={handleSubmitReport}
              disabled={isSubmitting}
              className="gap-2 bg-black hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider px-6 rounded"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Recording Docket...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 text-white" />
                  Submit Anonymous Docket
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* STEP 5: SUBMISSION SUCCESS SCREEN */}
      {currentStep === 5 && (
        <div className="rounded border border-black bg-white p-8 text-center shadow-xs space-y-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-black text-white border border-black">
            <CheckCircle2 className="h-7 w-7 text-white" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-black uppercase tracking-widest bg-zinc-100 border border-black px-2.5 py-0.5 rounded">
              AFFIDAVIT LODGED IN CIVIC ARCHIVE
            </span>
            <h2 className="text-2xl font-bold text-black font-serif pt-1">
              Incident Documented Successfully
            </h2>
            <p className="text-xs text-zinc-600 max-w-md mx-auto leading-relaxed">
              Your report has been entered into the national civic queue. To prevent malicious spam and protect innocent citizens, entries undergo a rapid redaction check before appearing publicly.
            </p>
          </div>

          {submittedReportId && (
            <div className="rounded border border-black bg-zinc-50 p-4 max-w-sm mx-auto text-center space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                Official Case Docket Number
              </span>
              <p className="text-2xl font-mono font-bold text-black tracking-wider">
                {submittedReportId}
              </p>
              <p className="text-[10px] text-zinc-500">
                Retain this docket identifier for future reference or forwarding to ACB / Vigilance officers.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {submittedReportId && (
              <Link href={`/report/${submittedReportId}`}>
                <Button size="default" className="w-full sm:w-auto gap-2 bg-black hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded">
                  Examine Docket Record
                </Button>
              </Link>
            )}
            <Link href="/">
              <Button size="default" variant="outline" className="w-full sm:w-auto text-xs font-bold uppercase tracking-wider border-black text-black hover:bg-zinc-100 rounded">
                Return to Public Registry
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
