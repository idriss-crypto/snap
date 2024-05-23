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
): Promise<{ resolvedAddress: any; protocol: string }[]> {
  try {
    const handle = domain.replace('@', '').replace('.lens', '');

    const lensHandle = `lens/${handle}`;

    console.log('resolving lens: ', lensHandle);

    // Resolve the address using LensClient
    const address = await client.handle.resolveAddress({ handle: lensHandle });
    console.log('Lens result is', address);
    if (address) {
      return [{ resolvedAddress: address, protocol: 'Lens Protocol' }];
    }
    return [];
  } catch (error) {
    console.error('Error resolving Lens handle:', error);
    return [];
  }
}
