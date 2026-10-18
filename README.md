# UPSCALE

A premium small-business workspace built with Next.js App Router, React, TypeScript, Tailwind CSS v4, and a shadcn/ui Button (Radix Slot + CVA). All studios are real navigable pages. Local mode works without API credentials and never simulates AI results, video generation, publishing, or deployment.

## Start locally

Requires Node.js 20.9+ (Node 24 recommended) and npm.

```sh
npm install
cp .env.example .env.local
npm run dev
```

Open the development server in your local browser. For restricted environments, use `npm install --cache /workspace/.npm-cache`. Leave environment values empty to use local mode. Do not commit `.env.local`.

```sh
npm run build
npm start
npm run lint
npm test
```

## Supabase setup

1. Create a Supabase project. Copy its project URL and **anon/publishable** key into `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. The anon key is intentionally browser-visible; never use a service-role key here.
2. Execute `supabase/migrations/202610180001_initial.sql` in the Supabase SQL editor once, or link the Supabase CLI and run `supabase db push`. This creates the business profile table, RLS policies, private `creative-assets` bucket, storage policies, and atomic AI quota function. No migration is automatically applied by the app.
3. Enable email/password authentication. Set Authentication → URL Configuration → Site URL and allowed Redirect URLs to your application origin (include your development origin). Keep email confirmation enabled; sign-up displays a confirmation message, and users can sign in after verification. Configure production SMTP before launch.
4. Restart the Next.js server after environment changes. Sign up at `/login`, confirm your email if requested, sign in, and save your profile in Settings. A successful cloud-save message confirms sync. Profile and storage reads are scoped to `auth.uid()`; no admin key is used.

Local mode stores business details, tasks, storyboards, website drafts, and social drafts in this browser's localStorage. Chat history is sessionStorage in this tab. These drafts are **not cloud-synced**. Avoid shared devices for sensitive details. Signing in loads the account's cloud profile when available; saving explicitly uploads the current profile. Signing out should be followed by clearing site data on shared devices. Generated images are stored privately in Supabase; library URLs expire after one hour (Refresh renews them).

## OpenAI setup

Set `OPENAI_API_KEY` **only on the server**. Never prefix it with `NEXT_PUBLIC_`. Optional server variables:

- `OPENAI_CHAT_MODEL=gpt-4.1-mini`
- `OPENAI_IMAGE_MODEL=gpt-image-1` (must support base64 image output and selected sizes)

Both AI routes validate a Supabase bearer token with the auth server. The coach retrieves the signed-in user's saved cloud business profile, rather than trusting a client-supplied profile. AI inputs are size-limited; quotas are enforced atomically in Postgres (40 chat requests and 5 images per account per hour), with an extra in-process burst guard. Quota is consumed on attempts, including failures. API charges apply; configure OpenAI project budget limits and monitor usage before allowing public registration. AI quota rows should be periodically pruned by an administrator for long-running deployments. Server-side outbound access is needed to the Supabase project hostname and `api.openai.com`.

Chat sends business context and the last ten messages to OpenAI. Images send the entered prompt, generate a PNG, and upload it under the user's ID in the private bucket. Review provider data policies before entering sensitive information. If upload fails, the UI provides the generated image for immediate download and reports the storage failure. AI failures return explicit errors; missing keys show setup instructions.

## Included workflows

| Page                  | Working now                                                                              | External dependency / limitation                             |
| --------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Landing               | Product overview and entry points                                                        | None                                                         |
| Auth                  | Email/password signup, login, confirmation state, sign-out in Settings                   | Supabase project/configuration                               |
| Onboarding / Settings | All requested business fields; brand color, typography, dark/light appearance            | Local by default; Supabase for account profile sync          |
| Dashboard             | Saved business summary/goals, task progress and editable tasks, studio links             | AI recommendations come from Coach; no invented analytics    |
| Business Coach        | Context-aware conversation, prompts, clear history                                       | Supabase login + migration + OpenAI                          |
| Creative Studio       | Prompt, asset types, canvas sizes, image download and private asset library              | Supabase login/storage + OpenAI image access                 |
| Video Studio          | Brief, format/duration, three editable storyboard scenes, version history                | Local planning only; external video generation not connected |
| Website Builder       | Three editable templates, responsive preview, local save, JSON export                    | No deployment, hosting or domain integration                 |
| Social Hub            | Disconnected account status, month navigation, content calendar, draft creation/deletion | No OAuth, scheduling worker, or publishing                   |

Website preview content is clearly marked as template content. Tasks and histories start empty; there are no fictitious metrics or generated media.

## Validation and deployment

Run build, lint and tests with the commands above. Tests cover input boundaries and business context filtering. A browser smoke test should cover local onboarding, task persistence, editing/saving a website, storyboard history, calendar drafts, and error states for unauthenticated AI. Credential-backed validation must also cover two users being unable to read each other's business rows or files, email confirmation/login, personalized coaching, and generated image upload/download. Those checks need your Supabase/OpenAI configuration and incur provider usage.

For deployment, run on a Next.js-compatible Node host. Configure environment values securely there and update Supabase auth URLs. This repository does not deploy anything automatically. Live video generation, website publishing, and social account publishing remain explicit future integrations. Local drafts and session history are device-scoped and survive neither browser data clearing nor device changes. The app has no payment/subscription integration.
