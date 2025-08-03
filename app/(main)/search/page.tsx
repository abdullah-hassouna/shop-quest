'use client';

import { Suspense } from 'react';
import SearchPage from '@/components/pages/SearchPage';
function SearchComponent() {


    return (
        <SearchPage />
    );
}

export default function Component() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchComponent />
        </Suspense>
    );
}
