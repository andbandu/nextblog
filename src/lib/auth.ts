import { cookies } from 'next/headers';

const AUTH_COOKIE_NAME = 'admin_auth';
// In a real app, use an environment variable. For this simple demo, we'll use a hardcoded value if env is missing.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function isAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(AUTH_COOKIE_NAME);
    return authCookie?.value === 'true';
}

export async function login(password: string): Promise<boolean> {
    if (password === ADMIN_PASSWORD) {
        const cookieStore = await cookies();
        cookieStore.set(AUTH_COOKIE_NAME, 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });
        return true;
    }
    return false;
}

export async function logout(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE_NAME);
}
