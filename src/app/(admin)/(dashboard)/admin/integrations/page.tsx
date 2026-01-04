import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getSetting } from '@/lib/data';
import IntegrationsManager from '@/app/(admin)/_components/IntegrationsManager';
import { APIKey } from '@/lib/api-auth';
import { updateApiKeysAction } from '@/app/actions';

export default async function AdminIntegrationsPage() {
    const isLoggedIn = await isAuthenticated();

    if (!isLoggedIn) {
        redirect('/login');
    }

    const apiKeys = await getSetting<APIKey[]>('api_keys') || [];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Integrations</h1>
                <p className="text-gray-500 dark:text-gray-400">Connect your blog with external apps and services.</p>
            </div>

            <div className="space-y-8 pb-12">
                <IntegrationsManager
                    initialKeys={apiKeys}
                    onSave={updateApiKeysAction}
                />
            </div>
        </div>
    );
}
