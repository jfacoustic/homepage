# AGENTS.md

## Project Overview

**Framework**: React Router v7 with Cloudflare Workers  
**Philosophy**: Small web principles with edge-native performance  
**Bundle Budget**: <1MB total (including all assets)  
**Target**: Ultra-fast global deployment on Cloudflare's edge network

This is a modern React Router v7 application designed for edge deployment with small web principles. Performance and minimalism are prioritized while maintaining modern capabilities.

## Available Commands

```bash
# Development
pnpm run dev                    # Start dev server with HMR
pnpm run lint                   # Run Biome linter
pnpm run lint:fix               # Fix linting issues automatically
pnpm run format                 # Format code with Biome
pnpm run format:fix             # Format and fix code
pnpm run check                  # Run all Biome checks
pnpm run check:fix              # Fix all Biome issues
pnpm run typecheck              # Type checking + Cloudflare types

# Production
pnpm run build                  # Optimized production build
pnpm run deploy                 # Build + deploy to Cloudflare edge
pnpm run preview                # Preview production build locally

# Cloudflare
pnpm run cf-typegen             # Generate Cloudflare type definitions
```

**Note**: No test framework configured. Add testing commands when implementing tests.

## Small Web Development Standards

### Performance Budget
- **Bundle Size**: <1MB total (JavaScript, CSS, images, fonts)
- **JavaScript**: Minimize client-side execution
- **Dependencies**: Evaluate each addition against bundle budget
- **Assets**: Optimize images, use modern formats (WebP, AVIF)

### Dependency Policy
- **Minimal Dependencies**: Only essential libraries allowed
- **Bundle Impact**: Every new dependency requires size justification
- **Tree Shaking**: Ensure dependencies are properly tree-shakable
- **Alternatives First**: Consider native browser APIs before libraries

### Modern Browser Strategy
- **Target**: Modern browsers with ES2022+ support
- **No Polyfills**: Avoid legacy browser polyfills unless critical
- **Native Features**: Leverage modern CSS and JavaScript features
- **Graceful Degradation**: Provide basic fallbacks where essential

## Code Style Guidelines

### TypeScript Configuration
```json
{
  "strict": true,
  "verbatimModuleSyntax": true,
  "target": "ES2022",
  "jsx": "react-jsx"
}
```

### Import Patterns
```typescript
// Type imports - always use 'import type' for type-only imports
import type { Route } from "./+types/root";
import type { AppLoadContext } from "react-router";

// Code imports
import { Links, Meta, Outlet } from "react-router";
import { Welcome } from "../welcome/welcome";
```

### Component Patterns
```typescript
// Functional components with proper typing
export function ComponentName({ prop }: { prop: Type }) {
  return <div>{prop}</div>;
}

// Route handlers with typed arguments
export function loader({ context }: Route.LoaderArgs) {
  return { data: context.cloudflare.env.VALUE };
}

export function meta({}: Route.MetaArgs) {
  return [{ title: "Page Title" }];
}
```

### File Organization (React Router v7)
```
app/
├── root.tsx              # Root layout + error boundaries
├── routes/
│   ├── home.tsx         # Individual routes
│   └── about.tsx
├── components/           # Shared components
├── styles/              # CSS/styling
├── entry.server.tsx     # SSR entry point
└── routes.ts            # Route configuration
```

## Performance Optimization Guidelines

### Code Splitting Strategy
```typescript
// Lazy load non-critical routes
const AdminDashboard = lazy(() => import("./routes/admin"));

// Use Suspense with minimal fallback
<Suspense fallback={<LoadingSpinner />}>
  <Route path="/admin" element={<AdminDashboard />} />
</Suspense>
```

### Bundle Optimization
- **Route-based splitting**: Split at route level for optimal loading
- **Vendor chunks**: Keep vendor code separate for caching
- **Tree shaking**: Ensure all unused code is eliminated
- **CSS Purging**: Remove unused Tailwind classes in production

### Edge Performance
```typescript
// Leverage Cloudflare environment
export function loader({ context }: Route.LoaderArgs) {
  // Cache at edge for performance
  const data = await fetch(url, {
    cf: { cacheEverything: true }
  });
  return data.json();
}

// Optimize headers for edge caching
export function headers({ loaderHeaders }: Route.HeadersArgs) {
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control") || "public, max-age=3600"
  };
}
```

## Styling Guidelines (Tailwind CSS v4)

### Performance-First Styling
```typescript
// Use utility classes efficiently
<div className="flex items-center justify-center p-4">
  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
    Title
  </h1>
</div>
```

### CSS Optimization
- **Purge unused styles**: Configure Tailwind to remove unused utilities
- **Critical CSS**: Inline critical styles, lazy load non-critical
- **Dark mode**: Prefer `dark:` prefixes for theme switching
- **Responsive design**: Mobile-first responsive design pattern

## Error Handling & Resilience

### Route Error Boundaries
```typescript
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  // Handle different error types
  if (isRouteErrorResponse(error)) {
    return <ErrorMessage code={error.status} />;
  }
  
  // Development vs production error display
  if (import.meta.env.DEV && error instanceof Error) {
    return <ErrorDebug error={error} />;
  }
  
  return <GenericError />;
}
```

### Edge Error Handling
```typescript
// Handle Cloudflare Worker errors gracefully
export default {
  async fetch(request, env, ctx) {
    try {
      return requestHandler(request, { cloudflare: { env, ctx } });
    } catch (error) {
      return new Response("Service unavailable", { status: 503 });
    }
  }
};
```

## Development Workflow

### Performance Monitoring
```typescript
// Use React Profiler for critical components
<Profiler id="ComponentName" onRender={(id, phase, actualDuration) => {
  if (import.meta.env.DEV) {
    console.log(`${id} ${phase}: ${actualDuration}ms`);
  }
}}>
  <Component />
</Profiler>
```

### Bundle Analysis
- **Regular audits**: Analyze bundle size after significant changes
- **Dependency reviews**: Question each dependency's necessity
- **Performance budgets**: Monitor against <1MB target
- **Real device testing**: Test on actual devices, not just dev tools

## Cloudflare Workers Integration

### Environment Variables
```typescript
// Access Cloudflare environment
export function loader({ context }: Route.LoaderArgs) {
  return {
    apiEndpoint: context.cloudflare.env.API_ENDPOINT,
    secret: context.cloudflare.env.SECRET_KEY
  };
}
```

### Edge Caching Patterns
```typescript
// Cache API responses at edge
export async function loader() {
  const response = await fetch(`${API_URL}/data`, {
    cf: {
      cacheKey: "user-data",
      cacheTtl: 300, // 5 minutes
    }
  });
  
  return {
    data: await response.json(),
    cacheable: true
  };
}
```

## Security Considerations

### Edge Security
- **CORS headers**: Configure properly for edge deployment
- **Environment variables**: Never expose secrets to client
- **Input validation**: Validate all inputs at edge level
- **Rate limiting**: Implement at edge for global protection

### Small Web Security
- **Minimal attack surface**: Fewer dependencies = fewer vulnerabilities
- **Modern security**: Leverage modern browser security features
- **Content Security Policy**: Implement strict CSP headers
- **HTTPS only**: Enforce secure connections at edge

---

**Remember**: Every line of code should serve the small web philosophy. Question dependencies, optimize for edge performance, and maintain sub-1MB bundles. The goal is ultra-fast, lightweight web applications that respect user bandwidth and privacy.