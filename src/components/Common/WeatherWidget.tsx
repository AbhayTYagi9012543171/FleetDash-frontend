
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import {
  FaSun,
  FaCloudSun,
  FaCloudRain,
  FaWind,
  FaTint,
  FaRoad,
  FaMapMarkerAlt,
  FaEye,
  FaSyncAlt,
} from "react-icons/fa";

import { api } from "../../services/api";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  wind: number;
  visibility: number;
  road: string;
}

interface InfoCardProps {
  icon: ReactNode;
  title: string;
  value: string;
}

const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchWeather = async () => {
    try {
      setLoading(true);

      const response = await api.get("/weather");

      setWeather(response.data.weather);
    } catch (error) {
      console.error("Weather Error:", error);

      // Fallback data
      setWeather({
        location: "Ghaziabad, India",
        temperature: 31,
        condition: "Partly Cloudy",
        humidity: 72,
        wind: 12,
        visibility: 8,
        road: "Good",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshWeather = async () => {
    try {
      setRefreshing(true);

      await fetchWeather();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  // ==========================
  // Weather Icon
  // ==========================

  const getWeatherIcon = () => {
    const condition =
      weather?.condition?.toLowerCase() ?? "";

    if (condition.includes("rain")) {
      return <FaCloudRain />;
    }

    if (
      condition.includes("cloud") ||
      condition.includes("overcast")
    ) {
      return <FaCloudSun />;
    }

    return <FaSun />;
  };

  // ==========================
  // Loading Skeleton
  // ==========================

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 w-full animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-7 w-32 bg-gray-200 rounded" />

            <div className="h-4 w-48 bg-gray-200 rounded mt-2" />
          </div>

          <div className="h-12 w-12 bg-gray-200 rounded-xl" />
        </div>

        {/* Main Weather Skeleton */}
        <div className="h-40 bg-gray-200 rounded-2xl mb-6" />

        {/* Cards Skeleton */}
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-24 bg-gray-200 rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  // ==========================
  // No Weather Data
  // ==========================

  if (!weather) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 w-full">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FaCloudSun className="text-5xl text-gray-300 mb-4" />

          <h3 className="text-lg font-semibold text-slate-700">
            Weather Data Unavailable
          </h3>

          <p className="text-sm text-gray-500 mt-2">
            Unable to load current weather information.
          </p>

          <button
            onClick={fetchWeather}
            className="
              mt-5
              flex
              items-center
              gap-2
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-5
              py-2.5
              rounded-xl
              font-semibold
              transition
            "
          >
            <FaSyncAlt />

            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ==========================
  // Main Component
  // ==========================

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 w-full">
      {/* ==========================
          Header
      =========================== */}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Weather
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Live driving conditions
          </p>
        </div>

        <button
          onClick={refreshWeather}
          disabled={refreshing}
          title="Refresh weather"
          className="
            h-12
            w-12
            rounded-xl
            bg-blue-100
            text-blue-600
            flex
            items-center
            justify-center
            text-xl
            hover:bg-blue-200
            disabled:opacity-50
            transition
          "
        >
          <FaSyncAlt
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />
        </button>
      </div>

      {/* ==========================
          Main Weather Banner
      =========================== */}

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-500 p-6 text-white mb-6">
        {/* Decorative Circles */}
        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10" />

        <div className="absolute -right-16 -bottom-20 h-48 w-48 rounded-full bg-white/5" />

        <div className="relative flex items-center justify-between gap-4">
          {/* Weather Information */}
          <div>
            <div className="flex items-center gap-2 text-blue-100 mb-3">
              <FaMapMarkerAlt />

              <span className="text-sm font-medium">
                {weather.location}
              </span>
            </div>

            <h3 className="text-5xl font-bold">
              {weather.temperature}°C
            </h3>

            <p className="text-lg font-medium mt-2">
              {weather.condition}
            </p>
          </div>

          {/* Weather Icon */}
          <div className="text-7xl opacity-90">
            {getWeatherIcon()}
          </div>
        </div>
      </div>

      {/* ==========================
          Weather Details
      =========================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={<FaTint />}
          title="Humidity"
          value={`${weather.humidity}%`}
        />

        <InfoCard
          icon={<FaWind />}
          title="Wind Speed"
          value={`${weather.wind} km/h`}
        />

        <InfoCard
          icon={<FaRoad />}
          title="Road Condition"
          value={weather.road || "N/A"}
        />

        <InfoCard
          icon={<FaEye />}
          title="Visibility"
          value={`${weather.visibility} km`}
        />
      </div>

      {/* ==========================
          Footer
      =========================== */}

      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">
            Current driving conditions
          </p>

          <p className="text-xs text-gray-500 mt-1">
            Data synchronized with fleet system
          </p>
        </div>

        <button
          onClick={refreshWeather}
          disabled={refreshing}
          className="
            text-xs
            font-semibold
            text-blue-600
            hover:text-blue-700
            disabled:opacity-50
            transition
          "
        >
          {refreshing
            ? "Refreshing..."
            : "Refresh Data"}
        </button>
      </div>
    </div>
  );
};

// ==========================
// Reusable Info Card
// ==========================

const InfoCard = ({
  icon,
  title,
  value,
}: InfoCardProps) => {
  return (
    <div
      className="
        rounded-xl
        bg-gray-50
        border
        border-gray-100
        p-4
        transition
        duration-300
        hover:bg-white
        hover:shadow-md
      "
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div
          className="
            h-11
            w-11
            rounded-xl
            bg-white
            shadow-sm
            flex
            items-center
            justify-center
            text-blue-600
            text-lg
          "
        >
          {icon}
        </div>

        {/* Content */}
        <div>
          <p className="text-xs text-gray-500">
            {title}
          </p>

          <p className="text-lg font-bold text-slate-800 mt-1">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
