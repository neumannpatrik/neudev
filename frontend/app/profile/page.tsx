"use client";
import { useAuth } from '@/components/AuthProvider';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCog, FaDollarSign, FaTrash, FaLock, FaLockOpen } from 'react-icons/fa';

interface Activity {
  id: string;
  type: string;
  description: string;
  status: string;
  hoursWorked: number;
  startTime: string;
  endTime: string;
  hourRate: number;
  totalCost: number;
}

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'OPEN' | 'CLOSED';
  createdAt?: string;
  activities: Activity[];
  user: { id: string; name: string; email: string };
}

export default function ProfilePage() {
  const { user, token, login, logout, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [form, setForm] = useState({ title: '', description: '', userId: '', status: 'OPEN' });
  const [allUsers, setAllUsers] = useState<{ id: string; name: string; email: string; isAdmin: boolean }[]>([]);

  // Activity modal state
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activityModalMode, setActivityModalMode] = useState<'create' | 'edit'>('create');
  const [activityForm, setActivityForm] = useState({
    id: '',
    type: 'CONSULTATION',
    description: '',
    status: 'NEW',
    hoursWorked: 1,
    startTime: '',
    endTime: '',
    hourRate: 8000,
  });
  const [activityProjectId, setActivityProjectId] = useState<string | null>(null);

  // Admin filtering
  const [clientFilter, setClientFilter] = useState('');

  // Auth state
  const [showSignIn, setShowSignIn] = useState(!user);
  const [showRegister, setShowRegister] = useState(false);
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');

  // Tabs for projects
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0] || null;

  // Activity filter state
  const [activityFilter, setActivityFilter] = useState<'all' | 'paid' | 'unpaid'>('all');

  useEffect(() => {
    if (user && token) fetchProjects();
    // eslint-disable-next-line
  }, [user, token]);

  // Fetch all users for admin client selection
  useEffect(() => {
    if (user?.isAdmin && token) {
      fetch('http://localhost:3001/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setAllUsers(data.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          isAdmin: u.isAdmin ?? false,
        }))))
        .catch(() => setAllUsers([]));
    }
  }, [user, token]);

  async function fetchProjects() {
    setError('');
    try {
      const res = await fetch('http://localhost:3001/api/projects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch projects');
      setProjects(data);
      // Set the first project as active if no project is selected
      if (!activeProjectId && data.length > 0) {
        setActiveProjectId(data[0].id);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      // setLoading(false); // Remove this line
    }
  }

  function openCreateModal() {
    setModalMode('create');
    setForm({ title: '', description: '', userId: '', status: 'OPEN' });
    setShowProjectModal(true);
  }

  function openEditModal(project: Project) {
    setModalMode('edit');
    setSelectedProject(project);
    setForm({ title: project.title, description: project.description, userId: project.user?.id || '', status: project.status || 'OPEN' });
    setShowProjectModal(true);
  }

  async function handleProjectSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const url = modalMode === 'create' ? 'http://localhost:3001/api/projects' : `http://localhost:3001/api/projects/${selectedProject?.id}`;
      const method = modalMode === 'create' ? 'POST' : 'PUT';
      const body = user?.isAdmin ? { ...form } : { title: form.title, description: form.description, status: form.status };
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save project');
      setShowProjectModal(false);
      fetchProjects();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleDeleteProject(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    setError('');
    try {
      const res = await fetch(`http://localhost:3001/api/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete project');
      fetchProjects();
    } catch (err: any) {
      setError(err.message);
    }
  }

  // Activity CRUD
  function openCreateActivityModal(projectId: string) {
    setActivityModalMode('create');
    setActivityForm({
      id: '',
      type: 'CONSULTATION',
      description: '',
      status: 'NEW',
      hoursWorked: 1,
      startTime: '',
      endTime: '',
      hourRate: 8000,
    });
    setActivityProjectId(projectId);
    setShowActivityModal(true);
  }

  function openEditActivityModal(projectId: string, activity: Activity) {
    setActivityModalMode('edit');
    // Format dates for datetime-local input
    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };
    setActivityForm({
      ...activity,
      startTime: formatDate(activity.startTime),
      endTime: formatDate(activity.endTime),
    });
    setActivityProjectId(projectId);
    setShowActivityModal(true);
  }

  async function handleActivitySubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const url =
        activityModalMode === 'create'
          ? `http://localhost:3001/api/activities/project/${activityProjectId}`
          : `http://localhost:3001/api/activities/${activityForm.id}`;
      const method = activityModalMode === 'create' ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(activityForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save activity');
      setShowActivityModal(false);
      fetchProjects();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleDeleteActivity(id: string) {
    if (!confirm('Are you sure you want to delete this activity?')) return;
    setError('');
    try {
      const res = await fetch(`http://localhost:3001/api/activities/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete activity');
      setShowActivityModal(false);
      fetchProjects();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function markActivityAsPaid(activityId: string) {
    setError('');
    try {
      // Find the activity in the current project
      const activity = activeProject?.activities.find(a => a.id === activityId);
      if (!activity) throw new Error('Activity not found.');
      const res = await fetch(`http://localhost:3001/api/activities/${activityId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: activity.type,
          description: activity.description,
          status: 'DONE_PAID',
          hoursWorked: activity.hoursWorked,
          startTime: activity.startTime,
          endTime: activity.endTime,
          hourRate: activity.hourRate,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update activity');
      fetchProjects();
    } catch (err: any) {
      setError(err.message);
    }
  }

  // Auth handlers
  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authForm.email, password: authForm.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      login(data.token);
      setShowSignIn(false);
      setAuthForm({ name: '', email: '', password: '' });
    } catch (err: any) {
      setAuthError(err.message);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: authForm.name, email: authForm.email, password: authForm.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      // Auto-login after registration
      const loginRes = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authForm.email, password: authForm.password }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) throw new Error(loginData.error || 'Login failed');
      login(loginData.token);
      setShowRegister(false);
      setAuthForm({ name: '', email: '', password: '' });
    } catch (err: any) {
      setAuthError(err.message);
    }
  }

  function handleLogout() {
    logout();
    router.push('/');
  }

  // Admin: get unique clients for filtering
  const clients = user?.isAdmin
    ? Array.from(new Map(projects.map(p => [p.user.id, p.user])).values())
    : [];
  const filteredProjects = user?.isAdmin && clientFilter
    ? projects.filter(p => p.user.id === clientFilter)
    : projects;

  // Sort projects by status and creation date
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (a.status !== b.status) return a.status === 'OPEN' ? -1 : 1;
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  // Only show non-admin users in the client dropdown
  const nonAdminUsers = allUsers.filter(u => !u.isAdmin);

  // Add these mappings inside ProfilePage
  const statusLabels: Record<string, string> = {
    NEW: 'New',
    UNDER_DEVELOPMENT: 'Under Dev.',
    DONE_UNPAID: 'Done (Unpaid)',
    DONE_PAID: 'Done (Paid)',
  };
  const typeLabels: Record<string, string> = {
    CONSULTATION: 'Cons.',
    TASK: 'Task',
  };

  // Add formatter inside ProfilePage
  const hufFormatter = new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 });

  // Add a function to toggle project status
  async function toggleProjectStatus(project: Project) {
    setError('');
    try {
      const res = await fetch(`http://localhost:3001/api/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: project.title,
          description: project.description,
          status: project.status === 'OPEN' ? 'CLOSED' : 'OPEN',
          userId: project.user.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update project status');
      fetchProjects();
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="text-primary-light text-lg">Loading...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-full max-w-md bg-primary-dark rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-primary-light mb-6 text-center">My Profile</h1>
          <div className="flex gap-4 justify-center mb-6">
            <button className="px-4 py-2 rounded bg-primary-light text-primary-dark font-semibold hover:bg-opacity-80 transition" onClick={() => { setShowSignIn(true); setShowRegister(false); }}>Sign In</button>
            <button className="px-4 py-2 rounded bg-primary-light text-primary-dark font-semibold hover:bg-opacity-80 transition" onClick={() => { setShowRegister(true); setShowSignIn(false); }}>Register</button>
          </div>
          {showSignIn && (
            <form onSubmit={handleSignIn} className="space-y-4">
              {authError && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-2">{authError}</div>}
              <div>
                <label htmlFor="email" className="block text-primary-white mb-1">Email address</label>
                <input type="email" className="w-full px-3 py-2 rounded bg-primary-medium text-primary-white focus:outline-none focus:ring-2 focus:ring-primary-light" id="email" placeholder="Enter email" value={authForm.email} onChange={e => setAuthForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <label htmlFor="password" className="block text-primary-white mb-1">Password</label>
                <input type="password" className="w-full px-3 py-2 rounded bg-primary-medium text-primary-white focus:outline-none focus:ring-2 focus:ring-primary-light" id="password" placeholder="Password" value={authForm.password} onChange={e => setAuthForm(f => ({ ...f, password: e.target.value }))} />
              </div>
              <button type="submit" className="w-full py-2 rounded bg-primary-light text-primary-dark font-semibold hover:bg-opacity-80 transition">Sign In</button>
            </form>
          )}
          {showRegister && (
            <form onSubmit={handleRegister} className="space-y-4">
              {authError && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-2">{authError}</div>}
              <div>
                <label htmlFor="name" className="block text-primary-white mb-1">Name</label>
                <input type="text" className="w-full px-3 py-2 rounded bg-primary-medium text-primary-white focus:outline-none focus:ring-2 focus:ring-primary-light" id="name" placeholder="Enter name" value={authForm.name} onChange={e => setAuthForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label htmlFor="email" className="block text-primary-white mb-1">Email address</label>
                <input type="email" className="w-full px-3 py-2 rounded bg-primary-medium text-primary-white focus:outline-none focus:ring-2 focus:ring-primary-light" id="email" placeholder="Enter email" value={authForm.email} onChange={e => setAuthForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <label htmlFor="password" className="block text-primary-white mb-1">Password</label>
                <input type="password" className="w-full px-3 py-2 rounded bg-primary-medium text-primary-white focus:outline-none focus:ring-2 focus:ring-primary-light" id="password" placeholder="Password" value={authForm.password} onChange={e => setAuthForm(f => ({ ...f, password: e.target.value }))} />
              </div>
              <button type="submit" className="w-full py-2 rounded bg-primary-light text-primary-dark font-semibold hover:bg-opacity-80 transition">Register</button>
            </form>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto py-8 px-2 md:px-0">
      {/* Replace the user info, logout, and heading section with a highlighted flex row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 bg-primary-dark rounded-lg shadow-lg p-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-primary-light">Client Portal</h1>
          {user.isAdmin && (
            <select className="rounded bg-primary-medium text-primary-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-light ml-2" value={clientFilter} onChange={e => setClientFilter(e.target.value)}>
              <option value="">All</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
              ))}
            </select>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-primary-white font-semibold">{user.name} - {user.isAdmin ? 'Admin' : 'Client'}</span>
          <button className="px-4 py-2 rounded bg-gray-600 text-white font-semibold hover:bg-gray-700 transition" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
      {/* In the filter/add project row, only show the client filter for admins */}
      {loading ? (
        <div className="text-primary-white">Loading...</div>
      ) : (
        <>
          {/* Project Tabs with Add Project button in the same row */}
          <div className="flex gap-2 mb-4 overflow-x-auto items-center">
            {user.isAdmin && (
              <button className="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition" onClick={openCreateModal}>Add New</button>
            )}
            {sortedProjects.map((project) => (
              <button
                key={project.id}
                className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 flex items-center gap-2 ${activeProjectId === project.id || (!activeProjectId && projects[0]?.id === project.id) ? 'bg-primary-light text-primary-dark border-primary-light' : 'bg-primary-medium text-primary-white border-transparent'}`}
                onClick={() => setActiveProjectId(project.id)}
                style={{ position: 'relative' }}
              >
                {project.title}
                <span
                  className={user.isAdmin ? "ml-2 cursor-pointer hover:scale-110 transition-transform" : "ml-2 opacity-70"}
                  title={project.status === 'OPEN' ? (user.isAdmin ? 'Close project' : 'Open') : (user.isAdmin ? 'Open project' : 'Closed')}
                  {...(user.isAdmin ? { onClick: (e) => { e.stopPropagation(); toggleProjectStatus(project); } } : {})}
                >
                  {project.status === 'OPEN' ? <FaLockOpen className="inline text-green-700" /> : <FaLock className="inline" style={{ color: '#ff6347' }} />}
                </span>
              </button>
            ))}
          </div>
          {/* Activities List for Active Project */}
          {activeProject ? (
            <div className="bg-primary-dark rounded-lg shadow-lg p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-primary-light font-bold text-lg">{activeProject.title}</span>
              </div>
              <div className="mb-2 text-primary-white">{activeProject.description}</div>
              <div className="mb-2 text-primary-white font-semibold">Upaid activities: {hufFormatter.format(activeProject.activities.filter(a => a.status !== 'DONE_PAID').reduce((sum, a) => sum + (a.totalCost || 0), 0))}</div>
              {user.isAdmin && (
                <div className="mb-4">
                  <button className="px-3 py-1 rounded bg-primary-light text-primary-dark font-semibold hover:bg-opacity-80 transition text-xs" onClick={() => openCreateActivityModal(activeProject.id)}>
                    Add Activity
                  </button>
                </div>
              )}
              {/* Activity Filter Buttons */}
              <div className="mb-4 flex gap-2">
                <button
                  className={`px-4 py-2 rounded font-semibold transition text-xs ${activityFilter === 'all' ? 'bg-primary-light text-primary-dark' : 'bg-primary-medium text-primary-white'}`}
                  onClick={() => setActivityFilter('all')}
                >
                  All
                </button>
                <button
                  className={`px-4 py-2 rounded font-semibold transition text-xs ${activityFilter === 'unpaid' ? 'bg-primary-light text-primary-dark' : 'bg-primary-medium text-primary-white'}`}
                  onClick={() => setActivityFilter('unpaid')}
                >
                  Unpaid
                </button>
                <button
                  className={`px-4 py-2 rounded font-semibold transition text-xs ${activityFilter === 'paid' ? 'bg-primary-light text-primary-dark' : 'bg-primary-medium text-primary-white'}`}
                  onClick={() => setActivityFilter('paid')}
                >
                  Paid
                </button>
              </div>
              {activeProject.activities.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-primary-white">
                    <thead className="bg-primary-medium">
                      <tr>
                        <th className="px-4 py-2 text-left">Type</th>
                        <th className="px-4 py-2 text-left">Description</th>
                        <th className="px-4 py-2 text-left">Record Date</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Hours</th>
                        <th className="px-4 py-2 text-left">Total</th>
                        {user.isAdmin && <th className="px-4 py-2 text-left">Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {activeProject.activities
                        .slice()
                        .sort((a, b) => {
                          const dateA = a.startTime ? new Date(a.startTime).getTime() : 0;
                          const dateB = b.startTime ? new Date(b.startTime).getTime() : 0;
                          return dateB - dateA;
                        })
                        .filter(a => {
                          if (activityFilter === 'all') return true;
                          if (activityFilter === 'paid') return a.status === 'DONE_PAID';
                          if (activityFilter === 'unpaid') return ['NEW', 'UNDER_DEVELOPMENT', 'DONE_UNPAID'].includes(a.status);
                          return true;
                        })
                        .map((a) => (
                          <tr key={a.id} className="border-b border-primary-medium hover:bg-primary-medium/40">
                            <td className="px-4 py-2 align-top font-semibold">{typeLabels[a.type] || a.type}</td>
                            <td className="px-4 py-2 align-top">{a.description}</td>
                            <td className="px-4 py-2 align-top">{a.startTime ? new Date(a.startTime).toISOString().slice(0, 10) : '-'}</td>
                            <td className="px-4 py-2 align-top flex items-center gap-1">
                              {statusLabels[a.status] || a.status}
                              {a.status === 'DONE_PAID' ? (
                                <FaDollarSign className="text-green-500 ml-1" title="Paid" />
                              ) : (
                                <FaDollarSign className="text-red-500 ml-1" title="Unpaid" />
                              )}
                            </td>
                            <td className="px-4 py-2 align-top">{a.hoursWorked}</td>
                            <td className="px-4 py-2 align-top">{hufFormatter.format(a.totalCost || 0)}</td>
                            {user.isAdmin && (
                              <td className="px-4 py-2 align-top">
                                <div className="flex gap-3">
                                  <button className="p-2 rounded bg-primary-light text-primary-dark font-semibold hover:bg-opacity-80 transition text-base" onClick={() => openEditActivityModal(activeProject.id, a)} aria-label="Edit">
                                    <FaCog />
                                  </button>
                                  {a.status !== 'DONE_PAID' && (
                                    <button className="p-2 rounded bg-green-500 text-white font-semibold hover:bg-green-600 transition text-base" onClick={() => markActivityAsPaid(a.id)} aria-label="Mark as Paid">
                                      <FaDollarSign />
                                    </button>
                                  )}
                                  <button className="p-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition text-base" onClick={() => handleDeleteActivity(a.id)} aria-label="Delete">
                                    <FaTrash />
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <span className="text-gray-400">No activities</span>
              )}
            </div>
          ) : (
            <div className="text-primary-white">No project selected.</div>
          )}
          {activeProject && user.isAdmin && (
            <div className="text-right mt-4">
              <button className="text-xs text-red-400 hover:text-red-600 underline" onClick={() => { if (confirm('Are you sure you want to delete this project?')) handleDeleteProject(activeProject.id); }}>
                Delete project
              </button>
            </div>
          )}
        </>
      )}

      {/* Project Modal */}
      {showProjectModal && user.isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-primary-dark rounded-lg shadow-lg w-full max-w-md mx-auto">
            <form onSubmit={handleProjectSubmit} className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-lg font-bold text-primary-light">{modalMode === 'create' ? 'Add Project' : 'Edit Project'}</h5>
                <button type="button" className="text-primary-white hover:text-primary-light text-2xl font-bold" onClick={() => setShowProjectModal(false)}>&times;</button>
              </div>
              <div>
                <label className="block text-primary-white mb-1">Title</label>
                <input type="text" className="w-full px-3 py-2 rounded bg-primary-medium text-primary-white focus:outline-none focus:ring-2 focus:ring-primary-light" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-primary-white mb-1">Description</label>
                <textarea className="w-full px-3 py-2 rounded bg-primary-medium text-primary-white focus:outline-none focus:ring-2 focus:ring-primary-light" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-primary-white mb-1">Status</label>
                <select className="w-full px-3 py-2 rounded bg-primary-medium text-primary-white focus:outline-none focus:ring-2 focus:ring-primary-light" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as 'OPEN' | 'CLOSED' }))} required>
                  <option value="OPEN">Open</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
              {user.isAdmin && (
                <div>
                  <label className="block text-primary-white mb-1">Client</label>
                  <select className="w-full px-3 py-2 rounded bg-primary-medium text-primary-white focus:outline-none focus:ring-2 focus:ring-primary-light" value={form.userId} onChange={e => setForm(f => ({ ...f, userId: e.target.value }))} required>
                    <option value="">Select client</option>
                    {nonAdminUsers.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex justify-end gap-2">
                {modalMode === 'edit' && (
                  <button type="button" className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition" onClick={() => { if (confirm('Are you sure you want to delete this project?')) handleDeleteProject(selectedProject?.id!); }}>Delete</button>
                )}
                <button type="button" className="px-4 py-2 rounded bg-gray-600 text-white font-semibold hover:bg-gray-700 transition" onClick={() => setShowProjectModal(false)}>Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-primary-light text-primary-dark font-semibold hover:bg-opacity-80 transition">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Activity Modal */}
      {showActivityModal && user.isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-primary-dark rounded-lg shadow-lg w-full max-w-md mx-auto">
            <form onSubmit={handleActivitySubmit} className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-lg font-bold text-primary-light">{activityModalMode === 'create' ? 'Add Activity' : 'Edit Activity'}</h5>
                <button type="button" className="text-primary-white hover:text-primary-light text-2xl font-bold" onClick={() => setShowActivityModal(false)}>&times;</button>
              </div>
              <div>
                <label className="block text-primary-white mb-1">Type</label>
                <select className="w-full px-3 py-2 rounded bg-primary-medium text-primary-white focus:outline-none focus:ring-2 focus:ring-primary-light" value={activityForm.type} onChange={e => setActivityForm(f => ({ ...f, type: e.target.value }))} required>
                  <option value="CONSULTATION">Consultation</option>
                  <option value="TASK">Task</option>
                </select>
              </div>
              <div>
                <label className="block text-primary-white mb-1">Description</label>
                <textarea className="w-full px-3 py-2 rounded bg-primary-medium text-primary-white focus:outline-none focus:ring-2 focus:ring-primary-light" value={activityForm.description} onChange={e => setActivityForm(f => ({ ...f, description: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-primary-white mb-1">Status</label>
                <select className="w-full px-3 py-2 rounded bg-primary-medium text-primary-white focus:outline-none focus:ring-2 focus:ring-primary-light" value={activityForm.status} onChange={e => setActivityForm(f => ({ ...f, status: e.target.value }))} required>
                  <option value="NEW">New</option>
                  <option value="UNDER_DEVELOPMENT">Under Development</option>
                  <option value="DONE_UNPAID">Done (Unpaid)</option>
                  <option value="DONE_PAID">Done (Paid)</option>
                </select>
              </div>
              <div>
                <label className="block text-primary-white mb-1">Start Time</label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 rounded bg-primary-medium text-primary-white focus:outline-none focus:ring-2 focus:ring-primary-light"
                  value={activityForm.startTime}
                  onChange={e => {
                    const newStart = e.target.value;
                    setActivityForm(f => {
                      const end = f.endTime;
                      let hoursWorked = f.hoursWorked;
                      if (newStart && end) {
                        const startDate = new Date(newStart);
                        const endDate = new Date(end);
                        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && endDate > startDate) {
                          hoursWorked = Math.round(((endDate.getTime() - startDate.getTime()) / 1000 / 60 / 60) * 100) / 100;
                        } else {
                          hoursWorked = 0;
                        }
                      }
                      return { ...f, startTime: newStart, hoursWorked };
                    });
                  }}
                />
              </div>
              <div>
                <label className="block text-primary-white mb-1">End Time</label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 rounded bg-primary-medium text-primary-white focus:outline-none focus:ring-2 focus:ring-primary-light"
                  value={activityForm.endTime}
                  onChange={e => {
                    const newEnd = e.target.value;
                    setActivityForm(f => {
                      const start = f.startTime;
                      let hoursWorked = f.hoursWorked;
                      if (start && newEnd) {
                        const startDate = new Date(start);
                        const endDate = new Date(newEnd);
                        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && endDate > startDate) {
                          hoursWorked = Math.round(((endDate.getTime() - startDate.getTime()) / 1000 / 60 / 60) * 100) / 100;
                        } else {
                          hoursWorked = 0;
                        }
                      }
                      return { ...f, endTime: newEnd, hoursWorked };
                    });
                  }}
                />
              </div>
              <div>
                <label className="block text-primary-white mb-1">Hours Worked</label>
                <input
                  type="number"
                  disabled
                  className="w-full px-3 py-2 rounded bg-primary-medium text-primary-white focus:outline-none focus:ring-2 focus:ring-primary-light"
                  value={activityForm.hoursWorked}
                  onChange={e => setActivityForm(f => ({ ...f, hoursWorked: Number(e.target.value) }))}
                  min={0}
                  step={0.01}
                />
                <span className="text-xs text-primary-light">Calculated automatically from start and end date.</span>
              </div>
              <div>
                <label className="block text-primary-white mb-1">Hour Rate (HUF)</label>
                <input type="number" className="w-full px-3 py-2 rounded bg-primary-medium text-primary-white focus:outline-none focus:ring-2 focus:ring-primary-light" value={activityForm.hourRate} onChange={e => setActivityForm(f => ({ ...f, hourRate: Number(e.target.value) }))} min={0} required />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className="px-4 py-2 rounded bg-gray-600 text-white font-semibold hover:bg-gray-700 transition" onClick={() => setShowActivityModal(false)}>Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-primary-light text-primary-dark font-semibold hover:bg-opacity-80 transition">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
} 