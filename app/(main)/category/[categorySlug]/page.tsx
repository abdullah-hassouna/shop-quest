'use client';

import React, { useState, useEffect } from 'react';
import SearchPage from '@/components/pages/SearchPage';

interface CategoryPageProps {
    params: Promise<{ categorySlug: string }>;
}

export default function CategoryPage({ params: paramsPromise }: CategoryPageProps) {
    const [categorySlug, setCategorySlug] = useState<string | undefined>();

    useEffect(() => {
        const unwrapParams = async () => {
            const { categorySlug } = await paramsPromise;
            setCategorySlug(categorySlug);
        };
        unwrapParams();
    }, [paramsPromise]);


    return (
        <SearchPage categorySlug={categorySlug} />
    );
}
