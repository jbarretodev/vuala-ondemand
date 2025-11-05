"use client";

import { useState, useRef, useEffect } from "react";

type Rider = {
  id: number;
  phone: string;
  status: string;
  isActive: boolean;
  rating: number | null;
  completedOrders: number;
  user: {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
  };
  vehicle: {
    id: number;
    type: string;
    brand: string | null;
    model: string | null;
    licensePlate: string;
  } | null;
  lastLocation: {
    lat: number;
    lng: number;
    timestamp: string;
  } | null;
};

type CourierComboboxProps = {
  riders: Rider[];
  selectedRiderId: number | null;
  onSelect: (riderId: number | null) => void;
  disabled?: boolean;
  placeholder?: string;
};

export default function CourierCombobox({
  riders,
  selectedRiderId,
  onSelect,
  disabled = false,
  placeholder = "Buscar courier...",
}: CourierComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedRider = riders.find((r) => r.id === selectedRiderId);

  // Filtrar couriers basado en búsqueda
  const filteredRiders = riders.filter((rider) => {
    const searchLower = search.toLowerCase();
    return (
      rider.user.name.toLowerCase().includes(searchLower) ||
      rider.phone.includes(searchLower) ||
      rider.vehicle?.type.toLowerCase().includes(searchLower) ||
      rider.vehicle?.licensePlate.toLowerCase().includes(searchLower)
    );
  });

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (rider: Rider) => {
    onSelect(rider.id);
    setIsOpen(false);
    setSearch("");
  };

  const handleClear = () => {
    onSelect(null);
    setSearch("");
    inputRef.current?.focus();
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-full">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between gap-2 px-3 py-2 
          rounded-lg border border-neutral-200 bg-white text-left text-sm
          hover:border-neutral-300 focus:outline-none focus:ring-4 
          focus:ring-[var(--color-brand-500)]/20
          disabled:bg-neutral-100 disabled:cursor-not-allowed
          ${isOpen ? "ring-4 ring-[var(--color-brand-500)]/20" : ""}
        `}
      >
        <div className="flex-1 min-w-0">
          {selectedRider ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--color-brand-500)] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                {selectedRider.user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">
                  {selectedRider.user.name}
                </div>
                <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                  <span className="text-xs text-neutral-600">
                    {selectedRider.vehicle?.type || "Sin vehículo"}
                  </span>
                  {selectedRider.vehicle?.licensePlate && (
                    <>
                      <span className="text-xs text-neutral-400">•</span>
                      <span className="text-xs text-neutral-600">
                        {selectedRider.vehicle.licensePlate}
                      </span>
                    </>
                  )}
                  <span className="text-xs text-neutral-400">•</span>
                  <span className="text-xs text-neutral-600">
                    {selectedRider.completedOrders} entregas
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <span className="text-neutral-400">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {selectedRider && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="p-1 hover:bg-neutral-100 rounded"
            >
              <svg
                className="w-4 h-4 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          <svg
            className={`w-4 h-4 text-neutral-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-lg shadow-lg overflow-hidden max-w-full">
          {/* Search Input */}
          <div className="p-2 border-b border-neutral-100">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, teléfono, vehículo..."
              className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-brand-500)]/20"
            />
          </div>

          {/* Options List */}
          <div className="max-h-[280px] overflow-y-auto">
            {filteredRiders.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-neutral-500">
                {search ? (
                  <>
                    <div className="text-2xl mb-2">🔍</div>
                    No se encontraron couriers con &quot;{search}&quot;
                  </>
                ) : (
                  <>
                    <div className="text-2xl mb-2">🚫</div>
                    No hay couriers disponibles
                  </>
                )}
              </div>
            ) : (
              <div className="py-1">
                {filteredRiders.map((rider) => (
                  <button
                    key={rider.id}
                    type="button"
                    onClick={() => handleSelect(rider)}
                    className={`
                      w-full px-4 py-3 flex items-start gap-3 hover:bg-neutral-50 transition-colors
                      ${
                        selectedRiderId === rider.id
                          ? "bg-[var(--color-brand-500)]/5"
                          : ""
                      }
                    `}
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-[var(--color-brand-500)] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                      {rider.user.name.charAt(0)}
                    </div>

                    {/* Info - Layout vertical para mejor responsividad */}
                    <div className="flex-1 min-w-0 text-left">
                      {/* Nombre y Check */}
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="font-semibold text-sm truncate">
                          {rider.user.name}
                        </div>
                        {selectedRiderId === rider.id && (
                          <svg
                            className="w-5 h-5 text-[var(--color-brand-500)] flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>

                      {/* Teléfono */}
                      <div className="text-xs text-neutral-600 mb-2">
                        {rider.phone}
                      </div>

                      {/* Tags en fila - responsive */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Vehículo */}
                        {rider.vehicle && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-neutral-100 text-neutral-700 font-medium">
                            {rider.vehicle.type}
                          </span>
                        )}

                        {/* Placa */}
                        {rider.vehicle?.licensePlate && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-neutral-100 text-neutral-600">
                            {rider.vehicle.licensePlate}
                          </span>
                        )}

                        {/* Rating */}
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-amber-50 text-amber-700">
                          <span>⭐</span>
                          <span className="font-semibold">
                            {rider.rating ? Number(rider.rating).toFixed(1) : "N/A"}
                          </span>
                        </span>

                        {/* Entregas */}
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-50 text-blue-700">
                          {rider.completedOrders} entrega{rider.completedOrders !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {filteredRiders.length > 0 && (
            <div className="px-3 py-2 bg-neutral-50 border-t border-neutral-100 text-xs text-neutral-500">
              {filteredRiders.length} courier{filteredRiders.length !== 1 ? "s" : ""}{" "}
              {search ? "encontrado" + (filteredRiders.length !== 1 ? "s" : "") : "disponible" + (filteredRiders.length !== 1 ? "s" : "")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
