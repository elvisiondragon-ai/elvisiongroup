import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SchedulePickerProps {
  onScheduleSelect?: (date: Date, time: string) => void;
  selectedDate?: Date;
  selectedTime?: string;
}

export function SchedulePicker({ onScheduleSelect, selectedDate, selectedTime }: SchedulePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(selectedDate)
  const [time, setTime] = React.useState<string>(selectedTime || "")

  const timeSlots = [
    "06:00", "06:30", "07:00", "07:30", "08:00", "08:30",
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
    "21:00", "21:30", "22:00"
  ]

  const handleSchedule = () => {
    if (date && time && onScheduleSelect) {
      onScheduleSelect(date, time)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center font-exo">Jadwalkan Sesi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date Picker */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Pilih Tanggal</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pilih tanggal</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date()}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Picker */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Pilih Waktu</label>
          <Select value={time} onValueChange={setTime}>
            <SelectTrigger className="w-full">
              <Clock className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Pilih waktu" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((timeSlot) => (
                <SelectItem key={timeSlot} value={timeSlot}>
                  {timeSlot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Schedule Button */}
        <Button 
          onClick={handleSchedule}
          disabled={!date || !time}
          className="w-full bg-gradient-primary hover:opacity-90"
        >
          Jadwalkan Sekarang
        </Button>

        {/* Current Selection Display */}
        {date && time && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-center">
              <span className="font-medium">Terjadwal:</span><br />
              {format(date, "EEEE, dd MMMM yyyy")} pada {time}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}