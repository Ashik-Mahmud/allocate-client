import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata = {
  title: "Sign Up for a New Account",
  description: "Create a new account to access exclusive features and personalized content.",
};
export default function SignUpPage() {
  return <SignUpForm />;
}
