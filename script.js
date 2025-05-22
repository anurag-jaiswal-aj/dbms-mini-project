const API_BASE_URL = 'http://localhost:3000/api';

const challanForm = document.getElementById('challanForm');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const challansTableBody = document.getElementById('challansTableBody');

challanForm.addEventListener('submit', handleFormSubmit);
searchBtn.addEventListener('click', handleSearch);
document.addEventListener('DOMContentLoaded', loadChallans);

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        vehicleNumber: document.getElementById('vehicleNumber').value,
        ownerName: document.getElementById('ownerName').value,
        violationType: document.getElementById('violationType').value,
        amount: parseFloat(document.getElementById('amount').value),
        location: document.getElementById('location').value,
        date: document.getElementById('date').value,
        status: 'Pending'
    };

    try {
        const response = await fetch(`${API_BASE_URL}/challans`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Challan added successfully!');
            challanForm.reset();
            loadChallans();
        } else {
            throw new Error('Failed to add challan');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function loadChallans() {
    try {
        const response = await fetch(`${API_BASE_URL}/challans`);
        const challans = await response.json();
        displayChallans(challans);
    } catch (error) {
        console.error('Error loading challans:', error);
    }
}

async function handleSearch() {
    const vehicleNumber = searchInput.value.trim();
    if (!vehicleNumber) {
        loadChallans();
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/challans/search/${vehicleNumber}`);
        const challans = await response.json();
        displayChallans(challans);
    } catch (error) {
        console.error('Error searching challans:', error);
    }
}

function displayChallans(challans) {
    challansTableBody.innerHTML = '';
    
    challans.forEach(challan => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${challan.vehicleNumber}</td>
            <td>${challan.ownerName}</td>
            <td>${challan.violationType}</td>
            <td>₹${challan.amount}</td>
            <td>${challan.location}</td>
            <td>${new Date(challan.date).toLocaleDateString()}</td>
            <td class="${challan.status.toLowerCase() === 'paid' ? 'status-paid' : 'status-pending'}">
                ${challan.status}
            </td>
            <td>
                <button class="action-btn edit-btn" onclick="editChallan('${challan._id}')">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteChallan('${challan._id}')">Delete</button>
            </td>
        `;
        challansTableBody.appendChild(row);
    });
}

async function editChallan(id) {
    const newStatus = prompt('Enter new status (Paid/Pending):');
    if (!newStatus) return;

    try {
        const response = await fetch(`${API_BASE_URL}/challans/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
            alert('Challan updated successfully!');
            loadChallans();
        } else {
            throw new Error('Failed to update challan');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function deleteChallan(id) {
    if (!confirm('Are you sure you want to delete this challan?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/challans/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Challan deleted successfully!');
            loadChallans();
        } else {
            throw new Error('Failed to delete challan');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
} 