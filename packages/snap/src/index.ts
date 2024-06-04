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
import type { OnNameLookupHandler } from '@metamask/snaps-sdk';

import { REG_PH, REG_M, REG_T, UNSTOPPABLE_TLDS } from './constants';
import { resolveENS } from './resolvers/ens';
import { resolveFarcasterName } from './resolvers/farcaster';
import { resolveIDriss } from './resolvers/idriss';
import { resolveLensProfile } from './resolvers/lens';
import { resolveUnstoppableDomain } from './resolvers/unstoppable_domains';

export const onNameLookup: OnNameLookupHandler = async (request: {
  chainId: string;
  domain?: string;
}) => {
  const { domain } = request;

  let customResolverAddress: any;
  if (domain) {
    if (REG_PH.test(domain) || REG_M.test(domain) || REG_T.test(domain)) {
      const resolvedIDriss = await resolveIDriss(domain);
      customResolverAddress = resolvedIDriss;
    } else if (domain?.endsWith('.lens')) {
      const resolvedLens = await resolveLensProfile(domain);
      customResolverAddress = resolvedLens;
    } else if (domain.endsWith('.fc') || domain.endsWith('.farcaster')) {
      const resolvedFarcaster = await resolveFarcasterName(domain);
      customResolverAddress = resolvedFarcaster;
    } else {
      const resolvedENS = await resolveENS(domain);
      customResolverAddress = resolvedENS;
    }
    if (
      customResolverAddress.length === 0 &&
      UNSTOPPABLE_TLDS.some((tld) => domain.endsWith(`.${tld}`))
    ) {
      const resolvedUnstoppableDomains = await resolveUnstoppableDomain(domain);
      customResolverAddress = resolvedUnstoppableDomains;
    }
  }
  if (customResolverAddress.length === 0) {
    return null;
  }
  return { resolvedAddresses: customResolverAddress };
};
