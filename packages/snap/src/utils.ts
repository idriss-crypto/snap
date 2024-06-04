import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';

import { REG_PH, REG_M, REG_T, BASE_API_URL, WALLET_TAGS } from './constants';
import type { ResolveOptions } from './types';

const toTitleCase = (input: string) => {
  return input.charAt(0).toLowerCase() + input.slice(1);
};

const matchInput = (input: string) => {
  if (REG_PH.test(input)) {
    return 'phone';
  }
  if (REG_M.test(input)) {
    return 'mail';
  }
  if (REG_T.test(input)) {
    return 'twitter';
  }
  return null;
};

const convertPhone = (input: string) => {
  // allow for letters because secret word can follow phone number
  return `+${input.replace(/[^\dA-Za-z]/u, '')}`;
};

const getTwitterID = async (inputCombination: string): Promise<string> => {
  const response = await fetch(
    `${BASE_API_URL}get-twitter-id?identifier=${encodeURIComponent(
      inputCombination.toLowerCase(),
    )}`,
  );
  if (response.status !== 200) {
    throw new Error(
      `IDriss api responded with code ${response.status} ${
        response.statusText
      }\r\n${await response.text()}`,
    );
  }
  const json = await response.json();
  return json.id;
};

export const transformIdentifier = async (input: string) => {
  const identifier = toTitleCase(input).replace(' ', '');
  const inputType = matchInput(input);

  if (inputType === null) {
    throw new Error(
      'Not a valid input. Input must start with valid phone number, email or @twitter handle.',
    );
  }

  if (inputType === 'phone') {
    return convertPhone(identifier);
  }

  if (inputType === 'twitter') {
    const maybeTwitterIdentifier = await getTwitterID(identifier);
    if (maybeTwitterIdentifier === 'Not found') {
      throw new Error('Twitter handle not found.');
    }
    return maybeTwitterIdentifier;
  }

  return input;
};

export const filterWalletTags = ({
  coin,
  network,
  walletTag,
}: ResolveOptions) => {
  return WALLET_TAGS.filter((tag) => {
    if (coin && tag.coin !== coin) {
      return false;
    }

    if (network && tag.network !== network) {
      return false;
    }

    if (walletTag && tag.tagName !== walletTag) {
      return false;
    }

    return true;
  });
};

export const digestMessage = (message: string) => {
  const msgUint8 = new TextEncoder().encode(message); // Encode as UTF-8 Uint8Array
  const hashBuffer = sha256(msgUint8); // Hash the message
  const hashHex = bytesToHex(hashBuffer); // Convert bytes to hex string
  return hashHex;
};
