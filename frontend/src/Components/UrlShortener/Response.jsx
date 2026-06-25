import React from 'react'
import QRCode from "react-qr-code";
import { CopyButton, Button, ActionIcon, Tooltip, Stack, Group, Text, Paper } from '@mantine/core'
import { IconCopy, IconCheck, IconQrcode, IconArrowLeft, IconCircleCheck } from '@tabler/icons-react'

export default function Response({ response, setResponse }) {
  const shortURL = response?.data?.shortURL || `${window.location.origin}/s/${response?.data?.shortCode || response?.shortCode}`;

  const downloadQRCode = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = 256;
      canvas.height = 256;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `qrcode-${response?.data?.shortCode || "shorturl"}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <Stack gap="xl" align="center" style={{ width: "100%" }}>
      <Stack align="center" gap="xs">
        <IconCircleCheck size={50} color="#10b981" style={{ filter: "drop-shadow(0 0 10px rgba(16, 185, 129, 0.3))" }} />
        <Text fw={800} size="xl" c="white">
          Link Created Successfully!
        </Text>
      </Stack>

      {/* Copy Link Section */}
      <Paper 
        p="md" 
        radius="md" 
        style={{ 
          backgroundColor: "rgba(255, 255, 255, 0.03)", 
          border: "1px solid rgba(255, 255, 255, 0.1)",
          width: "100%"
        }}
      >
        <Group justify="space-between" wrap="nowrap">
          <Text 
            size="sm" 
            fw={500} 
            c="white" 
            style={{ 
              overflow: "hidden", 
              textOverflow: "ellipsis", 
              whiteSpace: "nowrap",
              wordBreak: "break-all"
            }}
          >
            {shortURL}
          </Text>
          <CopyButton value={shortURL} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                <ActionIcon 
                  color={copied ? 'teal' : 'indigo'} 
                  variant="light" 
                  onClick={copy}
                  size="lg"
                  radius="md"
                >
                  {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>
      </Paper>

      {/* QR Code Container */}
      <Stack gap="xs" align="center">
        <Paper 
          p="md" 
          radius="lg" 
          style={{ 
            backgroundColor: "white", 
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            border: "4px solid rgba(99, 102, 241, 0.15)"
          }}
        >
          <QRCode
            id="qr-code-svg"
            size={160}
            value={shortURL}
            viewBox={`0 0 256 256`}
          />
        </Paper>
        <Button 
          variant="subtle" 
          color="indigo" 
          leftSection={<IconQrcode size={16} />}
          onClick={downloadQRCode}
          size="xs"
        >
          Download QR Code
        </Button>
      </Stack>

      <Button 
        variant="subtle" 
        color="gray" 
        onClick={() => setResponse(null)}
        leftSection={<IconArrowLeft size={16} />}
        style={{ color: "#94a3b8" }}
      >
        Shorten another URL
      </Button>
    </Stack>
  )
}
