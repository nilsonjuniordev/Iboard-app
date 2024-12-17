import { GlobalWorkerOptions } from 'pdfjs-dist';

// Defina o workerSrc para o worker do PDF.js
GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
