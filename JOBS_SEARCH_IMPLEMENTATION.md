# Jobs Search Page Implementation

Complete job search functionality with filters, infinite scroll, and modern UI.

## 📁 Folder Structure

```
client/src/
├── types/
│   └── job.ts                          # TypeScript types for Job
├── features/
│   └── jobs/
│       ├── api.ts                      # API functions
│       └── hooks.ts                    # React Query hooks
├── hooks/
│   └── useDebounce.ts                  # Debounce utility hook
├── components/
│   └── jobs/
│       ├── JobCard.tsx                 # Reusable job card component
│       ├── JobCardSkeleton.tsx         # Loading skeleton
│       ├── JobFilters.tsx             # Filters sidebar
│       ├── EmptyState.tsx              # Empty state component
│       └── ApplyModal.tsx             # Application modal
└── app/
    └── jobs/
        └── search/
            └── page.tsx                # Main search page
```

## 🎯 Features Implemented

### ✅ API Integration
- **GET** `/jobs` - Fetch all jobs
- **GET** `/jobs?search=...` - Search by keywords
- **GET** `/jobs?location=...` - Filter by location
- **GET** `/jobs?salary_min=...` - Filter by minimum salary
- **GET** `/jobs?skill=...` - Filter by skill
- **POST** `/jobs/{id}/save` - Save a job
- **DELETE** `/jobs/{id}/save` - Unsave a job

### ✅ React Query Hooks
- `useSearchJobs(params)` - Search jobs with debouncing
- `useInfiniteJobs(params)` - Infinite scroll pagination
- `useJob(id)` - Get single job
- `useSaveJob()` - Save job mutation
- `useUnsaveJob()` - Unsave job mutation

### ✅ Components
1. **JobCard** - Reusable job card with:
   - Job title, company, location, salary
   - Skills tags
   - Save/unsave functionality
   - Apply button
   - View details link

2. **JobFilters** - Sidebar filters:
   - Location filter
   - Minimum salary filter
   - Skill filter
   - Clear filters button

3. **ApplyModal** - Application modal:
   - Cover letter textarea
   - CV upload
   - Form validation

4. **EmptyState** - Empty state with:
   - Helpful message
   - Clear filters option

5. **JobCardSkeleton** - Loading skeleton

### ✅ Page Features
- **Search Bar** - Debounced search (500ms delay)
- **Filters Sidebar** - Location, salary, skill filters
- **Infinite Scroll** - Load more jobs on demand
- **Loading States** - Skeleton loaders
- **Error Handling** - User-friendly error messages
- **Empty States** - Helpful messages when no results
- **Responsive Design** - Works on all screen sizes

## 🎨 UI Features

- **Modern Design**: Clean, LinkedIn/Indeed-inspired UI
- **Dark Mode Support**: Full dark mode compatibility
- **Glassmorphism**: Transparent cards with backdrop blur
- **Smooth Animations**: Hover effects and transitions
- **Debounced Search**: Optimized search performance
- **Infinite Scroll**: Seamless pagination

## 🔧 Usage

### Search Jobs Page
Navigate to: `/jobs/search`

### Search Functionality
- Type in search bar to search by title, keywords, or company
- Search is debounced (500ms) for performance
- Results update automatically

### Filters
- **Location**: Filter by city, state, or "Remote"
- **Minimum Salary**: Filter by minimum salary amount
- **Skill**: Filter by required skill
- Click "Clear" to reset all filters

### Job Actions
- **Save Job**: Click bookmark icon to save/unsave
- **Apply**: Click "Apply Now" to open application modal
- **View Details**: Click "View Details" to see full job description

### Infinite Scroll
- Scroll to bottom to load more jobs
- Click "Load More Jobs" button
- Automatically loads next page

## 📝 API Query Parameters

```typescript
interface JobSearchParams {
  search?: string;        // Job title, keywords
  location?: string;      // City, state, or "Remote"
  salary_min?: number;    // Minimum salary
  skill?: string;         // Required skill
  page?: number;          // Page number (for pagination)
  limit?: number;         // Results per page
}
```

## 🔄 Data Flow

1. User types in search → Debounced (500ms) → API call
2. User applies filters → Debounced (500ms) → API call
3. Results load → Display job cards
4. User scrolls → Load more jobs (infinite scroll)
5. User saves job → POST `/jobs/{id}/save` → Update UI
6. User applies → Open modal → Submit application

## 🚀 Next Steps

1. **Job Detail Page**: Create `/jobs/[id]` page
2. **Application API**: Implement actual application submission
3. **Saved Jobs Page**: Create page to view saved jobs
4. **Advanced Filters**: Add more filter options (employment type, experience level)
5. **Job Alerts**: Allow users to set up job alerts
6. **Sort Options**: Add sorting (date, salary, relevance)

## 📦 Dependencies

- `@tanstack/react-query` - Data fetching & caching
- `axios` - HTTP client
- `sonner` - Toast notifications
- `lucide-react` - Icons
- `next` - Framework

## 🎯 Key Features

### Debounced Search
- 500ms debounce delay
- Reduces API calls
- Better performance

### Infinite Scroll
- Uses `useInfiniteQuery`
- Automatic pagination
- Load more on demand

### Save/Unsave Jobs
- Optimistic updates
- Cache invalidation
- Toast notifications

### Responsive Design
- Mobile-friendly
- Tablet optimized
- Desktop layout
