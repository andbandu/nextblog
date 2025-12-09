'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, PanelRightClose, PanelRightOpen, Settings, ExternalLink, Trash2 } from 'lucide-react';
import { createPostAction, deletePostAction } from '@/app/actions';

interface EditorProps {
    initialPost?: {
        title: string;
        slug: string;
        content: string;
        tags: string[];
    };
}

export default function Editor({ initialPost }: EditorProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleDelete = async () => {
        if (initialPost?.slug && confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            await deletePostAction(initialPost.slug);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-white dark:bg-gray-950">
            {/* Navbar */}
            <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 z-10">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/posts"
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Posts
                    </Link>
                    <span className="text-gray-300 dark:text-gray-700">|</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {initialPost ? 'Edit Post' : 'New Post'}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        form="post-form"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 px-3 py-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                        {initialPost ? 'Update' : 'Publish'}
                    </button>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className={`p-2 rounded-md transition-colors ${isSidebarOpen
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                            : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                            }`}
                        title="Toggle Settings"
                    >
                        <PanelRightOpen size={20} className={isSidebarOpen ? "hidden" : "block"} />
                        <PanelRightClose size={20} className={isSidebarOpen ? "block" : "hidden"} />
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Main Writing Area */}
                <div className="flex-1 overflow-y-auto">
                    <form id="post-form" action={createPostAction} className="max-w-3xl mx-auto py-12 px-8">
                        <input
                            type="text"
                            name="title"
                            defaultValue={initialPost?.title}
                            placeholder="Post Title"
                            required
                            className="w-full text-5xl font-extrabold text-gray-900 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-700 border-none focus:outline-none focus:ring-0 bg-transparent p-0 mb-8"
                        />

                        <textarea
                            name="content"
                            defaultValue={initialPost?.content}
                            placeholder="Begin writing your post..."
                            required
                            className="w-full h-[calc(100vh-300px)] text-lg text-gray-800 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-700 border-none focus:outline-none focus:ring-0 bg-transparent p-0 resize-none leading-relaxed"
                        />
                    </form>
                </div>

                {/* Right Sidebar */}
                <div
                    className={`w-80 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full hidden'
                        }`}
                >
                    <div className="p-6 flex-1 overflow-y-auto space-y-6">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-6">
                            <Settings size={20} />
                            <span className="font-medium">Post Settings</span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="slug" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                    Post URL
                                </label>
                                <input
                                    type="text"
                                    name="slug"
                                    defaultValue={initialPost?.slug}
                                    form="post-form"
                                    placeholder="my-new-post"
                                    required
                                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label htmlFor="tags" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                    Tags
                                </label>
                                <input
                                    type="text"
                                    name="tags"
                                    defaultValue={initialPost?.tags.join(', ')}
                                    form="post-form"
                                    placeholder="news, tutorial"
                                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                />
                                <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
                            </div>

                            {initialPost && (
                                <div className="pt-4">
                                    <Link
                                        href={`/blog/${initialPost.slug}`}
                                        target="_blank"
                                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        <ExternalLink size={16} />
                                        View Live Site
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {initialPost && (
                        <div className="p-6 border-t border-gray-200 dark:border-gray-800">
                            <button
                                onClick={handleDelete}
                                className="w-full flex items-center justify-center gap-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 py-2 rounded-md transition-colors"
                            >
                                <Trash2 size={16} />
                                Delete Post
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
