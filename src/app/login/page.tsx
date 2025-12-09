'use client';

import { useActionState } from 'react';
import { loginAction } from '@/app/actions';

const initialState = {
    error: '',
};

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(loginAction, initialState);

    return (
        <div className="max-w-md mx-auto mt-20">
            <h1 className="text-3xl font-bold mb-8 text-center">Admin Login</h1>
            <form action={formAction} className="space-y-6">
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 dark:text-white sm:text-sm p-2 border"
                    />
                </div>

                {state?.error && (
                    <p className="text-red-600 text-sm">{state.error}</p>
                )}

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {isPending ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}
