import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function Chat() {
	var [userUid, setUid] = useState();
	useEffect(() => {
		const getUid = async () => {
			setUid(Cookies.get("user"));
		};
		getUid();
	}, []);
	return (
		<div className="bg-gray w-full h-screen ">
			<header className="border-b-2 bg-accent border-black py-5 items-center px-10 flex">
				<span className="text-5xl text-gray-100 font-bold text-center m-auto">Open Chat</span>
				<button
					onClick={() => {
						Cookies.remove("user");
						window.location.reload(false);
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" height="48" width="48" fill="white">
						<path d="M8.95 43.25q-1.95 0-3.35-1.375Q4.2 40.5 4.2 38.55V9.45q0-1.95 1.4-3.35Q7 4.7 8.95 4.7h14.9v4.75H8.95v29.1h14.9v4.7Zm24.4-8.7-3.4-3.3 4.9-4.9H18.1v-4.7h16.65l-4.9-4.9 3.4-3.3 10.55 10.6Z" />
					</svg>
				</button>
			</header>

			<main id="mainChat"></main>
		</div>
	);
}
