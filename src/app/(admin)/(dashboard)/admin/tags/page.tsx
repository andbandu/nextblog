import { getTags } from "@/lib/data";
import { createTagAction, deleteTagAction } from "@/app/actions";
import { Tag, Trash2, Plus } from "lucide-react";

export default async function TagsPage() {
    const tags = await getTags();

    return (
        <div className="max-w-4xl mx-auto">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Tags</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your blog categories and tags.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Create Tag Form */}
                <div className="md:col-span-1">
                    <section className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Plus size={20} className="text-blue-500" />
                            New Tag
                        </h2>
                        <form action={createTagAction} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tag Name</label>
                                <input name="name" type="text" required placeholder="e.g. Technology" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition-colors">
                                Create Tag
                            </button>
                        </form>
                    </section>
                </div>

                {/* Tags List */}
                <div className="md:col-span-2">
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tag Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {tags.map((tag) => (
                                    <tr key={tag.slug} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Tag size={16} className="text-gray-400" />
                                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{tag.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-xs font-mono text-gray-500">{tag.slug}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <form action={deleteTagAction.bind(null, tag.slug)} className="inline">
                                                <button type="submit" className="text-red-600 hover:text-red-900 dark:hover:text-red-400 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                ))}
                                {tags.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-gray-500 italic">
                                            No tags created yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
