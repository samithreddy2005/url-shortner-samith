import { Button, TextInput } from '@mantine/core'
import React, { useState } from 'react'
import Service from '../../utils/http.js'
import dayjs from 'dayjs'
import { DateInput } from '@mantine/dates'


export default function Input({setResponse}) {
   const service = new Service();
   const [payload, setPayload] = useState(
       {
           "originalUrl": "",
           "expiresAt": "",
           "title": "",
           "customUrl": ""
       }
   )


   const generateShortCode = async ()=>{
       const response = await service.post("s",payload)
       setResponse(response)
   }
   // POST
   // https://url-shortener-bootcamp.onrender.com/api/s
  
   // GET
   // https://url-shortener-bootcamp.onrender.com/api/s/Z_0HvF2
   return (
       <div>

           <TextInput
                 label="Original URL"
                 withAsterisk
                 placeholder="Paste Original URL"
                 size="xl"
                 radius="md"
                 mb="xl"
                 onChange={(e) => {
                     setPayload({
                         ...payload,
                         originalUrl: e.target.value
                     })
                 }}
             />
             <TextInput
                 label="Customize your link ( Optional )"
                 placeholder="Customize your link"
                 size="xl"
                 radius="md"
                 mb="xl"
                 rightSection="✏️"
                 onChange={(e) => {
                     setPayload({
                         ...payload,
                         customUrl: e.target.value
                     })
                 }}
             />
             <TextInput
                 label="Title ( Optional )"
                 placeholder="Title of URL"
                 size="xl"
                 radius="md"
                 mb="xl"
                 rightSection="✏️"
                 onChange={(e) => {
                     setPayload({
                         ...payload,
                         title: e.target.value
                     })
                 }}
             />
             <TextInput
                 type='date'
                 label="expiresAt"
                 withAsterisk
                 placeholder="Paste Original URL"
                 size="xl"
                 radius="md"
                 mb="xl"
                 onChange={(e) => {
                     setPayload({
                         ...payload,
                         expiresAt: e.target.value
                     })
                 }}
             />


           <Button disabled={ payload.originalUrl == "" } onClick={(e) => {
               generateShortCode()
           }} variant="filled" color="green">Shorten Url</Button>
       </div>
   )
}
