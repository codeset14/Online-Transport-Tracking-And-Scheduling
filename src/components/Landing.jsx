import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <section className="landing-section">
      <h1>Welcome to BusTracker</h1>
      <p>Select your role to continue</p>
      <div className="role-cards">
        <div className="role-card" onClick={() => navigate('/user')}>
          <h2>User</h2>
          <p>Track buses & book tickets</p>
        </div>
        <div className="role-card" onClick={() => navigate('/driver')}>
          <h2>Driver</h2>
          <p>Manage your assigned buses</p>
        </div>
        <div className="role-card" onClick={() => navigate('/admin')}>
          <h2>Admin</h2>
          <p>Manage all buses & bookings</p>
        </div>
      </div>
    </section>
  );
}
