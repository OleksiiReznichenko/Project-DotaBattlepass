const tokenKey: string = 'bb_t'

export const storageService = {
    getItem: (key: string) => {
      return localStorage.getItem(key);
    },
    setItem: (key: string, value: string) => {
      localStorage.setItem(key, value);
    },
    clearItem: (key: string) => {
      localStorage.removeItem(key);
    },
  };