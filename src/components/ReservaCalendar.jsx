import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { eachDayOfInterval, parseISO } from 'date-fns';
import 'react-day-picker/dist/style.css';
import './ReservaCalendar.css';

/**
 * ReservaCalendar.jsx
 *
 * Calendario de selección de rango de fechas, con fechas bloqueadas por habitación.
 * Visual coherente con ReservaModal.
 */
export default function ReservaCalendar({ selected, onSelect, reservasOcupadas = [] }) {
  const [range, setRange] = useState({
    from: selected?.from || undefined,
    to: selected?.to || undefined,
  });

  const fechasBloqueadas = reservasOcupadas.flatMap((reserva) =>
    eachDayOfInterval({
      start: parseISO(reserva.from),
      end: parseISO(reserva.to),
    })
  );

  useEffect(() => {
    const fromChanged =
      selected?.from && (!range.from || selected.from.getTime() !== range.from.getTime());
    const toChanged =
      selected?.to && (!range.to || selected.to.getTime() !== range.to.getTime());

    if (fromChanged || toChanged) {
      setRange({
        from: selected?.from || undefined,
        to: selected?.to || undefined,
      });
    }
  }, [selected]);

  useEffect(() => {
    setRange({ from: undefined, to: undefined });
  }, []);

  const onDayClick = (day) => {
    if (!range.from || (range.from && range.to)) {
      setRange({ from: day, to: undefined });
      onSelect({ from: day, to: undefined });
      return;
    }

    const clickedTime = day.getTime();
    const fromTime = range.from.getTime();

    if (clickedTime < fromTime) {
      setRange({ from: day, to: undefined });
      onSelect({ from: day, to: undefined });
    } else {
      setRange({ from: range.from, to: day });
      onSelect({ from: range.from, to: day });
    }
  };

  return (
    <div className="w-full flex items-center justify-center h-full bg-white border border-gray-200 rounded-xl shadow-md p-4">
      <DayPicker
        className="custom-daypicker reservamodal"
        mode="single"
        selected={undefined}
        onDayClick={onDayClick}
        numberOfMonths={1}
        weekStartsOn={0}
        fromDate={new Date()}
        showOutsideDays
        disabled={fechasBloqueadas}
        modifiers={{
          range_start: range.from || undefined,
          range_end: range.to || undefined,
          range_middle:
            range.from &&
            range.to &&
            ((day) => {
              const time = day.getTime();
              return time > range.from.getTime() && time < range.to.getTime();
            }),
          today: new Date(),
          bloqueado: fechasBloqueadas,
        }}
        modifiersClassNames={{
          range_start: 'rdp-day_range_start',
          range_end: 'rdp-day_range_end',
          range_middle: 'rdp-day_range_middle',
          today: 'rdp-day_today',
          bloqueado: 'rdp-day_blocked',
        }}
        classNames={{
          day: 'rounded-md font-medium text-sm text-[#1f3142] hover:bg-gray-200 focus:outline-none',
          nav_button: 'rdp-nav_button',
          caption: 'rdp-caption_label font-semibold text-[#1f3142]',
          head_cell: 'text-xs text-[#1f3142] font-semibold',
        }}
      />
    </div>
  );
}