import React, { useState } from 'react'
import Response from '../../Components/UrlShortener/Response'
import Input from '../../Components/UrlShortener/Input'
import './ShortenUrl.css'

export default function ShortenUrl() {
  const [response, setResponse] = useState(null)

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">URL Shortener</h1>

        {
          response
            ? <Response response={response} />
            : <Input setResponse={setResponse} />
        }
      </div>
    </div>
  )
}


