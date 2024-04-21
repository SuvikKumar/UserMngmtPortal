import NextAuth from "next-auth";
import { MongoClient } from "mongodb";

export default NextAuth({
  // ... existing NextAuth configuration

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user.role = await getRoleForUser(user._id); // Add user's role to token
        token.user.tenants = await getTenantsForUser(user._id); // Add user's tenants
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.user.role;
      session.user.tenants = token.user.tenants;
      return session;
    },
  },
});

async function getRoleForUser(userId) {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const usersCollection = client.db(process.env.MONGODB_DB).collection("users");
  const user = await usersCollection.findOne({ _id: userId }).populate("role"); // Populate role data
  await client.close();
  return user.role;
}

// ... existing code for getTenantsForUser
