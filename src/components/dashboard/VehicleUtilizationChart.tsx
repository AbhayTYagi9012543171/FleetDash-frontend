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

    "#22c55e", // Active

    "#facc15", // Idle

    "#f97316", // Maintenance

    "#ef4444", // Offline

  ];






  return (

    <div
      className="
      bg-white
      rounded-xl
      shadow-md
      p-6
      "
    >



      <h2
        className="
        text-xl
        font-semibold
        mb-6
        text-gray-800
        "
      >

        Vehicle Utilization

      </h2>






      {
        vehicles.length === 0 ? (

          <div
            className="
            h-[300px]
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
            height={300}
          >

            <PieChart>


              <Pie

                data={data}

                dataKey="value"

                nameKey="name"

                cx="50%"

                cy="50%"

                outerRadius={100}

                label

              >



                {
                  data.map(
                    (entry, index) => (

                      <Cell

                        key={
                          `${entry.name}-${index}`
                        }

                        fill={
                          COLORS[index] ?? "#64748b"
                        }

                      />

                    )
                  )
                }



              </Pie>





              <Tooltip />

              <Legend />




            </PieChart>


          </ResponsiveContainer>


        )
      }



    </div>

  );

};



export default VehicleUtilizationChart;