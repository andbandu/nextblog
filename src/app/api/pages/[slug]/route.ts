import { getPage } from '@/lib/data';
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
        const page = await getPage(slug);

        if (!page) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }

        return NextResponse.json(page);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
    }
}
