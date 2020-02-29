import React, { useReducer } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { addEvent } from "../http/eventsService";
import { useAuth } from "../context/auth-context";

function eventsReducer(state, action) {
  switch (action.type) {
    case "CREATE_EVENT":
      return { ...state, events: { ...state.event, ...action.events } };
    default:
      return state;
  }
}

export function AddEvent() {
  const { register, errors, formState, handleSubmit, setError } = useForm({
    mode: "onBlur"
  });
  const { currentUser, setCurrentUser, setIsAuthenticated } = useAuth();
  const history = useHistory();

  const [state, dispatch] = useReducer(eventsReducer, {
    events: [],
    selectedEvent: null
  });

  const handleCreateEvent = formData => {
    console.log(formData);
    const dataEvent = {
      title: formData.title,
      content: formData.content,
      tag: formData.category,
      location: formData.location,
      event_at: formData.event_time.replace("T", " ") + ":00"
    };
    addEvent(dataEvent).then(response => {
      dispatch({ type: "CREATE_EVENT", event: dataEvent });
      history.push("/");
    });
  };

  return (
    <main className="mainAddEvent">
      <div className="formAddEvent">
        <form onSubmit={handleSubmit(handleCreateEvent)} noValidate>
          <label>Title</label>
          <input
            ref={register({
              required: "The title is mandatory"
            })}
            id="title"
            name="title"
            type="text"
            placeholder="Please enter your title event"
          ></input>
          {errors.title && (
            <span className="errorMessage">{errors.title.message}</span>
          )}

          <label>Content</label>
          <textarea
            ref={register({
              required: "Describe your event"
            })}
            id="content"
            name="content"
            type="text"
            placeholder="Please enter the description of your events - more or less 10 characters"
          />

          {errors.content && (
            <span className="errorMessage">{errors.content.message}</span>
          )}

          <label>Tags</label>
          <select
            ref={register({
              required: "*La categoría es necesaria"
            })}
            className=" relative shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="category"
            type="text"
            name="category"
            placeholder=""
          >
            <option value="JavaScript">JavaScript</option>
            <option value="ReactJS">ReactJS</option>
            <option value="Java">Java</option>
            <option value="PHP">PHP</option>
            <option value="Scrum">Scrum</option>
            <option value="CSS3">CSS3</option>
            <option value="Work Remotely">Work Remotely</option>
            <option value=".NET">.NET</option>
            <option value="AWS">AWS</option>
            <option value="iOS">iOS</option>
            <option value="Data Science">Data Science</option>
            <option value="Blockchain">Blockchain</option>
            <option value="Bitcoin">Bitcoin</option>
            <option value="Big Data">Big Data</option>
            <option value="C#">C#</option>
            <option value="Ruby">Ruby</option>
            <option value="Wordpress">Wordpress</option>
            <option value="NodeJS">NodeJS</option>
            <option value="AngularJS">AngularJS</option>
            <option value="Unity">Unity</option>
            <option value="Python">Python</option>
            <option value="NoSQL">NoSQL</option>
            <option value="MySQL">MySQL</option>
            <option value="MongoDB">MongoDB</option>
          </select>

          <label>Location</label>
          <input
            ref={register({
              required: "The location is mandatory"
            })}
            id="location"
            name="location"
            type="text"
            placeholder="Please enter your title event"
          ></input>
          {errors.title && (
            <span className="errorMessage">{errors.title.message}</span>
          )}

          <label>Date Time</label>
          <input
            ref={register({
              required: "The tag is mandatory"
            })}
            id="event_time"
            name="event_time"
            type="datetime-local"
            onChange={Date()}
            placeholder="Please enter your tags event"
          ></input>
          {errors.name && (
            <span className="errorMessage">{errors.name.message}</span>
          )}
          <div>
            <button
              type="submit"
              className="btn"
              disabled={formState.isSubmitting}
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
