import React from 'react'
import QRCode from "react-qr-code";


export default function Response({response}) {
 return (
   <div>
      {"https://url-shortener-bootcamp.onrender.com/api/s/"+response.shortCode}
      <div style={{ height: "auto", margin: "0 auto", maxWidth: 64, width: "100%" }}>
  <QRCode
    size={256}
    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
    value={"https://url-shortener-bootcamp.onrender.com/api/s/"+response.shortCode}
    viewBox={`0 0 256 256`}
  />
</div>
   </div>
 )
}
