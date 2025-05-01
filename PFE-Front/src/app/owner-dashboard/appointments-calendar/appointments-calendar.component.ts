import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../../services/property.service';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { Appointment } from '../../models/Appointment.model';
import { User } from 'src/app/models/user.model';
declare var bootstrap: any;

@Component({
  selector: 'app-appointments-calendar',
  templateUrl: './appointments-calendar.component.html',
  styleUrls: ['./appointments-calendar.component.css']
})
export class AppointmentsCalendarComponent implements OnInit {
  selectedEvent: any = null;
  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    nowIndicator: true,
    slotMinTime: '08:00:00',
    slotMaxTime: '18:00:00',
    weekends: false,
    allDaySlot: false,
    eventTimeFormat: {
      hour: 'numeric',
      minute: '2-digit',
      meridiem: 'short',
      hour12: true
    },
    editable: true,
    eventClick: this.handleEventClick.bind(this),
    events: [],

    eventDidMount: (info) => {
      const tooltip = new bootstrap.Tooltip(info.el, {
        title: `
          <div class="calendar-tooltip">
            <div><strong>Client:</strong> ${info.event.extendedProps['client']}</div>
            <div><strong>Phone:</strong> ${info.event.extendedProps['phone']}</div>
            <div><strong>Property:</strong> ${info.event.extendedProps['property']}</div>
            <div><strong>Status:</strong> ${info.event.extendedProps['status']}</div>
          </div>
        `,
        placement: 'top',
        trigger: 'hover',
        html: true
      });
    }
    
    
  };
  

  constructor(private propertyService: PropertyService) {}

  ngOnInit() {
    this.loadAppointments();
    console.log(this.propertyService.getOwnerAppointments());
    this.propertyService.getOwnerAppointments().subscribe(data => {
      console.log(data); // Check what you’re actually receiving
    });
    
    
  }

  loadAppointments() {
    this.propertyService.getOwnerAppointments().subscribe((events: Appointment[]) => {
      this.calendarOptions.events = events.map(event => ({
        id: event.id?.toString() ?? '', // Safe handling for possible undefined
        title: `${event.propertyTitle}`,
        start: `${event.appointmentDate}T${event.appointmentTime}`,
        extendedProps: {
          status: event.status,
          client: `${event.name} ${event.lastName}`,
          phone: event.userPhone, // Changed from event.user.phoneNumber
          property: event.propertyTitle,
          location: `${event.propertycity}, ${event.propertysubcity}`
        },
        color: this.getEventColor(event.status)
      }));
    });
  }

  private getEventColor(status: string = ''): string {
    const colors: Record<string, string> = {
      approved: '#4CAF50',
      pending: '#FFC107',
      canceled: '#F44336'
    };
    return colors[status.toLowerCase()] || '#2196F3';
  }

  handleEventClick(clickInfo: EventClickArg) {
    const event = clickInfo.event;

    this.selectedEvent = {
      id: event.id,
      title: event.title,
      status: event.extendedProps['status'],
      client: event.extendedProps['client'],
      phone: event.extendedProps['phone'],
      location: event.extendedProps['location']
    };

    const modal = new bootstrap.Modal(document.getElementById('eventModal'));
    modal.show();
  }

//accept appointment or decline lena 

updateStatus(status: 'approved' | 'canceled') {
  const appointmentId = this.selectedEvent?.id;
  if (!appointmentId) return;

  this.propertyService.updateAppointmentStatus(+appointmentId, status).subscribe({
    next: () => {
      // Optionally show toast
      this.loadAppointments(); // Refresh calendar
      bootstrap.Modal.getInstance(document.getElementById('eventModal'))?.hide();
    },
    error: err => {
      console.error('Failed to update status', err);
    }
  });
}



  // Optional view change handler
  changeView(viewName: string) {
    this.calendarOptions.initialView = viewName;
  }
  conso() {
    
    console.log(this.calendarOptions.events);
  }
  
}