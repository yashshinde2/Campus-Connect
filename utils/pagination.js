const getPagination = (page = 1, limit = 10, totalItems = 0) => {
    const currentPage = Math.max(1, parseInt(page));
    const totalPages = Math.ceil(totalItems / limit) || 1;
    const skip = (currentPage - 1) * limit;

    return {
        currentPage,
        totalPages,
        limit,
        skip,
        totalItems,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1
    };
};

module.exports = getPagination;
