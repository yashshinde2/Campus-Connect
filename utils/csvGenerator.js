const exportToCSV = (data, fields) => {
    if (!data || !data.length) return '';
    const header = fields.join(',') + '\n';
    const rows = data.map(row => {
        return fields.map(field => {
            const val = row[field] !== undefined ? String(row[field]).replace(/"/g, '""') : '';
            return `"${val}"`;
        }).join(',');
    }).join('\n');
    return header + rows;
};

module.exports = exportToCSV;
