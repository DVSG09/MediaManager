<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    /**
     * Create a new MediaController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * Display a listing of the user's media.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $media = auth()->user()->media()->latest()->get();

        return response()->json([
            'status' => 'success',
            'data' => $media->map(function ($item) {
                return [
                    'id' => $item->id,
                    'filename' => $item->filename,
                    'original_name' => $item->original_name,
                    'mime_type' => $item->mime_type,
                    'size' => $item->size,
                    'url' => $item->full_url,
                    'is_image' => $item->isImage(),
                    'is_pdf' => $item->isPdf(),
                    'created_at' => $item->created_at,
                    'updated_at' => $item->updated_at,
                ];
            })
        ]);
    }

    /**
     * Upload a new media file.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function upload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:jpeg,png,jpg,gif,pdf|max:10240', // 10MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $file = $request->file('file');
            $originalName = $file->getClientOriginalName();
            $mimeType = $file->getMimeType();
            $size = $file->getSize();
            
            // Generate unique filename
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            
            // Store file in public/storage/media directory
            $path = $file->storeAs('media', $filename, 'public');

            // Create media record
            $media = Media::create([
                'user_id' => auth()->id(),
                'filename' => $filename,
                'original_name' => $originalName,
                'mime_type' => $mimeType,
                'size' => $size,
                'path' => $path,
                'url' => Storage::url($path),
                'metadata' => [
                    'uploaded_at' => now()->toISOString(),
                    'ip_address' => $request->ip(),
                ]
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'File uploaded successfully',
                'data' => [
                    'id' => $media->id,
                    'filename' => $media->filename,
                    'original_name' => $media->original_name,
                    'mime_type' => $media->mime_type,
                    'size' => $media->size,
                    'url' => $media->full_url,
                    'is_image' => $media->isImage(),
                    'is_pdf' => $media->isPdf(),
                    'created_at' => $media->created_at,
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to upload file',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified media.
     *
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $media = auth()->user()->media()->find($id);

        if (!$media) {
            return response()->json([
                'status' => 'error',
                'message' => 'Media not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'id' => $media->id,
                'filename' => $media->filename,
                'original_name' => $media->original_name,
                'mime_type' => $media->mime_type,
                'size' => $media->size,
                'url' => $media->full_url,
                'is_image' => $media->isImage(),
                'is_pdf' => $media->isPdf(),
                'metadata' => $media->metadata,
                'created_at' => $media->created_at,
                'updated_at' => $media->updated_at,
            ]
        ]);
    }

    /**
     * Remove the specified media from storage.
     *
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $media = auth()->user()->media()->find($id);

        if (!$media) {
            return response()->json([
                'status' => 'error',
                'message' => 'Media not found'
            ], 404);
        }

        try {
            // Delete the physical file
            if (Storage::disk('public')->exists($media->path)) {
                Storage::disk('public')->delete($media->path);
            }

            // Delete the database record
            $media->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Media deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete media',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}