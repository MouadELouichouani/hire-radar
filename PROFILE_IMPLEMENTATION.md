# Profile UI Implementation

Complete User Profile UI implementation for the job platform with Candidate and Employer profiles.

## 📁 Folder Structure

```
client/src/
├── types/
│   └── profile.ts                    # TypeScript types for profiles
├── features/
│   └── profile/
│       ├── api.ts                    # API functions
│       └── hooks.ts                  # React Query hooks
├── components/
│   └── profile/
│       ├── ProfileHeader.tsx         # Reusable profile header
│       ├── EditProfileModal.tsx     # Reusable edit modal
│       ├── PersonalDetails.tsx      # Candidate personal details
│       ├── SkillsList.tsx            # Candidate skills display
│       ├── CompanyInfo.tsx           # Employer company info
│       ├── UploadCV.tsx              # CV upload component
│       ├── ProfileSkeleton.tsx       # Loading skeleton
│       └── ErrorState.tsx            # Error state component
├── hooks/
│   └── useCurrentUserId.ts          # Hook to get current user ID
└── app/
    └── dashboard/
        ├── candidate/
        │   └── profile/
        │       └── page.tsx         # Candidate profile page
        └── employer/
            └── profile/
                └── page.tsx         # Employer profile page
```

## 🎯 Features Implemented

### ✅ API Integration
- **GET** `/candidates/{id}` - Fetch candidate profile
- **PUT** `/candidates/{id}` - Update candidate profile
- **POST** `/candidates/{id}/upload-cv` - Upload CV
- **GET** `/employers/{id}` - Fetch employer profile
- **PUT** `/employers/{id}` - Update employer profile

### ✅ React Query Hooks
- `useCandidateProfile(id)` - Fetch candidate profile
- `useUpdateCandidateProfile(id)` - Update candidate profile
- `useUploadCandidateCV(id)` - Upload CV
- `useEmployerProfile(id)` - Fetch employer profile
- `useUpdateEmployerProfile(id)` - Update employer profile

### ✅ Components
1. **ProfileHeader** - Reusable header with profile picture, name, role, and edit button
2. **EditProfileModal** - Reusable modal for editing profiles (supports both candidate and employer)
3. **PersonalDetails** - Displays candidate personal information and social links
4. **SkillsList** - Displays candidate skills as badges
5. **CompanyInfo** - Displays employer company information
6. **UploadCV** - Drag & drop CV upload with file preview
7. **ProfileSkeleton** - Loading state skeleton
8. **ErrorState** - Error state with retry functionality

### ✅ Pages
1. `/dashboard/candidate/profile` - Candidate profile page
2. `/dashboard/employer/profile` - Employer profile page

## 🎨 UI Features

- **Modern Design**: Clean, LinkedIn/Indeed-inspired UI
- **Dark Mode Support**: Full dark mode compatibility
- **Glassmorphism**: Transparent cards with backdrop blur
- **Responsive**: Works on all screen sizes
- **Loading States**: Skeleton loaders for better UX
- **Error Handling**: User-friendly error states with retry
- **Toast Notifications**: Success/error feedback using Sonner

## 🔧 Configuration

### API Client
The API client automatically includes authentication tokens from cookies:
- Token is retrieved via `getToken()` from cookies
- Added to `Authorization: Bearer {token}` header

### User ID
The `useCurrentUserId()` hook:
- Gets user ID from URL params (if viewing another user's profile)
- Falls back to 'current' (API should handle this)
- TODO: Integrate with auth context when available

## 📝 Usage

### Candidate Profile Page
```tsx
// Navigate to: /dashboard/candidate/profile
// Or with user ID: /dashboard/candidate/profile?id={userId}
```

### Employer Profile Page
```tsx
// Navigate to: /dashboard/employer/profile
// Or with user ID: /dashboard/employer/profile?id={userId}
```

## 🔄 Data Flow

1. Page loads → `useCurrentUserId()` gets user ID
2. React Query hook fetches profile data
3. Components render with profile data
4. User clicks "Edit Profile" → Modal opens
5. User saves changes → Mutation updates profile
6. Query cache invalidates → Profile refetches
7. Toast notification shows success/error

## 🚀 Next Steps

1. **Auth Context**: Replace `useCurrentUserId()` with actual auth context
2. **Image Upload**: Add profile picture upload functionality
3. **Validation**: Add form validation for edit modal
4. **Permissions**: Add role-based access control
5. **Profile Picture**: Add image upload/change functionality

## 📦 Dependencies

- `@tanstack/react-query` - Data fetching
- `axios` - HTTP client
- `sonner` - Toast notifications
- `lucide-react` - Icons
- `next/image` - Image optimization
