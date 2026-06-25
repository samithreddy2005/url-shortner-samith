
import { Avatar, Paper, Stack, Text, Group, Badge, ThemeIcon } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Service from '../../utils/http';
import { IconMail, IconUser, IconLink, IconClock } from '@tabler/icons-react';
import styles from './Profile.module.css';

export default function Profile() {
  const name = useSelector((state) => state.user.name) || "User Profile";
  const email = useSelector((state) => state.user.email) || "No Email Associated";
  const avatar = useSelector((state) => state.user.avatar);
  const role = useSelector((state) => state.user.role) || "user";
  
  const [totalUrls, setTotalUrls] = useState(0);
  const service = new Service();

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await service.get("user/my/urls?page=1&limit=1");
        setTotalUrls(response.totalItems || 0);
      } catch (error) {
        console.error("Failed to fetch profile stats:", error);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className={styles['profile-container']}>
      <Avatar 
        src={avatar} 
        className={styles['profile-avatar']} 
        size="xl" 
        radius="100%"
        color="indigo"
      >
        {name.charAt(0).toUpperCase()}
      </Avatar>
      
      <h2 className={styles['profile-name']}>{name}</h2>
      <p className={styles['profile-email']}>{email}</p>
      
      {/* Dynamic Statistics Card */}
      <Paper className={styles['profile-stats-card']}>
        <Stack gap="xs">
          <Group justify="space-between">
            <Group gap="xs">
              <ThemeIcon variant="light" color="indigo" size="sm">
                <IconLink size={14} />
              </ThemeIcon>
              <Text size="sm" c="dimmed" fw={500}>Shortened Links</Text>
            </Group>
            <Text size="sm" fw={700} c="white">{totalUrls}</Text>
          </Group>

          <Group justify="space-between">
            <Group gap="xs">
              <ThemeIcon variant="light" color="violet" size="sm">
                <IconUser size={14} />
              </ThemeIcon>
              <Text size="sm" c="dimmed" fw={500}>Account Status</Text>
            </Group>
            <Badge size="sm" variant="gradient" gradient={{ from: 'indigo', to: 'violet' }}>
              {role.toUpperCase()}
            </Badge>
          </Group>
        </Stack>
      </Paper>
      
      <Badge 
        className={styles['profile-badge']} 
        color="indigo" 
        variant="outline" 
        size="lg"
        radius="md"
      >
        Premium Member
      </Badge>
    </div>
  )
}

