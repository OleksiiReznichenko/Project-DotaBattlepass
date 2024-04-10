declare module '@mymap/betboom-integrate';

declare interface TypedResponse<T=any> extends Response {
    data: any;
    json<P = T>(): Promise<P>;
}