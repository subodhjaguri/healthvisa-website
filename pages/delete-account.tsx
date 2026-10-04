import React from 'react';

/**
 * Public account-deletion page — the "delete account URL" for the Google Play
 * Data safety form. Lets someone without the app request deletion by email.
 */
const DeleteAccountPage = () => (
	<div className="p-4 md:p-10 max-w-3xl mx-auto">
		<h1 className="text-center text-3xl font-bold text-[#56b5ac]">
			Delete your HealthiFam account
		</h1>

		<h2 className="text-lg font-bold mt-6">In the app (immediate)</h2>
		<ol style={{marginLeft: '20px', listStyle: 'decimal'}}>
			<li>Open HealthiFam and go to the home page.</li>
			<li>Tap the menu icon in the top header.</li>
			<li>
				Select <strong>“Delete My Account”</strong> and confirm with{' '}
				<strong>“Delete”</strong>.
			</li>
		</ol>

		<h2 className="text-lg font-bold mt-6">Without the app</h2>
		<p>
			Email{' '}
			<a
				className="text-[#56b5ac] underline"
				href="mailto:healthifam@gmail.com?subject=Delete%20my%20HealthiFam%20account"
			>
				healthifam@gmail.com
			</a>{' '}
			with the subject “Delete my HealthiFam account”, your name and the mobile
			number registered on your account. We may call or message that number to
			confirm the request is yours, then delete the account within 30 days and reply
			to confirm.
		</p>

		<h2 className="text-lg font-bold mt-6">What is deleted</h2>
		<p>
			Everything stored for your account: your profile (name, mobile number,
			password), health records and prescriptions with their uploaded files, family
			members, lab and doctor bookings, medicine orders, cart, addresses, reviews,
			membership history and requests you sent us.
		</p>
		<p className="mt-2">
			Nothing is kept. Payments for memberships and services are made offline,
			outside the app, so the app holds no payment records that must be retained.
			Deletion cannot be undone.
		</p>

		<p className="mt-6">
			See also our{' '}
			<a className="text-[#56b5ac] underline" href="/privacy-policy">
				Privacy Policy
			</a>
			.
		</p>
	</div>
);

export default DeleteAccountPage;
