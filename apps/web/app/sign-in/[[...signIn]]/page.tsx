import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <main style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
      <SignIn />
    </main>
  );
}