import { Empty } from './retro/Empty.js';
import { CheckCircle2, Circle } from 'lucide-react';

interface OnboardingStateProps {
  connected: boolean;
  pluginCount: number;
}

const ChecklistItem = ({ checked, label }: { checked: boolean; label: string }) => (
  <li className="flex items-center gap-2 text-left">
    {checked ? (
      <CheckCircle2 className="text-primary h-5 w-5 shrink-0" />
    ) : (
      <Circle className="text-muted h-5 w-5 shrink-0" />
    )}
    <span className={checked ? 'text-foreground' : 'text-muted-foreground'}>{label}</span>
  </li>
);

const OnboardingState = ({ connected, pluginCount }: OnboardingStateProps) => (
  <Empty>
    <Empty.Content>
      <Empty.Title>Welcome to OpenTabs</Empty.Title>
      <Empty.Separator />
      <Empty.Description>
        OpenTabs gives AI agents access to your web apps through your browser session.
      </Empty.Description>
      <ul className="mt-1 flex flex-col gap-2 font-sans text-sm">
        <ChecklistItem checked={connected} label="MCP server running" />
        <ChecklistItem checked={pluginCount > 0} label="Plugins installed" />
      </ul>
      <div className="mt-1 flex flex-col gap-2 text-center">
        <p className="text-muted-foreground text-sm">Install a plugin:</p>
        <code className="rounded border-2 px-3 py-2 font-mono text-sm">npm install -g opentabs-plugin-slack</code>
        <p className="text-muted-foreground text-sm">
          Or search for plugins:{' '}
          <code className="rounded border px-1.5 py-0.5 font-mono text-xs">opentabs plugin search</code>
        </p>
      </div>
    </Empty.Content>
  </Empty>
);

export { OnboardingState };
