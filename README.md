# JFAcoustic Homepage

Personal blog written with React Router Framework deployed on Cloudflare Pages

## Commands

```bash
pnpm install # install deps
pnpm run dev # run local dev environment
pnpm run db:generate #generate new migration
pnpm run db:apply-local # apply local migrations
pnpm run db:apply-remote # apply production migrations
```

## AI Philosophy

This is not an AI-first project.  Some features will be implemented by hand, others will offload implementation to an agent

- Commit all code before allowing changes
- Any agentic work begins in plan mode
- Break down suggested plan into the smallest possible changes without breaking compilation
- Review every line of code changed before committing.  
- If generated code is insufficient, revert changes and give the agent one more chance.
- Agents only get two chances to get things right.  This prevents rabbit-holes and frustration
- If generated code is adequate, add a commit message marking that the code was AI-generated, then refactor changes by hand if necessary

### AI Commit Template:

```
[Summary]

Prompt: [Prompt]
Model: [Model]
[Reason  AI was chosen]

[Additional Details or Notes]
```

### Manual Commit Template:

```
[Summary]

[Reason Commit was By Hand]
[Additional Details or Notes]
```

My goal is to track how much I used AI in my workflow and how it impacted performance and code quality.  Metrics will likely evolve over time.

The above methodology was adopted after [this commit](https://github.com/jfacoustic/homepage/commit/d2b897bcf477a6732045782e8bceefc98040bb57).
