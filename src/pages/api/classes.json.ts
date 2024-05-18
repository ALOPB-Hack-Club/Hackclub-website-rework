interface Zaj {
  start: Date;
  name: string;
}

function generateEvents(): Zaj[] {
  const events: Zaj[] = [];
  const startDate = new Date(2024, 2, 1);
  const endDate = new Date(2025, 11, 31);

  startDate.setDate(startDate.getDate() + ((2 + 7 - startDate.getDay()) % 7));

  while (startDate <= endDate) {
    const month = startDate.getMonth();
    if (month !== 5 && month !== 6 && month !== 7 && month !== 8) {
      startDate.setHours(15, 5, 0, 0);
      const eventDate = new Date(startDate);
      events.push({ start: eventDate, name: "Zajęcia Hackclub "+eventDate.getDate()+"."+(eventDate.getMonth() + 1).toString().padStart(2, '0')+"."+eventDate.getFullYear() });
    }
    startDate.setDate(startDate.getDate() + 7);
  }

  return events;
}

const zajecia = generateEvents();
export async function GET({ params }: any) {
  return new Response(JSON.stringify(zajecia));
}
