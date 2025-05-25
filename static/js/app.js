// Core functionality and utilities
class TimezoneConverter {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.initializeDateTime();
        this.initializeTimezones();
        this.initializeTheme();
    }

    initializeElements() {
        // Form elements
        this.form = document.getElementById('converter-form');
        this.datetimeInput = document.getElementById('datetime-input');
        this.sourceTimezone = document.getElementById('source-timezone');
        this.targetTimezone = document.getElementById('target-timezone');
        this.swapBtn = document.getElementById('swap-btn');
        
        // Result elements
        this.resultDiv = document.getElementById('result');
        this.errorDiv = document.getElementById('error');
        
        // Theme elements
        this.themeToggle = document.getElementById('theme-toggle');
    }

    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Timezone swap
        this.swapBtn.addEventListener('click', () => this.handleSwap());
        
        // Theme toggle
        this.themeToggle.addEventListener('change', () => this.handleThemeChange());
    }

    initializeDateTime() {
        const now = new Date();
        this.datetimeInput.value = now.toISOString().slice(0, 16);
    }

    initializeTimezones() {
        // Setup custom selects
        this.setupCustomSelect(this.sourceTimezone);
        this.setupCustomSelect(this.targetTimezone);

        // Try to set user's timezone with improved error handling
        try {
            const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (userTimezone && this.isValidTimezone(userTimezone)) {
                this.setTimezoneValue(this.sourceTimezone, userTimezone);
            } else {
                // Fallback to UTC if detection fails
                this.setTimezoneValue(this.sourceTimezone, 'UTC');
            }
        } catch (e) {
            console.warn('Could not detect user timezone, falling back to UTC:', e);
            this.setTimezoneValue(this.sourceTimezone, 'UTC');
        }
    }

    initializeTheme() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else if (prefersDark) {
            this.setTheme('dark');
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        try {
            this.hideElements([this.errorDiv, this.resultDiv]);
            
            const response = await this.convertTimezone({
                datetime: this.datetimeInput.value,
                source_timezone: this.sourceTimezone.value,
                target_timezone: this.targetTimezone.value
            });

            if (!response.success) {
                throw new Error(response.error);
            }

            this.displayResult(response.result);
        } catch (error) {
            this.displayError(error.message);
        }
    }

    handleSwap() {
        const sourceValue = this.sourceTimezone.value;
        const targetValue = this.targetTimezone.value;
        
        this.setTimezoneValue(this.sourceTimezone, targetValue);
        this.setTimezoneValue(this.targetTimezone, sourceValue);
    }

    handleThemeChange() {
        const theme = this.themeToggle.checked ? 'dark' : 'light';
        this.setTheme(theme);
        localStorage.setItem('theme', theme);
    }

    // Custom Select Implementation
    setupCustomSelect(select) {
        const customSelect = new CustomSelect(select);
        customSelect.initialize();
    }

    // API Calls
    async convertTimezone(data) {
        const response = await fetch('/convert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    // UI Updates
    setTimezoneValue(select, value) {
        select.value = value;
        const customSelect = select.closest('.custom-select');
        customSelect.querySelector('.selected-value').textContent = value;
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.themeToggle.checked = theme === 'dark';
    }

    displayResult(result) {
        this.resultDiv.querySelector('.result-time').textContent = result.datetime;
        this.resultDiv.querySelector('.result-timezone').textContent = 
            `${result.timezone} (${result.offset})`;
        this.resultDiv.querySelector('.time-difference').textContent = 
            `Difference: ${result.difference}`;
        this.resultDiv.classList.remove('hidden');
    }

    displayError(message) {
        this.errorDiv.querySelector('.error-message').textContent = message;
        this.errorDiv.classList.remove('hidden');
    }

    hideElements(elements) {
        elements.forEach(el => el.classList.add('hidden'));
    }

    // Helper method to validate timezone
    isValidTimezone(timezone) {
        try {
            Intl.DateTimeFormat(undefined, { timeZone: timezone });
            return true;
        } catch (e) {
            return false;
        }
    }
}

// Custom Select Component
class CustomSelect {
    constructor(select) {
        this.select = select;
        this.customSelect = select.closest('.custom-select');
        this.trigger = this.customSelect.querySelector('.select-trigger');
        this.selectedValue = this.trigger.querySelector('.selected-value');
        this.dropdown = this.customSelect.querySelector('.dropdown-menu');
        this.searchInput = this.dropdown.querySelector('input');
        this.options = this.dropdown.querySelectorAll('.option');
    }

    initialize() {
        this.setInitialValue();
        this.setupEventListeners();
    }

    setInitialValue() {
        if (this.select.value) {
            this.selectedValue.textContent = this.select.value;
        }
    }

    setupEventListeners() {
        this.trigger.addEventListener('click', () => this.toggleDropdown());
        this.searchInput.addEventListener('input', () => this.handleSearch());
        this.options.forEach(option => {
            option.addEventListener('click', () => this.handleOptionSelect(option));
        });
        document.addEventListener('click', (e) => this.handleClickOutside(e));
    }

    toggleDropdown() {
        const isOpen = this.customSelect.classList.contains('open');
        
        // Close all other dropdowns
        document.querySelectorAll('.custom-select.open').forEach(el => {
            if (el !== this.customSelect) {
                el.classList.remove('open');
            }
        });

        this.customSelect.classList.toggle('open');
        
        if (!isOpen) {
            this.searchInput.focus();
        }
    }

    handleSearch() {
        const value = this.searchInput.value.toLowerCase();
        
        this.options.forEach(option => {
            const text = option.textContent.toLowerCase();
            option.classList.toggle('hidden', !text.includes(value));
        });
    }

    handleOptionSelect(option) {
        const value = option.dataset.value;
        this.select.value = value;
        this.selectedValue.textContent = value;
        this.customSelect.classList.remove('open');
        
        this.options.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
    }

    handleClickOutside(e) {
        if (!this.customSelect.contains(e.target)) {
            this.customSelect.classList.remove('open');
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new TimezoneConverter();
});