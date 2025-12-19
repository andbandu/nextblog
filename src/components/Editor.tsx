'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, PanelRightClose, PanelRightOpen, Settings, ExternalLink, Trash2, Bold, Italic, Heading2, Heading3, Quote, Link as LinkIcon, Image as ImageIcon, X, Plus, Loader2 } from 'lucide-react';
import { createPostAction, deletePostAction } from '@/app/actions';


import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import TiptapLink from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';

interface EditorProps {
    initialPost?: {
        title: string;
        slug: string;
        content: string;
        tags: string[];
        feature_image?: string;
        excerpt?: string;
    };
}

export default function Editor({ initialPost }: EditorProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [content, setContent] = useState(initialPost?.content || '');
    const [featureImage, setFeatureImage] = useState(initialPost?.feature_image || '');
    const [excerpt, setExcerpt] = useState(initialPost?.excerpt || '');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            TiptapLink.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 hover:underline cursor-pointer',
                },
            }),
            Placeholder.configure({
                placeholder: 'Begin writing your post...',
            }),
        ],
        content: initialPost?.content || '',
        editorProps: {
            attributes: {
                class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[calc(100vh-300px)]',
            },
        },
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML());
        },
    });

    const handleDelete = async () => {
        if (initialPost?.slug && confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            await deletePostAction(initialPost.slug);
        }
    };

    const setLink = () => {
        const previousUrl = editor?.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor?.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

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
            setFeatureImage(blob.url);
        } catch (error) {
            console.error(error);
            alert('Failed to upload image');
        } finally {
            setIsUploading(false);
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
                        <div className="mb-8">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleUpload}
                                className="hidden"
                                accept="image/*"
                            />

                            {isUploading ? (
                                <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse flex flex-col items-center justify-center">
                                    <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 animate-pulse" style={{ width: '60%' }} />
                                    </div>
                                    <p className="text-gray-400 text-sm mt-4">Uploading...</p>
                                </div>
                            ) : !featureImage ? (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors group"
                                >
                                    <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                                        <Plus size={20} />
                                    </div>
                                    <span className="font-medium">Add feature image</span>
                                </button>
                            ) : (
                                <div className="relative group">
                                    <img
                                        src={featureImage}
                                        alt="Feature"
                                        className="w-full h-64 object-cover rounded-lg shadow-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFeatureImage('')}
                                        className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <input
                            type="text"
                            name="title"
                            defaultValue={initialPost?.title}
                            placeholder="Post Title"
                            required
                            className="w-full text-5xl font-extrabold text-gray-900 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-700 border-none focus:outline-none focus:ring-0 bg-transparent p-0 mb-8"
                        />

                        {/* Hidden input to store HTML content and feature image for form submission */}
                        <input type="hidden" name="content" value={content} />
                        <input type="hidden" name="feature_image" value={featureImage} />

                        {editor && (
                            <BubbleMenu
                                editor={editor}
                                className="flex items-center gap-1 bg-black text-white rounded-lg shadow-xl px-2 py-1 z-[9999]"
                            >
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleBold().run()}
                                    className={`p-1.5 rounded hover:bg-gray-700 transition-colors ${editor.isActive('bold') ? 'text-blue-400' : ''}`}
                                >
                                    <Bold size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleItalic().run()}
                                    className={`p-1.5 rounded hover:bg-gray-700 transition-colors ${editor.isActive('italic') ? 'text-blue-400' : ''}`}
                                >
                                    <Italic size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                    className={`p-1.5 rounded hover:bg-gray-700 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'text-blue-400' : ''}`}
                                >
                                    <Heading2 size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                                    className={`p-1.5 rounded hover:bg-gray-700 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'text-blue-400' : ''}`}
                                >
                                    <Heading3 size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                                    className={`p-1.5 rounded hover:bg-gray-700 transition-colors ${editor.isActive('blockquote') ? 'text-blue-400' : ''}`}
                                >
                                    <Quote size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={setLink}
                                    className={`p-1.5 rounded hover:bg-gray-700 transition-colors ${editor.isActive('link') ? 'text-blue-400' : ''}`}
                                >
                                    <LinkIcon size={16} />
                                </button>
                            </BubbleMenu>
                        )}

                        <EditorContent editor={editor} />
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

                            <div>
                                <label htmlFor="feature_image" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                    Excerpt
                                </label>
                                <textarea
                                    name="excerpt"
                                    value={excerpt}
                                    onChange={(e) => setExcerpt(e.target.value)}
                                    form="post-form"
                                    placeholder="Write a short summary..."
                                    rows={4}
                                    className={`w-full bg-white dark:bg-gray-800 border rounded-md px-3 py-2 text-sm focus:outline-none transition-colors ${excerpt.length > 300
                                            ? 'border-red-500 focus:border-red-500'
                                            : 'border-gray-200 dark:border-gray-700 focus:border-blue-500'
                                        }`}
                                />
                                <div className="flex justify-between mt-1">
                                    <span className={`text-xs ${excerpt.length > 300 ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                                        {excerpt.length > 300 ? 'Excerpt cannot exceed 300 characters' : ''}
                                    </span>
                                    <span className={`text-xs ${excerpt.length > 300 ? 'text-red-500' : 'text-gray-400'}`}>
                                        {excerpt.length}/300
                                    </span>
                                </div>
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
