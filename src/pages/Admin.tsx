import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Users,
  Calendar,
  BarChart3,
  LogOut,
  Loader2,
  Lock,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { AdminPricing } from "@/components/admin/AdminPricing";
import { AdminSchedule } from "@/components/admin/AdminSchedule";
import { AdminBookings } from "@/components/admin/AdminBookings";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";
import { BookingRow, BookingStatus } from "@/lib/types";

const Admin = () => {
  const { session, signIn, signOut, isLoading: authLoading, isAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  // Stats for the top cards
  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    canceled: bookings.filter(b => b.status === "canceled").length,
    attended: bookings.filter(b => b.status === "attended").length,
  };

  useEffect(() => {
    if (session) {
      void loadBookings();

      if (!supabase) return;

      const bookingsChannel = supabase
        .channel("admin-bookings")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookings",
          }, 
          () => {
            void loadBookings();
            toast.info("Список бронювань оновлено");
          },
        )
        .subscribe();

      return () => {
        void supabase.removeChannel(bookingsChannel);
      };
    }
  }, [session]);

  const loadBookings = async () => {
    if (!supabase) return;
    setIsLoadingBookings(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading bookings:", error);
      toast.error("Не вдалося завантажити бронювання");
    } else {
      setBookings((data as BookingRow[]) || []);
    }
    setIsLoadingBookings(false);
  };

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    if (!supabase) return;
    
    // Optimistic update
    const previousBookings = [...bookings];
    setBookings(prev => prev.map(b => (b.id === id ? { ...b, status } : b)));

    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);

    if (error) {
      console.error("Error updating booking status:", error);
      toast.error("Не вдалося оновити статус");
      setBookings(previousBookings); // Revert
    } else {
      toast.success("Статус оновлено");
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!supabase) return;
    if (!confirm("Ви впевнені, що хочете видалити цей запис?")) return;

    const { error } = await supabase.from("bookings").delete().eq("id", id);

    if (error) {
      console.error("Error deleting booking:", error);
      toast.error("Не вдалося видалити запис");
    } else {
      toast.success("Запис видалено");
      // Realtime subscription will reload, but we can also update locally
      setBookings(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingAuth(true);
    const { error } = await signIn(email, password);
    setIsSubmittingAuth(false);
    if (error) {
      console.error("Auth error:", error);
      toast.error("Невірний email або пароль");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (session && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md border-red-500/20 bg-red-500/5">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 text-red-500">
              <Lock className="w-6 h-6" />
            </div>
            <CardTitle className="text-red-500">Доступ заборонено</CardTitle>
            <CardDescription>
              Ваш акаунт ({session.user.email}) не має прав адміністратора.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button 
              variant="outline" 
              onClick={() => void signOut()} 
              className="w-full hover:bg-red-500/10 hover:text-red-500 border-red-500/20"
            >
              Вийти з акаунту
            </Button>
            <Button variant="ghost" onClick={() => window.location.href = "/cabinet"} className="w-full">
              Перейти в особистий кабінет
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Адмін-панель</h1>
            <p className="text-muted-foreground">Введіть дані для входу в систему</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@d4ys.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmittingAuth}>
              {isSubmittingAuth ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Увійти
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 pb-24">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Панель керування</h1>
            <p className="text-muted-foreground mt-1">Огляд статистики та керування студією</p>
          </div>
          <Button variant="outline" onClick={() => void signOut()} className="gap-2">
            <LogOut className="w-4 h-4" />
            Вийти
          </Button>
        </div>

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

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="w-full justify-start h-auto p-1 bg-muted/50 backdrop-blur supports-[backdrop-filter]:bg-muted/50 rounded-xl overflow-x-auto flex-nowrap">
            <TabsTrigger value="bookings" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Users className="w-4 h-4" />
              Бронювання
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <BarChart3 className="w-4 h-4" />
              Аналітика
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Calendar className="w-4 h-4" />
              Налаштування
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-4">
            <AdminBookings
              bookings={bookings}
              isLoading={isLoadingBookings}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteBooking}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AdminAnalytics bookings={bookings} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AdminPricing />
              <AdminSchedule bookings={bookings} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
