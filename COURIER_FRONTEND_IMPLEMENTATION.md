# Courier Frontend Implementation - Vualá OnDemand

## 📋 Overview

Complete frontend implementation for the Courier (delivery riders) management system. All user-facing text uses "Courier" terminology instead of "Rider" or "Repartidor".

## 🎨 Pages Implemented

### 1. `/dashboard/riders` - Couriers List Page

**Component**: `CouriersPage`

**Features**:
- ✅ Grid view of all couriers
- ✅ Filtering system:
  - All couriers
  - Active only
  - Available (IDLE status)
  - On Delivery
  - Inactive only
- ✅ Real-time status badges:
  - **Offline** - Gray badge
  - **Available** - Green badge
  - **On Delivery** - Blue badge
- ✅ Courier cards showing:
  - Profile avatar (first letter of name)
  - Name and username
  - Email and phone
  - Vehicle information (type, brand, model, plate)
  - Statistics (deliveries, rating, battery)
- ✅ Quick actions:
  - Activate/Deactivate courier
  - View details button
- ✅ Pagination (10 items per page)
- ✅ "New Courier" button (admin only)

**UI Text**:
- Title: "Couriers"
- Subtitle: "Manage delivery couriers"
- Button: "+ New Courier"
- Filters: All, Active, Available, On Delivery, Inactive
- Stats labels: Deliveries, Rating, Battery
- Actions: Deactivate/Activate, View details
- Empty state: "No couriers available"

---

### 2. `/dashboard/riders/new` - New Courier Page

**Component**: `NewCourierPage`

**Features**:
- ✅ Multi-section form:
  - **User Selection** - Dropdown of users with rider role
  - **Contact Information** - Phone and license number
  - **Vehicle Information** - Complete vehicle details
- ✅ Required field validation
- ✅ Admin-only access check
- ✅ Vehicle type selection with emojis:
  - 🏍️ Motorcycle
  - 🚗 Car
  - 🚲 Bicycle
  - 🛵 Scooter
- ✅ Real-time form validation
- ✅ Success/error toast notifications
- ✅ Auto-redirect after creation

**Form Fields**:
| Field | Required | Type | Description |
|-------|----------|------|-------------|
| User | Yes | Select | User with rider role |
| Phone | Yes | Tel | Contact phone number |
| License Number | No | Text | Driver's license number |
| Vehicle Type | Yes | Select | Type of vehicle |
| License Plate | Yes | Text | Vehicle registration plate |
| Brand | No | Text | Vehicle brand |
| Model | No | Text | Vehicle model |
| Year | No | Number | Manufacturing year |
| Color | No | Text | Vehicle color |

**UI Text**:
- Title: "New Courier"
- Subtitle: "Create a new delivery courier"
- Sections: Contact Information, Vehicle Information
- Button: "Create Courier"
- Messages: "Courier created successfully!"

---

### 3. `/dashboard/riders/[id]` - Courier Details Page

**Component**: `CourierDetailPage`

**Features**:
- ✅ Complete courier profile view
- ✅ Three-column layout (responsive)
- ✅ Profile information card:
  - Large avatar with initial
  - Full name and username
  - Email and phone
  - License number
  - Member since date
  - Account status
- ✅ Vehicle information card:
  - Large vehicle emoji
  - Brand and model
  - License plate, year, color
- ✅ Last known location card:
  - GPS coordinates (lat/lng)
  - Battery level
  - Last update timestamp
- ✅ Statistics sidebar:
  - Completed deliveries count
  - Average rating
- ✅ Actions sidebar:
  - Activate/Deactivate button
  - Change status dropdown:
    - Set Available
    - Set Offline
  - Delete courier button (admin only)
- ✅ Real-time status badge
- ✅ Confirmation dialogs for destructive actions

**UI Text**:
- Title: Courier's name
- Subtitle: @username
- Sections: Profile Information, Vehicle Information, Last Known Location, Statistics, Actions
- Stats labels: Completed Deliveries, Rating
- Actions: Deactivate/Activate, Set Available, Set Offline, Delete Courier
- Confirmations: "Are you sure you want to delete this courier?"

---

## 🎨 Design System

### Colors

**Status Colors**:
```css
/* Offline */
bg-gray-100 text-gray-800

/* Available (IDLE) */
bg-green-100 text-green-800

/* On Delivery */
bg-blue-100 text-blue-800

/* Active Status */
text-green-600

/* Inactive Status */
text-red-600
```

**Action Buttons**:
```css
/* Primary Action */
bg-blue-600 hover:bg-blue-700 text-white

/* Deactivate */
bg-red-100 text-red-700 hover:bg-red-200

/* Activate */
bg-green-100 text-green-700 hover:bg-green-200

/* Delete */
bg-red-600 hover:bg-red-700 text-white
```

### Typography

- **Page Title**: `text-3xl font-bold text-gray-900`
- **Page Subtitle**: `text-gray-600 mt-1`
- **Section Title**: `text-xl font-semibold text-gray-900`
- **Card Title**: `text-lg font-semibold text-gray-900`
- **Label**: `text-sm font-medium text-gray-700`
- **Body Text**: `text-gray-900`
- **Secondary Text**: `text-sm text-gray-500`

### Components

**Card**:
```jsx
<div className="bg-white rounded-lg shadow-sm p-6">
  {/* Content */}
</div>
```

**Badge**:
```jsx
<span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
  Available
</span>
```

**Button**:
```jsx
<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
  Action
</button>
```

**Input**:
```jsx
<input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
```

---

## 🔄 User Flows

### Create New Courier Flow

```
1. Admin clicks "+ New Courier" button
   ↓
2. Navigates to /dashboard/riders/new
   ↓
3. Selects user with rider role from dropdown
   ↓
4. Fills contact information (phone, license)
   ↓
5. Fills vehicle information (type, plate, etc.)
   ↓
6. Clicks "Create Courier"
   ↓
7. POST /api/riders
   ↓
8. Success toast displayed
   ↓
9. Auto-redirects to /dashboard/riders
```

### View Courier Details Flow

```
1. User clicks "View details" on courier card
   ↓
2. Navigates to /dashboard/riders/[id]
   ↓
3. GET /api/riders/[id]
   ↓
4. Displays complete courier profile
   ↓
5. User can:
   - View all information
   - Change status
   - Activate/Deactivate
   - Delete (admin only)
```

### Filter Couriers Flow

```
1. User clicks filter button (e.g., "Available")
   ↓
2. Updates URL query parameter
   ↓
3. GET /api/riders?status=IDLE&isActive=true
   ↓
4. Updates courier list display
   ↓
5. Shows only matching couriers
```

---

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 768px
  - Single column layout
  - Stacked filters
  - Full-width cards

- **Tablet**: 768px - 1024px
  - 2-column grid for courier cards
  - Horizontal filter bar
  - Sidebar remains below content

- **Desktop**: > 1024px
  - 3-column grid for courier cards
  - Full horizontal filter bar
  - Sidebar beside main content

### Mobile Optimizations

- Touch-friendly buttons (minimum 44px height)
- Horizontal scrolling for filter buttons
- Collapsible sections on detail page
- Bottom-sheet style for actions

---

## 🔐 Access Control

### Admin Users
- ✅ View all couriers
- ✅ Create new couriers
- ✅ Edit courier details
- ✅ Change courier status
- ✅ Activate/Deactivate couriers
- ✅ Delete couriers
- ✅ View all statistics

### Regular Users
- ❌ Cannot access courier pages
- ❌ Redirected if attempting access
- ℹ️ May see courier assigned to their order

---

## 🎯 Performance Optimizations

1. **Lazy Loading**
   - Courier cards rendered progressively
   - Images lazy loaded

2. **Pagination**
   - 10 items per page
   - Server-side pagination
   - Efficient data fetching

3. **Optimistic Updates**
   - Status changes reflect immediately
   - Rolled back on error

4. **Caching**
   - User list cached for dropdown
   - Courier details cached on navigation

---

## 🧪 Testing Checklist

### Courier List Page
- [ ] Page loads without errors
- [ ] All filters work correctly
- [ ] Cards display all information
- [ ] Pagination works
- [ ] Status badges show correct colors
- [ ] Vehicle icons display correctly
- [ ] Activate/Deactivate works
- [ ] View details navigates correctly

### New Courier Page
- [ ] Form validation works
- [ ] User dropdown populates
- [ ] Required fields enforced
- [ ] Vehicle types display with emojis
- [ ] Cancel button works
- [ ] Submit creates courier
- [ ] Success redirects to list
- [ ] Error messages display

### Courier Detail Page
- [ ] All information displays
- [ ] Status badge correct
- [ ] Location info shows
- [ ] Stats calculate correctly
- [ ] Status change buttons work
- [ ] Activate/Deactivate works
- [ ] Delete confirmation works
- [ ] Back button navigates correctly

---

## 🚀 Next Steps

### Recommended Enhancements

1. **Real-Time Updates**
   - WebSocket integration for live status
   - Auto-refresh courier locations
   - Live battery level updates

2. **Map View**
   - Interactive map with courier markers
   - Route visualization
   - Geofencing zones

3. **Advanced Filtering**
   - Filter by vehicle type
   - Filter by rating
   - Search by name/email
   - Date range filters

4. **Bulk Actions**
   - Select multiple couriers
   - Bulk status change
   - Bulk export to CSV

5. **Analytics Dashboard**
   - Courier performance charts
   - Delivery heat maps
   - Time-based analytics

6. **Mobile App**
   - Dedicated courier mobile app
   - GPS tracking
   - Push notifications
   - In-app messaging

---

## 📝 Terminology Guide

| Backend/Database | Frontend Display |
|-----------------|------------------|
| Rider | Courier |
| Repartidor | Courier |
| rider | courier |
| riders | couriers |
| Rider List | Couriers |
| New Rider | New Courier |
| Rider Details | Courier Details |

**Consistency Rules**:
- Always use "Courier" in user-facing text
- Use "courier" in variable names (frontend only)
- Backend/API keeps "rider" terminology
- Database models remain "Rider"

---

## 🐛 Known Issues

1. **TypeScript Errors** (Temporary)
   - Prisma Client needs regeneration
   - Run: `pnpm dlx prisma generate`
   - Restart dev server

2. **User Dropdown**
   - Currently fetches all users with roleId: 3
   - Needs dedicated API endpoint `/api/users?roleId=3`

---

## 📚 Related Documentation

- [RIDER_SYSTEM.md](./RIDER_SYSTEM.md) - Backend system documentation
- [API Documentation](./RIDER_SYSTEM.md#api-endpoints) - REST API reference
- [Database Schema](./prisma/schema.prisma) - Prisma models

---

**Implementation Date**: October 11, 2025  
**Status**: ✅ Complete and Ready for Testing  
**Frontend Framework**: Next.js 15 + React 19 + TypeScript
