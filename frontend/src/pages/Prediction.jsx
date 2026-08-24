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

export default function Prediction({ nav }) {
  const {
    t,
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

      const prediction = {
        crop: form.crop,
        district: form.district,
        season: form.season,
        year: Number(form.year),
        area: Number(form.area),
        rainfall: Number(form.rainfall),
        temperature: Number(form.temperature),
        productivity: Number(
          data.predicted_productivity
        ),

        // Backend currently does not return confidence.
        confidence: null,
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

            <SelectInput
              label={t("district")}
              name="district"
              value={form.district}
              onChange={handleChange}
              icon={<MapPin size={15} />}
              options={[
                "AMRAVATI",
                "AKOLA",
                "BULDHANA",
                "NAGPUR",
                "PUNE",
                "NASHIK",
                "KOLHAPUR",
                "SOLAPUR",
                "SATARA",
                "YAVATMAL",
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
                "Soybean",
                "Sugarcane",
                "Wheat",
                "Rice",
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
              placeholder="e.g. 10"
              type="number"
              icon={<Ruler size={15} />}
            />

            <Input
              label={`${t("rainfall")} (mm)`}
              name="rainfall"
              value={form.rainfall}
              onChange={handleChange}
              placeholder="e.g. 850"
              type="number"
              icon={<CloudRain size={15} />}
            />

            <Input
              label={`${t("maximumTemperature")} (°C)`}
              name="temperature"
              value={form.temperature}
              onChange={handleChange}
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
        <div className="card card-interactive flex min-h-[380px] flex-col justify-center p-6 transition-all duration-300">

          {!result ? (

            <div className="text-center">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#EAF3E6] text-4xl">
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

            <div className="text-center">

              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#E5F7EA] text-[#2E7D32]">
                <CheckCircle2 size={22} />
              </div>

              <p className="mt-3 text-xs font-semibold text-gray-400">
                {t("predictedProductivity")}
              </p>

              <div className="my-5 text-6xl">
                🌾
              </div>

              <h2 className="text-4xl font-extrabold text-[#2E7D32]">
                {Number(result.productivity).toFixed(2)}
              </h2>

              <p className="mt-1 text-sm font-medium text-gray-500">
                t/ha
              </p>

              <div className="mt-5 rounded-2xl bg-[#F3F8F0] p-4">

                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">
                    {t("crop")}
                  </span>

                  <span className="font-bold text-gray-700">
                    {result.crop}
                  </span>
                </div>

                <div className="mt-3 flex justify-between text-xs">
                  <span className="text-gray-400">
                    {t("district")}
                  </span>

                  <span className="font-bold text-gray-700">
                    {result.district}
                  </span>
                </div>

                <div className="mt-3 flex justify-between text-xs">
                  <span className="text-gray-400">
                    {t("season")}
                  </span>

                  <span className="font-bold text-gray-700">
                    {result.season}
                  </span>
                </div>

                <div className="mt-3 flex justify-between text-xs">
                  <span className="text-gray-400">
                    {t("cropYear")}
                  </span>

                  <span className="font-bold text-gray-700">
                    {result.year}
                  </span>
                </div>

              </div>

              <div className="mt-4 inline-flex rounded-full bg-[#E5F7EA] px-4 py-2 text-[11px] font-bold text-[#2E7D32]">
                ✓ {t("aiModelPrediction")}
              </div>

              <button
                onClick={() => nav?.("history")}
                className="mt-4 block w-full text-xs font-bold text-[#2E7D32] hover:underline"
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
  placeholder,
  type = "text",
  icon,
}) {
  return (
    <div>

      <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
        {icon}
        {label}
      </label>

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

        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="text-gray-800 bg-white"
          >
            {option}
          </option>
        ))}

      </select>

    </div>
  );
}