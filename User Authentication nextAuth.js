// User Authentication
// pages/api/auth/[...nextauth].js

import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { MongoClient } from "mongodb"; // Assuming MongoDB

export default NextAuth({
  providers: [
    EmailProvider({
      server: {
        uri: process.env.MONGODB_URI, // Replace with your MongoDB connection string
        dbName: process.env.MONGODB_DB, // Replace with your database name
        async createUser(user) {
          const client = await MongoClient.connect(process.env.MONGODB_URI);
          const usersCollection = client.db(process.env.MONGODB_DB).collection("users");
          await usersCollection.insertOne({
            email: user.email,
            password: await bcrypt.hash(user.password, 10), // Hash password using bcrypt
            // Add other user fields (optional)
          });
          await client.close();
          return user;
        },
        async signIn(user, account, profile) {
          if (account.password && !user.password) {
            // If password login, verify hashed password
            const client = await MongoClient.connect(process.env.MONGODB_URI);
            const usersCollection = client.db(process.env.MONGODB_DB).collection("users");
            const existingUser = await usersCollection.findOne({ email: user.email });
            await client.close();
            if (existingUser && await bcrypt.compare(account.password, existingUser.password)) {
              return existingUser;
            }
            throw new Error("Invalid Password");
          }
          return profile || user;
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier: email, url }) => {
        const token = await jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });
        const verificationUrl = `<span class="math-inline">\{url\}/verify?token\=</span>{token}`;
        const message = `Please click on the link to verify your email: ${verificationUrl}`;
        // Implement logic to send the verification email with the message
      },
    }),
    // Add social providers here (optional)
  ],
  secret: process.env.JWT_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user; // Add user data to token
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user; // Pass user data to session
      return session;
    },
  },
});



//