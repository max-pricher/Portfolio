let events = []; // Global array to store event objects
let currentEditIndex = null; // global variable to track event status

function updateLocationOptions(value) { // in-person/remote toggle using bootstrap visibility classes
  // get site elements
  const locationWrapper = document.getElementById('location_wrapper');
  const remoteWrapper = document.getElementById('remote_url_wrapper');
  const attendeesWrapper = document.getElementById('attendees_wrapper');
  const locationInput = document.getElementById('event_location');
  const remoteInput = document.getElementById('event_remote_url');

  // Show attendees for both modalities
  attendeesWrapper.classList.remove('d-none');

  // determine which modality to togle
  if (value === 'in-person') {  // if in person, show location. hide remote url 
    locationWrapper.classList.remove('d-none'); // show location input
    locationInput.required = true; // make location required

    remoteWrapper.classList.add('d-none'); // hide remote url input
    remoteInput.required = false; // make sure remote url is not required
    remoteInput.value = ""; // null remote val
  } else if (value === 'remote') { // if remote, show remote url. hide location
    remoteWrapper.classList.remove('d-none'); // show remote url input
    remoteInput.required = true; // make remote url required

    locationWrapper.classList.add('d-none'); // hide location input
    locationInput.required = false; // make sure location is not required
    locationInput.value = ""; // null location val
  }
}

function createEventCard(eventDetails, index) {
  let event_element = document.createElement('div'); // create div, 
  event_element.classList = 'event row border rounded m-1 py-1 shadow-sm'; // style div with bootstrap. 
  event_element.style.backgroundColor = getCategoryColor(eventDetails.category); // set background color based on category.

  let info = document.createElement('div'); // create inner div for event details
  const locationText = eventDetails.modality === 'in-person' // get state of event modality.
    ? `Location: ${eventDetails.location}` // if showing location, show location.
    : `URL: <a href="${eventDetails.remote_url}" target="_blank">Link</a>`; // if showing remote url, show url as hyperlink.

  // populate info with data
  info.innerHTML = ` 
        <div class="col-12" style="font-size: 0.8rem;">
            <strong>Event Name:</strong> ${eventDetails.name}<br>
            <strong>Event Time:</strong> ${eventDetails.time}<br>
            <strong>Event Modality:</strong> ${eventDetails.modality}<br>
            <strong>Event Location:</strong> ${locationText}<br>
            <strong>Attendees:</strong> ${eventDetails.attendees || 'None'}
        </div>
    `;

  // Extra credit bits
  event_element.onclick = function () { // add click lister to every card event
    editEventCard(eventDetails, index);
  };

  event_element.appendChild(info); // add info to the event card, event card hasnt been added to the calendar yet
  return event_element;
}

// function to add event to proper week UI 
function addEventToCalendarUI(eventInfo, index) {
  let event_card = createEventCard(eventInfo, index);
  let day_div = document.getElementById(eventInfo.weekday.toLowerCase());

  if (day_div) {// if week was found, add event card to that week column
    day_div.appendChild(event_card);
  }
}

function removeEventFromCalendarUI(index) {
  const event = events[index]; // get event details
  const day_div = document.getElementById(event.weekday.toLowerCase()); // find week
  const event_cards = day_div.querySelectorAll('.event'); // get all relevant event cards

  event_cards.forEach(card => { // parse found cards for matching event, if i make a calendar ill change this to a UID
    if (card.textContent.includes(event.name) && card.textContent.includes(event.time)) {
      card.remove();
    }
  });
}

function saveEvent() {
  const form = document.getElementById('create_event_form'); // get form
  if (!form.checkValidity()) { // check validity with html 
    form.classList.add('was-validated'); // add bootstrap flag
    return; // exit to review form errors
  }

  const modality = document.getElementById('event_modality').value; // find modality

  // fill event with validated data
  const eventDetails = {
    name: document.getElementById('event_name').value,
    category: document.getElementById('event_category').value,
    weekday: document.getElementById('event_weekday').value,
    time: document.getElementById('event_time').value,
    modality: modality,
    location: modality === 'in-person' ? document.getElementById('event_location').value : null, // not required if remote, so set to null
    remote_url: modality === 'remote' ? document.getElementById('event_remote_url').value : null, // not required if in-person, so set to null
    attendees: document.getElementById('event_attendees').value
  };

  // extra credit edit handler
  if (currentEditIndex !== null) { // Edit mode when an event is selected
    removeEventFromCalendarUI(currentEditIndex); // remove event from UI

    events[currentEditIndex] = eventDetails; // update event in events array with new details

    addEventToCalendarUI(eventDetails, currentEditIndex); // re-add event

    currentEditIndex = null; // Reset state
  } else { // create mode/normal flow
    events.push(eventDetails);
    addEventToCalendarUI(eventDetails, events.length - 1);
  }

  // Close Modal
  const myModalElement = document.getElementById('event_modal');
  const myModal = bootstrap.Modal.getOrCreateInstance(myModalElement);
  myModal.hide();
}

function getCategoryColor(category) {
  const colors = {
    'Academic': '#90ee90', // Light Green
    'Work': '#ffcccb',     // Light Red
    'Personal': '#add8e6',  // Light Blue
    'Other': '#fdfd96'      // Light Yellow
  };
  return colors[category] || '#ffffff'; // default to white if it errors out
}



// extra credit edit event functionality
function editEventCard(eventDetails, index) {
  currentEditIndex = index; //  set the global flag

  // pre-fill form
  document.getElementById('event_name').value = eventDetails.name;
  document.getElementById('event_category').value = eventDetails.category;
  document.getElementById('event_weekday').value = eventDetails.weekday;
  document.getElementById('event_time').value = eventDetails.time;
  document.getElementById('event_modality').value = eventDetails.modality;

  // toggle location/remote url fields based on modality and populate values
  updateLocationOptions(eventDetails.modality);

  // populate location or remote url based on modality
  if (eventDetails.modality === 'in-person') {
    document.getElementById('event_location').value = eventDetails.location;
  } else if (eventDetails.modality === 'remote') {
    document.getElementById('event_remote_url').value = eventDetails.remote_url;
  }

  // open modal
  const myModalElement = document.getElementById('event_modal');
  const myModal = bootstrap.Modal.getOrCreateInstance(myModalElement);
  myModal.show();
}