

import { getPageBySlug } from '@/lib/firestore-admin';
import { notFound } from 'next/navigation';

export const revalidate = 60; 

export default async function DynamicPage({ params }: { params: { slug: string } }) {
    const page = await getPageBySlug(params.slug);

    if (!page || !page.isPublished) {
        notFound();
    }

    return (
        <div className="container mx-auto max-w-4xl px-4 py-12 md:px-6">
            <article className="prose dark:prose-invert lg:prose-xl">
                <h1>{page.title}</h1>
                <div dangerouslySetInnerHTML={{ __html: page.content }} />
            </article>
        </div>
    );
}
