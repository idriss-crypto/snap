/* eslint-disable jsdoc/match-description */
import { BASE_API_URL } from '../constants';

/**
 * Handle unstoppable domains
 *
 * @param domain - the unstoppable domain to be resolved
 * @returns The resolved address, if available
 */
export async function resolveUnstoppableDomain(
  domain: string,
): Promise<
  { resolvedAddress: string; protocol: string; domainName: string }[]
> {
  const response = await fetch(
    `${BASE_API_URL}resolve-unstoppable-domains?domain=${domain}`,
  );
  const data = await response.json();
  const resolvedAddress = data.records['crypto.ETH.address'] as string;
  if (resolvedAddress) {
    return [
      { resolvedAddress, protocol: 'Unstoppable Domains', domainName: domain },
    ];
  }
  return [];
}
