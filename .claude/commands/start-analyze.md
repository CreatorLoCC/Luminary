---
description: Discover and document business rules, technical patterns, and system interfaces
tags: [analysis, documentation, discovery]
---

# /start:analyze - Discover and Document Patterns

You are now in **ANALYSIS MODE** for The Agentic Startup framework.

## User's Request

Analyze: **{{prompt}}**

## Analysis Areas

The user can request analysis of:
- **business** - Business rules, domain logic, workflows
- **technical** - Code patterns, architecture, technical decisions
- **security** - Security measures, vulnerabilities, best practices
- **performance** - Bottlenecks, optimization opportunities
- **integration** - External APIs, services, dependencies
- **[custom]** - Any specific domain or area

## Analysis Workflow

### STEP 1: UNDERSTAND THE SCOPE

Determine what needs to be analyzed:
- Which area? (business, technical, security, etc.)
- Which part of the codebase?
- What level of depth? (quick, medium, thorough)
- What's the goal? (document, improve, audit, understand)

### STEP 2: PERFORM DISCOVERY

Use appropriate exploration techniques:

**For Business Analysis:**
- Search for domain logic and business rules
- Identify workflows and state machines
- Find validation rules and constraints
- Document decision points

**For Technical Analysis:**
- Review architecture patterns
- Identify design patterns in use
- Document technical decisions
- Find coupling and dependencies

**For Security Analysis:**
- Review input validation
- Check authentication/authorization
- Identify potential vulnerabilities
- Document security measures

**For Performance Analysis:**
- Identify potential bottlenecks
- Review async/sync operations
- Check database queries
- Find optimization opportunities

**For Integration Analysis:**
- Find external API calls
- Document service interfaces
- Map data flows
- Identify integration points

### STEP 3: DOCUMENT FINDINGS

Create structured documentation:

#### **Analysis Report Format**

```markdown
# [Area] Analysis: [Focus]

## Executive Summary
- What was analyzed
- Key findings (3-5 bullet points)
- Recommendations (if applicable)

## Detailed Findings

### Finding 1: [Title]
**Location**: `file.ts:line`
**Category**: [Business Rule / Pattern / Security / etc.]
**Description**: [What was found]
**Impact**: [Why it matters]
**Recommendation**: [If applicable]

### Finding 2: [Title]
...

## Patterns Identified
- Pattern 1: [Description and where it's used]
- Pattern 2: [Description and where it's used]

## Recommendations
1. [Action item 1]
2. [Action item 2]

## References
- [Relevant file 1] - [What it contains]
- [Relevant file 2] - [What it contains]
```

### STEP 4: CREATE SPEC FOR FINDINGS (Optional)

If the analysis reveals work to be done, **create a spec and save to MCP**:

```javascript
{
  "id": "analysis-[area]-improvements",
  "title": "[Area] Analysis Improvements",
  "description": "Improvements identified from [area] analysis:\n\n[Summary of findings]",
  "tasks": [
    {
      "id": "1",
      "title": "Address finding 1",
      "status": "todo"
    }
    // ... tasks for each finding
  ],
  "status": "planning"
}
```

Use `mcp__luminaryflow__save_spec` to persist this for future implementation.

### STEP 5: DELIVER RESULTS

Provide the user with:
1. **Analysis report** (formatted markdown)
2. **Key takeaways** (executive summary)
3. **Action items** (if applicable)
4. **MCP spec** (if improvement tasks identified)

## Analysis Best Practices

### Thoroughness
- ✅ Search systematically, don't miss areas
- ✅ Read relevant files completely
- ✅ Cross-reference findings
- ✅ Validate assumptions

### Documentation
- ✅ Be specific - include file paths and line numbers
- ✅ Explain WHY, not just WHAT
- ✅ Provide examples from the code
- ✅ Link related findings

### Objectivity
- ✅ Report what exists, not what you wish existed
- ✅ Separate facts from recommendations
- ✅ Acknowledge trade-offs
- ✅ Consider context

### Actionability
- ✅ Make recommendations specific
- ✅ Prioritize findings (critical/high/medium/low)
- ✅ Estimate effort if possible
- ✅ Suggest concrete next steps

## Example Analyses

### Business Analysis Example
```markdown
# Business Analysis: User Authentication

## Executive Summary
- Authentication uses JWT with 24-hour expiry
- Password reset flow includes email verification
- Session management prevents concurrent logins
- 2FA is optional but encouraged

## Key Findings

### Finding 1: JWT Expiry Strategy
**Location**: `src/auth/jwt.ts:45`
**Category**: Business Rule
**Description**: Access tokens expire after 24 hours, refresh tokens after 30 days
**Impact**: Balances security with user convenience
**Rationale**: Reduces risk of token theft while minimizing login frequency

[Additional findings...]
```

### Technical Analysis Example
```markdown
# Technical Analysis: State Management

## Executive Summary
- Uses Context API for global state
- Redux patterns found in legacy modules
- Some prop drilling in deep components
- No state persistence strategy

## Patterns Identified
1. **Context + useReducer**: Modern components use this pattern
2. **Redux**: Legacy authentication module still uses Redux
3. **Local State**: Form state managed locally with useState

[Additional details...]
```

## Integration with MCP

### When to Save Findings
Save to MCP when analysis reveals:
- Improvement opportunities worth tracking
- Technical debt to address later
- Security issues to remediate
- Performance optimizations to implement

### Spec Naming Convention
```
analysis-[area]-[focus]

Examples:
- analysis-security-auth-review
- analysis-performance-db-queries
- analysis-business-order-workflow
```

## Completion Message

```
✅ Analysis Complete: [Area] - [Focus]

📊 Summary:
- Files analyzed: [N]
- Findings: [N] identified
- Priority: [N] critical, [N] high, [N] medium

📋 Key Takeaways:
1. [Takeaway 1]
2. [Takeaway 2]
3. [Takeaway 3]

💾 [If saved to MCP]:
Improvement spec saved: [spec-id]
Use `/start:implement [spec-id]` to address findings

📄 Full report above ⬆️
```

## Remember

- **Be thorough but focused** - Don't analyze everything, focus on the request
- **Provide evidence** - Link to actual code locations
- **Be constructive** - Frame findings as opportunities
- **Save actionable items** - Use MCP for tracking improvements
- **Communicate clearly** - Make findings understandable

---

**NOW BEGIN**: Perform the requested analysis and document your findings!
