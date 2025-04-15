import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import DataTable from '../../components/admin/DataTable';
import { 
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory 
} from '../../services/api/categories';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    total: 0
  });

  // Table columns
  const columns = [
    {
      Header: 'Name',
      accessor: 'name'
    },
    {
      Header: 'Created At',
      accessor: 'created_at',
      Cell: ({ value }) => new Date(value).toLocaleDateString()
    },
    {
      Header: 'Actions',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row.original)}
            className="text-primary-600 hover:text-primary-900"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(row.original)}
            className="text-red-600 hover:text-red-900"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  // Fetch categories
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategories(pagination.page, pagination.size);
      setCategories(data.items);
      setPagination(prev => ({
        ...prev,
        total: data.total
      }));
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to load categories: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page, pagination.size]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Handle add new category
  const handleAddNew = () => {
    setCurrentCategory({
      id: null,
      name: ''
    });
    setIsModalOpen(true);
  };

  // Handle edit category
  const handleEdit = (category) => {
    setCurrentCategory(category);
    setIsModalOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    
    try {
      await deleteCategory(categoryToDelete.id);
      toast.success(`Category "${categoryToDelete.name}" deleted`);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      fetchData(); // Refresh data
    } catch (err) {
      toast.error(`Failed to delete category: ${err.message}`);
    }
  };

  // Handle form submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!currentCategory?.name) {
      toast.error('Category name is required');
      return;
    }

    try {
      if (currentCategory.id) {
        // Update existing
        await updateCategory(currentCategory.id, { name: currentCategory.name });
        toast.success('Category updated');
      } else {
        // Create new
        await createCategory({ name: currentCategory.name });
        toast.success('Category created');
      }
      setIsModalOpen(false);
      setCurrentCategory(null);
      fetchData(); // Refresh data
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setCurrentCategory({
      ...currentCategory,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return <div className="text-center py-10">Loading categories...</div>;
  if (error) return <div className="text-center py-10 text-red-600">Error: {error}</div>;

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
          <p className="text-gray-600">Manage product categories</p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          Add New Category
        </button>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        title="Categories"
        filterPlaceholder="Search categories..."
        currentPage={pagination.page}
        pageSize={pagination.size}
        totalItems={pagination.total}
        onPageChange={handlePageChange}
      />

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {currentCategory?.id ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={currentCategory?.name || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded"
                >
                  {currentCategory?.id ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Delete Category</h2>
            <p className="mb-6">
              Are you sure you want to delete "{categoryToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
