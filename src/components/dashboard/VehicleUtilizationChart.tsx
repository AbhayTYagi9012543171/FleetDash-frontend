import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import { vehicleUtilizationData } from "../../data/vehicleUtilizationData";


const VehicleUtilizationChart = () => {

  return (

    <div className="
      bg-white
      rounded-xl
      shadow-md
      p-6
    ">

      <h2 className="
        text-xl
        font-semibold
        mb-6
      ">
        Vehicle Utilization
      </h2>


      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <PieChart>

          <Pie
            data={vehicleUtilizationData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >

            {
              vehicleUtilizationData.map(
                (entry,index)=>(
                  
                  <Cell
                    key={`cell-${index}`}
                  />

                )
              )
            }

          </Pie>


          <Tooltip />

          <Legend />


        </PieChart>


      </ResponsiveContainer>


    </div>

  );
};


export default VehicleUtilizationChart;