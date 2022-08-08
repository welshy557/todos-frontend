import Login from "./components/login"
import Home from "./components/home"
import Register from "./components/resgister"
import CreateTodo from "./components/createTodo"
import {Route, Routes} from "react-router-dom"
import {QueryClient, QueryClientProvider} from "react-query"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="home" element={<Home/>}/>
        <Route path="create" element={<CreateTodo/>}/> 
        <Route path="register" element={<Register />}/>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
