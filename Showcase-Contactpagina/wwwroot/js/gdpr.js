class GDPR {
    constructor() {
        document.addEventListener("DOMContentLoaded", () => {
            this.init();
        });
    }

    init() {
        this.showStatus();
        this.showContent();
        this.bindEvents();

        if (!this.cookieStatus() || !this.cookieStatus().choice) {
            this.showGDPR(); 
        }
    }

    bindEvents() {
        let buttonAccept = document.querySelector('.gdpr-consent__button--accept');
        let buttonReject = document.querySelector('.gdpr-consent__button--reject');

        if (buttonAccept) {
            buttonAccept.addEventListener('click', () => {
                this.cookieStatus('accept');
                this.showStatus();
                this.showContent();
                this.hideGDPR();
            });
        }

        if (buttonReject) {
            buttonReject.addEventListener('click', () => {
                this.cookieStatus('reject');
                this.showStatus();
                this.showContent();
                this.hideGDPR();
            });
        }
    }

    showContent() {
        this.resetContent();
        const status = this.cookieStatus() && this.cookieStatus().choice ? this.cookieStatus().choice : 'not-chosen';
        const element = document.querySelector(`.content-gdpr-${status}`);
        if (element) {
            element.classList.add('show');
        }
    }

    resetContent() {
        const classes = ['.content-gdpr-accept', '.content-gdpr-reject', '.content-gdpr-not-chosen'];

        for (const c of classes) {
            const el = document.querySelector(c);
            if (el) {
                el.classList.add('hide');
                el.classList.remove('show');
            }
        }
    }

    showStatus() {
        const consentStatusElement = document.getElementById('content-gpdr-consent-status');

        if (!consentStatusElement) {
            console.error("❌ ERROR: Element met ID 'content-gpdr-consent-status' niet gevonden in de DOM.");
        }

    }

    cookieStatus(status) {
        if (status) {
            const now = new Date();
            const consentData = {
                choice: status,
                date: now.toLocaleDateString('nl-NL'),
                time: now.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
            };
            localStorage.setItem('gdpr-consent-choice', JSON.stringify(consentData));
        }

        const storedData = localStorage.getItem('gdpr-consent-choice');
        return storedData ? JSON.parse(storedData) : null;
    }

    hideGDPR() {
        const gdprElement = document.querySelector('.gdpr-consent');
        if (gdprElement) {
            gdprElement.classList.add('hide');
            gdprElement.classList.remove('show');
        }
    }

    showGDPR() {
        const gdprElement = document.querySelector('.gdpr-consent');
        if (gdprElement) {
            gdprElement.classList.add('show');
            gdprElement.classList.remove('hide');
        }
    }
}

const gdpr = new GDPR();
