import { setTitle, setLandingTitle } from './meta'

export const pagesRoutes = [
    {
        path: '/',
        name: 'pages.landing',
        meta: {
            title: setLandingTitle('Home'),
            description:
                'Shop and pay on the Kkoo buyers app. Run catalog, orders, delivery, and payouts on the Kkoo admin site. Escrow, tracking, rewards—one KKOO ecosystem for shoppers and teams.',
        },
        component: () => import('@/views/marketing/Landing.vue'),
    },
    {
        path: '/app',
        name: 'pages.app-homepage',
        meta: {
            title: setLandingTitle('App & data'),
            description:
                'What the Kkoo apps do for you—marketplace, food, groceries, rides, and business tools—and why we ask for data. Read our privacy policy. No sign-in required.',
        },
        component: () => import('@/views/marketing/AppHomepage.vue'),
    },
    {
        path: '/personal',
        name: 'pages.personal',
        meta: {
            title: setLandingTitle('For You'),
            description:
                'Shop, order food and groceries, book rides with Kkoo. Pay with escrow and insured delivery. Track orders and earn rewards. Share your link and earn when friends buy.',
        },
        component: () => import('@/views/marketing/Personal.vue'),
    },
    {
        path: '/business',
        name: 'pages.business',
        meta: {
            title: setLandingTitle('For Business'),
            description:
                'Sell on KKOO: list products, take orders, request delivery, get paid on schedule. Marketplace, restaurant, or grocery. Optional CRM: customers, invoices, deni, stock, suppliers.',
        },
        component: () => import('@/views/marketing/Business.vue'),
    },
    {
        path: '/merchant',
        name: 'pages.merchant',
        meta: {
            title: setLandingTitle('For Merchants'),
            description:
                "Grow with KKOO: sell food, groceries, and retail with menus, storefronts, delivery, and payouts built for busy shops and repeat customers.",
        },
        component: () => import('@/views/marketing/Merchant.vue'),
    },
    {
        path: '/restaurants',
        name: 'pages.restaurants',
        meta: {
            title: setLandingTitle('Restaurants'),
            description:
                'Browse restaurant menus and storefronts on Kkoo. Order for delivery or pickup where available.',
        },
        component: () => import('@/views/marketing/Restaurants.vue'),
    },
    {
        path: '/hotels',
        name: 'pages.hotels',
        meta: {
            title: setLandingTitle('Hotels'),
            description:
                'Discover hotels and stays on Kkoo. View rooms and offers and book where available.',
        },
        component: () => import('@/views/marketing/Hotels.vue'),
    },
    {
        path: '/vouchers',
        name: 'pages.vouchers',
        meta: {
            title: setLandingTitle('Gift Vouchers'),
            description: 'Send and receive KKOO gift vouchers. Set the amount, share instantly, redeem at checkout across the marketplace, food, and grocery categories.',
        },
        component: () => import('@/views/marketing/GiftVouchers.vue'),
    },
    {
        path: '/share-earn',
        name: 'pages.share-earn',
        meta: {
            title: setLandingTitle('Share & Earn'),
            description: 'Earn with KKOO by sharing. Refer friends, share product links, and collect loyalty points on every payment.',
        },
        component: () => import('@/views/marketing/ShareEarn.vue'),
    },
    {
        path: '/courier',
        name: 'pages.courier',
        meta: {
            title: setLandingTitle('For Couriers'),
            description:
                "Learn about delivery and courier work with KKOO. Day-to-day jobs run in the rider app; this page explains how it fits together.",
        },
        component: () => import('@/views/marketing/Courier.vue'),
    },
    {
        path: '/community',
        name: 'pages.community',
        meta: {
            title: setLandingTitle('Community'),
            description:
                "Ask questions, share feedback, and request features. The KKOO community board is where we listen and ship with you.",
        },
        component: () => import('@/views/marketing/Community.vue'),
    },
    {
        path: '/discover',
        name: 'pages.discover',
        meta: {
            title: setLandingTitle('Discover'),
            description:
                'See what is happening on KKOO — concerts, summits, food festivals, and more. Browse ticket classes with benefits and buy tickets on the web.',
        },
        component: () => import('@/views/marketing/Discover.vue'),
    },
    {
        path: '/careers',
        name: 'pages.careers',
        meta: {
            title: setLandingTitle('Careers'),
            description:
                'Join the KKOO team. Browse open roles across engineering, operations, growth, and support — apply with your resume online.',
        },
        component: () => import('@/views/marketing/Careers.vue'),
    },
    {
        path: '/partners/register',
        name: 'pages.partner-register',
        meta: {
            title: setLandingTitle('Partner API'),
            description:
                'Apply for KKOO Partner API access. B2B API keys for hotels, events, menus, discovery, and careers data in your application.',
        },
        component: () => import('@/views/marketing/PartnerRegister.vue'),
    },
    {
        path: '/terms-of-use',
        name: 'pages.terms',
        meta: {
            title: setLandingTitle('Terms of Use'),
            description: "KKOO Terms of Use. By using our apps and services you agree to these terms."
        },
        component: () => import('@/views/marketing/TermsOfUse.vue'),
    },
    {
        path: '/privacy-policy',
        name: 'pages.privacy',
        meta: {
            title: setLandingTitle('Privacy Policy'),
            description: "KKOO Privacy Policy. How we collect, use, and protect your information."
        },
        component: () => import('@/views/marketing/PrivacyPolicy.vue'),
    },
    {
        path: '/cookie-policy',
        name: 'pages.cookies',
        meta: {
            title: setLandingTitle('Cookie Policy'),
            description: 'KKOO Cookie Policy. How cookies and similar technologies are used.',
        },
        component: () => import('@/views/marketing/CookiePolicy.vue'),
    },
    {
        path: '/refund-policy',
        name: 'pages.refunds',
        meta: {
            title: setLandingTitle('Refund Policy'),
            description: 'KKOO Refund Policy. Eligibility and process for returns and refunds.',
        },
        component: () => import('@/views/marketing/RefundPolicy.vue'),
    },
    {
        path: '/acceptable-use',
        name: 'pages.acceptable-use',
        meta: {
            title: setLandingTitle('Acceptable Use'),
            description: 'KKOO Acceptable Use Policy. Rules for safe and lawful use of the platform.',
        },
        component: () => import('@/views/marketing/AcceptableUse.vue'),
    },
    {
        path: '/pages/starter',
        name: 'pages.welcome',
        meta: {
            title: setTitle('Welcome'),
        },
        component: () => import('@/views/pages/welcome.vue'),
    },
    {
        path: '/pages/faqs',
        name: 'pages.faqs',
        meta: {
            title: setTitle('FAQs'),
        },
        component: () => import('@/views/pages/faqs.vue'),
    },
    {
        path: '/pages/coming-soon',
        name: 'pages.coming-soon',
        meta: {
            title: setTitle('Coming Soon'),
        },
        component: () => import('@/views/pages/coming-soon.vue'),
    },
    {
        path: '/pages/timeline',
        name: 'pages.timeline',
        meta: {
            title: setTitle('Timeline'),
        },
        component: () => import('@/views/pages/timeline.vue'),
    },
    {
        path: '/pages/pricing',
        name: 'pages.pricing',
        meta: {
            title: setTitle('Pricing'),
        },
        component: () => import('@/views/pages/pricing.vue')
    },
    {
        path: '/pages/maintenance',
        name: 'pages.maintenance',
        meta: {
            title: setTitle('Maintenance'),
        },
        component: () => import('@/views/pages/maintenance.vue')
    },
];
