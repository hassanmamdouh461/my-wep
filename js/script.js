// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileMenuToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar Scroll Effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .course-card, .article-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Video Player functionality (for videos page)
if (document.querySelector('.video-player')) {
    const videoItems = document.querySelectorAll('.video-item');
    const mainVideo = document.querySelector('.video-player iframe') || document.querySelector('.video-player video');
    const videoTitle = document.querySelector('.video-info h2');
    const videoDescription = document.querySelector('.video-info p');

    videoItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            videoItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');
            
            // Update video source
            const videoSrc = item.dataset.video;
            const title = item.querySelector('h4').textContent;
            const description = item.querySelector('p').textContent;
            
            if (mainVideo.tagName === 'IFRAME') {
                mainVideo.src = videoSrc;
            } else {
                mainVideo.src = videoSrc;
            }
            
            if (videoTitle) videoTitle.textContent = title;
            if (videoDescription) videoDescription.textContent = description;
        });
    });
}

// Search functionality
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');

if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        performSearch();
    });
}

if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function performSearch() {
    const query = searchInput.value.trim();
    if (query) {
        console.log('Searching for:', query);
        // Add your search logic here
        // For now, just filtering visible cards
        filterContent(query);
    }
}

function filterContent(query) {
    const cards = document.querySelectorAll('.course-card, .article-card, .video-item');
    const lowerQuery = query.toLowerCase();
    
    cards.forEach(card => {
        const title = card.querySelector('h3, h4');
        const description = card.querySelector('p');
        
        if (title && description) {
            const titleText = title.textContent.toLowerCase();
            const descText = description.textContent.toLowerCase();
            
            if (titleText.includes(lowerQuery) || descText.includes(lowerQuery)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// Filter functionality for courses/videos/articles
const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filterValue = btn.dataset.filter;
        filterItemsByCategory(filterValue);
    });
});

function filterItemsByCategory(category) {
    const items = document.querySelectorAll('[data-category]');
    
    items.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// Contact Form Validation
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = contactForm.querySelector('input[name="name"]').value;
        const email = contactForm.querySelector('input[name="email"]').value;
        const message = contactForm.querySelector('textarea[name="message"]').value;
        
        if (validateForm(name, email, message)) {
            // Show success message
            showMessage('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', 'success');
            contactForm.reset();
        }
    });
}

function validateForm(name, email, message) {
    if (!name || name.trim().length < 3) {
        showMessage('الرجاء إدخال اسم صحيح', 'error');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        showMessage('الرجاء إدخال بريد إلكتروني صحيح', 'error');
        return false;
    }
    
    if (!message || message.trim().length < 10) {
        showMessage('الرجاء إدخال رسالة (10 أحرف على الأقل)', 'error');
        return false;
    }
    
    return true;
}

function showMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    
    // Insert message
    const form = document.querySelector('.contact-form');
    if (form) {
        form.insertAdjacentElement('beforebegin', messageDiv);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// Load more functionality
const loadMoreBtn = document.querySelector('.load-more-btn');
let currentPage = 1;

if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        loadMoreContent(currentPage);
    });
}

function loadMoreContent(page) {
    // Simulate loading more content
    console.log('Loading page:', page);
    // Add your API call or content loading logic here
}

// Initialize tooltips (if you add them later)
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = element.dataset.tooltip;
            document.body.appendChild(tooltip);
            
            const rect = element.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        });
        
        element.addEventListener('mouseleave', () => {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initTooltips();
    console.log('Website initialized successfully!');
});
