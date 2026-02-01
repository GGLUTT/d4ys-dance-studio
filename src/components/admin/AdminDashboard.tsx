import { Card, CardContent } from "@/components/ui/card";
import { BookingRow } from "@/lib/types";

interface AdminDashboardProps {
  bookings: BookingRow[];
}

export const AdminDashboard = ({ bookings }: AdminDashboardProps) => {
  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    canceled: bookings.filter(b => b.status === "canceled").length,
    attended: bookings.filter(b => b.status === "attended").length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-primary/5 border-primary/20 shadow-md shadow-primary/5">
        <CardContent className="p-6">
          <p className="text-sm font-medium text-primary">Всього бронювань</p>
          <p className="text-3xl font-bold mt-2 text-primary">{stats.total}</p>
        </CardContent>
      </Card>
      <Card className="bg-emerald-500/5 border-emerald-500/25 shadow-md shadow-emerald-500/10">
        <CardContent className="p-6">
          <p className="text-sm font-medium text-emerald-500">Підтверджено</p>
          <p className="text-3xl font-bold mt-2 text-emerald-500">{stats.confirmed}</p>
        </CardContent>
      </Card>
      <Card className="bg-red-500/5 border-red-500/25 shadow-md shadow-red-500/10">
        <CardContent className="p-6">
          <p className="text-sm font-medium text-red-500">Скасовано</p>
          <p className="text-3xl font-bold mt-2 text-red-500">{stats.canceled}</p>
        </CardContent>
      </Card>
      <Card className="bg-blue-500/5 border-blue-500/25 shadow-md shadow-blue-500/10">
        <CardContent className="p-6">
          <p className="text-sm font-medium text-blue-500">Відвідано</p>
          <p className="text-3xl font-bold mt-2 text-blue-500">{stats.attended}</p>
        </CardContent>
      </Card>
    </div>
  );
};
