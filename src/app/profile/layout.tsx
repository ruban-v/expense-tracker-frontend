import Sidebar from "@/components/layout/Sidebar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Mobile: Add top padding for fixed header, bottom padding for bottom nav */}
        {/* Desktop: Standard padding */}
        <div className="pt-16 pb-20 px-4 lg:pt-8 lg:pb-8 lg:px-8">
          <div className="mx-auto max-w-4xl lg:max-w-6xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
