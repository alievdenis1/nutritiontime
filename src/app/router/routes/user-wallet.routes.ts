import { RouteRecordRaw } from 'vue-router'
import { MainLayout } from 'app/layouts'

export default [
    {
        name: 'wallet',
        component: () => import('pages/wallet/UserWallet.vue'),
        path: '/wallet',
        meta: {
            title: 'Wallet',
            layout: MainLayout
        }
    }
] as RouteRecordRaw[]