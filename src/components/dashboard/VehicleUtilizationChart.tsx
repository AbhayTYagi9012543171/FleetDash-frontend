import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";


interface Vehicle {
  status: "Active" | "Idle" | "Offline";
}


interface Props {
  vehicles: Vehicle[];
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


  const offline =
    vehicles.filter(
      (vehicle) =>
        vehicle.status === "Offline"
    ).length;



  const data = [
    {
      name: "Active",
      value: active,
    },

    {
      name: "Idle",
      value: idle,
    },

    {
      name: "Offline",
      value: offline,
    },
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
        "
      >
        Vehicle Utilization
      </h2>



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
              data.map((_, index)=>(
                <Cell
                  key={index}
                />
              ))
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