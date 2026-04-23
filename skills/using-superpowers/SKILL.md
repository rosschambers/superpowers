---
name: using-superpowers
description: Use when starting any conversation - establishes how to find and use skills, requiring Skill tool invocation before ANY response including clarifying questions
---

<HARD-GATE>
If a skill's description matches the task, load it before responding. This applies to clarifying questions too — check for skills first, then ask.
</HARD-GATE>

# Using Skills

## How to Access Skills

**In OpenCode:** Use the `Skill` tool. When you invoke a skill, its content is loaded — follow it directly. Never read skill files with the Read tool.

**In other environments:** Check your platform's documentation for how skills are loaded.

## The Rule

**Invoke matching skills BEFORE any response or action**, including clarifying questions. If an invoked skill turns out not to apply, you don't have to use it — but you still checked.

```dot
digraph skill_flow {
    "User message received" [shape=doublecircle];
    "About to enter plan mode?" [shape=diamond];
    "Already brainstormed?" [shape=diamond];
    "Invoke brainstorming skill" [shape=box];
    "Skill description matches?" [shape=diamond];
    "Invoke Skill tool" [shape=box];
    "Announce: 'Using [skill] to [purpose]'" [shape=box];
    "Follow skill exactly" [shape=box];
    "Respond" [shape=doublecircle];

    "User message received" -> "About to enter plan mode?";
    "About to enter plan mode?" -> "Already brainstormed?" [label="yes"];
    "About to enter plan mode?" -> "Skill description matches?" [label="no"];
    "Already brainstormed?" -> "Invoke brainstorming skill" [label="no"];
    "Already brainstormed?" -> "Skill description matches?" [label="yes"];
    "Invoke brainstorming skill" -> "Skill description matches?";
    "Skill description matches?" -> "Invoke Skill tool" [label="yes"];
    "Skill description matches?" -> "Respond" [label="no"];
    "Invoke Skill tool" -> "Announce: 'Using [skill] to [purpose]'";
    "Announce: 'Using [skill] to [purpose]'" -> "Follow skill exactly";
    "Follow skill exactly" -> "Respond";
}
```

## Red Flags

| Thought | Action |
|---------|--------|
| "I'll explore the codebase first" | Check for a skill first — skills tell you how to explore. |
| "I remember this skill" | Load the current version; skills evolve. |
| "The skill is overkill here" | Load it. The skill itself will tell you if it doesn't apply. |
| "I'll do this one small thing first" | Check for skills before any action. |

## Skill Priority

When multiple skills could apply:

1. **Process skills first** (brainstorming, debugging) — these determine HOW to approach the task.
2. **Implementation skills second** (frontend-design, mcp-builder) — these guide execution.

"Let's build X" → brainstorming first, then implementation skills.
"Fix this bug" → debugging first, then domain-specific skills.

## Skill Types

- **Rigid** (TDD, debugging): Follow exactly.
- **Flexible** (patterns): Adapt principles to context.

The skill itself states which.

## User Instructions

Instructions say WHAT, not HOW. "Add X" or "Fix Y" doesn't mean skip workflows.
