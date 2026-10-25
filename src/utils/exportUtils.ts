/**
 * Utility functions to export documents and self-contained HTML files
 */

export function downloadStandaloneHTML(appHtml: string, appDataJson: string) {
  const fullHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>نظام محامي.AI - الأستاذة حنان العطاوي (نسخة محفوظة شخصية)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Tajawal', sans-serif; }
    .font-legal { font-family: 'Amiri', serif; }
    [contenteditable="true"] {
      transition: all 0.2s ease;
      outline: none;
      border-radius: 6px;
    }
    [contenteditable="true"]:hover {
      background-color: rgba(245, 158, 11, 0.08) !important;
      cursor: text;
    }
    [contenteditable="true"]:focus {
      background-color: rgba(245, 158, 11, 0.12) !important;
      box-shadow: 0 0 0 1.5px rgba(245, 158, 11, 0.6);
    }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #0b1120; }
    ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
    @media print {
      body { background: white !important; color: black !important; }
      header, aside, .no-print, button { display: none !important; }
    }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen">
  <div id="exported-root">
    ${appHtml}
  </div>
  <script>
    // Embedded client data backup
    window.__SAVED_LEGAL_DATA = ${appDataJson};
    try {
      localStorage.setItem('hanan_legal_data_backup', JSON.stringify(window.__SAVED_LEGAL_DATA));
    } catch(e) {}
  </script>
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `assistant_hanan_el_aataoui_${new Date().toISOString().slice(0, 10)}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadWordDocument(filename: string, content: string) {
  // Generate a standard Microsoft Word compatible HTML document
  const wordContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${filename}</title>
      <style>
        body {
          font-family: 'Traditional Arabic', 'Amiri', 'Times New Roman', serif;
          font-size: 16pt;
          line-height: 1.8;
          direction: rtl;
          text-align: justify;
          margin: 2.5cm;
        }
        h1, h2, h3 {
          text-align: center;
          font-weight: bold;
        }
        .header-box {
          border-bottom: 2px solid #000;
          padding-bottom: 15px;
          margin-bottom: 25px;
          text-align: center;
        }
        .parties-box {
          border: 1px solid #777;
          padding: 15px;
          margin-bottom: 20px;
          background-color: #f9f9f9;
        }
        .signature {
          margin-top: 40px;
          text-align: left;
          font-weight: bold;
        }
      </style>
    </head>
    <body dir="rtl">
      ${content.replace(/\n/g, '<br>')}
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + wordContent], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
