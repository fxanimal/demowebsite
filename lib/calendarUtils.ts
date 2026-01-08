// Define open days: 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri
export const OPEN_DAYS = [1, 2, 3, 4, 5]; 

export const isDayClosed = (date: Date) => {
  const day = date.getDay();
  return !OPEN_DAYS.includes(day);
};

export const generateTimeSlots = (dateString: string) => {
  const date = new Date(dateString + 'T00:00:00');
  if (isDayClosed(date)) return [];

  const slots = [];
  let current = new Date(date);
  current.setHours(9, 0, 0, 0); 
  const end = new Date(date);
  end.setHours(17, 0, 0, 0);   

  while (current < end) {
    slots.push(new Date(current).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
    current.setHours(current.getHours() + 1);
  }
  return slots;
};