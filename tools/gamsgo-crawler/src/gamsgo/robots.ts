import type { BrowserContext } from 'playwright';

interface Rule {
  allow: boolean;
  pattern: string;
}
export interface RobotsPolicy {
  available: boolean;
  warning?: string;
  allows: (url: string) => boolean;
}

function ruleMatch(pattern: string, location: string): number {
  if (!pattern) return -1;
  const end = pattern.endsWith('$');
  const escaped = pattern
    .replace(/\$$/, '')
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*');
  try {
    return new RegExp(`^${escaped}${end ? '$' : ''}`).test(location)
      ? pattern.replace(/\*/g, '').length
      : -1;
  } catch {
    return -1;
  }
}

export function parseRobots(txt: string): RobotsPolicy {
  const rules: Rule[] = [];
  let currentAgents: string[] = [];
  let currentRules: Rule[] = [];
  const flush = () => {
    if (
      currentAgents.some(
        agent => agent === '*' || /^GamsgoPublicCrawler/i.test(agent),
      )
    ) {
      rules.push(...currentRules);
    }
    currentAgents = [];
    currentRules = [];
  };
  for (const source of txt.split(/\r?\n/)) {
    const line = source.replace(/#.*/, '').trim();
    if (!line) {
      if (currentRules.length) flush();
      continue;
    }
    const m = line.match(/^([\w-]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1].toLowerCase(),
      val = m[2].trim();
    if (key === 'user-agent') {
      if (currentRules.length) flush();
      currentAgents.push(val);
    } else if (
      (key === 'allow' || key === 'disallow') &&
      currentAgents.length
    ) {
      if (val) currentRules.push({ allow: key === 'allow', pattern: val });
    }
  }
  flush();
  return {
    available: true,
    allows: (u: string) => {
      const parsed = new URL(u);
      const path = parsed.pathname + parsed.search;
      let bestLength = -1,
        permitted = true;
      for (const rule of rules) {
        const length = ruleMatch(rule.pattern, path);
        if (length > bestLength || (length === bestLength && rule.allow)) {
          if (length >= 0) {
            bestLength = length;
            permitted = rule.allow;
          }
        }
      }
      return permitted;
    },
  };
}

export async function fetchRobots(
  context: BrowserContext,
): Promise<RobotsPolicy> {
  try {
    const response = await context.request.get(
      'https://www.gamsgo.com/robots.txt',
      {
        failOnStatusCode: false,
        timeout: 12000,
        headers: { accept: 'text/plain' },
      },
    );
    if (!response.ok())
      return {
        available: false,
        warning: `robots.txt returned HTTP ${response.status()}; proceeding slowly with public pages only`,
        allows: () => true,
      };
    return parseRobots(await response.text());
  } catch (err) {
    return {
      available: false,
      warning: `robots.txt unavailable (${err instanceof Error ? err.message : String(err)}); proceeding slowly with public pages only`,
      allows: () => true,
    };
  }
}
