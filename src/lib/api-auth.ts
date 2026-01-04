import { getSetting } from './data';

export interface APIKey {
    name: string;
    key: string;
    createdAt: string;
}

export async function validateApiKey(request: Request): Promise<boolean> {
    const apiKey = request.headers.get('x-api-key');

    if (!apiKey) {
        return false;
    }

    try {
        const keys = await getSetting<APIKey[]>('api_keys');

        if (!keys || !Array.isArray(keys)) {
            return false;
        }

        return keys.some(k => k.key === apiKey);
    } catch (error) {
        console.error('API Key Validation Error:', error);
        return false;
    }
}
