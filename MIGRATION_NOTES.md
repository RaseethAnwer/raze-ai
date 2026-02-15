# Migration Notes

## Overview
- Created new Git branch `feature/multi-ai-model-switch-v2` for all changes.
- Old sidebar model selector component (`ModelSelector.jsx`) has been **commented out** and is no longer rendered. The code remains in the repository for reference and can be re‑enabled by restoring the import and JSX block.
- Backend dispatcher (`AIOrchestratorService`) replaces the previous routing logic in `AIService`. The original `callAI` method now delegates to the orchestrator.
- New service classes (`GemmaAIService`, `AmazonNovaService`, `MistralService`, `NemotronService`, `OpenRouterTextService`) encapsulate model‑specific API calls.
- The `ChatController` already accepted a `model` parameter; no further changes were needed.
- UI updates:
  - Added `ModelDropdown.jsx` component with glass‑style, neon gradient, and smooth animation.
  - Integrated the dropdown below the chat input and removed the old sidebar selector.
  - Updated chat header to display the selected model.
  - Preserved existing functionality; all previous features continue to work.

## Reverting
- Switch back to `main` branch.
- Remove the `feature/multi-ai-model-switch-v2` branch or reset it.
- Uncomment the import and JSX for `ModelSelector` in `Chat.jsx` if the old UI is needed.
- Remove the `AIOrchestratorService` and new service classes, and restore the original `AIService` implementation.

## Verification
- Backend builds successfully (`./gradlew build`).
- Frontend builds successfully (`npm run build`).
- Manual testing confirms model selection works and messages display the correct model tag.
