import { Log } from 'logging_middleware';

export interface Notification {
  ID: string;
  Type: "Placement" | "Result" | "Event";
  Message: string;
  Timestamp: string; 
}

const getTypeWeight = (type: string) => {
  switch (type) {
    case "Placement": return 3;
    case "Result": return 2;
    case "Event": return 1;
    default: return 0;
  }
};

export const getTopPriorityNotifications = async (): Promise<Notification[]> => {
  const token = process.env.REACT_APP_ACCESS_TOKEN || process.env.NEXT_PUBLIC_ACCESS_TOKEN;
  
  // The proxy will handle it.
  const endpoint = "/evaluation-service/notifications";

  try {
    Log("info", "api", "fetching notifications");

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      Log("error", "api", "fetch failed");
      return [];
    }

    const data = await response.json();
    const notifications: Notification[] = data.notifications || [];

    Log("info", "utils", "sorting notifications");

    const sortedNotifications = notifications.sort((a, b) => {
      const weightA = getTypeWeight(a.Type);
      const weightB = getTypeWeight(b.Type);

      if (weightA !== weightB) {
        return weightB - weightA; 
      }

      const timeA = new Date(a.Timestamp).getTime();
      const timeB = new Date(b.Timestamp).getTime();
      return timeB - timeA;
    });

    const top10 = sortedNotifications.slice(0, 10);
    Log("info", "utils", "top 10 extracted");
    
    return top10;

  } catch (error) {
    Log("error", "api", "network error");
    return [];
  }
};

export const getAllNotifications = async (page: number, limit: number, type: string): Promise<Notification[]> => {
  const token = process.env.REACT_APP_ACCESS_TOKEN || process.env.NEXT_PUBLIC_ACCESS_TOKEN;
  
  // Construct URL with query parameters
  let endpoint = `/evaluation-service/notifications?page=${page}&limit=${limit}`;
  if (type !== "All") {
    endpoint += `&notification_type=${type}`;
  }

  try {
    Log("info", "api", `Fetching page ${page} with type ${type}`);

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      Log("error", "api", "Failed to fetch paginated notifications");
      return [];
    }

    const data = await response.json();
    Log("info", "utils", `Successfully fetched ${data.notifications?.length || 0} notifications`);
    return data.notifications || [];

  } catch (error) {
    Log("error", "api", "Network error on paginated fetch");
    return [];
  }
};