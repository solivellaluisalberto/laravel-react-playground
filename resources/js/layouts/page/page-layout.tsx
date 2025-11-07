import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import PageLayoutHeader from './components/page-layout-header';

export default function PageLayout({
    children,
    title,
}: PropsWithChildren<{
    title?: string;
}>) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title={title}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <PageLayoutHeader />

                <main className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    {children}
                </main>
            </div>
        </>
    );
}
