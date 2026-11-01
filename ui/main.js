import { createApp } from 'vue'
import { initUrlCleaner } from 'vue-url-cleaner'
import NanoUI, { initTheme } from '@gkucmierz/nano-ui'
import '@gkucmierz/nano-ui/style.css'
import App from './App.vue'

// Initialize synchronous dark/light theme state
initTheme()

// Strip tracking query parameters (fbclid, gclid, utm_*, etc.) while preserving studio deep-links
initUrlCleaner({
  allowedKeys: ['q', 'profile', 'lang']
})

const app = createApp(App)
app.use(NanoUI)
app.mount('#app')
