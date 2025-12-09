import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Editor from '@/components/Editor';

export default async function NewPostPage() {
    const isLoggedIn = await isAuthenticated();

    if (!isLoggedIn) {
        redirect('/login');
    }

    return <Editor />;
}
