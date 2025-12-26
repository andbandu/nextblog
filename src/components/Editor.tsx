'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
    ArrowLeft, PanelRightClose, PanelRightOpen, Settings, ExternalLink,
    Trash2, Bold, Italic, Heading2, Heading3, Quote, Link as LinkIcon,
    Image as ImageIcon, X, Plus, Loader2, Video, Bookmark, MousePointerClick
} from 'lucide-react';
import { createPostAction, deletePostAction } from '@/app/actions';
import TagInput from '@/components/TagInput';
import { Tag as TagType } from '@/lib/data';

import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import ImageExtension from '@tiptap/extension-image';
import YoutubeExtension from '@tiptap/extension-youtube';
import FloatingMenuExtension from '@tiptap/extension-floating-menu';

interface EditorProps {
    initialPost?: {
        title: string;
        slug: string;
        content: string;
        tags?: string[];
        feature_image?: string;
        excerpt?: string;
    };
    existingTags?: TagType[];
    mode?: 'post' | 'page';
    action: (formData: FormData) => Promise<void>;
    deleteAction?: (slug: string) => Promise<void>;
}

export default function Editor({ initialPost, existingTags = [], mode = 'post', action, deleteAction }: EditorProps) {

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
            LinkExtension.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-500 hover:underline',
                },
            }),
            Placeholder.configure({
                placeholder: 'Write your story...',
            }),
            ImageExtension.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full my-4 shadow-sm',
                },
            }),
            YoutubeExtension.configure({
                HTMLAttributes: {
                    class: 'w-full aspect-video rounded-lg my-4 shadow-sm',
                },
            }),
            FloatingMenuExtension,
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
        if (initialPost?.slug && deleteAction && confirm(`Are you sure you want to delete this ${mode}? This action cannot be undone.`)) {
            await deleteAction(initialPost.slug);
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

    const addImage = useCallback(() => {
        const url = window.prompt('Enter image URL');
        if (url) {
            editor?.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    const addYoutube = useCallback(() => {
        const url = window.prompt('Enter YouTube URL');
        if (url) {
            editor?.commands.setYoutubeVideo({ src: url });
        }
    }, [editor]);

    const addButton = useCallback(() => {
        const url = window.prompt('Enter link for button');
        const text = window.prompt('Enter button text');
        if (url && text) {
            editor?.chain().focus().insertContent(`<a href="${url}" class="px-4 py-2 bg-blue-600 text-white rounded-md inline-block no-underline hover:bg-blue-700 transition-colors my-2 font-medium">${text}</a>`).run();
        }
    }, [editor]);

    const addBookmark = useCallback(() => {
        const url = window.prompt('Enter URL to bookmark');
        const text = window.prompt('Enter description');
        if (url && text) {
            editor?.chain().focus().insertContent(`
    <a href="${url}" target="_blank" rel="noopener noreferrer" class="block p-4 my-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg no-underline group hover:border-blue-500 transition-colors">
                    <div class="flex items-center gap-2 mb-1 text-sm font-medium text-gray-500 uppercase tracking-wider">
                        <span class="text-blue-500">🔖</span>
                        Bookmark
                    </div>
                    <div class="font-medium text-lg text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
                        ${text}
                    </div>
                    <div class="text-sm text-gray-400 truncate mt-1">
                        ${url}
                    </div>
                </a>
    `).run();
        }
    }, [editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-col h-screen bg-white dark:bg-gray-950">
            {/* Floating Menu */}
            {editor && (
                <FloatingMenu
                    editor={editor}
                    options={{ placement: 'left', offset: { mainAxis: 20, crossAxis: 0 } }}
                    shouldShow={({ state }) => {
                        const { selection } = state;
                        const { $from, empty } = selection;
                        return empty && $from.parent.content.size === 0;
                    }}
                    className="flex items-center"
                >
                    <div className="relative group">
                        <button
                            className="p-3 rounded-full border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Add content"
                        >
                            <Plus size={24} />
                        </button>

                        {/* Dropdown Menu */}
                        <div className="absolute left-12 top-12 hidden group-hover:block w-48 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 p-1 z-50 overflow-hidden animate-in fade-in slide-in-from-left-2 duration-200">
                            <button onClick={addImage} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors text-left">
                                <ImageIcon size={16} /> Image
                            </button>
                            <button onClick={addYoutube} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors text-left">
                                <Video size={16} /> Video
                            </button>
                            <button onClick={addButton} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors text-left">
                                <MousePointerClick size={16} /> Button
                            </button>
                            <button onClick={addBookmark} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors text-left">
                                <Bookmark size={16} /> Bookmark
                            </button>
                        </div>
                    </div>
                </FloatingMenu>
            )}

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
                    <form id="post-form" action={action} className="max-w-3xl mx-auto py-12 px-8">
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
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    editor?.chain().focus().run();
                                }
                            }}
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

                            {mode === 'post' && (
                                <div>
                                    <label htmlFor="tags" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Tags
                                    </label>
                                    <TagInput
                                        existingTags={existingTags}
                                        initialSelected={initialPost?.tags}
                                        name="tags"
                                    />
                                </div>
                            )}

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
                                        href={`/${initialPost.slug}`}
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
