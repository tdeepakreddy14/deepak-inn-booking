# Hotel Booking System - Backend API Implementation Guide

## Architecture Overview

Implement these APIs as Supabase Edge Functions with proper authentication, role-based access control, and validation.

---

## 1. Room Management APIs

### GET /api/rooms
**Purpose**: Retrieve all rooms with optional filters  
**Auth**: Public (no authentication required)  
**Query Parameters**:
- `type` (optional): Filter by room type (e.g., "Deluxe", "Standard", "Suite")
- `available` (optional): Filter by availability (true/false)
- `min_price` (optional): Minimum price filter
- `max_price` (optional): Maximum price filter
- `max_guests` (optional): Filter by guest capacity
- `page` (optional): Page number for pagination
- `limit` (optional): Results per page (default: 10)

**Response**:
```json
{
  "success": true,
  "data": {
    "rooms": [
      {
        "id": "uuid",
        "name": "Deluxe Ocean View",
        "type": "Deluxe",
        "price": 299.99,
        "description": "Spacious room with ocean view",
        "amenities": ["WiFi", "TV", "Mini Bar", "Ocean View"],
        "max_guests": 2,
        "has_ac": true,
        "image_url": "https://...",
        "available": true,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "total_pages": 3
    }
  }
}
```

---

### GET /api/rooms/:id
**Purpose**: Get detailed information about a specific room  
**Auth**: Public  
**Path Parameters**:
- `id`: Room UUID

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Deluxe Ocean View",
    "type": "Deluxe",
    "price": 299.99,
    "description": "Spacious room with ocean view",
    "amenities": ["WiFi", "TV", "Mini Bar", "Ocean View"],
    "max_guests": 2,
    "has_ac": true,
    "image_url": "https://...",
    "available": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### POST /api/rooms
**Purpose**: Create a new room  
**Auth**: Required (Admin only)  
**Headers**:
- `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "name": "Presidential Suite",
  "type": "Suite",
  "price": 599.99,
  "description": "Luxurious presidential suite",
  "amenities": ["WiFi", "TV", "Mini Bar", "Jacuzzi", "Ocean View"],
  "max_guests": 4,
  "has_ac": true,
  "image_url": "https://...",
  "available": true
}
```

**Validation Rules**:
- `name`: Required, string, max 200 chars
- `type`: Required, string, max 50 chars
- `price`: Required, positive number
- `description`: Optional, string, max 1000 chars
- `amenities`: Optional, array of strings
- `max_guests`: Required, positive integer, min 1, max 10
- `has_ac`: Required, boolean
- `image_url`: Optional, valid URL
- `available`: Required, boolean

**Response**:
```json
{
  "success": true,
  "message": "Room created successfully",
  "data": {
    "id": "uuid",
    "name": "Presidential Suite",
    // ... full room object
  }
}
```

---

### PUT /api/rooms/:id
**Purpose**: Update an existing room  
**Auth**: Required (Admin only)  
**Headers**:
- `Authorization: Bearer <token>`

**Path Parameters**:
- `id`: Room UUID

**Request Body**: Same as POST (all fields optional)

**Response**:
```json
{
  "success": true,
  "message": "Room updated successfully",
  "data": {
    // ... updated room object
  }
}
```

---

### DELETE /api/rooms/:id
**Purpose**: Delete a room  
**Auth**: Required (Admin only)  
**Headers**:
- `Authorization: Bearer <token>`

**Path Parameters**:
- `id`: Room UUID

**Response**:
```json
{
  "success": true,
  "message": "Room deleted successfully"
}
```

---

## 2. Authentication APIs

### POST /api/auth/register
**Purpose**: Register a new user  
**Auth**: Public

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe",
  "phone": "+1234567890"
}
```

**Validation Rules**:
- `email`: Required, valid email format
- `password`: Required, min 8 chars, must contain uppercase, lowercase, number, special char
- `full_name`: Required, string, max 100 chars
- `phone`: Optional, valid phone format

**Response**:
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "user"
    },
    "session": {
      "access_token": "jwt_token",
      "refresh_token": "refresh_token",
      "expires_at": "timestamp"
    }
  }
}
```

---

### POST /api/auth/login
**Purpose**: User login  
**Auth**: Public

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response**: Same as register

---

### POST /api/auth/logout
**Purpose**: Logout user  
**Auth**: Required  
**Headers**:
- `Authorization: Bearer <token>`

**Response**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### GET /api/auth/me
**Purpose**: Get current user profile  
**Auth**: Required  
**Headers**:
- `Authorization: Bearer <token>`

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "phone": "+1234567890",
    "role": "user",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

## 3. Admin Dashboard APIs

### GET /api/admin/stats
**Purpose**: Get dashboard statistics  
**Auth**: Required (Admin only)  
**Headers**:
- `Authorization: Bearer <token>`

**Response**:
```json
{
  "success": true,
  "data": {
    "total_rooms": 25,
    "available_rooms": 18,
    "total_bookings": 150,
    "active_bookings": 12,
    "total_users": 500,
    "total_revenue": 45000.00,
    "monthly_revenue": 5000.00,
    "occupancy_rate": 72.5
  }
}
```

---

### GET /api/admin/users
**Purpose**: List all users  
**Auth**: Required (Admin only)  
**Headers**:
- `Authorization: Bearer <token>`

**Query Parameters**:
- `page` (optional): Page number
- `limit` (optional): Results per page
- `role` (optional): Filter by role

**Response**:
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "email": "user@example.com",
        "full_name": "John Doe",
        "role": "user",
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 500,
      "total_pages": 25
    }
  }
}
```

---

### PUT /api/admin/users/:id/role
**Purpose**: Update user role  
**Auth**: Required (Admin only)  
**Headers**:
- `Authorization: Bearer <token>`

**Path Parameters**:
- `id`: User UUID

**Request Body**:
```json
{
  "role": "admin"
}
```

**Response**:
```json
{
  "success": true,
  "message": "User role updated successfully"
}
```

---

## 4. Booking APIs (Future Implementation)

### POST /api/bookings
**Purpose**: Create a new booking  
**Auth**: Required  
**Headers**:
- `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "room_id": "uuid",
  "check_in": "2024-12-20",
  "check_out": "2024-12-25",
  "guests": 2,
  "special_requests": "Late check-in please"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": "uuid",
    "room_id": "uuid",
    "user_id": "uuid",
    "check_in": "2024-12-20",
    "check_out": "2024-12-25",
    "guests": 2,
    "total_price": 1499.95,
    "status": "pending",
    "special_requests": "Late check-in please",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### GET /api/bookings
**Purpose**: List bookings (user's own or all for admin)  
**Auth**: Required  
**Headers**:
- `Authorization: Bearer <token>`

**Query Parameters**:
- `status` (optional): Filter by status (pending, confirmed, cancelled, completed)
- `page` (optional): Page number
- `limit` (optional): Results per page

**Response**:
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "uuid",
        "room": {
          "id": "uuid",
          "name": "Deluxe Ocean View",
          "type": "Deluxe",
          "image_url": "https://..."
        },
        "check_in": "2024-12-20",
        "check_out": "2024-12-25",
        "guests": 2,
        "total_price": 1499.95,
        "status": "confirmed",
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "total_pages": 1
    }
  }
}
```

---

### GET /api/bookings/:id
**Purpose**: Get booking details  
**Auth**: Required (own bookings or admin)  
**Headers**:
- `Authorization: Bearer <token>`

**Path Parameters**:
- `id`: Booking UUID

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "room": {
      "id": "uuid",
      "name": "Deluxe Ocean View",
      "type": "Deluxe",
      "price": 299.99,
      "image_url": "https://..."
    },
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe"
    },
    "check_in": "2024-12-20",
    "check_out": "2024-12-25",
    "guests": 2,
    "total_price": 1499.95,
    "status": "confirmed",
    "special_requests": "Late check-in please",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### PUT /api/bookings/:id
**Purpose**: Update booking (cancel or modify)  
**Auth**: Required (own bookings or admin)  
**Headers**:
- `Authorization: Bearer <token>`

**Path Parameters**:
- `id`: Booking UUID

**Request Body**:
```json
{
  "status": "cancelled",
  "special_requests": "Updated requests"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Booking updated successfully",
  "data": {
    // ... updated booking object
  }
}
```

---

## Implementation Guidelines

### 1. Edge Function Structure
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    )

    // Extract JWT token
    const authHeader = req.headers.get('Authorization')
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user }, error } = await supabaseClient.auth.getUser(token)
      
      if (error || !user) {
        throw new Error('Unauthorized')
      }
    }

    // Your API logic here

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: error.message === 'Unauthorized' ? 401 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
```

### 2. Authentication Middleware
```typescript
async function requireAuth(supabaseClient, authHeader) {
  if (!authHeader) {
    throw new Error('Authorization header required')
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error } = await supabaseClient.auth.getUser(token)
  
  if (error || !user) {
    throw new Error('Unauthorized')
  }

  return user
}

async function requireAdmin(supabaseClient, userId) {
  const { data, error } = await supabaseClient
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .eq('role', 'admin')
    .maybeSingle()

  if (error || !data) {
    throw new Error('Forbidden: Admin access required')
  }

  return true
}
```

### 3. Input Validation
```typescript
function validateRoomInput(data) {
  const errors = []

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Room name is required')
  }
  if (data.name && data.name.length > 200) {
    errors.push('Room name must be less than 200 characters')
  }
  if (!data.price || data.price <= 0) {
    errors.push('Price must be a positive number')
  }
  if (!data.max_guests || data.max_guests < 1 || data.max_guests > 10) {
    errors.push('Max guests must be between 1 and 10')
  }

  if (errors.length > 0) {
    throw new Error(errors.join(', '))
  }

  return true
}
```

### 4. Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details (optional)",
  "code": "ERROR_CODE"
}
```

### 5. Common Error Codes
- `UNAUTHORIZED`: 401 - Missing or invalid authentication
- `FORBIDDEN`: 403 - Insufficient permissions
- `NOT_FOUND`: 404 - Resource not found
- `VALIDATION_ERROR`: 400 - Invalid input data
- `CONFLICT`: 409 - Resource already exists
- `INTERNAL_ERROR`: 500 - Server error

---

## Security Checklist

✅ Always validate user input  
✅ Use parameterized queries to prevent SQL injection  
✅ Implement rate limiting on authentication endpoints  
✅ Hash passwords using bcrypt or similar  
✅ Use JWT tokens with appropriate expiration  
✅ Implement CORS properly  
✅ Validate file uploads (size, type)  
✅ Log security events  
✅ Use HTTPS only  
✅ Implement role-based access control  
✅ Never expose sensitive data in error messages  
✅ Validate authorization on every request  

---

## Next Steps

1. **Create Edge Functions**: Implement each API as a separate edge function
2. **Add Middleware**: Create reusable auth and validation middleware
3. **Implement Rate Limiting**: Protect against abuse
4. **Add Logging**: Monitor API usage and errors
5. **Write Tests**: Test each endpoint thoroughly
6. **Document**: Keep this API documentation updated
