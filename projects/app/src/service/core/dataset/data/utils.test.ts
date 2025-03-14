import { describe, it, expect, vi, beforeEach } from 'vitest';
import { hasSameValue } from './utils';
import { MongoDatasetData } from '@fastgpt/service/core/dataset/data/schema';

vi.mock('@fastgpt/service/core/dataset/data/schema', () => ({
  MongoDatasetData: {
    countDocuments: vi.fn()
  }
}));

describe('hasSameValue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should reject when duplicate data exists', async () => {
    vi.mocked(MongoDatasetData.countDocuments).mockResolvedValue(1);

    const params = {
      teamId: 'team1',
      datasetId: 'dataset1',
      collectionId: 'collection1',
      q: 'test question',
      a: 'test answer'
    };

    await expect(hasSameValue(params)).rejects.toEqual('已经存在完全一致的数据');
    expect(MongoDatasetData.countDocuments).toHaveBeenCalledWith(params);
  });

  it('should resolve when no duplicate data exists', async () => {
    vi.mocked(MongoDatasetData.countDocuments).mockResolvedValue(0);

    const params = {
      teamId: 'team1',
      datasetId: 'dataset1',
      collectionId: 'collection1',
      q: 'test question'
    };

    await expect(hasSameValue(params)).resolves.toBeUndefined();
    expect(MongoDatasetData.countDocuments).toHaveBeenCalledWith({
      ...params,
      a: ''
    });
  });

  it('should use empty string as default answer', async () => {
    vi.mocked(MongoDatasetData.countDocuments).mockResolvedValue(0);

    const params = {
      teamId: 'team1',
      datasetId: 'dataset1',
      collectionId: 'collection1',
      q: 'test question'
    };

    await hasSameValue(params);

    expect(MongoDatasetData.countDocuments).toHaveBeenCalledWith({
      ...params,
      a: ''
    });
  });
});
