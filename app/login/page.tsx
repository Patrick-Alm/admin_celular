import { Metadata } from "next"
import { LoginForm } from "@/components/login-form"

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Login to access the admin dashboard",
}

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4 bg-gray-50">
      <LoginForm />
    </div>
  )
}
