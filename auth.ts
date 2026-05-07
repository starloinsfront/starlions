// ./auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const {handlers, signIn, signOut, auth} = NextAuth({
  // Стратегия сессий через JWT (стандарт, не требует БД)
  session: {strategy: "jwt"},
  providers: [
    Credentials({
      // Имя провайдера, будет отображаться на странице входа по умолчанию
      name: "credentials",
      // Поля формы, которые будут отображаться (если используем страницу логина по умолчанию)
      credentials: {
        email: {label: "Email", type: "email"},
        password: {label: "Password", type: "password"},
      },
      // Основная логика авторизации
      async authorize(credentials) {
        // 1. Проверяем, что credentials существуют
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // 2. Запрос к вашему внешнему бэкенду
          const res = await fetch(`${process.env.API_BACKEND_URL}/api/v1/auth/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          // 3. Если бэкенд вернул ошибку (пользователь не найден)
          if (!res.ok) {
            // Можно вернуть null, но лучше выкинуть ошибку для кастомного сообщения
            // throw new Error(data.message || "Invalid credentials");
            return null;
          }

          // 4. Здесь предполагается, что бэкенд вернул объект пользователя
          // Например: { id: 1, email: 'user@mail.com', username: 'JohnDoe', token: '...' }
          // Вы можете вернуть то, что нужно будет поместить в JWT
          if (data.user) {
            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.username,
              // Можно сохранить accessToken от бэкенда в JWT
              // backendToken: data.token,
            };
          }
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // Контролируем содержимое JWT токена
    async jwt({token, user, trigger, session}) {
      // При первом входе (user существует) добавляем данные пользователя в токен
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        // token.backendToken = user.backendToken; // если передали выше
      }

      // Если нужно обновить сессию со стороны клиента (trigger === "update")
      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.email = session.user.email;
      }

      return token;
    },
    // Контролируем содержимое сессии (то, что попадает в useSession)
    async session({session, token}) {
      // Перекладываем данные из токена в сессию
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  pages: {
    // Свой кастомный путь для страницы входа
    signIn: "/login",
  },
});
