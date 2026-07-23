'use client';

import { useState } from 'react';
import styles from '../officer/officer.module.css';

export default function ManagerDashboard() {
  return (
    <div className={styles.dashboardContainer} style={{ maxWidth: '1000px' }}>
      <header className={`glass-panel ${styles.header}`}>
        <div>
          <h1 className={styles.headerTitle}>Manager Panel</h1>
          <p className={styles.headerSubtitle}>Approve Ownership Papers</p>
        </div>
        <button className="btn btn-primary" onClick={() => window.location.href='/login'}>Logout</button>
      </header>

      <main className="animate-fade-in">
        <div className={`glass-panel ${styles.contentPanel}`}>
          <h2 className={styles.panelTitle}>Pending Approvals</h2>
          
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Req ID</th>
                  <th>Vehicle Code</th>
                  <th>Officer</th>
                  <th>Submitted</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    No pending requisitions in your territory.
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
