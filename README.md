# Allocate Client

Next.js App Router client organized for four core domains:

- Marketing landing pages (public)
- Authentication flows
- Dashboard/product area (authenticated)
- Shared utility/data layers

## Project Structure

```text
app/
	(marketing)/
		layout.tsx
		page.tsx                  # /
		pricing/
			page.tsx                # /pricing
	(auth)/
		layout.tsx
		sign-in/
			page.tsx                # /sign-in
		sign-up/
			page.tsx                # /sign-up
	(dashboard)/
		layout.tsx
		dashboard/
			page.tsx                # /dashboard
	globals.css
	layout.tsx

components/
	ui/                         # reusable primitives (buttons, inputs, modal)
	shared/                     # app-wide composed components
	marketing/                  # marketing-only presentational components
	auth/                       # auth UI components/forms
	dashboard/                  # dashboard widgets/layout pieces

features/
	marketing/                  # feature logic + hooks for marketing
	auth/                       # auth feature logic (session, forms, actions)
	dashboard/                  # dashboard feature logic (state, view models)

lib/
	constants/                  # routes, config constants, enums
	utils/                      # pure helper functions
	validators/                 # zod schemas and validation helpers
	services/                   # API clients and server action wrappers

data/
	access/                     # repository-style data fetch/write functions
	mappers/                    # API DTO -> UI model transforms
	mock/                       # mocked datasets for development/tests

hooks/                        # cross-feature reusable hooks
types/                        # shared types/interfaces
config/                       # runtime/app config modules
styles/                       # non-global style modules/tokens as needed
public/
```

## Architecture Rules

1. Keep route-specific UI in its domain (`components/auth`, `components/dashboard`, etc.).
2. Keep business logic in `features/*` and keep view components dumb where possible.
3. Use `data/access` for data reads/writes, and `data/mappers` for transform boundaries.
4. Keep `lib/utils` pure and framework-agnostic when possible.
5. Put shared contracts in `types` and avoid circular imports between features.

## Run

```bash
pnpm dev
```

Open http://localhost:3000.
