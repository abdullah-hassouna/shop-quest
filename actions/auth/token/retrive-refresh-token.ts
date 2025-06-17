'use server'

import { cookies } from 'next/headers';

export default async function retrieveRefreshToken(): Promise<string | null> {
    const cookieStore = await cookies();

    return cookieStore.get('token')?.value || null;
}