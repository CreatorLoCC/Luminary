---
description: View detailed context for a specific project
tags: [utility, project-management, details]
---

# /start:context - View Project Details

Display full details for a specific project from MCP storage.

## User's Request

Show details for: **{{prompt}}**

## Execution

**STEP 1**: Call the MCP get_context tool

```javascript
mcp__luminaryflow__get_context({
  "id": "{{prompt}}"
})
```

**STEP 2**: Display the results

The tool will return:
- Project title and description
- Full task list with status icons
- Progress statistics
- Created and updated timestamps

**STEP 3**: Provide next steps

After showing the context:

```
💡 What's Next?

Continue implementation:
  /start:implement {{prompt}}

Analyze the project:
  /start:analyze business {{prompt}}

Back to project list:
  /start:list
```

## Error Handling

If the project doesn't exist:

```
❌ No project found with ID: {{prompt}}

💡 Options:
- Check the ID spelling
- Use /start:list to see all projects
- Create a new spec with /start:specify
```

---

**NOW BEGIN**: Retrieve and display the project context!
