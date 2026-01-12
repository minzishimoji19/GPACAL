import { Course } from '../types';
import { exportToJSON, importFromJSON, exportToCSV, importFromCSV } from '../utils/storage';

interface ImportExportProps {
  courses: Course[];
  onImport: (courses: Course[]) => void;
}

export default function ImportExport({ courses, onImport }: ImportExportProps) {
  const handleExportJSON = () => {
    const json = exportToJSON(courses);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gpa-courses-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const csv = exportToCSV(courses);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gpa-courses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const imported = importFromJSON(json);
        onImport(imported);
        alert(`Đã import thành công ${imported.length} môn học`);
      } catch (error) {
        alert('Lỗi khi import JSON: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string;
        const imported = importFromCSV(csv);
        onImport(imported);
        alert(`Đã import thành công ${imported.length} môn học`);
      } catch (error) {
        alert('Lỗi khi import CSV: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Import/Export</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Export</h3>
          <div className="space-y-2">
            <button
              onClick={handleExportJSON}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Export JSON
            </button>
            <button
              onClick={handleExportCSV}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Import</h3>
          <div className="space-y-2">
            <label className="block">
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
                id="import-json"
              />
              <span className="block w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-center cursor-pointer">
                Import JSON
              </span>
            </label>
            <label className="block">
              <input
                type="file"
                accept=".csv"
                onChange={handleImportCSV}
                className="hidden"
                id="import-csv"
              />
              <span className="block w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center cursor-pointer">
                Import CSV
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

