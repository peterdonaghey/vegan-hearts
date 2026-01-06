# GitHub Issue Management - Personal Projects

## Personal Projects (vegan-hearts, etc.)

- Always assign issues to `peterdonaghey`
- Always add to project: `@personal-projects` (personal project #6)
- Project ID: `PVT_kwHOBdWZkc4BMApH`
- Use `gh project item-add 6 --owner peterdonaghey --url <issue-url>`
- **IMPORTANT**: Only add PARENT issues to the board, NEVER sub-issues
  - Sub-issues already show in parent's progress bar
  - Adding them clutters the board unnecessarily

## Complete Workflow for Personal Projects

1. Create parent issue via gh CLI or mcp tool, assign to peterdonaghey
2. Add parent issue to personal project: `gh project item-add 6 --owner peterdonaghey --url <issue-url>`
3. Create sub-issues if needed (they reference parent)
4. Link sub-issues: `gh sub-issue add <parent-number> <sub-number>`
5. **DO NOT add sub-issues to project board** - they show in parent's progress bar
6. If backlog/not urgent: status will default to Backlog

## Important Notes

- Do NOT add personal project issues to Point-Topic org projects
- Personal projects use `--owner peterdonaghey` (not Point-Topic)
- Point Topic work uses Point-Topic org project #1 (separate workflow in existing rules)

