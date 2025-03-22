import { describe, it, expect } from 'vitest';
import { authType2UsageSource } from '@/service/support/wallet/usage/utils';
import { AuthUserTypeEnum } from '@fastgpt/global/support/permission/constant';
import { UsageSourceEnum } from '@fastgpt/global/support/wallet/usage/constants';

describe('authType2UsageSource', () => {
  it('should return source if provided', () => {
    const result = authType2UsageSource({
      authType: AuthUserTypeEnum.apikey,
      shareId: 'test-share-id',
      source: UsageSourceEnum.api
    });
    expect(result).toBe(UsageSourceEnum.api);
  });

  it('should return shareLink if shareId is provided without source', () => {
    const result = authType2UsageSource({
      authType: AuthUserTypeEnum.apikey,
      shareId: 'test-share-id'
    });
    expect(result).toBe(UsageSourceEnum.shareLink);
  });

  it('should return api if authType is apikey without source and shareId', () => {
    const result = authType2UsageSource({
      authType: AuthUserTypeEnum.apikey
    });
    expect(result).toBe(UsageSourceEnum.api);
  });

  it('should return fastgpt if no source, shareId or apikey authType provided', () => {
    const result = authType2UsageSource({
      authType: AuthUserTypeEnum.owner
    });
    expect(result).toBe(UsageSourceEnum.fastgpt);
  });

  it('should return fastgpt if no parameters provided', () => {
    const result = authType2UsageSource({});
    expect(result).toBe(UsageSourceEnum.fastgpt);
  });
});
