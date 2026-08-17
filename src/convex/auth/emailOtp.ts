import { Email } from "@convex-dev/auth/providers/Email";

import { RandomReader, generateRandomString } from "@oslojs/crypto/random";

export const emailOtp = Email({
  id: "email-otp",
  maxAge: 60 * 15, // 15 minutes
  // This function can be asynchronous
  async generateVerificationToken() {
    const random: RandomReader = {
      read(bytes: Uint8Array) {
        crypto.getRandomValues(bytes);
      },
    };
    const alphabet = "0123456789";
    return generateRandomString(random, alphabet, 6);
  },
  async sendVerificationRequest({ identifier: email, token }) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Karriere <onboarding@resend.dev>",
          to: email,
          subject: "Sign in to Karriere",
          text: `Your sign-in code is ${token}`,
        }),
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  },
});
