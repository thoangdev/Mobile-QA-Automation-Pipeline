import { Env } from '../../config/env';

export interface PipelineSummary {
  buildNumber: string;
  branch:      string;
  date:        string;
  security:    string;
  api:         string;
  smoke:       string;
  regression:  string;
  visual:      string;
  a11y:        string;
  reportUrl:   string;
}

/**
 * Builds the pipeline summary from env vars set by CI after each step.
 * Safe to call locally — all fields fall back to '?' sentinel values.
 */
export function buildPipelineSummary(): PipelineSummary {
  const runNumber = Env.githubRunNumber;
  const reportUrl =
    Env.githubServerUrl && Env.githubRepository
      ? `${Env.githubServerUrl}/${Env.githubRepository}/actions/runs/${runNumber}`
      : 'http://localhost';

  return {
    buildNumber: runNumber,
    branch:      Env.githubRefName,
    date:        new Date().toISOString().split('T')[0]!,
    security:    Env.reportSecurity,
    api:         Env.reportApi,
    smoke:       Env.reportSmoke,
    regression:  Env.reportRegression,
    visual:      Env.reportVisual,
    a11y:        Env.reportA11y,
    reportUrl,
  };
}

/** Formats the summary as plain-text lines, shared by Slack and Discord renderers. */
export function summaryLines(s: PipelineSummary): string[] {
  return [
    `Build #${s.buildNumber} | ${s.branch} | ${s.date}`,
    '',
    `Security:   ${s.security}`,
    `API:        ${s.api}`,
    `Smoke:      ${s.smoke}`,
    `Regression: ${s.regression}`,
    `Visual:     ${s.visual}`,
    `A11y:       ${s.a11y}`,
    '',
    `Reports: ${s.reportUrl}`,
  ];
}
