import { useState, useMemo, useCallback } from 'react';

interface UsePaginationProps<T> {
  data: T[];
  defaultPageSize?: number;
}

interface UsePaginationResult<T> {
  paginatedData: T[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
}

export function usePagination<T>({
  data,
  defaultPageSize = 10,
}: UsePaginationProps<T>): UsePaginationResult<T> {
  const [pageState, setPageState] = useState({ page: 1, size: defaultPageSize });

  const totalItems = data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageState.size));

  // Clamp current page to valid range
  const currentPage = Math.min(Math.max(1, pageState.page), totalPages);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageState.size;
    const endIndex = startIndex + pageState.size;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, pageState.size]);

  const setPage = useCallback((page: number) => {
    setPageState((prev) => ({ ...prev, page }));
  }, []);

  const setPageSize = useCallback((size: number) => {
    setPageState({ page: 1, size }); // Reset to page 1 when size changes
  }, []);

  const goToFirstPage = useCallback(() => {
    setPageState((prev) => ({ ...prev, page: 1 }));
  }, []);

  const goToLastPage = useCallback(() => {
    setPageState((prev) => ({ ...prev, page: totalPages }));
  }, [totalPages]);

  return {
    paginatedData,
    currentPage,
    pageSize: pageState.size,
    totalPages,
    totalItems,
    setPage,
    setPageSize,
    goToFirstPage,
    goToLastPage,
  };
}
