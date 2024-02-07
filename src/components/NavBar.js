import React from 'react';

const NavBar = ({ title }) => {
  return (
    <nav style={styles.navBar}>
      <div style={styles.logo}>{title}</div>
    </nav>
  );
};

const styles = {
  navBar: {
    backgroundColor: '#026aa7',
    padding: '10px',
    color: '#fff',
    textAlign: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
  },
};

export default NavBar;
