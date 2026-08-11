export const downloadTextFile = (filename: string, content: string, type = 'application/json'): void => {
  if (typeof document === 'undefined') return;

  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  link.click();
  URL.revokeObjectURL(url);
};
