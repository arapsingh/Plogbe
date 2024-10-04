import React, { useState, useMemo, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import styles
import 'react-quill/dist/quill.bubble.css'; // (Optional) Import additional styles
import { useAppDispatch } from '../hooks/hooks.ts';
// import { decisionActions } from '../../redux/slices';
import toast from 'react-hot-toast';
import ImageResize from 'quill-image-resize-module-react';
import BlotFormatter, { AlignAction, DeleteAction, ImageSpec, ResizeAction } from 'quill-blot-formatter';
import PropTypes from 'prop-types';
import { blogActions } from '../redux/slices/index.js';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import '../App.css';
import EmojiPicker from 'emoji-picker-react';
const BaseImageFormat = Quill.import('formats/image');
const ImageFormatAttributesList = ['alt', 'height', 'width', 'style'];

class ImageFormat extends BaseImageFormat {
    static formats(domNode) {
        return ImageFormatAttributesList.reduce(function (formats, attribute) {
            if (domNode.hasAttribute(attribute)) {
                formats[attribute] = domNode.getAttribute(attribute);
            }
            return formats;
        }, {});
    }

    format(name, value) {
        if (ImageFormatAttributesList.indexOf(name) > -1) {
            if (value) {
                this.domNode.setAttribute(name, value);
            } else {
                this.domNode.removeAttribute(name);
            }
        } else {
            super.format(name, value);
        }
    }
}

Quill.register(ImageFormat, true);
Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/blotFormatter', BlotFormatter);

class CustomImageSpec extends ImageSpec {
    getActions() {
        return [AlignAction, DeleteAction, ResizeAction];
    }
}

const TextEditorWithImage = forwardRef(({ propRef, content, height, handleChangeContent }, ref) => {
    const [display, setDisplay] = useState(content);
    const [imagePreview, setImagePreview] = useState(null); // Trạng thái lưu trữ URL hình ảnh tạm thời
    const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Trạng thái cho emoji picker
    let emojiPickerRef = useRef(null);

    const dispatch = useAppDispatch();
    // const [editorContent, setEditorContent] = useState(props.content);
    let quillObj = useRef(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [objectUrls, setObjectUrls] = useState([]); // State để lưu object URL
    const imageHandler = async (img) => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        // input.onchange = async () => {
        //     if (!input || !input.files) return;
        //     let file = input.files[0];
        //     let formData = new FormData();
        //     formData.append('evidence_image', file);

        //     // dispatch(decisionActions.uploadEvidence(formData)).then((res) => {
        //     //     if (res.payload && res.payload.data) {
        //     //         const range = quillObj.current.getEditorSelection();
        //     //         quillObj.current.getEditor().insertEmbed(range.index, 'image', res.payload.data);
        //     //     } else toast.error('Something wrong happened');
        //     // });
        // };
        input.onchange = async () => {
            if (!input || !input.files) return;
            const file = input.files[0];
            // Kiểm tra nếu file lớn hơn 4096KB (4MB)
            if (file.size > 4096 * 1024) {
                console.warn(`File "${file.name}" is too large and won't be processed.`);
                toast.error('The selected file is too large. Please choose a file smaller than 4MB.');
                return; // Ngăn không thực hiện các hành động tiếp theo
            }
            const Image = Quill.import('formats/image');
            const objectUrl = window.URL.createObjectURL(file); // Tạo URL blob tạm thời
            Image.sanitize = (url) => url;
            const range = quillObj.current.getEditorSelection();
            // Chèn hình ảnh vào vị trí hiện tại trong editor
            quillObj.current.editor.insertEmbed(range.index, 'image', objectUrl);
            // Cập nhật image preview và lưu file vào state
            setImagePreview(objectUrl);
            setSelectedFiles((prevFiles) => [...prevFiles, file]); // Lưu file vào state
            setObjectUrls((prevUrls) => [...prevUrls, objectUrl]);
        };
    };
    useImperativeHandle(ref, () => ({
        handleSave: (blog) => {
            return new Promise((resolve, reject) => {
                try {
                    // Kiểm tra nếu không có file để upload
                    if (selectedFiles.length === 0) {
                        console.log('No files to upload, just updating content.');
                        // Lấy nội dung cũ và không thay đổi gì nếu không có ảnh mới
                        const updatedContent = display;
                        setDisplay(updatedContent);
                        handleChangeContent(updatedContent);
                        toast.success('Content updated successfully without uploading new images.');

                        resolve({ success: true, data: updatedContent });
                        return; // Không cần thực hiện tiếp phần upload
                    }

                    const formData = new FormData();
                    selectedFiles.forEach((file) => {
                        formData.append('photo_in_blog', file);
                    });

                    dispatch(blogActions.uploadPhotosInBlog(formData)).then((response) => {
                        if (response.payload.status_code === 200) {
                            const filesPath = response.payload.data;
                            console.log('Files Path:', filesPath);

                            // Lấy các URL đã có trên server từ nội dung cũ
                            const existingUrls = blog.content.match(/https?:\/\/[^\s]+/g) || [];
                            let updatedContent = display; // Khởi tạo nội dung mới

                            // Tạo một Set để dễ dàng kiểm tra URL đã có trên server
                            const existingUrlSet = new Set(existingUrls);

                            // Lặp qua các file đã upload
                            filesPath.forEach((serverFile, index) => {
                                const objectUrl = objectUrls[index]; // Lấy object URL từ state

                                // Thay thế chỉ nếu URL tạm thời chưa có trên server
                                if (!existingUrlSet.has(objectUrl)) {
                                    console.log('Replacing:', objectUrl, 'with:', serverFile);
                                    updatedContent = updatedContent.split(objectUrl).join(serverFile);
                                }
                            });

                            // Cập nhật lại state chỉ sau khi đã thay thế tất cả
                            setDisplay(updatedContent);
                            handleChangeContent(updatedContent);
                            toast.success('Images uploaded and content updated successfully!');

                            // Resolve promise với kết quả thành công
                            resolve({ success: true, data: updatedContent });
                        } else {
                            toast.error(response.payload.message);
                            // Reject promise nếu có lỗi
                            reject(new Error(response.payload.message));
                        }
                    });
                } catch (error) {
                    console.error(error);
                    toast.error('Failed to upload images');
                    // Reject promise nếu có lỗi
                    reject(error);
                }
            });
        },
        getContent: () => display, // Return the content value
        resetContent: () => {
            setDisplay(''); // Reset lại nội dung bằng cách cập nhật state
        },
    }));
    const [cursorPosition, setCursorPosition] = useState(null);

    const handleEmojiPickerOpen = () => {
        const editor = quillObj.current.getEditor();
        const range = editor.getSelection();
        if (range) {
            setCursorPosition(range.index); // Lưu vị trí con trỏ hiện tại
        }
        setShowEmojiPicker(!showEmojiPicker); // Mở EmojiPicker
    };
    const insertEmoji = (emojiObject) => {
        const editor = quillObj.current.getEditor();

        // Sử dụng vị trí con trỏ đã lưu
        const range = cursorPosition !== null ? cursorPosition : editor.getLength() - 1;

        editor.insertText(range, emojiObject.emoji); // Chèn emoji tại vị trí đã lưu
        editor.setSelection(range + emojiObject.emoji.length); // Di chuyển con trỏ ngay sau emoji

        setCursorPosition(null); // Đặt lại vị trí con trỏ
        setShowEmojiPicker(false); // Đóng EmojiPicker
    };

    const modules = useMemo(
        () => ({
            toolbar: {
                container: [
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline'],
                    ['blockquote', 'code-block'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ align: [] }],
                    ['link', 'image', 'formula'],
                    [{ emoji: '😊' }], // Thêm biểu tượng emoji vào toolbar
                    ['clean'],
                    [{ color: [] }],
                ],
                handlers: {
                    image: imageHandler,
                    emoji: handleEmojiPickerOpen, // Toggle emoji picker
                },
            },
            blotFormatter: {
                specs: [CustomImageSpec],
                overlay: {
                    className: 'blot-formatter__overlay',
                    style: {
                        position: 'absolute',
                        boxSizing: 'border-box',
                        border: '1px dashed #444',
                    },
                },
            },
        }),
        []
    );

    useEffect(() => {
        setDisplay(content ? content : '');
    }, [content]);
    // useEffect(() => {
    //     if (quillObj.current) {
    //         // Đăng ký sự kiện text-change một lần khi component mount
    //         quillObj.current.getEditor().on('text-change', () => {
    //             const images = quillObj.current.getEditor().root.querySelectorAll('img');

    //             // Cập nhật cả selectedFiles và objectUrls
    //             setSelectedFiles((prevFiles) => {
    //                 const newSelectedFiles = [];
    //                 const newObjectUrls = [];

    //                 images.forEach((img) => {
    //                     const src = img.getAttribute('src');
    //                     const index = objectUrls.indexOf(src);

    //                     // Kiểm tra xem index có hợp lệ hay không
    //                     if (index !== -1 && prevFiles[index]) {
    //                         newSelectedFiles.push(prevFiles[index]);
    //                         newObjectUrls.push(src); // Thêm src vào newObjectUrls
    //                     }
    //                 });

    //                 console.log('Filtered selected files: ', newSelectedFiles);

    //                 // Cập nhật objectUrls
    //                 setObjectUrls(newObjectUrls);

    //                 return newSelectedFiles; // Trả về mảng selectedFiles mới
    //             });
    //         });
    //     }
    // }, []); // Chỉ chạy một lần khi component mount
    const handleOnChange = async (content) => {
        // Cập nhật nội dung và display của editor
        handleChangeContent(content);
        setDisplay(content);
    };

    const onEmojiClick = (event, emojiObject) => {
        // setComment(comment + emojiObject.emoji);
        setShowEmojiPicker(false); // Close emoji picker after selecting
    };
    return (
        <div>
            <ReactQuill
                ref={(el) => {
                    quillObj.current = el;
                    if (propRef) propRef.current = el;
                }}
                theme="snow"
                value={display}
                modules={modules}
                onChange={handleOnChange}
                style={{ height: height ? `${height}px` : '200px' }} // Sử dụng style inline
                className="display:block z-20"
            />
            {showEmojiPicker && (
                <div ref={emojiPickerRef} style={{ position: 'absolute', zIndex: 1 }}>
                    <EmojiPicker onEmojiClick={insertEmoji} />
                </div>
            )}
        </div>
    );
});
TextEditorWithImage.propTypes = {
    propRef: PropTypes.object,
    content: PropTypes.string,
    height: PropTypes.number,
    handleChangeContent: PropTypes.func.isRequired,
};
TextEditorWithImage.displayName = 'TextEditorWithImage';
export default TextEditorWithImage;
