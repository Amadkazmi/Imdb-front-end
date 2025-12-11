import MovieNavbar from './presentation_layer/components/MovieNavbar';
import { Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Login from './presentation_layer/components/Login';
import Browse from './presentation_layer/components/Browse';
import MovieDetails from './presentation_layer/components/MovieDetails'; // Add this import
import { createBrowserRouter } from 'react-router-dom';
import MovieFooter from './presentation_layer/components/MovieFooter';
import About  from './presentation_layer/components/About';
import Support from './presentation_layer/Support';
import Contact from './presentation_layer/Contact';
function App() {
  return (
    <div className="bg-dark text-white min-vh-100">
      <MovieNavbar />
     
      <div className="container-fluid mt-4">
        <Outlet />
      </div>
      <MovieFooter />
    </div>
  );
}

export default App;

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Browse /> },
      { path: 'login', element: <Login /> },
      { path: 'browse', element: <Browse /> },
      { path: 'movie/:tconst', element: <MovieDetails /> }, // Add this line
      { path: 'about', element: <About /> },       // Added
      { path: 'contact', element: <Contact /> },   // Added
      { path: 'support', element: <Support /> },   // Added 
    ]
  }
]);