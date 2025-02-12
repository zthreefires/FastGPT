import { ChatItemValueTypeEnum, ChatRoleEnum } from '@fastgpt/global/core/chat/constants';
import { ChatHistoryItemResType, ChatItemType } from '@fastgpt/global/core/chat/type';
import { FlowNodeTypeEnum } from '@fastgpt/global/core/workflow/node/constant';
import { transformPreviewHistories, addStatisticalDataToHistoryItem, isLLMNode } from './utils';

describe('chat utils', () => {
  describe('transformPreviewHistories', () => {
    it('should transform histories with responseDetail true', () => {
      const histories: ChatItemType[] = [
        {
          obj: ChatRoleEnum.AI,
          value: [{ type: ChatItemValueTypeEnum.text, text: { content: 'test response' } }],
          responseData: [
            {
              nodeId: '1',
              id: '1',
              moduleType: FlowNodeTypeEnum.chatNode,
              moduleName: 'test',
              runningTime: 1.5
            }
          ]
        }
      ];

      const result = transformPreviewHistories(histories, true);

      expect(result[0]).toEqual({
        ...histories[0],
        responseData: undefined,
        llmModuleAccount: 1,
        totalQuoteList: [],
        totalRunningTime: 1.5,
        historyPreviewLength: undefined
      });
    });

    it('should transform histories with responseDetail false', () => {
      const histories: ChatItemType[] = [
        {
          obj: ChatRoleEnum.AI,
          value: [{ type: ChatItemValueTypeEnum.text, text: { content: 'test response' } }],
          responseData: [
            {
              nodeId: '1',
              id: '1',
              moduleType: FlowNodeTypeEnum.chatNode,
              moduleName: 'test',
              runningTime: 1.5
            }
          ]
        }
      ];

      const result = transformPreviewHistories(histories, false);

      expect(result[0]).toEqual({
        ...histories[0],
        responseData: undefined,
        llmModuleAccount: 1,
        totalQuoteList: undefined,
        totalRunningTime: 1.5,
        historyPreviewLength: undefined
      });
    });

    it('should handle empty histories', () => {
      const result = transformPreviewHistories([], true);
      expect(result).toEqual([]);
    });
  });

  describe('addStatisticalDataToHistoryItem', () => {
    it('should return original item if not AI role', () => {
      const item: ChatItemType = {
        obj: ChatRoleEnum.Human,
        value: [{ type: ChatItemValueTypeEnum.text, text: { content: 'test' } }]
      };
      expect(addStatisticalDataToHistoryItem(item)).toBe(item);
    });

    it('should return original item if totalQuoteList already exists', () => {
      const item: ChatItemType = {
        obj: ChatRoleEnum.AI,
        value: [{ type: ChatItemValueTypeEnum.text, text: { content: 'test' } }],
        totalQuoteList: []
      };
      expect(addStatisticalDataToHistoryItem(item)).toBe(item);
    });

    it('should return original item if no responseData', () => {
      const item: ChatItemType = {
        obj: ChatRoleEnum.AI,
        value: [{ type: ChatItemValueTypeEnum.text, text: { content: 'test' } }]
      };
      expect(addStatisticalDataToHistoryItem(item)).toBe(item);
    });

    it('should calculate statistics correctly', () => {
      const item: ChatItemType = {
        obj: ChatRoleEnum.AI,
        value: [{ type: ChatItemValueTypeEnum.text, text: { content: 'test' } }],
        responseData: [
          {
            nodeId: '1',
            id: '1',
            moduleType: FlowNodeTypeEnum.chatNode,
            moduleName: 'test',
            runningTime: 1.5,
            historyPreview: [{ obj: ChatRoleEnum.Human, value: 'preview1' }]
          },
          {
            nodeId: '2',
            id: '2',
            moduleType: FlowNodeTypeEnum.datasetSearchNode,
            moduleName: 'test',
            runningTime: 0.5,
            quoteList: [{ id: '1', q: 'test', a: 'answer', score: 0.8, source: '', file_id: '' }]
          },
          {
            nodeId: '3',
            id: '3',
            moduleType: FlowNodeTypeEnum.chatNode,
            moduleName: 'test',
            pluginDetail: [
              {
                nodeId: '4',
                id: '4',
                moduleType: FlowNodeTypeEnum.tools,
                moduleName: 'test',
                runningTime: 1.0
              }
            ],
            runningTime: 1.0
          }
        ]
      } as ChatItemType;

      const result = addStatisticalDataToHistoryItem(item);

      expect(result).toEqual({
        ...item,
        llmModuleAccount: 3,
        totalQuoteList: [{ id: '1', q: 'test', a: 'answer', score: 0.8, source: '', file_id: '' }],
        totalRunningTime: 3,
        historyPreviewLength: 1
      });
    });

    it('should handle empty arrays and null values', () => {
      const item: ChatItemType = {
        obj: ChatRoleEnum.AI,
        value: [{ type: ChatItemValueTypeEnum.text, text: { content: 'test' } }],
        responseData: []
      };

      const result = addStatisticalDataToHistoryItem(item);

      expect(result).toEqual({
        ...item,
        llmModuleAccount: 0,
        totalQuoteList: [],
        totalRunningTime: 0,
        historyPreviewLength: undefined
      });
    });
  });

  describe('isLLMNode', () => {
    it('should return true for chat nodes', () => {
      const node: ChatHistoryItemResType = {
        nodeId: '1',
        id: '1',
        moduleType: FlowNodeTypeEnum.chatNode,
        moduleName: 'test'
      };
      expect(isLLMNode(node)).toBe(true);
    });

    it('should return true for tool nodes', () => {
      const node: ChatHistoryItemResType = {
        nodeId: '1',
        id: '1',
        moduleType: FlowNodeTypeEnum.tools,
        moduleName: 'test'
      };
      expect(isLLMNode(node)).toBe(true);
    });

    it('should return false for other nodes', () => {
      const node: ChatHistoryItemResType = {
        nodeId: '1',
        id: '1',
        moduleType: FlowNodeTypeEnum.datasetSearchNode,
        moduleName: 'test'
      };
      expect(isLLMNode(node)).toBe(false);
    });
  });
});
