import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import type { Vehicle } from "../../types/vehicle";


interface Props {
  vehicles: Vehicle[];
}


interface ChartData {
  name: string;
  value: number;
}



const VehicleUtilizationChart = ({
  vehicles,
}: Props) => {


  const active =
    vehicles.filter(
      (vehicle) =>
        vehicle.status === "Active"
    ).length;



  const idle =
    vehicles.filter(
      (vehicle) =>
        vehicle.status === "Idle"
    ).length;



  const maintenance =
    vehicles.filter(
      (vehicle) =>
        vehicle.status === "Maintenance"
    ).length;



  const offline =
    vehicles.filter(
      (vehicle) =>
        vehicle.status === "Offline"
    ).length;




  const data: ChartData[] = [

    {
      name: "Active",
      value: active,
    },

    {
      name: "Idle",
      value: idle,
    },

    {
      name: "Maintenance",
      value: maintenance,
    },

    {
      name: "Offline",
      value: offline,
    },

  ];




  const COLORS = [

    "#22c55e",
    "#eab308",
    "#f97316",
    "#ef4444",

  ];



  const totalVehicles =
    vehicles.length;



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

      <div className="mb-5">


        <h2
          className="
          text-xl
          font-bold
          text-slate-800
          "
        >

          Vehicle Utilization

        </h2>



        <p
          className="
          text-sm
          text-gray-500
          mt-1
          "
        >

          Real-time vehicle status distribution

        </p>


      </div>





      {
        totalVehicles === 0 ? (


          <div
            className="
            h-[320px]
            flex
            items-center
            justify-center
            text-gray-400
            "
          >

            No Vehicle Data Available

          </div>



        ) : (


          <ResponsiveContainer
            width="100%"
            height={320}
          >


            <PieChart>


              <Pie

                data={data}

                dataKey="value"

                nameKey="name"

                cx="50%"

                cy="50%"

                innerRadius={60}

                outerRadius={110}

                paddingAngle={5}

                label

              >


                {
                  data.map(
                    (entry,index)=>(


                      <Cell

                        key={
                          `${entry.name}-${index}`
                        }

                        fill={
                          COLORS[index]
                        }

                      />


                    )
                  )
                }


              </Pie>




              <Tooltip

                formatter={(value)=>
                  `${value} Vehicles`
                }

              />



              <Legend

                verticalAlign="bottom"

                height={36}

              />



            </PieChart>


          </ResponsiveContainer>


        )
      }





      {/* Summary */}

      <div
        className="
        grid
        grid-cols-2
        gap-4
        mt-5
        "
      >


        <div
          className="
          bg-green-50
          rounded-xl
          p-3
          "
        >

          <p className="text-xs text-gray-500">
            Active
          </p>

          <h3 className="text-xl font-bold text-green-600">
            {active}
          </h3>

        </div>



        <div
          className="
          bg-red-50
          rounded-xl
          p-3
          "
        >

          <p className="text-xs text-gray-500">
            Offline
          </p>

          <h3 className="text-xl font-bold text-red-600">
            {offline}
          </h3>

        </div>


      </div>



    </div>

  );

};



export default VehicleUtilizationChart;