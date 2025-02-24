import { getFileIcon } from './icon';

describe('getFileIcon', () => {
  it('should return correct icon for pdf files', () => {
    expect(getFileIcon('test.pdf')).toBe('file/fill/pdf');
    expect(getFileIcon('my.document.PDF')).toBe('file/fill/pdf');
  });

  it('should return correct icon for ppt files', () => {
    expect(getFileIcon('presentation.ppt')).toBe('file/fill/ppt');
    expect(getFileIcon('slides.PPT')).toBe('file/fill/ppt');
  });

  it('should return correct icon for excel files', () => {
    expect(getFileIcon('data.xlsx')).toBe('file/fill/xlsx');
    expect(getFileIcon('spreadsheet.XLSX')).toBe('file/fill/xlsx');
  });

  it('should return correct icon for csv files', () => {
    expect(getFileIcon('data.csv')).toBe('file/fill/csv');
    expect(getFileIcon('export.CSV')).toBe('file/fill/csv');
  });

  it('should return correct icon for doc files', () => {
    expect(getFileIcon('document.doc')).toBe('file/fill/doc');
    expect(getFileIcon('file.docs')).toBe('file/fill/doc');
    expect(getFileIcon('text.DOC')).toBe('file/fill/doc');
  });

  it('should return correct icon for txt files', () => {
    expect(getFileIcon('notes.txt')).toBe('file/fill/txt');
    expect(getFileIcon('readme.TXT')).toBe('file/fill/txt');
  });

  it('should return correct icon for markdown files', () => {
    expect(getFileIcon('readme.md')).toBe('file/fill/markdown');
    expect(getFileIcon('docs.MD')).toBe('file/fill/markdown');
  });

  it('should return correct icon for html files', () => {
    expect(getFileIcon('index.html')).toBe('file/fill/html');
    expect(getFileIcon('page.HTML')).toBe('file/fill/html');
  });

  it('should return default icon for unknown file types', () => {
    expect(getFileIcon('image.jpg')).toBe('file/fill/file');
    expect(getFileIcon('archive.zip')).toBe('file/fill/file');
    expect(getFileIcon('script.js')).toBe('file/fill/file');
  });

  it('should handle empty filename', () => {
    expect(getFileIcon()).toBe('file/fill/file');
    expect(getFileIcon('')).toBe('file/fill/file');
  });

  it('should use custom default icon when provided', () => {
    expect(getFileIcon('unknown.xyz', 'custom/icon')).toBe('custom/icon');
  });

  it('should handle filenames with multiple dots', () => {
    expect(getFileIcon('my.backup.pdf')).toBe('file/fill/pdf');
    expect(getFileIcon('archive.tar.gz')).toBe('file/fill/file');
  });
});
