import React from 'react';
import { CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';

const Brand = ({ to = '/', compact = false, onClick }) => (
  <Link to={to} className={`brand ${compact ? 'brand-compact' : ''}`} onClick={onClick} aria-label="Festivio home">
    <span className="brand-mark" aria-hidden="true"><CalendarDays size={18} /></span>
    <span className="brand-wordmark">Festivio</span>
  </Link>
);

export default Brand;
