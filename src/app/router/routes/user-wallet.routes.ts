import { RouteRecordRaw } from 'vue-router'
import { DefaultLayout } from 'app/layouts'

export default [
    {
        name: 'wallet',
        component: () => import('pages/wallet/UserWallet.vue'),
        path: '/wallet',
        meta: {
            title: 'Wallet',
            layout: DefaultLayout,
            backButton: true,
        }
    }
] as RouteRecordRaw[]