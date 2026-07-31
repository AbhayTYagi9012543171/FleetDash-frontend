import { useState } from "react";
import { api } from "../../services/api";

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

  if (!isOpen) return null;

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

      setName("");
      setLatitude("");
      setLongitude("");
      setRadius("");

      onSuccess();
    } catch (error) {
      console.error("Add Geofence Error:", error);
      alert("Failed to add geofence");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl w-full max-w-md p-6">

        <h2 className="text-2xl font-bold mb-5">
          Add Geofence
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="text"
            placeholder="Geofence Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
            className="w-full border rounded-lg p-3"
          />

          <input
            type="number"
            step="any"
            placeholder="Latitude"
            value={latitude}
            onChange={(e) =>
              setLatitude(e.target.value)
            }
            required
            className="w-full border rounded-lg p-3"
          />

          <input
            type="number"
            step="any"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) =>
              setLongitude(e.target.value)
            }
            required
            className="w-full border rounded-lg p-3"
          />

          <input
            type="number"
            placeholder="Radius (meters)"
            value={radius}
            onChange={(e) =>
              setRadius(e.target.value)
            }
            required
            className="w-full border rounded-lg p-3"
          />

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              {loading ? "Saving..." : "Save"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AddGeofenceModal;