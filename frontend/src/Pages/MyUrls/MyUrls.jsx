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
import { showNotification } from '@mantine/notifications'

import {
  Container,
  Table,
  Paper,
  Group,
  Text,
  ActionIcon,
  Pagination,
  Modal,
  Button,
  TextInput,
  Stack
} from '@mantine/core'

import {
  IconEdit,
  IconTrash
} from '@tabler/icons-react'

export default function MyUrls() {
  const [data, setData] = useState(null)
  const [activePage, setActivePage] = useState(1)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedUrl, setSelectedUrl] = useState(null)
  const [editTitle, setEditTitle] = useState("")
  const [editOriginalUrl, setEditOriginalUrl] = useState("")
  const [editExpiresAt, setEditExpiresAt] = useState("")

  const service = new Service()

  async function getData() {
    try {
      const response = await service.get(
        `user/my/urls?page=${activePage}&limit=10`
      )
      setData(response)
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Failed to fetch short URLs",
        color: "red"
      })
    }
  }

  useEffect(() => {
    getData()
  }, [activePage])

  const handleDelete = async (shortCode) => {
    if (window.confirm("Are you sure you want to delete this short URL?")) {
      try {
        await service.delete(`s/${shortCode}`)
        showNotification({
          title: "Success",
          message: "Short URL deleted successfully",
          color: "green"
        })
        getData()
      } catch (error) {
        showNotification({
          title: "Error",
          message: error.response?.data?.message || "Failed to delete URL",
          color: "red"
        })
      }
    }
  }

  const openEditModal = (element) => {
    setSelectedUrl(element)
    setEditTitle(element.title || "")
    setEditOriginalUrl(element.originalUrl)
    setEditExpiresAt(element.expiresAt ? new Date(element.expiresAt).toISOString().split('T')[0] : "")
    setEditModalOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editOriginalUrl) {
      showNotification({
        title: "Error",
        message: "Original URL is required",
        color: "red"
      })
      return
    }
    try {
      await service.patch(`s/${selectedUrl.shortCode}`, {
        originalUrl: editOriginalUrl,
        title: editTitle,
        expiresAt: editExpiresAt || null
      })
      showNotification({
        title: "Success",
        message: "Short URL updated successfully",
        color: "green"
      })
      setEditModalOpen(false)
      getData()
    } catch (error) {
      showNotification({
        title: "Error",
        message: error.response?.data?.message || "Failed to update URL",
        color: "red"
      })
    }
  }

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
        <a
          href={`${service.getBaseURL()}/s/${element.shortCode}`}
          target="_blank"
          rel="noreferrer"
          style={{
            color: "#228be6",
            textDecoration: "underline"
          }}
        >
          {element.shortCode}
        </a>
      </Table.Td>

      <Table.Td>
        {element.clickCount}
      </Table.Td>

      <Table.Td>
        {new Date(element.createdAt).toLocaleDateString()}
      </Table.Td>

      <Table.Td>
        {element.expiresAt ? new Date(element.expiresAt).toLocaleDateString() : "Never"}
      </Table.Td>

      <Table.Td>
        <Group gap="xs">
          <ActionIcon
            variant="light"
            color="blue"
            radius="md"
            onClick={() => openEditModal(element)}
          >
            <IconEdit size={18} />
          </ActionIcon>

          <ActionIcon
            variant="light"
            color="red"
            radius="md"
            onClick={() => handleDelete(element.shortCode)}
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
            {rows?.length > 0 ? rows : (
              <Table.Tr>
                <Table.Td colSpan={6} align="center">
                  <Text c="dimmed">No short URLs found. Go to URL Shortener page to create one!</Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>

        <Group
          justify="space-between"
          mt="lg"
        >
          <Text size="sm" c="dimmed">
            Showing {data?.shortURLs?.length > 0 ? (activePage - 1) * 10 + 1 : 0} - {Math.min(activePage * 10, data?.totalItems || 0)} of {data?.totalItems || 0} URLs
          </Text>

          <Pagination
            value={activePage}
            onChange={setActivePage}
            total={data?.totalPages || 1}
            radius="md"
          />
        </Group>
      </Paper>

      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Short URL"
        centered
        radius="md"
      >
        <Stack gap="md">
          <TextInput
            label="Original URL"
            value={editOriginalUrl}
            onChange={(e) => setEditOriginalUrl(e.target.value)}
            placeholder="https://example.com"
            required
            size="md"
          />
          <TextInput
            label="Title (Optional)"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Title of URL"
            size="md"
          />
          <TextInput
            label="Expires At"
            type="date"
            value={editExpiresAt}
            onChange={(e) => setEditExpiresAt(e.target.value)}
            size="md"
          />
          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button color="blue" onClick={handleSaveEdit}>Save Changes</Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  )
}