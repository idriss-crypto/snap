/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
import type { OnNameLookupHandler } from '@metamask/snaps-types';

import { REG_PH, REG_M, REG_T, UNSTOPPABLE_TLDS } from './constants';
import { resolveENS } from './resolvers/ens';
import { resolveFarcasterName } from './resolvers/farcaster';
import { resolveIDriss } from './resolvers/idriss';
import { resolveLensProfile } from './resolvers/lens';
import { resolveUnstoppableDomain } from './resolvers/unstoppable_domains';

let currentTime = new Date();

export const onNameLookup: OnNameLookupHandler = async (request: {
  chainId: string;
  domain?: string;
}) => {
  console.log('Current Time:', currentTime);
  currentTime = new Date();

  const { domain } = request;

  let customResolverAddress: any;
  if (domain) {
    if (REG_PH.test(domain) || REG_M.test(domain) || REG_T.test(domain)) {
      const resolvedIDriss = await resolveIDriss(domain);
      customResolverAddress = resolvedIDriss;
    } else if (domain?.endsWith('.lens')) {
      console.log('resolving lens', domain);
      const resolvedLens = await resolveLensProfile(domain);
      customResolverAddress = resolvedLens;
    } else if (domain.endsWith('.fc') || domain.endsWith('.farcaster')) {
      console.log('Resolving Farcaster name', domain);
      const resolvedFarcaster = await resolveFarcasterName(domain);
      customResolverAddress = resolvedFarcaster;
    } else {
      console.log('resolving ens');
      const resolvedENS = await resolveENS(domain);
      console.log('result after return', resolvedENS[0]);
      customResolverAddress = resolvedENS;
    }
    console.log('Custom result currently', customResolverAddress);
    if (
      !customResolverAddress &&
      UNSTOPPABLE_TLDS.some((tld) => domain.endsWith(`.${tld}`))
    ) {
      console.log('resolving UD', domain);
      const resolvedUnstoppableDomains = await resolveUnstoppableDomain(domain);
      customResolverAddress = resolvedUnstoppableDomains;
    }
  }
  if (customResolverAddress.length === 0) {
    return null;
  }
  console.log('resolvedAddress is', customResolverAddress);
  return { resolvedAddresses: customResolverAddress };
};
