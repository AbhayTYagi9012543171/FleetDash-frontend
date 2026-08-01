import {
  FaTruck,
  FaGasPump,
  FaUserTie,
  FaTools,
  FaCheckCircle,
  FaWallet,
} from "react-icons/fa";

export const dashboardStats = [
  {
    title: "Fleet Health",
    value: "92%",
    icon: FaTruck,
    color: "bg-green-500",
    description: "Healthy Vehicles",
  },
  {
    title: "Fuel Today",
    value: "640 L",
    icon: FaGasPump,
    color: "bg-yellow-500",
    description: "Fuel Consumed",
  },
  {
    title: "Active Drivers",
    value: "48",
    icon: FaUserTie,
    color: "bg-blue-500",
    description: "Currently Working",
  },
  {
    title: "Today's Revenue",
    value: "₹1,24,000",
    icon: FaWallet,
    color: "bg-purple-500",
    description: "Total Earnings",
  },
  {
    title: "Vehicle Availability",
    value: "86%",
    icon: FaCheckCircle,
    color: "bg-cyan-500",
    description: "Ready to Use",
  },
  {
    title: "Maintenance Due",
    value: "12",
    icon: FaTools,
    color: "bg-red-500",
    description: "Needs Service",
  },
];