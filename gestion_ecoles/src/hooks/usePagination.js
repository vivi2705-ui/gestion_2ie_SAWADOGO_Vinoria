// src/hooks/usePagination.js
import { useState, useCallback } from 'react';

export const usePagination = (initialPage = 1, initialItemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(initialItemsPerPage);

  const updatePagination = useCallback((total, page, itemsPerPageValue) => {
    const pages = Math.ceil(total / (itemsPerPageValue || itemsPerPage));
    setTotalPages(pages);
    setTotalItems(total);
    setCurrentPage(page);
  }, [itemsPerPage]);

  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      return true;
    }
    return false;
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      return true;
    }
    return false;
  }, [currentPage, totalPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      return true;
    }
    return false;
  }, [currentPage]);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
    setTotalPages(1);
    setTotalItems(0);
  }, []);

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    updatePagination,
    goToPage,
    nextPage,
    prevPage,
    resetPagination
  };
};