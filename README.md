# ÁTILA — Portfólio interativo

Site estático, sem framework e sem build. Abre em qualquer hospedagem (Netlify, Vercel, GitHub Pages, Cloudflare Pages) e também direto do arquivo no celular/PC.

**No ar:** https://pinkfeelingsllc-glitch.github.io/atila-page/ (GitHub Pages, branch `main`).

**Filosofia:** show the work, not the explanation. Seis categorias, até três trabalhos cada, vídeo em tela cheia com um toque.

---

## Estrutura

```
atila-portfolio/
├── index.html            ← página (não precisa mexer)
├── css/style.css         ← visual
├── js/app.js             ← navegação, visualizador, idioma, modo apresentação
├── data/projects.js      ← ★ ÚNICO ARQUIVO QUE VOCÊ EDITA (perfil + projetos)
├── assets/
│   ├── profile/          ← foto do Átila (ex.: atila.jpg)
│   ├── covers/           ← capas dos projetos (JPG/WebP)
│   ├── videos/           ← vídeos MP4
│   ├── icon.svg          ← favicon
│   └── apple-touch-icon.png
├── MATERIAIS-PENDENTES.md ← só local (fora do git): anotações e o que falta
├── CLAUDE.md             ← só local (fora do git): contexto para o Claude Code
└── README.md
```

---

## Como trocar o conteúdo

Tudo fica em `data/projects.js`. **Ele é público** (está no GitHub e o site carrega o arquivo inteiro): não escreva anotações internas nele. O que falta pedir, links de referência e trabalhos ainda não confirmados ficam em `MATERIAIS-PENDENTES.md`, que é só local. Cada projeto é um bloco assim:

```js
{
  "id": "music-01",
  "category": "music",          // music | ai | business | social | events | politics
  "name": "Nome do projeto",    // nome que aparece na capa
  "type": "video",              // video (MP4) | image | embed (YouTube/Vimeo)
  "media": "assets/videos/projeto.mp4",
  "cover": "assets/covers/projeto.jpg",
  "aspect": "9:16",             // 9:16 | 1:1 | 16:9 | 4:3 | 4:5
  "order": 1,                   // posição dentro da categoria (1, 2, 3)
  "published": true,            // false = vira espaço "Em breve", sem nome
  "credit": "confirmed"         // pending = a confirmar (escondido com showPendingCredits: false)
}
```

### Receitas rápidas

| Quero… | Faço… |
|---|---|
| Colocar um vídeo MP4 | Copio o arquivo para `assets/videos/`, defino `"type": "video"` e `"media": "assets/videos/nome.mp4"` |
| Colocar um vídeo do YouTube ou Vimeo | `"type": "embed"` e `"media": "https://www.youtube.com/watch?v=..."` (ou link do Vimeo) |
| Testar com um reel do Instagram (provisório) | `"type": "embed"` e `"media": "https://www.instagram.com/reel/..."` — funciona em hospedagem real, mas é pesado e mostra a moldura do Instagram; use só até ter o MP4 |
| Colocar só uma imagem | `"type": "image"`, `"media": "assets/covers/nome-grande.jpg"` (abre ampliada) |
| Trocar a capa | `"cover": "assets/covers/nome.jpg"` — a capa é o que aparece na lista; o vídeo só carrega ao tocar |
| Esconder um projeto sem apagar | `"published": false` (some da tela; com `settings.showEmptySlots: true` vira um card "Em breve" sem nome) |
| Nome em dois idiomas | `"name": { "en": "Dental clinic", "pt": "Clínica odontológica" }` (texto simples também vale) |
| Publicar um trabalho que o Átila confirmou | copio o bloco dele do anexo de `MATERIAIS-PENDENTES.md` (arquivo local) para `projects`, com `"credit": "confirmed"` |
| Esconder TODOS os trabalhos ainda não confirmados de uma vez | em `settings`: `"showPendingCredits": false` (ligado desde 31/10). Eles somem do site (com `showEmptySlots: true` viram cards "Em breve" sem nome, que não abrem), e categoria sem nenhum trabalho visível sai das abas |
| Mudar a ordem | troco o `"order"` (1, 2, 3) |
| Trocar a foto do Átila | salvo em `assets/profile/atila.jpg` e preencho `"photo": "assets/profile/atila.jpg"` |
| Cidade abaixo do subtítulo | `profile.location` (hoje "Brasília, Brazil"; vazio = some) |
| Linha "Artists" no topo | `profile.artists` (lista de nomes; só artistas com trabalho confirmado; vazia = some) |
| Imagem da prévia do link (WhatsApp/iMessage) | `assets/og-image.jpg` (1200×630, JPG até ~300 KB) |
| Categoria aberta por padrão | `settings.defaultCategory` (hoje: `"music"`). Se ela não tiver nada visível, abre a primeira aba que tiver |
| Idioma padrão | `settings.defaultLang`: `"en"` (hoje — versão para apresentar nos EUA), `"pt"` ou `"auto"` (segue o celular). O botão EN/PT continua funcionando e a escolha fica salva |
| Ordem das abas | é a ordem da lista `categories` — hoje por força de apresentação: Music, AI & VFX, Business, Social Media, Events, Politics |
| Criar uma categoria nova | adiciono em `categories` (id + label en/pt) e uso o mesmo id nos projetos |

Links diretos por categoria: `site.com/#music`, `#politics`, `#events`, `#business`, `#social`.

### Formatos recomendados (pra continuar rápido no 4G)

- **Vídeo:** MP4 (H.264 + AAC), vertical 1080×1920 ou horizontal 1920×1080, 15–30 s, até ~10–15 MB. Áudio começa mudo (regra dos navegadores); o botão "Som" liga.
- **Capa:** JPG ou WebP, 1080 px no lado maior, até ~300 KB. Sem a capa o card vira placeholder.
- **Proporção:** `aspect` deve bater com o arquivo. Nada é distorcido — o card recorta a capa (cover) e o visualizador mostra o vídeo inteiro (contain).

---

## Testar

**No PC (PowerShell, dentro da pasta):**

```powershell
python -m http.server 8080
```

Abra `http://localhost:8080`. (Ou simplesmente dê dois cliques em `index.html` — também funciona, inclusive vídeos locais.)

**No celular:** publique (abaixo) e abra o link. No iPhone, Compartilhar → "Adicionar à Tela de Início" — abre em tela cheia, como app.

---

## Publicar

Publicado no **GitHub Pages** do repositório `pinkfeelingsllc-glitch/atila-page` (branch `main`, raiz):
https://pinkfeelingsllc-glitch.github.io/atila-page/

Para atualizar um trabalho: troca o arquivo em `assets/` + ajusta `data/projects.js` + commit + push na `main`. O site republica sozinho em cerca de 1 minuto. Nada mais.

- Esta versão tem `<meta name="robots" content="noindex">` no `index.html`: abre normalmente pelo link, mas fica fora do Google enquanto houver créditos a confirmar. Tire a linha quando ela substituir a página do Lovable.
- As tags Open Graph (prévia do link no WhatsApp/iMessage) usam a URL acima. Se mudar de domínio, atualize `og:url` e `og:image`.

Qualquer outra hospedagem estática também serve (Netlify Drop, Vercel, Cloudflare Pages): é só subir a pasta e apontar para a raiz.

**Não substitua a página do Lovable (atilabrandsen.lovable.app) antes de validar a nova no celular.** Mantenha a antiga até a nova estar aprovada; depois aponte o domínio.

---

## O que a página faz

- Cabeçalho: ÁTILA · Creative Direction • Design • Advertising · foto · Instagram · Behance · EN/PT.
- Categorias fixas no topo (sticky) — troca instantânea, sem recarregar. No celular, **deslizar o dedo para o lado em cima dos trabalhos** também troca de categoria.
- Projetos sem mídia aparecem como capa tipográfica (número, nome, tom quente) — nunca um buraco preto. Capas reais mostram um brilho de carregamento até aparecer.
- Três trabalhos por categoria, em cards grandes que respeitam a proporção original.
- Toque → vídeo/imagem em tela cheia. Som liga/desliga. ← → ou swipe lateral para o próximo trabalho da categoria. Swipe para baixo, ✕, Esc ou o botão "voltar" do celular fecha.
- Nenhum vídeo é baixado antes do toque (só a capa). Capas carregam sob demanda.
- Abre em inglês (`settings.defaultLang`; com `"auto"` segue o idioma do celular), com troca manual EN/PT que fica salva.
- **Modo apresentação** ("Apresentar"): some o cabeçalho, sobra uma barra fina com as categorias e os trabalhos ocupam quase a tela toda. "Sair" volta ao normal.
- Funciona sem backend, sem banco, sem login, sem serviço pago.

---

## Decisões de design

- Uma única família tipográfica (Archivo, variável). A **largura** da fonte faz a marca: o nome e a categoria ativa aparecem expandidos; o resto, normal.
- Preto puro (#000) como palco — bom em OLED e no escuro de festa. Por cima, **um único gradiente noturno** (âmbar → coral → rosa) só onde o olho deve pousar: o nome, a categoria ativa, o botão de play e um brilho suave atrás do cabeçalho. Os trabalhos ficam nas próprias cores. Para trocar a paleta: `--acc-1`, `--acc-2`, `--acc-3` no topo do `css/style.css`.
- Zero texto explicativo. Sem biografia, blog, preços, formulários.
