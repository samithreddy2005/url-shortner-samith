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
  Stack,
  SimpleGrid,
  Card,
  ThemeIcon
} from '@mantine/core'

import {
  IconEdit,
  IconTrash,
  IconLink,
  IconEye,
  IconFlame
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

  // Calculate statistics for current page
  const totalLinks = data?.totalItems || 0;
  const pageClicks = data?.shortURLs?.reduce((sum, item) => sum + (item.clickCount || 0), 0) || 0;
  const mostPopular = data?.shortURLs?.length > 0 
    ? [...data.shortURLs].sort((a, b) => b.clickCount - a.clickCount)[0] 
    : null;

  const rows = data?.shortURLs?.map((element) => (
    <Table.Tr key={element._id} style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
      <Table.Td>
        <Stack gap={2}>
          <Text fw={600} size="sm" c="white">
            {element.title || "Untitled Link"}
          </Text>
          <a
            href={element.originalUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              color: "#a5b4fc",
              textDecoration: "none",
              fontSize: "12px",
              display: "block",
              maxWidth: "280px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            {element.originalUrl}
          </a>
        </Stack>
      </Table.Td>

      <Table.Td fw={500}>
        <a
          href={`${service.getBaseURL()}/s/${element.shortCode}`}
          target="_blank"
          rel="noreferrer"
          style={{
            color: "#818cf8",
            textDecoration: "underline",
            fontWeight: 600
          }}
        >
          {element.shortCode}
        </a>
      </Table.Td>

      <Table.Td>
        <Group gap="xs">
          <ThemeIcon size="xs" variant="light" color="indigo">
            <IconEye size={12} />
          </ThemeIcon>
          <Text size="sm" fw={600} c="white">
            {element.clickCount}
          </Text>
        </Group>
      </Table.Td>

      <Table.Td c="dimmed" size="sm">
        {new Date(element.createdAt).toLocaleDateString()}
      </Table.Td>

      <Table.Td>
        {element.expiresAt ? (
          <Text size="sm" c="yellow">
            {new Date(element.expiresAt).toLocaleDateString()}
          </Text>
        ) : (
          <Text size="sm" c="dimmed">
            Never
          </Text>
        )}
      </Table.Td>

      <Table.Td>
        <Group gap="xs">
          <ActionIcon
            variant="light"
            color="indigo"
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
    <Container size="xl" mt="xl" style={{ paddingBottom: "80px" }}>
      {/* Stats Header Grid */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mb="xl">
        <Card radius="lg" className="glass-panel" p="md">
          <Group justify="space-between" wrap="nowrap">
            <div>
              <Text size="xs" c="dimmed" fw={600} style={{ textTransform: "uppercase" }}>Total Short URLs</Text>
              <Text size="2rem" fw={800} c="white" mt={4}>{totalLinks}</Text>
            </div>
            <ThemeIcon size={48} radius="md" color="blue" variant="light">
              <IconLink size={24} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card radius="lg" className="glass-panel" p="md">
          <Group justify="space-between" wrap="nowrap">
            <div>
              <Text size="xs" c="dimmed" fw={600} style={{ textTransform: "uppercase" }}>Page Visitor Clicks</Text>
              <Text size="2rem" fw={800} c="white" mt={4}>{pageClicks}</Text>
            </div>
            <ThemeIcon size={48} radius="md" color="violet" variant="light">
              <IconEye size={24} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card radius="lg" className="glass-panel" p="md">
          <Group justify="space-between" wrap="nowrap">
            <div>
              <Text size="xs" c="dimmed" fw={600} style={{ textTransform: "uppercase" }}>Top Performer Code</Text>
              <Text size="1.8rem" fw={800} c="white" mt={4} style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                {mostPopular ? mostPopular.shortCode : "N/A"}
              </Text>
            </div>
            <ThemeIcon size={48} radius="md" color="orange" variant="light">
              <IconFlame size={24} />
            </ThemeIcon>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Main Table Card */}
      <Paper
        shadow="xl"
        radius="lg"
        p="xl"
        className="glass-panel"
      >
        <Table
          verticalSpacing="md"
          horizontalSpacing="md"
          style={{ color: '#e2e8f0' }}
        >
          <Table.Thead style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
            <Table.Tr>
              <Table.Th style={{ color: 'white', fontWeight: 700 }}>Link Details</Table.Th>
              <Table.Th style={{ color: 'white', fontWeight: 700 }}>Short Link</Table.Th>
              <Table.Th style={{ color: 'white', fontWeight: 700 }}>Clicks</Table.Th>
              <Table.Th style={{ color: 'white', fontWeight: 700 }}>Created</Table.Th>
              <Table.Th style={{ color: 'white', fontWeight: 700 }}>Expires</Table.Th>
              <Table.Th style={{ color: 'white', fontWeight: 700 }}>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows?.length > 0 ? rows : (
              <Table.Tr>
                <Table.Td colSpan={6} align="center" style={{ padding: "40px 0" }}>
                  <Text c="dimmed">No short URLs found. Go to the URL Shortener page to create one!</Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>

        <Group
          justify="space-between"
          mt="lg"
          pt="md"
          style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}
        >
          <Text size="sm" c="dimmed">
            Showing {data?.shortURLs?.length > 0 ? (activePage - 1) * 10 + 1 : 0} - {Math.min(activePage * 10, data?.totalItems || 0)} of {data?.totalItems || 0} URLs
          </Text>

          <Pagination
            value={activePage}
            onChange={setActivePage}
            total={data?.totalPages || 1}
            radius="md"
            styles={{
              control: {
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                '&[data-active]': {
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  color: 'white',
                  border: 0
                }
              }
            }}
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