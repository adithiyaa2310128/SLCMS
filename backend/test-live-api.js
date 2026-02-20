const axios = require('axios');
require('dotenv').config();

const testLiveApi = async () => {
    try {
        // We need a token. Let's login first or just try to hit it.
        // But the middleware will block us.
        // Let's just try to hit a route we know exists to see if the server is up.
        const res = await axios.get('http://localhost:3000/');
        console.log("Server Status:", res.data);

        // Now try the stats route.
        try {
            const statsRes = await axios.get('http://localhost:3000/api/dashboard/stats');
            console.log("Stats Response:", statsRes.data);
        } catch (e) {
            console.log("Stats Route Error (Expected if no token):", e.response?.status, e.response?.data);
        }
    } catch (err) {
        console.error("Connection Error:", err.message);
    }
};

testLiveApi();
