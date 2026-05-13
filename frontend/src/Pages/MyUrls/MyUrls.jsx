import React, { useEffect, useState } from 'react'
import Service from '../../utils/http'
import { Table } from '@mantine/core';


export default function MyUrls() {
   const [data, setData] = useState(null)
   const service = new Service();


   async function getData() {
       const response = await service.get("user/my/urls?page=1&limit=10")
       setData(response)
   }
   useEffect(() => {
       getData()
   }, [])
   const rows = data?.shortURLs?.map((element) => (
       <Table.Tr key={element._id}>
           <Table.Td>{element.originalUrl.length > 30 ? element.originalUrl.slice(0, 30) : element.originalUrl}</Table.Td>
           <Table.Td>{element.shortCode}</Table.Td>
           <Table.Td>{element.clickCount}</Table.Td>
       </Table.Tr>
   ));
   return (
       <div>
           <Table>
               <Table.Thead>
                   <Table.Tr>
                       <Table.Th>Original Url</Table.Th>
                       <Table.Th>Short Code</Table.Th>
                       <Table.Th>Click Count</Table.Th>
                   </Table.Tr>
               </Table.Thead>
               <Table.Tbody>{rows}</Table.Tbody>
           </Table>
       </div>
   )
}
