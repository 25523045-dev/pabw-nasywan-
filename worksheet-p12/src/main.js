// src/main.js — titik masuk. Satu-satunya tempat berkas CSS diimpor.
import { createApp } from 'vue'
import App from './App.vue'

// gaya asli P04-P06, isinya tidak diubah dan urutannya tetap
import './tokens.css'
import './base.css'
import './layout.css'
import './komponen.css'
import './tema.css'
import './responsif.css'

createApp(App).mount('#app')
