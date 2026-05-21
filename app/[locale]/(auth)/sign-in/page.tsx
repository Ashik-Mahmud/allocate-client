import SignInForm from "@/components/auth/sign-in-form";

export const metadata = {
  title: "Sign In to Your Account",
  description: "Sign in to your account to access exclusive features and personalized content.",
};

export default function SignInPage() {
  return (
    <div >
     <SignInForm />
    </div>
  );
}
