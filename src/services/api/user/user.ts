import { httpService } from '@/services/http/http.service';
import type { UserData } from '../auth/models';
import type { PrizeRequest, UserAcountsInfo, UserBaseInfo } from './models';

const MDBaseUrl = import.meta.env.VITE_MD_BASE_URL;
const spaceId = import.meta.env.VITE_SPACE_ID;
const BBSecondaryUrl = import.meta.env.VITE_BB_SECONDARY_URL;
const path = '/users'

export const userApiService = {
    getPrizesList: async (): Promise<TypedResponse<PrizeRequest[]>> => {
        return await httpService.get(`${spaceId}${path}/my/prizes`)
    },
    getMe: async (): Promise<TypedResponse<UserData>> => {
        return await httpService.post(`${spaceId}${path}/me`, {});
    },
    getAccountsInfo: async (): Promise<TypedResponse<UserAcountsInfo>> => {
        return await httpService.get(`${MDBaseUrl}${path}/link/accounts`, {})
    },
    me: async (): Promise<TypedResponse<UserData>> => {
        return await httpService.post(`${MDBaseUrl}/auth/me`, {});
    },
    getUserBaseInfo: async ():Promise<TypedResponse<UserBaseInfo>> => {
        return await httpService.get(`${BBSecondaryUrl}/user/me`);
    },
    getLadders: async ():Promise<TypedResponse<UserBaseInfo>> => {
        return await httpService.get(`${BBSecondaryUrl}/meta/ladders`);
    },
}
