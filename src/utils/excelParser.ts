import xlsx from 'xlsx';
import { IPrayerTiming } from '../types';

// Helper to format hours/minutes from date or string
const formatTime = (timeInput: any): string => {
  if (!timeInput) return '00:00';
  
  if (typeof timeInput === 'number') {
    // Excel serial time number (fraction of a day)
    const totalMinutes = Math.round(timeInput * 24 * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  const str = String(timeInput).trim();
  // Regex to check for HH:MM AM/PM format
  const ampmRegex = /(\d{1,2})[.:](\d{2})\s*(AM|PM)/i;
  const match = str.match(ampmRegex);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const ampm = match[3].toUpperCase();
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }

  // Check for 24h HH:MM format
  const hhmmRegex = /^([01]?\d|2[0-3])[.:]([0-5]\d)$/;
  const match2 = str.match(hhmmRegex);
  if (match2) {
    const hours = parseInt(match2[1], 10);
    const minutes = match2[2];
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }

  return str;
};

// Helper to add minutes to HH:MM time string
const addMinutes = (timeStr: string, minsToAdd: number): string => {
  const [h, m] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  date.setMinutes(date.getMinutes() + minsToAdd);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

export const parseExcelTimings = (buffer: Buffer): Partial<IPrayerTiming>[] => {
  const workbook = xlsx.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows: any[] = xlsx.utils.sheet_to_json(sheet);

  const parsedRecords: Partial<IPrayerTiming>[] = [];

  for (const row of rows) {
    // Find keys regardless of case
    const rowKeys = Object.keys(row);
    const getVal = (possibleNames: string[]): any => {
      const key = rowKeys.find(k => possibleNames.some(p => k.toLowerCase().trim() === p.toLowerCase()));
      return key ? row[key] : null;
    };

    let rawDate = getVal(['date', 'day']);
    if (!rawDate) continue;

    let dateStr = '';
    if (typeof rawDate === 'number') {
      // Excel serial date
      const dateObj = xlsx.SSF.parse_date_code(rawDate);
      const year = dateObj.y;
      const month = dateObj.m.toString().padStart(2, '0');
      const day = dateObj.d.toString().padStart(2, '0');
      dateStr = `${year}-${month}-${day}`;
    } else {
      const parsedDate = new Date(rawDate);
      if (!isNaN(parsedDate.getTime())) {
        const year = parsedDate.getFullYear();
        const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
        const day = parsedDate.getDate().toString().padStart(2, '0');
        dateStr = `${year}-${month}-${day}`;
      } else {
        dateStr = String(rawDate).trim();
      }
    }

    // Extract core prayer times
    const fajrStart = formatTime(getVal(['fajr', 'fajrstart', 'fajr_start']));
    const zuhrStart = formatTime(getVal(['zuhr', 'zuhrstart', 'zuhr_start']));
    const asrStart = formatTime(getVal(['asr', 'asrstart', 'asr_start']));
    const maghribStart = formatTime(getVal(['maghrib', 'maghribstart', 'maghrib_start', 'magrib']));
    const ishaStart = formatTime(getVal(['isha', 'ishastart', 'isha_start']));

    // Extract optional endpoints or calculate them
    const rawFajrEnd = getVal(['fajrend', 'fajr_end', 'sunrise', 'sun_rise']);
    const fajrEnd = rawFajrEnd ? formatTime(rawFajrEnd) : addMinutes(fajrStart, 80); // Default sunrise = Fajr + 80 mins

    const tahajjudEnd = formatTime(getVal(['tahajjudend', 'tahajjud_end', 'tahajjud'])) || fajrStart;
    const makroohStart = formatTime(getVal(['makroohstart', 'makrooh_start'])) || fajrEnd;
    const makroohEnd = formatTime(getVal(['makroohend', 'makrooh_end'])) || addMinutes(fajrEnd, 20);
    const ishraq = formatTime(getVal(['ishraq'])) || addMinutes(fajrEnd, 20); // Ishraq begins when sunrise makrooh ends
    const chasht = formatTime(getVal(['chasht'])) || addMinutes(ishraq, 70); // Chasht is usually 70 mins after Ishraq

    const zuhrEnd = formatTime(getVal(['zuhrend', 'zuhr_end'])) || asrStart;
    const asrEnd = formatTime(getVal(['asrend', 'asr_end'])) || maghribStart;
    const maghribEnd = formatTime(getVal(['maghribend', 'maghrib_end'])) || ishaStart;
    const ishaEnd = formatTime(getVal(['ishaend', 'isha_end'])) || fajrStart; // Isha ends at next Fajr

    parsedRecords.push({
      date: dateStr,
      tahajjudEnd,
      fajrStart,
      fajrEnd,
      makroohStart,
      makroohEnd,
      ishraq,
      chasht,
      zuhrStart,
      zuhrEnd,
      asrStart,
      asrEnd,
      maghribStart,
      maghribEnd,
      ishaStart,
      ishaEnd,
    });
  }

  return parsedRecords;
};
