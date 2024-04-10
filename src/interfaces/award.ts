export default interface Award {
    type: 'xp' | 'spin' | 'money' | 'coupon' | 'promocode';
    couponNumber?: number;
    promocodeNumber?: number;
    amount: number;
}