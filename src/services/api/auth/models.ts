
type UserRequestHelper = {
    application: string,
}

type LoginRequestPartial = {
    email: string,
    password: string
}

type LoginRequest = LoginRequestPartial &  UserRequestHelper;

type CreateUserPartial = LoginRequestPartial & {
    username: string
}

type CreateUser = CreateUserPartial & UserRequestHelper & {
    captchaToken: null,
};

type UserInfo = {
    createAt: Date,
    email: string,
    emailVerified: boolean,
    firstName: string | null,
    id: string,
    language: string,
    lastname: string | null,
    timezone: string,
    updatedAt: string,
    username: string,
};

type UserData = {
    id: string,
    points: number,
    balance: number,
    lastSeen: Date,
    userId: string,
    spaceId: string,
    levelId: string,
    createdAt: string,
    updatedAt: string,
    level: number
};


export type {
    LoginRequestPartial,
    LoginRequest,
    CreateUserPartial,
    CreateUser,
    UserInfo,
    UserData,
}