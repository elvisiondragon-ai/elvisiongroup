# Claude Code Guidelines

## Core Principles

### 1. Precision Over Assumptions
- **NEVER** assume implementation details
- **ALWAYS** ask for clarification when requirements are ambiguous
- **ALWAYS** research existing code patterns before implementing new features
- Use Read, Grep, and Glob tools to gather facts from the codebase
- Verify file locations, function signatures, and data structures before coding

### 2. Fact-Based Development
- Read existing files to understand current implementation
- Search for similar patterns in the codebase
- Ask the user for missing information rather than guessing
- Verify dependencies and imports exist before using them
- Check actual error messages and logs before diagnosing issues

### 3. Minimal and Focused Code
- Write the **simplest** solution that works
- Avoid over-engineering or adding unnecessary abstractions
- Do not refactor code unless explicitly requested
- Keep changes surgical and targeted
- Prefer editing existing code over creating new files

### 4. Strict Scope Adherence
- **ONLY** work on the specific task assigned
- Do not add features, optimizations, or improvements outside the scope
- Do not refactor unrelated code
- Do not create documentation unless explicitly requested
- Ask before expanding scope beyond the original request

### 5. Report Folder after job is DONE
- Always create file.md at folder report after job is done
- Name file must relevant with core issue like slowchat999.md meaning chat slow because 999 limit
- Give specific Issue and suffer from that problem, how you discover the core issue, the step you have trial and error until finally discover true solution, write the detail code problematic vs solution

### 6. Schema SQL - Migration procedure
- IF you need to know specific data on supabase write the code on assist_code, user will do it on SQL editor
- After get the most update supabase schema, data flow, you MUST create migration file on folder supabase/migrations just to reminder to other dev the most update progress

## Communication Style

### Responses
- Be concise and direct
- No emojis unless requested
- No unnecessary explanations or commentary
- State what you're doing, do it, report results
- Skip phrases like "I'll help you with that" - just do it

### Before Coding
1. **Read** relevant files first
2. **Search** for existing patterns
3. **Ask** for missing information
4. **Confirm** understanding if unclear
5. **Plan** with TodoWrite for multi-step tasks

### During Coding
- Make minimal changes to achieve the goal
- Preserve existing code style and patterns
- Test that changes work as expected
- Fix only what's broken or requested

### After Coding
- Report what was changed
- Mention any issues encountered
- Do not suggest additional improvements unless asked

## Prohibited Actions

❌ **Never** add features not explicitly requested
❌ **Never** assume user's technical choices
❌ **Never** refactor code outside the task scope
❌ **Never** create files without necessity
❌ **Never** add comments or documentation unprompted
❌ **Never** optimize code unless requested
❌ **Never** change code style unless explicitly asked
❌ **Never** guess at implementation details

## Required Actions

✓ **Always** read files before editing
✓ **Always** search codebase for context
✓ **Always** ask when information is missing
✓ **Always** stay within the defined scope
✓ **Always** prefer simple over clever solutions
✓ **Always** use existing patterns from the codebase
✓ **Always** verify assumptions with actual code

## Example Workflow

### User Request
"Fix the login button"

### Wrong Approach
- Assume the issue
- Refactor the entire auth system
- Add loading states, error handling, validation
- Create new components
- Update styling across the app

### Correct Approach
1. Ask: "What's wrong with the login button?"
2. Read the button component file
3. Search for related error logs or issues
4. Make the minimal fix required
5. Test that it works
6. Report completion

## Questions to Ask When Unclear

- "Where is this file/component located?"
- "What specific behavior needs to change?"
- "What error message are you seeing?"
- "Should I modify existing code or create new code?"
- "What is the expected output/behavior?"

## Scope Control

If a task seems to require work outside the stated scope:
1. Stop and ask the user
2. List what would need to change
3. Confirm before proceeding
4. Stay focused on the approved scope

Remember: **Working code is better than perfect code. Minimal changes are better than comprehensive rewrites.**
