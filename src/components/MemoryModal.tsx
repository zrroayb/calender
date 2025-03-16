'use client';

import React, { useState, useRef } from 'react';
import { Memory } from '@/types/memory';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Send } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  memories: Memory[];
  onMemoryAdded: (memory: Memory) => void;
  mode: 'view' | 'add';
  currentUser: 'Ayberk' | 'Selvi';
}

export default function MemoryModal({ isOpen, onClose, date, memories, onMemoryAdded, mode, currentUser }: MemoryModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newComment, setNewComment] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'my-upload2');
      formData.append('folder', 'calendar-memories');

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) {
        throw new Error('Cloudinary cloud name is not configured');
      }

      console.log('Starting upload with:', {
        cloudName,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        fileType: selectedFile.type,
        fileSize: selectedFile.size
      });

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Cloudinary error details:', errorData);
        throw new Error(errorData.error?.message || 'Failed to upload image');
      }

      const data = await response.json();
      console.log('Upload response:', data);

      if (!data.secure_url) {
        throw new Error('No URL received from Cloudinary');
      }

      const newMemory: Memory = {
        id: Date.now().toString(),
        date: format(date, 'yyyy-MM-dd'),
        imageUrl: data.secure_url,
        caption,
        author: currentUser,
        comments: [],
      };

      console.log('Creating new memory:', newMemory);
      onMemoryAdded(newMemory);
      toast.success('Memory added successfully!');
      onClose();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload image. Please try again.');
    }
  };

  const testConnections = async () => {
    // Test MongoDB
    try {
      const mongoResponse = await fetch('/api/test-connection');
      const mongoData = await mongoResponse.json();
      
      if (mongoResponse.ok) {
        toast.success('MongoDB connection successful!');
      } else {
        throw new Error(mongoData.error || 'MongoDB test failed');
      }
    } catch (error) {
      console.error('MongoDB test failed:', error);
      toast.error(`MongoDB test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Test Cloudinary
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      console.log('Testing Cloudinary connection with:', {
        cloudName,
        uploadPreset,
      });

      const testFormData = new FormData();
      testFormData.append('upload_preset', uploadPreset || 'my-upload2');
      testFormData.append('file', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==');

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: testFormData,
      });

      const data = await response.json();
      console.log('Cloudinary Test Response:', data);

      if (response.ok) {
        toast.success('Cloudinary connection successful!');
      } else {
        throw new Error(data.error?.message || 'Cloudinary test failed');
      }
    } catch (error) {
      console.error('Cloudinary test failed:', error);
      toast.error(`Cloudinary test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleAddComment = async (memoryId: string) => {
    if (!newComment.trim()) return;

    try {
      const comment = {
        id: Date.now().toString(),
        text: newComment,
        author: currentUser,
        createdAt: new Date().toISOString(),
      };

      const response = await fetch(`/api/memories/${memoryId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add comment');
      }

      const updatedMemory = await response.json();
      
      // Update local state
      onMemoryAdded(updatedMemory);
      
      setNewComment('');
      toast.success('Comment added!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl p-4 md:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {mode === 'add' ? 'Add Memory' : format(date, 'MMMM d, yyyy')}
            </h2>
            <div className="flex items-center gap-2">
              {mode === 'add' && (
                <button
                  type="button"
                  onClick={testConnections}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-sm text-gray-500"
                >
                  Test Connections
                </button>
              )}
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {mode === 'add' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative h-64 bg-gray-50 dark:bg-gray-700 rounded-2xl overflow-hidden">
                {preview ? (
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-gray-400 dark:text-gray-500"
                  >
                    <Camera className="w-12 h-12" />
                    <span>Click to upload photo</span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              <div className="space-y-4">
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3 py-2 md:px-4 md:py-3 rounded-xl text-sm md:text-base"
                  rows={3}
                  placeholder="Write something about this memory..."
                />
              </div>

              <button
                type="submit"
                disabled={!selectedFile}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl
                  disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-pink-600 transition-colors"
              >
                Save Memory
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              {memories.map((memory) => {
                console.log('Rendering memory:', memory);
                return (
                  <div key={memory.id} className="space-y-4">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700"
                    >
                      <Image
                        src={memory.imageUrl}
                        alt={memory.caption || 'Memory image'}
                        fill
                        sizes="(max-width: 768px) 100vw, 600px"
                        className="object-contain"
                        priority
                        unoptimized
                        onError={(e) => {
                          console.error('Image failed to load:', {
                            url: memory.imageUrl,
                            error: e
                          });
                          e.currentTarget.src = '/placeholder.jpg';
                        }}
                      />
                    </motion.div>
                    <div className="space-y-2">
                      <p className="text-gray-700 dark:text-gray-300 text-lg">{memory.caption}</p>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium
                          ${memory.author === 'Ayberk' 
                            ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' 
                            : 'bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400'
                          }`}
                        >
                          Added by {memory.author}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {format(new Date(memory.date), 'MMMM d, yyyy')}
                        </span>
                      </div>
                    </div>

                    {/* Comments section */}
                    <div className="mt-6 space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Comments</h3>
                      
                      <div className="space-y-4">
                        {memory.comments?.map((comment) => (
                          <div 
                            key={comment.id}
                            className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2"
                          >
                            <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                            <div className="flex items-center gap-2 text-sm">
                              <span className={`font-medium ${
                                comment.author === 'Ayberk' 
                                  ? 'text-purple-600 dark:text-purple-400' 
                                  : 'text-pink-600 dark:text-pink-400'
                              }`}>
                                {comment.author}
                              </span>
                              <span className="text-gray-500 dark:text-gray-400">
                                {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add comment form */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          onKeyDown={(e) => e.key === 'Enter' && handleAddComment(memory.id)}
                        />
                        <button
                          onClick={() => handleAddComment(memory.id)}
                          disabled={!newComment.trim()}
                          className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl
                            disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-pink-600 
                            transition-colors"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 