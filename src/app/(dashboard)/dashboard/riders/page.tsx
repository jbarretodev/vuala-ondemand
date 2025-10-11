"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Vehicle {
  id: number;
  type: string;
  brand?: string;
  model?: string;
  licensePlate: string;
  color?: string;
}

interface CourierLocation {
  lat: number;
  lng: number;
  battery?: number;
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
  user: {
    id: number;
    username: string;
    name: string;
    email: string;
    avatar?: string;
  };
  vehicle?: Vehicle;
  lastLocation?: CourierLocation;
  _count?: {
    orders: number;
  };
}

export default function CouriersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    fetchCouriers();
  }, [currentPage, filter]);

  const fetchCouriers = async () => {
    try {
      setLoading(true);
      let url = `/api/riders?page=${currentPage}&limit=10`;
      
      if (filter !== "all") {
        if (filter === "active") {
          url += `&isActive=true`;
        } else if (filter === "inactive") {
          url += `&isActive=false`;
        } else {
          url += `&status=${filter}`;
        }
      }

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setCouriers(data.riders);
        setTotalPages(data.pages);
      } else {
        toast.error(data.error || "Error loading couriers");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error loading couriers");
    } finally {
      setLoading(false);
    }
  };

  const toggleCourierStatus = async (courierId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/riders/${courierId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        fetchCouriers();
      } else {
        toast.error(data.error || "Error updating status");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error updating status");
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
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  const getVehicleIcon = (type?: string) => {
    switch (type) {
      case "MOTORCYCLE": return "🏍️";
      case "CAR": return "🚗";
      case "BICYCLE": return "🚲";
      case "SCOOTER": return "🛵";
      default: return "🚚";
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading couriers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Couriers</h1>
          <p className="text-gray-600 mt-1">Manage delivery couriers</p>
        </div>
        <button
          onClick={() => router.push("/dashboard/riders/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <span className="text-lg">+</span>
          <span>New Courier</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "active"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("IDLE")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "IDLE"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Available
          </button>
          <button
            onClick={() => setFilter("ON_DELIVERY")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "ON_DELIVERY"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            On Delivery
          </button>
          <button
            onClick={() => setFilter("inactive")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "inactive"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Inactive
          </button>
        </div>
      </div>

      {/* Couriers Grid */}
      {couriers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-500 text-lg">No couriers available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {couriers.map((courier) => (
            <div
              key={courier.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                    {courier.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{courier.user.name}</h3>
                    <p className="text-sm text-gray-500">@{courier.user.username}</p>
                  </div>
                </div>
                {getStatusBadge(courier.status)}
              </div>

              {/* Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">📧</span>
                  <span className="truncate">{courier.user.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">📱</span>
                  <span>{courier.phone}</span>
                </div>
                {courier.vehicle && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">{getVehicleIcon(courier.vehicle.type)}</span>
                    <span>
                      {courier.vehicle.brand} {courier.vehicle.model} ({courier.vehicle.licensePlate})
                    </span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{courier.completedOrders}</p>
                  <p className="text-xs text-gray-500">Deliveries</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {courier.rating ? Number(courier.rating).toFixed(1) : "N/A"}
                  </p>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {courier.lastLocation?.battery || "—"}
                  </p>
                  <p className="text-xs text-gray-500">Battery</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => toggleCourierStatus(courier.id, courier.isActive)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    courier.isActive
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  {courier.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => router.push(`/dashboard/riders/${courier.id}`)}
                  className="flex-1 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  View details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
