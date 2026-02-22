import { PluginIcon } from './PluginIcon';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PluginIcon> = {
  title: 'Components/PluginIcon',
  component: PluginIcon,
  argTypes: {
    ready: { control: 'boolean' },
    size: { control: { type: 'range', min: 16, max: 64 } },
  },
};

type Story = StoryObj<typeof PluginIcon>;

const SAMPLE_ACTIVE_SVG =
  '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="14" fill="#4F46E5"/><text x="16" y="21" text-anchor="middle" fill="white" font-size="16" font-family="sans-serif">S</text></svg>';

const SAMPLE_INACTIVE_SVG =
  '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="14" fill="#808080"/><text x="16" y="21" text-anchor="middle" fill="white" font-size="16" font-family="sans-serif">S</text></svg>';

const Ready: Story = { args: { pluginName: 'slack', displayName: 'Slack', ready: true, size: 32 } };
const NotReady: Story = { args: { pluginName: 'slack', displayName: 'Slack', ready: false, size: 32 } };

const Palette: Story = {
  name: 'Color Palette',
  render: () => {
    const plugins = [
      { name: 'slack', displayName: 'Slack' },
      { name: 'github', displayName: 'GitHub' },
      { name: 'datadog', displayName: 'Datadog' },
      { name: 'jira', displayName: 'Jira' },
      { name: 'notion', displayName: 'Notion' },
      { name: 'linear', displayName: 'Linear' },
      { name: 'figma', displayName: 'Figma' },
      { name: 'vercel', displayName: 'Vercel' },
      { name: 'stripe', displayName: 'Stripe' },
      { name: 'sentry', displayName: 'Sentry' },
      { name: 'postgres', displayName: 'PostgreSQL' },
      { name: 'redis', displayName: 'Redis' },
    ];
    return (
      <div className="flex flex-col gap-3">
        {plugins.map(p => (
          <div key={p.name} className="flex items-center gap-3">
            <PluginIcon pluginName={p.name} displayName={p.displayName} ready={true} size={32} />
            <PluginIcon pluginName={p.name} displayName={p.displayName} ready={false} size={32} />
            <span className="text-foreground font-sans text-sm">{p.displayName}</span>
          </div>
        ))}
      </div>
    );
  },
};

const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-3">
      {[16, 24, 32, 40, 48, 64].map(size => (
        <div key={size} className="flex flex-col items-center gap-1">
          <PluginIcon pluginName="slack" displayName="Slack" ready={true} size={size} />
          <span className="text-muted-foreground font-mono text-xs">{size}px</span>
        </div>
      ))}
    </div>
  ),
};

const WithIcon: Story = {
  args: {
    pluginName: 'slack',
    displayName: 'Slack',
    ready: true,
    size: 32,
    iconSvg: SAMPLE_ACTIVE_SVG,
    iconInactiveSvg: SAMPLE_INACTIVE_SVG,
  },
};

const WithIconInactive: Story = {
  args: {
    pluginName: 'slack',
    displayName: 'Slack',
    ready: false,
    size: 32,
    iconSvg: SAMPLE_ACTIVE_SVG,
    iconInactiveSvg: SAMPLE_INACTIVE_SVG,
  },
};

export default meta;
export { Ready, NotReady, Palette, Sizes, WithIcon, WithIconInactive };
