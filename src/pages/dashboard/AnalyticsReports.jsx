import { useState } from 'react';
import { FileDown, FileSpreadsheet, FileText } from 'lucide-react';
import api from '../../api/axios';

const REPORT_TYPES = [
  { id: 'batch_performance', label: 'Batch Performance & Mortality Report' },
  { id: 'sales', label: 'Sales & Customer Receivables Report' },
  { id: 'expenses', label: 'Farm Expense Ledger Report' },
];

export default function AnalyticsReports() {
  const [downloading, setDownloading] = useState('');

  const handleDownload = async (type, format) => {
    setDownloading(`${type}_${format}`);
    try {
      const response = await api.get(`/reports/export?type=${type}&format=${format}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `poultrypro_${type}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } finally {
      setDownloading('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-dark">Analytics & Exportable Reports</h1>
        <p className="text-sm text-gray-500">Download formatted PDF, Excel (.xlsx), or CSV reports for your records or bank financing.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {REPORT_TYPES.map((rep) => (
          <div key={rep.id} className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-brand-dark">{rep.label}</h3>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={() => handleDownload(rep.id, 'pdf')}
                disabled={Boolean(downloading)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700"
              >
                <FileText className="h-3.5 w-3.5" /> PDF
              </button>
              <button
                onClick={() => handleDownload(rep.id, 'xlsx')}
                disabled={Boolean(downloading)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-primary px-3 py-2 text-xs font-bold text-white hover:bg-brand-dark"
              >
                <FileSpreadsheet className="h-3.5 w-3.5" /> Excel
              </button>
              <button
                onClick={() => handleDownload(rep.id, 'csv')}
                disabled={Boolean(downloading)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gray-800 px-3 py-2 text-xs font-bold text-white hover:bg-gray-900"
              >
                <FileDown className="h-3.5 w-3.5" /> CSV
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}