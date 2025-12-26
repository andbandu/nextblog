import { isAuthenticated } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import Editor from '@/components/Editor';
import { getPage } from '@/lib/data';
import { createPageAction, deletePageAction } from '@/app/actions';

interface EditPagePageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function EditPagePage({ params }: EditPagePageProps) {
    const isLoggedIn = await isAuthenticated();

    if (!isLoggedIn) {
        redirect('/login');
    }

    const { slug } = await params;
    const page = await getPage(slug);

    if (!page) {
        notFound();
    }

    return (
        <Editor
            initialPost={page}
            mode="page"
            action={createPageAction}
            deleteAction={deletePageAction}
        />
    );
}
