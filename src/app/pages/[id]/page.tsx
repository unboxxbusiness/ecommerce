

import { getPageById } from '@/lib/firestore';
import { notFound } from 'next/navigation';

export const revalidate = 60; // Revalidate at most every 60 seconds

export default async function DynamicPage({ params }: { params: { id: string } }) {
    const page = await getPageById(params.id);

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
