// src/components/Pagination.jsx
import { useState, useEffect } from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage = 10,
  totalItems = 0,
  showInfo = true,
  maxVisible = 5,
  variant = 'dark' // 'dark' or 'light'
}) => {
  const [pageNumbers, setPageNumbers] = useState([]);

  useEffect(() => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    setPageNumbers(pages);
  }, [currentPage, totalPages, maxVisible]);

  const getStyles = () => {
    if (variant === 'light') {
      return {
        container: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          marginTop: '24px',
          padding: '16px',
          background: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          flexWrap: 'wrap'
        },
        button: {
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '13px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          border: 'none'
        },
        buttonActive: {
          background: '#3b82f6',
          color: '#fff',
          fontWeight: '600'
        },
        buttonInactive: {
          background: '#f1f5f9',
          color: '#64748b',
          border: '1px solid #e2e8f0'
        },
        buttonDisabled: {
          background: '#f1f5f9',
          color: '#94a3b8',
          cursor: 'not-allowed',
          opacity: 0.5,
          border: '1px solid #e2e8f0'
        },
        numberButton: {
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '13px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          background: '#ffffff',
          color: '#374151',
          border: '1px solid #e2e8f0'
        },
        numberButtonActive: {
          background: '#3b82f6',
          color: '#fff',
          border: 'none',
          fontWeight: '600'
        },
        infoText: {
          textAlign: 'center',
          color: '#64748b',
          fontSize: '12px',
          marginTop: '12px'
        },
        dots: {
          color: '#64748b',
          padding: '0 4px'
        }
      };
    }
    
    // Dark variant (default)
    return {
      container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        marginTop: '24px',
        padding: '16px',
        background: '#1a1a1a',
        borderRadius: '8px',
        border: '1px solid #2d2d2d',
        flexWrap: 'wrap'
      },
      button: {
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '13px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: 'none'
      },
      buttonActive: {
        background: '#3b82f6',
        color: '#fff',
        fontWeight: '600'
      },
      buttonInactive: {
        background: '#1a1a1a',
        color: '#e5e5e5',
        border: '1px solid #2d2d2d'
      },
      buttonDisabled: {
        background: '#2d2d2d',
        color: '#6b7280',
        cursor: 'not-allowed',
        opacity: 0.5,
        border: 'none'
      },
      numberButton: {
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '13px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        background: '#1a1a1a',
        color: '#e5e5e5',
        border: '1px solid #2d2d2d'
      },
      numberButtonActive: {
        background: '#3b82f6',
        color: '#fff',
        border: 'none',
        fontWeight: '600'
      },
      infoText: {
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: '12px',
        marginTop: '12px'
      },
      dots: {
        color: '#6b7280',
        padding: '0 4px'
      }
    };
  };

  const styles = getStyles();
  const total = Number(totalPages);
  const current = Number(currentPage);

  if (isNaN(total) || total <= 1) return null;

  const getDisplayRange = () => {
    if (!totalItems) return '0';
    const start = ((current - 1) * itemsPerPage) + 1;
    const end = Math.min(current * itemsPerPage, totalItems);
    if (isNaN(start) || isNaN(end)) return '0';
    return `${start} à ${end}`;
  };

  return (
    <div>
      <div style={styles.container}>
        {/* Previous button */}
        <button
          onClick={() => onPageChange(current - 1)}
          disabled={current === 1}
          style={{
            ...styles.button,
            ...(current === 1 ? styles.buttonDisabled : styles.buttonInactive)
          }}
        >
          ← Précédent
        </button>
        
        {/* First page */}
        {pageNumbers[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              style={styles.numberButton}
            >
              1
            </button>
            {pageNumbers[0] > 2 && <span style={styles.dots}>...</span>}
          </>
        )}
        
        {/* Page numbers */}
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            style={{
              ...styles.numberButton,
              ...(current === number ? styles.numberButtonActive : {})
            }}
          >
            {number}
          </button>
        ))}
        
        {/* Last page */}
        {pageNumbers[pageNumbers.length - 1] < total && (
          <>
            {pageNumbers[pageNumbers.length - 1] < total - 1 && <span style={styles.dots}>...</span>}
            <button
              onClick={() => onPageChange(total)}
              style={styles.numberButton}
            >
              {total}
            </button>
          </>
        )}
        
        {/* Next button */}
        <button
          onClick={() => onPageChange(current + 1)}
          disabled={current === total}
          style={{
            ...styles.button,
            ...(current === total ? styles.buttonDisabled : styles.buttonInactive)
          }}
        >
          Suivant →
        </button>
      </div>
      
      {/* Info text */}
      {showInfo && totalItems > 0 && (
        <div style={styles.infoText}>
          Affichage de {getDisplayRange()} sur {totalItems} éléments
        </div>
      )}
    </div>
  );
};

export default Pagination;