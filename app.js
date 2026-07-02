/*
 * ================================================================
 *  Jeep Club & Off-Road Event Management System
 *  app.js — All JavaScript Logic
 *
 *  Data Structures Used:
 *    - LinkedList  : stores Member records (add, delete, search, traverse)
 *    - Queue       : manages Waiting List using FIFO logic
 *
 *  All data is saved in localStorage so it persists between sessions.
 *  This mirrors what the C++ backend does in memory and with files.
 *
 *  Author: [Student Name] | DSA Course Project 2024
 * ================================================================
 */


// ================================================================
//  LINKED LIST — used for Member Management
//  Each node holds one Member object and a pointer (next) to
//  the next node. This is a singly linked list.
// ================================================================

class Node {
    constructor(data) {
        this.data = data;   // the actual Member object
        this.next = null;   // pointer to next node
    }
}

class LinkedList {
    constructor() {
        this.head = null;   // start of the list
        this.size = 0;
    }

    // Insert at the end of the list (Insertion)
    append(data) {
        const newNode = new Node(data);
        if (this.head === null) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next !== null) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.size++;
    }

    // Delete a node by member ID (Deletion)
    deleteById(id) {
        if (this.head === null) return false;

        // Special case: deleting the head node
        if (this.head.data.id === id) {
            this.head = this.head.next;
            this.size--;
            return true;
        }

        // Traverse to find the node before the one to delete
        let current = this.head;
        while (current.next !== null) {
            if (current.next.data.id === id) {
                current.next = current.next.next;
                this.size--;
                return true;
            }
            current = current.next;
        }
        return false;
    }

    // Search for a member by ID (Searching)
    findById(id) {
        let current = this.head;
        while (current !== null) {
            if (current.data.id === id) return current.data;
            current = current.next;
        }
        return null;
    }

    // Update a member's data by ID
    updateById(id, newData) {
        let current = this.head;
        while (current !== null) {
            if (current.data.id === id) {
                current.data = { ...current.data, ...newData };
                return true;
            }
            current = current.next;
        }
        return false;
    }

    // Traverse and return all members as an array (Traversal)
    toArray() {
        const result = [];
        let current = this.head;
        while (current !== null) {
            result.push(current.data);
            current = current.next;
        }
        return result;
    }

    // Search by name (partial match, case-insensitive)
    searchByName(query) {
        const result = [];
        let current = this.head;
        while (current !== null) {
            if (current.data.name.toLowerCase().includes(query.toLowerCase())) {
                result.push(current.data);
            }
            current = current.next;
        }
        return result;
    }

    // Load list from a plain array (used when restoring from localStorage)
    loadFromArray(arr) {
        this.head = null;
        this.size = 0;
        arr.forEach(item => this.append(item));
    }
}


// ================================================================
//  QUEUE — used for Waiting List Management (FIFO)
//  People are added at the rear (enqueue) and removed from
//  the front (dequeue). First in = first out.
// ================================================================

class Queue {
    constructor() {
        this.items = [];  // array-based queue (simple approach for a student project)
    }

    // Add person to the back of the waiting list (Enqueue)
    enqueue(item) {
        this.items.push(item);
    }

    // Remove person from the front of the waiting list (Dequeue)
    dequeue() {
        if (this.isEmpty()) return null;
        return this.items.shift();
    }

    // Look at who is next without removing them (Peek)
    peek() {
        if (this.isEmpty()) return null;
        return this.items[0];
    }

    // Check if queue is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Get size
    size() {
        return this.items.length;
    }

    // Get position of a specific entry (1-based)
    getPosition(memberId, eventId) {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].memberId === memberId && this.items[i].eventId === eventId) {
                return i + 1;
            }
        }
        return -1;
    }

    // Load from saved array
    loadFromArray(arr) {
        this.items = arr;
    }

    // Export to plain array (for localStorage)
    toArray() {
        return this.items;
    }
}


// ================================================================
//  Global Data — Instances of our DSA structures
// ================================================================

const memberList    = new LinkedList();  // all members
const waitlistQueue = new Queue();       // global waiting list across all events

// Simple arrays for events, registrations, and history (no DSA needed — plain CRUD)
let events        = [];
let registrations = [];
let history       = [];

// Auto-incrementing IDs
let nextMemberId = 1;
let nextEventId  = 1;
let nextRegId    = 1;


// ================================================================
//  LocalStorage — Save & Load everything
// ================================================================

function saveAll() {
    localStorage.setItem('jc_members',       JSON.stringify(memberList.toArray()));
    localStorage.setItem('jc_events',        JSON.stringify(events));
    localStorage.setItem('jc_registrations', JSON.stringify(registrations));
    localStorage.setItem('jc_waitlist',      JSON.stringify(waitlistQueue.toArray()));
    localStorage.setItem('jc_history',       JSON.stringify(history));
    localStorage.setItem('jc_nextMemberId',  nextMemberId);
    localStorage.setItem('jc_nextEventId',   nextEventId);
    localStorage.setItem('jc_nextRegId',     nextRegId);
}

function loadAll() {
    const mem  = JSON.parse(localStorage.getItem('jc_members')       || '[]');
    const evt  = JSON.parse(localStorage.getItem('jc_events')        || '[]');
    const reg  = JSON.parse(localStorage.getItem('jc_registrations') || '[]');
    const wl   = JSON.parse(localStorage.getItem('jc_waitlist')      || '[]');
    const hist = JSON.parse(localStorage.getItem('jc_history')       || '[]');

    memberList.loadFromArray(mem);
    events        = evt;
    registrations = reg;
    waitlistQueue.loadFromArray(wl);
    history       = hist;

    nextMemberId = parseInt(localStorage.getItem('jc_nextMemberId') || '1');
    nextEventId  = parseInt(localStorage.getItem('jc_nextEventId')  || '1');
    nextRegId    = parseInt(localStorage.getItem('jc_nextRegId')    || '1');
}


// ================================================================
//  Navigation — show/hide pages
// ================================================================

function showPage(name) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-links button').forEach(b => b.classList.remove('active'));

    const selectedPage = document.getElementById('page-' + name);
    if (selectedPage) selectedPage.classList.add('active');
    const navBtn = document.getElementById('nav-' + name);
    if (navBtn) navBtn.classList.add('active');

    if (name === 'dashboard') renderDashboard();
    if (name === 'members') renderMembersTable();
    if (name === 'events') renderEventsTable();
    if (name === 'register') renderRegisterPage();
    if (name === 'waitlist') renderWaitlist();
    if (name === 'history') renderHistory();
}


// ================================================================
//  Toast Notification (simple feedback message)
// ================================================================

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.style.display = 'block';
    setTimeout(() => { t.style.display = 'none'; }, 3000);
}


// ================================================================
//  DASHBOARD
// ================================================================

function animateValue(element, endValue) {
    if (!element) return;
    const start = Number(element.dataset.value || 0);
    const duration = 600;
    const startTime = performance.now();

    function frame(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const current = Math.floor(start + (endValue - start) * progress);
        element.textContent = current;
        element.dataset.value = current;
        if (progress < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
}

function renderDashboard() {
    const registeredCount = registrations.filter(r => r.status === 'Registered').length;
    const waitingCount = waitlistQueue.toArray().length;

    const membersEl = document.getElementById('stat-members');
    const eventsEl = document.getElementById('stat-events');
    const registeredEl = document.getElementById('stat-registered');
    const waitingEl = document.getElementById('stat-waiting');
    const heroMembersEl = document.getElementById('hero-members');
    const heroEventsEl = document.getElementById('hero-events');
    const heroRegistrationsEl = document.getElementById('hero-registrations');
    const heroQueueEl = document.getElementById('hero-queue');

    [membersEl, heroMembersEl].forEach(el => el && animateValue(el, memberList.size));
    [eventsEl, heroEventsEl].forEach(el => el && animateValue(el, events.length));
    [registeredEl, heroRegistrationsEl].forEach(el => el && animateValue(el, registeredCount));
    [waitingEl, heroQueueEl].forEach(el => el && animateValue(el, waitingCount));

    const feed = document.getElementById('recent-activity-feed');
    if (feed) {
        if (history.length === 0) {
            feed.innerHTML = '<div class="empty-msg">No activity yet.</div>';
        } else {
            const recent = [...history].reverse().slice(0, 8);
            feed.innerHTML = recent.map(h => {
                const actionType = h.action.toLowerCase().includes('wait') ? 'queue' : h.action.toLowerCase().includes('register') ? 'register' : h.action.toLowerCase().includes('delete') ? 'delete' : 'add';
                return `
                    <div class="activity-item">
                        <div class="activity-icon ${actionType}">${actionType === 'queue' ? 'Q' : actionType === 'register' ? 'R' : actionType === 'delete' ? 'D' : 'A'}</div>
                        <div class="activity-meta">
                            <div><strong>${h.action}</strong> • ${h.member}</div>
                            <div class="activity-time">${h.details || '—'}</div>
                        </div>
                        <div class="activity-time">${h.time}</div>
                    </div>
                `;
            }).join('');
        }
    }

    const dsaPanel = document.getElementById('dashboard-dsa-panel');
    if (dsaPanel) {
        const members = memberList.toArray();
        const nodes = members.slice(0, 5).map((m, index) => `
            <div class="dsa-node-row">
                <div class="dsa-node ${index === 0 ? 'dsa-node--head' : ''}">${index === 0 ? 'head' : `[${m.id} | ${m.name}]`}</div>
                ${index < members.length - 1 ? '<div class="dsa-arrow">→</div>' : '<div class="dsa-arrow dsa-arrow--null">null</div>'}
            </div>
        `).join('');
        dsaPanel.innerHTML = `<div class="dsa-node-row"><div class="dsa-node dsa-node--head">head</div><div class="dsa-arrow">→</div></div>${nodes}`;
    }

    const insights = document.getElementById('dashboard-insights');
    if (insights) {
        const members = memberList.toArray();
        const activeMembers = members.filter(m => m.status === 'Active').length;
        const nextEvent = [...events].sort((a, b) => a.date.localeCompare(b.date))[0];
        const queueEntries = waitlistQueue.toArray();
        const memberActivity = members
            .map(m => ({ ...m, registrado: registrations.filter(r => r.memberId === m.id && r.status === 'Registered').length }))
            .sort((a, b) => b.registrado - a.registrado)[0];

        insights.innerHTML = `
            <div class="highlight-card">
                <div class="highlight-title">Most active</div>
                <div class="highlight-value">${memberActivity ? memberActivity.name : 'No members yet'}</div>
                <div class="highlight-meta">${memberActivity ? `${memberActivity.registrado} confirmed bookings` : 'Add your first member'}</div>
            </div>
            <div class="highlight-card">
                <div class="highlight-title">Next event</div>
                <div class="highlight-value">${nextEvent ? nextEvent.name : 'No events yet'}</div>
                <div class="highlight-meta">${nextEvent ? `${nextEvent.location} • ${nextEvent.date}` : 'Create a trail event'}</div>
            </div>
            <div class="highlight-card">
                <div class="highlight-title">Queue health</div>
                <div class="highlight-value">${queueEntries.length}</div>
                <div class="highlight-meta">${activeMembers} active members • ${queueEntries.length > 0 ? 'waiting list active' : 'queue clear'}</div>
            </div>
        `;
    }

    const clock = document.getElementById('dashboard-clock');
    if (clock) {
        const updateClock = () => {
            const now = new Date();
            clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };
        updateClock();
        clearInterval(window.dashboardClockInterval);
        window.dashboardClockInterval = setInterval(updateClock, 1000);
    }

    const memberCountPill = document.getElementById('member-count-pill');
    if (memberCountPill) memberCountPill.textContent = `${memberList.size} members`;
}


// ================================================================
//  MEMBER MANAGEMENT (Linked List)
// ================================================================

function saveMember() {
    const name   = document.getElementById('m-name').value.trim();
    const phone  = document.getElementById('m-phone').value.trim();
    const email  = document.getElementById('m-email').value.trim();
    const jeep   = document.getElementById('m-jeep').value.trim();
    const status = document.getElementById('m-status').value;
    const editId = document.getElementById('m-edit-id').value;

    if (!name || !phone || !email || !jeep) {
        showToast('Please fill in all fields.');
        return;
    }

    if (editId) {
        // UPDATE existing node in linked list
        memberList.updateById(editId, { name, phone, email, jeep, status });
        addHistory('Updated Member', name, `Status: ${status}`);
        showToast('Member updated successfully.');
        clearMemberForm();
    } else {
        // INSERT new node into linked list
        const member = {
            id:     'M' + String(nextMemberId).padStart(3, '0'),
            name,
            phone,
            email,
            jeep,
            status
        };
        nextMemberId++;
        memberList.append(member);    // <-- Linked List append
        addHistory('Added Member', name, `ID: ${member.id}`);
        showToast('Member added successfully.');
        clearMemberForm();
    }

    saveAll();
    renderMembersTable();
}

function editMember(id) {
    // SEARCH linked list by ID
    const m = memberList.findById(id);
    if (!m) return;

    document.getElementById('m-name').value    = m.name;
    document.getElementById('m-phone').value   = m.phone;
    document.getElementById('m-email').value   = m.email;
    document.getElementById('m-jeep').value    = m.jeep;
    document.getElementById('m-status').value  = m.status;
    document.getElementById('m-edit-id').value = m.id;
    document.getElementById('member-form-title').textContent = 'Edit Member — ' + m.name;
    document.getElementById('btn-cancel-member').style.display = 'inline-block';
    window.scrollTo(0, 0);
}

function deleteMember(id) {
    if (!confirm('Delete this member? Their registrations will remain in history.')) return;
    const m = memberList.findById(id);
    if (m) {
        memberList.deleteById(id);   // <-- Linked List delete
        addHistory('Deleted Member', m.name, `ID: ${id}`);
        saveAll();
        renderMembersTable();
        showToast('Member deleted.');
    }
}

function clearMemberForm() {
    document.getElementById('m-name').value    = '';
    document.getElementById('m-phone').value   = '';
    document.getElementById('m-email').value   = '';
    document.getElementById('m-jeep').value    = '';
    document.getElementById('m-status').value  = 'Active';
    document.getElementById('m-edit-id').value = '';
    document.getElementById('member-form-title').textContent = 'Add New Member';
    document.getElementById('btn-cancel-member').style.display = 'none';
}

function renderMembersTable() {
    const query = document.getElementById('member-search').value.trim().toLowerCase();
    const tbody = document.getElementById('members-table-body');

    let members = memberList.toArray();
    if (query) {
        members = members.filter(m =>
            m.name.toLowerCase().includes(query) ||
            m.id.toLowerCase().includes(query)
        );
    }

    const dsaPanel = document.getElementById('members-dsa-panel');
    if (dsaPanel) {
        const nodes = members.map((m, index) => `
            <div class="dsa-node-row">
                <div class="dsa-node ${index === 0 ? 'dsa-node--head' : ''}">[${m.id} | ${m.name}]</div>
                ${index < members.length - 1 ? '<div class="dsa-arrow">→</div>' : '<div class="dsa-arrow dsa-arrow--null">null</div>'}
            </div>
        `).join('');
        dsaPanel.innerHTML = `<div class="dsa-node-row"><div class="dsa-node dsa-node--head">head</div><div class="dsa-arrow">→</div></div>${nodes}`;
    }

    if (members.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-msg">No members found.</td></tr>';
        return;
    }

    tbody.innerHTML = members.map(m => `
        <tr>
            <td>${m.id}</td>
            <td>${m.name}</td>
            <td>${m.phone}</td>
            <td>${m.email}</td>
            <td>${m.jeep}</td>
            <td><span class="badge ${m.status === 'Active' ? 'badge-active' : 'badge-inactive'}">${m.status}</span></td>
            <td class="action-btns">
                <button class="btn btn-warning btn-sm" onclick="editMember('${m.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteMember('${m.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}


// ================================================================
//  EVENT MANAGEMENT
// ================================================================

function saveEvent() {
    const name     = document.getElementById('e-name').value.trim();
    const location = document.getElementById('e-location').value.trim();
    const date     = document.getElementById('e-date').value;
    const capacity = parseInt(document.getElementById('e-capacity').value);
    const editId   = document.getElementById('e-edit-id').value;

    if (!name || !location || !date || !capacity || capacity < 1) {
        showToast('Please fill in all event fields correctly.');
        return;
    }

    if (editId) {
        // Update existing event
        const ev = events.find(e => e.id === editId);
        if (ev) {
            ev.name     = name;
            ev.location = location;
            ev.date     = date;
            ev.capacity = capacity;
            addHistory('Updated Event', name, `Location: ${location}`);
            showToast('Event updated.');
        }
        clearEventForm();
    } else {
        const ev = {
            id:       'E' + String(nextEventId).padStart(3, '0'),
            name,
            location,
            date,
            capacity,
            registered: 0
        };
        nextEventId++;
        events.push(ev);
        addHistory('Created Event', name, `Location: ${location}, Capacity: ${capacity}`);
        showToast('Event created.');
        clearEventForm();
    }

    saveAll();
    renderEventsTable();
}

function editEvent(id) {
    const ev = events.find(e => e.id === id);
    if (!ev) return;
    document.getElementById('e-name').value     = ev.name;
    document.getElementById('e-location').value = ev.location;
    document.getElementById('e-date').value     = ev.date;
    document.getElementById('e-capacity').value = ev.capacity;
    document.getElementById('e-edit-id').value  = ev.id;
    document.getElementById('event-form-title').textContent = 'Edit Event — ' + ev.name;
    document.getElementById('btn-cancel-event').style.display = 'inline-block';
    window.scrollTo(0, 0);
}

function deleteEvent(id) {
    if (!confirm('Delete this event? All registrations for it will be cancelled.')) return;
    const ev = events.find(e => e.id === id);
    if (!ev) return;

    // Cancel all registrations for this event
    registrations.forEach(r => {
        if (r.eventId === id && r.status === 'Registered') {
            r.status = 'Cancelled';
        }
    });

    // Remove waitlist entries for this event
    waitlistQueue.items = waitlistQueue.items.filter(w => w.eventId !== id);

    events = events.filter(e => e.id !== id);
    addHistory('Deleted Event', ev.name, `ID: ${id}`);
    saveAll();
    renderEventsTable();
    showToast('Event deleted.');
}

function clearEventForm() {
    document.getElementById('e-name').value     = '';
    document.getElementById('e-location').value = '';
    document.getElementById('e-date').value     = '';
    document.getElementById('e-capacity').value = '';
    document.getElementById('e-edit-id').value  = '';
    document.getElementById('event-form-title').textContent = 'Create New Event';
    document.getElementById('btn-cancel-event').style.display = 'none';
}

function renderEventsTable() {
    const query = document.getElementById('event-search').value.trim().toLowerCase();
    const tbody = document.getElementById('events-table-body');

    let list = events;
    if (query) {
        list = list.filter(e =>
            e.name.toLowerCase().includes(query) ||
            e.location.toLowerCase().includes(query)
        );
    }

    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-msg">No events found.</td></tr>';
        return;
    }

    tbody.innerHTML = list.map(e => {
        const isFull   = e.registered >= e.capacity;
        const statusBadge = isFull
            ? '<span class="badge badge-full">Full</span>'
            : '<span class="badge badge-open">Open</span>';
        return `
        <tr>
            <td>${e.id}</td>
            <td>${e.name}</td>
            <td>${e.location}</td>
            <td>${e.date}</td>
            <td>${e.capacity}</td>
            <td>${e.registered}</td>
            <td>${statusBadge}</td>
            <td class="action-btns">
                <button class="btn btn-warning btn-sm" onclick="editEvent('${e.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteEvent('${e.id}')">Delete</button>
            </td>
        </tr>
        `;
    }).join('');
}


// ================================================================
//  REGISTRATION + QUEUE (Waiting List)
// ================================================================

function renderRegisterPage() {
    const memberSel = document.getElementById('reg-member');
    memberSel.innerHTML = '<option value="">-- Select Member --</option>';
    memberList.toArray().forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = `${m.id} — ${m.name}`;
        memberSel.appendChild(opt);
    });

    const eventSel = document.getElementById('reg-event');
    eventSel.innerHTML = '<option value="">-- Select Event --</option>';
    events.forEach(e => {
        const opt = document.createElement('option');
        opt.value = e.id;
        opt.textContent = `${e.id} — ${e.name} (${e.registered}/${e.capacity})`;
        eventSel.appendChild(opt);
    });

    document.getElementById('reg-capacity-info').textContent = '';
    renderRegistrationsTable();
    renderQueuePreview();
}

function renderQueuePreview() {
    const container = document.getElementById('queue-preview');
    if (!container) return;
    const entries = waitlistQueue.toArray();
    if (entries.length === 0) {
        container.innerHTML = '<div class="empty-msg">Queue is clear. No one is waiting right now.</div>';
        return;
    }
    container.innerHTML = `
        <div class="queue-visual">
            <div class="queue-chip queue-chip-front">FRONT</div>
            <div class="queue-track">
                ${entries.map((entry, index) => `
                    <div class="queue-slot ${index === 0 ? 'queue-slot--active' : ''}">
                        <div class="queue-slot-number">#${index + 1}</div>
                        <div class="queue-slot-name">${entry.memberName}</div>
                        <div class="queue-slot-event">${entry.eventName}</div>
                    </div>
                `).join('')}
            </div>
            <div class="queue-chip queue-chip-rear">REAR</div>
        </div>
    `;
}

function checkEventCapacity() {
    const eventId = document.getElementById('reg-event').value;
    const infoDiv = document.getElementById('reg-capacity-info');
    if (!eventId) { infoDiv.textContent = ''; return; }

    const ev = events.find(e => e.id === eventId);
    if (!ev) return;

    const spotsLeft = ev.capacity - ev.registered;
    if (spotsLeft > 0) {
        infoDiv.innerHTML = `<span style="color:#155724;">&#10003; ${spotsLeft} spot(s) available in this event.</span>`;
    } else {
        infoDiv.innerHTML = `<span style="color:#721c24;">&#9888; This event is FULL. Member will be added to the Waiting List.</span>`;
    }
}

function registerMember() {
    const memberId = document.getElementById('reg-member').value;
    const eventId  = document.getElementById('reg-event').value;

    if (!memberId || !eventId) {
        showToast('Please select both a member and an event.');
        return;
    }

    const member = memberList.findById(memberId);
    const ev     = events.find(e => e.id === eventId);
    if (!member || !ev) { showToast('Invalid selection.'); return; }

    // Check if member is already registered or waiting for this event
    const alreadyReg = registrations.find(
        r => r.memberId === memberId && r.eventId === eventId && r.status === 'Registered'
    );
    if (alreadyReg) {
        showToast(`${member.name} is already registered for ${ev.name}.`);
        return;
    }

    const alreadyWaiting = waitlistQueue.toArray().find(
        w => w.memberId === memberId && w.eventId === eventId
    );
    if (alreadyWaiting) {
        const pos = waitlistQueue.getPosition(memberId, eventId);
        showToast(`${member.name} is already on the waiting list (position #${pos}).`);
        return;
    }

    if (ev.registered < ev.capacity) {
        // ---- DIRECT REGISTRATION ----
        const reg = {
            id:         'R' + String(nextRegId).padStart(3, '0'),
            memberId,
            memberName: member.name,
            eventId,
            eventName:  ev.name,
            date:       new Date().toLocaleDateString(),
            status:     'Registered'
        };
        nextRegId++;
        registrations.push(reg);
        ev.registered++;
        addHistory('Registered', member.name, `Event: ${ev.name}`);
        showToast(`${member.name} registered for ${ev.name}!`);
    } else {
        // ---- ADD TO WAITING LIST QUEUE (Enqueue) ----
        const wlEntry = {
            memberId,
            memberName: member.name,
            eventId,
            eventName:  ev.name,
            joinedAt:   new Date().toLocaleDateString()
        };
        waitlistQueue.enqueue(wlEntry);   // <-- Queue enqueue
        addHistory('Added to Waitlist', member.name, `Event: ${ev.name} (Queue)`);
        const pos = waitlistQueue.getPosition(memberId, eventId);
        showToast(`Event full! ${member.name} added to waiting list (position #${pos}).`);
    }

    saveAll();
    renderRegisterPage();
}

function cancelRegistration(regId) {
    if (!confirm('Cancel this registration? The next person on the waiting list will be promoted.')) return;

    const reg = registrations.find(r => r.id === regId);
    if (!reg) return;

    reg.status = 'Cancelled';

    // Reduce event count
    const ev = events.find(e => e.id === reg.eventId);
    if (ev && ev.registered > 0) ev.registered--;

    addHistory('Cancelled Registration', reg.memberName, `Event: ${reg.eventName}`);

    // Check if anyone is waiting for this event — if so, DEQUEUE them
    const waiting = waitlistQueue.toArray().filter(w => w.eventId === reg.eventId);
    if (waiting.length > 0) {
        // Find and remove the first one from the queue (FIFO dequeue)
        const promoted = waiting[0];
        waitlistQueue.items = waitlistQueue.items.filter(
            w => !(w.memberId === promoted.memberId && w.eventId === promoted.eventId)
        );

        // Register the promoted person
        const newReg = {
            id:         'R' + String(nextRegId).padStart(3, '0'),
            memberId:   promoted.memberId,
            memberName: promoted.memberName,
            eventId:    promoted.eventId,
            eventName:  promoted.eventName,
            date:       new Date().toLocaleDateString(),
            status:     'Registered'
        };
        nextRegId++;
        registrations.push(newReg);
        if (ev) ev.registered++;

        addHistory('Promoted from Waitlist', promoted.memberName, `Event: ${promoted.eventName}`);
        showToast(`Registration cancelled. ${promoted.memberName} was promoted from the waiting list!`);
    } else {
        showToast('Registration cancelled. No one was on the waiting list for this event.');
    }

    saveAll();
    renderRegisterPage();
}

function renderRegistrationsTable() {
    const query = document.getElementById('reg-search').value.trim().toLowerCase();
    const tbody = document.getElementById('reg-table-body');

    let list = registrations.filter(r => r.status === 'Registered');
    if (query) {
        list = list.filter(r =>
            r.memberName.toLowerCase().includes(query) ||
            r.eventName.toLowerCase().includes(query)
        );
    }

    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-msg">No active registrations.</td></tr>';
        return;
    }

    tbody.innerHTML = list.map(r => `
        <tr>
            <td>${r.id}</td>
            <td>${r.memberName}</td>
            <td>${r.eventName}</td>
            <td>${r.date}</td>
            <td><span class="badge badge-registered">Registered</span></td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="cancelRegistration('${r.id}')">Cancel</button>
            </td>
        </tr>
    `).join('');
}


// ================================================================
//  WAITING LIST (Queue Display)
// ================================================================

function renderWaitlist() {
    const filterSel = document.getElementById('waitlist-event-filter');
    const prevVal = filterSel.value;
    filterSel.innerHTML = '<option value="">-- All Events --</option>';
    events.forEach(e => {
        const opt = document.createElement('option');
        opt.value = e.id;
        opt.textContent = e.name;
        filterSel.appendChild(opt);
    });
    if (prevVal) filterSel.value = prevVal;

    const container = document.getElementById('waitlist-container');
    const selectedEvent = filterSel.value;

    let list = waitlistQueue.toArray();
    if (selectedEvent) {
        list = list.filter(w => w.eventId === selectedEvent);
    }

    if (list.length === 0) {
        container.innerHTML = '<div class="empty-msg">Queue is clear. No one is waiting right now.</div>';
        return;
    }

    container.innerHTML = list.map((w, index) => `
        <div class="queue-item">
            <div class="queue-position">${index + 1}</div>
            <div>
                <strong>${w.memberName}</strong><br />
                <span style="font-size:13px; color:#8f96a8;">Event: ${w.eventName} • Joined: ${w.joinedAt}</span>
            </div>
            <div style="margin-left:auto; font-size:13px; color:#8f96a8;">
                <span class="badge badge-waiting">Waiting</span>
            </div>
        </div>
    `).join('');
}


// ================================================================
//  HISTORY LOG
// ================================================================

function addHistory(action, member, details) {
    const now = new Date();
    history.push({
        time:    now.toLocaleString(),
        action,
        member,
        details
    });
}

function renderHistory() {
    const timeline = document.getElementById('history-timeline');
    if (!timeline) return;

    if (history.length === 0) {
        timeline.innerHTML = '<div class="empty-msg">No history yet.</div>';
        return;
    }

    const reversed = [...history].reverse();
    timeline.innerHTML = reversed.map((h) => {
        const actionType = h.action.toLowerCase().includes('wait') ? 'queue' : h.action.toLowerCase().includes('register') ? 'register' : h.action.toLowerCase().includes('delete') ? 'delete' : h.action.toLowerCase().includes('promot') ? 'promote' : 'add';
        return `
            <div class="timeline-item">
                <div class="timeline-dot ${actionType}"></div>
                <div>
                    <div><strong>${h.action}</strong> • ${h.member}</div>
                    <div class="activity-time">${h.details || '—'}</div>
                    <div class="activity-time">${h.time}</div>
                </div>
            </div>
        `;
    }).join('');
}


// ================================================================
//  SAMPLE DATA — pre-loads some data on first run
// ================================================================

function loadSampleData() {
    // Sample Members
    const sampleMembers = [
        { id: 'M001', name: 'Ahmed Raza',    phone: '0300-1234567', email: 'ahmed@email.com',  jeep: 'Jeep Wrangler JK 2018',    status: 'Active'   },
        { id: 'M002', name: 'Sara Khan',     phone: '0321-9876543', email: 'sara@email.com',   jeep: 'Jeep Cherokee 2020',       status: 'Active'   },
        { id: 'M003', name: 'Bilal Ahmed',   phone: '0333-5551234', email: 'bilal@email.com',  jeep: 'Jeep Gladiator 2021',      status: 'Active'   },
        { id: 'M004', name: 'Hina Malik',    phone: '0312-7778888', email: 'hina@email.com',   jeep: 'Jeep Compass 2019',        status: 'Inactive' },
        { id: 'M005', name: 'Usman Tariq',   phone: '0345-4443322', email: 'usman@email.com',  jeep: 'Jeep Grand Cherokee 2022', status: 'Active'   },
    ];

    sampleMembers.forEach(m => memberList.append(m));
    nextMemberId = 6;

    // Sample Events
    events = [
        { id: 'E001', name: 'Cholistan Desert Run',  location: 'Cholistan Desert', date: '2024-12-15', capacity: 3, registered: 0 },
        { id: 'E002', name: 'Margalla Hill Climb',   location: 'Margalla Hills',   date: '2024-12-22', capacity: 2, registered: 0 },
        { id: 'E003', name: 'Kaghan Valley Trek',    location: 'Kaghan Valley',    date: '2025-01-10', capacity: 5, registered: 0 },
    ];
    nextEventId = 4;

    addHistory('System', 'Sample Data', 'Loaded 5 members and 3 events');
    saveAll();
}


// ================================================================
//  INIT — runs when the page loads
// ================================================================

(function init() {
    loadAll();

    if (memberList.size === 0 && events.length === 0) {
        loadSampleData();
    }

    renderDashboard();
    renderMembersTable();
    renderEventsTable();
    renderRegisterPage();
    renderWaitlist();
    renderHistory();
})();
