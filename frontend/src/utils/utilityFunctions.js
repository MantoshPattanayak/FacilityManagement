function formatTime(time24) {   //format 24 hour time as 12 hour time
    if (!time24) return;
    // Parse the input time string
    const [hours, minutes] = time24.split(':').map(Number);

    // Determine AM or PM
    const period = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    const hours12 = hours % 12 || 12; // 0 should be 12 in 12-hour format

    // Format the time string
    const time12 = `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;

    return time12;
}

function formatDate(date) { //format input date as DD-MM-YYYY
    if(!date)   return;
    date = date?.split('T')[0] ? date.split('T')[0] : date;
    const [year, month, day] = date.split('-');

    return `${day}-${month}-${year}`;
}

function formatDateYYYYMMDD(date) { //format input date as DD-MM-YYYY
    if(!date)   return;

    const [year, month, day] = date.split('-');

    return `${year}-${month}-${day}`;
}

function logOutUser() {
    sessionStorage.setItem('isUserLoggedIn', 0);
    return;
}

const truncateName = (name, maxLength) => {
    return name.length > maxLength ? name.slice(0, maxLength) + '...' : name;
  };

export { formatTime, formatDate, formatDateYYYYMMDD, logOutUser, truncateName };