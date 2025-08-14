import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-white">
      <Sidebar />
      <div className="flex-1 h-screen overflow-y-auto">
        <div className="mx-auto max-w-6xl">{children}</div>
      </div>
    </div>
  );
}
