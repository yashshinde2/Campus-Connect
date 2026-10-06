const generateICS = (event) => {
    const formatDate = (date) => {
        return new Date(date).toISOString().replace(/-|:|\.\d\d\d/g, '');
    };

    const startDate = formatDate(event.date);
    const endDate = formatDate(new Date(new Date(event.date).getTime() + 2 * 60 * 60 * 1000));

    return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Campus Connect//Event Calendar//EN',
        'BEGIN:VEVENT',
        `UID:event-${event._id}@campusconnect.edu`,
        `DTSTAMP:${formatDate(new Date())}`,
        `DTSTART:${startDate}`,
        `DTEND:${endDate}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
        `LOCATION:${event.venue}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');
};

module.exports = generateICS;
