import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Editor from '../../../_components/Editor';
import { getTags } from '@/lib/data';
import { createPostAction } from '@/app/actions';

export default async function NewPostPage() {
    const isLoggedIn = await isAuthenticated();

    if (!isLoggedIn) {
        redirect('/login');
    }

    const existingTags = await getTags();

    return <Editor existingTags={existingTags} action={createPostAction} />;
}


