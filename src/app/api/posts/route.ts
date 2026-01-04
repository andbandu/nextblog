import { getPosts } from '@/lib/data';
import { NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/api-auth';

export async function GET(request: Request) {
    if (!(await validateApiKey(request))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const posts = await getPosts();
        return NextResponse.json(posts);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}
