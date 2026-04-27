import { Env } from '../config/env';
import { buildPipelineSummary, summaryLines } from './lib/pipeline-summary';

async function sendSlack(): Promise<void> {
  const webhook = Env.slackWebhook; // throws EnvError if not set
  const summary = buildPipelineSummary();
  const lines   = summaryLines(summary);

  // Wrap the report URL in Slack mrkdwn link syntax
  const text = [
    ...lines.slice(0, -1),
    `<${summary.reportUrl}|View Reports>`,
  ].join('\n');

  const payload = {
    blocks: [{ type: 'section', text: { type: 'mrkdwn', text } }],
  };

  const res = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Slack webhook failed (HTTP ${res.status}): ${await res.text()}`);
  }

  console.log('✔  Slack notification sent.');
}

sendSlack().catch((err: Error) => {
  console.error(`\n✖  ${err.message}`);
  process.exit(1);
});
