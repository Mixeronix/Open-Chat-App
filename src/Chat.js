import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import app from "./InitFirebase";
import { getFirestore, collection, addDoc, serverTimestamp, orderBy, limit, query, onSnapshot } from "firebase/firestore";

const db = getFirestore(app);

export default function Chat() {
	const [userUid, setUid] = useState();
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);
	useEffect(() => {
		const getUid = async () => {
			setUid(Cookies.get("user"));
		};
		getUid();

		onSnapshot(query(collection(db, "Messages"), orderBy("createdAt", "desc"), limit(50)), (querySnapshot) => {
			const messages = [];
			querySnapshot.forEach((doc) => {
				messages.unshift(doc.data());
			});
			setMessages(messages);
		});
	}, []);

	const addMessage = async () => {
		setMessage("");
		await addDoc(collection(db, "Messages"), {
			author: userUid,
			createdAt: serverTimestamp(),
			text: message,
		});
	};

	return (
		<div className="w-full h-screen ">
			<header className="border-b-2 bg-accent border-black py-4 items-center px-10 flex sticky top-0">
				<span className="text-4xl text-gray-100 font-bold text-center m-auto">Open Chat</span>
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

			<main className="px-7 pb-10 bg-gray min-h-full flex flex-col">
				{messages.map((msg, index) => (
					<Message
						sameAuthor={index !== 0 ? messages[index].author === messages[index - 1].author : false}
						owns={msg.author === userUid}
						msg={msg}
						key={msg.text + msg.author + Math.random()}
					/>
				))}
			</main>

			<form className="sticky bottom-0 flex flex-row" onSubmit={() => addMessage()} target="hiddenFrame">
				<input className="text-lg px-6 py-3 grow bg-gray-200" maxLength={1000} value={message} onChange={(e) => setMessage(e.target.value)} />
				<button type="submit" className={`${!message ? "bg-gray-500" : "bg-accent"} px-5 py-2 transition-all`} disabled={!message}>
					<svg xmlns="http://www.w3.org/2000/svg" height="40" width="40" fill="white">
						<path d="M4.75 33.583V23.417L17.958 20 4.75 16.5V6.417L37 20Z" />
					</svg>
				</button>
			</form>
			<iframe name="hiddenFrame" width="0" height="0" border="0" title="Form hidden frame"></iframe>
		</div>
	);
}

function Message({ owns, msg, sameAuthor }) {
	if (sameAuthor) {
		return (
			<div className={`flex ${owns ? "self-end flex-row-reverse" : "self-start flex-row"} ${sameAuthor ? "mt-1" : "mt-7"}`}>
				<div className="h-12 p-3 w-12 inline-block"> </div>
				<span className={`p-3 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl text-white bg-accent mx-3 ${owns ? "rounded-right" : "rounded-left"}`}>{msg.text}</span>
			</div>
		);
	} else {
		const timeConverter = (UNIX_timestamp) => {
			var a = new Date(UNIX_timestamp * 1000);
			var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			var year = a.getFullYear();
			var month = months[a.getMonth()];
			var date = a.getDate();
			var hour = a.getHours();
			var min = a.getMinutes();
			var sec = a.getSeconds();
			var time = hour + ":" + min + ":" + sec + " | " + date + " " + month + " " + year;
			return time;
		};
		return (
			<div className={`flex ${owns ? "self-end flex-row-reverse" : "self-start flex-row"} ${sameAuthor ? "mt-1" : "mt-7"}`}>
				<img className="h-12 w-12 p-3 rounded-xl bg-gray-200" alt="Users avatar" src={`https://api.dicebear.com/5.x/identicon/svg?seed=${msg.author}`} />

				<div className="flex flex-col relative ">
					<span className={`text-gray-300 px-3 pb-1 whitespace-nowrap text-xs opacity-70  absolute -top-5 ${owns ? "self-end" : "self-start"} `}>
						{timeConverter(msg.createdAt.seconds)}
					</span>
					<span className={`p-3  max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl text-white bg-accent mx-3 ${owns ? "rounded-right" : "rounded-left"}`}>
						{msg.text}
					</span>
				</div>
			</div>
		);
	}
}
