/* eslint-disable jsdoc/match-description */
import { JsonRpcProvider, Contract } from 'ethers';

import {
  POLYGON_RPC_URL,
  IDRISS_REGISTRY_RESOLVER,
  IDRISS_RESOVER_ABI,
} from '../constants';
import type { ResolveOptions, IDrissResolver } from '../types';
import { transformIdentifier, filterWalletTags, digestMessage } from '../utils';

const provider = new JsonRpcProvider(POLYGON_RPC_URL);

const contract = new Contract(
  IDRISS_REGISTRY_RESOLVER,
  IDRISS_RESOVER_ABI,
  provider,
);

const resolverContract = contract as IDrissResolver;

/**
 * Resolve IDriss handles
 *
 * @param userInput - email, phone or twitter username
 * @param resolveOptions - optional resolve option (filter for evm, ...)
 * @returns tuple array of resolved addresses
 */
export async function resolveIDriss(
  userInput: string,
  resolveOptions: ResolveOptions = {},
): Promise<{ resolvedAddress: any; protocol: string }[]> {
  const identifier = await transformIdentifier(userInput);
  const filteredWalletTags = filterWalletTags(resolveOptions);

  const digestPromises = filteredWalletTags.map(
    async ({ tagAddress, tagName }) => {
      const digested = digestMessage(identifier + tagAddress);
      return { digested, tagName };
    },
  );

  const digestionResult = await Promise.all(digestPromises);
  const digestedMessages = digestionResult.map((val) => val.digested);

  await resolverContract.getMultipleIDriss(digestedMessages);

  const getMultipleIDrissResponse: [string, string][] =
    await resolverContract.getMultipleIDriss(digestedMessages);

  const entries = getMultipleIDrissResponse
    .map(([digested, resolvedAddress]): [string, string] | undefined => {
      if (!resolvedAddress) {
        return undefined;
      }

      const foundResult = digestionResult.find(
        (val) => val.digested === digested,
      );

      if (!foundResult) {
        throw new Error(`Expected digested message: ${digested}`);
      }

      return [foundResult.tagName, resolvedAddress];
    })
    .filter(Boolean) as [string, string][];

  if (!entries || entries.length === 0) {
    return [];
  }

  const publicETH = entries.find((entry) => entry[0] === 'Public ETH');
  const resolvedIDriss = publicETH?.[1] ?? entries[0]?.[1] ?? [];
  return [{ resolvedAddress: resolvedIDriss, protocol: 'IDriss' }];
}
