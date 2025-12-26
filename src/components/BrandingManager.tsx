'use client';

import { useState, useRef } from 'react';
import { Upload, Trash2, Palette, Check, X } from 'lucide-react';
import { updateDesignAction } from '@/app/actions';

interface BrandingManagerProps {
    initialDesign: {
        logo_url: string;
        accent_color: string;
    };
}

export default function BrandingManager({ initialDesign }: BrandingManagerProps) {
    const [logoUrl, setLogoUrl] = useState(initialDesign.logo_url);
    const [accentColor, setAccentColor] = useState(initialDesign.accent_color || '#3b82f6');
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const fileInputRef = useRef<HTMLInputElement>(null);


    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            const blob = await response.json();
            setLogoUrl(blob.url);
        } catch (error) {
            console.error(error);
            alert('Failed to upload logo');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        setStatus('saving');
        try {
            await updateDesignAction({ logo_url: logoUrl, accent_color: accentColor });
            setStatus('success');
            setTimeout(() => setStatus('idle'), 2000);
        } catch (error) {
            console.error(error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 2000);
        }
    };


    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-2 mb-6">
                <Palette className="text-blue-500" size={24} />
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Design & Branding</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Logo Section */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        Site Logo
                    </label>
                    <div className="flex items-start gap-4">
                        <div className="relative w-24 h-24 bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                            {logoUrl ? (
                                <>
                                    <img src={logoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain p-2" />
                                    <button
                                        onClick={() => setLogoUrl('')}
                                        className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </>
                            ) : (
                                <Upload className="text-gray-300" size={24} />
                            )}
                            {isUploading && (
                                <div className="absolute inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleUpload}
                                className="hidden"
                                accept="image/*"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                            >
                                {logoUrl ? 'Change Logo' : 'Upload Logo'}
                            </button>
                            <p className="text-xs text-gray-500 mt-2">
                                Recommended size: 200x50px. Transparent PNG or SVG preferred.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Accent Color Section */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        Accent Color
                    </label>
                    <div className="flex items-center gap-4">
                        <input
                            type="color"
                            value={accentColor}
                            onChange={(e) => setAccentColor(e.target.value)}
                            className="w-12 h-12 rounded-lg cursor-pointer border-none p-0 overflow-hidden bg-transparent"
                        />
                        <div className="flex-1">
                            <input
                                type="text"
                                value={accentColor}
                                onChange={(e) => setAccentColor(e.target.value)}
                                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:border-blue-500 transition-colors"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Used for buttons, links, and highlights across the site.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                    onClick={handleSave}
                    disabled={status !== 'idle'}
                    className={`min-w-[170px] flex items-center justify-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all ${status === 'success'
                            ? 'bg-green-600 text-white'
                            : status === 'error'
                                ? 'bg-red-600 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white'
                        }`}
                >
                    {status === 'saving' && (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving...
                        </>
                    )}
                    {status === 'success' && (
                        <>
                            <Check size={18} />
                            Saved
                        </>
                    )}
                    {status === 'error' && (
                        <>
                            <X size={18} />
                            Error
                        </>
                    )}
                    {status === 'idle' && 'Save Design Settings'}
                </button>
            </div>

        </div>
    );
}
