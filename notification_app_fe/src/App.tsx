import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, AppBar, Toolbar, Typography, Button, Container, Card, CardContent, Chip, Select, MenuItem, Pagination, Stack, SelectChangeEvent } from '@mui/material';
import { Log } from 'logging_middleware';
import { getTopPriorityNotifications, getAllNotifications, Notification } from './services/notificationService';

// Theme
const theme = createTheme({
  shape: { borderRadius: 0 },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h6: { fontWeight: 800, letterSpacing: '-0.5px' },
    button: { fontWeight: 700, textTransform: 'none' },
  },
  palette: {
    primary: { main: '#000000' },
    background: { default: '#ffffff', paper: '#f8f8f8' },
  },
  components: {
    MuiCard: { styleOverrides: { root: { border: '2px solid #000', boxShadow: '4px 4px 0px 0px #000', transition: 'transform 0.1s', '&:hover': { transform: 'translate(-2px, -2px)', boxShadow: '6px 6px 0px 0px #000' } } } }
  }
});

// Helper: Read State
const useReadState = () => {
  const [readIds, setReadIds] = useState<string[]>(() => JSON.parse(localStorage.getItem('readNotifs') || '[]'));
  
  const markAsRead = (id: string) => {
    if (!readIds.includes(id)) {
      const newReadIds = [...readIds, id];
      setReadIds(newReadIds);
      localStorage.setItem('readNotifs', JSON.stringify(newReadIds));
      Log("info", "state", `Notification ${id} marked as read`);
    }
  };
  return { readIds, markAsRead };
};

// Reusable Notification Card
const NotificationItem = ({ notif, isRead, onRead }: { notif: Notification, isRead: boolean, onRead: (id: string) => void }) => {
  const isPlacement = notif.Type === "Placement";
  return (
    <Card onClick={() => onRead(notif.ID)} sx={{ cursor: 'pointer', opacity: isRead ? 0.6 : 1, bgcolor: isRead ? '#f0f0f0' : '#fff' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Chip label={notif.Type} size="small" sx={{ fontWeight: 'bold', border: '1px solid #000', bgcolor: isPlacement ? '#000' : 'transparent', color: isPlacement ? '#fff' : '#000', borderRadius: 0 }} />
          {!isRead && <Chip label="NEW" size="small" color="error" sx={{ borderRadius: 0, fontWeight: 500, height: '20px' }} />}
        </Box>
        <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 1 }}>{notif.Message}</Typography>
        <Typography variant="caption" color="text.secondary">{new Date(notif.Timestamp).toLocaleString()}</Typography>
      </CardContent>
    </Card>
  );
};

// Priority Page
const PriorityPage = () => {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const { readIds, markAsRead } = useReadState();

  useEffect(() => {
    getTopPriorityNotifications().then(setNotifs);
    Log("info", "page", "Priority inbox loaded");
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 500, mb: 3 }}>Priority Inbox</Typography>
      <Stack spacing={2}>
        {notifs.map(n => <NotificationItem key={n.ID} notif={n} isRead={readIds.includes(n.ID)} onRead={markAsRead} />)}
      </Stack>
    </Box>
  );
};

// All Notifications Page
const AllNotificationsPage = () => {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("All");
  const { readIds, markAsRead } = useReadState();

  useEffect(() => {
    getAllNotifications(page, 10, filter).then(setNotifs);
  }, [page, filter]);

  const handleFilterChange = (e: SelectChangeEvent) => {
    setFilter(e.target.value);
    setPage(1); 
    Log("info", "component", `Filter changed to ${e.target.value}`);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 500 }}>All Updates</Typography>
        <Select value={filter} onChange={handleFilterChange} size="small" sx={{ minWidth: 150, borderRadius: 0, border: '2px solid #000' }}>
          <MenuItem value="All">All Types</MenuItem>
          <MenuItem value="Placement">Placement</MenuItem>
          <MenuItem value="Result">Result</MenuItem>
          <MenuItem value="Event">Event</MenuItem>
        </Select>
      </Box>

      <Stack spacing={2} sx={{ mb: 4 }}>
        {notifs.length === 0 ? <Typography>No notifications found.</Typography> : 
          notifs.map(n => <NotificationItem key={n.ID} notif={n} isRead={readIds.includes(n.ID)} onRead={markAsRead} />)}
      </Stack>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination count={5} page={page} onChange={(e, v) => setPage(v)} shape="rounded" size="large" />
      </Box>
    </Box>
  );
};

// Navbar and main application
const NavBar = () => {
  const location = useLocation();
  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '2px solid #000', mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>CAMPUS NOTIFICATIONS</Typography>
        <Button component={Link} to="/" sx={{ mx: 1, borderBottom: location.pathname === '/' ? '2px solid #000' : 'none' }}>Priority</Button>
        <Button component={Link} to="/all" sx={{ borderBottom: location.pathname === '/all' ? '2px solid #000' : 'none' }}>All</Button>
      </Toolbar>
    </AppBar>
  );
};

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <NavBar />
        <Container maxWidth="md" sx={{ minHeight: '100vh', pb: 8 }}>
          <Routes>
            <Route path="/" element={<PriorityPage />} />
            <Route path="/all" element={<AllNotificationsPage />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}