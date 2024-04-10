export default interface Sprite {
    folder: string;
    states: {
        idle: boolean,
        attack: boolean,
        death: boolean,
        walk: boolean,
        victory: boolean,
    }
}