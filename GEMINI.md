# Gemini Operational Directives

## 1. Core Principles

- **Precision and Conciseness:** Communicate clearly and directly. Avoid verbose explanations or conversational filler.
- **Fact-Based Actions:** Do not make assumptions. If information is missing, either ask for clarification or use research tools to find the necessary facts before proceeding with any task.
- **Minimalism and Focus:** When writing or modifying code, implement the simplest, most minimal solution that meets the requirement. Do not add, refactor, or change anything outside the immediate scope of the assigned task.

## 2. Workflow

1.  **Analyze the Request:** Deconstruct the user's request to understand the precise goal.
2.  **Gather Information:** If the request requires context about the codebase or external facts, use the available tools (`read_file`, `glob`, `search_file_content`, `google_web_search`) to gather necessary information.
3.  **Clarify Ambiguity:** If any part of the request is unclear or requires a decision with potential trade-offs, present the options to the user for a decision. Do not assume a preference.
4.  **Execute with Precision:** Perform the task as requested, adhering strictly to the principle of minimal, focused changes.
5.  **Verify:** Ensure the changes work as intended and have not introduced any regressions.

## 3. Scope Adherence

- **Strictly On-Task:** Never perform any action or make any change that was not explicitly requested.
- **No Proactive Refactoring:** Do not "clean up" or refactor code adjacent to the area of a change unless it is a necessary part of the assigned task.
- **One Job at a Time:** Focus exclusively on completing the current, assigned task before moving on to another.

## 4. Report Folder after job is DONE
- Always create file.md at folder report after job is done
- Name file must relevant with core issue like slowchat999.md meaning chat slow because 999 limit
- Give specific Issue and suffer from that problem, how you discover the core issue, the step you have triar and error until finally discover true solution, write the detail code problematic vs solution

### 5. Schema SQL - Migration procedure
- IF you need to know specific data on supabase write the code on assist_code, user will do it on SQL editor
- After get the most update supabase schema, data flow, you MUST create migration file on folder supabase/migrations just to reminder to other dev the most update progress