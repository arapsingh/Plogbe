import React from 'react';
import { LeftOutlined, DoubleLeftOutlined, RightOutlined, DoubleRightOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const Pagination = ({ handleChangePageIndex, totalPage, currentPage }) => {
    const listItem = [];
    let startPage = Math.max(currentPage - 4, 1);
    let endPage = Math.min(currentPage + 5, totalPage);

    if (currentPage <= 5) {
        startPage = 1;
        endPage = Math.min(10, totalPage);
    } else if (currentPage + 5 >= totalPage) {
        startPage = Math.max(totalPage - 9, 1);
        endPage = totalPage;
    }
    for (let index = startPage; index <= endPage; index++) {
        listItem.push(
            <li
                key={index}
                onClick={() => handleChangePageIndex(index)}
                className={`flex items-center justify-center px-3 h-8 transition-all duration-300 hover:cursor-pointer leading-tight ${
                    index === currentPage
                        ? 'flex items-center justify-center px-4 h-10 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                        : 'flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                } `}
            >
                {index}
            </li>
        );
    }
    return (
        <>
            <nav aria-label="Page navigation example">
                <ul className="inline-flex -space-x-px text-sm">
                    <li
                        className="flex items-center justify-center px-3 h-8 ml-0 transition-all duration-300 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 hover:cursor-pointer dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        onClick={() => handleChangePageIndex(1)}
                    >
                        <DoubleLeftOutlined className="w-4 h-4" />
                    </li>
                    <li
                        className="flex items-center justify-center px-3 h-8 ml-0 transition-all duration-300 leading-tight text-gray-500 bg-white border border-gray-300  hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 hover:cursor-pointer dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        onClick={() => handleChangePageIndex(currentPage - 1)}
                    >
                        <LeftOutlined className="w-4 h-4" />
                    </li>
                    {listItem}
                    <li
                        className="flex items-center justify-center px-3 h-8 transition-all duration-300 leading-tight text-gray-500 bg-white border border-gray-300  hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 hover:cursor-pointer dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        onClick={() => handleChangePageIndex(currentPage + 1)}
                    >
                        <RightOutlined className="w-4 h-4" />
                    </li>
                    <li
                        className="flex items-center justify-center px-3 h-8 transition-all duration-300 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 hover:cursor-pointer dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        onClick={() => handleChangePageIndex(totalPage)}
                    >
                        <DoubleRightOutlined className="w-4 h-4" />
                    </li>
                </ul>
            </nav>
        </>
    );
};
Pagination.propTypes = {
    totalPage: PropTypes.number,
    currentPage: PropTypes.number,
    handleChangePageIndex: (pageIndex) => PropTypes.void,
};
export default Pagination;
