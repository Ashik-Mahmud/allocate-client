import { auth } from "@/auth";
import createIntlMiddleware from "next-intl/middleware";

// ১. ল্যাঙ্গুয়েজ এবং পাবলিক পেজ কনফিগারেশন
const locales = ['en', 'bn'];
const publicPages = ['/', '/sign-in', '/sign-up', '/terms-conditions'];

const intlMiddleware = createIntlMiddleware({
    locales,
    defaultLocale: 'en',
    localePrefix: 'as-needed'
});

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;


    if (
        nextUrl.pathname.startsWith('/_next') ||
        nextUrl.pathname.startsWith('/api') ||
        nextUrl.pathname.includes('.')
    ) {
        return;
    }


    const pathParts = nextUrl.pathname.split('/');
    const currentLocale = locales.includes(pathParts[1]) ? pathParts[1] : 'en';


    const pathnameWithoutLocale = nextUrl.pathname.replace(`/${currentLocale}`, '') || '/';


    const isPublicPage = publicPages.includes(pathnameWithoutLocale);


    const isProtectedRoute =
        pathnameWithoutLocale.startsWith('/dashboard')

    if (!isLoggedIn && isProtectedRoute) {
        const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
        return Response.redirect(
            new URL(`/${currentLocale}/sign-in?callbackUrl=${callbackUrl}`, nextUrl)
        );
    }


    if (isLoggedIn && (pathnameWithoutLocale === '/sign-in' || pathnameWithoutLocale === '/sign-up')) {
        return Response.redirect(new URL(`/${currentLocale}/dashboard`, nextUrl));

    }
    return intlMiddleware(req);
});

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};