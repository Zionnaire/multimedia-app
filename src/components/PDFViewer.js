import React from 'react';
import { Document, Page } from 'react-pdf';

export const PDFViewer = ({ path }) => {
  return (
    <div>
      <Document file={path}>
        <Page pageNumber={1} />
      </Document>
    </div>
  );
};
