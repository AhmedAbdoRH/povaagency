import React from 'react';

/**
 * يحول النص العادي إلى عناصر React مع روابط قابلة للضغط باللون الأزرق
 */
export function linkifyText(text: string): React.ReactNode[] {
  // regex بدون g flag للـ split، ومنفصل للـ test
  const splitRegex = /(https?:\/\/[^\s]+)/;
  const testRegex = /^https?:\/\/[^\s]+$/;
  const parts = text.split(splitRegex);

  return parts.map((part, index) => {
    if (testRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors duration-200 break-all"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.open(part, '_blank', 'noopener,noreferrer');
          }}
        >
          {part}
        </a>
      );
    }
    return part;
  });
}
