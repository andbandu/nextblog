import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Editor from '@/components/Editor';
import { createPageAction } from '@/app/actions';

export default async function NewPagePage() {
    const isLoggedIn = await isAuthenticated();

    if (!isLoggedIn) {
        redirect('/login');
    }

    return <Editor mode="page" action={createPageAction} />;
}
