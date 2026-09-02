import { useState } from "react";
import {
  Sprout,
  Thermometer,
  Droplets,
  CloudRain,
  FlaskConical,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Leaf,
  Activity,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { useApp } from "../context/AppContext";
import VoiceMicButton from "../components/VoiceMicButton";
import { parseSpokenSoilData, convertDevanagariDigits } from "../utils/voiceParser";
import { buildApiUrl } from "../utils/apiConfig";

export default function Recommendation({ nav }) {
  const { addRecommendation, language, t, tCrop } = useApp();

  const [form, setForm] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [voiceToast, setVoiceToast] = useState("");

  const handleVoiceSoilAutoFill = (transcript) => {
    const extracted = parseSpokenSoilData(transcript);
    if (Object.keys(extracted).length > 0) {
      setForm((prev) => ({
        ...prev,
        ...extracted,
      }));
      const keysCount = Object.keys(extracted).length;
      setVoiceToast(
        language === "mr"
          ? `✅ व्हॉइस इनपुटवरून ${keysCount} घटक भरले गेले!`
          : language === "hi"
          ? `✅ वॉइस इनपुट से ${keysCount} पैरामीटर भरे गए!`
          : `✅ Auto-filled ${keysCount} soil parameters from voice!`
      );
      setTimeout(() => setVoiceToast(""), 4500);
    } else {
      setVoiceToast(
        language === "mr"
          ? "कोणतेही माती घटक ओळखले नाहीत. कृपया उदा. 'नायट्रोजन ५०, फॉस्फरस ३०, पाऊस १२०' असे बोला."
          : language === "hi"
          ? "कोई पोषक तत्व नहीं पहचाने गए। कृपया उदा. 'नाइट्रोजन 50, फास्फोरस 30, वर्षा 120' बोलें।"
          : "No parameters detected. Try saying 'Nitrogen 50, Phosphorus 30, Rainfall 120'."
      );
      setTimeout(() => setVoiceToast(""), 4500);
    }
  };

  const handleSingleFieldVoice = (field, val) => {
    setForm((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (result) {
      setResult(null);
    }

    if (error) {
      setError("");
    }
  };

  const handleRecommend = async (e) => {
    e.preventDefault();

    setError("");
    setResult(null);

    const values = Object.values(form);

    if (values.some((value) => value === "")) {
      setError(t("fillAllFields"));
      return;
    }

    const numericValues = values.map(Number);

    if (
      numericValues.some(
        (value) => Number.isNaN(value)
      )
    ) {
      setError(t("invalidNumericValues"));
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        N: Number(form.nitrogen),
        P: Number(form.phosphorus),
        K: Number(form.potassium),
        temperature: Number(form.temperature),
        humidity: Number(form.humidity),
        ph: Number(form.ph),
        rainfall: Number(form.rainfall),
      };

      const response = await fetch(
        buildApiUrl("/recommend"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            t("recommendationFailed")
        );
      }

      const recommendation = {
        crop: data.recommended_crop,

        nitrogen: Number(form.nitrogen),
        phosphorus: Number(form.phosphorus),
        potassium: Number(form.potassium),
        temperature: Number(form.temperature),
        humidity: Number(form.humidity),
        ph: Number(form.ph),
        rainfall: Number(form.rainfall),
      };

      setResult(recommendation);

      addRecommendation(recommendation);
    } catch (err) {
      console.error(
        "Recommendation error:",
        err
      );

      setError(
        err.message ||
          t("backendConnectionError")
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      nitrogen: "",
      phosphorus: "",
      potassium: "",
      temperature: "",
      humidity: "",
      ph: "",
      rainfall: "",
    });

    setResult(null);
    setError("");
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">

      {/* HEADER */}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#174B1B] via-[#2E7D32] to-[#10B981] p-6 text-white shadow-lg sm:p-8">

        <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10" />

        <div className="absolute -bottom-20 right-32 h-40 w-40 rounded-full bg-white/10" />

        <div className="relative z-10 flex items-center justify-between gap-6">

          <div>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-semibold backdrop-blur-sm">
              <Sparkles size={13} />
              {t("aiCropRecommendation")}
            </div>

            <h1 className="text-2xl font-extrabold sm:text-3xl">
              {t("cropRecommendation")}
            </h1>

            <p className="mt-2 max-w-2xl text-xs leading-6 text-green-50/80 sm:text-sm">
              {t("recommendationDescription")}
            </p>

          </div>

          <div className="hidden rounded-3xl bg-white/10 p-5 backdrop-blur-md lg:block">
            <Leaf
              size={55}
              strokeWidth={1.3}
            />
          </div>

        </div>
      </div>


      {/* ERROR */}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">

          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0 text-red-500"
          />

          <div>

            <p className="text-sm font-bold text-red-700">
              {t("error")}
            </p>

            <p className="mt-1 text-xs leading-5 text-red-600">
              {error}
            </p>

            <p className="mt-2 text-[11px] leading-5 text-red-500">
              {t("makeSureBackendRunning")}
            </p>

          </div>

        </div>
      )}


      {/* MAIN CONTENT */}

      <div className="grid gap-6 xl:grid-cols-[1.55fr_0.85fr]">

        {/* FORM */}

        <div className="overflow-hidden rounded-3xl border border-[#DCE8D9] bg-white shadow-sm">

          <div className="border-b border-[#E8EFE6] bg-gradient-to-r from-[#F7FBF5] to-white p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3E6] text-[#2E7D32]">
                <Sprout size={23} />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-gray-800">
                  {t("soilClimateInformation")}
                </h2>
                <p className="mt-1 text-[11px] text-gray-400">
                  {t("enterFarmConditions")}
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleRecommend}
            className="grid gap-5 p-6 sm:grid-cols-2"
          >
            {/* SMART VOICE AUTO-FILL BANNER */}
            <div className="col-span-1 sm:col-span-2 rounded-2xl border border-green-200 bg-gradient-to-r from-[#F0F8ED] via-[#F7FCF5] to-white p-4 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <VoiceMicButton onTranscript={handleVoiceSoilAutoFill} size="md" />
                  <div>
                    <h4 className="text-xs font-bold text-[#1B5E20]">
                      {language === "mr"
                        ? "🎙️ बोलून माती घटक भरा (Voice Auto-Fill)"
                        : language === "hi"
                        ? "🎙️ बोलकर मृदा पैरामीटर भरें (Voice Auto-Fill)"
                        : "🎙️ Dictate Soil & Climate Parameters (Voice Auto-Fill)"}
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      {language === "mr"
                        ? 'उदा. "नायट्रोजन ५०, फॉस्फरस ३०, पोटॅशियम ४०, पाऊस १२०, सामू ६.५"'
                        : language === "hi"
                        ? 'उदा. "नाइट्रोजन 50, फास्फोरस 30, पोटाश 40, वर्षा 120, पीएच 6.5"'
                        : 'e.g. "Nitrogen 50, Phosphorus 30, Potassium 40, Rainfall 120, pH 6.5"'}
                    </p>
                  </div>
                </div>
              </div>
              {voiceToast && (
                <div className="mt-2.5 rounded-xl bg-white border border-green-300 p-2 text-xs font-semibold text-[#1B5E20] animate-fade-in flex items-center gap-1.5">
                  <span>{voiceToast}</span>
                </div>
              )}
            </div>

            <NumberInput
              label={t("nitrogen")}
              name="nitrogen"
              value={form.nitrogen}
              onChange={handleChange}
              onVoiceInput={(val) => handleSingleFieldVoice("nitrogen", val)}
              placeholder="e.g. 90"
              icon={<Activity size={15} />}
              suffix="kg/ha"
            />

            <NumberInput
              label={t("phosphorus")}
              name="phosphorus"
              value={form.phosphorus}
              onChange={handleChange}
              onVoiceInput={(val) => handleSingleFieldVoice("phosphorus", val)}
              placeholder="e.g. 42"
              icon={<Activity size={15} />}
              suffix="kg/ha"
            />

            <NumberInput
              label={t("potassium")}
              name="potassium"
              value={form.potassium}
              onChange={handleChange}
              onVoiceInput={(val) => handleSingleFieldVoice("potassium", val)}
              placeholder="e.g. 43"
              icon={<Activity size={15} />}
              suffix="kg/ha"
            />

            <NumberInput
              label={t("temperature")}
              name="temperature"
              value={form.temperature}
              onChange={handleChange}
              onVoiceInput={(val) => handleSingleFieldVoice("temperature", val)}
              placeholder="e.g. 27"
              icon={<Thermometer size={15} />}
              suffix="°C"
              step="0.1"
            />

            <NumberInput
              label={t("humidity")}
              name="humidity"
              value={form.humidity}
              onChange={handleChange}
              onVoiceInput={(val) => handleSingleFieldVoice("humidity", val)}
              placeholder="e.g. 75"
              icon={<Droplets size={15} />}
              suffix="%"
              step="0.1"
            />

            <NumberInput
              label={t("soilPh")}
              name="ph"
              value={form.ph}
              onChange={handleChange}
              onVoiceInput={(val) => handleSingleFieldVoice("ph", val)}
              placeholder="e.g. 6.5"
              icon={<FlaskConical size={15} />}
              suffix="pH"
              step="0.01"
            />

            <NumberInput
              label={t("rainfall")}
              name="rainfall"
              value={form.rainfall}
              onChange={handleChange}
              onVoiceInput={(val) => handleSingleFieldVoice("rainfall", val)}
              placeholder="e.g. 202"
              icon={<CloudRain size={15} />}
              suffix="mm"
              step="0.1"
            />

            <div className="flex items-end">

              <div className="w-full rounded-2xl border border-dashed border-[#CFE1CB] bg-[#F8FBF7] p-4">

                <div className="flex items-center gap-2 text-[#2E7D32]">
                  <Sparkles size={15} />

                  <span className="text-[11px] font-bold">
                    {t("mlRecommendationModel")}
                  </span>
                </div>

                <p className="mt-1 text-[10px] leading-4 text-gray-400">
                  {t("mlRecommendationDescription")}
                </p>

              </div>

            </div>

            <div className="flex gap-3 pt-2 sm:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-shimmer btn-glow group flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#2E7D32] to-[#10B981] px-5 py-3.5 text-xs font-bold text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                    {t("analyzingConditions")}
                  </>
                ) : (
                  <>
                    <Sprout size={16} />
                    {t("recommendBestCrop")}
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1.5"
                    />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="key-cap rounded-2xl border border-[#DCE8D9] bg-white px-4 py-3.5 text-gray-500 transition hover:bg-[#EAF3E6] hover:text-[#2E7D32] disabled:opacity-50 cursor-pointer"
                title={t("reset")}
                aria-label={t("reset")}
              >
                <RotateCcw size={16} />
              </button>
            </div>

          </form>
        </div>


        {/* SIDE INFORMATION */}

        <div className="relative overflow-hidden rounded-3xl border border-[#DCE8D9] bg-white shadow-sm">

          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#EAF3E6]" />

          <div className="relative z-10 p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF3E6] text-[#2E7D32]">
                <Sparkles size={20} />
              </div>

              <div>

                <h2 className="text-sm font-extrabold text-gray-800">
                  {t("howKrushiMitraWorks")}
                </h2>

                <p className="mt-1 text-[10px] text-gray-400">
                  {t("aiCropSuitabilityAnalysis")}
                </p>

              </div>

            </div>

            <div className="mt-7 space-y-4">

              <InfoItem
                number="01"
                title={t("soilAnalysis")}
                text={t("soilAnalysisDescription")}
              />

              <InfoItem
                number="02"
                title={t("climateAnalysis")}
                text={t("climateAnalysisDescription")}
              />

              <InfoItem
                number="03"
                title={t("aiRecommendation")}
                text={t("aiRecommendationDescription")}
              />

            </div>

            <div className="mt-7 rounded-2xl bg-[#F6F9F4] p-4">

              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {t("parameters")}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">

                <MiniStat
                  label="N"
                  value={form.nitrogen || "--"}
                />

                <MiniStat
                  label="P"
                  value={form.phosphorus || "--"}
                />

                <MiniStat
                  label="K"
                  value={form.potassium || "--"}
                />

                <MiniStat
                  label="pH"
                  value={form.ph || "--"}
                />

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* RESULT */}

      {result && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#174B1B] via-[#2E7D32] to-[#10B981] p-6 text-white shadow-[0_20px_50px_rgba(46,125,50,0.3)] sm:p-8 animate-zoom-fade depth-3 glow-emerald border border-white/20">

          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/15 blur-2xl animate-float-slow" />
          <div className="pointer-events-none absolute -bottom-20 right-20 h-48 w-48 rounded-full bg-yellow-300/15 blur-3xl" />

          <div className="relative z-10">

            <div className="flex items-center gap-2 text-green-100">

              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                <CheckCircle2 size={14} className="text-white" />
              </span>

              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/15 px-2.5 py-1 rounded-full backdrop-blur-xs">
                {t("aiRecommendationComplete")}
              </span>

            </div>

            <div className="mt-6">

              <p className="text-xs font-semibold text-green-100">
                {t("recommendedCrop")}
              </p>

              <h2 className="mt-2 text-4xl font-black sm:text-5xl flex items-center gap-3 tracking-tight">
                <span className="animate-float-slow inline-block select-none filter drop-shadow-md">🌾</span>
                <span className="drop-shadow-sm">{tCrop(result.crop)}</span>
              </h2>

              <p className="mt-3 max-w-xl text-xs leading-5 text-green-50/90 font-medium">
                {t("recommendationResultDescription")}
              </p>

            </div>

            <div className="mt-7 flex flex-wrap gap-3">

              <button
                onClick={resetForm}
                className="btn-shimmer btn-glow flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-extrabold text-[#2E7D32] shadow-md transition hover:-translate-y-0.5 hover:bg-green-50 active:scale-95 cursor-pointer"
              >
                <RotateCcw size={14} />
                {t("newRecommendation")}
              </button>

            </div>

          </div>

        </div>
      )}


      {/* INFORMATION CARDS */}

      <div className="grid gap-4 md:grid-cols-3">

        <InfoCard
          icon="🧪"
          title={t("soilNutrients")}
          text={t("soilNutrientsDescription")}
        />

        <InfoCard
          icon="🌦️"
          title={t("climateConditions")}
          text={t("climateConditionsDescription")}
        />

        <InfoCard
          icon="🌱"
          title={t("seasonalSuitability")}
          text={t("seasonalSuitabilityDescription")}
        />

      </div>


      {/* BACK */}

      <button
        onClick={() =>
          nav?.("dashboard")
        }
        className="inline-flex items-center gap-2 rounded-xl bg-[#2E7D32] px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#1B5E20] hover:shadow-md"
      >
        ← {t("backToDashboard")}
      </button>

    </div>
  );
}


/* =========================================================
   NUMBER INPUT
========================================================= */

function NumberInput({
  label,
  name,
  value,
  onChange,
  onVoiceInput,
  placeholder,
  icon,
  suffix,
  step = "1",
}) {
  const handleSingleVoice = (spokenText) => {
    const clean = convertDevanagariDigits(spokenText);
    const numMatch = clean.match(/(\d+(\.\d+)?)/);
    if (numMatch && onVoiceInput) {
      onVoiceInput(numMatch[1]);
    }
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
          <span className="text-[#2E7D32]">
            {icon}
          </span>
          {label}
        </label>
        {onVoiceInput && (
          <VoiceMicButton onTranscript={handleSingleVoice} size="sm" />
        )}
      </div>

      <div className="relative">
        <input
          type="number"
          min="0"
          step={step}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-xl border border-[#DCE8D9] bg-white px-4 py-3 pr-20 text-sm text-gray-800 outline-none transition duration-200 placeholder:text-gray-400 focus:border-[#2E7D32] focus:ring-4 focus:ring-green-50"
        />

        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-gray-500">
          {suffix}
        </span>
      </div>
    </div>
  );
}


/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({
  number,
  title,
  text,
}) {
  return (
    <div className="flex gap-3">

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF3E6] text-[9px] font-extrabold text-[#2E7D32]">
        {number}
      </div>

      <div>

        <h3 className="text-xs font-bold text-gray-800">
          {title}
        </h3>

        <p className="mt-1 text-[11px] leading-4 text-gray-500">
          {text}
        </p>

      </div>

    </div>
  );
}


/* =========================================================
   MINI STAT
========================================================= */

function MiniStat({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-[#DCE8D9] bg-white p-3 shadow-2xs">

      <p className="text-[10px] font-bold text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-extrabold text-[#2E7D32]">
        {value}
      </p>

    </div>
  );
}


/* =========================================================
   INFORMATION CARD
========================================================= */

function InfoCard({
  icon,
  title,
  text,
}) {
  return (
    <div className="card card-interactive group rounded-2xl border border-[#DCE8D9] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">

      <div className="flex items-start gap-3">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF3E6] text-lg transition group-hover:scale-110">
          {icon}
        </div>

        <div>

          <h3 className="text-xs font-bold text-gray-800">
            {title}
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-gray-500">
            {text}
          </p>

        </div>

      </div>

    </div>
  );
}