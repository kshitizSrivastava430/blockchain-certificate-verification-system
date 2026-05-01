const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../../data/certificates.json');

const getStore = () => {
  try {
    const dataDir = path.dirname(dataFile);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(dataFile)) {
      fs.writeFileSync(dataFile, JSON.stringify([]));
    }
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error("Error reading store", error);
    return [];
  }
};

const saveStore = (data) => {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
};

const addCertificate = (cert) => {
  const store = getStore();
  store.push({ ...cert, createdAt: new Date().toISOString() });
  saveStore(store);
};

const getCertificate = (id) => {
  const store = getStore();
  return store.find(c => c.certificateId === id);
};

const getAllCertificates = () => {
  return getStore().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const updateCertificateStatus = (id, revoked) => {
  const store = getStore();
  const index = store.findIndex(c => c.certificateId === id);
  if (index !== -1) {
    store[index].revoked = revoked;
    saveStore(store);
  }
};

module.exports = {
  addCertificate,
  getCertificate,
  getAllCertificates,
  updateCertificateStatus
};
