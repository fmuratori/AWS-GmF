import { SHA3 } from 'sha3';

export default {
  hashText(text: string) {
    const hash = new SHA3(512);
    console.log(hash.update(text));
    console.log(hash.digest('hex'));
  }
}