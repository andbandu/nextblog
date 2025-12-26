'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, ChevronDown } from 'lucide-react';
import { Tag as TagType } from '@/lib/data';

interface TagInputProps {
    existingTags: TagType[];
    initialSelected?: string[];
    name?: string;
    form?: string;
}

export default function TagInput({ existingTags, initialSelected = [], name = "tags", form }: TagInputProps) {
    const [selectedTags, setSelectedTags] = useState<string[]>(initialSelected);
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredSuggestions = existingTags.filter(
        tag => !selectedTags.includes(tag.name) &&
            tag.name.toLowerCase().includes(inputValue.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const addTag = (tagName: string) => {
        const trimmed = tagName.trim();
        if (trimmed && !selectedTags.includes(trimmed)) {
            setSelectedTags([...selectedTags, trimmed]);
        }
        setInputValue('');
        setShowSuggestions(false);
    };

    const removeTag = (tagName: string) => {
        setSelectedTags(selectedTags.filter(t => t !== tagName));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (inputValue) {
                addTag(inputValue);
            }
        } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
            removeTag(selectedTags[selectedTags.length - 1]);
        }
    };

    return (
        <div className="relative" ref={containerRef}>
            <div className="min-h-[42px] p-1.5 flex flex-wrap gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                {selectedTags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium rounded">
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-blue-900 dark:hover:text-blue-200 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={selectedTags.length === 0 ? "Add tags..." : ""}
                    className="flex-1 bg-transparent border-none outline-none text-sm min-w-[120px] dark:text-gray-200"
                />
                <input type="hidden" name={name} value={selectedTags.join(',')} form={form} />
            </div>

            {showSuggestions && (inputValue || filteredSuggestions.length > 0) && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {filteredSuggestions.map(tag => (
                        <button
                            key={tag.slug}
                            type="button"
                            onClick={() => addTag(tag.name)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-200 transition-colors flex items-center justify-between"
                        >
                            {tag.name}
                            <span className="text-[10px] text-gray-500 uppercase font-bold">Existing</span>
                        </button>
                    ))}
                    {inputValue && !filteredSuggestions.some(s => s.name.toLowerCase() === inputValue.toLowerCase()) && (
                        <button
                            type="button"
                            onClick={() => addTag(inputValue)}
                            className="w-full text-left px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-between"
                        >
                            <span className="flex items-center gap-2">
                                <Plus size={14} />
                                Create "{inputValue}"
                            </span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
