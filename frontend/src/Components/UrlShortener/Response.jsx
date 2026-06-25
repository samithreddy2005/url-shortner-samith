import React from 'react'
import QRCode from "react-qr-code";

export default function Response({response}) {
  const shortURL = response?.data?.shortURL || `${window.location.origin}/s/${response?.data?.shortCode || response?.shortCode}`;

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <p style={{ marginBottom: '15px' }}>
        <a 
          href={shortURL} 
          target="_blank" 
          rel="noreferrer"
          style={{
            color: '#228be6',
            fontWeight: 600,
            textDecoration: 'underline',
            wordBreak: 'break-all'
          }}
        >
          {shortURL}
        </a>
      </p>
      <div style={{ height: "auto", margin: "0 auto", maxWidth: 128, width: "100%" }}>
        <QRCode
          size={256}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value={shortURL}
          viewBox={`0 0 256 256`}
        />
      </div>
    </div>
  )
}
