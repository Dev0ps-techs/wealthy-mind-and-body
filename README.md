# Wealthy Mind and Body — website

**Elevate Your Mind. Empower Your Body. Awaken Your Soul.**

The redesigned website for [wealthymindandbody.com](https://wealthymindandbody.com): a fast static site with no WordPress, no plugins and nothing to log in to. It's hosted free on GitHub Pages.

## What's inside

| Page | Highlights |
|---|---|
| Home | Full-screen hero, the three pillars (Mind · Body · Soul) with 3D cards, Meet Letchance, featured programs, free resources, a live countdown to the daily 5:00 AM (Dubai) session with an add-to-calendar button, recent videos, a testimonials carousel, community membership and email capture |
| About | Video, mission, holistic approach, pillars and a photo gallery with a lightbox |
| Services | Services, wellness solutions, classes and schedule, what we offer, an interactive guided-breathing tool, benefits, children's yoga, features and YouTube channels |
| Booking | A validated booking form that sends the request by WhatsApp or email |
| Shop | A "coming soon" page with categories (Ebooks, Active Wear, Wellness, Digital), a product preview and a notify-me form |
| Blog | All posts, with search and type filters, sharing, previous/next and related posts |
| FAQ, Contact, Privacy | Accordion FAQ, contact cards with copy-to-clipboard and a contact form |

Every page also has scroll animations, a sticky header, an animated mobile menu, a WhatsApp button, SEO metadata, a sitemap and redirects from the old WordPress URLs.

## Editing content

All text lives in **`src/content.mjs`**, and all images live in `src/assets/img/`.

1. Edit the text in `src/content.mjs`.
2. Run the build:

   ```bash
   npm run build
   ```

3. Commit and push. GitHub Pages serves the `docs/` folder.

To preview the site locally, run `npm start` and open http://localhost:4173.

### Collecting emails automatically
Right now the sign-up forms open the visitor's email app, and booking can also go through WhatsApp. To collect sign-ups directly, create a free form at Formspree or Mailchimp and paste its URL into `FORM_ENDPOINT` in `src/assets/js/main.js`.

### Custom domain
To serve the site at wealthymindandbody.com, add the domain under **Settings → Pages** in GitHub, then rebuild with `BASE=/ npm run build` so the 404 page links work from the root of the domain.
