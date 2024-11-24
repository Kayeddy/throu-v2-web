"use client";

import React, { useEffect, useRef } from "react";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";

export default function PdfViewer({ pdfUrl }: { pdfUrl: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const renderPdf = async () => {
      // Dynamically import pdfjs-dist and configure the workerSrc
      const pdfjs = await import("pdfjs-dist");
      GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

      try {
        const loadingTask = getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1); // Render the first page

        const canvas = canvasRef.current;
        if (canvas) {
          const context = canvas.getContext("2d");
          const viewport = page.getViewport({ scale: 1.5 });
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context!,
            viewport,
          };
          await page.render(renderContext).promise;
        }
      } catch (error) {
        console.error("Error rendering PDF:", error);
      }
    };

    renderPdf();
  }, [pdfUrl]); // Added pdfUrl as a dependency to refetch if the URL changes

  return (
    <div style={{ textAlign: "center" }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
