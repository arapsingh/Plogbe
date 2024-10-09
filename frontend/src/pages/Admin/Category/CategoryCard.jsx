import { useState, useEffect } from 'react';
import { useAppSelector } from '../../../hooks/hooks.ts';
import { Plog } from '../../../assets/images';
import PropTypes from 'prop-types';
import axios from 'axios';
const CategoryCard = (props) => {
    const [hovered, setHovered] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    useEffect(() => {
        const fetchImage = async () => {
            try {
                if (props.category.url_image) {
                    const response = await axios.get(`https://cors-pass.onrender.com/${props.category.url_image}`, {
                        headers: {
                            'x-requested-with': 'XMLHttpRequest',
                        },
                        responseType: 'arraybuffer', // Chỉ định kiểu phản hồi là arraybuffer
                    });

                    // Tạo một blob từ dữ liệu nhị phân
                    const blob = new Blob([response.data], { type: 'image/png' }); // Hoặc loại hình ảnh khác nếu cần
                    const imageUrl = URL.createObjectURL(blob); // Tạo URL cho blob

                    console.log(imageUrl); // Log URL để kiểm tra
                    setImageUrl(imageUrl); // Cập nhật trạng thái với URL hình ảnh
                }
            } catch (error) {
                console.error('Error fetching the image:', error); // Xử lý lỗi
            }
        };

        fetchImage(); // Gọi hàm lấy hình ảnh
    }, [props.category.url_image]);
    return (
        <>
            <div
                className={`relative w-full overflow-hidden transition-all duration-500 bg-white border rounded-md shadow group hover:shadow-lg h-fit `}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <div className="p-1 flex flex-row justify-between items-center w-full">
                    <div className="p-1 flex justify-start w-[90%]">
                        <div className="w-[130px] h-[130px] flex items-center justify-center bg-white shadow shrink-0 rounded-md">
                            <img
                                className="w-[130px] h-[130px] my-3 rounded-md border border-gray-400 "
                                alt="category_image"
                                src={imageUrl ? imageUrl : Plog}
                            />
                        </div>
                        <div className="flex flex-col items-start">
                            <div className="ml-4 items-center leading-7 tracking-wider">
                                <h1 className="text-gray-900 text-2xl font-semibold ">{props.category.title}</h1>
                            </div>
                            <div className=" items-start mt-1 ml-4 overflow-hidden w-full">
                                <h1 className="text-black font-bold text-lg shrink-0">
                                    Mô tả:
                                    <span className="ml-2 text-gray-700 font-normal text-lg line-clamspan-3 w-full">
                                        {props.category.description}
                                    </span>
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className={`${hovered ? 'block' : 'hidden'} flex flex-col mr-1 w-[10%]`}>
                        <button
                            className="w-full px-5 py-2 mt-2 text-white  btn btn-info hover:bg-info/70 hover:cursor-pointer rounded-2xl "
                            onClick={() => props.handleOpenEditModal(props.category.category_id)}
                        >
                            Chỉnh sửa
                        </button>
                        <button
                            className="w-full px-5 py-2 mt-2 text-white  btn btn-error hover:bg-error/70 hover:cursor-pointer rounded-2xl"
                            onClick={() => props.handleOpenDeleteModal(props.category.category_id)}
                        >
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
CategoryCard.propTypes = {
    category: PropTypes.shape({
        category_id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        url_image: PropTypes.string,
    }).isRequired,
    handleOpenDeleteModal: PropTypes.func.isRequired,
    handleOpenEditModal: PropTypes.func.isRequired,
};

export default CategoryCard;
