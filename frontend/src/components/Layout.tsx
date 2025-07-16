import { AppShell, Text, Container } from '@mantine/core';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header>
        <Container h="100%" display="flex" style={{ alignItems: 'center' }}>
          <Text size="xl" fw={700}>Laoshi</Text>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg">
          {children}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
} 