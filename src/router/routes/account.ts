import type { RouteLocationGeneric } from 'vue-router'
import { setTitle } from './meta'

const accountShell = { authRequired: true, buyerShell: true, buyerShoppingLayout: true }

export const accountRoutes = [
    {
        path: '/account',
        name: 'account.home',
        redirect: (to: RouteLocationGeneric) => ({ name: 'buyer.settings', query: to.query }),
    },
    {
        path: '/account/profile',
        name: 'account.profile',
        meta: {
            title: setTitle('Account Profile'),
            ...accountShell,
        },
        component: () => import('@/views/account/profile.vue'),
    },
    {
        path: '/account/notifications',
        name: 'account.notifications',
        meta: {
            title: setTitle('Notifications'),
            ...accountShell,
        },
        component: () => import('@/views/account/Notifications.vue'),
    },
    {
        path: '/account/backup-codes',
        name: 'account.backup-codes',
        meta: {
            title: setTitle('Backup codes'),
            ...accountShell,
        },
        component: () => import('@/views/account/BackupCodes.vue'),
    }
];
