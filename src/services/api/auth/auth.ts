import { httpService } from '@/services/http/http.service';
import type { LoginRequest, LoginRequestPartial, CreateUserPartial, CreateUser, UserInfo } from './models';
import { betboomIntegrate } from '@/utils/betboom-integrate';

const MDBaseUrl = import.meta.env.VITE_MD_BASE_URL;
const appName = 'dotaboom'

export const authApiService = {
    authorization: async function (zone: string, token: string): Promise<UserInfo> {
        return await betboomIntegrate.auth({
            token: token,
            zone: zone,
        })
    },
    // authorization: async (data: LoginRequestPartial): Promise<TypedResponse<User>> => {
    //     return await httpService.post(`/auth/login`,{ ...data });
    // },
    // create: async (data: CreateUserPartial): Promise<TypedResponse<string>> => {
    //     return await httpService.post(`/auth/register`, { ...data})
    // },

}