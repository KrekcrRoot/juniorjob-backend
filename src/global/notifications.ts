export default {

  // static

  signIn: 'Кто-то вошёл в ваш аккаунт',
  changedPassword: 'Пароль вашего аккаунта был изменён',
  changedEmail: 'Почта была изменена',

  // computed

  vacancyResponse(username: string, vacancy_name: string) {
    if (vacancy_name.length > 64) {
      vacancy_name = vacancy_name.slice(0, 61) + "...";
    }

    return `На вашу вакансию "${vacancy_name}" откликнулся ${username}`;
  },
};
