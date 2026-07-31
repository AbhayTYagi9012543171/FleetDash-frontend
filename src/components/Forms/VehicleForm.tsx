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

    console.log(formData);

    alert("Vehicle Added Successfully!");
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">

      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Add Vehicle
        </h2>

        <p className="text-gray-500 mt-2">
          Enter vehicle details below.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >

        {/* Vehicle Number */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Vehicle Number
          </label>

          <input
            type="text"
            name="vehicleNumber"
            placeholder="UP14 AB 1234"
            value={formData.vehicleNumber}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Vehicle Type */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Vehicle Type
          </label>

          <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
            <option value="">Select Type</option>
            <option>Truck</option>
            <option>Bus</option>
            <option>Car</option>
            <option>Van</option>
          </select>
        </div>

        {/* Driver */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Driver Name
          </label>

          <input
            type="text"
            name="driverName"
            placeholder="Enter Driver Name"
            value={formData.driverName}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Fuel */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Fuel Type
          </label>

          <select
            name="fuelType"
            value={formData.fuelType}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
            <option value="">Select Fuel</option>
            <option>Diesel</option>
            <option>Petrol</option>
            <option>CNG</option>
            <option>Electric</option>
          </select>
        </div>

        {/* GPS */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            GPS Device ID
          </label>

          <input
            type="text"
            name="gpsDevice"
            placeholder="GPS-123456"
            value={formData.gpsDevice}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Status */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Status
          </label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option>Running</option>
            <option>Offline</option>
            <option>Maintenance</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 mt-4">

          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition"
          >
            Save Vehicle
          </button>

          <button
            type="reset"
            className="w-full sm:w-auto border border-gray-300 hover:bg-gray-100 px-8 py-3 rounded-lg transition"
            onClick={() =>
              setFormData({
                vehicleNumber: "",
                vehicleType: "",
                driverName: "",
                fuelType: "",
                gpsDevice: "",
                status: "Running",
              })
            }
          >
            Reset
          </button>

        </div>

      </form>

    </div>
  );
};

export default VehicleForm;