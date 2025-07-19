import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import SharedContent from './pages/SharedPage';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="api/v1/brain/shared/:shareLink" element={<SharedContent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
