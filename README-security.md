# Database Security Implementation

This document explains the security implementation for the Referral Codes Admin Dashboard.

## Overview

The security model ensures that only admin users can modify data in the database, while allowing public read access to referral codes and categories.

## Security Features

1. **Row Level Security (RLS)**: Implemented on all tables to control access at the row level.
2. **User Roles**: Users are assigned either 'admin' or 'user' roles.
3. **Admin-Only Write Access**: Only users with the 'admin' role can insert, update, or delete data.
4. **Public Read Access**: Anyone can read the referral codes## Implementation Details

### Database Structure

1. **Profiles Table**: Extends the auth.users table with role information
2. **User Role Enum**: Defines 'admin' and 'user' roles
3. **Automatic Profile Creation**: Trigger creates a profile when a new user signs up

### Row Level Security Policies

- **Read Access**: Everyone can read data from referral_codes and categories tables
- **Write Access**: Only admins can insert, update, or delete data

### Helper Functions

- `is_admin()`: Checks if the current user has admin privileges
- `promote_to_admin()`: Allows promoting a user to admin role
- `get_current_user_role()`: Returns the role of the current user

## How to Use

### Promoting an Admin

After deploying the SQL, you'll need to promote at least one user to admin:

1. Sign up a user who will be the admin
2. Run this SQL in the Supabase SQL Editor:
   ```sql
   SELECT promote_to_admin('admin@example.com'); -- Replace with actual admin email
   ```

### Frontend Integration

The AuthContext has been updated to include:
- `isAdmin` state to track admin status
- Role fetching on authentication
- Updated user type with role information

### Protected Routes

The ProtectedRoute component now supports:
- Basic authentication protection
- Admin-only routes with the `requireAdmin` prop

Example usage:
```tsx
// Regular protected route
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />

// Admin-only route
<Route path="/admin" element={
  <ProtectedRoute requireAdmin={true}>
    <AdminPanel />
  </ProtectedRoute>
} />
```

## Security Best Practices

1. **Never disable RLS**: Always keep Row Level Security enabled
2. **Validate on server**: Don't rely solely on client-side role checks
3. **Audit regularly**: Monitor admin promotions and access patterns
4. **Least privilege**: Grant only necessary permissions to each role

## Troubleshooting

If you encounter permission issues:

1. Verify the user's role in the profiles table
2. Check that RLS policies are correctly applied
3. Ensure the user is authenticated before attempting protected operations
4. Look for RLS policy conflicts that might be denying access

## Next Steps

1. Consider implementing more granular permissions if needed
2. Add audit logging for sensitive operations
3. Set up monitoring for failed access attempts
