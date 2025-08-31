import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      {/* Desktop layout with sidebar */}
      <div className="hidden lg:flex lg:flex-1 lg:overflow-y-auto">
        <div className="p-8 w-full">
          <div className="mx-auto max-w-6xl">{children}</div>
        </div>
      </div>

      {/* Mobile/Tablet layout with top padding for header and bottom padding for nav */}
      <div className="lg:hidden flex-1 overflow-y-auto">
        <div className="pt-16 pb-20 px-4">
          <div className="mx-auto max-w-6xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
