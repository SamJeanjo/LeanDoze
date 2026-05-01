import { SignUp } from "@clerk/nextjs";
import { Logo } from "@/components/brand/Logo";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-6 py-12">
      <section className="grid gap-8">
        <div className="flex justify-center">
          <Logo variant="full" theme="light" size="md" priority />
        </div>
        <SignUp forceRedirectUrl="/app" fallbackRedirectUrl="/app" />
      </section>
    </main>
  );
}
