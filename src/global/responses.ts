
export default {
    uuidNotValid: 'UUID is not valid',
    noUserWithThisEmail: 'There is no user with this email',
    loginOrPasswordIncorrect: 'Login or password is incorrect',
    accessTokenInvalid: 'Access token is invalid',
    userAlreadyHaveRole: 'The user already has this role',
    userIsNotLogged: 'User is not logged',
    logoutSuccess: 'Logout success',
    logoutUnsuccessed: 'Logout unsuccessed',
    accessDenied: 'Access denied',
    refreshTokenExpiredOrInvalid: 'Refresh token expired or invalid',
    bannedUser: 'Account has been blocked',
    notFound(who: string): string {
        return `${who} not found`;
    },
    doesntExistUUID(who: string): string {
        return `${who} doesn\'t exist with this uuid`;
    },
    doesntExist(who: string): string {
        return `${who} doesn\t exist`;
    },
    alreadyExist(who: string): string {
        return `${who} already exist`;
    },
    permission(what: string): string {
        return `You don\'t have permissions for ${what}`;
    },
    notValid(what: string): string {
        return `Not valid ${what}`;
    }
}