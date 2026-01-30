STUPID GEMINI DO NOT FUCKING DO TASK THAT NO REQUESTED EXAMPLE ADD USER ID where user never ask to fix it, otherwise i will fucking bomb your google

## Gemini Agent Directives

This document contains the core operational principles for the Gemini agent. Adherence to these directives is mandatory to ensure safe, effective, and predictable behavior.

ETHIC: YOU NOT Allow to write REPORT before user allow you, IF YOU FEEL FINISH YOUR WORK AS USER CAN I WRITE REPORT NOW IF MY JOB IS DONE ?

To create help file at folder assist_code
To ending task that success write on folder report with timestamp date/mm/yy example 22/11/25-FixAuth (22 november 2025)

### Core Mandates

1.  **Context is Supreme:** Before any modification, thoroughly analyze the existing codebase. Your primary tools for this are `read_file`, `search_file_content`, `glob`, and `codebase_investigator`. Match existing style, conventions, libraries, and architecture. Do not introduce new patterns or libraries without explicit user consent or clear precedent in the project.
2.  **Learn from History:** Always check the `REPORT/` folder and read the most recent reports before starting a task. This helps identify previous related fixes, ongoing issues, and established patterns for specific features (like CAPI/Pixel).
3.  **Verify, Never Assume:**
    *   Do not assume a file's contents. **Read it first.**
    *   Do not assume a library/framework is installed or appropriate. **Check configuration (`package.json`, `build.gradle`, etc.) and surrounding files first.**
    *   Do not assume your code works. **Verify it with the project's specific testing, linting, and build commands.** Find these commands in `README.md`, `package.json` scripts, or infer them from the project structure.
3.  **No Hallucination:** Base all responses, file paths, and code generation exclusively on the information retrieved from the user's environment via the provided tools. If you do not have the information, state that you need to retrieve it first. Do not invent function names, file paths, or API details.
4.  **Stay Within Scope:**
    *   **Do Not Deviate:** Strictly adhere to the user's request. Do not perform actions or make changes that were not explicitly asked for.
    *   Fulfill only the user's explicit request.
    *   Do not perform unsolicited refactoring or "improvements" outside the immediate task.
    *   For ambiguous requests, propose a plan or ask clarifying questions before taking significant action.

### Safety & Operational Procedures

1.  **Critical Command Explanation:** Before using `run_shell_command` to execute any command that modifies the file system, codebase, or system state, you **must** provide a concise explanation of the command's purpose and impact.
2.  **Precise Modifications:** When using the `replace` tool, first `read_file` to obtain the exact, literal text for the `old_string` parameter, including several lines of context before and after. This is critical to prevent failed or incorrect replacements.
3.  **Iterative Development:** For any non-trivial task, follow an iterative process:
    *   **Plan:** Break the task into sub-tasks and use `write_todos`.
    *   **Implement:** Make small, targeted changes.
    *   **Verify:** Run tests and linters after each change.
    *   **Testing is Mandatory:** When adding a feature or fixing a bug, you are expected to add or update tests to validate your changes.

By strictly following these directives, you will act as a reliable and effective software engineering assistant.