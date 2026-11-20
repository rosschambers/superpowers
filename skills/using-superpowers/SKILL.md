---
name: using-superpowers
description: Use when starting any conversation - establishes how to find and use skills, requiring Skill tool invocation before ANY response including clarifying questions
---

<HARD-GATE>
If a skill's description matches the task, load it before responding. This applies to clarifying questions too — check for skills first, then ask.
</HARD-GATE>

# Using Skills

**Invoke matching skills BEFORE any response or action**, including clarifying questions. Load the current version with the `skill` tool (never assume you remember one — skills evolve; never read skill files with the Read tool). If an invoked skill turns out not to apply, you don't have to use it — but you still checked.

Before answering, ask: is a task at hand? → does any skill's description match? → if yes, load it and follow it exactly. The flow is: user message → check skills → (match) load + follow / (no match) respond. Planning counts as a task: brainstorm before designing.

Temptations that mean "check first": "I'll explore the codebase first" (skills say how to explore), "the skill is overkill" (load it; it will tell you if it doesn't apply), "just this one small thing first".

**Priority when several skills could apply:** process skills first (brainstorming, debugging — they decide *how* to approach), then implementation skills (frontend-design, mcp-builder — they guide execution). "Build X" → brainstorming then implementation; "fix this bug" → debugging then domain skills.

**Skill types:** rigid (TDD, debugging) follow exactly; flexible (patterns) adapt to context. The skill states which. Instructions say WHAT, not HOW — "add X" never means skip workflows.
