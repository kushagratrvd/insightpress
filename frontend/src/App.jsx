import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BlogDetail from './pages/BlogDetail';
import WriteBlog from './pages/WriteBlog';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/blog/:id" element={<BlogDetail />} />
      <Route path="/write" element={<WriteBlog />} />
      <Route path="/edit/:id" element={<WriteBlog />} />
    </Routes>
  );
}

export default App;
