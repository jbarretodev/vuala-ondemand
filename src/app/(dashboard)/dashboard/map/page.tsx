"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import mapboxgl, {
  GeoJSONSource,
  LngLatLike,
  Map as MapboxMap,
} from "mapbox-gl";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point, featureCollection } from "@turf/helpers";
import bbox from "@turf/bbox";

/* ================== Config ================== */
if (typeof window !== "undefined") {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;
}

/* ================== Tipos ================== */
type LatLng = { lat: number; lng: number };
type Suggestion = { id: string; place_name: string; center: [number, number] };

// Tipos GeoJSON básicos
interface Feature<T = any> {
  type: "Feature";
  geometry: T;
  properties: any;
}

interface Polygon {
  type: "Polygon";
  coordinates: number[][][];
}

interface MultiPolygon {
  type: "MultiPolygon";
  coordinates: number[][][][];
}

interface LineString {
  type: "LineString";
  coordinates: number[][];
}

type ZoneFeature = Feature<Polygon | MultiPolygon>;

/* ================== Helpers ================== */
const fmtPrice = (km: number) => `€ ${Math.max(3, 4.5 + km * 1).toFixed(2)}`;
const metersToKm = (m: number) => +(m / 1000).toFixed(2);
const secondsToMinText = (s: number) =>
  `${Math.max(1, Math.round(s / 60))} min`;

/* ---------- GeoJSON normalizer (robusto) ---------- */
function hasValidCoordinates(f: any): f is ZoneFeature {
  if (!f?.geometry) return false;
  const g = f.geometry;
  if (g.type === "Polygon") {
    return (
      Array.isArray(g.coordinates) &&
      g.coordinates.length > 0 &&
      Array.isArray(g.coordinates[0]) &&
      g.coordinates[0].length > 2
    );
  }
  if (g.type === "MultiPolygon") {
    return (
      Array.isArray(g.coordinates) &&
      g.coordinates.length > 0 &&
      Array.isArray(g.coordinates[0]) &&
      Array.isArray(g.coordinates[0][0]) &&
      g.coordinates[0][0].length > 2
    );
  }
  return false;
}

/** Devuelve Feature<Polygon|MultiPolygon> válido o null */
function normalizeZoneGeoJSON(gj: any): ZoneFeature | null {
  try {
    if (!gj) return null;

    if (gj.type === "FeatureCollection" && Array.isArray(gj.features)) {
      const f = gj.features.find(
        (ft: any) =>
          ft?.geometry?.type === "Polygon" ||
          ft?.geometry?.type === "MultiPolygon"
      );
      if (f && hasValidCoordinates(f)) return f as ZoneFeature;
      return null;
    }

    if (gj.type === "Feature") {
      if (hasValidCoordinates(gj)) return gj as ZoneFeature;
      return null;
    }

    if (gj.type === "Polygon" || gj.type === "MultiPolygon") {
      const f: ZoneFeature = { type: "Feature", geometry: gj, properties: {} };
      return hasValidCoordinates(f) ? f : null;
    }

    return null;
  } catch {
    return null;
  }
}

/* ================== AddressInput (autocomplete) ================== */
function AddressInput({
  label,
  value,
  onSelect,
  placeholder = "Escribe una dirección…",
}: {
  label: string;
  value: string;
  onSelect: (v: {
    address: string;
    coords: { lat: number; lng: number };
  }) => void;
  placeholder?: string;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [q, setQ] = useState(value);
  const [items, setItems] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const token = typeof window !== "undefined" ? mapboxgl.accessToken : "";

  // Mantén sincronizado el valor externo
  useEffect(() => setQ(value), [value]);

  // ---- Autocomplete (debounce) ----
  useEffect(() => {
    const t = setTimeout(async () => {
      const query = q.trim();
      if (!query) {
        setItems([]);
        setOpen(false);
        return;
      }
      try {
        const url = new URL(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query
          )}.json`
        );
        url.searchParams.set("access_token", token || '');
        url.searchParams.set("language", "es");
        url.searchParams.set("limit", "5");
        const res = await fetch(url.toString());
        const data = await res.json();
        const feats = (data?.features || []) as any[];
        const suggs: Suggestion[] = feats.map((f) => ({
          id: f.id,
          place_name: f.place_name,
          center: f.center, // [lng,lat]
        }));
        setItems(suggs);
        setOpen(suggs.length > 0);
      } catch {
        setItems([]);
        setOpen(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [q, token]);

  // ---- Cerrar con click fuera ----
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // ---- Handlers ----
  const handleSelect = (s: Suggestion) => {
    const address = s.place_name;
    const coords = { lat: s.center[1], lng: s.center[0] };
    setQ(address);
    setItems([]);
    setOpen(false);
    onSelect({ address, coords });
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
    if (e.key === "Enter") {
      // si hay sugerencias, toma la primera
      if (items.length > 0) {
        e.preventDefault();
        handleSelect(items[0]);
      } else {
        setOpen(false);
      }
    }
  };

  return (
    <div ref={wrapRef} className="relative">
      <label className="mb-1 block text-sm font-medium">{label}</label>

      <div className="relative">
        {/* icono lupa */}
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m1.85-4.65a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-neutral-300 px-3 py-2 pl-10 text-sm outline-none ring-[var(--color-brand-500)]/20 focus:ring-4"
          onFocus={() => items.length && setOpen(true)}
          onBlur={(e) => {
            // pequeño delay para permitir click en la lista
            setTimeout(() => {
              if (!wrapRef.current?.contains(document.activeElement))
                setOpen(false);
            }, 100);
          }}
          onKeyDown={handleKeyDown}
        />
      </div>

      {open && items.length > 0 && (
        <ul className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-neutral-200 bg-white shadow-lg">
          {items.map((s) => (
            <li
              key={s.id}
              className="cursor-pointer px-3 py-2 text-sm hover:bg-neutral-50"
              onMouseDown={(e) => e.preventDefault()} // evita perder el foco antes del click
              onClick={() => handleSelect(s)}
            >
              {s.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ================== Página ================== */
function NewOrderMapboxPageClient() {
  const mapRef = useRef<MapboxMap | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Datos del cliente
  const [customerName, setCustomerName] = useState("");
  const [customerLastName, setCustomerLastName] = useState("");

  // Orden programada
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const [pickupAddr, setPickupAddr] = useState("");
  const [dropoffAddr, setDropoffAddr] = useState("");
  const [pickup, setPickup] = useState<LatLng | null>(null);
  const [dropoff, setDropoff] = useState<LatLng | null>(null);

  const [zone, setZone] = useState<ZoneFeature | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [durationText, setDurationText] = useState<string>("");
  const [hasRoute, setHasRoute] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Couriers state
  const [couriers, setCouriers] = useState<any[]>([]);
  const courierMarkersRef = useRef<mapboxgl.Marker[]>([]);

  // bandera de mapa listo (fix appendChild)
  const isMapReadyRef = useRef(false);

  /* ====== cargar couriers ====== */
  useEffect(() => {
    const fetchCouriers = async () => {
      try {
        // Fetch only IDLE and ON_DELIVERY couriers
        const response = await fetch('/api/riders?status=IDLE');
        const data = await response.json();
        const idleCouriers = data.riders || [];

        const response2 = await fetch('/api/riders?status=ON_DELIVERY');
        const data2 = await response2.json();
        const onDeliveryCouriers = data2.riders || [];

        const allCouriers = [...idleCouriers, ...onDeliveryCouriers];
        setCouriers(allCouriers);
      } catch (error) {
        console.error('Error fetching couriers:', error);
      }
    };

    fetchCouriers();
    // Refresh every 10 seconds
    const interval = setInterval(fetchCouriers, 10000);
    return () => clearInterval(interval);
  }, []);

  /* ====== cargar polígono (zona) ====== */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/zone.json");
        if (!res.ok) {
          console.warn("[zone] /zone.json no disponible");
          return;
        }
        const raw = await res.json();
        const feat = normalizeZoneGeoJSON(raw);

        if (!feat) {
          console.warn("[zone] GeoJSON sin Polygon/MultiPolygon válido");
          setZone(null);
          return;
        }

        setZone(feat);

        const map = mapRef.current;
        if (map && map.isStyleLoaded()) {
          ensureZoneSourceAndLayers(map, feat);
          fitToFeature(map, feat);
        }
      } catch (e) {
        console.error("No se pudo cargar zone.json", e);
      }
    })();
  }, []);

  /* ====== inicializar mapa ====== */
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-2.4637, 36.8402], // Almería, España
      zoom: 13,
    });

    map.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      "top-right"
    );
    mapRef.current = map;

    const onLoad = () => {
      isMapReadyRef.current = true;

      if (!map.getSource("route")) {
        map.addSource("route", {
          type: "geojson",
          data: featureCollection([]),
        });
        map.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          paint: { "line-color": "#3D5AFE", "line-width": 4 },
          layout: { "line-cap": "round", "line-join": "round" },
        });
      }
      if (zone) {
        ensureZoneSourceAndLayers(map, zone);
        fitToFeature(map, zone);
      }
    };

    map.on("load", onLoad);

    return () => {
      // limpieza para evitar referencias colgantes y errores en Fast Refresh
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      courierMarkersRef.current.forEach((m) => m.remove());
      courierMarkersRef.current = [];
      isMapReadyRef.current = false;
      map.off("load", onLoad);
      map.remove();
      mapRef.current = null;
    };
  }, [zone]);

  /* ====== marcadores + bounds (con guardas de mapa listo) ====== */
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReadyRef.current) return;
    const container = map.getContainer?.();
    if (!container) return;

    // limpiar marcadores anteriores
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    try {
      if (pickup) {
        const mk = new mapboxgl.Marker({ color: "#1E3ABF" })
          .setLngLat([pickup.lng, pickup.lat])
          .addTo(map);
        markersRef.current.push(mk);
      }
      if (dropoff) {
        const mk = new mapboxgl.Marker({ color: "#FFB300" })
          .setLngLat([dropoff.lng, dropoff.lat])
          .addTo(map);
        markersRef.current.push(mk);
      }
    } catch (e) {
      console.warn("No se pudo añadir el/los marcador(es):", e);
      return;
    }

    // Ajusta bounds solo si hay al menos un punto
    if (pickup || dropoff) {
      const b = new mapboxgl.LngLatBounds();
      if (pickup) b.extend([pickup.lng, pickup.lat]);
      if (dropoff) b.extend([dropoff.lng, dropoff.lat]);
      try {
        map.fitBounds(b, { padding: 60, duration: 400 });
      } catch {}
    }
  }, [pickup?.lat, pickup?.lng, dropoff?.lat, dropoff?.lng]);

  /* ====== marcadores de couriers ====== */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReadyRef.current) return;

    // Limpiar marcadores de couriers anteriores
    courierMarkersRef.current.forEach((m) => m.remove());
    courierMarkersRef.current = [];

    // Crear marcadores para cada courier
    couriers.forEach((courier) => {
      if (!courier.lastLocation) return;

      const { lat, lng } = courier.lastLocation;

      // Color según estado
      const color = courier.status === 'IDLE' ? '#10B981' : '#F59E0B'; // Verde: disponible, Naranja: en delivery

      // Crear elemento HTML personalizado para el marcador
      const el = document.createElement('div');
      el.className = 'courier-marker';
      el.style.cssText = `
        width: 32px;
        height: 32px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
      `;
      
      // Icono según tipo de vehículo
      const vehicleIcons: Record<string, string> = {
        MOTORCYCLE: '🏍️',
        CAR: '🚗',
        BICYCLE: '🚲',
        SCOOTER: '🛵',
      };
      el.textContent = vehicleIcons[courier.vehicle?.type] || '🚚';

      // Crear popup con información del courier
      const popupContent = `
        <div style="padding: 12px 16px; min-width: 200px;">
          <h3 style="font-weight: 600; margin: 0 20px 10px 0; font-size: 14px; padding-right: 10px;">${courier.user.name}</h3>
          <div style="font-size: 12px; color: #666; line-height: 1.8;">
            <div><strong>Status:</strong> ${courier.status === 'IDLE' ? 'Available' : 'On Delivery'}</div>
            <div><strong>Vehicle:</strong> ${courier.vehicle?.brand || ''} ${courier.vehicle?.model || ''}</div>
            <div><strong>Plate:</strong> ${courier.vehicle?.licensePlate || 'N/A'}</div>
            <div><strong>Rating:</strong> ${courier.rating ? Number(courier.rating).toFixed(1) : 'N/A'} ⭐</div>
            <div><strong>Deliveries:</strong> ${courier.completedOrders}</div>
            ${courier.lastLocation?.battery ? `<div><strong>Battery:</strong> ${courier.lastLocation.battery}%</div>` : ''}
          </div>
        </div>
      `;

      const popup = new mapboxgl.Popup({ 
        offset: 25,
        closeButton: true,
        closeOnClick: false,
        maxWidth: '280px'
      }).setHTML(popupContent);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map);

      courierMarkersRef.current.push(marker);
    });
  }, [couriers]);

  /* ====== pedir ruta a Mapbox Directions ====== */
  useEffect(() => {
    const fetchRoute = async () => {
      const map = mapRef.current;
      if (!map || !isMapReadyRef.current) return;

      if (!pickup || !dropoff) {
        setHasRoute(false);
        setDistanceKm(null);
        setDurationText("");
        const src = map.getSource("route") as GeoJSONSource | undefined;
        if (src) src.setData(featureCollection([]));
        return;
      }

      try {
        const url = new URL(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}`
        );
        url.searchParams.set("alternatives", "false");
        url.searchParams.set("geometries", "geojson");
        url.searchParams.set("overview", "full");
        url.searchParams.set("access_token", mapboxgl.accessToken || '');

        const res = await fetch(url.toString());
        const data = await res.json();
        const r = data?.routes?.[0];
        if (!r) {
          setHasRoute(false);
          setDistanceKm(null);
          setDurationText("");
          const src = map.getSource("route") as GeoJSONSource | undefined;
          if (src) src.setData(featureCollection([]));
          return;
        }

        const line: Feature<LineString> = {
          type: "Feature",
          geometry: r.geometry,
          properties: {},
        };
        setHasRoute(true);
        setDistanceKm(metersToKm(r.distance));
        setDurationText(secondsToMinText(r.duration));

        const src = map.getSource("route") as GeoJSONSource | undefined;
        if (src) src.setData(line as any);
      } catch (e) {
        console.error(e);
        setHasRoute(false);
        setDistanceKm(null);
        setDurationText("");
      }
    };

    fetchRoute();
  }, [pickup?.lat, pickup?.lng, dropoff?.lat, dropoff?.lng]);

  /* ====== validación: dentro de la zona (a prueba de fallos) ====== */
  const pickupInside = useMemo(() => {
    if (!pickup || !zone) return false;
    const t = zone.geometry?.type;
    if (t !== "Polygon" && t !== "MultiPolygon") return false;
    try {
      return booleanPointInPolygon(
        point([pickup.lng, pickup.lat]),
        zone as any
      );
    } catch (e) {
      console.warn("[zone] booleanPointInPolygon error (pickup):", e);
      return false;
    }
  }, [pickup?.lat, pickup?.lng, zone]);

  const dropoffInside = useMemo(() => {
    if (!dropoff || !zone) return false;
    const t = zone.geometry?.type;
    if (t !== "Polygon" && t !== "MultiPolygon") return false;
    try {
      return booleanPointInPolygon(
        point([dropoff.lng, dropoff.lat]),
        zone as any
      );
    } catch (e) {
      console.warn("[zone] booleanPointInPolygon error (dropoff):", e);
      return false;
    }
  }, [dropoff?.lat, dropoff?.lng, zone]);

  /* ====== centro del mapa ====== */
  const center: LngLatLike = useMemo<LngLatLike>(() => {
    if (pickup) return [pickup.lng, pickup.lat];
    return [-2.4637, 36.8402]; // Almería, España
  }, [pickup]);

  const price = useMemo(
    () => (distanceKm ? fmtPrice(distanceKm) : ""),
    [distanceKm]
  );
  const priceNumeric = useMemo(
    () => (distanceKm ? Math.max(3, 4.5 + distanceKm * 1) : 0),
    [distanceKm]
  );

  const handleSubmit = async () => {
    if (!pickup || !dropoff || !hasRoute || !pickupInside || !dropoffInside)
      return;
    if (!customerName.trim() || !customerLastName.trim()) {
      alert("Por favor ingresa nombre y apellido");
      return;
    }
    if (isScheduled && (!scheduledDate || !scheduledTime)) {
      alert("Por favor selecciona fecha y hora para la orden programada");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerLastName: customerLastName.trim(),
          pickupAddress: pickupAddr,
          deliveryAddress: dropoffAddr,
          isScheduled,
          scheduledDate: isScheduled ? scheduledDate : null,
          scheduledTime: isScheduled ? scheduledTime : null,
          distanceKm,
          estimatedTime: durationText,
          estimatedPrice: priceNumeric,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("¡Orden creada exitosamente!");
        window.location.href = "/dashboard/orders";
      } else {
        alert(data.error || "Error al crear la orden");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al crear la orden");
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableCouriers = couriers.filter(c => c.status === 'IDLE').length;
  const onDeliveryCouriers = couriers.filter(c => c.status === 'ON_DELIVERY').length;

  return (
    <>
      <style jsx global>{`
        .mapboxgl-popup-content {
          padding: 0 !important;
          border-radius: 8px !important;
        }
        
        .mapboxgl-popup-close-button {
          font-size: 20px !important;
          padding: 6px 8px !important;
          margin: 4px !important;
          color: #666 !important;
          background: transparent !important;
          border: none !important;
          cursor: pointer !important;
          transition: all 0.2s !important;
        }
        
        .mapboxgl-popup-close-button:hover {
          color: #000 !important;
          background: rgba(0, 0, 0, 0.05) !important;
          border-radius: 4px !important;
        }
        
        .mapboxgl-popup-tip {
          border-top-color: white !important;
        }
      `}</style>
      
      <main className="space-y-4">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-neutral-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-lg">
              🟢
            </div>
            <div>
              <p className="text-xl text-neutral-600">Available Couriers</p>
              <p className="text-2xl font-bold text-green-600">{availableCouriers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-neutral-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-lg">
              🟠
            </div>
            <div>
              <p className="text-xl text-neutral-600">On Delivery</p>
              <p className="text-2xl font-bold text-orange-600">{onDeliveryCouriers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-neutral-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">
              🚚
            </div>
            <div>
              <p className="text-xl text-neutral-600">Total Active</p>
              <p className="text-2xl font-bold text-blue-600">{couriers.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
        {/* Mapa */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-2 md:p-3">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-xl relative">
            <div ref={containerRef} className="h-full w-full" />
            
            {/* Legend */}
            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 text-xs z-10">
              <h4 className="font-semibold mb-2 text-sm">Courier Status</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow"></div>
                  <span>Available ({availableCouriers})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-white shadow"></div>
                  <span>On Delivery ({onDeliveryCouriers})</span>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-neutral-200 text-neutral-500">
                Updates every 10s
              </div>
            </div>
          </div>
          <p className="mt-2 text-xs text-neutral-500">
            Click on courier markers to view details. The map shows real-time courier locations.
          </p>
        </div>
      </div>
      </main>
    </>
  );
}

/* ================== Funciones auxiliares de mapa ================== */
function ensureZoneSourceAndLayers(map: MapboxMap, feat: ZoneFeature) {
  const src = map.getSource("zone") as GeoJSONSource | undefined;
  if (!src) {
    map.addSource("zone", { type: "geojson", data: feat as any });
    map.addLayer({
      id: "zone-fill",
      type: "fill",
      source: "zone",
      paint: { "fill-color": "#3D5AFE", "fill-opacity": 0.08 },
    });
    map.addLayer({
      id: "zone-stroke",
      type: "line",
      source: "zone",
      paint: { "line-color": "#3D5AFE", "line-width": 2, "line-opacity": 0.9 },
    });
  } else {
    src.setData(feat as any);
  }
}

function fitToFeature(map: MapboxMap, feat: ZoneFeature) {
  try {
    const [minX, minY, maxX, maxY] = bbox(feat as any);
    if (
      [minX, minY, maxX, maxY].every((n) => Number.isFinite(n)) &&
      maxX !== minX &&
      maxY !== minY
    ) {
      map.fitBounds(
        [
          [minX, minY],
          [maxX, maxY],
        ],
        { padding: 60, duration: 500 }
      );
    } else {
      console.warn("[zone] bbox inválido, no se ajustan bounds");
    }
  } catch (e) {
    console.warn("[zone] bbox error:", e);
  }
}

// Componente con carga dinámica para evitar hidratación
const NewOrderMapboxPage = dynamic(
  () => Promise.resolve(NewOrderMapboxPageClient),

);

export default NewOrderMapboxPage;
