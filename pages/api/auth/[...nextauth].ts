import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { url } from "../../../utils/utils";

async function attempt_login(
  username,
  password
): Promise<{ id: string; username: string; role: string } | boolean> {
  const ws = new WebSocket(url);

  return await new Promise((resolve, reject) => {
    let result, user, loginPromise;
    ws.addEventListener("open", async () => {
      ws.send(
        JSON.stringify({
          type: "login",
          username: username,
          password: password,
        })
      );

      loginPromise = new Promise((resolve) => {
        ws.onmessage = function (event) {
          // get data from message
          const data = JSON.parse(event.data);
          // wait for login success message
          if (data.type === "login") {
            if (data.success) {
              // User exists and password is correct
              user = {
                id: data.id,
                username: data.username,
                role: data.role,
              };
              resolve(user);
            }
            result = data.success;
          }
        };
      });

      const res = await loginPromise;
      ws.close();
      resolve(res);
    });

    ws.addEventListener("error", (event) => {
      console.log(event);
      reject(new Error("There was an error connecting to the webSocketServer"));
    });

    setTimeout(() => {
      if (!user && !result) {
        reject(new Error("An unknown error occurred"));
      }
    }, 5000);
  });
}

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };

        // login logic
        let success = await attempt_login(username, password);

        if (typeof success !== "boolean") {
          // login successful
          return {
            id: success.id,
            name: success.username,
            role: success.role,
          };
        } else {
          // login failed
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Set role property on token object
      if (user) {
        // @ts-ignore
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add role property to session object
      // @ts-ignore
      session.role = token.role;
      return session;
    },
  },
  secret: process.env.SECRET,
};

export default NextAuth(authOptions);
