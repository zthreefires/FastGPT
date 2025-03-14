import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  downloadFetch,
  getWebLLMModel,
  getWebDefaultLLMModel,
  getWebDefaultEmbeddingModel
} from './utils';
import { useSystemStore } from './useSystemStore';

vi.mock('@fastgpt/web/common/system/utils', () => ({
  getWebReqUrl: vi.fn((url) => url)
}));

describe('downloadFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL = vi.fn();
    global.URL.revokeObjectURL = vi.fn();
    global.document = {
      createElement: vi.fn(() => ({
        href: '',
        download: '',
        click: vi.fn()
      })),
      body: {
        appendChild: vi.fn(),
        removeChild: vi.fn()
      }
    } as unknown as Document;
    global.window = {
      URL: {
        createObjectURL: vi.fn(),
        revokeObjectURL: vi.fn()
      }
    } as unknown as Window & typeof globalThis;
  });

  it('should handle direct download without body', async () => {
    const appendChildSpy = vi.spyOn(global.document.body, 'appendChild');
    const removeChildSpy = vi.spyOn(global.document.body, 'removeChild');

    const mockAnchor = {
      href: '',
      download: '',
      click: vi.fn()
    };
    vi.spyOn(global.document, 'createElement').mockImplementation(
      () => mockAnchor as HTMLAnchorElement
    );

    await downloadFetch({
      url: 'test.com',
      filename: 'test.txt'
    });

    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
    expect(mockAnchor.click).toHaveBeenCalled();
  });

  it('should handle POST download with body', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      blob: () => new Blob(['test'])
    });

    const appendChildSpy = vi.spyOn(global.document.body, 'appendChild');
    const removeChildSpy = vi.spyOn(global.document.body, 'removeChild');

    const mockAnchor = {
      href: '',
      download: '',
      click: vi.fn()
    };
    vi.spyOn(global.document, 'createElement').mockImplementation(
      () => mockAnchor as HTMLAnchorElement
    );

    await downloadFetch({
      url: 'test.com',
      filename: 'test.txt',
      body: { test: 'data' }
    });

    expect(fetch).toHaveBeenCalledWith('test.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ test: 'data' })
    });
    expect(global.window.URL.createObjectURL).toHaveBeenCalled();
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
    expect(mockAnchor.click).toHaveBeenCalled();
    expect(global.window.URL.revokeObjectURL).toHaveBeenCalled();
  });
});

describe('getWebLLMModel', () => {
  const mockLLMList = [
    { model: 'model1', name: 'Model 1' },
    { model: 'model2', name: 'Model 2' }
  ];

  const mockDefaultModels = {
    llm: { model: 'model1', name: 'Model 1' },
    embedding: null
  };

  beforeEach(() => {
    vi.spyOn(useSystemStore, 'getState').mockImplementation(() => ({
      llmModelList: mockLLMList,
      defaultModels: mockDefaultModels
    }));
  });

  it('should return model by model name', () => {
    const result = getWebLLMModel('model2');
    expect(result).toEqual(mockLLMList[1]);
  });

  it('should return model by display name', () => {
    const result = getWebLLMModel('Model 2');
    expect(result).toEqual(mockLLMList[1]);
  });

  it('should return default model if model not found', () => {
    const result = getWebLLMModel('nonexistent');
    expect(result).toEqual(mockDefaultModels.llm);
  });
});

describe('getWebDefaultLLMModel', () => {
  const mockLLMList = [
    { model: 'model1', name: 'Model 1' },
    { model: 'model2', name: 'Model 2' }
  ];

  it('should return first model from provided list if default not found', () => {
    vi.spyOn(useSystemStore, 'getState').mockImplementation(() => ({
      llmModelList: mockLLMList,
      defaultModels: {
        llm: { model: 'nonexistent', name: 'Non Existent' },
        embedding: null
      }
    }));

    const result = getWebDefaultLLMModel(mockLLMList);
    expect(result).toEqual(mockLLMList[0]);
  });

  it('should return default model if found in list', () => {
    const defaultModel = mockLLMList[1];
    vi.spyOn(useSystemStore, 'getState').mockImplementation(() => ({
      llmModelList: mockLLMList,
      defaultModels: {
        llm: defaultModel,
        embedding: null
      }
    }));

    const result = getWebDefaultLLMModel(mockLLMList);
    expect(result).toEqual(defaultModel);
  });

  it('should use system model list if no list provided', () => {
    const defaultModel = mockLLMList[0];
    vi.spyOn(useSystemStore, 'getState').mockImplementation(() => ({
      llmModelList: mockLLMList,
      defaultModels: {
        llm: defaultModel,
        embedding: null
      }
    }));

    const result = getWebDefaultLLMModel();
    expect(result).toEqual(defaultModel);
  });
});

describe('getWebDefaultEmbeddingModel', () => {
  const mockEmbeddingList = [
    { model: 'embed1', name: 'Embed 1' },
    { model: 'embed2', name: 'Embed 2' }
  ];

  it('should return first model from provided list if default not found', () => {
    vi.spyOn(useSystemStore, 'getState').mockImplementation(() => ({
      embeddingModelList: mockEmbeddingList,
      defaultModels: {
        llm: null,
        embedding: { model: 'nonexistent', name: 'Non Existent' }
      }
    }));

    const result = getWebDefaultEmbeddingModel(mockEmbeddingList);
    expect(result).toEqual(mockEmbeddingList[0]);
  });

  it('should return default model if found in list', () => {
    const defaultModel = mockEmbeddingList[1];
    vi.spyOn(useSystemStore, 'getState').mockImplementation(() => ({
      embeddingModelList: mockEmbeddingList,
      defaultModels: {
        llm: null,
        embedding: defaultModel
      }
    }));

    const result = getWebDefaultEmbeddingModel(mockEmbeddingList);
    expect(result).toEqual(defaultModel);
  });

  it('should use system model list if no list provided', () => {
    const defaultModel = mockEmbeddingList[0];
    vi.spyOn(useSystemStore, 'getState').mockImplementation(() => ({
      embeddingModelList: mockEmbeddingList,
      defaultModels: {
        llm: null,
        embedding: defaultModel
      }
    }));

    const result = getWebDefaultEmbeddingModel();
    expect(result).toEqual(defaultModel);
  });
});
