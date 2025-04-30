import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../../services/property.service';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { Appointment } from '../../models/Appointment.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-appointments-calendar',
  templateUrl: './appointments-calendar.component.html',
  styleUrls: ['./appointments-calendar.component.css']
})
export class AppointmentsCalendarComponent implements OnInit {
  selectedEvent: {
  title: string;
  status: string;
  client: string;
  phone: string;
  location: string;
  
} | null = null;

isModalOpen: boolean = false;

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
    slotMaxTime: '20:00:00',
    weekends: false,
    editable: true,
    eventClick: this.handleEventClick.bind(this),
    events: []
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
      title: event.title,
      status: event.extendedProps['status'],
      client: event.extendedProps['client'],
      phone: event.extendedProps['phone'],
      location: event.extendedProps['location']
    };
    this.isModalOpen = true;
  }
  
  
  
  

  // Optional view change handler
  changeView(viewName: string) {
    this.calendarOptions.initialView = viewName;
  }
  conso() {
    
    console.log(this.calendarOptions.events);
  }
  closeModal() {
    this.isModalOpen = false;
  }
  
}