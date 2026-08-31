"use client"; // Required if using Next.js App Router

interface AdsterraBannerProps {
  id: string;
  width: number;
  height: number;
}

export default function AdsterraBanner({ id, width, height }: AdsterraBannerProps) {
  // Pass your actual Adsterra configuration variables here
  const adHtml = `
    <html>
      <body style="margin:0; padding:0; display:flex; justify-content:center; align-items:center;">
        <script>
          atOptions = {
            'key' : '${id}',
            'format' : 'iframe',
            'height' : ${height},
            'width' : ${width},
            'params' : {}
          };
        </script>
        <script src="https://www.highrevenueformat.com/${id}/invoke.js"></script>

      </body>
    </html>
  `;

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        margin: "10px auto",
      }}
    >
      <iframe
        srcDoc={adHtml}
        width={width}
        height={height}
        scrolling="no"
        frameBorder="0"
        style={{ border: "none", overflow: "hidden" }}
      />
    </div>
  );
}
