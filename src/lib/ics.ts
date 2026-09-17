import { parseISO, format } from 'date-fns';
import type { CalendarDose } from '../types';

function pad(line: string): string {
  // iCal 规范：每行超过 75 字符需折行（插入 CRLF + 空格）
  if (line.length <= 73) return line;
  return line.slice(0, 73) + '\r\n ' + pad(line.slice(73));
}

/** 把未完成的接种日程导出为 .ics（苹果日历/谷歌日历/Outlook 均可订阅导入） */
export function exportCalendarICS(doses: CalendarDose[], childName: string): void {
  const events = doses
    .filter((d) => d.status !== 'done')
    .map((d, i) => {
      const date = format(parseISO(d.dueDate), 'yyyyMMdd');
      const summary = `苗懂提醒：${d.shortName} 第${d.doseIndex}剂${d.reminder ? '（年度）' : ''}`;
      const description = [
        `${d.vaccineName} · ${d.ageLabel}`,
        d.category === 'nip' ? '一类免疫规划疫苗（免费）' : '二类自费疫苗',
        d.coScheduled?.length ? `可与「${d.coScheduled.join('、')}」同日接种（不同部位）` : '',
        '具体接种时间与疫苗供应以接种门诊安排为准。',
      ].filter(Boolean).join('\\n');
      return [
        'BEGIN:VEVENT',
        `UID:miodon-${i}-${d.vaccineId}-${d.doseIndex}@miodon`,
        `DTSTAMP:${format(new Date(), "yyyyMMdd'T'HHmmss'Z'")}`,
        `DTSTART;VALUE=DATE:${date}`,
        `DTEND;VALUE=DATE:${date}`,
        pad(`SUMMARY:${summary}`),
        pad(`DESCRIPTION:${description}`),
        'BEGIN:VALARM',
        'TRIGGER:-P1D',
        'ACTION:DISPLAY',
        pad(`DESCRIPTION:明天：${summary}`),
        'END:VALARM',
        'END:VEVENT',
      ].join('\r\n');
    })
    .join('\r\n');

  const cal = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Miodon//Vaccine Calendar//CN',
    'CALSCALE:GREGORIAN',
    pad(`X-WR-CALNAME:${childName}的疫苗接种日历（苗懂）`),
    events,
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([cal], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `miodon-${childName}-疫苗日历.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
