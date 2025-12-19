'use server';

import { login, logout } from '@/lib/auth';
import { savePost, Post } from '@/lib/data';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function loginAction(prevState: any, formData: FormData) {
    const password = formData.get('password') as string;
    const success = await login(password);

    if (success) {
        redirect('/admin');
    } else {
        return { error: 'Invalid password' };
    }
}

export async function logoutAction() {
    await logout();
    redirect('/');
}

export async function createPostAction(formData: FormData) {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const content = formData.get('content') as string;
    const tagsString = formData.get('tags') as string;
    const featureImage = formData.get('feature_image') as string;
    const excerpt = formData.get('excerpt') as string;

    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    const post: Post = {
        title,
        slug,
        content,
        tags,
        date: new Date().toISOString(),
        feature_image: featureImage || undefined,
        excerpt: excerpt || undefined,
    };

    await savePost(post);
    revalidatePath('/');
    redirect('/admin/posts');
}

export async function deletePostAction(slug: string) {
    await import('@/lib/data').then(mod => mod.deletePost(slug));
    revalidatePath('/');
    redirect('/admin/posts');
}
