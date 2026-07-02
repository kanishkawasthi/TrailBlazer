/*
 * ================================================================
 *  Jeep Club & Off-Road Event Management System
 *  main.cpp — C++ Backend (Single File)
 *
 *  This program demonstrates the same core data structures used
 *  in the web frontend, but implemented fully in C++:
 *
 *    - LinkedList : for managing Member records
 *    - Queue      : for managing the Event Waiting List (FIFO)
 *
 *  How to compile:
 *    g++ -o jeepclub main.cpp
 *    or on Windows with MSVC:
 *    cl main.cpp /Fe:jeepclub.exe
 *
 *  Then run:
 *    ./jeepclub     (Linux/Mac)
 *    jeepclub.exe   (Windows)
 *
 *  Author: [Student Name] | DSA Course Project 2024
 * ================================================================
 */

#include <iostream>
#include <string>
#include <iomanip>
#include <sstream>
using namespace std;


// ================================================================
//  DATA STRUCTURES — Member, Event, WaitlistEntry
// ================================================================

struct Member {
    string id;
    string name;
    string phone;
    string email;
    string jeepModel;
    string status;  // "Active" or "Inactive"
};

struct Event {
    string id;
    string name;
    string location;
    string date;
    int    capacity;
    int    registered;
};

struct Registration {
    string regId;
    string memberId;
    string memberName;
    string eventId;
    string eventName;
    string status;  // "Registered" or "Cancelled"
};

struct WaitlistEntry {
    string memberId;
    string memberName;
    string eventId;
    string eventName;
};


// ================================================================
//  LINKED LIST — Member Management
//
//  A singly linked list where each node holds one Member.
//  Operations: append, delete, search, traverse, update
// ================================================================

struct MemberNode {
    Member      data;
    MemberNode* next;

    MemberNode(Member m) : data(m), next(nullptr) {}
};

class LinkedList {
private:
    MemberNode* head;
    int         count;

public:
    LinkedList() : head(nullptr), count(0) {}

    // Destructor — free all nodes from memory
    ~LinkedList() {
        MemberNode* current = head;
        while (current != nullptr) {
            MemberNode* temp = current;
            current = current->next;
            delete temp;
        }
    }

    // ------ INSERT: Add new member at the end ------
    void append(Member m) {
        MemberNode* newNode = new MemberNode(m);

        if (head == nullptr) {
            head = newNode;
        } else {
            // Walk to the last node
            MemberNode* current = head;
            while (current->next != nullptr) {
                current = current->next;
            }
            current->next = newNode;
        }
        count++;
    }

    // ------ DELETE: Remove member by ID ------
    bool deleteById(string id) {
        if (head == nullptr) return false;

        // Special case: deleting the head node
        if (head->data.id == id) {
            MemberNode* temp = head;
            head = head->next;
            delete temp;
            count--;
            return true;
        }

        // Find the node just before the one to delete
        MemberNode* current = head;
        while (current->next != nullptr) {
            if (current->next->data.id == id) {
                MemberNode* temp = current->next;
                current->next = current->next->next;  // bypass the node
                delete temp;
                count--;
                return true;
            }
            current = current->next;
        }
        return false;
    }

    // ------ SEARCH: Find member by ID ------
    Member* findById(string id) {
        MemberNode* current = head;
        while (current != nullptr) {
            if (current->data.id == id) return &current->data;
            current = current->next;
        }
        return nullptr;
    }

    // ------ UPDATE: Modify member data ------
    bool updateById(string id, Member newData) {
        MemberNode* current = head;
        while (current != nullptr) {
            if (current->data.id == id) {
                current->data = newData;
                return true;
            }
            current = current->next;
        }
        return false;
    }

    // ------ TRAVERSE: Print all members ------
    void displayAll() {
        if (head == nullptr) {
            cout << "  No members in the system.\n";
            return;
        }

        cout << left
             << setw(7)  << "ID"
             << setw(20) << "Name"
             << setw(15) << "Phone"
             << setw(25) << "Email"
             << setw(25) << "Jeep Model"
             << "Status" << "\n";
        cout << string(97, '-') << "\n";

        MemberNode* current = head;
        while (current != nullptr) {
            Member& m = current->data;
            cout << left
                 << setw(7)  << m.id
                 << setw(20) << m.name
                 << setw(15) << m.phone
                 << setw(25) << m.email
                 << setw(25) << m.jeepModel
                 << m.status << "\n";
            current = current->next;
        }
        cout << "\n  Total Members: " << count << "\n";
    }

    int getCount() { return count; }
};


// ================================================================
//  QUEUE — Waiting List Management (FIFO)
//
//  People join the back of the queue (enqueue) and leave from
//  the front (dequeue). This ensures fair ordering.
// ================================================================

struct QueueNode {
    WaitlistEntry data;
    QueueNode*    next;

    QueueNode(WaitlistEntry e) : data(e), next(nullptr) {}
};

class Queue {
private:
    QueueNode* front;  // person who joined first (will leave first)
    QueueNode* rear;   // person who joined last
    int        count;

public:
    Queue() : front(nullptr), rear(nullptr), count(0) {}

    ~Queue() {
        QueueNode* current = front;
        while (current != nullptr) {
            QueueNode* temp = current;
            current = current->next;
            delete temp;
        }
    }

    // ------ ENQUEUE: Add person to back of waiting list ------
    void enqueue(WaitlistEntry entry) {
        QueueNode* newNode = new QueueNode(entry);
        if (rear == nullptr) {
            front = rear = newNode;
        } else {
            rear->next = newNode;
            rear = newNode;
        }
        count++;
        cout << "  [Queue] " << entry.memberName
             << " added to waiting list for '" << entry.eventName
             << "' (Position: " << count << ")\n";
    }

    // ------ DEQUEUE: Remove person from front of queue ------
    WaitlistEntry dequeue() {
        if (front == nullptr) {
            cout << "  [Queue] Waiting list is empty.\n";
            return {"", "", "", ""};
        }
        QueueNode*    temp  = front;
        WaitlistEntry entry = front->data;
        front = front->next;
        if (front == nullptr) rear = nullptr;
        delete temp;
        count--;
        return entry;
    }

    // ------ PEEK: Look at who is next without removing ------
    WaitlistEntry peek() {
        if (front == nullptr) return {"", "", "", ""};
        return front->data;
    }

    bool isEmpty() { return front == nullptr; }
    int  getCount() { return count; }

    // ------ DISPLAY: Show all waiting list entries with position ------
    void displayAll() {
        if (front == nullptr) {
            cout << "  Waiting list is empty.\n";
            return;
        }

        cout << left
             << setw(5)  << "Pos"
             << setw(20) << "Member Name"
             << setw(10) << "Event ID"
             << "Event Name" << "\n";
        cout << string(60, '-') << "\n";

        QueueNode* current = front;
        int pos = 1;
        while (current != nullptr) {
            WaitlistEntry& e = current->data;
            cout << left
                 << setw(5)  << pos
                 << setw(20) << e.memberName
                 << setw(10) << e.eventId
                 << e.eventName << "\n";
            current = current->next;
            pos++;
        }
        cout << "\n  Total in Waiting List: " << count << "\n";
    }
};


// ================================================================
//  Helper — Simple ID generator
// ================================================================

string makeId(string prefix, int num) {
    ostringstream ss;
    ss << prefix << setw(3) << setfill('0') << num;
    return ss.str();
}

void printSeparator() {
    cout << "\n" << string(60, '=') << "\n";
}


// ================================================================
//  MAIN — CLI Menu System
// ================================================================

int main() {
    LinkedList members;
    Queue      waitlist;

    // --- Arrays for events and registrations (simple, no DSA needed) ---
    const int MAX_EVENTS = 50;
    const int MAX_REGS   = 200;
    Event        events[MAX_EVENTS];
    Registration regs[MAX_REGS];
    int          eventCount = 0;
    int          regCount   = 0;

    // Auto-increment counters
    int memberCounter = 1;
    int eventCounter  = 1;
    int regCounter    = 1;

    // --- Pre-load sample data ---
    Member sampleMembers[] = {
        { "M001", "Ahmed Raza",  "0300-1234567", "ahmed@email.com", "Jeep Wrangler JK 2018",    "Active"   },
        { "M002", "Sara Khan",   "0321-9876543", "sara@email.com",  "Jeep Cherokee 2020",       "Active"   },
        { "M003", "Bilal Ahmed", "0333-5551234", "bilal@email.com", "Jeep Gladiator 2021",      "Active"   },
        { "M004", "Hina Malik",  "0312-7778888", "hina@email.com",  "Jeep Compass 2019",        "Inactive" },
        { "M005", "Usman Tariq", "0345-4443322", "usman@email.com", "Jeep Grand Cherokee 2022", "Active"   },
    };
    for (int i = 0; i < 5; i++) {
        members.append(sampleMembers[i]);
    }
    memberCounter = 6;

    events[0] = { "E001", "Cholistan Desert Run", "Cholistan Desert", "2024-12-15", 3, 0 };
    events[1] = { "E002", "Margalla Hill Climb",  "Margalla Hills",   "2024-12-22", 2, 0 };
    events[2] = { "E003", "Kaghan Valley Trek",   "Kaghan Valley",    "2025-01-10", 5, 0 };
    eventCount  = 3;
    eventCounter = 4;

    cout << "\n  Sample data loaded: 5 members, 3 events.\n";

    // ---- Main menu loop ----
    int choice = 0;
    while (true) {
        printSeparator();
        cout << "  JEEP CLUB & OFF-ROAD EVENT MANAGEMENT SYSTEM\n";
        printSeparator();
        cout << "  1. Member Management\n";
        cout << "  2. Event Management\n";
        cout << "  3. Register Member to Event\n";
        cout << "  4. Cancel Registration\n";
        cout << "  5. View Waiting List (Queue)\n";
        cout << "  6. View All Registrations\n";
        cout << "  7. View Dashboard Stats\n";
        cout << "  0. Exit\n";
        cout << "\n  Enter choice: ";
        cin >> choice;
        cin.ignore();

        // ---- Member Management ----
        if (choice == 1) {
            int sub;
            cout << "\n  -- Member Management --\n";
            cout << "  1. Add Member\n";
            cout << "  2. View All Members\n";
            cout << "  3. Search by ID\n";
            cout << "  4. Update Member\n";
            cout << "  5. Delete Member\n";
            cout << "  Enter: ";
            cin >> sub; cin.ignore();

            if (sub == 1) {
                // Add Member — Linked List INSERT
                Member m;
                m.id = makeId("M", memberCounter++);
                cout << "  Name: ";   getline(cin, m.name);
                cout << "  Phone: ";  getline(cin, m.phone);
                cout << "  Email: ";  getline(cin, m.email);
                cout << "  Jeep Model: "; getline(cin, m.jeepModel);
                m.status = "Active";
                members.append(m);   // Linked List insertion
                cout << "  Member added with ID: " << m.id << "\n";

            } else if (sub == 2) {
                // View All — Linked List TRAVERSAL
                cout << "\n";
                members.displayAll();

            } else if (sub == 3) {
                // Search — Linked List SEARCH
                string id;
                cout << "  Enter Member ID: ";
                getline(cin, id);
                Member* m = members.findById(id);
                if (m) {
                    cout << "\n  Found: " << m->name << " | " << m->phone
                         << " | " << m->jeepModel << " | " << m->status << "\n";
                } else {
                    cout << "  Member not found.\n";
                }

            } else if (sub == 4) {
                // Update — Linked List UPDATE
                string id;
                cout << "  Enter Member ID to update: ";
                getline(cin, id);
                Member* m = members.findById(id);
                if (m) {
                    cout << "  New Name (blank = keep '" << m->name << "'): ";
                    string val; getline(cin, val);
                    if (!val.empty()) m->name = val;

                    cout << "  New Phone (blank = keep): ";
                    getline(cin, val);
                    if (!val.empty()) m->phone = val;

                    cout << "  New Jeep Model (blank = keep): ";
                    getline(cin, val);
                    if (!val.empty()) m->jeepModel = val;

                    cout << "  New Status (Active/Inactive, blank = keep): ";
                    getline(cin, val);
                    if (!val.empty()) m->status = val;

                    cout << "  Member updated.\n";
                } else {
                    cout << "  Member not found.\n";
                }

            } else if (sub == 5) {
                // Delete — Linked List DELETE
                string id;
                cout << "  Enter Member ID to delete: ";
                getline(cin, id);
                if (members.deleteById(id)) {
                    cout << "  Member deleted.\n";
                } else {
                    cout << "  Member not found.\n";
                }
            }

        // ---- Event Management ----
        } else if (choice == 2) {
            int sub;
            cout << "\n  -- Event Management --\n";
            cout << "  1. Create Event\n";
            cout << "  2. View All Events\n";
            cout << "  3. Delete Event\n";
            cout << "  Enter: ";
            cin >> sub; cin.ignore();

            if (sub == 1) {
                if (eventCount >= MAX_EVENTS) { cout << "  Event limit reached.\n"; continue; }
                Event& e = events[eventCount];
                e.id = makeId("E", eventCounter++);
                cout << "  Event Name: ";     getline(cin, e.name);
                cout << "  Location: ";       getline(cin, e.location);
                cout << "  Date (YYYY-MM-DD): "; getline(cin, e.date);
                cout << "  Max Capacity: ";   cin >> e.capacity; cin.ignore();
                e.registered = 0;
                eventCount++;
                cout << "  Event created: " << e.id << "\n";

            } else if (sub == 2) {
                if (eventCount == 0) { cout << "  No events.\n"; continue; }
                cout << left << setw(7) << "ID" << setw(25) << "Name"
                     << setw(20) << "Location" << setw(12) << "Date"
                     << setw(10) << "Capacity" << "Registered\n";
                cout << string(80, '-') << "\n";
                for (int i = 0; i < eventCount; i++) {
                    Event& e = events[i];
                    cout << left << setw(7) << e.id << setw(25) << e.name
                         << setw(20) << e.location << setw(12) << e.date
                         << setw(10) << e.capacity << e.registered << "\n";
                }

            } else if (sub == 3) {
                string id;
                cout << "  Event ID to delete: ";
                getline(cin, id);
                bool found = false;
                for (int i = 0; i < eventCount; i++) {
                    if (events[i].id == id) {
                        // Shift left
                        for (int j = i; j < eventCount - 1; j++) events[j] = events[j+1];
                        eventCount--;
                        found = true;
                        cout << "  Event deleted.\n";
                        break;
                    }
                }
                if (!found) cout << "  Event not found.\n";
            }

        // ---- Register Member to Event ----
        } else if (choice == 3) {
            string memberId, eventId;
            cout << "\n  -- Register Member --\n";
            cout << "  Member ID: "; getline(cin, memberId);
            cout << "  Event ID: ";  getline(cin, eventId);

            // Look up member from linked list
            Member* m = members.findById(memberId);
            if (!m) { cout << "  Member not found.\n"; continue; }

            // Look up event
            Event* ev = nullptr;
            for (int i = 0; i < eventCount; i++) {
                if (events[i].id == eventId) { ev = &events[i]; break; }
            }
            if (!ev) { cout << "  Event not found.\n"; continue; }

            if (ev->registered < ev->capacity) {
                // Direct registration
                if (regCount >= MAX_REGS) { cout << "  Registration limit reached.\n"; continue; }
                regs[regCount++] = {
                    makeId("R", regCounter++),
                    memberId, m->name, eventId, ev->name, "Registered"
                };
                ev->registered++;
                cout << "  " << m->name << " registered for '" << ev->name << "'!\n";
            } else {
                // Event full — ENQUEUE to waiting list
                WaitlistEntry entry = { memberId, m->name, eventId, ev->name };
                waitlist.enqueue(entry);   // <-- Queue ENQUEUE
            }

        // ---- Cancel Registration ----
        } else if (choice == 4) {
            string regId;
            cout << "\n  -- Cancel Registration --\n";
            cout << "  Registration ID: "; getline(cin, regId);

            Registration* reg = nullptr;
            for (int i = 0; i < regCount; i++) {
                if (regs[i].regId == regId && regs[i].status == "Registered") {
                    reg = &regs[i]; break;
                }
            }
            if (!reg) { cout << "  Active registration not found.\n"; continue; }

            reg->status = "Cancelled";

            // Reduce event count
            for (int i = 0; i < eventCount; i++) {
                if (events[i].id == reg->eventId && events[i].registered > 0) {
                    events[i].registered--;
                    break;
                }
            }
            cout << "  Registration cancelled for " << reg->memberName << ".\n";

            // Check waitlist for this event and DEQUEUE the first person
            if (!waitlist.isEmpty()) {
                WaitlistEntry next = waitlist.dequeue();   // <-- Queue DEQUEUE
                if (next.eventId == reg->eventId) {
                    // Register the dequeued person
                    if (regCount < MAX_REGS) {
                        regs[regCount++] = {
                            makeId("R", regCounter++),
                            next.memberId, next.memberName,
                            next.eventId,  next.eventName,
                            "Registered"
                        };
                        for (int i = 0; i < eventCount; i++) {
                            if (events[i].id == next.eventId) { events[i].registered++; break; }
                        }
                        cout << "  " << next.memberName << " promoted from waiting list and registered!\n";
                    }
                } else {
                    // Put back if it wasn't for the same event
                    // (In a real system we'd use per-event queues)
                    waitlist.enqueue(next);
                }
            }

        // ---- View Waiting List ----
        } else if (choice == 5) {
            cout << "\n  -- Waiting List (Queue) --\n";
            waitlist.displayAll();   // Queue DISPLAY

        // ---- View All Registrations ----
        } else if (choice == 6) {
            cout << "\n";
            cout << left << setw(8) << "Reg ID" << setw(10) << "Member ID"
                 << setw(20) << "Member Name" << setw(10) << "Event ID"
                 << setw(25) << "Event Name" << "Status\n";
            cout << string(80, '-') << "\n";
            for (int i = 0; i < regCount; i++) {
                Registration& r = regs[i];
                cout << left << setw(8) << r.regId << setw(10) << r.memberId
                     << setw(20) << r.memberName << setw(10) << r.eventId
                     << setw(25) << r.eventName << r.status << "\n";
            }
            if (regCount == 0) cout << "  No registrations yet.\n";

        // ---- Dashboard Stats ----
        } else if (choice == 7) {
            int registered = 0;
            for (int i = 0; i < regCount; i++) {
                if (regs[i].status == "Registered") registered++;
            }
            cout << "\n  ---- Dashboard ----\n";
            cout << "  Total Members    : " << members.getCount() << "\n";
            cout << "  Total Events     : " << eventCount          << "\n";
            cout << "  Registered       : " << registered          << "\n";
            cout << "  In Waiting List  : " << waitlist.getCount() << "\n";

        // ---- Exit ----
        } else if (choice == 0) {
            cout << "\n  Goodbye!\n\n";
            break;
        } else {
            cout << "  Invalid option. Try again.\n";
        }
    }

    return 0;
}
