'use client';

import { useState, useCallback } from 'react';
import { PageHeader } from '@/components/layout';
import { Card, Button, Badge } from '@/components/ui';
import { sriLankanBanks } from '@/lib/utils';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  FileSpreadsheet,
  File,
  HelpCircle,
} from 'lucide-react';

type ImportStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

interface ImportResult {
  totalRows: number;
  imported: number;
  skipped: number;
  errors: string[];
}

export default function ImportPage() {
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ImportStatus>('idle');
  const [result, setResult] = useState<ImportResult | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.pdf'))) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleImport = async () => {
    if (!file || !selectedBank) return;

    setStatus('uploading');

    // Simulate upload and processing
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus('processing');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock result
    setResult({
      totalRows: 47,
      imported: 42,
      skipped: 5,
      errors: ['Row 12: Invalid date format', 'Row 23: Missing amount', 'Row 31: Duplicate transaction'],
    });
    setStatus('success');
  };

  const resetImport = () => {
    setFile(null);
    setSelectedBank(null);
    setStatus('idle');
    setResult(null);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="Import Transactions"
        subtitle="Upload bank statements to auto-import transactions"
      />

      {/* Step 1: Select Bank */}
      <Card className="mb-6" padding={false}>
        <div className="card-header">
          <h3 className="font-semibold text-stone-900">Step 1: Select Your Bank</h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {sriLankanBanks.slice(0, 10).map((bank) => (
              <button
                key={bank.id}
                onClick={() => setSelectedBank(bank.id)}
                className={`p-3 rounded-xl border-2 transition-all duration-150 ${
                  selectedBank === bank.id
                    ? 'border-cinnamon-500 bg-cinnamon-50'
                    : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-stone-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-stone-600">{bank.code}</span>
                </div>
                <p className="text-xs text-stone-600 text-center line-clamp-2">{bank.name}</p>
              </button>
            ))}
          </div>
          <button className="mt-4 text-sm text-cinnamon-600 hover:text-cinnamon-700 font-medium">
            Show all 15 banks
          </button>
        </div>
      </Card>

      {/* Step 2: Upload File */}
      <Card className="mb-6" padding={false}>
        <div className="card-header">
          <h3 className="font-semibold text-stone-900">Step 2: Upload Statement</h3>
        </div>
        <div className="p-5">
          {!file ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragOver
                  ? 'border-cinnamon-500 bg-cinnamon-50'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
                <Upload size={24} className="text-stone-400" />
              </div>
              <p className="text-stone-900 font-medium mb-1">
                Drop your file here or{' '}
                <label className="text-cinnamon-600 hover:text-cinnamon-700 cursor-pointer">
                  browse
                  <input
                    type="file"
                    accept=".csv,.pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </p>
              <p className="text-sm text-stone-500">Supports CSV and PDF formats</p>
            </div>
          ) : (
            <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-white border border-stone-200 flex items-center justify-center">
                {file.name.endsWith('.csv') ? (
                  <FileSpreadsheet size={24} className="text-tea-600" />
                ) : (
                  <File size={24} className="text-red-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-stone-900 truncate">{file.name}</p>
                <p className="text-sm text-stone-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={() => setFile(null)}
                className="p-2 hover:bg-stone-200 rounded-lg transition-colors"
              >
                <X size={18} className="text-stone-500" />
              </button>
            </div>
          )}

          <div className="mt-4 p-4 bg-ocean-50 rounded-xl">
            <div className="flex items-start gap-3">
              <HelpCircle size={18} className="text-ocean-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-ocean-900 mb-1">How to get your statement</p>
                <ol className="text-ocean-700 space-y-1 list-decimal list-inside">
                  <li>Log in to your bank&apos;s internet banking</li>
                  <li>Go to Statements or Transaction History</li>
                  <li>Select date range and download as CSV or PDF</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Import Button & Status */}
      {status === 'idle' && (
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          disabled={!file || !selectedBank}
          onClick={handleImport}
        >
          <Upload size={18} />
          Import Transactions
        </Button>
      )}

      {(status === 'uploading' || status === 'processing') && (
        <Card padding className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cinnamon-100 flex items-center justify-center animate-pulse">
            <FileText size={24} className="text-cinnamon-600" />
          </div>
          <p className="font-medium text-stone-900 mb-1">
            {status === 'uploading' ? 'Uploading file...' : 'Processing transactions...'}
          </p>
          <p className="text-sm text-stone-500">This may take a moment</p>
          <div className="mt-4 h-2 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-cinnamon-500 rounded-full transition-all duration-500"
              style={{ width: status === 'uploading' ? '30%' : '70%' }}
            />
          </div>
        </Card>
      )}

      {status === 'success' && result && (
        <Card padding>
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-tea-100 flex items-center justify-center">
              <CheckCircle2 size={32} className="text-tea-600" />
            </div>
            <h3 className="text-lg font-semibold text-stone-900 mb-1">Import Complete!</h3>
            <p className="text-stone-500">Your transactions have been imported</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-stone-50 rounded-xl">
              <p className="font-mono text-2xl font-bold text-stone-900">{result.totalRows}</p>
              <p className="text-sm text-stone-500">Total Rows</p>
            </div>
            <div className="text-center p-4 bg-tea-50 rounded-xl">
              <p className="font-mono text-2xl font-bold text-tea-600">{result.imported}</p>
              <p className="text-sm text-stone-500">Imported</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-xl">
              <p className="font-mono text-2xl font-bold text-amber-600">{result.skipped}</p>
              <p className="text-sm text-stone-500">Skipped</p>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-stone-700 mb-2 flex items-center gap-2">
                <AlertCircle size={14} className="text-amber-500" />
                Skipped rows
              </p>
              <div className="space-y-2">
                {result.errors.map((error, idx) => (
                  <div key={idx} className="text-sm text-stone-600 p-2 bg-stone-50 rounded">
                    {error}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={resetImport}>
              Import More
            </Button>
            <Button variant="primary" className="flex-1" onClick={() => window.location.href = '/dashboard/transactions'}>
              View Transactions
            </Button>
          </div>
        </Card>
      )}

      {/* Supported Banks Info */}
      <Card className="mt-6" padding>
        <h3 className="font-semibold text-stone-900 mb-3">Supported Banks</h3>
        <div className="flex flex-wrap gap-2">
          {sriLankanBanks.map((bank) => (
            <Badge key={bank.id} variant="default">
              {bank.name}
            </Badge>
          ))}
        </div>
        <p className="text-sm text-stone-500 mt-4">
          Your data stays on your device. We never store your bank credentials.
        </p>
      </Card>
    </div>
  );
}
