import { Button, TextInput, Stack, Group } from '@mantine/core'
import React, { useState } from 'react'
import Service from '../../utils/http.js'
import {
  IconLink,
  IconEdit,
  IconCalendarTime,
  IconBookmark
} from '@tabler/icons-react'

export default function Input({setResponse}) {
  const service = new Service();
  const [payload, setPayload] = useState({
    originalUrl: "",
    expiresAt: "",
    title: "",
    customUrl: ""
  });
  const [loading, setLoading] = useState(false);

  const generateShortCode = async () => {
    setLoading(true);
    try {
      const response = await service.post("s", payload);
      setResponse(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack gap="lg">
      <TextInput
        label="Original URL"
        description="The long link you want to simplify"
        placeholder="https://example.com/very-long-path"
        required
        size="md"
        radius="md"
        value={payload.originalUrl}
        leftSection={<IconLink size={18} style={{ opacity: 0.6 }} />}
        onChange={(e) => setPayload({ ...payload, originalUrl: e.target.value })}
        styles={{
          input: {
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            '&:focus': {
              borderColor: "#6366f1"
            }
          },
          label: { color: "white" }
        }}
      />

      <TextInput
        label="Custom Alias (Optional)"
        description="Create a branded or custom short link suffix"
        placeholder="my-custom-name"
        size="md"
        radius="md"
        value={payload.customUrl}
        leftSection={<IconEdit size={18} style={{ opacity: 0.6 }} />}
        onChange={(e) => setPayload({ ...payload, customUrl: e.target.value })}
        styles={{
          input: {
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            '&:focus': {
              borderColor: "#6366f1"
            }
          },
          label: { color: "white" }
        }}
      />

      <TextInput
        label="Title (Optional)"
        description="An internal name to identify this link in dashboard"
        placeholder="My Campaign Link"
        size="md"
        radius="md"
        value={payload.title}
        leftSection={<IconBookmark size={18} style={{ opacity: 0.6 }} />}
        onChange={(e) => setPayload({ ...payload, title: e.target.value })}
        styles={{
          input: {
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            '&:focus': {
              borderColor: "#6366f1"
            }
          },
          label: { color: "white" }
        }}
      />

      <TextInput
        label="Expiration Date (Optional)"
        description="When the link should automatically expire"
        type="date"
        size="md"
        radius="md"
        value={payload.expiresAt}
        leftSection={<IconCalendarTime size={18} style={{ opacity: 0.6 }} />}
        onChange={(e) => setPayload({ ...payload, expiresAt: e.target.value })}
        styles={{
          input: {
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            '&:focus': {
              borderColor: "#6366f1"
            }
          },
          label: { color: "white" }
        }}
      />

      <Button 
        disabled={payload.originalUrl === ""} 
        loading={loading}
        onClick={generateShortCode} 
        variant="gradient" 
        gradient={{ from: "indigo", to: "violet" }}
        size="lg"
        radius="md"
        mt="md"
        style={{
          boxShadow: payload.originalUrl ? "0 4px 15px rgba(99, 102, 241, 0.3)" : "none",
        }}
      >
        Shorten URL
      </Button>
    </Stack>
  )
}

