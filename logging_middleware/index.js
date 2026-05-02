const Log = async (level, pkg, message) => {
  const accessToken = process.env.REACT_APP_ACCESS_TOKEN; 
  const endpoint = "http://20.207.122.201/evaluation-service/logs";

  if (!accessToken) return null; 

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

    if (!response.ok) return null;
    return await response.json(); 
  } catch (error) {
    return null;
  }
};

module.exports = { Log };