import VerificationForm from "@/mobile/components/auth/VerificationForm";

export default function VerifyPage() {
 
  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <VerificationForm />
      </div>
    </div>
  );
}