import API from './api';

// --- Vehicles (إضافة وبحث) ---
export const addVehicle = async (vehicleData) => {
  const response = await API.post('/vehicles/add', vehicleData);
  return response.data;
};

export const getMyVehicles = async () => {
  const response = await API.get('/vehicles/my-vehicles');
  return response.data;
};

export const searchVehicle = async (plate) => {
  // شغال تمام وبيجيب ABC123
  const response = await API.post('/vehicles/search', { licensePlate: plate });
  return response.data;
};

// --- Bookings ---
export const createBooking = async (bookingData) => {
  const response = await API.post('/bookings/create', bookingData);
  return response.data;
};

// --- Maintenance (تذاكر الصيانة) ---
export const createMaintenanceRecord = async (data) => {
  // التعديل الجوهري: الموديل عندك مستني "VehicleId" والـ V كابيتال
  const formattedData = {
    VehicleId: data.vehicleId, // القيمة اللي جاية من الفورم بنبعتها للاسم اللي السيرفر عاوزه
    description: data.description,
    cost: Number(data.cost) // التأكد إنها رقم عشان الجوي (Joi)
  };

  // المسار /maintenance مطابق لـ app.use("/api/maintenance")
  const response = await API.post('/maintenance/create', formattedData); 
  return response.data;
};

export const updateMaintenanceStatus = async (id, status) => {
  const response = await API.patch(`/maintenance/update-status/${id}`, { status });
  return response.data;
};

// --- Spare Parts (قطع الغيار) ---
export const addSparePart = async (partData) => {
  const response = await API.post('/parts/add', partData); 
  return response.data;
};

export const getAllParts = async () => {
  const response = await API.get('/parts/all');
  return response.data;
};