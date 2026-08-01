const DashboardSkeleton = () => {
  return (
    <div
      className="
      min-h-screen
      bg-gray-100
      p-3
      sm:p-4
      md:p-6
      space-y-6
      animate-pulse
      "
    >

      {/* Header Skeleton */}
      <div
        className="
        h-20
        bg-gray-300
        rounded-xl
        "
      />


      {/* KPI Cards Skeleton */}
      <div
        className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        gap-6
        "
      >

        {
          Array.from({ length: 6 }).map((_, index) => (

            <div
              key={index}
              className="
              h-32
              bg-gray-300
              rounded-xl
              "
            />

          ))
        }

      </div>



      {/* Charts Skeleton */}
      <div
        className="
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-6
        "
      >

        <div
          className="
          h-80
          bg-gray-300
          rounded-xl
          "
        />


        <div
          className="
          h-80
          bg-gray-300
          rounded-xl
          "
        />

      </div>



      {/* Map Skeleton */}
      <div
        className="
        h-96
        bg-gray-300
        rounded-xl
        "
      />


    </div>
  );
};


export default DashboardSkeleton;