/* eslint-disable */
import {whatsappLink} from '@healthvisa/utils';
import {useRouter} from 'next/router';
import React from 'react';

const LeftContainer = ({
	image,
	children,
	buttonTitle,
	id,
	icon,
}: {
	image: string;
	children: React.ReactNode;
	buttonTitle: string;
	id?: string;
	icon?: JSX.Element;
}) => {
	const router = useRouter();
	return (
		<div
			id={id || ''}
			className=" p-7 lg:py-[50px] lg:px-[70px] bg-cover flex md:flex-row flex-col   justify-end items-center"
		>
			<div className="md:w-1/2 px-3 order-2 md:-order-none mt-8 md:mt-0  ">
				<img className=" object-cover w-full " alt="service-image" src={image} />
			</div>
			<div className="lg:pl-10 md:w-1/2">
				{children}
				<div className="flex justify-center md:justify-start">
					<button
						onClick={() => router.push(whatsappLink)}
						className={`px-16 py-3 bg-[#56b5ac] text-white !rounded-3xl !text-base ${
							icon ? 'flex items-center gap-2' : ''
						}`}
					>
						<span className="font-medium">{buttonTitle}</span>
						{icon}
					</button>
				</div>
			</div>
		</div>
	);
};

export default LeftContainer;
