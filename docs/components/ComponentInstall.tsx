'use client';

import { Button } from './retroui';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';

/**
 * Tokenizes a shell command string into spans matching the Dracula-soft Shiki
 * theme colors used by rehype-pretty-code for fenced ```bash blocks.
 *
 * Color mapping (from Dracula-soft):
 *   #62E884 — command name (first word)
 *   #E7EE98 — arguments / subcommands
 *   #BF9EEE — flags (tokens starting with -)
 */
const DRACULA_CMD = '#62E884';
const DRACULA_ARG = '#E7EE98';
const DRACULA_FLAG = '#BF9EEE';

const highlightCommand = (command: string): ReactNode[] => {
  const tokens = command.split(/(\s+)/);
  const nodes: ReactNode[] = [];
  let isFirstWord = true;

  for (const [i, token] of tokens.entries()) {
    if (/^\s+$/.test(token)) {
      nodes.push(
        <span key={i} style={{ color: DRACULA_ARG }}>
          {token}
        </span>,
      );
      continue;
    }
    if (isFirstWord) {
      nodes.push(
        <span key={i} style={{ color: DRACULA_CMD }}>
          {token}
        </span>,
      );
      isFirstWord = false;
    } else if (token.startsWith('-')) {
      nodes.push(
        <span key={i} style={{ color: DRACULA_FLAG }}>
          {token}
        </span>,
      );
    } else {
      nodes.push(
        <span key={i} style={{ color: DRACULA_ARG }}>
          {token}
        </span>,
      );
    }
  }
  return nodes;
};

const CopyableCommand = ({ command }: { command: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(command).catch(() => undefined);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group flex items-center justify-between gap-2">
      <code className="flex-1 font-mono">{highlightCommand(command)}</code>
      <Button size="sm" onClick={copyToClipboard} className="hidden shrink-0 md:block" title="Copy to clipboard">
        {copied ? 'Copied' : 'Copy'}
      </Button>
      <Button className="shrink-0 md:hidden" size="icon" onClick={copyToClipboard} title="Copy to clipboard mobile">
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export const CliCommand = ({
  npmCommand,
  yarnCommand,
  pnpmCommand,
}: {
  npmCommand: string;
  yarnCommand?: string;
  pnpmCommand?: string;
}) => {
  const isNpx = npmCommand.includes('npx');
  const resolvedPnpm =
    pnpmCommand ?? (isNpx ? npmCommand.replace('npx', 'pnpm dlx') : npmCommand.replace('npm', 'pnpm'));
  const resolvedYarn =
    yarnCommand ?? (isNpx ? npmCommand.replace('npx', 'yarn dlx') : npmCommand.replace('npm install', 'yarn add'));

  return (
    <TabGroup className="bg-code-bg my-2 rounded-(--radius) p-4">
      <TabList className="mb-4 flex space-x-4 text-sm">
        <Tab className="data-selected:text-code-fg relative cursor-pointer border-[#62E884] bg-transparent px-2 py-1 text-[#6272A4] focus:outline-hidden data-selected:border-b-2">
          npm
        </Tab>
        <Tab className="data-selected:text-code-fg relative cursor-pointer border-[#62E884] bg-transparent px-2 py-1 text-[#6272A4] focus:outline-hidden data-selected:border-b-2">
          pnpm
        </Tab>
        <Tab className="data-selected:text-code-fg relative cursor-pointer border-[#62E884] bg-transparent px-2 py-1 text-[#6272A4] focus:outline-hidden data-selected:border-b-2">
          yarn
        </Tab>
      </TabList>
      <TabPanels className="text-code-fg text-sm">
        <TabPanel>
          <CopyableCommand command={npmCommand} />
        </TabPanel>
        <TabPanel>
          <CopyableCommand command={resolvedPnpm} />
        </TabPanel>
        <TabPanel>
          <CopyableCommand command={resolvedYarn} />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
};
