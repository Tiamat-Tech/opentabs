import { Empty } from './retro/Empty.js';

interface ReturningUserEmptyStateProps {
  onResetOnboarding: () => void;
}

const ReturningUserEmptyState = ({ onResetOnboarding }: ReturningUserEmptyStateProps) => (
  <Empty>
    <Empty.Content>
      <Empty.Title>No Plugins Installed</Empty.Title>
      <Empty.Separator />
      <div className="flex flex-col gap-2 text-center">
        <p className="text-muted-foreground text-sm">Install a plugin:</p>
        <code className="rounded border-2 px-3 py-2 font-mono text-sm">npm install -g opentabs-plugin-slack</code>
        <p className="text-muted-foreground text-sm">
          Or search for plugins:{' '}
          <code className="rounded border px-1.5 py-0.5 font-mono text-xs">opentabs plugin search</code>
        </p>
      </div>
      <button
        type="button"
        onClick={onResetOnboarding}
        className="text-muted-foreground hover:text-foreground mt-2 cursor-pointer text-xs underline opacity-60 transition-opacity hover:opacity-100">
        Show setup guide
      </button>
    </Empty.Content>
  </Empty>
);

export { ReturningUserEmptyState };
