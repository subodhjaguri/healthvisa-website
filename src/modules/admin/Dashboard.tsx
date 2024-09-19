/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {Layout} from '@healthvisa/components';
import {Skeleton} from 'antd';
import React from 'react';
import {BiCategoryAlt} from 'react-icons/bi';
import {FaUsers} from 'react-icons/fa';
import {MdMedicalServices} from 'react-icons/md';
import {GiMedicines} from 'react-icons/gi';
import {RiVipCrown2Fill, RiAdminFill} from 'react-icons/ri';
import {useRouter} from 'next/router';
import {useCategoriesCount} from '@healthvisa/models/admin/category/useCategories';
import {useProductCount} from '@healthvisa/models/admin/products/useProduct';
import {useUser} from '@healthvisa/models/admin/users/useUser';

export const Dashboard = () => {
	const {data} = useCategoriesCount();
	const {data: products} = useProductCount();
	const {data: userList} = useUser();

	const router = useRouter();
	return (
		<Layout>
			<div className="flex flex-col bg-white p-4 shadow-xl border border-[#dde4eb] border-solid ">
				<h2 className="text-lg">Peoples</h2>
				{false ? (
					<Skeleton active />
				) : (
					<div className="flex p-5 flex-wrap justify-start">
						<div className="w-56 h-fit p-2 flex items-center justify-between mx-6 mb-6 border bg-[#56b5ac] rounded-lg">
							<RiAdminFill className="text-white" size={30} />
							<div className="flex flex-col justify-center">
								<span className=" text-right  text-white text-4xl font-bold">
									1
								</span>
								<span className=" text-right  text-white text-xs uppercase opacity-70">
									Admins
								</span>
							</div>
						</div>
						<div
							onClick={() => router.push('/admin/users')}
							className="cursor-pointer w-56 h-fit p-2 flex items-center justify-between mx-6 mb-6 border bg-[#465CA8] rounded-lg">
							<FaUsers className="text-white" size={30} />
							<div className="flex flex-col justify-center">
								<span className=" text-right  text-white text-4xl font-bold">
									{userList?.length || 0}
								</span>
								<span className=" text-right  text-white text-xs uppercase opacity-70">
									Users
								</span>
							</div>
						</div>
						<div
							onClick={() => router.push('/admin/users')}
							className="cursor-pointer w-56 h-fit p-2 flex items-center justify-between mx-6 mb-6 border bg-[#E5095A] rounded-lg">
							<RiVipCrown2Fill className="text-white" size={30} />
							<div className="flex flex-col justify-center">
								<span className=" text-right  text-white text-4xl font-bold">
									{
										userList?.filter(
											(user) =>
												user.metadata?.membershipDetail?.length,
										).length
									}
								</span>
								<span className=" text-right  text-white text-xs uppercase opacity-70">
									Members
								</span>
							</div>
						</div>
						<div
							onClick={() => router.push('/admin/users')}
							className="cursor-pointer w-56 h-fit p-2 flex items-center justify-between mx-6 mb-6 border bg-[#aa2ca2] rounded-lg">
							<MdMedicalServices className="text-white" size={30} />
							<div className="flex flex-col justify-center">
								<span className=" text-right  text-white text-4xl font-bold">
									{userList?.filter((user) => user.isEHR).length}
								</span>
								<span className=" text-right  text-white text-xs uppercase opacity-70">
									EHR Users
								</span>
							</div>
						</div>
					</div>
				)}
			</div>

			<div className="flex flex-col mt-4 bg-white p-4 shadow-xl border border-[#dde4eb] border-solid ">
				<h2 className="text-lg">Categories</h2>
				{false ? (
					<Skeleton active />
				) : (
					<div className="flex p-5 flex-wrap justify-start">
						<div
							// onClick={() => router.push('/admin/categories')}
							className="cursor-pointer w-56 h-fit p-2 flex items-center justify-between mx-6 mb-6 border bg-[#93C841] rounded-lg">
							<BiCategoryAlt className="text-white" size={30} />
							<div className="flex flex-col justify-center">
								<span className=" text-right  text-white text-4xl font-bold">
									6
								</span>
								<span className=" text-right  text-white text-xs uppercase opacity-70">
									Categories
								</span>
							</div>
						</div>
						{/* <div
							onClick={() => router.push('/admin/categories')}
							className="cursor-pointer w-56 h-fit p-2 flex items-center justify-between mx-6 mb-6 border bg-[#2CAA4E] rounded-lg">
							<MdMedicalServices className="text-white" size={30} />
							<div className="flex flex-col justify-center">
								<span className=" text-right  text-white text-4xl font-bold">
									{data?.count || 0}
								</span>
								<span className=" text-right  text-white text-xs uppercase opacity-70">
									Services
								</span>
							</div>
						</div> */}
					</div>
				)}
			</div>
			<div className="flex flex-col mt-4 bg-white p-4 shadow-xl border border-[#dde4eb] border-solid ">
				<h2 className="text-lg">Services</h2>
				{false ? (
					<Skeleton active />
				) : (
					<div className="flex p-5 flex-wrap justify-start items-center">
						<div
							onClick={() => router.push('/admin/products')}
							className="cursor-pointer w-56 h-fit p-2 flex items-center justify-between mx-6 mb-6 border bg-[#93C841] rounded-lg">
							<BiCategoryAlt className="text-white" size={30} />
							<div className="flex flex-col justify-center">
								<span className=" text-right  text-white text-4xl font-bold">
									{products?.count || 0}
								</span>
								<span className=" text-right  text-white text-xs uppercase opacity-70">
									Doctor Consultaion
								</span>
							</div>
						</div>
						<div
							onClick={() => router.push('/admin/diagnostics')}
							className="cursor-pointer w-56 h-fit p-2 flex items-center justify-between mx-6 mb-6 border bg-[#999999] rounded-lg">
							<GiMedicines className="text-white" size={30} />
							<div className="flex flex-col justify-center">
								<span className=" text-right  text-white text-4xl font-bold">
									9
								</span>
								<span className=" text-right  text-white text-xs uppercase opacity-70">
									Diagnostics
								</span>
							</div>
						</div>
						{/* <div
							onClick={() => router.push('/admin/categories')}
							className="cursor-pointer w-56 h-fit p-2 flex items-center justify-between mx-6 mb-6 border bg-[#aa2ca2] rounded-lg">
							<MdMedicalServices className="text-white" size={30} />
							<div className="flex flex-col justify-center">
								<span className=" text-right  text-white text-4xl font-bold">
									21
								</span>
								<span className=" text-right  text-white text-xs uppercase opacity-70">
									Diagnostics Services
								</span>
							</div>
						</div> */}
						<div
							onClick={() => router.push('/admin/wellness-services')}
							className="cursor-pointer w-56 h-fit p-2 flex items-center justify-between mx-6 mb-6 border bg-[#0f39d2] rounded-lg">
							<GiMedicines className="text-white" size={30} />
							<div className="flex flex-col justify-center">
								<span className=" text-right  text-white text-4xl font-bold">
									3
								</span>
								<span className=" text-right  text-white text-xs uppercase opacity-70">
									Wellness Services
								</span>
							</div>
						</div>
						<div
							onClick={() => router.push('/admin/other-services')}
							className="cursor-pointer w-56 h-fit p-2 flex items-center justify-between mx-6 mb-6 border bg-[#e5cf08] rounded-lg">
							<GiMedicines className="text-white" size={30} />
							<div className="flex flex-col justify-center">
								<span className=" text-right  text-white text-4xl font-bold">
									2
								</span>
								<span className=" text-right  text-white text-xs uppercase opacity-70">
									Other Services
								</span>
							</div>
						</div>
					</div>
				)}
			</div>
		</Layout>
	);
};
