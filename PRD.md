# PRODUCT REQUIREMENT DOCUMENT (PRD)

## GPEST Pest Control Management System

**Project:** GPEST Pest Control Management System
**Client:** GPEST
**Platform:** Web Application
**Frontend:** React + Inertia.js
**Backend:** Laravel
**Database:** MySQL
**Authentication:** Laravel Authentication
**Target:** Internal Management, Admin, Supervisor, Teknisi, dan Customer

---

# 1. Product Overview

GPEST Pest Control Management System adalah aplikasi berbasis web yang dirancang untuk membantu perusahaan pest control mengelola seluruh proses operasional secara digital dan terintegrasi.

Sistem ini dibuat untuk mengatasi proses operasional yang masih dilakukan secara manual, seperti pemberian tugas teknisi melalui WhatsApp, pencatatan laporan menggunakan hardcopy, input ulang laporan oleh admin, monitoring lokasi teknisi, serta pengelolaan data customer dan kontrak yang belum terintegrasi.

Sistem akan menghubungkan:

**Customer → CRM → Contract → Schedule → Technician → Treatment → Work Report → Approval → Customer → Reporting**

Tujuan utama sistem adalah membuat proses kerja lebih cepat, terstruktur, mudah dimonitor, serta mengurangi pekerjaan administratif yang berulang.

Konsep ini sejalan dengan permasalahan dan solusi yang dijelaskan pada dokumen JARIVIS, terutama digitalisasi teknisi lapangan, jadwal kunjungan, laporan pekerjaan, dokumentasi treatment, dan reporting secara real-time.

---

# 2. Background & Problem Statement

## 2.1 Kondisi Existing

Berdasarkan proses yang dijelaskan dalam dokumen, alur kerja pest control secara manual adalah:

1. Customer menghubungi perusahaan pest control.
2. Admin menerima permintaan customer.
3. Admin memberikan informasi pekerjaan kepada teknisi secara manual.
4. Teknisi menerima tugas melalui WhatsApp.
5. Teknisi menuju lokasi customer.
6. Teknisi melakukan pekerjaan/treatment.
7. Teknisi mencatat hasil pekerjaan menggunakan hardcopy.
8. Hardcopy diserahkan kepada admin.
9. Admin melakukan input ulang untuk kebutuhan administrasi dan penagihan.

## 2.2 Permasalahan

### A. Repetitive Reporting

Teknisi melakukan pencatatan laporan secara manual kemudian admin harus melakukan input ulang.

Akibat:

* Pekerjaan administratif menjadi berulang.
* Memakan waktu.
* Risiko human error tinggi.
* Proses billing menjadi lebih lambat.

Dokumen secara eksplisit mengidentifikasi laporan kerja berulang sebagai salah satu masalah utama.

### B. Kesulitan Monitoring Teknisi

Ketika jumlah teknisi meningkat, management kesulitan mengetahui:

* Posisi teknisi.
* Status pekerjaan.
* Kehadiran teknisi.
* Pekerjaan yang sudah selesai.
* Pekerjaan yang belum dikerjakan.

Dokumen mengusulkan tracking dan monitoring lokasi secara real-time, termasuk historical location dan geofencing.

### C. Data Tidak Valid / Tidak Terupdate

Data customer, kontrak, kontak, laporan dan informasi lainnya dapat tidak lengkap atau tidak relevan karena proses pengelolaan manual.

Sistem perlu menyediakan satu sumber data terpusat untuk customer dan histori pekerjaan.

### D. Dokumentasi Treatment Tidak Terstruktur

Pekerjaan pest control membutuhkan dokumentasi pekerjaan, seperti:

* Foto sebelum treatment.
* Foto sesudah treatment.
* Area treatment.
* Jenis treatment.
* Hasil inspeksi.
* Catatan teknisi.
* Tanda tangan customer.

Dokumentasi harus tersimpan bersama work report.

---

# 3. Product Goals

Sistem memiliki tujuan:

1. Mendigitalisasi proses operasional pest control.
2. Mengurangi pekerjaan input data berulang.
3. Mempermudah management dalam monitoring teknisi.
4. Memusatkan database customer.
5. Mengelola kontrak customer secara terstruktur.
6. Membuat scheduling pekerjaan secara digital.
7. Membuat work report secara real-time.
8. Menyediakan dokumentasi treatment.
9. Menyediakan histori pekerjaan customer.
10. Membantu proses quotation dan invoicing.
11. Menyediakan customer portal.
12. Menyediakan dashboard management untuk pengambilan keputusan.

---

# 4. Target Users

## 4.1 Super Admin

Memiliki akses penuh terhadap sistem.

Hak akses:

* User management.
* Role & permission.
* Master data.
* Customer.
* CRM.
* Contract.
* Schedule.
* Technician.
* Report.
* Finance.
* System configuration.

---

## 4.2 Management

Berfokus pada monitoring dan analisis.

Dapat melihat:

* Operational dashboard.
* Customer.
* Contract.
* Schedule.
* Technician.
* Work report.
* Survey report.
* Revenue.
* Performance.
* Monitoring lokasi.

Tidak memiliki akses penuh terhadap konfigurasi sistem.

---

## 4.3 Admin / Customer Service

Bertanggung jawab terhadap:

* Customer.
* Leads.
* Customer request.
* Schedule.
* Contract.
* Quotation.
* Work report.
* Invoice.

---

## 4.4 Supervisor

Bertanggung jawab terhadap operasional lapangan.

Fitur:

* Monitoring teknisi.
* Assignment pekerjaan.
* Schedule.
* Approval work report.
* Monitoring pekerjaan.
* Tracking teknisi.
* Review hasil pekerjaan.

---

## 4.5 Technician

Fokus pada pekerjaan lapangan.

Fitur:

* Melihat tugas.
* Melihat jadwal.
* Check-in.
* Check-out.
* GPS location.
* Survey.
* Treatment.
* Work report.
* Upload foto.
* Signature.
* Catatan pekerjaan.
* Melihat histori pekerjaan yang relevan.

---

## 4.6 Customer

Customer mendapatkan akses melalui Customer Portal.

Fitur:

* Melihat informasi perusahaan.
* Melihat kontrak.
* Melihat jadwal.
* Melihat status pekerjaan.
* Melihat work report.
* Melihat dokumentasi treatment.
* Melihat histori pekerjaan.
* Melihat quotation/invoice jika diaktifkan.

---

# 5. Product Scope

Sistem dibagi menjadi beberapa module utama:

1. Authentication & Authorization
2. Dashboard
3. CRM
4. Customer Management
5. Customer Request
6. Contract Management
7. Scheduling
8. Technician Management
9. Field Operation
10. Survey Report
11. Work Report
12. Termite Report
13. Location Tracking
14. Quotation
15. Invoicing
16. Attendance & Leave
17. HR Data
18. Customer Portal
19. Notification
20. Reporting
21. Master Data
22. Audit Log

Dokumen sumber juga mencantumkan modul seperti CRM, customer database, contract management, scheduling, survey report, work report, quotation, invoicing, attendance, leave, HR data, location tracking, dan customer portal.

---

# 6. System Workflow

## 6.1 Customer Request

```text
Customer Request
       ↓
Admin menerima request
       ↓
Customer existing / Customer baru?
       ↓
CRM
       ↓
Survey / Quotation
       ↓
Contract
       ↓
Schedule
```

---

# 7. CRM Module

CRM digunakan untuk mengelola calon customer hingga menjadi customer.

## Features

### Lead Management

Data:

* Lead ID
* Nama perusahaan
* PIC
* Nomor telepon
* Email
* Alamat
* Sumber lead
* Kebutuhan pest control
* Status
* Assigned sales
* Notes

### Lead Status

Contoh:

```text
New
↓
Contacted
↓
Survey
↓
Quotation
↓
Negotiation
↓
Won
↓
Customer
```

atau:

```text
New → Contacted → Lost
```

---

# 8. Customer Management

Customer menjadi pusat seluruh informasi pekerjaan.

## Customer Profile

Informasi:

* Customer ID
* Nama perusahaan
* Nama PIC
* Nomor telepon
* Email
* Alamat
* Lokasi
* NPWP jika diperlukan
* Status customer
* Sales/person in charge

## Customer Detail

Customer detail memiliki tab:

### Overview

Informasi utama customer.

### Locations

Daftar lokasi customer.

### Contracts

Kontrak aktif dan histori kontrak.

### Schedule

Jadwal pekerjaan.

### Work Reports

Seluruh laporan pekerjaan.

### Survey Reports

Laporan survey.

### Invoices

Invoice customer.

### Documents

Dokumen terkait customer.

### Activity History

Histori aktivitas.

Konsep ini mengikuti fungsi customer database yang digunakan untuk menyimpan informasi kontak, PIC, alamat, dan histori pekerjaan.

---

# 9. Customer Request Module

Customer request digunakan untuk menerima permintaan pekerjaan.

## Request Types

Contoh:

* General Pest Control
* Termite Control
* Rodent Control
* Insect Control
* Fumigation
* Disinfection
* Inspection
* Complaint
* Follow-up Treatment

## Request Data

* Request ID
* Customer
* Location
* PIC
* Request type
* Description
* Priority
* Requested date
* Status
* Assigned staff

## Status

```text
New
↓
Reviewed
↓
Scheduled
↓
In Progress
↓
Completed
↓
Closed
```

---

# 10. Contract Management

Setiap customer dapat memiliki satu atau lebih kontrak.

## Contract Data

* Contract Number
* Customer
* Location
* Contract type
* Start date
* End date
* Service frequency
* Service type
* Contract value
* Status
* PIC
* Attachment

## Contract Status

```text
Draft
Active
Expiring Soon
Expired
Cancelled
```

Sistem dapat memberikan reminder ketika kontrak mendekati tanggal berakhir.

---

# 11. Scheduling Module

Scheduling digunakan untuk membuat dan mengatur jadwal pekerjaan teknisi.

## Schedule Data

* Schedule ID
* Customer
* Location
* Service
* Technician
* Supervisor
* Date
* Start time
* End time
* Priority
* Status

## Schedule Status

```text
Scheduled
Assigned
On The Way
Arrived
In Progress
Completed
Cancelled
Rescheduled
```

## Assignment

Supervisor/Admin dapat melakukan assignment:

```text
Customer
   ↓
Location
   ↓
Service
   ↓
Technician
   ↓
Schedule
```

---

# 12. Technician Module

## Technician Profile

Data:

* Employee ID
* Name
* Phone
* Email
* Position
* Status
* Area assignment
* Skills
* Join date
* Profile photo

## Technician Dashboard

Teknisi melihat:

* Today's Schedule
* Upcoming Schedule
* Pending Work
* Completed Work
* Attendance
* Notifications

---

# 13. Field Operation

Modul ini menjadi bagian penting dari sistem.

Ketika teknisi mendapatkan pekerjaan:

```text
Assigned Job
     ↓
View Job Detail
     ↓
Navigate to Location
     ↓
Check-in
     ↓
Survey
     ↓
Treatment
     ↓
Documentation
     ↓
Work Report
     ↓
Customer Signature
     ↓
Submit
     ↓
Supervisor Approval
```

---

# 14. Attendance

Teknisi dapat melakukan:

* Check-in.
* Check-out.
* Location capture.
* Timestamp.

Data attendance disimpan:

* Technician.
* Date.
* Time.
* Latitude.
* Longitude.
* Status.

---

# 15. Location Tracking

Sistem menyediakan monitoring lokasi teknisi.

## Features

### Real-time Location

Management/Supervisor dapat melihat posisi teknisi yang sedang aktif.

### Location History

Menyimpan histori lokasi teknisi.

### Geofencing

Sistem dapat menentukan area kerja tertentu.

Contoh:

```text
Customer Location
       ↓
Geofence Radius
       ↓
Technician Arrives
       ↓
Check-in Allowed
```

Dokumen sumber secara khusus menyebut real-time technician position, historical data, geofencing, dan alert ketika teknisi keluar dari area.

---

# 16. Survey Report

Survey report digunakan sebelum pekerjaan/treatment dilakukan jika diperlukan.

## Data

* Survey number
* Customer
* Location
* Technician
* Date
* Pest type
* Area
* Findings
* Risk level
* Recommendation
* Photos
* Notes
* Customer signature

---

# 17. Work Report

Work Report merupakan salah satu fitur inti sistem.

Dokumen sumber menunjukkan bahwa work report merupakan bagian utama dari proses digitalisasi pekerjaan pest control.

## Work Report Data

### General Information

* Report Number
* Customer
* Location
* Contract
* Schedule
* Technician
* Date
* Start time
* End time

### Treatment Information

* Service type
* Pest type
* Treatment method
* Chemical/product
* Quantity
* Area treatment
* Equipment

### Inspection

* Findings
* Pest activity
* Severity
* Recommendation

### Documentation

* Before photo
* During treatment photo
* After photo
* Supporting document

### Verification

* Technician signature
* Customer signature
* Supervisor approval

---

# 18. Dynamic Form / App Builder

Sistem dapat dirancang dengan konsep dynamic form sehingga form pekerjaan dapat disesuaikan berdasarkan jenis service.

Contoh:

### General Pest Control

```text
Pest Type
Treatment Method
Chemical
Quantity
Area
Photo
Recommendation
Signature
```

### Termite Control

```text
Termite Type
Inspection Area
Damage Level
Treatment Method
Chemical
Number of Points
Photo
Recommendation
Signature
```

Konsep App Builder pada dokumen memungkinkan form memiliki berbagai tipe field seperti text, number, yes/no, dropdown, multiple choice, date, photo, signature, document upload, barcode, phone, dan email.

Untuk versi awal project, dynamic form dapat dibuat bertahap agar kompleksitas pengembangan tetap terkendali.

---

# 19. Termite Report

Termite report merupakan jenis laporan khusus untuk pekerjaan termite control.

## Data

* Customer
* Location
* Inspection date
* Technician
* Building/area
* Termite activity
* Damage
* Inspection point
* Treatment
* Chemical
* Quantity
* Photos
* Recommendation
* Signature

PDF sumber juga menyediakan contoh khusus **Termite Report** sebagai bagian dari sample reporting.

---

# 20. Report Approval

Setelah teknisi submit report:

```text
Technician Submit
        ↓
Supervisor Review
        ↓
   ┌────┴────┐
   ↓         ↓
Approve    Revision
   ↓         ↓
Completed  Technician
```

Supervisor dapat:

* Approve.
* Request revision.
* Memberikan catatan.

---

# 21. Automatic Report Generation

Setelah work report disetujui, sistem secara otomatis menghasilkan report dalam format digital.

Contoh:

```text
WORK REPORT
────────────────────
Customer
Location
Technician
Service Date

Treatment Details

Inspection Result

Documentation

Recommendation

Customer Signature
Technician Signature

Approved By
```

Report dapat:

* Dilihat online.
* Download PDF.
* Dikirim ke customer.
* Disimpan sebagai histori.

Dengan demikian admin tidak perlu melakukan input ulang dari hardcopy.

---

# 22. Quotation

Quotation digunakan untuk calon customer atau pekerjaan tambahan.

## Data

* Quotation number
* Customer
* Service
* Description
* Quantity
* Unit price
* Discount
* Tax
* Total
* Valid until
* Terms
* Status

Status:

```text
Draft
Sent
Viewed
Accepted
Rejected
Expired
```

---

# 23. Invoicing

Invoice dapat dibuat berdasarkan kontrak atau pekerjaan.

## Data

* Invoice number
* Customer
* Contract
* Work report
* Invoice date
* Due date
* Items
* Subtotal
* Tax
* Discount
* Total
* Payment status

Status:

```text
Draft
Issued
Sent
Partially Paid
Paid
Overdue
Cancelled
```

---

# 24. Customer Portal

Customer memiliki portal sendiri.

## Customer Dashboard

Menampilkan:

* Active contracts.
* Upcoming schedules.
* Completed services.
* Latest reports.
* Outstanding invoices.
* Service history.

## Customer dapat:

* Melihat jadwal.
* Melihat work report.
* Melihat hasil treatment.
* Melihat foto dokumentasi.
* Download report.
* Melihat kontrak.
* Melihat invoice.

Customer portal termasuk modul yang tercantum dalam rancangan sistem sumber.

---

# 25. Dashboard

Dashboard harus menampilkan informasi berdasarkan role.

## Management Dashboard

### KPI

* Total Customer
* Active Contract
* Today's Jobs
* Completed Jobs
* Pending Reports
* Active Technicians
* Revenue
* Outstanding Invoice

### Operational Overview

```text
Today's Schedule
────────────────────────
08:00  Customer A   ✓
10:00  Customer B   ●
13:00  Customer C   ○
15:00  Customer D   ○
```

### Technician Monitoring

```text
Technicians Online
Technicians Working
Technicians Completed
Technicians Offline
```

### Report Monitoring

```text
Pending Approval
Approved
Revision Required
Completed
```

---

# 26. Dashboard Technician

Menampilkan:

* Today's jobs.
* Next job.
* Completed jobs.
* Pending reports.
* Attendance.
* Notifications.

Dashboard harus mobile-friendly karena digunakan oleh teknisi ketika berada di lapangan.

---

# 27. Notification System

Sistem menyediakan notifikasi untuk event penting.

Contoh:

### Admin

* New customer request.
* Report submitted.
* Contract expiring.
* Invoice overdue.

### Supervisor

* Technician assigned.
* Technician check-in.
* Report submitted.
* Revision requested.

### Technician

* New assignment.
* Schedule change.
* Report revision.
* Upcoming job.

### Customer

* Schedule confirmed.
* Technician assigned.
* Work completed.
* Report available.
* Invoice generated.

---

# 28. Master Data

Admin dapat mengatur:

* Service type.
* Pest type.
* Treatment method.
* Chemical.
* Unit.
* Location type.
* Report type.
* Contract type.
* Priority.
* Job status.
* Payment method.
* Notification template.

---

# 29. Role & Permission

Sistem menggunakan Role-Based Access Control.

Contoh:

| Module          | Admin | Management | Supervisor | Technician | Customer |
| --------------- | ----- | ---------- | ---------- | ---------- | -------- |
| Dashboard       | ✓     | ✓          | ✓          | ✓          | ✓        |
| CRM             | ✓     | ✓          | View       | -          | -        |
| Customer        | ✓     | ✓          | View       | Limited    | Own      |
| Contract        | ✓     | ✓          | View       | -          | Own      |
| Schedule        | ✓     | ✓          | ✓          | Own        | Own      |
| Tracking        | ✓     | ✓          | ✓          | Own        | -        |
| Work Report     | ✓     | ✓          | ✓          | Create     | Own      |
| Quotation       | ✓     | ✓          | View       | -          | Own      |
| Invoice         | ✓     | ✓          | View       | -          | Own      |
| User Management | ✓     | -          | -          | -          | -        |
| Master Data     | ✓     | -          | -          | -          | -        |

---

# 30. Audit Log

Sistem mencatat aktivitas penting.

Contoh:

```text
Admin created customer
Supervisor assigned technician
Technician checked in
Technician submitted work report
Supervisor approved report
Admin generated invoice
Customer viewed report
```

Data:

* User.
* Action.
* Module.
* Record.
* Timestamp.
* IP address jika diperlukan.

---

# 31. Database Core Entity

Struktur database utama secara konseptual:

```text
users
roles
permissions

customers
customer_locations
customer_contacts

leads
customer_requests

contracts
contract_services

services
pest_types
treatment_methods
chemicals

schedules
schedule_technicians

technicians
attendance
leave

surveys
survey_items
survey_photos

work_reports
work_report_items
work_report_photos
work_report_signatures

termite_reports

quotations
quotation_items

invoices
invoice_items

notifications
audit_logs
documents
```

---

# 32. Relasi Utama

```text
Customer
   │
   ├── Locations
   │
   ├── Contracts
   │      │
   │      └── Services
   │
   ├── Requests
   │
   ├── Schedules
   │      │
   │      └── Technicians
   │
   ├── Survey Reports
   │
   ├── Work Reports
   │
   ├── Quotations
   │
   └── Invoices
```

Work report:

```text
Schedule
    ↓
Work Report
    ├── Treatment
    ├── Inspection
    ├── Photos
    ├── Documents
    ├── Technician Signature
    └── Customer Signature
```

---

# 33. Technical Architecture

## Backend

**Laravel**

Digunakan untuk:

* Business logic.
* Authentication.
* Authorization.
* Database.
* API/internal endpoints.
* Validation.
* File management.
* Queue.
* Notification.
* PDF generation.

## Frontend

**React + Inertia.js**

React digunakan untuk membangun UI interaktif.

Inertia digunakan sebagai bridge antara Laravel dan React sehingga aplikasi tetap menggunakan konsep server-side routing Laravel tanpa harus membuat SPA API architecture yang terlalu kompleks.

## Styling

Disarankan:

* Tailwind CSS
* shadcn/ui atau komponen UI yang konsisten
* Lucide React Icons

## Database

**MySQL**

## Storage

Untuk:

* Work report photos.
* Signature.
* Documents.
* Customer documents.

Storage dapat menggunakan local storage pada development dan object storage pada production.

---

# 34. Laravel Project Structure

Contoh:

```text
app/
├── Http/
│   ├── Controllers/
│   ├── Requests/
│   └── Middleware/
│
├── Models/
│
├── Services/
│
├── Actions/
│
├── Policies/
│
└── Notifications/

resources/
└── js/
    ├── Components/
    ├── Layouts/
    ├── Pages/
    │   ├── Dashboard/
    │   ├── CRM/
    │   ├── Customers/
    │   ├── Contracts/
    │   ├── Schedules/
    │   ├── Technicians/
    │   ├── Reports/
    │   ├── Quotations/
    │   ├── Invoices/
    │   └── CustomerPortal/
    │
    └── types/

routes/
├── web.php
└── console.php
```

---

# 35. UI/UX Requirements

## General Design

UI harus terlihat seperti aplikasi enterprise modern, bukan template dashboard generik.

Karakter:

* Clean.
* Professional.
* Information-dense tetapi tetap mudah dibaca.
* Responsive.
* Consistent.
* Fast interaction.
* Minimal unnecessary animation.

## Desktop

Digunakan oleh:

* Management.
* Admin.
* Supervisor.

Layout:

```text
┌──────────────┬────────────────────────────┐
│              │                            │
│   SIDEBAR    │        MAIN CONTENT        │
│              │                            │
│ Dashboard    │                            │
│ CRM          │                            │
│ Customers    │                            │
│ Schedule     │                            │
│ Reports      │                            │
│ Finance      │                            │
│              │                            │
└──────────────┴────────────────────────────┘
```

## Mobile

Fokus untuk technician.

Navigation harus mudah digunakan menggunakan satu tangan.

---

# 36. Work Report UX

Work report harus menggunakan pendekatan wizard/step-by-step agar teknisi tidak menghadapi formulir monster sepanjang satu halaman.

Contoh:

```text
1. JOB
   ↓
2. INSPECTION
   ↓
3. TREATMENT
   ↓
4. DOCUMENTATION
   ↓
5. REVIEW
   ↓
6. SIGNATURE
   ↓
7. SUBMIT
```

Setiap tahap memiliki autosave draft sehingga data tidak hilang jika koneksi bermasalah.

---

# 37. Offline Consideration

Karena teknisi bekerja di lapangan, koneksi internet tidak selalu stabil.

MVP minimal:

* Save draft.
* Upload retry.
* Form recovery.
* Status upload.
* Data synchronization ketika koneksi kembali.

Pengembangan offline-first penuh dapat menjadi fase berikutnya jika kebutuhan client memang tinggi.

---

# 38. Automation

Salah satu tujuan utama sistem adalah mengurangi pekerjaan manual.

## Automation 1

Schedule dibuat:

```text
Schedule
↓
Technician Assignment
↓
Technician Notification
```

## Automation 2

Technician selesai:

```text
Work Report Submit
↓
Supervisor Notification
```

## Automation 3

Supervisor approve:

```text
Report Approved
↓
Customer Portal Updated
↓
Customer Notification
```

## Automation 4

Contract hampir habis:

```text
Contract Expiry
↓
System Reminder
↓
Admin Notification
```

## Automation 5

Report approved:

```text
Approved Report
↓
Generate PDF
↓
Available on Customer Portal
```

---

# 39. Security Requirements

Sistem wajib memiliki:

* Authentication.
* Authorization.
* Role-based permission.
* Password hashing.
* CSRF protection.
* Form validation.
* File validation.
* Secure file access.
* Audit logging.
* Rate limiting untuk endpoint sensitif.
* Session management.

Customer hanya dapat mengakses data miliknya sendiri.

Technician hanya dapat mengakses pekerjaan yang diberikan kepadanya atau sesuai permission.

---

# 40. Reporting & Analytics

Management dapat melihat:

### Operational Report

* Jumlah pekerjaan.
* Completed jobs.
* Pending jobs.
* Cancelled jobs.
* Technician performance.
* Service frequency.

### Customer Report

* Customer aktif.
* Customer baru.
* Customer churn.
* Histori treatment.

### Contract Report

* Active contracts.
* Expiring contracts.
* Expired contracts.

### Financial Report

* Quotation.
* Invoice.
* Paid.
* Outstanding.
* Overdue.

---

# 41. Search & Filter

Sistem harus menyediakan pencarian dan filtering pada data utama.

Contoh Customer:

```text
Search:
[ PT ABC Indonesia ]

Filter:
Status
Contract
Location
PIC
```

Schedule:

```text
Date
Technician
Customer
Status
Service
```

Work Report:

```text
Date
Customer
Technician
Service
Status
```

---

# 42. Export

Data tertentu dapat diekspor ke:

* PDF.
* Excel/CSV.

Minimal:

* Customer.
* Schedule.
* Work Report.
* Technician.
* Contract.
* Invoice.

---

# 43. MVP Scope

Untuk versi pertama, fokus pada fitur yang langsung menyelesaikan masalah utama client.

## Phase 1 - Core

### Authentication

* Login.
* Logout.
* Role & permission.

### Dashboard

* KPI.
* Schedule.
* Report status.
* Technician status.

### Customer

* CRUD customer.
* Location.
* PIC.
* History.

### Contract

* CRUD contract.
* Contract status.
* Expiry reminder.

### Schedule

* Create schedule.
* Assign technician.
* Calendar/list view.
* Schedule status.

### Technician

* Technician profile.
* Assigned jobs.
* Attendance.
* Check-in/check-out.

### Work Report

* Create report.
* Dynamic/basic form.
* Photo.
* Signature.
* Submit.
* Approval.
* PDF.

### Tracking

* Technician location.
* Location history.
* Basic geofencing.

### Customer Portal

* Customer login.
* Schedule.
* Work report.
* Contract.
* Service history.

---

# 44. Phase 2

Setelah core system stabil:

* CRM Lead Management.
* Customer Request.
* Survey Report.
* Termite Report.
* Quotation.
* Invoice.
* Notification automation.
* Advanced analytics.
* Advanced dynamic form builder.

---

# 45. Phase 3

Pengembangan lanjutan:

* Advanced App Builder.
* Full offline-first mobile experience.
* Advanced geofencing.
* Automated billing.
* WhatsApp integration.
* Email integration.
* Customer feedback.
* Advanced BI dashboard.
* Multi-company / multi-branch support.

---

# 46. Success Metrics

Keberhasilan sistem dapat diukur melalui:

### Operational Efficiency

Target:

* Mengurangi input ulang work report.
* Mempercepat proses reporting.
* Mengurangi penggunaan hardcopy.

### Monitoring

Target:

* Management dapat melihat status pekerjaan secara real-time.
* Supervisor dapat mengetahui assignment teknisi.

### Data Quality

Target:

* Customer database terpusat.
* Work report memiliki struktur data yang konsisten.
* Histori pekerjaan mudah dicari.

### Customer Experience

Target:

* Customer dapat melihat report tanpa harus meminta admin.
* Customer dapat melihat histori service.
* Report tersedia lebih cepat setelah pekerjaan selesai.

---

# 47. Acceptance Criteria Utama

## Customer

Admin dapat membuat customer baru dan customer tersebut langsung tersedia untuk digunakan dalam contract, schedule, dan work report.

## Schedule

Supervisor dapat membuat schedule dan assign technician.

Technician langsung menerima pekerjaan pada dashboard-nya.

## Field Work

Technician dapat melakukan:

```text
Check-in
→ Survey
→ Treatment
→ Upload Photo
→ Work Report
→ Signature
→ Submit
```

## Approval

Supervisor dapat melakukan approval atau meminta revisi.

## Report

Setelah approved, report dapat dilihat oleh customer melalui Customer Portal.

## Tracking

Supervisor/Management dapat melihat lokasi teknisi yang aktif dan histori lokasi sesuai permission.

---

# 48. End-to-End Business Flow

Keseluruhan sistem:

```text
                    ┌──────────────┐
                    │   CUSTOMER   │
                    └──────┬───────┘
                           ↓
                    Customer Request
                           ↓
                    ┌──────────────┐
                    │     CRM      │
                    └──────┬───────┘
                           ↓
                    Survey / Quotation
                           ↓
                    ┌──────────────┐
                    │   CONTRACT   │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │   SCHEDULE   │
                    └──────┬───────┘
                           ↓
                  Technician Assignment
                           ↓
                    ┌──────────────┐
                    │  FIELD JOB   │
                    └──────┬───────┘
                           ↓
                Check-in + GPS Location
                           ↓
                     Inspection
                           ↓
                      Treatment
                           ↓
                 Documentation / Photo
                           ↓
                    Work Report
                           ↓
                 Customer Signature
                           ↓
                Supervisor Approval
                    ↙           ↘
                Revision       Approved
                  ↓                ↓
             Technician       Generate Report
                                   ↓
                            Customer Portal
                                   ↓
                              Invoicing
```

---

# 49. Product Principle

Sistem harus dibangun berdasarkan prinsip:

### "Input Once, Use Everywhere"

Data tidak boleh dimasukkan berulang kali.

Contoh:

Customer dibuat satu kali.

Data tersebut kemudian digunakan oleh:

```text
Customer
   ↓
Contract
   ↓
Schedule
   ↓
Work Report
   ↓
Invoice
   ↓
Customer Portal
```

Demikian juga work report:

```text
Technician Input
       ↓
Work Report
       ↓
Approval
       ↓
PDF
       ↓
Customer Portal
       ↓
Billing
```

Dengan pendekatan tersebut, masalah utama berupa laporan hardcopy dan input ulang admin dapat dikurangi secara signifikan.

---

# 50. Final Product Vision

GPEST Pest Control Management System bukan hanya sistem untuk membuat laporan.

Sistem ini menjadi **centralized operational platform** untuk perusahaan pest control.

Seluruh aktivitas perusahaan terhubung dalam satu sistem:

**CRM → Customer → Contract → Schedule → Technician → Tracking → Treatment → Work Report → Approval → Customer Portal → Invoice**

Dengan sistem ini, management memperoleh visibility terhadap operasional, admin mengurangi pekerjaan administratif berulang, teknisi memiliki workflow kerja yang jelas, dan customer memperoleh akses langsung terhadap informasi layanan mereka.

Dokumen sumber sendiri memosisikan digitalisasi sebagai cara untuk meningkatkan efisiensi operasional, akurasi data, kecepatan reporting kepada client, serta transparansi management.

---

# 51. Recommended Development Priority

Prioritas pengerjaan:

```text
P0 - WAJIB
├── Authentication
├── Role & Permission
├── Dashboard
├── Customer
├── Contract
├── Schedule
├── Technician
├── Work Report
├── Photo Documentation
├── Signature
├── Report Approval
└── Customer Portal

P1 - PENTING
├── GPS Tracking
├── Attendance
├── Survey Report
├── Termite Report
├── Notification
├── CRM
└── Quotation

P2 - PENGEMBANGAN
├── Invoicing
├── Dynamic App Builder
├── Advanced Analytics
├── WhatsApp Integration
├── Offline-first
└── Advanced Automation
```

# 52. Recommended Tech Stack

| Layer           | Technology                               |
| --------------- | ---------------------------------------- |
| Backend         | Laravel                                  |
| Frontend        | React                                    |
| SPA Bridge      | Inertia.js                               |
| Styling         | Tailwind CSS                             |
| UI Components   | shadcn/ui                                |
| Icons           | Lucide React                             |
| Database        | MySQL                                    |
| Authentication  | Laravel Auth                             |
| Authorization   | Laravel Policies / Permission            |
| File Storage    | Laravel Storage                          |
| PDF             | Laravel PDF package                      |
| Queue           | Laravel Queue                            |
| Cache           | Redis                                    |
| Realtime        | Laravel Reverb                           |
| Maps            | Google Maps / Mapbox                     |
| Deployment      | VPS / Laravel Cloud / compatible hosting |
| Version Control | Git + GitHub                             |

---

# 53. MVP Definition

MVP dianggap berhasil apabila:

> **Admin dapat membuat customer → membuat kontrak → membuat jadwal → assign teknisi → teknisi menerima pekerjaan → teknisi datang ke lokasi → melakukan treatment → mengisi work report + foto + signature → supervisor melakukan approval → report otomatis tersedia untuk customer.**

Jika alur tersebut sudah berjalan end-to-end, maka inti permasalahan client sudah berhasil diselesaikan.

Fitur tambahan seperti CRM kompleks, invoicing, dynamic App Builder, analytics lanjutan, dan integrasi WhatsApp dapat dikembangkan setelah workflow utama stabil.
