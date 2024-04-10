import axios from 'axios';
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from 'pinia';


export const headersAppJSON = { 'Content-Type': 'application/json' };

const baseApiUrl = import.meta.env.VITE_BB_BASE_URL;


const _axiosInstance = axios.create({
    baseURL: baseApiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

_axiosInstance.interceptors.request.use((req) => {
  const authStore = useAuthStore();

  const { token: { value: token }  } = storeToRefs(authStore);
  
  if(req?.headers) {
    req.headers.authorization = 'token ' + token;
  }

  if(!token) {
    throw new axios.Cancel('Operation stopped by the system!');
  }

  return req;
})

export const httpService = {
    get: <T>(url: string, p: any = {}): Promise<any> => {
      const { query, ...params } = p;
      const _url = query
        ? url + '?'
        : url;
      return _axiosInstance.get(_url, {
        params: { ...params },
      });
    },
  
    post: <T>(
      url: string,
      body: unknown | undefined,
      p: any = {},
    ): Promise<any> => {
      const { query, ...params } = p;
      return _axiosInstance.post(url, body, { params: query, ...params, data: body });
    },
  
    put: <T>(
      url: string,
      body: unknown,
      p: any = {},
    ): Promise<any> => {
      const { query, ...params } = p;
  
      return _axiosInstance.put(url, body, { params: query, ...params, data: body });
    },
    patch: <T>(
      url: string,
      body: unknown,
      p: any = {},
    ): Promise<any> => {
      const { query, ...params } = p;
      return _axiosInstance.patch(url, body, { params: query, ...params, data: body });
    },
    delete: <T>(
      url: string,
      body: unknown,
      p: any = {},
    ): Promise<any> => {
      const { query, ...params } = p;
      return _axiosInstance.delete(url, { params: query, ...params, data: body });
    },
};