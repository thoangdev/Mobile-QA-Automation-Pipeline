import { Env } from '../config/env';
import { buildPipelineSummary, summaryLines } from './lib/pipeline-summary';

async function sendDiscord(): Promise<void> {
  const webhook = Env.discordWebhook; // throws EnvError if not set
  const summary = buildPipelineSummary();

  // Discord renders **bold** not *mrkdwn*, and plain URLs inline
  const lines = summaryLines(summary);
  const content = [
    `**${lines[0]}**`,
    ...lines.slice(1),
  ].join('\n');

  const res = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) {
    throw new Error(`Discord webhook failed (HTTP ${res.status}): ${await res.text()}`);
  }

  console.log('✔  Discord notification sent.');
}

sendDiscord().catch((err: Error) => {
  console.error(`\n✖  ${err.message}`);
  process.exit(1);
});
