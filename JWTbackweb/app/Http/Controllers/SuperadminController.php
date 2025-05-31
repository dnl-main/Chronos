<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Validator;
use JWTAuth;
use Exception;

class SuperadminController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:api', 'role:superadmin']);
    }

    public function getAllUsers(Request $request)
    {
        try {
            $users = User::select(
                'id',
                'first_name',
                'middle_name',
                'last_name',
                'email',
                'mobile',
                'role',
                'position',
                'department',
                'region',
                'province',
                'city',
                'barangay',
                'street',
                'building_number',
                'zip_code',
                'gender',
                'civil_status',
                'birthday',
                'availability',
                'created_at',
                'updated_at'
            )->get();

            return response()->json([
                'status' => true,
                'message' => 'Users retrieved successfully',
                'users' => $users,
            ], 200);
        } catch (Exception $e) {
            Log::error('Error fetching users:', ['error' => $e->getMessage()]);
            return response()->json([
                'status' => false,
                'message' => 'Failed to retrieve users',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function createUser(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'first_name' => 'required|string|max:255',
                'middle_name' => 'nullable|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'mobile' => 'required|string|max:20|unique:users',
                'password' => 'required|string|min:6',
                'role' => 'required|string|in:user,admin,superadmin', // Allow superadmin
                'position' => 'nullable|string|max:255',
                'department' => 'nullable|string|max:255',
                'region' => 'nullable|string|max:255',
                'province' => 'nullable|string|max:255',
                'city' => 'nullable|string|max:255',
                'barangay' => 'nullable|string|max:255',
                'street' => 'nullable|string|max:255',
                'building_number' => 'nullable|string|max:50',
                'zip_code' => 'nullable|string|max:10',
                'gender' => 'nullable|string|max:50',
                'civil_status' => 'nullable|string|max:50',
                'birthday' => 'nullable|date_format:Y-m-d',
                'availability' => 'nullable|string|in:Available,Vacation,On Board',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation failed',
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
                'position' => $request->position,
                'department' => $request->department ?? 'Crew',
                'region' => $request->region,
                'province' => $request->province,
                'city' => $request->city,
                'barangay' => $request->barangay,
                'street' => $request->street,
                'building_number' => $request->building_number,
                'zip_code' => $request->zip_code,
                'gender' => $request->gender,
                'civil_status' => $request->civil_status,
                'birthday' => $request->birthday,
                'availability' => $request->availability,
            ]);

            return response()->json([
                'status' => true,
                'message' => 'User created successfully',
                'user' => $user,
            ], 201);
        } catch (Exception $e) {
            Log::error('Error creating user:', ['error' => $e->getMessage()]);
            return response()->json([
                'status' => false,
                'message' => 'Failed to create user',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateUser(Request $request, $id)
    {
        try {
            $user = User::find($id);
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'User not found',
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'first_name' => 'required|string|max:255',
                'middle_name' => 'nullable|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . $id,
                'mobile' => 'required|string|max:20|unique:users,mobile,' . $id,
                'password' => 'nullable|string|min:6',
                'role' => 'required|string|in:user,admin,superadmin', // Allow superadmin
                'position' => 'nullable|string|max:255',
                'department' => 'nullable|string|max:255',
                'region' => 'nullable|string|max:255',
                'province' => 'nullable|string|max:255',
                'city' => 'nullable|string|max:255',
                'barangay' => 'nullable|string|max:255',
                'street' => 'nullable|string|max:255',
                'building_number' => 'nullable|string|max:50',
                'zip_code' => 'nullable|string|max:10',
                'gender' => 'nullable|string|max:50',
                'civil_status' => 'nullable|string|max:50',
                'birthday' => 'nullable|date_format:Y-m-d',
                'availability' => 'nullable|string|in:Available,Vacation,On Board',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $data = $request->only([
                'first_name',
                'middle_name',
                'last_name',
                'email',
                'mobile',
                'role',
                'position',
                'department',
                'region',
                'province',
                'city',
                'barangay',
                'street',
                'building_number',
                'zip_code',
                'gender',
                'civil_status',
                'birthday',
                'availability',
            ]);

            if ($request->has('password') && $request->password) {
                $data['password'] = Hash::make($request->password);
            }

            $user->update($data);

            return response()->json([
                'status' => true,
                'message' => 'User updated successfully',
                'user' => $user,
            ], 200);
        } catch (Exception $e) {
            Log::error('Error updating user:', ['error' => $e->getMessage()]);
            return response()->json([
                'status' => false,
                'message' => 'Failed to update user',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function deleteUser($id)
    {
        try {
            $user = User::find($id);
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'User not found',
                ], 404);
            }

            if ($user->role === 'superadmin') {
                return response()->json([
                    'status' => false,
                    'message' => 'Cannot delete superadmin account',
                ], 403);
            }

            $user->delete();

            return response()->json([
                'status' => true,
                'message' => 'User deleted successfully',
            ], 200);
        } catch (Exception $e) {
            Log::error('Error deleting user:', ['error' => $e->getMessage()]);
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete user',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}