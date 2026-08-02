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


      {/* ==========================
          Dashboard Header
      =========================== */}

      <div
        className="
        bg-white
        rounded-2xl
        shadow
        p-6
        flex
        justify-between
        items-center
        "
      >

        <div className="space-y-3">

          <div
            className="
            h-8
            w-60
            bg-gray-300
            rounded
            "
          />


          <div
            className="
            h-4
            w-80
            bg-gray-300
            rounded
            "
          />

        </div>



        <div
          className="
          h-12
          w-32
          bg-gray-300
          rounded-xl
          "
        />


      </div>





      {/* ==========================
          KPI Cards
      =========================== */}


      <div
        className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-6
        gap-5
        "
      >


        {
          Array.from({
            length:6
          }).map((_,index)=>(


            <div

              key={index}

              className="
              bg-white
              rounded-2xl
              shadow
              p-5
              h-36
              "
            >


              <div
                className="
                h-12
                w-12
                bg-gray-300
                rounded-xl
                "
              />


              <div
                className="
                h-8
                w-24
                bg-gray-300
                rounded
                mt-5
                "
              />


              <div
                className="
                h-3
                w-32
                bg-gray-300
                rounded
                mt-3
                "
              />


            </div>


          ))
        }


      </div>







      {/* ==========================
          Charts
      =========================== */}


      <div
        className="
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-6
        "
      >


        {
          Array.from({
            length:2
          }).map((_,index)=>(


            <div

              key={index}

              className="
              bg-white
              rounded-2xl
              shadow
              p-5
              h-96
              "

            >


              <div
                className="
                h-6
                w-48
                bg-gray-300
                rounded
                mb-6
                "
              />


              <div
                className="
                h-64
                bg-gray-300
                rounded-xl
                "
              />


            </div>


          ))
        }


      </div>







      {/* ==========================
          Map + Weather
      =========================== */}


      <div
        className="
        grid
        grid-cols-1
        xl:grid-cols-2
        gap-6
        "
      >



        <div
          className="
          h-96
          bg-white
          rounded-2xl
          shadow
          "
        />



        <div
          className="
          h-96
          bg-white
          rounded-2xl
          shadow
          "
        />



      </div>







      {/* ==========================
          Notification + Actions
      =========================== */}


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
          bg-white
          rounded-2xl
          shadow
          "
        />



        <div
          className="
          h-80
          bg-white
          rounded-2xl
          shadow
          "
        />



      </div>




    </div>

  );

};


export default DashboardSkeleton;