# Feature-Sliced Design

```
src/
┣ app/                        # 1. APP LAYER: Initializers, global styles, routing, and entry points
┃ ┣ providers/
┃ ┃ ┗ router.ts              # (From router/index.ts)
┃ ┣ styles/                   # (From styles/)
┃ ┃ ┣ base.less
┃ ┃ ┣ main.less
┃ ┃ ┣ mixins.less
┃ ┃ ┗ tokens.less
┃ ┣ App.vue                   # Root component
┃ ┗ main.ts                   # Root entry point
┃
┣ pages/                      # 2. PAGES LAYER: Full application screens/views
┃ ┣ chat/
┃ ┃ ┗ ui/ChatPage.vue         # (From views/ChatView.vue)
┃ ┗ home/
┃   ┗ ui/HomePage.vue         # (From views/HomeView.vue)
┃
┣ widgets/                    # 3. WIDGETS LAYER: Large, self-contained layout blocks/sections
┃ ┣ general-layout/           # (Combines layout logic together)
┃ ┃ ┣ ui/TheHeader.vue        # (From components/TheHeader.vue)
┃ ┃ ┗ ui/TheFooter.vue        # (From components/TheFooter.vue)
┃ ┗ chat-workspace/
┃   ┗ ui/ChatCanvas.vue       # (From components/ChatCanvas.vue - structural block for chat)
┃
┣ features/                   # 4. FEATURES LAYER: User actions that bring business value
┃ ┣ impersonate-user/
┃ ┃ ┣ ui/ImpersonateUserModal.vue # (From components/ImpersonateUser.vue)
┃ ┃ ┗ ui/ImpersonateUserRow.vue   # (From components/ImpersonateUserRow.vue)
┃ ┗ add-user/
┃   ┗ ui/AddUserModal.vue     # (From components/AddUserModal.vue)
┃
┣ entities/                   # 5. ENTITIES LAYER: Pure business domains (User, Client, Chat Message)
┃ ┗ user/
┃   ┣ model/userStore.ts      # (From stores/userStore.ts)
┃   ┣ model/types.ts          # (User-specific types extracted from types/index.ts)
┃   ┗ api/mockClients.ts      # (From data/mockClients.ts - Mocked domain data/API calls)
┃
┗ shared/                     # 6. SHARED LAYER: Reusable assets, global types, and generic components
  ┣ assets/                   # (From assets/)
  ┃ ┣ logo.svg
  ┃ ┗ test-image.jpg
  ┗ types/
    ┗ index.ts                # Generic, non-business global TypeScript types
```
