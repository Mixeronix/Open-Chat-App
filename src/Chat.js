import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import app from "./InitFirebase";
import { getFirestore, collection, addDoc, serverTimestamp, orderBy, limit, query, onSnapshot, deleteDoc, doc } from "firebase/firestore";

const db = getFirestore(app);

export default function Chat() {
	const scroll = useRef(null);
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
				messages.unshift({ data: doc.data(), id: doc.id });
			});
			scroll.current.scrollIntoView({ behavior: "smooth" });
			setMessages(messages);
		});
	}, []);

	const addMessage = async () => {
		scroll.current.scrollIntoView({ behavior: "smooth" });

		if (message.trim() !== "") {
			setMessage("");
			await addDoc(collection(db, "Messages"), {
				author: userUid,
				createdAt: serverTimestamp(),
				text: message.trim(),
			});
		}
	};

	const newLine = (index) => {
		if (index === 0) return true;
		const time = () => {
			const time = new Date((messages[index].data.createdAt.seconds - messages[index - 1].data.createdAt.seconds) * 1000);

			return time.getMinutes() > 10;
		};

		if (messages[index].data.author !== messages[index - 1].data.author || (messages[index].data.createdAt != null ? time() : false)) return true;
		else return false;
	};

	return (
		<div className="w-full h-screen ">
			<header className="border-b-2 bg-accent border-black py-1 md:py-3 lg:py-4 items-center px-4 md:px-7 lg:px-10 flex fixed left-0 right-0 z-50 top-0">
				<span className="text-2xl md:text-3xl lg:text-4xl text-gray-100 font-bold text-center m-auto">Open Chat</span>
				<button
					onClick={() => {
						Cookies.remove("user");
						window.location.reload(false);
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" height="48" width="48" fill="white" className="scale-50  lg:scale-75 xl:scale-100">
						<path d="M8.95 43.25q-1.95 0-3.35-1.375Q4.2 40.5 4.2 38.55V9.45q0-1.95 1.4-3.35Q7 4.7 8.95 4.7h14.9v4.75H8.95v29.1h14.9v4.7Zm24.4-8.7-3.4-3.3 4.9-4.9H18.1v-4.7h16.65l-4.9-4.9 3.4-3.3 10.55 10.6Z" />
					</svg>
				</button>
			</header>

			<main className="px-3 md:px-6 lg:px-7 py-14 md:py-20 bg-gray min-h-full flex flex-col">
				{messages.map((msg, index) => (
					<Message newLine={newLine(index)} owns={msg.data.author === userUid} msg={msg.data} id={msg.id} key={msg.data.text + msg.author + Math.random()} />
				))}
				<div ref={scroll}></div>
			</main>

			<form className="fixed left-0 right-0 z-50 bottom-0 flex flex-row" onSubmit={() => addMessage()} target="hiddenFrame">
				<input
					className=" px-3 md:px-5 lg:px-6 py-4 h-fit grow bg-gray-200 text-sm lg:text-lg"
					maxLength={1000}
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<button type="submit" className={`${!message.trim() ? "bg-gray-500" : "bg-accent"} transition-all px-3  py-1 md:px-4`}>
					<svg xmlns="http://www.w3.org/2000/svg" height="40" width="40" fill="white" className="scale-75 md:scale-75">
						<path d="M4.75 33.583V23.417L17.958 20 4.75 16.5V6.417L37 20Z" />
					</svg>
				</button>
			</form>
			<iframe name="hiddenFrame" width="0" height="0" border="0" title="Form hidden frame"></iframe>
		</div>
	);
}

function Message({ owns, msg, newLine, id }) {
	const deleteMessage = async () => {
		await deleteDoc(doc(db, "Messages", id));
	};

	const timeConverter = (UNIX_timestamp) => {
		var a = new Date(UNIX_timestamp * 1000);
		var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		var year = a.getFullYear();
		var month = months[a.getMonth()];
		var date = a.getDate();
		var hour = a.getHours();

		var min = a.getMinutes();
		var time = (hour < 10 ? "0" + hour.toString() : hour) + ":" + (min < 10 ? "0" + min.toString() : min) + " | " + date + " " + month + " " + year;
		return time;
	};

	if (!newLine) {
		return (
			<div className={`message flex ${owns ? "self-end flex-row-reverse" : "self-start flex-row"} mt-1 relative`}>
				<div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 p-1 sm:p-2 md:p-3 inline-block"></div>

				<span
					className={`p-2 sm:p-3 break-words max-w-xxs sm:max-w-md md:max-w-lg lg:max-w-xl text-white bg-accent mx-2 md:mx-3 text-xs sm:text-sm lg:text-base ${
						owns ? "rounded-right" : "rounded-left"
					}`}
				>
					{msg.text}
				</span>

				{owns ? (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="48"
						width="48"
						className="delete scale-50 absolute top-0 right-0 "
						fill="red"
						onClick={() => deleteMessage()}
					>
						<path d="M13.05 42q-1.2 0-2.1-.9-.9-.9-.9-2.1V10.5H8v-3h9.4V6h13.2v1.5H40v3h-2.05V39q0 1.2-.9 2.1-.9.9-2.1.9Zm5.3-7.3h3V14.75h-3Zm8.3 0h3V14.75h-3Z" />
					</svg>
				) : null}
			</div>
		);
	} else {
		return (
			<div className={`message flex ${owns ? "self-end flex-row-reverse" : "self-start flex-row"} mt-10 relative`}>
				<img
					className={`${owns ? "user-avatar" : null} h-8 sm:h-10 lg:h-12 p-1 sm:p-2 md:p-3 rounded-xl bg-gray-200`}
					alt="Users avatar"
					src={`https://api.dicebear.com/5.x/identicon/svg?seed=${msg.author}`}
				/>

				<div className="flex flex-col relative">
					<span
						className={`text-xxs h-0 md:text-xs text-gray-300 px-3 pb-1 whitespace-nowrap opacity-50 sm:opacity-70 absolute -top-3 md:-top-5 ${
							owns ? "self-end" : "self-start"
						} `}
					>
						{timeConverter(msg.createdAt.seconds)}
					</span>
					<span
						className={`p-2 sm:p-3 break-words max-w-xxs sm:max-w-md md:max-w-lg lg:max-w-xl text-white bg-accent mx-2 md:mx-3 text-xs sm:text-sm lg:text-base ${
							owns ? "rounded-right" : "rounded-left"
						}`}
					>
						{msg.text}
					</span>
				</div>
				{owns ? (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="48"
						width="48"
						className="delete scale-50 absolute top-0 right-0 p-1 delay-200"
						fill="red"
						onClick={() => deleteMessage()}
					>
						<path d="M13.05 42q-1.2 0-2.1-.9-.9-.9-.9-2.1V10.5H8v-3h9.4V6h13.2v1.5H40v3h-2.05V39q0 1.2-.9 2.1-.9.9-2.1.9Zm5.3-7.3h3V14.75h-3Zm8.3 0h3V14.75h-3Z" />
					</svg>
				) : null}
			</div>
		);
	}
}
