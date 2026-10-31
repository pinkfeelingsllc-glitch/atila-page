/* =====================================================================
   ÁTILA — PORTFÓLIO INTERATIVO
   Este é o ÚNICO arquivo que você precisa editar para trocar conteúdo.

   É um objeto JSON (comentários são permitidos) dentro de um arquivo .js —
   assim funciona abrindo o site direto no celular/PC, sem servidor, e em
   qualquer hospedagem estática.

   ATENÇÃO: este arquivo é PÚBLICO (fica no GitHub e o site carrega ele
   inteiro). Só entra aqui o que pode aparecer no site. Anotações internas,
   links de referência e trabalhos ainda não confirmados ficam em
   MATERIAIS-PENDENTES.md, que é local e não vai para o GitHub.

   CAMPOS DE CADA PROJETO
   id         texto único (ex.: "music-01")
   category   "music" | "politics" | "events" | "business" | "social" | "ai"
              (os ids vêm da lista "categories" abaixo — pode criar ou apagar)
   name       nome do projeto/cliente (aparece na capa). Pode ser texto simples
              ou bilíngue: { "en": "Political project", "pt": "Projeto político" }
   type       "video" (arquivo MP4) | "image" (imagem) | "embed" (YouTube/Vimeo/Instagram)
   media      URL do MP4, da imagem grande ou do vídeo no YouTube/Vimeo/Instagram
              (pode ser caminho local: "assets/videos/projeto.mp4")
   cover      URL da imagem de capa (caminho local ou link)
   aspect     "9:16" (vertical) | "1:1" (quadrado) | "16:9" (horizontal) | "4:3" | "4:5"
   order      ordem dentro da categoria (1, 2, 3)
   published  true = aparece normal | false = fica escondido (ou vira "Em breve"
              sem nome, se settings.showEmptySlots for true)
   credit     "confirmed" = autoria confirmada | "pending" = a confirmar
              (escondido enquanto settings.showPendingCredits for false)
   ===================================================================== */
window.PORTFOLIO = {
  "profile": {
    "name": "ÁTILA",
    "tagline": "Creative Direction • Design • Advertising",
    "location": "Brasília, Brazil",
    "artists": ["Seu Jorge", "Papatinho", "Black Alien", "Haikaiss", "Kayblack", "Costa Gold"],
    "photo": "",
    "links": {
      "instagram": "https://www.instagram.com/atiladesigner",
      "behance": "https://www.behance.net/atilaodesigner",
      "email": "Atiladesigner@gmail.com"
    }
  },

  "settings": {
    "defaultCategory": "music",
    "defaultLang": "en",
    "showPendingCredits": false,
    "showEmptySlots": false
  },

  "categories": [
    { "id": "music",    "label": { "en": "Music",        "pt": "Música" } },
    { "id": "ai",       "label": { "en": "AI & VFX",     "pt": "IA & VFX" } },
    { "id": "business", "label": { "en": "Business",     "pt": "Empresas" } },
    { "id": "social",   "label": { "en": "Social Media", "pt": "Redes Sociais" } },
    { "id": "events",   "label": { "en": "Events",       "pt": "Eventos" } },
    { "id": "politics", "label": { "en": "Politics",     "pt": "Política" } }
  ],

  "projects": [

    /* ---------------- MUSIC ---------------- */
    {
      "id": "music-01",
      "category": "music",
      "name": { "en": "Papatinho, Seu Jorge & Black Alien", "pt": "Papatinho, Seu Jorge e Black Alien" },
      "type": "image",
      "media": "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200_webp/e36e98113970035.60329fe9f3f65.png",
      "cover": "https://mir-s3-cdn-cf.behance.net/project_modules/max_632_webp/e36e98113970035.60329fe9f3f65.png",
      "aspect": "1:1",
      "order": 1,
      "published": true,
      "credit": "confirmed"
    },
    {
      "id": "music-02",
      "category": "music",
      "name": { "en": "Haikaiss & Kawe", "pt": "Haikaiss e Kawe" },
      "type": "image",
      "media": "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200_webp/ee9a65113928355.6031821f29f5d.png",
      "cover": "https://mir-s3-cdn-cf.behance.net/project_modules/max_632_webp/ee9a65113928355.6031821f29f5d.png",
      "aspect": "1:1",
      "order": 2,
      "published": true,
      "credit": "confirmed"
    },
    {
      "id": "music-03",
      "category": "music",
      "name": { "en": "Kyan & Kayblack", "pt": "Kyan e Kayblack" },
      "type": "image",
      "media": "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/f30b60112977453.601eaab4a9c4c.png",
      "cover": "https://mir-s3-cdn-cf.behance.net/project_modules/max_632_webp/f30b60112977453.601eaab4a9c4c.png",
      "aspect": "1:1",
      "order": 3,
      "published": true,
      "credit": "confirmed"
    },

    /* ---------------- POLITICS ---------------- */
    {
      "id": "politics-01",
      "category": "politics",
      "name": { "en": "National PNAE Meeting — government brand", "pt": "Encontro Nacional do PNAE — marca de governo" },
      "type": "image",
      "media": "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200_webp/13f0e0219139011.67acdfc9f1cac.png",
      "cover": "https://mir-s3-cdn-cf.behance.net/projects/404/08261d219139011.Y3JvcCw4MDgsNjMyLDAsMA.png",
      "aspect": "4:3",
      "order": 1,
      "published": true,
      "credit": "confirmed"
    },
    {
      "id": "politics-02",
      "category": "politics",
      "name": { "en": "Political campaign 02", "pt": "Campanha política 02" },
      "type": "image",
      "media": "",
      "cover": "",
      "aspect": "4:5",
      "order": 2,
      "published": false,
      "credit": "pending"
    },
    {
      "id": "politics-03",
      "category": "politics",
      "name": { "en": "Political campaign 03", "pt": "Campanha política 03" },
      "type": "video",
      "media": "",
      "cover": "",
      "aspect": "9:16",
      "order": 3,
      "published": false,
      "credit": "pending"
    },

    /* ---------------- EVENTS ---------------- */
    {
      "id": "events-01",
      "category": "events",
      "name": "UPSY Fest — Trance Festival",
      "type": "image",
      "media": "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/b18c4b148768633.62db00e695c48.png",
      "cover": "https://mir-s3-cdn-cf.behance.net/projects/404/4650b1148768633.Y3JvcCwxMzgwLDEwODAsMjcwLDA.png",
      "aspect": "4:3",
      "order": 1,
      "published": true,
      "credit": "confirmed"
    },
    {
      "id": "events-02",
      "category": "events",
      "name": { "en": "Bora Produções — branding", "pt": "Bora Produções — branding" },
      "type": "image",
      "media": "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/3b6d0a150053017.62f2b99628387.png",
      "cover": "https://mir-s3-cdn-cf.behance.net/projects/404/5c5ae7150053017.Y3JvcCw4NzUsNjg0LDI3Myww.png",
      "aspect": "4:3",
      "order": 2,
      "published": true,
      "credit": "confirmed"
    },
    {
      "id": "events-03",
      "category": "events",
      "name": { "en": "Event 03", "pt": "Evento 03" },
      "type": "video",
      "media": "",
      "cover": "",
      "aspect": "9:16",
      "order": 3,
      "published": false,
      "credit": "pending"
    },

    /* ---------------- BUSINESS ---------------- */
    {
      "id": "business-01",
      "category": "business",
      "name": { "en": "Wolz Auto Care — automotive", "pt": "Wolz Auto Care — automotivo" },
      "type": "image",
      "media": "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/2bb3ff244447417.69977b35baf42.png",
      "cover": "https://mir-s3-cdn-cf.behance.net/projects/404/46e96a244447417.Y3JvcCw4MDgsNjMyLDAsMA.png",
      "aspect": "4:3",
      "order": 1,
      "published": true,
      "credit": "confirmed"
    },
    {
      "id": "business-02",
      "category": "business",
      "name": { "en": "Zuppani — dental clinic", "pt": "Zuppani Odontologia" },
      "type": "image",
      "media": "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200_webp/fc4a7a170225849.645a61b29ed75.png",
      "cover": "https://mir-s3-cdn-cf.behance.net/projects/404/221a83170225849.Y3JvcCwxMjU5LDk4NCwzMzAsNDY.png",
      "aspect": "4:3",
      "order": 2,
      "published": true,
      "credit": "confirmed"
    },
    {
      "id": "business-03",
      "category": "business",
      "name": { "en": "TekClean — rebranding", "pt": "TekClean — rebranding" },
      "type": "image",
      "media": "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/ee2224232821391.68a43a357b08b.png",
      "cover": "https://mir-s3-cdn-cf.behance.net/projects/404/1f3bd9232821391.Y3JvcCw4MDgsNjMyLDMwLDA.png",
      "aspect": "4:3",
      "order": 3,
      "published": true,
      "credit": "confirmed"
    },

    /* ---------------- SOCIAL MEDIA ---------------- */
    {
      "id": "social-01",
      "category": "social",
      "name": { "en": "Via Carioca — bar", "pt": "Via Carioca — bar" },
      "type": "image",
      "media": "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/d7d676149639241.62eae35e85afc.png",
      "cover": "https://mir-s3-cdn-cf.behance.net/projects/404/946ee8149639241.Y3JvcCwxMzgwLDEwODAsNTM2LDA.png",
      "aspect": "4:3",
      "order": 1,
      "published": true,
      "credit": "confirmed"
    },
    {
      "id": "social-02",
      "category": "social",
      "name": { "en": "Inovatec — tech", "pt": "Inovatec — tecnologia" },
      "type": "image",
      "media": "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/c08766115217931.604a15b9257de.png",
      "cover": "https://mir-s3-cdn-cf.behance.net/projects/404/a2a7b6115217931.Y3JvcCwxMzgwLDEwODAsNDkyLDA.png",
      "aspect": "4:3",
      "order": 2,
      "published": true,
      "credit": "confirmed"
    },
    {
      "id": "social-03",
      "category": "social",
      "name": { "en": "Kawe — artist Instagram", "pt": "Kawe — Instagram do artista" },
      "type": "image",
      "media": "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/524bf3114031271.6033d198c9c88.png",
      "cover": "https://mir-s3-cdn-cf.behance.net/projects/404/c9c862114031271.Y3JvcCw4MDgsNjMyLDAsMA.png",
      "aspect": "4:3",
      "order": 3,
      "published": true,
      "credit": "confirmed"
    }

    /* ---------------- AI & VFX (nenhum trabalho publicado ainda) ---------------- */
  ]
};
