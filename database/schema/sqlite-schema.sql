CREATE TABLE IF NOT EXISTS "migrations"(
  "id" integer primary key autoincrement not null,
  "migration" varchar not null,
  "batch" integer not null
);
CREATE TABLE IF NOT EXISTS "users"(
  "id" integer primary key autoincrement not null,
  "name" varchar not null,
  "email" varchar not null,
  "email_verified_at" datetime,
  "password" varchar not null,
  "remember_token" varchar,
  "created_at" datetime,
  "updated_at" datetime,
  "status" varchar not null default 'aktif'
);
CREATE UNIQUE INDEX "users_email_unique" on "users"("email");
CREATE TABLE IF NOT EXISTS "password_reset_tokens"(
  "email" varchar not null,
  "token" varchar not null,
  "created_at" datetime,
  primary key("email")
);
CREATE TABLE IF NOT EXISTS "sessions"(
  "id" varchar not null,
  "user_id" integer,
  "ip_address" varchar,
  "user_agent" text,
  "payload" text not null,
  "last_activity" integer not null,
  primary key("id")
);
CREATE INDEX "sessions_user_id_index" on "sessions"("user_id");
CREATE INDEX "sessions_last_activity_index" on "sessions"("last_activity");
CREATE TABLE IF NOT EXISTS "cache"(
  "key" varchar not null,
  "value" text not null,
  "expiration" integer not null,
  primary key("key")
);
CREATE INDEX "cache_expiration_index" on "cache"("expiration");
CREATE TABLE IF NOT EXISTS "cache_locks"(
  "key" varchar not null,
  "owner" varchar not null,
  "expiration" integer not null,
  primary key("key")
);
CREATE INDEX "cache_locks_expiration_index" on "cache_locks"("expiration");
CREATE TABLE IF NOT EXISTS "jobs"(
  "id" integer primary key autoincrement not null,
  "queue" varchar not null,
  "payload" text not null,
  "attempts" integer not null,
  "reserved_at" integer,
  "available_at" integer not null,
  "created_at" integer not null
);
CREATE INDEX "jobs_queue_index" on "jobs"("queue");
CREATE TABLE IF NOT EXISTS "job_batches"(
  "id" varchar not null,
  "name" varchar not null,
  "total_jobs" integer not null,
  "pending_jobs" integer not null,
  "failed_jobs" integer not null,
  "failed_job_ids" text not null,
  "options" text,
  "cancelled_at" integer,
  "created_at" integer not null,
  "finished_at" integer,
  primary key("id")
);
CREATE TABLE IF NOT EXISTS "failed_jobs"(
  "id" integer primary key autoincrement not null,
  "uuid" varchar not null,
  "connection" varchar not null,
  "queue" varchar not null,
  "payload" text not null,
  "exception" text not null,
  "failed_at" datetime not null default CURRENT_TIMESTAMP
);
CREATE INDEX "failed_jobs_connection_queue_failed_at_index" on "failed_jobs"(
  "connection",
  "queue",
  "failed_at"
);
CREATE UNIQUE INDEX "failed_jobs_uuid_unique" on "failed_jobs"("uuid");
CREATE TABLE IF NOT EXISTS "customers"(
  "id" integer primary key autoincrement not null,
  "customer_id" varchar not null,
  "company_name" varchar not null,
  "pic_name" varchar not null,
  "phone" varchar not null,
  "email" varchar not null,
  "address" text not null,
  "location" varchar not null,
  "npwp" varchar,
  "status" varchar check("status" in('active', 'inactive')) not null,
  "sales_pic" varchar,
  "created_at" datetime,
  "updated_at" datetime,
  "deleted_at" datetime
);
CREATE UNIQUE INDEX "customers_customer_id_unique" on "customers"(
  "customer_id"
);
CREATE TABLE IF NOT EXISTS "contracts"(
  "id" integer primary key autoincrement not null,
  "contract_number" varchar not null,
  "customer_id" integer not null,
  "location" varchar not null,
  "contract_type" varchar not null,
  "start_date" date not null,
  "end_date" date not null,
  "service_frequency" varchar not null,
  "service_type" varchar not null,
  "contract_value" numeric not null,
  "status" varchar check("status" in('draft', 'active', 'expiring_soon', 'expired', 'cancelled')) not null default 'draft',
  "pic" varchar,
  "attachment" varchar,
  "created_at" datetime,
  "updated_at" datetime,
  "deleted_at" datetime,
  foreign key("customer_id") references "customers"("id") on delete cascade
);
CREATE UNIQUE INDEX "contracts_contract_number_unique" on "contracts"(
  "contract_number"
);
CREATE TABLE IF NOT EXISTS "schedules"(
  "id" integer primary key autoincrement not null,
  "schedule_code" varchar not null,
  "customer_id" integer not null,
  "contract_id" integer,
  "lokasi" varchar not null,
  "jenis_layanan" varchar not null,
  "technician_id" integer,
  "supervisor_id" integer,
  "tanggal" date not null,
  "jam_mulai" time not null,
  "jam_selesai" time not null,
  "prioritas" varchar check("prioritas" in('rendah', 'normal', 'tinggi', 'urgent')) not null default 'normal',
  "status" varchar check("status" in('dijadwalkan', 'ditugaskan', 'dalam_perjalanan', 'tiba', 'sedang_dikerjakan', 'selesai', 'dibatalkan', 'dijadwal_ulang')) not null default 'dijadwalkan',
  "catatan" text,
  "created_at" datetime,
  "updated_at" datetime,
  "deleted_at" datetime,
  foreign key("customer_id") references "customers"("id") on delete cascade,
  foreign key("contract_id") references "contracts"("id") on delete set null,
  foreign key("technician_id") references "users"("id") on delete set null,
  foreign key("supervisor_id") references "users"("id") on delete set null
);
CREATE UNIQUE INDEX "schedules_schedule_code_unique" on "schedules"(
  "schedule_code"
);
CREATE TABLE IF NOT EXISTS "technicians"(
  "id" integer primary key autoincrement not null,
  "user_id" integer,
  "employee_id" varchar not null,
  "nama" varchar not null,
  "telepon" varchar not null,
  "email" varchar not null,
  "jabatan" varchar not null,
  "status" varchar check("status" in('aktif', 'tidak_aktif', 'cuti')) not null default 'aktif',
  "area_tugas" varchar,
  "keahlian" text,
  "tanggal_bergabung" date not null,
  "foto_profil" varchar,
  "created_at" datetime,
  "updated_at" datetime,
  "deleted_at" datetime,
  foreign key("user_id") references "users"("id") on delete set null
);
CREATE UNIQUE INDEX "technicians_employee_id_unique" on "technicians"(
  "employee_id"
);
CREATE TABLE IF NOT EXISTS "work_reports"(
  "id" integer primary key autoincrement not null,
  "nomor_laporan" varchar not null,
  "customer_id" integer not null,
  "contract_id" integer,
  "schedule_id" integer,
  "technician_id" integer not null,
  "tanggal" date not null,
  "jam_mulai" time not null,
  "jam_selesai" time,
  "jenis_layanan" varchar not null,
  "jenis_hama" varchar,
  "metode_treatment" varchar,
  "bahan_kimia" varchar,
  "jumlah_bahan" varchar,
  "area_treatment" text,
  "peralatan" varchar,
  "temuan" text,
  "aktivitas_hama" varchar,
  "tingkat_keparahan" varchar,
  "rekomendasi" text,
  "status" varchar check("status" in('draft', 'dikirim', 'disetujui', 'revisi', 'selesai')) not null default 'draft',
  "catatan_supervisor" text,
  "created_at" datetime,
  "updated_at" datetime,
  "deleted_at" datetime,
  foreign key("customer_id") references "customers"("id") on delete cascade,
  foreign key("contract_id") references "contracts"("id") on delete set null,
  foreign key("schedule_id") references "schedules"("id") on delete set null,
  foreign key("technician_id") references "users"("id") on delete cascade
);
CREATE UNIQUE INDEX "work_reports_nomor_laporan_unique" on "work_reports"(
  "nomor_laporan"
);
CREATE TABLE IF NOT EXISTS "work_report_photos"(
  "id" integer primary key autoincrement not null,
  "work_report_id" integer not null,
  "jenis_foto" varchar check("jenis_foto" in('sebelum', 'selama', 'sesudah')) not null,
  "path_foto" varchar not null,
  "keterangan" varchar,
  "created_at" datetime,
  "updated_at" datetime,
  foreign key("work_report_id") references "work_reports"("id") on delete cascade
);
CREATE TABLE IF NOT EXISTS "customer_users"(
  "id" integer primary key autoincrement not null,
  "customer_id" integer not null,
  "nama" varchar not null,
  "email" varchar not null,
  "password" varchar not null,
  "email_verified_at" datetime,
  "remember_token" varchar,
  "status" varchar check("status" in('aktif', 'tidak_aktif')) not null default 'aktif',
  "created_at" datetime,
  "updated_at" datetime,
  foreign key("customer_id") references "customers"("id") on delete cascade
);
CREATE UNIQUE INDEX "customer_users_email_unique" on "customer_users"("email");
CREATE TABLE IF NOT EXISTS "permissions"(
  "id" integer primary key autoincrement not null,
  "name" varchar not null,
  "guard_name" varchar not null,
  "created_at" datetime,
  "updated_at" datetime
);
CREATE UNIQUE INDEX "permissions_name_guard_name_unique" on "permissions"(
  "name",
  "guard_name"
);
CREATE TABLE IF NOT EXISTS "roles"(
  "id" integer primary key autoincrement not null,
  "name" varchar not null,
  "guard_name" varchar not null,
  "created_at" datetime,
  "updated_at" datetime
);
CREATE UNIQUE INDEX "roles_name_guard_name_unique" on "roles"(
  "name",
  "guard_name"
);
CREATE TABLE IF NOT EXISTS "model_has_permissions"(
  "permission_id" integer not null,
  "model_type" varchar not null,
  "model_id" integer not null,
  foreign key("permission_id") references "permissions"("id") on delete cascade,
  primary key("permission_id", "model_id", "model_type")
);
CREATE INDEX "model_has_permissions_model_id_model_type_index" on "model_has_permissions"(
  "model_id",
  "model_type"
);
CREATE TABLE IF NOT EXISTS "model_has_roles"(
  "role_id" integer not null,
  "model_type" varchar not null,
  "model_id" integer not null,
  foreign key("role_id") references "roles"("id") on delete cascade,
  primary key("role_id", "model_id", "model_type")
);
CREATE INDEX "model_has_roles_model_id_model_type_index" on "model_has_roles"(
  "model_id",
  "model_type"
);
CREATE TABLE IF NOT EXISTS "role_has_permissions"(
  "permission_id" integer not null,
  "role_id" integer not null,
  foreign key("permission_id") references "permissions"("id") on delete cascade,
  foreign key("role_id") references "roles"("id") on delete cascade,
  primary key("permission_id", "role_id")
);

INSERT INTO migrations VALUES(1,'0001_01_01_000000_create_users_table',1);
INSERT INTO migrations VALUES(2,'0001_01_01_000001_create_cache_table',1);
INSERT INTO migrations VALUES(3,'0001_01_01_000002_create_jobs_table',1);
INSERT INTO migrations VALUES(4,'2026_08_29_000000_create_customers_table',2);
INSERT INTO migrations VALUES(5,'2026_08_29_055432_create_contracts_table',3);
INSERT INTO migrations VALUES(6,'2026_08_29_060051_create_schedules_table',4);
INSERT INTO migrations VALUES(7,'2026_08_29_060709_create_technicians_table',5);
INSERT INTO migrations VALUES(8,'2026_08_29_061330_create_work_reports_table',6);
INSERT INTO migrations VALUES(9,'2026_08_29_061340_create_work_report_photos_table',6);
INSERT INTO migrations VALUES(10,'2026_08_29_062854_create_customer_users_table',7);
INSERT INTO migrations VALUES(11,'2026_08_29_070000_create_permission_tables',8);
INSERT INTO migrations VALUES(12,'2026_08_29_143653_add_status_to_users_table',9);
