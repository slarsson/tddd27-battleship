
export const ws = (url: string, onMessage: (msg: any) => void, onError: () => void): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    let socket = new WebSocket(url);

    const send = (msg: any) => {
      socket.send(JSON.stringify(msg));
    }

    socket.onopen = () => {
      resolve(send);
    }

    socket.onerror = () => {
      console.log('error');
      
      reject(null);
      onError();
    }

    socket.onmessage = (msg) => {
      onMessage(JSON.parse(msg.data));
    }
  });
  
  //socket.onopen =   
  
  // let socket = new WebSocket('ws://localhost:3000');
    //         socket.onopen = () => {
    //             socket.send(JSON.stringify({
    //                 type: 'connect',
    //                 gameId: currentGame.gameId,
    //                 token: currentGame.token,
    //             }));

    //return 
};