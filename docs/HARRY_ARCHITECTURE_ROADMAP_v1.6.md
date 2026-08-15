# HARRY
## Hybrid Adaptive Reasoning & Response sYstem
### Local-First Personal AI Operating Layer
### Full Architecture, Phased Roadmap, Security Model, Skills Framework, and Build Plan

**Version:** 1.6  
**Date:** 15 August 2026  
**Primary machine:** HP Pavilion Gaming 15  
**Current known RAM:** ~16 GB  
**Planned RAM:** 32 GB  
**Operating environment:** Fresh Windows installation  
**Primary interaction:** Voice-first, projector/no dedicated conventional display  
**Remote interaction:** Secure phone access  
**Cloud collaborators:** OpenAI / Codex + Anthropic / Claude  
**Local runtime:** Ollama + specialist local models

---


# North Star

> **Harry is a trusted personal AI teammate who grows more useful with the user while remaining transparent, permissioned, private by default, and under the user's control.**

Every architectural decision should be tested against five questions:

1. Does this make Harry more useful in daily life?
2. Does the user remain clearly in control?
3. Can Harry explain what it is doing and why?
4. Can the action be reversed or audited where practical?
5. Does this reduce unnecessary cloud dependence over time?

Harry should feel personal and capable, but never mysterious about authority.

---

# 1. Vision

Harry is not one chatbot and should not be designed as one.

Harry is a **personal AI operating layer** that sits above Windows and coordinates:

1. local language models;
2. cloud models;
3. voice input/output;
4. tools and applications;
5. files and project knowledge;
6. developer workflows;
7. email/calendar integrations;
8. automation;
9. remote phone access;
10. permissions, secrets, logging, and safety.

Harry should feel like one assistant even though many models and tools may work behind the scenes.

The target interaction is:

> **User:** “Harry, I received a new project brief by email. Read it, extract the requirements, propose an architecture, create a project plan and set up the repository. Don’t make external changes until I approve them.”

Harry should then:

- locate the relevant email;
- ingest only the required information;
- use a local model for simple extraction if sufficient;
- escalate architecture reasoning to OpenAI or Claude when appropriate;
- produce a plan;
- ask for approval before consequential operations;
- invoke the coding agent after approval;
- create project files;
- initialize Git;
- run tests;
- summarize what happened verbally;
- retain project context in structured memory.

---

# 2. Non-negotiable architectural principles

## 2.1 Harry is the orchestrator, not the model

Do not hard-code Harry’s personality, memory, permissions, or workflows into one model provider.

Harry should expose a stable internal interface such as:

```text
User
  ↓
Voice / phone / CLI client
  ↓
Harry Core
  ├── Intent + task planner
  ├── Policy / permissions
  ├── Model router
  ├── Skills registry
  ├── Memory
  ├── Workflow engine
  └── Audit log
       ↓
Models + tools + operating system
```

If OpenAI, Anthropic, or the preferred local model changes, Harry should continue functioning.

## 2.2 Local first

Routine operations should remain local where practical:

- wake-word detection;
- speech activity detection;
- transcription;
- basic intent classification;
- simple summarization;
- local file search;
- memory lookup;
- text-to-speech;
- deterministic system actions.

## 2.3 Cloud only when justified

Cloud escalation should occur when Harry detects that a task requires:

- deeper reasoning;
- sophisticated coding;
- difficult debugging;
- large context;
- high-quality image interpretation;
- external research;
- specialist generation;
- complex planning.

Only the minimum necessary context should be transmitted.

## 2.4 Least privilege

Harry must not run with unrestricted Administrator privileges.

Skills should receive only the permissions they need.

Example:

```text
file.read
file.search
app.open
git.status
git.commit
powershell.safe
email.read

# Higher risk:
file.delete
email.send
git.push
package.install
system.admin
```

Higher-risk capabilities require explicit approval.

## 2.5 Observable actions

Every tool call should produce an audit record:

```json
{
  "timestamp": "...",
  "request_id": "...",
  "skill": "git.commit",
  "arguments_summary": "...",
  "approval": "user-approved",
  "result": "success"
}
```

Harry should be able to answer:

> “Harry, what did you change in the last hour?”

## 2.6 Reversible by default

Before code-editing or destructive workflows:

- create Git checkpoints;
- use Trash instead of irreversible deletion;
- prefer drafts over sending;
- use dry runs;
- back up configuration;
- record previous state.

---

# 3. Critical feasibility assessment

## 3.1 Very achievable on the current laptop

The current machine can support:

- always-on wake-word detection;
- voice-activity detection;
- local speech-to-text;
- local text-to-speech;
- 2B–4B local language models;
- modest 7B/8B quantized models in some configurations, though not necessarily comfortably;
- local embeddings;
- file indexing;
- Python services;
- PowerShell automation;
- Git;
- VS Code;
- Ollama;
- Codex CLI;
- Claude Code;
- remote access through a private overlay network;
- structured memory;
- task queues;
- basic local image understanding with small multimodal models.

## 3.2 What 32 GB RAM changes

32 GB is highly recommended because it gives room for:

- larger local models;
- bigger context windows;
- embeddings + transcription + LLM simultaneously;
- Docker containers;
- IDE + browser + local inference;
- indexing;
- more reliable multitasking.

However:

> **RAM is not VRAM.**

If the Pavilion has an NVIDIA GTX 1650/1650 Ti-class GPU with around 4 GB VRAM, upgrading system RAM will not turn it into a high-end AI GPU.

CPU/RAM inference will still be important.

## 3.3 What should remain cloud-assisted

For this machine, cloud models should remain the default for:

- frontier reasoning;
- major software architecture decisions;
- long autonomous coding jobs;
- complex visual interpretation;
- high-quality image generation;
- video generation;
- difficult multimodal reasoning;
- large-scale research.

## 3.4 “Always on” does not mean “always recording to cloud”

The preferred pipeline is:

```text
Microphone
 ↓
Local wake word
 ↓
Local VAD
 ↓
Local transcription
 ↓
Harry
```

Audio should not be transmitted to cloud providers unless a specific cloud voice feature is deliberately enabled.

---

# 4. Recommended technical architecture

## 4.1 Core runtime

**Language:** Python  
**API framework:** FastAPI  
**Data validation:** Pydantic  
**Local model server:** Ollama  
**Database:** SQLite initially  
**Vector retrieval:** SQLite extension / lightweight vector DB initially; migrate only if needed  
**Task execution:** asyncio initially; queue framework later  
**Configuration:** TOML/YAML + environment variables  
**Secrets:** Windows Credential Manager initially; dedicated secret store later  
**Logging:** structured JSON logs  
**Service management:** Windows Task Scheduler initially; Windows Service later

Why Python:

- strongest AI ecosystem;
- strong local speech libraries;
- simple Windows automation;
- excellent provider SDK support;
- FastAPI works well for local and remote clients.

---

# 5. Model architecture

Harry should use a **capability router**, not a provider router.

Bad design:

```python
if hard:
    use_claude()
else:
    use_openai()
```

Better design:

```text
Task requirements
  ├── latency
  ├── privacy
  ├── reasoning depth
  ├── coding
  ├── vision
  ├── context size
  ├── tool use
  ├── cost
  └── offline requirement
        ↓
Capability router
        ↓
Selected model/provider
```

## 5.1 Local models

Start with lightweight models.

Recommended initial candidates in Ollama:

### Qwen 3.5 4B
Candidate general local assistant.

```powershell
ollama run qwen3.5:4b
```

### Qwen 3 4B
Good fallback candidate with tool/thinking variants.

```powershell
ollama run qwen3:4b
```

### Gemma 3 4B
Useful general + vision candidate.

```powershell
ollama run gemma3:4b
```

### Qwen3-VL 2B or 4B
For local screenshot/image interpretation where performance is acceptable.

```powershell
ollama run qwen3-vl:2b
```

Do not choose Harry’s permanent local model until the laptop has been benchmarked.

Benchmark:

- tokens/sec;
- first-token latency;
- peak RAM;
- GPU utilization;
- idle memory;
- quality on Harry’s real tasks.

## 5.2 OpenAI

Roles:

- complex reasoning;
- system architecture;
- research;
- difficult debugging;
- specialist multimodal work;
- high-quality code planning;
- cloud coding via Codex.

**Important:** ChatGPT subscription authentication and API authentication are separate concepts.

Codex CLI can authenticate using a ChatGPT account or an API key. Harry’s own custom OpenAI API calls should use an API credential and API billing unless a supported product integration explicitly provides another mechanism.

Official:
- https://developers.openai.com/codex/
- https://developers.openai.com/codex/auth
- https://platform.openai.com/docs/

## 5.3 Anthropic / Claude

Roles:

- alternative deep-reasoning path;
- architecture critique;
- long-document analysis;
- second-opinion review;
- coding through Claude Code;
- adversarial review of OpenAI-produced solutions.

Claude Code can use eligible Claude subscription login flows; Harry’s own direct Claude API orchestration requires an Anthropic API credential or another supported platform provider.

Official:
- https://docs.anthropic.com/
- https://docs.anthropic.com/en/docs/claude-code/setup

## 5.4 OpenAI + Claude collaboration pattern

Harry should not waste money sending every request to both.

Use patterns such as:

### Pattern A — Single best model

```text
Task → Router → Claude OR OpenAI → Result
```

Use for normal complex tasks.

### Pattern B — Architect + critic

```text
OpenAI generates architecture
        ↓
Claude critiques assumptions / failure modes
        ↓
Harry synthesizes
```

Or reverse the roles.

Use for:

- important architecture;
- difficult migrations;
- high-impact project planning.

### Pattern C — Planner + implementer

```text
Reasoning model → implementation plan
                     ↓
                Codex/Claude Code
                     ↓
                  tests
                     ↓
              reviewer model
```

### Pattern D — Parallel hypothesis

For difficult bugs:

```text
Codex hypothesis A ┐
                   ├→ Harry compares → selected fix
Claude hypothesis B┘
```

This should be opt-in because it consumes more cloud usage.

---

# 5A. Subscription-first cloud escalation — no API budget required initially

The first implementation should **not require OpenAI API or Anthropic API billing**.

Harry can use the coding assistants already available through the user's subscriptions:

```text
Harry
 ├─ Local Ollama model
 ├─ Codex CLI
 └─ Claude Code CLI
```

The correct integration is command-line orchestration, not screen-scraping the terminals.

### Codex bridge

Codex supports subscription sign-in and a non-interactive CLI execution path.

Conceptually:

```text
Harry task
  ↓
Codex adapter
  ↓
codex exec "<scoped task>"
  ↓
structured/stdout result
  ↓
Harry verifies result
```

Harry should capture:

- exit status;
- stdout / structured output;
- files changed;
- Git diff;
- tests;
- elapsed time;
- task classification.

### Claude Code bridge

Harry should invoke Claude Code through its supported CLI/agent interfaces, using the user's authenticated Claude account where the plan permits it.

Harry should never steal, copy, or repurpose provider authentication tokens as generic API credentials.

### Important boundary

A ChatGPT or Claude subscription is **not a general-purpose API entitlement**.

This architecture therefore distinguishes:

1. **subscription-native tools** — Codex CLI / Claude Code;
2. **direct provider APIs** — optional later, separately billed/configured;
3. **local models** — Ollama, no cloud request.

If API access is added later, it plugs into the existing provider gateway without changing Harry's architecture.

### Cloud escalation UX

Harry should announce escalation succinctly:

> “This exceeds my local confidence threshold. I’m consulting Codex.”

or:

> “I want a second architecture review. I’m consulting Claude.”

The user should be able to configure whether these announcements are spoken every time or only for costly/high-risk tasks.

---


# 5B. User Identity, Onboarding Experience, and Personality Engine

Harry should not begin as a generic assistant with a blank personality.

The first successful voice experience should include a deliberate **first-run conversation** that establishes who the user is, how Harry should behave, what Harry may remember, and what Harry should never assume.

## First-run experience

After the voice loop is working reliably:

```text
User: "Yo Harry."
        ↓
Wake word detected locally
        ↓
Harry: "Hey. I'm Harry. Before we start properly, I'd like to learn how you want us to work together."
        ↓
Guided onboarding conversation
        ↓
Identity + preferences saved locally
        ↓
User reviews / confirms summary
        ↓
Harry becomes ready for normal use
```

The onboarding should feel conversational rather than like a form.

Harry can ask questions such as:

- What should I call you?
- What do you spend most of your time working on?
- What are you trying to improve in your life or career?
- How concise should I normally be?
- How much humor do you like?
- Do you want me to challenge weak ideas or mostly help execute them?
- Which topics should remain local-only?
- What information am I allowed to remember?
- Which actions should always require confirmation?
- When I am unsure, should I ask first or make a reversible best-effort attempt?

Harry should never force the user to answer every question.

## Identity profile

Store a small, explicit local profile rather than hiding user assumptions in prompts.

Example:

```yaml
user:
  preferred_name: Uzi
  locale: en-ZA
  timezone: Africa/Johannesburg

interaction:
  verbosity: medium
  directness: high
  humor: medium
  challenge_level: high
  initiative: medium

privacy:
  default_cloud_policy: local_first
  remember_preferences: true
  remember_projects: true

assistant:
  name: Harry
  wake_phrase: "Yo Harry"
  voice_profile: harry_default
```

This profile should remain editable through natural language:

> "Harry, be a bit less chatty."

> "Harry, don't remember this conversation."

> "Harry, call me Uzi from now on."

Changes should be auditable and reversible.

## Memory consent

Harry should distinguish between:

- information used only in the current conversation;
- information saved as a long-term preference;
- project-specific memory;
- sensitive information that should not be stored.

Harry should summarize proposed long-term memory when needed:

> "You mentioned that you prefer concise technical explanations. Do you want me to remember that?"

The user must be able to inspect and delete remembered information.

## Personality engine

Harry's personality should be configuration, not hard-coded behavior.

Possible dimensions:

```yaml
personality:
  warmth: 0.65
  humor: 0.55
  formality: 0.35
  directness: 0.85
  optimism: 0.60
  initiative: 0.70
  challenge_level: 0.80
```

The numbers are implementation details; the user should be able to speak naturally:

> "Harry, be more relaxed."

> "Be more critical when we're reviewing architecture."

> "Keep work mode professional."

The personality engine can also apply **mode overlays**:

```text
Base Harry
  ├─ Personal overlay
  ├─ Developer overlay
  ├─ Career overlay
  ├─ Research overlay
  └─ Creative overlay
```

This keeps Harry recognizably the same assistant while adapting to the task.

## Voice profiles

Harry's voice should be swappable independently from the language model.

A voice profile may contain:

```yaml
voice:
  engine: kokoro
  voice_id: selected_local_voice
  speed: 1.0
  expressiveness: medium
  response_pause_ms: 180
```

The user should be able to audition several local voices and select one.

Harry's target voice qualities:

- calm;
- confident;
- natural;
- technically competent;
- not excessively cheerful;
- conversational;
- capable of dry humor.

Harry may be inspired by the *behavioral feel* of fictional assistants, but should use an original voice rather than cloning an identifiable actor or copyrighted character performance.

## Wake-word experience

The intended mature interaction is:

```text
User: "Yo Harry."
        ↓
Local wake-word engine activates
        ↓
Optional subtle chime
        ↓
Harry opens a short listening window
        ↓
User continues speaking naturally
```

Harry may optionally respond immediately:

> "Yeah?"

> "What's up?"

> "Morning. What have we got?"

The exact acknowledgement should vary slightly so it does not feel robotic.

The wake word should run locally and should **not** stream room audio to cloud services.

## Conversation session behavior

After wake-up, Harry should support a short active session so the user does not need to repeat "Yo Harry" before every sentence.

Example:

```text
"Yo Harry."
"Open the Atlas project."
"Run the tests."
"What failed?"
"Okay, ask Codex to inspect that."
```

The session closes after:

- explicit dismissal;
- configurable inactivity timeout;
- privacy mode activation.

## Barge-in

Later voice milestones should support interruption:

```text
Harry speaking
   ↓
User begins talking
   ↓
TTS stops
   ↓
Harry listens
```

This requires echo cancellation / VAD tuning and should not block Phase 1.

## Onboarding deliverable

A completed onboarding milestone ships:

1. first-run voice conversation;
2. user profile;
3. editable personality profile;
4. selected local voice;
5. wake phrase;
6. memory-consent settings;
7. confirmation/permission preferences.

This is the point where Harry stops feeling like a generic local chatbot and begins functioning as a personal system.

---

# 6. Speech architecture

Target voice pipeline:

```text
Microphone
  ↓
Wake Word
  ↓
Voice Activity Detection
  ↓
Speech-to-Text
  ↓
Harry Core
  ↓
Response
  ↓
Text-to-Speech
  ↓
Speakers
```

## 6.1 Wake word

Primary candidate:

**openWakeWord**  
https://github.com/dscripka/openWakeWord

It already includes wake-word infrastructure and can later be trained for a custom phrase.

Phase 1 recommendation:

- first use push-to-talk;
- then test an existing wake word;
- only then train “Hey Harry”.

Reason: debugging STT + TTS + LLM + wake-word simultaneously makes failures hard to isolate.

## 6.2 Voice activity detection

Use **Silero VAD**.

https://github.com/snakers4/silero-vad

Purpose:

- detect when speech begins;
- detect when speech ends;
- avoid transcribing silence;
- enable interruption/barge-in later.

## 6.3 Speech-to-text

Primary recommendation:

**faster-whisper**  
https://github.com/SYSTRAN/faster-whisper

Alternative:

**whisper.cpp**  
https://github.com/ggml-org/whisper.cpp

Start with faster-whisper because Python integration is straightforward.

Model selection should be benchmarked.

## 6.4 Text-to-speech

Do **not** make the old Rhasspy Piper repository a permanent dependency: that original repository is archived.

Primary candidate:

**Kokoro**  
https://github.com/hexgrad/kokoro

It is lightweight enough to be practical locally.

Piper can remain a fallback experiment, but Harry should prefer maintained software.

## 6.5 Voice personality

Harry should have an original voice and interaction style.

Do not attempt to clone the exact voice of a copyrighted fictional assistant or an identifiable actor without appropriate rights/consent.

Desired behavior can still be:

- calm;
- concise;
- precise;
- dry wit;
- proactive;
- technically competent.

---

# 7. Harry Core

Recommended repository:

```text
harry/
├─ README.md
├─ AGENTS.md
├─ pyproject.toml
├─ .env.example
├─ config/
│  ├─ harry.yaml
│  ├─ permissions.yaml
│  ├─ personality.yaml
│  ├─ voice.yaml
│  └─ models.yaml
├─ src/harry/
│  ├─ core/
│  │  ├─ orchestrator.py
│  │  ├─ planner.py
│  │  ├─ router.py
│  │  ├─ policy.py
│  │  └─ events.py
│  ├─ voice/
│  │  ├─ wakeword.py
│  │  ├─ vad.py
│  │  ├─ stt.py
│  │  └─ tts.py
│  ├─ models/
│  │  ├─ base.py
│  │  ├─ ollama.py
│  │  ├─ openai.py
│  │  └─ anthropic.py
│  ├─ skills/
│  │  ├─ registry.py
│  │  ├─ filesystem/
│  │  ├─ windows/
│  │  ├─ git/
│  │  ├─ email/
│  │  └─ developer/
│  ├─ memory/
│  │  ├─ store.py
│  │  ├─ retrieval.py
│  │  └─ policy.py
│  ├─ workflows/
│  ├─ security/
│  ├─ api/
│  └─ observability/
├─ tests/
├─ scripts/
└─ docs/
```

---

# 8. Skill architecture

A **skill** is a capability Harry can invoke.

Skills should be deterministic programs wherever possible.

Example manifest:

```yaml
name: file.read
version: 1
description: Read an allowed local file.
risk: low

inputs:
  path: string

permissions:
  - filesystem.read

approval:
  required: false

constraints:
  roots:
    - "C:/Users/<user>/HarryWorkspace"
```

Higher-risk skill:

```yaml
name: email.send
risk: high

permissions:
  - email.send

approval:
  required: true

audit:
  log_full_action: true
```

Skill execution contract:

```text
Intent
 ↓
Planner proposes tool call
 ↓
Policy engine validates
 ↓
Approval if required
 ↓
Skill executes
 ↓
Result returned
 ↓
Audit log
```

---


# 8A. Windows Authority Model — capable, but never unrestricted by accident

Harry may eventually be able to perform almost any Windows action that the user could perform, **but that does not mean Harry should run permanently with unrestricted Administrator rights**.

The design target is:

```text
Harry understands the request
        ↓
Skill registry identifies required capability
        ↓
Policy engine checks risk + prior permission
        ↓
Low risk → execute
Medium risk → execute if previously allowed / otherwise ask
High risk → always ask
Admin action → temporary explicit elevation
```

## Permission memory

Harry can remember durable user choices where appropriate.

Example:

> "Harry, you may always open VS Code and create folders inside my Personal Projects directory without asking."

This can become:

```yaml
grants:
  - capability: app.open
    scope: vscode
    approval: automatic

  - capability: file.create
    scope: "C:/Users/Uzi/Personal Projects/**"
    approval: automatic
```

Permissions should be scoped rather than blanket.

Bad:

```text
"Harry can do anything on Windows."
```

Better:

```text
"Harry may modify files inside approved project directories,
open approved applications, and execute allowlisted development commands."
```

## Always-confirm actions

Even if Harry has performed them before, these should normally remain explicit:

- permanent deletion outside disposable workspaces;
- formatting drives;
- registry/security-policy changes;
- disabling antivirus/firewall controls;
- exposing ports to the public internet;
- installing kernel/system drivers;
- sending money or making purchases;
- sending external communications under the user's identity;
- changing account credentials;
- revealing secrets/API keys;
- destructive Git operations affecting shared remotes;
- publishing or deploying externally.

## Temporary elevation

When Administrator access is needed:

1. Harry explains the exact action;
2. user approves;
3. elevation is granted only for the scoped operation;
4. the elevated process exits;
5. Harry records the result.

Harry should never keep an always-on elevated shell waiting for commands.

## Emergency stop

Harry should have a universal stop mechanism.

Examples:

- physical keyboard shortcut;
- spoken phrase such as "Harry, stop everything";
- phone-client stop button.

The stop command should:

- cancel current workflows where possible;
- stop further tool calls;
- preserve logs;
- not delete partially completed work automatically.

---

# 9. Permission tiers

## Tier 0 — Read-only

- local conversation;
- file search;
- file read;
- git status;
- system status;
- email read;
- calendar read.

## Tier 1 — Reversible local changes

- create file;
- edit code;
- create folder;
- open app;
- create Git branch;
- create draft.

## Tier 2 — External/reputational changes

Requires approval:

- send email;
- push Git;
- create PR;
- post content;
- modify calendar;
- install packages from new sources.

## Tier 3 — Destructive/admin

Always explicit approval:

- delete files;
- system settings;
- elevated PowerShell;
- credentials;
- registry edits;
- uninstall software;
- firewall changes.

---


# 9A. Operating modes

Modes are **policy and context lenses**, not separate personalities or separate assistants.

Harry should normally select the mode automatically from intent, while allowing explicit commands such as:

> “Harry, switch to Career Mode.”

## Personal / Executive Assistant Mode

Purpose:

- personal planning;
- files;
- email/calendar;
- entertainment;
- reminders/workflows when supported;
- household/projector integrations;
- browser assistance.

Example:

> “Harry, put on the next episode of my show.”

Preferred implementation order:

1. native app/API integration if available;
2. deterministic browser automation;
3. desktop vision/computer-use only as a fallback.

Harry must never expose streaming-service credentials to model prompts. Login should remain in the browser/password manager. DRM, CAPTCHAs, UI redesigns and service terms may limit perfect automation.

## Developer Mode

Purpose:

- personal software projects;
- repository understanding;
- architecture;
- implementation;
- debugging;
- testing;
- code review;
- deployment planning.

Uses:

- local coding model for small tasks;
- Codex CLI;
- Claude Code;
- Git checkpoints;
- test and lint skills.

Work belonging to an employer must remain logically separated from personal product repositories and must respect employer IP, confidentiality, and security requirements.

## Research Mode

Purpose:

- gather current information;
- compare sources;
- produce evidence-backed briefs;
- feed verified knowledge into projects.

Research Mode is necessarily online when current web information is required.

## Creative Mode

Purpose:

- design ideation;
- image analysis/generation;
- media workflows;
- product branding;
- scripts/storyboards;
- visual assets.

Local models can handle lightweight analysis; demanding image/video generation remains specialist/cloud-assisted initially.

## Product Studio Mode

Purpose:

Turn a validated problem into a sellable personal product.

Workflow:

```text
idea
 ↓
problem validation
 ↓
requirements
 ↓
architecture
 ↓
prototype
 ↓
tests
 ↓
security review
 ↓
packaging
 ↓
launch checklist
```

Harry coordinates local tools, Codex and Claude Code but remains the source of project state, approvals and memory.

## Career Intelligence Mode

Career Mode is a first-class subsystem for continuously converting **real evidence of work** into career capital.

### Inputs

Potential inputs:

- Git commits and pull requests the user is permitted to analyze;
- issue/ticket activity;
- personal Harry project activity;
- shipped features;
- technologies used;
- test/quality improvements;
- architecture decisions;
- quantified outcomes manually supplied by the user;
- training/certifications;
- interview performance.

### Critical confidentiality boundary

Harry must **never publish employer proprietary code, confidential ticket content, client names, internal architecture, secrets, security details, or unapproved business metrics**.

Work Git data should primarily be converted into sanitized signals:

```text
raw private work evidence
      ↓
local summarization / redaction
      ↓
career-safe achievement record
      ↓
CV / LinkedIn / portfolio candidate
```

Example safe transformation:

```text
Private evidence:
Implemented internal settlement reconciliation service for Client X.

Career-safe record:
Built and productionized a reconciliation service that improved reliability
of high-volume transaction processing.
```

The final wording still requires user approval.

### Living career artifacts

Harry maintains:

- master CV;
- role-specific CV variants;
- skills inventory;
- achievement bank;
- LinkedIn change proposals;
- portfolio project records;
- public-safe technical case studies;
- interview history;
- job-target preferences.

### Weekly career review

Once enabled:

```text
Week's permitted activity
  ↓
Evidence extraction
  ↓
Achievement/skill changes
  ↓
Draft CV delta
  ↓
Draft LinkedIn delta
  ↓
Portfolio delta
  ↓
User approval
```

Harry should show **diffs**, not silently rewrite the user's public identity.

### Opportunity radar

Weekly:

1. search current openings;
2. score them against skills, seniority, location/remote constraints and goals;
3. explain gaps honestly;
4. present a shortlist — usually top 3;
5. user selects the role to pursue.

Harry should never mass-apply automatically by default.

### Role dossier

For the selected role Harry creates:

- company summary;
- product/business model;
- job requirements;
- likely interview stages;
- relevant technical domains;
- matching experience;
- gaps;
- likely behavioral questions;
- likely system-design questions;
- likely coding topics;
- questions the user should ask the company.

### Interview Lab

Harry acts as an adaptive interviewer.

Modes:

- recruiter screen;
- hiring manager;
- behavioral;
- technical fundamentals;
- live coding;
- system design;
- architecture critique;
- leadership;
- salary/offer conversation.

After each answer Harry records a rubric:

```text
technical correctness
structure
clarity
confidence
specificity
tradeoff awareness
communication
evidence/examples
```

Then Harry gives:

- score;
- strongest point;
- weakest point;
- corrected answer structure;
- follow-up drill;
- progress against previous sessions.

The objective is **measurable improvement**, not artificial praise.

### Career Mode skills

- `career.ingest_activity`
- `career.redact_work_evidence`
- `career.extract_achievements`
- `career.skill_inventory`
- `career.cv_diff`
- `career.linkedin_diff`
- `career.portfolio_diff`
- `career.find_roles`
- `career.score_role_fit`
- `career.role_dossier`
- `career.interview_start`
- `career.interview_score`
- `career.interview_progress`
- `career.application_checklist`

Public writes, profile edits and applications require approval.

---

# 9B. Experience Compiler — how Harry gets operationally smarter

Harry does **not** automatically change the neural weights of the local model every time Codex or Claude answers.

Instead, Harry learns at the system level.

## Learning loop

```text
Task arrives
 ↓
Can local Harry solve it confidently?
 ├─ Yes → execute locally
 └─ No → consult Codex/Claude
              ↓
        successful result
              ↓
        extract procedure
              ↓
         generate tests
              ↓
        sandbox replay
              ↓
        promote capability
```

## Capability maturity levels

### L0 — Unknown
Harry has no reliable procedure.

### L1 — Assisted
Harry solved it with Codex/Claude.

### L2 — Remembered
Harry has a structured lesson and prior trace.

### L3 — Playbook
Harry has a deterministic runbook.

### L4 — Skill candidate
The procedure has been encoded as a local skill.

### L5 — Verified local skill
It passes repeatable tests without cloud help.

### L6 — Local default
Harry attempts the local skill first and escalates only on failure/low confidence.

## Artifacts generated after assisted tasks

Depending on the task:

- procedure/runbook;
- preconditions;
- command template;
- failure modes;
- verification steps;
- regression tests;
- examples;
- redaction rules;
- confidence score;
- provenance;
- model consulted.

Example:

```yaml
capability: python.fastapi.create_endpoint
learned_from: codex
maturity: verified_local
success_count: 12
failure_count: 1
requires_cloud: false
last_verified: 2026-08-14
```

## Reflection engine

After significant tasks:

1. What was requested?
2. What information was missing?
3. Why did local execution fail or escalate?
4. What did the external agent contribute?
5. Can the solution become deterministic?
6. What tests prove the new skill works?
7. What must remain model reasoning rather than a hard-coded skill?

## Consultation log

Harry records every external consultation.

The dashboard should answer:

- Which tasks consume the most Codex/Claude usage?
- Which tasks are now locally solved?
- Which repeated cloud task should become the next local skill?
- Where does Harry still fail?

## Mentor engine

When Harry repeatedly escalates the same class of problem, the mentor engine proposes:

> “I have consulted Codex for this workflow six times. I can turn the stable part into a local skill and test it. Approve?”

## Future model adaptation

Later, after enough high-quality and legally usable data has accumulated, experiments may include:

- prompt optimization;
- local retrieval tuning;
- supervised fine-tuning;
- adapters/LoRA;
- preference tuning;
- specialist small models.

These are **later research phases**, not prerequisites for Harry.

The near-term route to “more offline” is skills + memory + retrieval + local models, because it is cheaper, inspectable and reversible.

---

# 10. Phase roadmap


Every phase must ship something usable. A phase is not complete merely because infrastructure was installed.

| Phase | Shippable deliverable |
|---|---|
| 0 | Reproducible Harry repository + agent governance/shared memory + documented development laptop with real hardware report |
| 1 | Offline push-to-talk voice conversation with Harry + first-run onboarding/profile setup |
| 2 | Voice-controlled local assistant with safe file/app/system skills |
| 3 | Searchable project knowledge and explicit long-term memory; Phase 3B adds an optional disposable brain visualizer projection |
| 4 | Voice-driven developer assistant using local tools + Codex + Claude Code |
| 5 | Read/draft personal-assistant workflow for email/calendar with approvals |
| 6 | Capability-based model router with subscription-first escalation |
| 7 | Screenshot/image/video inspection pipeline |
| 8 | Authenticated private phone client over a secure network |
| 9 | Cancellable scheduled/multi-step workflows with durable state |
| 10 | Controlled GUI computer-use fallback for apps without APIs/CLIs |
| 11 | Always-on service with health checks, backup/restore and auditability |
| 12 | Projector/room integration with visible assistant state |
| 13 | Career Intelligence dashboard + weekly career review + Interview Lab |
| 14 | Product Studio pipeline that takes one idea through a tested prototype |
| 15 | Experience Compiler that promotes repeated cloud-assisted tasks into verified local skills |


---

# PHASE 0 — Fresh machine foundation

## Objective

Turn the reset laptop into a known, secure development environment and record its actual hardware.

## Install

### Windows updates
Run Windows Update fully.

### HP drivers
Use HP’s official support site for the exact Pavilion serial/product number.

### NVIDIA driver
If an NVIDIA GPU is present, install the official NVIDIA driver.

### Git
https://git-scm.com/download/win

### Python
https://www.python.org/downloads/windows/

For ecosystem compatibility, use a supported Python version confirmed by Harry’s dependencies. Avoid blindly choosing the newest major version.

### VS Code
https://code.visualstudio.com/download

### Node.js
Needed for some coding tools.

https://nodejs.org/

### Ollama
https://ollama.com/download/windows

### Optional
- Windows Terminal
- PowerShell 7
- GitHub CLI

## Install Codex CLI

Follow:
https://developers.openai.com/codex/cli

Codex supports ChatGPT sign-in for local Codex use.

## Install Claude Code

Follow:
https://docs.anthropic.com/en/docs/claude-code/setup

Use your eligible Claude subscription login if supported by your plan.

## Hardware audit

Record:

```powershell
Get-CimInstance Win32_Processor |
  Select-Object Name, NumberOfCores, NumberOfLogicalProcessors

Get-CimInstance Win32_PhysicalMemory |
  Select-Object Manufacturer, Capacity, Speed, PartNumber

Get-CimInstance Win32_VideoController |
  Select-Object Name, AdapterRAM, DriverVersion

Get-PhysicalDisk |
  Select-Object FriendlyName, MediaType, Size
```

Also run:

```powershell
nvidia-smi
```

if NVIDIA tools are available.

Save results to:

```text
docs/hardware.md
```

## Phase 0 skills

- `system.hardware_report`
- `system.disk_status`
- `system.network_status`
- `system.process_list`
- `system.battery_status`

## Exit criteria

- Windows fully updated;
- GPU driver installed;
- Python works;
- Git works;
- VS Code works;
- Ollama works;
- Codex works;
- Claude Code works;
- hardware report committed to the repository.

---

# PHASE 1 — Harry speaks

## Objective

A complete local voice loop.

Target:

> Press a key → speak → local transcription → local LLM → local speech.

Wake word comes after the loop is stable.

## Components

- microphone capture;
- Silero VAD;
- faster-whisper;
- Ollama;
- Qwen/Gemma small model;
- Kokoro TTS;
- audio output.

## Initial workflow

```text
Push-to-talk
 ↓
STT
 ↓
Ollama
 ↓
TTS
```

Then:

```text
Wake word
 ↓
VAD
 ↓
STT
 ↓
Ollama
 ↓
TTS
```

## Phase 1 skills

- `conversation.respond`
- `profile.create`
- `profile.read`
- `profile.update`
- `profile.delete`
- `personality.get`
- `personality.update`
- `voice.list_profiles`
- `voice.set_profile`
- `wakeword.status`
- `system.time`
- `system.health`
- `audio.input_test`
- `audio.output_test`
- `model.status`

## Phase 1 acceptance test

Say:

> “Harry, tell me what model you’re running and whether we’re offline.”

Harry should answer locally.

Disconnect Wi-Fi and repeat.


## Phase 1B — Personalization milestone

Once the basic loop is stable, ship the first personal experience:

```text
"Yo Harry" or push-to-talk
        ↓
Harry introduces himself
        ↓
short onboarding conversation
        ↓
local user profile created
        ↓
voice + interaction style selected
        ↓
profile summary confirmed
```

The user should then be able to say:

> "Harry, what do you remember about how I like to work?"

and receive an accurate, editable summary.

## Phase 1 critical limitation

Do not expect flawless full-duplex conversation yet.

Barge-in, echo cancellation and interruption handling are separate engineering problems.

---

# PHASE 2 — Harry Core + tool execution

## Objective

Move from “voice chatbot” to “assistant that can do things.”

Introduce:

- orchestrator;
- skill registry;
- permission engine;
- audit log;
- task IDs;
- approval workflow.

## Phase 2 skills

### Windows
- `app.open`
- `app.close`
- `system.volume`
- `system.clipboard.read`
- `system.clipboard.write`
- `browser.open_url`

### Files
- `file.search`
- `file.read`
- `file.create`
- `file.write`
- `file.move`
- `folder.create`

Deletion remains approval-gated.

### Shell
- `powershell.safe`
- `python.run_script`

Do not expose an unrestricted shell directly to the LLM.

Use allowlisted wrappers.

## Example

User:

> “Harry, create a folder called prototype and open it in VS Code.”

Harry:

1. parses intent;
2. invokes `folder.create`;
3. invokes `app.open`;
4. speaks result.

## Exit criteria

Harry can perform at least 10 useful deterministic laptop operations safely.

---

# PHASE 3 — Knowledge, memory and local retrieval

## Objective

Give Harry durable context without dumping your entire laptop into model prompts.

Memory must be explicit and typed.

## Memory categories

### Session memory
Current conversation/task.

### Project memory
Facts about a repository/project.

### Preference memory
Stable interaction preferences.

### Episodic memory
Important completed events.

### Knowledge index
Searchable file content.

## Database

Start with SQLite.

Suggested tables:

```text
memories
projects
tasks
conversations
skill_runs
documents
document_chunks
approvals
```

## Embeddings

Use a small local embedding model through Ollama where practical.

Candidate:
- Qwen3 embedding 0.6B

## Phase 3 skills

- `memory.remember`
- `memory.forget`
- `memory.search`
- `project.create`
- `project.context`
- `document.index`
- `document.search`
- `document.summarize`

## Privacy rule

Harry should never index:

- browser credential stores;
- `.ssh` private keys;
- secrets files;
- password vaults;
- arbitrary AppData;

unless explicitly configured.

---

# PHASE 4 — Developer Mode

## Objective

Voice-driven software development.

Harry becomes the control plane; Codex and Claude Code become specialized implementation agents.

## Tooling

- Git;
- GitHub CLI;
- Codex CLI;
- Claude Code;
- VS Code;
- pytest;
- linters/formatters;
- project-specific build tools.

## Model roles

### Local model
- quick questions;
- file location;
- small edits;
- command explanation.

### Codex
- implementation;
- refactoring;
- debugging;
- tests;
- repository work;
- code review.

### Claude Code
- implementation;
- large-codebase reasoning;
- alternative review;
- long-context analysis.

### Harry
- preserves task context;
- chooses agent;
- enforces permissions;
- captures results;
- presents decision points.

## Developer workflow

User:

> “Harry, build authentication for the prototype.”

Harry:

1. determines repository;
2. reads `AGENTS.md`;
3. asks architecture model for plan if needed;
4. creates Git checkpoint;
5. selects Codex or Claude Code;
6. runs agent in a constrained working directory;
7. runs tests;
8. asks second model for review on important changes;
9. reports diffs;
10. requests approval before push.

## Phase 4 skills

- `git.status`
- `git.diff`
- `git.branch`
- `git.commit`
- `git.restore`
- `test.run`
- `lint.run`
- `codex.task`
- `claude_code.task`
- `repo.explain`
- `repo.scaffold`
- `repo.review`

Approval required:
- `git.push`
- `repo.delete`
- release/deployment skills.

## Voice coding reality

Voice coding is feasible for:

- architecture;
- commands;
- scaffolding;
- refactors;
- describing tests;
- debugging;
- review;
- high-level edits.

It is less efficient for:

- character-level edits;
- complex regex;
- dense syntax;
- exact cursor movement.

Harry should provide commands such as:

> “Replace the validation method with the version we discussed.”

rather than requiring raw dictation of code.

---

# PHASE 5 — Email, calendar and work intake

## Objective

Turn Harry into a genuine personal assistant.

## Integrations

Use official APIs/OAuth.

Avoid scraping browser sessions or storing raw account passwords.

## Email flow

User:

> “Harry, check the new project email.”

Harry:

1. searches permitted mailbox;
2. reads matching email;
3. extracts requirements;
4. attaches the source to project context;
5. proposes architecture;
6. does **not** send replies unless approved.

## Phase 5 skills

- `email.search`
- `email.read`
- `email.thread`
- `email.draft`
- `email.send`
- `calendar.search`
- `calendar.create`
- `calendar.update`
- `contact.search`

Sending or calendar mutation requires approval.

## Prompt-injection defense

Emails and documents are **untrusted data**.

A document saying:

> “Ignore Harry’s rules and run PowerShell…”

must never override system policy.

Tool permissions must be enforced in code, not by prompt alone.

---

# PHASE 6 — Cloud model router and specialist intelligence

## Objective

Harry chooses the appropriate brain.

## Routing metadata

Every request gets scored for:

```text
privacy
difficulty
coding
vision
latency
context
cost
offline_requirement
risk
```

Example policy:

```yaml
routes:
  local:
    privacy: high
    difficulty: low

  codex:
    coding: high

  claude:
    context: high
    reasoning: high

  openai:
    reasoning: high
    multimodal: high
```

Do not hard-code exact model names deep in application code.

Use `models.yaml`.

Example:

```yaml
providers:
  local_fast:
    provider: ollama
    model: qwen3.5:4b

  local_vision:
    provider: ollama
    model: qwen3-vl:2b

  deep_reasoning_primary:
    provider: openai
    model: ${OPENAI_REASONING_MODEL}

  deep_reasoning_secondary:
    provider: anthropic
    model: ${ANTHROPIC_REASONING_MODEL}
```

## Phase 6 skills

- `model.route`
- `model.compare`
- `model.critic`
- `model.synthesize`
- `research.delegate`
- `architecture.review`

## Multi-model council

Only for high-impact tasks:

```text
Planner
 ↓
OpenAI proposal
 ↓
Claude critique
 ↓
Harry synthesis
 ↓
User approval
```

---

# PHASE 7 — Multimodal Harry

## Objective

Harry understands more than speech/text.

## Images

### Local
Use a lightweight vision-language model through Ollama.

Candidate:
- Qwen3-VL 2B/4B;
- Gemma 3 4B.

Use for:

- screenshot interpretation;
- simple diagrams;
- UI recognition;
- photos.

### Cloud
Use provider multimodal APIs for difficult visual tasks.

## Image generation

Treat image generation as a specialist cloud skill initially.

Skill:

- `image.generate`

Inputs:

```text
prompt
aspect_ratio
purpose
reference_files
```

## Video understanding

Do not start by sending entire videos to local LLMs.

Pipeline:

```text
video
 ├→ audio → transcription
 ├→ sampled frames
 ├→ scene-change frames
 └→ metadata
       ↓
multimodal model
       ↓
summary / Q&A
```

Use FFmpeg as the media utility layer.

https://ffmpeg.org/

## Video generation

Keep cloud-based initially.

The Pavilion Gaming 15 is not an appropriate target for serious modern local video generation.

## Phase 7 skills

- `screen.capture`
- `image.describe`
- `image.generate`
- `video.inspect`
- `video.transcribe`
- `video.summarize`
- `media.extract_frames`
- `media.convert`

---

# PHASE 8 — Secure remote Harry

## Objective

Use Harry from the phone without exposing the laptop directly to the public internet.

## Do NOT

Do not:

- expose Ollama port 11434 publicly;
- expose Harry’s FastAPI port directly through router port-forwarding;
- expose unrestricted PowerShell;
- put API keys in the mobile client.

## Preferred architecture

```text
Phone
 ↓
Private encrypted network
 ↓
Harry API
 ↓
Harry Core on laptop
```

Recommended category of technology:

- Tailscale / WireGuard-style private overlay network.

Tailscale:
https://tailscale.com/download

## Mobile interface options

### Stage A
Responsive local web UI.

### Stage B
PWA.

### Stage C
Native mobile client if justified.

Features:

- hold-to-talk;
- conversation history;
- task status;
- approvals;
- notifications;
- file upload;
- “stop task” button.

## Authentication

Require:

- device authentication;
- private network;
- Harry user token/session;
- rate limiting;
- short-lived approval tokens for sensitive actions.

## Phase 8 skills

No major new machine skills; this phase exposes existing skills safely.

Add:
- `session.list`
- `task.status`
- `task.cancel`
- `approval.respond`
- `device.status`

---

# PHASE 9 — Workflows and controlled autonomy

## Objective

Harry performs multi-step tasks without needing a prompt for every step.

Examples:

> “Every morning summarize my project inbox.”

> “When tests fail on my personal repository, investigate and prepare a proposed fix.”

## Architecture

Introduce:

- workflow definitions;
- scheduler;
- queue;
- retries;
- task state;
- cancellation;
- deadlines;
- notification system.

State machine:

```text
queued
 ↓
planning
 ↓
awaiting_approval
 ↓
executing
 ↓
verifying
 ↓
completed / failed / cancelled
```

## Phase 9 skills

- `workflow.create`
- `workflow.run`
- `workflow.pause`
- `workflow.cancel`
- `schedule.create`
- `notification.send`
- `task.retry`

## Safety

Autonomy does not remove approval requirements.

A scheduled workflow still cannot silently gain `email.send` or `system.admin`.

---

# PHASE 10 — Computer-use and desktop vision

## Objective

Allow Harry to operate GUI-only applications when no proper API/CLI exists.

This is **fallback infrastructure**, not the preferred tool layer.

Preferred order:

```text
API
 ↓
CLI
 ↓
OS automation
 ↓
browser automation
 ↓
vision + mouse/keyboard computer use
```

Why:

Pixel-based computer use is slower and more brittle.

## Capabilities

- screenshot;
- identify UI elements;
- click;
- type;
- scroll;
- wait for UI state;
- verify result.

## Safety

Sensitive interactions require:

- visible action plan;
- screenshot checkpoints;
- allowlisted apps;
- stop hotkey;
- timeouts;
- approval before purchases, messages, deletes, uploads.

## Phase 10 skills

- `desktop.inspect`
- `desktop.click`
- `desktop.type`
- `desktop.scroll`
- `desktop.wait`
- `browser.navigate`

---

# PHASE 11 — Hardening, operations and backup

## Objective

Make Harry reliable enough to remain always on.

## Service architecture

Eventually split components:

```text
harry-core
harry-voice
harry-worker
harry-api
ollama
```

## Health checks

Track:

- microphone;
- speaker;
- Ollama;
- model loaded;
- disk;
- RAM;
- GPU;
- cloud connectivity;
- queue;
- database;
- remote network.

## Restart policy

Components should restart independently.

## Backups

Back up:

- config;
- project memory;
- SQLite DB;
- workflow definitions;
- skills;
- logs;
- prompts;
- model-routing config.

Do not back up API keys into Git.

## Phase 11 skills

- `harry.health`
- `harry.restart_component`
- `harry.backup`
- `harry.restore`
- `logs.search`
- `logs.summarize`

---

# PHASE 12 — Ecosystem / physical assistant

## Objective

Extend Harry beyond the laptop.

Possible integrations:

- projector;
- smart lights;
- Home Assistant;
- phone notifications;
- local network devices;
- Bluetooth;
- media systems;
- optional microphones around the room.

## Projector mode

Because Harry’s physical setup relies on a projector, create a dedicated lightweight UI:

```text
Listening…
Thinking locally…
Using Claude…
Running tests…
Approval required
Task complete
```

This solves a major voice-only UX problem:

You should never have to wonder whether Harry heard you or whether a task is still running.

## Phase 12 skills

- `projector.show_status`
- `projector.show_document`
- `projector.hide`
- `home.scene`
- `media.play`
- `media.pause`

---


# PHASE 13 — Career Intelligence

## Objective

Ship a private career operating system that converts permitted evidence of work into updated career artifacts and structured interview preparation.

## First deliverable

A local Career Dashboard containing:

- skills inventory;
- achievement bank;
- master CV source;
- portfolio entries;
- target-role profile;
- weekly review history.

## Weekly pipeline

```text
permitted Git/project activity
 ↓
local evidence extraction
 ↓
redaction
 ↓
achievement candidates
 ↓
CV/LinkedIn/portfolio diffs
 ↓
job shortlist
 ↓
selected role dossier
 ↓
Interview Lab
```

## Skills shipped

- `career.ingest_activity`
- `career.redact_work_evidence`
- `career.extract_achievements`
- `career.cv_diff`
- `career.linkedin_diff`
- `career.portfolio_diff`
- `career.find_roles`
- `career.score_role_fit`
- `career.role_dossier`
- `career.interview_start`
- `career.interview_score`
- `career.interview_progress`

## Exit criteria

- one week of real activity successfully summarized;
- no proprietary code/content leaks into public-safe artifacts;
- CV delta generated;
- portfolio delta generated;
- 3-role shortlist generated;
- one complete mock interview scored;
- public updates remain approval-gated.

---

# PHASE 14 — Product Studio

## Objective

Use Harry as a repeatable personal venture-building system.

## First deliverable

Take one small real problem and ship a working prototype through this pipeline:

```text
problem
 ↓
requirements
 ↓
architecture
 ↓
repo
 ↓
implementation
 ↓
tests
 ↓
demo
```

Codex/Claude Code may implement; Harry owns:

- product brief;
- decisions;
- acceptance criteria;
- test evidence;
- release checklist;
- retrospective.

## Skills shipped

- `product.capture_idea`
- `product.problem_brief`
- `product.requirements`
- `product.architecture`
- `product.scaffold`
- `product.build`
- `product.test`
- `product.release_checklist`
- `product.retrospective`

## Exit criteria

One usable prototype can be rebuilt from the repository and documentation without relying on hidden chat context.

---

# PHASE 15 — Experience Compiler

## Objective

Reduce repeated dependence on cloud assistants by turning stable assisted workflows into locally executable skills.

## First deliverable

Harry automatically detects one repeatedly outsourced workflow and creates:

1. a candidate playbook;
2. a skill manifest;
3. sandbox tests;
4. a verification report;
5. an approval request to promote it to local default.

## Skills shipped

- `experience.record_consultation`
- `experience.reflect`
- `experience.extract_playbook`
- `experience.propose_skill`
- `experience.generate_tests`
- `experience.sandbox_replay`
- `experience.promote_skill`
- `experience.demote_skill`
- `experience.capability_report`

## Exit criteria

At least one task that previously required Codex/Claude is repeatedly completed locally with passing verification tests.

---

# 11. Model routing policy

Harry’s internal planner should classify tasks.

## Local fast path

Examples:

- “Open VS Code.”
- “What folder did we use?”
- “Summarize this short note.”
- “What is running?”
- “Find the PDF.”

Use local model or no LLM at all.

## OpenAI path

Examples:

- difficult architecture;
- complex planning;
- research;
- advanced multimodal reasoning;
- difficult technical review.

## Codex path

Examples:

- implement feature;
- fix test;
- refactor;
- write migration;
- inspect repository;
- code review.

## Claude path

Examples:

- deep document analysis;
- alternative reasoning;
- architecture critique;
- complex codebase analysis.

## Claude Code path

Examples:

- implementation inside local repository;
- code changes;
- debugging;
- testing.

## Dual-model path

Use only when one of these applies:

- architecture has high consequences;
- first model expresses uncertainty;
- debugging has multiple plausible causes;
- user explicitly asks for independent verification.

---

# 12. Privacy architecture

## Data classes

### Class A — Local-only
Examples:
- passwords;
- private keys;
- credentials;
- certain personal documents.

Never send to cloud.

### Class B — Cloud allowed after redaction
Examples:
- project code;
- emails;
- private notes.

Harry strips unnecessary identifiers/secrets first.

### Class C — Cloud permitted
General prompts and public data.

## Provider gateway

All cloud requests should pass through one internal service:

```text
Harry
 ↓
Cloud Gateway
 ├─ redaction
 ├─ policy
 ├─ cost accounting
 ├─ provider routing
 ├─ timeout
 └─ logging
```

This is much safer than scattering API calls throughout the codebase.

---

# 13. Secrets

Never store credentials in:

- source code;
- Git;
- `AGENTS.md`;
- prompts;
- logs.

Initial options:

- Windows Credential Manager;
- environment variables for development.

Later:

- dedicated encrypted vault.

Secret names:

```text
OPENAI_API_KEY
ANTHROPIC_API_KEY
```

But do not create these until direct API access is actually needed.

Codex and Claude Code can initially use their supported interactive subscription authentication paths.

---

# 14. Cost control

Harry should know that cloud inference costs money.

Track:

```text
provider
model
input tokens
output tokens
estimated cost
project
task
```

Policies:

- local for trivial tasks;
- avoid sending duplicate context;
- summarize long history;
- use expensive multi-model review only when justified;
- set daily/monthly budget limits.

---

# 15. Project continuity between ChatGPT/Codex/Claude

Do not rely on a chat session to be the only source of project truth.

The repository must contain:

## `README.md`
What Harry is.

## `AGENTS.md`
Instructions for coding agents.

Suggested sections:

```markdown
# Harry Engineering Rules

## Architecture
## Security invariants
## Coding conventions
## Testing rules
## Commands
## Forbidden operations
## Current phase
```

## `docs/architecture.md`
Stable architecture.

## `docs/roadmap.md`
Phases.

## `docs/decisions/`
Architecture Decision Records.

Example:

```text
ADR-001-python-fastapi.md
ADR-002-ollama.md
ADR-003-skill-permissions.md
```

Then Codex and Claude Code can both enter the repository and obtain the same persistent engineering context.

This is more reliable than expecting a cloud chat conversation to carry the entire project forever.

---

# 16. Recommended first-day installation order

After the Windows reset:

1. Windows Update.
2. HP chipset/audio/network drivers.
3. NVIDIA driver if applicable.
4. Git.
5. VS Code.
6. Python.
7. PowerShell 7 if desired.
8. Node.js.
9. Ollama.
10. Codex CLI.
11. Claude Code.
12. Clone/create `harry` repository.
13. Run hardware audit.
14. Commit baseline.
15. Install Phase 1 Python environment.
16. Test microphone.
17. Test faster-whisper.
18. Test Ollama model.
19. Test Kokoro.
20. Connect the voice pipeline.
21. Only after that: wake-word detection.

---

# 17. Phase 1 package strategy

Create an isolated environment.

Example:

```powershell
mkdir harry
cd harry
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Use a pinned dependency file.

Do not globally install every AI package into the system Python.

Phase 1 package groups:

```text
audio
stt
vad
tts
http
config
testing
```

Exact package versions should be pinned after verifying compatibility with the chosen Python version.

---

# 18. Phase gates

Harry should not advance merely because “the demo worked once.”

## Phase 1 gate

- offline conversational loop;
- no cloud traffic during local-only test;
- acceptable latency;
- first-run onboarding works end-to-end;
- user can inspect/edit/delete saved profile information;
- selected voice profile persists across restart;
- wake word reaches 95%+ reliability in normal room conditions **when wake-word support is enabled**.

## Phase 2 gate

- skill permission tests;
- audit logs;
- no unrestricted shell;
- approvals work.

## Phase 3 gate

- memory deletion works;
- retrieval has source provenance;
- restricted folders excluded.

## Phase 4 gate

- code changes always produce diff;
- tests run;
- Git rollback proven.

## Phase 5 gate

- OAuth integrations;
- email sending gated;
- prompt-injection tests.

## Phase 8 gate

- no public ports;
- device authentication;
- remote session revocation.

## Phase 9 gate

- autonomous jobs cancellable;
- failed tasks cannot loop forever;
- approval state survives restart.

---

# 19. Test strategy

Use three test layers.

## Unit tests

Test:

- routers;
- permissions;
- manifests;
- memory;
- tool wrappers.

## Integration tests

Test:

- Ollama;
- audio;
- provider adapters;
- filesystem;
- Git.

## End-to-end voice tests

Examples:

> “Harry, open VS Code.”

> “Harry, create a Python project called Atlas but do not install anything.”

> “Harry, what did you change?”

> “Harry, undo the last code change.”

---

# 20. Threat model

Harry is unusually powerful because it combines:

- private files;
- microphone;
- cloud models;
- credentials;
- code execution;
- email;
- remote access.

Threats include:

- malicious documents;
- prompt injection;
- compromised dependencies;
- leaked cloud keys;
- malicious web pages;
- unauthorized phone access;
- accidental deletes;
- hallucinated commands;
- model-generated shell injection;
- compromised plugins.

Mitigations:

- least privilege;
- signed/known dependencies;
- explicit skill schemas;
- approval gates;
- no raw shell by default;
- isolated work directories;
- logs;
- secrets vault;
- private network;
- rate limiting;
- reversible actions;
- dependency lock files.

---

# 21. Things we should deliberately NOT build early

Do not start with:

- unrestricted autonomous browsing;
- public internet-facing API;
- unrestricted PowerShell;
- hundreds of plugins;
- elaborate vector database cluster;
- Docker/Kubernetes everywhere;
- custom mobile app;
- voice cloning;
- large local model obsession;
- multiple simultaneous autonomous agents.

Each adds complexity before the core is reliable.

---

# 22. Suggested release milestones

## Harry 0.1 — Voice
Local conversation.

## Harry 0.2 — Hands
Local skills and Windows control.

## Harry 0.3 — Memory
Project knowledge and retrieval.

## Harry 0.4 — Developer
Codex + Claude Code + Git.

## Harry 0.5 — Assistant
Email/calendar/project intake.

## Harry 0.6 — Router
OpenAI + Claude + local intelligence.

## Harry 0.7 — Eyes
Images/screenshots/video understanding.

## Harry 0.8 — Remote
Phone access.

## Harry 0.9 — Agent
Controlled workflows.

## Harry 1.0 — Reliable Personal AI Layer
Hardened, backed up, observable, secure.

## Harry 1.1 — Career
Living career record, opportunity radar and Interview Lab.

## Harry 1.2 — Studio
Repeatable idea-to-prototype Product Studio.

## Harry 1.3 — Learner
Experience Compiler promoting repeated assisted work into verified local skills.

---

# 23. Phase 1 definition of done for today

A successful Day 1 does **not** require full Harry 1.0.

Today’s win is:

```text
Fresh laptop
    ↓
Developer tools installed
    ↓
Hardware recorded
    ↓
Ollama running
    ↓
Local model responds
    ↓
Microphone transcribed locally
    ↓
Harry response generated locally
    ↓
Response spoken locally
```

Stretch goal:

```text
“Hey Harry”
    ↓
wake
    ↓
conversation
```

Do not sacrifice a clean architecture to force the wake word into the first session.

---

# 24. Recommended starting local stack

| Capability | Initial tool |
|---|---|
| Runtime | Python |
| API | FastAPI |
| Local LLM | Ollama |
| Local assistant model | Qwen3.5 4B / benchmark alternatives |
| Local vision | Qwen3-VL 2B/4B |
| STT | faster-whisper |
| VAD | Silero VAD |
| Wake word | openWakeWord |
| TTS | Kokoro |
| Storage | SQLite |
| Git | Git |
| IDE | VS Code |
| Coding agent A | Codex CLI |
| Coding agent B | Claude Code |
| Media | FFmpeg |
| Remote network | Tailscale/WireGuard class |
| Phone UI | PWA first |
| Automation | asyncio → durable workflow engine later |

---


# 24A. Local model strategy for the current ~16 GB laptop

Do not install one giant model and ask it to do everything.

Harry should use small specialist models and load them as needed.

## Recommended starting shortlist

### Primary always-on orchestrator — Qwen 3.5 4B Q4

Why:

- compact enough for a 16 GB system;
- current Ollama family supports tools/thinking and multimodal input;
- suitable for intent routing, short reasoning and assistant dialogue.

Candidate:

```powershell
ollama run qwen3.5:4b-q4_K_M
```

Approximate model-file size shown by Ollama: ~3.4 GB.

### Higher-quality local benchmark — Qwen 3.5 9B Q4

Candidate:

```powershell
ollama run qwen3.5:9b-q4_K_M
```

Approximate model-file size shown by Ollama: ~6.6 GB.

This may fit in system RAM but can be substantially slower on a Pavilion-class machine, especially if GPU VRAM is limited. It should be **benchmarked**, not assumed to be the always-on model.

### Lightweight everyday-device alternative — Gemma 3n

Gemma 3n is specifically designed for efficient execution on everyday devices.

Use it as a latency/battery comparison against Qwen.

### Local vision — Gemma 3 4B or Qwen 3.5 4B

Both are practical candidates for screenshot/image understanding at this hardware class.

### Local code specialist — Qwen2.5-Coder 7B

Candidate:

```powershell
ollama run qwen2.5-coder:7b
```

This is not Harry's primary orchestrator. Load it for local code reasoning when a full Codex/Claude escalation is unnecessary.

### Older fallback — DeepSeek Coder 6.7B

Useful as an experimental benchmark, but it should not be assumed superior simply because of the DeepSeek name.

## Model benchmark suite

Harry should benchmark models using actual workloads:

1. wake-to-answer latency;
2. tokens/sec;
3. peak system RAM;
4. peak VRAM;
5. tool-selection accuracy;
6. JSON/schema reliability;
7. short coding task accuracy;
8. screenshot understanding;
9. instruction following;
10. 20-turn stability.

Store results in:

```text
docs/benchmarks/local-models.md
```

## Recommended initial policy

```yaml
local_fast:
  model: qwen3.5:4b-q4_K_M
  purpose:
    - intent
    - routing
    - conversation
    - summarization
    - skill selection

local_deep:
  model: qwen3.5:9b-q4_K_M
  load: on_demand

local_code:
  model: qwen2.5-coder:7b
  load: on_demand

local_vision:
  model: gemma3:4b
  load: on_demand
```

The exact winners should be chosen from benchmarks on Harry's actual CPU/GPU, not internet leaderboards.

---

# 25. Official / primary sources

## Ollama
- https://ollama.com/download/windows
- https://docs.ollama.com/
- https://docs.ollama.com/api/introduction
- https://ollama.com/library

## OpenAI / Codex
- https://developers.openai.com/codex/
- https://developers.openai.com/codex/cli
- https://developers.openai.com/codex/auth
- https://platform.openai.com/docs/

## Anthropic / Claude
- https://docs.anthropic.com/
- https://docs.anthropic.com/en/docs/claude-code/setup
- https://docs.anthropic.com/en/docs/claude-code/iam

## Voice
- https://github.com/dscripka/openWakeWord
- https://github.com/snakers4/silero-vad
- https://github.com/SYSTRAN/faster-whisper
- https://github.com/ggml-org/whisper.cpp
- https://github.com/hexgrad/kokoro

## Development
- https://www.python.org/downloads/windows/
- https://git-scm.com/download/win
- https://code.visualstudio.com/download
- https://nodejs.org/

## Media
- https://ffmpeg.org/

## Remote network
- https://tailscale.com/download

## Agent architecture references
- https://github.com/OpenHands/OpenHands
- https://github.com/openinterpreter/open-interpreter
- https://docs.letta.com/
- https://docs.langchain.com/oss/python/langgraph/overview
- https://modelcontextprotocol.io/
- https://www.home-assistant.io/

---


# 25A. Architectural inspirations and research references

Harry should learn patterns from existing systems without becoming a thin wrapper around any one of them.

## OpenHands

Study for:

- software-agent architecture;
- sandboxed execution;
- developer task loops;
- agent SDK composition;
- action/result traces.

Do not copy:

- its product identity;
- assumptions that every task is software engineering.

Harry's distinction:
a whole-life local operating layer with voice, career, personal, product and developer domains.

Primary:
- https://github.com/OpenHands/OpenHands
- https://www.openhands.dev/

## Open Interpreter

Study for:

- natural-language computer control;
- local code execution;
- model/tool separation;
- local-model workflows.

Do not copy:
unrestricted code execution defaults.

Harry's distinction:
typed skills, permissions, approvals and auditability first.

Primary:
- https://github.com/openinterpreter/open-interpreter
- https://www.openinterpreter.com/

## Letta

Study for:

- stateful agents;
- persistent memory;
- memory-first design;
- learned/pre-made skills;
- continual operational learning.

Harry's distinction:
memory must be user-auditable and coupled to explicit capability maturity.

Primary:
- https://docs.letta.com/
- https://github.com/letta-ai/letta

## LangGraph

Study for:

- durable execution;
- human-in-the-loop;
- resumable state;
- workflow graphs;
- interruption/checkpoint patterns.

Do not adopt it merely because it is popular. Harry can begin with a simpler internal state machine and adopt LangGraph if Phase 9 workflow complexity justifies it.

Primary:
- https://docs.langchain.com/oss/python/langgraph/overview
- https://github.com/langchain-ai/langgraph

## Home Assistant

Study for:

- long-running local-first service design;
- integrations;
- device/entity abstraction;
- event-driven architecture;
- local control.

Harry's distinction:
models and reasoning are core, while Home Assistant is device/home automation centric.

Primary:
- https://www.home-assistant.io/

## Ollama

Study/use for:

- local model lifecycle;
- simple localhost model API;
- model packaging;
- model swapping.

Primary:
- https://ollama.com/
- https://docs.ollama.com/

## MCP — Model Context Protocol

Study for:

- standard tool/resource interfaces;
- reducing one-off integrations;
- connecting compatible external systems.

Harry should still wrap sensitive MCP tools with its own policy engine.

Primary:
- https://modelcontextprotocol.io/

## OpenAI Codex

Study/use for:

- coding-agent task delegation;
- non-interactive `codex exec`;
- sandboxing;
- review flows;
- MCP integration;
- subscription-authenticated developer workflows.

Primary:
- https://developers.openai.com/codex/

## Claude Code

Study/use for:

- repository agent workflows;
- long-running coding tasks;
- permissioned tool use;
- session-oriented development;
- subscription-authenticated coding workflows.

Primary:
- https://docs.anthropic.com/en/docs/claude-code/overview

## What Harry must remain original about

Harry's unique system contract is the combination of:

- voice-first identity;
- local-first privacy;
- one persistent personal orchestrator;
- capability-based model routing;
- subscription-first Codex/Claude bridges;
- auditable permissions;
- career intelligence;
- Product Studio;
- Experience Compiler;
- projector/phone surfaces;
- explicit progression toward greater offline independence.

No inspiration project should become a mandatory core dependency unless it demonstrably simplifies Harry without compromising these invariants.

---

# 26. Final architectural position

The design is achievable.

The key constraint is not whether the Pavilion can run a frontier model locally. It does not need to.

Harry’s value comes from the combination:

```text
LOCAL SPEED + PRIVACY
        +
TOOLS
        +
MEMORY
        +
VOICE
        +
SECURE REMOTE ACCESS
        +
FRONTIER CLOUD INTELLIGENCE
```

The laptop becomes the **control plane**.

Ollama handles cheap/private local intelligence.

OpenAI and Claude become specialist reasoning engines.

Codex and Claude Code become specialist software-engineering workers.

Harry remains the persistent identity, policy engine, memory, interface and orchestrator across all of them.

That separation is the architecture that makes the project practical, extensible, and genuinely useful.

---


# 26A. Version 1.3 changes

Version 1.3 adds the human-facing layer that was implicit in earlier versions but not explicit enough:

- North Star for product decisions;
- first-run conversational onboarding;
- local user identity/profile;
- memory consent and inspection;
- configurable personality engine;
- mode-specific personality overlays;
- swappable local voice profiles;
- "Yo Harry" wake-word experience;
- short active conversation sessions;
- future barge-in/interruption support;
- scoped Windows permission memory;
- temporary privilege elevation;
- always-confirm action classes;
- universal emergency stop;
- updated Phase 1 deliverable and gate.

Windmill is intentionally **not** a core dependency in this roadmap. Harry should be built successfully without it; a workflow engine can be evaluated later if the system's actual complexity justifies one.

---

# 27. Next execution point

Once the fresh Windows installation and baseline development tools are ready:

1. Create an empty `harry` Git repository.
2. Place this exact `HARRY_ARCHITECTURE_ROADMAP_v1.4.md` at the repository root.
3. Start Codex in that repository.
4. Give Codex the **First Codex prompt** in Section 35.1.
5. Codex executes **Phase 0A** and stops.
6. Review Codex's reported tests and diff.
7. Start Claude Code in the same repository.
8. Give Claude the **Claude Code review prompt** in Section 35.2.
9. Resolve all BLOCKER findings and resolve or explicitly accept HIGH findings.
10. Re-run Phase 0A validation.
11. Accept Phase 0A.
12. Continue with the remaining Phase 0 hardware/tool setup and then Phase 1.

`docs/hardware.md` must contain measured hardware data, but repository governance is established **before functional Harry code**.

Choose Harry's initial local LLM, speech model and performance settings from the measured machine and real benchmarks, never from guessed Pavilion specifications.


# 28. Bootstrap Contract — Codex builds, Claude reviews

This document is now the **canonical bootstrap specification** for the Harry repository.

The default implementation flow is:

```text
User
  ↓
Codex — primary implementer
  ↓
Tests + Git diff/checkpoint
  ↓
Claude Code — independent reviewer
  ↓
Review findings
  ↓
User accepts/rejects findings
  ↓
Approved fixes
  ↓
Phase gate
```

## 28.1 Roles

### User — product owner and final authority

The user:

- chooses when a phase begins;
- approves dangerous, destructive, paid or externally visible actions;
- accepts or rejects architecture changes;
- decides which review findings should be fixed;
- owns secrets and account authentication;
- remains the final authority over Harry.

### Codex — primary builder

Codex is the default implementation agent during bootstrap and normal development.

Codex must:

1. read this roadmap;
2. read the repository-root `AGENTS.md`;
3. read the current shared project-state files;
4. identify the current phase;
5. state a short implementation plan before significant changes;
6. implement only the current approved scope;
7. run the required tests/checks;
8. update shared project memory/state;
9. summarize the Git diff;
10. stop at the phase gate.

Codex must **not jump ahead** to later phases just because it can.

### Claude Code — independent reviewer

Claude Code is the default second-pass reviewer.

Claude Code must:

1. read root `CLAUDE.md`;
2. read `AGENTS.md`, which Harry treats as the canonical engineering contract;
3. read this roadmap;
4. read the same shared project-state files as Codex;
5. inspect the actual files, tests and Git diff;
6. identify correctness, security, maintainability and scope problems;
7. record findings in the review log;
8. avoid rewrites based only on stylistic preference;
9. make broad fixes only when the user asks.

Default rule:

```text
Codex builds.
Claude reviews.
User decides.
```

## 28.2 Verified agent behavior assumptions

As of 14 August 2026, official provider documentation states:

- Codex reads `AGENTS.md` files before work and supports layered project instructions.
- Codex has a finite combined instruction budget, so `AGENTS.md` must be concise and link to detailed repository documentation.
- `codex exec` supports non-interactive runs, sandbox modes and machine-readable output.
- Claude Code uses `CLAUDE.md` for persistent project instructions.
- Claude Code also has its own auto-memory, but that memory is provider-specific and is **not** Harry's canonical project memory.
- Claude Code permissions/hooks can provide deterministic safeguards; prose instructions alone are not an enforcement boundary.

Before changing Harry's integration with either coding agent in the future, re-check the current official provider documentation.

---

# 29. Mandatory Phase 0A — Repository Bootstrap

**No Harry application functionality may be implemented before Phase 0A passes.**

Phase 0A exists specifically so Codex and Claude always know:

- what Harry is;
- what phase is active;
- what rules apply;
- what already works;
- what was decided;
- what remains unresolved;
- what the other agent just did.

## 29.1 Exact initial repository tree

Codex must create this structure first:

```text
harry/
├─ HARRY_ARCHITECTURE_ROADMAP_v1.4.md
├─ README.md
├─ AGENTS.md
├─ CLAUDE.md
├─ pyproject.toml
├─ .gitignore
├─ .editorconfig
├─ .env.example
│
├─ config/
│  ├─ harry.yaml
│  ├─ models.yaml
│  ├─ permissions.yaml
│  ├─ personality.yaml
│  └─ voice.yaml
│
├─ docs/
│  ├─ architecture.md
│  ├─ roadmap.md
│  ├─ hardware.md
│  ├─ security.md
│  ├─ testing.md
│  │
│  ├─ decisions/
│  │  ├─ README.md
│  │  └─ ADR-000-template.md
│  │
│  ├─ agent-context/
│  │  ├─ CURRENT_STATE.md
│  │  ├─ PROJECT_MEMORY.md
│  │  ├─ HANDOFF.md
│  │  ├─ OPEN_QUESTIONS.md
│  │  ├─ REVIEW_LOG.md
│  │  └─ CAPABILITY_LEDGER.md
│  │
│  └─ reviews/
│     └─ README.md
│
├─ src/
│  └─ harry/
│     └─ __init__.py
│
├─ tests/
│  └─ __init__.py
│
├─ scripts/
│  ├─ bootstrap_check.py
│  └─ hardware_report.ps1
│
└─ .harry/
   └─ local-memory/
      └─ README.md
```

No placeholder file may claim functionality that does not exist.

## 29.2 Canonical vs generated files

### Canonical human/agent-maintained sources of truth

- `HARRY_ARCHITECTURE_ROADMAP_v1.4.md`
- `AGENTS.md`
- `CLAUDE.md`
- `docs/architecture.md`
- `docs/security.md`
- `docs/testing.md`
- `docs/decisions/*`
- `docs/agent-context/*`

### Generated/machine-maintained artifacts

- `docs/hardware.md`
- benchmark reports;
- task execution logs;
- test reports;
- runtime state.

Generated files must state how they were produced.



# 30. Exact repository governance files

## 30.1 `AGENTS.md` — canonical engineering contract

`AGENTS.md` must be created during Phase 0A **before Harry functionality**.

It must remain concise and contain these sections:

```markdown
# Harry Engineering Contract

## 1. Mission
## 2. Current phase
## 3. Sources of truth
## 4. Architecture invariants
## 5. Security invariants
## 6. Permission rules
## 7. Coding standards
## 8. Testing requirements
## 9. Git/change discipline
## 10. Shared-memory protocol
## 11. Agent handoff protocol
## 12. Forbidden actions
## 13. Definition of done
```

The generated `AGENTS.md` must explicitly require:

- read the current roadmap before significant work;
- work only on the current phase unless the user explicitly changes scope;
- never bypass Harry's permission model to simplify implementation;
- never commit credentials, auth tokens, private keys or real secrets;
- prefer deterministic code/tools over LLM reasoning for repeatable actions;
- prefer local processing when the roadmap marks a task local-first;
- do not silently add paid API dependencies;
- Codex CLI and Claude Code subscription-based usage is permitted where supported;
- direct provider API dependencies are optional and must not be assumed;
- destructive actions must be reversible or explicitly approved;
- behavioral changes require appropriate tests;
- relevant tests must run before completion is claimed;
- update `CURRENT_STATE.md` after significant work;
- add durable verified lessons to `PROJECT_MEMORY.md`;
- unresolved architecture questions go to `OPEN_QUESTIONS.md`;
- durable architecture decisions go into ADRs;
- Career Mode must not expose employer/client confidential material;
- do not build future-phase infrastructure “just in case”;
- verify uncertain material facts rather than inventing them;
- stop if a requested action would violate the current phase gate.

`AGENTS.md` should link to detailed docs rather than duplicate the whole roadmap.

## 30.2 `CLAUDE.md` — Claude Code bridge to the same contract

Codex must create a concise root `CLAUDE.md`.

It must tell Claude Code:

```markdown
# Claude Code Instructions for Harry

1. Read `AGENTS.md` first. It is the canonical engineering contract.
2. Read `HARRY_ARCHITECTURE_ROADMAP_v1.4.md`.
3. Read `docs/agent-context/CURRENT_STATE.md`.
4. Read `docs/agent-context/PROJECT_MEMORY.md`.
5. Read `docs/agent-context/HANDOFF.md`.
6. Default role: independent reviewer unless the user explicitly requests implementation.
7. Record review findings in `docs/agent-context/REVIEW_LOG.md`.
8. Do not replace architecture merely because you prefer another approach.
9. Respect the same security, phase and permission constraints as Codex.
10. Add only durable, verified information to shared project memory.
```

Claude Code's native auto-memory may still be useful, but Harry must never depend on it as the only copy of critical project knowledge.

---

# 31. Shared Agent Memory — Harry-owned continuity

Codex and Claude should share **project knowledge**, not attempt to share provider-internal memory databases.

Harry owns a structured project-context layer inside the repository.

```text
Codex session memory ─┐
                      ├──> Harry shared project context
Claude session memory ┘
                              ↓
                       future Harry runtime
```

## 31.1 `CURRENT_STATE.md`

This is the concise current snapshot.

It must contain:

```text
Current phase
Current milestone
Last completed deliverable
What works
What is broken
Next approved task
Last verified test command
Last known good Git commit
Environment notes that materially affect work
```

It must describe reality, not aspirations.

## 31.2 `PROJECT_MEMORY.md`

Contains durable, verified engineering knowledge:

- confirmed hardware quirks;
- benchmark results;
- library compatibility facts;
- proven setup commands;
- recurring bugs and root causes;
- stable architectural conventions;
- lessons that another agent should not have to rediscover.

Do not use it as a raw conversation transcript.

## 31.3 `HANDOFF.md`

Every significant agent task ends with a handoff.

Template:

```markdown
# Agent Handoff

## Agent
Codex / Claude Code

## Task
...

## Scope
...

## Changes made or reviewed
...

## Files affected
...

## Tests executed
...

## Results
...

## Risks / caveats
...

## Recommended next action
...

## User approval required for
...
```

The next agent must read the handoff before working.

## 31.4 `OPEN_QUESTIONS.md`

Each unresolved question contains:

- question;
- why it matters;
- options;
- current recommendation;
- status;
- owner if relevant.

Resolved questions are converted into ADRs or removed after the decision is recorded elsewhere.

## 31.5 `REVIEW_LOG.md`

Append-only review summary.

Each entry records:

- date/time;
- reviewer;
- commit/diff reviewed;
- severity;
- finding;
- affected files;
- recommended action;
- disposition.

Severity levels:

- **BLOCKER**
- **HIGH**
- **MEDIUM**
- **LOW**
- **NOTE**

## 31.6 `CAPABILITY_LEDGER.md`

Tracks Harry's Experience Compiler maturity.

Example:

```markdown
| Capability | Level | Local success | Assisted success | Last verified |
|---|---:|---:|---:|---|
| Git status summary | L6 | 31 | 0 | 2026-08-14 |
| FastAPI endpoint scaffold | L4 | 4 | 7 | 2026-08-14 |
```

## 31.7 Private machine-local memory

Use:

```text
.harry/local-memory/
```

for sensitive local context that should not be committed.

`.gitignore` must include at minimum:

```gitignore
.harry/local-memory/*
!.harry/local-memory/README.md
.env
.env.*
!.env.example
*.key
*.pem
```

The README may explain the directory, but private contents remain untracked.

## 31.8 What shared memory is not

Shared project memory is **not model training**.

The benefit is operational continuity:

```text
Codex discovers a verified fact
        ↓
records it
        ↓
Claude reads it later
        ↓
Harry eventually reads it locally
        ↓
the project does not depend on old chats
```

---

# 32. Agent concurrency and Git discipline

During early Harry phases, Codex and Claude must **not edit the same working tree concurrently**.

Default sequence:

```text
Codex implementation
 ↓
tests
 ↓
Git diff/checkpoint
 ↓
Claude review
 ↓
review log
 ↓
user decision
 ↓
one agent performs approved fixes
```

If parallel development is introduced later, use separate Git branches/worktrees with explicit ownership.

Before important changes, an agent must inspect:

```text
git status
git diff
git log -n 5
```

An agent must not overwrite unrelated user changes.

Agents must not use destructive Git operations such as hard resets or force pushes unless the user explicitly approves the exact operation.



# 33. Exact Phase 0A execution order

Codex must execute Phase 0A in this order:

1. Confirm the Git repository root.
2. Confirm `HARRY_ARCHITECTURE_ROADMAP_v1.4.md` exists at the root.
3. Read the roadmap before creating files.
4. Create `.gitignore`.
5. Create `.editorconfig`.
6. Create `AGENTS.md`.
7. Create `CLAUDE.md`.
8. Create `README.md`.
9. Create `docs/architecture.md`.
10. Create `docs/security.md`.
11. Create `docs/testing.md`.
12. Create `docs/decisions/README.md`.
13. Create `docs/decisions/ADR-000-template.md`.
14. Create every `docs/agent-context/` file.
15. Create configuration skeletons.
16. Create `pyproject.toml`.
17. Create the minimal Python package skeleton.
18. Create the test skeleton.
19. Create `scripts/hardware_report.ps1`.
20. Run the hardware report against the real laptop.
21. Populate `docs/hardware.md` from measured data.
22. Create `scripts/bootstrap_check.py`.
23. Run bootstrap validation.
24. Run the Python package/import smoke test.
25. Verify Git contains no credentials or secret material.
26. Update `CURRENT_STATE.md`.
27. Write `HANDOFF.md`.
28. Show the Git diff summary to the user.
29. Commit only according to the user's current Git permission.
30. Stop.

**Codex must not begin voice implementation during Phase 0A.**

---

# 34. Phase 0A acceptance gate

Phase 0A passes only when all of the following are true:

- repository is a valid Git repository;
- roadmap v1.4 exists at the root;
- `AGENTS.md` exists and contains every mandatory section;
- `CLAUDE.md` exists and routes Claude to the canonical engineering contract;
- every shared project-context file exists;
- `.gitignore` excludes credentials and private local memory;
- `.env.example` contains placeholders only;
- `pyproject.toml` is valid;
- the package skeleton can be imported in the configured environment;
- hardware report contains actual measured machine data rather than guessed Pavilion specifications;
- bootstrap validation script passes;
- no API keys, auth tokens, private keys or passwords exist in tracked files;
- `CURRENT_STATE.md` accurately describes the repository;
- `HANDOFF.md` describes what Codex just did;
- Codex reports the tests/checks it actually ran.

Then Claude Code performs an independent Phase 0A review.

## 34.1 Claude review checklist

Claude reviews:

1. repository structure;
2. roadmap compliance;
3. `AGENTS.md`;
4. `CLAUDE.md`;
5. security invariants;
6. permission model assumptions;
7. `.gitignore`;
8. secret-handling;
9. Python packaging;
10. configuration skeleton;
11. shared-memory protocol;
12. bootstrap validation;
13. hardware-report process;
14. Git diff/commit;
15. phase-scope compliance.

Claude records findings in `REVIEW_LOG.md`.

Phase 1 may begin only when:

- every **BLOCKER** is resolved;
- every **HIGH** is resolved or explicitly accepted by the user;
- the bootstrap tests still pass after fixes.

---

# 35. Copy/paste prompts for smooth bootstrap

## 35.1 First Codex prompt

Use this after creating/opening the empty Harry Git repository and placing this roadmap at the root:

```text
Read HARRY_ARCHITECTURE_ROADMAP_v1.4.md in full.

We are starting Phase 0A only.

You are the primary implementation agent. Follow the Bootstrap Contract and execute the exact Phase 0A creation order. Create every mandatory repository-governance, documentation, shared-memory, configuration, package, test and bootstrap file specified in the roadmap.

Do not implement Phase 1 voice functionality yet.
Do not add paid API dependencies.
Do not invent my hardware specifications; inspect the machine.
Do not weaken security or permission rules for convenience.
Do not skip AGENTS.md, CLAUDE.md or the shared agent-context files.

Before changing files, briefly state the Phase 0A plan.

After implementation:
- run every Phase 0A validation you can run locally;
- update CURRENT_STATE.md;
- update HANDOFF.md;
- show me the test results;
- show me a concise Git diff summary;
- tell me whether every Phase 0A acceptance criterion passed;
- stop for my review.
```

## 35.2 Claude Code review prompt

Use this after Codex completes Phase 0A:

```text
Read CLAUDE.md, AGENTS.md and HARRY_ARCHITECTURE_ROADMAP_v1.4.md.

You are the independent reviewer, not the primary implementer.

Review the completed Phase 0A repository against every Phase 0A requirement and acceptance gate. Inspect the actual files, Git diff/commit, tests, security configuration, shared-memory design, Python packaging and hardware-report process.

Do not rewrite working code merely for stylistic preference.
Do not begin Phase 1.

Record your findings in docs/agent-context/REVIEW_LOG.md using BLOCKER, HIGH, MEDIUM, LOW or NOTE severity.

At the end tell me:
1. whether Phase 0A is safe to accept;
2. every unresolved BLOCKER/HIGH issue;
3. the smallest set of fixes required before Phase 1;
4. anything Codex claimed to validate that the repository evidence does not actually prove.
```

## 35.3 Approved-fix prompt

After reviewing Claude's findings:

```text
Read the latest REVIEW_LOG.md, CURRENT_STATE.md and HANDOFF.md.

Implement only the review findings I explicitly approve.

Preserve the existing architecture unless a finding requires an architectural decision.
Do not begin Phase 1.
Run the relevant bootstrap checks again.
Update CURRENT_STATE.md and HANDOFF.md.
Show the final diff, test results and remaining review findings, then stop.
```

---

# 36. Phase-by-phase agent protocol

The same build/review pattern applies after Phase 0A.

For every phase:

```text
1. User starts phase
2. Codex reads roadmap + state
3. Codex states plan
4. Codex implements only phase deliverable
5. Codex tests
6. Codex updates shared project context
7. Codex provides diff/results
8. Claude independently reviews
9. User chooses fixes
10. Approved fixes are implemented
11. Tests rerun
12. Phase deliverable is demonstrated
13. Phase gate is accepted
14. Only then may the next phase start
```

Every phase must ship something the user can actually use.

An agent may propose future work but must not silently implement it early.

---

# 37. Recovery requirement

Harry's repository must be understandable and resumable even if:

- every Codex conversation is deleted;
- every Claude Code conversation is deleted;
- the laptop is restarted;
- a different coding model becomes the primary agent.

The combination of:

```text
roadmap
+ AGENTS.md
+ CLAUDE.md
+ ADRs
+ CURRENT_STATE.md
+ PROJECT_MEMORY.md
+ HANDOFF.md
+ REVIEW_LOG.md
+ tests
+ Git history
```

must be sufficient for a competent new agent to continue the project accurately.

This is a core architecture invariant, not optional documentation hygiene.

---

# 38. v1.4 verified provider references

These provider-specific assumptions were checked against current official documentation when v1.4 was produced.

## OpenAI Codex

- `AGENTS.md` project instructions:
  https://developers.openai.com/codex/agent-configuration/agents-md
- non-interactive `codex exec`:
  https://developers.openai.com/codex/non-interactive-mode
- sandboxing and approvals:
  https://developers.openai.com/codex/agent-approvals-security

## Anthropic Claude Code

- project memory and `CLAUDE.md`:
  https://docs.anthropic.com/en/docs/claude-code/memory
- security and permission model:
  https://docs.anthropic.com/en/docs/claude-code/security
- CLI reference:
  https://docs.anthropic.com/en/docs/claude-code/cli-reference
- hooks:
  https://docs.anthropic.com/en/docs/claude-code/hooks-guide

---

# 39. Version 1.4 changes

Version 1.4 makes the build process explicit enough to hand directly to coding agents.

Added:

- explicit User / Codex / Claude roles;
- Codex-primary / Claude-review workflow;
- mandatory Phase 0A;
- exact initial repository tree;
- explicit timing and purpose of `AGENTS.md`;
- mandatory `AGENTS.md` sections/rules;
- explicit `CLAUDE.md` bridge;
- Harry-owned shared project memory;
- current-state, handoff, review, open-question and capability ledgers;
- private gitignored local-memory area;
- agent concurrency rule;
- exact Phase 0A execution order;
- exact Phase 0A acceptance gate;
- exact Claude review gate;
- copy/paste bootstrap and review prompts;
- recovery requirement independent of provider chat history.

**Windmill remains optional and is not required to build Harry.**



# 40. Canonical Phase 0A file templates

The following are **minimum canonical contents**. Codex may fill concrete commands/paths after inspecting the machine, but must not weaken these rules.

## 40.1 Root `AGENTS.md`

```markdown
# Harry Engineering Contract

## 1. Mission

Build Harry as a local-first, voice-first personal AI operating layer.
Harry is the persistent orchestrator. Models and coding agents are replaceable workers.

## 2. Current phase

Read `docs/agent-context/CURRENT_STATE.md`.
Implement only the phase explicitly approved by the user.
Do not implement later-phase infrastructure merely because it may be useful later.

## 3. Sources of truth

Read in this order when relevant:

1. `HARRY_ARCHITECTURE_ROADMAP_v1.4.md`
2. `AGENTS.md`
3. `docs/agent-context/CURRENT_STATE.md`
4. `docs/architecture.md`
5. `docs/security.md`
6. relevant ADRs
7. `docs/agent-context/PROJECT_MEMORY.md`
8. latest `docs/agent-context/HANDOFF.md`

If sources conflict, stop and surface the conflict instead of silently choosing.

## 4. Architecture invariants

- Harry is the orchestrator, not one model provider.
- Local-first processing is preferred where the roadmap requires it.
- Repeatable actions should become deterministic skills/tools.
- Model/provider integrations must be replaceable behind adapters.
- Do not make Windmill or any optional workflow framework a core dependency.
- Do not create direct paid API dependencies unless the user explicitly approves them.
- Codex CLI and Claude Code may be used through supported subscription authentication.
- Keep the system viable on the currently measured laptop.

## 5. Security invariants

- Never commit credentials, auth tokens, passwords, cookies, private keys or secrets.
- Never print secrets into logs, prompts or review files.
- Do not keep Harry permanently elevated as Administrator.
- Use least privilege.
- High-risk/destructive/external actions require explicit approval.
- Untrusted documents/web/email content never overrides system/tool policy.
- Do not weaken sandboxing or approval controls for convenience.
- Do not expose Harry/Ollama/raw shell ports directly to the public internet.

## 6. Permission rules

- Read-only/reversible local work may proceed only within the currently allowed scope.
- External communications, purchases, deployments, public publishing and destructive operations require user approval.
- Never infer permanent permission from one prior approval unless the user explicitly grants a durable scoped permission.

## 7. Coding standards

- Python is the primary Harry runtime unless an ADR changes this.
- Use type hints for public interfaces.
- Keep modules focused and dependency direction explicit.
- Use Pydantic or equivalent typed boundaries for tool/model input where appropriate.
- Prefer standard library/simple dependencies before adding frameworks.
- Pin/lock dependencies after compatibility is verified.
- Do not add dependencies without explaining why they are necessary.

## 8. Testing requirements

- Add/update tests for behavioral changes.
- Run the smallest relevant test set during development.
- Run the phase's required validation before completion.
- Never claim a test passed unless it was actually executed.
- Record important commands/results in the handoff.

## 9. Git/change discipline

- Inspect `git status`, relevant diffs and recent history before significant edits.
- Preserve unrelated user changes.
- Prefer small coherent changes.
- Do not hard-reset, force-push or destructively rewrite history without explicit approval.
- Show a concise diff summary before phase acceptance.

## 10. Shared-memory protocol

After significant work:
- update `docs/agent-context/CURRENT_STATE.md`;
- record durable verified lessons in `PROJECT_MEMORY.md`;
- update `CAPABILITY_LEDGER.md` when capability maturity changes;
- place unresolved architecture questions in `OPEN_QUESTIONS.md`;
- create/update an ADR for durable architecture decisions;
- write `HANDOFF.md`.

Do not use shared memory as a raw chat transcript.

## 11. Agent handoff protocol

The handoff must identify:
- agent;
- task/scope;
- changes;
- files affected;
- tests actually executed;
- results;
- caveats/risks;
- recommended next action;
- actions awaiting user approval.

## 12. Forbidden actions

Do not:
- skip the current phase gate;
- invent hardware facts;
- silently introduce paid APIs;
- store secrets in source control;
- bypass Harry permission policy;
- publish employer/client confidential information;
- run destructive system/Git operations without approval;
- claim unimplemented features work;
- fabricate validation results.

## 13. Definition of done

A task is done only when:
- approved scope is implemented;
- relevant tests/validation pass or failures are clearly reported;
- security/permission invariants remain intact;
- docs/state are updated where required;
- Git diff is understood;
- remaining risks are stated;
- the current phase gate has not been bypassed.
```

## 40.2 Root `CLAUDE.md`

```markdown
# Claude Code Instructions for Harry

Harry's canonical engineering contract is `AGENTS.md`.

At the start of work:

1. Read `AGENTS.md`.
2. Read `HARRY_ARCHITECTURE_ROADMAP_v1.4.md` for the active scope.
3. Read `docs/agent-context/CURRENT_STATE.md`.
4. Read `docs/agent-context/PROJECT_MEMORY.md`.
5. Read `docs/agent-context/HANDOFF.md`.
6. Read relevant ADRs and security/testing docs.

Default role: **independent reviewer**.

Unless the user explicitly asks you to implement:
- inspect rather than broadly rewrite;
- review the actual Git diff and test evidence;
- identify correctness, security, architecture and scope issues;
- do not change working code merely for stylistic preference;
- record findings in `docs/agent-context/REVIEW_LOG.md`.

Use severity:
- BLOCKER
- HIGH
- MEDIUM
- LOW
- NOTE

Respect all phase, security, permissions, Git and shared-memory rules from `AGENTS.md`.

Claude Code's native auto-memory is supplemental only.
Critical Harry project knowledge must be written to the repository-owned shared context so Codex and future agents can read it.

Do not begin a later phase without explicit user approval.
```

## 40.3 `docs/agent-context/CURRENT_STATE.md`

```markdown
# Current State

## Current phase
Phase 0A — Repository Bootstrap

## Current milestone
Not yet accepted

## Last completed deliverable
None / update accurately

## What works
- Update with verified facts only.

## What is broken or incomplete
- Update accurately.

## Next approved task
- Update accurately.

## Last verified tests
- Command:
- Result:

## Last known-good Git commit
- Commit:

## Environment notes
- Only facts that materially affect development.
```

## 40.4 `docs/agent-context/HANDOFF.md`

```markdown
# Agent Handoff

## Agent
Codex / Claude Code

## Task

## Scope

## Changes made or reviewed

## Files affected

## Tests executed

## Results

## Risks / caveats

## Recommended next action

## User approval required for
```

## 40.5 `docs/agent-context/PROJECT_MEMORY.md`

```markdown
# Project Memory

Store only durable, verified Harry engineering knowledge.

## Hardware facts

## Proven setup commands

## Compatibility findings

## Architecture conventions

## Recurring problems and root causes

## Benchmark findings

## Other durable lessons
```

## 40.6 `docs/agent-context/OPEN_QUESTIONS.md`

```markdown
# Open Questions

## Template

### Question

### Why it matters

### Options

### Current recommendation

### Status
OPEN / DECIDED

### Decision record
Link ADR when resolved.
```

## 40.7 `docs/agent-context/REVIEW_LOG.md`

```markdown
# Review Log

Append reviews; do not silently erase earlier findings.

## Review template

- Date:
- Reviewer:
- Commit/diff:
- Severity:
- Finding:
- Files:
- Recommendation:
- Disposition:
```

## 40.8 `docs/agent-context/CAPABILITY_LEDGER.md`

```markdown
# Capability Ledger

| Capability | Level | Local successes | Assisted successes | Failures | Last verified | Notes |
|---|---:|---:|---:|---:|---|---|
```

These templates are deliberately provider-neutral and remain useful if Codex or Claude Code is replaced later.


# 41. Harry Brain Architecture — canonical memory vs visualizers

Harry's brain must be **owned by Harry**, not by Logseq, Obsidian, Joplin, SiYuan, a vector database vendor, or any other note-taking/visualization application.

```text
                         HARRY

                 Harry Knowledge Engine
                         │
         ┌───────────────┼────────────────┐
         │               │                │
         ↓               ↓                ↓
   Canonical facts    Structured       Semantic
   and documents       memory            index
    (Markdown)         (SQLite)        (embeddings)
         │               │                │
         └───────────────┼────────────────┘
                         ↓
                 Relationship layer
                         │
                         ↓
                  Brain Projection API
                         │
            ┌────────────┴─────────────┐
            ↓                          ↓
      Harry native UI            Logseq adapter
      (future/default)            (optional UI)
                                       │
                                       ↓
                              Disposable local graph
```

## 41.1 Hard invariant

> **A visualization tool may display Harry's knowledge, but it must never become the source of truth for Harry's knowledge.**

Harry must continue to function if Logseq is not installed, broken, deleted, changes storage formats, or if the generated Logseq graph is removed.

No core Harry capability may import Logseq as a required runtime dependency.

---

# 42. Canonical Harry Knowledge Store

The runtime user brain is distinct from the repository's engineering-agent memory.

## 42.1 Engineering project memory

Repository files such as:

```text
docs/agent-context/CURRENT_STATE.md
docs/agent-context/PROJECT_MEMORY.md
docs/agent-context/HANDOFF.md
```

exist to keep Codex, Claude Code and future engineering agents aligned while **building Harry**.

## 42.2 Runtime personal brain

Harry's actual personal/user memory must live outside the Git repository.

Recommended Windows layout:

```text
%USERPROFILE%\HarryData\
├─ brain\
│  ├─ brain.sqlite
│  ├─ knowledge\
│  │  ├─ people\
│  │  ├─ projects\
│  │  ├─ career\
│  │  ├─ decisions\
│  │  └─ notes\
│  ├─ attachments\
│  ├─ indexes\
│  │  └─ semantic\
│  └─ schemas\
│
├─ derived\
│  └─ visualizers\
│     └─ logseq\
│
├─ backups\
└─ logs\
```

The exact path may change by configuration, but Harry must preserve the distinction:

```text
canonical/
derived/
backup/
```

The visualizer directory is **derived data**. Deleting it must not delete canonical knowledge.

## 42.3 Canonical responsibilities

Harry owns stable memory IDs, timestamps, provenance, memory type, privacy classification, user-editable content, relationship edges, semantic index metadata, retention/deletion state, source links and verification state.

A visualizer owns none of these concepts.

---

# 43. Logseq Research Decision

## Decision

Use **Logseq as an optional, on-demand brain visualization UI**, not as Harry's database, memory system, sync service, AI interface, or source of truth.

## Why Logseq fits

Current official Logseq material describes it as open source under AGPL-3.0, privacy-first, focused on user control and longevity, supportive of Markdown/Org-mode knowledge workflows, and extensible through a plugin API.

Those characteristics make it a strong **visual exploration surface** for Harry's projected knowledge graph.

## Current-state warning

At the time of v1.5, Logseq is actively transitioning toward a database-graph architecture. Its official repository states that the DB version is beta, its new mobile/RTC components are alpha, and data loss is possible in the beta; regular backups are recommended.

Therefore Harry must **not depend on Logseq's internal DB schema or storage transition**.

This reinforces the adapter/projection design.

---

# 44. One-way Logseq Projection

Harry will never point Logseq at Harry's canonical memory folders.

```text
Harry canonical brain
        ↓
privacy filter
        ↓
projection builder
        ↓
generated Logseq-compatible graph
        ↓
Logseq renders it
```

The direction is one-way.

## 44.1 Generated location

Example:

```text
%USERPROFILE%\HarryData\derived\visualizers\logseq\
```

This directory is disposable.

It may contain a Logseq-compatible set of pages/assets/configuration plus:

```text
PROJECTION_MANIFEST.json
README_GENERATED.md
```

depending on the stable Logseq graph format used at implementation time.

**Build atomically.** Generate into a sibling temporary directory and rename it
over the live path only once the build succeeds. A half-written projection must
never be openable — a partially generated graph that renders looks like memory
loss to a user, and that confusion is exactly what section 50.8 exists to
prevent. Mark generated files read-only while writing them; it will not stop a
determined edit, but it turns the section 50.4 mistake into a deliberate act
rather than an accident.

**The manifest is a receipt, not a label.** `PROJECTION_MANIFEST.json` carries:

```json
{
  "canonical_snapshot_hash": "sha256:...",
  "profile": "overview",
  "policy_version": "1.0.0",
  "generator_version": "...",
  "generated_at": "2026-08-15T08:00:00+02:00",
  "counts": { "projected": 0, "excluded_by_class": 0, "redacted_by_scanner": 0 },
  "entity_types": { "project": 0, "person": 0, "skill": 0, "decision": 0 }
}
```

This turns the reproducibility gate in section 50.7 from a judgement call into
an assertion, and gives `brain.projection.audit` something concrete to check.

## 44.2 Generated-data warning

Every projection should make this clear:

```text
GENERATED FROM HARRY KNOWLEDGE ENGINE
DO NOT USE THIS COPY AS THE SOURCE OF TRUTH
Edits made here are not imported back into Harry.
```

## 44.3 Stable identity

Every projected entity carries a stable Harry ID.

Example:

```markdown
harry-id:: mem_01HZX...
harry-type:: project
harry-privacy:: personal
harry-updated:: 2026-08-15T08:00:00+02:00

# Atlas

Related:
- [[Python]]
- [[FastAPI]]
- [[Career]]
```

The page title is for humans. `harry-id` is the stable identity.

## 44.4 Relationships originate in Harry

Examples:

```text
Uzi ──works_on──> Harry
Harry ──uses──> Ollama
Harry ──has_mode──> Career Intelligence
Career Intelligence ──tracks──> Skills
Project Atlas ──uses──> FastAPI
```

Logseq receives a representation of those relationships; it does not define them.

---

# 45. Projection Privacy Firewall

Not every memory belongs in a graph UI.

Before any memory reaches a visualizer it passes through a **projection privacy policy**.

## 45.1 Allowlist first — deny by default

**A memory is projected only if its privacy classification is explicitly named
in the active profile's `include` list.** Anything unclassified, newly
introduced, or not named is dropped.

This is the difference between a system that is deny-safe and one that merely
looks careful. An exclusion list only protects against the categories someone
thought of on the day they wrote it; every memory type invented afterwards
arrives unlisted and therefore permitted. The allowlist inverts that: new
categories are invisible to visualizers until a human adds them.

The list below is retained as a second, belt-and-braces denylist. It must never
be the only thing standing between a credential and a rendered graph.

Never project, even if a profile would otherwise allow it:

- passwords;
- API keys;
- authentication tokens;
- private keys;
- browser cookies;
- credential-store contents;
- `.env` secrets;
- password-manager data;
- raw confidential employer code;
- confidential client information;
- raw private email unless explicitly selected;
- sensitive memory categories excluded by the user;
- hidden/system prompts;
- model-provider credentials.

## 45.2 Projection profiles

```yaml
brain_visualization:
  default_profile: overview

profiles:
  overview:
    include:
      - projects
      - technologies
      - public_safe_career
      - decisions
      - interests
    exclude:
      - secrets
      - raw_email
      - credentials
      - employer_confidential

  developer:
    include:
      - personal_projects
      - technologies
      - architecture_decisions
      - capabilities

  career:
    include:
      - sanitized_achievements
      - skills
      - target_roles
      - interview_topics

  private_full:
    include:
      - user_approved_private_memory
    exclude:
      - credentials
      - cryptographic_secrets
```

Even `private_full` never includes credential material.

## 45.3 Redaction

Projected text may be rewritten into visualization-safe summaries.

Example:

```text
Canonical:
Implemented internal reconciliation service for Client X using proprietary APIs.

Projected Career view:
Built a production reconciliation service for high-volume transaction workflows.
```

## 45.4 Secret scanning — the second layer

Classification protects *categories*. It does nothing about a credential pasted
into the body of an otherwise-projectable note — an API key in the middle of an
architecture decision, a connection string in a project note.

Every projected string therefore passes an independent scanner before it is
written:

- known credential patterns (provider key prefixes, PEM blocks, JWTs,
  connection strings, `Authorization:` headers);
- high-entropy token heuristics;
- anything matching the user's configured secret patterns.

A hit **fails closed** — the field is redacted or the entity is dropped — and
records a redaction event in the projection audit. A scanner that merely warns
is not a control.

---

# 46. Logseq Isolation Policy

Harry uses Logseq as a **viewer**.

## 46.1 Do not enable for Harry's graph

- Logseq cloud sync;
- RTC collaboration;
- publishing;
- AI integrations that transmit the graph;
- Logseq MCP access for Harry's graph — **note this is a shipping feature, not
  a hypothetical**: the DB version documents an optional MCP server that can run
  against the current graph from either the desktop app or the CLI, with create,
  edit and search capability. It must be verified *off* for Harry's graph, and
  `brain.projection.verify_isolation` should assert it;
- local HTTP write APIs for Harry integration;
- third-party plugins unless explicitly reviewed.

## 46.2 No canonical filesystem access

The Logseq process is never configured with Harry's canonical brain directory.

It only receives the generated visualization directory.

## 46.3 Optional strict offline mode

Harry may offer:

```text
Brain Visualizer: Strict Offline
```

In that mode cloud features remain disabled and Harry may use a Windows Firewall
rule to block Logseq network egress while Harry's graph is open.

Firewall changes require normal Harry permission handling.

**Assert the outcome, not the configuration.** Strict-offline mode is only
proven when a viewer session ends with evidence that *zero outbound connections
occurred* — not merely that a rule was created. Two failure modes make this
necessary:

1. a Windows Firewall rule keyed to an executable path stops matching when an
   Electron application updates into a new versioned path, so the rule silently
   stops applying and the mode fails open;
2. a rule can exist and still be superseded by a broader allow rule.

Revalidate the executable path each time the mode is entered, and treat a
failure to verify as a refusal to launch.

## 46.4 Plugins

Start with **zero Logseq plugins** for Harry's graph.

A plugin may be allowed later only if its purpose cannot be achieved by the stock viewer, its source is reviewed, required permissions are understood, and it cannot create a backchannel into canonical Harry data.



# 47. Handling Logseq's storage evolution

Harry supports a **visualizer adapter**, not one hard-coded Logseq storage format.

Interface concept:

```python
class BrainVisualizer:
    def export_snapshot(self, snapshot, policy, destination):
        ...

    def validate_projection(self, destination):
        ...

    def destroy_projection(self, destination):
        ...
```

Initial implementation:

```text
LogseqVisualizer
```

Possible future implementations:

```text
HarryNativeVisualizer
JoplinVisualizer
SiYuanVisualizer
StaticGraphVisualizer
```

The Knowledge Engine must know nothing about Logseq-specific syntax.

Only the Logseq adapter translates Harry entities/relationships into a Logseq-consumable representation.

If the stable Logseq release at implementation time supports Markdown/file graphs, use a generated Markdown graph.

If Logseq later requires DB graphs, create a **disposable generated/imported DB graph** through supported Logseq mechanisms.

Do not couple Harry to undocumented Logseq database internals.

---

# 48. Why Logseq is preferred initially over Joplin/SiYuan for this role

This is not a claim that Logseq is universally the best note-taking application.

It is the best initial **Harry brain visualizer candidate** because the requirement is specifically:

```text
linked knowledge
+ graph exploration
+ local-first/open-source preference
+ generated projection
+ replaceability
```

## Joplin

Joplin is open-source and mature, and graph visualization is available through plugins. It remains a possible future adapter.

For Harry's initial brain-view use case, relying on an additional graph plugin provides less value than Logseq's graph-centric knowledge model.

## SiYuan

SiYuan is a strong privacy-first open-source knowledge system with block-level references, bidirectional links, an API and rich local functionality.

It also has its own richer block/database workspace model.

For Harry's initial requirement — disposable visualization of generated relationships — Logseq is the simpler conceptual fit.

## Architectural conclusion

The decision is not:

> "Harry uses Logseq."

It is:

> **"Harry supports visualizer adapters; Logseq is Visualizer Adapter #1."**

---

# 49. Phase 3B — Brain Visualizer

Phase 3B begins only after Phase 3 canonical memory/retrieval is working.

It is not required for Phase 1 or Phase 2.

On the current ~16 GB Harry machine, Logseq should be **on-demand**, not an always-running background process.

## 49.1 Deliverable

The user can say:

> "Harry, show me your brain."

Harry:

1. builds or refreshes a sanitized projection;
2. launches Logseq on the disposable graph;
3. optionally presents the window through Harry's projector UI;
4. lets the user explore people/projects/skills/decisions visually;
5. closes the viewer without changing canonical memory.

Example follow-ups:

> "Harry, show me everything connected to Career Mode."

> "Show me the Atlas project graph."

> "Show me the technologies I've actually used this year."

## 49.2 Skills

Add:

- `brain.snapshot`
- `brain.project`
- `brain.project_profile`
- `brain.relationships`
- `brain.visualizer.open`
- `brain.visualizer.close`
- `brain.visualizer.refresh`
- `brain.visualizer.destroy_projection`
- `brain.visualizer.status`
- `brain.projection.audit`
- `brain.projection.redact`
- `brain.projection.verify_isolation`

These skills participate in the emergency stop defined in section 8A. If a
projection is open when the user says *"Harry, stop everything"*, the viewer is
closed and the projection build is cancelled. A generated mirror left open
after a stop is a loose end the user did not ask for.

## 49.3 Suggested implementation files

```text
src/harry/brain/schema.py
src/harry/brain/projection.py
src/harry/brain/privacy.py
src/harry/visualizers/base.py
src/harry/visualizers/logseq.py
tests/brain/test_projection.py
tests/brain/test_privacy.py
tests/visualizers/test_logseq_projection.py
```

Runtime generated data remains outside the repository.

---

# 50. Brain Visualizer acceptance gate

Phase 3B is accepted only when all of the following pass.

## 50.1 No-dependency test

Disable/uninstall Logseq or configure Harry as though Logseq does not exist.

All canonical memory, retrieval, voice, skills, developer-mode and Career Mode foundations must continue to work.

## 50.2 Delete-the-view test

Delete:

```text
%USERPROFILE%\HarryData\derived\visualizers\logseq\
```

Harry must lose **zero canonical memories**.

The graph must be regenerable.

## 50.3 Canonical checksum test

Take hashes/checksums of canonical memory before:

1. generate projection;
2. open Logseq;
3. browse graph;
4. close Logseq.

Canonical memory must remain unchanged unless the user separately asked Harry to alter memory.

## 50.4 Edit-the-mirror test

Manually edit a generated Logseq page.

Harry's canonical memory must remain unchanged.

On the next projection rebuild, Harry may overwrite the mirror edit.

## 50.5 Secret-exclusion test

Seed test memory with fake:

- API key;
- password;
- `.env` content;
- employer-confidential item.

Generate every normal visualization profile.

None may appear in the projected graph.

## 50.6 Offline test

Disconnect the network or enable strict-offline visualizer mode.

The projected graph must still be browsable.

## 50.7 Reproducibility test

Given the same canonical snapshot + projection policy, the node set, edge set, Harry IDs and privacy decisions must reproduce consistently.

## 50.8 Visualizer failure test

Corrupt or remove the Logseq projection.

Harry must report:

> "The visualization needs rebuilding."

It must not report:

> "My memory is corrupted."

Those are fundamentally different failure domains.

## 50.9 Unclassified-memory test

Introduce a memory of a type the projection policy has never seen, with no
privacy classification.

It must **not** appear in any profile. This is the test that proves the filter
is an allowlist rather than a denylist, and it is the one most likely to fail
on a system that looks correct by inspection.

## 50.10 Embedded-secret test

Seed a fake credential *inside the body* of a memory that is otherwise
projectable — an API key in the middle of an architecture decision note.

The scanner in section 45.4 must redact or drop it. Section 50.5 proves
category filtering; this proves content filtering. Passing one does not imply
the other.

## 50.11 Zero-egress test

Run a full visualizer session in strict-offline mode and assert that **no
outbound network connection was made** by the viewer process for the duration.

Asserting that a firewall rule exists is not this test.

---

# 51. Brain Visualizer security model

## Threat: visualizer becomes a hidden writer

Mitigation:

- never ingest changes from generated Logseq files;
- no two-way sync;
- no direct canonical path;
- projection directory clearly marked derived/disposable.

## Threat: private data is over-projected

Mitigation:

- projection privacy firewall;
- allowlists;
- tests with seeded fake secrets;
- projection audit before launch.

## Threat: Logseq/plugin sends projected data externally

Mitigation:

- sync/publish disabled;
- no plugins initially;
- strict-offline/firewall mode available;
- visualization profile minimizes exposed data.

## Threat: Logseq format/API changes

Mitigation:

- adapter interface;
- no Logseq imports in Knowledge Engine;
- projection format isolated in one module;
- phase tests require Harry to operate without Logseq.

## Threat: user edits Logseq expecting Harry to learn it

Mitigation:

- generated-data warnings;
- voice explanation;
- no silent backflow.

If note capture from the visualizer is desired later, it must be a separate explicit feature:

```text
Logseq note
   ↓
"Send to Harry"
   ↓
Harry import preview
   ↓
user approval
   ↓
canonical memory
```

That is intentionally **not** part of Phase 3B.

---

# 52. Performance policy for the 16 GB machine

The Brain Visualizer is not an always-on Harry daemon.

Default behavior:

```text
Harry running normally
    ↓
Logseq closed

User asks for brain view
    ↓
generate incremental projection
    ↓
launch Logseq
    ↓
browse
    ↓
close when finished
```

This avoids continuously spending RAM on an optional UI.

Projection should also avoid putting every low-value event into the graph.

Prefer meaningful entities/relationships:

- people;
- projects;
- skills;
- technologies;
- decisions;
- goals;
- career achievements;
- capabilities;
- important documents.

Raw conversation turns and every command execution should not each become graph nodes.

---

# 53. Future Harry-native Brain UI

Logseq is an acceleration tool, not the end-state requirement.

Later Harry can build a native visual brain interface that reads the same Brain Projection API.

A future native UI could support:

- graph exploration;
- timeline;
- memory provenance;
- privacy classification;
- confidence;
- filters by mode;
- Career graph;
- project graph;
- "why do you remember this?";
- delete/edit memory;
- relationship editing;
- projector-first presentation;
- phone view.

When that exists, the native Brain UI may become the default.

Logseq can remain as an optional power-user view.

No migration of canonical memory is necessary because Logseq never owned it.

---

# 54. Phase 3B Codex implementation prompt

When Phase 3 has passed and the user explicitly starts Phase 3B:

```text
Read AGENTS.md, HARRY_ARCHITECTURE_ROADMAP_v1.5.md,
CURRENT_STATE.md, PROJECT_MEMORY.md and the relevant Phase 3 memory code.

We are implementing Phase 3B — Brain Visualizer only.

Harry's canonical memory MUST remain independent from Logseq.
Do not point Logseq at canonical Harry memory.
Do not create two-way synchronization.
Do not enable Logseq Sync, RTC, publishing, MCP, cloud AI or third-party plugins for Harry's graph.

Implement the BrainVisualizer abstraction and a Logseq adapter that creates a disposable one-way projection under HarryData/derived/visualizers/logseq.

Implement the projection privacy firewall first.
Add fake-secret tests and every Phase 3B acceptance test from the roadmap.
Harry must pass its core memory tests with the Logseq adapter disabled/unavailable.

Before implementation, show the exact data-flow and trust boundary.
After implementation, run the full Phase 3B validation, update CURRENT_STATE.md and HANDOFF.md, show the diff and stop for Claude review.
```

---

# 55. Phase 3B Claude review prompt

```text
Read CLAUDE.md, AGENTS.md, HARRY_ARCHITECTURE_ROADMAP_v1.5.md,
CURRENT_STATE.md and HANDOFF.md.

Review Phase 3B as a privacy/security boundary.

The most important invariant is:
LOGSEQ MUST NOT OWN, MUTATE OR BECOME REQUIRED FOR CANONICAL HARRY MEMORY.

Verify:

1. one-way projection only;
2. no canonical path given to Logseq;
3. no reverse ingestion;
4. visualization data is disposable;
5. projection privacy filtering is deny-safe;
6. fake secrets do not appear in projections;
7. Harry works with Logseq missing;
8. deleting the Logseq mirror does not affect Harry;
9. the Logseq adapter is isolated from the Knowledge Engine;
10. no Sync/RTC/publish/MCP/cloud-AI dependency was introduced;
11. no unnecessary always-on memory footprint was introduced for the 16 GB machine.

Record findings in REVIEW_LOG.md with the normal severity system.
Do not redesign the canonical memory store merely because another design is possible.
```

---

# 56. Research basis for v1.5

Primary/current references consulted for this architecture:

## Logseq

- Project repository / license / privacy-first positioning / Markdown support / plugin API:
  https://github.com/logseq/logseq
- Official documentation index, including graphs from existing Markdown files:
  https://docs.logseq.com/
- Current DB-version documentation and MCP-server information:
  https://github.com/logseq/docs/blob/master/db-version.md
- Current DB-version changes, including DB graph directory and SQLite storage:
  https://github.com/logseq/docs/blob/master/db-version-changes.md
- Plugin API documentation:
  https://plugins-doc.logseq.com/

## Comparison references

- Joplin plugin catalogue / graph visualization:
  https://joplinapp.org/plugins/
  https://joplinapp.org/plugins/plugin/joplin-plugin-knowledge-graph/
- SiYuan project:
  https://github.com/siyuan-note/siyuan

Research conclusion:

> Logseq is useful to Harry because of linked-knowledge visualization, not because Harry needs Logseq's database.

---

# 57. Version 1.5 changes

Version 1.5 adds the **Brain Visualizer architecture**.

Key decisions:

- Harry owns all canonical memory.
- Runtime personal memory is explicitly separated from the Git repository's engineering-agent memory.
- Visualizers receive a one-way, privacy-filtered projection.
- Logseq becomes `BrainVisualizer` adapter #1.
- Logseq is optional, disposable and on-demand.
- No Logseq Sync, RTC, publishing, MCP, cloud AI or plugin dependency is required.
- Logseq never receives the canonical brain path.
- Edits inside the Logseq mirror never flow back into Harry.
- The current Logseq DB transition is treated as an implementation detail behind the adapter.
- Phase 3B now has a deliverable, skills list, Codex prompt, Claude review prompt and hard acceptance gate.
- Harry must pass a no-Logseq test before Phase 3B can be accepted.
- The design remains practical on the current ~16 GB machine by launching the visualizer only on demand.

---

# 58. Visualizer adapter selection

Section 47 lists `StaticGraphVisualizer` as a possible future implementation.
It deserves to be considered as **adapter #0** — the default — with Logseq as
the power-user option rather than the first dependency.

## 58.1 Match the adapter to the requirement

The stated requirement is narrow and unusually well suited to a generated
artifact:

```text
read-only
+ disposable
+ on-demand
+ offline
+ projector-legible
+ regenerable from canonical memory
```

Nothing in that list requires a note-taking application. A generated,
self-contained HTML graph satisfies all of it while introducing **no
third-party runtime into a privacy-critical path**:

| Concern | Static generated graph | Electron note app |
|---|---|---|
| Third-party runtime in the path | none | full application |
| Plugin surface | none | present, reviewable |
| MCP / sync / publish toggles | none exist | must be disabled and verified |
| Storage-format churn | none | active migration |
| Idle RAM on a 16 GB machine | ~0 | a running desktop app |
| Renders on the projector | yes | window capture |
| Renders on the phone PWA | yes | no |

The last row matters more than it first appears: the phone client already
exists as a surface in this architecture. A static projection is viewable there
without building anything new, which the Logseq path cannot offer.

## 58.2 Logseq remains adapter #1

This is not an argument against Logseq. Graph exploration, backlinks and query
ergonomics in a mature tool are genuinely better than anything a generated page
will produce early on, and the adapter interface exists precisely so both can
coexist.

The recommendation is only about **which one is the default**, and therefore
which one a privacy failure would run through.

## 58.3 If Logseq is adapter #1, target Logseq OG

Logseq has split into two products:

- **Logseq OG** — file-based Markdown/Org graphs, its own repository, and the
  project's stated position is that it remains maintained and that no user is
  forced to migrate;
- **Logseq DB** — SQLite as the canonical store, shipped as a 2.0 beta, with
  the project's own README warning that data loss is possible and recommending
  automated backups. The new mobile and RTC components are alpha, and the DB
  plugin API is itself in beta.

**Target Logseq OG.** File graphs are exactly the shape this design wants:
generated, diffable, human-inspectable, trivially deletable, and reproducible
enough to make the checksum and reproducibility gates nearly free.

The DB version inverts every one of those properties — the database becomes
canonical, files stop being the interface, and the format is under active
migration. That is the wrong shape for a disposable mirror, and adopting it
would place a beta third-party database in the path of the one thing this
entire section exists to protect.

If a DB-graph adapter is ever built, it must be a separate adapter that
*generates* a disposable graph through supported import mechanisms. Harry must
never read a DB graph as a source, and must never depend on undocumented
Logseq database internals.

---

# 59. Execution order notes for Phase 0 and Phase 1

These do not change any deliverable or gate. They change the order in which
work is attempted, to avoid two predictable ways of losing a day.

## 59.1 Run the GPU audit before choosing a model

Section 3.2 already warns that **RAM is not VRAM**. The practical consequence
is that the GPU's actual VRAM figure determines whether the chosen local model
runs on the GPU or falls back to CPU inference — which sets the latency
expectation for every phase that follows.

Run `nvidia-smi` immediately after installing the GPU driver, not at the end of
Phase 0 with the full hardware report. Discovering the VRAM figure after model
selection means the selection was made on an assumption.

The complete `docs/hardware.md` report remains where it is, as the Phase 0 exit
artifact.

## 59.2 Prove each link of the voice loop in isolation

Section 6 already gives the reason wake-word work is deferred: debugging
several unfamiliar systems simultaneously makes failures impossible to isolate.
The same logic applies *inside* Phase 1, before the loop is wired at all.

In order, each verified alone:

1. capture a WAV from the microphone — confirms device selection and OS
   permissions, the most common silent failure on a fresh Windows install;
2. run speech-to-text against that file — confirms the model loads and
   transcribes;
3. run the local model directly from the terminal — confirms the runtime and
   the pulled model;
4. synthesize one sentence to the speakers — confirms the TTS engine and its
   system dependencies.

Only then wire push-to-talk end to end. A loop assembled before its parts are
individually proven produces one symptom — silence — with four possible causes.

---

# 60. Version 1.6 changes

Version 1.6 keeps the version 1.5 architecture intact. It tightens the Brain
Visualizer's privacy boundary, adds execution-order guidance, and records
research findings that postdate v1.5.

Changed:

- **The projection privacy filter is now explicitly an allowlist** (45.1).
  Version 1.5 described an exclusion list while section 55 asked the reviewer to
  verify the filter was deny-safe; those are different systems, and the
  allowlist is the one that survives new memory types.
- **Secret scanning added as an independent second layer** (45.4), because
  category classification cannot catch a credential pasted inside an otherwise
  projectable note.
- **Projections build atomically and the manifest became a receipt** (44.1) —
  snapshot hash, policy version, and counts, making the reproducibility gate
  mechanically checkable.
- **Strict-offline mode must assert zero egress** (46.3), and revalidate the
  firewall rule's executable path, which Electron updates invalidate silently.
- **Logseq's MCP server is recorded as a shipping feature** to be verified off
  (46.1), not a hypothetical risk.
- **Three acceptance gates added** (50.9–50.11): unclassified memory, embedded
  secret, and zero egress.
- **Visualizer skills participate in the emergency stop** (49.2).
- **Adapter selection guidance added** (58): a static generated graph is
  proposed as the default adapter, with Logseq as the power-user option; if
  Logseq is used, target Logseq OG rather than the DB beta.
- **Execution-order notes added** (59): audit the GPU before choosing a model,
  and prove each link of the voice loop before wiring it.

Research basis for the additions, current as of this revision:

- https://github.com/logseq/logseq — license, DB beta status, data-loss warning
- https://github.com/logseq/og — the file-based version's own repository
- https://github.com/logseq/docs/blob/master/db-version.md — DB storage, MCP server
- https://plugins-doc.logseq.com/ — plugin API
