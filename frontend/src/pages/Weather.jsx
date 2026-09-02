import { useState } from "react";
import {
  CloudSun,
  MapPin,
  Search,
  Droplets,
  Wind,
  Thermometer,
  Gauge,
  CloudRain,
  Eye,
  Sun,
  Sprout,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Calendar,
} from "lucide-react";

import { useApp, MAHARASHTRA_DISTRICTS } from "../context/AppContext";

import VoiceMicButton from "../components/VoiceMicButton";
import { parseSpokenDistrict } from "../utils/voiceParser";
import { buildApiUrl } from "../utils/apiConfig";

export default function Weather({ nav }) {
  const { t, tDistrict, language } = useApp();

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async (targetCity) => {
    const q = (targetCity || city || "").trim();
    if (!q) {
      setError(t("cityRequired"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        buildApiUrl(`/weather?city=${encodeURIComponent(q)}`)
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || t("weatherUnavailable")
        );
      }

      const weatherData = {
        city: data.city,
        country: data.country,
        temperature: data.temperature,
        feelsLike: data.feels_like,
        condition: data.description,
        humidity: data.humidity,
        rainfall: data.rainfall,
        wind: data.wind_speed,
        pressure: data.pressure,
        visibility: data.visibility || 0,
        cloudiness: data.cloudiness,
      };

      setWeather(weatherData);
    } catch (err) {
      console.error("Weather Error:", err);

      setWeather(null);

      setError(
        err.message ||
          t("weatherUnavailable")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    fetchWeather(city);
  };

  const handleVoiceInput = (spoken) => {
    const parsed = parseSpokenDistrict(spoken) || spoken.replace(/[.,]/g, "").trim();
    if (parsed) {
      setCity(parsed);
      fetchWeather(parsed);
    }
  };

  return (
    <div className="space-y-6">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div>
        <h1 className="text-2xl font-extrabold text-gray-800">
          {t("currentWeather")}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {t("weatherDescription")}
        </p>
      </div>


      {/* ================================================= */}
      {/* SEARCH */}
      {/* ================================================= */}

      <div className="card p-5">

        <form
          onSubmit={handleSearch}
          className="relative flex items-center w-full"
        >

          <div className="pointer-events-none absolute left-4 z-10 flex items-center text-[#2E7D32]">
            <MapPin size={18} />
          </div>

          <input
            type="text"
            value={city}
            onChange={(e) =>
              setCity(e.target.value)
            }
            placeholder={t("enterCityDistrict")}
            className="
              w-full rounded-xl
              border border-[#B7D9B2]
              bg-[#F8FAF7]
              py-3.5
              pl-12
              pr-36
              text-sm font-medium
              text-gray-800
              outline-none
              transition-all
              focus:bg-white
              focus:border-[#2E7D32]
              focus:ring-2
              focus:ring-[#2E7D32]/15
            "
          />

          <div className="absolute right-2 z-10 flex items-center gap-1.5">
            {/* VOICE MIC BUTTON */}
            <VoiceMicButton
              onTranscript={handleVoiceInput}
              size="sm"
              className="border border-[#B7D9B2]/60"
            />

            <button
              type="submit"
              disabled={loading}
              className="
                flex
                items-center
                gap-1.5
                rounded-lg
                bg-gradient-to-r from-[#1B5E20] to-[#2E7D32]
                px-4
                py-2
                text-xs font-bold
                text-white
                shadow-sm
                transition-all
                hover:opacity-90
                active:scale-95
                disabled:cursor-not-allowed
                disabled:opacity-60
                cursor-pointer
              "
              title={t("search")}
              aria-label={t("search")}
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Search size={14} />
                  <span className="hidden sm:inline">{t("search") || "Search"}</span>
                </>
              )}
            </button>
          </div>

        </form>

        {/* QUICK DISTRICT KEYCAPS & SELECT */}
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 border-t border-[#E8EFE6] pt-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-gray-400">
              {language === "mr" ? "त्वरित शहरे:" : language === "hi" ? "त्वरित शहर:" : "Quick Cities:"}
            </span>
            {["Pune", "Nagpur", "Nashik", "Amravati", "Kolhapur", "Aurangabad", "Solapur", "Latur", "Satara", "Jalgaon"].map((dist) => (
              <button
                key={dist}
                type="button"
                onClick={() => {
                  setCity(dist);
                  fetchWeather(dist);
                }}
                className="key-cap text-[11px] py-1 px-2.5 cursor-pointer hover:border-[#2E7D32] hover:text-[#2E7D32]"
              >
                📍 {tDistrict ? tDistrict(dist) : dist}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={city}
              onChange={(e) => {
                const chosen = e.target.value;
                setCity(chosen);
                if (chosen) fetchWeather(chosen);
              }}
              className="rounded-xl border border-[#B7D9B2] bg-[#F8FAF7] px-3 py-1.5 text-xs font-semibold text-gray-700 outline-none focus:border-[#2E7D32] focus:bg-white cursor-pointer"
            >
              <option value="">
                {language === "mr" ? "🏛️ सर्व ३६ जिल्हे यादी..." : language === "hi" ? "🏛️ सभी 36 जिले सूची..." : "🏛️ All 36 Districts..."}
              </option>
              {MAHARASHTRA_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {tDistrict ? tDistrict(d) : d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
            {error}
          </div>
        )}


        {/* LOADING */}

        {loading && (
          <p className="mt-3 text-xs font-medium text-[#2E7D32]">
            {t("fetchingWeather")}
          </p>
        )}

      </div>


      {/* ================================================= */}
      {/* EMPTY STATE */}
      {/* ================================================= */}

      {!weather && !loading && (
        <div className="card card-interactive flex min-h-[400px] flex-col items-center justify-center p-8 text-center">

          <div className="animate-float flex h-24 w-24 items-center justify-center rounded-3xl bg-[#EAF3E6] shadow-sm">

            <CloudSun
              size={50}
              className="text-[#2E7D32]"
            />

          </div>

          <h2 className="mt-6 text-lg font-bold text-gray-700">
            {t("checkYourLocalWeather")}
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-gray-400">
            {t("weatherEmptyDescription")}
          </p>

        </div>
      )}


      {/* ================================================= */}
      {/* WEATHER RESULT */}
      {/* ================================================= */}

      {weather && (
        <>

          {/* CURRENT WEATHER */}

          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#10B981] p-7 text-white shadow-[0_16px_40px_rgba(46,125,50,0.22)] animate-zoom-fade depth-3 relative">
            <div className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full bg-white/10 blur-2xl animate-float-slow" />

            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center relative z-10">

              <div>

                <div className="flex items-center gap-2 text-green-100">

                  <MapPin size={16} />

                  <span className="text-sm font-semibold">
                    {tDistrict ? tDistrict(weather.city) : weather.city}
                    {weather.country
                      ? `, ${weather.country === "IN" ? (language === "mr" ? "भारत" : language === "hi" ? "भारत" : "India") : weather.country}`
                      : ""}
                  </span>

                </div>

                <p className="mt-5 text-sm text-green-100">
                  {t("currentWeather")}
                </p>

                <div className="mt-1 flex items-center gap-4">

                  <span className="text-6xl font-extrabold tracking-tight drop-shadow-sm">
                    {weather.temperature}°
                  </span>

                  <div>

                    <p className="text-lg font-bold capitalize">
                      {weather.condition}
                    </p>

                    <p className="text-xs text-green-100">
                      {t("feelsLike")}{" "}
                      {weather.feelsLike}°C
                    </p>

                  </div>

                </div>

              </div>

              <div className="text-8xl select-none animate-float-slow filter drop-shadow-md">
                🌤️
              </div>

            </div>

          </div>

          {/* WEATHER CARDS */}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-zoom-fade">

            <WeatherCard
              icon={<Droplets size={19} />}
              title={t("humidity")}
              value={`${weather.humidity}%`}
              description={t("relativeHumidity")}
            />

            <WeatherCard
              icon={<CloudRain size={19} />}
              title={t("rainfall")}
              value={`${weather.rainfall} mm`}
              description={t("rainfallLastHour")}
            />

            <WeatherCard
              icon={<Wind size={19} />}
              title={t("windSpeed")}
              value={`${weather.wind} m/s`}
              description={t("currentWindSpeed")}
            />

            <WeatherCard
              icon={<Gauge size={19} />}
              title={t("pressure")}
              value={`${weather.pressure} hPa`}
              description={t("atmosphericPressure")}
            />

          </div>


          {/* DETAILS & AGRICULTURAL ADVISORY (ZERO DUPLICATION) */}

          <div className="grid gap-5 lg:grid-cols-2">

            {/* PANEL 1: FIELD ENVIRONMENT & MICRO-CLIMATE */}

            <div className="card p-6">

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-gray-800">
                    {t("fieldEnvironment")}
                  </h2>
                  <p className="mt-1 text-xs text-gray-400">
                    {t("fieldEnvironmentDescription")}
                  </p>
                </div>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 text-sm">
                  🌤️
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">

                <Detail
                  icon={<CloudRain size={17} />}
                  label={t("cloudiness")}
                  value={`${weather.cloudiness}%`}
                  subtext={weather.cloudiness > 70 ? "Overcast skies" : weather.cloudiness > 30 ? "Partly cloudy" : "Clear sunny skies"}
                />

                <Detail
                  icon={<Eye size={17} />}
                  label={t("visibility")}
                  value={
                    weather.visibility
                      ? `${weather.visibility} km`
                      : "10 km (Clear)"
                  }
                  subtext="Field line-of-sight"
                />

                <Detail
                  icon={<Thermometer size={17} />}
                  label={t("dewPoint")}
                  value={`${(
                    (typeof weather.temperature === "number" ? weather.temperature : parseFloat(weather.temperature) || 25) -
                    ((100 - (typeof weather.humidity === "number" ? weather.humidity : parseFloat(weather.humidity) || 70)) / 5)
                  ).toFixed(1)}°C`}
                  subtext="Moisture condensation"
                />

                <Detail
                  icon={<Sun size={17} />}
                  label={t("solarExposure")}
                  value={
                    (typeof weather.cloudiness === "number" ? weather.cloudiness : parseFloat(weather.cloudiness) || 0) > 75
                      ? "Low / Diffused"
                      : (typeof weather.cloudiness === "number" ? weather.cloudiness : parseFloat(weather.cloudiness) || 0) > 35
                      ? "Moderate Daylight"
                      : "Direct Sunlight"
                  }
                  subtext="Photosynthesis index"
                />

              </div>

            </div>


            {/* PANEL 2: FIELD OPERATIONS & FARM ADVISORY */}

            <div className="card p-6">

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-gray-800">
                    {t("agriculturalAdvisory")}
                  </h2>
                  <p className="mt-1 text-xs text-gray-400">
                    {t("agriculturalAdvisoryDescription")}
                  </p>
                </div>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-50 text-green-700 text-sm">
                  🌾
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">

                {/* SPRAYING */}
                <AdvisoryItem
                  icon={<Sprout size={16} />}
                  title={t("sprayingCondition")}
                  status={
                    (parseFloat(weather.wind) || 0) > 7.5
                      ? "Caution: High Wind"
                      : (parseFloat(weather.rainfall) || 0) > 0
                      ? "Hold: Rain Observed"
                      : "Favorable (Low Drift)"
                  }
                  statusType={
                    (parseFloat(weather.wind) || 0) > 7.5 || (parseFloat(weather.rainfall) || 0) > 0
                      ? "warning"
                      : "success"
                  }
                  description={
                    (parseFloat(weather.wind) || 0) > 7.5
                      ? "Wind drift risk for foliar spray"
                      : "Optimal for pesticide & fertilizer spray"
                  }
                />

                {/* IRRIGATION */}
                <AdvisoryItem
                  icon={<Droplets size={16} />}
                  title={t("irrigationSchedule")}
                  status={
                    (parseFloat(weather.rainfall) || 0) > 1 || (parseFloat(weather.humidity) || 0) > 82
                      ? "Hold Irrigation"
                      : (parseFloat(weather.humidity) || 0) < 45 && (parseFloat(weather.temperature) || 0) > 30
                      ? "Plan Irrigation"
                      : "Normal Schedule"
                  }
                  statusType="info"
                  description={
                    (parseFloat(weather.rainfall) || 0) > 1 || (parseFloat(weather.humidity) || 0) > 82
                      ? "Sufficient natural moisture in soil"
                      : "Monitor topsoil moisture before pumping"
                  }
                />

                {/* FUNGAL DISEASE RISK */}
                <AdvisoryItem
                  icon={<ShieldAlert size={16} />}
                  title={t("diseaseRisk")}
                  status={
                    (parseFloat(weather.humidity) || 0) > 78
                      ? "Elevated (High Humidity)"
                      : "Low Risk Level"
                  }
                  statusType={
                    (parseFloat(weather.humidity) || 0) > 78 ? "warning" : "success"
                  }
                  description={
                    (parseFloat(weather.humidity) || 0) > 78
                      ? "Check pulses & vegetable foliage for spores"
                      : "Atmospheric disease pressure is minimal"
                  }
                />

                {/* HARVEST & SOWING */}
                <AdvisoryItem
                  icon={<Calendar size={16} />}
                  title={t("harvestSafety")}
                  status={
                    (parseFloat(weather.rainfall) || 0) > 0
                      ? "Protect Produce"
                      : "Field Work Favorable"
                  }
                  statusType={
                    (parseFloat(weather.rainfall) || 0) > 0 ? "warning" : "success"
                  }
                  description={
                    (parseFloat(weather.rainfall) || 0) > 0
                      ? "Keep harvested grains under tarpaulin"
                      : "Clear weather for tractor & sowing operations"
                  }
                />

              </div>

            </div>

          </div>


          {/* FARMING INSIGHT */}

          <div className="rounded-2xl border border-[#DCE8D9] bg-[#F3F8F0] p-5">

            <div className="flex gap-3">

              <div className="text-2xl">
                🌱
              </div>

              <div>

                <h3 className="text-sm font-bold text-[#1B5E20]">
                  {t("farmingInsight")}
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-600">
                  {t("farmingInsightDescription")}
                </p>

              </div>

            </div>

          </div>

        </>
      )}


      {/* BACK */}

      <button
        onClick={() => nav?.("dashboard")}
        className="text-sm font-semibold text-[#2E7D32] hover:underline"
      >
        ← {t("backToDashboard")}
      </button>

    </div>
  );
}


/* ================================================= */
/* WEATHER CARD */
/* ================================================= */

function WeatherCard({
  icon,
  title,
  value,
  description,
}) {
  return (
    <div className="card card-interactive p-5 group cursor-default">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3E6] text-[#2E7D32] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-xs">
          {icon}
        </div>

        <div>

          <p className="text-xs text-gray-400">
            {title}
          </p>

          <p className="mt-1 text-xl font-extrabold text-gray-800 group-hover:text-[#2E7D32] transition-colors">
            {value}
          </p>

        </div>

      </div>

      <p className="mt-3 text-[10px] text-gray-400">
        {description}
      </p>

    </div>
  );
}


/* ================================================= */
/* DETAIL */
/* ================================================= */

function Detail({
  icon,
  label,
  value,
  subtext,
}) {
  return (
    <div className="rounded-xl border border-[#E8EFE5] bg-[#F7FAF5] p-3.5 transition-all hover:bg-white hover:shadow-xs">

      <div className="flex items-center gap-2 text-[#2E7D32]">
        {icon}
        <span className="text-xs font-bold text-gray-600">
          {label}
        </span>
      </div>

      <p className="mt-2 text-sm font-extrabold capitalize text-gray-800">
        {value}
      </p>

      {subtext && (
        <p className="mt-0.5 text-[10px] text-gray-400">
          {subtext}
        </p>
      )}

    </div>
  );
}


/* ================================================= */
/* ADVISORY ITEM */
/* ================================================= */

function AdvisoryItem({
  icon,
  title,
  status,
  statusType = "success",
  description,
}) {
  const badgeColors = {
    success: "bg-emerald-100 text-emerald-800 border-emerald-200",
    warning: "bg-amber-100 text-amber-800 border-amber-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
  };

  return (
    <div className="rounded-xl border border-[#E8EFE5] bg-[#F7FAF5] p-3.5 transition-all hover:bg-white hover:shadow-xs">

      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5 text-[#2E7D32]">
          {icon}
          <span className="text-xs font-bold text-gray-700">
            {title}
          </span>
        </div>

        <span
          className={`rounded-full border px-2 py-0.5 text-[9px] font-extrabold whitespace-nowrap ${
            badgeColors[statusType] || badgeColors.success
          }`}
        >
          {status}
        </span>
      </div>

      <p className="mt-2 text-[10px] leading-4 text-gray-500">
        {description}
      </p>

    </div>
  );
}