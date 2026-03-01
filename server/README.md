# Server Architecture Guide

This document explains how the `server/` code is structured, how requests flow through the system, and where to look when developing features or fixing bugs.

## Stack

- Node.js + Express
- Apollo Server (`/graphql`)
- MongoDB + Mongoose
- JWT auth
- EJS templates + Puppeteer PDF generation
- Nodemailer + SMS integration

## Runtime Architecture

### Startup flow

1. `server/server.js` loads env/config and creates Express + Apollo.
2. MongoDB connection is initialized in `server/config/connection.js`.
3. `projectStartUp()` runs filesystem bootstrap logic from `server/setup.config.js`.
4. GraphQL middleware is mounted at `/graphql` with auth context from `server/utils/auth.js`.
5. REST routes are mounted at `/api` from `server/controllers/API/index.js`.
6. In production, static client assets are served from `client/dist`.

### Request flow

#### GraphQL

- Entry: `server/server.js` -> `expressMiddleware(server, { context: authMiddleware })`
- Schema wiring: `server/schemas/index.js`
- Type system: `server/schemas/typeDefs.js`
- Resolver composition: `server/schemas/resolvers.js`
- Domain resolver files:
  - `resolvers.user.js`
  - `resolvers.provider.js`
  - `resolvers.customer.js`
  - `resolvers.service.js`
  - `resolvers.serviceAgreement.js`
  - `resolvers.product.js`

#### REST

- Entry: `server/controllers/API/index.js`
- Current focus: user login/link flows (`POST /api/users`, `PUT /api/users`)

## Folder Map

- `config/`: DB connection bootstrap
- `controllers/API/`: Express REST handlers
- `models/`: Mongoose schemas and model exports
- `schemas/`: GraphQL typeDefs + resolvers
- `utils/`: auth, mailer, sms, pdf, helper functions
- `templates/`: EJS templates for emails/agreements
- `seeders/`: seed/reset/cleanup scripts and seed data
- `customerData/agreements/`: generated output files (PDFs)

## Data Model Relationships

### Core entities

- `User` can reference one `roleAdmin`, one `roleProvider`, one `roleCustomer`.
- `Provider` references `user` and has `linkedCustomers`, `services`, `serviceAgreements`, `shifts`.
- `Customer` references `user` and has `serviceAgreements`.
- `Service` references one `provider` and one `product`.
- `ServiceAgreement` references `provider`, `customer`, `service`.
- `Shift` references `provider`, `customer`, `service`.

### Important lifecycle behavior

- `User` pre-save hook auto-creates `Customer` and `Provider` if missing.
- `ServiceAgreement` signing flow generates PDF and sends emails.
- `setup.config.js` ensures local directories exist for agreement artifacts.

## Developer Navigation (Common Tasks)

### Add or modify a GraphQL field

1. Update schema in `server/schemas/typeDefs.js`.
2. Wire resolver function in `server/schemas/resolvers.js`.
3. Implement resolver in corresponding domain file under `server/schemas/`.
4. If needed, update/extend Mongoose model in `server/models/`.

### Debug authentication/context issues

1. Start at `server/utils/auth.js` (token parsing + open operations).
2. Check token generation in `server/models/User.js` (`generateAuthToken`).
3. Validate token verification usage in `server/utils/helpers.js` and resolvers.

### Debug service agreement generation/signing

1. Resolver orchestration: `server/schemas/resolvers.serviceAgreement.js`.
2. HTML template rendering: `server/templates/renderTemplate.js`.
3. PDF generation: `server/utils/pdfUtility.js`.
4. Output directories: `server/setup.config.js`.
5. Email send path: `server/utils/mailer.js` and `User.sendEmail()`.

### Work with seed data

- Safe-ish incremental seeding: `server/seeders/seed.js`
- Full reset/drop + seed: `server/seeders/seedReset.js`
- Referential cleanup utility: `server/seeders/cleanupData.js`
- Source fixtures: `server/seeders/seedData.js`

## Environment Variables (Observed)

- `PORT`
- `MONGO_CONNECTION_STRING`
- `SECRET_KEY`
- `TOKEN_EXPIRES_IN`
- `SALT_WORK_FACTOR` (defined but currently not used in hashing)
- `HOST`
- `CLIENT_PORT`
- `EMAIL_HOST`
- `EMAIL_USER`
- `EMAIL_PASSWORD`
- `CLICK_SEND_URL_SEND_ENDPOINT`
- `CLICKTOKEN`
- `TESTING_AVOID_SMS`

## Inconsistencies and Risks to Address

### High priority

### Medium priority

3. `getServiceAgreements` does redundant and partially incorrect queries/populates.

   - File: `server/schemas/resolvers.serviceAgreement.js`
   - Notes: unused `allServiceAgreements`; populates `product` directly on agreement instead of via `service.product`.

4. `ServiceAgreement` pre-save hook mutates `agreementNumber` to `"expired"` via `setTimeout` and reads `this.service.price` without guaranteed population.

   - File: `server/models/ServiceAgreement.js`
   - Impact: persistence inconsistency, non-deterministic pricing.

5. Provider defaults include hardcoded ObjectIds in `linkedCustomers` and `services`.

   - File: `server/models/Provider.js`
   - Impact: environment-dependent invalid references.

6. `server/server.js` starts Express listener when DB opens, but Apollo init is async and not awaited before listen starts.
   - File: `server/server.js`
   - Impact: startup race risk.

### Low priority

1. Root `readme.md` contains unresolved merge conflict markers.

   - File: `readme.md`

2. Significant debug logging in production paths (`console.log` on tokens/data).

   - Files: auth/helpers/templates/resolvers.

3. `server/package.json` scripts are development-hostile:

   - `watch` uses `nodemon server.js && npm test` (test never runs while nodemon is alive)
   - `test` defaults to `jest --watch` (not CI-friendly)

4. `resolvers.serviceAgreement.test.js` imports resolver shape incorrectly and appears stale.
   - File: `server/schemas/resolvers.serviceAgreement.test.js`

## Suggested Cleanup Sequence

1. Fix schema/model contract mismatches (`Admin.users`, duplicate typeDefs, date field naming).
2. Stabilize auth and resolver runtime errors (`auth` header guard, import `GraphQLError`, mailer method call).
3. Refactor `ServiceAgreement` pre-save logic into deterministic computation + explicit expiry strategy.
4. Remove hardcoded ObjectId defaults and use seeders for reference data.
5. Make scripts/test flow CI-compatible.

## Quick Start Commands

From project root:

```bash
npm run install
npm run dev
```

Server-only:

```bash
cd server
npm run watch
```

Seed flows:

```bash
npm run seed
npm run seedReset
npm run cleanup
```
