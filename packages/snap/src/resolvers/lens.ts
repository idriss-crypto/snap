/* eslint-disable jsdoc/match-description */
import { LensClient, production } from '@lens-protocol/client';

const client = new LensClient({
  environment: production,
});

/**
 * Handle lens profile names
 *
 * @param domain - the lens handle to be resolved
 * @returns The resolved address, if available
 */
export async function resolveLensProfile(
  domain: string,
): Promise<
  { resolvedAddress: string; protocol: string; domainName: string }[]
> {
  try {
    const handle = domain.replace('@', '').replace('.lens', '');

    const lensHandle = `lens/${handle}`;

    // Resolve the address using LensClient
    const address = await client.handle.resolveAddress({ handle: lensHandle });
    if (address) {
      return [
        { resolvedAddress: address, protocol: 'Lens', domainName: domain },
      ];
    }
    return [];
  } catch (error) {
    console.error('Error resolving Lens handle:', error);
    return [];
  }
}
