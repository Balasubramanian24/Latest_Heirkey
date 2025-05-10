import Header from './Header';

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <Header />
      <main className="pt-20">
        {children}
      </main>
    </div>
  );
}