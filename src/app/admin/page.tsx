'use client';

import styles from '../officer/officer.module.css';

export default function AdminDashboard() {
  return (
    <div className={styles.dashboardContainer} style={{ maxWidth: '1200px' }}>
      <header className={`glass-panel ${styles.header}`}>
        <div>
          <h1 className={styles.headerTitle}>Admin Dashboard</h1>
          <p className={styles.headerSubtitle}>System Overview & Final Processing</p>
        </div>
        <button className="btn btn-primary" onClick={() => window.location.href='/login'}>Logout</button>
      </header>

      <main className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className={`glass-panel ${styles.contentPanel}`}>
          <h2 className={styles.panelTitle}>Quick Stats</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '8px', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Pending Processing</p>
              <h3 style={{ fontSize: '2rem', color: 'var(--primary-color)' }}>0</h3>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Processed Today</p>
              <h3 style={{ fontSize: '2rem', color: 'var(--success-color)' }}>0</h3>
            </div>
          </div>
        </div>

        <div className={`glass-panel ${styles.contentPanel}`} style={{ gridColumn: 'span 2' }}>
          <h2 className={styles.panelTitle}>Processing Queue</h2>
          
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Req ID</th>
                  <th>Vehicle Code</th>
                  <th>Manager Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    Queue is empty.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <style jsx>{`
        .table-responsive {
          overflow-x: auto;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .data-table th {
          padding: 1rem;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-secondary);
          font-weight: 500;
        }
        .data-table td {
          padding: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
}
