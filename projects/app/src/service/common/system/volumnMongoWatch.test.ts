import { vi, describe, it, expect, beforeEach } from 'vitest';
import { startMongoWatch } from './volumnMongoWatch';
import { initSystemConfig } from '.';
import { getSystemPluginCb } from '@/service/core/app/plugin';
import { createDatasetTrainingMongoWatch } from '@/service/core/dataset/training/utils';
import { MongoSystemConfigs } from '@fastgpt/service/common/system/config/schema';
import { MongoSystemPlugin } from '@fastgpt/service/core/app/plugin/systemPluginSchema';
import { MongoAppTemplate } from '@fastgpt/service/core/app/templates/templateSchema';
import { getAppTemplatesAndLoadThem } from '@fastgpt/templates/register';
import { watchSystemModelUpdate } from '@fastgpt/service/core/ai/config/utils';

vi.mock('@/service/core/app/plugin');
vi.mock('.');
vi.mock('@/service/core/dataset/training/utils');
vi.mock('@fastgpt/templates/register');
vi.mock('@fastgpt/service/core/ai/config/utils');

describe('volumnMongoWatch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('startMongoWatch', () => {
    it('should start all watchers', async () => {
      const mockWatch = vi.fn().mockReturnValue({
        on: vi.fn()
      });

      MongoSystemConfigs.watch = mockWatch;
      MongoSystemPlugin.watch = mockWatch;
      MongoAppTemplate.watch = mockWatch;

      await startMongoWatch();

      expect(mockWatch).toHaveBeenCalledTimes(3);
      expect(createDatasetTrainingMongoWatch).toHaveBeenCalled();
      expect(watchSystemModelUpdate).toHaveBeenCalled();
    });
  });

  describe('reloadConfigWatch', () => {
    it('should handle insert operation', async () => {
      const mockOn = vi.fn();
      const mockWatch = vi.fn().mockReturnValue({
        on: mockOn
      });

      MongoSystemConfigs.watch = mockWatch;

      await startMongoWatch();

      const changeHandler = mockOn.mock.calls[0][1];
      await changeHandler({ operationType: 'insert' });

      expect(initSystemConfig).toHaveBeenCalled();
    });

    it('should ignore non-insert operations', async () => {
      const mockOn = vi.fn();
      const mockWatch = vi.fn().mockReturnValue({
        on: mockOn
      });

      MongoSystemConfigs.watch = mockWatch;

      await startMongoWatch();

      const changeHandler = mockOn.mock.calls[0][1];
      await changeHandler({ operationType: 'update' });

      expect(initSystemConfig).not.toHaveBeenCalled();
    });
  });

  describe('refetchSystemPlugins', () => {
    it('should debounce and delay plugin refresh', async () => {
      vi.useFakeTimers();

      const mockOn = vi.fn();
      const mockWatch = vi.fn().mockReturnValue({
        on: mockOn
      });

      MongoSystemPlugin.watch = mockWatch;

      await startMongoWatch();

      const changeHandler = mockOn.mock.calls[0][1];
      changeHandler({ operationType: 'update' });

      await vi.advanceTimersByTime(5500);

      expect(getSystemPluginCb).toHaveBeenCalledWith(true);

      vi.useRealTimers();
    });
  });

  describe('refetchAppTemplates', () => {
    it('should debounce and delay template refresh', async () => {
      vi.useFakeTimers();

      const mockOn = vi.fn();
      const mockWatch = vi.fn().mockReturnValue({
        on: mockOn
      });

      MongoAppTemplate.watch = mockWatch;

      await startMongoWatch();

      const changeHandler = mockOn.mock.calls[0][1];
      changeHandler({ operationType: 'update' });

      await vi.advanceTimersByTime(5500);

      expect(getAppTemplatesAndLoadThem).toHaveBeenCalledWith(true);

      vi.useRealTimers();
    });
  });
});
