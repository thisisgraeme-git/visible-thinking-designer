"use client";

import Link from "next/link";
import type { ReactNode } from "react";

const stages = [
  { number: 1, label: "Task" },
  { number: 2, label: "Clarify & diagnose" },
  { number: 3, label: "Design moments" },
  { number: 4, label: "Plan" },
];

export function AppShell({
  stage,
  title,
  eyebrow,
  children,
  projectTitle,
}: {
  stage: number;
  title: string;
  eyebrow: string;
  children: ReactNode;
  projectTitle?: string;
}) {
  return (
    <main className="workbench">
      <header className="workbench-header">
        <Link className="wordmark" href="/">
          <span className="wordmark-mark" aria-hidden="true">
            VT
          </span>
          <span>
            Visible Thinking
            <small>Designer</small>
          </span>
        </Link>
        <div className="save-status" aria-label="Local save status">
          <span aria-hidden="true" />
          Saved in this browser
        </div>
      </header>

      <div className="workbench-grid">
        <aside className="stage-rail" aria-label="Design stages">
          <p className="rail-kicker">Design workbench</p>
          <ol>
            {stages.map((item) => (
              <li
                className={
                  item.number === stage
                    ? "active"
                    : item.number < stage
                      ? "complete"
                      : ""
                }
                key={item.number}
              >
                <span>{item.number}</span>
                {item.label}
              </li>
            ))}
          </ol>
          <div className="rail-note">
            <p>Central question</p>
            <strong>What thinking needs to remain with the learner?</strong>
          </div>
        </aside>

        <section className="workbench-content">
          <div className="page-heading">
            <div>
              <p className="eyebrow">{eyebrow}</p>
              <h1>{title}</h1>
              {projectTitle ? (
                <p className="project-name">{projectTitle}</p>
              ) : null}
            </div>
            <span className="stage-count">Stage {stage} of 4</span>
          </div>
          {children}
        </section>
      </div>
    </main>
  );
}
