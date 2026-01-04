import { getPost } from '@/lib/data';
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/api-auth';

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    if (!(await validateApiKey(request))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const slug = params.slug;
        const post = await getPost(slug);

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
    }
}
