import React, { useState, useEffect } from "react";
import Input from "../../components/Input";

import profile2 from "../../assets/profile2.svg";
import Button from "../../components/Button";
const Dashboard = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user:detail"))
  );
  console.log("user->", user);

  const [conversations, setConversations] = useState([]);

  const contacts = [
    { name: "John", status: "Online", img: profile2 },
    { name: "Mary", status: "Online", img: profile2 },
    { name: "Alex", status: "Online", img: profile2 },
    { name: "Adam", status: "Online", img: profile2 },
    { name: "Larry", status: "Online", img: profile2 },
    { name: "Max", status: "Online", img: profile2 },
  ];

  const fetchConversations = async () => {
    const loggedInUser = JSON.parse(localStorage.getItem("user:detail"));
    const res = await fetch(
      `http://localhost:5000/api/conversations/${loggedInUser?.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const resData = await res.json();
    setConversations(resData);
    console.log("Conversation array", conversations);
  };

  useEffect(() => {
    fetchConversations();
  }, []);
  return (
    <div className="w-screen flex bg-white">
      {/* LEFT BAR STARTS */}
      <div className="w-[25%] border h-screen bg-blue-100">
        <div className="flex justify-center items-center mt-2">
          <img src={profile2} alt="" height={50} width={50} />
          <div className="m-3">
            <h3 className="text-2xl font-semibold">{user?.fullName}</h3>
            <p className="text-lg font-light">My Ac</p>
          </div>
        </div>
        <hr className="font-bold text-2xl" />
        <div className="ml-2">
          <div className="">Messages</div>
          <div>
            {conversations.map(({ conversationid, user }, i) => {
              return (
                <div className="flex items-center mt-2 " key={i}>
                  <div className="cursor-pointer flex items-center" >
                    <div>
                      <img src={profile2} alt="" height={50} width={50} />
                    </div>
                    <div className="ml-6">
                      <h3 className="text-xl font-semibold">
                        {user?.fullName}
                      </h3>
                      <p className="text-sm font-light">{user?.email}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* LEFT BAR ENDS */}

      {/* MIDDLE/ MAIN SECTION STARTS */}
      <div className="w-[50%] h-screen flex flex-col items-center">
        <div className="w-[75%] bg-opacity-30 h-[80px] rounded-full m-2 bg-slate-400">
          <div className="p-2 m-2 flex items-center justify-between ">
            <div className="flex items-center ">
              <img src={profile2} alt="" height={50} width={50} />
              <div className="ml-2">
                <h3 className="text-lg font-semibold">Ryle Phoenix</h3>
                <p className="font-light text-sm">Online</p>
              </div>
            </div>
            <div className="flex items-center">
              <p className="text-2xl ml-5 cursor-pointer">💬</p>
              <p className="text-2xl ml-5 cursor-pointer">📞</p>
              <p className="text-2xl ml-5 cursor-pointer">🎥</p>
            </div>
          </div>
        </div>
        <div className="w-full  overflow-x-hidden overflow-y-scroll">
          <hr className="font-bold text-2xl" />
          <div className="h-[1000px] px-10 py-4">
            <div className="p-4 max-w-[300px] bg-slate-300 rounded-b-xl rounded-tr-xl text-black">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio,
              quam?lorem50d
            </div>
            <div className="p-4 max-w-[300px] bg-blue-700 rounded-b-xl rounded-tl-xl ml-auto text-white">
              Lorem ipsum dolor sit amet consectetur adipisicing elit?
            </div>
            <div className="p-4 max-w-[300px]  bg-slate-300 rounded-b-xl rounded-tr-xl text-black">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio,
              quam?lorem50d
            </div>
            <div className="p-4 max-w-[300px] bg-blue-700 rounded-b-xl rounded-tl-xl ml-auto text-white">
              Lorem ipsum dolor sit amet consectetur adipisicing elit?
            </div>
            <div className="p-4 max-w-[300px]  bg-slate-300 rounded-b-xl rounded-tr-xl text-black">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio,
            </div>
            <div className="p-4 max-w-[300px] bg-blue-700 rounded-b-xl rounded-tl-xl ml-auto text-white">
              Lorem ipsum dolor sit amet consectetur adipisicing elit
            </div>
          </div>
        </div>

        <div className="p-14 pt-3 pb-3 w-full flex justify-center shadow-lg">
          <Input
            placeholder="Type a message..."
            className="w-[75%]"
            inputClassName="p-4 border-0 shadow-md rounded-full bg-light focus: ring-0 focus:border-0 outline-none"
          />
          <Button
            label="Send"
            type="button"
            className="ml-6 bg-lime-500 text-black font-semibold"
          />
          <p className="font-semibold text-5xl ml-3 cursor-pointer">📎</p>
        </div>
      </div>

      {/* MIDDLE/ MAIN SECTION STARTS */}

      <div className="w-[25%]  h-screen bg-blue-100"></div>
    </div>
  );
};

export default Dashboard;
