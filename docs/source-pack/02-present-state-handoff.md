# **02 — Visible Thinking Designer — Present State Handoff — Working v0.1**

## **Document control**

* **Status:** Working draft v0.1

* **Date captured:** 19 July 2026

* **Purpose:** Internal present-state record and re-entry handoff for the OpenAI Build Week project

* **Primary artefact:** Visible Thinking Designer

* **Current stage:** Concept sufficiently stabilised to begin MVP specification and build

* **Authority:** Captures current decisions and boundaries; it is not yet the final product specification

---

## **1\. Executive state**

Visible Thinking Designer is the selected education-track concept for OpenAI Build Week.

It helps an educator redesign a real task, activity or assessment so that learner thinking, feedback, judgement and development become visible across the journey—not only in the polished final product.

The first version should be:

**An interaction that produces an artefact and quietly seeds a larger world.**

The primary form is a guided professional design interaction. Its immediate output is an editable **Visible Thinking Plan**. Its underlying structure establishes the grammar for a larger human-led capability evidence ecology.

The build must remain small enough to finish for the hackathon while preserving the possibility of later expansion. It is a doorway, not the entire institution.

---

## **2\. Current product proposition**

### **Working name**

**Visible Thinking Designer**

### **One-line pitch**

Paste or upload a learning task. Identify where capability has become invisible. Generate a small, editable sequence of visible-thinking, feedback and revision moments—with AI enabled, examined or removed.

### **Tutor problem**

The tutor can see the final product but is no longer confident that the product alone reveals the learner's thinking, capability or development.

This problem may arise because:

* AI can produce or substantially polish the final output;

* conventional assessment concentrates evidence at the endpoint;

* existing tutor conversations, demonstrations and observations are not recognised as meaningful evidence;

* feedback and revision are treated as support activities rather than evidence of learning;

* tutors are concerned about workload and do not want to manufacture an additional assessment bureaucracy;

* educators and learners hold mixed positions on AI, including enthusiastic, neutral and resistant positions.

### **Solution**

Visible Thinking Designer helps the tutor:

1. identify what capability the task is intended to reveal;

2. identify where that capability is currently invisible;

3. determine what the final product can and cannot reasonably demonstrate;

4. introduce a small number of visible-thinking moments across the journey;

5. define proportionate evidence that could be captured at those moments;

6. incorporate feedback and learner response as part of the learning evidence;

7. generate AI-enabled, AI-examined or AI-free recommendations;

8. produce an editable plan that can be used in teaching or assessment redesign.

---

## **3\. Intended change**

The intended change is larger than producing better assessment instructions.

The project seeks to shift practice:

* from judging capability primarily through finished products to recognising evidence across the learning journey;

* from policing AI use to designing learning that remains meaningful with or without AI;

* from incidental tutor observations and conversations to intentional, proportionate evidence;

* from feedback as commentary after performance to feedback-and-response as evidence of capability;

* from invisible thinking to visible decisions, interpretations, revisions and synthesis;

* from a single endpoint judgement to a richer and more defensible picture of learning.

### **Governing distinction**

**Learner capability should become more visible without the learner becoming more surveilled.**

The tool is not an AI detector, authorship detector or mechanism for exposing private cognition. It designs better windows into learning.

---

## **4\. Founding proposition**

**Visible Thinking Designer is the first doorway into a capability evidence ecology. It helps educators redesign one real task so that learner thinking, feedback and development become visible across the journey—and preserves the structure needed to learn from that design over time.**

This proposition is the current anchor. Product, interface and technical decisions should be tested against it.

---

## **5\. First-form decision**

### **Primary form: interaction**

The core experience is a guided design conversation with an educator.

The system should operate as a professional thinking partner. It should ask focused questions, make grounded recommendations, explain its reasoning where useful and leave final judgement with the educator.

It should not behave as:

* a generic template dispenser;

* an assessment oracle;

* a compliance engine;

* a one-shot prompt wrapper;

* a replacement for educator judgement.

### **Immediate output: artefact**

The interaction produces an editable **Visible Thinking Plan** that can be used, shared, printed, exported or refined.

### **Underlying form: world-seed**

The MVP should establish a reusable structured grammar:

* learner context;

* task;

* intended capability;

* thinking demand;

* invisibility point;

* visible-thinking moment;

* evidence;

* feedback;

* learner response;

* revision;

* AI stance;

* tutor judgement;

* observed outcome.

These entities should inform the data model even where the MVP exposes only a subset of them.

---

## **6\. Larger living system**

The project may ultimately belong to:

**A human-led capability evidence ecology that helps educators design, observe, recognise and strengthen learning across time.**

Working ecosystem frame: **Making Capability Visible**.

| System function | Existing or emerging component |
| :---- | :---- |
| Understand the learner | Learner Understanding Canvas |
| Clarify the task | Task Instructions Simplifier |
| Reveal underlying demands | Learning Progressions Mapping Tool |
| Design evidence across the journey | Visible Thinking Designer |
| Scaffold a specific learner capability | PETAL Essay Coach and future learner tools |
| Reflect on what happened | Professional Practice Conversation |
| Improve organisational practice | Capability Index |
| Build shared practitioner capability | Workshops, field guides, decks and Signal Intelligence |

Visible Thinking Designer is not required to implement this ecology during Build Week. It should establish a coherent first doorway and avoid choices that make the larger system impossible.

---

## **7\. Primary user and use case**

### **Primary user**

An educator, tutor, trainer, assessor or learning designer who has a real task and suspects that important learner thinking or capability is not adequately visible.

### **Primary use case**

The user brings one real learning activity, workplace task or assessment and leaves with a usable evidence-journey redesign.

### **Initial contexts**

The model should work across:

* adult and vocational education;

* tertiary and higher education;

* secondary education;

* workplace learning;

* practical, written, oral and performance-based tasks.

The MVP demonstration should use one or two sharply contrasting examples rather than attempting comprehensive sector coverage.

---

## **8\. Core interaction**

The minimum coherent interaction is:

1. **Bring the task** — paste, upload or describe a real task.

2. **Set the context** — identify learners, setting, purpose and constraints.

3. **Name the capability** — identify what the task is intended to reveal.

4. **Diagnose invisibility** — identify where the current design obscures thinking or over-relies on the final output.

5. **Choose the AI stance** — absent, available or explicitly examined.

6. **Design the journey** — generate three to five proportionate visible-thinking moments.

7. **Add the feedback loop** — specify feedback, learner response and revision opportunities.

8. **Review the evidence** — clarify what each moment may show and how it could be captured.

9. **Produce the plan** — edit, save and export a usable Visible Thinking Plan.

### **AI stance**

| Setting | Recommendation behaviour |
| :---- | :---- |
| **AI absent** | Use discussion, annotation, demonstration, questioning, drafts, peer interaction and tutor observation. |
| **AI available** | Allow legitimate AI support while making learner interpretation, selection, challenge, verification and revision visible. |
| **AI examined** | Make the learner's interaction with AI part of the evidence, including prompts, outputs rejected, claims checked, decisions made and changes explained. |

AI is therefore contextual rather than compulsory. The tool itself relies on AI but may recommend learning designs that do not.

---

## **9\. Visible Thinking Plan**

The MVP output should contain:

* task summary;

* learner and teaching context;

* intended capability or capabilities;

* diagnosis of what is currently invisible;

* limits of the existing final product as evidence;

* three to five visible-thinking moments;

* suggested evidence capture for each moment;

* feedback and learner-response points;

* selected AI stance and relevant recommendations;

* workload and proportionality notes;

* assessment-use cautions;

* editable next actions for the educator.

The plan should be understandable without reading the preceding conversation.

---

## **10\. MVP scope**

### **Must contain**

* task entry through pasted text, upload or guided description;

* focused context questions;

* structured invisibility diagnosis;

* AI stance control;

* generation of three to five visible-thinking moments;

* feedback and learner-response design;

* editable Visible Thinking Plan;

* export or print-ready output;

* sufficient structured persistence to save, reopen and refine a design;

* a coherent, runnable product experience.

### **Should contain if build time permits**

* original-task and redesigned-journey comparison;

* lightweight version history;

* a return-after-use reflection prompt;

* one-click switching between AI stances;

* two demonstration examples representing different learning contexts.

### **Explicitly out of scope for the hackathon MVP**

* learner accounts;

* storage of individual learner evidence;

* automated assessment decisions;

* authorship or AI detection;

* institutional dashboards;

* full qualification or standards mapping;

* a comprehensive framework library;

* organisational benchmarking;

* a template marketplace;

* claims that generated plans automatically meet regulatory assessment requirements.

---

## **11\. Definition of done**

### **Product definition of done**

**A tutor can bring one real task, complete one purposeful interaction, and leave with a plan they could use tomorrow. The product remembers enough structure for that tutor—or the larger system—to return, learn and build again.**

### **Operational acceptance criteria**

The MVP is done when:

1. a user can enter or upload a real task;

2. the system identifies a credible capability-visibility problem;

3. the user can select an AI stance;

4. the system generates a coherent evidence journey rather than a list of generic teaching tips;

5. feedback and learner response are structurally present;

6. the user can edit the recommendations;

7. the final plan is complete and usable without additional explanation;

8. the design can be saved and reopened or otherwise retained in structured form;

9. the product can be demonstrated end-to-end in less than three minutes;

10. the implementation is clearly more than a dressed-up prompt.

### **Global quality test**

The output must be:

* complete;

* immediately usable;

* structurally clear;

* proportionate to the teaching context;

* explicit about the limits of its recommendations.

---

## **12\. Persistence: memory, relationship and responsibility**

### **Memory to create**

The first version should remember at task-design level:

* task and context;

* capabilities under consideration;

* design decisions and rationale;

* selected visible-thinking moments;

* feedback and revision structure;

* AI stance;

* versions and refinements;

* optional tutor reflection after use.

This is **practice memory**, not merely chat history.

### **Relationship created**

Persistence changes the relationship from one-off generation to recurring professional design support.

The intended relationship is:

**The system helps the educator improve practice over time while the educator retains authority, ownership and judgement.**

### **Responsibilities created**

If learner-level evidence is ever stored, the system will assume significant responsibilities around privacy, consent, interpretation, retention, access and institutional authority.

The MVP therefore persists task-design memory, not longitudinal learner records.

It should also preserve:

* educator ownership of task designs;

* transparent reasoning and editable recommendations;

* exportability and portability;

* the ability to delete or abandon a design;

* clear separation between suggested evidence and validated assessment decisions.

---

## **13\. Governing design principles**

1. **Good teaching remains the centre.** The approach must work with AI in the room or removed from it.

2. **Journey evidence complements rather than automatically replaces the final product.** Weighting depends on the capability and context.

3. **Visible does not mean surveilled.** Use the smallest evidence burden that strengthens professional judgement.

4. **Feedback must produce response.** Feedback alone is an input; what the learner notices, changes or explains may be the stronger evidence.

5. **Existing practice should be recognised before new workload is added.** Many tutors already create visible-thinking moments informally.

6. **Educator judgement remains primary.** The system recommends; the educator decides.

7. **AI stance must be configurable.** The tool should not impose adoption as the price of participation.

8. **The output must be teachable tomorrow.** Conceptual elegance without classroom usability is failure.

9. **Preserve optionality.** The MVP should establish stable entities and portable outputs without overbuilding the ecosystem.

10. **Make the journey count.** The final artefact should not carry the entire burden of proof where capability develops across time.

---

## **14\. OpenAI Build Week context**

### **Track**

**Education** — projects that push forward AI for students, teachers or educational organisations.

### **Current deadline**

**Tuesday 21 July 2026 at 5:00 p.m. Pacific Time / Wednesday 22 July 2026 at 12:00 noon NZST.**

### **Published judging criteria**

1. **Technological Implementation** — skilful, genuine and non-trivial use of Codex.

2. **Design** — a working, coherent product experience rather than only a technical proof of concept.

3. **Potential Impact** — a specific and credible response to a real problem for a real audience.

4. **Quality of the Idea** — creativity, novelty and differentiation from existing concepts.

No weighting has been published.

### **Named judging panel**

* Thibault Sottiaux — Head of Product & Platform

* Kath Korevec — Member of Product Staff

* Tara Seshan — Member of Product Staff

* Leah Belsky — VP of Education

* Peter Steinberger — Member of Technical Staff

### **Required submission elements currently known**

* working project built with Codex using GPT-5.6;

* Education category selection;

* project description;

* public YouTube demonstration video under three minutes;

* code repository available for judging and testing;

* README with setup instructions and sample data where needed;

* clear explanation of where Codex accelerated the workflow and where key decisions were made;

* Codex /feedback session ID covering the majority of the core build.

### **Competition fit**

Visible Thinking Designer currently offers the strongest fit among the four considered ideas because it:

* addresses a real and current education problem;

* differs from common essay tutors and rewriting tools;

* aligns with OpenAI's interest in learning outcomes across time rather than endpoint performance alone;

* can demonstrate a complete user journey;

* uses AI to improve learning design without requiring AI use in the resulting activity;

* opens a credible path from educator tool to broader learning-evidence infrastructure.

---

## **15\. Ideas considered and current disposition**

| Idea | Current disposition |
| :---- | :---- |
| Task Instructions Simplifier | Retained as a future module and fallback MVP if build time collapses. Strong usability; weaker novelty. |
| Learning Progressions Mapping Tool | Retained as strategic infrastructure with particular NZ adult and vocational education value. Broader explanation and framework work required. |
| PETAL Essay Coach | Retained as a possible learner scaffold. Clear but crowded and less differentiated. |
| **Visible Thinking Designer** | **Selected Build Week concept. Strongest combination of novelty, alignment, impact and future opportunity.** |

---

## **16\. Evidence base to carry into the build**

The concept is grounded in existing field practice and research rather than originating as a hackathon abstraction.

### **Internal and field sources**

* YMCA Christchurch Visible Thinking workshop model and field evidence;

* participant evidence regarding mixed AI positions, workload and already-existing visible-thinking practices;

* Thinking Visible Canvas and related workshop resources;

* research-hardened revision of the model developed for Signal Intelligence 004;

* Perplexity Deep Research and recommendations supporting the revised framework;

* EmployNZ capability-analysis work and the wider Making Capability Visible practice architecture;

* Professional Practice Conversation model and post-workshop reflection architecture.

### **External alignment sources already identified**

* OpenAI Learning Outcomes Measurement Suite, particularly its focus on learning progress over time, metacognition, productive engagement and learner response;

* OpenAI educator guidance encouraging formative assessment and visible work rather than reliance on AI detection;

* wider research on feedback, revision, assessment validity, process evidence and AI-era assessment redesign contained in the Signal 004 evidence base.

These sources should inform the system prompt, design model and demonstration rationale. They should not be pasted indiscriminately into the product.

---

## **17\. Key risks and controls**

| Risk | Control |
| :---- | :---- |
| The product becomes a generic prompt wrapper | Use structured inputs, explicit entities, editable outputs, persistence and a coherent end-to-end workflow. |
| Recommendations add excessive tutor workload | Limit the design to three to five high-value moments and surface workload implications. |
| The tool is interpreted as an AI detector | State explicitly that it redesigns evidence and does not infer authorship. |
| Visible thinking becomes learner surveillance | Persist task designs, not learner records; recommend proportionate evidence. |
| Generated plans are treated as automatically valid assessment | Preserve educator judgement and include clear assessment-use cautions. |
| The world-seed expands the hackathon scope | Implement only the first doorway; encode extensibility in the model rather than building future modules. |
| Domain complexity makes the demo unclear | Use one simple primary example and one optional contrasting example. |
| The final product is polished but technically trivial | Make GPT-5.6 reasoning, structured generation, state, editing and persistence demonstrable. |
| Time is consumed by branding or architecture | Retain the working name and prioritise the complete user journey. |

---

## **18\. Decisions already made**

* Enter the Education track with Visible Thinking Designer.

* Treat the product as an interaction first, artefact second and world-seed underneath.

* Generate a Visible Thinking Plan as the primary output.

* Include feedback and learner response in the core model.

* Include configurable AI stances.

* Avoid learner-level data and automated assessment judgement in the MVP.

* Preserve a larger Making Capability Visible ecology without attempting to build it now.

* Publicly signal the concept selectively while keeping the research model and detailed mechanism private until submission.

* Do not tag a sitting judge in pre-judging promotion.

---

## **19\. Decisions still required**

These are the next legitimate design decisions, not blockers to preserving the current state:

1. **Primary demonstration task:** choose the clearest task for the under-three-minute demo.

2. **Interaction depth:** decide the minimum number of questions needed before the first useful diagnosis.

3. **Technical surface:** choose the fastest credible application architecture that supports structured state, editing and export.

4. **Persistence method:** determine the smallest task-level save-and-reopen mechanism suitable for the MVP.

5. **Export format:** select the initial output format, with print-ready web/PDF as the likely minimum.

6. **Model architecture:** decide which stages require GPT-5.6 reasoning, deterministic transformation or validation.

7. **Assessment language:** finalise wording that is useful internationally without making unsupported regulatory claims.

8. **Evidence-base compression:** convert the research-hardened model into the smallest reliable internal design specification.

9. **Visual identity:** establish only enough design language for a coherent product experience.

10. **Testing cohort:** identify two to five educators who can test the core flow quickly.

---

## **20\. Re-entry sequence**

When work resumes, begin here:

1. ingest the Signal 004 model, Perplexity research and supplementary handoff;

2. extract the smallest stable Visible Thinking design method;

3. choose the primary demonstration task;

4. write the product flow and screen-level acceptance criteria;

5. define the structured data model;

6. choose the implementation surface and repository architecture;

7. build the complete happy path before adding secondary features;

8. test with real tasks;

9. refine against the four judging criteria;

10. prepare the repository, README, project description and under-three-minute demonstration.

### **First build priority**

**Task in → invisibility diagnosis → redesigned evidence journey → editable Visible Thinking Plan.**

Nothing else should displace this path until it works end to end.

---

## **21\. Present-state conclusion**

The concept has crossed the threshold from idea selection into buildable proposition.

The core problem, intended change, first form, ethical boundary, product output, larger-system relationship and MVP definition of done are sufficiently clear to begin specification and implementation.

The next task is not further conceptual expansion. It is to translate the research-hardened Visible Thinking model into the smallest coherent product method, then build the complete interaction around one real task.

The governing build discipline is:

**Small enough to finish. Complete enough to matter. Alive enough to become more than itself.**