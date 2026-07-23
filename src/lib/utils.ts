// Business Logic Utilities

export function getDeadlineDate(startDate: string | Date, delayDays: number = 20): Date {
  const date = new Date(startDate);
  let daysAdded = 0;

  while (daysAdded < delayDays) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    // Exclude Friday (5) and Saturday (6) - standard Bangladesh weekend
    if (day !== 5 && day !== 6) {
      daysAdded++;
    }
  }
  return date;
}

export function validateTerritoryAccess(userAreaCode: string, customerCode: string): boolean {
  // If user is Admin, they have access to all
  if (userAreaCode === 'ADMIN') return true;
  
  // The logic previously checked the first character of Customer Code against the Area Code array.
  // Example: Area Code "D,S" and Customer Code "S-12345" -> True
  const firstChar = customerCode.charAt(0).toUpperCase();
  const allowedAreas = userAreaCode.split(',').map(code => code.trim().toUpperCase());
  
  return allowedAreas.includes(firstChar);
}

export function formatWorkingDaysRemaining(submissionDate: Date): { days: number; status: 'Normal' | 'Warning' | 'Critical' | 'Overdue' } {
  const deadline = getDeadlineDate(submissionDate);
  const now = new Date();
  
  let daysRemaining = 0;
  let tempDate = new Date(now);

  // If already past deadline
  if (now > deadline) {
    return { days: 0, status: 'Overdue' };
  }

  while (tempDate < deadline) {
    tempDate.setDate(tempDate.getDate() + 1);
    const day = tempDate.getDay();
    if (day !== 5 && day !== 6) {
      daysRemaining++;
    }
  }

  let status: 'Normal' | 'Warning' | 'Critical' | 'Overdue' = 'Normal';
  if (daysRemaining <= 5) status = 'Critical';
  else if (daysRemaining <= 10) status = 'Warning';

  return { days: daysRemaining, status };
}
