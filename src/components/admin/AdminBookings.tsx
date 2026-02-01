
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Clock,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Search,
  Filter,
  Globe,
  Smartphone,
  Trash2,
} from "lucide-react";
import { BookingRow, BookingStatus } from "@/lib/types";
import { parseBookingNotes } from "@/lib/utils";
import { bookingStatusLabels, bookingStatusColors } from "@/lib/constants";

interface AdminBookingsProps {
  bookings: BookingRow[];
  isLoading: boolean;
  onStatusChange: (id: string, status: BookingStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const statusConfig: Record<BookingStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending: {
    label: bookingStatusLabels.pending,
    color: bookingStatusColors.pending,
    icon: <Clock className="w-3 h-3 mr-1" />,
  },
  confirmed: {
    label: bookingStatusLabels.confirmed,
    color: bookingStatusColors.confirmed,
    icon: <CheckCircle2 className="w-3 h-3 mr-1" />,
  },
  canceled: {
    label: bookingStatusLabels.canceled,
    color: bookingStatusColors.canceled,
    icon: <XCircle className="w-3 h-3 mr-1" />,
  },
  attended: {
    label: bookingStatusLabels.attended,
    color: bookingStatusColors.attended,
    icon: <CheckCircle2 className="w-3 h-3 mr-1" />,
  },
};

export function AdminBookings({ bookings, isLoading, onStatusChange, onDelete }: AdminBookingsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<BookingRow | null>(null);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone.includes(searchTerm) ||
      (booking.email && booking.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;

    let matchesDate = true;
    if (dateFrom) {
      matchesDate = matchesDate && new Date(booking.created_at) >= new Date(dateFrom);
    }
    if (dateTo) {
      // Add one day to include the end date fully
      const endDate = new Date(dateTo);
      endDate.setDate(endDate.getDate() + 1);
      matchesDate = matchesDate && new Date(booking.created_at) < endDate;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card/40 backdrop-blur-sm p-4 rounded-xl border border-white/5 shadow-sm shadow-black/10">
        <div className="relative w-full md:w-80 lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Пошук за ім'ям, телефоном або email..."
            className="pl-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select
            value={statusFilter}
            onValueChange={v => setStatusFilter(v as BookingStatus | "all")}
          >
            <SelectTrigger className="w-[150px] lg:w-[180px]">
              <SelectValue placeholder="Всі статуси" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Всі статуси</SelectItem>
              <SelectItem value="pending">В очікуванні</SelectItem>
              <SelectItem value="confirmed">Підтверджено</SelectItem>
              <SelectItem value="canceled">Скасовано</SelectItem>
              <SelectItem value="attended">Відвідано</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="w-[130px]"
            placeholder="Від"
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="w-[130px]"
            placeholder="До"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/10 overflow-hidden bg-card/50">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[250px]">Клієнт</TableHead>
              <TableHead>Контакти</TableHead>
              <TableHead>Деталі / Примітки</TableHead>
              <TableHead>Дата створення</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Дії</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  Завантаження...
                </TableCell>
              </TableRow>
            ) : filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  Записів не знайдено
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map(booking => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs relative">
                        {booking.name.slice(0, 2).toUpperCase()}
                        {parseBookingNotes(booking.notes).source ? (
                          <div
                            className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 border border-background"
                            title="З сайту"
                          >
                            <Globe className="w-3 h-3 text-white" />
                          </div>
                        ) : (
                          <div
                            className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 border border-background"
                            title="З кабінету"
                          >
                            <Smartphone className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p>{booking.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <a href={`tel:${booking.phone}`} className="hover:text-primary transition-colors">
                        {booking.phone}
                      </a>
                      {booking.email && (
                        <span className="text-muted-foreground text-xs">{booking.email}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] text-sm text-muted-foreground truncate">
                      {booking.notes || "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span>
                        {new Date(booking.created_at).toLocaleDateString("uk-UA", {
                          day: "numeric",
                          month: "long",
                        })}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(booking.created_at).toLocaleTimeString("uk-UA", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusConfig[booking.status].color}>
                      {statusConfig[booking.status].icon}
                      {statusConfig[booking.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedBooking(booking)}>
                          Деталі
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => void onStatusChange(booking.id, "confirmed")}
                        >
                          Підтвердити
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => void onStatusChange(booking.id, "attended")}
                        >
                          Відзначити відвідування
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => void onStatusChange(booking.id, "canceled")}
                          className="text-red-500 focus:text-red-500"
                        >
                          Скасувати
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => void onDelete(booking.id)}
                          className="text-red-500 focus:text-red-500"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Видалити
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedBooking} onOpenChange={open => !open && setSelectedBooking(null)}>
        <DialogContent className="max-w-lg">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle>Деталі бронювання</DialogTitle>
                <DialogDescription>
                  Створено{" "}
                  {new Date(selectedBooking.created_at).toLocaleString("uk-UA", {
                    day: "numeric",
                    month: "long",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Імʼя</p>
                    <p className="font-medium">{selectedBooking.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Телефон</p>
                    <p className="font-medium">{selectedBooking.phone}</p>
                  </div>
                  {selectedBooking.email && (
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedBooking.email}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground">Статус</p>
                    <Badge variant="outline" className={statusConfig[selectedBooking.status].color}>
                      {statusConfig[selectedBooking.status].icon}
                      {statusConfig[selectedBooking.status].label}
                    </Badge>
                  </div>
                </div>
                {(() => {
                  const details = parseBookingNotes(selectedBooking.notes);
                  return (
                    <div className="space-y-2">
                      {details.comment && (
                        <div>
                          <p className="text-muted-foreground">Коментар</p>
                          <p className="font-medium whitespace-pre-line">{details.comment}</p>
                        </div>
                      )}
                      {details.direction && (
                        <div>
                          <p className="text-muted-foreground">Напрямок</p>
                          <p className="font-medium">{details.direction}</p>
                        </div>
                      )}
                      {details.format && (
                        <div>
                          <p className="text-muted-foreground">Формат</p>
                          <p className="font-medium">{details.format}</p>
                        </div>
                      )}
                      {details.trainer && (
                        <div>
                          <p className="text-muted-foreground">Тренер</p>
                          <p className="font-medium">{details.trainer}</p>
                        </div>
                      )}
                      {details.time && (
                        <div>
                          <p className="text-muted-foreground">Час</p>
                          <p className="font-medium">{details.time}</p>
                        </div>
                      )}
                      {details.source && (
                        <div>
                          <p className="text-muted-foreground">Джерело</p>
                          <p className="font-medium">{details.source}</p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
