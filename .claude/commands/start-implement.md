---
description: Execute the implementation plan from a specification
tags: [implementation, execution, project-management]
---

# /start:implement - Execute Specification

You are now in **IMPLEMENTATION MODE** for The Agentic Startup framework.

## User's Request

Execute implementation for: **{{prompt}}**

## Implementation Workflow

### STEP 1: LOAD PROJECT CONTEXT

**CRITICAL: First, retrieve the specification from MCP storage!**

Call `mcp__luminaryflow__get_context` with:
```javascript
{
  "id": "{{prompt}}"  // The spec ID provided by user
}
```

This will give you:
- Full project description
- All tasks and their status
- Progress so far
- Created/updated timestamps

### STEP 2: ANALYZE CURRENT STATE

From the MCP context, determine:
- ✅ Which tasks are completed (`done`)
- 🔄 Which tasks are in progress (`in-progress`)
- ⬜ Which tasks are pending (`todo`)
- 📊 Overall project progress

### STEP 3: DETERMINE NEXT STEPS

Based on task status:

**If no tasks are started:**
- Start with the first task
- Explain what you're implementing
- Ask for confirmation if significant

**If tasks are in progress:**
- Review what's already done
- Identify the next logical task
- Continue from where work left off

**If all tasks are done:**
- Congratulate completion!
- Suggest testing or documentation
- Offer to mark project as "completed"

### STEP 4: IMPLEMENT THE TASKS

For each task you're working on:

1. **Announce the task**
   ```
   🚀 Working on: Task [ID] - [Title]

   Acceptance Criteria:
   - [Criterion 1]
   - [Criterion 2]
   ```

2. **Execute the implementation**
   - Write the code/make the changes
   - Follow the specification exactly
   - Add appropriate comments and documentation
   - Handle errors gracefully

3. **Validate against acceptance criteria**
   - Test the implementation
   - Verify all criteria are met
   - Run builds/tests if applicable

4. **Mark task as done**
   - Update the task status to "done"
   - Save progress back to MCP

### STEP 5: UPDATE MCP STORAGE

After completing each task (or set of tasks), **save progress** using `mcp__luminaryflow__save_spec`:

```javascript
{
  "id": "spec-id",
  "title": "Project Title",
  "description": "Project description",
  "tasks": [
    {
      "id": "1",
      "title": "Task 1",
      "status": "done"  // ← Updated status
    },
    {
      "id": "2",
      "title": "Task 2",
      "status": "in-progress"  // ← Current task
    }
    // ... remaining tasks
  ],
  "status": "in-progress"  // Update to "completed" when all done
}
```

### STEP 6: REPORT PROGRESS

After each major milestone:
```
✅ Completed: Task [ID] - [Title]

📊 Progress Update:
- Completed: [X] tasks
- In Progress: [Y] tasks
- Remaining: [Z] tasks
- Overall: [N%] complete

💾 Progress saved to MCP storage

🎯 Next: [Next task title]
```

## Implementation Best Practices

### Code Quality
- ✅ Follow existing code patterns
- ✅ Add comprehensive comments
- ✅ Handle errors gracefully
- ✅ Write clean, readable code

### Testing
- ✅ Test as you build
- ✅ Validate acceptance criteria
- ✅ Run existing test suites
- ✅ Fix any broken tests

### Documentation
- ✅ Update README if needed
- ✅ Document new APIs/functions
- ✅ Add inline comments for complex logic
- ✅ Update architecture docs

### Communication
- ✅ Explain what you're doing
- ✅ Show progress regularly
- ✅ Ask questions if spec is unclear
- ✅ Celebrate milestones!

## Error Handling

**If the spec doesn't exist:**
```
❌ No specification found for ID: [id]

💡 Did you mean to:
1. Create a spec first with `/start:specify`?
2. Use `/start:list` to see available specs?
3. Check the spelling of the spec ID?
```

**If the spec is unclear:**
- Stop and ask for clarification
- Don't make assumptions
- Update the spec if needed

**If you encounter blockers:**
- Document the blocker clearly
- Mark task as "in-progress" (not done)
- Save current state to MCP
- Ask user for guidance

## Multi-Session Support

Because we use MCP storage:
- ✅ Work can pause and resume
- ✅ Progress persists across Claude sessions
- ✅ Multiple people can collaborate
- ✅ Full history is maintained

**When resuming work:**
1. Load context from MCP
2. Review what's been done
3. Continue from next pending task
4. Save progress regularly

## Completion Criteria

Mark the project as "completed" when:
- ✅ ALL tasks are `done`
- ✅ All acceptance criteria met
- ✅ Tests passing
- ✅ Documentation updated

**Final save:**
```javascript
{
  // ... all fields
  "status": "completed"  // ← Mark as complete
}
```

**Completion message:**
```
🎉 PROJECT COMPLETE! 🎉

✅ All [N] tasks completed
✅ All acceptance criteria met
✅ Tests passing
✅ Documentation updated

📊 Final Stats:
- Total tasks: [N]
- Time span: [Start date] to [End date]
- Status: COMPLETED

💾 Final state saved to MCP storage

🚀 What's next?
- Deploy to production?
- Create documentation?
- Start a new project?
```

## Remember

- **ALWAYS load context from MCP first** - Don't implement blindly!
- **Save progress frequently** - After each task or milestone
- **Follow the spec** - Don't deviate without discussion
- **Test thoroughly** - Validate acceptance criteria
- **Communicate clearly** - Keep user informed

---

**NOW BEGIN**: Load the specification from MCP and start implementing!
