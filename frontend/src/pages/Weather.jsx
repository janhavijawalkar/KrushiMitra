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
} from "lucide-react";

import { useApp } from "../context/AppContext";

export default function Weather({ nav }) {
  const { t } = useApp();

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!city.trim()) {
      setError(t("cityRequired"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/weather?city=${encodeURIComponent(
          city.trim()
        )}`
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
          className="relative"
        >

          <MapPin
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#2E7D32]"
          />

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
              bg-white
              py-3
              pl-12
              pr-14
              text-sm
              text-gray-700
              outline-none
              transition
              focus:border-[#2E7D32]
              focus:ring-2
              focus:ring-[#2E7D32]/10
            "
          />

          <button
            type="submit"
            disabled={loading}
            className="
              btn-shimmer
              absolute
              right-2
              top-1/2
              flex
              h-9
              w-9
              -translate-y-1/2
              items-center
              justify-center
              rounded-lg
              bg-gradient-to-r from-[#1B5E20] to-[#2E7D32]
              text-white
              shadow-sm
              transition
              hover:scale-105
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
              <Search size={16} />
            )}
          </button>

        </form>

        {/* QUICK DISTRICT KEYCAPS */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-gray-400">Quick Select:</span>
          {["Pune", "Nagpur", "Nashik", "Amravati", "Kolhapur", "Aurangabad"].map((dist) => (
            <button
              key={dist}
              type="button"
              onClick={() => {
                setCity(dist);
              }}
              className="key-cap text-[11px] py-1 px-2.5"
            >
              📍 {dist}
            </button>
          ))}
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

          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#10B981] p-7 text-white shadow-lg">

            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">

              <div>

                <div className="flex items-center gap-2 text-green-100">

                  <MapPin size={16} />

                  <span className="text-sm font-semibold">
                    {weather.city}
                    {weather.country
                      ? `, ${weather.country}`
                      : ""}
                  </span>

                </div>

                <p className="mt-5 text-sm text-green-100">
                  {t("currentWeather")}
                </p>

                <div className="mt-1 flex items-center gap-4">

                  <span className="text-6xl font-extrabold">
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

              <div className="text-8xl">
                🌤️
              </div>

            </div>

          </div>


          {/* WEATHER CARDS */}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

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


          {/* DETAILS */}

          <div className="grid gap-5 lg:grid-cols-2">

            {/* WEATHER DETAILS */}

            <div className="card p-6">

              <h2 className="text-sm font-bold text-gray-800">
                {t("weatherDetails")}
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                {t("weatherDetailsDescription")}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">

                <Detail
                  icon={<Thermometer size={17} />}
                  label={t("temperature")}
                  value={`${weather.temperature}°C`}
                />

                <Detail
                  icon={<Droplets size={17} />}
                  label={t("humidity")}
                  value={`${weather.humidity}%`}
                />

                <Detail
                  icon={<Eye size={17} />}
                  label={t("visibility")}
                  value={
                    weather.visibility
                      ? `${weather.visibility} km`
                      : t("notAvailable")
                  }
                />

                <Detail
                  icon={<Gauge size={17} />}
                  label={t("pressure")}
                  value={`${weather.pressure} hPa`}
                />

              </div>

            </div>


            {/* CONDITIONS */}

            <div className="card p-6">

              <h2 className="text-sm font-bold text-gray-800">
                {t("weatherConditions")}
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                {t("weatherConditionsDescription")}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">

                <Detail
                  icon={<CloudSun size={17} />}
                  label={t("weatherCondition")}
                  value={weather.condition}
                />

                <Detail
                  icon={<CloudRain size={17} />}
                  label={t("cloudiness")}
                  value={`${weather.cloudiness}%`}
                />

                <Detail
                  icon={<Wind size={17} />}
                  label={t("windSpeed")}
                  value={`${weather.wind} m/s`}
                />

                <Detail
                  icon={<Thermometer size={17} />}
                  label={t("feelsLike")}
                  value={`${weather.feelsLike}°C`}
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
}) {
  return (
    <div className="rounded-xl bg-[#F6F8F4] p-4">

      <div className="flex items-center gap-2 text-[#2E7D32]">

        {icon}

        <span className="text-xs font-semibold text-gray-500">
          {label}
        </span>

      </div>

      <p className="mt-2 text-sm font-bold capitalize text-gray-700">
        {value}
      </p>

    </div>
  );
}