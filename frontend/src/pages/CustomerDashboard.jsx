import { useState, useEffect } from 'react';
import { getMyVehicles, addVehicle, createBooking } from '../services/dashboard.service';
import Card from '../components/Card';
import Loader from '../components/Loader';
import './Dashboard.css';

const CustomerDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [newVehicle, setNewVehicle] = useState({ model: '', make: '', plateNumber: '', year: '' });
  const [booking, setBooking] = useState({ date: '', serviceType: 'Maintenance', vehicleId: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });

  const showMessage = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 5000);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await getMyVehicles();
      setVehicles(data.vehicles || data || []);
    } catch (err) {
      setError('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      const vehicleToSave = {
        brand: newVehicle.make,
        model: newVehicle.model,
        year: Number(newVehicle.year),
        licensePlate: newVehicle.plateNumber.trim().toUpperCase() // Must be uppercase for backend search to work
      };
      await addVehicle(vehicleToSave);
      setNewVehicle({ model: '', make: '', plateNumber: '', year: '' });
      fetchVehicles(); 
      showMessage('Vehicle added successfully! 🎉', 'success');
    } catch (err) {
      showMessage(err.response?.data?.message || err.response?.data?.msg || 'Failed to add vehicle', 'error');
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!booking.vehicleId) {
      showMessage("Please select a vehicle!", "error");
      return;
    }
    try {
      const bookingPayload = {
        vehicleId: booking.vehicleId,
        appointmentDate: booking.date,
        notes: booking.serviceType
      };
      await createBooking(bookingPayload);
      
      setVehicles(prev => prev.map(v => 
        v._id === booking.vehicleId 
          ? { ...v, localBookings: [...(v.localBookings || []), bookingPayload] } 
          : v
      ));

      setBooking({ date: '', serviceType: 'Maintenance', vehicleId: '' });
      showMessage('Booking created successfully! 📅', 'success');
    } catch (err) {
      showMessage("Error: " + (err.response?.data?.message || 'Validation Error'), 'error');
    }
  };

  if (loading) return <Loader loading={loading} text="Loading Dashboard..." />;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Customer Dashboard</h1>
        <p>Welcome back! Manage your vehicles and bookings here.</p>
      </div>
      
      {error && <div className="err-msg" style={{padding: '10px', background: '#ff1744', marginBottom: '15px'}}>{error}</div>}
      {msg.text && (
        <div style={{
          padding: '10px', 
          background: msg.type === 'error' ? '#ff1744' : '#4caf50', 
          marginBottom: '15px', 
          borderRadius: '4px',
          fontWeight: 'bold'
        }}>
          {msg.text}
        </div>
      )}

      <div className="dashboard-grid">
        <Card title="My Vehicles" className="card-my-vehicles">
          {vehicles.length === 0 ? (
            <p>No vehicles found. Add one below!</p>
          ) : (
            vehicles.map(v => (
              <div key={v._id} className="list-item">
                <p><strong>{v.brand || v.make} {v.model}</strong> ({v.year})</p>
                <p>Plate: <span className="plate-badge">{v.licensePlate || v.plateNumber}</span></p>
                {v.maintenanceRecords && v.maintenanceRecords.length > 0 && (
                    <div className="maintenance-mini-list">
                      <strong style={{ color: '#ff1744' }}>Recent Services:</strong>
                      {v.maintenanceRecords.map(record => (
                        <div key={record._id}>• {record.description}: {record.cost} EGP</div>
                      ))}
                   </div>
                )}
                {v.localBookings && v.localBookings.length > 0 && (
                   <div className="maintenance-mini-list" style={{ marginTop: '10px' }}>
                      <strong style={{ color: '#4caf50' }}>Upcoming Bookings:</strong>
                      {v.localBookings.map((b, idx) => (
                        <div key={idx}>• {b.appointmentDate} - {b.notes}</div>
                      ))}
                   </div>
                )}
              </div>
            ))
          )}
        </Card>

        <Card title="Add New Vehicle" className="card-add-vehicle">
          <form onSubmit={handleAddVehicle}>
            <input type="text" placeholder="Make" value={newVehicle.make} onChange={(e) => setNewVehicle({...newVehicle, make: e.target.value})} required />
            <input type="text" placeholder="Model" value={newVehicle.model} onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})} required />
            <input type="number" placeholder="Year" value={newVehicle.year} onChange={(e) => setNewVehicle({...newVehicle, year: e.target.value})} required />
            <input type="text" placeholder="Plate Number" value={newVehicle.plateNumber} onChange={(e) => setNewVehicle({...newVehicle, plateNumber: e.target.value})} required />
            <button type="submit">Add Vehicle</button>
          </form>
        </Card>

        <Card title="Book an Appointment" className="card-booking">
          <form onSubmit={handleBooking}>
            <select value={booking.vehicleId} onChange={(e) => setBooking({...booking, vehicleId: e.target.value})} required>
              <option value="">Select Vehicle</option>
              {vehicles.map(v => (
                <option key={v._id} value={v._id}>{v.brand || v.make} {v.model}</option>
              ))}
            </select>
            <input type="date" value={booking.date} onChange={(e) => setBooking({...booking, date: e.target.value})} required />
            <select value={booking.serviceType} onChange={(e) => setBooking({...booking, serviceType: e.target.value})}>
              <option value="Maintenance">Maintenance</option>
              <option value="Repair">Repair</option>
              <option value="Inspection">Inspection</option>
            </select>
            <button type="submit">Schedule Booking</button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboard;