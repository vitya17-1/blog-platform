import React from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

interface MarkdownParserProps {
  markdown: string;
}

/**
 * Компонент для парсинга Markdown в HTML-разметку.
 * Использует библиотеку marked для конвертации Markdown в HTML и DOMPurify для очистки HTML от потенциально опасного кода.
 */
const MarkdownParser: React.FC<MarkdownParserProps> = ({ markdown }) => {
  // Конвертируем Markdown в HTML
  const rawHtml = marked.parse(markdown, { async: false });
  // Очищаем сгенерированный HTML для защиты от XSS
  const cleanHtml = DOMPurify.sanitize(rawHtml);

  return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
};

export default MarkdownParser;
