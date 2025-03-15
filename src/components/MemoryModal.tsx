'use client';

import React, { useState, useRef } from 'react';
import { Memory } from '@/types/memory';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Camera } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';

interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  memories: Memory[];
  onMemoryAdded: (memory: Memory) => void;
  mode: 'view' | 'add';
}

export default function MemoryModal({ isOpen, onClose, date, memories, onMemoryAdded, mode }: MemoryModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [caption, setCaption] = useState('');
  const [author, setAuthor] = useState<'Ayberk' | 'Selvi'>('Ayberk');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      formData.append('upload_preset', 'my-uploads'); // You'll need to configure this in Cloudinary

      const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      const newMemory: Memory = {
        id: Date.now().toString(),
        date: format(date, 'yyyy-MM-dd'),
        imageUrl: data.secure_url,
        caption,
        author,
        comments: [],
      };

      onMemoryAdded(newMemory);
      onClose();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-lg"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {mode === 'add' ? 'Add Memory' : format(date, 'MMMM d, yyyy')}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Caption
                  </label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={3}
                    placeholder="Write something about this memory..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Author
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setAuthor('Ayberk')}
                      className={`flex-1 px-4 py-3 rounded-xl border ${
                        author === 'Ayberk'
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                          : 'border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      Ayberk
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthor('Selvi')}
                      className={`flex-1 px-4 py-3 rounded-xl border ${
                        author === 'Selvi'
                          ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400'
                          : 'border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      Selvi
                    </button>
                  </div>
                </div>
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
              {memories.map((memory) => (
                <div key={memory.id} className="space-y-4">
                  <div className="relative h-64 rounded-2xl overflow-hidden">
                    <Image
                      src={memory.imageUrl}
                      alt={memory.caption}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{memory.caption}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>Added by {memory.author}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 