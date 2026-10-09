# IT Helpdesk & Asset Management System

A full-stack internal IT Helpdesk and Asset Management System built with React, Node.js, Express.js and PostgreSQL.

The system allows employees to submit support requests, IT Support staff to process assigned tickets, and administrators to manage users, assets and overall system activity.

---

## Features

### Authentication & Authorization

- JWT-based authentication
- Role-based access control
- Protected frontend routes
- Protected backend APIs
- Active / inactive account handling

### User Roles

The system supports three roles:

- Employee
- IT Support
- Administrator

Each role has different permissions and workflows.

---

## Employee Features

Employees can:

- Sign in securely
- View personal dashboard
- Create IT support tickets
- View their submitted tickets
- Track ticket status
- View ticket history
- Add comments
- Confirm resolved tickets
- Close tickets
- Submit support ratings
- View currently assigned assets
- View asset assignment history

---

## IT Support Features

IT Support users can:

- View assigned support tickets
- Access support queue
- Start working on assigned tickets
- Update ticket status
- Move tickets to waiting state
- Resume ticket processing
- Resolve tickets
- Add comments
- View ticket history
- View company assets

---

## Administrator Features

Administrators can:

- View system dashboard
- View all tickets
- Search and filter tickets
- Assign tickets to IT Support staff
- View ticket details and history
- Manage IT assets
- Create new assets
- Assign assets to employees
- Return assigned assets
- View asset assignment history
- Manage system users
- Create new user accounts
- Assign roles
- Assign departments
- Activate or deactivate accounts
- Prevent self-deactivation
- View system statistics

---

# Ticket Workflow

The ticket lifecycle follows a controlled workflow:

```text
OPEN
↓
ASSIGNED
↓
IN_PROGRESS
↓
WAITING_FOR_USER (optional)
↓
IN_PROGRESS
↓
RESOLVED
↓
CLOSED