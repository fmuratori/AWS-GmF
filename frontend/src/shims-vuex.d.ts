import { SocketIO } from '@/socket';
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $socket: SocketIO;
  }
}