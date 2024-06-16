// Sheets Files
function updateAssignmentsFromSheet() {
    const googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRnbOxOtpBxz4xGZaSZFvHKOggqbbIHeQ-R75tb1l-nfVTEJYttADP9sVFCWXPMQMfeHhFZLKJ1w8LC/pub?output=csv';
    
    $.get(googleSheetsURL, function (data) {
        const rows = data.split('\n');
        const assignmentsContainer = $('.assignments ul');

        for (let i = 1; i < rows.length; i++) {
            const columns = rows[i].split(',');
            if (columns.length >= 3) {
                const assignmentLink = columns[1].trim(); // Get link from column B
                const assignmentDescription = columns[2].trim(); // Get assignment name from column C

                const assignmentElement = $('<a>').attr('href', assignmentLink).addClass('assignment-link');
                assignmentElement.text(assignmentDescription);

                const listItem = $('<li>').append(assignmentElement);
                assignmentsContainer.append(listItem);
            }
        }
    });
}

updateAssignmentsFromSheet();