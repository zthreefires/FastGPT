import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkTeamAiPointsAndLock } from './utils';
import { TeamErrEnum } from '@fastgpt/global/common/error/code/team';
import { checkTeamAIPoints } from '@fastgpt/service/support/permission/teamLimit';
import { lockTrainingDataByTeamId } from '@fastgpt/service/core/dataset/training/controller';

vi.mock('@fastgpt/service/support/permission/teamLimit', () => ({
  checkTeamAIPoints: vi.fn()
}));

vi.mock('@fastgpt/service/core/dataset/training/controller', () => ({
  lockTrainingDataByTeamId: vi.fn()
}));

describe('checkTeamAiPointsAndLock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return true when team has enough points', async () => {
    vi.mocked(checkTeamAIPoints).mockResolvedValue(undefined);

    const result = await checkTeamAiPointsAndLock('team-1');

    expect(result).toBe(true);
    expect(checkTeamAIPoints).toHaveBeenCalledWith('team-1');
    expect(lockTrainingDataByTeamId).not.toHaveBeenCalled();
  });

  it('should return false and lock training data when team lacks points', async () => {
    vi.mocked(checkTeamAIPoints).mockRejectedValue(TeamErrEnum.aiPointsNotEnough);
    vi.mocked(lockTrainingDataByTeamId).mockResolvedValue(undefined);

    const result = await checkTeamAiPointsAndLock('team-1');

    expect(result).toBe(false);
    expect(checkTeamAIPoints).toHaveBeenCalledWith('team-1');
    expect(lockTrainingDataByTeamId).toHaveBeenCalledWith('team-1');
  });

  it('should return false for other errors without locking data', async () => {
    vi.mocked(checkTeamAIPoints).mockRejectedValue(new Error('Unknown error'));

    const result = await checkTeamAiPointsAndLock('team-1');

    expect(result).toBe(false);
    expect(checkTeamAIPoints).toHaveBeenCalledWith('team-1');
    expect(lockTrainingDataByTeamId).not.toHaveBeenCalled();
  });

  it('should handle errors during locking process', async () => {
    vi.mocked(checkTeamAIPoints).mockRejectedValue(TeamErrEnum.aiPointsNotEnough);
    vi.mocked(lockTrainingDataByTeamId).mockRejectedValue(new Error('Lock failed'));

    const result = await checkTeamAiPointsAndLock('team-1');

    expect(result).toBe(false);
    expect(checkTeamAIPoints).toHaveBeenCalledWith('team-1');
    expect(lockTrainingDataByTeamId).toHaveBeenCalledWith('team-1');
  });
});
