import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { createClient } from '@supabase/supabase-js';

// ============================================
// SUPABASE CONFIGURATION
// ============================================
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function AdminDashboard() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCity, setFilterCity] = useState('');
  const [stats, setStats] = useState({ total: 0, newCount: 0, contacted: 0, converted: 0, highValue: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchLeads();
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchLeads();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    setError('');
    setLoading(true);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setError('Check your email for confirmation link!');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setLeads([]);
  };

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setLeads(data);
      calculateStats(data);
    }
    setLoading(false);
  };

  const calculateStats = (leadsData) => {
    const highValueCategories = ['₹50 Lakhs - 1 Crore', 'Above ₹1 Crore'];
    setStats({
      total: leadsData.length,
      newCount: leadsData.filter(l => l.status === 'new').length,
      contacted: leadsData.filter(l => l.status === 'contacted').length,
      converted: leadsData.filter(l => l.status === 'converted').length,
      highValue: leadsData.filter(l => highValueCategories.includes(l.income_category)).length
    });
  };

  const updateLeadStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus, last_contacted: new Date().toISOString() })
      .eq('id', id);

    if (!error) {
      fetchLeads();
    }
  };

  const deleteLead = async (id) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (!error) {
      fetchLeads();
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Mobile', 'Email', 'Portfolio Interest', 'Income Category', 'City', 'Reference', 'Status', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...filteredLeads.map(l => [
        `"${l.name}"`,
        l.mobile,
        l.email,
        `"${l.portfolio_interest}"`,
        `"${l.income_category}"`,
        l.city,
        l.reference || '',
        l.status,
        new Date(l.created_at).toLocaleDateString('en-IN')
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mirai-leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredLeads = leads.filter(lead => {
    const statusMatch = filterStatus === 'all' || lead.status === filterStatus;
    const cityMatch = !filterCity || lead.city?.toLowerCase().includes(filterCity.toLowerCase());
    return statusMatch && cityMatch;
  });

  if (!mounted) {
    return null;
  }

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#0a0f1a',
      color: '#e8e6e1',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '2rem'
    },
    card: {
      background: 'linear-gradient(135deg, #0d1421, #0a0f1a)',
      border: '1px solid rgba(201, 162, 39, 0.3)',
      borderRadius: '12px',
      padding: '2rem',
      marginBottom: '1.5rem'
    },
    heading: {
      color: '#c9a227',
      marginBottom: '1.5rem',
      fontWeight: 500
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(201, 162, 39, 0.3)',
      borderRadius: '8px',
      color: '#e8e6e1',
      marginBottom: '1rem',
      fontSize: '1rem'
    },
    button: {
      padding: '0.75rem 1.5rem',
      background: '#c9a227',
      border: 'none',
      borderRadius: '8px',
      color: '#0a0f1a',
      fontWeight: 500,
      cursor: 'pointer',
      marginRight: '0.5rem'
    },
    buttonSecondary: {
      padding: '0.75rem 1.5rem',
      background: 'transparent',
      border: '1px solid #c9a227',
      borderRadius: '8px',
      color: '#c9a227',
      cursor: 'pointer'
    },
    statBox: {
      background: 'rgba(201, 162, 39, 0.1)',
      padding: '1.5rem',
      borderRadius: '10px',
      textAlign: 'center'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '0.9rem'
    },
    th: {
      padding: '1rem 0.5rem',
      textAlign: 'left',
      color: '#c9a227',
      borderBottom: '1px solid rgba(201, 162, 39, 0.3)',
      fontWeight: 400
    },
    td: {
      padding: '0.75rem 0.5rem',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      color: '#a0a0a0'
    },
    select: {
      padding: '0.5rem',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(201, 162, 39, 0.3)',
      borderRadius: '5px',
      color: '#e8e6e1',
      fontSize: '0.8rem'
    }
  };

  // Login Screen
  if (!session) {
    return (
      <>
        <Head>
          <title>Admin | Mirai Investment</title>
        </Head>
        <div style={styles.container}>
          <div style={{ maxWidth: '400px', margin: '0 auto', paddingTop: '10vh' }}>
            <div style={styles.card}>
              <h1 style={{ ...styles.heading, textAlign: 'center', fontSize: '1.5rem' }}>
                <span style={{ color: '#c9a227' }}>M</span>IRAI Admin
              </h1>
              <p style={{ color: '#666', textAlign: 'center', marginBottom: '2rem' }}>
                Sign in to manage your leads
              </p>
              
              {error && (
                <p style={{ 
                  color: error.includes('Check your email') ? '#22c55e' : '#ef4444', 
                  marginBottom: '1rem',
                  padding: '0.5rem',
                  background: error.includes('Check your email') ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                  borderRadius: '5px',
                  textAlign: 'center'
                }}>
                  {error}
                </p>
              )}
              
              <form onSubmit={handleLogin}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  required
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="submit" style={{ ...styles.button, flex: 1 }} disabled={loading}>
                    {loading ? 'Loading...' : 'Sign In'}
                  </button>
                  <button type="button" onClick={handleSignUp} style={{ ...styles.buttonSecondary, flex: 1 }}>
                    Sign Up
                  </button>
                </div>
              </form>
              
              <p style={{ color: '#555', fontSize: '0.8rem', textAlign: 'center', marginTop: '1.5rem' }}>
                First time? Click Sign Up to create admin account
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Dashboard
  return (
    <>
      <Head>
        <title>Lead Dashboard | Mirai Investment</title>
      </Head>
      <div style={styles.container}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h1 style={{ ...styles.heading, marginBottom: 0 }}>
              <span style={{ color: '#c9a227' }}>M</span>IRAI Lead Dashboard
            </h1>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ color: '#666', fontSize: '0.85rem' }}>{session.user.email}</span>
              <button onClick={handleLogout} style={styles.buttonSecondary}>
                Logout
              </button>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { label: 'Total Leads', value: stats.total, color: '#c9a227' },
              { label: 'New', value: stats.newCount, color: '#60a5fa' },
              { label: 'Contacted', value: stats.contacted, color: '#fbbf24' },
              { label: 'Converted', value: stats.converted, color: '#22c55e' },
              { label: 'High Value', value: stats.highValue, color: '#a855f7' }
            ].map((stat, i) => (
              <div key={i} style={styles.statBox}>
                <p style={{ fontSize: '2rem', color: stat.color, margin: 0, fontWeight: 600 }}>{stat.value}</p>
                <p style={{ color: '#666', fontSize: '0.8rem', margin: 0 }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Filters & Actions */}
          <div style={styles.card}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={styles.select}
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>
              
              <input
                type="text"
                placeholder="Filter by city..."
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                style={{ ...styles.input, width: '200px', marginBottom: 0 }}
              />
              
              <button onClick={fetchLeads} style={styles.buttonSecondary}>
                🔄 Refresh
              </button>
              
              <button onClick={exportToCSV} style={styles.button}>
                📥 Export CSV
              </button>
              
              <span style={{ color: '#666', marginLeft: 'auto' }}>
                Showing {filteredLeads.length} of {leads.length} leads
              </span>
            </div>
          </div>

          {/* Leads Table */}
          <div style={{ ...styles.card, overflowX: 'auto' }}>
            {loading ? (
              <p style={{ textAlign: 'center', color: '#666' }}>Loading leads...</p>
            ) : filteredLeads.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666' }}>No leads found</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Mobile</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Interest</th>
                    <th style={styles.th}>Income</th>
                    <th style={styles.th}>City</th>
                    <th style={styles.th}>Reference</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td style={{ ...styles.td, color: '#e8e6e1', fontWeight: 500 }}>{lead.name}</td>
                      <td style={styles.td}>
                        <a 
                          href={`https://wa.me/${lead.mobile?.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: '#25D366' }}
                        >
                          {lead.mobile}
                        </a>
                      </td>
                      <td style={styles.td}>{lead.email}</td>
                      <td style={styles.td}>{lead.portfolio_interest}</td>
                      <td style={styles.td}>
                        <span style={{
                          color: ['₹50 Lakhs - 1 Crore', 'Above ₹1 Crore'].includes(lead.income_category) 
                            ? '#a855f7' 
                            : '#a0a0a0'
                        }}>
                          {lead.income_category}
                        </span>
                      </td>
                      <td style={styles.td}>{lead.city}</td>
                      <td style={styles.td}>{lead.reference || '-'}</td>
                      <td style={styles.td}>
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          style={{ ...styles.select, background: 'transparent', border: 'none', padding: '0' }}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="converted">Converted</option>
                          <option value="lost">Lost</option>
                        </select>
                      </td>
                      <td style={{ ...styles.td, color: '#555' }}>
                        {new Date(lead.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td style={styles.td}>
                        <button
                          onClick={() => deleteLead(lead.id)}
                          style={{
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            color: '#ef4444',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.75rem'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
