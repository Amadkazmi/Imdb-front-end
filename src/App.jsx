import MovieNavbar from './components/MovieNavbar';
import { Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Login from './components/Login';
import Browse from './components/Browse';
import { createBrowserRouter } from 'react-router-dom';

function App() {
  return (
    <div className="bg-dark text-white min-vh-100">
      <MovieNavbar />

      <div className="container-fluid mt-4">
        <Outlet />
      </div>
    </div>
  );
}

export default App;


export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Browse /> }, // default route for "/"
      { path: 'login', element: <Login /> },
      { path: 'browse', element: <Browse /> } // optional, can access /browse explicitly
    ]
  }
]);
