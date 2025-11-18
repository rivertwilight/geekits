# App Router Migration Guide

This document outlines the migration from Next.js Pages Router to App Router for the Geekits project.

## Migration Overview

The migration from Pages Router to App Router has been completed with the following key changes:

### What Changed

1. **New Directory Structure**: Created `src/app/` directory alongside existing `src/pages/`
2. **Removed i18n Config**: App Router doesn't support the built-in `i18n` config - internationalization is now handled via middleware or client-side
3. **File Conventions**: Updated to use App Router conventions:
   - `layout.tsx` - Root layout with metadata
   - `page.tsx` - Server components for pages
   - `page-client.tsx` - Client components (marked with `"use client"`)
   - `route.ts` - API route handlers

### Directory Structure

```
src/
├── app/                         # New App Router structure
│   ├── layout.tsx              # Root layout with metadata
│   ├── layout-client.tsx       # Client-side layout wrapper
│   ├── globals.css             # Global styles (from App.css)
│   ├── page.tsx                # Home page (server component)
│   ├── page-client.tsx         # Home page (client component)
│   ├── settings/
│   │   ├── page.tsx           # Settings page (server)
│   │   └── page-client.tsx    # Settings page (client)
│   ├── app/
│   │   └── [id]/
│   │       ├── page.tsx       # Dynamic app routes (server)
│   │       └── page-client.tsx # Dynamic app routes (client)
│   └── api/
│       └── feedback/
│           └── route.ts       # API route handler
├── pages/                      # Old Pages Router (to be removed)
│   ├── _app.tsx
│   ├── _document.js
│   ├── index.tsx
│   └── ...
```

## Key Migration Patterns

### 1. Root Layout (`src/app/layout.tsx`)

**Before** (`src/pages/_app.tsx` + `src/pages/_document.js`):
```tsx
// _app.tsx
export default function App({ Component, pageProps }) {
  return (
    <ColorModeProvider>
      <LocaleProvider>
        <Component {...pageProps} />
      </LocaleProvider>
    </ColorModeProvider>
  );
}

// _document.js
export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>...</Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
```

**After** (`src/app/layout.tsx` + `src/app/layout-client.tsx`):
```tsx
// layout.tsx (Server Component)
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: { default: "Geekits", template: "%s - Geekits" },
    // ... metadata
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>...</head>
      <body>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}

// layout-client.tsx (Client Component)
"use client";
export default function RootLayoutClient({ children }) {
  return (
    <ColorModeProvider>
      <LocaleProvider>
        {children}
      </LocaleProvider>
    </ColorModeProvider>
  );
}
```

### 2. Pages with getStaticProps

**Before** (`src/pages/index.tsx`):
```tsx
export async function getStaticProps({ locale }) {
  const appData = getAllApps(true, locale);
  return {
    props: {
      appData,
      locale,
    },
  };
}

export default function Index({ appData }) {
  return <div>...</div>;
}
```

**After** (`src/app/page.tsx` + `src/app/page-client.tsx`):
```tsx
// page.tsx (Server Component)
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Home",
    description: "...",
  };
}

export default async function HomePage() {
  const appData = getAllApps(true, locale);

  return (
    <HomePageClient
      appData={appData}
      locale={locale}
    />
  );
}

// page-client.tsx (Client Component)
"use client";
export default function HomePageClient({ appData, locale }) {
  return <div>...</div>;
}
```

### 3. Dynamic Routes with getStaticPaths

**Before** (`src/pages/app/[id].tsx`):
```tsx
export async function getStaticPaths() {
  const paths = getPaths();
  return {
    paths,
    fallback: false,
  };
}

export const getStaticProps = ({ params, locale }) => {
  const { id } = params;
  const appConfig = getAppConfig(id, { locale });
  return {
    props: { appConfig },
  };
};

export default function AppContainer({ appConfig }) {
  return <div>...</div>;
}
```

**After** (`src/app/app/[id]/page.tsx`):
```tsx
// page.tsx (Server Component)
export async function generateStaticParams() {
  return getPaths().map((path) => ({
    id: path.params.id,
  }));
}

export async function generateMetadata({ params }) {
  const appConfig = getAppConfig(params.id);
  return {
    title: appConfig.name,
    description: appConfig.description,
  };
}

export default async function AppPage({ params }) {
  const appConfig = getAppConfig(params.id);

  return (
    <AppContainerClient appConfig={appConfig} />
  );
}
```

### 4. API Routes

**Before** (`src/pages/api/feedback.ts`):
```tsx
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const feedbackData = req.body;

  try {
    // Process feedback
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(400).json({ error });
  }
};
```

**After** (`src/app/api/feedback/route.ts`):
```tsx
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      // ... CORS headers
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Process feedback
    return NextResponse.json(
      { message: "Success" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
```

## Remaining Migration Tasks

The following items still need to be migrated from `src/pages/` to `src/app/`:

### Pages to Migrate
- [ ] `/terms` - Terms of service page
- [ ] `/404` - Custom 404 error page
- [ ] `/500` - Custom 500 error page
- [ ] `/feedback` - Feedback page
- [ ] `/changelog` - Changelog page
- [ ] `/donate` - Donate page
- [ ] `/_micro/Cropper` - Micro app for cropping

### API Routes to Migrate
- [ ] `/api/create-payment-intent` - Payment processing
- [ ] `/api/stock` - Stock data API
- [ ] `/api/ai/tts` - Text-to-speech API
- [ ] `/api/apps/webpage-cliper` - Webpage clipper API
- [ ] `/api/apps/openai` - OpenAI integration API
- [ ] `/api/apps/cem` - CEM app API
- [ ] `/api/sendToTelegram` - Telegram integration
- [ ] `/api/icon` - Icon generation API

## Migration Steps for Each Page

For each remaining page, follow these steps:

1. **Create the directory structure**:
   ```bash
   mkdir -p src/app/[page-name]
   ```

2. **Create `page.tsx` (Server Component)**:
   - Move data fetching from `getStaticProps` to the component body
   - Add `generateMetadata` function for SEO
   - Pass data to client component

3. **Create `page-client.tsx` (Client Component)**:
   - Add `"use client"` directive at the top
   - Move all hooks, event handlers, and interactive logic here
   - Import and use the `Layout` component wrapper
   - Add the `Text` i18n wrapper and `GoogleAnalytics` component

4. **Test the page**:
   ```bash
   pnpm dev
   ```

## Migration Steps for Each API Route

For each remaining API route:

1. **Create the directory structure**:
   ```bash
   mkdir -p src/app/api/[route-name]
   ```

2. **Create `route.ts`**:
   - Export named functions: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`
   - Use `NextRequest` and `NextResponse` instead of `req`/`res`
   - Update CORS headers if needed
   - Use `request.json()` for body parsing

3. **Test the API route**:
   ```bash
   curl http://localhost:3000/api/[route-name]
   ```

## Important Considerations

### Internationalization (i18n)

The App Router doesn't support the built-in `i18n` config. For internationalization:

**Current approach**: Client-side locale management via:
- `LocaleProvider` context
- `Preferences` API (Capacitor) for storing locale preference
- Manual locale switching and reloading

**Future consideration**: Implement middleware-based i18n for better SEO:
```tsx
// middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const locale = getLocaleFromPath(pathname) || 'en-US';
  // ... locale handling
}
```

### Server vs Client Components

**Server Components** (default):
- Used for data fetching
- No hooks or event handlers
- Better performance
- Files: `layout.tsx`, `page.tsx`

**Client Components** (`"use client"`):
- Used for interactivity
- Can use hooks and event handlers
- Files: `layout-client.tsx`, `page-client.tsx`

### Metadata

App Router uses the `generateMetadata` function instead of `Head` component:

```tsx
// Instead of:
<Head>
  <title>My Page</title>
  <meta name="description" content="..." />
</Head>

// Use:
export async function generateMetadata() {
  return {
    title: "My Page",
    description: "...",
  };
}
```

### Data Fetching

- `getStaticProps` → Data fetching in Server Component body
- `getStaticPaths` → `generateStaticParams` function
- `getServerSideProps` → Data fetching in Server Component body (dynamic)

## Testing the Migration

1. **Start the dev server**:
   ```bash
   pnpm dev
   ```

2. **Test each migrated route**:
   - Home page: `http://localhost:3000/`
   - Settings: `http://localhost:3000/settings`
   - Dynamic app: `http://localhost:3000/app/[any-app-id]`
   - API: `http://localhost:3000/api/feedback`

3. **Build for production**:
   ```bash
   pnpm build
   ```

4. **Build for Capacitor**:
   ```bash
   CAPACITOR_BUILD=true pnpm build:cap
   ```

## Removing Pages Router

**Once all pages are migrated and tested**, remove the old Pages Router:

```bash
# Backup first
mv src/pages src/pages.backup

# Test thoroughly
pnpm build

# If everything works, delete the backup
rm -rf src/pages.backup
```

## Resources

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
