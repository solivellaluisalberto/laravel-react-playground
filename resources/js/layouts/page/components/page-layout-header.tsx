import AppearanceToggleTab from '@/components/appearance-tabs';
import { LocaleSwitcherSimple } from '@/components/locale-switcher';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function PageLayoutHeader({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslation();

    return (
        <header className="mb-6 w-full text-sm not-has-[nav]:hidden">
            <nav className="flex items-center justify-between gap-4">
                <LocaleSwitcherSimple />
                <AppearanceToggleTab />
                <div className="flex items-center gap-4">
                    {auth.user ? (
                        <Link
                            href={dashboard()}
                            className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                        >
                            {t('Dashboard')}
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={login()}
                                className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                            >
                                {t('Log in')}
                            </Link>
                            {canRegister && (
                                <Link
                                    href={register()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    {t('Register')}
                                </Link>
                            )}
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}
