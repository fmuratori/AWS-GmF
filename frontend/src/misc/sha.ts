import { SHA3 } from 'sha3';

export default {
  hashText(text: string): string {
    const hash = new SHA3(512);
    hash.update(text);
    return hash.digest('hex');
  }
}