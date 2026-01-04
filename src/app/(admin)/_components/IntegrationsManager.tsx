'use client';

import { useState } from 'react';
import { APIKey } from '@/lib/api-auth';
import { Plus, Trash2, Key, Copy, Check } from 'lucide-react';
import { saveSetting } from '@/lib/data'; // I need a client version or action

interface IntegrationsManagerProps {
    initialKeys: APIKey[];
    onSave: (keys: APIKey[]) => Promise<void>;
}

export default function IntegrationsManager({ initialKeys, onSave }: IntegrationsManagerProps) {
    const [keys, setKeys] = useState<APIKey[]>(initialKeys);
    const [newName, setNewName] = useState('');
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const generateKey = () => {
        if (!newName.trim()) return;

        const newKey: APIKey = {
            name: newName,
            key: 'ak_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            createdAt: new Date().toISOString(),
        };

        const updatedKeys = [...keys, newKey];
        setKeys(updatedKeys);
        setNewName('');
        onSave(updatedKeys);
    };

    const deleteKey = (index: number) => {
        const updatedKeys = keys.filter((_, i) => i !== index);
        setKeys(updatedKeys);
        onSave(updatedKeys);
    };

    const copyToClipboard = (key: string, index: number) => {
        navigator.clipboard.writeText(key);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Key className="w-5 h-5 text-blue-500" />
                    API Keys & Integrations
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Manage API keys for mobile app and third-party integrations.
                </p>
            </div>

            <div className="p-6 space-y-6">
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Key Name (e.g. Mobile App)"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                    />
                    <button
                        onClick={generateKey}
                        disabled={!newName.trim()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Generate Key
                    </button>
                </div>

                <div className="space-y-3">
                    {keys.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400 italic">
                            No API keys generated yet.
                        </div>
                    ) : (
                        keys.map((key, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800"
                            >
                                <div className="space-y-1">
                                    <div className="font-medium text-gray-900 dark:text-gray-100">{key.name}</div>
                                    <div className="flex items-center gap-2 font-mono text-xs text-gray-500 dark:text-gray-400">
                                        {key.key}
                                        <button
                                            onClick={() => copyToClipboard(key.key, index)}
                                            className="p-1 hover:text-blue-500 transition-colors"
                                            title="Copy to clipboard"
                                        >
                                            {copiedIndex === index ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                        </button>
                                    </div>
                                    <div className="text-[10px] text-gray-400">
                                        Created: {new Date(key.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <button
                                    onClick={() => deleteKey(index)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    title="Delete key"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
