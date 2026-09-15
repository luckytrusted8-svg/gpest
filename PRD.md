# PRODUCT REQUIREMENT DOCUMENT (PRD)

## GPEST Field Service Management System

---

## Alur Sistem

```
CUSTOMER
    ↓
CUSTOMER REQUEST / LEAD
    ↓
CRM
    ↓
QUOTATION / CONTRACT
    ↓
SCHEDULE
    ↓
WORK ORDER
    ↓
TECHNICIAN
    ↓
TRACKING & GPS
    ↓
SURVEY / INSPECTION
    ↓
TREATMENT
    ↓
WORK REPORT
    ↓
CUSTOMER CONFIRMATION
    ↓
SUPERVISOR REVIEW
    ↓
APPROVAL
    ↓
PDF REPORT
    ↓
INVOICING
```

Sistem digunakan melalui:

1. **Web Dashboard** — Admin, Supervisor, Management
2. **Mobile Application** — Teknisi Lapangan

**Tech Stack:**
Laravel + Inertia.js + React + TypeScript + Tailwind CSS + MySQL + Capacitor + Android

Tidak membuat backend terpisah untuk mobile. Laravel sebagai backend dan source of truth.

---

## 1. Business Problem

Proses operasional pest control masih melibatkan komunikasi manual antara customer, admin, dan teknisi.

Alur manual yang harus dihilangkan:

```
Customer menghubungi perusahaan
        ↓
Admin menerima request
        ↓
Admin memberikan informasi ke teknisi
        ↓
Teknisi menerima tugas
        ↓
Teknisi menuju lokasi
        ↓
Teknisi melakukan pekerjaan
        ↓
Teknisi menulis work report
        ↓
Report diberikan ke Admin
        ↓
Admin melakukan input ulang
        ↓
Report diproses untuk kebutuhan perusahaan/customer
```

Sistem baru harus menghilangkan proses input berulang. Semua data harus masuk sekali ke sistem dan dapat digunakan oleh modul lainnya.

---

## 2. Tujuan Sistem

- Digitalisasi operasional pest control
- Mengurangi pekerjaan administrasi manual
- Mengurangi input data berulang
- Mempermudah monitoring teknisi
- Meningkatkan validitas data
- Membuat work report secara real-time
- Menyimpan history pekerjaan customer
- Mempermudah pembuatan laporan
- Meningkatkan transparansi operasional
- Mempermudah management mengambil keputusan

---

## 3. User Role

Implementasikan RBAC.

### Super Admin

Full access.

### Admin

Mengelola:
- Customer
- Site
- CRM
- Leads
- Request
- Quotation
- Contract
- Schedule
- Work Order
- Technician
- Report

### Supervisor

Mengelola:
- Monitoring technician
- Work Order
- Inspection
- Work Report
- Review report
- Approve / Reject report

### Teknisi

Mengakses:
- Dashboard
- My Task
- Schedule
- Work Order
- Customer
- Location
- Inspection
- Treatment
- Camera
- Work Report
- Notification
- Profile

Teknisi hanya dapat melihat pekerjaan yang ditugaskan kepadanya.

### Management

Read-only analytics:
- Dashboard
- Revenue
- Customer
- Technician performance
- Job performance
- Report
- Location monitoring
- CRM

### Customer

Customer portal:
- Melihat service
- Melihat schedule
- Melihat work report
- Melihat history
- Melihat dokumen
- Melakukan confirmation
- Memberikan feedback

---

## 4. Web Admin Dashboard

Sidebar:

```
Dashboard

CRM
 ├── Leads
 ├── Activities
 └── Pipeline

Customer
 ├── Customer List
 ├── Sites
 └── Customer History

Request
 ├── Customer Request
 └── Tickets

Service
 ├── Services
 ├── Work Orders
 ├── Scheduling
 └── Assign Technician

Monitoring
 ├── Live Tracking
 ├── Technician
 └── Location History

Reports
 ├── Survey Report
 ├── Work Report
 ├── Termite Report
 └── Report Archive

Finance
 ├── Quotation
 ├── Contract
 └── Invoice

HR
 ├── Attendance
 ├── Leave
 └── Employee

Settings
 ├── Users
 ├── Roles
 ├── Permissions
 ├── Form Builder
 └── System Settings
```

---

## 5. Dashboard

Dashboard harus menampilkan real data.

KPI:
- Total Customer
- Active Contract
- Today's Jobs
- Completed Jobs
- Pending Jobs
- Reports Waiting Review
- Technician Active
- Open Request

Tambahkan:
- Revenue Overview
- Job Overview
- Service Distribution
- Technician Performance
- Customer Statistics
- Report Statistics
- Live Technician Map
- Recent Activities
- Upcoming Schedule

Gunakan chart hanya jika data tersedia. Jangan menggunakan dummy data pada production.

---

## 6. CRM

Lead:
- Lead ID
- Company
- PIC
- Phone
- Email
- Address
- Source
- Service Interest
- Estimated Value
- Status
- Owner
- Created Date

Pipeline:
```
NEW → CONTACTED → SURVEY → QUOTATION → NEGOTIATION → WON → LOST
```

Setiap lead memiliki activity timeline.

Activity:
- Call
- Meeting
- WhatsApp
- Email
- Survey
- Note
- Follow Up

---

## 7. Customer Database

Customer adalah pusat seluruh history perusahaan.

Data:
- Customer Code
- Company Name
- PIC
- Phone
- Email
- Address
- NPWP (jika diperlukan)
- Status
- Notes

Customer memiliki:
- Sites
- Contracts
- Work Orders
- Reports
- Invoices
- Service History
- Complaints
- Requests

Customer detail memiliki tab:

```
Overview | Sites | Contracts | Schedule | Work Orders | Reports | History | Documents
```

---

## 8. Site Management

Customer dapat memiliki banyak lokasi.

Site:
- Site Code
- Site Name
- Customer
- Address
- PIC
- Phone
- Latitude
- Longitude
- Service Area
- Notes

Gunakan map.

Site menyimpan:
- Koordinat
- Geofence radius
- Service history
- Active contract

---

## 9. Customer Request

Customer atau Admin dapat membuat request.

Fields:
- Ticket Number
- Customer
- Site
- Request Type
- Description
- Priority
- Photo
- Attachment
- PIC
- Status
- Created Date

Status:
```
OPEN → ASSIGNED → IN PROGRESS → WAITING → RESOLVED → CLOSED
```

Request dapat dikonversi menjadi Work Order.

---

## 10. Quotation

Fields:
- Quotation Number
- Customer
- Site
- Service
- Description
- Quantity
- Unit Price
- Discount
- Tax
- Total
- Valid Until
- Status

Status:
```
DRAFT → SENT → ACCEPTED → REJECTED → EXPIRED
```

Jika quotation accepted: dapat dibuat menjadi contract.

---

## 11. Contract

Fields:
- Contract Number
- Customer
- Site
- Service
- Start Date
- End Date
- Frequency
- Price
- SLA
- Status

Status:
```
DRAFT → ACTIVE → EXPIRED → TERMINATED
```

Contract dapat menghasilkan schedule otomatis.

---

## 12. Scheduling

Admin dapat:
- Create schedule
- Assign technician
- Reschedule
- Cancel
- Change priority

Schedule:
- Work Order
- Customer
- Site
- Technician
- Date
- Start Time
- End Time
- Service Type
- Priority
- Notes

Teknisi mendapatkan notification ketika assignment dibuat.

---

## 13. Work Order

Data:
- WO Number
- Customer
- Site
- Service
- Contract
- Technician
- Schedule
- Priority
- Instruction
- Status

Status:
```
DRAFT → ASSIGNED → ON THE WAY → ARRIVED → IN PROGRESS → COMPLETED → PENDING REVIEW → APPROVED → REJECTED → CANCELLED
```

---

## 14. Mobile App

Nama aplikasi: **GPest Field Service**

Mobile app khusus teknisi.

Bottom navigation:
```
HOME | TASK | REPORT | NOTIFICATION | PROFILE
```

---

## 15. Mobile Home

Tampilkan:
- Greeting
- Nama Teknisi
- Today's Task
- Completed
- Pending
- Upcoming Job

Quick Actions:
- Start Job
- My Tasks
- Scan QR
- Create Report

Status koneksi:
```
ONLINE | OFFLINE
```

---

## 16. My Task

List pekerjaan teknisi.

Filter:
```
Today | Upcoming | Completed | Pending
```

Card:
- WO Number
- Customer
- Site
- Service
- Schedule
- Status
- Distance

Button: View Detail

---

## 17. Work Order Detail

Tampilkan:
- Customer
- Site
- Address
- PIC
- Phone
- Service
- Schedule
- Instruction
- Previous History

Action:
- Navigate
- Call PIC
- Start Job

---

## 18. GPS Check-in

Saat teknisi menekan START JOB, gunakan Capacitor Geolocation.

Ambil:
- Latitude
- Longitude
- Timestamp

Simpan:
- check_in_latitude
- check_in_longitude
- check_in_time

Bandingkan lokasi teknisi dengan geofence site. Jika keluar radius: tampilkan warning. Jangan kehilangan data.

---

## 19. Live Tracking

Web admin dapat melihat:
- Posisi teknisi
- Status teknisi
- Last update
- Current job
- Route/history

Map:
- Technician markers
- Customer markers

History:
- Tanggal
- Jam
- Latitude
- Longitude
- Activity

Fitur:
- Real-time Location
- Location History
- Geofencing
- Out of Area Warning

---

## 20. Inspection / Survey

Teknisi melakukan survey. Form harus configurable.

Jenis input:
- Text
- Number
- Yes/No
- Dropdown
- Multiple Select
- Date
- Image
- Signature
- Document
- Barcode
- Phone
- Email

Form dapat dibuat oleh Admin melalui Form Builder tanpa mengubah source code.

---

## 21. Form Builder

Admin dapat membuat form dengan drag and drop:
- Text
- Number
- Textarea
- Yes/No
- Dropdown
- Multiple Select
- Date
- Image
- Signature
- Document
- Barcode
- Phone
- Email
- Item

Setiap field memiliki:
- Label
- Key
- Required
- Placeholder
- Options
- Validation
- Order

Form dapat dikaitkan dengan Service Type:
- Pest Control Form
- Termite Form
- Fumigation Form
- Disinfection Form

---

## 22. Pest Control Inspection

Jenis Hama:
- Cockroach
- Rat
- Ant
- Fly
- Mosquito
- Termite
- Other

Severity:
- Low
- Medium
- High

Area:
- Kitchen
- Warehouse
- Office
- Toilet
- Production
- Outdoor
- Other

Data:
- Jumlah temuan
- Catatan
- Foto

---

## 23. Treatment

Treatment Type:
- Spraying
- Baiting
- Trapping
- Fogging
- Termite Treatment
- Fumigation
- Disinfection
- Other

Data:
- Product
- Chemical
- Quantity
- Unit
- Area
- Method
- Notes

Gunakan master data yang dikelola Admin.

---

## 24. Camera

Gunakan Capacitor Camera.

Teknisi dapat mengambil foto:
- BEFORE
- INSPECTION
- TREATMENT
- AFTER

Setiap foto:
- Work Order
- Technician
- Category
- Timestamp
- Latitude
- Longitude

Compress image sebelum upload.

Tampilkan:
- Upload Progress
- Success
- Failed
- Retry

Jika offline: simpan sementara dan upload ketika online.

---

## 25. QR / Barcode

Gunakan QR/barcode untuk:
- Identifikasi site
- Identifikasi equipment
- Identifikasi bait station
- Identifikasi lokasi treatment

Alur:
```
Scan QR → Validate → Load Data → Inspection / Treatment
```

---

## 26. Work Report

Teknisi mengisi Work Report setelah pekerjaan selesai.

Report terdiri dari:
- Customer Information
- Site Information
- Technician
- Service Type
- Date
- Check-in
- Check-out
- Inspection
- Treatment
- Pest Findings
- Chemical Usage
- Photos
- Recommendations
- Notes

---

## 27. Customer Signature

Setelah report selesai: Customer Confirmation.

Fields:
- Customer Name
- Customer Position
- Signature
- Notes

Customer melakukan digital signature.

---

## 28. Report Workflow

```
Technician:
DRAFT → SUBMIT

Supervisor:
UNDER REVIEW → APPROVED

atau:
REJECTED → Technician Edit → Resubmit
```

Setiap rejection harus memiliki reason.

---

## 29. PDF Report

Generate PDF otomatis.

Jenis report:
- WORK REPORT
- TERMITE REPORT
- SURVEY REPORT

Isi PDF:
- Header Logo GPest
- Customer Information
- Service Information
- Inspection
- Treatment
- Pest Findings
- Chemical / Material
- Monitoring
- Recommendations
- Photos
- Technician Signature
- Customer Signature
- Date
- Report Number

Buat PDF dari data database, bukan screenshot.

---

## 30. Report Archive

Admin dapat:
- Search
- Filter
- View
- Download
- Print

Filter:
- Customer
- Technician
- Service
- Date
- Status
- Site

---

## 31. Notification

Notification untuk:
- New Work Order
- Schedule Change
- New Request
- Report Rejected
- Report Approved
- Upcoming Job
- Customer Request
- System Notification

---

## 32. Attendance

Teknisi memiliki attendance.

Fitur:
- Clock In
- Clock Out

Simpan:
- Time
- Location
- Device
- Status

Gunakan GPS jika dibutuhkan oleh business rule.

---

## 33. Leave

Teknisi dapat mengajukan Leave Request.

Fields:
- Type
- Start Date
- End Date
- Reason
- Attachment
- Status

Supervisor/Admin melakukan approval.

---

## 34. Analytics

Dashboard analytics:
- Customer Growth
- Revenue
- Job Completion
- Technician Productivity
- Service Distribution
- Pest Findings
- Report Completion
- Customer Retention

Gunakan real data.

---

## 35. Customer Portal

Customer dapat login dan mengakses:
- View Profile
- View Sites
- View Contracts
- View Schedule
- View Work Reports
- View Service History
- Create Request
- Download Report
- Give Feedback

---

## 36. Database

Review existing database terlebih dahulu. Jangan membuat tabel duplicate.

Entity utama:
```
users
roles
permissions
customers
sites
leads
lead_activities
requests
services
quotations
contracts
schedules
work_orders
work_order_assignments
inspections
inspection_forms
inspection_form_fields
inspection_answers
treatments
treatment_items
photos
reports
report_items
signatures
notifications
attendance
leave_requests
locations
location_histories
documents
invoices
audit_logs
```

Gunakan relational database yang normal.

---

## 37. API

Mobile membutuhkan endpoint Laravel.

```
POST   /api/auth/login
GET    /api/mobile/dashboard
GET    /api/mobile/tasks
GET    /api/mobile/tasks/{id}
POST   /api/mobile/tasks/{id}/check-in
POST   /api/mobile/tasks/{id}/inspection
POST   /api/mobile/tasks/{id}/photos
POST   /api/mobile/tasks/{id}/treatment
POST   /api/mobile/tasks/{id}/check-out
POST   /api/mobile/reports
POST   /api/mobile/reports/{id}/submit
POST   /api/mobile/reports/{id}/signature
GET    /api/mobile/notifications
GET    /api/mobile/profile
```

---

## 38. Offline Mode

Mobile app harus tahan terhadap koneksi buruk.

Jika offline:
- Show offline indicator
- Save draft
- Save inspection
- Save photos
- Queue requests

Ketika online:
```
LOCAL DATA → SYNC QUEUE → SERVER
```

Gunakan unique request ID / idempotency key untuk mencegah duplicate data.

---

## 39. Capacitor

Package:
- @capacitor/core
- @capacitor/cli
- @capacitor/android
- @capacitor/camera
- @capacitor/geolocation
- @capacitor/network
- @capacitor/preferences
- @capacitor/push-notifications

App:
- Name: GPest Field Service
- Package ID: id.gpest.fieldservice

Capabilities:
- Camera
- GPS
- Push Notification
- Network Status
- Local Storage

---

## 40. UI / UX

Web:
- Sidebar
- Topbar
- Dashboard Cards
- Data Tables
- Charts
- Maps
- Modal
- Drawer
- Filter
- Search

Mobile:
- Bottom Navigation
- Cards
- Timeline
- Step Forms
- Sticky CTA
- Bottom Sheet

Warna:
- GPest Purple
- GPest Red
- Dark Charcoal
- White

Mobile UI harus:
- Cepat
- Mudah dipahami teknisi
- Touch friendly
- Readable
- Tidak terlalu banyak elemen
- Action utama selalu terlihat

---

## 41. Real-time

Gunakan Laravel Broadcasting + WebSocket untuk:
- Technician tracking
- Job status
- Report status
- Notifications

Jika infrastructure belum siap: buat architecture agar realtime dapat ditambahkan kemudian.

---

## 42. Security

Implementasikan:
- RBAC
- Policies
- Form Request Validation
- Rate Limiting
- Secure File Upload
- File Type Validation
- File Size Validation
- API Authentication
- Audit Logs
- Authorization

Jangan percaya data dari mobile client. Semua permission harus diverifikasi server.

---

## 43. Storage

Foto dan dokumen jangan disimpan sebagai base64. Gunakan Laravel Storage.

Struktur:
```
reports/
inspections/
treatments/
documents/
signatures/
```

Database hanya menyimpan metadata dan path.

---

## 44. Development Approach

Sebelum coding, audit project existing. Periksa:
- Laravel version
- React version
- Inertia version
- Database
- Authentication
- Routes
- Models
- Migrations
- Components
- Existing UI
- Existing API

Jangan langsung mengubah source code. Buat Architecture Audit, kemudian Implementation Plan.

---

## 45. Phase Development

```
PHASE 1   — Architecture Audit
PHASE 2   — Authentication + RBAC
PHASE 3   — Customer + Site
PHASE 4   — CRM + Customer Request
PHASE 5   — Quotation + Contract
PHASE 6   — Scheduling
PHASE 7   — Work Order
PHASE 8   — Technician Mobile App
PHASE 9   — GPS + Tracking
PHASE 10  — Inspection + Form Builder
PHASE 11  — Treatment
PHASE 12  — Camera + Documentation
PHASE 13  — Work Report
PHASE 14  — Customer Signature
PHASE 15  — PDF Report
PHASE 16  — Notification
PHASE 17  — Attendance + Leave
PHASE 18  — Customer Portal
PHASE 19  — Analytics
PHASE 20  — Offline Sync
PHASE 21  — Capacitor Android
PHASE 22  — Testing
PHASE 23  — Production Deployment
```

---

## 46. Testing

Test complete workflow:

**Admin:**
```
Create Customer → Create Site → Create Contract → Create Schedule → Assign Technician → Create Work Order
```

**Technician:**
```
Login → Receive Task → Navigate → Check In → Inspection → Take Photo → Treatment → Check Out → Customer Signature → Submit Report
```

**Supervisor:**
```
Review Report → Approve / Reject
```

**System:**
```
Generate PDF → Store Report → Notify Customer
```

---

## 47. Acceptance Criteria

Sistem dianggap selesai jika:

1. Admin dapat membuat customer.
2. Customer dapat memiliki banyak site.
3. Admin dapat membuat contract.
4. Contract dapat menghasilkan schedule.
5. Admin dapat assign technician.
6. Teknisi menerima pekerjaan di mobile.
7. Teknisi dapat check-in menggunakan GPS.
8. Sistem dapat menyimpan lokasi.
9. Teknisi dapat melakukan inspection.
10. Admin dapat membuat custom inspection form.
11. Teknisi dapat mengambil foto.
12. Teknisi dapat melakukan treatment.
13. Teknisi dapat mengisi work report.
14. Customer dapat melakukan signature.
15. Supervisor dapat review report.
16. Report dapat approve/reject.
17. Sistem dapat generate PDF.
18. Admin dapat melihat history customer.
19. Admin dapat melihat lokasi teknisi.
20. Sistem dapat memberikan notification.
21. Mobile dapat menangani koneksi offline.
22. Data tidak boleh duplicate ketika sync.
23. Role permission bekerja.
24. Android APK dapat dibuat.
25. Android AAB dapat dibuat.
26. Web dashboard dapat digunakan secara responsive.

---

## 48. Important

Sistem harus diperlakukan sebagai **Field Service Management System khusus industri Pest Control**, bukan sekadar CRUD biasa.

Prioritas:
1. Operational workflow
2. Data integrity
3. Technician experience
4. Real-time monitoring
5. Reporting
6. Customer history
7. Automation
8. Security
9. Scalability
10. Performance

Setiap modul harus memiliki hubungan data yang jelas:

```
Customer → Site → Contract → Schedule → Work Order → Technician → Inspection → Treatment → Report → Customer Confirmation → PDF
```

Pastikan seluruh workflow tersebut benar-benar terhubung pada database.

---

## 49. Final Output

Pada setiap phase berikan:

1. Architecture
2. Database changes
3. Migration
4. Model
5. Controller
6. API endpoint
7. React component
8. Route
9. Validation
10. Authorization
11. UI
12. Testing
13. Files changed
14. How to run
15. Known issues

Implementasikan backend, database, API, frontend, mobile integration, validation, authorization, dan testing.