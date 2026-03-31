import { useState, useEffect } from 'react';
import { 
  searchVehicle, 
  getAllParts, 
  addSparePart, 
  createMaintenanceRecord 
} from '../services/dashboard.service';
import Card from '../components/Card';
import Loader from '../components/Loader';
import './Dashboard.css'; // استيراد نفس الاستايل لتوحيد الشكل

const ManagerDashboard = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPlate, setSearchPlate] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [newPart, setNewPart] = useState({ partName: '', stockQuantity: '', price: '' });
  const [maintenanceRecord, setMaintenanceRecord] = useState({ vehicleId: '', description: '', cost: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });

  const showMessage = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 5000);
  };

  useEffect(() => { 
    fetchParts(); 
  }, []);

  const fetchParts = async () => {
    try {
      const response = await getAllParts();
      setParts(Array.isArray(response) ? response : []);
    } catch (err) { console.error("Parts Load Error:", err); }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', type: '' });
    try {
      const response = await searchVehicle(searchPlate.trim().toUpperCase());
      const vehicle = response.Vehicle || response.vehicle || response;
      if (vehicle && vehicle.licensePlate) {
        setSearchResult(vehicle);
        showMessage("Vehicle found!", "success");
      } else {
        setSearchResult(null);
        showMessage("Vehicle not found!", "error");
      }
    } catch (err) {
      setSearchResult(null);
      showMessage(`Search Failed: ${err.response?.data?.msg || "Error"}`, "error");
    } finally { setLoading(false); }
  };

  const handleAddPart = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addSparePart({
        ...newPart,
        stockQuantity: Number(newPart.stockQuantity),
        price: Number(newPart.price)
      });
      showMessage("Part Added! 📦", "success");
      setNewPart({ partName: '', stockQuantity: '', price: '' });
      fetchParts();
    } catch (err) { showMessage("Add Part Failed", "error"); }
    finally { setLoading(false); }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createMaintenanceRecord({ ...maintenanceRecord, cost: Number(maintenanceRecord.cost) });
      showMessage("Ticket Created! ✅", "success");
      setMaintenanceRecord({ vehicleId: '', description: '', cost: '' });
      setSearchResult(null);
    } catch (err) { showMessage("Ticket Creation Failed", "error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="dashboard-container">
      <Loader loading={loading} />
      <div className="dashboard-header">
        <h1>Manager Control Center</h1>
        <p>Operational Overview & Inventory Management</p>
      </div>

      {msg.text && (
        <div style={{
          padding: '10px', 
          background: msg.type === 'error' ? '#ff1744' : '#4caf50', 
          marginBottom: '15px', 
          borderRadius: '4px',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          {msg.text}
        </div>
      )}

      <div className="dashboard-grid">
        
        <Card title="🔍 Vehicle Search" className="card-booking">
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
            <input 
              placeholder="Ex: ABC123" 
              value={searchPlate} 
              onChange={(e) => setSearchPlate(e.target.value)} 
              required 
            />
            <button type="submit" style={{width: 'auto', padding: '0 20px', marginTop: 0}}>Search</button>
          </form>

          {searchResult && (
            <div className="list-item" style={{ marginTop: '20px' }}>
              <p><strong>Model:</strong> {searchResult.brand} {searchResult.model}</p>
              <p><strong>Plate:</strong> <span className="plate-badge">{searchResult.licensePlate}</span></p>
              <button 
                onClick={() => setMaintenanceRecord({ ...maintenanceRecord, vehicleId: searchResult._id })}
                style={{ filter: 'hue-rotate(180deg)', marginTop: '10px' }}
              >
                Use This Vehicle
              </button>
            </div>
          )}
        </Card>

        <Card title="📦 Inventory" className="card-my-vehicles">
          <form onSubmit={handleAddPart}>
            <input placeholder="Part Name" value={newPart.partName} onChange={(e) => setNewPart({ ...newPart, partName: e.target.value })} required />
            <input type="number" placeholder="Qty" value={newPart.stockQuantity} onChange={(e) => setNewPart({ ...newPart, stockQuantity: e.target.value })} required />
            <input type="number" placeholder="Price" value={newPart.price} onChange={(e) => setNewPart({ ...newPart, price: e.target.value })} required />
            <button type="submit">Add to Stock</button>
          </form>

          {parts && parts.length > 0 && (
            <div className="parts-mini-list" style={{ marginTop: '20px' }}>
              <h4 style={{ color: '#4caf50', marginBottom: '10px' }}>Current Stock:</h4>
              {parts.map((p, idx) => (
                <div key={idx} className="list-item" style={{ padding: '10px', marginBottom: '8px' }}>
                  • <strong>{p.name || p.partName}</strong> (Qty: {p.stockQuantity}) - {p.price} EGP
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="🛠️ Service Ticket" className="card-add-vehicle">
          <form onSubmit={handleCreateTicket}>
            <input 
              value={maintenanceRecord.vehicleId} 
              placeholder="Vehicle ID (Search First)" 
              readOnly 
              required 
            />
            <textarea 
              placeholder="What needs to be fixed?" 
              value={maintenanceRecord.description} 
              onChange={(e) => setMaintenanceRecord({ ...maintenanceRecord, description: e.target.value })} 
              required 
              style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid #333', marginBottom: '10px' }}
            />
            <input 
              type="number" 
              placeholder="Estimated Cost" 
              value={maintenanceRecord.cost} 
              onChange={(e) => setMaintenanceRecord({ ...maintenanceRecord, cost: e.target.value })} 
              required 
            />
            <button type="submit" disabled={!maintenanceRecord.vehicleId}>
              Create Ticket
            </button>
          </form>
        </Card>

      </div>
    </div>
  );
};

export default ManagerDashboard;