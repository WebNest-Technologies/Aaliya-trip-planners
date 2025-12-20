document.addEventListener('DOMContentLoaded', async () => {

    try {
        const response = await fetch('/api/public/data');
        const data = await response.json();

        if (response.ok) {
            window.siteData = data;
            renderPackages(data.packages);
            renderTransports(data.transports);
            renderReviews(data.reviews);
            renderOwnerProfile(data.ownerProfile);
        } else {
            console.error('Failed to load data:', data.message);
        }
    } catch (error) {
        console.error('Network error loading data:', error);
    }


    setupEnquiryForms();


    setupGlobalValidation();


    const navbar = document.querySelector('.navbar-premium');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }


    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('bookPackageId');
    if (bookId && window.siteData && window.siteData.packages) {
        const pkg = window.siteData.packages.find(p => p._id === bookId);
        if (pkg) {

            setTimeout(() => {
                openPackageModal(pkg._id, pkg.title, pkg.packageType, pkg.destination || pkg.title);

                window.history.replaceState({}, document.title, window.location.pathname);
            }, 500);
        }
    }


    // Couple Package Animation
    const coupleCard = document.querySelector('a[href="couple.html"]');
    if (coupleCard) {
        coupleCard.addEventListener('click', function (e) {
            e.preventDefault();
            this.classList.add('animating');
            setTimeout(() => {
                window.location.href = this.href;
            }, 600);
        });
    }
});


function setupGlobalValidation() {

    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('.date-picker').forEach(input => {
        input.setAttribute('min', today);
    });


    document.querySelectorAll('.phone-input').forEach(input => {
        input.addEventListener('input', (e) => {

            e.target.value = e.target.value.replace(/[^0-9]/g, '');


            if (e.target.value.length > 10) {
                e.target.value = e.target.value.slice(0, 10);
            }
        });
    });
}



function renderPackages(packages) {
    const coupleContainer = document.getElementById('couple-packages-container');
    const commonContainer = document.getElementById('common-packages-container');


    if (coupleContainer) {
        coupleContainer.innerHTML = '';
        const couplePackages = packages.filter(p => p.packageType === 'COUPLE');

        if (couplePackages.length === 0) {
            coupleContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="p-4 rounded-4 bg-light shadow-sm d-inline-block">
                        <i class="fas fa-heart text-danger fa-3x mb-3 opacity-75"></i>
                        <h5 class="fw-bold text-dark">Curating Romantic Getaways...</h5>
                        <p class="text-muted mb-3">We are currently crafting new exclusive experiences for couples.<br>Stay tuned for our upcoming packages!</p>
                        <a href="index#contact" class="btn btn-primary rounded-pill btn-sm px-4">Contact for Custom Plan</a>
                    </div>
                </div>`;
        } else {
            couplePackages.forEach(pkg => coupleContainer.innerHTML += createPackageCard(pkg));
        }
    }


    if (commonContainer) {
        commonContainer.innerHTML = '';
        const commonPackages = packages.filter(p => p.packageType === 'COMMON');

        if (commonPackages.length === 0) {
            commonContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="p-4 rounded-4 bg-light shadow-sm d-inline-block">
                        <i class="fas fa-users text-primary fa-3x mb-3 opacity-75"></i>
                        <h5 class="fw-bold text-dark">Planning New Adventures...</h5>
                        <p class="text-muted mb-3">We are working on exciting new group itineraries.<br>Check back soon for updates!</p>
                        <a href="index#contact" class="btn btn-primary rounded-pill btn-sm px-4">Enquire Now</a>
                    </div>
                </div>`;
        } else {
            commonPackages.forEach(pkg => commonContainer.innerHTML += createPackageCard(pkg));
        }
    }


    const popDestContainer = document.getElementById('popular-destinations-container');
    if (popDestContainer) {
        popDestContainer.innerHTML = '';

        const popularPackages = packages.filter(p => p.packageType === 'COMMON').slice(0, 4);

        if (popularPackages.length === 0) {
            popDestContainer.innerHTML = '<p class="text-center text-muted">No popular destinations to show right now.</p>';
        } else {
            popularPackages.forEach(pkg => {
                const image = (pkg.images && pkg.images.length > 0) ? pkg.images[0] : 'https://placehold.co/400x500/e67e22/ffffff?text=Dest';


                popDestContainer.innerHTML += `
                    <div class="col-6 col-md-3">
                        <div class="destination-card" onclick="openPackageModal('${pkg._id}', '${pkg.title}', 'COUPLE', '${pkg.destination || pkg.title}')">
                            <img src="${image}" alt="${pkg.title}">
                            <div class="destination-card-overlay">
                                <h5>${pkg.destination || pkg.title}</h5>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
    }
}

function createPackageCard(pkg) {
    const image = (pkg.images && pkg.images.length > 0) ? pkg.images[0] : 'https://placehold.co/400x300/e67e22/ffffff?text=Package';

    // Badge Logic
    let badgeHtml = '';
    let priceValue = `<span class="price-tag">₹${pkg.startingPrice || 'On Request'}</span>`;

    if (pkg.offer && pkg.offer.text) {
        badgeHtml = `<div class="listing-card-badge"><i class="fas fa-certificate me-1"></i>${pkg.offer.text}</div>`;

        if (pkg.startingPrice && pkg.offer.percentage) {
            const discountedPrice = Math.round(pkg.startingPrice * (1 - pkg.offer.percentage / 100));
            priceValue = `
                <div class="d-flex flex-column text-end">
                    <span class="text-muted text-decoration-line-through small" style="font-size: 0.8rem;">₹${pkg.startingPrice}</span>
                    <span class="price-tag text-danger">₹${discountedPrice}</span>
                </div>
            `;
        }
    }

    // Duration Label
    const durationHtml = pkg.duration ? `<div class="listing-card-label"><i class="fas fa-clock me-1"></i>${pkg.duration}</div>` : '';

    return `
        <div class="col-md-4 col-sm-6">
            <div class="listing-card">
                <div class="listing-card-img-wrapper">
                    ${badgeHtml}
                    <img src="${image}" class="listing-card-img" alt="${pkg.title}">
                    ${durationHtml}
                </div>
                <div class="listing-card-body">
                    <h5 class="listing-card-title">${pkg.title}</h5>
                    <p class="listing-card-location">
                        <i class="fas fa-map-marker-alt text-primary me-2"></i>${pkg.destination || 'Custom Location'}
                    </p>
                    
                    <div class="listing-card-price">
                        <div>
                            <span class="price-sub">Starting from</span>
                        </div>
                        ${priceValue}
                    </div>

                    <div class="listing-card-actions">
                        <button class="btn btn-outline-secondary rounded-pill btn-sm fw-bold" onclick="window.location.href='details?id=${pkg._id}'">
                            Details
                        </button>
                        <button class="btn btn-primary rounded-pill btn-sm fw-bold shadow-sm" onclick="openPackageModal('${pkg._id}', '${pkg.title}', '${pkg.packageType}', '${pkg.destination || pkg.title}')">
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderTransports(transports) {
    const container = document.getElementById('transport-container');
    const listContainer = document.getElementById('transports-list');

    if (!container) return;

    container.innerHTML = '';

    if (transports.length === 0) listContainer.style.display = 'none';

    transports.forEach(t => {
        const image = t.image || 'https://placehold.co/400x300/34495e/ffffff?text=Car';
        const cardHtml = `
            <div class="col-md-3 col-6">
                <div class="listing-card">
                    <div class="listing-card-img-wrapper" style="height: 180px;">
                        <img src="${image}" class="listing-card-img" alt="${t.name}">
                        <div class="listing-card-label"><i class="fas fa-users me-1"></i>${t.capacity} Seater</div>
                    </div>
                    <div class="listing-card-body p-3 text-center">
                        <h6 class="fw-bold mb-2 text-dark">${t.name}</h6>
                        <div class="mb-3">
                            <span class="price-tag" style="font-size: 1.1rem;">₹${t.pricePerKm || 0}</span>
                            <span class="text-muted small">/ km</span>
                        </div>
                        <button class="btn btn-primary rounded-pill btn-sm w-100 shadow-sm fw-bold" onclick="openTransportModal('${t._id}', '${t.name}')">
                            Book This Car
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += cardHtml;
    });
}

function renderReviews(reviews) {
    const container = document.getElementById('reviews-container');
    if (!container) return;
    container.innerHTML = '';

    reviews.forEach(review => {
        const stars = '<i class="fas fa-star text-warning"></i>'.repeat(Math.round(review.rating));
        const photo = review.customerPhoto ?
            `<img src="${review.customerPhoto}" class="rounded-circle mb-3 border border-3 border-white shadow-sm" style="width: 60px; height: 60px; object-fit: cover;">` :
            `<div class="rounded-circle mb-3 bg-secondary text-white d-flex align-items-center justify-content-center shadow-sm" style="width: 60px; height: 60px; margin: 0 auto; font-size: 1.5rem;">${review.name.charAt(0)}</div>`;

        const cardHtml = `
            <div class="swiper-slide h-auto">
                <div class="card border-0 shadow-sm h-100 p-4 text-center">
                    <div class="mt-n5 mb-3">
                        ${photo}
                    </div>
                    <div class="mb-3">
                        ${stars}
                    </div>
                    <p class="card-text text-muted fst-italic">"${review.comment}"</p>
                    <h6 class="fw-bold mt-auto">- ${review.name}</h6>
                </div>
            </div>
        `;
        container.innerHTML += cardHtml;
    });

    if (reviews.length === 0) {
        container.innerHTML = '<div class="swiper-slide"><p class="text-muted">No reviews yet.</p></div>';
    } else {

        new Swiper(".reviewSwiper", {
            slidesPerView: 1,
            spaceBetween: 30,
            centeredSlides: true,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            breakpoints: {
                0: {
                    slidesPerView: 1.2,
                    spaceBetween: 20,
                    effect: 'coverflow',
                    coverflowEffect: {
                        rotate: 0,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows: false,
                    },
                },
                576: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                    centeredSlides: false,
                    effect: 'slide',
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                    centeredSlides: false,
                    effect: 'slide',
                },
            },
        });
    }

    // Package Swiper removed - Replaced with Bento Grid Layout
}

function renderOwnerProfile(profile) {
    if (!profile) return;
    const nameEl = document.getElementById('owner-name');
    if (!nameEl) return;

    nameEl.innerText = profile.name;
    document.getElementById('owner-desc').innerText = profile.description;
    if (profile.photo) document.getElementById('owner-photo').src = profile.photo;


    const instaBtn = document.getElementById('owner-insta');
    if (profile.instagram) {
        instaBtn.href = profile.instagram.startsWith('http') ? profile.instagram : `https://instagram.com/${profile.instagram.replace('@', '')}`;
    } else {
        instaBtn.style.display = 'none';
    }

    const phoneBtn = document.getElementById('owner-phone');
    if (profile.phone) {
        phoneBtn.href = `tel:${profile.phone}`;
    } else {
        phoneBtn.style.display = 'none';
    }
}
















window.openPackageDetailsModal = (id) => {
    const pkg = window.siteData.packages.find(p => p._id === id);
    if (!pkg) return;

    document.getElementById('detail-modal-title').innerText = pkg.title;
    document.getElementById('detail-modal-price').innerText = pkg.startingPrice ? `₹${pkg.startingPrice}` : 'Best Price';


    const durEl = document.getElementById('detail-modal-duration');
    if (pkg.duration) {
        durEl.innerHTML = `<i class="fas fa-clock me-1"></i>${pkg.duration}`;
        durEl.style.display = 'inline';
    } else {
        durEl.style.display = 'none';
    }


    document.getElementById('detail-modal-itinerary').innerText = pkg.itinerary || 'Contact us for detailed itinerary.';
    document.getElementById('detail-modal-inclusions').innerText = pkg.inclusions || 'Standard inclusions apply.';
    document.getElementById('detail-modal-exclusions').innerText = pkg.exclusions || 'Standard exclusions apply.';


    const bookBtn = document.getElementById('detail-modal-book-btn');
    bookBtn.onclick = () => {
        bootstrap.Modal.getInstance(document.getElementById('packageDetailsModal')).hide();
        openPackageModal(pkg._id, pkg.title, pkg.packageType, pkg.destination || pkg.title);
    };

    new bootstrap.Modal(document.getElementById('packageDetailsModal')).show();
};


window.openPackageModal = (id, title, type, destination = '') => {
    document.getElementById('modal-package-id').value = id;
    document.getElementById('modal-package-title').innerText = title;
    document.getElementById('modal-package-type').value = type;


    document.querySelector('input[name="destination"]').value = destination;

    if (type === 'COUPLE') {
        document.querySelector('input[name="enquiryType"]').value = 'COUPLE_PACKAGE';


        const destGroup = document.getElementById('pkg-destination-group');
        destGroup.style.display = 'block';
        const destInput = destGroup.querySelector('input');
        destInput.setAttribute('required', 'true');
        if (destination) destInput.value = destination;


        document.getElementById('pkg-people-group').style.display = 'none';
        document.getElementById('pkg-people-input').removeAttribute('required');
        document.getElementById('pkg-people-input').value = 2;

    } else {
        document.querySelector('input[name="enquiryType"]').value = 'COMMON_PACKAGE';
        document.getElementById('modal-package-type').value = 'COMMON';


        document.getElementById('pkg-people-group').style.display = 'block';
        document.getElementById('pkg-people-input').setAttribute('required', 'true');
        document.getElementById('pkg-people-input').value = '';

        const destGroup = document.getElementById('pkg-destination-group');
        const destInput = destGroup.querySelector('input');

        if (destination) {
            destGroup.style.display = 'block';
            destInput.value = destination;
            destInput.setAttribute('readonly', 'true');
        } else {
            destGroup.style.display = 'none';
            destInput.removeAttribute('required');
            destInput.value = '';
            destInput.removeAttribute('readonly');
        }
    }

    new bootstrap.Modal(document.getElementById('packageEnquiryModal')).show();
};

window.openTransportModal = (id, name) => {
    document.getElementById('modal-transport-id').value = id;
    document.getElementById('modal-transport-name').innerText = `Booking Transport: ${name}`;
    new bootstrap.Modal(document.getElementById('transportEnquiryModal')).show();
};


function setupEnquiryForms() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());



            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = 'Sending...';
            btn.disabled = true;

            try {
                const res = await fetch('/api/public/enquiry', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (res.ok) {
                    document.querySelectorAll('.modal.show').forEach(m => {
                        const modalInstance = bootstrap.Modal.getInstance(m);
                        if (modalInstance) modalInstance.hide();
                    });


                    form.reset();



                    setTimeout(() => {
                        const successModalEl = document.getElementById('successModal');
                        if (successModalEl) {
                            const successModal = bootstrap.Modal.getOrCreateInstance(successModalEl);
                            successModal.show();
                        } else {
                            alert('Enquiry submitted successfully!');
                        }
                    }, 300);

                } else {
                    alert('Something went wrong. Please try again.');
                }
            } catch (error) {
                console.error(error);
                alert('Connection error. Please check your network.');
            } finally {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });
    });
}


window.selectCategory = (targetId, card) => {

    document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');



    const tabBtnId = targetId + '-tab';
    const tabBtn = document.getElementById(tabBtnId);
    if (tabBtn) {

        const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        tabBtn.dispatchEvent(clickEvent);
    }
};
