import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Plus, Search, Edit, Trash2, Shield, Mail, User as UserIcon } from 'lucide-react';
import { useState } from 'react';

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    status: 'aktif' | 'tidak_aktif';
    roles?: Role[];
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedUsers {
    data: User[];
    total: number;
    links: PaginationLink[];
}

interface Props {
    users: PaginatedUsers;
    roles: Role[];
    filters: { search?: string; role?: string };
}

export const RoleBadge = ({ roleName }: { roleName: string }) => {
    switch (roleName) {
        case 'super_admin':
            return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#7928ca]/15 text-[#7928ca]">Super Admin</span>;
        case 'management':
            return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#0070f3]/15 text-[#0070f3]">Management</span>;
        case 'admin':
            return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#0070f3]/15 text-[#0070f3]">Admin</span>;
        case 'supervisor':
            return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#f5a623]/15 text-[#ab570a]">Supervisor</span>;
        case 'technician':
            return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-canvas-soft-2 text-ink border border-hairline">Technician</span>;
        case 'customer':
            return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-canvas-soft-2 text-mute border border-hairline">Customer</span>;
        default:
            return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-canvas-soft text-body-text">{roleName}</span>;
    }
};

export const StatusBadge = ({ status }: { status: User['status'] }) => {
    if (status === 'aktif') {
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#0070f3]/15 text-[#0070f3]">Aktif</span>;
    }
    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#ee0000]/15 text-[#ee0000]">Tidak Aktif</span>;
};

export default function Index({ users, roles, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/users', { search, role }, { preserveState: true, replace: true });
    };

    const handleRoleChange = (selectedRole: string) => {
        setRole(selectedRole);
        router.get('/users', { search, role: selectedRole }, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus pengguna "${name}"?`)) {
            router.delete(`/users/${id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Manajemen Pengguna" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink">Manajemen Pengguna (Users)</h1>
                        <p className="text-body-sm text-mute mt-1">Kelola daftar akun pengguna dan hak akses peran (Roles & Permissions).</p>
                    </div>
                    <Link href="/users/create">
                        <Button className="bg-primary text-on-primary hover:bg-ink text-body-sm-strong flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Tambah User Baru
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-4">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative flex-1 w-full">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
                            <Input
                                type="text"
                                placeholder="Cari nama pengguna atau email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <select
                            value={role}
                            onChange={(e) => handleRoleChange(e.target.value)}
                            className="h-9 px-3 py-1 rounded-md border border-hairline bg-canvas text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-48"
                        >
                            <option value="">Semua Role</option>
                            {roles.map((r) => (
                                <option key={r.id} value={r.name}>{r.name}</option>
                            ))}
                        </select>
                        <Button type="submit" variant="outline" className="text-body-sm-strong w-full sm:w-auto">
                            Filter
                        </Button>
                    </form>
                </div>

                {/* Table */}
                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-hairline bg-canvas-soft text-caption-mono uppercase text-mute">
                                    <th className="py-3 px-4 font-semibold">Nama Pengguna</th>
                                    <th className="py-3 px-4 font-semibold">Email</th>
                                    <th className="py-3 px-4 font-semibold">Role / Peran</th>
                                    <th className="py-3 px-4 font-semibold">Status</th>
                                    <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-hairline text-body-sm text-ink">
                                {users.data && users.data.length > 0 ? (
                                    users.data.map((u) => (
                                        <tr key={u.id} className="hover:bg-canvas-soft/50 transition-colors">
                                            <td className="py-3 px-4 font-medium">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-full bg-canvas-soft-2 border border-hairline flex items-center justify-center text-xs font-semibold text-ink shrink-0">
                                                        {u.name.slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <span className="font-semibold text-ink">{u.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-body-text">
                                                <div className="flex items-center gap-1.5">
                                                    <Mail className="w-3.5 h-3.5 text-mute" />
                                                    <span>{u.email}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                {u.roles && u.roles.length > 0 ? (
                                                    <RoleBadge roleName={u.roles[0].name} />
                                                ) : (
                                                    <span className="text-mute italic">Tanpa Role</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <StatusBadge status={u.status || 'aktif'} />
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/users/${u.id}/edit`}>
                                                        <Button variant="outline" size="icon" className="h-8 w-8 text-body-text hover:text-ink">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 text-error hover:bg-error/10"
                                                        onClick={() => handleDelete(u.id, u.name)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-mute text-body-sm">
                                            Tidak ada data pengguna yang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.links && users.links.length > 3 && (
                        <div className="p-4 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4 text-body-sm">
                            <div className="text-mute">
                                Menampilkan {users.data.length} dari {users.total} pengguna
                            </div>
                            <div className="flex items-center gap-1">
                                {users.links.map((link, idx) => (
                                    link.url ? (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            className={`px-3 py-1 rounded border text-xs font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-primary text-on-primary border-primary'
                                                    : 'bg-canvas text-body-text border-hairline hover:bg-canvas-soft'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 rounded border text-xs font-medium bg-canvas-soft text-mute border-hairline opacity-50"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
