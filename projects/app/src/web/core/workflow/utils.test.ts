import { vi, describe, it, expect } from 'vitest';
import {
  nodeTemplate2FlowNode,
  storeNode2FlowNode,
  storeEdgesRenderEdge,
  computedNodeInputReference,
  getRefData,
  filterWorkflowNodeOutputsByType,
  checkWorkflowNodeAndConnection,
  filterSensitiveNodesData,
  getWorkflowGlobalVariables,
  getLatestNodeTemplate,
  compareSnapshot
} from './utils';
import {
  FlowNodeTypeEnum,
  FlowNodeInputTypeEnum,
  FlowNodeOutputTypeEnum
} from '@fastgpt/global/core/workflow/node/constant';
import { WorkflowIOValueTypeEnum } from '@fastgpt/global/core/workflow/constants';
import { NodeInputKeyEnum, NodeOutputKeyEnum } from '@fastgpt/global/core/workflow/constants';

describe('nodeTemplate2FlowNode', () => {
  it('should convert template to flow node', () => {
    const template = {
      name: 'Test Node',
      flowNodeType: FlowNodeTypeEnum.tools,
      inputs: [],
      outputs: []
    };

    const position = { x: 100, y: 100 };
    const t = (str: string) => str;

    const result = nodeTemplate2FlowNode({
      template,
      position,
      selected: true,
      t
    });

    expect(result).toEqual({
      id: expect.any(String),
      type: FlowNodeTypeEnum.tools,
      data: {
        name: 'Test Node',
        flowNodeType: FlowNodeTypeEnum.tools,
        nodeId: expect.any(String),
        inputs: [],
        outputs: []
      },
      position: { x: 100, y: 100 },
      selected: true
    });
  });
});

describe('storeNode2FlowNode', () => {
  it('should convert store node to flow node', () => {
    const storeNode = {
      nodeId: '123',
      flowNodeType: FlowNodeTypeEnum.tools,
      position: { x: 0, y: 0 },
      inputs: [],
      outputs: []
    };

    const t = (str: string) => str;

    const result = storeNode2FlowNode({
      item: storeNode,
      t
    });

    expect(result.id).toBe('123');
    expect(result.type).toBe(FlowNodeTypeEnum.tools);
    expect(result.position).toEqual({ x: 0, y: 0 });
  });
});

describe('filterWorkflowNodeOutputsByType', () => {
  it('should filter outputs by string type', () => {
    const outputs = [
      { id: '1', valueType: WorkflowIOValueTypeEnum.string },
      { id: '2', valueType: WorkflowIOValueTypeEnum.number },
      { id: '3', valueType: WorkflowIOValueTypeEnum.boolean }
    ];

    const result = filterWorkflowNodeOutputsByType(outputs, WorkflowIOValueTypeEnum.string);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('should return all outputs for any type', () => {
    const outputs = [
      { id: '1', valueType: WorkflowIOValueTypeEnum.string },
      { id: '2', valueType: WorkflowIOValueTypeEnum.number }
    ];

    const result = filterWorkflowNodeOutputsByType(outputs, WorkflowIOValueTypeEnum.any);
    expect(result).toHaveLength(2);
  });
});

describe('checkWorkflowNodeAndConnection', () => {
  it('should validate required inputs', () => {
    const nodes = [
      {
        id: 'node1',
        data: {
          nodeId: 'node1',
          flowNodeType: FlowNodeTypeEnum.tools,
          inputs: [
            {
              key: 'input1',
              required: true,
              value: undefined,
              renderTypeList: [FlowNodeInputTypeEnum.text]
            }
          ],
          outputs: []
        }
      }
    ];

    const edges = [
      {
        source: 'node1',
        target: 'node2'
      }
    ];

    const result = checkWorkflowNodeAndConnection({ nodes, edges });
    expect(result).toEqual(['node1']);
  });

  it('should pass validation with valid inputs', () => {
    const nodes = [
      {
        id: 'node1',
        data: {
          nodeId: 'node1',
          flowNodeType: FlowNodeTypeEnum.tools,
          inputs: [
            {
              key: 'input1',
              required: true,
              value: 'test',
              renderTypeList: [FlowNodeInputTypeEnum.text]
            }
          ],
          outputs: []
        }
      }
    ];

    const edges = [
      {
        source: 'node1',
        target: 'node2'
      }
    ];

    const result = checkWorkflowNodeAndConnection({ nodes, edges });
    expect(result).toBeUndefined();
  });
});

describe('compareSnapshot', () => {
  it('should compare nodes and edges', () => {
    const snapshot1 = {
      nodes: [
        {
          id: 'node1',
          type: FlowNodeTypeEnum.tools,
          position: { x: 0, y: 0 },
          data: {
            id: 'node1',
            flowNodeType: FlowNodeTypeEnum.tools,
            inputs: [],
            outputs: [],
            name: 'Test',
            intro: '',
            avatar: '',
            version: '1.0'
          }
        }
      ],
      edges: [
        {
          source: 'node1',
          target: 'node2',
          sourceHandle: 'out1',
          targetHandle: 'in1',
          type: 'default'
        }
      ]
    };

    const snapshot2 = {
      nodes: [
        {
          id: 'node1',
          type: FlowNodeTypeEnum.tools,
          position: { x: 0, y: 0 },
          data: {
            id: 'node1',
            flowNodeType: FlowNodeTypeEnum.tools,
            inputs: [],
            outputs: [],
            name: 'Test',
            intro: '',
            avatar: '',
            version: '1.0'
          }
        }
      ],
      edges: [
        {
          source: 'node1',
          target: 'node2',
          sourceHandle: 'out1',
          targetHandle: 'in1',
          type: 'default'
        }
      ]
    };

    expect(compareSnapshot(snapshot1, snapshot2)).toBe(true);
  });
});
