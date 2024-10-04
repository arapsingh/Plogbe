import React from 'react';
import { Carousel } from 'antd';
import BlogCard from '../components/BlogCard';
import PropTypes from 'prop-types';
import '../App.css'; // Hoặc đường dẫn phù hợp với file CSS của bạn

const CarouselBlogRelated = ({ blogs }) => {
    return (
        <Carousel
            className="carousel-blog-related"
            dots={true} // Hiển thị các chấm điều hướng
            arrows={true} // Hiển thị mũi tên điều hướng
            autoplay={true} // Tự động chạy slide
            autoplaySpeed={3000} // Tốc độ chuyển slide (ms)
            slidesToShow={4} // Số lượng item hiển thị trên mỗi slide
            slidesToScroll={1} // Số lượng item sẽ trượt khi chuyển đổi slide
        >
            {blogs.length > 0 &&
                blogs.map((blog) => (
                    <div key={blog.blog_id} className="carousel-item">
                        <BlogCard blog={blog} author={blog.author} />
                    </div>
                ))}
        </Carousel>
    );
};
CarouselBlogRelated.propTypes = {
    blogs: PropTypes.any,
};
export default CarouselBlogRelated;
