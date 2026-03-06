import type { Meta, StoryObj } from '@storybook/react';
import { DisconnectedState, LoadingState } from './EmptyStates';

const meta: Meta = {
  title: 'Components/EmptyStates',
  decorators: [Story => <div className="w-80">{Story()}</div>],
};

type Story = StoryObj;

const ConnectionRefused: Story = { render: () => <DisconnectedState /> };
const AuthFailed: Story = { render: () => <DisconnectedState reason="auth_failed" /> };
const Loading: Story = { render: () => <LoadingState /> };

export default meta;
export { AuthFailed, ConnectionRefused, Loading };
