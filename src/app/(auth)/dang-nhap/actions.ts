"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { error: "Email hoặc mật khẩu không đúng." };
      }
      return { error: "Đăng nhập thất bại. Vui lòng thử lại." };
    }
    throw error;
  }

  const session = await auth();
  const role = session?.user?.role;
  if (role === "ADMIN") redirect("/dashboard/admin");
  if (role === "EMPLOYER") redirect("/dashboard/employer");
  redirect("/");
}
