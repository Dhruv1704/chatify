import {defineConfig} from 'vite'
import react from "@vitejs/plugin-react-swc";
import eslint from 'vite-plugin-eslint'
import {VitePWA} from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
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
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                    {
                        src: 'icons/icon_x512-modified.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {
                        src: 'icons/icon_x384-modified.png',
                        sizes: '384x384',
                        type: 'image/png',
                    },
                    {
                        src: 'icons/icon_x192-modified.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'icons/icon_x128-modified.png',
                        sizes: '128x128',
                        type: 'image/png',
                    },
                    {
                        src: 'icons/icon_x96-modified.png',
                        sizes: '96x96',
                        type: 'image/png',
                    },
                    {
                        src: 'icons/icon_x72-modified.png',
                        sizes: '72x72',
                        type: 'image/png',
                    },
                    {
                        src: 'icons/icon_x48-modified.png',
                        sizes: '48x48',
                        type: 'image/png',
                    }
                ],
            }
        }),
        eslint({lintOnStart: true, failOnError: false})
    ],
    strict: true,
})
