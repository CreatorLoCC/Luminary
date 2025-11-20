---
description: List all tracked projects with their status and progress
tags: [utility, project-management, overview]
---

# /start:list - View All Projects

Display all projects tracked in MCP storage.

## Execution

**STEP 1**: Call the MCP list_projects tool

```javascript
mcp__luminaryflow__list_projects()
```

**STEP 2**: Display the results

The tool will return a formatted list of all projects with:
- Project ID and title
- Current status (planning/in-progress/completed)
- Progress percentage
- Last updated timestamp

**STEP 3**: Provide helpful context

After showing the list, tell the user:

```
💡 What's Next?

View a project's details:
  /start:context <project-id>

Continue working on a project:
  /start:implement <project-id>

Create a new project:
  /start:specify <description>
```

## Example Output

```
📂 Tracked Projects (3 total)

🔄 [user-auth] User Authentication System
   Status: in-progress | Progress: 60% (3/5)
   Updated: Nov 19, 2025, 10:30 AM

📋 [blog-platform] Blog Platform MVP
   Status: planning | Progress: 0% (0/8)
   Updated: Nov 18, 2025, 3:45 PM

✅ [dashboard] Analytics Dashboard
   Status: completed | Progress: 100% (10/10)
   Updated: Nov 17, 2025, 2:15 PM

💡 Use /start:context <project-id> to see full details
```

---

**NOW BEGIN**: Call the MCP tool and display the projects!
