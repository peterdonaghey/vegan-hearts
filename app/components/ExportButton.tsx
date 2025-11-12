'use client';

import { Download } from 'lucide-react';

interface Subscriber {
  email: string;
  name?: string;
  source: string;
  signupDate: string;
  unsubscribed: boolean;
}

interface ExportButtonProps {
  subscribers: Subscriber[];
}

export default function ExportButton({ subscribers }: ExportButtonProps) {
  const handleExport = () => {
    // Create CSV content
    const headers = ['Email', 'Name', 'Source', 'Signup Date', 'Status'];
    const rows = subscribers.map((sub) => [
      sub.email,
      sub.name || '',
      sub.source,
      new Date(sub.signupDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      sub.unsubscribed ? 'Unsubscribed' : 'Active',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${cell.toString().replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const timestamp = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `veganhearts-subscribers-${timestamp}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-vh-orange text-white rounded-lg hover:bg-vh-orange/90 transition-colors flex items-center gap-2 font-medium"
    >
      <Download className="h-4 w-4" />
      Export CSV
    </button>
  );
}

