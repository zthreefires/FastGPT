import { vi, describe, it, expect, beforeEach } from 'vitest';
import { getWebLLMModel, getWebDefaultLLMModel, getWebDefaultEmbeddingModel } from './utils';
import { useSystemStore } from './useSystemStore';
import type { LLMModelItemType, EmbeddingModelItemType } from '@fastgpt/global/core/ai/model.d';

vi.mock('./useSystemStore', () => ({
  useSystemStore: {
    getState: vi.fn().mockReturnValue({
      llmModelList: [],
      embeddingModelList: [],
      defaultModels: {
        llm: null,
        embedding: null
      }
    })
  }
}));

const mockLLMModelList: LLMModelItemType[] = [
  {
    model: 'model1',
    name: 'Model 1',
    maxContext: 4000,
    maxResponse: 2000,
    price: 0.001
  },
  {
    model: 'model2',
    name: 'Model 2',
    maxContext: 8000,
    maxResponse: 4000,
    price: 0.002
  }
];

const mockEmbeddingModelList: EmbeddingModelItemType[] = [
  {
    model: 'embedding1',
    name: 'Embedding 1',
    price: 0.0001,
    maxInput: 1000
  },
  {
    model: 'embedding2',
    name: 'Embedding 2',
    price: 0.0002,
    maxInput: 2000
  }
];

const mockDefaultModels = {
  llm: mockLLMModelList[0],
  embedding: mockEmbeddingModelList[0]
};

describe('getWebLLMModel', () => {
  beforeEach(() => {
    vi.mocked(useSystemStore.getState).mockReturnValue({
      llmModelList: mockLLMModelList,
      embeddingModelList: mockEmbeddingModelList,
      defaultModels: mockDefaultModels
    });
  });

  it('should return model by model name', () => {
    const result = getWebLLMModel('model1');
    expect(result).toEqual(mockLLMModelList[0]);
  });

  it('should return model by display name', () => {
    const result = getWebLLMModel('Model 2');
    expect(result).toEqual(mockLLMModelList[1]);
  });

  it('should return default model if model not found', () => {
    const result = getWebLLMModel('nonexistent');
    expect(result).toEqual(mockDefaultModels.llm);
  });

  it('should return default model if no model specified', () => {
    const result = getWebLLMModel();
    expect(result).toEqual(mockDefaultModels.llm);
  });
});

describe('getWebDefaultLLMModel', () => {
  beforeEach(() => {
    vi.mocked(useSystemStore.getState).mockReturnValue({
      llmModelList: mockLLMModelList,
      embeddingModelList: mockEmbeddingModelList,
      defaultModels: mockDefaultModels
    });
  });

  it('should return default model from provided list if matches', () => {
    const result = getWebDefaultLLMModel(mockLLMModelList);
    expect(result).toEqual(mockDefaultModels.llm);
  });

  it('should return first model if default not in list', () => {
    const differentList: LLMModelItemType[] = [
      {
        model: 'different',
        name: 'Different',
        maxContext: 4000,
        maxResponse: 2000,
        price: 0.001
      }
    ];
    const result = getWebDefaultLLMModel(differentList);
    expect(result).toEqual(differentList[0]);
  });

  it('should use system store list if no list provided', () => {
    const result = getWebDefaultLLMModel();
    expect(result).toEqual(mockDefaultModels.llm);
  });
});

describe('getWebDefaultEmbeddingModel', () => {
  beforeEach(() => {
    vi.mocked(useSystemStore.getState).mockReturnValue({
      llmModelList: mockLLMModelList,
      embeddingModelList: mockEmbeddingModelList,
      defaultModels: mockDefaultModels
    });
  });

  it('should return default model from provided list if matches', () => {
    const result = getWebDefaultEmbeddingModel(mockEmbeddingModelList);
    expect(result).toEqual(mockDefaultModels.embedding);
  });

  it('should return first model if default not in list', () => {
    const differentList: EmbeddingModelItemType[] = [
      {
        model: 'different',
        name: 'Different',
        price: 0.0001,
        maxInput: 1000
      }
    ];
    const result = getWebDefaultEmbeddingModel(differentList);
    expect(result).toEqual(differentList[0]);
  });

  it('should use system store list if no list provided', () => {
    const result = getWebDefaultEmbeddingModel();
    expect(result).toEqual(mockDefaultModels.embedding);
  });
});
