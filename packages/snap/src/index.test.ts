import { expect } from '@jest/globals';
import type { ChainId } from '@metamask/snaps-sdk';

import { onNameLookup } from '.';

const TWITTER_MOCK = '@IDriss_xyz';
const TWITTER_ADDRESS_MOCK = '0x5ABca791C22E7f99237fCC04639E094Ffa0cCce9';
const MAIL_MOCK = 'hello@idriss.xyz';
const MAIL_ADDRESS_MOCK = '0x11E9F9344A9720d2B2B5F0753225bb805161139B';
const TWITTER_MOCK_INVALID = '@vitalikbuterin';

const UD_DOMAIN_MOCK = 'matt.crypto';
const UD_DOMAIN_MOCK_WRONG = 'mat.crypto';
const UD_ADDRESS_MOCK = '0xa59C818Ddb801f1253edEbf0Cf08c9E481EA2fE5';
const CHAIN_ID_MOCK = 'eip155:1' as ChainId;

const ENS_DOMAIN_MOCK = 'vitalik.eth';
const ENS_DOMAIN_MOCK_CONTRACT = 'gitcoin.eth';
const ENS_ADDRESS_MOCK = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
const ENS_CHAIN_ID_MOCK = 'eip155:137' as ChainId;

const FARCASTER_DOMAIN_MOCK = 'dwr.farcaster';
const FARCASTER_DOMAIN_MOCK_NO_ADDRESS = 'nonexistantaccount.farcaster';
const FARCASTER_ADDRESS_MOCK = '0xd7029bdea1c17493893aafe29aad69ef892b8ff2';

const LENS_DOMAIN_MOCK = 'stani.lens';
const LENS_DOMAIN_MOCK_NO_ADDRESS = 'notstani.lens';
const LENS_ADDRESS_MOCK = '0x7241DDDec3A6aF367882eAF9651b87E1C7549Dff';

describe('onNameLookup', () => {
  describe('IDriss', () => {
    it('twitter name resolves', async () => {
      const request = {
        domain: TWITTER_MOCK,
        chainId: CHAIN_ID_MOCK,
      };
      const result = await onNameLookup(request);

      expect(result).toStrictEqual({
        resolvedAddresses: [
          {
            resolvedAddress: TWITTER_ADDRESS_MOCK,
            protocol: 'IDriss',
          },
        ],
      });
    });
    it('email resolves', async () => {
      const request = {
        domain: MAIL_MOCK,
        chainId: CHAIN_ID_MOCK,
      };
      const result = await onNameLookup(request);

      expect(result).toStrictEqual({
        resolvedAddresses: [
          {
            resolvedAddress: MAIL_ADDRESS_MOCK,
            protocol: 'IDriss',
          },
        ],
      });
    });
    it('twitter handle without IDriss returns null', async () => {
      const request = {
        domain: TWITTER_MOCK_INVALID,
        chainId: CHAIN_ID_MOCK,
      };
      const result = await onNameLookup(request);

      expect(result).toBeNull();
    });
  });
  describe('Unstoppable Domains', () => {
    it('valid unstoppable domain resolves', async () => {
      const request = {
        domain: UD_DOMAIN_MOCK,
        chainId: CHAIN_ID_MOCK,
      };
      const result = await onNameLookup(request);

      expect(result).toStrictEqual({
        resolvedAddresses: [
          {
            resolvedAddress: UD_ADDRESS_MOCK,
            protocol: 'Unstoppable Domains',
          },
        ],
      });
    });
    it('invalid unstoppable domain returns null', async () => {
      const request = {
        domain: UD_DOMAIN_MOCK_WRONG,
        chainId: CHAIN_ID_MOCK,
      };
      const result = await onNameLookup(request);

      expect(result).toBeNull();
    });
  });
  describe('ENS', () => {
    it('eoa input on other chain than eip155:1 resolves', async () => {
      const request = {
        domain: ENS_DOMAIN_MOCK,
        chainId: ENS_CHAIN_ID_MOCK,
      };
      const result = await onNameLookup(request);

      expect(result).toStrictEqual({
        resolvedAddresses: [
          {
            resolvedAddress: ENS_ADDRESS_MOCK,
            protocol: 'ENS',
          },
        ],
      });
    });
    it('mainnet contract ens does not resolve on chains other than eip155:1', async () => {
      const request = {
        domain: ENS_DOMAIN_MOCK_CONTRACT,
        chainId: ENS_CHAIN_ID_MOCK,
      };
      const result = await onNameLookup(request);

      expect(result).toBeNull();
    });
  });
  describe('Farcaster', () => {
    it('farcaster name with connected address resolves', async () => {
      const request = {
        domain: FARCASTER_DOMAIN_MOCK,
        chainId: CHAIN_ID_MOCK,
      };
      const result = await onNameLookup(request);

      expect(result).toStrictEqual({
        resolvedAddresses: [
          {
            resolvedAddress: FARCASTER_ADDRESS_MOCK,
            protocol: 'Farcaster',
          },
        ],
      });
    });
    it('farcaster account without connected address does not resolve', async () => {
      const request = {
        domain: FARCASTER_DOMAIN_MOCK_NO_ADDRESS,
        chainId: CHAIN_ID_MOCK,
      };
      const result = await onNameLookup(request);

      expect(result).toBeNull();
    });
  });
  describe('Lens', () => {
    it('lens name resolves', async () => {
      const request = {
        domain: LENS_DOMAIN_MOCK,
        chainId: CHAIN_ID_MOCK,
      };
      const result = await onNameLookup(request);

      expect(result).toStrictEqual({
        resolvedAddresses: [
          {
            resolvedAddress: LENS_ADDRESS_MOCK,
            protocol: 'Lens',
          },
        ],
      });
    });
    it('non-existing lens handle returns null', async () => {
      const request = {
        domain: LENS_DOMAIN_MOCK_NO_ADDRESS,
        chainId: CHAIN_ID_MOCK,
      };
      const result = await onNameLookup(request);

      expect(result).toBeNull();
    });
  });
});
