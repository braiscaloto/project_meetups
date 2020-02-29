import axios from "axios";

export function getAllEvents() {
  return axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/allevents`);
}

export function getEvents() {
  return axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/events`);
}

export function getEvent(event_id) {
  return axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/api/events/${event_id}`
  );
}

export function addEvent(event) {
  console.log(event);
  return axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/events`, event);
}

export function updateEvent(event) {
  return axios.put(
    `${process.env.REACT_APP_BACKEND_URL}/api/events/${event.id}`,
    event
  );
}

export function deleteEvent(id) {
  return axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/events/${id}`);
}

export function addComment(event_id, data) {
  return axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/api/events/${event_id}/comments`,
    data
  );
}

export function getComments(event_id) {
  return axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/api/comments/${event_id}`
  );
}

export function addAttendee(event_id, data) {
  return axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/api/events/${event_id}/attendees`,
    data
  );
}

export function getAttendees(event_id) {
  return axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/api/attendees/${event_id}/attendees`
  );
}

export function addLike(event_id, data) {
  return axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/api/events/${event_id}/likes`,
    data
  );
}

export function getLikes(event_id) {
  return axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/api/likes/${event_id}/likes`
  );
}

export function deleteLike(event_id) {
  return axios.delete(
    `${process.env.REACT_APP_BACKEND_URL}/api/events/${event_id}/likes`
  );
}
