import {
  FaSun,
  FaCloudSun,
  FaWind,
  FaTint,
  FaRoad,
  FaMapMarkerAlt,
} from "react-icons/fa";

const WeatherWidget = () => {

  const weather = {
    location: "Ghaziabad, India",
    temperature: "31°C",
    condition: "Partly Cloudy",
    humidity: "72%",
    wind: "12 km/h",
    visibility: "8 km",
    road: "Good",
  };

  const forecast = [
    {
      day: "Mon",
      temp: "32°",
      icon: <FaSun />,
    },
    {
      day: "Tue",
      temp: "30°",
      icon: <FaCloudSun />,
    },
    {
      day: "Wed",
      temp: "29°",
      icon: <FaCloudSun />,
    },
    {
      day: "Thu",
      temp: "33°",
      icon: <FaSun />,
    },
  ];
    return (

    <div
      className="
      bg-white
      rounded-2xl
      shadow-lg
      border
      border-gray-200
      p-6
      "
    >

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-2xl font-bold text-slate-800">
            Weather
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Live driving conditions
          </p>

        </div>

        <FaSun className="text-yellow-500 text-4xl" />

      </div>

      {/* Main Weather */}

      <div
        className="
        rounded-2xl
        bg-gradient-to-r
        from-blue-500
        to-cyan-500
        text-white
        p-6
        "
      >

        <div className="flex items-center justify-between">

          <div>

            <h3 className="text-5xl font-bold">
              {weather.temperature}
            </h3>

            <p className="mt-2 text-lg">
              {weather.condition}
            </p>

            <div className="flex items-center gap-2 mt-3">

              <FaMapMarkerAlt />

              <span>
                {weather.location}
              </span>

            </div>

          </div>

          <FaCloudSun className="text-7xl opacity-80" />

        </div>

      </div>

      {/* Details */}

      <div className="grid grid-cols-2 gap-4 mt-6">

        <div className="bg-gray-50 rounded-xl p-4">

          <FaTint className="text-blue-500 text-xl mb-2" />

          <p className="text-gray-500 text-sm">
            Humidity
          </p>

          <h3 className="text-2xl font-bold">
            {weather.humidity}
          </h3>

        </div>

        <div className="bg-gray-50 rounded-xl p-4">

          <FaWind className="text-green-500 text-xl mb-2" />

          <p className="text-gray-500 text-sm">
            Wind
          </p>

          <h3 className="text-2xl font-bold">
            {weather.wind}
          </h3>

        </div>

        <div className="bg-gray-50 rounded-xl p-4">

          <FaRoad className="text-orange-500 text-xl mb-2" />

          <p className="text-gray-500 text-sm">
            Road Condition
          </p>

          <h3 className="text-xl font-bold text-green-600">
            {weather.road}
          </h3>

        </div>

        <div className="bg-gray-50 rounded-xl p-4">

          <FaCloudSun className="text-purple-500 text-xl mb-2" />

          <p className="text-gray-500 text-sm">
            Visibility
          </p>

          <h3 className="text-xl font-bold">
            {weather.visibility}
          </h3>

        </div>

      </div>

      {/* Forecast */}

      <div className="mt-6">

        <h3 className="font-semibold text-slate-800 mb-4">
          4-Day Forecast
        </h3>

        <div className="grid grid-cols-4 gap-3">

          {forecast.map((item) => (

            <div
              key={item.day}
              className="
              bg-gray-50
              rounded-xl
              p-3
              text-center
              "
            >

              <div className="text-yellow-500 text-2xl flex justify-center mb-2">
                {item.icon}
              </div>

              <p className="text-sm text-gray-500">
                {item.day}
              </p>

              <p className="font-bold text-slate-800">
                {item.temp}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

};

export default WeatherWidget;