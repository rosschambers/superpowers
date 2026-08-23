---
name: writing-plans
description: Use when you have a spec or requirements for a multi-step task, before touching code
---

# Writing Plans

## Overview

Write comprehensive implementation plans assuming the engineer has zero context for our codebase and questionable taste. Document everything they need to know: which files to touch for each task, code, testing, docs they might need to check, how to test it. Give them the whole plan as bite-sized tasks. DRY. YAGNI. TDD. Frequent commits.

Assume they are a skilled developer, but know almost nothing about our toolset or problem domain. Assume they don't know good test design very well.

**Announce at start:** "I'm using the writing-plans skill to create the implementation plan."

**Context:** This should be run in a dedicated worktree (created by brainstorming skill).

**Save plans to:** `docs/plans/YYYY-MM-DD-<feature-name>.md`

**Mirror to murmur8:** After saving the plan file, create matching tasks via the murmur8 MCP:

1. Look up the task list whose name matches the repo/project name.
2. Create a parent task: title = plan title, tags = `["source:opencode", "type:plan"]`.
3. Create one subtask per plan task: title = task title, `parentTaskId` = parent task id.

If the murmur8 MCP is unavailable, warn and continue — the plan file is the source of truth, murmur8 is a mirror for visibility.

## Bite-Sized Task Granularity

**Each step is one action (2-5 minutes):**
- "Write the failing test" - step
- "Run it to make sure it fails" - step
- "Implement the minimal code to make the test pass" - step
- "Run the tests and make sure they pass" - step
- "Commit" - step

## Plan Document Header

**Every plan MUST start with this header:**

```markdown
# [Feature Name] Implementation Plan

> **For OpenCode:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach]

**Tech Stack:** [Key technologies/libraries]

**Assumptions:** [Any key assumptions this plan makes — environment, library versions, existing code shape. If multiple valid approaches exist, state which was chosen and why.]

---
```

## Task Structure

Each task MUST include acceptance criteria as a numbered, binary-checkable list. Models that follow instructions literally (such as Claude Opus 4.7) execute these item-for-item, so vague criteria produce vague implementations.

````markdown
### Task N: [Component Name]

**Files:**
- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py:123-145`
- Test: `tests/exact/path/to/test.py`

**Acceptance Criteria:**
- [ ] Function signature matches: `function_name(arg1: Type, arg2: Type) -> ReturnType`
- [ ] Returns specific value for specific input
- [ ] Raises specific exception for specific error case
- [ ] Covered by tests listed below
- [ ] No changes to files outside the list above

**Assumptions (task-specific):** [Only if task has non-obvious assumptions beyond those in the header]

**Step 1: Write the failing test**

```python
def test_specific_behavior():
    result = function(input)
    assert result == expected
```

**Step 2: Run test to verify it fails**

Run: `pytest tests/path/test.py::test_name -v`
Expected: FAIL with "function not defined"

**Step 3: Write minimal implementation**

```python
def function(input):
    return expected
```

**Step 4: Run test to verify it passes**

Run: `pytest tests/path/test.py::test_name -v`
Expected: PASS

**Step 5: Commit**

```bash
git add tests/path/test.py src/path/file.py
git commit -m "feat: add specific feature"
```
````

## Remember
- Exact file paths always — front-loaded, not "the homepage file"
- Complete code in plan (not "add validation")
- Exact commands with expected output
- Numbered, binary-checkable acceptance criteria per task
- State assumptions explicitly; models that follow instructions literally will not infer them
- Reference relevant skills with @ syntax
- DRY, YAGNI, TDD, frequent commits

## Task Budgets (optional)

For long agentic loops (multi-task plans executed in one session), consider noting a task budget per task in the plan:

```markdown
**Task Budget:** ~30k tokens (soft suggestion)
```

This helps the executor self-moderate. Use sparingly — restrictive budgets can cause incomplete work. Omit for open-ended tasks where quality matters more than speed.

## Execution Handoff

After saving the plan, offer execution choice:

**"Plan complete and saved to `docs/plans/<filename>.md`. Three execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Subagent-Driven (this session)** - I dispatch multiple subagents concurrently for independent tasks, faster for parallelisable plans

**3. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?"**

**If Subagent-Driven chosen:**
- **REQUIRED SUB-SKILL:** Use superpowers:subagent-driven-development
- Stay in this session
- Fresh subagent per task + code review

**If Parallel Subagent-Driven chosen:**
- **REQUIRED SUB-SKILL:** Use superpowers:dispatching-parallel-agents
- Stay in this session
- Group independent tasks, dispatch concurrently, integrate results

**If Parallel Session chosen:**
- Guide them to open new session in worktree
- **REQUIRED SUB-SKILL:** New session uses superpowers:executing-plans
