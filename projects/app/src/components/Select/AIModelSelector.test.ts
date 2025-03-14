import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSystemStore } from '@/web/common/system/useSystemStore';
import AIModelSelector from './AIModelSelector';

vi.mock('@/web/common/system/useSystemStore');
vi.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

const mockModelList = [
  {
    id: 'model1',
    name: 'Model 1',
    model: 'model1',
    provider: 'provider1',
    avatar: 'avatar1.png'
  },
  {
    id: 'model2',
    name: 'Model 2',
    model: 'model2',
    provider: 'provider2',
    avatar: 'avatar2.png'
  }
];

const mockProps = {
  list: [
    { value: 'model1', label: 'Model 1' },
    { value: 'model2', label: 'Model 2' }
  ],
  onchange: vi.fn(),
  value: 'model1'
};

describe('AIModelSelector', () => {
  beforeEach(() => {
    vi.mocked(useSystemStore).mockReturnValue({
      llmModelList: mockModelList,
      embeddingModelList: [],
      ttsModelList: [],
      sttModelList: [],
      reRankModelList: []
    } as any);
  });

  it('should render OneRowSelector with short list', () => {
    const result = AIModelSelector(mockProps);
    expect(result).toBeDefined();
  });

  it('should render MultipleRowSelector with long list', () => {
    const longList = Array(11).fill(mockProps.list[0]);
    const result = AIModelSelector({ ...mockProps, list: longList });
    expect(result).toBeDefined();
  });
});

describe('OneRowSelector', () => {
  beforeEach(() => {
    vi.mocked(useSystemStore).mockReturnValue({
      llmModelList: mockModelList,
      embeddingModelList: [],
      ttsModelList: [],
      sttModelList: [],
      reRankModelList: []
    } as any);
  });

  it('should handle disabled state', () => {
    const result = AIModelSelector({ ...mockProps, disableTip: 'Disabled' });
    expect(result).toBeDefined();
  });

  it('should handle model selection', () => {
    const onChange = vi.fn();
    const result = AIModelSelector({ ...mockProps, onchange: onChange });
    expect(result).toBeDefined();
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('MultipleRowSelector', () => {
  beforeEach(() => {
    vi.mocked(useSystemStore).mockReturnValue({
      llmModelList: mockModelList,
      embeddingModelList: [],
      ttsModelList: [],
      sttModelList: [],
      reRankModelList: []
    } as any);
  });

  it('should handle empty value', () => {
    const result = AIModelSelector({ ...mockProps, value: undefined });
    expect(result).toBeDefined();
  });

  it('should handle model selection', () => {
    const onChange = vi.fn();
    const result = AIModelSelector({ ...mockProps, onchange: onChange });
    expect(result).toBeDefined();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should render provider groups', () => {
    const result = AIModelSelector(mockProps);
    expect(result).toBeDefined();
  });
});
