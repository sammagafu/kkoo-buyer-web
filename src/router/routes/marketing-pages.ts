import { setTitle, setLandingTitle } from './meta'

export const pagesRoutes = [
    {
        path: '/',
        name: 'pages.landing',
        meta: {
            title: setLandingTitle('Home'),
            description:
                'KKOO — buy, sell, deliver, and earn in one trusted ecosystem. Marketplace, iShop POS, business tools, riders, referrals, and rewards for East Africa.',
        },
        component: () => import('@/views/marketing/LandingHousePage.vue'),
    },
    {
        path: '/landing-premium',
        name: 'pages.landing-premium',
        meta: {
            title: setLandingTitle('Premium'),
            description:
                'Shop and pay on the Kkoo buyers app. Run catalog, orders, delivery, and payouts on the Kkoo admin site.',
        },
        component: () => import('@/views/marketing/partials/LandingPremiumPage.vue'),
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
            title: setLandingTitle('Business tools'),
            description:
                'KKOO Business tools for shops already selling: seller dashboard, staff roles, CRM, stock, and day-to-day operations.',
        },
        component: () => import('@/views/marketing/Business.vue'),
    },
    {
        path: '/merchant',
        name: 'pages.merchant',
        meta: {
            title: setLandingTitle('Sell'),
            description:
                'Sell on KKOO: open a shop for food, groceries, or retail. List products, take orders, delivery, and clear payouts.',
        },
        component: () => import('@/views/marketing/Merchant.vue'),
    },
    {
        path: '/sell',
        redirect: { name: 'pages.merchant' },
    },
    {
        path: '/tools',
        redirect: { name: 'pages.business' },
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
        path: '/get-started',
        name: 'pages.get-started',
        meta: {
            title: setLandingTitle('Get started'),
            description: 'Tell KKOO how to reach you. We’ll help you shop, sell, or deliver.',
        },
        component: () => import('@/views/marketing/GetStarted.vue'),
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
        path: '/about',
        name: 'pages.about',
        meta: {
            title: setLandingTitle('About'),
            description: 'About KKOO — mission, product, and the company behind East Africa’s trusted commerce platform.',
        },
        component: () => import('@/views/marketing/About.vue'),
    },
    {
        path: '/safety',
        name: 'pages.safety',
        meta: {
            title: setLandingTitle('Safety'),
            description: 'KKOO safety information for buyers, riders, sellers, and escrow payments.',
        },
        component: () => import('@/views/marketing/Safety.vue'),
    },
    {
        path: '/coverage',
        name: 'pages.coverage',
        meta: {
            title: setLandingTitle('Coverage'),
            description: 'Where KKOO operates — live cities, expanding markets, and planned coverage across East Africa.',
        },
        component: () => import('@/views/marketing/Coverage.vue'),
    },
    {
        path: '/press',
        name: 'pages.press',
        meta: {
            title: setLandingTitle('Press & brand'),
            description: 'KKOO press contacts and brand assets for media and partners.',
        },
        component: () => import('@/views/marketing/Press.vue'),
    },
    {
        path: '/investors',
        name: 'pages.investors',
        meta: {
            title: setLandingTitle('Investors'),
            description: 'Investor information and contact for KKOO Technologies Limited.',
        },
        component: () => import('@/views/marketing/Investors.vue'),
    },
    {
        path: '/news',
        name: 'pages.news',
        meta: {
            title: setLandingTitle('News'),
            description: 'KKOO news and product updates.',
        },
        component: () => import('@/views/marketing/News.vue'),
    },
    {
        path: '/support',
        name: 'pages.support',
        meta: {
            title: setLandingTitle('Support'),
            description: 'KKOO support hub for buyers, sellers, riders, and restaurants.',
        },
        component: () => import('@/views/marketing/SupportHub.vue'),
    },
    {
        path: '/support/buyers',
        name: 'pages.support-buyers',
        meta: {
            title: setLandingTitle('Buyer support'),
            description: 'Help for shopping, orders, payments, and delivery on KKOO.',
        },
        component: () => import('@/views/marketing/SupportAudience.vue'),
    },
    {
        path: '/support/sellers',
        name: 'pages.support-sellers',
        meta: {
            title: setLandingTitle('Seller support'),
            description: 'Help for merchants: catalog, orders, payouts, and business tools.',
        },
        component: () => import('@/views/marketing/SupportAudience.vue'),
    },
    {
        path: '/support/riders',
        name: 'pages.support-riders',
        meta: {
            title: setLandingTitle('Rider support'),
            description: 'Help for KKOO riders and couriers: jobs, payouts, and safety.',
        },
        component: () => import('@/views/marketing/SupportAudience.vue'),
    },
    {
        path: '/support/restaurants',
        name: 'pages.support-restaurants',
        meta: {
            title: setLandingTitle('Restaurant support'),
            description: 'Help for restaurants on KKOO: menus, orders, and delivery.',
        },
        component: () => import('@/views/marketing/SupportAudience.vue'),
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
        path: '/data-deletion',
        name: 'pages.data-deletion',
        meta: {
            title: setLandingTitle('Data Deletion'),
            description:
                'How to request deletion of your KKOO account and personal data. Instructions for app users and Meta/Facebook-connected accounts.',
        },
        component: () => import('@/views/marketing/DataDeletion.vue'),
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
