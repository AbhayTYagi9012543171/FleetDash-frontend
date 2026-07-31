import { useState } from "react";

const VehicleForm = () => {
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    vehicleType: "",
    driverName: "",
    fuelType: "",
    gpsDevice: "",
    status: "Running",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Vehicle Data:", formData);

    alert("Vehicle Added Successfully!");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        Add Vehicle
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-5"
      >
        <input
          type="text"
          name="vehicleNumber"
          placeholder="Vehicle Number"
          className="border p-3 rounded-lg"
          value={formData.vehicleNumber}
          onChange={handleChange}
          required
        />

        <select
          name="vehicleType"
          className="border p-3 rounded-lg"
          value={formData.vehicleType}
          onChange={handleChange}
          required
        >
          <option value="">Select Vehicle Type</option>
          <option>Truck</option>
          <option>Bus</option>
          <option>Car</option>
          <option>Van</option>
        </select>

        <input
          type="text"
          name="driverName"
          placeholder="Driver Name"
          className="border p-3 rounded-lg"
          value={formData.driverName}
          onChange={handleChange}
          required
        />

        <select
          name="fuelType"
          className="border p-3 rounded-lg"
          value={formData.fuelType}
          onChange={handleChange}
          required
        >
          <option value="">Select Fuel Type</option>
          <option>Diesel</option>
          <option>Petrol</option>
          <option>CNG</option>
          <option>Electric</option>
        </select>

        <input
          type="text"
          name="gpsDevice"
          placeholder="GPS Device ID"
          className="border p-3 rounded-lg"
          value={formData.gpsDevice}
          onChange={handleChange}
          required
        />

        <select
          name="status"
          className="border p-3 rounded-lg"
          value={formData.status}
          onChange={handleChange}
        >
          <option>Running</option>
          <option>Offline</option>
          <option>Maintenance</option>
        </select>

        <button
          type="submit"
          className="md:col-span-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Save Vehicle
        </button>
      </form>
    </div>
  );
};

export default VehicleForm;