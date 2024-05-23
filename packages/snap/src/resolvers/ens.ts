/* eslint-disable jsdoc/match-description */
import { JsonRpcProvider } from 'ethers';

import { ETHEREUM_RPC_URL } from '../constants';

// Initialize ethers provider
const provider = new JsonRpcProvider(ETHEREUM_RPC_URL);

/**
 * Resolve ENS domains
 *
 * @param domain - user input
 * @returns tuple array of resolved addresses
 */
export async function resolveENS(
  domain: string,
): Promise<{ resolvedAddress: any; protocol: string }[]> {
  const resolvedENS = await provider.resolveName(domain);
  console.log('resolved ', resolvedENS);
  // if it comes here, then it's not a contract.
  if (!resolvedENS) {
    return [];
  }
  try {
    const code = await provider.getCode(resolvedENS);
    if (code !== '0x') {
      console.log('detected code, is contract', code);
      return [];
    }
  } catch (error) {
    console.log('Error resolving ens:', error);
    return [];
  }
  return [{ resolvedAddress: resolvedENS, protocol: 'ENS' }];
}
