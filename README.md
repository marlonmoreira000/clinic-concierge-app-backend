# Marlon Moreira - Medical Clinic Booking App

---

![main img](./docs/main.png)

---

## Links

- [Demo video](https://www.linkedin.com/posts/marlonmoreira_an-appointment-booking-app-we-made-at-coder-activity-6957556451548487680-5MdM?utm_source=linkedin_share&utm_medium=member_desktop_web)

- [Frontend source code](https://github.com/marlonmoreira000/clinic-concierge-app-frontend)

- [Backend source code](https://github.com/marlonmoreira000/clinic-concierge-app-backend)

---

## Purpose
This booking app connects a medical practice with its patients. It was a group project completed at Coder Academy. It provides an easy way for patients to book appointments with the doctor of their choice. The app caters for two types of user:

- **Medical Clinic Managers:** The app will allow clinic managers to platform to advertise available services and track appointments.

- **Doctors:** The app allows the creation of appointments so that patients can see their availability.

- **Patients:** The app presents a simple way to book appointments as well as editing/deleting appointments.

---

## Features

The website section of the app provides a basic template that practices can use to advertise their services online. The booking section of the app allows end-users create, book, edit and delete appointments.

To book appointments, patients must to sign up for and account and login. After this, they can search for available appointments based on date and doctor. They can also add notes to their booking to provide the doctor with any extra information. Once an appointment has been booked, it is taken off the availability list. If a patient deleted an appointment, it is made available again.

Secure login and sign-up will be provided through a blend of in-house configuration and third-party services.

---

## Target Audience

The app is intended for medical practices, as a simple way to to deliver online presence and a simple booking experience for patients.

---

## Tech Stack

### Front End
- CSS
- HTML
- React
- Ant Design
- Tailwind

### Back End
- Express
- JWT
- MongoDB
- Mongoose
- Node.js

### Third-party Services
- Heroku
- Netlify
- MongoDB Atlas

---

## Libraries

### Front-End
- [React](https://reactjs.org/): a JavaScript library for building interactive user interfaces.
- [Ant Design](https://ant.design/): component library was also used in developing the user interface, for form and input components, buttons, messages and alerts, date and time pickers, etc. 
- [React Hot-Toast](https://react-hot-toast.com/): was also used for messaging and alerts in some areas of the app.
- [Axios](https://axios-http.com/): is used to handle many HTTP requests, API calls, and queries.
- [cross-fetch](https://www.npmjs.com/package/cross-fetch): used for HTTP requests to backend services.
- [moment.js](https://momentjs.com/): For date time formating in the browser.
- [Tailwind](https://tailwindcss.com/): was used extensively for styling.
- [Vite](https://vitejs.dev/): for scaffolding/app creation.

### Front-End Testing

- [Vitest](https://vitest.dev/): was used testing framework.
- [React Testing Library](https://testing-library.com/): for UI component testing.
- [JSDOM](https://github.com/jsdom/jsdom): for emulating web browsers during unit and integration testing.
- [Node Fetch](https://www.npmjs.com/package/node-fetch): was used to allow for `fetch` calls.
- [MSW](https://mswjs.io/): to facilitate API mocking for integration testing.

### Back-End
- [bcrypt.js](https://github.com/dcodeIO/bcrypt.js#readme): used for encrypting/decrypting the passwords saved in database.
- [cors](https://github.com/expressjs/cors#readme): used for middleware in the express app.
- [dotenv](https://github.com/motdotla/dotenv#readme): storing environment configuration.
- [Express](http://expressjs.com/): as the web framework for building the backend app.
- [http-status-codes](https://github.com/prettymuchbryce/http-status-codes#readme): for HTTP status codes enumeration for API request's response.
- [Joi](https://github.com/sideway/joi#readme): for validating the API request body.
- [Joi password complexity](https://github.com/kamronbatman/joi-password-complexity#readme): for validating that password in the request body meets the required criteria.
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken#readme): used for handling JWT tokens used for authentication.
- [Mongoose](https://mongoosejs.com/): as object modeling tool which works with MongoDB.

### Back-End Testing

- [Jest](https://jestjs.io/): as the testing framework for unit and integration tests.
- [Supertest](https://github.com/visionmedia/supertest#readme): for HTTP assertions for API request.
- [Nodemon](https://nodemon.io/): for monitoring the changes in project and re-running or re-deploying the application in local.

---

## Application Architecture Diagram

![Application Architecture Diagram for the product](./docs/aad.png)

---

## User Stories

| User    | Action                                                      | Result                                                                               |
|---------|-------------------------------------------------------------|--------------------------------------------------------------------------------------|
| Patient | Create an account                                           | So I can securely and conveniently book appointments                                           |
| Patient | Sign in to my account                                       | So I can access services in the app                                                  |
| Patient | Add my personal details to my account                       | So I can save time when booking with my doctor                   |
| Patient | Book an appointment online                                  | So I can book a doctor conveniently and easily                                                  |
| Patient | Choose a doctor for my appointment                          | So I can feel more comfortable about which doctor I am seeing                        |
| Patient | Choose a date and time for my appointment                   | So I can fit the appointment into my busy schedule                                   |
| Patient | Add a comment when booking an appointment                   | So I can provide the doctor with any extra information                               |
| Patient | See the details of a booking                                | So I can confirm the booking details                                                 |
| Patient | View all my current bookings                                | So I can see how many bookings I have                                                |
| Patient | Make changes to a booking                                   | So I can manage bookings around any changes in my schedule                           |
| Admin   | Combine our online presence with an easy booking system     | So patients can find everything they need in one place                               |
| Admin   | Advertise about the services we provide                     | So potential patients understand what we do                                          |
| Admin   | Provide a bio for all the doctors                           | So patients can choose a doctor they're comfortable with                           |

---
  
## Wireframes
![home](docs/wireframes/home.png)
![about](docs/wireframes/about.png)
![booking](docs/wireframes/booking.png)
![my-appointments](docs/wireframes/my-appointments.png)
![contact](docs/wireframes/contact.png)
![sign-in](docs/wireframes/sign-in.png)

---
  
## Dataflow Diagram 

![Dataflow Diagram for the product](./docs/dfd.png)

---

## Testing

This app was tested using both automated and manual testing.

Automated unit and integration tests were written extensively for the back-end and for key front-end features.

A suite of manual user tests were performed on both development and deployed versions of the app. Documentation for these tests can be seen [here](https://docs.google.com/spreadsheets/d/1JszM7IDBI0lIma2_TuKwoHhBxzvCLvAZxbA28Op6RDk/edit?usp=sharing)

---

## Project Management

The management of this project involved several strategies and tools. A Kanban board was maintained throughout the project to track progress, supported by daily stand-ups amongst team members. Additionally, regular meetings were held both in a combination of text-based, audio, and video formats.

The project faced significant challenges to proper planning and organisation through a series of unexpected personal emergencies experienced by one of the team members. This significantly impacted the capacity of the team through much of development.

Despite this, development continued in a relatively orderly fashion, with daily stand-ups continuing to report progress on different features. As more complex features were tackled, requiring integration of front- and back-end components, daily collaborative development sessions became the norm to allow team members to work together and troubleshoot issues.

As development progressed, it was necessary to adjust the scope of the project, as initial plans proved to be overly ambitious given the limited time allowed for the project, as well as the challenges faced during this period.

Tasks were divided amongst the group based on the preferences of individual team-members, allowing each team member to work on aspects of the project of particular interest to them. Initial roles broadly covered front- and back-end development, with a third developer offering support for both. Once the basic framework of the product had been developed, tasks became increasingly granular as focus shifted to specific features (e.g., authorisation, setting availability, managing appointments, etc.), integration, deployment, and testing.

Internal documentation was also maintained throughout the project recording essential information about the app, assigned tasks, and minutes from team meetings.

![Image of project documentation showing minutes of early meetings](docs/minutes.png)

---

## Kanban Screenshots

![Image of project Kanban - 01](docs/kanban-screenshots/Kanban-1.png)

![Image of project Kanban - 02](docs/kanban-screenshots/Kanban-2.png)

![Image of project Kanban - 03](docs/kanban-screenshots/Kanban-3.png)

![Image of project Kanban - 04](docs/kanban-screenshots/Kanban-4.png)

![Image of project Kanban - 05](docs/kanban-screenshots/Kanban-5.png)

![Image of project Kanban - 06](docs/kanban-screenshots/Kanban-6.png)

![Image of project Kanban - 07](docs/kanban-screenshots/Kanban-7.png)

![Image of project Kanban - 08](docs/kanban-screenshots/Kanban-8.png)

![Image of project Kanban - 09](docs/kanban-screenshots/Kanban-9.png)

![Image of project Kanban - 10](docs/kanban-screenshots/Kanban-10.png)

![Image of project Kanban - 11](docs/kanban-screenshots/Kanban-11.png)

![Image of project Kanban - 12](docs/kanban-screenshots/Kanban-12.png)
