import { Loader } from './retro/Loader';
import { Menu } from './retro/Menu';
import { ArrowUpCircle, MoreHorizontal, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { PluginState } from '../bridge';

const CONFIRM_DURATION_MS = 3000;

interface PluginMenuProps {
  plugin: PluginState;
  onUpdate: () => void;
  onRemove: () => void;
  updating: boolean;
  removing: boolean;
  className?: string;
}

const PluginMenu = ({ plugin, onUpdate, onRemove, updating, removing, className }: PluginMenuProps) => {
  const [confirmPending, setConfirmPending] = useState(false);
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(confirmTimerRef.current), []);

  const isLocal = plugin.source === 'local';
  const removeLabel = isLocal ? 'Remove' : 'Uninstall';

  const handleRemoveClick = () => {
    if (confirmPending) {
      clearTimeout(confirmTimerRef.current);
      setConfirmPending(false);
      onRemove();
    } else {
      setConfirmPending(true);
      confirmTimerRef.current = setTimeout(() => setConfirmPending(false), CONFIRM_DURATION_MS);
    }
  };

  return (
    <div
      className={className}
      onClick={e => e.stopPropagation()}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') e.stopPropagation();
      }}
      role="presentation">
      <Menu>
        <Menu.Trigger asChild>
          <button
            className="hover:bg-muted/50 flex h-6 w-6 items-center justify-center rounded"
            aria-label="Plugin options">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </Menu.Trigger>
        <Menu.Content align="end">
          {plugin.update && (
            <Menu.Item onClick={onUpdate}>
              {updating ? <Loader size="sm" /> : <ArrowUpCircle className="h-3.5 w-3.5" />}
              Update to v{plugin.update.latestVersion}
            </Menu.Item>
          )}
          {plugin.update && <Menu.Separator />}
          <Menu.Item
            onClick={handleRemoveClick}
            className="text-destructive focus:bg-destructive/10 focus:text-destructive data-[highlighted]:bg-destructive/10 data-[highlighted]:text-destructive">
            {removing ? <Loader size="sm" /> : <Trash2 className="h-3.5 w-3.5" />}
            {confirmPending ? 'Confirm?' : removeLabel}
          </Menu.Item>
        </Menu.Content>
      </Menu>
    </div>
  );
};

PluginMenu.displayName = 'PluginMenu';

export { PluginMenu };
export type { PluginMenuProps };
