'use client';

import { useState } from 'react';
import { Info, Check, X } from 'lucide-react';
import { updateSiteInfoAction } from '@/app/actions';

interface SiteInfoManagerProps {
    initialInfo: {
        title: string;
        description: string;
    };
}

export default function SiteInfoManager({ initialInfo }: SiteInfoManagerProps) {
    const [title, setTitle] = useState(initialInfo.title);
    const [description, setDescription] = useState(initialInfo.description);
    const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

    const handleSave = async () => {
        setStatus('saving');
        try {
            await updateSiteInfoAction({ title, description });
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
                <Info className="text-blue-500" size={24} />
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Site Information</h2>
            </div>

            <div className="space-y-6 mb-8">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Site Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="My Awesome Blog"
                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        Visible in the browser tab and as a fallback in the Navbar.
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Site Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        placeholder="A blog about technology, design, and more."
                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        Important for SEO. Used as the default meta description for your homepage.
                    </p>
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
                    {status === 'idle' && 'Save Site Info'}
                </button>
            </div>
        </div>
    );
}
