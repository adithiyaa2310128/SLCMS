const axios = require('axios');
const jwt = require('jsonwebtoken');

async function testAddStudent() {
    try {
        const token = jwt.sign({ id: 'test_user', role: 'Student' }, 'supersecretkey', { expiresIn: '1h' });

        const studentData = {
            name: "Test User " + Date.now(),
            email: "test" + Date.now() + "@example.com"
            // Intentionally missing other fields to test auto-generation
        };

        console.log("Sending data:", studentData);

        const response = await axios.post('http://localhost:3000/api/students', studentData, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("\n✅ Response Status:", response.status);
        console.log("✅ Response Data:", response.data);

        if (response.data.studentId && response.data.department === "General") {
            console.log("\n✅ Verification SUCCESS: Missing fields were auto-generated!");
        } else {
            console.log("\n❌ Verification FAILED: Fields not generated correctly.");
        }

    } catch (error) {
        if (error.response) {
            console.error("\n❌ Error Response:", error.response.status, error.response.data);
        } else {
            console.error("\n❌ Error:", error.message);
        }
    }
}

testAddStudent();
