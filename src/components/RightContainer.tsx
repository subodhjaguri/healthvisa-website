/* eslint-disable */
import {whatsappLink} from '@healthvisa/utils';
import {useRouter} from 'next/router';
import React from 'react';

const RightContainer = ({
	image,
	children,
	buttonTitle,
	id,
	largeImage,
}: {
	image: string;
	children: React.ReactNode;
	buttonTitle: string;
	id?: string;
	largeImage?: boolean;
}) => {
	const router = useRouter();
	return (
		<div
			// style={{background: largeImage || 'white'}}
			id={id || ''}
			className="p-7 lg:py-[50px] lg:px-[70px] bg-cover  flex flex-col md:flex-row  justify-end items-center"
		>
			<div className="lg:pr-10  md:w-1/2  ">
				{children}

				<div className="flex justify-center lg:justify-start">
					<button
						onClick={() => router.push(whatsappLink)}
						className="px-16 py-3 bg-[#56b5ac] text-white !rounded-3xl !text-base font-medium"
					>
						{buttonTitle}
					</button>
				</div>
			</div>
			<div className=" md:w-1/2 px-3  mt-8 md:mt-0  relative ">
				{/* <img className=" object-cover w-full" src={gifImage} /> */}
				{largeImage && (
					<img
						className="absolute w-[100px] right-[10%] xl:right-[180px] top-5"
						src="/images/plus.png"
						alt="plus-image"
					/>
				)}

				<img
					style={{height: largeImage ? '400px' : 'auto'}}
					src={image}
					alt={buttonTitle}
				/>
			</div>
		</div>
	);
};

export default RightContainer;
