import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Calendar, LayoutDashboard, Plus, Trash2, CheckCircle, XCircle, Search } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [employees, setEmployees] = useState([]);
    const [stats, setStats] = useState({ totalEmployees: 0, presentToday: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [empRes, statsRes] = await Promise.all([
                axios.get(`${API_BASE}/employees`),
                axios.get(`${API_BASE}/dashboard/stats`)
            ]);
            setEmployees(empRes.data);
            setStats(statsRes.data);
            setError(null);
        } catch (err) {
            setError('Failed to connect to the server. Please ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <nav className="nav">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem', borderRadius: '8px' }}>
                        <Users size={24} />
                    </div>
                    <h2 style={{ margin: 0 }}>HRMS Lite</h2>
                </div>
                <div className="nav-links">
                    <span className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                        <LayoutDashboard size={18} /> Dashboard
                    </span>
                    <span className={`nav-link ${activeTab === 'employees' ? 'active' : ''}`} onClick={() => setActiveTab('employees')}>
                        <Users size={18} /> Employees
                    </span>
                    <span className={`nav-link ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>
                        <Calendar size={18} /> Attendance
                    </span>
                </div>
            </nav>

            <main className="container">
                {error && (
                    <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #fecaca' }}>
                        {error}
                    </div>
                )}

                {activeTab === 'dashboard' && <Dashboard stats={stats} employees={employees} />}
                {activeTab === 'employees' && <EmployeeManagement employees={employees} onRefresh={fetchData} />}
                {activeTab === 'attendance' && <AttendanceManagement employees={employees} onRefresh={fetchData} />}
            </main>
        </div>
    );
}

// Sub-components
function Dashboard({ stats, employees }) {
    return (
        <div>
            <h1>Dashboard Overview</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="card">
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Employees</p>
                    <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{stats.totalEmployees}</h2>
                    <div style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={16} /> Active Staff
                    </div>
                </div>
                <div className="card">
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Attendance Today</p>
                    <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{stats.presentToday}</h2>
                    <div style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle size={16} /> Present Now
                    </div>
                </div>
            </div>

            <h3>Recent Employees</h3>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>ID</th>
                            <th>Department</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.length === 0 ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>No employees found.</td></tr>
                        ) : (
                            employees.slice(-5).reverse().map(emp => (
                                <tr key={emp.id}>
                                    <td>{emp.fullName}</td>
                                    <td><code>{emp.employeeId}</code></td>
                                    <td>{emp.department}</td>
                                    <td><span className="badge badge-present">Active</span></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function EmployeeManagement({ employees, onRefresh }) {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ employeeId: '', fullName: '', email: '', department: '' });
    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post(`${API_BASE}/employees`, formData);
            setMsg({ type: 'success', text: 'Employee added successfully!' });
            setFormData({ employeeId: '', fullName: '', email: '', department: '' });
            setTimeout(() => setShowForm(false), 1500);
            onRefresh();
        } catch (err) {
            setMsg({ type: 'error', text: err.response?.data?.error || 'Failed to add employee' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this employee?')) return;
        try {
            await axios.delete(`${API_BASE}/employees/${id}`);
            onRefresh();
        } catch (err) {
            alert('Failed to delete employee');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Employees</h1>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    <Plus size={18} /> Add Employee
                </button>
            </div>

            {showForm && (
                <div className="card" style={{ marginBottom: '2rem', border: '2px solid var(--primary)' }}>
                    <h3>New Employee</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div>
                            <label>Employee ID</label>
                            <input value={formData.employeeId} onChange={e => setFormData({ ...formData, employeeId: e.target.value })} placeholder="EMP001" required />
                        </div>
                        <div>
                            <label>Full Name</label>
                            <input value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} placeholder="John Doe" required />
                        </div>
                        <div>
                            <label>Email Address</label>
                            <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" required />
                        </div>
                        <div>
                            <label>Department</label>
                            <select value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} required>
                                <option value="">Select Dept</option>
                                <option value="Engineering">Engineering</option>
                                <option value="HR">HR</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Sales">Sales</option>
                            </select>
                        </div>
                        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                            <button type="button" className="btn" onClick={() => setShowForm(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={submitting}>
                                {submitting ? 'Saving...' : 'Save Employee'}
                            </button>
                        </div>
                    </form>
                    {msg && <p style={{ marginTop: '1rem', color: msg.type === 'success' ? 'var(--success)' : 'var(--error)' }}>{msg.text}</p>}
                </div>
            )}

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>No employees found. Add one to get started.</td></tr>
                        ) : (
                            employees.map(emp => (
                                <tr key={emp.id}>
                                    <td><code>{emp.employeeId}</code></td>
                                    <td style={{ fontWeight: 600 }}>{emp.fullName}</td>
                                    <td>{emp.email}</td>
                                    <td>{emp.department}</td>
                                    <td>
                                        <button className="btn btn-danger" onClick={() => handleDelete(emp.id)}><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function AttendanceManagement({ employees, onRefresh }) {
    const [selectedEmp, setSelectedEmp] = useState(null);
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const today = new Date().toISOString().split('T')[0];

    const markAttendance = async (empId, status) => {
        try {
            await axios.post(`${API_BASE}/attendance`, {
                employeeId: empId,
                date: today,
                status: status
            });
            onRefresh();
            if (selectedEmp?.id === empId) fetchHistory(empId);
        } catch (err) {
            alert('Failed to mark attendance');
        }
    };

    const fetchHistory = async (empId) => {
        setLoadingHistory(true);
        try {
            const res = await axios.get(`${API_BASE}/attendance/${empId}`);
            setHistory(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingHistory(false);
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: selectedEmp ? '1fr 1fr' : '1fr', gap: '2rem' }}>
            <div>
                <h1>Daily Attendance</h1>
                <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Marking for: <strong>{new Date().toDateString()}</strong></p>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(emp => (
                                <tr key={emp.id} style={{ cursor: 'pointer', background: selectedEmp?.id === emp.id ? '#f1f5f9' : 'transparent' }} onClick={() => { setSelectedEmp(emp); fetchHistory(emp.id); }}>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{emp.fullName}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{emp.department}</div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }} onClick={e => e.stopPropagation()}>
                                            <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem' }} onClick={() => markAttendance(emp.id, 'Present')}>
                                                <CheckCircle size={14} /> Present
                                            </button>
                                            <button className="btn btn-danger" style={{ padding: '0.4rem 0.8rem' }} onClick={() => markAttendance(emp.id, 'Absent')}>
                                                <XCircle size={14} /> Absent
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedEmp && (
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <h3>History: {selectedEmp.fullName}</h3>
                        <button className="btn" style={{ padding: '0.2rem' }} onClick={() => setSelectedEmp(null)}><XCircle size={18} /></button>
                    </div>

                    {loadingHistory ? <p>Loading history...</p> : (
                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {history.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No records yet.</p> : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    {history.map(rec => (
                                        <div key={rec.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                                            <span>{rec.date}</span>
                                            <span className={`badge badge-${rec.status.toLowerCase()}`}>{rec.status}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
