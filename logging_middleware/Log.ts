declare const process: any;

type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";
type FrontendPackage = "api" | "component" | "hook" | "page" | "state" | "style" | "auth" | "config" | "middleware" | "utils";

export const Log = async (
  level: LogLevel,
  pkg: FrontendPackage,
  message: string
) => {
  // Pulls the token from your .env file
  const accessToken = process.env.REACT_APP_ACCESS_TOKEN; 
  const endpoint = "http://202.207.122.201/evaluation-service/logs";

  if (!accessToken) {
    // Fails silently if token is missing so it doesn't crash the app
    return null; 
  }

  const payload = {
    stack: "frontend",
    level: level,
    package: pkg,
    message: message
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data; 
    
  } catch (error) {
    return null;
  }
};