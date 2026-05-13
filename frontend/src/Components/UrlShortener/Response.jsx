import React from 'react'


export default function Response({response}) {
 return (
   <div>
      {"https://url-shortener-bootcamp.onrender.com/api/s/"+response.shortCode}
   </div>
 )
}
