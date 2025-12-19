type ClassValue = string | number | boolean | undefined | null | ClassValue[] | { [key: string]: any };

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];
  
  inputs.forEach((input) => {
    if (!input) return;
    
    if (typeof input === 'string') {
      classes.push(input);
    } else if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) classes.push(nested);
    } else if (typeof input === 'object') {
      Object.entries(input).forEach(([key, value]) => {
        if (value) classes.push(key);
      });
    }
  });
  
  // Simple deduplication by converting to Set and back
  return Array.from(new Set(classes.join(' ').split(' '))).join(' ');
}
