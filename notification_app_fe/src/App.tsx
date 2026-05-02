import React, { useEffect, useState } from 'react';
import { getTopPriorityNotifications, Notification } from './services/notificationService';

function App() {
  const [topNotifications, setTopNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await getTopPriorityNotifications();
      setTopNotifications(data);
    };
    loadData();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Top 10 Priority Notifications</h1>
      <pre style={{ background: '#f4f4f4', padding: '15px', borderRadius: '5px' }}>
        {JSON.stringify(topNotifications, null, 2)}
      </pre>
    </div>
  );
}

export default App;