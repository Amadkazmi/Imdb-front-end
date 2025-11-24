import MovieNavbar from './components/MovieNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  return (
    <div className="bg-dark text-white min-vh-100">
      <MovieNavbar />
      
      {/* Your main content here */}
      <div className="container-fluid mt-4">
        {/* Page content */}
      </div>
    </div>
  );
}

export default App;