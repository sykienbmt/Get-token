// Email Management Application
class EmailApp {
    constructor() {
        this.currentEmail = '';
        this.emails = [];
        this.isLoading = false;
        this.selectedEmail = null;
        
        this.initializeElements();
        this.attachEventListeners();
    }

    // Initialize DOM elements
    initializeElements() {
        this.elements = {
            form: document.getElementById('emailForm'),
            emailInput: document.getElementById('emailInput'),
            checkButton: document.getElementById('checkButton'),
            errorMessage: document.getElementById('errorMessage'),
            statusInfo: document.getElementById('statusInfo'),
            currentEmail: document.getElementById('currentEmail'),
            loadingState: document.getElementById('loadingState'),
            emailList: document.getElementById('emailList'),
            emptyState: document.getElementById('emptyState'),
            emailContainer: document.getElementById('emailContainer'),
            emailCount: document.getElementById('emailCount'),
            emailText: document.getElementById('emailText'),
            
            // Modal elements
            emailModal: document.getElementById('emailModal'),
            closeModal: document.getElementById('closeModal'),
            modalSubject: document.getElementById('modalSubject'),
            modalFrom: document.getElementById('modalFrom'),
            modalDate: document.getElementById('modalDate'),
            modalAttachments: document.getElementById('modalAttachments'),
            modalAttachmentCount: document.getElementById('modalAttachmentCount'),
            modalIframe: document.getElementById('modalIframe'),
            modalText: document.getElementById('modalText')
        };
    }

    // Attach event listeners
    attachEventListeners() {
        this.elements.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.elements.closeModal.addEventListener('click', () => this.closeModal());
        
        // Close modal when clicking outside
        this.elements.emailModal.addEventListener('click', (e) => {
            if (e.target === this.elements.emailModal) {
                this.closeModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.elements.emailModal.style.display !== 'none') {
                this.closeModal();
            }
        });
    }

    // Handle form submission
    async handleSubmit(event) {
        event.preventDefault();
        
        const email = this.elements.emailInput.value.trim();
        
        if (!email) {
            this.showError('Vui lòng nhập địa chỉ email');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showError('Vui lòng nhập địa chỉ email hợp lệ');
            return;
        }

        await this.fetchEmails(email);
    }

    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show error message
    showError(message) {
        this.elements.errorMessage.textContent = message;
        this.elements.errorMessage.style.display = 'block';
    }

    // Hide error message
    hideError() {
        this.elements.errorMessage.style.display = 'none';
    }

    // Set loading state
    setLoadingState(loading) {
        this.isLoading = loading;
        this.elements.checkButton.disabled = loading;
        this.elements.emailInput.disabled = loading;
        
        if (loading) {
            this.elements.checkButton.innerHTML = `
                <div class="spinner" style="width: 20px; height: 20px; display: inline-block; margin-right: 10px;"></div>
                Đang kiểm tra...
            `;
        } else {
            this.elements.checkButton.textContent = 'Kiểm tra hộp thư';
        }
    }

    // Hash email using MD5
    hashEmail(email) {
        return CryptoJS.MD5(email).toString();
    }

    // Fetch emails from API
    async fetchEmails(email) {
        this.setLoadingState(true);
        this.hideError();
        this.hideAllStates();
        this.emails = [];

        try {
            const hash = this.hashEmail(email);
            console.log('Fetching emails for:', email, 'Hash:', hash);
            
            // Show status info
            this.currentEmail = email;
            this.elements.currentEmail.textContent = email;
            this.elements.statusInfo.style.display = 'block';
            this.elements.loadingState.style.display = 'block';
            
            const response = await fetch(`https://mailreader.zettix.net/api/request/mail/id/${hash}/`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log('API Response:', data);

            if (Array.isArray(data)) {
                this.emails = data;
                this.displayEmails();
            } else {
                this.emails = [];
                this.showEmptyState();
            }

        } catch (error) {
            console.error('Error fetching emails:', error);
            this.showError('Không thể tải email. Vui lòng kiểm tra kết nối mạng.');
            this.hideAllStates();
        } finally {
            this.setLoadingState(false);
        }
    }

    // Hide all state displays
    hideAllStates() {
        this.elements.loadingState.style.display = 'none';
        this.elements.emailList.style.display = 'none';
        this.elements.emptyState.style.display = 'none';
    }

    // Display emails list
    displayEmails() {
        this.hideAllStates();
        
        if (this.emails.length === 0) {
            this.showEmptyState();
            return;
        }

        // Update email count
        this.elements.emailCount.textContent = this.emails.length;
        this.elements.emailText.textContent = this.emails.length === 1 ? 'email' : 'emails';

        // Clear container
        this.elements.emailContainer.innerHTML = '';

        // Create email items
        this.emails.forEach((email, index) => {
            const emailItem = this.createEmailItem(email, index);
            this.elements.emailContainer.appendChild(emailItem);
        });

        this.elements.emailList.style.display = 'block';
    }

    // Create email item element
    createEmailItem(email, index) {
        const emailItem = document.createElement('div');
        emailItem.className = 'email-item';
        emailItem.addEventListener('click', () => this.openModal(email));

        const subject = email.mail_subject || '(Không có tiêu đề)';
        const from = email.mail_from || 'Unknown sender';
        const timestamp = this.formatTimestamp(email.mail_timestamp);
        const preview = email.mail_preview || email.mail_text?.substring(0, 150) || 'Không có nội dung xem trước';
        const attachmentCount = email.mail_attachments_count || 0;

        let attachmentInfo = '';
        if (attachmentCount > 0) {
            attachmentInfo = ` • ${attachmentCount} đính kèm${attachmentCount > 1 ? 's' : ''}`;
        }

        emailItem.innerHTML = `
            <div class="email-subject">${this.escapeHtml(subject)}</div>
            <div class="email-from">${this.escapeHtml(from)} • ${timestamp}${attachmentInfo}</div>
            <div class="email-preview">${this.escapeHtml(preview)}</div>
        `;

        return emailItem;
    }

    // Format timestamp
    formatTimestamp(timestamp) {
        const date = new Date(timestamp * 1000);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMinutes = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);

        if (diffMinutes < 1) return 'Vừa xong';
        if (diffMinutes < 60) return `${diffMinutes} phút trước`;
        if (diffHours < 24) return `${diffHours} giờ trước`;
        
        return date.toLocaleDateString('vi-VN');
    }

    // Show empty state
    showEmptyState() {
        this.hideAllStates();
        this.elements.emptyState.style.display = 'block';
    }

    // Open email modal
    openModal(email) {
        this.selectedEmail = email;
        
        // Set modal content
        this.elements.modalSubject.textContent = email.mail_subject || '(Không có tiêu đề)';
        this.elements.modalFrom.textContent = email.mail_from || 'Unknown sender';
        this.elements.modalDate.textContent = this.formatTimestamp(email.mail_timestamp);
        
        // Handle attachments
        const attachmentCount = email.mail_attachments_count || 0;
        if (attachmentCount > 0) {
            this.elements.modalAttachmentCount.textContent = `${attachmentCount} file${attachmentCount > 1 ? 's' : ''}`;
            this.elements.modalAttachments.style.display = 'flex';
        } else {
            this.elements.modalAttachments.style.display = 'none';
        }

        // Handle email content
        if (email.mail_html) {
            this.elements.modalIframe.srcdoc = email.mail_html;
            this.elements.modalIframe.style.display = 'block';
            this.elements.modalText.style.display = 'none';
        } else {
            this.elements.modalText.textContent = email.mail_text || 'Không có nội dung';
            this.elements.modalText.style.display = 'block';
            this.elements.modalIframe.style.display = 'none';
        }

        // Show modal
        this.elements.emailModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // Close modal
    closeModal() {
        this.elements.emailModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.selectedEmail = null;
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EmailApp();
});

// Add some utility functions for better UX
document.addEventListener('DOMContentLoaded', () => {
    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add loading animation enhancement
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .email-item {
            animation: fadeIn 0.3s ease-out;
        }
        
        .email-item:nth-child(1) { animation-delay: 0.1s; }
        .email-item:nth-child(2) { animation-delay: 0.2s; }
        .email-item:nth-child(3) { animation-delay: 0.3s; }
        .email-item:nth-child(4) { animation-delay: 0.4s; }
        .email-item:nth-child(5) { animation-delay: 0.5s; }
    `;
    document.head.appendChild(style);
});
