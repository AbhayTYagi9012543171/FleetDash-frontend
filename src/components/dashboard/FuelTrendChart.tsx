import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { fuelTrendData } from "../../data/fuelTrendData";


const FuelTrendChart = () => {


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

      <div className="mb-6">

        <h2
          className="
          text-xl
          font-bold
          text-slate-800
          "
        >
          Fuel Consumption Trend
        </h2>


        <p
          className="
          text-sm
          text-gray-500
          mt-1
          "
        >
          Daily fuel usage monitoring and efficiency analysis
        </p>


      </div>




      {
        fuelTrendData.length === 0 ? (

          <div
            className="
            h-[320px]
            flex
            items-center
            justify-center
            text-gray-400
            "
          >
            No Fuel Data Available
          </div>


        ) : (


          <ResponsiveContainer
            width="100%"
            height={320}
          >


            <AreaChart
              data={fuelTrendData}
              margin={{
                top:10,
                right:20,
                left:0,
                bottom:10,
              }}
            >



              <CartesianGrid
                strokeDasharray="3 3"
              />



              <XAxis
                dataKey="day"
              />



              <YAxis
                tickFormatter={(value)=>
                  `${value}L`
                }
              />



              <Tooltip

                formatter={(value)=>
                  `${value} Litres`
                }

              />




              <Area

                type="monotone"

                dataKey="fuel"

                stroke="#16a34a"

                fill="#86efac"

                strokeWidth={3}

                activeDot={{
                  r:6
                }}

              />



            </AreaChart>


          </ResponsiveContainer>


        )

      }



    </div>

  );

};


export default FuelTrendChart;