export const ws = (
  url: string,
  onMessage: (msg: any) => void,
  onError: () => void
): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    let socket = new WebSocket(url);

    const send = (msg: any) => {
      socket.send(JSON.stringify(msg));
    };

    const close = () => {
      socket.close();
    };

    socket.onopen = () => {
      resolve({ send, close });
    };

    socket.onerror = () => {
      console.log('error');

      reject(null);
      onError();
    };

    socket.onmessage = (msg) => {
      onMessage(JSON.parse(msg.data));
    };
  });
};
