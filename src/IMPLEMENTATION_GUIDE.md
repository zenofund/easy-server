# Implementation Guide

## Modal Backdrop Blur

All modals in the application now have an 8px blur effect applied to the background content when they are open. This creates better visual separation and focus on the modal content.

### Modals with Blur Effect:
- ✅ **MakeOfferModal** - Modal for making price offers on vehicles
- ✅ **RequestInspectionModal** - Modal for requesting vehicle inspections
- ✅ **AdvancedSearchModal** - Modal for advanced search filters

The blur is applied using `backdropFilter: 'blur(8px)'` on the modal backdrop overlay.

---

## Skeleton Loading States

The application includes a comprehensive skeleton loading system for displaying loading states across the application.

### Available Skeleton Components

All skeleton components are located in `/components/ui/SkeletonLoader.tsx`:

#### 1. **SkeletonLoader** (Base Component)
A basic shimmer skeleton for any custom use case.

```tsx
import { SkeletonLoader } from './components/ui/SkeletonLoader';

<SkeletonLoader className="h-20 w-full rounded-md" />
```

#### 2. **VehicleCardSkeleton**
Skeleton for individual vehicle cards with proper dimensions and layout.

```tsx
import { VehicleCardSkeleton } from './components/ui/SkeletonLoader';

<VehicleCardSkeleton />
```

#### 3. **VehicleGridSkeleton**
Skeleton for a grid of vehicle cards (default: 6 cards).

```tsx
import { VehicleGridSkeleton } from './components/ui/SkeletonLoader';

// Default 6 cards
<VehicleGridSkeleton />

// Custom count
<VehicleGridSkeleton count={8} />
```

#### 4. **VehicleDetailSkeleton**
Skeleton for the vehicle detail page with image gallery and specs.

```tsx
import { VehicleDetailSkeleton } from './components/ui/SkeletonLoader';

<VehicleDetailSkeleton />
```

#### 5. **ListItemSkeleton** & **ListSkeleton**
Skeleton for list items like sellers, users, etc.

```tsx
import { ListItemSkeleton, ListSkeleton } from './components/ui/SkeletonLoader';

// Single item
<ListItemSkeleton />

// Multiple items (default: 5)
<ListSkeleton />

// Custom count
<ListSkeleton count={10} />
```

#### 6. **TableSkeleton**
Skeleton for admin dashboard tables.

```tsx
import { TableSkeleton } from './components/ui/SkeletonLoader';

// Default 5 rows, 5 columns
<TableSkeleton />

// Custom dimensions
<TableSkeleton rows={10} cols={7} />
```

### Usage Example with Loading State

Here's how to implement loading states in a component:

```tsx
import { useState, useEffect } from 'react';
import { VehicleGridSkeleton } from './components/ui/SkeletonLoader';

export function VehiclesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    // Simulate data fetching
    fetchVehicles().then(data => {
      setVehicles(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <VehicleGridSkeleton count={8} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map(vehicle => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
}
```

### Shimmer Animation

The skeleton loader includes a smooth shimmer animation defined in `/styles/globals.css`:

```css
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
```

This creates a left-to-right shimmer effect that loops continuously.

---

## Scroll to Top on Page Navigation

The application automatically scrolls to the top of the page whenever the user navigates to a different page. This is implemented in `/App.tsx`:

```tsx
// Scroll to top when page changes
useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'instant' });
}, [currentPage]);
```

The scroll uses `behavior: 'instant'` to immediately jump to the top without smooth scrolling animation.

---

## Responsive Modal Design

All modals are fully responsive and work correctly on mobile devices:

- **Desktop**: Modals have a max-width of 742px and are centered
- **Mobile**: Modals adapt to screen size with padding on all sides
- **Content**: All form fields, buttons, and text adapt to smaller screens

### Mobile Optimizations:
- Flexible widths using `w-full max-w-[742px]`
- Responsive padding: `p-6 sm:p-8 md:p-10`
- Stacking layout for inspection options on mobile
- Side-by-side time inputs on desktop, stacked on mobile

---

## Car Detail Page Action Buttons

The action buttons on the car detail page now have `whitespace-nowrap` to prevent text wrapping:

```tsx
<button className="whitespace-nowrap">
  Make an Offer
</button>

<button className="whitespace-nowrap">
  Request Inspection
</button>
```

This ensures the button text stays on a single line on all screen sizes.

---

## Best Practices

### When to Use Skeleton Loaders:
1. **Initial Page Load** - Show skeletons while fetching data from API
2. **Tab Switching** - Display skeletons when switching between tabs with different data
3. **Infinite Scroll** - Show skeletons at the bottom while loading more items
4. **Search/Filter** - Display skeletons while applying filters or search queries

### Loading State Duration:
- Minimum 300ms to avoid flashing
- Maximum 5 seconds before showing error state
- Use timeouts to prevent infinite loading states

### Accessibility:
- Add `aria-label="Loading content"` to skeleton containers
- Ensure color contrast meets WCAG standards (skeletons use gray-200/gray-300)

---

## Future Enhancements

Potential improvements for the loading and modal system:

1. **Progressive Loading** - Load critical content first, then secondary content
2. **Cached Data** - Show stale data immediately while fetching fresh data
3. **Error States** - Create error components to match the skeleton system
4. **Empty States** - Create empty state components for when no data exists
5. **Lazy Loading** - Implement intersection observer for off-screen content
