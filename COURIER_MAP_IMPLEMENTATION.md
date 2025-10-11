# 🗺️ Courier Map Implementation - Real-Time Tracking

## 📋 Overview

Interactive map showing real-time courier locations in Almería, España. Displays available couriers (IDLE) and couriers on delivery (ON_DELIVERY) with auto-refresh every 10 seconds.

## 🎯 Features Implemented

### ✅ Real-Time Courier Tracking
- **Auto-refresh**: Updates courier positions every 10 seconds
- **Status filtering**: Shows only IDLE and ON_DELIVERY couriers
- **Color-coded markers**: 
  - 🟢 **Green** - Available couriers (IDLE)
  - 🟠 **Orange** - Couriers on delivery (ON_DELIVERY)

### ✅ Interactive Markers
- **Custom markers** with vehicle emojis (🏍️ 🚗 🚲 🛵)
- **Click to view details**: Popup with courier information
- **Popup content includes**:
  - Courier name
  - Status
  - Vehicle details (brand, model, plate)
  - Rating
  - Completed deliveries
  - Battery level

### ✅ Statistics Dashboard
Three real-time stat cards showing:
1. **Available Couriers** - Count of IDLE couriers
2. **On Delivery** - Count of couriers delivering
3. **Total Active** - Total couriers on map

### ✅ Map Legend
Floating legend showing:
- Available courier count
- On delivery courier count
- Auto-refresh indicator (10s)

## 🛠️ Technical Implementation

### API Integration

```typescript
// Fetch couriers by status
const response1 = await fetch('/api/riders?status=IDLE');
const response2 = await fetch('/api/riders?status=ON_DELIVERY');
```

**Refresh interval**: 10 seconds

### Marker Creation

```typescript
// Custom HTML marker element
const el = document.createElement('div');
el.style.cssText = `
  width: 32px;
  height: 32px;
  background-color: ${color}; // Green or Orange
  border: 3px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
`;

// Vehicle emoji based on type
const vehicleIcons = {
  MOTORCYCLE: '🏍️',
  CAR: '🚗',
  BICYCLE: '🚲',
  SCOOTER: '🛵',
};
```

### Popup with Courier Info

```typescript
const popupContent = `
  <div>
    <h3>${courier.user.name}</h3>
    <div>
      <div>Status: ${courier.status}</div>
      <div>Vehicle: ${courier.vehicle?.brand} ${courier.vehicle?.model}</div>
      <div>Plate: ${courier.vehicle?.licensePlate}</div>
      <div>Rating: ${courier.rating} ⭐</div>
      <div>Deliveries: ${courier.completedOrders}</div>
      <div>Battery: ${courier.lastLocation?.battery}%</div>
    </div>
  </div>
`;
```

## 📍 Map Configuration

### Center Point
- **Location**: Almería, España
- **Coordinates**: [-2.4637, 36.8402]
- **Zoom level**: 13

### Mapbox Style
- **Style**: `mapbox://styles/mapbox/streets-v12`
- **Controls**: Navigation control (zoom, rotate)

## 🎨 Visual Design

### Color Scheme

| Status | Color | Hex Code |
|--------|-------|----------|
| Available (IDLE) | Green | `#10B981` |
| On Delivery | Orange | `#F59E0B` |

### Stats Cards
- **Background**: White with subtle border
- **Layout**: 3-column grid (responsive)
- **Icons**: Emoji-based (🟢 🟠 🚚)
- **Typography**: Bold numbers, light labels

### Legend
- **Position**: Top-left corner
- **Background**: White with shadow
- **Content**: Color indicators + counts
- **Update indicator**: "Updates every 10s"

## 🔄 Data Flow

```
┌─────────────────┐
│  API /riders    │
│  ?status=IDLE   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│ Fetch Couriers  │─────►│ Set State    │
│ Every 10s       │      │ couriers[]   │
└─────────────────┘      └──────┬───────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │ useEffect       │
                       │ Update Markers  │
                       └────────┬────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │ Render on Map   │
                       │ with Popups     │
                       └─────────────────┘
```

## 🚀 Usage

### Access the Map
Navigate to: `http://localhost:3000/dashboard/map`

### View Courier Details
1. Look for colored markers on the map
2. Click on any marker
3. Popup appears with courier information

### Understand Status
- **Green markers** = Couriers available for assignment
- **Orange markers** = Couriers currently delivering

## 📊 Data Requirements

Each courier must have:
- `lastLocation` - with `lat`, `lng` coordinates
- `status` - IDLE or ON_DELIVERY
- `user.name` - Courier's name
- `vehicle` - Vehicle information
- `rating` - Performance rating
- `completedOrders` - Delivery count

## 🔮 Future Enhancements

### Phase 1: Planned
- [ ] **Real-time WebSocket updates** - Live position updates
- [ ] **Route visualization** - Show courier's current route
- [ ] **Filter controls** - Toggle courier types
- [ ] **Search functionality** - Find specific courier

### Phase 2: Advanced
- [ ] **Historical playback** - Replay courier movements
- [ ] **Heat map** - Courier density visualization
- [ ] **Cluster markers** - Group nearby couriers
- [ ] **Performance metrics** - Speed, efficiency stats

### Phase 3: Integration
- [ ] **Order assignment from map** - Click courier to assign
- [ ] **Customer view** - Track assigned courier
- [ ] **Notifications** - Courier arrival alerts
- [ ] **Communication** - In-app messaging

## 💡 Implementation Notes

### Auto-Refresh Strategy
```typescript
useEffect(() => {
  const fetchCouriers = async () => {
    // Fetch logic
  };
  
  fetchCouriers(); // Initial fetch
  const interval = setInterval(fetchCouriers, 10000); // Every 10s
  
  return () => clearInterval(interval); // Cleanup
}, []);
```

### Marker Cleanup
```typescript
// Clean up old markers before creating new ones
courierMarkersRef.current.forEach((m) => m.remove());
courierMarkersRef.current = [];

// Create new markers
couriers.forEach(courier => {
  const marker = new mapboxgl.Marker(...)
    .setLngLat([lng, lat])
    .addTo(map);
  
  courierMarkersRef.current.push(marker);
});
```

### Memory Management
- Markers are properly cleaned up on unmount
- Intervals are cleared to prevent memory leaks
- Refs are used to maintain marker instances

## 🎯 Performance Considerations

### Optimizations Applied
1. **Debounced updates** - 10s interval prevents excessive requests
2. **Efficient re-renders** - Only update when courier data changes
3. **Marker reuse** - Remove old, create new (no accumulation)
4. **Conditional rendering** - Only show map when ready

### Best Practices
- Use `useRef` for Mapbox instances
- Clean up markers in useEffect cleanup
- Guard map operations with `isMapReadyRef`
- Handle errors gracefully

## 📝 API Endpoints Used

### Get Available Couriers
```
GET /api/riders?status=IDLE
```

### Get Couriers on Delivery
```
GET /api/riders?status=ON_DELIVERY
```

### Response Format
```json
{
  "riders": [
    {
      "id": 1,
      "status": "IDLE",
      "user": { "name": "Carlos García" },
      "vehicle": {
        "type": "MOTORCYCLE",
        "brand": "Honda",
        "model": "CB125",
        "licensePlate": "ABC-123"
      },
      "lastLocation": {
        "lat": 36.8402,
        "lng": -2.4637,
        "battery": 85
      },
      "rating": 4.5,
      "completedOrders": 120
    }
  ]
}
```

## 🐛 Troubleshooting

### Markers not appearing
1. Check if couriers have `lastLocation` data
2. Verify API is returning couriers
3. Check browser console for errors
4. Ensure Mapbox token is valid

### Map not loading
1. Verify `NEXT_PUBLIC_MAPBOX_TOKEN` is set
2. Check network tab for API failures
3. Clear browser cache

### Performance issues
1. Reduce refresh interval (increase from 10s)
2. Limit number of couriers displayed
3. Implement marker clustering

## 📚 Related Files

- **Map Page**: `src/app/(dashboard)/dashboard/map/page.tsx`
- **API Route**: `src/app/api/riders/route.ts`
- **Rider Service**: `src/lib/rider-service.ts`
- **Types**: `src/types/prisma.ts`

## 🎓 Learning Resources

- [Mapbox GL JS Docs](https://docs.mapbox.com/mapbox-gl-js/api/)
- [Custom Markers](https://docs.mapbox.com/mapbox-gl-js/example/custom-marker-icons/)
- [Popups](https://docs.mapbox.com/mapbox-gl-js/example/popup/)
- [Real-time Updates](https://docs.mapbox.com/help/tutorials/real-time-updates-map/)

---

**Status**: ✅ Implemented and Ready  
**Version**: 1.0.0  
**Last Updated**: October 11, 2025  
**Location**: Almería, España
