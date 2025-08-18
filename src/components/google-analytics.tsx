
'use client';

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from "react"

export const GoogleAnalytics = () => {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const gaId = process.env.NEXT_PUBLIC_GA_ID

    useEffect(() => {
        if (gaId && window.gtag) {
            const url = pathname + searchParams.toString()
            window.gtag('config', gaId, {
                page_path: url,
            })
        }
    }, [pathname, searchParams, gaId])

    if (!gaId) {
        return null;
    }

    return (
        <>
            <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}/>
            <Script id="google-analytics" strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${gaId}', {
                    page_path: window.location.pathname,
                });
                `,
                }}
            />
        </>
    )
}
