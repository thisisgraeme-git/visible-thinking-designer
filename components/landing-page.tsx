"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { scenarioFixtures } from "@/lib/fixtures";
import { listProjects } from "@/lib/storage";
import { isLegacyUntitledTitle } from "@/lib/task-editing";
import type { VisibleThinkingProject } from "@/lib/types";

const conditionNotes = [
  ["Attempt", "calibrated to readiness"],
  ["Question", "supported by guidance"],
  ["Check", "grounded in the discipline"],
  ["Explain judgement", "tested through follow-up"],
  ["Apply", "under changed conditions"],
] as const;

export function LandingPage() {
  const [recent, setRecent] = useState<VisibleThinkingProject[]>([]);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (active) setRecent(listProjects().slice(0, 3));
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="landing">
      <header className="landing-nav">
        <Link className="wordmark" href="/">
          <span className="wordmark-mark" aria-hidden="true">
            VT
          </span>
          <span>
            Visible Thinking
            <small>Designer</small>
          </span>
        </Link>
        <p>For tertiary and vocational educators</p>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">A learning-design workbench</p>
          <h1>Design learning that leaves thinking visible.</h1>
          <p className="hero-lead">
            Bring one real task. Identify what the finished work cannot show.
            Leave with a focused plan you can use tomorrow.
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/design/new">
              Start with your task
              <span aria-hidden="true">→</span>
            </Link>
            <a className="button text-button" href="#examples">
              Explore an example
            </a>
          </div>
          <p className="boundary-copy">
            This tool uses AI to support your design. You decide whether AI
            belongs in the learner activity.
          </p>
        </div>

        <div className="thinking-orbit" aria-label="Five Conditions overview">
          <div className="orbit-question">
            <span>Central question</span>
            What thinking needs to remain with the learner?
          </div>
          <div className="condition-list">
            {conditionNotes.map(([name, note], index) => (
              <div className={`condition condition-${index + 1}`} key={name}>
                <span>{index + 1}</span>
                <p>
                  <strong>{name}</strong>
                  {name === "Apply" ? (
                    <>
                      under changed
                      <br />
                      conditions
                    </>
                  ) : (
                    note
                  )}
                </p>
              </div>
            ))}
          </div>
          <p className="orbit-note">
            Selective and recursive—not five compulsory steps.
          </p>
        </div>
      </section>

      {recent.length > 0 ? (
        <section className="recent-section" aria-labelledby="recent-heading">
          <div className="section-heading">
            <p className="eyebrow">Stored on this device</p>
            <h2 id="recent-heading">Continue a recent plan</h2>
          </div>
          <div className="recent-grid">
            {recent.map((project) => (
              <article className="recent-card" key={project.id}>
                <span>{project.status}</span>
                <h3>{project.task.title || "Untitled task"}</h3>
                {!project.task.title.trim() ||
                isLegacyUntitledTitle(project.task.title) ? (
                  <p className="legacy-name-note">Needs a task name</p>
                ) : null}
                <p>{project.task.intendedCapability}</p>
                <div className="recent-card-actions">
                  <Link href={`/design/${project.id}/plan`}>Open plan →</Link>
                  <Link
                    href={`/design/new?projectId=${project.id}&return=home`}
                  >
                    Edit task details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="examples-section" id="examples">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Three starting points</p>
            <h2>See the method across different work.</h2>
          </div>
          <p>
            Each example is editable. They demonstrate range without becoming
            fixed templates.
          </p>
        </div>
        <div className="example-grid">
          {scenarioFixtures.map((scenario, index) => (
            <article className="example-card" key={scenario.source}>
              <div className="card-index">0{index + 1}</div>
              <p className="eyebrow">{scenario.eyebrow}</p>
              <h3>{scenario.title}</h3>
              <p>{scenario.summary}</p>
              <Link href={`/design/new?source=${scenario.source}`}>
                Explore this task <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="outcome-section">
        <div>
          <p className="eyebrow">What you leave with</p>
          <h2>An editable Visible Thinking Plan.</h2>
        </div>
        <div className="outcome-points">
          <p>
            <span>01</span> Three to five consequential moments—not more
            documentation.
          </p>
          <p>
            <span>02</span> Feedback connected to what the learner does next.
          </p>
          <p>
            <span>03</span> Workload, equity and surveillance cautions made
            explicit.
          </p>
        </div>
      </section>

      <footer className="landing-footer">
        <p>
          Research-informed design language, not a checklist or validated
          assessment model.
        </p>
        <p>Educator professional judgement remains primary.</p>
      </footer>
    </main>
  );
}
