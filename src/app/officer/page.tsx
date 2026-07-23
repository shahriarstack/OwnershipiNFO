'use client';

import { useState } from 'react';
import styles from './officer.module.css';

export default function OfficerDashboard() {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className={styles.dashboardContainer}>
      <header className={`glass-panel ${styles.header}`}>
        <div>
          <h1 className={styles.headerTitle}>Field Force Panel</h1>
          <p className={styles.headerSubtitle}>Welcome back, Officer</p>
        </div>
        <button className="btn btn-primary" onClick={() => window.location.href='/login'}>Logout</button>
      </header>

      <nav className={styles.navTabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'search' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('search')}
        >
          Search Vehicle
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'history' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('history')}
        >
          My Requisitions
        </button>
      </nav>

      <main className="animate-fade-in">
        {activeTab === 'search' && (
          <div className={`glass-panel ${styles.contentPanel}`}>
            <h2 className={styles.panelTitle}>Find a Vehicle</h2>
            <div className="input-group">
              <input 
                type="text" 
                className="input-field" 
                placeholder="Enter Customer Code (e.g. S-12345)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }}>
              Search Database
            </button>
            
            {/* Search Results Placeholder */}
            <div className={styles.resultsArea}>
              <p className={styles.emptyState}>Enter a code to search.</p>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className={`glass-panel ${styles.contentPanel}`}>
            <h2 className={styles.panelTitle}>Recent Requisitions</h2>
            <div className={styles.historyList}>
              <div className={styles.historyCard}>
                <div className={styles.historyHeader}>
                  <span className={styles.reqId}>REQ-10024</span>
                  <span className={`${styles.statusBadge} ${styles.statusPending}`}>Pending</span>
                </div>
                <p className={styles.vehicleCode}>S-12345</p>
                <p className={styles.date}>Submitted: Oct 24, 2023</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
