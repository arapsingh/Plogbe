import React from 'react';
import { Popover, Button } from 'antd';
import {
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon,
    LinkedinShareButton,
    LinkedinIcon,
} from 'react-share';
import { ShareAltOutlined } from '@ant-design/icons'; // Using Ant Design's Share Icon
import PropTypes from 'prop-types';

const ShareButton = ({ currentHref }) => {
    const currentURI = encodeURIComponent(window.location.href);

    // Popover content for the share buttons
    const popoverContent = (
        <div className="flex flex-col justify-center gap-2">
            <FacebookShareButton url={currentURI} hashtag="#utemy #learning #elearning">
                <FacebookIcon size={32} round={true} />
            </FacebookShareButton>
            <TwitterShareButton url={window.location.href} hashtags={['utemy', 'learning', 'elearning']}>
                <TwitterIcon size={32} round={true} />
            </TwitterShareButton>
            <LinkedinShareButton url={window.location.href} title="Utemy">
                <LinkedinIcon size={32} round={true} />
            </LinkedinShareButton>
        </div>
    );

    return (
        <Popover content={popoverContent} trigger="hover" placement="bottom">
            <Button type="text" icon={<ShareAltOutlined style={{ fontSize: '24px', color: 'black' }} />} />
        </Popover>
    );
};
ShareButton.propTypes = {
    currentHref: PropTypes.string,
};
export default ShareButton;
