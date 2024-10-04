const { apiConfig } = require('../apiConfig');

const get8BlogCategories = async () => {
    const path = 'category/top8blog';
    const response = await apiConfig.apiCaller('GET', path);
    return response;
};

const createCategory = async (values) => {
    const path = 'category';
    const response = await apiConfig.apiCaller('POST', path, values);
    return response;
};

const editCategory = async (values) => {
    const path = 'category';
    const response = await apiConfig.apiCaller('PATCH', path, values);
    return response;
};

const deleteCategory = async (values) => {
    const path = `category/${values}`;
    const response = await apiConfig.apiCaller('DELETE', path);
    return response;
};

const getCategory = async (values) => {
    const path = `category/${values}`;
    const response = await apiConfig.apiCaller('GET', path);
    return response;
};

const getCategoriesWithPagination = async (values) => {
    const path = `category/all?search_item=${values.searchItem}&page_index=${values.pageIndex}`;
    const response = await apiConfig.apiCaller('GET', path);
    return response;
};
const getCategories = async () => {
    const path = 'category/full';

    const reponse = await apiConfig.apiCaller('GET', path);
    return reponse;
};
const categoryApis = {
    createCategory,
    getCategoriesWithPagination,
    deleteCategory,
    getCategory,
    editCategory,
    get8BlogCategories,
    getCategories,
};
module.exports = categoryApis;
