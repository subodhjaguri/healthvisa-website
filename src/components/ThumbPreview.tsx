import {Modal} from 'antd';
import React, {useState} from 'react';

/**
 * A small image thumbnail that opens a centered, click-outside-to-close modal
 * preview. Replaces antd <Image>'s built-in lightbox (which mis-positions in
 * this app). Shows a "—" when there's no image.
 */
export const ThumbPreview = ({
	src,
	size = 44,
}: {
	src?: string;
	size?: number;
}) => {
	const [open, setOpen] = useState(false);
	if (!src) return <span className="text-xs text-gray-400">—</span>;
	return (
		<>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src={src}
				alt=""
				width={size}
				height={size}
				style={{
					objectFit: 'contain',
					borderRadius: 6,
					cursor: 'pointer',
					border: '1px solid #eee',
				}}
				onClick={() => setOpen(true)}
			/>
			<Modal
				visible={open}
				footer={null}
				centered
				width={360}
				onCancel={() => setOpen(false)}
				bodyStyle={{display: 'flex', justifyContent: 'center'}}
			>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={src}
					alt=""
					style={{maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain'}}
				/>
			</Modal>
		</>
	);
};
