/**
 * Superpowers plugin for OpenCode.ai
 *
 * Injects superpowers bootstrap context into the system prompt.
 * Skills are discovered via OpenCode's native skill tool from symlinked directory.
 *
 * Dual support: OpenCode 2.x uses the v2 entrypoint (setup + session "context"
 * hook, which fires before every model request); OpenCode 1.x (1.18.29+) still
 * loads the same default export via server() and its experimental system
 * prompt transform. Only the default export must exist — OpenCode 1.x calls
 * every named export as a plugin.
 */

import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Simple frontmatter extraction (avoid dependency on skills-core for bootstrap)
const extractAndStripFrontmatter = (content) => {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, content };

  const frontmatterStr = match[1];
  const body = match[2];
  const frontmatter = {};

  for (const line of frontmatterStr.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
      frontmatter[key] = value;
    }
  }

  return { frontmatter, content: body };
};

// Normalize a path: trim whitespace, expand ~, resolve to absolute
const normalizePath = (p, homeDir) => {
  if (!p || typeof p !== 'string') return null;
  let normalized = p.trim();
  if (!normalized) return null;
  if (normalized.startsWith('~/')) {
    normalized = path.join(homeDir, normalized.slice(2));
  } else if (normalized === '~') {
    normalized = homeDir;
  }
  return path.resolve(normalized);
};

// Helper to generate bootstrap content
const getBootstrapContent = () => {
  const homeDir = os.homedir();
  const superpowersSkillsDir = path.resolve(__dirname, '../../skills');
  const envConfigDir = normalizePath(process.env.OPENCODE_CONFIG_DIR, homeDir);
  const configDir = envConfigDir || path.join(homeDir, '.config/opencode');

  // Try to load using-superpowers skill: the repo-relative copy first (live
  // symlink loads resolve back into this repo), then the config-dir skills
  // directory (for resolved copies of this file placed elsewhere, e.g. a
  // trial config dir where OPENCODE_CONFIG_DIR points at the scratch copy).
  const candidates = [
    path.join(superpowersSkillsDir, 'using-superpowers', 'SKILL.md'),
    path.join(configDir, 'skills', 'superpowers', 'using-superpowers', 'SKILL.md'),
  ];
  const skillPath = candidates.find((candidate) => fs.existsSync(candidate));
  if (!skillPath) return null;

  const fullContent = fs.readFileSync(skillPath, 'utf8');
  const { content } = extractAndStripFrontmatter(fullContent);

  const toolMapping = `**Tool Mapping for OpenCode:**
When skills reference tools you don't have, substitute OpenCode equivalents:
- \`TodoWrite\` → \`update_plan\`
- \`Task\` tool with subagents → Use OpenCode's subagent system (@mention)
- \`Skill\` tool → OpenCode's native \`skill\` tool
- \`Read\`, \`Write\`, \`Edit\`, \`Bash\` → Your native tools

**Skills location:**
Superpowers skills are in \`${configDir}/skills/superpowers/\`
Use OpenCode's native \`skill\` tool to list and load skills.`;

  return `<EXTREMELY_IMPORTANT>
You have superpowers.

**IMPORTANT: The using-superpowers skill content is included below. It is ALREADY LOADED - you are currently following it. Do NOT use the skill tool to load "using-superpowers" again - that would be redundant.**

${content}

${toolMapping}
</EXTREMELY_IMPORTANT>`;
};

export default {
  id: 'superpowers',

  // OpenCode 2.x: register a session "context" hook, fired before every model
  // request, that pushes the bootstrap as a text part of event.system.
  setup: async (ctx) => {
    await ctx.session.hook('context', (event) => {
      const bootstrap = getBootstrapContent();
      if (bootstrap) {
        event.system.push({ type: 'text', text: bootstrap });
      }
    });
  },

  // OpenCode 1.x (1.18.29+ accepts this dual entrypoint shape): the original
  // plugin, unchanged — system prompt transform injects the bootstrap
  // (fixes #226 agent reset bug).
  server: async ({ client, directory }) => {
    return {
      'experimental.chat.system.transform': async (_input, output) => {
        const bootstrap = getBootstrapContent();
        if (bootstrap) {
          (output.system ||= []).push(bootstrap);
        }
      }
    };
  },
};
