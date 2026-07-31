import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { FaTimes } from "react-icons/fa";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddGeofenceModal = ({
  isOpen,
  onClose,
  onSuccess,
}: Props) => {
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [radius, setRadius] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const resetForm = () => {
    setName("");
    setLatitude("");
    setLongitude("");
    setRadius("");
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/geofences", {
        name,
        center: {
          latitude: Number(latitude),
          longitude: Number(longitude),
        },
        radius: Number(radius),
      });

      resetForm();
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Failed to add geofence");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="
        fixed
        inset-0
        z-50
        bg-black/50
        flex
        items-center
        justify-center
        p-4
        overflow-y-auto
      "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full
          max-w-lg
          bg-white
          rounded-2xl
          shadow-2xl
          p-5
          sm:p-6
          animate-in
        "
      >
        {/* Header */}

        <div className="flex items-center justify-between mb-6">

          <div>
            <h2 className="text-2xl font-bold">
              Add Geofence
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Create a new geofence area.
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              p-2
              rounded-lg
              hover:bg-gray-100
            "
          >
            <FaTimes />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>
            <label className="block text-sm font-medium mb-2">
              Geofence Name
            </label>

            <input
              type="text"
              required
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Warehouse Zone"
              className="
                w-full
                border
                rounded-lg
                p-3
                focus:ring-2
                focus:ring-blue-500
                outline-none
              "
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium mb-2">
                Latitude
              </label>

              <input
                type="number"
                step="any"
                required
                value={latitude}
                onChange={(e) =>
                  setLatitude(e.target.value)
                }
                className="
                  w-full
                  border
                  rounded-lg
                  p-3
                  focus:ring-2
                  focus:ring-blue-500
                "
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Longitude
              </label>

              <input
                type="number"
                step="any"
                required
                value={longitude}
                onChange={(e) =>
                  setLongitude(e.target.value)
                }
                className="
                  w-full
                  border
                  rounded-lg
                  p-3
                  focus:ring-2
                  focus:ring-blue-500
                "
              />
            </div>

          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Radius (Meters)
            </label>

            <input
              type="number"
              required
              value={radius}
              onChange={(e) =>
                setRadius(e.target.value)
              }
              placeholder="500"
              className="
                w-full
                border
                rounded-lg
                p-3
                focus:ring-2
                focus:ring-blue-500
              "
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="
                w-full
                sm:w-auto
                px-5
                py-3
                rounded-lg
                border
                hover:bg-gray-100
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                sm:w-auto
                px-5
                py-3
                rounded-lg
                bg-blue-600
                text-white
                hover:bg-blue-700
                disabled:opacity-60
              "
            >
              {loading ? "Saving..." : "Save Geofence"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default AddGeofenceModal;