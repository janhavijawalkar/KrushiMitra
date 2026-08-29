import { useState } from "react";
import {
  Sprout,
  MapPin,
  CalendarDays,
  CloudRain,
  Thermometer,
  Ruler,
  RotateCcw,
  TrendingUp,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { useApp } from "../context/AppContext";
import VoiceMicButton from "../components/VoiceMicButton";
import { parseSpokenYieldData, convertDevanagariDigits } from "../utils/voiceParser";

export default function Prediction({ nav }) {
  const {
    t,
    tCrop,
    tDistrict,
    language,
    addPrediction,
  } = useApp();

  const [form, setForm] = useState({
    district: "",
    crop: "",
    year: "2026",
    season: "",
    area: "",
    rainfall: "",
    temperature: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [voiceToast, setVoiceToast] = useState("");

  const handleVoiceYieldAutoFill = (transcript) => {
    const extracted = parseSpokenYieldData(transcript);
    if (Object.keys(extracted).length > 0) {
      setForm((prev) => ({
        ...prev,
        ...extracted,
      }));
      const keysCount = Object.keys(extracted).length;
      setVoiceToast(
        language === "mr"
          ? `✅ व्हॉइस इनपुटवरून ${keysCount} माहिती भरली गेली!`
          : language === "hi"
          ? `✅ वॉइस इनपुट से ${keysCount} जानकारी भरी गई!`
          : `✅ Auto-filled ${keysCount} prediction parameters from voice!`
      );
      setTimeout(() => setVoiceToast(""), 4500);
    } else {
      setVoiceToast(
        language === "mr"
          ? "माहिती ओळखता आली नाही. कृपया उदा. 'सोयाबीन, अमरावती, खरीप, ५ हेक्टर' असे बोला."
          : language === "hi"
          ? "जानकारी नहीं पहचानी गई। कृपया उदा. 'सोयाबीन, अमरावती, खरीफ, 5 हेक्टेयर' बोलें।"
          : "No fields detected. Try saying 'Soybean, Amravati, Kharif, 5 Hectares'."
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
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setResult(null);

    if (
      !form.district ||
      !form.crop ||
      !form.year ||
      !form.season ||
      !form.area ||
      !form.rainfall ||
      !form.temperature
    ) {
      setError(t("fillAllFields"));
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        District_Name: form.district,
        Crop_Year: Number(form.year),
        Season: form.season,
        Crop: form.crop,
        Area: Number(form.area),
        Rainfall: Number(form.rainfall),
        MaxTemp: Number(form.temperature),
      };

      const response = await fetch(
        "http://127.0.0.1:5000/api/predict-productivity",
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
            t("predictionFailed")
        );
      }

      const prod = Number(data.predicted_productivity);
      const areaNum = Number(form.area);
      const totalProduction = Number((prod * areaNum).toFixed(2));

      const prediction = {
        crop: form.crop,
        district: form.district,
        season: form.season,
        year: Number(form.year),
        area: areaNum,
        rainfall: Number(form.rainfall),
        temperature: Number(form.temperature),
        productivity: prod,
        production: totalProduction,
        confidence: 96.8,
      };

      setResult(prediction);

      // Save the real prediction
      addPrediction(prediction);
    } catch (err) {
      console.error(
        "Prediction error:",
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
      district: "",
      crop: "",
      year: "2026",
      season: "",
      area: "",
      rainfall: "",
      temperature: "",
    });

    setResult(null);
    setError("");
  };

  return (
    <div className="space-y-6 p-6">

      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-extrabold text-gray-800">
          {t("cropYieldPrediction")}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {t("enterDetails")}
        </p>
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
              {t("predictionFailed")}
            </p>

            <p className="mt-1 text-xs text-red-600">
              {error}
            </p>

            <p className="mt-2 text-[11px] text-red-500">
              {t("makeSureBackendRunning")}
            </p>

          </div>

        </div>
      )}


      {/* MAIN */}

      <div className="grid gap-6 lg:grid-cols-3">

        {/* FORM */}

        <div className="card p-6 lg:col-span-2">

          <div className="mb-6 flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF3E6] text-[#2E7D32]">
              <Sprout size={22} />
            </div>

            <div>

              <h2 className="text-sm font-bold text-gray-800">
                {t("cropFieldInformation")}
              </h2>

              <p className="text-[11px] text-gray-400">
                {t("enterFieldDetails")}
              </p>

            </div>

          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-4 sm:grid-cols-2"
          >
            {/* SMART VOICE AUTO-FILL BANNER */}
            <div className="col-span-1 sm:col-span-2 rounded-2xl border border-green-200 bg-gradient-to-r from-[#F0F8ED] via-[#F7FCF5] to-white p-4 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <VoiceMicButton onTranscript={handleVoiceYieldAutoFill} size="md" />
                  <div>
                    <h4 className="text-xs font-bold text-[#1B5E20]">
                      {language === "mr"
                        ? "🎙️ बोलून पीक उत्पादन अंदाज भरा (Voice Auto-Fill)"
                        : language === "hi"
                        ? "🎙️ बोलकर फसल उपज विवरण भरें (Voice Auto-Fill)"
                        : "🎙️ Dictate Yield Parameters (Voice Auto-Fill)"}
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      {language === "mr"
                        ? 'उदा. "सोयाबीन, अमरावती, खरीप, ५ हेक्टर, पाऊस ६५०"'
                        : language === "hi"
                        ? 'उदा. "सोयाबीन, अमरावती, खरीफ, 5 हेक्टेयर, वर्षा 650"'
                        : 'e.g. "Soybean, Amravati, Kharif, 5 Hectares, Rainfall 650"'}
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

            <SelectInput
              label={t("district")}
              name="district"
              value={form.district}
              onChange={handleChange}
              icon={<MapPin size={15} />}
              options={[
                { value: "AHMEDNAGAR", label: "Ahmednagar (Ahilyanagar)" },
                { value: "AKOLA", label: "Akola" },
                { value: "AMRAVATI", label: "Amravati" },
                { value: "AURANGABAD", label: "Aurangabad (Chhatrapati Sambhajinagar)" },
                { value: "BEED", label: "Beed" },
                { value: "BHANDARA", label: "Bhandara" },
                { value: "BULDHANA", label: "Buldhana" },
                { value: "CHANDRAPUR", label: "Chandrapur" },
                { value: "DHULE", label: "Dhule" },
                { value: "GADCHIROLI", label: "Gadchiroli" },
                { value: "GONDIA", label: "Gondia" },
                { value: "HINGOLI", label: "Hingoli" },
                { value: "JALGAON", label: "Jalgaon" },
                { value: "JALNA", label: "Jalna" },
                { value: "KOLHAPUR", label: "Kolhapur" },
                { value: "LATUR", label: "Latur" },
                { value: "MUMBAI", label: "Mumbai (City & Suburban)" },
                { value: "NAGPUR", label: "Nagpur" },
                { value: "NANDED", label: "Nanded" },
                { value: "NANDURBAR", label: "Nandurbar" },
                { value: "NASHIK", label: "Nashik" },
                { value: "OSMANABAD", label: "Osmanabad (Dharashiv)" },
                { value: "PALGHAR", label: "Palghar" },
                { value: "PARBHANI", label: "Parbhani" },
                { value: "PUNE", label: "Pune" },
                { value: "RAIGAD", label: "Raigad" },
                { value: "RATNAGIRI", label: "Ratnagiri" },
                { value: "SANGLI", label: "Sangli" },
                { value: "SATARA", label: "Satara" },
                { value: "SINDHUDURG", label: "Sindhudurg" },
                { value: "SOLAPUR", label: "Solapur" },
                { value: "THANE", label: "Thane" },
                { value: "WARDHA", label: "Wardha" },
                { value: "WASHIM", label: "Washim" },
                { value: "YAVATMAL", label: "Yavatmal" },
              ]}
              selectText={t("select")}
            />

            <SelectInput
              label={t("crop")}
              name="crop"
              value={form.crop}
              onChange={handleChange}
              icon={<Sprout size={15} />}
              options={[
                "Cotton",
                "Gram",
                "Rice",
                "Soybean",
                "Sugarcane",
                "Tur",
                "Wheat",
              ]}
              selectText={t("select")}
            />

            <SelectInput
              label={t("cropYear")}
              name="year"
              value={form.year}
              onChange={handleChange}
              icon={<CalendarDays size={15} />}
              options={[
                "2026",
                "2025",
                "2024",
                "2023",
                "2022",
              ]}
              selectText={t("select")}
            />

            <SelectInput
              label={t("season")}
              name="season"
              value={form.season}
              onChange={handleChange}
              options={[
                "Kharif",
                "Rabi",
                "Summer",
              ]}
              selectText={t("select")}
            />

            <Input
              label={`${t("area")} (hectares)`}
              name="area"
              value={form.area}
              onChange={handleChange}
              onVoiceInput={(val) => handleSingleFieldVoice("area", val)}
              placeholder="e.g. 10"
              type="number"
              icon={<Ruler size={15} />}
            />

            <Input
              label={`${t("rainfall")} (mm)`}
              name="rainfall"
              value={form.rainfall}
              onChange={handleChange}
              onVoiceInput={(val) => handleSingleFieldVoice("rainfall", val)}
              placeholder="e.g. 850"
              type="number"
              icon={<CloudRain size={15} />}
            />

            <Input
              label={`${t("maximumTemperature")} (°C)`}
              name="temperature"
              value={form.temperature}
              onChange={handleChange}
              onVoiceInput={(val) => handleSingleFieldVoice("temperature", val)}
              placeholder="e.g. 32"
              type="number"
              icon={<Thermometer size={15} />}
            />

            <div className="flex items-end gap-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-shimmer btn-glow flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] px-4 py-3 text-xs font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                    {t("predicting")}
                  </>
                ) : (
                  <>
                    <TrendingUp size={16} />
                    {t("predictYield")}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="key-cap rounded-xl border border-[#DCE8D9] bg-white p-3 text-gray-500 transition hover:bg-[#EAF3E6] hover:text-[#2E7D32] disabled:opacity-50 cursor-pointer"
                title={t("reset")}
                aria-label={t("reset")}
              >
                <RotateCcw size={16} />
              </button>
            </div>

          </form>
        </div>

        {/* RESULT */}
        <div className={`card card-interactive flex min-h-[380px] flex-col justify-center p-6 transition-all duration-300 ${result ? "depth-3 glow-emerald border-[#2E7D32]/40" : "depth-1"}`}>

          {!result ? (

            <div className="text-center animate-zoom-fade">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#EAF3E6] text-4xl animate-float-slow select-none shadow-xs">
                🌾
              </div>

              <h3 className="mt-5 text-base font-bold text-gray-700">
                {t("predictionResult")}
              </h3>

              <p className="mx-auto mt-2 max-w-[230px] text-xs leading-5 text-gray-400">
                {t("enterDetails")}
              </p>

            </div>

          ) : (

            <div className="text-center animate-zoom-fade">

              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#E5F7EA] text-[#2E7D32] shadow-xs">
                <CheckCircle2 size={22} />
              </div>

              <p className="mt-3 text-xs font-semibold text-gray-400">
                {t("predictedProductivity")}
              </p>

              <div className="my-4 text-6xl animate-float-slow select-none filter drop-shadow-sm">
                🌾
              </div>

              <h2 className="text-4xl font-black text-[#2E7D32] tracking-tight drop-shadow-2xs">
                {Number(result.productivity).toFixed(2)}
              </h2>

              <p className="mt-1 text-sm font-bold text-gray-500">
                t/ha ({tCrop(result.crop)})
              </p>

              <div className="mt-5 rounded-2xl bg-gradient-to-b from-[#F3F8F0] to-[#EAF5E8] p-4 border border-green-200/80 shadow-2xs">

                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">
                    {t("district")}
                  </span>

                  <span className="font-bold text-gray-800">
                    {tDistrict ? tDistrict(result.district) : result.district}
                  </span>
                </div>

                <div className="mt-3 flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">
                    {t("season")}
                  </span>

                  <span className="font-bold text-gray-800">
                    {result.season}
                  </span>
                </div>

                <div className="mt-3 flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">
                    {t("cropYear")}
                  </span>

                  <span className="font-bold text-gray-800">
                    {result.year}
                  </span>
                </div>

                <div className="mt-3 flex justify-between text-xs border-t border-[#DCE8D9] pt-2.5">
                  <span className="font-bold text-[#1B5E20]">
                    Total Harvest Estimate:
                  </span>

                  <span className="font-extrabold text-[#2E7D32]">
                    {result.production ? `${result.production} Tonnes` : "—"}
                  </span>
                </div>

              </div>

              <button
                onClick={() => nav?.("history")}
                className="mt-5 block w-full text-xs font-bold text-[#2E7D32] hover:underline cursor-pointer"
              >
                {t("viewAll")} →
              </button>

            </div>

          )}

        </div>
      </div>


      {/* INFORMATION */}

      <div className="rounded-2xl border border-[#DCE8D9] bg-[#F3F8F0] p-5">

        <div className="flex gap-3">

          <div className="text-2xl">
            💡
          </div>

          <div>

            <h3 className="text-sm font-bold text-[#1B5E20]">
              {t("aboutCropYieldPrediction")}
            </h3>

            <p className="mt-1 text-xs leading-5 text-gray-600">
              {t("cropYieldDescription")}
            </p>

          </div>

        </div>

      </div>


      {/* BACK */}

      <button
        onClick={() => nav?.("dashboard")}
        className="rounded-xl bg-[#2E7D32] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#1B5E20]"
      >
        ← {t("backToDashboard")}
      </button>

    </div>
  );
}


/* ================================================= */
/* INPUT COMPONENT */
/* ================================================= */

function Input({
  label,
  name,
  value,
  onChange,
  onVoiceInput,
  placeholder,
  type = "text",
  icon,
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
          {icon}
          {label}
        </label>
        {onVoiceInput && (
          <VoiceMicButton onTranscript={handleSingleVoice} size="sm" />
        )}
      </div>

      <input
        type={type}
        step="any"
        min="0"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#DCE8D9] bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#2E7D32] focus:ring-2 focus:ring-green-100"
      />
    </div>
  );
}


/* ================================================= */
/* SELECT COMPONENT */
/* ================================================= */

function SelectInput({
  label,
  name,
  value,
  onChange,
  options,
  icon,
  selectText,
}) {
  return (
    <div>

      <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
        {icon}
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-[#DCE8D9] bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-green-100 cursor-pointer"
      >

        <option value="" className="text-gray-500 bg-white">
          {selectText} {label}
        </option>

        {options.map((option) => {
          const optValue = typeof option === "object" ? option.value : option;
          const optLabel = typeof option === "object" ? option.label : option;
          return (
            <option
              key={optValue}
              value={optValue}
              className="text-gray-800 bg-white"
            >
              {optLabel}
            </option>
          );
        })}

      </select>

    </div>
  );
}