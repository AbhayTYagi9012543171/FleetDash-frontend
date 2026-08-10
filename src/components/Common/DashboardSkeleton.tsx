const DashboardSkeleton = () => {
  return (
    <div
      className="
        min-h-screen
        bg-gray-50
        p-3
        sm:p-4
        md:p-6
        space-y-6
        animate-pulse
      "
    >
      {/* =========================
          Dashboard Header
      ========================== */}
      <div
        className="
          bg-white
          rounded-2xl
          border border-gray-200
          shadow-sm
          p-4 sm:p-5 lg:p-6
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-5
        "
      >
        <div className="space-y-3">
          <div className="h-8 sm:h-9 w-48 sm:w-64 bg-gray-200 rounded-lg" />

          <div className="h-4 w-64 sm:w-96 bg-gray-200 rounded-md" />

          <div className="h-3 w-40 bg-gray-200 rounded-md" />
        </div>

        <div className="flex items-center gap-3">
          <div className="h-11 w-11 bg-gray-200 rounded-xl" />

          <div className="space-y-2">
            <div className="h-3 w-20 bg-gray-200 rounded" />
            <div className="h-5 w-28 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      {/* =========================
          KPI Cards
      ========================== */}
      <div
        className="
          grid
          grid-cols-1
          xs:grid-cols-2
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-6
          gap-4
        "
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="
              relative
              overflow-hidden
              bg-white
              rounded-2xl
              border border-gray-200
              shadow-sm
              p-5
              min-h-[170px]
            "
          >
            {/* Decorative Circle */}
            <div
              className="
                absolute
                -right-8
                -top-8
                h-24
                w-24
                rounded-full
                bg-gray-100
              "
            />

            <div className="relative">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="h-4 w-24 bg-gray-200 rounded" />

                  <div className="h-9 w-24 bg-gray-200 rounded-lg" />
                </div>

                <div className="h-12 w-12 bg-gray-200 rounded-xl" />
              </div>

              <div className="mt-5 flex justify-between">
                <div className="h-3 w-14 bg-gray-200 rounded" />

                <div className="h-3 w-20 bg-gray-200 rounded" />
              </div>

              <div className="mt-3 h-2 w-full bg-gray-200 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* =========================
          Fleet Summary
      ========================== */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-5
        "
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="
              bg-white
              rounded-2xl
              border border-gray-200
              shadow-sm
              p-5
            "
          >
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <div className="h-4 w-28 bg-gray-200 rounded" />

                <div className="h-8 w-32 bg-gray-200 rounded-lg" />

                <div className="h-3 w-36 bg-gray-200 rounded" />
              </div>

              <div className="h-14 w-14 bg-gray-200 rounded-2xl" />
            </div>

            <div className="mt-6 flex justify-between">
              <div className="h-4 w-14 bg-gray-200 rounded" />
              <div className="h-3 w-16 bg-gray-200 rounded" />
            </div>

            <div className="mt-4 h-2 bg-gray-200 rounded-full" />

            <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between">
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="h-3 w-16 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* =========================
          Revenue + Fuel Charts
      ========================== */}
      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
        "
      >
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="
              bg-white
              rounded-2xl
              border border-gray-200
              shadow-sm
              p-5
              sm:p-6
            "
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-3">
                <div className="h-6 w-48 bg-gray-200 rounded-lg" />

                <div className="h-3 w-64 bg-gray-200 rounded" />
              </div>

              <div className="h-9 w-20 bg-gray-200 rounded-lg" />
            </div>

            {/* Chart */}
            <div className="h-64 sm:h-72 relative">
              {/* Y-axis */}
              <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between">
                <div className="h-3 w-6 bg-gray-200 rounded" />
                <div className="h-3 w-6 bg-gray-200 rounded" />
                <div className="h-3 w-6 bg-gray-200 rounded" />
                <div className="h-3 w-6 bg-gray-200 rounded" />
                <div className="h-3 w-6 bg-gray-200 rounded" />
              </div>

              {/* Chart Area */}
              <div className="absolute left-10 right-0 top-2 bottom-6">
                <div className="absolute inset-0 flex flex-col justify-between">
                  {Array.from({ length: 5 }).map((_, line) => (
                    <div
                      key={line}
                      className="border-t border-gray-100"
                    />
                  ))}
                </div>

                {/* Fake chart bars/line */}
                <div className="absolute inset-0 flex items-end justify-around gap-2 px-2">
                  {[45, 62, 52, 75, 60, 85, 70, 92].map(
                    (height, bar) => (
                      <div
                        key={bar}
                        className="
                          w-4
                          sm:w-7
                          bg-gray-200
                          rounded-t-md
                        "
                        style={{ height: `${height}%` }}
                      />
                    )
                  )}
                </div>
              </div>
            </div>

            {/* X-axis */}
            <div className="ml-10 flex justify-between mt-2">
              {Array.from({ length: 6 }).map((_, item) => (
                <div
                  key={item}
                  className="h-3 w-8 bg-gray-200 rounded"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* =========================
          Fleet Health + Driver Status
      ========================== */}
      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
        "
      >
        {/* Fleet Health */}
        <div
          className="
            bg-white
            rounded-2xl
            border border-gray-200
            shadow-sm
            p-5
            sm:p-6
          "
        >
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-3">
              <div className="h-6 w-36 bg-gray-200 rounded" />

              <div className="h-3 w-64 bg-gray-200 rounded" />
            </div>

            <div className="h-16 w-28 bg-gray-200 rounded-xl" />
          </div>

          {/* Health Banner */}
          <div className="h-32 bg-gray-200 rounded-2xl mb-6">
            <div className="p-5 space-y-3">
              <div className="h-6 w-56 bg-gray-300 rounded" />
              <div className="h-3 w-72 bg-gray-300 rounded" />

              <div className="h-3 w-full bg-gray-300 rounded-full mt-5" />
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="
                  border
                  border-gray-200
                  rounded-2xl
                  p-4
                "
              >
                <div className="flex justify-between">
                  <div className="space-y-3">
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                    <div className="h-7 w-20 bg-gray-200 rounded" />
                  </div>

                  <div className="h-12 w-12 bg-gray-200 rounded-xl" />
                </div>

                <div className="h-2 bg-gray-200 rounded-full mt-5" />
              </div>
            ))}
          </div>
        </div>

        {/* Driver Status */}
        <div
          className="
            bg-white
            rounded-2xl
            border border-gray-200
            shadow-sm
            p-5
            sm:p-6
          "
        >
          <div className="space-y-3 mb-6">
            <div className="h-6 w-40 bg-gray-200 rounded" />
            <div className="h-3 w-64 bg-gray-200 rounded" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="
                  relative
                  overflow-hidden
                  bg-white
                  border
                  border-gray-200
                  rounded-2xl
                  p-5
                "
              >
                <div className="flex justify-between">
                  <div className="space-y-3">
                    <div className="h-3 w-28 bg-gray-200 rounded" />

                    <div className="h-8 w-16 bg-gray-200 rounded" />
                  </div>

                  <div className="h-12 w-12 bg-gray-200 rounded-xl" />
                </div>

                <div className="mt-6 flex justify-between">
                  <div className="h-4 w-12 bg-gray-200 rounded" />

                  <div className="h-3 w-20 bg-gray-200 rounded" />
                </div>

                <div className="mt-3 h-2 bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================
          Vehicle Utilization + Map
      ========================== */}
      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
        "
      >
        {/* Vehicle Utilization */}
        <div
          className="
            bg-white
            rounded-2xl
            border border-gray-200
            shadow-sm
            p-5
            sm:p-6
          "
        >
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-3">
              <div className="h-6 w-48 bg-gray-200 rounded" />

              <div className="h-3 w-64 bg-gray-200 rounded" />
            </div>

            <div className="h-12 w-24 bg-gray-200 rounded-xl" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-20 bg-gray-200 rounded-xl"
              />
            ))}
          </div>

          <div className="h-80 flex items-center justify-center">
            <div className="h-56 w-56 rounded-full border-[35px] border-gray-200" />
          </div>
        </div>

        {/* Live Map */}
        <div
          className="
            bg-white
            rounded-2xl
            border border-gray-200
            shadow-sm
            p-5
          "
        >
          <div className="flex justify-between items-center mb-5">
            <div className="space-y-3">
              <div className="h-6 w-36 bg-gray-200 rounded" />

              <div className="h-3 w-56 bg-gray-200 rounded" />
            </div>

            <div className="h-9 w-24 bg-gray-200 rounded-lg" />
          </div>

          <div
            className="
              relative
              h-[400px]
              bg-gray-200
              rounded-2xl
              overflow-hidden
            "
          >
            {/* Fake map roads */}
            <div className="absolute top-1/3 left-0 right-0 h-3 bg-gray-300 rotate-6" />
            <div className="absolute top-0 bottom-0 left-1/2 w-3 bg-gray-300 -rotate-12" />
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-300 -rotate-12" />

            {/* Fake map markers */}
            {[
              "top-16 left-20",
              "top-32 right-24",
              "bottom-28 left-1/3",
              "bottom-20 right-1/4",
              "top-1/2 left-1/2",
            ].map((position, index) => (
              <div
                key={index}
                className={`
                  absolute
                  ${position}
                  h-7
                  w-7
                  rounded-full
                  bg-gray-400
                  border-4
                  border-gray-300
                `}
              />
            ))}
          </div>
        </div>
      </div>

      {/* =========================
          Driver Performance + Alerts
      ========================== */}
      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
        "
      >
        {/* Driver Performance */}
        <div
          className="
            bg-white
            rounded-2xl
            border border-gray-200
            shadow-sm
            p-5
            sm:p-6
          "
        >
          <div className="space-y-3 mb-6">
            <div className="h-6 w-48 bg-gray-200 rounded" />
            <div className="h-3 w-64 bg-gray-200 rounded" />
          </div>

          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  p-4
                  border
                  border-gray-100
                  rounded-xl
                "
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-full" />

                  <div className="space-y-2">
                    <div className="h-4 w-28 bg-gray-200 rounded" />
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                  </div>
                </div>

                <div className="hidden sm:block h-3 w-20 bg-gray-200 rounded" />

                <div className="h-8 w-16 bg-gray-200 rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div
          className="
            bg-white
            rounded-2xl
            border border-gray-200
            shadow-sm
            p-5
            sm:p-6
          "
        >
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-3">
              <div className="h-6 w-32 bg-gray-200 rounded" />
              <div className="h-3 w-56 bg-gray-200 rounded" />
            </div>

            <div className="h-9 w-20 bg-gray-200 rounded-lg" />
          </div>

          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="
                  flex
                  items-center
                  gap-4
                  p-4
                  rounded-xl
                  border
                  border-gray-100
                "
              >
                <div className="h-10 w-10 bg-gray-200 rounded-xl shrink-0" />

                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 bg-gray-200 rounded" />
                  <div className="h-3 w-56 bg-gray-200 rounded" />
                </div>

                <div className="h-3 w-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================
          Quick Actions
      ========================== */}
      <div
        className="
          bg-white
          rounded-2xl
          border border-gray-200
          shadow-sm
          p-5
          sm:p-6
        "
      >
        <div className="space-y-3 mb-6">
          <div className="h-6 w-36 bg-gray-200 rounded" />
          <div className="h-3 w-60 bg-gray-200 rounded" />
        </div>

        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            lg:grid-cols-6
            gap-4
          "
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="
                h-28
                bg-gray-200
                rounded-2xl
              "
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;