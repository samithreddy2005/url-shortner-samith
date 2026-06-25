import {
  Button,
  Container,
  Stack,
  Text,
  Title,
  SimpleGrid,
  Card,
  Group,
  ThemeIcon
} from "@mantine/core";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { getIsLoggedIn } from "../../redux/slices/User";
import {
  IconLink,
  IconQrcode,
  IconDeviceLaptop,
  IconCalendarTime,
  IconBolt,
  IconChartBar
} from "@tabler/icons-react";

const Home = () => {
  const isLoggedIn = useSelector(getIsLoggedIn);
  const navigate = useNavigate();

  const features = [
    {
      icon: IconBolt,
      title: "Instant Redirection",
      description: "Blazing fast link resolution powered by optimized caching databases.",
      color: "blue"
    },
    {
      icon: IconQrcode,
      title: "QR Code Engine",
      description: "Automatically generate high-resolution QR codes for physical print and scans.",
      color: "violet"
    },
    {
      icon: IconChartBar,
      title: "Click Analytics",
      description: "Monitor visitor counts, click logs, referrer sources, and browser details.",
      color: "indigo"
    },
    {
      icon: IconCalendarTime,
      title: "Link Expirations",
      description: "Set self-destruct dates for secure, time-sensitive promotional sharing.",
      color: "grape"
    }
  ];

  return (
    <div style={{ paddingBottom: "100px" }}>
      {/* Hero Section */}
      <Container size="lg" style={{ marginTop: "80px", marginBottom: "80px" }}>
        <Stack align="center" gap="xl" style={{ textAlign: "center" }}>
          <ThemeIcon 
            size={72} 
            radius="24px" 
            variant="gradient" 
            gradient={{ from: "indigo", to: "violet" }}
            className="pulse-glow"
          >
            <IconLink size={38} />
          </ThemeIcon>

          <Title
            order={1}
            style={{
              fontSize: "3.5rem",
              fontWeight: 800,
              lineHeight: 1.1,
              maxWidth: "800px",
              color: "white"
            }}
          >
            Shorten. Simplify.{" "}
            <span className="text-gradient">Optimize.</span>
          </Title>

          <Text
            size="xl"
            c="dimmed"
            style={{ maxWidth: "600px", fontSize: "1.2rem", fontWeight: 400 }}
          >
            A premium, security-first URL shortener platform. Transform long, cluttered links into memorable custom short URLs and track detailed visitor analytics.
          </Text>

          <Group gap="md" mt="md">
            <Button
              size="lg"
              radius="md"
              variant="gradient"
              gradient={{ from: "indigo", to: "violet" }}
              onClick={() =>
                isLoggedIn ? navigate("/url/shortener") : navigate("/login")
              }
              style={{ minWidth: "160px", boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)" }}
            >
              {isLoggedIn ? "Dashboard" : "Get Started"}
            </Button>
            
            <Button
              size="lg"
              radius="md"
              variant="outline"
              color="gray"
              component={Link}
              to={isLoggedIn ? "/url/list" : "/login"}
              style={{ 
                minWidth: "160px", 
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                color: "#e2e8f0",
                borderColor: "rgba(255, 255, 255, 0.1)"
              }}
            >
              View My Links
            </Button>
          </Group>
        </Stack>
      </Container>

      {/* Features Grid */}
      <Container size="lg" style={{ marginBottom: "100px" }}>
        <Title order={2} align="center" c="white" mb="xl" fw={700}>
          Designed for Modern Sharing
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" mt="50px">
          {features.map((feature, index) => (
            <Card
              key={index}
              p="xl"
              radius="lg"
              className="glass-panel"
              style={{
                transition: "transform 0.3s ease",
                cursor: "default"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <ThemeIcon 
                size={48} 
                radius="md" 
                variant="light" 
                color={feature.color}
                mb="md"
              >
                <feature.icon size={26} />
              </ThemeIcon>
              <Text fw={700} size="lg" c="white" mb="xs">
                {feature.title}
              </Text>
              <Text size="sm" c="dimmed">
                {feature.description}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      </Container>

      {/* Statistics Section */}
      <Container size="md">
        <Card radius="xl" p="xl" className="glass-panel" style={{ border: "1px solid rgba(99, 102, 241, 0.2) !important" }}>
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl" style={{ textAlign: "center" }}>
            <Stack gap="xs">
              <Text size="3rem" fw={800} className="text-gradient" style={{ lineHeight: 1 }}>
                15M+
              </Text>
              <Text fw={600} size="sm" c="white">Total Links Created</Text>
              <Text size="xs" c="dimmed">Shortened worldwide</Text>
            </Stack>
            <Stack gap="xs">
              <Text size="3rem" fw={800} className="text-gradient" style={{ lineHeight: 1 }}>
                300M+
              </Text>
              <Text fw={600} size="sm" c="white">Redirects Tracked</Text>
              <Text size="xs" c="dimmed">Processed instantly</Text>
            </Stack>
            <Stack gap="xs">
              <Text size="3rem" fw={800} className="text-gradient" style={{ lineHeight: 1 }}>
                99.99%
              </Text>
              <Text fw={600} size="sm" c="white">Uptime SLA</Text>
              <Text size="xs" c="dimmed">High-availability servers</Text>
            </Stack>
          </SimpleGrid>
        </Card>
      </Container>
    </div>
  );
};

export default Home;
