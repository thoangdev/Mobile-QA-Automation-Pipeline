import * as fs from 'fs';
import * as path from 'path';
import { Env } from '../../config/env';

// ─── Schemas (manual validation — no zod dep required) ────────────────────────

interface UserEntry {
  username: string;
  description: string;
}

interface UsersFile {
  users: {
    standard: UserEntry;
    readOnly: UserEntry;
    newUser: UserEntry;
  };
}

function assertString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`testData validation: "${field}" must be a non-empty string`);
  }
  return value;
}

function parseUsersFile(raw: unknown): UsersFile {
  if (typeof raw !== 'object' || raw === null) throw new Error('users.json must be an object');
  const obj = raw as Record<string, unknown>;
  const users = obj['users'] as Record<string, unknown>;
  if (typeof users !== 'object' || users === null) throw new Error('users.json missing "users" key');

  function parseEntry(key: string): UserEntry {
    const entry = users[key] as Record<string, unknown>;
    return {
      username: assertString(entry?.['username'], `users.${key}.username`),
      description: assertString(entry?.['description'], `users.${key}.description`),
    };
  }

  return {
    users: {
      standard: parseEntry('standard'),
      readOnly: parseEntry('readOnly'),
      newUser: parseEntry('newUser'),
    },
  };
}

// Parse at module load time — fails fast if test-data/users.json drifts from schema.
const usersFilePath = path.resolve(process.cwd(), 'test-data/users.json');
const usersFile = parseUsersFile(JSON.parse(fs.readFileSync(usersFilePath, 'utf-8')));

// Passwords always come from env — never from JSON files.
export function getUser(role: keyof UsersFile['users']) {
  const entry = usersFile.users[role];
  return {
    username: entry.username,
    password: Env.testPassword,
    description: entry.description,
  };
}

export const TestUsers = {
  standard: getUser('standard'),
  readOnly: getUser('readOnly'),
  newUser: getUser('newUser'),
} as const;
