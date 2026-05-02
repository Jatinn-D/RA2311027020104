import { useEffect } from 'react';
import { Log } from 'logging_middleware';

function App() {
  useEffect(() => {
    console.log("MY TOKEN IS:", process.env.REACT_APP_ACCESS_TOKEN);
    Log("info", "page", "Application started and testing logger");
  }, []);

  return (
    <div>
      <h1>Campus Notifications</h1>
    </div>
  );
}
export default App;