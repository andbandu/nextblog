import { getSetting } from '@/lib/data';
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/api-auth';

// Next.js 15+ Route Handlers require params to be awaited
export async function GET(
    request: NextRequest,
    props: { params: Promise<{ key: string }> }
) {
    if (!(await validateApiKey(request))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const params = await props.params;
        const key = params.key;
        const setting = await getSetting(key);

        if (setting === null) {
            return NextResponse.json({ error: 'Setting not found' }, { status: 404 });
        }

        return NextResponse.json(setting);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch setting' }, { status: 500 });
    }
}
