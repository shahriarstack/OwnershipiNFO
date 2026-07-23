'use client';

import { useState, useEffect } from 'react';
import styles from '../officer/officer.module.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'csv'>('overview');
  const [stats, setStats] = useState({ usersCount: 0, vehiclesCount: 0, requisitionsCount: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // User Form State
  const [staffId, setStaffId] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('FIELD_FORCE');
  const [territory, setTerritory] = useState('');
  const [areaCode, setAreaCode] = useState('');

  // CSV Import State
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchStats();
    if (activeTab === 'users') fetchUsers();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const res = await fetch('http://cv-acimotors.com/api.php?action=status');
      const data = await res.json();
      if (data.status === 'online') {
        setStats({
          usersCount: data.usersCount || 0,
          vehiclesCount: data.vehiclesCount || 0,
          requisitionsCount: data.requisitionsCount || 0,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://cv-acimotors.com/api.php?action=users');
      const data = await res.json();
      if (data.status === 'success') {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await fetch('http://cv-acimotors.com/api.php?action=users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId, name, password, role, territory, areaCode }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setMsg({ text: data.message, type: 'success' });
        setStaffId('');
        setName('');
        setPassword('');
        setTerritory('');
        setAreaCode('');
        fetchUsers();
        fetchStats();
      } else {
        setMsg({ text: data.message || 'Save failed', type: 'error' });
      }
    } catch (err) {
      setMsg({ text: 'Error connecting to server', type: 'error' });
    }
  };

  const handleDeleteUser = async (targetStaffId: string) => {
    if (!confirm(`Are you sure you want to delete user ${targetStaffId}?`)) return;
    try {
      const res = await fetch(`http://cv-acimotors.com/api.php?action=users&delete=${targetStaffId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.status === 'success') {
        fetchUsers();
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // CSV Client-side Parser
  const handleCsvUpload = async () => {
    if (!csvFile) return;
    setUploading(true);
    setMsg(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim().length > 0);
        if (lines.length < 2) {
          setMsg({ text: 'CSV file is empty or missing headers.', type: 'error' });
          setUploading(false);
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        const rows = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
          const rowObj: any = {};
          headers.forEach((h, i) => {
            rowObj[h] = values[i] || '';
          });
          return rowObj;
        });

        const res = await fetch('http://cv-acimotors.com/api.php?action=upload_csv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rows }),
        });

        const data = await res.json();
        if (data.status === 'success') {
          setMsg({ text: `Successfully imported ${data.imported} vehicle records!`, type: 'success' });
          setCsvFile(null);
          fetchStats();
        } else {
          setMsg({ text: data.message || 'Import failed.', type: 'error' });
        }
      } catch (err) {
        setMsg({ text: 'Error parsing CSV file.', type: 'error' });
      } finally {
        setUploading(false);
      }
    };
    reader.readAsText(csvFile);
  };

  // CSV Export Trigger
  const handleExport = async (type: 'vehicles' | 'requisitions') => {
    try {
      const res = await fetch(`http://cv-acimotors.com/api.php?action=export_csv&type=${type}`);
      const data = await res.json();
      if (data.status === 'success' && data.data) {
        const items = data.data;
        if (items.length === 0) {
          alert('No data available to export.');
          return;
        }
        const keys = Object.keys(items[0]);
        const csvRows = [
          keys.join(','),
          ...items.map((row: any) => keys.map(k => `"${(row[k] || '').toString().replace(/"/g, '""')}"`).join(','))
        ];
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}_export_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
      }
    } catch (err) {
      alert('Export failed.');
    }
  };

  return (
    <div className={styles.dashboardContainer} style={{ maxWidth: '1200px' }}>
      <header className={`glass-panel ${styles.header}`}>
        <div>
          <h1 className={styles.headerTitle}>Super Admin Panel</h1>
          <p className={styles.headerSubtitle}>Centralized System & Data Management</p>
        </div>
        <button className="btn btn-primary" onClick={() => window.location.href='/login'}>Logout</button>
      </header>

      <nav className={styles.navTabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'overview' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview & Stats
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'users' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'csv' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('csv')}
        >
          CSV Import / Export
        </button>
      </nav>

      {msg && (
        <div style={{
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          backgroundColor: msg.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: msg.type === 'success' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
          color: msg.type === 'success' ? '#4ade80' : '#fca5a5'
        }}>
          {msg.text}
        </div>
      )}

      <main className="animate-fade-in">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div className={`glass-panel ${styles.contentPanel}`}>
              <h2 className={styles.panelTitle}>Total System Users</h2>
              <h3 style={{ fontSize: '2.5rem', color: 'var(--primary-color)' }}>{stats.usersCount}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Active Staff & Officers</p>
            </div>
            <div className={`glass-panel ${styles.contentPanel}`}>
              <h2 className={styles.panelTitle}>Vehicles Registered</h2>
              <h3 style={{ fontSize: '2.5rem', color: 'var(--success-color)' }}>{stats.vehiclesCount}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Ownership Paper Database</p>
            </div>
            <div className={`glass-panel ${styles.contentPanel}`}>
              <h2 className={styles.panelTitle}>Total Requisitions</h2>
              <h3 style={{ fontSize: '2.5rem', color: 'var(--warning-color)' }}>{stats.requisitionsCount}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Transfer Applications</p>
            </div>
          </div>
        )}

        {/* USER MANAGEMENT TAB */}
        {activeTab === 'users' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
            {/* Create/Edit Form */}
            <div className={`glass-panel ${styles.contentPanel}`}>
              <h2 className={styles.panelTitle}>Add / Update User</h2>
              <form onSubmit={handleSaveUser}>
                <div className="input-group">
                  <label className="input-label">Staff ID</label>
                  <input type="text" className="input-field" placeholder="e.g. FF02" value={staffId} onChange={e => setStaffId(e.target.value)} required />
                </div>
                <div className="input-group">
                  <label className="input-label">Full Name</label>
                  <input type="text" className="input-field" placeholder="e.g. John Doe" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="input-group">
                  <label className="input-label">Password</label>
                  <input type="password" className="input-field" placeholder="Leave blank to keep current" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label">Role</label>
                  <select className="input-field" value={role} onChange={e => setRole(e.target.value)}>
                    <option value="FIELD_FORCE">Field Force</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Super Admin</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Territory Name</label>
                  <input type="text" className="input-field" placeholder="e.g. Dhaka, Sylhet" value={territory} onChange={e => setTerritory(e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label">Area Code Prefix</label>
                  <input type="text" className="input-field" placeholder="e.g. D,S" value={areaCode} onChange={e => setAreaCode(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Save User Account
                </button>
              </form>
            </div>

            {/* User List Table */}
            <div className={`glass-panel ${styles.contentPanel}`}>
              <h2 className={styles.panelTitle}>Registered Users List</h2>
              {loading ? (
                <p>Loading users...</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                        <th style={{ padding: '0.75rem' }}>Staff ID</th>
                        <th style={{ padding: '0.75rem' }}>Name</th>
                        <th style={{ padding: '0.75rem' }}>Role</th>
                        <th style={{ padding: '0.75rem' }}>Area Code</th>
                        <th style={{ padding: '0.75rem' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--text-accent)' }}>{u.staffId}</td>
                          <td style={{ padding: '0.75rem' }}>{u.name}</td>
                          <td style={{ padding: '0.75rem' }}>{u.role}</td>
                          <td style={{ padding: '0.75rem' }}>{u.areaCode || '-'}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <button 
                              onClick={() => {
                                setStaffId(u.staffId);
                                setName(u.name);
                                setRole(u.role);
                                setTerritory(u.territory || '');
                                setAreaCode(u.areaCode || '');
                              }} 
                              style={{ marginRight: '0.5rem', background: 'none', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(u.staffId)} 
                              style={{ background: 'none', border: '1px solid var(--danger-color)', color: 'var(--danger-color)', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CSV IMPORT / EXPORT TAB */}
        {activeTab === 'csv' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Bulk Upload Section */}
            <div className={`glass-panel ${styles.contentPanel}`}>
              <h2 className={styles.panelTitle}>📥 Bulk Import CSV Data</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Upload a `.csv` file containing vehicle records. Required columns: <code>Code</code>, <code>CustomerName</code>, <code>RegistrationNo</code>, <code>EngineNo</code>, <code>ChassisNo</code>, <code>Status</code>.
              </p>
              <div className="input-group">
                <input 
                  type="file" 
                  accept=".csv" 
                  className="input-field" 
                  onChange={e => setCsvFile(e.target.files ? e.target.files[0] : null)}
                />
              </div>
              <button 
                onClick={handleCsvUpload} 
                disabled={!csvFile || uploading} 
                className="btn btn-primary" 
                style={{ width: '100%' }}
              >
                {uploading ? 'Processing CSV...' : 'Upload & Sync to cPanel DB'}
              </button>
            </div>

            {/* Export Section */}
            <div className={`glass-panel ${styles.contentPanel}`}>
              <h2 className={styles.panelTitle}>📤 Export Data as CSV</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Download full data reports directly from cPanel MySQL in standard CSV format.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button 
                  onClick={() => handleExport('vehicles')} 
                  className="btn btn-primary"
                  style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}
                >
                  Export Registered Vehicles CSV
                </button>
                <button 
                  onClick={() => handleExport('requisitions')} 
                  className="btn btn-primary"
                  style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' }}
                >
                  Export Transfer Requisitions CSV
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
