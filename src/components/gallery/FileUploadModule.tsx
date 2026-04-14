import React, { useState, useRef } from 'react';
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as pdfjsLib from 'pdfjs-dist';
import { generateContent } from '@/services/geminiService';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface FileUploadModuleProps {
  onDataExtracted: (text: string) => void;
}

export default function FileUploadModule({ onDataExtracted }: FileUploadModuleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n\n';
    }
    
    return fullText;
  };

  const extractTextFromTxt = async (file: File): Promise<string> => {
    return await file.text();
  };

  const processFile = async (selectedFile: File) => {
    setError(null);
    setFile(selectedFile);
    setIsProcessing(true);

    try {
      let text = '';
      if (selectedFile.type === 'application/pdf') {
        text = await extractTextFromPdf(selectedFile);
      } else if (selectedFile.type === 'text/plain') {
        text = await extractTextFromTxt(selectedFile);
      } else {
        throw new Error('지원하지 않는 파일 형식입니다. PDF 또는 TXT 파일을 업로드해주세요.');
      }

      if (!text.trim()) {
        throw new Error('파일에서 텍스트를 추출할 수 없습니다.');
      }

      // Pass the extracted text up to the parent component
      onDataExtracted(text);
      
    } catch (err) {
      console.error('File processing error:', err);
      setError(err instanceof Error ? err.message : '파일 처리 중 오류가 발생했습니다.');
      setFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-display uppercase">학습 자료 업로드</h2>
        <p className="text-sm font-bold text-gray-500">PDF 또는 TXT 파일을 업로드하면 AI가 맞춤형 커리큘럼을 생성합니다.</p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "border-4 border-dashed p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all",
          isDragging ? "border-neon-blue bg-neon-blue/5" : "border-brutal-black bg-white hover:bg-gray-50",
          isProcessing ? "opacity-50 pointer-events-none" : ""
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.txt"
          className="hidden"
        />
        
        {isProcessing ? (
          <div className="space-y-4 flex flex-col items-center">
            <Loader2 size={48} className="animate-spin text-neon-blue" />
            <div className="text-lg font-display uppercase">AI 분석 중...</div>
            <p className="text-xs font-bold text-gray-500">파일의 텍스트를 추출하고 지식 그래프를 구성하고 있습니다.</p>
          </div>
        ) : file && !error ? (
          <div className="space-y-4 flex flex-col items-center">
            <CheckCircle2 size={48} className="text-neon-green" />
            <div className="text-lg font-display uppercase">{file.name}</div>
            <p className="text-xs font-bold text-neon-green">성공적으로 업로드되었습니다.</p>
          </div>
        ) : (
          <div className="space-y-4 flex flex-col items-center">
            <Upload size={48} className={isDragging ? "text-neon-blue" : "text-brutal-black"} />
            <div className="text-lg font-display uppercase">클릭하거나 파일을 드래그 앤 드롭하세요</div>
            <p className="text-xs font-bold text-gray-500">지원 형식: PDF, TXT (최대 10MB 권장)</p>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-neon-pink/10 border-l-4 border-neon-pink flex items-start gap-3">
          <AlertCircle size={20} className="text-neon-pink shrink-0" />
          <p className="text-sm font-bold text-neon-pink">{error}</p>
        </div>
      )}
    </div>
  );
}
