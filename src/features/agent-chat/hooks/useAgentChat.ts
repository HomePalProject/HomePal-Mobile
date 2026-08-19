import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store';
import {
  addLocalMessage,
  addAgentPlaceholder,
  appendAgentChunk,
  addToolCall,
  updateToolResult,
  updateApprovalStatus,
  setStreamingStatus,
  fetchHistoryThunk,
  clearHistoryThunk,
  cleanupPendingTools,
  removeEmptyPlaceholder,
} from '@/src/store/slices/agentChatSlice';
import { agentChatService } from '@/src/services';
import { ChatMessage } from '../types';

export const useAgentChat = () => {
  const dispatch = useAppDispatch();

  const messages = useAppSelector((state) => state.agentChat.messages as ChatMessage[]);
  const isLoadingHistory = useAppSelector((state) => state.agentChat.isLoadingHistory);
  const isStreaming = useAppSelector((state) => state.agentChat.isStreaming);
  const error = useAppSelector((state) => state.agentChat.error);

  const loadHistory = useCallback(() => {
    dispatch(fetchHistoryThunk());
  }, [dispatch]);

  const clearHistory = useCallback(() => {
    dispatch(clearHistoryThunk());
  }, [dispatch]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmedText = text.trim();
      if (!trimmedText || isStreaming) {
        return;
      }

      // 1. Instantly push the user's message to the UI
      dispatch(addLocalMessage({ content: trimmedText }));

      // 2. Push an empty agent message and set typing/streaming status to true
      dispatch(addAgentPlaceholder());
      dispatch(setStreamingStatus(true));

      try {
        // 3. Initiate the SSE stream listener
        await agentChatService.streamAgentResponse(
          {
            message: trimmedText,
            approved: null,
            toolCallId: null,
          },
          {
            onToken: (delta: string) => {
              dispatch(appendAgentChunk(delta));
            },
            onToolStart: (id: string, toolName: string, args: any) => {
              dispatch(addToolCall({ id, role: 'tool_call', toolName, args }));
            },
            onToolRequest: (id: string, toolName: string, args: any) => {
              dispatch(addToolCall({ id, role: 'approval_request', toolName, args }));
            },
            onToolResult: (id: string, result: any) => {
              dispatch(updateToolResult({ id, result }));
            },
            onError: (err: any) => {
              console.error('[useAgentChat] Streaming error callback:', err);
              dispatch(cleanupPendingTools());
              dispatch(removeEmptyPlaceholder());
              dispatch(setStreamingStatus(false));
            },
            onComplete: () => {
              dispatch(cleanupPendingTools());
              dispatch(removeEmptyPlaceholder());
              dispatch(setStreamingStatus(false));
            },
          }
        );
      } catch (err: any) {
        console.error('[useAgentChat] Failed to start agent response stream:', err);
        dispatch(setStreamingStatus(false));
      }
    },
    [dispatch, isStreaming]
  );

  const approveToolCall = useCallback(
    async (toolCallId: string, approved: boolean) => {
      if (isStreaming) {
        return;
      }

      // 1. Update the status of the approval request locally in Redux
      dispatch(updateApprovalStatus({ toolCallId, status: approved ? 'approved' : 'rejected' }));

      // 2. Set streaming status to true
      dispatch(setStreamingStatus(true));

      try {
        // 3. Initiate the SSE stream listener with the approval response
        await agentChatService.streamAgentResponse(
          {
            message: null,
            approved,
            toolCallId,
          },
          {
            onToken: (delta: string) => {
              dispatch(appendAgentChunk(delta));
            },
            onToolStart: (id: string, toolName: string, args: any) => {
              dispatch(addToolCall({ id, role: 'tool_call', toolName, args }));
            },
            onToolRequest: (id: string, toolName: string, args: any) => {
              dispatch(addToolCall({ id, role: 'approval_request', toolName, args }));
            },
            onToolResult: (id: string, result: any) => {
              dispatch(updateToolResult({ id, result }));
            },
            onError: (err: any) => {
              console.error('[useAgentChat] Tool approval error:', err);
              dispatch(cleanupPendingTools());
              dispatch(removeEmptyPlaceholder());
              dispatch(setStreamingStatus(false));
            },
            onComplete: () => {
              dispatch(cleanupPendingTools());
              dispatch(removeEmptyPlaceholder());
              dispatch(setStreamingStatus(false));
            },
          }
        );
      } catch (err: any) {
        console.error('[useAgentChat] Failed to send tool approval stream:', err);
        dispatch(setStreamingStatus(false));
      }
    },
    [dispatch, isStreaming]
  );

  return {
    messages,
    isLoadingHistory,
    isStreaming,
    error,
    sendMessage,
    approveToolCall,
    loadHistory,
    clearHistory,
  };
};
