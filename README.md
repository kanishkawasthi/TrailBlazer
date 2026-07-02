# Jeep Club & Off-Road Event Management System
### DSA Course Project — 2024

---

## Project Summary

This is a Data Structures & Algorithms (DSA) project built for managing a Jeep club's members, off-road events, and participant registrations. It demonstrates practical usage of **Linked Lists** and **Queues** in a real-world scenario.

---

## File Structure

```
JeepClubSystem/
├── index.html       — Main web application (single page, all views)
├── style.css        — Stylesheet (plain CSS, no frameworks)
├── app.js           — All JavaScript logic (LinkedList + Queue + UI)
├── backend/
│   └── main.cpp     — C++ program demonstrating same DSA in a CLI app
└── README.md        — This file
```

---

## How to Run the Web App

1. Open `index.html` in any modern browser (Chrome, Firefox, Edge).
2. No server or installation needed — it runs entirely in the browser.
3. Data is saved to `localStorage` so it persists between sessions.

Alternatively, you can run a minimal Node-based static server (useful when you
want to serve the files over HTTP instead of opening the file directly).

Requirements: Node.js (v12+)

From the project root run:

```bash
cd backend
npm run dev
```

Then open http://localhost:3000 in your browser.

---

## How to Compile and Run the C++ Backend

You need `g++` (comes with MinGW on Windows or GCC on Linux/Mac).

```bash
# Navigate to the backend folder
cd backend

# Compile
g++ -o jeepclub main.cpp

# Run (Windows)
jeepclub.exe

# Run (Linux/Mac)
./jeepclub
```

The C++ program uses a text-based CLI menu with the same sample data as the web app.

---

## DSA Concepts Demonstrated

### 1. Linked List — Member Management

- **Node structure**: Each node holds one `Member` object and a `next` pointer.
- **Append (Insert)**: Traverses to the last node and adds a new one there.
- **DeleteById**: Rewires `next` pointers to skip over the deleted node; frees memory.
- **FindById (Search)**: Traverses from `head` until the matching ID is found.
- **UpdateById**: Finds the node and modifies its data in-place.
- **Traversal**: Walks from `head` to the last node to display all members.

In JavaScript (`app.js`): `LinkedList` class — same logic, adapted to JS.
In C++ (`main.cpp`): `LinkedList` class with `MemberNode*` pointers.

### 2. Queue — Waiting List (FIFO)

- When an event is **full**, the registrant is placed at the back of the queue (`enqueue`).
- When a registration is **cancelled**, the person at the front of the queue is automatically promoted (`dequeue`).
- Position in queue is shown to the user so they know how long they have to wait.
- **FIFO** ensures fairness — first person to join the waiting list gets the spot first.

In JavaScript (`app.js`): `Queue` class using an array (realistic for a student project).
In C++ (`main.cpp`): `Queue` class using linked `QueueNode` pointers.

---

## Sample Data (Pre-loaded)

### Members
| ID   | Name        | Jeep Model               | Status   |
|------|-------------|--------------------------|----------|
| M001 | Ahmed Raza  | Jeep Wrangler JK 2018    | Active   |
| M002 | Sara Khan   | Jeep Cherokee 2020       | Active   |
| M003 | Bilal Ahmed | Jeep Gladiator 2021      | Active   |
| M004 | Hina Malik  | Jeep Compass 2019        | Inactive |
| M005 | Usman Tariq | Jeep Grand Cherokee 2022 | Active   |

### Events
| ID   | Name                  | Location         | Capacity |
|------|-----------------------|------------------|----------|
| E001 | Cholistan Desert Run  | Cholistan Desert | 3        |
| E002 | Margalla Hill Climb   | Margalla Hills   | 2        |
| E003 | Kaghan Valley Trek    | Kaghan Valley    | 5        |

---

## Features

- **Dashboard** — shows total members, events, registrations, and waiting list count
- **Members** — add, edit, delete, search members (powered by Linked List)
- **Events** — create, edit, delete events with capacity tracking
- **Registration** — register members; auto-queues when event is full
- **Waiting List** — shows queue order with position numbers
- **History** — full log of registrations, cancellations, and promotions

---

## Authors
- [Student Name] — [Roll Number]
- [Partner Name] — [Roll Number]

**Course**: Data Structures and Algorithms  
**Instructor**: [Instructor Name]  
**Semester**: Fall 2024
