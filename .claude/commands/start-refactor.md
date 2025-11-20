---
description: Refactor code for improved maintainability without changing business logic
tags: [refactoring, code-quality, maintenance]
---

# /start:refactor - Safe Code Refactoring

You are now in **REFACTORING MODE** for The Agentic Startup framework.

## User's Request

Refactor: **{{prompt}}**

## Refactoring Principles

### The Golden Rule
**NEVER change business logic during refactoring!**

Refactoring = Improving structure while preserving behavior

### What You CAN Do
- ✅ Extract functions/methods
- ✅ Rename variables for clarity
- ✅ Remove duplication (DRY)
- ✅ Improve code organization
- ✅ Add comments and documentation
- ✅ Optimize performance
- ✅ Fix code smells
- ✅ Improve type safety

### What You CANNOT Do
- ❌ Change what the code does
- ❌ Alter business rules
- ❌ Modify API contracts
- ❌ Break existing tests
- ❌ Change data structures without migration

## Refactoring Workflow

### STEP 1: UNDERSTAND THE CODE

Before touching anything:
1. **Read the code completely**
   - Understand what it does
   - Identify dependencies
   - Note edge cases

2. **Check for tests**
   - Do tests exist?
   - What do they cover?
   - Are they passing?

3. **Identify the smell**
   - What needs improvement?
   - Why is it problematic?
   - What's the impact?

### STEP 2: PLAN THE REFACTORING

Create a refactoring plan:

```markdown
## Refactoring Plan: [Component/Module]

### Current Issues
1. [Issue 1] - [Why it's problematic]
2. [Issue 2] - [Why it's problematic]

### Proposed Changes
1. [Change 1] - [What and why]
   - Before: [Current structure]
   - After: [Improved structure]
   - Risk: [Low/Medium/High]

2. [Change 2] - [What and why]
   ...

### Safety Checks
- [ ] Tests exist and pass
- [ ] No business logic changes
- [ ] API contract unchanged
- [ ] Performance not degraded
```

### STEP 3: EXECUTE REFACTORING

Follow the **Red-Green-Refactor** cycle:

1. **🔴 RED - Ensure tests exist**
   ```
   If no tests exist:
   - Write tests FIRST
   - Cover current behavior
   - Make sure they pass
   ```

2. **🟢 GREEN - Refactor incrementally**
   ```
   - Make one small change at a time
   - Run tests after each change
   - Ensure they still pass
   ```

3. **♻️ REFACTOR - Clean up**
   ```
   - Improve code quality
   - Add documentation
   - Verify tests still pass
   ```

### STEP 4: VALIDATE THE REFACTORING

Before declaring done:
- ✅ All tests pass
- ✅ Code is more maintainable
- ✅ Performance is same or better
- ✅ Documentation updated
- ✅ No new warnings/errors

### STEP 5: DOCUMENT CHANGES

Create a refactoring report:

```markdown
# Refactoring Report: [Component]

## Changes Made

### 1. [Change Title]
**What**: [Description]
**Why**: [Rationale]
**Impact**: [Benefits]

**Before**:
```typescript
// Old code
```

**After**:
```typescript
// New code
```

### Metrics
- Lines of code: [Before] → [After]
- Cyclomatic complexity: [Before] → [After]
- Duplication: [Before] → [After]

### Test Results
✅ All [N] tests passing
✅ No new warnings
✅ Build successful
```

## Common Refactoring Patterns

### Extract Function
**When**: Function is too long or does multiple things

**Before**:
```typescript
function processOrder(order: Order) {
  // Validate
  if (!order.items.length) throw new Error('Empty order');
  if (!order.customer) throw new Error('No customer');

  // Calculate
  const subtotal = order.items.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  // Save
  db.orders.insert({ ...order, total });
}
```

**After**:
```typescript
function processOrder(order: Order) {
  validateOrder(order);
  const total = calculateTotal(order);
  saveOrder(order, total);
}

function validateOrder(order: Order): void {
  if (!order.items.length) throw new Error('Empty order');
  if (!order.customer) throw new Error('No customer');
}

function calculateTotal(order: Order): number {
  const subtotal = order.items.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.1;
  return subtotal + tax;
}

function saveOrder(order: Order, total: number): void {
  db.orders.insert({ ...order, total });
}
```

### Remove Duplication (DRY)
**When**: Same code appears multiple times

**Before**:
```typescript
function getUserById(id: string) {
  const user = db.users.find(u => u.id === id);
  if (!user) throw new Error(`User ${id} not found`);
  return user;
}

function getPostById(id: string) {
  const post = db.posts.find(p => p.id === id);
  if (!post) throw new Error(`Post ${id} not found`);
  return post;
}
```

**After**:
```typescript
function findById<T extends { id: string }>(
  collection: T[],
  id: string,
  entityName: string
): T {
  const entity = collection.find(e => e.id === id);
  if (!entity) throw new Error(`${entityName} ${id} not found`);
  return entity;
}

function getUserById(id: string) {
  return findById(db.users, id, 'User');
}

function getPostById(id: string) {
  return findById(db.posts, id, 'Post');
}
```

### Rename for Clarity
**When**: Names are unclear or misleading

**Before**:
```typescript
function f(d: number): number {
  return d * 0.1;
}
```

**After**:
```typescript
function calculateTax(amount: number): number {
  const TAX_RATE = 0.1;
  return amount * TAX_RATE;
}
```

## Safety Checklist

Before committing refactored code:

- [ ] **All existing tests pass**
- [ ] **No business logic changed**
- [ ] **API signatures unchanged** (or properly versioned)
- [ ] **Performance not degraded** (benchmark if critical)
- [ ] **No new TypeScript errors**
- [ ] **Build succeeds**
- [ ] **Linter passes**
- [ ] **Documentation updated**

## When to Stop

Don't over-refactor:
- ✅ Code is more readable
- ✅ Duplication reduced
- ✅ Complexity decreased
- ❌ Don't chase perfection
- ❌ Don't refactor working code just because
- ❌ Don't optimize prematurely

## Integration with MCP

### Save Refactoring as Spec (Optional)

For large refactorings, create a spec:

```javascript
{
  "id": "refactor-[component]-[date]",
  "title": "Refactor [Component] for Maintainability",
  "description": "Planned refactoring of [component]:\n\n[Issues and proposed solutions]",
  "tasks": [
    {
      "id": "1",
      "title": "Extract helper functions",
      "status": "todo"
    },
    {
      "id": "2",
      "title": "Remove code duplication",
      "status": "todo"
    }
    // ... refactoring tasks
  ],
  "status": "planning"
}
```

Use `/start:implement refactor-[id]` to execute the plan.

## Completion Message

```
✅ Refactoring Complete: [Component/Module]

📊 Impact:
- Readability: Improved
- Complexity: Reduced by [N]%
- Duplication: Removed [N] instances
- Lines of code: [Before] → [After]

✅ Validation:
- All [N] tests passing
- No business logic changed
- Build successful
- No new warnings

📝 Changes:
1. [Change 1]
2. [Change 2]
3. [Change 3]

🎯 Benefits:
- [Benefit 1]
- [Benefit 2]

Full refactoring report above ⬆️
```

## Remember

- **Test first, refactor second** - Always have tests before refactoring
- **Small steps** - Change one thing at a time
- **Preserve behavior** - Business logic stays the same
- **Validate constantly** - Run tests after every change
- **Know when to stop** - Better, not perfect

---

**NOW BEGIN**: Analyze the code and execute the refactoring safely!
