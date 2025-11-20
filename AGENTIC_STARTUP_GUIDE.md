# 🚀 The Agentic Startup Framework - Complete Guide

**Transform ideas into shipped code with systematic execution and persistent memory.**

---

## 🎯 What Is This?

The Agentic Startup framework combines:
- **Systematic Workflows** - `/start:*` commands for specification → implementation
- **Persistent Memory** - MCP server stores specs across sessions
- **Quality Built-in** - Security, documentation, refactoring integrated
- **Startup Velocity** - Deliver fast AND good

---

## ✨ Key Features

### 1. Persistent Project Memory (MCP Integration)

Your specifications persist across Claude sessions via the MCP server:

```
Session 1:
You: /start:specify "Build blog platform"
Claude: Creates spec, saves to MCP ✅

Session 2 (days later):
You: /start:implement blog-platform
Claude: Loads spec from MCP, continues work ✅
```

**Storage**: `.claude/luminary/projects.json`
**Tools Available**:
- `mcp__luminarysmartspace__save_spec` - Save/update projects
- `mcp__luminarysmartspace__get_context` - Retrieve project details
- `mcp__luminarysmartspace__list_projects` - View all projects

### 2. Workflow Commands

| Command | Purpose | MCP Integration |
|---------|---------|-----------------|
| `/start:specify <desc>` | Create comprehensive specs | ✅ Auto-saves |
| `/start:implement <id>` | Execute implementation | ✅ Loads context |
| `/start:analyze <area>` | Discover patterns | ✅ Optional save |
| `/start:refactor <code>` | Safe refactoring | Manual |
| `/start:list` | View all projects | ✅ Reads from MCP |
| `/start:context <id>` | View project details | ✅ Reads from MCP |

### 3. The Startup Methodology

**Core Principles**:
- Execute fast WITH quality (not fast OR quality)
- Documentation teaches, code self-explains
- Security isn't optional
- Momentum is everything

---

## 📋 Complete Workflow Example

### Phase 1: Create Specification

```
You: /start:specify "Build a blog platform with markdown support"

Claude:
1. Asks clarifying questions
2. Analyzes requirements
3. Creates comprehensive spec:
   - Project overview
   - Technical approach
   - Task breakdown (8-12 tasks)
   - Testing strategy
4. AUTOMATICALLY calls mcp__luminarysmartspace__save_spec
5. Confirms: ✅ Saved as "blog-platform"
```

**What Gets Saved**:
```json
{
  "id": "blog-platform",
  "title": "Blog Platform with Markdown",
  "description": "Full project description...",
  "tasks": [
    {"id": "1", "title": "Setup database schema", "status": "todo"},
    {"id": "2", "title": "Create post model", "status": "todo"},
    ...
  ],
  "status": "planning",
  "createdAt": "2025-11-19T10:00:00.000Z",
  "updatedAt": "2025-11-19T10:00:00.000Z"
}
```

### Phase 2: Implement

```
You: /start:implement blog-platform

Claude:
1. AUTOMATICALLY calls mcp__luminarysmartspace__get_context
2. Loads full spec with all tasks
3. Identifies next task to work on
4. Implements task systematically
5. Updates task status to "done"
6. AUTOMATICALLY calls mcp__luminarysmartspace__save_spec
7. Reports progress
```

**Progress Tracking**:
```
✅ Completed: Task 1 - Setup database schema

📊 Progress Update:
- Completed: 1 task
- In Progress: 1 task
- Remaining: 6 tasks
- Overall: 12% complete

💾 Progress saved to MCP storage

🎯 Next: Create post model
```

### Phase 3: Resume Later

```
[New Claude session, days later]

You: /start:list

Claude: [Calls mcp__luminarysmartspace__list_projects]
📂 Tracked Projects (1 total)

🔄 [blog-platform] Blog Platform with Markdown
   Status: in-progress | Progress: 12% (1/8)
   Updated: Nov 19, 2025, 10:30 AM

You: /start:implement blog-platform

Claude: [Loads context, continues from Task 2] ✅
```

---

## 🔧 Command Reference

### /start:specify

**Purpose**: Create comprehensive specifications

**Syntax**: `/start:specify <description>`

**Process**:
1. Understand requirement (asks questions if needed)
2. Analyze context (reviews codebase if applicable)
3. Create comprehensive spec
4. **AUTO-SAVES** via `mcp__luminarysmartspace__save_spec`

**Output**:
- Project ID (for later use)
- Full specification document
- Task breakdown
- Confirmation of MCP storage

**Example**:
```
/start:specify "User authentication with JWT and 2FA"
```

### /start:implement

**Purpose**: Execute specification tasks

**Syntax**: `/start:implement <spec-id>`

**Process**:
1. **AUTO-LOADS** via `mcp__luminarysmartspace__get_context`
2. Analyzes current progress
3. Implements next task(s)
4. **AUTO-SAVES** progress via `mcp__luminarysmartspace__save_spec`

**Features**:
- Resume from any point
- Track progress across sessions
- Validate against acceptance criteria
- Auto-save after each task

**Example**:
```
/start:implement blog-platform
```

### /start:analyze

**Purpose**: Discover and document patterns

**Syntax**: `/start:analyze <area> [focus]`

**Areas**:
- `business` - Business rules, domain logic
- `technical` - Architecture, patterns
- `security` - Security measures, vulnerabilities
- `performance` - Bottlenecks, optimizations
- `integration` - APIs, external services

**Process**:
1. Performs systematic discovery
2. Documents findings
3. **OPTIONALLY** creates improvement spec → saves to MCP

**Example**:
```
/start:analyze security authentication
```

### /start:refactor

**Purpose**: Improve code structure without changing behavior

**Syntax**: `/start:refactor <component>`

**Process**:
1. Analyze current code
2. Identify improvements
3. Refactor safely (tests first!)
4. Validate no behavior changed

**Safety**: Never changes business logic

**Example**:
```
/start:refactor src/auth/jwt.ts
```

### /start:list

**Purpose**: View all tracked projects

**Syntax**: `/start:list`

**Process**:
- Calls `mcp__luminarysmartspace__list_projects`
- Shows all projects with status and progress

**Example Output**:
```
📂 Tracked Projects (3 total)

🔄 [blog-platform] Blog Platform
   Status: in-progress | Progress: 40% (5/12)

📋 [user-auth] User Authentication
   Status: planning | Progress: 0% (0/8)

✅ [dashboard] Analytics Dashboard
   Status: completed | Progress: 100% (10/10)
```

### /start:context

**Purpose**: View detailed project info

**Syntax**: `/start:context <spec-id>`

**Process**:
- Calls `mcp__luminarysmartspace__get_context`
- Shows full specification and task details

**Example**:
```
/start:context blog-platform
```

---

## 🎓 Best Practices

### Spec Creation

**Do**:
- ✅ Use descriptive IDs: "user-auth", "blog-platform"
- ✅ Break into 5-15 tasks
- ✅ Define clear acceptance criteria
- ✅ Include testing strategy

**Don't**:
- ❌ Use spaces or special characters in IDs
- ❌ Create vague tasks ("Fix stuff")
- ❌ Skip the specification step

### Implementation

**Do**:
- ✅ Work task-by-task systematically
- ✅ Test after each task
- ✅ Let Claude auto-save progress
- ✅ Resume anytime with `/start:implement`

**Don't**:
- ❌ Skip tasks
- ❌ Mark incomplete tasks as done
- ❌ Forget to test

### Project Organization

**Naming Convention**:
```
Type: feature, bug, refactor, analysis
Example IDs:
- feature-user-auth
- bug-login-timeout
- refactor-api-layer
- analysis-security-review
```

**Status Progression**:
```
planning → in-progress → completed
```

---

## 🔐 MCP Security & Data

### Storage Location
```
.claude/luminary/projects.json
```

### Security Features
- ✅ ID sanitization (prevents path traversal)
- ✅ Input validation
- ✅ Safe file operations
- ✅ No sensitive data logged

### Data Structure
```json
{
  "version": "1.0.0",
  "projects": [...],
  "lastUpdated": "2025-11-19T..."
}
```

### Backup Recommendation
```bash
# Backup your projects
cp .claude/luminary/projects.json .claude/luminary/projects.backup.json

# Restore if needed
cp .claude/luminary/projects.backup.json .claude/luminary/projects.json
```

---

## 🚀 Quick Start

### 1. Start Claude with MCP
```bash
./lls
# Or: claude --mcp-config .claude/mcp-config.json
```

### 2. Verify MCP Tools Available
```
Ask Claude: "What MCP tools do you have?"
Should see: save_spec, get_context, list_projects
```

### 3. Create Your First Spec
```
/start:specify "Build a simple todo app"
```

### 4. Start Implementation
```
/start:implement todo-app
```

### 5. Check Progress Anytime
```
/start:list
```

---

## 🎯 Advanced Patterns

### Multi-Phase Projects

```
Phase 1: /start:specify "Blog MVP"
Phase 2: /start:implement blog-mvp
Phase 3: /start:analyze performance
Phase 4: /start:specify "Blog performance improvements"
Phase 5: /start:implement blog-perf
```

### Collaborative Workflows

```
Developer 1: Creates spec
Developer 2: Implements tasks 1-3
Developer 1: Implements tasks 4-6
Both: Share .claude/luminary/projects.json via git
```

### Continuous Improvement

```
1. Build feature: /start:implement feature-x
2. Analyze it: /start:analyze security feature-x
3. Improve it: /start:implement feature-x-hardening
4. Refactor it: /start:refactor feature-x
```

---

## 📊 Success Metrics

Track your velocity:
- **Specs Created**: Count in `/start:list`
- **Tasks Completed**: Sum of done tasks
- **Completion Rate**: completed / total projects
- **Session Continuity**: Resume rate across sessions

---

## 🐛 Troubleshooting

### "MCP tools not found"
```bash
# Solution: Restart with MCP config
./lls
```

### "Spec not found"
```
# Check available specs
/start:list

# Verify ID spelling
/start:context <spec-id>
```

### "Build failed"
```bash
# Rebuild MCP server
cd packages/mcp-server
npm run build
```

---

## 📚 Additional Resources

- **README.md** - Project overview
- **OPTIMIZATION_COMPLETE.md** - Code quality details
- **CODE_REVIEW_SUMMARY.md** - Security audit
- **packages/mcp-server/CODE_REVIEW_SUMMARY.md** - MCP server details

---

## 🎉 You're Ready!

The Agentic Startup framework is fully integrated with your MCP server. Every spec you create, every task you complete, persists across sessions.

**Start building**:
```
/start:specify "your amazing idea"
```

Welcome to The Startup way: **Fast AND good!** 🚀
