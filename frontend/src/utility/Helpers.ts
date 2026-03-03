

export function nowAsDateTimeLocal(): string {
    const d = new Date();
    d.setSeconds(0, 0);
    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

export function nowAsDate(): string {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    return `${yyyy}-${mm}-${dd}`;
}

export function nowAsTime(): string {
    const d = new Date();
    d.setSeconds(0, 0);
    d.setMonth(0, 0);
    d.setFullYear(0, 0);
    const pad = (n: number) => String(n).padStart(2, "0");
    const hh = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${hh}:${min}`;
}

export function dateToStartOfDayLocalDateTime(date: string): string {
    if (!date) return "";
    return `${date}T00:00`;
}

// dateInput needs to be sting of LocalDateTime(java)
export function addOneDayToDateInput(dateInput?: string): string | undefined {
    if (!dateInput) return undefined;

    const yyyyMmDd = dateInput.slice(0, 10);
    const [yStr, mStr, dStr] = yyyyMmDd.split("-");
    const y = Number(yStr);
    const m = Number(mStr);
    const d = Number(dStr);

    if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return undefined;

    const dt = new Date(y, m - 1, d);
    dt.setDate(dt.getDate() + 1);

    const pad = (n: number) => String(n).padStart(2, "0");
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
}

// dateInput needs to be string of LocalDateTime(java) e.g. "2026-03-03T14:30" (or "2026-03-03 14:30")
export function addOneHourToDateTimeInput(dateInput: string | undefined) {
    if (!dateInput) return undefined;

    // normalize " " -> "T" so both formats work
    const normalized = dateInput.replace(" ", "T");

    // take only the "yyyy-MM-ddTHH:mm" part (ignore seconds if present)
    const core = normalized.slice(0, 16);

    const yyyyMmDd = core.slice(0, 10);
    const hhMm = core.slice(11, 16);

    const [yStr, mStr, dStr] = yyyyMmDd.split("-");
    const [hStr, minStr] = hhMm.split(":");

    const y = Number(yStr);
    const m = Number(mStr);
    const d = Number(dStr);
    const h = Number(hStr);
    const min = Number(minStr);

    if (![y, m, d, h, min].every(Number.isFinite)) return undefined;

    // Local time Date; JS will handle day/month/year rollover
    const dt = new Date(y, m - 1, d, h, min, 0, 0);
    dt.setHours(dt.getHours() + 1);

    const pad = (n: number) => String(n).padStart(2, "0");
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
}

export function formatLocalDateTimeToDMonY(input?: string): string {
    if (!input) return "";

    const yyyyMmDd = input.slice(0, 10);
    const [yStr, mStr, dStr] = yyyyMmDd.split("-");
    const y = Number(yStr);
    const m = Number(mStr);
    const d = Number(dStr);

    if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return "";

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = months[m - 1];
    if (!monthName) return "";

    return `${d} ${monthName} ${y}`;
}

export function formatLocalDateTimeToHHmm(input?: string): string {
    if (!input) return "";

    const timePart = input.includes("T") ? input.split("T")[1] : input;

    const hh = timePart.slice(0, 2);
    const mm = timePart.slice(3, 5);

    if (hh.length !== 2 || mm.length !== 2) return "";

    return `${hh}:${mm} h`;
}

export function hasSameDate(a?: string, b?: string): boolean {
    if (!a || !b) return false;

    const dateA = a.slice(0, 10); // "YYYY-MM-DD"
    const dateB = b.slice(0, 10);

    // quick sanity check
    if (dateA.length !== 10 || dateB.length !== 10) return false;

    return dateA === dateB;
}