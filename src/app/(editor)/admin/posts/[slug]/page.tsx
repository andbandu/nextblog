import { isAuthenticated } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import Editor from '@/components/Editor';
import { getPost } from '@/lib/data';

interface EditPostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
    const isLoggedIn = await isAuthenticated();

    if (!isLoggedIn) {
        redirect('/login');
    }

    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    return <Editor initialPost={post} />;
}
