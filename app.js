// MANAS Foundation Website JavaScript - Fixed Version

// Application data and state
const profilesData = [
    {
        id: 1,
        name: "Meera Patel",
        age: 34,
        location: "Mumbai, Maharashtra",
        profession: "Teacher",
        education: "M.Ed",
        interests: "Reading, Gardening, Cooking",
        description: "Looking for a caring and understanding partner to share life's journey with.",
        status: "Widow",
        children: "1 daughter (8 years)",
        email: "meera.patel@email.com",
        phone: "+91-9876543210"
    },
    {
        id: 2,
        name: "Rajesh Kumar",
        age: 38,
        location: "Delhi, NCR",
        profession: "Software Engineer",
        education: "B.Tech",
        interests: "Travel, Music, Fitness",
        description: "Seeking a genuine connection with someone who values family and togetherness.",
        status: "Divorced",
        children: "No children",
        email: "rajesh.kumar@email.com",
        phone: "+91-9876543211"
    },
    {
        id: 3,
        name: "Sunita Singh",
        age: 29,
        location: "Pune, Maharashtra",
        profession: "Nurse",
        education: "B.Sc Nursing",
        interests: "Healthcare, Social work, Art",
        description: "Compassionate professional looking for a partner who shares similar values.",
        status: "Divorced",
        children: "No children",
        email: "sunita.singh@email.com",
        phone: "+91-9876543212"
    },
    {
        id: 4,
        name: "Amit Sharma",
        age: 42,
        location: "Bangalore, Karnataka",
        profession: "Business Owner",
        education: "MBA",
        interests: "Business, Sports, Family time",
        description: "Established professional seeking a life partner for companionship and shared happiness.",
        status: "Widower",
        children: "2 children (10, 12 years)",
        email: "amit.sharma@email.com",
        phone: "+91-9876543213"
    },
    {
        id: 5,
        name: "Kavita Reddy",
        age: 31,
        location: "Hyderabad, Telangana",
        profession: "Marketing Manager",
        education: "MBA Marketing",
        interests: "Photography, Travel, Movies",
        description: "Independent woman looking for a supportive and understanding life partner.",
        status: "Divorced",
        children: "1 son (5 years)",
        email: "kavita.reddy@email.com",
        phone: "+91-9876543214"
    },
    {
        id: 6,
        name: "Vikram Gupta",
        age: 36,
        location: "Chennai, Tamil Nadu",
        profession: "Doctor",
        education: "MBBS, MD",
        interests: "Medicine, Research, Classical music",
        description: "Medical professional seeking a caring partner to build a meaningful relationship.",
        status: "Divorced",
        children: "No children",
        email: "vikram.gupta@email.com",
        phone: "+91-9876543215"
    }
];

// Application state
let filteredProfiles = [...profilesData];
let selectedDonationAmount = null;
let currentPage = 'home';
let currentUser = null;
let isAuthenticated = false;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing MANAS Foundation Website...');
    initializeApp();
});

function initializeApp() {
    checkAuthenticationStatus();
    setupPageNavigation();
    setupMobileMenu();
    setupFormValidation();
    setupAuthenticationSystem();
    setupDonationForm();
    setupImageUpload();
    
    // Show home page by default
    showPage('home');
    
    // Initialize profiles data
    filteredProfiles = [...profilesData];
    
    console.log('App initialized successfully');
}

// Authentication System
function checkAuthenticationStatus() {
    try {
        const userData = localStorage.getItem('manasUser');
        if (userData) {
            currentUser = JSON.parse(userData);
            isAuthenticated = true;
            console.log('User authenticated:', currentUser.name);
        }
    } catch (e) {
        console.log('No valid user session found');
        localStorage.removeItem('manasUser');
    }
    updateAuthUI();
}

function updateAuthUI() {
    const authBtn = document.getElementById('authBtn');
    const myProfileLink = document.getElementById('myProfileLink');
    
    if (!authBtn) return;
    
    if (isAuthenticated && currentUser) {
        authBtn.textContent = 'Logout';
        authBtn.className = 'btn btn--secondary';
        
        if (myProfileLink) {
            myProfileLink.style.display = 'block';
            myProfileLink.textContent = `${currentUser.name}`;
        }
    } else {
        authBtn.textContent = 'Login';
        authBtn.className = 'btn btn--outline';
        
        if (myProfileLink) {
            myProfileLink.style.display = 'none';
        }
    }
}

function setupAuthenticationSystem() {
    const authBtn = document.getElementById('authBtn');
    if (authBtn) {
        authBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (isAuthenticated) {
                logout();
            } else {
                showLoginModal();
            }
        });
    }
    
    // Setup modal functionality
    const loginModal = document.getElementById('loginModal');
    const modalClose = document.querySelector('.modal-close');
    const loginForm = document.getElementById('loginForm');
    
    if (modalClose) {
        modalClose.addEventListener('click', hideLoginModal);
    }
    
    if (loginModal) {
        loginModal.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                hideLoginModal();
            }
        });
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
}

function showLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.classList.add('active');
    }
}

function hideLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.classList.remove('active');
        const form = document.getElementById('loginForm');
        if (form) form.reset();
    }
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Check registered users
    const registeredUsers = JSON.parse(localStorage.getItem('manasUsers') || '[]');
    const user = registeredUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        isAuthenticated = true;
        localStorage.setItem('manasUser', JSON.stringify(user));
        updateAuthUI();
        hideLoginModal();
        showSuccessMessage(`Welcome back, ${user.name}!`);
    } else {
        showErrorMessage('Invalid email or password. Please try again.');
    }
}

function logout() {
    currentUser = null;
    isAuthenticated = false;
    localStorage.removeItem('manasUser');
    updateAuthUI();
    showSuccessMessage('Logged out successfully.');
    
    if (currentPage === 'profile') {
        showPage('home');
    }
}

// Page Navigation
function setupPageNavigation() {
    const navLinks = document.querySelectorAll('[data-page]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            
            // Check authentication for protected pages
            if ((targetPage === 'profile' || targetPage === 'profiles') && !isAuthenticated) {
                showErrorMessage('Please login to access this page.');
                showLoginModal();
                return;
            }
            
            showPage(targetPage);
        });
    });
}

function showPage(pageName) {
    console.log('Navigating to page:', pageName);
    
    // Hide all pages
    const allPages = document.querySelectorAll('.page-content');
    allPages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(`${pageName}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageName;
        
        // Update navigation
        updateActiveNavLink(pageName);
        closeMobileMenu();
        window.scrollTo(0, 0);
        
        // Initialize page-specific content
        setTimeout(() => {
            if (pageName === 'profiles') {
                setupProfileFiltering();
                renderProfiles();
            } else if (pageName === 'profile' && isAuthenticated) {
                renderUserProfile();
            }
        }, 100);
        
        console.log('Successfully navigated to:', pageName);
    } else {
        console.error('Page not found:', pageName);
    }
}

function updateActiveNavLink(pageName) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[data-page="${pageName}"].nav-link`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Mobile Menu
function setupMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('mobile-menu-open');
            this.classList.toggle('active');
        });
    }
}

function closeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navLinks && mobileMenuToggle) {
        navLinks.classList.remove('mobile-menu-open');
        mobileMenuToggle.classList.remove('active');
    }
}

// Profile System
function renderUserProfile() {
    if (!currentUser) return;
    
    const profileDisplay = document.getElementById('profileDisplay');
    if (profileDisplay) {
        profileDisplay.innerHTML = `
            <div class="profile-card">
                <div class="profile-avatar">
                    ${currentUser.profileImage ? 
                        `<img src="${currentUser.profileImage}" alt="${currentUser.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;">` 
                        : currentUser.name.charAt(0).toUpperCase()
                    }
                </div>
                <div class="profile-content">
                    <div class="profile-header">
                        <h2 class="profile-name">${currentUser.name}</h2>
                        <div class="profile-basic-info">
                            <span>${currentUser.age} years</span>
                            <span>•</span>
                            <span>${currentUser.status}</span>
                        </div>
                        <div class="profile-location">${currentUser.location || `${currentUser.city}, ${currentUser.state}`}</div>
                    </div>
                    
                    <div class="profile-details">
                        <div class="profile-detail">
                            <strong>Email:</strong>
                            <span>${currentUser.email}</span>
                        </div>
                        <div class="profile-detail">
                            <strong>Phone:</strong>
                            <span>${currentUser.phone}</span>
                        </div>
                        <div class="profile-detail">
                            <strong>Profession:</strong>
                            <span>${currentUser.profession}</span>
                        </div>
                        <div class="profile-detail">
                            <strong>Education:</strong>
                            <span>${currentUser.education}</span>
                        </div>
                        <div class="profile-detail">
                            <strong>Interests:</strong>
                            <span>${currentUser.interests || 'Not specified'}</span>
                        </div>
                    </div>
                    
                    ${currentUser.description ? `<p class="profile-description">${currentUser.description}</p>` : ''}
                    
                    <div class="profile-status">${currentUser.status}</div>
                </div>
            </div>
        `;
    }
    
    // Setup edit profile functionality
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
        editProfileBtn.onclick = function() {
            toggleProfileEdit();
        };
    }
    
    renderUserInterests();
    renderReceivedInterests();
    setupProfileTabs();
}

function setupProfileTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    if (tabName === 'interests') {
        renderUserInterests();
    } else if (tabName === 'received') {
        renderReceivedInterests();
    }
}

function renderUserInterests() {
    const container = document.getElementById('myInterests');
    if (!container || !currentUser) return;
    
    const userInterests = JSON.parse(localStorage.getItem(`interests_${currentUser.email}`) || '[]');
    
    if (userInterests.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h3>No interests expressed yet</h3>
                <p>Browse profiles and express interest to see them here.</p>
                <button class="btn btn--primary" onclick="showPage('profiles')">Browse Profiles</button>
            </div>
        `;
    } else {
        const interestProfiles = userInterests.map(interestId => 
            profilesData.find(p => p.id === interestId)
        ).filter(Boolean);
        
        container.innerHTML = `
            <div class="profiles-grid">
                ${interestProfiles.map(profile => createProfileCard(profile, true)).join('')}
            </div>
        `;
    }
}

function renderReceivedInterests() {
    const container = document.getElementById('receivedInterests');
    if (!container || !currentUser) return;
    
    container.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <h3>No interests received yet</h3>
            <p>When someone expresses interest in your profile, they will appear here.</p>
        </div>
    `;
}

function toggleProfileEdit() {
    const profileDisplay = document.getElementById('profileDisplay');
    const profileEdit = document.getElementById('profileEdit');
    const editBtn = document.getElementById('editProfileBtn');
    
    if (profileDisplay.classList.contains('hidden')) {
        profileDisplay.classList.remove('hidden');
        profileEdit.classList.add('hidden');
        editBtn.textContent = 'Edit Profile';
    } else {
        setupEditForm();
        profileDisplay.classList.add('hidden');
        profileEdit.classList.remove('hidden');
        editBtn.textContent = 'View Profile';
    }
}

function setupEditForm() {
    const profileEdit = document.getElementById('profileEdit');
    if (!profileEdit || !currentUser) return;
    
    profileEdit.innerHTML = `
        <form id="editProfileForm">
            <div class="form-section">
                <h3>Personal Information</h3>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">Full Name *</label>
                        <input type="text" id="editName" class="form-control" value="${currentUser.name}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Age *</label>
                        <input type="number" id="editAge" class="form-control" value="${currentUser.age}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Profession *</label>
                        <input type="text" id="editProfession" class="form-control" value="${currentUser.profession}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Education *</label>
                        <input type="text" id="editEducation" class="form-control" value="${currentUser.education}" required>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Interests</label>
                    <input type="text" id="editInterests" class="form-control" value="${currentUser.interests || ''}" placeholder="e.g., Reading, Gardening, Music">
                </div>
                <div class="form-group">
                    <label class="form-label">Personal Description</label>
                    <textarea id="editDescription" class="form-control" rows="4">${currentUser.description || ''}</textarea>
                </div>
            </div>
            
            <div style="display: flex; gap: 16px; justify-content: flex-end; margin-top: 24px;">
                <button type="button" class="btn btn--outline" onclick="toggleProfileEdit()">Cancel</button>
                <button type="submit" class="btn btn--primary">Save Changes</button>
            </div>
        </form>
    `;
    
    const editForm = document.getElementById('editProfileForm');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleProfileUpdate();
        });
    }
}

function handleProfileUpdate() {
    const formData = {
        name: document.getElementById('editName').value,
        age: parseInt(document.getElementById('editAge').value),
        profession: document.getElementById('editProfession').value,
        education: document.getElementById('editEducation').value,
        interests: document.getElementById('editInterests').value,
        description: document.getElementById('editDescription').value
    };
    
    // Update current user
    currentUser = { ...currentUser, ...formData };
    
    // Update localStorage
    localStorage.setItem('manasUser', JSON.stringify(currentUser));
    
    // Update registered users list
    const registeredUsers = JSON.parse(localStorage.getItem('manasUsers') || '[]');
    const userIndex = registeredUsers.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        registeredUsers[userIndex] = currentUser;
        localStorage.setItem('manasUsers', JSON.stringify(registeredUsers));
    }
    
    renderUserProfile();
    toggleProfileEdit();
    showSuccessMessage('Profile updated successfully!');
    updateAuthUI();
}

// Profile Browsing
function setupProfileFiltering() {
    const locationFilter = document.getElementById('locationFilter');
    const ageFilter = document.getElementById('ageFilter');
    const professionFilter = document.getElementById('professionFilter');
    const searchInput = document.getElementById('searchProfiles');

    if (locationFilter) {
        locationFilter.addEventListener('change', applyFilters);
    }
    if (ageFilter) {
        ageFilter.addEventListener('change', applyFilters);
    }
    if (professionFilter) {
        professionFilter.addEventListener('change', applyFilters);
    }
    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 300));
    }
}

function applyFilters() {
    const locationFilter = document.getElementById('locationFilter');
    const ageFilter = document.getElementById('ageFilter');
    const professionFilter = document.getElementById('professionFilter');
    const searchInput = document.getElementById('searchProfiles');

    const locationValue = locationFilter ? locationFilter.value : '';
    const ageValue = ageFilter ? ageFilter.value : '';
    const professionValue = professionFilter ? professionFilter.value : '';
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

    const registeredUsers = JSON.parse(localStorage.getItem('manasUsers') || '[]');
    const allProfiles = [...profilesData, ...registeredUsers.filter(u => u.email !== currentUser?.email)];

    filteredProfiles = allProfiles.filter(profile => {
        if (locationValue && !profile.location.includes(locationValue)) {
            return false;
        }

        if (ageValue) {
            const [minAge, maxAge] = ageValue.split('-').map(Number);
            if (profile.age < minAge || profile.age > maxAge) {
                return false;
            }
        }

        if (professionValue && !profile.profession.toLowerCase().includes(professionValue.toLowerCase())) {
            return false;
        }

        if (searchTerm) {
            const searchableText = `${profile.name} ${profile.location} ${profile.profession} ${profile.interests} ${profile.description}`.toLowerCase();
            if (!searchableText.includes(searchTerm)) {
                return false;
            }
        }

        return true;
    });

    renderProfiles();
}

function renderProfiles() {
    const profilesGrid = document.getElementById('profilesGrid');
    if (!profilesGrid) return;

    if (filteredProfiles.length === 0) {
        profilesGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <h3>No profiles found</h3>
                <p>Try adjusting your search criteria to find more matches.</p>
                <button class="btn btn--outline" onclick="clearFilters()">Clear All Filters</button>
            </div>
        `;
        return;
    }

    profilesGrid.innerHTML = filteredProfiles.map(profile => createProfileCard(profile)).join('');
}

function createProfileCard(profile, showInterestStatus = false) {
    const userInterests = currentUser ? JSON.parse(localStorage.getItem(`interests_${currentUser.email}`) || '[]') : [];
    const hasExpressedInterest = userInterests.includes(profile.id);
    
    return `
        <div class="profile-card">
            <div class="profile-avatar">
                ${profile.profileImage ? 
                    `<img src="${profile.profileImage}" alt="${profile.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;">` 
                    : profile.name.charAt(0).toUpperCase()
                }
            </div>
            <div class="profile-content">
                <div class="profile-header">
                    <h3 class="profile-name">${profile.name}</h3>
                    <div class="profile-basic-info">
                        <span>${profile.age} years</span>
                        <span>•</span>
                        <span>${profile.status}</span>
                    </div>
                    <div class="profile-location">${profile.location}</div>
                </div>
                
                <div class="profile-details">
                    <div class="profile-detail">
                        <strong>Profession:</strong>
                        <span>${profile.profession}</span>
                    </div>
                    <div class="profile-detail">
                        <strong>Education:</strong>
                        <span>${profile.education}</span>
                    </div>
                    <div class="profile-detail">
                        <strong>Interests:</strong>
                        <span>${profile.interests || 'Not specified'}</span>
                    </div>
                </div>
                
                ${profile.description ? `<p class="profile-description">${profile.description}</p>` : ''}
                
                <div class="profile-status">${profile.status}</div>
                
                ${isAuthenticated ? `
                    <button class="btn ${hasExpressedInterest ? 'btn--secondary' : 'btn--primary'} btn--full-width" onclick="showInterest(${profile.id})" ${hasExpressedInterest ? 'disabled' : ''}>
                        ${hasExpressedInterest ? 'Interest Expressed ✓' : 'Express Interest'}
                    </button>
                ` : `
                    <button class="btn btn--outline btn--full-width" onclick="showLoginRequired()">
                        Login to Express Interest
                    </button>
                `}
            </div>
        </div>
    `;
}

function clearFilters() {
    const locationFilter = document.getElementById('locationFilter');
    const ageFilter = document.getElementById('ageFilter');
    const professionFilter = document.getElementById('professionFilter');
    const searchInput = document.getElementById('searchProfiles');

    if (locationFilter) locationFilter.value = '';
    if (ageFilter) ageFilter.value = '';
    if (professionFilter) professionFilter.value = '';
    if (searchInput) searchInput.value = '';
    
    applyFilters();
}

function showInterest(profileId) {
    if (!isAuthenticated) {
        showLoginRequired();
        return;
    }
    
    const profile = [...profilesData, ...JSON.parse(localStorage.getItem('manasUsers') || '[]')].find(p => p.id === profileId);
    if (profile) {
        const userInterests = JSON.parse(localStorage.getItem(`interests_${currentUser.email}`) || '[]');
        if (!userInterests.includes(profileId)) {
            userInterests.push(profileId);
            localStorage.setItem(`interests_${currentUser.email}`, JSON.stringify(userInterests));
        }
        
        showSuccessMessage(`Interest expressed in ${profile.name}'s profile! Our team will contact you within 48 hours.`);
        
        if (currentPage === 'profiles') {
            renderProfiles();
        }
    }
}

function showLoginRequired() {
    showErrorMessage('Please login or register to express interest.');
    showLoginModal();
}

// Form Validation
function setupFormValidation() {
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateRegistrationForm()) {
                handleRegistration();
            }
        });
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateContactForm()) {
                showSuccessMessage('Thank you for your message! We will get back to you within 24 hours.');
                contactForm.reset();
            }
        });
    }
}

function validateRegistrationForm() {
    const form = document.getElementById('registrationForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        }
    });

    const privacyAccept = form.querySelector('#privacyAccept');
    if (!privacyAccept.checked) {
        showFieldError(privacyAccept, 'You must accept the privacy policy');
        isValid = false;
    }

    if (!isValid) {
        showErrorMessage('Please fill in all required fields.');
    }

    return isValid;
}

function validateContactForm() {
    const form = document.getElementById('contactForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        }
    });

    if (!isValid) {
        showErrorMessage('Please fill in all required fields.');
    }

    return isValid;
}

function handleRegistration() {
    const form = document.getElementById('registrationForm');
    const formData = new FormData(form);
    
    const newUser = {
        id: Date.now(),
        name: formData.get('fullName'),
        age: parseInt(formData.get('age')),
        city: formData.get('city'),
        state: formData.get('state'),
        location: `${formData.get('city')}, ${formData.get('state')}`,
        profession: formData.get('profession'),
        education: formData.get('education'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        status: formData.get('maritalStatus').charAt(0).toUpperCase() + formData.get('maritalStatus').slice(1),
        interests: formData.get('interests') || '',
        description: formData.get('description') || '',
        password: formData.get('password'),
        registeredAt: new Date().toISOString()
    };
    
    // Handle profile image
    const imagePreview = document.getElementById('imagePreview');
    const imageEl = imagePreview ? imagePreview.querySelector('img') : null;
    if (imageEl) {
        newUser.profileImage = imageEl.src;
    }
    
    // Check if email exists
    const registeredUsers = JSON.parse(localStorage.getItem('manasUsers') || '[]');
    if (registeredUsers.find(u => u.email === newUser.email)) {
        showErrorMessage('An account with this email already exists.');
        return;
    }
    
    // Save user
    registeredUsers.push(newUser);
    localStorage.setItem('manasUsers', JSON.stringify(registeredUsers));
    
    // Auto-login
    currentUser = newUser;
    isAuthenticated = true;
    localStorage.setItem('manasUser', JSON.stringify(newUser));
    updateAuthUI();
    
    showSuccessMessage('Registration successful! Welcome to MANAS Foundation!');
    form.reset();
    
    // Clear image preview
    if (imagePreview) imagePreview.innerHTML = '';
    
    setTimeout(() => {
        showPage('profile');
    }, 1500);
}

// Image Upload
function setupImageUpload() {
    const imageInput = document.getElementById('profileImage');
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            handleImagePreview(e, 'imagePreview');
        });
    }
}

function handleImagePreview(event, previewId) {
    const file = event.target.files[0];
    const preview = document.getElementById(previewId);
    
    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            showErrorMessage('File size must be less than 5MB');
            event.target.value = '';
            return;
        }
        
        if (!file.type.startsWith('image/')) {
            showErrorMessage('Please select a valid image file');
            event.target.value = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 150px; max-height: 150px; border-radius: 8px; border: 2px solid var(--color-border);">`;
        };
        reader.readAsDataURL(file);
    }
}

// Donation System
function setupDonationForm() {
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.getElementById('customAmount');
    const donateBtn = document.getElementById('donateBtn');

    amountButtons.forEach(button => {
        button.addEventListener('click', function() {
            amountButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            selectedDonationAmount = this.dataset.amount;
            
            if (customAmountInput) {
                customAmountInput.value = '';
            }
        });
    });

    if (customAmountInput) {
        customAmountInput.addEventListener('input', function() {
            amountButtons.forEach(btn => btn.classList.remove('active'));
            selectedDonationAmount = this.value;
        });
    }

    if (donateBtn) {
        donateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!selectedDonationAmount || selectedDonationAmount <= 0) {
                showErrorMessage('Please select or enter a donation amount');
                return;
            }

            const frequencyRadio = document.querySelector('input[name="frequency"]:checked');
            const frequency = frequencyRadio ? frequencyRadio.value : 'onetime';
            showSuccessMessage(`Thank you for your generous ${frequency} donation of ₹${selectedDonationAmount}!`);
        });
    }
}

// Utility Functions
function showFieldError(field, message) {
    clearFieldError(field);
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.style.cssText = `
        color: var(--color-error);
        font-size: var(--font-size-sm);
        margin-top: var(--space-4);
    `;
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
    field.style.borderColor = 'var(--color-error)';
}

function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '';
}

function showSuccessMessage(message) {
    showNotification(message, 'success');
}

function showErrorMessage(message) {
    showNotification(message, 'error');
}

function showNotification(message, type = 'success') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--color-success)' : 'var(--color-error)'};
        color: var(--color-btn-primary-text);
        padding: var(--space-16) var(--space-20);
        border-radius: var(--radius-base);
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        max-width: 400px;
        cursor: pointer;
        animation: slideIn 0.3s ease-out;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, type === 'success' ? 5000 : 7000);

    notification.addEventListener('click', function() {
        if (this.parentNode) {
            this.remove();
        }
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .field-error {
        animation: fadeIn 0.2s ease-out;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-5px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

console.log('MANAS Foundation Website JavaScript loaded successfully');