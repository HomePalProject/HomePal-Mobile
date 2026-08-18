import { apiClient } from './client';
import { ApiResponse } from '@/src/types/api';
import { AgentChatSessionResponse, RunAgentRequest } from '@/src/features/agent-chat/types';
import { authStorage } from '@/src/services/storage/auth.storage';
import { env } from '@/src/config/env';
import i18n from '@/src/localization/i18n';

export const agentChatService = {
  /**
   * GET /api/agent-chat
   * Fetches the current active chat session and messages.
   * Returns null if no session exists or 404.
   */
  async fetchChatHistory(): Promise<AgentChatSessionResponse | null> {
    try {
      const response = await apiClient.get<ApiResponse<AgentChatSessionResponse>>(
        '/api/agent-chat',
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          responseType: 'json',
          timeout: 60000,
        }
      );
      console.log('[History API] Fetched messages:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('[History API] Error fetching history:', error);
      const status = error?.status || error?.response?.status;
      if (status === 404 || status === '404') {
        console.log('[AgentChatService] No chat history found (404 Not Found)');
        return null;
      }
      console.warn('[AgentChatService] Error fetching chat history:', error?.message || error);
      throw error;
    }
  },

  /**
   * DELETE /api/agent-chat
   * Deletes/clears the chat history session.
   */
  async deleteChatHistory(): Promise<void> {
    try {
      await apiClient.delete<ApiResponse<null>>('/api/agent-chat');
    } catch (error: any) {
      console.warn('[AgentChatService] Error deleting chat history:', error?.message || error);
      throw error;
    }
  },

  /**
   * POST /api/agent-chat/run (SSE)
   * Streams the agent's response chunks incrementally and maps events to callbacks.
   */
  streamAgentResponse(
    request: RunAgentRequest,
    callbacks: {
      onToken: (delta: string) => void;
      onToolStart: (toolCallId: string, toolName: string, args: any) => void;
      onToolRequest: (toolCallId: string, toolName: string, args: any) => void;
      onToolResult: (toolCallId: string, result: any) => void;
      onError: (error: any) => void;
      onComplete: () => void;
    }
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        // Pre-verify token & trigger auto-refresh via interceptors if expired
        try {
          await apiClient.get('/api/Auth/me');
        } catch (meError) {
          console.warn('[SSE] Token pre-verification/refresh check status:', meError);
        }

        const token = await authStorage.getAccessToken();
        const url = `${env.API_BASE_URL}api/agent-chat/run`;

        console.log('[SSE] Starting stream...');
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Accept', 'text/event-stream');

        const currentLang = i18n.language || 'en';
        const acceptLang = currentLang.startsWith('ar') ? 'ar-EG' : 'en-US';
        xhr.setRequestHeader('Accept-Language', acceptLang);

        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }

        let seenBytes = 0;
        let buffer = '';

        xhr.onreadystatechange = () => {
          if (xhr.readyState === 2) {
            console.log('[SSE] Headers received, status:', xhr.status);
          }

          if (xhr.readyState === 3 || xhr.readyState === 4) {
            const rawText = xhr.responseText;
            const newText = rawText.substring(seenBytes);
            console.log('[SSE] Receiving chunk... Length:', newText.length);
            console.log('[SSE] Raw Chunk Content:', JSON.stringify(newText));
            seenBytes = rawText.length;
            buffer += newText;

            const lines = buffer.split('\n');
            // The last element of lines might be an incomplete line; keep it in the buffer.
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith('data:')) {
                const dataStr = trimmed.substring(5).trim();
                if (dataStr === '[DONE]') {
                  continue;
                }
                try {
                  const data = JSON.parse(dataStr);
                  if (data && typeof data === 'object' && 'type' in data) {
                    switch (data.type) {
                      case 'TEXT_MESSAGE_CONTENT':
                        callbacks.onToken(data.delta || '');
                        break;
                      case 'TOOL_CALL_START':
                        callbacks.onToolStart(
                          data.toolCallId || '',
                          data.toolName || '',
                          data.args
                        );
                        break;
                      case 'TOOL_CALL_REQUEST':
                        callbacks.onToolRequest(
                          data.toolCallId || '',
                          data.toolName || '',
                          data.args
                        );
                        break;
                      case 'TOOL_CALL_RESULT':
                        callbacks.onToolResult(data.toolCallId || '', data.result);
                        break;
                      case 'ERROR':
                        callbacks.onError(new Error(data.message || 'Stream error'));
                        break;
                      default:
                        console.warn('[AgentChatService] Unknown event type:', data.type);
                    }
                  }
                } catch (e) {
                  console.warn('[AgentChatService] SSE Parse error for data:', dataStr, e);
                }
              }
            }
          }

          if (xhr.readyState === 4) {
            console.log('[SSE] Stream closed. Final status:', xhr.status);

            // Process any leftover content in buffer
            if (buffer.trim()) {
              const line = buffer.trim();
              if (line.startsWith('data:')) {
                const dataStr = line.substring(5).trim();
                if (dataStr !== '[DONE]') {
                  try {
                    const data = JSON.parse(dataStr);
                    if (data && typeof data === 'object' && 'type' in data) {
                      switch (data.type) {
                        case 'TEXT_MESSAGE_CONTENT':
                          callbacks.onToken(data.delta || '');
                          break;
                        case 'TOOL_CALL_START':
                          callbacks.onToolStart(
                            data.toolCallId || '',
                            data.toolName || '',
                            data.args
                          );
                          break;
                        case 'TOOL_CALL_REQUEST':
                          callbacks.onToolRequest(
                            data.toolCallId || '',
                            data.toolName || '',
                            data.args
                          );
                          break;
                        case 'TOOL_CALL_RESULT':
                          callbacks.onToolResult(data.toolCallId || '', data.result);
                          break;
                        case 'ERROR':
                          callbacks.onError(new Error(data.message || 'Stream error'));
                          break;
                        default:
                          console.warn('[AgentChatService] Unknown event type:', data.type);
                      }
                    }
                  } catch (e) {
                    console.warn('[AgentChatService] SSE Parse error in remaining buffer:', e);
                  }
                }
              }
            }

            if (xhr.status === 0) {
              console.warn('[SSE] Silent network drop detected (readyState 4, status 0)');
              callbacks.onError('Silent Network Drop');
              callbacks.onComplete();
              reject(new Error('Silent Network Drop'));
              return;
            }

            if (xhr.status >= 200 && xhr.status < 300) {
              callbacks.onComplete();
              resolve();
            } else {
              const err = new Error(`Streaming failed with status ${xhr.status}`);
              callbacks.onError(err);
              reject(err);
            }
          }
        };

        xhr.onerror = (e) => {
          console.error('[SSE] XHR error event:', e);
          callbacks.onError(e);
          callbacks.onComplete();
          reject(e);
        };

        xhr.onabort = (e) => {
          console.warn('[SSE] XHR abort event:', e);
          callbacks.onError(new Error('Stream aborted'));
          callbacks.onComplete();
          reject(new Error('Stream aborted'));
        };

        xhr.send(JSON.stringify(request));
      } catch (err) {
        console.error('[SSE] Failed to establish XHR connection:', err);
        callbacks.onError(err);
        reject(err);
      }
    });
  },
};
