<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Validator;
use JWTAuth;
use Exception;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        try {
            // Check if the user is already authenticated via JWT
            try {
                $user = JWTAuth::parseToken()->authenticate();
                // If authenticated, return user data with needs_position
                $needsPosition = $user->role === 'admin' && empty($user->position);
                return response()->json([
                    'status' => true,
                    'message' => 'User authenticated',
                    'token' => JWTAuth::fromUser($user),
                    'user' => $user,
                    'needs_position' => $needsPosition,
                ], 200);
            } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
                // No valid token, proceed with credential-based login
            }

            // Validate input for credential-based login
            $validator = Validator::make($request->all(), [
                'email' => 'required|string|email|max:255',
                'password' => 'required|string|min:6',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Check credentials and generate JWT
            $credentials = $request->only('email', 'password');

            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Invalid email or password',
                ], 401);
            }

            // Fetch the authenticated user
            $user = JWTAuth::user();

            // Check if the user is an admin and has no position
            $needsPosition = $user->role === 'admin' && empty($user->position);

            return response()->json([
                'status' => true,
                'message' => 'Login successful',
                'token' => $token,
                'user' => $user,
                'needs_position' => $needsPosition,
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'error' => 'Something went wrong',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // Rest of the AuthController methods remain unchanged
    public function signup(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'mobile' => 'required|string|max:20|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|string|in:user,admin',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::create([
            'first_name' => $request->first_name,
            'middle_name' => $request->middle_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'mobile' => $request->mobile,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'status' => true,
            'message' => 'User registered successfully.',
            'token' => $token,
            'user' => $user,
        ], 201);
    }

    public function logout(Request $request)
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json([
                'status' => true,
                'message' => 'Logged out successfully',
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to logout',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getUser(Request $request)
    {
        return response()->json(auth()->user());
    }

    public function registration(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['message' => 'User not authenticated.'], 401);
        }

        Log::info('Registration Request Data:', $request->all());

        $validator = Validator::make($request->all(), [
            'region' => 'required|string',
            'province' => 'required|string',
            'city' => 'required|string',
            'barangay' => 'required|string',
            'street' => 'required|string',
            'building_number' => 'required|string',
            'zip_code' => 'required|string',
            'gender' => 'required|string',
            'position' => 'nullable|string',
            'secondary_position' => 'nullable|string',
            'civil_status' => 'required|string',
            'birthday' => 'required|date_format:Y-m-d',
            'availability' => 'nullable|string|in:Available,Vacation,On Board',
        ]);

        if ($validator->fails()) {
            Log::error('Validation errors:', $validator->errors()->all());
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $regionName = $request->input('region');
        $provinceName = $request->input('province');
        if ($provinceName === 'MM') {
            $provinceName = 'Metro Manila';
        }
        $cityName = $request->input('city');
        $barangayName = $request->input('barangay');

        Log::info('Fetched names:', [
            'region' => $regionName,
            'province' => $provinceName,
            'city' => $cityName,
            'barangay' => $barangayName,
            'availability' => $request->input('availability'),
        ]);

        $user->update([
            'region' => $regionName,
            'province' => $provinceName,
            'city' => $cityName,
            'barangay' => $barangayName,
            'street' => $request->input('street'),
            'building_number' => $request->input('building_number'),
            'zip_code' => $request->input('zip_code'),
            'gender' => $request->input('gender'),
            'position' => $request->input('position'),
            'secondary_position' => $request->input('secondary_position'),
            'civil_status' => $request->input('civil_status'),
            'birthday' => $request->input('birthday'),
            'availability' => $request->input('availability'),
        ]);

        return response()->json([
            'message' => 'Registration details updated successfully!',
            'user' => $user,
        ], 200);
    }

    public function updateAddress(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['message' => 'User not authenticated.'], 401);
        }

        $validator = Validator::make($request->all(), [
            'region' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'barangay' => 'required|string|max:255',
            'street' => 'required|string|max:255',
            'building_number' => 'required|string|max:50',
            'zip_code' => 'required|string|max:10',
        ]);

        if ($validator->fails()) {
            Log::error('Validation errors:', $validator->errors()->all());
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user->update([
            'region' => $request->input('region'),
            'province' => $request->input('province'),
            'city' => $request->input('city'),
            'barangay' => $request->input('barangay'),
            'street' => $request->input('street'),
            'building_number' => $request->input('building_number'),
            'zip_code' => $request->input('zip_code'),
        ]);

        return response()->json([
            'message' => 'Address updated successfully!',
            'user' => $user,
        ], 200);
    }

    public function updatePersonal(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['message' => 'User not authenticated.'], 401);
        }

        $validator = Validator::make($request->all(), [
            'gender' => 'required|string|max:50',
            'position' => 'nullable|string|max:255',
            'secondary_position' => 'nullable|string|max:255',
            'civil_status' => 'required|string|max:50',
            'birthday' => 'required|date_format:Y-m-d',
        ]);

        if ($validator->fails()) {
            Log::error('Validation errors:', $validator->errors()->all());
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user->update([
            'gender' => $request->input('gender'),
            'position' => $request->input('position'),
            'secondary_position' => $request->input('secondary_position'),
            'civil_status' => $request->input('civil_status'),
            'birthday' => $request->input('birthday'),
        ]);

        return response()->json([
            'message' => 'Personal details updated successfully!',
            'user' => $user,
        ], 200);
    }

    public function updatePosition(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if ($user->role !== 'admin') {
                return response()->json([
                    'status' => false,
                    'message' => 'Only admins can update their position.'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'position' => 'required|string|max:255',
            ]);

            if ($validator->fails()) {
                Log::error('Validation errors:', $validator->errors()->all());
                return response()->json([
                    'status' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $user->update([
                'position' => $request->input('position'),
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Position updated successfully!',
                'user' => $user,
            ], 200);
        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json([
                'status' => false,
                'message' => 'User not authenticated.',
            ], 401);
        } catch (Exception $e) {
            Log::error('Error updating position:', ['error' => $e->getMessage()]);
            return response()->json([
                'status' => false,
                'message' => 'Failed to update position.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}