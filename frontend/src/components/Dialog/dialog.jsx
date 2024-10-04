import React from 'react';
import { Button, Card } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

// Helper function for conditional class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

const Dialog = ({ isOpen, onClose, children }) => {
    return (
        isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
                <Card
                    title={
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">Dialog Title</span>
                            <Button
                                type="text"
                                icon={<CloseCircleOutlined className="h-4 w-4" />}
                                onClick={onClose}
                                className="text-gray-500"
                            />
                        </div>
                    }
                    className="max-w-lg w-full"
                    bodyStyle={{ padding: '24px' }}
                >
                    {children}
                </Card>
            </div>
        )
    );
};

Dialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

const DialogTrigger = ({ onClick, children }) => {
    return (
        <Button type="primary" onClick={onClick}>
            {children}
        </Button>
    );
};

DialogTrigger.propTypes = {
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

const DialogPortal = ({ children }) => {
    return <>{children}</>;
};

DialogPortal.propTypes = {
    children: PropTypes.node.isRequired,
};

const DialogOverlay = ({ className, ...props }) => (
    <div className={cn('fixed inset-0 z-50 bg-black/80', className)} {...props} />
);

DialogOverlay.propTypes = {
    className: PropTypes.string,
};

const DialogContent = ({ className, children, ...props }) => (
    <div
        className={cn(
            'fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg',
            className
        )}
        {...props}
    >
        {children}
    </div>
);

DialogContent.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
};

const DialogHeader = ({ className, ...props }) => (
    <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
);

DialogHeader.propTypes = {
    className: PropTypes.string,
};

const DialogFooter = ({ className, ...props }) => (
    <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
);

DialogFooter.propTypes = {
    className: PropTypes.string,
};

const DialogTitle = ({ className, ...props }) => (
    <div className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
);

DialogTitle.propTypes = {
    className: PropTypes.string,
};

const DialogDescription = ({ className, ...props }) => (
    <div className={cn('text-sm text-muted-foreground', className)} {...props} />
);

DialogDescription.propTypes = {
    className: PropTypes.string,
};

const DialogClose = ({ onClick }) => {
    return (
        <Button
            type="text"
            icon={<CloseCircleOutlined className="h-4 w-4" />}
            onClick={onClick}
            className="absolute right-4 top-4"
        />
    );
};

DialogClose.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export {
    Dialog,
    DialogTrigger,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    DialogClose,
};
