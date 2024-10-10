import React, { useState } from 'react';

import { ArrowRightOutlined, DownOutlined, UpOutlined, EyeOutlined } from '@ant-design/icons';
import { Plog } from '../assets/images';
import { convertDateFormat } from '../utils/helper';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAppSelector } from '../hooks/hooks.ts';

const BlogCard = (props) => {
    const [hovered, setHovered] = useState(false);
    const currentUser = useAppSelector((state) => state.userSlice.currentUser);

    // Check if the current user is the author of the blog
    const isAuthor = currentUser?.user_id === props.author.user_id;
    return (
        <Link to={`${isAuthor ? `/my-blog/${props.blog.slug}` : `/blog/detail/${props.blog.slug}`}`}>
            <div
                className=" bg-background  flex flex-col  cursor-pointer w-full h-fit"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <img
                    src={props.blog.url_image}
                    alt={props.blog.title}
                    className="w-auto h-[200px] bg-black object-cover "
                />
                <div className="p-4 flex-1 gap-2 flex flex-col items-start">
                    <h2
                        className={` font-semibold text-2xl h-32 whitespace-wrap transition-all  duration-300 line-clamp-4 ${hovered ? 'text-info' : ''}`}
                    >
                        {props.blog.title}
                    </h2>
                    <div className="flex flex-col items-start gap-2">
                        <div className="flex gap-2 items-center">
                            <img
                                src={props.author.url_avatar || Plog}
                                alt="avt-admin"
                                className="rounded-full w-6 h-6 border border-gray-400"
                            />
                            <div className=" font-normal ">
                                {props.author.first_name + ' ' + props.author.last_name}
                            </div>
                            <div className="border-t border-1 mt-[2px] border-gray-300 w-[30px]"></div>
                            <p className="text-sm text-gray-500">{convertDateFormat(props.blog.updated_at)}</p>
                            {/* {props.isAdmin && (
                                <div
                                    className={`badge badge-outline ${props.blog.is_published && 'badge-info'} text-xs`}
                                >
                                    {props.blog.is_published ? 'Hiện' : 'Ẩn'}
                                </div>
                            )} */}
                        </div>
                        <div className=" h-5 flex flex-wrap gap-1">
                            {props.blog.categories &&
                                props.blog.categories.map((category, index) => (
                                    <div key={`${props.blog.blog_id}-${index}`} className="mt-1 badge badge-outline">
                                        {category.title}
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
                <div className={`p-4 flex-1 flex items-center justify-between  `}>
                    <div className="flex items-center">
                        <p className={`${hovered ? 'underline underline-offset-8' : ''} `}>Chi tiết</p>
                        <ArrowRightOutlined
                            className={`w-4 h-4 transition-all  duration-300 ${hovered ? 'translate-x-2' : ''}`}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 shrink-0">
                            <EyeOutlined className="w-4 h-4" />
                            <p>{props.blog.view}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                            <UpOutlined className="w-4 h-4" />
                            <p>{props.blog.like}</p>
                        </div>
                        {/* {props.isAdmin && ( */}
                        <div className="flex items-center gap-1 shrink-0">
                            <DownOutlined className="w-4 h-4" />
                            <p>{props.blog.dislike}</p>
                        </div>
                        {/* )} */}
                    </div>
                </div>
            </div>
        </Link>
    );
};
BlogCard.propTypes = {
    blog: PropTypes.any,
    author: PropTypes.any,
};
export default BlogCard;