const API_BASE = '/api/admin';

// Check Auth
const token = localStorage.getItem('adminToken');
if (!token) {
    window.location.href = 'login.html';
} else {
    document.getElementById('admin-name').innerText = localStorage.getItem('adminName') || 'Admin';
}

// Headers Helper
const getHeaders = () => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
});

// Tab Switching
window.showTab = (tabName, event) => {
    // Hide all
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(t => t.style.display = 'none');

    // Show target
    const target = document.getElementById(`tab-${tabName}`);
    if (target) target.style.display = 'block';

    // Update Active Nav
    // Remove active from all first
    document.querySelectorAll('.menu-item').forEach(n => n.classList.remove('active'));

    if (event && event.currentTarget) {
        // If event passed (click), use it
        event.currentTarget.classList.add('active');
    } else {
        // Fallback for initial load or manual calls
        // Find link with onclick containing the tabname
        const links = document.querySelectorAll('.menu-item');
        for (let link of links) {
            if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(`'${tabName}'`)) {
                link.classList.add('active');
                break;
            }
        }
    }

    // Load Data
    if (tabName === 'packages') loadPackages();
    if (tabName === 'enquiries') loadEnquiries();
    if (tabName === 'transports') loadTransports();
    if (tabName === 'reviews') loadReviews();
    if (tabName === 'profile') loadProfile();
};

// Initial Load
showTab('packages');

// --- PACKAGES ---
async function loadPackages() {
    try {
        const res = await fetch('/api/public/data'); // Use public data for list or admin specific?
        // Admin routes didn't have a 'get all packages' specifically documented in snippets, 
        // but typically public/data has them. Or admin/dashboard-data might.
        // Let's use dashboard-data to be safe? Or public.
        // Public is easiest as it returns everything.
        const res2 = await fetch('/api/public/data');
        const data = await res2.json();
        const tbody = document.getElementById('packages-table-body');
        tbody.innerHTML = '';

        data.packages.forEach(p => {
            const tr = document.createElement('tr');
            const offerBadge = p.offer && p.offer.text ?
                `<span class="badge badge-custom badge-bg-warning"><i class="fas fa-tag me-1"></i>${p.offer.percentage}% OFF</span>` :
                `<span class="badge badge-bg-light text-muted">No Offer</span>`;

            tr.innerHTML = `
                <td><img src="${p.images[0] || 'https://placehold.co/50'}" class="img-thumb"></td>
                <td class="fw-bold text-dark">${p.title}</td>
                <td class="d-none d-md-table-cell"><span class="badge badge-custom ${p.packageType === 'COUPLE' ? 'badge-bg-danger' : 'badge-bg-primary'}">${p.packageType}</span></td>
                <td class="fw-bold">₹${p.startingPrice || 0}</td>
                <td class="d-none d-md-table-cell">${offerBadge}</td>
                <td class="text-end">
                    <button class="btn-action btn-edit" onclick="editPackage('${p._id}')"><i class="fas fa-edit"></i></button>
                    <button class="btn-action btn-delete" onclick="deletePackage('${p._id}')"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) { console.error(e); }
}

window.openPackageModal = () => {
    document.getElementById('package-form').reset();
    document.getElementById('pkg-id').value = '';
    document.getElementById('pkg-img-file-status').innerText = ''; // Clear status
    document.getElementById('pkg-img-in').value = ''; // Ensure hidden is clear
    document.getElementById('pkg-modal-title').innerText = 'Add Package';
    bootstrap.Modal.getOrCreateInstance(document.getElementById('packageModal')).show();
};

window.editPackage = async (id) => {
    const res = await fetch('/api/public/data'); // Getting from public cache for simplicity
    const data = await res.json();
    const pkg = data.packages.find(p => p._id === id);
    if (pkg) {
        document.getElementById('pkg-id').value = pkg._id;
        document.getElementById('pkg-title-in').value = pkg.title;
        document.getElementById('pkg-type-in').value = pkg.packageType;
        document.getElementById('pkg-dest-in').value = pkg.destination;
        document.getElementById('pkg-price-in').value = pkg.startingPrice;
        document.getElementById('pkg-dur-in').value = pkg.duration;
        document.getElementById('pkg-img-in').value = pkg.images[0] || '';
        document.getElementById('pkg-itin-in').value = pkg.itinerary || '';
        document.getElementById('pkg-incl-in').value = pkg.inclusions || '';
        document.getElementById('pkg-excl-in').value = pkg.exclusions || '';

        if (pkg.offer) {
            document.getElementById('pkg-offer-text').value = pkg.offer.text || '';
            document.getElementById('pkg-offer-percent').value = pkg.offer.percentage || '';
        }

        document.getElementById('pkg-img-file-status').innerText = ''; // Clear status
        document.getElementById('pkg-img-file-status').innerText = ''; // Clear status
        document.getElementById('pkg-modal-title').innerText = 'Edit Package';
        bootstrap.Modal.getOrCreateInstance(document.getElementById('packageModal')).show();
    }
};

// Toast Notification
const showToast = (message, type = 'success') => {
    const colorClass = type === 'success' ? 'bg-success' : 'bg-danger';
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';

    const alertBox = document.createElement('div');
    alertBox.className = `position-fixed top-0 start-50 translate-middle-x mt-4 p-3 rounded-pill shadow-lg ${colorClass} text-white fw-bold`;
    alertBox.style.zIndex = '9999';
    alertBox.style.minWidth = '300px';
    alertBox.style.textAlign = 'center';
    alertBox.innerHTML = `<i class="fas ${icon} me-2"></i>${message}`;

    document.body.appendChild(alertBox);

    // Animation
    alertBox.animate([
        { transform: 'translate(-50%, -20px)', opacity: 0 },
        { transform: 'translate(-50%, 0)', opacity: 1 }
    ], { duration: 300, fill: 'forwards' });

    setTimeout(() => {
        alertBox.animate([
            { transform: 'translate(-50%, 0)', opacity: 1 },
            { transform: 'translate(-50%, -20px)', opacity: 0 }
        ], { duration: 300, fill: 'forwards' }).onfinish = () => alertBox.remove();
    }, 3000);
};

// Confirmation Modal Helper
window.showConfirm = (message, title, onConfirm) => {
    const modalEl = document.getElementById('confirmationModal');
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    document.getElementById('confirm-msg').innerText = message;
    document.getElementById('confirm-title').innerText = title || 'Are you sure?';

    // Clean up old listeners
    const btn = document.getElementById('confirm-btn-action');
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.onclick = () => {
        onConfirm();
        modal.hide();
    };

    modal.show();
};

// --- PACKAGES ---
// ... (loadPackages remains same) ...

document.getElementById('package-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const id = formData.get('id');

    // Construct Payload
    const payload = {
        title: formData.get('title'),
        packageType: formData.get('packageType'),
        destination: formData.get('destination'),
        startingPrice: formData.get('startingPrice'),
        duration: formData.get('duration'),
        // Simple 1 image for now
        images: [formData.get('image')],
        itinerary: formData.get('itinerary'),
        inclusions: formData.get('inclusions'),
        exclusions: formData.get('exclusions'),
        offer: {
            text: formData.get('offerText'),
            percentage: formData.get('offerPercent')
        }
    };

    const url = id ? `/api/admin/packages/${id}` : '/api/admin/packages';
    const method = id ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(payload) });
        if (res.ok) {
            bootstrap.Modal.getOrCreateInstance(document.getElementById('packageModal')).hide();
            loadPackages();
            showToast(id ? 'Package updated successfully' : 'Package created successfully');
        } else {
            showToast('Error saving package', 'error');
        }
    } catch (e) {
        showToast('Server error', 'error');
    }
});

window.deletePackage = async (id) => {
    showConfirm('Do you really want to delete this package?', 'Delete Package', async () => {
        try {
            const res = await fetch(`/api/admin/packages/${id}`, { method: 'DELETE', headers: getHeaders() });
            if (res.ok) {
                loadPackages();
                showToast('Package deleted successfully');
            } else {
                showToast('Failed to delete package', 'error');
            }
        } catch (e) {
            showToast('Server error during deletion', 'error');
        }
    });
};


// --- ENQUIRIES ---
async function loadEnquiries() {
    const res = await fetch('/api/admin/enquiries', { headers: getHeaders() });
    const enquiries = await res.json();
    const tbody = document.getElementById('enquiries-table-body');
    tbody.innerHTML = '';

    enquiries.forEach(e => {
        const tr = document.createElement('tr');
        // Handle displaying details based on type
        let details = '';
        if (e.packageId) details += `Pkg: ${e.packageId.title || 'Unknown'}<br>`;
        if (e.destination) details += `Dest: ${e.destination}<br>`;
        details += `Date: ${new Date(e.travelDate).toLocaleDateString()}<br>Pax: ${e.peopleCount}`;

        // Status Color
        const statusColor = e.status === 'PENDING' ? 'warning' : 'success';

        tr.innerHTML = `
            <td><span class="badge bg-${statusColor}" onclick="toggleStatus('${e._id}', '${e.status}')" style="cursor:pointer">${e.status}</span></td>
            <td>${e.enquiryType}</td>
            <td>${e.name}</td>
            <td class="d-none d-md-table-cell"><a href="tel:${e.phone}">${e.phone}</a></td>
            <td class="small text-muted d-none d-md-table-cell">${details}</td>
            <td>
                <a href="https://wa.me/91${e.phone}?text=Hi%20${e.name},%20regarding%20your%20${e.enquiryType}%20enquiry..." target="_blank" class="btn btn-sm btn-success"><i class="fab fa-whatsapp"></i> Chat</a>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.toggleStatus = async (id, current) => {
    const newStatus = current === 'PENDING' ? 'CONTACTED' : 'PENDING';
    await fetch(`/api/admin/enquiries/${id}`, {
        method: 'PUT', headers: getHeaders(),
        body: JSON.stringify({ status: newStatus })
    });
    loadEnquiries();
};


// --- TRASNPORTS ---
async function loadTransports() {
    const res = await fetch('/api/public/data');
    const data = await res.json();
    const grid = document.getElementById('transports-grid');
    grid.innerHTML = '';

    data.transports.forEach(t => {
        grid.innerHTML += `
            <div class="col-md-4 col-sm-6">
                <div class="card-custom h-100">
                    <div style="height: 150px; overflow:hidden;">
                         <img src="${t.image || 'https://placehold.co/400x300'}" style="width:100%; height:100%; object-fit:cover;">
                    </div>
                    <div class="p-3">
                        <div class="d-flex justify-content-between mb-2">
                            <h5 class="fw-bold text-dark">${t.name}</h5>
                            <button class="btn-action btn-delete text-danger bg-light" onclick="deleteTransport('${t._id}')"><i class="fas fa-trash"></i></button>
                        </div>
                        <div class="d-flex justify-content-between text-muted small">
                            <span><i class="fas fa-users me-1"></i>${t.capacity} Seats</span>
                            <span><i class="fas fa-road me-1"></i>₹${t.pricePerKm}/km</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

window.openTransportModal = () => {
    document.getElementById('transport-form').reset();
    document.getElementById('trans-img-file-status').innerText = '';
    document.getElementById('trans-img-file-status').innerText = '';
    bootstrap.Modal.getOrCreateInstance(document.getElementById('transportModal')).show();
};

document.getElementById('transport-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = Object.fromEntries(fd.entries());
    // remove id if empty
    if (!payload.id) delete payload.id; // wait, if creating, id is empty

    // Create Route
    await fetch('/api/admin/transports', {
        method: 'POST', headers: getHeaders(), body: JSON.stringify(payload)
    });
});
// Note: Update not fully implemented in UI for brevity, only Create/Delete
bootstrap.Modal.getOrCreateInstance(document.getElementById('transportModal')).hide();
loadTransports();
});

window.deleteTransport = async (id) => {
    showConfirm('This will remove the vehicle from your fleet.', 'Delete Vehicle', async () => {
        await fetch(`/api/admin/transports/${id}`, { method: 'DELETE', headers: getHeaders() });
        loadTransports();
        showToast('Vehicle deleted successfully');
    });
};


// --- REVIEWS ---
async function loadReviews() {
    const res = await fetch('/api/public/data');
    const data = await res.json();
    const grid = document.getElementById('reviews-grid');
    grid.innerHTML = '';

    data.reviews.forEach(r => {
        grid.innerHTML += `
            <div class="col-md-6">
                <div class="card-custom p-4 h-100">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                         <div class="d-flex align-items-center">
                            <div class="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" style="width:40px; height:40px; font-weight:bold; color:var(--primary-color);">
                                ${r.name.charAt(0)}
                            </div>
                            <div>
                                <h6 class="fw-bold mb-0 text-dark">${r.name}</h6>
                                <div class="text-warning small">${'★'.repeat(r.rating)}</div>
                            </div>
                         </div>
                         <button class="btn-action btn-delete" onclick="deleteReview('${r._id}')"><i class="fas fa-trash"></i></button>
                    </div>
                    <p class="text-muted fst-italic mb-0">"${r.comment}"</p>
                </div>
            </div>
        `;
    });
}

window.openReviewModal = () => {
    document.getElementById('review-form').reset();
    document.getElementById('rev-img-file-status').innerText = '';
    bootstrap.Modal.getOrCreateInstance(document.getElementById('reviewModal')).show();
};

document.getElementById('review-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = Object.fromEntries(fd.entries());

    try {
        await fetch('/api/admin/reviews', {
            method: 'POST', headers: getHeaders(), body: JSON.stringify(payload)
        });
        bootstrap.Modal.getOrCreateInstance(document.getElementById('reviewModal')).hide();
        loadReviews();
        showToast('Review added successfully');
    } catch (e) {
        showToast('Error adding review', 'error');
    }
});

window.deleteReview = async (id) => {
    showConfirm('Delete this review?', 'Delete Review', async () => {
        await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE', headers: getHeaders() });
        loadReviews();
        showToast('Review deleted successfully');
    });
};

// --- PROFILE ---
async function loadProfile() {
    const res = await fetch('/api/public/data');
    const data = await res.json();
    if (data.ownerProfile) {
        document.getElementById('prof-name').value = data.ownerProfile.name;
        document.getElementById('prof-desc').value = data.ownerProfile.description;
        document.getElementById('prof-phone').value = data.ownerProfile.phone;
        document.getElementById('prof-insta').value = data.ownerProfile.instagram;
        document.getElementById('prof-img').value = data.ownerProfile.photo || '';
    }
}

document.getElementById('profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = Object.fromEntries(fd.entries());

    await fetch('/api/admin/profile', {
        method: 'PUT', headers: getHeaders(), body: JSON.stringify(payload)
    });
    // Custom Success Alert
    const alertBox = document.createElement('div');
    alertBox.className = 'position-fixed top-0 start-50 translate-middle-x mt-4 p-3 rounded-pill shadow-lg bg-success text-white fw-bold';
    alertBox.style.zIndex = '9999';
    alertBox.innerHTML = '<i class="fas fa-check-circle me-2"></i>Profile Updated Successfully!';
    document.body.appendChild(alertBox);
    setTimeout(() => alertBox.remove(), 3000);
});

// --- CREATE ADMIN ---
document.getElementById('create-admin-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = Object.fromEntries(fd.entries());

    // Validate Password
    const pass = document.getElementById('new-admin-pass').value;
    const confirm = document.getElementById('new-admin-pass-confirm').value;

    if (pass !== confirm) {
        alert("Passwords do not match!");
        return;
    }

    try {
        const res = await fetch('/api/admin/create-admin', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok) {
            alert("New Admin Created Successfully!");
            e.target.reset();
            document.getElementById('admin-img-file-status').innerText = '';
        } else {
            alert(data.message || "Failed to create admin");
        }
    } catch (error) {
        console.error(error);
        alert("Error creating admin");
    }
});

window.logout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = 'login.html';
};
