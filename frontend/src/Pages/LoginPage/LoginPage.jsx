import {
  Card,
  Center,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import "@mantine/core/styles.css";
import { GoogleLogin } from "@react-oauth/google";
import { showNotification } from "@mantine/notifications";
import Service from "../../utils/http";
import { GOOGLE_AUTH_LOGIN } from "../../utils/urls";
import { useDispatch, useSelector } from "react-redux";
import { getIsLoggedIn, setUser } from "../../redux/slices/User";
import { Navigate, useNavigate } from "react-router-dom";
import { IconLink } from "@tabler/icons-react";

export default function LoginPage() {
  const service = new Service();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(getIsLoggedIn);

  const googleResponse = async (res) => {
    try {
      const token = res.credential;

      if (!token) {
        showNotification({
          title: "Error",
          message: "Invalid Response From Google",
          color: "red",
        });
        return;
      }

      const response = await service.post(GOOGLE_AUTH_LOGIN, { token });
      const data = response.data;

      dispatch(
        setUser({
          name: data.name,
          avatar: data.avatar,
          token: data.token,
          email: data.email,
          isLoggedIn: true,
        })
      );
      showNotification({
        title: "Success",
        message: "Welcome! Login Successfully.",
        color: "green",
      });
      navigate("/");
    } catch (error) {
      showNotification({
        title: "Error",
        message: error.response?.data?.message ?? "Some Error Occurred!",
        color: "red",
      });
      console.error("Google login error:", error);
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh - 120px)",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}
    >
      <Center style={{ width: "100%" }}>
        <Card
          shadow="xl"
          padding="xl"
          radius="lg"
          className="glass-panel"
          style={{
            maxWidth: 400,
            width: "100%",
            textAlign: "center",
            padding: "40px 30px",
            border: "1px solid rgba(99, 102, 241, 0.2) !important",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4) !important"
          }}
        >
          <Stack align="center" gap="md">
            <div 
              style={{ 
                background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                boxShadow: "0 8px 24px rgba(99, 102, 241, 0.4)"
              }}
            >
              <IconLink size={30} />
            </div>

            <Title order={2} c="white" mt="sm" style={{ fontWeight: 800 }}>
              Welcome back
            </Title>
            
            <Text c="dimmed" size="sm" style={{ maxWidth: "280px", marginBottom: "15px" }}>
              Sign in with your Google account to access your shortened links and analytics.
            </Text>

            <GoogleLogin
              width={280}
              theme="filled_blue"
              shape="pill"
              useOneTap={true}
              onSuccess={googleResponse}
            />
          </Stack>
        </Card>
      </Center>
    </div>
  );
}
