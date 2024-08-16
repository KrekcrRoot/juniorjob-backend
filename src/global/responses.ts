
export default {
    uuidNotValid: 'Идентификатор недействителен',
    noUserWithThisEmail: 'Пользователя с такой почтой не существует',
    loginOrPasswordIncorrect: 'Неверный логин или пароль',
    accessTokenInvalid: 'Токен доступа недействителен',
    userAlreadyHaveRole: 'Пользователь уже имеет эту роль',
    userIsNotLogged: 'Пользователь не авторизован',
    logoutSuccess: 'Выход из системы выполнен успешно',
    logoutUnsuccessed: 'Выход из системы не выполнен',
    accessDenied: 'Доступ запрещён',
    refreshTokenExpiredOrInvalid: 'Срок действия токена обновления истек или недействителен',
    bannedUser: 'Аккаунт был заблокирован',
    notFound(who: string): string {
        return `${who} не найдено`;
    },
    doesntExistUUID(who: string): string {
        return `${who} не найдено с таким идентификатором`;
    },
    doesntExist(who: string): string {
        return `${who} не существует`;
    },
    alreadyExist(who: string): string {
        return `${who} уже существует`;
    },
    permission(what: string): string {
        return `У вас нет прав для ${what}`;
    },
    notValid(what: string): string {
        return `${what} недействительно`;
    }
}