import AppHeader from './AppHeader';
import SubHeader from './SubHeader';

export default function WebLayout({ children, subHeaderTitle }: { children: React.ReactNode, subHeaderTitle?: string }) {
  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <AppHeader />
      {subHeaderTitle && <SubHeader title={subHeaderTitle} />}
      <main className="pt-20">
        {children}
      </main>
    </div>
  );
}