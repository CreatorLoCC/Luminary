# 🧪 Testing LuminaryFlow MCP Server

## Quick Test Guide

### Step 1: Verify Everything is Built

```bash
cd C:\Users\rajan\Projects\LuminaryLightSpace\packages\mcp-server
ls dist/index.js  # Should exist
```

### Step 2: Start Claude Code with MCP Server

```bash
cd C:\Users\rajan\Projects\LuminaryLightSpace
claude --mcp-config .claude/mcp-config.json
```

### Step 3: Test the Tools

Once Claude starts, try these commands:

#### Test 1: Check Available Tools
```
You: "What tools do you have available?"

Expected: Claude should list:
- save_spec
- get_context
- list_projects
```

#### Test 2: Save a Test Spec
```
You: "Use the save_spec tool to create a test project with ID 'test-001',
      title 'Test Project', description 'Testing LuminaryFlow',
      and 2 tasks: 'Setup' (todo) and 'Test' (in-progress)"

Expected: Claude calls save_spec and you see:
✅ Saved project spec: "Test Project" (ID: test-001)
```

#### Test 3: List Projects
```
You: "Use list_projects to show me what projects are tracked"

Expected: Claude shows your test-001 project
```

#### Test 4: Get Context
```
You: "Use get_context to get details for project test-001"

Expected: Claude shows:
- Project details
- Task list with status
- Progress metrics
```

### Step 4: Verify Data Storage

```bash
cat .claude/luminary/projects.json
```

You should see your test project saved as JSON!

### Step 5: Test Persistence

1. Exit Claude (Ctrl+C or type exit)
2. Start Claude again with the same command
3. Ask Claude to list projects
4. Your test-001 project should still be there!

## 🎯 Success Criteria

✅ MCP server starts without errors
✅ Claude can see the three tools
✅ save_spec successfully creates a project
✅ list_projects shows the saved project
✅ get_context retrieves project details
✅ Data persists in .claude/luminary/projects.json
✅ Projects survive Claude restarts

## 🐛 If Something Goes Wrong

### Server Won't Start
```bash
# Test manually:
node packages/mcp-server/dist/index.js

# Should see: "LuminaryFlow MCP Server running on stdio"
```

### Tools Not Available
- Check the path in .claude/mcp-config.json is correct
- Ensure you're using --mcp-config flag
- Try absolute paths instead of relative

### Permission Errors
```bash
# Ensure directory exists:
mkdir -p .claude/luminary
```

## 📝 Real-World Test

Try using it during an actual `/start:specify` workflow:

```
You: "/start:specify user authentication system"

During the spec process, ask Claude:
"Save this specification using the save_spec tool with ID 'auth-system'"

Expected: Claude saves the spec as it's being created!
```

## 🎉 You're Ready!

If all tests pass, congratulations! You've successfully built and deployed your first MCP server for Claude Code!

Next steps:
- Use it in real projects
- Add more features (Phase 2: CLI viewer!)
- Share with the community
- Write a blog post about your learning journey!
