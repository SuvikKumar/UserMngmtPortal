import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { MongoClient, ObjectId } from "mongodb";
import crypto from "crypto"; // For secure token generation

export default NextAuth({
  providers: [
    EmailProvider({
      server: {
        // Replace with your actual email server configuration
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE, // Likely true for secure connections (TLS/STARTTLS)
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM, // Set your sender email address
      sendVerificationRequest: async ({ identifier: email, url }) => {
        const transport = nodemailer.createTransport({
          // Use the configured email server details
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          secure: process.env.EMAIL_SECURE,
          auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
          },
        });
    
        const mailOptions = {
          from: process.env.EMAIL_FROM,
          to: email,
          subject: 'Email Verification',
          text: `Please click on this link to verify your email address: ${url}`,
          html: `<b>Please click on this link to verify your email address:</b><br><a href="${url}">${url}</a>`, // Optional HTML content
        };
    
        try {
          const info = await transport.sendMail(mailOptions);
          console.log('Verification email sent:', info.messageId);
        } catch (error) {
          console.error('Error sending verification email:', error);
          throw error; // Re-throw for potential error handling in the calling code
        } finally {
          // Optional: Close the transport connection if needed
          // transport.close();
        }
      },
      async forgotPasswordRequest(req) {
        const email = req.body.email;

        if (!email) {
          throw new Error("Email is required");
        }

        const client = await MongoClient.connect(process.env.MONGODB_URI);
        const usersCollection = client.db(process.env.MONGODB_DB).collection("users");
        const user = await usersCollection.findOne({ email });
        await client.close();

        if (!user) {
          throw new Error("No user found with that email");
        }

        const token = crypto.randomBytes(32).toString("hex"); // Generate secure reset token
        const tokenExpiry = Date.now() + 3600000; // Set token expiry (1 hour)

        await usersCollection.updateOne(
          { _id: user._id },
          { $set: { resetToken: token, resetTokenExpiry: tokenExpiry } }
        );

        const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
        const message = `You have requested a password reset for your account. Please click on the following link to reset your password: ${resetUrl}`;
        // Implement logic to send the password reset email with the message
      },
    }),
  ],

});
