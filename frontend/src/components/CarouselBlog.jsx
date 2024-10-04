import React from 'react';
import { Carousel } from 'antd';
import BlogCard from '../components/BlogCard';
import PropTypes from 'prop-types';
import '../App.css';
const CarouselBlog = ({ blogs }) => {
    return (
        <Carousel
            className="carousel-blog-related"
            dots={true} // Hiển thị các dấu chấm chỉ số slide
            autoplay={true} // Tự động chuyển đổi giữa các slide
            arrows={true} // Hiển thị các nút mũi tên
            slidesToShow={4} // Số lượng item hiển thị trên mỗi slide
            slidesToScroll={1} // Số lượng item sẽ trượt khi chuyển đổi slide
        >
            {blogs.length > 0 &&
                blogs.map((blog) => (
                    <div key={blog.blog_id}>
                        <BlogCard blog={blog} author={blog.author} />
                    </div>
                ))}
        </Carousel>
    );
};
CarouselBlog.propTypes = {
    blogs: PropTypes.any,
};
export default CarouselBlog;
