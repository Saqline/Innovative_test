import React, { useState } from 'react';
import { useTable, useSortBy, useGlobalFilter, usePagination, useExpanded } from 'react-table'; // Import useExpanded

// Define a default sub-component renderer
const defaultSubRowComponent = () => null;

const DataTable = ({ 
  columns, 
  data, 
  title, 
  filterPlaceholder, 
  renderRowSubComponent = defaultSubRowComponent, 
  getRowCanExpand = () => false,
  onRowClick = () => {} // Add prop for row click handler
}) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    setGlobalFilter,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
     },
     useGlobalFilter,
     useSortBy,
     useExpanded, // Correct order: useExpanded before usePagination
     usePagination 
   );
 
  const { pageIndex, pageSize, visibleColumns } = state; // Add visibleColumns

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value || '';
    setGlobalFilter(value);
    setGlobalFilterValue(value);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <div className="mt-3 md:mt-0 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="bi bi-search text-gray-400"></i>
            </div>
            <input
              type="text"
              value={globalFilterValue}
              onChange={handleSearchChange}
              placeholder={filterPlaceholder || "Search..."}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      {column.render('Header')}
                      <span>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <i className="bi bi-caret-down-fill ml-1"></i>
                          ) : (
                            <i className="bi bi-caret-up-fill ml-1"></i>
                          )
                        ) : (
                          <i className="bi bi-arrow-down-up ml-1 opacity-30"></i>
                        )}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
            {page.length > 0 ? (
              page.map((row, i) => {
                prepareRow(row);
                return (
                  // Use React.Fragment to wrap the main row and the potential sub-row
                  <React.Fragment key={`row-frag-${i}`}>
                    <tr 
                      {...row.getRowProps()} 
                      className="hover:bg-gray-50 cursor-pointer" // Add cursor-pointer
                      onClick={() => onRowClick(row)} // Attach onClick handler
                    >
                      {row.cells.map((cell, j) => {
                        return (
                          <td
                            key={`cell-${i}-${j}`}
                            {...cell.getCellProps()}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                          >
                            {cell.render('Cell')}
                          </td>
                        );
                      })}
                    </tr>
                    {/* Render the sub-component if the row is expanded */}
                    {row.isExpanded && getRowCanExpand(row) ? (
                      <tr className="bg-gray-50"> {/* Optional: Add styling for sub-row */}
                        <td colSpan={visibleColumns.length} className="p-2"> {/* Adjust padding */}
                          {/* Call the render prop */}
                          {renderRowSubComponent({ row })}
                        </td>
                      </tr>
                    ) : null}
                  </React.Fragment>
                );
              })
            ) : (
            <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              !canPreviousPage
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              !canNextPage
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{pageIndex * pageSize + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min((pageIndex + 1) * pageSize, data.length)}
              </span>{' '}
              of <span className="font-medium">{data.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                  !canPreviousPage
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">First</span>
                <i className="bi bi-chevron-double-left"></i>
              </button>
              <button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                  !canPreviousPage
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">Previous</span>
                <i className="bi bi-chevron-left"></i>
              </button>
              
              {/* Page numbers */}
              {Array.from(
                { length: Math.min(5, pageOptions.length) },
                (_, i) => {
                  const pageNum = pageIndex - 2 + i;
                  if (pageNum >= 0 && pageNum < pageOptions.length) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => gotoPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border ${
                          pageNum === pageIndex
                            ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        } text-sm font-medium`}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  }
                  return null;
                }
              ).filter(Boolean)}
              
              <button
                onClick={() => nextPage()}
                disabled={!canNextPage}
                className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                  !canNextPage
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">Next</span>
                <i className="bi bi-chevron-right"></i>
              </button>
              <button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                  !canNextPage
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">Last</span>
                <i className="bi bi-chevron-double-right"></i>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
