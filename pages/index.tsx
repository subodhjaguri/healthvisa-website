/* eslint-disable */
import {NextPage} from 'next';

import React, {useState} from 'react';

import {FaFacebookF, FaTwitter, FaYoutube, FaWifi, FaWhatsapp} from 'react-icons/fa';
import {BiRightArrowAlt} from 'react-icons/bi';

import {FiMail, FiPhoneCall} from 'react-icons/fi';
import {CgMenuLeft} from 'react-icons/cg';
import LeftContainer from '@healthvisa/components/LeftContainer';
import RightContainer from '@healthvisa/components/RightContainer';
import assistantGif from 'public/gifs/assistant.gif';
import healthcareGif from 'public/gifs/healthcare.gif';
import membershipGif from 'public/gifs/membership.gif';
import scooterGif from 'public/gifs/scooter.gif';
import {Col, Drawer, Row} from 'antd';
import {whatsappLink} from '@healthvisa/utils';
import {useRouter} from 'next/router';
import SEOHead from '@healthvisa/components/SEOHead';
import Link from 'next/link';

const HealthVisa: NextPage = () => {
	const [open, setOpen] = useState(false);

	const showDrawer = () => {
		setOpen(true);
	};
	const router = useRouter();

	const onClose = () => {
		setOpen(false);
	};
	const handleScroll = (id: string) => {
		console.log('id: ', id);
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({behavior: 'smooth'});
		}
	};

	const navRoutes = [
		{
			id: 'home',
			title: 'Home',
		},
		{
			id: 'membership',
			title: 'Membership Card',
		},
		{
			id: 'healthCheckup',
			title: 'Preventive Health Checkup',
		},
		{
			id: 'EHR',
			title: 'EHR',
		},
		{
			id: 'news',
			title: 'Health News',
		},
		{
			id: 'products',
			title: 'Health Products',
		},
		{
			id: 'aboutUs',
			title: 'About Us',
		},
	];

	const services = [
		{
			id: 1,
			image: '/images/Image9.png',
			description: 'Free  Dental Checkup for entire family',
		},
		{
			id: 2,
			image: '/images/Image11.png',
			description: 'Flat 30% Off on Blood Test',
		},
		{
			id: 3,
			image: '/images/Image8.png',
			description: 'Flat 30% Off on GYM, Yoga & Other Fitness services',
		},
		{
			id: 4,
			image: '/images/Image12.png',
			description: 'Flat 25% Off on Diagnostic services like CT Scan, MRI etc',
		},
		{
			id: 5,
			image: '/images/Image7.png',
			description: 'Flat 25% Off on Ambulance services',
		},
		{
			id: 6,
			image: '/images/Image6.png',
			description: 'Flat 20% Off on Doctor’s Consultation',
		},
		{
			id: 7,
			image: '/images/Image9.png',
			description: 'Flat 20% Off on Dental services',
		},
		{
			id: 8,
			image: '/images/Image5.png',
			description: 'Flat 20% Off on Physiotherapy',
		},
		{
			id: 9,
			image: '/images/Image4.png',
			description: 'Flat 20% off on homeopathy',
		},
		{
			id: 10,
			image: '/images/Image3.png',
			description: 'Flat 20% Off on Ayurveda',
		},
		{
			id: 11,
			image: '/images/Image2.png',
			description: 'Flat 20% Off on Dietitian',
		},
		{
			id: 12,
			image: '/images/Image1.png',
			description: 'Flat 15% Off on Pharmacy',
		},
	];

	return (
		<>
			<SEOHead />
			<div>
				<nav className="hidden lg:flex items-center">
					<div className="ml-14 p-2">
						<img
							className="h-16"
							alt="healthifam-logo"
							src="/images/Logo.png"
						/>
					</div>
					<div>
						<ul className="mb-0 flex justify-end gap-2 items-center">
							<li
								className="cursor-pointer text-center "
								onClick={() => handleScroll('home')}
							>
								<span className="home hover:text-[#56b5ac]">Home</span>
							</li>
							<li
								className="cursor-pointer text-center "
								onClick={() => handleScroll('membership')}
							>
								<span className="hover:text-[#56b5ac]">
									Membership Card
								</span>
							</li>
							<li
								className="cursor-pointer text-center "
								onClick={() => handleScroll('healthCheckup')}
							>
								<span className="hover:text-[#56b5ac]">
									Preventive Health Checkup
								</span>
							</li>
							<li
								className="cursor-pointer text-center "
								onClick={() => handleScroll('EHR')}
							>
								<span className="hover:text-[#56b5ac]">EHR</span>
							</li>
							<li
								className="cursor-pointer text-center "
								onClick={() => handleScroll('news')}
							>
								<span className="hover:text-[#56b5ac]">Health News</span>
							</li>
							<li
								className="cursor-pointer text-center "
								onClick={() => handleScroll('products')}
							>
								<span className="hover:text-[#56b5ac]">
									Health Products
								</span>
							</li>
							<li
								className="cursor-pointer text-center "
								onClick={() => handleScroll('aboutUs')}
							>
								<span className="hover:text-[#56b5ac]">About Us</span>
							</li>
							<li>
								<button
									className="px-5 py-3 bg-[#56b5ac] text-white !rounded-3xl !text-base"
									onClick={() => router.push(whatsappLink)}
								>
									<a className="us uppercase flex items-center font-medium">
										<span className="mr-2">Contact Us</span>
										<BiRightArrowAlt style={{fontSize: '16px'}} />
									</a>
								</button>
							</li>
						</ul>
					</div>
				</nav>
				<nav className="lg:hidden flex justify-between items-center px-5">
					<CgMenuLeft
						onClick={showDrawer}
						className="cursor-pointer"
						style={{fontSize: '25px'}}
					/>
					{/* <img className="w-[70px] h-[70px]" src="/images/Logo.png" /> */}
					<div className="p-2">
						<img
							className="h-16"
							alt="healthifam-logo"
							src="/images/Logo.png"
						/>
					</div>
				</nav>
				<Drawer
					title="Health Fam"
					placement="left"
					onClose={onClose}
					visible={open}
				>
					{navRoutes.map((route) => (
						<p
							className="cursor-pointer font-medium"
							onClick={() => {
								handleScroll(route.id), setOpen(false);
							}}
						>
							{route.title}
						</p>
					))}
					<p
						className="cursor-pointer font-medium"
						onClick={() => {
							router.push('/terms-and-conditions');
						}}
					>
						Terms & Conditions
					</p>
					<p
						className="cursor-pointer font-medium"
						onClick={() => {
							router.push('/privacy-policy');
						}}
					>
						Privacy Policy
					</p>
					<p
						className="cursor-pointer font-medium"
						onClick={() => {
							router.push('/refund-policy');
						}}
					>
						Refund Policy
					</p>
					<p
						className="cursor-pointer font-bold"
						onClick={() => router.push(whatsappLink)}
					>
						Contact Us
					</p>
				</Drawer>

				<div
					id="home"
					className="bg-[url('/images/MobileBG1.png')] bg-center md:bg-[url('/Mainbg.png')] w-screen h-[700px] md:h-screen bg-cover flex items-center "
				>
					<div className="ml-20  !text-3xl ">
						<h1 className="font-bold">
							India's<span className="blue"> 1st 360°</span>
						</h1>
						<h1 className="font-bold">
							<span className="blue">Healthcare</span> and
						</h1>
						<h1 className="font-bold">
							Wellness <span className="blue">Solution.</span>
						</h1>
						<br />
						<button
							onClick={() => router.push(whatsappLink)}
							className="px-16 py-3 bg-[#56b5ac] text-white !rounded-3xl !text-base font-medium"
						>
							Healthifam
						</button>
					</div>
				</div>

				<LeftContainer
					image={assistantGif.src}
					buttonTitle="Speak Now"
					icon={<FaWhatsapp color="white" />}
				>
					<div className="!text-3xl ">
						<h1 className="font-bold">
							<span className="blue mr-2">Empower</span>your life
						</h1>
						<h1 className="font-bold">with Dedicated</h1>
						<h1 className="font-bold">
							<span className="blue">Health Assistant</span>
						</h1>
					</div>
					<p className="text-[#484848] text-base mt-5">
						To find you best doctor in the vicinity and also helping you to
						book appointment with the best Speciality Doctor, Diagnostic
						service like Lab test, MRI, CT Scan, Dentists, Counsellors at
						Discounted Cost. Along with that it will also help you identify
						Best Wellness providers like, Gyms, Slimming centers, Yoga,
						Cosmetic Center at an Unbelievable Price.
					</p>
				</LeftContainer>
				<RightContainer id="EHR" buttonTitle="Save Now" image={healthcareGif.src}>
					<div className="!text-3xl">
						<h1 className="font-bold">Know Yourself better</h1>
						<h1 className="font-bold">
							with <span className="blue">Intelligent Health</span>
						</h1>
						<h1 className="font-bold">
							Insights <span className="blue">with EHR</span>
						</h1>
					</div>
					<div className="text5">
						<p className="text-[#484848] mt-5">
							Your complete Medical History is just a click away
						</p>
					</div>
				</RightContainer>

				<LeftContainer image={'/images/doctors.png'} buttonTitle="Book Now">
					<div className="!text-3xl ">
						<h1 className="font-bold">Get Connected with</h1>
						<h1 className="font-bold">
							The <span className="blue"> Best Doctors</span>
						</h1>
					</div>
					<div className="text7">
						<p className="text-[#484848] mt-5">
							Get access to Top Doctors accross 24+ Specialities.
						</p>
					</div>
				</LeftContainer>

				<RightContainer
					id="products"
					buttonTitle="Order Now"
					image={scooterGif.src}
					largeImage
				>
					<div className="!text-3xl mt-16">
						<h1 className="font-bold">
							<span className="blue">We Deliver</span>
						</h1>
						<h1 className="font-bold">healthcare needs to</h1>
						<h1 className="font-bold">
							<span className="blue">your home</span>
						</h1>
					</div>
					<div className="text5">
						<p className="text-[#484848] mt-5 ">
							Health products encompass a wide range of items, including
							supplements, vitamins, personal care products, and medical
							devices. When considering purchasing health products, it's
							important to do your research and always consult with a
							healthcare professional beforehand. Incorporating high-quality
							health products into your routine can be a valuable part of a
							healthy lifestyle.
						</p>
					</div>
				</RightContainer>

				<LeftContainer
					id="healthCheckup"
					image="/images/checkup.png"
					buttonTitle="Know More"
				>
					<div className="!text-3xl ">
						<h1 className="font-bold">
							Preventive <span className="blue"> Health</span>
						</h1>
						<h1 className="font-bold">
							<span className="blue">Checkup</span>
						</h1>
					</div>
					<div className="text7">
						<p className="text-[#484848] mt-5">
							A preventive health package is a set of healthcare services
							and interventions aimed at preventing the onset, progression,
							or recurrence of diseases and conditions. Preventive health
							packages are designed to help people maintain good health and
							detect potential health problems early on when they are most
							treatable.
						</p>

						<Row>
							<Col className="mb-3" xs={12} sm={12} md={8} lg={8}>
								1. Highest Quality
							</Col>
							<Col className="mb-3" xs={12} sm={12} md={8} lg={8}>
								2. Accurate
							</Col>
							<Col className="mb-3" xs={12} sm={12} md={8} lg={8}>
								3. Cost-effective
							</Col>
							<Col className="mb-3" xs={12} sm={12} md={8} lg={8}>
								4. Free Home Blood Collection
							</Col>
							<Col className="mb-3" xs={12} sm={12} md={8} lg={8}>
								5. Free Doctor Consultation
							</Col>
							<Col className="mb-3" xs={12} sm={12} md={8} lg={8}>
								6. Free Dental Checkup
							</Col>
							<Col className="mb-3" xs={12} sm={12} md={8} lg={8}>
								7. Tax Benefit
							</Col>
						</Row>
					</div>
				</LeftContainer>

				<RightContainer
					id="news"
					image="/images/news.png"
					buttonTitle="Know More"
				>
					<div className="!text-3xl mt-16">
						<h1 className="font-bold">
							<span className="blue">Health News</span>
						</h1>
					</div>
					<div className="text5">
						<p className="text-[#484848] mt-5">
							Staying updated with health news on the website of Healthifam,
							a Health card startup, can offer several benefits, including:
							Being informed about the latest health trends and
							developments. Improving your health literacy Understanding the
							benefits of Healthifam Membership card. Access to expert
							opinions and advice Participating in a community of health-
							conscious individuals Know More
						</p>
					</div>
				</RightContainer>
				<LeftContainer
					id="membership"
					image={membershipGif.src}
					buttonTitle="Know More"
				>
					<div className="!text-3xl ">
						<h1 className="font-bold">
							<span className="blue">Membership card</span>
						</h1>
					</div>
					<div className="text7">
						<p className="text-[#484848] mt-5">
							Healthifam Membership card is designed to Protect &amp; Uplift
							your Family Health. Our plan can be customized to your needs
							which also suit your pocket. it can give access to a world of
							top health and wellness services in your vicinity at
							discounted rates. You also avail benefits like EHR, Health
							News etc.
						</p>
					</div>
				</LeftContainer>

				<div className="bg-[url('/images/BG8.png')] py-24 px-6 bg-cover flex bg-no-repeat justify-center  items-center">
					<div className=" text-center">
						<div className="!text-3xl ">
							<h1 className="text-white font-bold">Committed to You</h1>
						</div>
						<div className="text5 flex flex-col items-center">
							<p className="text-white mt-5">
								Our brand makes the life of people easier when it comes to
								contacting different doctors for different problems. A
								Healthcard that acts as a one-stop solution to get direct
								and hassle-free access to all kinds of Health and Wellness
								services. Not just that, Get additional benefits such as
								discounts from 20% to 70% on services like Doctor
								Consultation, Lab tests, Diagnostic services like X-rays,
								CT scans, MRI, etc. along with other Wellness Services
								like Gym, Yoga, and Zumba Keep you fit.
							</p>

							<div className="flex justify-center lg:justify-start">
								<button
									onClick={() => router.push(whatsappLink)}
									className="px-16 py-3 bg-white text-[#56b5ac] !rounded-3xl !text-base"
								>
									Learn More
								</button>
							</div>
						</div>
					</div>
				</div>

				<LeftContainer
					id="aboutUs"
					image="/images/aboutus.png"
					buttonTitle="Read More"
				>
					<div className="!text-3xl ">
						<h1 className="font-bold">About Us</h1>
					</div>
					<div className="text7">
						<p className="text-[#484848] mt-5">
							At Healthifam, our mission is to make healthcare access easy
							and affordable for everyone. We believe that quality
							healthcare is a basic human right, and we are committed to
							providing people with an easy and accessible way to manage
							their health.
						</p>
					</div>
				</LeftContainer>

				<div className="p-7  lg:py-[50px] lg:px-[70px] md:pl-[70px] bg-cover  flex flex-col md:flex-row justify-end items-center">
					<div className="md:w-1/2 flex flex-col justify-end ">
						<div className="!text-3xl">
							<h1 className="font-bold">
								<span className=" text-[#56b5ac]">Launching Soon!!</span>
							</h1>
						</div>
						<div className="text5">
							<p className="!text-[#56b5ac]  font-bold">
								Download the app for android and iOS
							</p>
						</div>
						<div className="flex gap-16 mt-5 justify-around  md:justify-start">
							<div>
								<div className="w-20 h-20 rounded-full bg-[#56B5AC] flex justify-center items-center">
									<img src="/images/ios.png" alt="ios" />
								</div>
								<p className="text-center mt-3">For iOS</p>
							</div>
							<div>
								<div className="w-20 h-20 rounded-full bg-[#56B5AC] flex justify-center items-center">
									<img src="/images/android.png" alt="androd" />
								</div>

								<p className="text-center mt-3">For Android</p>
							</div>
						</div>

						<img
							width="150px"
							className="m-auto md:m-0"
							src="/images/Logo.png"
							alt="healthifam-logo"
						/>
					</div>
					<div className="hidden md:block md:w-1/2 px-3  mt-8 md:mt-0 h-full">
						<img src="/images/Mobiles.png" alt="mobile-image" />
					</div>
				</div>

				<div className=" bg-[#F2F8FF] p-7 lg:py-[50px] lg:px-[70px] bg-cover  flex flex-col md:flex-row  justify-end items-center">
					<div className="lg:pr-10  md:w-[40%]  ">
						<div className="!text-3xl ">
							<h1 className="font-bold ">
								<span className="blue">This is what India's</span>
							</h1>
							<h1 className="font-bold">
								<span className="blue">Best Health Plans</span>
							</h1>
							<h1 className="font-bold">
								<span className="blue">Looks Like..</span>
							</h1>
						</div>
						<p className="font-bold text-lg">
							Healthifam Membership Card Only
						</p>
						<div className="flex gap-1">
							<h1 className="font-bold  text-2xl">
								<span>@</span>
							</h1>
							<h1 className="font-bold  text-2xl">
								<p className="blue m-0">₹ 999 per</p>
								<span>Year</span>
							</h1>
						</div>

						<h1 className="font-bold text-3xl">
							<span className="blue"> For Complete Family</span>
						</h1>

						<div className="flex justify-center lg:justify-start">
							<button
								onClick={() => router.push(whatsappLink)}
								className="px-16 py-3 bg-[#56b5ac] text-white !rounded-3xl !text-base"
							>
								Know more
							</button>
						</div>
					</div>
					<div className=" md:!w-[60%] mt-8 md:mt-0 ">
						<Row>
							{services.map((service) => (
								<Col className="" xs={12} sm={12} md={8} lg={6}>
									<div className="flex flex-col items-center px-1">
										<img
											width={100}
											height={100}
											// className=" object-cover"
											src={service.image}
											alt="services"
										/>

										<p className="text-center text-sm font-medium">
											{service.description}
										</p>
									</div>
								</Col>
							))}
						</Row>
					</div>
				</div>

				<div className="flex flex-col md:flex-row justify-start md:gap-4  md:justify-between p-[40px]  md:p-[40px] lg:p-[70px]  bg-[#F7F7F7]">
					<div className="md:w-1/3 md:mt-10">
						<img src="/images/Logo.png" alt="healthifam-logo" />

						<div className="mt-5 ">
							<p className="text-[#2B3233]">
								Thank you for your interest in Healthifam! We’re here to
								answer any questions you may have about our platform,
								health products, or services.
								<button
									onClick={() => router.push(whatsappLink)}
									className="btn9 text-white !uppercase"
								>
									Contact Us
								</button>
							</p>
						</div>
					</div>
					<div className="text-[#2B3233] mt-5 md:w-1/3 md:mt-0">
						<p className="text-xl font-semibold mb-2">GET IN TOUCH</p>
						<span className="font-medium">Mailing Addresss</span> <br />
						<p className="text-[17px]">
							Healthifam Lifecare and Technology Pvt Ltd,
							<br /> Preshit Bunglow, 274/52, Near St. Mary school,
							<br /> Charkop sector 2, Kandivali West,
							<br /> Mumbai – 400067 <br />
						</p>
						<div className="flex justify-between flex-wrap">
							<div className="flex min-w-[180px]">
								<FiPhoneCall
									style={{
										color: '#56b5ac',
										fontSize: '16px',
										marginTop: '2px',
										marginRight: '4px',
									}}
								/>
								<div>
									Call Us <br />
									<p className="font-medium mb-0">999 777 4204</p>
									<p className="font-medium mt-1">999 777 4205</p>
								</div>
							</div>

							<div className="flex min-w-[180px] mr-5">
								<FiMail
									style={{
										color: '#56b5ac',
										fontSize: '16px',
										marginTop: '2px',
										marginRight: '4px',
									}}
								/>
								<div>
									Email ID <br />
									<p className="font-medium">info@healthifam.com</p>
								</div>
							</div>
						</div>
						<div className="flex md:gap-5 gap-11 ">
							<FaFacebookF style={{color: '#334A4C', fontSize: '20px'}} />
							<FaTwitter style={{color: '#334A4C', fontSize: '20px'}} />
							<FaYoutube style={{color: '#334A4C', fontSize: '18px'}} />
							<FaWifi
								style={{
									color: '#334A4C',
									fontSize: '20px',
									transform: 'rotate(45deg)',
								}}
							/>
						</div>
					</div>
					<div className="mt-5 md:mt-10 md:w-1/3">
						<p className="text-[#2B3233]">
							We value your feedback and are dedicated to providing you with
							the best possible experience. If you have any suggestions,
							comments, or concerns, please don't hesitate to reach out to
							us. Our customer care team is available to assist you from
							9am-9pm IST, Monday to Saturday. Thank you for choosing
							Healthifam!
						</p>
					</div>
				</div>
				<div className=" bg-black h-14 items-center hidden md:flex">
					<a href="#" className="white w-1/2 text-center">
						Copyright © 2023 Healthifam . All rights reserved.
					</a>
					<div className="w-1/2 flex gap-3 ">
						<Link href="/terms-and-conditions">
							<a className="white ">Terms &amp; Conditions</a>
						</Link>
						<span className="white">|</span>
						<Link href="/privacy-policy">
							<a className="white ">Privacy Policy</a>
						</Link>
						<span className="white">|</span>
						<Link href="/refund-policy">
							<a className="white ">Refund Policy</a>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
};

export default HealthVisa;
