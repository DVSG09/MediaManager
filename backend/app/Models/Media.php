<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Media extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'media';

    protected $fillable = [
        'user_id',
        'filename',
        'original_name',
        'mime_type',
        'size',
        'path',
        'url',
        'metadata'
    ];

    // CHANGE THIS - use the old syntax
    protected $casts = [
        'metadata' => 'array',
        'size' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // FIX THIS - use Storage::url instead
    public function getFullUrlAttribute()
    {
        return Storage::url($this->path);
    }

    public function isImage()
    {
        return str_starts_with($this->mime_type, 'image/');
    }

    public function isPdf()
    {
        return $this->mime_type === 'application/pdf';
    }
}