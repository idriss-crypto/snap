/* eslint-disable jsdoc/match-description */
import { BASE_API_URL } from '../constants';

/**
 * Handle Farcaster profiles
 *
 * @param domain - the farcaster handle to be resolved
 * @returns The resolved address, if available
 */
export async function resolveFarcasterName(
  domain: string,
): Promise<
  { resolvedAddress: string; protocol: string; domainName: string }[]
> {
  try {
    let userFID: string;
    let connectedAddress = '';
    const handle = domain
      .replace('@', '')
      .replace('.fc', '')
      .replace('.farcaster', '')
      .replace('.eth', '');

    const FID_URL = `https://fnames.farcaster.xyz/transfers/current?name=${handle}`;
    try {
      const fidResponse = await fetch(FID_URL);
      const fidData = await fidResponse.json();
      if (fidData) {
        userFID = fidData.transfer.to;
      } else {
        return [];
      }
    } catch {
      return [];
    }

    const ADDRESS_URL = `${BASE_API_URL}/snap/get-connected-addresses?fid=${userFID}`;
    const addressResponse = await fetch(ADDRESS_URL);
    const addressData = await addressResponse.json();
    const { result } = addressData;
    if (result?.verifications && result.verifications.length > 0) {
      for (const verification of result.verifications) {
        if (verification.protocol === 'ethereum') {
          connectedAddress = verification.address;
          break;
        }
      }
    }

    if (connectedAddress) {
      return [
        {
          resolvedAddress: connectedAddress,
          protocol: 'Farcaster',
          domainName: domain,
        },
      ];
    }
    return [];
  } catch (error) {
    console.error('Error resolving Farcaster handle:', error);
    return [];
  }
}
