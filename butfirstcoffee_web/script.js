document.addEventListener('DOMContentLoaded', function() {
    // Store coffee data globally
    let coffeeData = [];
    let cart = [];
    let notifications = [];
    
    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuPanel = document.getElementById('mobileMenuPanel');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const closeMenu = document.getElementById('closeMenu');
    const body = document.body;
    
    function openMobileMenu() {
        mobileMenuPanel.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        body.classList.add('menu-open');
    }
    
    function closeMobileMenu() {
        mobileMenuPanel.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        body.classList.remove('menu-open');
    }
    
    mobileMenu.addEventListener('click', function() {
        this.classList.toggle('active');
        if (this.classList.contains('active')) {
            openMobileMenu();
        } else {
            closeMobileMenu();
        }
    });
    
    closeMenu.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        closeMobileMenu();
    });
    
    mobileMenuOverlay.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        closeMobileMenu();
    });
    
    // Close mobile menu when clicking on a nav link
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            closeMobileMenu();
        });
    });
    
    // Theme Toggle
    const desktopThemeToggle = document.getElementById('desktopThemeToggle');
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or use default
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    
    function toggleTheme() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }
    
    desktopThemeToggle.addEventListener('click', toggleTheme);
    mobileThemeToggle.addEventListener('click', toggleTheme);
    
    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Active menu item based on scroll position
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        
        // Update desktop nav
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
        
        // Update mobile nav
        mobileNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Menu filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            filterMenuItems(filter);
        });
    });
    
    function filterMenuItems(filter) {
        const menuItems = document.querySelectorAll('.menu-item');
        
        // Filter menu items
        if (filter === 'all') {
            menuItems.forEach(item => {
                item.style.display = 'block';
            });
        } else {
            menuItems.forEach(item => {
                if (item.classList.contains(filter)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        }
    }
    
    // Load coffee menu from JSON
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            coffeeData = data;
            const menuContainer = document.getElementById('coffee-menu');
            
            data.forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.className = `menu-item ${item.category}`;
                
                menuItem.innerHTML = `
                    <div class="menu-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="menu-item-info">
                        <div class="menu-item-header">
                            <h3 class="menu-item-title">${item.name}</h3>
                            <span class="menu-item-price">$${item.price.toFixed(2)}</span>
                        </div>
                        <p class="menu-item-desc">${item.description}</p>
                        <div class="menu-item-tags">
                            ${item.tags.map(tag => `<span class="menu-item-tag">${tag}</span>`).join('')}
                        </div>
                        <div class="menu-item-actions">
                            <button class="add-to-cart" data-id="${item.id}">
                                <i class="fas fa-shopping-cart"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                `;
                
                menuContainer.appendChild(menuItem);
            });
            
            // Add event listeners to "Add to Cart" buttons
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', function() {
                    const id = parseInt(this.dataset.id);
                    addToCart(id);
                });
            });
        })
        .catch(error => {
            console.error('Error loading coffee menu:', error);
            document.getElementById('coffee-menu').innerHTML = '<p>Failed to load menu. Please try again later.</p>';
        });
    
    // Search functionality
    const desktopSearchInput = document.getElementById('desktopSearchInput');
    const desktopSearchBtn = document.getElementById('desktopSearchBtn');
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    const mobileSearchBtn = document.getElementById('mobileSearchBtn');
    const searchResults = document.getElementById('searchResults');
    const searchResultsList = document.getElementById('searchResultsList');
    const closeSearch = document.getElementById('closeSearch');
    
    desktopSearchBtn.addEventListener('click', function() {
        performSearch(desktopSearchInput.value);
    });
    
    mobileSearchBtn.addEventListener('click', function() {
        performSearch(mobileSearchInput.value);
    });
    
    desktopSearchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(desktopSearchInput.value);
        }
    });
    
    mobileSearchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(mobileSearchInput.value);
        }
    });
    
    closeSearch.addEventListener('click', function() {
        searchResults.classList.remove('active');
    });
    
    function performSearch(query) {
        query = query.trim().toLowerCase();
        
        if (query.length < 2) {
            showToast('Search Error', 'Please enter at least 2 characters', 'error');
            return;
        }
        
        const results = coffeeData.filter(item => 
            item.name.toLowerCase().includes(query) || 
            item.description.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query) ||
            item.tags.some(tag => tag.toLowerCase().includes(query))
        );
        
        displaySearchResults(results, query);
        
        // Close mobile menu if open
        if (mobileMenuPanel.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            closeMobileMenu();
        }
    }
    
    function displaySearchResults(results, query) {
        searchResultsList.innerHTML = '';
        
        if (results.length === 0) {
            searchResultsList.innerHTML = `<p class="empty-message">No results found for "${query}"</p>`;
        } else {
            results.forEach(item => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                
                resultItem.innerHTML = `
                    <div class="search-result-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="search-result-info">
                        <h4>${item.name}</h4>
                        <p>${item.description.substring(0, 80)}${item.description.length > 80 ? '...' : ''}</p>
                        <div class="search-result-price">$${item.price.toFixed(2)}</div>
                        <button class="btn btn-sm add-to-cart-search" data-id="${item.id}">Add to Cart</button>
                    </div>
                `;
                
                searchResultsList.appendChild(resultItem);
            });
            
            // Add event listeners to search result "Add to Cart" buttons
            document.querySelectorAll('.add-to-cart-search').forEach(button => {
                button.addEventListener('click', function() {
                    const id = parseInt(this.dataset.id);
                    addToCart(id);
                });
            });
        }
        
        searchResults.classList.add('active');
    }
    
    // Cart functionality
    function addToCart(id) {
        const item = coffeeData.find(coffee => coffee.id === id);
        
        if (!item) return;
        
        const existingItem = cart.find(cartItem => cartItem.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: 1
            });
        }
        
        updateCart();
        showToast('Added to Cart', `${item.name} has been added to your cart`);
        
        // Add notification
        addNotification('Item Added to Cart', `You added ${item.name} to your cart`);
    }
    
    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        updateCart();
    }
    
    function updateCart() {
        const desktopCartItems = document.getElementById('desktopCartItems');
        const mobileCartItems = document.getElementById('mobileCartItems');
        const desktopCartBadge = document.getElementById('desktopCartBadge');
        const mobileCartBadge = document.getElementById('mobileCartBadge');
        const desktopCartTotal = document.getElementById('desktopCartTotal');
        const mobileCartTotal = document.getElementById('mobileCartTotal');
        
        // Calculate total items and price
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Update cart badges
        desktopCartBadge.textContent = totalItems;
        mobileCartBadge.textContent = totalItems;
        
        // Update cart totals
        desktopCartTotal.textContent = `$${totalPrice.toFixed(2)}`;
        mobileCartTotal.textContent = `$${totalPrice.toFixed(2)}`;
        
        // Update desktop cart items
        if (cart.length === 0) {
            desktopCartItems.innerHTML = '<p class="empty-message">Your cart is empty</p>';
        } else {
            desktopCartItems.innerHTML = '';
            
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                
                cartItem.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <h4 class="cart-item-title">${item.name} x${item.quantity}</h4>
                        <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                    <div class="cart-item-remove" data-id="${item.id}">
                        <i class="fas fa-times"></i>
                    </div>
                `;
                
                desktopCartItems.appendChild(cartItem);
            });
        }
        
        // Update mobile cart items
        if (cart.length === 0) {
            mobileCartItems.innerHTML = '<p class="empty-message">Your cart is empty</p>';
        } else {
            mobileCartItems.innerHTML = '';
            
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                
                cartItem.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <h4 class="cart-item-title">${item.name} x${item.quantity}</h4>
                        <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                    <div class="cart-item-remove" data-id="${item.id}">
                        <i class="fas fa-times"></i>
                    </div>
                `;
                
                mobileCartItems.appendChild(cartItem);
            });
        }
        
        // Add event listeners to remove buttons in desktop cart
        document.querySelectorAll('#desktopCartItems .cart-item-remove').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                removeFromCart(id);
            });
        });
        
        // Add event listeners to remove buttons in mobile cart
        document.querySelectorAll('#mobileCartItems .cart-item-remove').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                removeFromCart(id);
            });
        });
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Load cart from localStorage
    function loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCart();
        }
    }
    
    // Notification functionality
    function addNotification(title, message) {
        const notification = {
            id: Date.now(),
            title,
            message,
            time: new Date().toLocaleTimeString()
        };
        
        notifications.unshift(notification);
        
        // Limit to 5 notifications
        if (notifications.length > 5) {
            notifications.pop();
        }
        
        updateNotifications();
    }
    
    function updateNotifications() {
        const desktopNotificationList = document.getElementById('desktopNotificationList');
        const mobileNotificationList = document.getElementById('mobileNotificationList');
        const desktopNotificationBadge = document.getElementById('desktopNotificationBadge');
        const mobileNotificationBadge = document.getElementById('mobileNotificationBadge');
        
        // Update notification badges
        desktopNotificationBadge.textContent = notifications.length;
        mobileNotificationBadge.textContent = notifications.length;
        
        // Update desktop notification list
        if (notifications.length === 0) {
            desktopNotificationList.innerHTML = '<p class="empty-message">No new notifications</p>';
        } else {
            desktopNotificationList.innerHTML = '';
            
            notifications.forEach(notification => {
                const notificationItem = document.createElement('div');
                notificationItem.className = 'notification-item';
                
                notificationItem.innerHTML = `
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${notification.time}</div>
                `;
                
                desktopNotificationList.appendChild(notificationItem);
            });
        }
        
        // Update mobile notification list
        if (notifications.length === 0) {
            mobileNotificationList.innerHTML = '<p class="empty-message">No new notifications</p>';
        } else {
            mobileNotificationList.innerHTML = '';
            
            notifications.forEach(notification => {
                const notificationItem = document.createElement('div');
                notificationItem.className = 'notification-item';
                
                notificationItem.innerHTML = `
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${notification.time}</div>
                `;
                
                mobileNotificationList.appendChild(notificationItem);
            });
        }
    }
    
    // Toast notification
    function showToast(title, message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastTitle = document.getElementById('toastTitle');
        const toastMessage = document.getElementById('toastMessage');
        const toastIcon = document.getElementById('toastIcon');
        
        toastTitle.textContent = title;
        toastMessage.textContent = message;
        
        if (type === 'error') {
            toastIcon.className = 'fas fa-times-circle error';
        } else {
            toastIcon.className = 'fas fa-check-circle';
        }
        
        toast.classList.add('show');
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send the data to a server
            // For this example, we'll just log it to the console
            console.log('Form submitted:', { name, email, subject, message });
            
            // Reset form
            contactForm.reset();
            
            // Show success message
            showToast('Message Sent', 'Thank you for your message! We will get back to you soon.');
            
            // Add notification
            addNotification('Message Sent', 'Your contact form has been submitted successfully');
        });
    }
    
    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get email value
            const email = this.querySelector('input[type="email"]').value;
            
            // Here you would typically send the data to a server
            console.log('Newsletter subscription:', email);
            
            // Reset form
            newsletterForm.reset();
            
            // Show success message
            showToast('Subscribed', 'Thank you for subscribing to our newsletter!');
            
            // Add notification
            addNotification('Newsletter', 'You have successfully subscribed to our newsletter');
        });
    }
    
    // Initialize
    loadCart();
    updateNotifications();
    
    // Add initial notification
    addNotification('Welcome', 'Welcome to But First, Coffee! Explore our menu and enjoy.');
});