import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { revenueData } from "../../data/revenueData";


const RevenueChart = () => {


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
          Monthly Revenue
        </h2>


        <p
          className="
          text-sm
          text-gray-500
          mt-1
          "
        >
          Revenue growth and business performance
        </p>


      </div>




      {
        revenueData.length === 0 ? (

          <div
            className="
            h-[350px]
            flex
            items-center
            justify-center
            text-gray-400
            "
          >
            No Revenue Data Available
          </div>

        ) : (


          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <LineChart
              data={revenueData}
              margin={{
                top: 10,
                right: 20,
                left: 0,
                bottom: 10,
              }}
            >


              <CartesianGrid
                strokeDasharray="3 3"
              />



              <XAxis
                dataKey="month"
              />



              <YAxis
                tickFormatter={(value)=> 
                  `₹${value / 1000}k`
                }
              />



              <Tooltip

                formatter={(value)=> 
                  `₹${Number(value).toLocaleString("en-IN")}`
                }

              />




              <Line

                type="monotone"

                dataKey="revenue"

                stroke="#2563eb"

                strokeWidth={3}

                dot={{
                  r:5,
                }}

                activeDot={{
                  r:8,
                }}

              />



            </LineChart>


          </ResponsiveContainer>


        )
      }



    </div>

  );

};


export default RevenueChart;