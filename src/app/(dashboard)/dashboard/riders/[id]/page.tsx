"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";

interface Vehicle {
  id: number;
  type: string;
  brand?: string;
  model?: string;
  year?: number;
  licensePlate: string;
  color?: string;
}

interface CourierLocation {
  lat: number;
  lng: number;
  speed?: number;
  heading?: number;
  accuracy?: number;
  battery?: number;
  source?: string;
  timestamp: string;
}

interface Courier {
  id: number;
  status: string;
  phone: string;
  licenseNumber?: string;
  isActive: boolean;
  rating?: number;
  completedOrders: number;
  createdAt: string;
  user: {
    id: number;
    username: string;
    name: string;
    email: string;
    avatar?: string;
  };
  vehicle?: Vehicle;
  lastLocation?: CourierLocation;
}

export default function CourierDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const courierId = params.id as string;

  const [courier, setCourier] = useState<Courier | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchCourier();
    }
  }, [status, courierId]);

  const fetchCourier = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/riders/${courierId}`);
      const data = await response.json();

      if (response.ok) {
        setCourier(data.rider);
      } else {
        toast.error(data.error || "Error loading courier");
        router.push("/dashboard/riders");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error loading courier");
      router.push("/dashboard/riders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      setUpdating(true);
      const response = await fetch(`/api/riders/${courierId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Status updated");
        fetchCourier();
      } else {
        toast.error(data.error || "Error updating status");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error updating status");
    } finally {
      setUpdating(false);
    }
  };

  const toggleActive = async () => {
    try {
      setUpdating(true);
      const response = await fetch(`/api/riders/${courierId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !courier?.isActive }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Courier status updated");
        fetchCourier();
      } else {
        toast.error(data.error || "Error updating status");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error updating status");
    } finally {
      setUpdating(false);
    }
  };

  const deleteCourier = async () => {
    if (!confirm("Are you sure you want to delete this courier?")) {
      return;
    }

    try {
      const response = await fetch(`/api/riders/${courierId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Courier deleted successfully");
        router.push("/dashboard/riders");
      } else {
        toast.error(data.error || "Error deleting courier");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error deleting courier");
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      OFFLINE: "bg-gray-100 text-gray-800",
      IDLE: "bg-green-100 text-green-800",
      ON_DELIVERY: "bg-blue-100 text-blue-800",
    };
    const labels = {
      OFFLINE: "Offline",
      IDLE: "Available",
      ON_DELIVERY: "On Delivery",
    };

    return (
      <span
        className={`px-3 py-1 text-sm font-semibold rounded-full ${
          colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
        }`}
      >
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  const getVehicleIcon = (type?: string) => {
    switch (type) {
      case "MOTORCYCLE":
        return "🏍️";
      case "CAR":
        return "🚗";
      case "BICYCLE":
        return "🚲";
      case "SCOOTER":
        return "🛵";
      default:
        return "🚚";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courier...</p>
        </div>
      </div>
    );
  }

  if (!courier) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/dashboard/riders")}
          className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
        >
          ← Back to Couriers
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{courier.user.name}</h1>
            <p className="text-gray-600 mt-1">@{courier.user.username}</p>
          </div>
          {getStatusBadge(courier.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
                  {courier.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{courier.user.name}</p>
                  <p className="text-sm text-gray-500">{courier.user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{courier.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">License Number</p>
                  <p className="font-medium text-gray-900">
                    {courier.licenseNumber || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium text-gray-900">{formatDate(courier.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Status</p>
                  <p
                    className={`font-medium ${
                      courier.isActive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {courier.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Info */}
          {courier.vehicle && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Information</h2>

              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl">{getVehicleIcon(courier.vehicle.type)}</div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {courier.vehicle.brand} {courier.vehicle.model}
                  </p>
                  <p className="text-gray-600">{courier.vehicle.type}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">License Plate</p>
                  <p className="font-medium text-gray-900">{courier.vehicle.licensePlate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Year</p>
                  <p className="font-medium text-gray-900">{courier.vehicle.year || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Color</p>
                  <p className="font-medium text-gray-900">{courier.vehicle.color || "N/A"}</p>
                </div>
              </div>
            </div>
          )}

          {/* Location Info */}
          {courier.lastLocation && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Last Known Location</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Latitude</p>
                  <p className="font-medium text-gray-900">{courier.lastLocation.lat.toFixed(6)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Longitude</p>
                  <p className="font-medium text-gray-900">{courier.lastLocation.lng.toFixed(6)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Battery</p>
                  <p className="font-medium text-gray-900">
                    {courier.lastLocation.battery ? `${courier.lastLocation.battery}%` : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Update</p>
                  <p className="font-medium text-gray-900">
                    {new Date(courier.lastLocation.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>

            <div className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">{courier.completedOrders}</p>
                <p className="text-sm text-gray-600">Completed Deliveries</p>
              </div>

              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-3xl font-bold text-yellow-600">
                  {courier.rating ? Number(courier.rating).toFixed(1) : "N/A"}
                </p>
                <p className="text-sm text-gray-600">Rating</p>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>

            <div className="space-y-3">
              <button
                onClick={toggleActive}
                disabled={updating}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                  courier.isActive
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                } disabled:opacity-50`}
              >
                {courier.isActive ? "Deactivate" : "Activate"}
              </button>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Change Status:</p>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => updateStatus("IDLE")}
                    disabled={updating || courier.status === "IDLE"}
                    className="px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    Set Available
                  </button>
                  <button
                    onClick={() => updateStatus("OFFLINE")}
                    disabled={updating || courier.status === "OFFLINE"}
                    className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    Set Offline
                  </button>
                </div>
              </div>

              {session?.user?.role === "admin" && (
                <button
                  onClick={deleteCourier}
                  className="w-full px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium transition-colors"
                >
                  Delete Courier
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
