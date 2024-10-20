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
import type {
  OnNameLookupHandler,
  OnInstallHandler,
} from '@metamask/snaps-sdk';
import { Box, Heading, Row, Divider, Text } from '@metamask/snaps-sdk/jsx';

import { REG_M, REG_PH, UNSTOPPABLE_TLDS } from './constants';
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
    if (
      REG_PH.test(domain) ||
      REG_M.test(domain) ||
      domain?.endsWith('.twitter') ||
      domain?.endsWith('.x')
    ) {
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

export const onInstall: OnInstallHandler = async () => {
  await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: (
        <Box>
          <Heading>Installation successful 🎉</Heading>
          <Text>
            MetaMask can now send to a number of social handles and domans.
          </Text>
          <Divider />
          <Row label="IDriss">
            <Text>username.x</Text>
          </Row>
          <Row label="">
            <Text>username.twitter</Text>
          </Row>
          <Divider />
          <Row label="Farcaster">
            <Text>username.fc</Text>
          </Row>
          <Row label="">
            <Text>username.farcaster</Text>
          </Row>
          <Divider />
          <Row label="Lens">
            <Text>username.lens</Text>
          </Row>
          <Divider />
          <Row label="Unstoppable Domains">
            <Text>Valid UDs</Text>
          </Row>
          <Divider />
          <Row label="ENS">
            <Text>
              Valid ENS, given it does not resolve to a contract address on
              Mainnet
            </Text>
          </Row>
        </Box>
      ),
    },
  });
};
