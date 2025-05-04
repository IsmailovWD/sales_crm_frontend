import { onMounted, onUnmounted, ref } from "vue";
import type { Socket } from "socket.io-client";
import { useMessage } from "naive-ui";

export function useSocket(
  socket: Socket,
  eventName: string,
  callback: (data: any) => void
) {
  const message = useMessage();
  const isConnected = ref(socket.connected);
  const isDev = import.meta.env.DEV;

  onMounted(() => {
    if (!socket.connected) {
      socket.connect();
      isConnected.value = true;
      // if (isDev) message.success("🟢 Socket connected");
    } else {
      // if (isDev) message.info("🟡 Socket already connected");
    }

    socket.on(eventName, callback);
  });

  onUnmounted(() => {
    socket.off(eventName, callback);
    if (isConnected.value && socket.connected) {
      socket.disconnect();
      isConnected.value = false;
      // if (isDev) message.error("🔴 Socket disconnected");
    } else {
      // if (isDev) message.error("🟡 Socket already disconnected");
    }
  });

  return { isConnected };
}
