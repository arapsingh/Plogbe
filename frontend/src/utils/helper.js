export const previewImage = (image, imageRef, imageSource) => {
    if (image && image.type.includes('image/')) {
        var reader = new FileReader();
        reader.onload = function (e) {
            if (imageRef.current) {
                imageRef.current.src = e.target?.result;
            }
        };
        reader.readAsDataURL(image);
        return;
    } else {
        if (imageRef.current && imageSource) {
            imageRef.current.src = imageSource;
        } else if (imageRef.current) {
            imageRef.current.src = '';
        }
    }
};
export const convertDateFormat = (inputDate) => {
    const date = new Date(inputDate); // Chuyển chuỗi thành đối tượng ngày tháng
    const day = String(date.getDate()).padStart(2, '0'); // Lấy ngày và đảm bảo rằng nó có 2 chữ số
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Lấy tháng (chú ý tháng bắt đầu từ 0) và đảm bảo rằng nó có 2 chữ số
    const year = date.getFullYear(); // Lấy năm

    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
};
export const convertDateTimeFormat = (inputDate) => {
    const date = new Date(inputDate);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`;

    return formattedDateTime;
};
export const fetchAvatarWithHeaders = async (avatarUrl, customHeaders = {}) => {
    const CORS_PROXY = 'https://cors-pass.onrender.com';
    const fullUrl = `${CORS_PROXY}/${avatarUrl}`;

    // Thêm các header vào yêu cầu
    const headers = {
        'X-Requested-With': 'XMLHttpRequest', // Header mặc định
        ...customHeaders, // Header tùy chỉnh nếu có
    };

    try {
        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: headers, // Gửi header cùng với request
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Trả về blob URL nếu thành công
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('Error fetching avatar with headers:', error);
        throw error;
    }
};
