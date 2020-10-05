export interface IAuth {
    localId: string,
    idToken: string,
    refreshToken: string,
    expiresIn: string | number
    updated_at: number
}

export interface IAuthorisation {
    email: string,
    password: string,
    returnSecureToken: boolean,
    key: string
}
