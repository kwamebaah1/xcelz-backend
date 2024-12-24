// Simulated in-memory "database"
const meetings = [];
const users = {
    '1': { id: '1', name: 'John Doe', availableSlots: ['9:00 AM', '2:00 PM'] },
    '2': { id: '2', name: 'Jane Smith', availableSlots: ['10:00 AM', '3:00 PM'] },
};

module.exports = { meetings, users };