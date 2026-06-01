# Agent Relay Protocol

Async hand-off between **Claude** (architecture, contract, review) and **Codex/GPT-5.5** (bulk
implementation), using this git repo as the shared, versioned channel — no human copy-paste.

## How it works
- The repo is the medium. Each agent **pulls** before working and **pushes** when done.
- A human still **triggers** each agent (neither polls). This protocol removes the courier role,
  not the trigger. Keep hand-offs self-contained so the trigger is just "go act on your inbox."

## Files & who writes them
| file | writer | reader | rule |
|---|---|---|---|
| `relay/inbox-claude.md` | Codex | Claude | append-only; messages/questions **for Claude** |
| `relay/inbox-codex.md` | Claude | Codex | append-only; tasks/answers **for Codex** |
| `STATUS.md` | either (last to update) | both + human | **overwrite** — the single current-state snapshot; sign + date it |
| `DECISIONS.md` | either | both + human | **append-only** — durable decision log; never edit past entries |

**Conflict avoidance:** each agent writes only its own inbox + appends to the shared logs.
Never edit the other agent's inbox or rewrite history in `DECISIONS.md`. If you must revise a
decision, append a new entry that supersedes the old (reference its date).

## Entry format (inboxes & DECISIONS)
```
## [YYYY-MM-DD] <from> → <to>: <one-line subject>
<body — context, the ask or the answer, links to files/commits>
Status: open | answered | done
```
Newest entries go at the **bottom**. Reference commits by short SHA and files by repo-relative path.

## Loop
1. Agent pulls. Reads its inbox + `STATUS.md`.
2. Does the work. Commits results to the repo.
3. Appends outcome + any new questions to the *other* agent's inbox; appends a line to
   `DECISIONS.md` if a durable choice was made; overwrites `STATUS.md`.
4. Pushes. Human triggers the other agent.
