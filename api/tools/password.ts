import * as crypto from 'crypto';

import { randomHex, timingCompair } from './util';

const SAULT_LENGTH = 64;

export function generate_sault(seed: string = '') {
  return `${seed}${randomHex(SAULT_LENGTH)}`;
}

export function hash_keys(...keys: string[]): string {
  const hash = crypto.createHash('sha256');
  hash.update(keys.join(''));

  return hash.digest('hex');
}

export function hash_password(sault: string, password: string): string {

  return hash_keys(sault, password);
}

export function valid_password(
  sault: string,
  loginPassword: string,
  password: string,
): boolean {
  const hashedPassword = hash_keys(sault, loginPassword);

  return timingCompair(hashedPassword, password);
}
