import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, Typography, Grid } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import 'react-calendar/dist/Calendar.css';
import 'react-toastify/dist/ReactToastify.css';

const CalendarWithEvents = () => {
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});
  const [holidays, setHolidays] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [note, setNote] = useState('');
  const [eventTime, setEventTime] = useState(new Date());
  const [idCnpj, setIdCnpj] = useState('');
  const [viewDate, setViewDate] = useState(new Date());

  // Fetch user ID and CNPJ
  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem('userId'));

    if (userId) {
      fetch(`/api/${userId}`)
        .then(response => response.json())
        .then(user => {
          if (user) {
            setIdCnpj(user.id_cnpj);
          } else {
            toast.error('Usuário não encontrado');
          }
        })
        .catch(error => {
          console.error('Erro ao buscar dados do usuário:', error);
          toast.error('Erro ao buscar dados do usuário');
        });
    }
  }, []);

  // Fetch events and holidays based on viewDate
  useEffect(() => {
    if (!(viewDate instanceof Date)) {
      console.error('viewDate não é um objeto Date:', viewDate);
      return;
    }

    console.log('Fetching events and holidays for:', viewDate);
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth() + 1;

    const fetchEventsAndHolidays = async () => {
      try {
        const eventsResponse = await fetch(`/api/event/events/${year}/${month}`);
        if (!eventsResponse.ok) throw new Error('Erro ao buscar eventos');
        const eventsData = await eventsResponse.json();

        const holidaysResponse = await fetch(`https://brasilapi.com.br/api/feriados/v1/${year}`);
        if (!holidaysResponse.ok) throw new Error('Erro ao buscar feriados');
        const holidaysData = await holidaysResponse.json();

        // Format events
        const formattedEvents = eventsData.reduce((acc, event) => {
          const dateKey = format(new Date(event.eventTime), 'dd/MM/yyyy');
          if (!acc[dateKey]) acc[dateKey] = [];
          acc[dateKey].push({ note: event.note, eventTime: parseISO(event.eventTime) });
          return acc;
        }, {});

        // Format holidays
        const formattedHolidays = holidaysData.reduce((acc, holiday) => {
          const dateKey = format(new Date(holiday.date), 'dd/MM/yyyy');
          if (!acc[dateKey]) acc[dateKey] = [];
          acc[dateKey].push({ note: holiday.name });
          return acc;
        }, {});

        console.log('Events:', formattedEvents);
        console.log('Holidays:', formattedHolidays);

        setEvents(formattedEvents);
        setHolidays(formattedHolidays);
      } catch (error) {
        toast.error('Erro ao buscar eventos ou feriados');
        console.error('Erro ao buscar eventos ou feriados:', error);
      }
    };

    fetchEventsAndHolidays();
  }, [viewDate]);

  // Handle date change
  const handleDateChange = (newDate) => {
    console.log('Selected date:', newDate);
    setDate(newDate);
  };

  // Handle day click
  const handleDayClick = (value) => {
    console.log('Clicked day:', value);
    setSelectedDate(value);
    setEventTime(value); // Set event time to selected date
    setOpenDialog(true);
  };

  // Handle view change (month/year)
  const handleViewChange = ({ activeStartDate }) => {
    if (!(activeStartDate instanceof Date)) {
      console.error('activeStartDate não é um objeto Date:', activeStartDate);
      return;
    }
    console.log('View changed to:', activeStartDate);
    setViewDate(activeStartDate);
  };

  // Save event
  const handleSaveEvent = async () => {
    console.log('Saving event:', { note, eventTime, selectedDate, idCnpj });
    if (note && eventTime && selectedDate && idCnpj) {
      const dateKey = format(selectedDate, 'dd/MM/yyyy');
      try {
        const response = await fetch('/api/event/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            note,
            eventTime: eventTime.toISOString(),
            dateKey,
            idCnpj,
          }),
        });
        if (!response.ok) {
          throw new Error('Erro ao salvar evento');
        }
        const newEvent = await response.json();
        setEvents(prevEvents => ({
          ...prevEvents,
          [dateKey]: [
            ...(prevEvents[dateKey] || []),
            { note: newEvent.note, eventTime: new Date(newEvent.eventTime) }
          ],
        }));
        setOpenDialog(false);
        setNote('');
        setEventTime(new Date());
        toast.success('Evento salvo com sucesso');
      } catch (error) {
        toast.error('Erro ao salvar evento');
        console.error('Erro ao salvar evento:', error);
      }
    } else {
      toast.warn('Por favor, preencha todos os campos.');
    }
  };

  // Get events for the current month
  const getEventsForMonth = () => {
    if (!(viewDate instanceof Date)) {
      console.error('viewDate não é um objeto Date:', viewDate);
      return <Typography variant="body2">Nenhum evento para este mês.</Typography>;
    }

    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(viewDate);
    const eventsInMonth = Object.keys({ ...events, ...holidays })
      .filter(dateKey => {
        const [day, month, year] = dateKey.split('/').map(Number);
        const eventDate = new Date(year, month - 1, day);
        return eventDate >= monthStart && eventDate <= monthEnd;
      })
      .map(dateKey => (
        (events[dateKey] || []).concat(holidays[dateKey] || []).map((event, index) => (
          <Box key={index} mb={1}>
            <Typography variant="body2" sx={{ backgroundColor: '#6A438B', fontWeight: "600", color: '#fff', padding: 0.3 }}>
              {event.note}
            </Typography>
            <Typography variant="body2" sx={{ backgroundColor: '#ead3ff', color: '#3f2854', padding: 0.3 }}>
              Data: {dateKey}
            </Typography>
            {event.eventTime && (
              <Typography variant="body2" sx={{ backgroundColor: '#daafff', color: '#3f2854', padding: 0.3 }}>
                Hora: {event.eventTime.toLocaleTimeString()}
              </Typography>
            )}
          </Box>
        ))
      ));
    return eventsInMonth.length > 0 ? eventsInMonth : <Typography variant="body2">Nenhum evento para este mês.</Typography>;
  };

  return (
    <Grid container justifyContent="center" spacing={2}>
      <Grid item xs={12} md={8}>
        <Box sx={{ width: '100%' }}>
          <Calendar
            onChange={handleDateChange}
            value={date}
            tileClassName={({ date }) => {
              const dateKey = format(date, 'dd/MM/yyyy');
              return events[dateKey] || holidays[dateKey] ? 'highlight' : null;
            }}
            onClickDay={handleDayClick}
            onActiveStartDateChange={handleViewChange}
          />
        </Box>
      </Grid>
      <Grid item xs={12} md={4}>
        <Box>
          <Typography variant="h6" sx={{ backgroundColor: '#fcee9f', fontWeight: "600", color: '#3f2854', padding: 0.5, mb: 0.5 }}>
            Agenda de eventos
          </Typography>
          {getEventsForMonth()}
        </Box>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Adicionar Evento</DialogTitle>
        <DialogContent>
          <TextField
            value={note}
            onChange={(e) => setNote(e.target.value)}
            fullWidth
            aria-label="Anotações"
          />
          <TextField
            type="datetime-local"
            value={eventTime.toISOString().slice(0, 16)}
            onChange={(e) => setEventTime(new Date(e.target.value))}
            fullWidth
            aria-label="Data e Hora"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleSaveEvent}>Salvar</Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </Grid>
  );
};

export default CalendarWithEvents;
