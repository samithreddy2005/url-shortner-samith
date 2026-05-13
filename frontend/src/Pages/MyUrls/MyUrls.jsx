// import React, { useEffect, useState } from 'react'
// import Service from '../../utils/http'
// import { Container, Table } from '@mantine/core';


// export default function MyUrls() {
//    const [data, setData] = useState(null)
//    const service = new Service();


//    async function getData() {
//        const response = await service.get("user/my/urls?page=1&limit=10")
//        setData(response)
//    }
//    useEffect(() => {
//        getData()
//    }, [])
//    const rows = data?.shortURLs?.map((element) => (
//        <Table.Tr key={element._id}>
//            <Table.Td>{element.originalUrl.length > 30 ? element.originalUrl.slice(0, 30) : element.originalUrl}</Table.Td>
//            <Table.Td>{element.shortCode}</Table.Td>
//            <Table.Td>{element.clickCount}</Table.Td>
//        </Table.Tr>
//    ));
//    return (
//        <Container size={"md"} mt="xl">
//            <Table>
//                <Table.Thead>
//                    <Table.Tr>
//                        <Table.Th>Original Url</Table.Th>
//                        <Table.Th>Short Code</Table.Th>
//                        <Table.Th>Click Count</Table.Th>
//                    </Table.Tr>
//                </Table.Thead>
//                <Table.Tbody>{rows}</Table.Tbody>
//            </Table>
//        </Container>
//    )
// }

import React, { useEffect, useState } from 'react'
import Service from '../../utils/http'

import {
  Container,
  Table,
  Paper,
  Group,
  Text,
  ActionIcon,
  Pagination
} from '@mantine/core'

import {
  IconEdit,
  IconTrash
} from '@tabler/icons-react'

export default function MyUrls() {

  const [data, setData] = useState(null)

  const service = new Service()

  async function getData() {
    const response = await service.get(
      "user/my/urls?page=1&limit=10"
    )

    setData(response)
  }

  useEffect(() => {
    getData()
  }, [])

  const rows = data?.shortURLs?.map((element) => (

    <Table.Tr key={element._id}>

      <Table.Td>
        <a
          href={element.originalUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            color: "#228be6",
            textDecoration: "none"
          }}
        >
          {
            element.originalUrl.length > 45
              ? element.originalUrl.slice(0, 45) + "..."
              : element.originalUrl
          }
        </a>
      </Table.Td>

      <Table.Td fw={500}>
        {element.shortCode}
      </Table.Td>

      <Table.Td>
        {element.clickCount}
      </Table.Td>

      <Table.Td>
        5/13/2026
      </Table.Td>

      <Table.Td>
        6/12/2026
      </Table.Td>

      <Table.Td>

        <Group gap="xs">

          <ActionIcon
            variant="light"
            color="blue"
            radius="md"
          >
            <IconEdit size={18} />
          </ActionIcon>

          <ActionIcon
            variant="light"
            color="red"
            radius="md"
          >
            <IconTrash size={18} />
          </ActionIcon>

        </Group>

      </Table.Td>

    </Table.Tr>
  ))

  return (

    <Container size="xl" mt="xl">

      <Paper
        shadow="sm"
        radius="md"
        withBorder
        p="md"
      >

        <Table
          striped
          highlightOnHover
          withTableBorder
          withColumnBorders
          verticalSpacing="md"
          horizontalSpacing="md"
        >

          <Table.Thead bg="#f8f9fa">

            <Table.Tr>

              <Table.Th>Original URL</Table.Th>

              <Table.Th>Short Link</Table.Th>

              <Table.Th>Clicks</Table.Th>

              <Table.Th>Created</Table.Th>

              <Table.Th>Expires</Table.Th>

              <Table.Th>Actions</Table.Th>

            </Table.Tr>

          </Table.Thead>

          <Table.Tbody>
            {rows}
          </Table.Tbody>

        </Table>

        <Group
          justify="space-between"
          mt="lg"
        >

          <Text size="sm" c="dimmed">

            Showing 1 - {data?.shortURLs?.length || 0}
            {" "}of{" "}
            {data?.shortURLs?.length || 0} URLs

          </Text>

          <Pagination
            total={1}
            radius="md"
          />

        </Group>

      </Paper>

    </Container>
  )
}