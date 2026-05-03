# Guided Content Workflow: Prioritized User Stories

This document serves as the implementation roadmap for the Guided Content Workflow. Each story is prioritized and includes technical tasks for developers.

---

## 🔴 Priority 0: Core LinkedIn Flow (MVP)

### **[P0.1] Step 1: Intent & Platform Context**
- **User Story**: As a content creator, I want to define my strategic goal and target audience, so that the AI adopts the correct framework.
- **Technical Tasks**:
    - [ ] Create `INTENTS` configuration object with IDs, labels, and icons.
    - [ ] Implement `IntentSelector` component with grid layout.
    - [ ] Set `activeView` to 'guided' and initialize workflow state.
- **Human Explanation**: Ensures the AI has a "north star" before it starts writing.

### **[P0.2] Step 2: The Messy Idea Dump**
- **User Story**: As a busy professional, I want to offload my rough thoughts without worrying about quality, so that I can capture insights quickly.
- **Technical Tasks**:
    - [ ] Implement large `textarea` with auto-focus.
    - [ ] Add character minimum validation (e.g., 10 chars).
    - [ ] Create `generateStructurePrompt` builder in backend.
- **Human Explanation**: A safe space for half-baked ideas.

### **[P0.3] Step 3: Hook & Structure Selection**
- **User Story**: As a content editor, I want to review 3 distinct angles for my post, so that I can maintain creative control.
- **Technical Tasks**:
    - [ ] Create API endpoint `POST /api/enhance/guided/structure`.
    - [ ] Implement hook selection cards with "Option X" badges.
    - [ ] Store `selectedHook` and `selectedStructure` in state.
- **Human Explanation**: You act as the editor-in-chief, picking the best "vibe."

### **[P0.4] Step 4: Refined Post Generation**
- **User Story**: As a creator who values authenticity, I want to see a polished draft that follows my selected strategy, so that I can publish high-quality content.
- **Technical Tasks**:
    - [ ] Create API endpoint `POST /api/enhance/guided/post`.
    - [ ] Implement `generatePostPrompt` with `HUMAN_GUIDELINES` and `AI_BAN_LIST`.
    - [ ] Render the draft in a high-fidelity editor view.
- **Human Explanation**: The AI weaves your messy notes into a professional narrative.

---

## 🟡 Priority 1: Polish & Resilience

### **[P1.1] State Persistence (Safety Net)**
- **User Story**: As a user, I want my progress to be automatically saved, so that I don't lose my work on refresh.
- **Technical Tasks**:
    - [ ] Implement `useEffect` hook to sync `intent`, `messyIdea`, and `step` to `localStorage`.
    - [ ] Hydrate state on initial component mount.
- **Human Explanation**: Prevents data loss during accidental tab closes.

### **[P1.2] Flexible Navigation & Backtracking**
- **User Story**: As a creator, I want to go back to previous steps, so that I can refine my idea based on the hooks I see.
- **Technical Tasks**:
    - [ ] Implement `prevStep()` and `nextStep()` with bounds checking.
    - [ ] Ensure "Back" button is visible and functional on all steps except Step 1.
- **Human Explanation**: Content creation is non-linear; this allows for refining thoughts.

### **[P1.4] System Feedback & Error Handling**
- **User Story**: As a user, I want to see clear loading states and error messages, so that I understand what is happening during long AI generations or transcription failures.
- **Technical Tasks**:
    - [ ] Implement a global `WorkflowLoading` overlay with step-specific messaging.
    - [ ] Add `ErrorBoundary` around the `GuidedWorkflow` component.
    - [ ] Implement "Toast" notifications for API errors (e.g., "Transcription failed").
- **Human Explanation**: Prevents the user from feeling lost during the "magic" moments.

### **[P1.3] Step 5: Content Variations**
- **User Story**: As a social media manager, I want to see my post adapted into 5 different formats, so that I can choose the best fit.
- **Technical Tasks**:
    - [ ] Create API endpoint `POST /api/enhance/guided/variations`.
    - [ ] Implement `generateVariationsPrompt` (Short, Story, Authoritative, etc.).
    - [ ] Render variations in a responsive grid.
- **Human Explanation**: Gives you 5 different ways to say the same thing.

---

## 🔵 Priority 2: Advanced Features

### **[P2.1] Pluggable Voice Dictation (Modular Engine)**
- **User Story**: As a creator on the go, I want to dictate my thoughts, so that I can capture ideas hands-free.
- **Technical Tasks**:
    - [ ] Define `SpeechProvider` interface in frontend.
    - [ ] Implement `GroqSpeechProvider` adapter using Whisper-v3.
    - [ ] Add `Mic` button to Step 2 with "Listening..." indicator.
- **Human Explanation**: Speak your thoughts; the app transcribes them instantly.

### **[P2.2] Multilingual Auto-Detection**
- **User Story**: As a global creator, I want the system to auto-detect my language, so that I can brainstorm in my native tongue.
- **Technical Tasks**:
    - [ ] Pass `language: 'auto'` to the Groq/Whisper API.
    - [ ] Update prompts to maintain the detected language in the refined output.
- **Human Explanation**: No need to change settings; just talk and it understands.

---

## 🟢 Priority 3: Extensibility & Scale

### **[P3.1] Platform Switching (Future-Proofing)**
- **User Story**: As a multi-channel creator, I want the workflow to adapt to other platforms like TikTok or Twitter.
- **Technical Tasks**:
    - [ ] Refactor `GuidedPostOptions` to include a `platform` field.
    - [ ] Modularize `generatePostPrompt` to accept platform-specific constraints.
- **Human Explanation**: One engine, many destinations.
