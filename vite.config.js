import {defineConfig} from 'vite'
import react from "@vitejs/plugin-react-swc";
import eslint from 'vite-plugin-eslint'
import {VitePWA} from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
    server:{
        https:{
            key: './chatify-privateKey.key',
            cert:'./chatify.crt'
        }
    },
    plugins: [
        react(),
        VitePWA({
            workbox: {
                maximumFileSizeToCacheInBytes: 10*1024*1024,
            },
            includeAssets: ['favicon.ico', 'robots.txt', 'icons', 'manifest.webmanifes'],
            manifest:{
                name: 'Chatify',
                short_name: 'Chatify',
                theme_color: '#ffffff',
                background_color: '#ffffff',
                display: "standalone",
                scope: "/",
                start_url: "/",
                icons: [
                    {
                        src: 'icons/maskable_icon_x512.png',
                        sizes: '550x550',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                    {
                        src: 'icons/icon_x512-modified.png',
                        sizes: '409x409',
                        type: 'image/png',
                    },
                    {
                        src: 'icons/icon_x384-modified.png',
                        sizes: '307x307',
                        type: 'image/png',
                    },
                    {
                        src: 'icons/icon_x192-modified.png',
                        sizes: '153x153',
                        type: 'image/png',
                    },
                    {
                        src: 'icons/icon_x128-modified.png',
                        sizes: '102x102',
                        type: 'image/png',
                    },
                    {
                        src: 'icons/icon_x96-modified.png',
                        sizes: '76x76',
                        type: 'image/png',
                    },
                    {
                        src: 'icons/icon_x72-modified.png',
                        sizes: '57x57',
                        type: 'image/png',
                    },
                    {
                        src: 'icons/icon_x48-modified.png',
                        sizes: '38x38',
                        type: 'image/png',
                    }
                ]
            }
        }),
        eslint({lintOnStart: true, failOnError: false}),
    ]
})
