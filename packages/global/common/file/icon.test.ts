import { getFileIcon, fileImgs } from './icon';

describe('getFileIcon', () => {
  it('should return correct icon for PDF file', () => {
    expect(getFileIcon('document.pdf')).toBe('file/fill/pdf');
  });

  it('should return correct icon for PPT file', () => {
    expect(getFileIcon('presentation.ppt')).toBe('file/fill/ppt');
  });

  it('should return correct icon for Excel files', () => {
    expect(getFileIcon('spreadsheet.xlsx')).toBe('file/fill/xlsx');
  });

  it('should return correct icon for CSV files', () => {
    expect(getFileIcon('data.csv')).toBe('file/fill/csv');
  });

  it('should return correct icon for DOC files', () => {
    expect(getFileIcon('document.doc')).toBe('file/fill/doc');
    expect(getFileIcon('document.docs')).toBe('file/fill/doc');
  });

  it('should return correct icon for TXT files', () => {
    expect(getFileIcon('notes.txt')).toBe('file/fill/txt');
  });

  it('should return correct icon for MD files', () => {
    expect(getFileIcon('readme.md')).toBe('file/fill/markdown');
  });

  it('should return correct icon for HTML files', () => {
    expect(getFileIcon('page.html')).toBe('file/fill/html');
  });

  it('should be case insensitive', () => {
    expect(getFileIcon('document.PDF')).toBe('file/fill/pdf');
    expect(getFileIcon('document.Pdf')).toBe('file/fill/pdf');
    expect(getFileIcon('document.pDf')).toBe('file/fill/pdf');
  });

  it('should return default icon for unknown file types', () => {
    expect(getFileIcon('image.png')).toBe('file/fill/file');
    expect(getFileIcon('archive.zip')).toBe('file/fill/file');
  });

  it('should return default icon for empty filename', () => {
    expect(getFileIcon('')).toBe('file/fill/file');
  });

  it('should accept custom default icon', () => {
    expect(getFileIcon('unknown.xyz', 'custom/icon')).toBe('custom/icon');
  });
});
