'use client';

import { useState } from 'react';
import { Plus, Trash2, GripVertical, Check, X } from 'lucide-react';
import { NavLink } from '@/lib/data';
import { updateNavigationAction } from '@/app/actions';

interface NavigationManagerProps {
    title: string;
    settingKey: string;
    initialLinks: NavLink[];
}

export default function NavigationManager({ title, settingKey, initialLinks }: NavigationManagerProps) {
    const [links, setLinks] = useState<NavLink[]>(initialLinks);
    const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

    const addLink = () => {
        setLinks([...links, { label: '', url: '' }]);
    };

    const removeLink = (index: number) => {
        setLinks(links.filter((_, i) => i !== index));
    };

    const updateLink = (index: number, field: keyof NavLink, value: string) => {
        const newLinks = [...links];
        newLinks[index][field] = value;
        setLinks(newLinks);
    };

    const handleSave = async () => {
        setStatus('saving');
        try {
            await updateNavigationAction(settingKey, links);
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
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
                <button
                    onClick={addLink}
                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                    <Plus size={16} />
                    Add Link
                </button>
            </div>

            <div className="space-y-3 mb-6">
                {links.map((link, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div className="text-gray-300 dark:text-gray-700 cursor-grab">
                            <GripVertical size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Label"
                            value={link.label}
                            onChange={(e) => updateLink(index, 'label', e.target.value)}
                            className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        <input
                            type="text"
                            placeholder="URL (e.g. /about or https://...)"
                            value={link.url}
                            onChange={(e) => updateLink(index, 'url', e.target.value)}
                            className="flex-[2] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        <button
                            onClick={() => removeLink(index)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Remove Link"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
                {links.length === 0 && (
                    <p className="text-center py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-lg">
                        No links added yet.
                    </p>
                )}
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={status !== 'idle'}
                    className={`min-w-[140px] flex items-center justify-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all ${status === 'success'
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
                    {status === 'idle' && 'Save Navigation'}
                </button>
            </div>

        </div>
    );
}
