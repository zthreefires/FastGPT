import { describe, expect, it, vi } from 'vitest';
import { getGlobalVariableNode, v1Workflow2V2 } from './adapt';
import {
  FlowNodeInputTypeEnum,
  FlowNodeOutputTypeEnum,
  FlowNodeTypeEnum
} from '@fastgpt/global/core/workflow/node/constant';
import {
  FlowNodeTemplateTypeEnum,
  NodeInputKeyEnum,
  NodeOutputKeyEnum,
  VARIABLE_NODE_ID,
  WorkflowIOValueTypeEnum
} from '@fastgpt/global/core/workflow/constants';
import { LLMModelTypeEnum } from '@fastgpt/global/core/ai/constants';
import { PluginTypeEnum } from '@fastgpt/global/core/plugin/constants';

describe('getGlobalVariableNode', () => {
  const mockT = vi.fn((key: string) => key);

  it('should generate global variable node with default variables', () => {
    const nodes = [
      {
        nodeId: 'node1',
        flowNodeType: FlowNodeTypeEnum.chatNode,
        inputs: [],
        outputs: []
      }
    ];

    const chatConfig = {};

    const result = getGlobalVariableNode({
      nodes,
      chatConfig,
      t: mockT
    });

    expect(result.nodeId).toBe(VARIABLE_NODE_ID);
    expect(result.id).toBe(FlowNodeTypeEnum.globalVariable);
    expect(result.templateType).toBe(FlowNodeTemplateTypeEnum.other);
    expect(result.flowNodeType).toBe(FlowNodeTypeEnum.emptyNode);
    expect(result.avatar).toBe('core/workflow/template/variable');
    expect(result.name).toBe('common:core.module.Variable');
    expect(result.unique).toBe(true);
    expect(result.forbidDelete).toBe(true);
    expect(result.version).toBe('481');

    expect(result.outputs).toEqual([
      {
        id: 'userId',
        key: 'userId',
        type: FlowNodeOutputTypeEnum.static,
        valueType: WorkflowIOValueTypeEnum.string,
        label: 'workflow:use_user_id'
      },
      {
        id: 'appId',
        key: 'appId',
        type: FlowNodeOutputTypeEnum.static,
        valueType: WorkflowIOValueTypeEnum.string,
        label: 'common:core.module.http.AppId'
      },
      {
        id: 'chatId',
        key: 'chatId',
        type: FlowNodeOutputTypeEnum.static,
        valueType: WorkflowIOValueTypeEnum.string,
        label: 'common:core.module.http.ChatId'
      },
      {
        id: 'responseChatItemId',
        key: 'responseChatItemId',
        type: FlowNodeOutputTypeEnum.static,
        valueType: WorkflowIOValueTypeEnum.string,
        label: 'common:core.module.http.ResponseChatItemId'
      },
      {
        id: 'histories',
        key: 'histories',
        type: FlowNodeOutputTypeEnum.static,
        valueType: WorkflowIOValueTypeEnum.chatHistory,
        label: 'common:core.module.http.Histories'
      },
      {
        id: 'cTime',
        key: 'cTime',
        type: FlowNodeOutputTypeEnum.static,
        valueType: WorkflowIOValueTypeEnum.string,
        label: 'common:core.module.http.Current time'
      }
    ]);
  });

  it('should handle empty nodes', () => {
    const result = getGlobalVariableNode({
      nodes: [],
      chatConfig: {},
      t: mockT
    });

    expect(result.outputs).toHaveLength(6); // Default variables
  });

  it('should handle null/undefined chatConfig', () => {
    const result = getGlobalVariableNode({
      nodes: [],
      chatConfig: undefined as any,
      t: mockT
    });

    expect(result.outputs).toBeDefined();
    expect(result.outputs.length).toBeGreaterThan(0);
  });
});

describe('v1Workflow2V2', () => {
  it('should transform v1 workflow to v2 correctly', () => {
    const v1Workflow = [
      {
        name: 'Start Node',
        moduleId: 'start-1',
        position: { x: 100, y: 100 },
        flowType: 'questionInput',
        inputs: [
          {
            type: 'input',
            key: 'userChatInput',
            label: 'User Input',
            valueType: WorkflowIOValueTypeEnum.string
          }
        ],
        outputs: [
          {
            key: 'userChatInput',
            valueType: WorkflowIOValueTypeEnum.string,
            targets: [{ moduleId: 'chat-1', key: 'input' }]
          }
        ]
      },
      {
        name: 'Chat Node',
        moduleId: 'chat-1',
        position: { x: 300, y: 100 },
        flowType: 'chatNode',
        inputs: [
          {
            type: 'input',
            key: 'input',
            label: 'Chat Input',
            valueType: WorkflowIOValueTypeEnum.string
          }
        ],
        outputs: [
          {
            key: 'output',
            type: 'answer',
            valueType: WorkflowIOValueTypeEnum.string,
            targets: []
          }
        ]
      }
    ];

    const result = v1Workflow2V2(v1Workflow);

    expect(result.nodes).toHaveLength(2);
    expect(result.edges).toHaveLength(1);

    const startNode = result.nodes.find(
      (node) => node.flowNodeType === FlowNodeTypeEnum.workflowStart
    );
    expect(startNode).toBeDefined();
    expect(startNode?.nodeId).toBe('start-1');
    expect(startNode?.name).toBe('流程开始');

    const chatNode = result.nodes.find((node) => node.flowNodeType === FlowNodeTypeEnum.chatNode);
    expect(chatNode).toBeDefined();
    expect(chatNode?.nodeId).toBe('chat-1');
    expect(chatNode?.inputs[0].key).toBe('input');
    expect(chatNode?.outputs[0].key).toBe('output');

    expect(result.edges[0]).toEqual({
      source: 'start-1',
      sourceHandle: expect.any(String),
      target: 'chat-1',
      targetHandle: expect.any(String)
    });
  });

  it('should handle plugin nodes correctly', () => {
    const v1Workflow = [
      {
        name: 'Plugin Node',
        moduleId: 'plugin-1',
        flowType: 'pluginModule',
        pluginType: PluginTypeEnum.CustomPlugin,
        inputs: [
          {
            type: 'input',
            key: 'pluginId',
            value: 'test-plugin',
            label: 'Plugin ID'
          }
        ],
        outputs: [
          {
            key: 'result',
            valueType: WorkflowIOValueTypeEnum.string,
            targets: []
          }
        ]
      }
    ];

    const result = v1Workflow2V2(v1Workflow);

    const pluginNode = result.nodes[0];
    expect(pluginNode.flowNodeType).toBe(FlowNodeTypeEnum.pluginModule);
    expect(pluginNode.pluginId).toBe('test-plugin');
    expect(pluginNode.pluginType).toBe(PluginTypeEnum.CustomPlugin);
  });

  it('should filter duplicate start nodes', () => {
    const v1Workflow = [
      {
        name: 'Start 1',
        moduleId: 'start-1',
        flowType: 'questionInput',
        inputs: [],
        outputs: []
      },
      {
        name: 'Start 2',
        moduleId: 'start-2',
        flowType: 'questionInput',
        inputs: [],
        outputs: []
      }
    ];

    const result = v1Workflow2V2(v1Workflow);

    const startNodes = result.nodes.filter(
      (node) => node.flowNodeType === FlowNodeTypeEnum.workflowStart
    );
    expect(startNodes).toHaveLength(1);
  });

  it('should handle empty workflow', () => {
    const result = v1Workflow2V2([]);
    expect(result.nodes).toHaveLength(0);
    expect(result.edges).toHaveLength(0);
  });

  it('should handle complex node connections', () => {
    const v1Workflow = [
      {
        name: 'Start',
        moduleId: 'start-1',
        flowType: 'questionInput',
        inputs: [],
        outputs: [
          {
            key: 'output1',
            targets: [
              { moduleId: 'node1', key: 'input1' },
              { moduleId: 'node2', key: 'input1' }
            ]
          }
        ]
      },
      {
        name: 'Node 1',
        moduleId: 'node1',
        flowType: 'chatNode',
        inputs: [{ key: 'input1' }],
        outputs: [{ key: 'output1', targets: [{ moduleId: 'node2', key: 'input2' }] }]
      },
      {
        name: 'Node 2',
        moduleId: 'node2',
        flowType: 'answerNode',
        inputs: [{ key: 'input1' }, { key: 'input2' }],
        outputs: []
      }
    ];

    const result = v1Workflow2V2(v1Workflow);
    expect(result.edges.length).toBeGreaterThan(0);
    expect(new Set(result.edges.map((e) => e.target))).toEqual(new Set(['node1', 'node2']));
  });

  it('should handle special node types correctly', () => {
    const v1Workflow = [
      {
        name: 'Content Extract',
        moduleId: 'extract-1',
        flowType: 'contentExtract',
        inputs: [],
        outputs: [
          {
            key: 'success',
            targets: []
          },
          {
            key: 'failed',
            targets: []
          }
        ]
      }
    ];

    const result = v1Workflow2V2(v1Workflow);
    expect(result.nodes[0].flowNodeType).toBe(FlowNodeTypeEnum.contentExtract);
    expect(result.nodes[0].outputs).toHaveLength(0); // Special outputs should be filtered
  });
});
