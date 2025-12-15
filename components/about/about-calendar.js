// components/about/about-calendar.js

class AboutCalendar extends HTMLElement {
    constructor() {
        super();

        // event definitions recurring every month
        this.events = [
            { 
                day: 7, 
                title: 'Learn About Your Zoo',
                description: 'Join our expert guides for an educational tour of the zoo. Learn about animal habitats, conservation efforts, and the important work we do to protect wildlife.',
                time: '10:00 AM - 11:30 AM'
            },
            { 
                day: 15, 
                title: 'Feed the Animals',
                description: 'Experience the joy of feeding our animals! Watch as zookeepers provide meals and learn about the dietary needs of different species. Perfect for families!',
                time: '2:00 PM - 3:00 PM'
            },
            { 
                day: 20, 
                title: 'Learn About Your Zoo',
                description: 'Join our expert guides for an educational tour of the zoo. Learn about animal habitats, conservation efforts, and the important work we do to protect wildlife.',
                time: '10:00 AM - 11:30 AM'
            }
        ];

        // current date
        this.currentDate = new Date();
        this.currentMonth = this.currentDate.getMonth();
        this.currentYear = this.currentDate.getFullYear();

        // create calendar structure
        const calendarWrapper = document.createElement('div');
        calendarWrapper.className = 'calendar-wrapper';

        // header with month navigation
        const header = document.createElement('div');
        header.className = 'calendar-header';

        const prevButton = document.createElement('button');
        prevButton.className = 'calendar-nav';
        prevButton.textContent = '←';
        prevButton.setAttribute('aria-label', 'Previous month');
        prevButton.addEventListener('click', () => this._changeMonth(-1));

        const monthYear = document.createElement('h3');
        monthYear.className = 'calendar-month-year';
        this.monthYearElement = monthYear;

        const nextButton = document.createElement('button');
        nextButton.className = 'calendar-nav';
        nextButton.textContent = '→';
        nextButton.setAttribute('aria-label', 'Next month');
        nextButton.addEventListener('click', () => this._changeMonth(1));

        header.append(prevButton, monthYear, nextButton);

        // calendar grid
        const calendarGrid = document.createElement('div');
        calendarGrid.className = 'calendar-grid';
        this.calendarGrid = calendarGrid;

        // day labels
        const dayLabels = document.createElement('div');
        dayLabels.className = 'calendar-day-labels';
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach(day => {
            const label = document.createElement('div');
            label.className = 'calendar-day-label';
            label.textContent = day;
            dayLabels.appendChild(label);
        });

        calendarWrapper.append(header, dayLabels, calendarGrid);
        this.append(calendarWrapper);

        // create modal for event details
        this._createModal();

        // render initial calendar
        this._renderCalendar();
    }

    // create modal for event details
    _createModal() {
        const modal = document.createElement('div');
        modal.className = 'event-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'event-modal-title');
        modal.setAttribute('aria-modal', 'true');
        
        const modalContent = document.createElement('div');
        modalContent.className = 'event-modal-content';
        
        const modalHeader = document.createElement('div');
        modalHeader.className = 'event-modal-header';
        
        const modalTitle = document.createElement('h3');
        modalTitle.id = 'event-modal-title';
        modalTitle.className = 'event-modal-title';
        
        const closeButton = document.createElement('button');
        closeButton.className = 'event-modal-close';
        closeButton.textContent = '×';
        closeButton.setAttribute('aria-label', 'Close');
        closeButton.addEventListener('click', () => this._closeModal());
        
        modalHeader.append(modalTitle, closeButton);
        
        const modalBody = document.createElement('div');
        modalBody.className = 'event-modal-body';
        
        const eventDate = document.createElement('p');
        eventDate.className = 'event-modal-date';
        
        const eventTime = document.createElement('p');
        eventTime.className = 'event-modal-time';
        
        const eventDescription = document.createElement('p');
        eventDescription.className = 'event-modal-description';
        
        modalBody.append(eventDate, eventTime, eventDescription);
        modalContent.append(modalHeader, modalBody);
        modal.appendChild(modalContent);
        
        // close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this._closeModal();
            }
        });
        
        // close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this._closeModal();
            }
        });
        
        this.modal = modal;
        this.modalTitle = modalTitle;
        this.modalDate = eventDate;
        this.modalTime = eventTime;
        this.modalDescription = eventDescription;
        this.appendChild(modal);
    }

    // show modal with event details
    _showModal(day, events) {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        const dateStr = `${monthNames[this.currentMonth]} ${day}, ${this.currentYear}`;
        
        // if multiple events, show first one (or we could show all)
        const event = events[0];
        
        this.modalTitle.textContent = event.title;
        this.modalDate.textContent = dateStr;
        this.modalTime.textContent = `Time: ${event.time}`;
        this.modalDescription.textContent = event.description;
        
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // close modal
    _closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // change month
    _changeMonth(direction) {
        this.currentMonth += direction;
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        this._renderCalendar();
    }

    // render calendar
    _renderCalendar() {
        // update month year display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        this.monthYearElement.textContent = `${monthNames[this.currentMonth]} ${this.currentYear}`;

        // clear grid
        this.calendarGrid.innerHTML = '';

        // get first day of month and number of days
        const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
        const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

        // add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            this.calendarGrid.appendChild(emptyCell);
        }

        // add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';

            const dayNumber = document.createElement('div');
            dayNumber.className = 'calendar-day-number';
            dayNumber.textContent = day;

            // check if this day has events
            const dayEvents = this.events.filter(event => event.day === day);
            if (dayEvents.length > 0) {
                dayCell.classList.add('has-events');
                dayCell.style.cursor = 'pointer';
                dayCell.addEventListener('click', () => this._showModal(day, dayEvents));
                const eventsList = document.createElement('div');
                eventsList.className = 'calendar-events';
                dayEvents.forEach(event => {
                    const eventItem = document.createElement('div');
                    eventItem.className = 'calendar-event';
                    eventItem.textContent = event.title;
                    eventsList.appendChild(eventItem);
                });
                dayCell.append(dayNumber, eventsList);
            } else {
                dayCell.appendChild(dayNumber);
            }

            // highlight today
            const today = new Date();
            if (day === today.getDate() &&
                this.currentMonth === today.getMonth() &&
                this.currentYear === today.getFullYear()) {
                dayCell.classList.add('today');
            }

            this.calendarGrid.appendChild(dayCell);
        }
    }
}

customElements.define('about-calendar', AboutCalendar);
export default AboutCalendar;

