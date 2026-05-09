import { useNavigate } from 'react-router-dom'

function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist or has been moved.</p>
      <button className="home-btn" onClick={() => navigate('/')}>
        Go Home
      </button>
    </div>
  )
}

export default NotFound
