# High By The Beach

A custom Shopify storefront built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4. No third-party Shopify SDK — uses the Storefront API directly via a lightweight GraphQL fetch wrapper.

## Features

- Product listing, collection pages, and individual product pages with image gallery and variant selection
- Shopping cart (slide-out drawer, add/remove/update via Server Actions)
- Checkout flow with order confirmation page
- Wishlist (client-side, persisted in localStorage)
- Search with two modes:
  - **Simple** — keyword search via Shopify Storefront API
  - **AI** — natural language search powered by Claude (extracts filters like product type, price range, and tags from plain English; price adjectives like "cheap" or "luxury" are interpreted relative to the product category)
- Sidebar filters (product type, price range) and sort controls
- Mobile-responsive layout with hamburger menu and dark mode support

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Data**: Shopify Storefront API (GraphQL)
- **AI search**: Anthropic Claude API (claude-haiku-4-5)

## Getting Started

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Copy the env file and fill in your Shopify credentials:

```bash
cp .env.example .env.local
```

```
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
ANTHROPIC_API_KEY=your-anthropic-api-key   # only needed for AI search
```

3. Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/                   # Next.js App Router pages
  actions/             # Server Actions (cart, search, checkout)
  checkout/            # Checkout and order confirmation pages
  collections/         # Collection pages
  products/[handle]/   # Product detail page
  search/              # Search page
  wishlist/            # Wishlist page
components/            # UI components
  cart/                # Cart drawer
  collection/          # Filter sidebar and collection layout
  header/              # Nav, mobile menu, cart/wishlist buttons
  product/             # Product card, image, wishlist button
  search/              # Search input and mode toggle
lib/shopify/           # Shopify Storefront API client and queries
context/               # Cart and Wishlist React context providers
```