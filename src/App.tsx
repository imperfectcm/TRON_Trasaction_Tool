import './App.css'
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();
import { useState } from 'react'
import Dashboard from './components/tron/Dashboard'
import InputArea from './components/tron/InputArea';

function App() {
  const [myAddress, setMyAddress] = useState<string>("");
  const [connect, setConnect] = useState<boolean>(false);
  const [wallet, setWallet] = useState<any>("");
  const [apiKey, setApiKey] = useState<string>("");
  return (
    <QueryClientProvider client={queryClient}>
      <main className='py-5'>
        <InputArea
          myAddress={myAddress}
          setMyAddress={setMyAddress}
          connect={connect}
          setConnect={setConnect}
          wallet={wallet}
          setWallet={setWallet}
          apiKey={apiKey}
          setApiKey={setApiKey}
        />
        <Dashboard
          connect={connect}
          myAddress={myAddress}
          wallet={wallet}
          apiKey={apiKey}
        />
      </main>
    </QueryClientProvider>
  )
}

export default App
