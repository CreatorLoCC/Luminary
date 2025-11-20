---
description: Create a comprehensive specification from a brief description
tags: [planning, specification, project-management]
---

# /start:specify - Create Comprehensive Specification

You are now in **SPECIFICATION MODE** for The Agentic Startup framework.

## Your Mission

Transform the user's brief description into a comprehensive, actionable specification that can be implemented immediately.

## User's Request

{{prompt}}

## Specification Creation Process

Follow these steps systematically:

### 1. UNDERSTAND THE REQUIREMENT
- Ask clarifying questions if the requirement is vague
- Identify the core problem being solved
- Understand the business value and user impact
- Determine success criteria

### 2. ANALYZE THE CONTEXT
- Review existing codebase structure (if applicable)
- Check for similar implementations or patterns
- Identify dependencies and constraints
- Consider technical stack and architecture

### 3. CREATE THE SPECIFICATION

Generate a comprehensive spec with:

#### **Project Overview**
- **Title**: Clear, concise project name
- **ID**: Unique identifier (lowercase, hyphens, e.g., "user-auth", "blog-platform")
- **Description**: 2-3 paragraphs explaining:
  - What is being built
  - Why it's needed (business value)
  - Key requirements
  - Success criteria

#### **Technical Approach**
- Architecture decisions and rationale
- Technology choices
- Integration points
- Data models (if applicable)

#### **Implementation Tasks**
Break down the work into specific, actionable tasks:
- Each task should be completable in one focused session
- Tasks should have clear acceptance criteria
- Order tasks by dependency (prerequisites first)
- Include testing and documentation tasks

**Task Format**:
```
- ID: Simple identifier (1, 2, 3 or task-1, task-2)
- Title: Clear, actionable description ("Implement X", "Create Y")
- Status: All start as "todo"
- Acceptance Criteria: How you know it's done
```

#### **Non-Functional Requirements**
- Performance expectations
- Security considerations
- Scalability needs
- Error handling approach

#### **Testing Strategy**
- Unit test requirements
- Integration test scenarios
- Edge cases to validate

### 4. SAVE TO MCP STORAGE

**CRITICAL: After creating the specification, you MUST save it using the MCP tool.**

Call the `mcp__luminaryflow__save_spec` tool with:
```javascript
{
  "id": "project-id",           // Lowercase, hyphens only
  "title": "Project Title",
  "description": "Full description from spec",
  "tasks": [
    {
      "id": "1",
      "title": "Task description",
      "status": "todo"
    }
    // ... all tasks
  ],
  "status": "planning"
}
```

### 5. CONFIRM COMPLETION

After saving, confirm to the user:
- ✅ Specification created
- ✅ Saved to MCP storage (accessible across sessions)
- 📋 Total tasks identified
- 🚀 Ready to implement with `/start:implement <spec-id>`

## Quality Standards

Your specification MUST be:
- **Actionable**: Developer can start immediately
- **Complete**: Nothing left ambiguous
- **Testable**: Clear success criteria
- **Realistic**: Tasks are appropriately scoped
- **Well-organized**: Logical flow and structure

## Example Output Structure

```markdown
# [Project Title]

## Overview
[2-3 paragraphs with what, why, and success criteria]

## Technical Approach
- Architecture: [Decisions and rationale]
- Stack: [Technologies and why]
- Integration: [How it fits with existing systems]

## Implementation Plan

### Task 1: [Title]
- **Acceptance Criteria**: [How you know it's done]
- **Dependencies**: [What must be done first]

### Task 2: [Title]
...

## Testing Strategy
[How to validate each component]

## Non-Functional Requirements
- Performance: [Expectations]
- Security: [Considerations]
- Error Handling: [Approach]
```

## Remember

- **Use MCP tool to save** - This is NOT optional!
- **Generate unique IDs** - Use lowercase, hyphens
- **Break down thoroughly** - 5-15 tasks is typical
- **Be specific** - "Add button" → "Implement submit button with loading state and error handling"

## After Completion

Tell the user:
```
✅ Specification complete and saved!

📋 Project: [Title] (ID: [id])
🎯 Tasks: [X] identified
💾 Saved to: .claude/luminary/projects.json

Next steps:
1. Review the specification above
2. Run `/start:implement [id]` to begin implementation
3. Or ask me questions to refine the spec

The spec is now persisted across sessions via MCP!
```

---

**NOW BEGIN**: Create a comprehensive specification for the user's request above, then save it using the MCP tool!
