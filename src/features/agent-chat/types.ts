export type MessageRole = 'user' | 'assistant' | 'tool_call' | 'approval_request';

export interface AgentChatMessageResponse {
  id: string; // uuid
  role: string;
  content: string;
  createdAt: string; // date-time
}

export interface AgentChatSessionResponse {
  id: string; // uuid
  userId: string; // uuid
  createdAt: string; // date-time
  updatedAt: string | null; // date-time
  messages: AgentChatMessageResponse[];
}

export interface RunAgentRequest {
  message: string | null;
  approved: boolean | null;
  toolCallId: string | null;
}

export interface ChatMessage extends Omit<AgentChatMessageResponse, 'role' | 'content'> {
  role: MessageRole;
  content?: string;
  toolCallId?: string;
  toolName?: string;
  args?: any;
  result?: any;
  status?: 'pending' | 'approved' | 'rejected' | 'done';
  isStreaming?: boolean;
}
