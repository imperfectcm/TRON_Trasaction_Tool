import './App.css'
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();
import Dashboard from './components/tron/Dashboard'
import InputArea from './components/tron/InputArea';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className='text-zinc-300 py-5'>
        <InputArea />
        <Dashboard />
      </main>
    </QueryClientProvider>
  )
}

export default App
