import { Routes, Route } from 'react-router-dom';
import Signup from './pages/signPage';
import Login from './pages/loginPage';
import HomePage from './pages/Homepage'
import Navbar from './component/Navbar'
import Footer from './component/footer'
import EventDetailPage from './pages/EventdetailPage'
import BookingPage from './pages/BookingPage';
import ProfilePag from './pages/profilePage';
import DashboardPage from './pages/DashboardPage'
function App() {
  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path='/Dashboard' element={<DashboardPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/events/:id" element={<EventDetailPage />} />
      <Route path="/events/:eventId/book" element={<BookingPage />} />
      <Route path='/profile' element={<ProfilePag />}/>
    </Routes>
    <Footer />
    </>
  );
}
export default App;
