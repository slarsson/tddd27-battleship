export const write = (gameId: string, token: string) => {
  localStorage.setItem(gameId, token);
};

export const read = (gameId: string): string | null => {
  return localStorage.getItem(gameId);
};
