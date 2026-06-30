# Decision Log

## D-001: Local-First Native OS

- **Status:** Accepted
- **Decision:** Build Native OS as a local-first browser workspace.
- **Rationale:** Solo builders need a private project-shaping tool without infrastructure overhead.
- **Consequence:** V1 stores data in `localStorage` and does not require login, backend, paid APIs, or cloud database.

## D-002: Fixed Agent Workflow

- **Status:** Accepted
- **Decision:** Use five fixed stages: Planner, Builder, Critic, Docs, and Review.
- **Rationale:** Fixed stages make readiness comparable across projects and simplify prompt generation.
- **Consequence:** Users can edit checklist state and notes, but stage identities remain stable.

## D-003: Deterministic GitHub Readiness Score

- **Status:** Accepted
- **Decision:** Score GitHub readiness from visible local factors with a 100-point rubric.
- **Rationale:** Deterministic scoring is testable and explainable.
- **Consequence:** The score must show factor details and cannot claim project success.

## D-004: GitHub and Deployment Separation

- **Status:** Accepted
- **Decision:** Treat GitHub as source control and CI, while Vercel, Cloudflare Pages, or Netlify are hosting targets.
- **Rationale:** Repository management and deployment are different responsibilities.
- **Consequence:** Documentation must not imply Vercel owns source control or user data.

## D-005: Fake Demo Data Only

- **Status:** Accepted
- **Decision:** Ship fake demo data for onboarding and tests.
- **Rationale:** Demo content should be useful without exposing real user information.
- **Consequence:** Demo copy must identify itself as fake.
