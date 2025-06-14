<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Media extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'media';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
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

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'metadata' => 'array',
            'size' => 'integer',
        ];
    }

    /**
     * Get the user that owns the media.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the full URL for the media file.
     */
    public function getFullUrlAttribute()
    {
        return url('storage/' . $this->path);
    }

    /**
     * Check if the media is an image.
     */
    public function isImage()
    {
        return str_starts_with($this->mime_type, 'image/');
    }

    /**
     * Check if the media is a PDF.
     */
    public function isPdf()
    {
        return $this->mime_type === 'application/pdf';
    }
}